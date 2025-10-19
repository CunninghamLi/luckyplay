"use client";

import { useState } from "react";
import BetForm from "@/components/BetForm";

export default function DicePage() {
  const [result, setResult] = useState<string | null>(null);

  async function onBet(bet: number, payload: { guess: number }) {
    const res = await fetch("/api/games/dice", {
      method: "POST",
      body: JSON.stringify({ bet, guess: payload.guess })
    });
    const json = await res.json();
    setResult(json.message || JSON.stringify(json));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dice</h1>
      <BetForm
        min={1}
        label="Wager (credits)"
        extraFields={
          <input
            type="number"
            name="guess"
            min={1}
            max={6}
            defaultValue={3}
            className="rounded-md bg-neutral-900 border border-neutral-700 p-2"
          />
        }
        onSubmit={(bet, formData) =>
          onBet(bet, { guess: Number(formData.get("guess") || 3) })
        }
      />
      {result && <p className="text-neutral-300">{result}</p>}
    </div>
  );
}
