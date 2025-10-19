"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton({ variant }: { variant?: "primary" }) {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    return (
      <button
        onClick={async () => {
          await signOut({ redirect: false });
          router.refresh();
        }}
        className="rounded-md border border-neutral-700 px-4 py-2 hover:bg-neutral-800"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={async () => {
        await signIn("credentials", {
          email: `demo-${crypto.randomUUID().slice(0, 8)}@demo.dev`,
          redirect: false,               // 👈 important
        });
        router.refresh();                // 👈 pull fresh session
      }}
      className={
        variant === "primary"
          ? "rounded-md bg-white text-black px-4 py-2"
          : "rounded-md border border-neutral-700 px-4 py-2 hover:bg-neutral-800"
      }
    >
      Demo Sign in
    </button>
  );
}
