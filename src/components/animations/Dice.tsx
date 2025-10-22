"use client";

import { useEffect, useRef } from "react";

function Pips({ face }: { face: 1|2|3|4|5|6 }) {
  // positions in a 3x3 grid (1..9)
  const map: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };
  const spots = map[face] || map[1];

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2">
      {Array.from({ length: 9 }).map((_, i) => {
        const idx = i + 1;
        const on = spots.includes(idx);
        return (
          <div key={idx} className="flex items-center justify-center">
            <div
              className={`rounded-full ${on ? "bg-black/90" : "bg-transparent"}`}
              style={{ width: 10, height: 10 }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Dice({
  face,
  rolling = false,
  size = 110,
}: {
  face: 1|2|3|4|5|6;
  rolling?: boolean;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rolling || !ref.current) return;
    const el = ref.current;
    // restart CSS animations
    el.style.animation = "none";
    void el.offsetHeight; // reflow
    el.style.animation = `
      dice-spin 0.6s ease-in-out 1,
      dice-bounce 0.6s ease-in-out 1
    `;
  }, [rolling]);

  return (
    <div
      ref={ref}
      className="anim-dice rounded-xl bg-gradient-to-br from-white to-neutral-200 shadow-[0_12px_30px_rgba(0,0,0,.35)] border border-black/10 select-none"
      style={{ width: size, height: size }}
      aria-label={`Dice shows ${face}`}
    >
      <Pips face={face} />
    </div>
  );
}
