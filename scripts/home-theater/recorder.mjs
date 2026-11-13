import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => { err += d.toString(); });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-2000)))));
  });
}

/** Visible cursor (desktop) or tap dot (mobile) drawn inside the page so the screencast captures it. */
export function cursorScript(mode = "desktop") {
  return `
(() => {
  if (window.__bzCursor) return;
  window.__bzCursor = true;
  const touch = ${JSON.stringify(mode === "touch")};
  const mount = () => {
    if (!document.body || !document.head) return requestAnimationFrame(mount);
    const style = document.createElement('style');
    style.textContent = \`
      #bz-cursor{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;will-change:transform;
        transform:translate(-200px,-200px)}
      #bz-cursor.is-arrow{width:58px;height:58px;filter:drop-shadow(0 4px 6px rgba(20,10,40,.38))}
      #bz-cursor.is-arrow svg{width:58px;height:58px;transition:transform .12s ease;transform-origin:20px 7px}
      #bz-cursor.is-arrow.is-rtl svg{transform:scaleX(-1)}
      #bz-cursor.is-arrow.is-down svg{transform:scale(.86)}
      #bz-cursor.is-arrow.is-rtl.is-down svg{transform:scaleX(-1) scale(.86)}
      .bz-hot{outline:3px solid #5b21b6 !important;outline-offset:2px !important;box-shadow:0 0 0 6px rgba(91,33,182,.16) !important}
      #bz-cursor.is-touch{width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;
        background:rgba(108,60,240,.22);border:2px solid rgba(108,60,240,.85);box-shadow:0 2px 8px rgba(40,20,120,.25);
        transition:transform .12s ease, background .12s ease}
      #bz-cursor.is-touch.is-down{background:rgba(108,60,240,.45)}
      .bz-ripple{position:fixed;z-index:2147483646;pointer-events:none;width:16px;height:16px;margin:-8px 0 0 -8px;
        border-radius:50%;border:2.5px solid rgba(108,60,240,.95);background:rgba(108,60,240,.16);
        animation:bz-rip .38s cubic-bezier(.2,.7,.3,1) forwards}
      @keyframes bz-rip{to{transform:scale(4);opacity:0}}
    \`;
    document.head.appendChild(style);
    const el = document.createElement('div');
    el.id = 'bz-cursor';
    el.className = touch ? 'is-touch' : 'is-arrow';
    if (!touch) el.innerHTML = '<svg viewBox="0 0 64 64"><path d="M20 5.5c-1.7 0-3 1.5-3 3.3V28c-2.6.2-5.2 1.6-6.4 4.2l-3.6 7.6c-.9 1.9-.1 4.2 1.8 5.1 1.1.5 2.2.4 3.1-.2l3.1-3.4v8.2c0 2.4 1.9 4.3 4.3 4.3h16.4c2.4 0 4.3-1.9 4.3-4.3V36.2c2.2-.3 3.8-2.2 3.8-4.4v-5.2c0-2.2-1.8-4-4-4h-.4V18.2c0-2.1-1.7-3.8-3.8-3.8h-.5v-5.6c0-2-1.6-3.3-3.6-3.3H20z" fill="#fff" stroke="#111" stroke-width="2.6" stroke-linejoin="round"/><path d="M23.2 8.2v16.4M30.4 12.4v12.2M37.2 16.2v8.4" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round"/></svg>';
    document.documentElement.appendChild(el);
    const tipX = 20, tipY = 7;
    const place = (x, y) => {
      const rtl = document.documentElement.dir === 'rtl' || getComputedStyle(document.documentElement).direction === 'rtl';
      el.classList.toggle('is-rtl', rtl && !touch);
      el.style.transform = touch ? 'translate(' + x + 'px,' + y + 'px)' : 'translate(' + (x - tipX) + 'px,' + (y - tipY) + 'px)';
    };
    let hot = null;
    const mark = (x, y, on) => {
      const node = document.elementFromPoint(x, y);
      const next = node && node.closest ? node.closest('button, a, select, [role="option"], [role="tab"], summary') : null;
      if (hot && hot !== next) hot.classList.remove('bz-hot');
      hot = on ? next : hot;
      if (on && next) next.classList.add('bz-hot');
      if (!on && hot) {
        const leave = hot;
        setTimeout(() => leave.classList.remove('bz-hot'), 160);
        hot = null;
      }
    };
    const last = JSON.parse(sessionStorage.getItem('__bzCur') || 'null');
    if (last) place(last[0], last[1]);
    addEventListener('mousemove', (e) => { place(e.clientX, e.clientY); sessionStorage.setItem('__bzCur', JSON.stringify([e.clientX, e.clientY])); }, true);
    addEventListener('mousedown', (e) => {
      el.classList.add('is-down');
      mark(e.clientX, e.clientY, true);
      const r = document.createElement('div');
      r.className = 'bz-ripple';
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      document.documentElement.appendChild(r);
      setTimeout(() => r.remove(), 420);
    }, true);
    addEventListener('mouseup', (e) => { el.classList.remove('is-down'); mark(e.clientX, e.clientY, false); }, true);
  };
  mount();
})();
`;
}

/**
 * CDP screencast recorder at device pixels. Supports keep/skip so loading waits are cut out.
 * Frames: { file, t, seg } where seg increments on every resume.
 */
export async function createRecorder(page, dir, { width, height }) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const frames = [];
  const segments = [];
  let keeping = false;
  let cdp = null;
  let count = 0;
  const save = (buf, t) => {
    const file = path.join(dir, `f${String(count++).padStart(6, "0")}.jpg`);
    fs.writeFileSync(file, buf);
    frames.push({ file, t });
  };
  const start = async () => {
    cdp = await page.context().newCDPSession(page);
    cdp.on("Page.screencastFrame", async (f) => {
      cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
      if (!keeping) return;
      save(Buffer.from(f.data, "base64"), f.metadata.timestamp);
    });
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, maxWidth: width, maxHeight: height, everyNthFrame: 1 });
  };
  const snapshot = async () => {
    const shot = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 95 });
    save(Buffer.from(shot.data, "base64"), Date.now() / 1000);
  };
  await start();
  return {
    async resume() {
      if (keeping) return;
      keeping = true;
      const t = Date.now() / 1000;
      segments.push({ from: t, to: null });
      await snapshot().catch(() => {});
    },
    pause() {
      if (!keeping) return;
      keeping = false;
      segments[segments.length - 1].to = Date.now() / 1000;
    },
    /** Re-attach after a full document navigation. */
    async restart() {
      await cdp?.send("Page.stopScreencast").catch(() => {});
      await cdp?.detach().catch(() => {});
      await start();
    },
    async stop() {
      this.pause();
      await cdp?.send("Page.stopScreencast").catch(() => {});
      return { frames, segments };
    },
    get keeping() { return keeping; },
    get segmentCount() { return segments.length; },
  };
}

/** Build a constant-fps mp4 of the given wall-clock segments (hard cuts between them). */
export async function segmentsToMp4(frames, segments, out, { fps = 30, crf = 18, width, height } = {}) {
  const lines = [];
  let total = 0;
  let lastFile = null;
  for (const seg of segments) {
    const inside = frames.filter((f) => f.t >= seg.from - 0.0001 && f.t <= seg.to);
    // last frame before the segment start shows the state at seg.from
    const before = [...frames].reverse().find((f) => f.t < seg.from);
    const list = inside.length && inside[0].t - seg.from < 0.02 ? inside : before ? [{ ...before, t: seg.from }, ...inside] : inside;
    for (let i = 0; i < list.length; i++) {
      const s = Math.max(list[i].t, seg.from);
      const e = i + 1 < list.length ? list[i + 1].t : seg.to;
      const d = Math.max(0.001, e - s);
      lines.push(`file '${list[i].file}'`, `duration ${d.toFixed(4)}`);
      total += d;
      lastFile = list[i].file;
    }
  }
  if (!lastFile) throw new Error("no frames for " + out);
  lines.push(`file '${lastFile}'`);
  fs.writeFileSync(out + ".txt", lines.join("\n"));
  const fit = width && height ? `,crop='min(iw,${width})':'min(ih,${height})':0:0,pad=${width}:${height}:0:0:white` : "";
  await run("ffmpeg", [
    "-y", "-f", "concat", "-safe", "0", "-i", out + ".txt", "-an",
    "-vf", `fps=${fps}${fit},format=yuv420p,setsar=1`,
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-tune", "stillimage",
    "-g", String(fps), "-movflags", "+faststart", out,
  ]);
  return { out, duration: total };
}

export async function probeDuration(file) {
  return new Promise((resolve) => {
    const child = spawn("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
    let o = "";
    child.stdout.on("data", (d) => { o += d; });
    child.on("close", () => resolve(Number(o.trim())));
  });
}

/** Join chapter clips with short crossfades; returns chapter start marks. */
export async function joinChapters(clips, out, { fade = 0.45, crf = 19, fps = 30 } = {}) {
  const durs = [];
  for (const c of clips) durs.push(await probeDuration(c));
  const args = ["-y"];
  clips.forEach((c) => args.push("-i", c));
  let filter = "";
  let prev = "[0:v]";
  let offset = 0;
  const marks = [0];
  for (let i = 1; i < clips.length; i++) {
    offset += durs[i - 1] - fade;
    const label = i === clips.length - 1 ? "[vout]" : `[v${i}]`;
    filter += `${prev}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(3)}${label};`;
    prev = label;
    marks.push(Number((offset + fade * 0.5).toFixed(2)));
  }
  if (clips.length === 1) filter = "[0:v]null[vout];";
  args.push("-filter_complex", filter.replace(/;$/, ""), "-map", "[vout]", "-an",
    "-r", String(fps), "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-tune", "stillimage",
    "-pix_fmt", "yuv420p", "-g", String(fps), "-movflags", "+faststart", out);
  await run("ffmpeg", args);
  return { marks, duration: await probeDuration(out) };
}

/** Smooth eased cursor path. */
export async function glide(page, state, x, y, { ms = 650 } = {}) {
  const sx = state.x ?? x, sy = state.y ?? y;
  const dist = Math.hypot(x - sx, y - sy);
  const dur = Math.max(260, Math.min(ms, 260 + dist * 0.9));
  const steps = Math.max(10, Math.round(dur / 16));
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const arc = Math.sin(Math.PI * p) * Math.min(28, dist * 0.06);
    await page.mouse.move(sx + (x - sx) * e, sy + (y - sy) * e - arc);
    await page.waitForTimeout(16);
  }
  state.x = x; state.y = y;
}

export async function dump(page, scope = "body") {
  return page.evaluate((scope) => {
    const root = document.querySelector(scope) || document.body;
    return [...root.querySelectorAll("button,a,[role=tab],select,input,textarea,[role=combobox]")]
      .filter((e) => e.offsetParent !== null)
      .map((e) => `${e.tagName}${e.type ? "[" + e.type + "]" : ""} "${(e.innerText || e.value || e.placeholder || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 50)}" ${e.className && typeof e.className === "string" ? "." + e.className.split(" ").slice(0, 2).join(".") : ""}`)
      .join("\n");
  }, scope);
}

export async function login(page, base, lang = "he") {
  await page.goto(lang === "he" ? `${base}/he/login` : `${base}/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator('input[type="email"]').waitFor({ timeout: 60000 }).catch(() => {});
  if (await page.locator('input[type="email"]').count()) {
    await page.locator('input[type="email"]').fill("customer-free-demo@bizuply.test");
    await page.locator('input[type="password"]').fill("DemoCustomer#2026");
    await page.locator('button[type="submit"]').click();
  }
  await page.waitForURL(/dashboard/, { timeout: 60000 });
}
