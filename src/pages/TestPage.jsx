import { useState } from "react";
import "./TestPage.css";
import { attack } from "../game/combat";
import {
  createPlayer,
  createTestThief,
  createGoblin,
} from "../game/characters";
import { GAME_STATES } from "../game/gameState";
import { rooms } from "../game/rooms";
import { move } from "../game/movement";
import { createWorldState } from "../game/worldState";
import { resolveEvents } from "../game/eventResolver";
import RoomPanel from "../components/RoomPanel";
import LatestStep from "../components/LatestStep";
import StepLog from "../components/StepLog";
import DebugPanel from "../components/DebugPanel";
import DungeonMap from "../components/DungeonMap";
import NarrationPanel from "../components/NarrationPanel";
import { rollFormula, rollPercentile } from "../game/dice";
import {
  canPickLock,
  getContainerKey,
  getLockAttemptKey,
  getLockKey,
  isLocked,
  isOpen,
} from "../game/locks";
import { getTrapKey } from "../game/traps";
import { traverseSecretDoor, searchForSecretDoor } from "../game/secretDoors";
import { resolveSavingThrow } from "../game/savingThrows";

// Test-harness character switch. Change ACTIVE_CHARACTER to exercise the other
// class: the thief is the default because lock-picking is the mechanic most
// often under test.
const CHARACTERS = {
  fighter: createPlayer,
  thief: createTestThief,
};

const ACTIVE_CHARACTER = "thief";

const createCharacter = CHARACTERS[ACTIVE_CHARACTER];

/**
 * The development / testing UI for the B1 adventure.
 *
 * docs/01_PRODUCT_DIRECTION.md is explicit that this is a temporary harness for
 * exercising mechanics as they are implemented — not the target presentation layer.
 * It lives on its own page so the eventual player-facing UI can be built alongside it
 * rather than by dismantling it.
 */
export default function TestPage() {
  const [player, setPlayer] = useState(createCharacter());
  const [enemy, setEnemy] = useState(createGoblin());
  const [steps, setSteps] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.EXPLORING);
  const [currentRoom, setCurrentRoom] = useState(rooms.entrance);
  const [worldState, setWorldState] = useState(createWorldState());
  const [visitedRoomIds, setVisitedRoomIds] = useState([rooms.entrance.id]);
  // The visited set above is deduplicated, which is right for pins but loses
  // backtracking. The map trail needs the rooms actually walked, in order.
  const [pathRoomIds, setPathRoomIds] = useState([rooms.entrance.id]);
  const [mapOpen, setMapOpen] = useState(true);

  // Map calibration picks live here, not inside DungeonMap, so closing the
  // floating panel does not throw away a calibration pass.
  const [mapPicks, setMapPicks] = useState({});

  const latestStep = steps[steps.length - 1];

  function addStep(title, messages, image = null) {
    const messageList = Array.isArray(messages) ? messages : [messages];

    setSteps((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title,
        messages: messageList.filter(Boolean),
        image,
      },
    ]);
  }

  function handleAttack() {
    if (gameState !== GAME_STATES.COMBAT) return;

    const newLog = [];

    const updatedPlayer = { ...player };
    const updatedEnemy = { ...enemy };

    // Player attacks
    newLog.push(...attack(updatedPlayer, updatedEnemy));

    // Did the player defeat the enemy?
    if (updatedEnemy.hp <= 0) {
      newLog.push(`${updatedEnemy.name} has been defeated!`);
      newLog.push("You may continue exploring.");

      setWorldState((prev) => ({
        ...prev,
        completedEncounters: prev.completedEncounters.includes(currentRoom.id)
          ? prev.completedEncounters
          : [...prev.completedEncounters, currentRoom.id],
      }));

      setGameState(GAME_STATES.EXPLORING);
    } else {
      // Enemy gets its turn
      newLog.push(...attack(updatedEnemy, updatedPlayer));

      // Did the enemy defeat the player?
      if (updatedPlayer.hp <= 0) {
        newLog.push(`${updatedPlayer.name} has been defeated!`);
        setGameState(GAME_STATES.GAME_OVER);
      }
    }

    setPlayer(updatedPlayer);
    setEnemy(updatedEnemy);

    addStep(`Combat: Attack ${updatedEnemy.name}`, newLog);
  }

  function handleNewGame() {
    setPlayer(createCharacter());
    setEnemy(createGoblin());
    setSteps([]);
    setCurrentRoom(rooms.entrance);
    setWorldState(createWorldState());
    setVisitedRoomIds([rooms.entrance.id]);
    setPathRoomIds([rooms.entrance.id]);
    setGameState(GAME_STATES.EXPLORING);
  }

  function handleExamine() {
    if (gameState !== GAME_STATES.EXPLORING) return;

    addStep(`Examine: ${currentRoom.name}`, [
      `You examine ${currentRoom.name}.`,
      currentRoom.examine,
    ]);
  }

  function handleExamineFeature(feature) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const featureKey = `${currentRoom.id}:${feature.id}`;

    let description = feature.description;

    // First apply any description changes caused by completed interactions.
    for (const interaction of feature.interactions ?? []) {
      const interactionKey = `${currentRoom.id}:${feature.id}:${interaction.id}`;

      if (
        worldState.completedInteractions.includes(interactionKey) &&
        interaction.afterDescription
      ) {
        description = interaction.afterDescription;
      }
    }

    // If this feature contains a secret door that has already been discovered,
    // describe the known door rather than pretending the wall is still ordinary.
    if (
      feature.secretDoor &&
      worldState.discoveredSecretDoors.includes(feature.secretDoor.id) &&
      feature.secretDoor.discoveredDescription
    ) {
      description = feature.secretDoor.discoveredDescription;
    }

    // Then let the feature's CURRENT container/lock state win.
    if (feature.container) {
      const open = isOpen({
        worldState,
        roomId: currentRoom.id,
        featureId: feature.id,
        container: feature.container,
      });

      const locked = isLocked({
        worldState,
        roomId: currentRoom.id,
        featureId: feature.id,
        lock: feature.lock,
      });

      if (open && feature.openDescription) {
        description = feature.openDescription;
      } else if (!locked && feature.unlockedDescription) {
        description = feature.unlockedDescription;
      }
    }

    addStep(`Examine: ${feature.name}`, [
      `You examine the ${feature.name.toLowerCase()}.`,
      description,
    ]);

    setWorldState((prev) => ({
      ...prev,

      examinedFeatures: prev.examinedFeatures.includes(featureKey)
        ? prev.examinedFeatures
        : [...prev.examinedFeatures, featureKey],
    }));
  }

  function handleSearchFeature(feature) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    if (!feature.searchable || !feature.search) return;

    const featureKey = `${currentRoom.id}:${feature.id}`;
    const searchResults = feature.searchResults ?? [];

    const existingIds = new Set(
      worldState.discoveredItems.map((item) => item.id),
    );

    const newlyDiscovered = searchResults
      .filter((item) => !existingIds.has(item.id))
      .map((item) => ({
        ...item,
        roomId: currentRoom.id,
        featureId: feature.id,
      }));

    const messages = [
      `You search the ${feature.name.toLowerCase()}.`,
      feature.search,
    ];

    let discoveredSecretDoorId = null;

    if (
      feature.secretDoor &&
      !worldState.discoveredSecretDoors.includes(feature.secretDoor.id)
    ) {
      const result = searchForSecretDoor({
        player,
        secretDoor: feature.secretDoor,
      });

      if (result.success) {
        discoveredSecretDoorId = feature.secretDoor.id;

        messages.push(
          feature.secretDoor.foundDescription ??
            "You discover a concealed secret door.",
        );
      }
    }

    if (newlyDiscovered.length > 0) {
      messages.push(
        `You discover: ${newlyDiscovered.map((item) => item.name).join(", ")}.`,
      );
    }

    if (newlyDiscovered.length === 0 && !discoveredSecretDoorId) {
      messages.push("You find nothing new.");
    }

    addStep(`Search: ${feature.name}`, messages);

    setWorldState((prev) => ({
      ...prev,

      searchedFeatures: prev.searchedFeatures.includes(featureKey)
        ? prev.searchedFeatures
        : [...prev.searchedFeatures, featureKey],

      discoveredItems: [...prev.discoveredItems, ...newlyDiscovered],

      discoveredSecretDoors:
        discoveredSecretDoorId &&
        !prev.discoveredSecretDoors.includes(discoveredSecretDoorId)
          ? [...prev.discoveredSecretDoors, discoveredSecretDoorId]
          : prev.discoveredSecretDoors,
    }));
  }

  function handleTakeItem(item) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const alreadyCollected = worldState.collectedItems.some(
      (collectedItem) => collectedItem.id === item.id,
    );

    if (alreadyCollected) {
      addStep(`Take: ${item.name}`, [
        `You have already taken the ${item.name.toLowerCase()}.`,
      ]);

      return;
    }

    setWorldState((prev) => ({
      ...prev,

      collectedItems: [
        ...prev.collectedItems,
        {
          ...item,
          collectedFrom: currentRoom.id,
        },
      ],
    }));

    addStep(`Take: ${item.name}`, [
      `You take the ${item.name.toLowerCase()}.`,
      `${item.name} has been added to your collected items.`,
    ]);
  }

  function handleInteraction(feature, interaction) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const interactionKey = `${currentRoom.id}:${feature.id}:${interaction.id}`;

    if (worldState.completedInteractions.includes(interactionKey)) {
      return;
    }

    const discoveredSecret = interaction.discoveredSecret
      ? {
          ...interaction.discoveredSecret,
          roomId: currentRoom.id,
          featureId: feature.id,
        }
      : null;

    const discoveredItem = interaction.discoveredItem
      ? {
          ...interaction.discoveredItem,
          roomId: currentRoom.id,
          featureId: feature.id,
        }
      : null;

    const messages = [interaction.message];

    let damage = 0;
    let activeEffect = null;
    let saveResult = null;

    if (interaction.effects?.savingThrow) {
      const savingThrow = interaction.effects.savingThrow;

      saveResult = resolveSavingThrow({
        character: player,
        type: savingThrow.type,
      });

      if (!saveResult.configured) {
        addStep(interaction.name, [
          interaction.message,
          `A save vs. ${savingThrow.label ?? savingThrow.type} is required, but this character does not yet have a saving-throw target configured.`,
        ]);

        return;
      }

      messages.push(
        `Save vs. ${savingThrow.label ?? savingThrow.type}: ${saveResult.roll} vs. ${saveResult.target} — ${
          saveResult.success ? "success" : "failure"
        }.`,
      );
    }

    if (interaction.effects?.damage) {
      damage = rollFormula(interaction.effects.damage);

      messages.push(
        `You take ${damage} point${damage === 1 ? "" : "s"} of damage.`,
      );
    }

    if (
      interaction.effects?.condition &&
      (!interaction.effects?.savingThrow || !saveResult?.success)
    ) {
      const condition = interaction.effects.condition;
      const duration = rollFormula(condition.duration);
      const durationUnit = condition.durationUnit ?? "turns";

      activeEffect = {
        ...condition,
        durationUnit,
        roomId: currentRoom.id,
        featureId: feature.id,

        ...(durationUnit === "rounds"
          ? { durationRounds: duration }
          : { durationTurns: duration }),
      };

      messages.push(
        `${activeEffect.name}: ${activeEffect.description} (${duration} ${durationUnit}).`,
      );
    }

    if (discoveredSecret) {
      messages.push(discoveredSecret.description);
    }

    if (discoveredItem) {
      messages.push(
        `You also recover the ${discoveredItem.name.toLowerCase()}.`,
      );
    }

    addStep(interaction.name, messages);

    if (damage > 0) {
      const updatedPlayer = {
        ...player,
        hp: Math.max(0, player.hp - damage),
      };

      setPlayer(updatedPlayer);

      if (updatedPlayer.hp <= 0) {
        setGameState(GAME_STATES.GAME_OVER);
        messages.push(`${player.name} has been defeated!`);
      }
    }

    setWorldState((prev) => ({
      ...prev,

      completedInteractions: prev.completedInteractions.includes(interactionKey)
        ? prev.completedInteractions
        : [...prev.completedInteractions, interactionKey],

      discoveredSecrets:
        discoveredSecret &&
        !prev.discoveredSecrets.some(
          (secret) => secret.id === discoveredSecret.id,
        )
          ? [...prev.discoveredSecrets, discoveredSecret]
          : prev.discoveredSecrets,

      discoveredItems:
        discoveredItem &&
        !prev.discoveredItems.some((item) => item.id === discoveredItem.id)
          ? [...prev.discoveredItems, discoveredItem]
          : prev.discoveredItems,

      activeEffects:
        activeEffect &&
        !prev.activeEffects.some(
          (effect) =>
            effect.id === activeEffect.id &&
            effect.roomId === activeEffect.roomId &&
            effect.featureId === activeEffect.featureId,
        )
          ? [...prev.activeEffects, activeEffect]
          : prev.activeEffects,
    }));
  }

  function handleOpenContainer(feature) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const container = feature.container;

    if (!container) return;

    // Once open, using Open again should not re-grasp
    // the trapped handle.
    const alreadyOpen = isOpen({
      worldState,
      roomId: currentRoom.id,
      featureId: feature.id,
      container,
    });

    if (alreadyOpen) {
      addStep(`Open: ${container.name}`, [
        `The ${container.name.toLowerCase()} is already open.`,
      ]);

      return;
    }

    const messages = [];

    let damage = 0;
    let activeEffect = null;
    let trapKey = null;

    // Opening this container requires grasping its handle,
    // which is what triggers Zelligar's trap.
    if (feature.trap) {
      const trap = feature.trap;

      trapKey = getTrapKey(currentRoom.id, feature.id, trap.id);

      messages.push(trap.message);

      if (trap.damage) {
        damage = rollFormula(trap.damage);

        messages.push(
          `You take ${damage} point${damage === 1 ? "" : "s"} of damage.`,
        );
      }

      if (trap.condition) {
        const durationTurns = rollFormula(trap.condition.duration);

        activeEffect = {
          ...trap.condition,
          durationTurns,
          roomId: currentRoom.id,
          featureId: feature.id,
          trapId: trap.id,
        };

        messages.push(
          `${activeEffect.name}: ${activeEffect.description} (${durationTurns} turns).`,
        );
      }
    }

    // The handle has now been grasped. Check whether
    // the lock actually permits the drawer to open.
    const locked = isLocked({
      worldState,
      roomId: currentRoom.id,
      featureId: feature.id,
      lock: feature.lock,
    });

    let containerKey = null;

    if (locked) {
      messages.push(
        feature.lock?.lockedMessage ??
          `The ${container.name.toLowerCase()} is locked.`,
      );
    } else {
      containerKey = getContainerKey(currentRoom.id, feature.id, container.id);

      messages.push(
        container.openMessage ??
          `You open the ${container.name.toLowerCase()}.`,
      );
    }

    if (damage > 0) {
      const updatedPlayer = {
        ...player,
        hp: Math.max(0, player.hp - damage),
      };

      setPlayer(updatedPlayer);

      if (updatedPlayer.hp <= 0) {
        setGameState(GAME_STATES.GAME_OVER);
        messages.push(`${player.name} has been defeated!`);
      }
    }

    setWorldState((prev) => {
      let activeEffects = prev.activeEffects;

      if (activeEffect) {
        // Re-triggering the same effect refreshes its duration
        // rather than creating duplicate entries.
        activeEffects = [
          ...prev.activeEffects.filter(
            (effect) =>
              !(
                effect.id === activeEffect.id &&
                effect.roomId === activeEffect.roomId &&
                effect.featureId === activeEffect.featureId
              ),
          ),
          activeEffect,
        ];
      }

      return {
        ...prev,

        triggeredTraps:
          trapKey && !prev.triggeredTraps.includes(trapKey)
            ? [...prev.triggeredTraps, trapKey]
            : prev.triggeredTraps,

        activeEffects,

        openedContainers:
          containerKey && !prev.openedContainers.includes(containerKey)
            ? [...prev.openedContainers, containerKey]
            : prev.openedContainers,
      };
    });

    addStep(`Open: ${container.name}`, messages);
  }

  function handlePickLock(feature) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const lock = feature.lock;

    if (!lock) return;

    const allowed = canPickLock({
      player,
      worldState,
      roomId: currentRoom.id,
      featureId: feature.id,
      lock,
    });

    if (!allowed) {
      return;
    }

    const chance = player.thiefSkills.openLocks;
    const roll = rollPercentile();
    const success = roll <= chance;

    const lockKey = getLockKey(currentRoom.id, feature.id, lock.id);

    const attemptKey = getLockAttemptKey({
      player,
      roomId: currentRoom.id,
      featureId: feature.id,
      lock,
    });

    setWorldState((prev) => ({
      ...prev,

      attemptedLocks: prev.attemptedLocks.includes(attemptKey)
        ? prev.attemptedLocks
        : [...prev.attemptedLocks, attemptKey],

      unlockedLocks:
        success && !prev.unlockedLocks.includes(lockKey)
          ? [...prev.unlockedLocks, lockKey]
          : prev.unlockedLocks,
    }));

    addStep(`Pick Lock: ${feature.name}`, [
      `You work on the lock with your thieves' tools.`,
      `Open Locks: ${roll}% vs. ${chance}% — ${
        success ? "SUCCESS" : "FAILURE"
      }.`,
      success ? "The lock clicks open." : "You are unable to open the lock.",
    ]);
  }

  function handleMove(direction) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const result = move(currentRoom, direction, rooms);

    if (!result.success) {
      addStep(`Move: ${direction}`, result.message);
      return;
    }

    setCurrentRoom(result.room);

    setVisitedRoomIds((prev) =>
      prev.includes(result.room.id) ? prev : [...prev, result.room.id],
    );

    setPathRoomIds((prev) => [...prev, result.room.id]);

    const messages = [result.message];

    const eventResult = resolveEvents(result.room.events?.onEnter, worldState);

    if (eventResult.messages.length > 0) {
      messages.push(...eventResult.messages);

      setWorldState((prev) => ({
        ...prev,
        triggeredEvents: eventResult.triggeredEvents,
      }));
    }

    addStep(
      `Move ${direction}: ${result.room.name}`,
      messages,
      result.room.image ?? null,
    );
  }

  function handleUseSecretDoor(feature) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const result = traverseSecretDoor({
      worldState,
      secretDoor: feature.secretDoor,
      rooms,
    });

    if (!result.success) {
      addStep("Use Secret Door", result.message);
      return;
    }

    setCurrentRoom(result.room);

    setVisitedRoomIds((prev) =>
      prev.includes(result.room.id) ? prev : [...prev, result.room.id],
    );

    setPathRoomIds((prev) => [...prev, result.room.id]);

    const messages = [result.message];

    const eventResult = resolveEvents(result.room.events?.onEnter, worldState);

    if (eventResult.messages.length > 0) {
      messages.push(...eventResult.messages);

      setWorldState((prev) => ({
        ...prev,
        triggeredEvents: eventResult.triggeredEvents,
      }));
    }

    addStep(
      `Secret Door: ${result.room.name}`,
      messages,
      result.room.image ?? null,
    );
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Dungeon Module B1</h1>
          <h1>In Search of the Unknown</h1>

          <div className="status-row">
            <span className="status">
              State: <strong>{gameState}</strong>
            </span>

            <span className="status">
              Player HP: <strong>{player.hp}</strong>
            </span>

            <span className="status">
              Step: <strong>{steps.length}</strong>
            </span>
          </div>

          {worldState.collectedItems.length > 0 && (
            <p className="carrying">
              <strong>Carrying:</strong>{" "}
              {worldState.collectedItems.map((item) => item.name).join(", ")}
            </p>
          )}
        </div>

        <div className="header-actions">
          <button onClick={() => setMapOpen((open) => !open)}>
            {mapOpen ? "Hide Map" : "Show Map"}
          </button>

          <button onClick={handleNewGame}>New Game</button>
        </div>
      </header>

      <div className="layout">
        <RoomPanel
          room={currentRoom}
          gameState={gameState}
          worldState={worldState}
          player={player}
          enemy={enemy}
          onExamineRoom={handleExamine}
          onExamineFeature={handleExamineFeature}
          onSearchFeature={handleSearchFeature}
          onInteraction={handleInteraction}
          onOpenContainer={handleOpenContainer}
          onPickLock={handlePickLock}
          onUseSecretDoor={handleUseSecretDoor}
          onMove={handleMove}
          onTakeItem={handleTakeItem}
          onAttack={handleAttack}
        />

        <LatestStep step={latestStep} room={currentRoom} />
      </div>

      <StepLog steps={steps} />

      <NarrationPanel />

      <DebugPanel worldState={worldState} />

      {mapOpen && (
        <DungeonMap
          rooms={rooms}
          currentRoomId={currentRoom.id}
          visitedRoomIds={visitedRoomIds}
          pathRoomIds={pathRoomIds}
          picks={mapPicks}
          onPicksChange={setMapPicks}
          onClose={() => setMapOpen(false)}
        />
      )}
    </main>
  );
}
