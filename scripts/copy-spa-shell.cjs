const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const assetsDir = path.join(distDir, "assets");
const from = path.join(distDir, "index.html");
const to = path.join(assetsDir, "bizuply-spa-shell.html");

if (!fs.existsSync(from)) {
  console.error("copy-spa-shell: dist/index.html missing");
  process.exit(1);
}

fs.mkdirSync(assetsDir, { recursive: true });
fs.copyFileSync(from, to);
console.log("copy-spa-shell: wrote dist/assets/bizuply-spa-shell.html");
