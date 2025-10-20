"use client";

import AuthButton from "@/components/AuthButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">LuckyPlay</h1>
      <p className="text-neutral-300 max-w-2xl">
        Welcome to LuckyPlay, play luck-based mini games!
        <br />
        <em>No real money, no payment processors.</em>
      </p>

      <div className="flex gap-3">
        <AuthButton variant="primary" />
        <Link
          href="/games"
          className="rounded-md border border-neutral-700 px-4 py-2 hover:bg-neutral-800"
        >
          Browse Games
        </Link>
      </div>

      <div className="rounded-lg border border-neutral-800 p-4">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <ol className="list-decimal pl-6 space-y-1 text-neutral-300">
          <li>Create an account.</li>
          <li>Claim a one-time faucet to get a starting 500 credits.</li>
          <li>Place small bets on the games.</li>
          <li>All results are RNG-backed and recorded in your history.</li>
        </ol>
      </div>
    </div>
  );
}
