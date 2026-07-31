import API from "../api";

export type MetaAdAccount = {
  id: string;
  accountId: string;
  name: string;
  currency?: string;
  accountStatus?: number;
  timezoneName?: string;
};

export type MetaAdsPage = {
  id: string;
  name: string;
};

export type MetaSelectedAdAccount = {
  id: string;
  accountId: string;
  name: string;
  currency?: string;
  selectedAt?: string | null;
};

export type MetaCampaignMetrics = {
  spend: number;
  leads: number;
  results?: number;
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
  costPerLead: number;
  costPerResult?: number;
  roas: number;
  reach?: number;
  dateStart?: string | null;
  dateStop?: string | null;
};

export type MetaCampaign = {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  objective: string;
  dailyBudget: number;
  lifetimeBudget: number;
  budgetRemaining?: number;
  budgetType?: string;
  specialAdCategories?: string[];
  buyingType?: string;
  bidStrategy?: string;
  createdTime?: string | null;
  updatedTime?: string | null;
  startTime?: string | null;
  stopTime?: string | null;
  metrics: MetaCampaignMetrics;
};

export type MetaCampaignSeriesPoint = {
  date: string;
  leads: number;
  spend: number;
  clicks: number;
  impressions: number;
};

export type MetaCampaignInsight = {
  id: string;
  tone: "success" | "warning" | "info";
  title: string;
  body: string;
  action?: string;
};

export type MetaLabeledOption = {
  value: string;
  labelHe: string;
  labelEn: string;
};

export type MetaLeadFormQuestion = {
  id?: string;
  key?: string;
  label?: string;
  type: string;
  required?: boolean;
  answerType?: "short_answer" | "multiple_choice";
  options?: Array<string | { key?: string; value: string }>;
};

export type MetaLeadFormQuestionType = {
  type: string;
  category: "contact" | "custom" | string;
  labelHe: string;
  labelEn: string;
  defaultSelected?: boolean;
  answerModes?: Array<"short_answer" | "multiple_choice">;
};

export type MetaLeadForm = {
  id: string;
  name: string;
  status?: string;
  locale?: string;
  leadsCount?: number;
  createdTime?: string | null;
  privacyPolicyUrl?: string;
  questions?: MetaLeadFormQuestion[];
};

export type MetaAdsConnectionStatus = {
  success?: boolean;
  connected: boolean;
  isConnected: boolean;
  metaUserName?: string;
  adAccounts: MetaAdAccount[];
  selectedAdAccount: MetaSelectedAdAccount | null;
  pages: MetaAdsPage[];
  selectedPage: {
    pageId: string;
    pageName: string;
    selectedAt?: string | null;
  } | null;
  lastSyncAt?: string | null;
  lastError?: string;
  hasAccessToken?: boolean;
  tokenExpiresAt?: string | null;
  objectives?: MetaLabeledOption[];
  specialAdCategories?: MetaLabeledOption[];
  callToActions?: MetaLabeledOption[];
  previewFormats?: MetaLabeledOption[];
  leadFormQuestionTypes?: MetaLeadFormQuestionType[];
};

export type MetaCampaignsOverview = {
  success?: boolean;
  connection: MetaAdsConnectionStatus;
  range?: { since: string; until: string };
  kpis: {
    roas: number;
    costPerLead: number;
    costPerResult?: number;
    leads: number;
    results?: number;
    spend: number;
    clicks?: number;
    impressions?: number;
    reach?: number;
    ctr?: number;
  };
  series: MetaCampaignSeriesPoint[];
  campaigns: MetaCampaign[];
  insights: MetaCampaignInsight[];
};

export type MetaCarouselCard = {
  headline?: string;
  description?: string;
  link?: string;
  imageHash?: string;
  imageUrl?: string;
  picture?: string;
};

export type MetaLocationTarget = {
  key: string;
  name: string;
  type: string;
  countryCode?: string;
  countryName?: string;
  region?: string;
  regionId?: string;
  radiusKm?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  addressString?: string;
  distanceUnit?: string;
  /** Original Meta city key when using Facebook-style city + radius. */
  metaCityKey?: string;
};

export type MetaInterestTarget = {
  id: string;
  name: string;
  audienceSize?: number | null;
  audienceSizeLower?: number | null;
  path?: string[];
  topic?: string;
  description?: string;
};

export type MetaCampaignPayload = {
  name: string;
  objective?: string;
  status?: string;
  dailyBudget?: number | null;
  lifetimeBudget?: number | null;
  specialAdCategories?: string[];
  startTime?: string | null;
  stopTime?: string | null;
  endTime?: string | null;
  bidStrategy?: string;
  full?: boolean;
  mode?: "full" | "campaign";
  pageId?: string;
  countries?: string[];
  locations?: MetaLocationTarget[];
  interests?: MetaInterestTarget[];
  geoLocations?: Record<string, unknown>;
  ageMin?: number | null;
  ageMax?: number | null;
  genders?: number[];
  advantageAudience?: boolean;
  advantagePlus?: boolean;
  advantagePlacements?: boolean;
  placementMode?: "advantage" | "facebook" | "instagram" | "both" | string;
  publisherPlatforms?: string[];
  facebookPositions?: string[];
  instagramPositions?: string[];
  leadFormId?: string;
  formId?: string;
  primaryText?: string;
  message?: string;
  headline?: string;
  description?: string;
  ctaLabel?: string;
  displayLink?: string;
  link?: string;
  websiteUrl?: string;
  imageUrl?: string;
  picture?: string;
  imageHash?: string;
  videoId?: string;
  creativeFormat?: "single" | "video" | "carousel" | string;
  format?: string;
  carouselCards?: MetaCarouselCard[];
  cards?: MetaCarouselCard[];
  callToAction?: string;
  cta?: string;
  ctaCustom?: string;
  adFormat?: string;
  adFormats?: string[];
  adSetName?: string;
  adName?: string;
  creativeName?: string;
};

export type MetaAdPreview = {
  adFormat: string;
  body: string;
  error?: string;
  raw?: unknown;
};

export type MetaCreateCampaignResult = {
  success: boolean;
  mode?: "full" | "campaign";
  campaign: MetaCampaign;
  campaignId?: string;
  adSetId?: string;
  creativeId?: string;
  adId?: string;
  status?: string | null;
  effectiveStatus?: string | null;
  preview?: MetaAdPreview | null;
  publish?: MetaCampaignPublishRecord | null;
};

export type MetaCampaignPublishRecord = {
  id: string;
  businessId: string;
  localName: string;
  objective: string;
  publishStatus: string;
  failedStage?: string;
  adAccountId: string;
  pageId: string;
  instantFormId: string;
  metaCampaignId: string;
  metaAdSetId: string;
  metaCreativeId: string;
  metaAdId: string;
  metaConfiguredStatus?: string;
  metaEffectiveStatus?: string;
  metaReviewFeedback?: unknown;
  metaIssuesInfo?: unknown;
  displayStatus: string;
  lastError?: string;
  lastMetaErrorCode?: string;
  lastMetaErrorMessage?: string;
  publishedAt?: string | null;
  lastMetaSyncAt?: string | null;
  adsManagerUrl?: string;
  success?: boolean;
  auditLog?: Array<{
    stage: string;
    metaObjectId?: string;
    responseStatus?: string;
    metaErrorCode?: string;
    metaErrorMessage?: string;
    success?: boolean;
    at?: string;
  }>;
};

export type MetaPublishResult = {
  success: boolean;
  campaignId: string;
  adSetId: string;
  creativeId: string;
  adId: string;
  status: string;
  effectiveStatus?: string;
  configuredStatus?: string;
  adsManagerUrl?: string;
  publish: MetaCampaignPublishRecord;
};

function withBusiness(businessId?: string, extra?: Record<string, unknown>) {
  const params: Record<string, unknown> = { ...(extra || {}) };
  if (businessId) params.businessId = businessId;
  return { params };
}

export async function getMetaCampaignsStatus(businessId?: string) {
  const { data } = await API.get<MetaAdsConnectionStatus>(
    "/meta-campaigns/status",
    withBusiness(businessId)
  );
  return data;
}

export async function getMetaCampaignsAuthUrl(businessId?: string) {
  const { data } = await API.get<{ success: boolean; url: string }>(
    "/meta-campaigns/auth-url",
    withBusiness(businessId)
  );
  return data;
}

export async function selectMetaAdAccount(
  businessId: string | undefined,
  adAccountId: string
) {
  const { data } = await API.post<MetaAdsConnectionStatus>(
    "/meta-campaigns/select-ad-account",
    { adAccountId, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function selectMetaAdsPage(
  businessId: string | undefined,
  pageId: string
) {
  const { data } = await API.post<MetaAdsConnectionStatus>(
    "/meta-campaigns/select-page",
    { pageId, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function refreshMetaAdAccounts(businessId?: string) {
  const { data } = await API.post<MetaAdsConnectionStatus>(
    "/meta-campaigns/refresh-accounts",
    { businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function disconnectMetaAds(businessId?: string) {
  const { data } = await API.post<MetaAdsConnectionStatus>(
    "/meta-campaigns/disconnect",
    { businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function getMetaCampaignsOverview(
  businessId?: string,
  range?: { since?: string; until?: string; days?: number }
) {
  const { data } = await API.get<MetaCampaignsOverview>(
    "/meta-campaigns/overview",
    withBusiness(businessId, range)
  );
  return data;
}

export async function listMetaCampaigns(
  businessId?: string,
  query?: {
    since?: string;
    until?: string;
    days?: number;
    segment?: string;
    q?: string;
    status?: string;
  }
) {
  const { data } = await API.get<{
    success: boolean;
    campaigns: MetaCampaign[];
    currency?: string;
  }>("/meta-campaigns/campaigns", withBusiness(businessId, query));
  return data;
}

export async function getMetaCampaign(
  businessId: string | undefined,
  campaignId: string,
  range?: { since?: string; until?: string; days?: number }
) {
  const { data } = await API.get<{
    success: boolean;
    campaign: MetaCampaign;
    series: MetaCampaignSeriesPoint[];
    currency?: string;
    objectives?: MetaAdsConnectionStatus["objectives"];
    specialAdCategories?: MetaAdsConnectionStatus["specialAdCategories"];
    connection?: MetaAdsConnectionStatus;
  }>(`/meta-campaigns/campaigns/${campaignId}`, withBusiness(businessId, range));
  return data;
}

export async function createMetaCampaign(
  businessId: string | undefined,
  payload: MetaCampaignPayload
) {
  const { data } = await API.post<MetaCreateCampaignResult>(
    "/meta-campaigns/campaigns",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function updateMetaCampaign(
  businessId: string | undefined,
  campaignId: string,
  payload: Partial<MetaCampaignPayload>
) {
  const { data } = await API.patch<{ success: boolean; campaign: MetaCampaign }>(
    `/meta-campaigns/campaigns/${campaignId}`,
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function setMetaCampaignStatus(
  businessId: string | undefined,
  campaignId: string,
  status: string
) {
  const { data } = await API.post<{ success: boolean; campaign: MetaCampaign }>(
    `/meta-campaigns/campaigns/${campaignId}/status`,
    { status, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function deleteMetaCampaign(
  businessId: string | undefined,
  campaignId: string
) {
  const { data } = await API.delete<{ success: boolean }>(
    `/meta-campaigns/campaigns/${campaignId}`,
    withBusiness(businessId)
  );
  return data;
}

export async function previewMetaAd(
  businessId: string | undefined,
  payload: Partial<MetaCampaignPayload> & {
    creativeId?: string;
    adId?: string;
    adFormat?: string;
    adFormats?: string[];
  }
) {
  const { data } = await API.post<{
    success: boolean;
    preview?: MetaAdPreview;
    previews?: MetaAdPreview[];
    callToActions?: MetaLabeledOption[];
    previewFormats?: MetaLabeledOption[];
  }>(
    "/meta-campaigns/ad-preview",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function uploadMetaMedia(
  businessId: string | undefined,
  file: File,
  kind: "image" | "video" = "image"
) {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  if (businessId) form.append("businessId", businessId);

  const { data } = await API.post<{
    success: boolean;
    type: "image" | "video";
    imageHash?: string;
    url?: string;
    videoId?: string;
  }>("/meta-campaigns/media", form, {
    params: businessId ? { businessId } : undefined,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listMetaLeadForms(
  businessId: string | undefined,
  pageId?: string
) {
  const { data } = await API.get<{
    success: boolean;
    pageId: string;
    forms: MetaLeadForm[];
    questionTypes?: MetaLeadFormQuestionType[];
  }>("/meta-campaigns/lead-forms", withBusiness(businessId, { pageId }));
  return data;
}

export async function createMetaLeadForm(
  businessId: string | undefined,
  payload: {
    pageId?: string;
    name: string;
    questions?: MetaLeadFormQuestion[];
    introTitle?: string;
    introDescription?: string;
    privacyPolicyUrl?: string;
    thankYouTitle?: string;
    thankYouBody?: string;
    thankYouUrl?: string;
    thankYouButtonText?: string;
  }
) {
  const { data } = await API.post<{ success: boolean; form: MetaLeadForm }>(
    "/meta-campaigns/lead-forms",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function searchMetaLocations(
  businessId: string | undefined,
  query: {
    q: string;
    locationTypes?: string[];
    countryCode?: string;
    limit?: number;
  }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaLocationTarget[];
  }>(
    "/meta-campaigns/targeting/locations",
    withBusiness(businessId, {
      q: query.q,
      locationTypes: query.locationTypes?.join(","),
      countryCode: query.countryCode,
      limit: query.limit,
    })
  );
  return data;
}

export async function geocodeMetaPlace(
  businessId: string | undefined,
  query: {
    q: string;
    name?: string;
    countryCode?: string;
  }
) {
  const { data } = await API.get<{
    success: boolean;
    latitude?: number | null;
    longitude?: number | null;
    source?: string;
    name?: string;
  }>(
    "/meta-campaigns/targeting/geocode",
    withBusiness(businessId, {
      q: query.q,
      name: query.name,
      countryCode: query.countryCode,
    })
  );
  return data;
}

export async function searchMetaInterests(
  businessId: string | undefined,
  query: { q: string; locale?: string; limit?: number }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaInterestTarget[];
  }>(
    "/meta-campaigns/targeting/interests",
    withBusiness(businessId, {
      q: query.q,
      locale: query.locale,
      limit: query.limit,
    })
  );
  return data;
}

export async function searchMetaInterestSuggestions(
  businessId: string | undefined,
  query: { names: string[]; locale?: string }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaInterestTarget[];
  }>(
    "/meta-campaigns/targeting/interest-suggestions",
    withBusiness(businessId, {
      interest_list: query.names.join(","),
      locale: query.locale,
    })
  );
  return data;
}

export async function browseMetaInterestCategories(
  businessId: string | undefined,
  query?: { locale?: string }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaInterestTarget[];
  }>(
    "/meta-campaigns/targeting/interest-browse",
    withBusiness(businessId, { locale: query?.locale })
  );
  return data;
}

/** Real Meta Marketing API publish (campaign → ad set → creative → ad). */
export async function publishMetaCampaign(
  businessId: string,
  payload: Record<string, unknown>
) {
  const { data } = await API.post<MetaPublishResult>(
    "/meta-campaigns/publishes",
    { businessId, ...payload }
  );
  return data;
}

export async function syncMetaPublish(
  businessId: string,
  publishId: string
) {
  const { data } = await API.post<{
    success: boolean;
    publish: MetaCampaignPublishRecord;
    effectiveStatus?: string;
    campaignStatus?: string;
    adSetStatus?: string;
    adStatus?: string;
  }>(`/meta-campaigns/publishes/${publishId}/sync`, { businessId });
  return data;
}

export async function retryMetaPublish(
  businessId: string,
  publishId: string
) {
  const { data } = await API.post<MetaPublishResult>(
    `/meta-campaigns/publishes/${publishId}/retry`,
    { businessId }
  );
  return data;
}

export async function listMetaPublishes(businessId: string) {
  const { data } = await API.get<{
    success: boolean;
    publishes: MetaCampaignPublishRecord[];
  }>("/meta-campaigns/publishes", withBusiness(businessId));
  return data.publishes || [];
}

export async function pollMetaPublishes(businessId: string) {
  const { data } = await API.post<{
    success: boolean;
    results: Array<{
      id: string;
      ok: boolean;
      publish?: MetaCampaignPublishRecord;
      error?: string;
    }>;
  }>("/meta-campaigns/publishes/poll", { businessId });
  return data;
}
