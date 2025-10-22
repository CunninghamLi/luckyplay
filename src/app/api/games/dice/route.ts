// src/app/api/games/dice/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthedUser } from "@/lib/auth-guards";
import { resolveDice } from "@/lib/game-logic/dice"; // must return { roll: 1..6, win: boolean }

const bodySchema = z.object({
  bet: z.number().int().min(1),
  guess: z.number().int().min(1).max(6),
});

export async function POST(req: Request) {
  const { user, prisma } = await getAuthedUser();

  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse({
    ...json,
    bet: Number(json.bet),
    guess: Number(json.guess),
  });
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input." }, { status: 400 });
  }

  const { bet, guess } = parsed.data;

  // balance check
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet || wallet.credits < bet) {
    return NextResponse.json({ message: "Insufficient credits." }, { status: 400 });
  }

  // outcome from your helper
  const outcome = resolveDice(guess); // => { roll: 1..6, win: boolean }
  const face = outcome.roll as 1 | 2 | 3 | 4 | 5 | 6;

  // Your economics: first subtract bet; if win, add bet*5 (net +4*bet)
  const payoutAddIfWin = bet * 5;

  await prisma.$transaction(async (tx) => {
    // subtract wager
    await tx.wallet.update({
      where: { userId: user.id },
      data: { credits: { decrement: bet } },
    });

    // add winnings if any
    if (outcome.win) {
      await tx.wallet.update({
        where: { userId: user.id },
        data: { credits: { increment: payoutAddIfWin } },
      });
    }

    await tx.bet.create({
      data: {
        userId: user.id,
        game: "DICE",
        wager: bet,
        // store the roll as the outcome (matches your dashboard)
        outcome: String(face),
        // store positive total credit added on win, 0 on loss (matches your previous logic)
        payout: outcome.win ? payoutAddIfWin : 0,
      },
    });
  });

  const message = outcome.win
    ? `Rolled ${face}. You won ${payoutAddIfWin - bet}!`
    : `Rolled ${face}. You lost.`;

  // ✅ Return the fields the UI expects
  return NextResponse.json({
    face,              // 1..6 (number)
    win: outcome.win,  // boolean
    payout: outcome.win ? payoutAddIfWin : 0,
    message,           // human text
  });
}
