"use client";

import { useState } from "react";
import Coin from "@/components/animations/Coin";

type Face = "H" | "T";

function toFace(result: "heads" | "tails"): Face {
  return result === "heads" ? "H" : "T";
}

export default function CoinFlipPage() {
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState<"heads" | "tails">("heads");
  const [spinning, setSpinning] = useState(false);
  const [face, setFace] = useState<Face>("H");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function play() {
    setBusy(true);
    setMsg(null);
    setSpinning(true);

    try {
      const res = await fetch("/api/games/coinflip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet, side: choice }),
      });
      const data = await res.json().catch(() => ({}));

      // If server rejected (insufficient credits, invalid input), stop and show message
      if (!res.ok) {
        setSpinning(false);
        setMsg(data.message || "Something went wrong.");
        setBusy(false);
        return;
      }

      // Stop after the CSS animation (~0.8s)
      setTimeout(() => {
        setSpinning(false);

        // Use exactly what the server decided
        if (data && (data.result === "heads" || data.result === "tails")) {
          setFace(toFace(data.result));
          setMsg(data.message || (data.win ? "You won!" : "You lost."));
        } else {
          setMsg("Unexpected server response.");
        }
      }, 820);
    } catch {
      setSpinning(false);
      setMsg("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <div className="card">
        <h1 className="text-xl font-semibold">Coin Flip</h1>
        <p className="text-sm text-white/70 mt-1">Pick a side and place a wager.</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            className={`btn ${choice === "heads" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setChoice("heads")}
            disabled={busy}
          >
            Heads
          </button>
          <button
            className={`btn ${choice === "tails" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setChoice("tails")}
            disabled={busy}
          >
            Tails
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-white/70 mb-1">Bet</label>
          <input
            type="number"
            min={1}
            step={1}
            value={bet}
            onChange={(e) => setBet(Math.max(1, Number(e.target.value || 1)))}
            className="w-full rounded-md border border-white/10 bg-neutral-900 p-2"
            disabled={busy}
          />
        </div>

        <button onClick={play} disabled={busy} className="mt-4 btn-primary w-full">
          {busy ? "Flipping..." : "Flip"}
        </button>

        {msg && (
          <div className="mt-4 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
            {msg}
          </div>
        )}
      </div>

      <div className="card flex items-center justify-center">
        <Coin face={face} spinning={spinning} size={140} />
      </div>
    </div>
  );
}
