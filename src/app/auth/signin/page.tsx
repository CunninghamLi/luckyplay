"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 👈 add this import

export default function SignInPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) return setMsg("Invalid credentials");
    router.replace("/dashboard");
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <input
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
          type="password"
          name="password"
          placeholder="********"
          required
        />
        <button className="w-full rounded-md bg-white text-black px-4 py-2">
          Sign in
        </button>
      </form>

      {msg && <p className="text-neutral-300">{msg}</p>}

      {/* 👇 new line for users who don’t have an account */}
      <p className="text-sm text-neutral-400">
        Don’t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-400 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
