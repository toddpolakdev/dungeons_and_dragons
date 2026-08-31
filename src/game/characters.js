export const createPlayer = () => ({
  id: "hero",
  name: "Hero",

  classId: "fighter",
  level: 1,

  hp: 20,
  ac: 12,
  attackBonus: 3,
  damage: "1d6",

  savingThrows: {
    poison: 12,
    wands: 13,
    paralysisOrStone: 14,
    dragonBreath: 15,
    spells: 16,
  },

  equipment: [],
  thiefSkills: null,
});

export const createTestThief = () => ({
  id: "test-thief",
  name: "Test Thief",

  classId: "thief",
  level: 1,

  hp: 20,
  ac: 12,
  attackBonus: 3,
  damage: "1d6",

  savingThrows: {
    poison: 13,
    wands: 14,
    paralysisOrStone: 13,
    dragonBreath: 16,
    spells: 15,
  },

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
