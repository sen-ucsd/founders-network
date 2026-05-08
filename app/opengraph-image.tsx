import { ImageResponse } from "next/og";

export const alt =
  "Founders Network at UCSD — one network for every founder. Business, engineering, and science orgs in one place to find co-founders, talent, and the next thing to build.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Satori needs an actual TTF/OTF buffer (woff2 isn't supported), so we
  // pull the italic Instrument Serif file from npm's @fontsource package
  // which ships TTFs. Fall through to system serif if the fetch fails.
  let fontData: ArrayBuffer | null = null;
  try {
    const resp = await fetch(
      "https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/InstrumentSerif-Italic.ttf",
    );
    if (resp.ok) fontData = await resp.arrayBuffer();
  } catch {
    /* fall through to system fallback */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#080a0b",
          // Bone-grey + glacier-blue palette, mirroring the live site's
          // locked Bone/Glacier shader scheme. No amber or olive
          // anywhere.
          backgroundImage: [
            // Cool steel orb upper-right (echo of the live sphere)
            "radial-gradient(circle at 78% 28%, rgba(170, 178, 184, 0.42) 0%, rgba(85, 100, 110, 0.32) 22%, rgba(35, 42, 48, 0.50) 42%, transparent 62%)",
            // Glacier-blue accent lower-left
            "radial-gradient(circle at 20% 80%, rgba(94, 122, 138, 0.28) 0%, transparent 48%)",
            // Soft bone-cream bloom right of centre
            "radial-gradient(circle at 68% 56%, rgba(216, 221, 226, 0.12) 0%, transparent 55%)",
            // Deep cool base
            "radial-gradient(ellipse at 50% 50%, #14181c 0%, #0a0d10 60%, #060809 100%)",
          ].join(", "),
          color: "#f5f5f0",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Wordmark, top-left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.1,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#f5f5f0",
            }}
          >
            founders network
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.32em",
              color: "rgba(245, 245, 240, 0.55)",
              marginTop: 6,
              textTransform: "uppercase",
            }}
          >
            ucsd
          </div>
        </div>

        {/* Spacer pushes the headline to the visual center */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontFamily: fontData ? "Instrument Serif" : "Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 132,
            letterSpacing: "-0.02em",
            lineHeight: 0.98,
            color: "#f8f8f3",
            // Soft text shadow for readability against the orb gradient
            textShadow: "0 2px 40px rgba(0, 0, 0, 0.55)",
          }}
        >
          Founders, Without Limits.
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            lineHeight: 1.4,
            color: "rgba(245, 245, 240, 0.78)",
            maxWidth: 820,
          }}
        >
          One network for every founder at UCSD. Find co-founders, technical
          talent, and the next thing to build.
        </div>

        {/* Bottom-left badge mark */}
        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.30)",
              background: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#f5f5f0",
            }}
          >
            FN
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(245, 245, 240, 0.55)",
            }}
          >
            ucsdfounders.com
          </div>
        </div>

        {/* Faint inner border for that "card" feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid rgba(255, 255, 255, 0.04)",
            pointerEvents: "none",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Instrument Serif",
              data: fontData,
              style: "italic",
              weight: 400,
            },
          ]
        : undefined,
    },
  );
}
