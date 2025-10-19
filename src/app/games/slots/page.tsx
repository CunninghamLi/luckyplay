"use client";

import { useState } from "react";
import BetForm from "@/components/BetForm";

export default function SlotsPage() {
  const [result, setResult] = useState<string | null>(null);

  async function onBet(bet: number) {
    const res = await fetch("/api/games/slots", {
      method: "POST",
      body: JSON.stringify({ bet })
    });
    const json = await res.json();
    setResult(json.message || JSON.stringify(json));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Slots</h1>
      <BetForm min={1} label="Wager (credits)" onSubmit={(bet) => onBet(bet)} />
      {result && <p className="text-neutral-300">{result}</p>}
    </div>
  );
}
