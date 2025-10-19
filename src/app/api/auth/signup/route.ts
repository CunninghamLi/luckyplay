import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72) // bcrypt practical limit
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        name: email.split("@")[0],
        passwordHash,
        wallet: { create: { credits: 0 } } // start at 0; use faucet to top up
      }
    });

    return NextResponse.json({ ok: true, message: "Account created. You can sign in now." });
  } catch (e) {
    console.error("signup error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
