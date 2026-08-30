import { GAME_STATES } from "../game/gameState";
import ActionBar from "./ActionBar";
import Discoveries from "./Discoveries";
import GameText from "./GameText";
import SpeakButton from "../components/SpeakButton";

export default function RoomPanel({
  room,
  gameState,
  worldState,
  player,
  enemy,
  onExamineRoom,
  onExamineFeature,
  onSearchFeature,
  onInteraction,
  onOpenContainer,
  onUseSecretDoor,
  onMove,
  onTakeItem,
  onAttack,
  onPickLock,
}) {
  const discoveries = worldState.discoveredItems.filter(
    (item) => item.roomId === room.id,
  );

  const secrets = worldState.discoveredSecrets.filter(
    (secret) => secret.roomId === room.id,
  );

  return (
    <section className="panel">
      <h2 className="room-name">{room.name}</h2>

      <div className="room-description">
        <GameText text={room.description} />
      </div>

      <SpeakButton text={room.description} label="🔊 Read Room Description" />

      {gameState === GAME_STATES.EXPLORING && (
        <ActionBar
          room={room}
          player={player}
          worldState={worldState}
          onExamineRoom={onExamineRoom}
          onExamineFeature={onExamineFeature}
          onSearchFeature={onSearchFeature}
          onInteraction={onInteraction}
          onOpenContainer={onOpenContainer}
          onPickLock={onPickLock}
          onUseSecretDoor={onUseSecretDoor}
          onMove={onMove}
        />
      )}

      {discoveries.length > 0 && (
        <div className="action-section">
          <h3>Discovered</h3>

          <Discoveries
            items={discoveries}
            collectedItems={worldState.collectedItems}
            onTakeItem={onTakeItem}
          />
        </div>
      )}

      {secrets.length > 0 && (
        <div className="action-section">
          <h3>Secrets Discovered</h3>

          {secrets.map((secret) => (
            <div className="discovery" key={secret.id}>
              <div className="discovery-name">{secret.name}</div>

              <div className="discovery-description">
                <GameText text={secret.description} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/*
        Combat is not yet wired into the B1 exploration flow — docs/02_GAMEPLAY_STATUS.md
        classifies that as planned integration rather than a defect, so this panel stays
        dormant instead of being faked into a complete loop.
      */}
      {gameState === GAME_STATES.COMBAT && (
        <div className="action-section">
          <h3>Combat</h3>

          <div className="combat-stats">
            <span>
              Player HP: <strong>{player.hp}</strong>
            </span>

            <span>
              {enemy.name} HP: <strong>{enemy.hp}</strong>
            </span>
          </div>

          <button onClick={onAttack}>Attack {enemy.name}</button>
        </div>
      )}

      {gameState === GAME_STATES.GAME_OVER && (
        <div className="action-section">
          <h3>Game Over</h3>

          <p className="prose">Your character has been defeated.</p>
        </div>
      )}
    </section>
  );
}
