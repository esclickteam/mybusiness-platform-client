#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  { id: "gridline", variant: "gridline", accent: "#111111", bg: "#f4f4f0", text: "#111111", muted: "#666660", surface: "#ecece6", border: "#11111122", dark: "#111111", light: "#f4f4f0", pages: 6 },
  { id: "monolith", variant: "monolith", accent: "#c8a96a", bg: "#eef0f4", text: "#0c1a33", muted: "#5a6478", surface: "#ffffff", border: "#0c1a3322", dark: "#0c1a33", light: "#f6f5f1", pages: 6 },
  { id: "vertex", variant: "vertex", accent: "#00ff88", bg: "#050505", text: "#f5f5f5", muted: "#9a9a9a", surface: "#0d0d0d", border: "#00ff8833", dark: "#000", light: "#f5f5f5", pages: 6 },
  { id: "framehaus", variant: "framehaus", accent: "#ff3b30", bg: "#fafafa", text: "#111111", muted: "#666", surface: "#fff", border: "#11111118", dark: "#111", light: "#fff", pages: 5 },
  { id: "steelworks", variant: "steelworks", accent: "#ff6b2c", bg: "#1a1a1a", text: "#f0f0f0", muted: "#aaa", surface: "#222", border: "#ffffff18", dark: "#0d0d0d", light: "#f0f0f0", pages: 6 },
  { id: "prism", variant: "prism", accent: "#0057ff", bg: "#fffef8", text: "#0a0a0a", muted: "#555", surface: "#fff", border: "#0a0a0a14", dark: "#0a0a0a", light: "#fff", pages: 6 },
  { id: "horizon", variant: "horizon", accent: "#b8956b", bg: "#f7f3ed", text: "#1c1c1c", muted: "#6b645c", surface: "#fffdf9", border: "#1c1c1c18", dark: "#1c1c1c", light: "#f7f3ed", pages: 6 },
  { id: "ledger", variant: "ledger", accent: "#0d5c45", bg: "#f6f3ea", text: "#102018", muted: "#5a6b62", surface: "#fffdf8", border: "#10201820", dark: "#102018", light: "#f6f3ea", pages: 5 },
  { id: "kinetic", variant: "kinetic", accent: "#ff2d2d", bg: "#0b0b0b", text: "#ffffff", muted: "#aaa", surface: "#141414", border: "#ffffff15", dark: "#000", light: "#fff", pages: 5 },
  { id: "citadel", variant: "citadel", accent: "#39ff14", bg: "#030a06", text: "#d7ffd9", muted: "#7fad85", surface: "#071510", border: "#39ff1422", dark: "#010503", light: "#d7ffd9", pages: 6 },
];

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

for (const t of TEMPLATES) {
  const P = pascal(t.id);
  const pageList =
    t.pages === 5
      ? `[
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "${t.id === "framehaus" ? "גלריה" : t.id === "horizon" ? "נכסים" : "פרויקטים"}", slug: "/work" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
]`
      : `[
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "${t.id === "framehaus" ? "גלריה" : t.id === "horizon" ? "נכסים" : "פרויקטים"}", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
]`;

  const font =
    t.id === "citadel" || t.id === "vertex" || t.id === "ledger"
      ? 'fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"'
      : t.id === "monolith"
        ? 'fontFamily: "Georgia, \\"Times New Roman\\", serif"'
        : "";

  const content = `import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { ${t.id}DefaultData } from "./defaultData";
import { ${t.id}EditorCss } from "./editorCss";

export const ${t.id}Pages = ${pageList};

const theme = {
  bg: "${t.bg}",
  surface: "${t.surface}",
  text: "${t.text}",
  muted: "${t.muted}",
  accent: "${t.accent}",
  border: "${t.border}",
  dark: "${t.dark}",
  light: "${t.light}",
};

export default createRectTemplatePages({
  id: "${t.id}",
  variant: "${t.variant}",
  theme,
  pages: ${t.id}Pages,
  defaultData: ${t.id}DefaultData,
  editorCss: ${t.id}EditorCss,
  ${font ? `${font},` : ""}
});
`;

  fs.writeFileSync(path.join(ROOT, t.id, "pages.tsx"), content, "utf8");
  console.log(`Created pages.tsx for ${t.id}`);
}

console.log("Done");
