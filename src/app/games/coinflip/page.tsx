"use client";

import { useState } from "react";
import BetForm from "@/components/BetForm";

export default function CoinFlipPage() {
  const [result, setResult] = useState<string | null>(null);

  async function onBet(bet: number, payload: { side: "heads" | "tails" }) {
    try {
      const res = await fetch("/api/games/coinflip", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // 👈 add
        body: JSON.stringify({ bet, side: payload.side })
      });

      // Try JSON first, fall back to text
      let data: any;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) data = await res.json();
      else data = { error: await res.text() };

      if (!res.ok) {
        setResult(data?.error || `Error ${res.status}`);
        return;
      }
      setResult(data?.message || JSON.stringify(data));
    } catch (err: any) {
      setResult(err?.message || "Network error");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Coin Flip</h1>
      <BetForm
        min={1}
        label="Wager (credits)"
        extraFields={
          <select name="side" className="rounded-md bg-neutral-900 border border-neutral-700 p-2">
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
        }
        onSubmit={(bet, fd) =>
          onBet(bet, { side: (fd.get("side") as "heads" | "tails") || "heads" })
        }
      />
      {result && <p className="text-neutral-300">{result}</p>}
    </div>
  );
}
