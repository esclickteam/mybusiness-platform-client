import API from "../api";

export type MySiteSummary = {
  _id: string;
  name?: string;
  slug?: string;
  published?: boolean;
  status?: string;
  publicUrl?: string;
  templateKey?: string;
  templateName?: string;
  thumbnailUrl?: string;
  html?: string;
  css?: string;
  folderId?: string | null;
  updatedAt?: string;
  createdAt?: string;
  businessId?: string;
  access?: "owner" | "shared" | "none";
  myRole?: "owner" | "editor" | "viewer" | null;
  collaborators?: SiteCollaborator[];
};

export type SiteCollaborator = {
  _id?: string;
  userId?: string | null;
  businessId?: string | null;
  email?: string;
  role?: "editor" | "viewer";
  addedAt?: string;
};

export type SiteFolder = {
  _id: string;
  name: string;
  businessId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteShareInvite = {
  _id: string;
  toEmail: string;
  mode: "share" | "transfer";
  role?: "editor" | "viewer";
  status: string;
  expiresAt?: string;
  createdAt?: string;
};

export async function listMySites(businessId: string, opts?: {
  folderId?: string | null;
  q?: string;
}) {
  const params = new URLSearchParams({ businessId });
  if (opts?.folderId === null) params.set("folderId", "root");
  else if (opts?.folderId) params.set("folderId", opts.folderId);
  if (opts?.q) params.set("q", opts.q);

  const { data } = await API.get(`/site-builder/sites?${params}`);
  return (data?.sites || []) as MySiteSummary[];
}

export async function listSiteFolders(businessId: string) {
  const { data } = await API.get(
    `/site-builder/folders?businessId=${encodeURIComponent(businessId)}`
  );
  return (data?.folders || []) as SiteFolder[];
}

export async function createSiteFolder(businessId: string, name: string) {
  const { data } = await API.post(`/site-builder/folders`, {
    businessId,
    name,
  });
  return data?.folder as SiteFolder;
}

export async function renameSiteFolder(folderId: string, name: string) {
  const { data } = await API.patch(`/site-builder/folders/${folderId}`, {
    name,
  });
  return data?.folder as SiteFolder;
}

export async function deleteSiteFolder(folderId: string) {
  await API.delete(`/site-builder/folders/${folderId}`);
}

export async function createMySite(payload: {
  businessId: string;
  name?: string;
  templateKey?: string;
  templateName?: string;
  folderId?: string | null;
}) {
  const { data } = await API.post(`/site-builder/sites`, payload);
  return data?.site as MySiteSummary;
}

export async function renameMySite(siteId: string, name: string) {
  const { data } = await API.patch(`/site-builder/sites/${siteId}`, { name });
  return data?.site as MySiteSummary;
}

export async function moveMySiteToFolder(
  siteId: string,
  folderId: string | null
) {
  const { data } = await API.patch(`/site-builder/sites/${siteId}`, {
    folderId,
  });
  return data?.site as MySiteSummary;
}

export async function deleteMySite(siteId: string) {
  await API.delete(`/site-builder/sites/${siteId}`);
}

export async function duplicateMySite(siteId: string) {
  const { data } = await API.post(`/site-builder/sites/${siteId}/duplicate`);
  return data?.site as MySiteSummary;
}

export async function shareMySite(
  siteId: string,
  payload: {
    email: string;
    mode: "share" | "transfer";
    role?: "editor" | "viewer";
  }
) {
  const { data } = await API.post(`/site-builder/sites/${siteId}/share`, payload);
  return data?.invite as SiteShareInvite;
}

export async function listSiteCollaborators(siteId: string) {
  const { data } = await API.get(`/site-builder/sites/${siteId}/collaborators`);
  return {
    collaborators: (data?.collaborators || []) as SiteCollaborator[],
    pendingInvites: (data?.pendingInvites || []) as SiteShareInvite[],
  };
}

export async function removeSiteCollaborator(
  siteId: string,
  collaboratorId: string
) {
  const { data } = await API.delete(
    `/site-builder/sites/${siteId}/collaborators/${collaboratorId}`
  );
  return (data?.collaborators || []) as SiteCollaborator[];
}

export async function revokeSiteInvite(inviteId: string) {
  await API.delete(`/site-builder/site-invites/${inviteId}`);
}

export async function getSiteInvite(token: string) {
  const { data } = await API.get(`/site-builder/site-invites/${token}`);
  return data as {
    success: boolean;
    invite: {
      toEmail: string;
      mode: "share" | "transfer";
      role?: "editor" | "viewer";
      expiresAt?: string;
    };
    site: MySiteSummary | null;
  };
}

export async function acceptSiteInvite(token: string) {
  const { data } = await API.post(`/site-builder/site-invites/${token}/accept`);
  return data as {
    success: boolean;
    mode: "share" | "transfer";
    site: { _id: string; name?: string; businessId?: string };
  };
}

