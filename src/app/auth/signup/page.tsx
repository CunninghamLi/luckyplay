"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    setMsg("Account created! Redirecting to sign in…");
    setTimeout(() => router.push("/auth/signin"), 800);
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
               type="email" name="email" placeholder="you@example.com" required />
        <input className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2"
               type="password" name="password" placeholder="********" minLength={8} required />
        <button className="w-full rounded-md bg-white text-black px-4 py-2">Sign up</button>
      </form>
      {msg && <p className="text-neutral-300">{msg}</p>}
    </div>
  );
}
