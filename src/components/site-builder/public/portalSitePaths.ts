/**
 * Resolve the real published paths of the personal-area pages.
 *
 * The page library numbers its templates (login-02, account-03, …), so a
 * hardcoded "/login" or "/account" often points at a page that does not exist.
 * Detect each page by the portal widget it actually hosts instead.
 */

export type PortalWidgetKind =
  | "portal-login"
  | "portal-register"
  | "portal-account"
  | "portal-orders"
  | "portal-cart"
  | "portal-forgot-password"
  | "portal-reset-password";

export type PortalPaths = {
  login: string;
  register: string;
  account: string;
  orders: string;
  cart: string;
  forgotPassword: string;
  resetPassword: string;
};

const PORTAL_KINDS: PortalWidgetKind[] = [
  "portal-login",
  "portal-register",
  "portal-account",
  "portal-orders",
  "portal-cart",
  "portal-forgot-password",
  "portal-reset-password",
];

function asPlainObject(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

export function normalizeSitePagePath(value: unknown) {
  const clean = String(value || "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "")
    .trim()
    .toLowerCase();

  return clean ? `/${clean}` : "/";
}

function readPageVisualData(page: any) {
  const candidates = [
    page?.data,
    page?.templateData,
    page?.projectData?.data,
    page?.visualEditorPayload?.data,
  ];

  for (const candidate of candidates) {
    const object = asPlainObject(candidate);
    if (Object.keys(object).length) return object;
  }

  return {};
}

/** Which portal widget a saved page hosts, or "" when it is a normal page. */
export function detectPortalPageKind(page: any): PortalWidgetKind | "" {
  const data = readPageVisualData(page);

  const attributes = asPlainObject(data.__attributes);
  for (const value of Object.values(attributes)) {
    const kind = String(
      asPlainObject(value)["data-bizuply-portal-kind"] ||
        asPlainObject(value)["data-bizuply-widget"] ||
        "",
    ).trim() as PortalWidgetKind;

    if (PORTAL_KINDS.includes(kind)) return kind;
  }

  const insertedSections = asPlainObject(data.__insertedSections);
  for (const section of Object.values(insertedSections)) {
    const libraryId = String(asPlainObject(section).libraryId || "").trim();
    const match = libraryId.match(
      /^section-(portal-(?:login|register|account|orders|cart|forgot-password|reset-password))/,
    );
    if (match) return match[1] as PortalWidgetKind;
  }

  // page-portal-01..50 map to the five kinds in blocks of ten.
  const templateMatch = String(data.__libraryPageTemplateId || "")
    .trim()
    .match(/^page-portal-(\d+)$/);

  if (templateMatch) {
    const index = Number(templateMatch[1]);
    if (index >= 1 && index <= PORTAL_KINDS.length * 10) {
      return PORTAL_KINDS[Math.floor((index - 1) / 10)];
    }
  }

  return "";
}

export function resolvePortalPaths(site: any): PortalPaths {
  const pages = Array.isArray(site?.pages) ? site.pages : [];

  const pathsByKind: Partial<Record<PortalWidgetKind, string>> = {};
  const available = new Set<string>();

  pages.forEach((page: any) => {
    const path = normalizeSitePagePath(page?.slug || page?.id || "");
    available.add(path);

    if (path === "/") return;

    const kind = detectPortalPageKind(page);
    if (kind && !pathsByKind[kind]) {
      pathsByKind[kind] = path;
    }
  });

  const pick = (
    kind: PortalWidgetKind,
    candidates: string[],
    fallback: string,
  ) => {
    const byKind = pathsByKind[kind];
    if (byKind) return byKind;

    for (const candidate of candidates) {
      if (available.has(candidate)) return candidate;
    }

    return fallback;
  };

  const login = pick(
    "portal-login",
    ["/login", "/portal/login"],
    "/portal/login",
  );

  const account = pick(
    "portal-account",
    ["/account", "/portal/account", "/my-account"],
    "/portal/account",
  );

  return {
    login,
    register: pick("portal-register", ["/register", "/signup"], login),
    account,
    orders: pick("portal-orders", ["/orders", "/my-orders"], account),
    cart: pick("portal-cart", ["/cart", "/checkout"], account),
    forgotPassword: pick(
      "portal-forgot-password",
      ["/forgot-password", "/reset-request"],
      "/portal/forgot-password",
    ),
    resetPassword: pick(
      "portal-reset-password",
      ["/reset-password", "/new-password"],
      "/portal/reset-password",
    ),
  };
}
