import GameCard from "@/components/GameCard";

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Games</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <GameCard title="Coin Flip" href="/games/coinflip" description="Pick heads or tails & set your wager." />
        <GameCard title="Dice" href="/games/dice" description="Guess 1–6. Exact hit pays 5x." />
        <GameCard title="Slots" href="/games/slots" description="3x3 reels, small chance of big-ish demo win." />
      </div>
    </div>
  );
}
