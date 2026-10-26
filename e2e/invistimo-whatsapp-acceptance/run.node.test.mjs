import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const here = path.dirname(fileURLToPath(import.meta.url));

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
  assert.doesNotMatch(src, /localStorage\.getItem|document\.cookie/);
  assert.match(src, /never prints cookies/);
  assert.equal(fs.existsSync(path.join(here, ".auth")), false);
});
