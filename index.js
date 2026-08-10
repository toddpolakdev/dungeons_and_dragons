function rollDice(sides = 20) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDamage(dice) {
  const [count, sides] = dice.split("d").map(Number);
  let total = 0;

  for (let i = 0; i < count; i++) {
    total += rollDice(sides);
  }

  return total;
}

const player = {
  name: "Hero",
  hp: 20,
  ac: 12,
  attackBonus: 3,
  damage: "1d6",
};

const goblin = {
  name: "Goblin",
  hp: 10,
  ac: 10,
  attackBonus: 2,
  damage: "1d4",
};

function attack(attacker, defender) {
  const roll = rollDice(20);
  const total = roll + attacker.attackBonus;

  console.log(`\n${attacker.name} attacks ${defender.name}!`);
  console.log(`Roll: ${roll} + ${attacker.attackBonus} = ${total}`);

  if (total >= defender.ac) {
    console.log("→ HIT!");

    const damage = rollDamage(attacker.damage);
    defender.hp -= damage;

    console.log(`Damage: ${damage}`);
    console.log(`${defender.name} HP: ${defender.hp}`);
  } else {
    console.log("→ MISS!");
  }
}

while (player.hp > 0 && goblin.hp > 0) {
  attack(player, goblin);

  if (goblin.hp <= 0) {
    console.log("\nGoblin defeated!");
    break;
  }

  attack(goblin, player);

  if (player.hp <= 0) {
    console.log("\nYou were defeated...");
    break;
  }
}
