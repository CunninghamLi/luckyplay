"use client";
import Link from "next/link";
import AuthButton from "./AuthButton"; // 👈 relative path from same folder

export default function Navbar() {
  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          LuckyPlay
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/games" className="text-sm text-neutral-300 hover:text-white">
            Games
          </Link>
          <Link href="/dashboard" className="text-sm text-neutral-300 hover:text-white">
            Dashboard
          </Link>
          <AuthButton /> {/* 👈 this must be a real React component */}
        </nav>
      </div>
    </header>
  );
}
