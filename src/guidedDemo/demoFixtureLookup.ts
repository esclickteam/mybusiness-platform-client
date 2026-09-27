import { DEMO_FIXTURES } from "./fixtures/demoFixtures";
import { NOA_STUDIO_SITE } from "./fixtures/noaStudioSite";
import { normalizeDemoLocale, readGuidedDemoLocaleLock } from "./sessionStore";

const FIXTURE_ROOTS: Record<string, unknown> = {
  ...DEMO_FIXTURES,
  site: NOA_STUDIO_SITE,
};

/**
 * Localized fixture by dotted key, e.g. "stepSuggested.crm-note-text" or
 * "campaign". Returns undefined when the key has no entry for the locale.
 */
export function getDemoFixture<T = unknown>(key: string, locale?: unknown): T | undefined {
  const resolved = (locale ? normalizeDemoLocale(locale) : readGuidedDemoLocaleLock()) || "en";
  const [root, ...rest] = String(key || "").split(".");
  let node: any = FIXTURE_ROOTS[root];
  if (rest.length) node = node?.[rest.join(".")];
  const value = node?.[resolved];
  return value === undefined ? undefined : (value as T);
}
