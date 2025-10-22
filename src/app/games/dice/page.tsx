"use client";

import { useState } from "react";
import Dice from "@/components/animations/Dice";
import BetForm from "@/components/BetForm";

type Face = 1 | 2 | 3 | 4 | 5 | 6;

export default function DicePage() {
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState<Face>(6);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onBet(bet: number, payload: { guess: number }) {
    const guess = Math.min(6, Math.max(1, Number(payload.guess || 6))) as Face;
    setMsg(null);
    setBusy(true);
    setRolling(true);

    try {
      const res = await fetch("/api/games/dice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet, guess }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRolling(false);
        setMsg(data.message || "Something went wrong.");
        setBusy(false);
        return;
      }

      setTimeout(() => {
        setRolling(false);
        const f = [1, 2, 3, 4, 5, 6].includes(data.face)
          ? (data.face as Face)
          : guess;
        setFace(f);
        setMsg(data.message || (data.win ? "You won!" : "You lost."));
      }, 620);
    } catch {
      setRolling(false);
      setMsg("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[340px_1fr]">
      {/* LEFT PANEL */}
      <div className="card p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            🎲 Dice Roll
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Guess a number and roll the die, 5x payout.
          </p>

          {/* Form Section */}
          <div className="mt-4 space-y-4">
            <BetForm
              min={1}
              label="Wager (credits)"
              extraFields={
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm text-white/70">Guess:</label>
                  <input
                    type="number"
                    name="guess"
                    min={1}
                    max={6}
                    defaultValue={6}
                    className="w-16 text-center rounded-md bg-neutral-900 border border-neutral-700 p-2"
                  />
                </div>
              }
              onSubmit={(bet, formData) =>
                onBet(bet, { guess: Number(formData.get("guess") || 6) })
              }
            />

            {/* Centered Bet Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }}
                disabled={busy}
                className="mt-3 btn-primary w-1/2 text-center disabled:opacity-50"
              >
                {busy ? "Rolling..." : "Bet"}
              </button>
            </div>
          </div>

          {msg && (
            <div
              className={`mt-4 rounded-md border px-3 py-2 text-sm ${
                msg.includes("won")
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {msg}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="card flex items-center justify-center p-8">
        <Dice face={face} rolling={rolling} size={150} />
      </div>
    </div>
  );
}
