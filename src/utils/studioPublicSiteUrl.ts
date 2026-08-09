/**
 * Studio-safe public URL helpers (Vite).
 * Never use NEXT_PUBLIC_* as the primary source — Vite only injects VITE_*.
 */

export function resolveVitePublicSiteDomain(
  env: Record<string, string | undefined> | ImportMetaEnv | null | undefined =
    import.meta.env,
): string {
  const record = (env || {}) as Record<string, unknown>;
  const raw = String(
    record.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN ||
      record.NEXT_PUBLIC_BIZUPLY_PUBLIC_SITE_DOMAIN ||
      "",
  )
    .trim()
    .toLowerCase();

  const appEnv = String(record.VITE_APP_ENV || record.MODE || "")
    .trim()
    .toLowerCase();
  const isStagingLike =
    appEnv === "staging" || appEnv === "preview" || appEnv === "development";

  if (isStagingLike) {
    if (raw && raw !== "sites.bizuply.com") return raw;
    return "sites-staging.invalid";
  }

  return raw || "sites.bizuply.com";
}

export function coerceStudioSlugInput(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const nested = (value as { slug?: unknown }).slug;
    if (typeof nested === "string" || typeof nested === "number") {
      return String(nested);
    }
  }
  return "";
}

export function normalizeStudioPublicSlug(value: unknown): string {
  const clean = coerceStudioSlugInput(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-\u0590-\u05FF]+/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  if (!clean || clean === "object-object" || clean === "objectobject" || clean === "your-business") {
    return "";
  }
  return clean;
}

export function buildStudioPublicSiteUrl(
  slug: unknown,
  domain?: string,
): string {
  const clean = normalizeStudioPublicSlug(slug);
  if (!clean) return "";
  const host = String(domain || resolveVitePublicSiteDomain())
    .trim()
    .toLowerCase();
  if (!host) return "";
  return `https://${clean}.${host}`;
}

/** Modal may close / commit published URL only after API success. */
export function shouldCommitPublishUi(apiOk: boolean): boolean {
  return apiOk === true;
}