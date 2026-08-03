import {
  clearSitePortalToken,
  getSitePortalToken,
  setSitePortalToken,
  type SitePortalMember,
} from "../utils/sitePortalSession";

const RAW_API_BASE_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    ""
).replace(/\/+$/, "");

const API_SITE_BUILDER_BASE_URL = RAW_API_BASE_URL.endsWith("/api")
  ? `${RAW_API_BASE_URL}/site-builder`
  : RAW_API_BASE_URL
    ? `${RAW_API_BASE_URL}/api/site-builder`
    : "/api/site-builder";

export type SitePortalSiteInfo = {
  id: string;
  name?: string;
  slug?: string;
  publicUrl?: string;
};

export type SitePortalPageInfo = {
  id: string;
  title: string;
  slug?: string;
  loginRequired?: boolean;
  accessMode?: string;
};

async function portalFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    siteId?: string;
    token?: string;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token =
    options.token ||
    (options.siteId ? getSitePortalToken(options.siteId) : "") ||
    "";

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-Site-Portal-Token"] = token;
  }

  const res = await fetch(`${API_SITE_BUILDER_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    credentials: "omit",
    cache: "no-store",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    throw new Error(data?.error || "שגיאה באזור האישי");
  }

  return data as T;
}

export async function sitePortalLogin(input: {
  email: string;
  password: string;
  host?: string;
  siteId?: string;
  slug?: string;
}): Promise<{
  token: string;
  member: SitePortalMember;
  site: SitePortalSiteInfo;
}> {
  const data = await portalFetch<{
    success: true;
    token: string;
    member: SitePortalMember;
    site: SitePortalSiteInfo;
  }>("/public/portal/login", {
    method: "POST",
    body: {
      email: input.email,
      password: input.password,
      host: input.host || (typeof window !== "undefined" ? window.location.host : ""),
      siteId: input.siteId,
      slug: input.slug,
    },
  });

  if (data.site?.id && data.token) {
    setSitePortalToken(data.site.id, data.token);
  }

  return data;
}

export async function sitePortalRegister(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  host?: string;
  siteId?: string;
  slug?: string;
}): Promise<{
  token: string;
  member: SitePortalMember;
  site: SitePortalSiteInfo;
}> {
  const data = await portalFetch<{
    success: true;
    token: string;
    member: SitePortalMember;
    site: SitePortalSiteInfo;
  }>("/public/portal/register", {
    method: "POST",
    body: {
      email: input.email,
      password: input.password,
      fullName: input.fullName,
      phone: input.phone || "",
      host: input.host || (typeof window !== "undefined" ? window.location.host : ""),
      siteId: input.siteId,
      slug: input.slug,
    },
  });

  if (data.site?.id && data.token) {
    setSitePortalToken(data.site.id, data.token);
  }

  return data;
}

export async function sitePortalMe(siteId: string) {
  return portalFetch<{
    success: true;
    member: SitePortalMember;
    site: SitePortalSiteInfo | null;
    portalPages?: SitePortalPageInfo[];
  }>("/public/portal/me", { siteId });
}

export async function sitePortalLogout(siteId: string) {
  try {
    await portalFetch("/public/portal/logout", {
      method: "POST",
      siteId,
    });
  } finally {
    clearSitePortalToken(siteId);
  }
}

export async function sitePortalMyOrders(siteId: string) {
  return portalFetch<{
    success: true;
    orders: Array<{
      id?: string;
      orderNumber?: string;
      status?: string;
      total?: number;
      morningDocumentUrl?: string;
      createdAt?: string;
      items?: Array<{ name?: string; quantity?: number; price?: number }>;
    }>;
  }>("/public/portal/orders", { siteId });
}

export async function sitePortalAcceptInvite(input: {
  inviteToken: string;
  password: string;
  fullName?: string;
}) {
  const data = await portalFetch<{
    success: true;
    token: string;
    member: SitePortalMember;
    site: SitePortalSiteInfo | null;
  }>("/public/portal/accept-invite", {
    method: "POST",
    body: input,
  });

  if (data.site?.id && data.token) {
    setSitePortalToken(data.site.id, data.token);
  }

  return data;
}

export async function sitePortalPageAccess(input: {
  host?: string;
  path?: string;
  siteId?: string;
}) {
  const params = new URLSearchParams();
  if (input.host) params.set("host", input.host);
  if (input.path) params.set("path", input.path);
  if (input.siteId) params.set("siteId", input.siteId);

  return portalFetch<{
    success: true;
    requiresLogin: boolean;
    authenticated: boolean;
    allowed: boolean;
    reason: string;
    siteId: string;
    pageId: string | null;
    pageTitle?: string;
    member: SitePortalMember | null;
  }>(`/public/portal/page-access?${params.toString()}`, {
    siteId: input.siteId,
  });
}

/* ── Business admin (uses platform API axios instance) ── */

import API from "../api";

export async function listSitePortalMembers(siteId: string) {
  const { data } = await API.get(`/site-builder/sites/${siteId}/portal/members`);
  if (!data?.success) {
    throw new Error(data?.error || "שגיאה בטעינת חברים");
  }
  return data as {
    success: true;
    siteId: string;
    loginPath: string;
    publicUrl: string;
    portalPages: SitePortalPageInfo[];
    members: SitePortalMember[];
  };
}

export async function createSitePortalMember(
  siteId: string,
  body: {
    email: string;
    fullName: string;
    phone?: string;
    password?: string;
    sendInvite?: boolean;
    assignedPageIds?: string[];
    paymentStatus?: string;
    crmClientId?: string;
    returnPassword?: boolean;
  }
) {
  const { data } = await API.post(
    `/site-builder/sites/${siteId}/portal/members`,
    body
  );
  if (!data?.success) {
    throw new Error(data?.error || "שגיאה ביצירת חבר");
  }
  return data as {
    success: true;
    member: SitePortalMember;
    inviteToken?: string;
    inviteUrl?: string;
    temporaryPassword?: string;
  };
}

export async function updateSitePortalMember(
  siteId: string,
  memberId: string,
  body: Record<string, unknown>
) {
  const { data } = await API.patch(
    `/site-builder/sites/${siteId}/portal/members/${memberId}`,
    body
  );
  if (!data?.success) {
    throw new Error(data?.error || "שגיאה בעדכון חבר");
  }
  return data as { success: true; member: SitePortalMember };
}

export async function deleteSitePortalMember(siteId: string, memberId: string) {
  const { data } = await API.delete(
    `/site-builder/sites/${siteId}/portal/members/${memberId}`
  );
  if (!data?.success) {
    throw new Error(data?.error || "שגיאה במחיקת חבר");
  }
  return data;
}

export async function reinviteSitePortalMember(siteId: string, memberId: string) {
  const { data } = await API.post(
    `/site-builder/sites/${siteId}/portal/members/${memberId}/invite`
  );
  if (!data?.success) {
    throw new Error(data?.error || "שגיאה ביצירת הזמנה");
  }
  return data as {
    success: true;
    member: SitePortalMember;
    inviteToken: string;
    inviteUrl: string;
  };
}

export function getPublicSiteBuilderBaseUrl() {
  return API_SITE_BUILDER_BASE_URL;
}
