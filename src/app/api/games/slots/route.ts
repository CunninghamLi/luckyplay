import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth-guards";

const SYMBOLS = ["🍒","🍋","🔔","⭐","💎","7️⃣"] as const;
type Sym = typeof SYMBOLS[number];

function spin(): Sym[] {
  const pick = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  return [pick(), pick(), pick()];
}

/**
 * Returns:
 *  - totalReturn: credits returned to player (for storage in `payout`)
 *  - netDelta: wallet increment/decrement (applied via credits increment)
 *  - kind: "three" | "two" | "none"
 */
function scoring(result: Sym[], bet: number) {
  const [a, b, c] = result;
  let totalReturn = 0;
  let kind: "three" | "two" | "none" = "none";

  if (a === b && b === c) {
    // 7x total return
    totalReturn = bet * 7;
    kind = "three";
  } else if (a === b || a === c || b === c) {
    // refund (1x total return)
    totalReturn = bet;
    kind = "two";
  } else {
    totalReturn = 0;
    kind = "none";
  }

  // We apply: first subtract bet, then add totalReturn.
  // So wallet net change:
  const netDelta = totalReturn - bet; // +6×bet (three), 0 (two), -bet (none)
  const win = netDelta > 0;

  return { totalReturn, netDelta, win, kind };
}

export async function POST(req: Request) {
  const { user, prisma } = await getAuthedUser();
  const body = await req.json().catch(() => ({}));
  const bet = Math.max(1, Number(body.bet || 1));

  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet || wallet.credits < bet) {
    return NextResponse.json({ message: "Insufficient credits." }, { status: 400 });
  }

  const symbols = spin();
  const { totalReturn, netDelta, win, kind } = scoring(symbols, bet);

  await prisma.$transaction(async (tx) => {
    // Record bet (store totalReturn in payout to stay consistent with your other routes)
    await tx.bet.create({
      data: {
        userId: user.id,
        game: "SLOTS",
        wager: bet,
        outcome: symbols.join(" "),
        payout: totalReturn, // total returned on win/refund; 0 on loss
      },
    });

    // Apply credits
    await tx.wallet.update({
      where: { userId: user.id },
      data: { credits: { increment: netDelta } },
    });
  });

  // Compose human-readable message
  const reels = symbols.join(" ");
  let message = `Reels: ${reels}. `;
  if (kind === "three") {
    message += `You won ${bet * 6} credits!`; // profit amount
  } else if (kind === "two") {
    message += `Two of a kind — bet refunded.`;
  } else {
    message += `You lost.`;
  }

  return NextResponse.json({
    symbols,     // authoritative order for UI
    win,
    netDelta,    // +profit / -loss
    payout: totalReturn, // total returned (for reference)
    message,
  });
}

export function GET() {
  return NextResponse.json({ message: "POST to spin the slots." }, { status: 405 });
}
