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
  localeVideoUrl?: string;
  videoReady?: boolean;
  extra?: Record<string, any>;
  localeVideos?: Record<string, { videoUrl?: string; thumbnailUrl?: string }>;
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

export async function sharePartnerCenterMaterial(
  id: string,
  locale: string,
  admin = false,
  expiresInDays?: number
) {
  const path = admin
    ? `/admin/partner-center/materials/${id}/share`
    : `/partner-center/materials/${id}/share`;
  const { data } = await API.post(path, { locale, expiresInDays });
  return data as {
    token: string;
    locale: string;
    expiresAt?: string | null;
    createdAt?: string;
    active?: boolean;
  };
}

export async function listPartnerCenterShares(id: string, admin = false) {
  const path = admin
    ? `/admin/partner-center/materials/${id}/shares`
    : `/partner-center/materials/${id}/shares`;
  const { data } = await API.get(path);
  return data as { items: Array<Record<string, any>> };
}

export async function listPartnerCenterShareAudit() {
  const { data } = await API.get("/admin/partner-center/shares");
  return data as { items: Array<Record<string, any>> };
}

export async function revokePartnerCenterShare(token: string, admin = false) {
  const path = admin
    ? `/admin/partner-center/shares/${token}/revoke`
    : `/partner-center/shares/${token}/revoke`;
  const { data } = await API.post(path);
  return data;
}

export type PartnerOnboardingSnapshot = {
  started: boolean;
  startedAt?: string | null;
  lastActivityAt?: string | null;
  trainingCompletedAt?: string | null;
  salesReadyAt?: string | null;
  salesReadyStatus: "not_ready" | "in_progress" | "sales_ready";
  completedModuleSlugs: string[];
  completedCheckpointIds: string[];
  industryKitSlug: string;
  modulesCompleted: number;
  modulesTotal: number;
  percent: number;
  checklist: Record<string, boolean>;
  nextAction: {
    type: string;
    key: string;
    title: string;
    detail?: string;
    slug?: string;
    category?: string;
    module?: { n: number; slug: string; title: string; minutes: number };
  };
  stuckModule?: { n: number; slug: string; title: string } | null;
  estimatedTime: string;
  modules: Array<{ n: number; slug: string; title: string; minutes: number; demoKey: string }>;
  checkpoints: Array<{ id: string; afterModules: number; title: string; hint: string }>;
  checklistItems: Array<{ key: string; title: string; slug?: string; category?: string; auto?: string }>;
  shortcuts: Record<string, string>;
};

export type AdminOnboardingRow = {
  partnerId: string;
  name: string;
  slug: string;
  status: string;
  started: boolean;
  percent: number;
  modulesCompleted: number;
  modulesTotal: number;
  lastActivityAt?: string | null;
  salesReadyStatus: string;
  trainingCompletedAt?: string | null;
  salesReadyAt?: string | null;
  stuckModule?: { n: number; slug: string; title: string } | null;
  nextAction?: PartnerOnboardingSnapshot["nextAction"];
};

export async function fetchPartnerOnboarding() {
  const { data } = await API.get("/partner-center/onboarding");
  return data as PartnerOnboardingSnapshot;
}

export async function patchPartnerOnboarding(payload: Record<string, unknown>) {
  const { data } = await API.patch("/partner-center/onboarding", payload);
  return data as PartnerOnboardingSnapshot;
}

export async function fetchAdminPartnerOnboardingList(q?: string) {
  const { data } = await API.get("/admin/partner-center/onboarding", { params: q ? { q } : {} });
  return data as { items: AdminOnboardingRow[] };
}

export async function fetchAdminPartnerOnboarding(partnerId: string) {
  const { data } = await API.get(`/admin/partner-center/onboarding/${partnerId}`);
  return data as PartnerOnboardingSnapshot & {
    partner: { id: string; name: string; slug: string; status: string };
  };
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

function filenameFromDisposition(header: string | undefined, fallback: string) {
  const raw = String(header || "");
  const star = raw.match(/filename\*=UTF-8''([^;]+)/i);
  if (star) return decodeURIComponent(star[1]);
  const plain = raw.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : fallback;
}

function saveBlob(data: Blob, filename: string) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPartnerCenterPdf(
  id: string,
  locale: string,
  admin = false,
  variant?: string
) {
  const path = admin ? `/admin/partner-center/materials/${id}/pdf` : `/partner-center/materials/${id}/pdf`;
  const response = await API.get(path, {
    params: { locale, variant },
    responseType: "blob",
    timeout: 120000,
  });
  const filename = filenameFromDisposition(
    response.headers?.["content-disposition"],
    `Bizuply_${id}_${String(locale).toUpperCase()}.pdf`
  );
  saveBlob(response.data, filename);
}

export function materialHasOriginalFile(item: PartnerMaterial) {
  if (item.localeVideoUrl || item.videoUrl) return "video" as const;
  const mime = String(item.mimeType || "");
  const url = String(item.fileUrl || "");
  if (/^image\//.test(mime) || /\.(png|jpe?g|gif|webp|svg)$/i.test(url)) return "image" as const;
  if (/^video\//.test(mime) || /\.(mp4|mov|webm)$/i.test(url)) return "video" as const;
  return null;
}

export function downloadPartnerCenterOriginal(item: PartnerMaterial) {
  const url = item.localeVideoUrl || item.videoUrl || item.fileUrl;
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = item.fileName || "";
  a.click();
}
