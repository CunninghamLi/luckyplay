import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="py-14">
        <div className="max-w-3xl">
          <span className="tag">Demo credits only</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to <span className="text-white/90">LuckyPlay</span>
          </h1>
          <p className="mt-4 text-white/70 leading-relaxed">
            Play short, luck-based mini games. Sign up, claim your faucet, place small bets,
            and track your results — all with demo credits.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/games" className="btn-primary">Browse Games</Link>
            <Link href="/dashboard" className="btn-ghost">Go to Dashboard</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <h3 className="font-semibold text-lg">🪙 Coin Flip</h3>
          <p className="text-sm text-white/70 mt-2">50/50 odds. Pick a side and place your wager.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg">🎲 Dice</h3>
          <p className="text-sm text-white/70 mt-2">Bet high/low or pick exact numbers for bigger payout.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg">🎰 Slots</h3>
          <p className="text-sm text-white/70 mt-2">Spin the reels — multiplier wins possible.</p>
        </div>
      </section>
    </>
  );
}
