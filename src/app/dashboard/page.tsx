import CreditBalance from "@/components/CreditBalance";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <CreditBalance />
      <div className="flex gap-3">
        <Link className="underline" href="/games">Play Games</Link>
        <Link className="underline" href="/api/stats/leaderboard">Leaderboard (JSON)</Link>
      </div>
    </div>
  );
}
