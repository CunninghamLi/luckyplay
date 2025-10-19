import CreditBalance from "@/components/CreditsBalance";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="card relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-brand-500/20 blur-2xl" />
        <h1 className="mb-1 text-2xl font-bold">Your Wallet</h1>
        <p className="mb-4 text-white/70">Manage your demo credits and jump back into games.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="col-span-2">
            <CreditBalance />
          </div>
          <div className="space-y-2">
            <Link href="/games" className="btn-primary w-full">Play Games</Link>
            <form action="/api/credits/grant" method="post">
              <button className="btn-outline w-full" type="submit">💸 Claim Faucet</button>
            </form>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bets</h2>
          <span className="badge">demo</span>
        </div>
        <p className="text-white/60">Coming soon: your last 10 results with win/loss stats.</p>
      </section>
    </div>
  );
}
