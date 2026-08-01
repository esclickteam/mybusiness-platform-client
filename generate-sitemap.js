import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://bizuply.com';

// Full list of static pages
const staticPages = [
  { url: '', lastmod: '2025-07-09', changefreq: 'weekly', priority: 1.0 },           // Homepage
  { url: 'about', lastmod: '2025-07-01', changefreq: 'monthly', priority: 0.8 },     // About
  { url: 'contact', lastmod: '2025-07-01', changefreq: 'monthly', priority: 0.7 },   // Contact
  { url: 'terms', lastmod: '2025-06-25', changefreq: 'yearly', priority: 0.5 },      // Terms of Use
  { url: 'privacy', lastmod: '2025-06-25', changefreq: 'yearly', priority: 0.5 },    // Privacy Policy
  { url: 'faq', lastmod: '2025-07-01', changefreq: 'monthly', priority: 0.6 },       // FAQ
  { url: 'how-it-works', lastmod: '2025-07-01', changefreq: 'monthly', priority: 0.7 }, // How It Works
  { url: 'join', lastmod: '2025-07-01', changefreq: 'monthly', priority: 0.6 },      // Join
  { url: 'search', lastmod: '2025-07-09', changefreq: 'daily', priority: 0.9 },      // Search
  { url: 'pricing', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.9 },   // Pricing
  { url: 'features', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.7 },  // Features
  { url: 'solutions', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.7 }, // Solutions
  { url: 'crm', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.6 },       // CRM product page
  { url: 'collaborations', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.6 }, // Collaborations product page
  { url: 'website-builder', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.6 }, // Website builder product page
  { url: 'automations', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.6 }, // Automations product page
  { url: 'agents', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.6 },    // AI agents product page
  { url: 'accessibility', lastmod: '2026-08-01', changefreq: 'yearly', priority: 0.4 }, // Accessibility statement
];

function createUrlXml({ url, lastmod, changefreq, priority }) {
  return `
  <url>
    <loc>${BASE_URL}/${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(createUrlXml).join('')}
</urlset>`;

  const outputDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'marketing-sitemap.xml'), sitemap.trim(), 'utf8');
  console.log('Sitemap generated at public/marketing-sitemap.xml');
}

generateSitemap();
