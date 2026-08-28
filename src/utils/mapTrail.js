/**
 * Splits a walked path into drawable polyline segments.
 *
 * The path is the rooms the player actually moved through, in order, repeats
 * included — not the deduplicated visited set, which loses backtracking and made
 * the trail cut straight between rooms the player never travelled between.
 *
 * A room that has no coordinates yet, or sits on another level, ENDS the current
 * segment instead of being skipped. Skipping it would join its neighbours with a
 * line the player never walked, which is the same class of bug.
 */
export function buildTrailSegments(pathRoomIds = [], coords = {}, activeLevel) {
  const segments = [];

  let current = [];

  function endSegment() {
    if (current.length > 1) {
      segments.push(current);
    }

    current = [];
  }

  for (const roomId of pathRoomIds) {
    const pin = coords[roomId];

    const drawable =
      pin &&
      pin.level === activeLevel &&
      typeof pin.x === "number" &&
      typeof pin.y === "number";

    if (!drawable) {
      endSegment();
      continue;
    }

    current.push({ x: pin.x, y: pin.y });
  }

  endSegment();

  return segments;
}
