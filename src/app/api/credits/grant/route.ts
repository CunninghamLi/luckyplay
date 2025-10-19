import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth-guards";

const FAUCET_AMOUNT = 500;

export async function POST() {
  const { user, prisma } = await getAuthedUser();

  const claimed = await prisma.faucetClaim.findUnique({ where: { userId: user.id } });
  if (claimed) {
    return NextResponse.json({ message: "Faucet already claimed." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.faucetClaim.create({ data: { userId: user.id, amount: FAUCET_AMOUNT } });
    await tx.wallet.update({
      where: { userId: user.id },
      data: { credits: { increment: FAUCET_AMOUNT } }
    });
  });

  return NextResponse.json({ message: `Granted ${FAUCET_AMOUNT} demo credits.` });
}
