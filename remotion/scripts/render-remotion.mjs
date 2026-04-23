import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = "/mnt/documents";

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
  console.log(`  ✓ ${id}.mp4 saved`);
}

await browser.close({ silent: false });
console.log("All done!");