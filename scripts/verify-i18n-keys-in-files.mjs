#!/usr/bin/env node
/**
 * Verifies that every t("...") / t('...') key used in the listed source files
 * exists in en.json. Nested keys are resolved with dot paths.
 *
 * Usage:
 *   node scripts/verify-i18n-keys-in-files.mjs [file ...]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EN_PATH = path.join(ROOT, "src/i18n/locales/en.json");

const DEFAULT_FILES = [
  "src/pages/business/dashboardPages/DashboardPage.tsx",
  "src/pages/business/dashboardPages/BankDetailsForm.jsx",
  "src/pages/business/dashboardPages/automations/billing/automationBillingFormat.ts",
  "src/components/dashboard/Insights.jsx",
  "src/components/dashboard/RecentActivityTable.jsx",
  "src/components/dashboard/LineChart.jsx",
  "src/components/dashboard/CalendarView.tsx",
];

function getByPath(obj, keyPath) {
  return keyPath.split(".").reduce((acc, part) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return acc[part];
  }, obj);
}

function extractKeys(source) {
  const keys = new Set();
  const re = /\bt\(\s*(['"`])([^'"`]+?)\1/g;
  let match;
  while ((match = re.exec(source))) {
    const key = match[2];
    if (!key.includes("${") && !key.includes("{{")) {
      keys.add(key);
    }
  }
  // i18n.t("...")
  const reI18n = /\bi18n\.t\(\s*(['"`])([^'"`]+?)\1/g;
  while ((match = reI18n.exec(source))) {
    const key = match[2];
    if (!key.includes("${") && !key.includes("{{")) {
      keys.add(key);
    }
  }
  return [...keys];
}

const files = (process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_FILES).map(
  (rel) => path.resolve(ROOT, rel)
);

const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
let missing = 0;
let checked = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.warn(`skip missing file: ${path.relative(ROOT, file)}`);
    continue;
  }
  const source = fs.readFileSync(file, "utf8");
  const keys = extractKeys(source);
  for (const key of keys) {
    checked += 1;
    // Plural forms: appointmentsScheduled_one etc. — check base or exact
    const value =
      getByPath(en, key) ??
      getByPath(en, `${key}_one`) ??
      getByPath(en, `${key}_other`) ??
      getByPath(en, key.replace(/_(one|other|zero|two|few|many)$/, ""));
    if (value === undefined) {
      missing += 1;
      console.error(`MISSING ${key}  (${path.relative(ROOT, file)})`);
    }
  }
}

if (missing > 0) {
  console.error(`\n${missing} missing key(s) of ${checked} checked.`);
  process.exit(1);
}

console.log(`OK: ${checked} key reference(s) found in en.json across ${files.length} file(s).`);
