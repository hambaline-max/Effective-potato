
import http from "node:http";
import { spawn } from "node:child_process";

const PORT = 3002;

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>One Line Motion - Voice Studio</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:24px;background:#10121b;color:#fff;font-family:Arial,sans-serif}
main{max-width:720px;margin:30px auto;background:#1c2030;padding:24px;border-radius:20px}
h1{margin-top:0}
p{color:#aeb6ca}
textarea,select{width:100%;padding:14px;margin:10px 0 18px;border-radius:10px;border:1px solid #414960;background:#111522;color:white;font-size:16px}
textarea{height:180px;resize:vertical}
button{width:100%;padding:16px;border:0;border-radius:12px;background:#7865f5;color:white;font-size:17px;font-weight:bold}
button:disabled{opacity:.5}
audio{width:100%;margin-top:20px}
#status{margin-top:16px;color:#aeb6ca;white-space:pre-wrap}
</style>
</head>
<body>
<main>
<h1>🎙️ VOICE STUDIO AI</h1>
<p>Ubah naskah menjadi suara otomatis.</p>

<label>Naskah narasi</label>
<textarea id="script" placeholder="Tulis naskah video kamu di sini..."></textarea>

<label>Pilih karakter suara</label>
<select id="voice">
<option value="id-ID-ArdiNeural">Pria Indonesia - Ardi</option>
<option value="id-ID-GadisNeural">Wanita Indonesia - Gadis</option>
<option value="en-US-GuyNeural">Pria Inggris - Guy</option>
<option value="en-US-JennyNeural">Wanita Inggris - Jenny</option>
</select>

<button id="generate">GENERATE VOICE</button>
<div id="status">Siap membuat suara.</div>
<audio id="player" controls></audio>
<hr style="margin:24px 0;border-color:#39445c">
<h2>🎙️ Rekam Suara Sendiri</h2>
<button id="record">🔴 MULAI REKAM</button>
<button id="stop" disabled>⏹️ SELESAI REKAM</button>
<h3>Atau Upload Rekaman</h3>
<input id="upload" type="file" accept="audio/*">
<div id="recordStatus">Siap merekam suara.</div>
</main>

<script>
const button = document.getElementById("generate");
const status = document.getElementById("status");
const player = document.getElementById("player");

const recordBtn = document.getElementById("record");
const stopBtn = document.getElementById("stop");
const uploadInput = document.getElementById("upload");
const recordStatus = document.getElementById("recordStatus");

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, {
        type: mediaRecorder.mimeType
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      player.src = audioUrl;

      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "rekaman-suara." +
        (audioBlob.type.includes("mp4") ? "m4a" : "webm");
      link.textContent = "⬇️ Download Rekaman";

      recordStatus.innerHTML = "Rekaman selesai. ";
      recordStatus.appendChild(link);

      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    recordStatus.textContent = "Sedang merekam...";
  } catch (error) {
    recordStatus.textContent = "Mikrofon tidak dapat diakses: " + error.message;
  }
});

stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
  }
});

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (!file) return;

  player.src = URL.createObjectURL(file);
  recordStatus.textContent = "Audio berhasil dipilih: " + file.name;
});

button.addEventListener("click", async () => {
  const text = document.getElementById("script").value.trim();
  const voice = document.getElementById("voice").value;

  if (!text) {
    status.textContent = "Masukkan naskah terlebih dahulu.";
    return;
  }

  button.disabled = true;
  status.textContent = "Sedang membuat suara...";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text, voice})
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Gagal membuat suara.");

    player.src = "/audio?t=" + Date.now();
    player.load();
    status.textContent = "Berhasil! Audio tersimpan di public/audio/audio.mp3";
  } catch (error) {
    status.textContent = "Gagal: " + error.message;
  } finally {
    button.disabled = false;
  }
});
</script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
  }

  if (req.method === "GET" && req.url.startsWith("/audio")) {
    try {
      const fs = await import("node:fs");
      const file = "./public/audio/audio.mp3";
      if (!fs.existsSync(file)) {
        res.writeHead(404);
        return res.end("Audio belum dibuat");
      }
      res.writeHead(200, { "Content-Type": "audio/mpeg" });
      return fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(500);
      return res.end("Gagal membaca audio");
    }
  }

  if (req.method === "POST" && req.url === "/generate") {
    let body = "";
    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      try {
        const { text, voice } = JSON.parse(body);

        if (typeof text !== "string" || !text.trim() || text.length > 10000) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Naskah kosong atau terlalu panjang." }));
        }

        const allowed = [
          "id-ID-ArdiNeural",
          "id-ID-GadisNeural",
          "en-US-GuyNeural",
          "en-US-JennyNeural"
        ];

        if (!allowed.includes(voice)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Pilihan suara tidak valid." }));
        }

        const child = spawn("node", ["generate-voice.mjs", text, voice]);

        let errorOutput = "";
        child.stderr.on("data", data => errorOutput += data.toString());

        child.on("close", code => {
          res.writeHead(code === 0 ? 200 : 500, {
            "Content-Type": "application/json"
          });

          res.end(JSON.stringify(
            code === 0
              ? { success: true }
              : { error: errorOutput || "Proses TTS gagal." }
          ));
        });
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Data permintaan tidak valid." }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Voice Studio aktif di port " + PORT);
});
