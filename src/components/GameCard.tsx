import Link from "next/link";

export default function GameCard({
  title,
  href,
  emoji,
  desc
}: { title: string; href: string; emoji: string; desc: string; }) {
  return (
    <Link href={href} className="card group hover:border-white/20 transition">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
          {emoji}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-white/70">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
