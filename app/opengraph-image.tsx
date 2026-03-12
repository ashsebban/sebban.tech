import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, HERO_SUBTITLE } from "@/lib/constants";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Accent rule */}
        <div
          style={{
            width: 48,
            height: 4,
            backgroundColor: "#3b82f6",
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#fafafa",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {SITE_NAME}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#3b82f6",
            marginBottom: 20,
          }}
        >
          {SITE_TAGLINE}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "#a1a1aa",
            lineHeight: 1.5,
            maxWidth: 800,
          }}
        >
          {HERO_SUBTITLE}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 18,
            color: "#52525b",
          }}
        >
          ashersebban.com
        </div>
      </div>
    ),
    size
  );
}
