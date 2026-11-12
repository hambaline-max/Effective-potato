
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type MotionStyle =
  | "clay"
  | "3d"
  | "documentary"
  | "infographic"
  | "pixel"
  | "kinetic";

export type MotionProps = {
  title: string;
  subtitle: string;
  style: MotionStyle;
};

const themes: Record<MotionStyle, {
  background: string;
  accent: string;
  label: string;
}> = {
  clay: {
    background: "linear-gradient(145deg,#34495e,#18212f)",
    accent: "#ffb36b",
    label: "CLAY MOTION",
  },
  "3d": {
    background: "linear-gradient(145deg,#102c50,#090d20)",
    accent: "#55d6ff",
    label: "3D EXPLAINER",
  },
  documentary: {
    background: "linear-gradient(145deg,#393126,#141414)",
    accent: "#e8c58c",
    label: "DOCUMENTARY",
  },
  infographic: {
    background: "linear-gradient(145deg,#102d36,#101b2c)",
    accent: "#49e0b2",
    label: "INFOGRAPHIC",
  },
  pixel: {
    background: "#17132e",
    accent: "#f8e45c",
    label: "PIXEL WORLD",
  },
  kinetic: {
    background: "linear-gradient(145deg,#401d65,#101020)",
    accent: "#ff6baf",
    label: "KINETIC TYPE",
  },
};

export const MotionStudio: React.FC<MotionProps> = ({
  title,
  subtitle,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = themes[style] ?? themes.infographic;

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const exit = interpolate(
    frame,
    [100, 125],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const floatY = Math.sin(frame / 12) * 18;
  const scale = interpolate(enter, [0, 1], [0.75, 1]);

  const isPixel = style === "pixel";

  return (
    <AbsoluteFill
      style={{
        background: theme.background,
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: isPixel ? "monospace" : "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1.5px)",
          backgroundSize: isPixel ? "18px 18px" : "35px 35px",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 160,
          width: 600,
          height: 600,
          borderRadius: isPixel ? 0 : "50%",
          background: theme.accent,
          filter: isPixel ? "none" : "blur(100px)",
          opacity: 0.16,
          transform: `translateY(${floatY}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 190,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 8,
          color: theme.accent,
          opacity: exit,
        }}
      >
        {theme.label}
      </div>

      <div
        style={{
          width: 850,
          textAlign: "center",
          transform: `translateY(${(1 - enter) * 100}px) scale(${scale})`,
          opacity: enter * exit,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 1.15,
            textShadow: isPixel
              ? "6px 6px #000"
              : "0 8px 35px rgba(0,0,0,.3)",
            overflowWrap: "break-word",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 55,
            fontSize: 38,
            lineHeight: 1.5,
            color: "#e5e7eb",
            opacity: interpolate(
              frame,
              [15, 35],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            width: 150,
            height: 9,
            margin: "65px auto 0",
            borderRadius: isPixel ? 0 : 20,
            background: theme.accent,
            transform: `scaleX(${enter})`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 130,
          fontSize: 22,
          color: "#ffffff99",
          letterSpacing: 4,
        }}
      >
        ONE LINE MOTION STUDIO
      </div>
    </AbsoluteFill>
  );
};