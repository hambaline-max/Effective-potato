import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { ShortsStudio } from "./ShortsStudio";

function VoiceStudio() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      chunks.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch {
      setError("Mikrofon tidak dapat diakses. Izinkan akses mikrofon di browser iPad.");
    }
  }

  function stopRecording() {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
    }
    setRecording(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#101114", color: "white", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <a href="/" style={{ color: "#8bd5ff" }}>← Kembali ke Beranda</a>
      <h1>Voice Studio</h1>
      <p>Rekam dan dengarkan suara langsung dari perangkat Anda.</p>
      <section style={{ maxWidth: 560, margin: "36px auto", padding: 24, background: "#202127", borderRadius: 18 }}>
        <h2>Studio Rekaman</h2>
        <p>{recording ? "Sedang merekam suara..." : "Siap untuk merekam."}</p>
        <button
          onClick={recording ? stopRecording : startRecording}
          style={{ padding: "14px 22px", borderRadius: 10, border: 0, background: recording ? "#dc4545" : "#2878df", color: "white", fontSize: 16 }}
        >
          {recording ? "Hentikan Rekaman" : "Mulai Rekaman"}
        </button>
        {error && <p style={{ color: "#ff8888" }}>{error}</p>}
        {audioUrl && (
          <div style={{ marginTop: 28 }}>
            <h3>Hasil Rekaman</h3>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
            <p>
              <a href={audioUrl} download="rekaman-suara.webm" style={{ color: "#8bd5ff" }}>
                Unduh Rekaman
              </a>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/studio") {
    return (
      <main style={{ background: "#111", minHeight: "100vh", padding: 16, color: "white" }}>
        <a href="/" style={{ color: "#8bd5ff" }}>← Beranda</a>
        <h1>One Line Motion Studio</h1>
        <Player
          component={ShortsStudio}
          durationInFrames={900}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          controls
          style={{ width: "min(100%, 420px)", margin: "auto" }}
        />
      </main>
    );
  }

  if (path === "/voice") return <VoiceStudio />;

  return (
    <main style={{ background: "#111", color: "white", minHeight: "100vh", padding: 30 }}>
      <h1>One Line Motion Studio</h1>
      <p>Selamat datang di studio animasi pribadi Anda.</p>
      <p><a href="/studio" style={{ color: "#7dd3fc" }}>Buka Studio Animasi</a></p>
      <p><a href="/voice" style={{ color: "#7dd3fc" }}>Buka Voice Studio</a></p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
