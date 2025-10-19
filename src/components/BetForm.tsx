"use client";

import { FormEvent, ReactNode, useRef } from "react";

export default function BetForm({
  min = 1,
  label,
  extraFields,
  onSubmit
}: {
  min?: number;
  label: string;
  extraFields?: ReactNode;
  onSubmit: (bet: number, formData: FormData) => void | Promise<void>;
}) {
  const ref = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const bet = Number(fd.get("bet") || 0);
    if (Number.isNaN(bet) || bet < min) return;
    await onSubmit(bet, fd);
    ref.current?.reset();
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="flex items-center gap-2">
      <label className="text-neutral-300">{label}</label>
      <input
        name="bet"
        type="number"
        min={min}
        defaultValue={min}
        className="rounded-md bg-neutral-900 border border-neutral-700 p-2 w-32"
      />
      {extraFields}
      <button type="submit" className="rounded-md bg-white text-black px-4 py-2">Bet</button>
    </form>
  );
}
