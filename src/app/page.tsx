import { Container } from "@/components/layout/Container";

export default function Home() {
  return (
    <Container className="py-40">
      <h1
        className="text-[64px] leading-none"
        style={{ fontFamily: "var(--font-comico)", color: "var(--text-primary)" }}
      >
        DanGeorge.studio
      </h1>
      <p className="mt-6" style={{ color: "var(--text-secondary)" }}>
        Layout shell wired. Hero and subsequent sections land in later phases.
      </p>
      {/* filler so we can scroll past 100px and exercise the Nav state */}
      <div style={{ height: "150vh" }} aria-hidden />
    </Container>
  );
}
