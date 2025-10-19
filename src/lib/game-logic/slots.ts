const symbols = ["🍒", "🍋", "🔔", "⭐", "7"];

export function resolveSlots() {
  const reels = [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  let multiplier = 0;
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    multiplier = reels[0] === "7" ? 20 : 8;
  } else if (new Set(reels).size === 2) {
    multiplier = 2;
  }
  return { reels, payoutMultiplier: multiplier };
}
