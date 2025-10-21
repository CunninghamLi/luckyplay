import Link from "next/link";

const games = [
  { slug: "coinflip", name: "Coin Flip", desc: "Pick heads or tails, 50/50 odds.", emoji: "🪙" },
  { slug: "dice",     name: "Dice",     desc: "High/low or exact — pick your risk.", emoji: "🎲" },
  { slug: "slots",    name: "Slots",    desc: "Spin and match for multipliers.",     emoji: "🎰" },
];

export default function GamesIndex() {
  return (
    <>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Games</h1>
          <p className="text-white/70 mt-1">Choose a game and place a small wager with demo credits.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map(g => (
          <Link key={g.slug} href={`/games/${g.slug}`} className="card hover:bg-white/[.06] transition">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{g.emoji}</div>
              <div>
                <h3 className="font-semibold">{g.name}</h3>
                <p className="text-sm text-white/70 mt-1">{g.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-white/60">
                  Play now →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
