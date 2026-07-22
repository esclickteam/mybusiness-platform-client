const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("verify-build-assets: dist/index.html missing");
  process.exit(1);
}

const ASSET_REF = /assets\/[A-Za-z0-9_.-]+\.(?:js|css)/g;

function collectAssetRefs(content) {
  const refs = new Set();
  let match;
  while ((match = ASSET_REF.exec(content))) {
    refs.add(match[0]);
  }
  return refs;
}

const visited = new Set();
const missing = new Set();
const queue = collectAssetRefs(fs.readFileSync(indexPath, "utf8"));

while (queue.size > 0) {
  const ref = queue.values().next().value;
  queue.delete(ref);

  if (visited.has(ref)) continue;
  visited.add(ref);

  const filePath = path.join(distDir, ref);
  if (!fs.existsSync(filePath)) {
    missing.add(ref);
    continue;
  }

  if (ref.endsWith(".js")) {
    for (const child of collectAssetRefs(fs.readFileSync(filePath, "utf8"))) {
      if (!visited.has(child)) queue.add(child);
    }
  }
}

if (missing.size > 0) {
  console.error("verify-build-assets: missing build artifacts:");
  for (const ref of missing) console.error(`  - ${ref}`);
  process.exit(1);
}

console.log(`verify-build-assets: OK (${visited.size} assets verified)`);
