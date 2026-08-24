export function rollDice(sides = 20) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollFormula(formula) {
  if (typeof formula === "number") {
    return formula;
  }

  const normalized = String(formula).replace(/\s/g, "");

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  const match = normalized.match(/^(\d+)d(\d+)([+-]\d+)?$/i);

  if (!match) {
    throw new Error(`Invalid dice formula: ${formula}`);
  }

  const count = Number(match[1]);
  const sides = Number(match[2]);
  const modifier = Number(match[3] ?? 0);

  let total = 0;

  for (let i = 0; i < count; i++) {
    total += rollDice(sides);
  }

  return total + modifier;
}

export function rollDamage(dice) {
  return rollFormula(dice);
}

export function rollPercentile() {
  return rollDice(100);
}
