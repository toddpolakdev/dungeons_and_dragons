export function getTrapKey(roomId, featureId, trapId = "trap") {
  return `${roomId}:${featureId}:${trapId}`;
}
