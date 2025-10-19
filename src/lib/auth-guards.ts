import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";  // ← this now exists
import { prisma } from "./prisma";

export class UnauthorizedError extends Error {
  constructor(msg = "Unauthorized") { super(msg); this.name = "UnauthorizedError"; }
}

export async function getAuthedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new UnauthorizedError();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new UnauthorizedError();

  await prisma.wallet.upsert({
    where: { userId: user.id }, update: {}, create: { userId: user.id }
  });

  return { prisma, user };
}
