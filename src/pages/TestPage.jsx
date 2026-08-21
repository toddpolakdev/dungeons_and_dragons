import { useState } from "react";

import "./TestPage.css";

import { attack } from "../game/combat";
import { createPlayer, createGoblin } from "../game/characters";
import { GAME_STATES } from "../game/gameState";
import { rooms } from "../game/rooms";
import { move } from "../game/movement";
import { createWorldState } from "../game/worldState";
import { resolveEvents } from "../game/eventResolver";

import RoomPanel from "../components/RoomPanel";
import LatestStep from "../components/LatestStep";
import StepLog from "../components/StepLog";
import DebugPanel from "../components/DebugPanel";

/**
 * The development / testing UI for the B1 adventure.
 *
 * docs/01_PRODUCT_DIRECTION.md is explicit that this is a temporary harness for
 * exercising mechanics as they are implemented — not the target presentation layer.
 * It lives on its own page so the eventual player-facing UI can be built alongside it
 * rather than by dismantling it.
 */
export default function TestPage() {
  const [player, setPlayer] = useState(createPlayer());
  const [enemy, setEnemy] = useState(createGoblin());
  const [steps, setSteps] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.EXPLORING);
  const [currentRoom, setCurrentRoom] = useState(rooms.entrance);
  const [worldState, setWorldState] = useState(createWorldState());

  const latestStep = steps[steps.length - 1];

  function addStep(title, messages) {
    const messageList = Array.isArray(messages) ? messages : [messages];

    setSteps((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title,
        messages: messageList.filter(Boolean),
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
    setPlayer(createPlayer());
    setEnemy(createGoblin());
    setSteps([]);
    setCurrentRoom(rooms.entrance);
    setWorldState(createWorldState());
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

    for (const interaction of feature.interactions ?? []) {
      const interactionKey = `${currentRoom.id}:${feature.id}:${interaction.id}`;

      if (
        worldState.completedInteractions.includes(interactionKey) &&
        interaction.afterDescription
      ) {
        description = interaction.afterDescription;
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

    if (newlyDiscovered.length > 0) {
      messages.push(
        `You discover: ${newlyDiscovered.map((item) => item.name).join(", ")}.`,
      );
    } else {
      messages.push("You find nothing new.");
    }

    addStep(`Search: ${feature.name}`, messages);

    setWorldState((prev) => ({
      ...prev,

      searchedFeatures: prev.searchedFeatures.includes(featureKey)
        ? prev.searchedFeatures
        : [...prev.searchedFeatures, featureKey],

      discoveredItems: [...prev.discoveredItems, ...newlyDiscovered],
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

    if (discoveredSecret) {
      messages.push(discoveredSecret.description);
    }

    if (discoveredItem) {
      messages.push(
        `You also recover the ${discoveredItem.name.toLowerCase()}.`,
      );
    }

    addStep(interaction.name, messages);

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
    }));
  }

  function handleMove(direction) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const result = move(currentRoom, direction, rooms);

    if (!result.success) {
      addStep(`Move: ${direction}`, result.message);
      return;
    }

    setCurrentRoom(result.room);

    const messages = [result.message];

    const eventResult = resolveEvents(result.room.events?.onEnter, worldState);

    if (eventResult.messages.length > 0) {
      messages.push(...eventResult.messages);

      setWorldState((prev) => ({
        ...prev,
        triggeredEvents: eventResult.triggeredEvents,
      }));
    }

    addStep(`Move ${direction}: ${result.room.name}`, messages);
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>D&D Adventure</h1>

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

        <button onClick={handleNewGame}>New Game</button>
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
          onMove={handleMove}
          onTakeItem={handleTakeItem}
          onAttack={handleAttack}
        />

        <LatestStep step={latestStep} />
      </div>

      <StepLog steps={steps} />

      <DebugPanel worldState={worldState} />
    </main>
  );
}
