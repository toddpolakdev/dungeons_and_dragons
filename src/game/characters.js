export const createPlayer = () => ({
  name: "Hero",
  hp: 20,
  ac: 12,
  attackBonus: 3,
  damage: "1d6",
});

export const createGoblin = () => ({
  name: "Goblin",
  hp: 10,
  ac: 10,
  attackBonus: 2,
  damage: "1d4",
});
