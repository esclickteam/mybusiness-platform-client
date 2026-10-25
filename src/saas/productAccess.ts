const PRODUCT_ORIGINS: Record<string, string> = {
  beautyflow: "https://beautyflow.bizuply.com",
  "global-properties": "https://globalproperties.bizuply.com",
  tableflow: "https://tableflow.bizuply.com",
  dinevo: "https://dinevo.bizuply.com",
  cliny: "https://cliny.bizuply.com",
};

const SECRET_QUERY = /password|passwd|token|secret/i;

export function productHost(templateSlug: string) {
  const origin = PRODUCT_ORIGINS[String(templateSlug || "").trim().toLowerCase()] || "";
  if (!origin) return "";
  try {
    return new URL(origin).host;
  } catch {
    return origin.replace(/^https?:\/\//, "");
  }
}

export function publicSitePath(publicSlug: string) {
  const slug = String(publicSlug || "").trim();
  return slug ? `/s/${slug}` : "";
}

export function isHostedShellProduct(templateSlug: string) {
  return String(templateSlug || "").trim().toLowerCase() === "tableflow";
}

function stripSecretQuery(href: string) {
  const raw = String(href || "").trim();
  if (!raw) return "";
  try {
    const absolute = /^https?:\/\//i.test(raw) ? new URL(raw) : new URL(raw, "https://bizuply.com");
    for (const key of [...absolute.searchParams.keys()]) {
      if (SECRET_QUERY.test(key)) absolute.searchParams.delete(key);
    }
    if (!/^https?:\/\//i.test(raw)) {
      return `${absolute.pathname}${absolute.search}${absolute.hash}`;
    }
    return absolute.toString();
  } catch {
    return raw;
  }
}

function loginPath(templateSlug: string, publicSlug: string) {
  const key = String(templateSlug || "").trim().toLowerCase();
  if (key === "beautyflow") return `/login?tenant=${encodeURIComponent(publicSlug || "")}`;
  if (key === "global-properties") return "/en/auth/sign-in";
  if (key === "dinevo" || key === "cliny") return "/login";
  return "/login";
}

export function productLoginUrl(
  templateSlug: string,
  publicSlug: string,
  extras: { candidate?: string } = {}
) {
  const key = String(templateSlug || "").trim().toLowerCase();
  if (isHostedShellProduct(key)) return publicSitePath(publicSlug);
  const origin = PRODUCT_ORIGINS[key] || "";
  const candidate = stripSecretQuery(extras.candidate || "");
  if (origin && candidate && !/\/s\/[A-Za-z0-9._-]+/i.test(candidate)) {
    try {
      const parsed = new URL(candidate);
      const canonical = new URL(origin);
      parsed.protocol = canonical.protocol;
      parsed.host = canonical.host;
      if (!parsed.pathname || parsed.pathname === "/" || /dashboard|\/app(?:\/|$)/i.test(parsed.pathname)) {
        return `${origin}${loginPath(key, publicSlug)}`;
      }
      return parsed.toString();
    } catch {
      /* canonical login */
    }
  }
  if (!origin) return candidate && !/\/s\//.test(candidate) ? candidate : "";
  return `${origin}${loginPath(key, publicSlug)}`;
}

export function enterSystemHref(tenant: {
  templateSlug?: string;
  publicSlug?: string;
  productLoginUrl?: string;
  product?: { loginUrl?: string };
  accessPath?: string;
}) {
  const computed = productLoginUrl(tenant.templateSlug || "", tenant.publicSlug || "", {
    candidate: tenant.productLoginUrl || tenant.product?.loginUrl || "",
  });
  if (computed) return computed;
  if (isHostedShellProduct(tenant.templateSlug || "") && tenant.accessPath) return tenant.accessPath;
  return "";
}
