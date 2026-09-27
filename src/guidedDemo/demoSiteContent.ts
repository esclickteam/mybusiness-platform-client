import { NOA_STUDIO_SITE, NOA_STUDIO_TEMPLATE_KEY } from "./fixtures/noaStudioSite";
import { readGuidedDemoLocaleLock } from "./sessionStore";

/** Overlay the Noa Studio copy for the demo locale on a template's default data. */
export function withGuidedDemoSiteContent<T extends Record<string, unknown>>(
  templateKey: unknown,
  data: T,
): T {
  const locale = readGuidedDemoLocaleLock();
  if (!locale) return data;
  if (String(templateKey || "").toLowerCase() !== NOA_STUDIO_TEMPLATE_KEY) return data;
  return { ...data, ...NOA_STUDIO_SITE[locale] };
}
