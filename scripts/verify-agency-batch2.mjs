#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatesDir = path.join(root, "src/components/site-builder/studio/data/templates");

const ids = [
  "pitchora",
  "socialux",
  "influencix",
  "seora",
  "contentra",
  "productix",
  "launchora",
  "partnerly",
  "insightix",
  "uxforge",
  "reelhaus",
  "podcastix",
  "crisisdesk",
  "lobbyhaus",
  "franchora",
];

const requiredFiles = ["pages.tsx", "defaultData.ts", "editorCss.ts", "meta.ts", "schema.ts", "preview.tsx", "thumbnail.tsx"];
const uniqueSections = ["Hero", "About", "Services", "Cases", "Team", "Gallery", "PageHero"];

function fail(message) {
  throw new Error(message);
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function extractConstArrayBlock(source, constName) {
  const start = source.indexOf(`export const ${constName} = [`);
  if (start === -1) fail(`Missing ${constName}`);
  const open = source.indexOf("[", start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "[") depth += 1;
    if (source[i] === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  fail(`Could not parse ${constName}`);
}

function extractOrderArray(source, pageId) {
  const needle = `${pageId}: [`;
  const start = source.indexOf(needle);
  if (start === -1) fail(`Missing pageSectionOrder.${pageId}`);
  const open = source.indexOf("[", start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "[") depth += 1;
    if (source[i] === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  fail(`Could not parse pageSectionOrder.${pageId}`);
}

function extractFunctionBody(source, functionName) {
  const marker = `function ${functionName}(`;
  const start = source.indexOf(marker);
  if (start === -1) fail(`Missing function ${functionName}`);
  const paramsOpen = source.indexOf("(", start);
  let parenDepth = 0;
  let paramsClose = -1;
  for (let i = paramsOpen; i < source.length; i += 1) {
    if (source[i] === "(") parenDepth += 1;
    if (source[i] === ")") {
      parenDepth -= 1;
      if (parenDepth === 0) {
        paramsClose = i;
        break;
      }
    }
  }
  if (paramsClose === -1) fail(`Could not parse function signature ${functionName}`);
  const open = source.indexOf("{", paramsClose);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i).trim();
    }
  }
  fail(`Could not parse function ${functionName}`);
}

const sectionHashes = new Map();
const summary = [];

for (const id of ids) {
  const dir = path.join(templatesDir, id);
  if (!fs.existsSync(dir)) fail(`Missing template directory: ${id}`);
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(dir, file))) fail(`Missing ${id}/${file}`);
  }

  const pagesSource = fs.readFileSync(path.join(dir, "pages.tsx"), "utf8");
  const metaSource = fs.readFileSync(path.join(dir, "meta.ts"), "utf8");
  const dataSource = fs.readFileSync(path.join(dir, "defaultData.ts"), "utf8");

  const pagesBlock = extractConstArrayBlock(pagesSource, `${id}Pages`);
  const pageCount = (pagesBlock.match(/\{\s*"id":/g) || []).length;
  if (pageCount !== 8) fail(`${id} pages.length expected 8, got ${pageCount}`);

  const homeSections = (extractOrderArray(pagesSource, "home").match(/"[^"]+"/g) || []).length;
  const aboutSections = (extractOrderArray(pagesSource, "about").match(/"[^"]+"/g) || []).length;
  if (homeSections < 10) fail(`${id} home sections expected >=10, got ${homeSections}`);
  if (aboutSections < 10) fail(`${id} about sections expected >=10, got ${aboutSections}`);
  if (!extractOrderArray(pagesSource, "about").includes('"PageHero"')) fail(`${id} about page missing PageHero`);

  if (!metaSource.includes('category: "portfolio"')) fail(`${id} meta category is not portfolio`);
  if (!metaSource.includes('categoryLabel: "פורטפוליו וסוכנות"')) fail(`${id} meta categoryLabel mismatch`);
  if (!dataSource.includes("teamOneImage") || !dataSource.includes("images.unsplash.com")) fail(`${id} missing real Unsplash image data`);

  for (const section of uniqueSections) {
    const bodyHash = hash(extractFunctionBody(pagesSource, section));
    const key = `${section}:${bodyHash}`;
    const previous = sectionHashes.get(key);
    if (previous) fail(`Section hash collision for ${section}: ${previous} and ${id}`);
    sectionHashes.set(key, id);
  }

  summary.push({ id, pages: pageCount, homeSections, aboutSections });
}

console.log(JSON.stringify({
  ids,
  templatesChecked: ids.length,
  requiredFilesPerTemplate: requiredFiles.length,
  uniqueSectionsChecked: uniqueSections,
  sectionHashesChecked: sectionHashes.size,
  summary,
}, null, 2));
