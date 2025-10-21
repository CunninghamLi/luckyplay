"use client";

import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  default: "Sign in failed. Please try again.",
};

export default function SignInForm({
  callbackUrl,
  error,
}: {
  callbackUrl: string;
  error?: string;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const errorBoxRef = useRef<HTMLDivElement | null>(null);

  // show server-provided error (?error=...) on first render
  useEffect(() => {
    if (error) setMsg(MESSAGES[error] || MESSAGES.default);
  }, [error]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    // Let NextAuth handle cookie + redirect
    await signIn("credentials", { email, password, callbackUrl, redirect: true });
    // If credentials are wrong, NextAuth will redirect back here with ?error=CredentialsSignin
  }

  // auto-focus error for accessibility
  useEffect(() => {
    if (msg && errorBoxRef.current) errorBoxRef.current.focus();
  }, [msg]);

  return (
    <div className="max-w-sm mx-auto space-y-4 py-8">
      <h1 className="text-2xl font-bold">Sign in</h1>

      {msg && (
        <div
          ref={errorBoxRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-300 px-3 py-2 text-sm"
        >
          {msg}
        </div>
      )}

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
        <button className="w-full rounded-md bg-white text-black px-4 py-2">Sign in</button>
      </form>

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
