/**
 * Pin positions for the B1 dungeon map scans.
 *
 * Values are NORMALIZED: x and y are fractions (0-1) of the map image's own
 * width and height, so pins stay correct at any rendered size. `level` selects
 * which map the pin belongs to. `area` is the module's printed key number for
 * that location, which is what you aim at when picking — several locations in
 * the entrance sequence are unnumbered corridors, so `area` is null there.
 *
 * This lives in the UI layer on purpose. It is presentation data for the dev
 * map only — src/game/rooms.js stays a pure graph with no geometry in it, and
 * this file does not depend on the `dm:` blocks.
 *
 * ACCURACY: these values are read off the scan by eye, guided by the module's
 * printed area numbers. They are close, not exact. Use "Pick coordinates" on
 * the test page map panel to click each area precisely, then "Copy all" and
 * replace the block below in one paste.
 */

export const maps = {
  1: { level: 1, name: "Upper Level", src: "/maps/upper-level.png" },
  2: { level: 2, name: "Lower Level", src: "/maps/lower-level.png" },
};

export const DEFAULT_LEVEL = 1;

export const roomCoords_defaultMap = {
  // Entrance corridor, running north from the ENTRANCE label at bottom centre.
  entrance: { level: 1, area: null, x: 0.447, y: 0.955 },
  firstAlcoves: { level: 1, area: "1", x: 0.445, y: 0.725 },
  // The middle pair — the one-way secret doors, marked with arrows on the map.
  secondAlcoves: { level: 1, area: "1", x: 0.445, y: 0.633 },
  // The magic mouths.
  thirdAlcoves: { level: 1, area: "1", x: 0.447, y: 0.625 },
  // Battle site where the five bodies lie; two steps up, corridors meet E/W.
  intersection: { level: 1, area: null, x: 0.447, y: 0.585 },
  northPassage: { level: 1, area: null, x: 0.447, y: 0.52 },

  kitchen: { level: 1, area: "2", x: 0.345, y: 0.617 },
  diningRoom: { level: 1, area: "3", x: 0.527, y: 0.637 },
  lounge: { level: 1, area: "4", x: 0.537, y: 0.707 },
  wizardChamber: { level: 1, area: "5", x: 0.573, y: 0.455 },
};

export const roomCoords = {
  // Entrance corridor, running north from the ENTRANCE label at bottom centre.
  entrance: { level: 1, area: null, x: 0.443, y: 0.969 },
  firstAlcoves: { level: 1, area: "1", x: 0.444, y: 0.824 },
  // The middle pair — the one-way secret doors, marked with arrows on the map.
  secondAlcoves: { level: 1, area: "1", x: 0.444, y: 0.712 },
  // The magic mouths.
  thirdAlcoves: { level: 1, area: "1", x: 0.445, y: 0.62 },
  // Battle site where the five bodies lie; two steps up, corridors meet E/W.
  intersection: { level: 1, area: null, x: 0.445, y: 0.58 },
  northPassage: { level: 1, area: null, x: 0.447, y: 0.52 },

  kitchen: { level: 1, area: "2", x: 0.34, y: 0.548 },
  diningRoom: { level: 1, area: "3", x: 0.556, y: 0.569 },
  lounge: { level: 1, area: "4", x: 0.568, y: 0.626 },
  wizardChamber: { level: 1, area: "5", x: 0.569, y: 0.379 },
  zelligarCloset: { level: 1, area: null, x: 0.631, y: 0.444 },
  wizardAnnex: { level: 1, area: null, x: 0.501, y: 0.433 },
  wizardWorkroom: { level: 1, area: null, x: 0.393, y: 0.468 },
  wizardLaboratory: { level: 1, area: null, x: 0.385, y: 0.392 },
};
