import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthedUser } from "@/lib/auth-guards";
import { resolveSlots } from "@/lib/game-logic/slots";

const bodySchema = z.object({ bet: z.number().int().min(1) });

export async function POST(req: Request) {
  const { user, prisma } = await getAuthedUser();
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse({ ...json, bet: Number(json.bet) });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { bet } = parsed.data;
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet || wallet.credits < bet) return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });

  const outcome = resolveSlots();
  const payout = outcome.payoutMultiplier * bet;

  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({ where: { userId: user.id }, data: { credits: { decrement: bet } } });
    if (payout > 0) await tx.wallet.update({ where: { userId: user.id }, data: { credits: { increment: payout } } });
    await tx.bet.create({
      data: {
        userId: user.id,
        game: "SLOTS",
        wager: bet,
        outcome: outcome.reels.join(""),
        payout
      }
    });
  });

  return NextResponse.json({
    message: `Reels: ${outcome.reels.join(" | ")}. ${payout > 0 ? `You won ${payout - bet}!` : "You lost."}`
  });
}
