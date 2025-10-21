export default function Footer() {
  return (
    <footer className="border-t border-white/10">
  <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 py-8 text-xs text-white/60">
    © {new Date().getFullYear()} LuckyPlay — demo credits only. No real money.
    <br />
    Built by{" "}
    <a
      href="https://github.com/CunninghamLi"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:underline"
    >
      Cunningham Li
    </a>
    .
  </div>
</footer>
  );
}
