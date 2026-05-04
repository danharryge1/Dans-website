import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B2422",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #C8A55C 0%, rgba(200,165,92,0.2) 100%)",
          }}
        />

        {/* Teal radial glow — top right */}
        <div
          style={{
            position: "absolute",
            right: "-120px",
            top: "-120px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(15,106,97,0.35) 0%, transparent 65%)",
          }}
        />

        {/* Teal radial glow — bottom left */}
        <div
          style={{
            position: "absolute",
            left: "-60px",
            bottom: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(13,84,76,0.3) 0%, transparent 70%)",
          }}
        />

        {/* DG monogram badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            background: "#0D544C",
            borderRadius: "10px",
            marginBottom: "48px",
            border: "1px solid rgba(200,165,92,0.25)",
          }}
        >
          <span
            style={{
              color: "#C8A55C",
              fontSize: "24px",
              fontWeight: "700",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.5px",
            }}
          >
            DG
          </span>
        </div>

        {/* Eyebrow */}
        <span
          style={{
            display: "block",
            fontSize: "14px",
            color: "#C8A55C",
            letterSpacing: "6px",
            fontFamily: "Georgia, serif",
            textTransform: "uppercase",
            opacity: 0.8,
            marginBottom: "20px",
          }}
        >
          PREMIUM WEB STUDIO
        </span>

        {/* Main headline */}
        <span
          style={{
            display: "block",
            fontSize: "96px",
            fontWeight: "700",
            color: "#F5F0F0",
            letterSpacing: "-3px",
            lineHeight: 0.95,
            fontFamily: "Georgia, serif",
            marginBottom: "36px",
          }}
        >
          DAN GEORGE
        </span>

        {/* Accent rule */}
        <div
          style={{
            width: "72px",
            height: "2px",
            background: "#C8A55C",
            opacity: 0.5,
            marginBottom: "28px",
          }}
        />

        {/* Tagline */}
        <span
          style={{
            fontSize: "24px",
            color: "#F5F0F0",
            opacity: 0.55,
            fontFamily: "Georgia, serif",
            letterSpacing: "0.5px",
          }}
        >
          Design. Development. Brand strategy.
        </span>

        {/* URL — bottom right */}
        <span
          style={{
            position: "absolute",
            bottom: "52px",
            right: "100px",
            fontSize: "16px",
            color: "#F5F0F0",
            opacity: 0.35,
            fontFamily: "Georgia, serif",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          dangeorge.studio
        </span>
      </div>
    ),
    { ...size }
  );
}
