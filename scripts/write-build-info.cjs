#!/usr/bin/env node
/**
 * Writes public/build-info.json at build time (no secrets).
 * Used so Staging can show client SHA/branch/deployment without auth.
 */
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public");
const outFile = path.join(outDir, "build-info.json");

function firstNonEmpty(...values) {
  for (const value of values) {
    const trimmed = String(value ?? "").trim();
    if (trimmed) return trimmed;
  }
  return "";
}

const payload = {
  ok: true,
  environment: firstNonEmpty(
    process.env.VITE_APP_ENV,
    process.env.VERCEL_ENV,
    process.env.NODE_ENV,
    "unknown"
  ),
  gitSha: firstNonEmpty(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VITE_GIT_SHA,
    process.env.GITHUB_SHA
  ),
  gitBranch: firstNonEmpty(
    process.env.VERCEL_GIT_COMMIT_REF,
    process.env.VITE_GIT_BRANCH,
    process.env.GITHUB_REF_NAME
  ),
  deploymentId: firstNonEmpty(
    process.env.VERCEL_DEPLOYMENT_ID,
    process.env.VITE_DEPLOYMENT_ID
  ),
  ts: new Date().toISOString(),
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(process.cwd(), outFile)}`);
