import Link from "next/link";

export default function GameCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded-lg border border-neutral-800 p-4 hover:bg-neutral-900">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-neutral-300">{description}</p>
    </Link>
  );
}
