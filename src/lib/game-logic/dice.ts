export function resolveDice(guess: number) {
  const roll = Math.floor(Math.random() * 6) + 1;
  return { roll, win: roll === guess };
}
