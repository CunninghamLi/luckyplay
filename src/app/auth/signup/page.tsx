"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const password = String(fd.get("password") || "");
    const name = ""; // If you add a name input later, read it here

    // 1) Create the account
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Sign up failed.");
      setBusy(false);
      return;
    }

    // 2) Auto sign-in and go to dashboard
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: true,
    });
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>

      {msg && (
        <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
          {msg}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
          type="email" name="email" placeholder="you@example.com" required
        />
        <input
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
          type="password" name="password" placeholder="********" minLength={8} required
        />
        <button
          className="w-full rounded-md bg-white text-black px-4 py-2 disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
