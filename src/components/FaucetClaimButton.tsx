// src/components/FaucetClaimButton.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function FaucetClaimButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function claim() {
    setMsg(null);
    try {
      const res = await fetch("/api/credits/faucet", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.message || "You’ve already claimed your one-time faucet.");
        return;
      }
      setMsg(data.message || "Credits granted!");
      // Refresh server components so balance updates
      startTransition(() => router.refresh());
    } catch {
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={claim}
        disabled={pending}
        className="btn-ghost disabled:opacity-50"
      >
        {pending ? "Claiming..." : "Claim Faucet"}
      </button>
      {msg && (
        <p className="text-sm text-white/70">
          {msg}
        </p>
      )}
    </div>
  );
}
