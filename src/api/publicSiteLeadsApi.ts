import API from "../api";

export type PublicSiteLeadAttachment = {
  mediaAssetId: string;
  fieldId?: string;
  originalName?: string;
};

export type PublicSiteLeadPayload = {
  formId?: string;
  pagePath?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  fields?: Array<{ label: string; value: string }>;
  attachments?: PublicSiteLeadAttachment[];
  host?: string;
  idempotencyKey?: string;
  submissionId?: string;
};

export type PublicSiteLeadResponse = {
  success?: boolean;
  leadId?: string;
  message?: string;
  error?: string;
  reused?: boolean;
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

export async function uploadPublicFormFile(
  slug: string,
  file: File,
  options: { host?: string; formId?: string; fieldId?: string } = {},
): Promise<{
  mediaAssetId: string;
  url?: string;
  originalName?: string;
  fieldId?: string;
}> {
  const cleanSlug = String(slug || "").trim();
  const host =
    String(options.host || "").trim() ||
    (typeof window !== "undefined" ? window.location.host : "");
  const body = new FormData();
  body.append("file", file);
  if (options.formId) body.append("formId", options.formId);
  if (options.fieldId) body.append("fieldId", options.fieldId);
  if (host) body.append("host", host);

  if (cleanSlug) {
    const { data } = await API.post(
      `/site-builder/public/${encodeURIComponent(cleanSlug)}/form-uploads`,
      body,
    );
    return data;
  }

  const { data } = await API.post(
    `/site-builder/public/by-host/form-uploads?host=${encodeURIComponent(host)}`,
    body,
  );
  return data;
}
