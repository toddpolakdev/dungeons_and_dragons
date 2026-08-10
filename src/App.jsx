import { useState } from "react";
import { attack } from "./game/combat";
import { createPlayer, createGoblin } from "./game/characters";
import { GAME_STATES } from "./game/gameState";
import { rooms } from "./game/rooms";
import { move } from "./game/movement";
import { createWorldState } from "./game/worldState";

function App() {
  const [player, setPlayer] = useState(createPlayer());
  const [enemy, setEnemy] = useState(createGoblin());
  const [log, setLog] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.EXPLORING);
  const [currentRoom, setCurrentRoom] = useState(rooms.entrance);
  const [worldState, setWorldState] = useState(createWorldState());

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

      setCompletedEncounters((prev) => [...prev, currentRoom.id]);

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
    setLog((prev) => [...prev, ...newLog]);
  }

  function handleNewGame() {
    setPlayer(createPlayer());
    setEnemy(createGoblin());
    setLog([]);
    setCurrentRoom(rooms.entrance);
    setWorldState(createWorldState());
    setGameState(GAME_STATES.EXPLORING);
  }

  function handleExamine() {
    if (gameState !== GAME_STATES.EXPLORING) return;

    setLog((prev) => [
      ...prev,
      `You examine ${currentRoom.name}.`,
      currentRoom.examine,
    ]);
  }

  function handleExamineFeature(feature) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const featureKey = `${currentRoom.id}:${feature.id}`;

    setLog((prev) => [
      ...prev,
      `You examine the ${feature.name.toLowerCase()}.`,
      feature.description,
    ]);

    setWorldState((prev) => ({
      ...prev,
      examinedFeatures: prev.examinedFeatures.includes(featureKey)
        ? prev.examinedFeatures
        : [...prev.examinedFeatures, featureKey],
    }));
  }

  function handleMove(direction) {
    if (gameState !== GAME_STATES.EXPLORING) return;

    const result = move(currentRoom, direction, rooms);

    setLog((prev) => [...prev, result.message]);

    if (!result.success) return;

    setCurrentRoom(result.room);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>D&D Adventure</h1>
      <div>
        <strong>Game State:</strong> {gameState}
      </div>
      <pre>{JSON.stringify(worldState, null, 2)}</pre>

      {gameState === GAME_STATES.EXPLORING && (
        <div style={{ marginTop: "20px" }}>
          <h2>{currentRoom.name}</h2>

          <p>{currentRoom.description}</p>

          <button onClick={handleExamine}>Examine</button>

          {currentRoom.features?.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleExamineFeature(feature)}
              style={{ marginLeft: "10px" }}
            >
              Examine {feature.name}
            </button>
          ))}

          <div style={{ marginTop: "10px" }}>
            {Object.keys(currentRoom.exits).map((direction) => (
              <button
                key={direction}
                onClick={() => handleMove(direction)}
                style={{ marginRight: "10px" }}
              >
                Go {direction}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <strong>Player HP:</strong> {player.hp}
      </div>
      <div>
        <strong>Goblin HP:</strong> {enemy.hp}
      </div>
      <button
        onClick={handleAttack}
        disabled={gameState !== GAME_STATES.COMBAT}
        style={{ marginTop: "10px" }}
      >
        Attack
      </button>
      <button
        onClick={handleNewGame}
        style={{ marginTop: "10px", marginLeft: "10px" }}
      >
        New Game
      </button>
      <div style={{ marginTop: "20px" }}>
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
