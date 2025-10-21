import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container-page py-10">{children}</main>
      <Footer />
    </>
  );
}
