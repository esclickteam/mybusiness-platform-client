"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "../..");

const FORBIDDEN_ENV_NAMES = new Set([
  ".env",
  ".env.local",
  ".env.development",
  ".env.staging",
  ".env.production",
]);

const LIVE_SECRET_PATTERNS = [
  { type: "openai_sk_proj", re: /\bsk-proj-[A-Za-z0-9_-]{16,}/g },
  { type: "openai_sk_svcacct", re: /\bsk-svcacct-[A-Za-z0-9_-]{16,}/g },
  { type: "aws_akia", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { type: "github_pat", re: /\bgh[pousr]_[A-Za-z0-9]{20,}/g },
  { type: "stripe_sk_live", re: /\bsk_live_[A-Za-z0-9]{16,}/g },
];

const STRIPE_LIVE_ALLOW =
  /sk_live_(dummy|x|SHOULD_NOT_LOG|forbidden|nope|dummy_for_jest)\b/;

function gitLsFiles() {
  const result = spawnSync("git", ["ls-files", "-z"], {
    cwd: REPO_ROOT,
    encoding: "buffer",
    maxBuffer: 32 * 1024 * 1024,
  });
  assert.equal(
    result.status,
    0,
    `git ls-files must succeed (${result.error || result.stderr})`
  );
  return result.stdout
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((rel) => !rel.includes("node_modules/"));
}

function scanFile(rel) {
  const findings = [];
  const base = path.basename(rel);
  if (FORBIDDEN_ENV_NAMES.has(base)) {
    findings.push({ type: "tracked_env_file", rel });
  }
  const abs = path.join(REPO_ROOT, rel);
  let text;
  try {
    const buf = fs.readFileSync(abs);
    if (buf.length > 2_000_000) return findings;
    text = buf.toString("utf8");
  } catch {
    return findings;
  }
  const looksLikeEnvOrIgnore =
    base === ".gitignore" || base === ".env" || base.startsWith(".env.");
  if (looksLikeEnvOrIgnore && (text.charCodeAt(0) === 0xfeff || text.includes("\u0000"))) {
    findings.push({ type: "utf16_or_bom_ignore_file", rel });
  }
  for (const { type, re } of LIVE_SECRET_PATTERNS) {
    re.lastIndex = 0;
    const matches = text.match(re) || [];
    for (const match of matches) {
      if (type === "stripe_sk_live" && STRIPE_LIVE_ALLOW.test(match)) continue;
      findings.push({ type, rel });
    }
  }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*OPENAI_API_KEY\s*=\s*(.*)$/);
    if (!m) continue;
    const raw = m[1].trim().replace(/^['"]|['"]$/g, "");
    if (!raw) continue;
    if (/^<[^>]+>$/.test(raw)) continue;
    if (/^(your-openai-api-key|changeme|todo|xxx|test-key|test-openai-key)$/i.test(raw)) {
      continue;
    }
    findings.push({ type: "openai_env_assignment", rel });
  }
  return findings;
}

describe("secret hygiene (tracked files, no secret values printed)", () => {
  it("does not track live env files or OpenAI/AWS/GitHub live key material", () => {
    const files = gitLsFiles();
    const findings = files.flatMap(scanFile);
    const summary = findings.map((f) => `${f.type}:${f.rel}`);
    assert.deepEqual(summary, []);
  });
});
