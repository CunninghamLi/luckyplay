import GameCard from "@/components/GameCard";

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <header className="card">
        <h1 className="text-2xl font-bold">Games</h1>
        <p className="text-white/70">Wager demo credits on simple games of chance.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GameCard title="Coin Flip" href="/games/coinflip" emoji="🪙" desc="Heads or tails — double or nothing." />
        <GameCard title="Dice" href="/games/dice" emoji="🎲" desc="Roll high to win the pot." />
        <GameCard title="Slots" href="/games/slots" emoji="🎰" desc="Line up symbols for prizes." />
      </div>
    </div>
  );
}
