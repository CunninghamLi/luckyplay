import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth-guards";

export async function GET() {
  const { user, prisma } = await getAuthedUser();
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ credits: wallet?.credits ?? 0 });
}
