import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildMarketingRobotsTxt,
  buildMarketingSitemapXml,
} from "./src/lib/marketingSeo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Public marketing routes only. /saas stays unlisted until launch.
function generateSitemap() {
  const outputDir = path.resolve(__dirname, "public");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "marketing-sitemap.xml"),
    buildMarketingSitemapXml(),
    "utf8",
  );
  fs.writeFileSync(
    path.join(outputDir, "marketing-robots.txt"),
    buildMarketingRobotsTxt(),
    "utf8",
  );
  console.log("Wrote public/marketing-sitemap.xml and public/marketing-robots.txt");
}

generateSitemap();
