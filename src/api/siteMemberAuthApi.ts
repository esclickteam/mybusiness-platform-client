const RAW_API_BASE_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    ""
).replace(/\/+$/, "");

export const SITE_BUILDER_API_BASE = RAW_API_BASE_URL.endsWith("/api")
  ? `${RAW_API_BASE_URL}/site-builder`
  : `${RAW_API_BASE_URL}/api/site-builder`;

export type SiteMemberProfile = {
  id: string;
  siteId: string;
  email: string;
  username: string;
  displayName: string;
  status: "active" | "pending" | "blocked";
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteAuthSettings = {
  isActive: boolean;
  loginButtonLabel: string;
  logoutButtonLabel: string;
  allowSelfRegister: boolean;
  loginPageTitle: string;
  forgotPasswordEnabled: boolean;
  showLoginButton: boolean;
  memberAreaPath: string;
};

function tokenStorageKey(slug: string) {
  return `siteMemberToken:${slug}`;
}

export function getStoredSiteMemberToken(slug: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(tokenStorageKey(slug)) || "";
}

export function setStoredSiteMemberToken(slug: string, token: string) {
  if (typeof window === "undefined") return;
  if (!token) {
    localStorage.removeItem(tokenStorageKey(slug));
    return;
  }
  localStorage.setItem(tokenStorageKey(slug), token);
}

export function clearStoredSiteMemberToken(slug: string) {
  setStoredSiteMemberToken(slug, "");
}

async function siteAuthRequest<T>(
  slug: string,
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const authToken = token ?? getStoredSiteMemberToken(slug);
  if (authToken) {
    headers.set("X-Site-Member-Token", authToken);
  }

  const response = await fetch(`${SITE_BUILDER_API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "omit",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as { error?: string; message?: string })?.error ||
      (data as { error?: string; message?: string })?.message ||
      "שגיאה בבקשה";
    throw new Error(message);
  }

  return data as T;
}

export async function siteMemberLogin(
  slug: string,
  login: string,
  password: string
) {
  const data = await siteAuthRequest<{
    success: boolean;
    token: string;
    member: SiteMemberProfile;
  }>(slug, `/public/${encodeURIComponent(slug)}/site-auth/login`, {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });

  setStoredSiteMemberToken(slug, data.token);
  return data;
}

export async function siteMemberRegister(
  slug: string,
  payload: {
    email?: string;
    username?: string;
    password: string;
    displayName?: string;
  }
) {
  const data = await siteAuthRequest<{
    success: boolean;
    token: string;
    member: SiteMemberProfile;
  }>(slug, `/public/${encodeURIComponent(slug)}/site-auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setStoredSiteMemberToken(slug, data.token);
  return data;
}

export async function fetchSiteMemberMe(slug: string) {
  return siteAuthRequest<{ success: boolean; member: SiteMemberProfile }>(
    slug,
    `/public/${encodeURIComponent(slug)}/site-auth/me`,
    { method: "GET" }
  );
}

export async function siteMemberLogout(slug: string) {
  try {
    await siteAuthRequest(
      slug,
      `/public/${encodeURIComponent(slug)}/site-auth/logout`,
      { method: "POST" }
    );
  } finally {
    clearStoredSiteMemberToken(slug);
  }
}

export async function siteMemberForgotPassword(slug: string, login: string) {
  return siteAuthRequest<{ success: boolean; message: string }>(
    slug,
    `/public/${encodeURIComponent(slug)}/site-auth/forgot-password`,
    {
      method: "POST",
      body: JSON.stringify({ login }),
    }
  );
}

export async function siteMemberResetPassword(
  slug: string,
  payload: { token: string; email: string; password: string }
) {
  return siteAuthRequest<{ success: boolean; message: string }>(
    slug,
    `/public/${encodeURIComponent(slug)}/site-auth/reset-password`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function readSiteAuthSettings(site: Record<string, unknown> | null | undefined): SiteAuthSettings {
  const stored = (site?.pluginSettings as Record<string, unknown> | undefined)?.["site-auth"] as
    | Record<string, unknown>
    | undefined;

  return {
    isActive: stored?.isActive !== false,
    loginButtonLabel: String(stored?.loginButtonLabel || "התחברות"),
    logoutButtonLabel: String(stored?.logoutButtonLabel || "התנתקות"),
    allowSelfRegister: Boolean(stored?.allowSelfRegister),
    loginPageTitle: String(stored?.loginPageTitle || "התחברות"),
    forgotPasswordEnabled: stored?.forgotPasswordEnabled !== false,
    showLoginButton: stored?.showLoginButton !== false,
    memberAreaPath: String(stored?.memberAreaPath || "/member"),
  };
}

export function siteHasAuthPlugin(site: Record<string, unknown> | null | undefined) {
  const enabled = Array.isArray(site?.enabledPlugins)
    ? (site?.enabledPlugins as string[])
    : [];
  return enabled.includes("site-auth");
}
