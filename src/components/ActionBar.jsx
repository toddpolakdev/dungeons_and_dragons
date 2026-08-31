import { useState } from "react";
import { canPickLock } from "../game/locks";

/**
 * Available interactions for one feature: not already completed, and unlocked if
 * the interaction requires the feature to have been examined first.
 */
function availableInteractions(room, feature, worldState) {
  const featureKey = `${room.id}:${feature.id}`;
  const examined = worldState.examinedFeatures.includes(featureKey);

  return (feature.interactions ?? []).filter((interaction) => {
    const interactionKey = `${featureKey}:${interaction.id}`;

    const completed = worldState.completedInteractions.includes(interactionKey);

    const requirementsMet = !interaction.requiresExamination || examined;

    return requirementsMet && !completed;
  });
}

export default function ActionBar({
  room,
  player,
  worldState,
  onExamineRoom,
  onExamineFeature,
  onSearchFeature,
  onInteraction,
  onOpenContainer,
  onPickLock,
  onUseSecretDoor,
}) {
  const [inspectOpen, setInspectOpen] = useState(true);

  return (
    <div className="action-section">
      <button
        type="button"
        className="inspect-toggle"
        onClick={() => setInspectOpen((open) => !open)}
        aria-expanded={inspectOpen}
      >
        <span>Inspect</span>
        <span className="inspect-toggle-icon">{inspectOpen ? "▼" : "▶"}</span>
      </button>

      {inspectOpen && (
        <div className="inspect-content">
          <div className="action-group">
            <span className="action-group-label">This room</span>

            <div className="button-row">
              <button onClick={onExamineRoom}>Examine</button>
            </div>
          </div>

          {room.features?.map((feature) => {
            const interactions = availableInteractions(
              room,
              feature,
              worldState,
            );

            const featureKey = `${room.id}:${feature.id}`;

            const examined = worldState.examinedFeatures.includes(featureKey);

            const lockPickAvailable =
              examined &&
              canPickLock({
                player,
                worldState,
                roomId: room.id,
                featureId: feature.id,
                lock: feature.lock,
              });

            const secretDoorDiscovered =
              feature.secretDoor &&
              worldState.discoveredSecretDoors.includes(feature.secretDoor.id);

            return (
              <div className="action-group" key={feature.id}>
                <span className="action-group-label">{feature.name}</span>

                <div className="button-row">
                  <button onClick={() => onExamineFeature(feature)}>
                    Examine
                  </button>

                  {feature.searchable &&
                    feature.search &&
                    !secretDoorDiscovered && (
                      <button
                        className="search-button"
                        onClick={() => onSearchFeature(feature)}
                      >
                        Search
                      </button>
                    )}

                  {feature.container && examined && (
                    <button onClick={() => onOpenContainer(feature)}>
                      Open {feature.container.name}
                    </button>
                  )}

                  {interactions.map((interaction) => (
                    <button
                      key={interaction.id}
                      onClick={() => onInteraction(feature, interaction)}
                    >
                      {interaction.name}
                    </button>
                  ))}

                  {lockPickAvailable && (
                    <button onClick={() => onPickLock(feature)}>
                      Pick Lock
                    </button>
                  )}

                  {secretDoorDiscovered && (
                    <button onClick={() => onUseSecretDoor(feature)}>
                      Use Secret Door
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
