import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthedUser } from "@/lib/auth-guards";
import { resolveCoinFlip } from "@/lib/game-logic/coinflip";

const bodySchema = z.object({
  bet: z.number().int().min(1),
  side: z.enum(["heads", "tails"])
});

export async function POST(req: Request) {
  try {
    const { user, prisma } = await getAuthedUser();
    const json = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse({ ...json, bet: Number(json.bet) });
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const { bet, side } = parsed.data;

    // balance check
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet || wallet.credits < bet) {
      return NextResponse.json({ message: "Insufficient credits" }, { status: 400 });
    }

    // resolve outcome: { win: boolean, result: "heads" | "tails" }
    const outcome = resolveCoinFlip(side);
    // payout model = +bet if win, -bet if lose
    const payout = outcome.win ? bet : -bet;

    // record bet & apply credits atomically
    await prisma.$transaction(async (tx) => {
      await tx.bet.create({
        data: {
          userId: user.id,
          game: "COINFLIP",
          wager: bet,
          outcome: outcome.result, // "heads"/"tails" (or "win"/"lose" if your UI expects that)
          payout,                  // +bet or -bet
        },
      });
      await tx.wallet.update({
        where: { userId: user.id },
        data: { credits: { increment: payout } },
      });
    });

    const message = outcome.win
      ? `You won ${bet} credits!`
      : `You lost ${bet} credits.`;

    return NextResponse.json({
      win: outcome.win,
      result: outcome.result,    // "heads" | "tails"
      payout,                    // +bet or -bet
      message,
    });
  } catch (e: any) {
    if (e?.name === "UnauthorizedError") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("coinflip error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
