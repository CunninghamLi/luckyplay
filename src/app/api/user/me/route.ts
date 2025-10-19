import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    credits: (await prisma.wallet.findUnique({ where: { userId: user.id } }))?.credits ?? 0
  });
}
