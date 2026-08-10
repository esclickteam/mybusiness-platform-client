const BIZUPLY_PUBLIC_SITE_DOMAIN =
  process.env.NEXT_PUBLIC_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

const BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN =
  process.env.NEXT_PUBLIC_BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN || "bizuply.com";

const CUSTOM_DOMAIN_ACTIVE_STATUSES = new Set(["active"]);
const CUSTOM_DOMAIN_FAILED_STATUSES = new Set([
  "registration_failed",
  "vercel_failed",
  "dns_failed",
  "verification_failed",
  "ssl_failed",
]);
const CUSTOM_DOMAIN_PROVISIONING_STATUSES = new Set([
  "registered",
  "vercel_configuring",
  "dns_configuring",
  "dns_pending",
  "verifying",
  "ssl_pending",
]);

export type CustomDomainPublishPhase =
  | "none"
  | "active"
  | "provisioning"
  | "failed";

export function normalizeLinkedCustomDomain(value: string) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "");

  if (!clean) return "";
  if (
    clean === BIZUPLY_PUBLIC_SITE_DOMAIN ||
    clean === BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN ||
    clean === `www.${BIZUPLY_PUBLIC_SITE_DOMAIN}` ||
    clean === `www.${BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN}` ||
    clean.endsWith(`.${BIZUPLY_PUBLIC_SITE_DOMAIN}`) ||
    clean.endsWith(`.${BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN}`)
  ) {
    return "";
  }

  return clean;
}

export function normalizeCustomDomainProvisioningStatus(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

export function readCustomDomainBinding(source: any): {
  domain: string;
  provisioningStatus: string;
} {
  if (!source || typeof source !== "object") {
    return { domain: "", provisioningStatus: "" };
  }

  const domainObj =
    source.domain && typeof source.domain === "object"
      ? source.domain
      : source;

  const rawDomain = String(
    (typeof domainObj.domain === "string" ? domainObj.domain : "") ||
      source.customDomain ||
      source.siteDomain ||
      "",
  );

  return {
    domain: normalizeLinkedCustomDomain(rawDomain),
    provisioningStatus: normalizeCustomDomainProvisioningStatus(
      domainObj.provisioningStatus ?? source.provisioningStatus,
    ),
  };
}

/**
 * Active custom domains become the Publish primary URL.
 * Empty provisioningStatus with a linked host = BYOD / already-connected.
 * In-progress and failed statuses keep the platform subdomain primary.
 */
export function resolveCustomDomainPublishPhase(
  domain?: string,
  provisioningStatus?: string | null,
): CustomDomainPublishPhase {
  const linked = normalizeLinkedCustomDomain(String(domain || ""));
  if (!linked) return "none";

  const status = normalizeCustomDomainProvisioningStatus(provisioningStatus);
  if (CUSTOM_DOMAIN_FAILED_STATUSES.has(status)) return "failed";
  if (CUSTOM_DOMAIN_PROVISIONING_STATUSES.has(status)) return "provisioning";
  if (!status || CUSTOM_DOMAIN_ACTIVE_STATUSES.has(status)) return "active";
  return "provisioning";
}

export function isPlatformPublicSiteHost(host: string) {
  const clean = String(host || "")
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
  if (!clean) return false;
  return (
    clean === BIZUPLY_PUBLIC_SITE_DOMAIN ||
    clean === BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN ||
    clean === `www.${BIZUPLY_PUBLIC_SITE_DOMAIN}` ||
    clean === `www.${BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN}` ||
    clean.endsWith(`.${BIZUPLY_PUBLIC_SITE_DOMAIN}`) ||
    clean.endsWith(`.${BIZUPLY_LEGACY_PUBLIC_SITE_DOMAIN}`)
  );
}

export function resolvePublishedSiteDisplayUrl(options: {
  customDomain?: string;
  provisioningStatus?: string | null;
  publicUrl?: string;
  domainUrl?: string;
  slug?: string;
  buildPlatformUrl?: (slug: string) => string;
  normalizeSlug?: (slug: string) => string;
}) {
  const linkedDomain = normalizeLinkedCustomDomain(
    String(options.customDomain || ""),
  );
  const phase = resolveCustomDomainPublishPhase(
    linkedDomain,
    options.provisioningStatus,
  );

  if (phase === "active" && linkedDomain) {
    return `https://${linkedDomain}`;
  }

  const candidates = [
    String(options.publicUrl || "").trim(),
    String(options.domainUrl || "").trim(),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const host = candidate
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .split(":")[0]
      .toLowerCase();
    if (!host || !isPlatformPublicSiteHost(host)) continue;

    const absolute = candidate.startsWith("http")
      ? candidate
      : `https://${candidate}`;
    try {
      return new URL(absolute).origin;
    } catch {
      return absolute.split(/[?#]/)[0].replace(/\/+$/, "");
    }
  }

  const normalizeSlug =
    options.normalizeSlug ||
    ((value: string) =>
      String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""));
  const buildPlatformUrl =
    options.buildPlatformUrl ||
    ((slug: string) => `https://${slug}.${BIZUPLY_PUBLIC_SITE_DOMAIN}`);

  const cleanSlug = normalizeSlug(String(options.slug || ""));
  return cleanSlug ? buildPlatformUrl(cleanSlug) : "";
}

function defaultNormalizeSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function defaultBuildPlatformUrl(slug: string) {
  return `https://${slug}.${BIZUPLY_PUBLIC_SITE_DOMAIN}`;
}

/**
 * My Sites card URLs: active custom domain is primary + View target;
 * platform subdomain is shown as the Bizuply alternative when custom is active.
 */
export function resolveMySiteCardUrls(site: any): {
  primaryUrl: string;
  platformUrl: string;
  viewUrl: string;
  hasActiveCustomDomain: boolean;
  customDomain: string;
  provisioningStatus: string;
  phase: CustomDomainPublishPhase;
} {
  const binding = readCustomDomainBinding(site);
  const phase = resolveCustomDomainPublishPhase(
    binding.domain,
    binding.provisioningStatus,
  );
  const hasActiveCustomDomain = phase === "active" && Boolean(binding.domain);
  const cleanSlug = defaultNormalizeSlug(String(site?.slug || ""));
  const platformUrl = cleanSlug ? defaultBuildPlatformUrl(cleanSlug) : "";
  const primaryUrl = resolvePublishedSiteDisplayUrl({
    customDomain: binding.domain,
    provisioningStatus: binding.provisioningStatus,
    publicUrl: site?.publicUrl,
    domainUrl:
      site?.domain && typeof site.domain === "object"
        ? site.domain.url
        : undefined,
    slug: cleanSlug,
    buildPlatformUrl: defaultBuildPlatformUrl,
    normalizeSlug: defaultNormalizeSlug,
  });

  return {
    primaryUrl,
    platformUrl,
    viewUrl: primaryUrl,
    hasActiveCustomDomain,
    customDomain: binding.domain,
    provisioningStatus: binding.provisioningStatus,
    phase,
  };
}
