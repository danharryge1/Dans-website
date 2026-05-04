import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0D544C",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        }}
      >
        <span
          style={{
            color: "#C8A55C",
            fontSize: "16px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            fontFamily: "serif",
          }}
        >
          DG
        </span>
      </div>
    ),
    { ...size }
  );
}
