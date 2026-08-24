export function getLockKey(roomId, featureId, lockId = "lock") {
  return `${roomId}:${featureId}:${lockId}`;
}

export function getContainerKey(roomId, featureId, containerId = "container") {
  return `${roomId}:${featureId}:${containerId}`;
}

export function getLockAttemptKey({ player, roomId, featureId, lock }) {
  const lockKey = getLockKey(roomId, featureId, lock.id);

  return `${player.id}:level-${player.level}:${lockKey}`;
}

export function isLocked({ worldState, roomId, featureId, lock }) {
  if (!lock?.initiallyLocked) {
    return false;
  }

  const lockKey = getLockKey(roomId, featureId, lock.id);

  return !worldState.unlockedLocks.includes(lockKey);
}

export function isOpen({ worldState, roomId, featureId, container }) {
  const containerKey = getContainerKey(roomId, featureId, container.id);

  return worldState.openedContainers.includes(containerKey);
}

export function hasAttemptedLock({
  player,
  worldState,
  roomId,
  featureId,
  lock,
}) {
  if (!lock) return false;

  const attemptKey = getLockAttemptKey({
    player,
    roomId,
    featureId,
    lock,
  });

  return worldState.attemptedLocks.includes(attemptKey);
}

export function canPickLock({ player, worldState, roomId, featureId, lock }) {
  if (!lock) return false;

  if (player.classId !== "thief") {
    return false;
  }

  if (!player.equipment?.includes("thieves-tools")) {
    return false;
  }

  if (!player.thiefSkills?.openLocks) {
    return false;
  }

  if (
    !isLocked({
      worldState,
      roomId,
      featureId,
      lock,
    })
  ) {
    return false;
  }

  if (
    hasAttemptedLock({
      player,
      worldState,
      roomId,
      featureId,
      lock,
    })
  ) {
    return false;
  }

  return true;
}
