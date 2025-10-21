import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wallet: true, bets: { orderBy: { createdAt: "desc" }, take: 10 } }
  });

  const credits = user?.wallet?.credits ?? 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-white/70 mt-1">Your balance and recent bets</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card md:col-span-1">
          <div className="text-sm text-white/60">Balance</div>
          <div className="mt-2 text-4xl font-bold">{credits.toLocaleString()} <span className="text-white/60 text-xl">credits</span></div>
          <div className="mt-4 flex gap-2">
            <Link href="/api/credits/faucet" className="btn-ghost">Claim Faucet</Link>
            <Link href="/games" className="btn-primary">Play Games</Link>
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Bets</h3>
            <Link href="/dashboard/history" className="text-sm text-white/70 hover:text-white">View all</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr className="text-left">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Game</th>
                  <th className="py-2 pr-4">Wager</th>
                  <th className="py-2 pr-4">Outcome</th>
                  <th className="py-2 pr-4">Payout</th>
                </tr>
              </thead>
              <tbody>
              {(user?.bets ?? []).map(b => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="py-2 pr-4">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{b.game}</td>
                  <td className="py-2 pr-4">{b.wager}</td>
                  <td className="py-2 pr-4">{b.outcome}</td>
                  <td className={`py-2 pr-4 ${b.payout >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {b.payout}
                  </td>
                </tr>
              ))}
              {(user?.bets?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-white/60">No bets yet — <Link href="/games" className="underline">play your first game</Link>.</td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
