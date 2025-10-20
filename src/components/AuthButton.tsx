"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type Props = {
  variant?: "primary" | "outline" | "ghost";
};

export default function AuthButton({ variant = "outline" }: Props) {
  const { status } = useSession();
  const router = useRouter();

  const base =
    "rounded-md px-4 py-2 transition inline-flex items-center justify-center";
  const styles = {
    primary: "bg-white text-black hover:bg-neutral-200",
    outline: "border border-neutral-700 hover:bg-neutral-800",
    ghost: "text-white/80 hover:text-white hover:bg-white/5",
  } as const;

  if (status === "authenticated") {
    return (
      <button
  onClick={() => signOut({ callbackUrl: "/" })} // NextAuth clears cookie then redirects
  className="rounded-md px-4 py-2"
>
        Sign out
      </button>
    );
  }

  return (
    <Link href="/auth/signin" className={clsx(base, styles[variant])}>
      Sign in
    </Link>
  );
}
