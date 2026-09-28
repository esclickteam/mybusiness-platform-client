import API from "@api";

export type PartnerMaterial = {
  id: string;
  slug: string;
  category: string;
  assetType: string;
  audience: "internal_partner_training" | "client_facing";
  industry: string;
  status: string;
  visibility: string;
  featured: boolean;
  version: number;
  sortOrder: number;
  estimatedDurationMinutes?: number | null;
  fileUrl?: string;
  fileName?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  favorite?: boolean;
  locale: string;
  title: string;
  description: string;
  body: string;
  voiceOver?: string;
  onScreenText?: string;
  captions?: string;
  script?: string;
  shotList?: string;
  thumbnailTitle?: string;
  locales?: Record<string, Partial<PartnerMaterial>>;
};

export async function fetchPartnerCenterMaterials(params: Record<string, string | undefined>, admin = false) {
  const path = admin ? "/admin/partner-center/materials" : "/partner-center/materials";
  const { data } = await API.get(path, { params });
  return data as {
    items: PartnerMaterial[];
    counts: { total: number; byCategory: Record<string, number>; byAudience: Record<string, number> };
    hub: Array<{ id: string; categories: string[] }>;
    meta: Record<string, string[]>;
  };
}

export async function fetchPartnerCenterMaterial(id: string, locale: string, admin = false) {
  const path = admin ? `/admin/partner-center/materials/${id}` : `/partner-center/materials/${id}`;
  const { data } = await API.get(path, { params: { locale } });
  return data.item as PartnerMaterial;
}

export async function savePartnerCenterMaterial(payload: Record<string, unknown>, id?: string) {
  if (id) {
    const { data } = await API.patch(`/admin/partner-center/materials/${id}`, payload);
    return data.item as PartnerMaterial;
  }
  const { data } = await API.post("/admin/partner-center/materials", payload);
  return data.item as PartnerMaterial;
}

export async function archivePartnerCenterMaterial(id: string) {
  const { data } = await API.post(`/admin/partner-center/materials/${id}/archive`);
  return data.item as PartnerMaterial;
}

export async function reseedPartnerCenter(force = false) {
  const { data } = await API.post("/admin/partner-center/seed", { force });
  return data as { inserted: number; updated: number; total: number };
}

export async function togglePartnerCenterFavorite(id: string) {
  const { data } = await API.post(`/partner-center/materials/${id}/favorite`);
  return data as { favorite: boolean };
}

export async function sharePartnerCenterMaterial(id: string, locale: string, admin = false) {
  const path = admin
    ? `/admin/partner-center/materials/${id}/share`
    : `/partner-center/materials/${id}/share`;
  const { data } = await API.post(path, { locale });
  return data as { token: string; locale: string };
}

export async function fetchPartnerCenterKpis() {
  const { data } = await API.get("/partner-center/kpis");
  return data as { items: any[] };
}

export async function savePartnerCenterKpi(payload: Record<string, unknown>) {
  const { data } = await API.put("/partner-center/kpis", payload);
  return data.item;
}

export async function fetchPublicPartnerCenterShare(token: string) {
  const { data } = await API.get(`/partner-center/share/${token}`);
  return data.item as PartnerMaterial;
}
