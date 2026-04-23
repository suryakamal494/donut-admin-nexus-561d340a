import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = "/mnt/documents";
const audioDir = path.resolve(__dirname, "../public/audio");

const compositionIds = [
  "wrong-answer-q1",
  "wrong-answer-q2",
  "wrong-answer-q3",
  "wrong-answer-q4",
  "wrong-answer-q5",
];

// Only render the IDs passed as args, or all if none specified
const targetIds = process.argv.slice(2);
const toRender = targetIds.length > 0 ? targetIds : compositionIds;

console.log("Bundling...");
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

console.log("Opening browser...");
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

for (const id of toRender) {
  console.log(`Rendering ${id}...`);
  const composition = await selectComposition({
    serveUrl: bundled,
    id,
    puppeteerInstance: browser,
  });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: path.join(outputDir, `${id}.mp4`),
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });

  // Mux audio if available
  const qId = id.replace("wrong-answer-", "");
  const audioPath = path.join(audioDir, `${qId}.mp3`);
  const videoPath = path.join(outputDir, `${id}.mp4`);
  const finalPath = path.join(outputDir, `${id}-final.mp4`);
  
  try {
    const stat = await import("fs").then(fs => fs.statSync(audioPath));
    console.log(`  Muxing audio (${(stat.size / 1024).toFixed(0)} KB)...`);
    execSync(
      `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -b:a 128k -shortest "${finalPath}" 2>/dev/null`
    );
    // Replace original with final
    execSync(`mv "${finalPath}" "${videoPath}"`);
    console.log(`  ✓ ${id}.mp4 saved (with audio)`);
  } catch (e) {
    console.log(`  ✓ ${id}.mp4 saved (no audio file found)`);
  }
}

await browser.close({ silent: false });
console.log("All done!");