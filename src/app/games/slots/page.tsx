"use client";

import { useState } from "react";
import SlotReel from "@/components/animations/SlotReel";

const SYMBOLS = ["🍒","🍋","🔔","⭐","💎","7️⃣"] as const;
type Sym = typeof SYMBOLS[number];

export default function SlotsPage() {
  const [bet, setBet] = useState(5);
  const [spins, setSpins] = useState([false, false, false]);
  const [faces, setFaces] = useState<Sym[]>(["🍒","🍋","🔔"]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function spin() {
    if (busy) return;
    setBusy(true);
    setMsg(null);

    // start all reels
    setSpins([true, true, true]);

    try {
      const res = await fetch("/api/games/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet }),
      });
      const data = await res.json().catch(() => ({}));

      // after fetch & JSON parse
if (!res.ok) {
  setSpins([false, false, false]);
  setMsg(data.message || "Something went wrong.");
  setBusy(false);
  return;
}

// Use the server-authoritative symbols
const symbols = Array.isArray(data.symbols) && data.symbols.length === 3
  ? data.symbols as typeof faces
  : (["🍒","🍋","🔔"] as typeof faces);

// Staggered stop using those exact symbols
setTimeout(() => { 
  setSpins(([_, b, c]) => [false, b, c]); 
  setFaces(([_, ...rest]) => [symbols[0], ...rest]);
}, 900);

setTimeout(() => { 
  setSpins(([a, _, c]) => [a, false, c]); 
  setFaces(([a, _, c]) => [a, symbols[1], c]);
}, 1200);

setTimeout(() => {
  setSpins(([a, b, _]) => [a, b, false]);
  setFaces(([a, b, _]) => [a, b, symbols[2]]);
  setMsg(data.message || (data.win ? "You won!" : "No win, try again."));
  setBusy(false);
}, 1500);

    } catch {
      setSpins([false,false,false]);
      setMsg("Network error. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[420px_1fr]">
      {/* LEFT: controls */}
      <div className="card p-6">
        <h1 className="text-xl font-semibold">🎰 Slots</h1>
        <p className="text-sm text-white/70 mt-1">Match 3 for a 7x payout. 2 matches refunds your bet.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Wager (credits)</label>
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

          <button
            onClick={spin}
            disabled={busy}
            className="btn-primary w-full disabled:opacity-50"
          >
            {busy ? "Spinning…" : "Spin"}
          </button>

          {msg && (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                msg.toLowerCase().includes("won")
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {msg}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: reels */}
      <div className="card p-8">
        <div className="mx-auto flex items-center justify-center gap-6">
          <SlotReel symbol={faces[0]} spinning={spins[0]} />
          <SlotReel symbol={faces[1]} spinning={spins[1]} />
          <SlotReel symbol={faces[2]} spinning={spins[2]} />
        </div>
      </div>
    </div>
  );
}
