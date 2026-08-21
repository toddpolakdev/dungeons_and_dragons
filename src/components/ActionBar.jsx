/**
 * Available interactions for one feature: not already completed, and unlocked if
 * the interaction requires the feature to have been examined first.
 */
function availableInteractions(room, feature, worldState) {
  const featureKey = `${room.id}:${feature.id}`;
  const examined = worldState.examinedFeatures.includes(featureKey);

  return (feature.interactions ?? []).filter((interaction) => {
    const interactionKey = `${featureKey}:${interaction.id}`;

    const completed =
      worldState.completedInteractions.includes(interactionKey);

    const requirementsMet = !interaction.requiresExamination || examined;

    return requirementsMet && !completed;
  });
}

export default function ActionBar({
  room,
  worldState,
  onExamineRoom,
  onExamineFeature,
  onSearchFeature,
  onInteraction,
  onMove,
}) {
  return (
    <>
      <div className="action-section">
        <h3>Inspect</h3>

        <div className="action-group">
          <span className="action-group-label">This room</span>

          <div className="button-row">
            <button onClick={onExamineRoom}>Examine</button>
          </div>
        </div>

        {room.features?.map((feature) => {
          const interactions = availableInteractions(room, feature, worldState);

          return (
            <div className="action-group" key={feature.id}>
              <span className="action-group-label">{feature.name}</span>

              <div className="button-row">
                <button onClick={() => onExamineFeature(feature)}>
                  Examine
                </button>

                {/*
                  Gate on `search` as well as `searchable`: the handler bails out
                  without one, so a feature missing it would render a dead button.
                */}
                {feature.searchable && feature.search && (
                  <button
                    className="search-button"
                    onClick={() => onSearchFeature(feature)}
                  >
                    Search
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
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-section">
        <h3>Travel</h3>

        <div className="button-row">
          {Object.keys(room.exits ?? {}).map((direction) => (
            <button
              key={direction}
              className="move-button"
              onClick={() => onMove(direction)}
            >
              Go {direction}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
