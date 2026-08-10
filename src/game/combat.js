import { rollDice, rollDamage } from "./dice";

export function attack(attacker, defender) {
  const log = [];

  const roll = rollDice(20);
  const total = roll + attacker.attackBonus;

  log.push(`${attacker.name} attacks ${defender.name}`);
  log.push(`Roll: ${roll} + ${attacker.attackBonus} = ${total}`);

  if (total >= defender.ac) {
    log.push("→ HIT!");

    const damage = rollDamage(attacker.damage);
    defender.hp = Math.max(0, defender.hp - damage);

    log.push(`Damage: ${damage}`);
    log.push(`${defender.name} HP: ${defender.hp}`);
  } else {
    log.push("→ MISS!");
  }

  return log;
}
