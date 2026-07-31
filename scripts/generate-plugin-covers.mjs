#!/usr/bin/env node
/**
 * Generates professional SVG cover art for each plugin in the store.
 * Output: public/plugin-covers/{key}.svg
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/plugin-covers");

const PLUGINS = [
  { key: "store", accent: "#7C3AED", scene: "shop" },
  { key: "booking", accent: "#0284C7", scene: "calendar" },
  { key: "payments", accent: "#059669", scene: "payment" },
  { key: "invoices", accent: "#10B981", scene: "invoice" },
  { key: "leads", accent: "#6366F1", scene: "form" },
  { key: "reviews", accent: "#F59E0B", scene: "stars" },
  { key: "club", accent: "#8B5CF6", scene: "members" },
  { key: "heatmap", accent: "#EF4444", scene: "heatmap" },
  { key: "form-abandonment", accent: "#F97316", scene: "form-exit" },
  { key: "journey-recording", accent: "#EC4899", scene: "journey" },
  { key: "countdown", accent: "#A855F7", scene: "countdown" },
  { key: "benefits-wheel", accent: "#D946EF", scene: "wheel" },
  { key: "smart-bot", accent: "#0F766E", scene: "chatbot" },
  { key: "service-finder", accent: "#2563EB", scene: "quiz" },
  { key: "accessibility", accent: "#0891B2", scene: "accessibility" },
  { key: "ask-customer-first", accent: "#6366F1", scene: "qa" },
  { key: "smart-search", accent: "#2563EB", scene: "search" },
  { key: "language-switcher", accent: "#8B5CF6", scene: "languages" },
  { key: "whatsapp-float", accent: "#22C55E", scene: "whatsapp" },
  { key: "table-of-contents", accent: "#7C3AED", scene: "toc" },
  { key: "logo-carousel", accent: "#F59E0B", scene: "logos" },
  { key: "timeline", accent: "#EC4899", scene: "timeline" },
  { key: "tabs", accent: "#3B82F6", scene: "tabs" },
  { key: "pricing-table", accent: "#059669", scene: "pricing" },
  { key: "before-after", accent: "#D946EF", scene: "before-after" },
  { key: "testimonials-carousel", accent: "#EAB308", scene: "testimonials" },
  { key: "floating-call", accent: "#10B981", scene: "phone-float" },
  { key: "callback-widget", accent: "#6366F1", scene: "callback" },
  { key: "multi-step-form", accent: "#4F46E5", scene: "steps" },
  { key: "exit-popup", accent: "#EF4444", scene: "popup" },
  { key: "floating-side-form", accent: "#8B5CF6", scene: "side-form" },
  { key: "floating-booking", accent: "#0284C7", scene: "book-float" },
  { key: "certificates", accent: "#CA8A04", scene: "certificate" },
  { key: "verified-badge", accent: "#059669", scene: "verified" },
  { key: "customer-counter", accent: "#3B82F6", scene: "counter" },
  { key: "digital-menu", accent: "#DC2626", scene: "menu" },
  { key: "whatsapp-catalog", accent: "#22C55E", scene: "wa-catalog" },
  { key: "product-filters", accent: "#7C3AED", scene: "filters" },
  { key: "wishlist", accent: "#EC4899", scene: "wishlist" },
  { key: "back-in-stock", accent: "#F97316", scene: "stock-alert" },
  { key: "audio-player", accent: "#14B8A6", scene: "audio" },
  { key: "video-stories", accent: "#D946EF", scene: "stories" },
  { key: "qr-generator", accent: "#1E293B", scene: "qr" },
  { key: "business-hours", accent: "#0284C7", scene: "hours" },
  { key: "coupon-copy", accent: "#F59E0B", scene: "coupon" },
  { key: "announcement-bar", accent: "#6366F1", scene: "banner" },
  { key: "dark-mode", accent: "#1E293B", scene: "darkmode" },
  { key: "local-weather", accent: "#38BDF8", scene: "weather" },
  { key: "timezone-clock", accent: "#2563EB", scene: "clock" },
  { key: "events-calendar", accent: "#7C3AED", scene: "events" },
  { key: "google-maps", accent: "#EA4335", scene: "maps" },
];

function lighten(hex, amt = 0.35) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * amt);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

function darken(hex, amt = 0.25) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const mix = (c) => Math.round(c * (1 - amt));
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

function browser(accent, inner, w = 280, h = 170, x = 180, y = 115) {
  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fff"/>
      <rect x="${x}" y="${y}" width="${w}" height="28" rx="10" fill="${lighten(accent, 0.85)}"/>
      <rect x="${x}" y="${y + 18}" width="${w}" height="10" fill="${lighten(accent, 0.85)}"/>
      <circle cx="${x + 18}" cy="${y + 14}" r="5" fill="#FCA5A5"/>
      <circle cx="${x + 34}" cy="${y + 14}" r="5" fill="#FCD34D"/>
      <circle cx="${x + 50}" cy="${y + 14}" r="5" fill="#86EFAC"/>
      <rect x="${x + 70}" y="${y + 8}" width="${w - 90}" height="12" rx="6" fill="#fff" opacity="0.8"/>
      ${inner}
    </g>`;
}

function phone(accent, inner, x = 220, y = 80) {
  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="120" height="220" rx="16" fill="#1e293b"/>
      <rect x="${x + 6}" y="${y + 6}" width="108" height="208" rx="12" fill="#fff"/>
      <rect x="${x + 40}" y="${y + 12}" width="40" height="6" rx="3" fill="#e2e8f0"/>
      ${inner}
    </g>`;
}

function floatBtn(accent, label, x, y, r = 28) {
  return `
    <circle cx="${x}" cy="${y}" r="${r + 6}" fill="${accent}" opacity="0.15"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" filter="url(#shadow)"/>
    <text x="${x}" y="${y + 5}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="system-ui,sans-serif">${label}</text>`;
}

const SCENES = {
  shop: (a) => browser(a, `
    <rect x="200" y="160" width="55" height="55" rx="8" fill="${lighten(a)}"/>
    <rect x="265" y="160" width="55" height="55" rx="8" fill="${lighten(a, 0.5)}"/>
    <rect x="330" y="160" width="55" height="55" rx="8" fill="${lighten(a, 0.5)}"/>
    <rect x="395" y="160" width="55" height="55" rx="8" fill="${lighten(a)}"/>
    <rect x="200" y="225" width="115" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="200" y="240" width="80" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="330" y="225" width="115" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="380" y="255" width="70" height="22" rx="6" fill="${a}"/>
  `),
  calendar: (a) => browser(a, `
    <rect x="195" y="155" width="250" height="120" rx="6" fill="${lighten(a, 0.9)}"/>
    ${[0,1,2,3,4,5,6].map(i => `<rect x="${200 + i*34}" y="162" width="28" height="20" rx="4" fill="#fff"/>`).join("")}
    ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => {
      const col = i % 7; const row = Math.floor(i / 7);
      const hl = i === 8;
      return `<rect x="${200 + col*34}" y="${188 + row*24}" width="28" height="20" rx="4" fill="${hl ? a : "#fff"}" opacity="${hl ? 1 : 0.9}"/>`;
    }).join("")}
  `),
  payment: (a) => browser(a, `
    <rect x="210" y="160" width="220" height="100" rx="10" fill="${lighten(a, 0.88)}" stroke="${a}" stroke-width="2"/>
    <rect x="230" y="180" width="180" height="14" rx="4" fill="#fff"/>
    <rect x="230" y="205" width="120" height="14" rx="4" fill="#fff"/>
    <rect x="230" y="230" width="80" height="22" rx="6" fill="${a}"/>
    <rect x="340" y="175" width="50" height="32" rx="6" fill="${darken(a)}" opacity="0.3"/>
  `),
  invoice: (a) => browser(a, `
    <rect x="220" y="155" width="200" height="130" rx="6" fill="#fff" stroke="${lighten(a)}" stroke-width="2"/>
    <rect x="235" y="170" width="100" height="10" rx="3" fill="${a}"/>
    <rect x="235" y="190" width="170" height="6" rx="2" fill="#e2e8f0"/>
    <rect x="235" y="205" width="150" height="6" rx="2" fill="#e2e8f0"/>
    <rect x="235" y="220" width="160" height="6" rx="2" fill="#e2e8f0"/>
    <line x1="235" y1="245" x2="405" y2="245" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="320" y="255" width="70" height="18" rx="4" fill="${a}"/>
  `),
  form: (a) => browser(a, `
    <rect x="240" y="155" width="160" height="130" rx="8" fill="#fff" stroke="${lighten(a)}" stroke-width="2"/>
    <rect x="255" y="172" width="130" height="16" rx="4" fill="${lighten(a, 0.9)}"/>
    <rect x="255" y="198" width="130" height="16" rx="4" fill="${lighten(a, 0.9)}"/>
    <rect x="255" y="224" width="130" height="40" rx="4" fill="${lighten(a, 0.9)}"/>
    <rect x="255" y="272" width="80" height="20" rx="6" fill="${a}"/>
  `),
  stars: (a) => browser(a, `
    ${[0,1,2,3,4].map(i => `<polygon points="${260+i*30},175 ${265+i*30},190 ${280+i*30},190 ${268+i*30},200 ${272+i*30},215 ${260+i*30},207 ${248+i*30},215 ${252+i*30},200 ${240+i*30},190 ${255+i*30},190" fill="${a}"/>`).join("")}
    <rect x="220" y="230" width="240" height="50" rx="8" fill="#fff"/>
    <rect x="235" y="242" width="180" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="235" y="258" width="120" height="8" rx="3" fill="#e2e8f0"/>
  `),
  members: (a) => browser(a, `
    ${[0,1,2].map(i => `<circle cx="${280 + i*50}" cy="185" r="22" fill="${lighten(a, i*0.1)}"/>`).join("")}
    <rect x="210" y="220" width="240" height="60" rx="8" fill="#fff"/>
    <rect x="225" y="235" width="150" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="225" y="252" width="100" height="8" rx="3" fill="${a}" opacity="0.5"/>
    <rect x="340" y="245" width="90" height="24" rx="6" fill="${a}"/>
  `),
  heatmap: (a) => browser(a, `
    ${Array.from({length: 48}, (_, i) => {
      const col = i % 8; const row = Math.floor(i / 8);
      const op = 0.2 + (Math.sin(i * 1.7) + 1) * 0.35;
      return `<rect x="${200 + col*30}" y="${158 + row*22}" width="26" height="18" rx="3" fill="${a}" opacity="${op.toFixed(2)}"/>`;
    }).join("")}
  `),
  "form-exit": (a) => browser(a, `
    <rect x="210" y="160" width="220" height="90" rx="8" fill="#fff" stroke="${a}" stroke-width="2" stroke-dasharray="6 4"/>
    <rect x="230" y="178" width="180" height="12" rx="4" fill="#e2e8f0"/>
    <rect x="230" y="198" width="140" height="12" rx="4" fill="#e2e8f0"/>
    <text x="320" y="240" text-anchor="middle" fill="${a}" font-size="28" font-family="system-ui">↩</text>
  `),
  journey: (a) => browser(a, `
    <path d="M220 250 Q280 180 340 220 T420 190" fill="none" stroke="${a}" stroke-width="3" stroke-dasharray="8 4"/>
    <circle cx="220" cy="250" r="8" fill="${a}"/>
    <circle cx="340" cy="220" r="8" fill="${lighten(a)}"/>
    <circle cx="420" cy="190" r="8" fill="${darken(a)}"/>
    <rect x="250" y="165" width="140" height="30" rx="6" fill="#fff" opacity="0.9"/>
  `),
  countdown: (a) => browser(a, `
    ${["09","42","17"].map((t, i) => `
      <rect x="${240 + i*55}" y="175" width="48" height="55" rx="8" fill="${darken(a)}" opacity="0.85"/>
      <text x="${264 + i*55}" y="212" text-anchor="middle" fill="#fff" font-size="22" font-weight="700" font-family="monospace">${t}</text>
    `).join("")}
    <rect x="290" y="195" width="8" height="8" rx="2" fill="#fff"/>
    <rect x="345" y="195" width="8" height="8" rx="2" fill="#fff"/>
  `),
  wheel: (a) => {
    const cx = 320; const cy = 220;
    return browser(a, `
      <circle cx="${cx}" cy="${cy}" r="55" fill="${lighten(a)}" stroke="${a}" stroke-width="4"/>
      ${[0,1,2,3,4,5].map(i => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        const x2 = cx + Math.cos(angle) * 55;
        const y2 = cy + Math.sin(angle) * 55;
        return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${a}" stroke-width="2"/>`;
      }).join("")}
      <circle cx="${cx}" cy="${cy}" r="12" fill="${a}"/>
    `);
  },
  chatbot: (a) => browser(a, `
    <rect x="220" y="165" width="200" height="110" rx="10" fill="#fff"/>
    <rect x="235" y="180" width="120" height="28" rx="12" fill="${lighten(a, 0.85)}"/>
    <rect x="285" y="218" width="120" height="28" rx="12" fill="${a}" opacity="0.85"/>
    <circle cx="395" cy="275" r="18" fill="${a}"/>
    <rect x="388" y="268" width="14" height="10" rx="3" fill="#fff"/>
  `),
  quiz: (a) => browser(a, `
    <rect x="230" y="160" width="200" height="35" rx="8" fill="${a}" opacity="0.9"/>
    <rect x="240" y="205" width="180" height="22" rx="6" fill="#fff" stroke="${lighten(a)}" stroke-width="2"/>
    <rect x="240" y="235" width="180" height="22" rx="6" fill="#fff" stroke="${lighten(a)}" stroke-width="2"/>
    <rect x="240" y="265" width="180" height="22" rx="6" fill="${lighten(a, 0.8)}" stroke="${a}" stroke-width="2"/>
  `),
  accessibility: (a) => browser(a, `
    <circle cx="320" cy="210" r="35" fill="none" stroke="${a}" stroke-width="4"/>
    <circle cx="320" cy="195" r="8" fill="${a}"/>
    <line x1="320" y1="203" x2="320" y2="235" stroke="${a}" stroke-width="4"/>
    <line x1="300" y1="218" x2="340" y2="218" stroke="${a}" stroke-width="4"/>
    <line x1="305" y1="235" x2="295" y2="255" stroke="${a}" stroke-width="4"/>
    <line x1="335" y1="235" x2="345" y2="255" stroke="${a}" stroke-width="4"/>
  `),
  qa: (a) => browser(a, `
    <rect x="220" y="170" width="200" height="40" rx="8" fill="${lighten(a, 0.88)}"/>
    <text x="235" y="195" fill="${darken(a)}" font-size="11" font-family="system-ui">?</text>
    <rect x="250" y="220" width="170" height="60" rx="8" fill="#fff"/>
    <rect x="265" y="235" width="140" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="265" y="252" width="100" height="8" rx="3" fill="#e2e8f0"/>
  `),
  search: (a) => browser(a, `
    <rect x="210" y="175" width="230" height="36" rx="18" fill="#fff" stroke="${a}" stroke-width="2"/>
    <circle cx="420" cy="193" r="10" fill="none" stroke="${a}" stroke-width="3"/>
    <line x1="427" y1="200" x2="435" y2="208" stroke="${a}" stroke-width="3"/>
    <rect x="220" y="225" width="210" height="28" rx="6" fill="${lighten(a, 0.9)}"/>
    <rect x="220" y="260" width="180" height="28" rx="6" fill="${lighten(a, 0.9)}"/>
  `),
  languages: (a) => browser(a, `
    ${["🇮🇱","🇺🇸","🇫🇷"].map((_, i) => `<rect x="${240 + i*55}" y="180" width="45" height="30" rx="6" fill="${lighten(a, i*0.08)}" stroke="${i===0?a:'#e2e8f0'}" stroke-width="${i===0?2:1}"/>`).join("")}
    <rect x="230" y="225" width="220" height="60" rx="8" fill="#fff"/>
    <rect x="245" y="240" width="190" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="245" y="258" width="150" height="8" rx="3" fill="#e2e8f0"/>
  `),
  whatsapp: (a) => `
    ${browser(a, `<rect x="210" y="160" width="230" height="110" rx="8" fill="${lighten(a, 0.92)}"/>`)}
    ${floatBtn(a, "WA", 480, 280, 32)}
  `,
  toc: (a) => browser(a, `
    <rect x="200" y="155" width="80" height="120" rx="6" fill="${lighten(a, 0.9)}"/>
    ${[0,1,2,3,4].map(i => `<rect x="210" y="${168 + i*20}" width="55" height="8" rx="3" fill="${i===1?a:'#fff'}"/>`).join("")}
    <rect x="295" y="155" width="155" height="120" rx="6" fill="#fff"/>
    <rect x="305" y="168" width="100" height="10" rx="3" fill="${a}" opacity="0.6"/>
    <rect x="305" y="188" width="130" height="6" rx="2" fill="#e2e8f0"/>
    <rect x="305" y="202" width="120" height="6" rx="2" fill="#e2e8f0"/>
  `),
  logos: (a) => browser(a, `
    ${[0,1,2,3,4].map(i => `<rect x="${205 + i*48}" y="185" width="40" height="40" rx="8" fill="${lighten(a, i*0.05)}" stroke="#e2e8f0"/>`).join("")}
    <rect x="220" y="240" width="200" height="6" rx="3" fill="#e2e8f0"/>
  `),
  timeline: (a) => browser(a, `
    <line x1="250" y1="170" x2="250" y2="270" stroke="${a}" stroke-width="3"/>
    ${[0,1,2].map(i => `
      <circle cx="250" cy="${185 + i*40}" r="8" fill="${a}"/>
      <rect x="270" y="${175 + i*40}" width="150" height="28" rx="6" fill="${lighten(a, 0.85)}"/>
    `).join("")}
  `),
  tabs: (a) => browser(a, `
    ${[0,1,2].map(i => `<rect x="${220 + i*70}" y="158" width="65" height="24" rx="6" fill="${i===0?a:lighten(a,0.9)}" opacity="${i===0?1:0.7}"/>`).join("")}
    <rect x="210" y="182" width="250" height="90" rx="0" fill="#fff"/>
    <rect x="220" y="195" width="200" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="220" y="212" width="180" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="220" y="229" width="160" height="8" rx="3" fill="#e2e8f0"/>
  `),
  pricing: (a) => browser(a, `
    ${[0,1,2].map(i => `
      <rect x="${210 + i*82}" y="165" width="72" height="100" rx="8" fill="${i===1?a:'#fff'}" stroke="${i===1?'none':lighten(a)}" stroke-width="2"/>
      <rect x="${220 + i*82}" y="180" width="52" height="8" rx="3" fill="${i===1?'#fff':'#e2e8f0'}" opacity="0.8"/>
      <rect x="${220 + i*82}" y="200" width="40" height="14" rx="3" fill="${i===1?'#fff':a}" opacity="0.6"/>
    `).join("")}
  `),
  "before-after": (a) => browser(a, `
    <rect x="210" y="165" width="115" height="100" rx="6" fill="${lighten(a, 0.7)}"/>
    <rect x="325" y="165" width="115" height="100" rx="6" fill="${a}" opacity="0.5"/>
    <line x1="320" y1="165" x2="320" y2="265" stroke="#fff" stroke-width="4"/>
    <circle cx="320" cy="215" r="12" fill="#fff"/>
  `),
  gallery: (a) => browser(a, `
    <rect x="200" y="158" width="70" height="90" rx="4" fill="${lighten(a)}"/>
    <rect x="278" y="158" width="55" height="42" rx="4" fill="${lighten(a, 0.5)}"/>
    <rect x="278" y="206" width="55" height="42" rx="4" fill="${a}" opacity="0.4"/>
    <rect x="343" y="158" width="70" height="55" rx="4" fill="${lighten(a, 0.3)}"/>
    <rect x="343" y="220" width="70" height="28" rx="4" fill="${lighten(a)}"/>
    <rect x="200" y="255" width="133" height="28" rx="4" fill="${a}" opacity="0.35"/>
  `),
  testimonials: (a) => browser(a, `
    <rect x="215" y="170" width="230" height="90" rx="10" fill="#fff" stroke="${lighten(a)}" stroke-width="2"/>
    <circle cx="245" cy="200" r="18" fill="${lighten(a)}"/>
    ${[0,1,2,3,4].map(i => `<polygon points="${280+i*14},188 ${283+i*14},196 ${291+i*14},196 ${285+i*14},201 ${287+i*14},209 ${280+i*14},204 ${273+i*14},209 ${275+i*14},201 ${269+i*14},196 ${277+i*14},196" fill="${a}" transform="scale(0.7) translate(130,60)"/>`).join("")}
    <rect x="265" y="210" width="160" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="265" y="225" width="120" height="8" rx="3" fill="#e2e8f0"/>
  `),
  "phone-float": (a) => `
    ${browser(a, `<rect x="210" y="160" width="230" height="110" rx="8" fill="${lighten(a, 0.92)}"/>`)}
    ${floatBtn(a, "📞", 490, 290, 30)}
  `,
  callback: (a) => browser(a, `
    <rect x="350" y="160" width="90" height="130" rx="8" fill="#fff" stroke="${a}" stroke-width="2" filter="url(#shadow)"/>
    <rect x="360" y="175" width="70" height="14" rx="4" fill="${lighten(a, 0.9)}"/>
    <rect x="360" y="198" width="70" height="14" rx="4" fill="${lighten(a, 0.9)}"/>
    <rect x="360" y="230" width="70" height="22" rx="6" fill="${a}"/>
  `),
  steps: (a) => browser(a, `
    ${[0,1,2].map(i => `
      <circle cx="${260 + i*60}" cy="185" r="14" fill="${i<=1?a:lighten(a)}" opacity="${i<=1?1:0.5}"/>
      <rect x="${240 + i*60}" y="210" width="40" height="50" rx="6" fill="#fff" stroke="${lighten(a)}"/>
    `).join("")}
    ${[0,1].map(i => `<line x1="${274 + i*60}" y1="185" x2="${286 + i*60}" y2="185" stroke="${a}" stroke-width="2"/>`).join("")}
  `),
  popup: (a) => browser(a, `
    <rect x="210" y="160" width="230" height="110" rx="8" fill="${lighten(a, 0.92)}" opacity="0.5"/>
    <rect x="240" y="175" width="170" height="80" rx="10" fill="#fff" stroke="${a}" stroke-width="2" filter="url(#shadow)"/>
    <rect x="255" y="190" width="140" height="10" rx="3" fill="${a}"/>
    <rect x="255" y="210" width="100" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="255" y="230" width="70" height="18" rx="5" fill="${a}"/>
  `),
  "side-form": (a) => browser(a, `
    <rect x="210" y="160" width="200" height="110" rx="8" fill="${lighten(a, 0.92)}" opacity="0.6"/>
    <rect x="380" y="160" width="60" height="110" rx="8" fill="${a}" filter="url(#shadow)"/>
    <rect x="388" y="200" width="8" height="30" rx="4" fill="#fff" opacity="0.8"/>
  `),
  "book-float": (a) => `
    ${browser(a, `<rect x="210" y="160" width="230" height="110" rx="8" fill="${lighten(a, 0.92)}"/>`)}
    ${floatBtn(a, "📅", 490, 290, 30)}
  `,
  download: (a) => browser(a, `
    <rect x="260" y="170" width="120" height="90" rx="8" fill="#fff" stroke="${a}" stroke-width="2"/>
    <path d="M310 195 L310 230 M295 218 L310 235 L325 218" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
    <rect x="275" y="245" width="90" height="10" rx="3" fill="${a}"/>
  `),
  certificate: (a) => browser(a, `
    <rect x="250" y="165" width="140" height="100" rx="4" fill="${lighten(a, 0.88)}" stroke="${a}" stroke-width="2"/>
    <circle cx="320" cy="200" r="20" fill="none" stroke="${a}" stroke-width="2"/>
    <rect x="270" y="230" width="100" height="6" rx="2" fill="${a}" opacity="0.4"/>
    <rect x="280" y="245" width="80" height="6" rx="2" fill="${a}" opacity="0.3"/>
  `),
  verified: (a) => browser(a, `
    <circle cx="320" cy="215" r="45" fill="${lighten(a, 0.85)}" stroke="${a}" stroke-width="3"/>
    <path d="M300 215 L315 230 L345 200" fill="none" stroke="${a}" stroke-width="5" stroke-linecap="round"/>
  `),
  rating: (a) => browser(a, `
    <text x="320" y="210" text-anchor="middle" fill="${a}" font-size="48" font-weight="700" font-family="system-ui">4.8</text>
    ${[0,1,2,3,4].map(i => `<polygon points="${220+i*25},240 ${225+i*25},252 ${237+i*25},252 ${228+i*25},260 ${231+i*25},272 ${220+i*25},265 ${209+i*25},272 ${212+i*25},260 ${203+i*25},252 ${215+i*25},252" fill="${a}"/>`).join("")}
  `),
  counter: (a) => browser(a, `
    ${[{n:"500+",l:"לקוחות"},{n:"8",l:"שנים"},{n:"1.2K",l:"פרויקטים"}].map((item, i) => `
      <rect x="${210 + i*82}" y="175" width="72" height="70" rx="8" fill="#fff" stroke="${lighten(a)}" stroke-width="1"/>
      <text x="${246 + i*82}" y="210" text-anchor="middle" fill="${a}" font-size="18" font-weight="700" font-family="system-ui">${item.n}</text>
      <rect x="${225 + i*82}" y="220" width="44" height="6" rx="2" fill="#e2e8f0"/>
    `).join("")}
  `),
  security: (a) => browser(a, `
    <path d="M320 165 L370 185 L370 225 Q370 260 320 275 Q270 260 270 225 L270 185 Z" fill="${lighten(a, 0.85)}" stroke="${a}" stroke-width="2"/>
    <path d="M305 225 L318 238 L340 210" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
  `),
  menu: (a) => phone(a, `
    ${[0,1,2].map(i => `
      <rect x="232" y="${110 + i*55}" width="92" height="45" rx="6" fill="${lighten(a, i*0.08)}"/>
      <rect x="240" y="${120 + i*55}" width="50" height="6" rx="2" fill="${a}" opacity="0.5"/>
    `).join("")}
  `),
  "wa-catalog": (a) => phone(a, `
    ${[0,1,2].map(i => `
      <rect x="232" y="${105 + i*50}" width="92" height="40" rx="6" fill="${lighten(a, 0.85)}"/>
      <circle cx="250" cy="${125 + i*50}" r="12" fill="${a}" opacity="0.3"/>
    `).join("")}
  `),
  filters: (a) => browser(a, `
    <rect x="200" y="165" width="70" height="100" rx="6" fill="${lighten(a, 0.9)}"/>
    ${[0,1,2,3].map(i => `<rect x="210" y="${178 + i*22}" width="50" height="12" rx="4" fill="${i===1?a:'#fff'}"/>`).join("")}
    <rect x="285" y="165" width="155" height="100" rx="6" fill="#fff"/>
    ${[0,1,2].map(i => `<rect x="295" y="${175 + i*30}" width="60" height="50" rx="4" fill="${lighten(a, i*0.1)}"/>`).join("")}
  `),
  wishlist: (a) => browser(a, `
    ${[0,1,2].map(i => `<rect x="${220 + i*65}" y="175" width="55" height="55" rx="6" fill="${lighten(a, i*0.08)}"/>`).join("")}
    <path d="M395 195 C395 185 410 185 410 195 C410 205 395 220 395 220 C395 220 380 205 380 195 C380 185 395 185 395 195" fill="${a}"/>
  `),
  "stock-alert": (a) => browser(a, `
    <rect x="240" y="170" width="160" height="90" rx="8" fill="#fff" stroke="${a}" stroke-width="2"/>
    <circle cx="380" cy="185" r="14" fill="${a}"/>
    <rect x="255" y="195" width="110" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="255" y="215" width="130" height="14" rx="4" fill="${lighten(a, 0.9)}"/>
    <rect x="255" y="240" width="80" height="18" rx="5" fill="${a}"/>
  `),
  "video-float": (a) => `
    ${browser(a, `<rect x="210" y="160" width="230" height="110" rx="8" fill="${lighten(a, 0.92)}"/>`)}
    <rect x="420" y="250" width="90" height="55" rx="8" fill="#1e293b" filter="url(#shadow)"/>
    <polygon points="455,265 455,290 475,277" fill="#fff"/>
  `,
  "video-grid": (a) => browser(a, `
    ${[0,1,2,3].map(i => {
      const col = i % 2; const row = Math.floor(i / 2);
      return `<rect x="${220 + col*115}" y="${165 + row*55}" width="105" height="48" rx="6" fill="${darken(a, row*0.05)}" opacity="0.7"/>
        <polygon points="${260+col*115},185 ${260+col*115},200 ${275+col*115},192" fill="#fff"/>`;
    }).join("")}
  `),
  audio: (a) => browser(a, `
    <rect x="230" y="185" width="180" height="50" rx="25" fill="${a}" opacity="0.9"/>
    <circle cx="260" cy="210" r="16" fill="#fff"/>
    <polygon points="255,205 255,215 265,210" fill="${a}"/>
    ${[0,1,2,3,4,5,6,7].map(i => `<rect x="${290 + i*12}" y="${200 - Math.sin(i)*8}" width="4" height="${20 + Math.sin(i)*8}" rx="2" fill="#fff" opacity="0.8"/>`).join("")}
  `),
  stories: (a) => phone(a, `
    ${[0,1,2].map(i => `
      <circle cx="${270 + i*25}" cy="105" r="16" fill="none" stroke="${a}" stroke-width="2"/>
      <circle cx="${270 + i*25}" cy="105" r="12" fill="${lighten(a, i*0.1)}"/>
    `).join("")}
    <rect x="232" y="135" width="92" height="140" rx="8" fill="${darken(a)}" opacity="0.6"/>
    <polygon points="270,200 270,220 285,210" fill="#fff"/>
  `),
  qr: (a) => browser(a, `
    <rect x="270" y="170" width="100" height="100" rx="6" fill="#fff" stroke="${a}" stroke-width="2"/>
    ${[[0,0],[0,3],[3,0],[3,3]].map(([r,c]) => `
      <rect x="${278 + c*28}" y="${178 + r*28}" width="20" height="20" rx="2" fill="${a}"/>
      <rect x="${283 + c*28}" y="${183 + r*28}" width="10" height="10" rx="1" fill="#fff"/>
    `).join("")}
    ${[[1,1],[1,2],[2,1]].map(([r,c]) => `<rect x="${278 + c*28}" y="${178 + r*28}" width="10" height="10" fill="${a}"/>`).join("")}
  `),
  hours: (a) => browser(a, `
    <rect x="240" y="175" width="160" height="80" rx="10" fill="#fff" stroke="${a}" stroke-width="2"/>
    <circle cx="320" cy="205" r="6" fill="#22C55E"/>
    <text x="335" y="210" fill="#22C55E" font-size="12" font-weight="700" font-family="system-ui">פתוחים</text>
    <rect x="255" y="225" width="130" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="255" y="240" width="90" height="8" rx="3" fill="#e2e8f0"/>
  `),
  coupon: (a) => browser(a, `
    <rect x="250" y="175" width="140" height="70" rx="8" fill="${lighten(a, 0.88)}" stroke="${a}" stroke-width="2" stroke-dasharray="8 4"/>
    <text x="320" y="210" text-anchor="middle" fill="${a}" font-size="20" font-weight="700" font-family="monospace">SALE20</text>
    <rect x="280" y="225" width="80" height="18" rx="5" fill="${a}"/>
  `),
  banner: (a) => browser(a, `
    <rect x="210" y="155" width="230" height="28" rx="0" fill="${a}"/>
    <rect x="220" y="163" width="180" height="8" rx="3" fill="#fff" opacity="0.9"/>
    <rect x="210" y="183" width="230" height="87" rx="0" fill="${lighten(a, 0.95)}"/>
    <rect x="230" y="200" width="190" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="230" y="218" width="170" height="8" rx="3" fill="#e2e8f0"/>
  `),
  scroll: (a) => browser(a, `
    <rect x="210" y="155" width="230" height="115" rx="8" fill="${lighten(a, 0.95)}"/>
    <rect x="210" y="155" width="230" height="4" rx="2" fill="${a}"/>
    <rect x="210" y="155" width="115" height="4" rx="2" fill="${darken(a)}"/>
    <rect x="230" y="180" width="190" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="230" y="200" width="170" height="8" rx="3" fill="#e2e8f0"/>
    <rect x="230" y="220" width="150" height="8" rx="3" fill="#e2e8f0"/>
  `),
  darkmode: (a) => browser(a, `
    <rect x="210" y="160" width="230" height="110" rx="8" fill="#1e293b"/>
    <rect x="230" y="180" width="190" height="8" rx="3" fill="#475569"/>
    <rect x="230" y="200" width="170" height="8" rx="3" fill="#475569"/>
    <circle cx="400" cy="245" r="20" fill="${a}"/>
    <path d="M400 235 A10 10 0 0 0 390 245 A8 8 0 0 1 400 235" fill="#1e293b"/>
  `),
  "text-size": (a) => browser(a, `
    <text x="280" y="210" fill="${a}" font-size="14" font-family="system-ui">A</text>
    <text x="320" y="215" fill="${darken(a)}" font-size="20" font-weight="700" font-family="system-ui">A</text>
    <text x="360" y="222" fill="${a}" font-size="28" font-weight="700" font-family="system-ui">A</text>
    <rect x="250" y="235" width="140" height="30" rx="6" fill="${lighten(a, 0.9)}"/>
  `),
  weather: (a) => browser(a, `
    <circle cx="290" cy="200" r="22" fill="#FCD34D"/>
    <path d="M330 210 Q350 195 365 210 Q375 225 355 230 L300 230 Q275 230 280 210 Q285 200 300 205" fill="${lighten(a)}"/>
    <text x="320" y="255" text-anchor="middle" fill="${darken(a)}" font-size="16" font-weight="600" font-family="system-ui">24°C</text>
  `),
  clock: (a) => browser(a, `
    <circle cx="320" cy="215" r="45" fill="#fff" stroke="${a}" stroke-width="3"/>
    <line x1="320" y1="215" x2="320" y2="185" stroke="${a}" stroke-width="3" stroke-linecap="round"/>
    <line x1="320" y1="215" x2="345" y2="215" stroke="${darken(a)}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="320" cy="215" r="4" fill="${a}"/>
    <text x="320" y="275" text-anchor="middle" fill="${a}" font-size="11" font-family="system-ui">14:30</text>
  `),
  events: (a) => browser(a, `
    ${[0,1,2].map(i => `
      <rect x="220" y="${170 + i*32}" width="210" height="26" rx="6" fill="${i===0?lighten(a,0.85):'#fff'}" stroke="${lighten(a)}" stroke-width="1"/>
      <rect x="228" y="${178 + i*32}" width="8" height="10" rx="2" fill="${a}"/>
    `).join("")}
  `),
  maps: (a) => browser(a, `
    <rect x="210" y="160" width="230" height="110" rx="8" fill="${lighten(a, 0.92)}"/>
    <path d="M250 220 L280 190 L320 210 L360 180 L400 200" fill="none" stroke="${a}" stroke-width="2" opacity="0.4"/>
    <path d="M240 240 L270 230 L300 250 L340 220 L380 235" fill="none" stroke="#22C55E" stroke-width="3" opacity="0.5"/>
    <circle cx="320" cy="210" r="12" fill="${a}"/>
    <circle cx="320" cy="210" r="5" fill="#fff"/>
  `),
};

function buildSvg({ key, accent, scene }) {
  const render = SCENES[scene] || SCENES.form;
  const content = render(accent);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400">
  <defs>
    <linearGradient id="bg-${key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${lighten(accent, 0.55)}"/>
      <stop offset="45%" stop-color="${lighten(accent, 0.78)}"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="640" height="400" fill="url(#bg-${key})"/>
  <circle cx="520" cy="80" r="90" fill="${accent}" opacity="0.08"/>
  <circle cx="100" cy="320" r="70" fill="${accent}" opacity="0.06"/>
  ${content}
</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const plugin of PLUGINS) {
  const svg = buildSvg(plugin);
  writeFileSync(join(OUT_DIR, `${plugin.key}.svg`), svg, "utf8");
  count += 1;
}

console.log(`Generated ${count} plugin cover images in ${OUT_DIR}`);
