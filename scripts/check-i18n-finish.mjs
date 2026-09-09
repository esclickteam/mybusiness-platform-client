import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

const flats = Object.fromEntries(
  LOCALES.map((l) => [
    l,
    flatten(
      JSON.parse(
        fs.readFileSync(path.join(ROOT, "src/i18n/locales", `${l}.json`), "utf8")
      )
    ),
  ])
);

const enKeys = Object.keys(flats.en);
let failed = false;
for (const loc of LOCALES.filter((l) => l !== "en")) {
  const missing = enKeys.filter((k) => !(k in flats[loc]));
  const extra = Object.keys(flats[loc]).filter((k) => !(k in flats.en));
  console.log(`${loc}: missing=${missing.length} extra=${extra.length}`);
  if (missing.length) {
    failed = true;
    console.log("  missing sample:", missing.slice(0, 20).join(", "));
  }
}

const samples = [
  "leftover.xrayChrome.questions.general.q1",
  "leftover.xrayChrome.questions.types.services.q1",
  "metaCampaigns.adsManager.chrome.publish",
  "partner.poweredBy",
  "partner.money.oneTimePlusRecurring",
  "billing.regional.unavailable",
  "billing.markets.usa",
];
for (const k of samples) {
  const row = LOCALES.map((l) => (flats[l][k] ? "OK" : "MISS")).join(" ");
  console.log(k, "=>", row);
  if (LOCALES.some((l) => !flats[l][k])) failed = true;
}

// Scan partner/xray/meta for Hebrew defaultValue
const scanRoots = [
  "src/pages/partner",
  "src/components/partner",
  "src/pages/public",
  "src/pages/business/dashboardPages/BizUplyTabs",
  "src/pages/business/dashboardPages/meta-campaigns",
  "src/lib/partnerMoney.ts",
  "src/lib/partnerLabels.ts",
  "src/lib/partnerWork.ts",
];

const heDefaultRe = /defaultValue:\s*["'`][\u0590-\u05FF]/
const hits = [];
function walk(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(p)) walk(path.join(p, name));
    return;
  }
  if (!/\.(tsx?|jsx?)$/.test(p)) return;
  const text = fs.readFileSync(p, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (heDefaultRe.test(line)) hits.push(`${p}:${i + 1}: ${line.trim().slice(0, 120)}`);
  });
}
for (const root of scanRoots) {
  const abs = path.join(ROOT, root);
  if (fs.existsSync(abs)) walk(abs);
}
console.log("Hebrew defaultValue hits:", hits.length);
hits.slice(0, 30).forEach((h) => console.log(h));

if (failed || hits.length) process.exitCode = 1;
else console.log("PARITY_OK");
