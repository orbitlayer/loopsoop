import { ImageResponse } from "next/og";
import { site } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — Premium Video Editing & Production`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e0e",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 128, fontWeight: 700, letterSpacing: 18 }}>
          LOOPSOOP
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#9a9a9a",
          }}
        >
          Edit. Connect. Elevate.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 60,
            fontSize: 24,
            color: "#6d6d6d",
          }}
        >
          Premium Video Editing &amp; Production
        </div>
      </div>
    ),
    { ...size },
  );
}
