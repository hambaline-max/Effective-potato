
import React from "react";
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const scenes = [
  {
    style: "CLAY ANIMATION",
    title: "KENAPA KUCING SUKA MINUM AIR TOILET?",
    subtitle: "Ada alasan unik di balik kebiasaan ini!",
    icon: "🐱",
    bg: "linear-gradient(145deg, #293c52, #597d91)",
    accent: "#ffd27a",
  },
  {
    style: "3D ANIMATION",
    title: "AIR TOILET TERLIHAT MENARIK",
    subtitle: "Kucing penasaran dengan air yang bergerak.",
    icon: "🚽",
    bg: "linear-gradient(145deg, #273c80, #39a9bd)",
    accent: "#a6f3ff",
  },
  {
    style: "DOCUMENTARY",
    title: "INDRA PENCIUMAN KUCING",
    subtitle: "Aroma dan rasa air bisa memengaruhi pilihan mereka.",
    icon: "🔍",
    bg: "linear-gradient(145deg, #26352c, #637c52)",
    accent: "#d4f0a2",
  },
  {
    style: "INFOGRAPHIC",
    title: "3 ALASAN UTAMA",
    subtitle: "Rasa ingin tahu • Suhu • Sumber air",
    icon: "💧",
    bg: "linear-gradient(145deg, #164e73, #238eaa)",
    accent: "#a6f3ff",
  },
  {
    style: "PIXEL ART",
    title: "TAPI HATI-HATI!",
    subtitle: "Air toilet dapat mengandung bakteri dan residu pembersih.",
    icon: "⚠️",
    bg: "linear-gradient(145deg, #30204e, #774b91)",
    accent: "#ffdb78",
  },
  {
    style: "KINETIC TYPOGRAPHY",
    title: "SEDIAKAN AIR BERSIH!",
    subtitle: "Gunakan mangkuk bersih atau pet fountain untuk kucing.",
    icon: "❤️",
    bg: "linear-gradient(145deg, #71344e, #b75a72)",
    accent: "#ffe0a6",
  },
];

 const CatCharacter: React.FC<{frame: number; sceneIndex: number}> = ({frame, sceneIndex}) => {
 const bob = Math.sin(frame / 8) * 7;

const tilt =
  sceneIndex === 0 ? Math.sin(frame / 10) * 6 :
  sceneIndex === 1 ? -8 + Math.sin(frame / 7) * 3 :
  sceneIndex === 2 ? 5 :
  sceneIndex === 3 ? Math.sin(frame / 6) * 9 :
  sceneIndex === 4 ? -5 :
  Math.sin(frame / 9) * 3;
const blinkFrame = frame % 150;
const blink = Math.max(0, 1 - Math.abs(blinkFrame - 2) / 2);
const eyeRy = 25 * (1 - blink * 0.94);
const pupilRy = 17 * (1 - blink * 0.95);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "48%",
transform: `translate(-50%, -50%) translateY(${bob}px) rotate(${tilt}deg)`,
        width: 440,
        height: 440,
      }}
    >
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <ellipse cx="200" cy="365" rx="115" ry="20" fill="#172554" opacity="0.2"/>
        <path d="M110 145 L95 35 Q92 15 115 35 L175 95 Z" fill="#8995a5" stroke="#657386" strokeWidth="8"/>
        <path d="M290 145 L305 35 Q308 15 285 35 L225 95 Z" fill="#8995a5" stroke="#657386" strokeWidth="8"/>
        <path d="M110 145 L108 62 L155 112 Z" fill="#e9a9b7"/>
        <path d="M290 145 L292 62 L245 112 Z" fill="#e9a9b7"/>
        <ellipse cx="200" cy="270" rx="105" ry="105" fill="#9ca8b7"/>
        <ellipse cx="200" cy="185" rx="125" ry="115" fill="#aeb8c5"/>
        <ellipse cx="155" cy="175" rx="19" ry={eyeRy} fill="#d6a92e"/>
        <ellipse cx="245" cy="175" rx="19" ry={eyeRy} fill="#d6a92e"/>
        <ellipse cx="155" cy="177" rx="9" ry={pupilRy} fill="#252b35"/>
        <ellipse cx="245" cy="177" rx="9" ry={pupilRy} fill="#252b35"/>
        <circle cx="150" cy="166" r="5" fill="white"/>
        <circle cx="240" cy="166" r="5" fill="white"/>
        <ellipse cx="200" cy="220" rx="42" ry="30" fill="#dce1e8"/>
        <ellipse cx="200" cy="208" rx="12" ry="9" fill="#e99aaa"/>
        <path d="M200 217 Q190 235 180 225 M200 217 Q210 235 220 225" fill="none" stroke="#555b68" strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="115" cy="220" rx="20" ry="12" fill="#d98f9d" opacity="0.45"/>
        <ellipse cx="285" cy="220" rx="20" ry="12" fill="#d98f9d" opacity="0.45"/>
      </svg>
    </div>
  );
};

type ShortsStudioProps = {
  title?: string;
  subtitle?: string;
};

export const ShortsStudio: React.FC<ShortsStudioProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneDuration = fps * 5;
  const sceneIndex = Math.min(
    scenes.length - 1,
    Math.floor(frame / sceneDuration)
  );

  const scene = scenes[sceneIndex];
  const localFrame = frame % sceneDuration;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const opacity = interpolate(
    localFrame,
    [0, 12, sceneDuration - 12, sceneDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const progress = (frame / (fps * 30)) * 100;

  return (
    <AbsoluteFill
      style={{
        background: scene.bg,
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 65,
      }}
    >
      <CatCharacter frame={frame} sceneIndex={sceneIndex} />
      <div
        style={{
          position: "absolute",
          top: 75,
          fontSize: 22,
          letterSpacing: 5,
          fontWeight: 800,
          color: scene.accent,
        }}
      >
        {scene.style}
      </div>

      <div
        style={{
          fontSize: 150,
          transform: `scale(${0.7 + entrance * 0.3})`,
          opacity,
          marginBottom: 55,
        }}
      >
        {scene.icon}
      </div>

      <div
        style={{
          fontSize: 57,
          lineHeight: 1.2,
          textAlign: "center",
          fontWeight: 900,
          maxWidth: 950,
          transform: `translateY(${(1 - entrance) * 70}px)`,
          opacity,
        }}
      >
 {sceneIndex === 0 && title ? title : scene.title}   
      </div>

      <div
        style={{
          marginTop: 38,
          fontSize: 30,
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: 850,
          color: "#ffffff",
          opacity,
        }}
      >
      {sceneIndex === 0 && subtitle ? subtitle : scene.subtitle}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 85,
          width: "80%",
          height: 9,
          background: "#ffffff44",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: scene.accent,
            borderRadius: 20,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 43,
          fontSize: 20,
          letterSpacing: 3,
          color: "#ffffffbb",
        }}
      >
        ONE LINE MOTION STUDIO
      </div>
      
      <Audio src={staticFile("audio/rekaman-suara.m4a")} />
    </AbsoluteFill>
  );
};
