import API from "../api";

export type PublicSiteLeadPayload = {
  formId?: string;
  pagePath?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  fields?: Array<{ label: string; value: string }>;
  host?: string;
};

export type PublicSiteLeadResponse = {
  success?: boolean;
  leadId?: string;
  message?: string;
  error?: string;
};

export async function submitPublicSiteLead(
  slug: string,
  payload: PublicSiteLeadPayload,
): Promise<PublicSiteLeadResponse> {
  const cleanSlug = String(slug || "").trim();
  const host =
    String(payload.host || "").trim() ||
    (typeof window !== "undefined" ? window.location.host : "");

  if (cleanSlug) {
    const { data } = await API.post(
      `/site-builder/public/${encodeURIComponent(cleanSlug)}/leads`,
      payload,
    );
    return data;
  }

  const { data } = await API.post(
    `/site-builder/public/by-host/leads?host=${encodeURIComponent(host)}`,
    { ...payload, host },
  );
  return data;
}
