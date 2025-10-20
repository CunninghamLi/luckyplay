"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const sp = useSearchParams();
  const [msg, setMsg] = useState<string | null>(null);
  const callbackUrl = sp.get("callbackUrl") || "/dashboard";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    // Let NextAuth set the cookie THEN redirect (prevents “half the time” loops)
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: true,
    });
    // no manual router.* call
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
               type="email" name="email" placeholder="you@example.com" required />
        <input className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
               type="password" name="password" placeholder="********" required />
        <button className="w-full rounded-md bg-white text-black px-4 py-2">Sign in</button>
      </form>

      {msg && <p className="text-neutral-300">{msg}</p>}

      <p className="text-sm text-neutral-400 text-center">
        New here?{" "}
        <Link
          href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-blue-400 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
