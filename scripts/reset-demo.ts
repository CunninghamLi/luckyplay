import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.bet.deleteMany({});
  const users = await prisma.user.findMany({ select: { id: true } });
  for (const u of users) {
    await prisma.wallet.upsert({
      where: { userId: u.id },
      update: { credits: 1000 },
      create: { userId: u.id, credits: 1000 }
    });
  }
  await prisma.faucetClaim.deleteMany({});
  console.log("Demo reset complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
