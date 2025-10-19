import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthedUser } from "@/lib/auth-guards";
import { resolveDice } from "@/lib/game-logic/dice";

const bodySchema = z.object({
  bet: z.number().int().min(1),
  guess: z.number().int().min(1).max(6)
});

export async function POST(req: Request) {
  const { user, prisma } = await getAuthedUser();
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse({ ...json, bet: Number(json.bet), guess: Number(json.guess) });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { bet, guess } = parsed.data;
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet || wallet.credits < bet) return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });

  const outcome = resolveDice(guess);
  const payout = outcome.win ? bet * 5 : 0;

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { userId: user.id }, data: { credits: { decrement: bet } } });
    if (payout > 0) await tx.wallet.update({ where: { userId: user.id }, data: { credits: { increment: payout } } });
    await tx.bet.create({
      data: {
        userId: user.id,
        game: "DICE",
        wager: bet,
        outcome: outcome.roll.toString(),
        payout
      }
    });
  });

  return NextResponse.json({
    message: `Rolled ${outcome.roll}. ${outcome.win ? `You won ${payout - bet}!` : "You lost."}`
  });
}
