import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "LuckyPlay",
  description: "Demo casino app using fake credits"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* ✅ Wrap everything in a client component */}
        <SessionWrapper>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
