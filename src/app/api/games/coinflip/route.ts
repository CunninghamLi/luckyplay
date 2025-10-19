import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthedUser, UnauthorizedError } from "@/lib/auth-guards";
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
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const { bet, side } = parsed.data;
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet || wallet.credits < bet) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }

    const outcome = resolveCoinFlip(side);
    const payout = outcome.win ? bet * 2 : 0;

    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({ where: { userId: user.id }, data: { credits: { decrement: bet } } });
      if (payout > 0) {
        await tx.wallet.update({ where: { userId: user.id }, data: { credits: { increment: payout } } });
      }
      await tx.bet.create({
        data: { userId: user.id, game: "COINFLIP", wager: bet, outcome: outcome.result, payout }
      });
    });

    return NextResponse.json({
      message: `Result: ${outcome.result}. ${outcome.win ? `You won ${payout - bet}!` : "You lost."}`
    });
  } catch (e: any) {
    if (e?.name === "UnauthorizedError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("coinflip error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
