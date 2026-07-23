import API from "../api";
import type { SiteAuthSettings, SiteMemberProfile } from "./siteMemberAuthApi";

export async function listSiteMembers(siteId: string) {
  const { data } = await API.get(`/site-builder/sites/${siteId}/site-members`);
  return {
    members: (data?.members || []) as SiteMemberProfile[],
    settings: (data?.settings || {}) as SiteAuthSettings,
    pluginEnabled: Boolean(data?.pluginEnabled),
  };
}

export async function createSiteMember(
  siteId: string,
  payload: {
    email?: string;
    username?: string;
    password: string;
    displayName?: string;
    status?: SiteMemberProfile["status"];
  }
) {
  const { data } = await API.post(`/site-builder/sites/${siteId}/site-members`, payload);
  return data?.member as SiteMemberProfile;
}

export async function updateSiteMember(
  siteId: string,
  memberId: string,
  payload: Partial<{
    email: string;
    username: string;
    displayName: string;
    status: SiteMemberProfile["status"];
    password: string;
  }>
) {
  const { data } = await API.put(
    `/site-builder/sites/${siteId}/site-members/${memberId}`,
    payload
  );
  return data?.member as SiteMemberProfile;
}

export async function deleteSiteMember(siteId: string, memberId: string) {
  const { data } = await API.delete(
    `/site-builder/sites/${siteId}/site-members/${memberId}`
  );
  return data;
}

export async function resetSiteMemberPassword(
  siteId: string,
  memberId: string,
  password: string
) {
  const { data } = await API.post(
    `/site-builder/sites/${siteId}/site-members/${memberId}/reset-password`,
    { password }
  );
  return data;
}
