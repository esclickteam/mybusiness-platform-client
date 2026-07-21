const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const from = path.join(distDir, "index.html");
const to = path.join(distDir, "spa-shell.html");

if (!fs.existsSync(from)) {
  console.error("copy-spa-shell: dist/index.html missing");
  process.exit(1);
}

fs.copyFileSync(from, to);
console.log("copy-spa-shell: wrote dist/spa-shell.html");
