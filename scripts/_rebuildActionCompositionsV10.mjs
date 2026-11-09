/**
 * Rebuild hero/mobile/process as action-focused compositions from 1920 masters.
 * Native-pixel crops only — never scale above 1.0.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SRC = "/tmp/bizuply-films/v10b";
const OUT = "/tmp/bizuply-films/v10c";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
fs.mkdirSync(OUT, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-1200)))));
  });
}

async function extractPoster(mp4, jpg, at = "0.8") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function actionClip(src, dest, { start, duration, crop, width, height, pad = "#12061f" }) {
  const vf = [
    `crop=${crop}`,
    `scale='min(${width},iw)':'min(${height},ih)':force_original_aspect_ratio=decrease:flags=lanczos`,
    `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:${pad}`,
    "fps=30",
    "format=yuv420p",
    "setsar=1",
  ].join(",");
  await run("ffmpeg", [
    "-y",
    "-ss", String(start),
    "-t", String(duration),
    "-i", src,
    "-an",
    "-vf", vf,
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "15",
    "-movflags", "+faststart",
    dest,
  ]);
  if (fs.statSync(dest).size < 1000) {
    throw new Error(`Empty clip ${dest}`);
  }
}

async function concatClips(parts, dest) {
  const list = path.join(OUT, `${path.basename(dest)}.txt`);
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
  await run("ffmpeg", [
    "-y", "-f", "concat", "-safe", "0", "-i", list,
    "-c", "copy",
    dest,
  ]);
}

function publish(mp4, jpg) {
  fs.copyFileSync(mp4, path.join(PUBLIC, path.basename(mp4)));
  fs.copyFileSync(jpg, path.join(PUBLIC, path.basename(jpg)));
  console.log("pub", path.basename(mp4), fs.statSync(mp4).size);
}

const DW = 1440;
const DH = 900;
const MW = 1080;
const MH = 1350;

const STEPS = [
  {
    name: "01-lead",
    src: "01-lead.mp4",
    desktop: [
      { start: 3.2, duration: 2.4, crop: "1500:900:180:90" },
      { start: 10.0, duration: 4.2, crop: "1280:900:320:50" },
    ],
    mobile: [{ start: 10.0, duration: 5.0, crop: "1100:900:420:50" }],
  },
  {
    name: "02-crm",
    src: "02-crm.mp4",
    desktop: [
      { start: 3.0, duration: 2.2, crop: "1500:900:180:90" },
      { start: 9.5, duration: 4.5, crop: "1280:900:320:40" },
    ],
    mobile: [{ start: 9.5, duration: 5.5, crop: "1100:900:420:40" }],
  },
  {
    name: "03-whatsapp",
    src: "03-whatsapp.mp4",
    // master is ~8.7s — stay inside that window after load
    desktop: [
      { start: 5.2, duration: 1.6, crop: "1400:900:80:120" },
      { start: 6.6, duration: 2.0, crop: "980:880:40:160" },
    ],
    mobile: [{ start: 6.4, duration: 2.2, crop: "900:880:60:150" }],
  },
  {
    name: "04-automation",
    src: "04-automation.mp4",
    desktop: [
      { start: 3.0, duration: 2.0, crop: "1700:780:110:220" },
      { start: 5.0, duration: 4.0, crop: "1200:700:360:260" },
    ],
    mobile: [{ start: 5.0, duration: 5.0, crop: "1000:780:460:220" }],
  },
  {
    name: "05-task",
    src: "05-task.mp4",
    desktop: [
      { start: 8.0, duration: 3.2, crop: "1280:900:320:40" },
      { start: 12.0, duration: 4.5, crop: "1280:900:320:40" },
    ],
    mobile: [
      { start: 8.0, duration: 3.2, crop: "1100:900:420:40" },
      { start: 12.0, duration: 4.5, crop: "1100:900:420:40" },
    ],
  },
];

for (const step of STEPS) {
  const src = path.join(SRC, step.src);
  const deskParts = [];
  for (let i = 0; i < step.desktop.length; i += 1) {
    const part = path.join(OUT, `d-${step.name}-${i}.mp4`);
    await actionClip(src, part, { ...step.desktop[i], width: DW, height: DH });
    deskParts.push(part);
  }
  const heroMp4 = path.join(OUT, `hero-${step.name}.mp4`);
  const heroJpg = path.join(OUT, `hero-${step.name}.jpg`);
  await concatClips(deskParts, heroMp4);
  await extractPoster(heroMp4, heroJpg, "1.4");
  publish(heroMp4, heroJpg);

  const mobParts = [];
  for (let i = 0; i < step.mobile.length; i += 1) {
    const part = path.join(OUT, `m-${step.name}-${i}.mp4`);
    await actionClip(src, part, { ...step.mobile[i], width: MW, height: MH });
    mobParts.push(part);
  }
  const mobMp4 = path.join(OUT, `mobile-${step.name}.mp4`);
  const mobJpg = path.join(OUT, `mobile-${step.name}.jpg`);
  await concatClips(mobParts, mobMp4);
  await extractPoster(mobMp4, mobJpg, "1.0");
  publish(mobMp4, mobJpg);
}

const procParts = [];
for (const step of STEPS) {
  for (let i = 0; i < step.desktop.length; i += 1) {
    procParts.push(path.join(OUT, `d-${step.name}-${i}.mp4`));
  }
}
const processMp4 = path.join(OUT, "process-full.mp4");
const processJpg = path.join(OUT, "process-full.jpg");
await concatClips(procParts, processMp4);
await extractPoster(processMp4, processJpg, "2.0");
publish(processMp4, processJpg);

console.log("action compositions complete");
