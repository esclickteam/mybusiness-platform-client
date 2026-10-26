import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");

test("acceptance runner covers the ten Invistimo hub modules and stays read-only", () => {
  const src = fs.readFileSync(path.join(here, "run.mjs"), "utf8");
  for (const id of [
    "dashboard",
    "inbox",
    "templates",
    "contacts",
    "automations",
    "agents",
    "scheduled",
    "reports",
    "billing",
    "connection",
  ]) {
    assert.match(src, new RegExp(`id: "${id}"`));
  }
  assert.match(src, /Invistimo-only links/);
  assert.match(src, /BLOCKED_WRITE/);
  assert.match(src, /route\.abort\("blockedbyclient"\)/);
  assert.match(src, /Boolean\(window\.localStorage\.getItem\("token"\)\)/);
  assert.doesNotMatch(src, /fs\.readFileSync\(STATE_FILE/);
  assert.match(src, /never prints cookies/);
  assert.equal(fs.existsSync(path.join(here, ".auth")), false);
  assert.equal(fs.existsSync(path.join(here, "results")), false);
});

test("runner confirms Invistimo before modules and does not auto-login or bypass", () => {
  const src = fs.readFileSync(path.join(here, "run.mjs"), "utf8");
  assert.match(src, /async function assertInvistimoSession/);
  assert.match(src, /await assertInvistimoSession\(context\)/);
  assert.match(src, /Connected account is not Invistimo/);
  assert.doesNotMatch(src, /INVISTIMO_ALLOW_HEADLESS_LOGIN/);
  assert.match(src, /will not log in automatically/);
  assert.match(src, /will not switch accounts or bypass access/);
  assert.match(src, /headless: false/);
});

test("one module failure does not abort the suite and reports stay redacted", () => {
  const src = fs.readFileSync(path.join(here, "run.mjs"), "utf8");
  assert.match(src, /for \(const mod of MODULES\)/);
  assert.match(src, /catch \(err\) \{\s*const row = moduleResult\(mod\.id/);
  assert.match(src, /function redact\(/);
  assert.match(src, /function apiPath\(/);
  assert.match(src, /mask: \(await mask\.count\(\)\) \? \[mask\] : \[\]/);
  assert.match(src, /storageState\(\{ path: STATE_FILE \}\)/);
  assert.doesNotMatch(src, /JSON\.stringify\([^\n]*cookie/i);
  assert.doesNotMatch(src, /console\.(log|error)\([^\n]*STATE_FILE/);
  assert.match(src, /Cookies, tokens, and passwords were not written/);
});

test("session and results directories are gitignored and untracked", () => {
  const gitignore = fs.readFileSync(path.join(repoRoot, ".gitignore"), "utf8");
  assert.match(gitignore, /e2e\/invistimo-whatsapp-acceptance\/\.auth\//);
  assert.match(gitignore, /e2e\/invistimo-whatsapp-acceptance\/results\//);
  const tracked = fs
    .readFileSync(path.join(here, "run.mjs"), "utf8")
    .includes(".auth/");
  assert.equal(tracked, true);
});
