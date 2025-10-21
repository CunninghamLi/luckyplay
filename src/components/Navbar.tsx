"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm transition ${
        active ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { status } = useSession();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-black/40">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/luckyplaylogo.png"
            alt="LuckyPlay"
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
          <span className="text-xl font-semibold tracking-tight">LuckyPlay</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/games">Games</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost">
              Sign out
            </button>
          ) : (
            <button onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })} className="btn-primary">
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
