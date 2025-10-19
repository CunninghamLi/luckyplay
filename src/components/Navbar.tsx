"use client";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/games", label: "Games" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          🎰 LuckyPlay
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "btn-ghost rounded-xl px-3 py-2",
                pathname?.startsWith(l.href) && "bg-white/10 text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="ml-2">
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
