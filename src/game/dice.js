export function rollDice(sides = 20) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDamage(dice) {
  const [count, sides] = dice.split("d").map(Number);
  let total = 0;

  for (let i = 0; i < count; i++) {
    total += rollDice(sides);
  }

  return total;
}
