"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const SRC = path.resolve(__dirname, "../../src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

describe("browser bundle must not embed OpenAI secrets", () => {
  it("does not import openai or VITE_OPENAI_* from src/", () => {
    const offenders = [];
    for (const file of walk(SRC)) {
      const src = fs.readFileSync(file, "utf8");
      if (
        /from\s+['"]openai['"]/.test(src) ||
        /require\(\s*['"]openai['"]\s*\)/.test(src) ||
        /VITE_OPENAI|NEXT_PUBLIC_OPENAI|REACT_APP_OPENAI/.test(src) ||
        /import\.meta\.env\.[A-Z0-9_]*OPENAI/.test(src)
      ) {
        offenders.push(path.relative(SRC, file));
      }
    }
    assert.deepEqual(offenders, []);
  });
});
