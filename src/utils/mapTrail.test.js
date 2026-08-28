import { describe, expect, it } from "vitest";
import { buildTrailSegments } from "./mapTrail";

const coords = {
  entrance: { level: 1, x: 0.1, y: 0.9 },
  intersection: { level: 1, x: 0.4, y: 0.5 },
  diningRoom: { level: 1, x: 0.7, y: 0.5 },
  kitchen: { level: 1, x: 0.2, y: 0.5 },
  lowerVault: { level: 2, x: 0.5, y: 0.5 },
  noPin: { level: 1 },
};

describe("buildTrailSegments", () => {
  it("returns no segments for an empty path", () => {
    expect(buildTrailSegments([], coords, 1)).toEqual([]);
  });

  it("returns no segments for a single room", () => {
    // One point is a pin, not a line. Drawing it would be a zero-length stroke.
    expect(buildTrailSegments(["entrance"], coords, 1)).toEqual([]);
  });

  it("returns one segment for a straight run", () => {
    expect(
      buildTrailSegments(["entrance", "intersection", "diningRoom"], coords, 1),
    ).toEqual([
      [
        { x: 0.1, y: 0.9 },
        { x: 0.4, y: 0.5 },
        { x: 0.7, y: 0.5 },
      ],
    ]);
  });

  // The bug this module exists to fix: walking back through a room must put that
  // room back on the line, so the trail routes through it rather than across it.
  it("repeats a revisited room so backtracking is drawn", () => {
    const path = ["intersection", "diningRoom", "intersection", "kitchen"];

    expect(buildTrailSegments(path, coords, 1)).toEqual([
      [
        { x: 0.4, y: 0.5 },
        { x: 0.7, y: 0.5 },
        { x: 0.4, y: 0.5 },
        { x: 0.2, y: 0.5 },
      ],
    ]);
  });

  it("breaks the line at a room with no coordinates", () => {
    const path = ["entrance", "intersection", "noPin", "diningRoom", "kitchen"];

    expect(buildTrailSegments(path, coords, 1)).toEqual([
      [
        { x: 0.1, y: 0.9 },
        { x: 0.4, y: 0.5 },
      ],
      [
        { x: 0.7, y: 0.5 },
        { x: 0.2, y: 0.5 },
      ],
    ]);
  });

  it("breaks the line at a room on another level", () => {
    const path = [
      "entrance",
      "intersection",
      "lowerVault",
      "diningRoom",
      "kitchen",
    ];

    expect(buildTrailSegments(path, coords, 1)).toEqual([
      [
        { x: 0.1, y: 0.9 },
        { x: 0.4, y: 0.5 },
      ],
      [
        { x: 0.7, y: 0.5 },
        { x: 0.2, y: 0.5 },
      ],
    ]);
  });

  it("drops a stranded single point rather than emitting a one-point segment", () => {
    const path = ["entrance", "noPin", "intersection", "noPin", "kitchen"];

    expect(buildTrailSegments(path, coords, 1)).toEqual([]);
  });

  it("selects only the active level", () => {
    const path = ["lowerVault", "entrance", "lowerVault"];

    expect(buildTrailSegments(path, coords, 2)).toEqual([]);
  });

  it("ignores an unknown room id", () => {
    const path = ["entrance", "nowhere", "intersection"];

    expect(buildTrailSegments(path, coords, 1)).toEqual([]);
  });
});
