"use client";

import { useEffect, useState } from "react";

export default function CreditBalance() {
  const [credits, setCredits] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/credits/balance");
    if (res.ok) {
      const j = await res.json();
      setCredits(j.credits ?? 0);
    }
  }

  async function claim() {
    const res = await fetch("/api/credits/grant", { method: "POST" });
    const j = await res.json();
    setMsg(j.message || j.error);
    await refresh();
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="rounded-lg border border-neutral-800 p-4 space-y-2">
      <div className="text-neutral-300">Credits:</div>
      <div className="text-3xl font-bold">{credits ?? "—"}</div>
      <div className="flex gap-2">
        <button onClick={refresh} className="rounded-md border border-neutral-700 px-3 py-1 hover:bg-neutral-800">Refresh</button>
        <button onClick={claim} className="rounded-md bg-white text-black px-3 py-1">Claim Faucet</button>
      </div>
      {msg && <div className="text-sm text-neutral-400">{msg}</div>}
    </div>
  );
}
