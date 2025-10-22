"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** The final symbol to show when spinning stops */
  symbol: string;
  /** Whether the reel is spinning */
  spinning: boolean;
  /** Milliseconds between symbol changes while spinning */
  tickMs?: number;
  /** Size (px) of the square reel face */
  size?: number;
  /** Optional fixed set of symbols (same order across reels) */
  symbols?: string[];
};

const DEFAULTS = ["🍒","🍋","🔔","⭐","💎","7️⃣"];

export default function SlotReel({
  symbol,
  spinning,
  tickMs = 80,
  size = 88,
  symbols = DEFAULTS,
}: Props) {
  const mounted = useRef(false);
  const list = useMemo(() => symbols, [symbols]);
  const [index, setIndex] = useState(() => {
    // initial index matches target symbol or random
    const i = list.indexOf(symbol);
    return i >= 0 ? i : Math.floor(Math.random() * list.length);
  });

  // spin by cycling the index while spinning = true
  useEffect(() => {
    mounted.current = true;
    if (!spinning) {
      // snap to final
      const i = list.indexOf(symbol);
      if (i >= 0) setIndex(i);
      return;
    }
    let i = index;
    const id = setInterval(() => {
      i = (i + 1) % list.length;
      if (mounted.current) setIndex(i);
    }, tickMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, tickMs, list, symbol]);

  // gentle motion on change
  const [pop, setPop] = useState(false);
  useEffect(() => {
    setPop(true);
    const t = setTimeout(() => setPop(false), 180);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="relative rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,.35)] border border-black/10 select-none"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 grid place-items-center text-4xl">
        <div className={`transition-transform duration-150 ${pop ? "scale-110" : "scale-100"}`}>
          {list[index]}
        </div>
      </div>

      {/* subtle slot “window” mask & glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/20 to-transparent rounded-t-xl" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent rounded-b-xl" />
      </div>
    </div>
  );
}
