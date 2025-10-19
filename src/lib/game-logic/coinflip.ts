export function resolveCoinFlip(choice: "heads" | "tails") {
  const roll = Math.random() < 0.5 ? "heads" : "tails";
  return { result: roll, win: roll === choice };
}
