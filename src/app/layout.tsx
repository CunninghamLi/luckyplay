// src/app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "LuckyPlay",
  description: "Luck-based mini games with demo credits — no payments.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/luckyplaylogo.png",
  },
  openGraph: {
    title: "LuckyPlay",
    description: "Luck-based mini games with demo credits — no payments.",
    url: "https://luckyplay.vercel.app",
    siteName: "LuckyPlay",
    images: [{ url: "/luckyplaylogo.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LuckyPlay",
    description: "Luck-based mini games with demo credits — no payments.",
    images: ["/luckyplaylogo.png"],
  },
};


export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-black text-white font-sans selection:bg-white/20">
        {/* Skip link for keyboard users */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] rounded-md bg-white px-3 py-2 text-black"
        >
          Skip to content
        </a>

        <SessionWrapper>
          {/* Background layers: soft gradients + subtle grid */}
          <div className="min-h-dvh bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(14,165,233,.15),transparent_60%),radial-gradient(900px_400px_at_110%_-20%,rgba(34,211,238,.12),transparent_60%),#0a0a0a]">
            <div className="bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:24px_24px]">
              <Navbar />
              <main id="content" className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-8">
                {children}
              </main>
              {/* Remove this line if you don't want a footer */}
              <Footer />
            </div>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
