
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "node:fs/promises";

const text = process.argv[2];
const voice = process.argv[3] || "id-ID-ArdiNeural";

if (!text) {
  console.log('Gunakan: npm run voice -- "Teks narasi" "nama-suara"');
  process.exit(1);
}

const outputDir = "./public/audio";
await fs.mkdir(outputDir, { recursive: true });

try {
  const tts = new MsEdgeTTS();

  await tts.setMetadata(
    voice,
    OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
  );

  const result = await tts.toFile(outputDir, text);

  console.log("Suara berhasil dibuat!");
  console.log("File:", result.audioFilePath);
} catch (error) {
  console.error("Gagal membuat suara:", error.message);
  process.exit(1);
}

