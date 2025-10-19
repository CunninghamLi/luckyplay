import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Demo Email",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(credentials) {
        const email = (credentials?.email || "").trim().toLowerCase();
        if (!email || !email.includes("@")) return null;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: email.split("@")[0], wallet: { create: {credits:500} } }
          });
        }
        return { id: user.id, name: user.name ?? "", email: user.email };
      }
    }),
    Github({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) (session.user as any).id = token.sub;
      return session;
    }
  }
};
