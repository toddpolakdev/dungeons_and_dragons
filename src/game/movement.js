export function move(currentRoom, direction, rooms) {
  const nextRoomId = currentRoom.exits[direction];

  if (!nextRoomId) {
    return {
      success: false,
      room: currentRoom,
      message: `You cannot go ${direction} from here.`,
    };
  }

  const nextRoom = rooms[nextRoomId];

  if (!nextRoom) {
    return {
      success: false,
      room: currentRoom,
      message: `The path ${direction} cannot be followed.`,
    };
  }

  return {
    success: true,
    room: nextRoom,
    message: `You travel ${direction} and enter ${nextRoom.name}.`,
  };
}
