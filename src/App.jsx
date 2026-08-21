import { useState } from "react";
import { attack } from "./game/combat";
import { createPlayer, createGoblin } from "./game/characters";
import { GAME_STATES } from "./game/gameState";
import { rooms } from "./game/rooms";
import { move } from "./game/movement";
import { createWorldState } from "./game/worldState";
import { resolveEvents } from "./game/eventResolver";

function App() {
  const [player, setPlayer] = useState(createPlayer());
  const [enemy, setEnemy] = useState(createGoblin());
  const [steps, setSteps] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.EXPLORING);
  const [currentRoom, setCurrentRoom] = useState(rooms.entrance);
  const [worldState, setWorldState] = useState(createWorldState());

  const latestStep = steps[steps.length - 1];

  const currentRoomDiscoveries = worldState.discoveredItems.filter(
    (item) => item.roomId === currentRoom.id,
  );

  const currentRoomSecrets = worldState.discoveredSecrets.filter(
    (secret) => secret.roomId === currentRoom.id,
  );

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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f3f1eb;
          color: #242424;
          font-family: Arial, Helvetica, sans-serif;
        }

        button {
          border: 1px solid #777;
          background: #fff;
          color: #222;
          border-radius: 5px;
          padding: 9px 14px;
          font-size: 14px;
          cursor: pointer;
        }

        button:hover {
          background: #ececec;
        }

        button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .app {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
        }

        .status-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .status {
          display: inline-block;
          background: #ddd8cc;
          border-radius: 4px;
          padding: 5px 9px;
          font-size: 13px;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
          gap: 20px;
          align-items: start;
        }

        .panel {
          background: #fff;
          border: 1px solid #d1cec5;
          border-radius: 8px;
          padding: 20px;
        }

        .panel h2,
        .panel h3 {
          margin-top: 0;
        }

        .room-name {
          margin-bottom: 8px;
        }

        .room-description {
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .action-section {
          border-top: 1px solid #e2dfd8;
          padding-top: 16px;
          margin-top: 16px;
        }

        .action-section h3 {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin-bottom: 10px;
        }

        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .move-button {
          background: #353535;
          color: #fff;
          border-color: #353535;
        }

        .move-button:hover {
          background: #555;
        }

        .search-button {
          background: #f5ead1;
          border-color: #bba776;
        }

        .latest-panel {
          border-left: 5px solid #777;
        }

        .latest-label {
          margin: 0 0 8px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #777;
        }

        .latest-title {
          margin: 0 0 14px;
          font-size: 18px;
        }

        .message {
          line-height: 1.55;
          margin: 8px 0;
          white-space: pre-line;
        }

        .empty-message {
          color: #777;
          font-style: italic;
        }

        .combat {
          margin-top: 20px;
        }

        .combat-stats {
          display: flex;
          gap: 18px;
          margin-bottom: 12px;
        }

        .history {
          margin-top: 20px;
        }

        .history h2 {
          margin-bottom: 14px;
        }

        .step {
          padding: 14px 0;
          border-top: 1px solid #ddd;
        }

        .step:first-of-type {
          border-top: 0;
        }

        .step-heading {
          display: flex;
          gap: 10px;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .step-number {
          color: #777;
          font-size: 12px;
          min-width: 48px;
        }

        .step-title {
          font-weight: bold;
        }

        .step-message {
          margin: 5px 0 5px 58px;
          line-height: 1.5;
          white-space: pre-line;
        }

        details {
          margin-top: 20px;
          background: #fff;
          border: 1px solid #d1cec5;
          border-radius: 8px;
          padding: 14px 18px;
        }

        summary {
          cursor: pointer;
          font-weight: bold;
        }

        pre {
          overflow-x: auto;
          padding: 14px;
          background: #222;
          color: #eee;
          border-radius: 5px;
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 760px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .header {
            align-items: flex-start;
          }

          .app {
            padding: 14px;
          }

          .step-message {
            margin-left: 0;
          }
        }
      `}</style>

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
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                }}
              >
                <strong>Carrying:</strong>{" "}
                {worldState.collectedItems.map((item) => item.name).join(", ")}
              </div>
            )}
          </div>

          <button onClick={handleNewGame}>New Game</button>
        </header>

        <div className="layout">
          {/* CURRENT ROOM */}
          <section className="panel">
            <h2 className="room-name">{currentRoom.name}</h2>

            <p className="room-description">{currentRoom.description}</p>

            {gameState === GAME_STATES.EXPLORING && (
              <>
                <div className="action-section">
                  <h3>Inspect</h3>

                  <div className="button-row">
                    <button onClick={handleExamine}>Examine Room</button>

                    {currentRoom.features?.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => handleExamineFeature(feature)}
                      >
                        Examine {feature.name}
                      </button>
                    ))}

                    {currentRoom.features
                      ?.filter((feature) => feature.searchable)
                      .map((feature) => (
                        <button
                          key={`search-${feature.id}`}
                          className="search-button"
                          onClick={() => handleSearchFeature(feature)}
                        >
                          Search {feature.name}
                        </button>
                      ))}

                    {currentRoom.features?.flatMap((feature) => {
                      const featureKey = `${currentRoom.id}:${feature.id}`;

                      const examined =
                        worldState.examinedFeatures.includes(featureKey);

                      return (feature.interactions ?? [])
                        .filter((interaction) => {
                          const interactionKey = `${currentRoom.id}:${feature.id}:${interaction.id}`;

                          const completed =
                            worldState.completedInteractions.includes(
                              interactionKey,
                            );

                          const requirementsMet =
                            !interaction.requiresExamination || examined;

                          return requirementsMet && !completed;
                        })
                        .map((interaction) => (
                          <button
                            key={`${feature.id}-${interaction.id}`}
                            onClick={() =>
                              handleInteraction(feature, interaction)
                            }
                          >
                            {interaction.name}
                          </button>
                        ));
                    })}
                  </div>
                </div>

                <div className="action-section">
                  <h3>Travel</h3>

                  <div className="button-row">
                    {Object.keys(currentRoom.exits).map((direction) => (
                      <button
                        key={direction}
                        className="move-button"
                        onClick={() => handleMove(direction)}
                      >
                        Go {direction}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentRoomDiscoveries.length > 0 && (
              <div className="action-section">
                <h3>Discovered</h3>
                {currentRoomDiscoveries.map((item) => {
                  const collected = worldState.collectedItems.some(
                    (collectedItem) => collectedItem.id === item.id,
                  );

                  return (
                    <div
                      key={item.id}
                      style={{
                        marginBottom: "14px",
                        paddingBottom: "14px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <strong>{item.name}</strong>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginTop: "3px",
                        }}
                      >
                        {item.source}
                      </div>

                      <div style={{ marginTop: "4px", marginBottom: "8px" }}>
                        {item.description}
                      </div>

                      {collected ? (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          ✓ Taken
                        </span>
                      ) : (
                        <button onClick={() => handleTakeItem(item)}>
                          Take {item.name}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {currentRoomSecrets.length > 0 && (
              <div className="action-section">
                <h3>Secrets Discovered</h3>

                {currentRoomSecrets.map((secret) => (
                  <div
                    key={secret.id}
                    style={{
                      marginBottom: "14px",
                      paddingBottom: "14px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <strong>{secret.name}</strong>

                    <div
                      style={{
                        marginTop: "4px",
                        lineHeight: "1.5",
                      }}
                    >
                      {secret.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {gameState === GAME_STATES.COMBAT && (
              <div className="action-section combat">
                <h3>Combat</h3>

                <div className="combat-stats">
                  <span>
                    Player HP: <strong>{player.hp}</strong>
                  </span>

                  <span>
                    {enemy.name} HP: <strong>{enemy.hp}</strong>
                  </span>
                </div>

                <button onClick={handleAttack}>Attack {enemy.name}</button>
              </div>
            )}

            {gameState === GAME_STATES.GAME_OVER && (
              <div className="action-section">
                <h3>Game Over</h3>
                <p>Your character has been defeated.</p>
              </div>
            )}
          </section>

          {/* MOST RECENT ACTION */}
          <aside className="panel latest-panel">
            <p className="latest-label">What just happened</p>

            {latestStep ? (
              <>
                <h2 className="latest-title">
                  Step {latestStep.id}: {latestStep.title}
                </h2>

                {latestStep.messages.map((message, index) => (
                  <p className="message" key={index}>
                    {message}
                  </p>
                ))}
              </>
            ) : (
              <>
                <h2 className="latest-title">Ready</h2>

                <p className="empty-message">
                  Choose an action to begin testing.
                </p>
              </>
            )}
          </aside>
        </div>

        {/* PREVIOUS STEPS */}
        <section className="panel history">
          <h2>Game History</h2>

          {steps.length === 0 ? (
            <p className="empty-message">No actions have been taken yet.</p>
          ) : (
            steps.map((step) => (
              <div className="step" key={step.id}>
                <div className="step-heading">
                  <span className="step-number">Step {step.id}</span>

                  <span className="step-title">{step.title}</span>
                </div>

                {step.messages.map((message, index) => (
                  <p className="step-message" key={index}>
                    {message}
                  </p>
                ))}
              </div>
            ))
          )}
        </section>

        {/* DEBUG */}
        <details>
          <summary>World State / Debug</summary>

          <pre>{JSON.stringify(worldState, null, 2)}</pre>
        </details>
      </main>
    </>
  );
}

export default App;
