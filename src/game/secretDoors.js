import { rollDice } from "./dice";

export function searchForSecretDoor({ player, secretDoor }) {
  if (!secretDoor) {
    return {
      success: false,
      roll: null,
    };
  }

  const roll = rollDice(6);

  // Holmes Basic:
  // Elf actively searching: 1-4 on d6.
  // Other characters: 1-2 on d6.
  const successMaximum = player.classId === "elf" ? 4 : 2;

  return {
    success: roll <= successMaximum,
    roll,
  };
}

export function isSecretDoorDiscovered(worldState, secretDoor) {
  if (!secretDoor) return false;

  return worldState.discoveredSecretDoors.includes(secretDoor.id);
}

export function traverseSecretDoor({ worldState, secretDoor, rooms }) {
  if (!secretDoor) {
    return {
      success: false,
      room: null,
      message: "There is no secret door here.",
    };
  }

  if (!isSecretDoorDiscovered(worldState, secretDoor)) {
    return {
      success: false,
      room: null,
      message: "You have not discovered a secret door here.",
    };
  }

  const nextRoom = rooms[secretDoor.destination];

  if (!nextRoom) {
    return {
      success: false,
      room: null,
      message: "The secret passage cannot be followed.",
    };
  }

  return {
    success: true,
    room: nextRoom,
    message: `You pass through the secret door and enter ${nextRoom.name}.`,
  };
}
