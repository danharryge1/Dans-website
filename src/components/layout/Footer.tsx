export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t py-4 text-center"
      style={{ borderColor: "var(--grid-line)" }}
    >
      <p
        className="text-[12px] uppercase tracking-[0.05em]"
        style={{ fontFamily: "var(--font-marker)", color: "var(--text-secondary)" }}
      >
        © {year} DanGeorge.studio. Every pixel considered.
      </p>
    </footer>
  );
}
