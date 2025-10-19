import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@demo.dev";

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "Demo",
        wallet: { create: { credits: 1000 } }
      }
    });
  } else {
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: { credits: 1000 },
      create: { userId: user.id, credits: 1000 }
    });
  }

  console.log("✅ Seeded demo user:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
