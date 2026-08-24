export const createPlayer = () => ({
  id: "hero",
  name: "Hero",

  classId: "fighter",
  level: 1,

  hp: 20,
  ac: 12,
  attackBonus: 3,
  damage: "1d6",

  equipment: [],
  thiefSkills: null,
});

export const createTestThief = () => ({
  id: "test-thief",
  name: "Test Thief",

  classId: "thief",
  level: 1,

  // Temporary test-harness combat values.
  hp: 20,
  ac: 12,
  attackBonus: 3,
  damage: "1d6",

  equipment: ["thieves-tools"],

  thiefSkills: {
    openLocks: 15,
    findTraps: 10,
    removeTraps: 10,
  },
});

export const createGoblin = () => ({
  name: "Goblin",
  hp: 10,
  ac: 10,
  attackBonus: 2,
  damage: "1d4",
});
