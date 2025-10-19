import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const top = await prisma.wallet.findMany({
    select: { credits: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { credits: "desc" },
    take: 20
  });
  return NextResponse.json(top);
}
