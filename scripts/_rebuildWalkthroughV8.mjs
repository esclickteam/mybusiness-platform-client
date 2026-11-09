/**
 * V8 rebuild: readable context crops (no over-zoom), sharp encode,
 * dedicated mobile width-safe variants, process concat.
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RAW = "/tmp/bizuply-films";
const OUT = "/tmp/bizuply-films/v8";
const PUB = path.resolve("public/demo-media/home/walkthrough");
fs.mkdirSync(OUT, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd}: ${err.slice(-900)}`)),
    );
  });
}

function probeDur(file) {
  return Number(
    spawnSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
      { encoding: "utf8" },
    ).stdout.trim(),
  );
}

async function poster(mp4, jpg, ss = "1.0") {
  await run("ffmpeg", ["-y", "-ss", ss, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function encode({ src, dest, ss, dur, vf, posterSs = "1.0" }) {
  await run("ffmpeg", [
    "-y",
    "-ss",
    String(ss),
    "-t",
    String(dur),
    "-i",
    src,
    "-an",
    "-vf",
    vf,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "15",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    dest,
  ]);
  const jpg = dest.replace(/\.mp4$/, ".jpg");
  await poster(dest, jpg, posterSs);
  fs.copyFileSync(dest, path.join(PUB, path.basename(dest)));
  fs.copyFileSync(jpg, path.join(PUB, path.basename(jpg)));
  console.log("OK", path.basename(dest), Math.round(fs.statSync(dest).size / 1024), "KB");
}

// Desktop: mild context crop + light unsharp (avoid heavy upscale blur)
const desktop = [
  // Lead: status + name context (not full busy table forever)
  {
    name: "hero-01-lead",
    src: "02-crm.mp4",
    ss: 4.4,
    dur: 4.2,
    crop: "in_w*0.72:in_h*0.62:(in_w-out_w)*0.38:(in_h-out_h)*0.42",
    scale: "1280:720",
  },
  // CRM detail actions
  {
    name: "hero-02-crm",
    src: "02-crm.mp4",
    ss: 19.5,
    dur: 4.6,
    crop: "in_w*0.78:in_h*0.70:(in_w-out_w)/2:(in_h-out_h)*0.06",
    scale: "1280:720",
  },
  // WhatsApp: full chat pane with complete bubbles
  {
    name: "hero-03-whatsapp",
    src: "03-whatsapp.mp4",
    ss: 5.2,
    dur: 6.2,
    crop: "in_w*0.62:in_h*0.78:(in_w-out_w)*0.02:(in_h-out_h)*0.10",
    scale: "1280:720",
    posterSs: "4.5",
  },
  // Automation nodes
  {
    name: "hero-04-automation",
    src: "04-automation.mp4",
    ss: 5.8,
    dur: 5.2,
    crop: "in_w*0.82:in_h*0.68:(in_w-out_w)*0.10:(in_h-out_h)*0.18",
    scale: "1280:720",
  },
  // Task: open form → datetime → save → list (trim bottom white)
  {
    name: "hero-05-task",
    src: "05-task.mp4",
    ss: 7.2,
    dur: 8.4,
    crop: "in_w*0.72:in_h*0.70:(in_w-out_w)/2:(in_h-out_h)*0.02",
    scale: "1280:720",
    posterSs: "5.5",
  },
];

for (const c of desktop) {
  const vf = `crop=${c.crop},scale=${c.scale}:flags=lanczos,unsharp=5:5:0.45:5:5:0.0,setsar=1,format=yuv420p`;
  await encode({
    src: `${RAW}/${c.src}`,
    dest: `${OUT}/${c.name}.mp4`,
    ss: c.ss,
    dur: c.dur,
    vf,
    posterSs: c.posterSs || "1.0",
  });
}

// Mobile: width-safe — crop less horizontally, pad to 720x900 if needed
const mobile = [
  {
    name: "mobile-01-lead",
    src: "02-crm.mp4",
    ss: 4.4,
    dur: 4.0,
    crop: "in_w*0.48:in_h*0.72:(in_w-out_w)*0.42:(in_h-out_h)*0.34",
  },
  {
    name: "mobile-02-crm",
    src: "02-crm.mp4",
    ss: 19.6,
    dur: 4.4,
    crop: "in_w*0.55:in_h*0.78:(in_w-out_w)/2:(in_h-out_h)*0.04",
  },
  {
    name: "mobile-03-whatsapp",
    src: "03-whatsapp.mp4",
    ss: 5.4,
    dur: 5.8,
    crop: "in_w*0.46:in_h*0.82:(in_w-out_w)*0.01:(in_h-out_h)*0.08",
    posterSs: "4.2",
  },
  {
    name: "mobile-04-automation",
    src: "04-automation.mp4",
    ss: 6.0,
    dur: 4.8,
    crop: "in_w*0.58:in_h*0.72:(in_w-out_w)*0.08:(in_h-out_h)*0.16",
  },
  {
    name: "mobile-05-task",
    src: "05-task.mp4",
    ss: 7.4,
    dur: 8.0,
    crop: "in_w*0.52:in_h*0.78:(in_w-out_w)/2:(in_h-out_h)*0.02",
    posterSs: "5.2",
  },
];

for (const c of mobile) {
  // Fit width without stretching text; pad vertically if needed
  const vf = [
    `crop=${c.crop}`,
    `scale=720:900:force_original_aspect_ratio=decrease:flags=lanczos`,
    `pad=720:900:(ow-iw)/2:(oh-ih)/2:#eef1f8`,
    `unsharp=5:5:0.4:5:5:0.0`,
    `setsar=1`,
    `format=yuv420p`,
  ].join(",");
  await encode({
    src: `${RAW}/${c.src}`,
    dest: `${OUT}/${c.name}.mp4`,
    ss: c.ss,
    dur: c.dur,
    vf,
    posterSs: c.posterSs || "1.0",
  });
}

// Process film from desktop hero parts
const parts = [
  "hero-01-lead",
  "hero-02-crm",
  "hero-03-whatsapp",
  "hero-04-automation",
  "hero-05-task",
];
const durs = parts.map((n) => probeDur(`${OUT}/${n}.mp4`));
console.log(
  "parts",
  parts.map((n, i) => [n, +durs[i].toFixed(2)]),
);

const fade = 0.28;
const inputs = [];
for (const n of parts) inputs.push("-i", `${OUT}/${n}.mp4`);
const filters = [];
let cum = durs[0];
let prev = "[0:v]";
for (let i = 1; i < parts.length; i += 1) {
  const off = cum - fade;
  const out = i < parts.length - 1 ? `[v${i}]` : "[vout]";
  filters.push(`${prev}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${off.toFixed(3)}${out}`);
  cum += durs[i] - fade;
  prev = out;
}
await run("ffmpeg", [
  "-y",
  ...inputs,
  "-filter_complex",
  filters.join(";"),
  "-map",
  "[vout]",
  "-an",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "15",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  `${OUT}/process-full.mp4`,
]);
await poster(`${OUT}/process-full.mp4`, `${OUT}/process-full.jpg`, "2.0");
fs.copyFileSync(`${OUT}/process-full.mp4`, path.join(PUB, "process-full.mp4"));
fs.copyFileSync(`${OUT}/process-full.jpg`, path.join(PUB, "process-full.jpg"));
// Also refresh raw refs used by public walkthrough
for (const n of ["03-whatsapp", "05-task"]) {
  fs.copyFileSync(`${RAW}/${n}.mp4`, path.join(PUB, `${n}.mp4`));
  await poster(`${RAW}/${n}.mp4`, path.join(PUB, `${n}.jpg`), "2.5");
}
console.log("process duration ~", cum.toFixed(2));
