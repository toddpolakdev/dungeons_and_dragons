import { rollDice } from "./dice";

export function resolveSavingThrow({ character, type }) {
  const target = character.savingThrows?.[type];

  if (!Number.isInteger(target)) {
    return {
      configured: false,
      type,
      roll: null,
      target: null,
      success: null,
    };
  }

  const roll = rollDice(20);

  return {
    configured: true,
    type,
    roll,
    target,
    success: roll >= target,
  };
}
