"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    return (
      <button
        onClick={async () => { await signOut({ redirect: false }); router.refresh(); }}
        className="rounded-md border border-neutral-700 px-4 py-2 hover:bg-neutral-800"
      >
        Sign out
      </button>
    );
  }

  return (
    <Link href="/auth/signin" className="rounded-md border border-neutral-700 px-4 py-2 hover:bg-neutral-800">
      Sign in
    </Link>
  );
}
