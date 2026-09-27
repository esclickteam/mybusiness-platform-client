/**
 * Resolve guided-demo walkthrough copy via i18n, falling back to catalog strings.
 * In guided-demo QA, missing keys are logged so English silent fallback is visible.
 */

import i18n from "../i18n/i18n";
import { tourModuleTitle, tourStepText } from "./tourCopy";
import { isGuidedDemoActive, readGuidedDemoLocaleLock } from "./sessionStore";

type TranslateFn = (key: string, defaultValue?: string) => string;

const warnedKeys = new Set<string>();

function warnMissingDemoKey(key: string, language?: string) {
  if (!isGuidedDemoActive()) return;
  const lng = String(language || i18n.language || "en");
  if (lng === "en" || lng.startsWith("en")) return;
  const stamp = `${lng}:${key}`;
  if (warnedKeys.has(stamp)) return;
  warnedKeys.add(stamp);
  // eslint-disable-next-line no-console
  console.warn(`[guided-demo-i18n] missing key ${key} for locale ${lng}`);
}

function translateDemo(
  t: TranslateFn,
  key: string,
  defaultValue: string,
  language?: string
) {
  const exists =
    typeof (i18n as { exists?: (k: string, o?: { lng?: string }) => boolean }).exists ===
    "function"
      ? (i18n as { exists: (k: string, o?: { lng?: string }) => boolean }).exists(key, {
          lng: language || i18n.language,
        })
      : true;
  if (!exists) warnMissingDemoKey(key, language);
  return t(key, defaultValue);
}

export function resolveGuidedDemoStepText(
  step: { id?: string; title?: string; instruction?: string } | null | undefined,
  t: TranslateFn,
  language?: string
) {
  language = readGuidedDemoLocaleLock() || language;
  const id = String(step?.id || "").trim();
  const localized = id ? tourStepText(id, language) : null;
  if (localized) return localized;
  const title = id
    ? translateDemo(t, `leftover.guided.steps.${id}.title`, step?.title || "", language)
    : step?.title || "";
  const instruction = id
    ? translateDemo(
        t,
        `leftover.guided.steps.${id}.instruction`,
        step?.instruction || "",
        language
      )
    : step?.instruction || "";
  return { title, instruction };
}

export function resolveGuidedDemoModuleTitle(
  module: { key?: string; title?: string } | null | undefined,
  t: TranslateFn,
  language?: string
) {
  language = readGuidedDemoLocaleLock() || language;
  const key = String(module?.key || "").trim();
  if (!key) return module?.title || "";
  const localized = tourModuleTitle(key, language);
  if (localized) return localized;
  return translateDemo(t, `leftover.guided.modules.${key}`, module?.title || "", language);
}
