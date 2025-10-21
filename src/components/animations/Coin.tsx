"use client";

import { useEffect, useRef } from "react";

export default function Coin({
  face,           // "H" | "T"
  spinning,       // boolean
  size = 96,
}: {
  face: "H" | "T";
  spinning?: boolean;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // restart CSS animation when `spinning` toggles true
  useEffect(() => {
    if (!spinning || !ref.current) return;
    const el = ref.current;
    el.style.animation = "none";
    // force reflow
    void el.offsetHeight;
    el.style.animation = `coin-spin 0.8s cubic-bezier(.2,.6,.2,1) 1`;
  }, [spinning]);

  return (
    <div
      ref={ref}
      className="relative rounded-full bg-gradient-to-br from-white to-neutral-200 text-black shadow-[0_10px_30px_rgba(0,0,0,.35)] select-none"
      style={{ width: size, height: size }}
      aria-label={face === "H" ? "Heads" : "Tails"}
    >
      <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-neutral-100 to-neutral-300 border border-black/10" />
      <div className="relative z-10 flex h-full items-center justify-center text-2xl font-bold">
        {face === "H" ? "H" : "T"}
      </div>
    </div>
  );
}
