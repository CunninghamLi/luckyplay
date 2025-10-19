import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = { title: "LuckyPlay", description: "Demo casino with fake credits" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white font-sans selection:bg-brand-500/40">
        <SessionWrapper>
          <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,.15),_transparent_40%)]">
            <div className="bg-casino-grid bg-[length:24px_24px]">
              <Navbar />
              <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            </div>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
