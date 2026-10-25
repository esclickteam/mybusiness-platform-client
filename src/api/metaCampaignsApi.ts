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
  instagramBusinessAccountId?: string;
};

export type MetaSelectedAdAccount = {
  id: string;
  accountId: string;
  name: string;
  currency?: string;
  accountStatus?: number;
  timezoneName?: string;
  selectedAt?: string | null;
};

export type MetaCampaignMetrics = {
  spend: number;
  leads: number;
  results?: number;
  clicks: number;
  linkClicks?: number;
  impressions: number | null;
  ctr: number;
  cpc: number;
  cpm?: number;
  costPerLead: number | null;
  costPerResult?: number | null;
  roas: number | null;
  reach?: number | null;
  landingPageViews?: number | null;
  purchases?: number | null;
  resultIndicator?: string;
  /** False when Meta did not return a campaign insight for this range. */
  insightsAvailable?: boolean;
  frequency?: number;
  dateStart?: string | null;
  dateStop?: string | null;
};

export type MetaCampaign = {
  id: string;
  name: string;
  /** Configured on/off (campaign.status) — use for activate/pause toggle */
  status: string;
  configuredStatus?: string;
  /** Ads Manager Delivery (prefer ad effective_status) */
  effectiveStatus: string;
  deliveryStatus?: string;
  campaignEffectiveStatus?: string;
  editorDraft?: {
    ads?: Array<Record<string, string>>;
    workspace?: Record<string, unknown> | null;
    revision?: number;
    hasUnpublishedChanges?: boolean;
    savedAt?: string;
    publishedSnapshot?: Record<string, unknown> | null;
    metaBaseline?: Record<string, unknown> | null;
  } | null;
  publishRecordId?: string;
  localOnly?: boolean;
  localDraft?: boolean;
  hasUnpublishedChanges?: boolean;
  publishFailed?: boolean;
  lastError?: string;
  localUpdatedAt?: string | null;
  creativeLinkedOnMeta?: boolean;
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
  pageId?: string;
  instagramUserId?: string;
  instagramActorId?: string;
  creativeId?: string;
  adId?: string;
  adSetId?: string;
  /** Graph ids stored on the publish record. Distinct from the local editor id. */
  metaCampaignId?: string;
  metaAdSetId?: string;
  metaAdId?: string;
  metaCreativeId?: string;
  locations?: MetaLocationTarget[];
  locationMode?: "places" | "radius";
  interests?: MetaInterestTarget[];
  behaviors?: MetaInterestTarget[];
  detailedTargets?: MetaDetailedTarget[];
  ageMin?: number | null;
  ageMax?: number | null;
  genders?: number[];
  gender?: "all" | "1" | "2" | string;
  advantageAudience?: boolean;
  targetingRaw?: Record<string, unknown> | null;
  placementMode?: "advantage" | "facebook" | "instagram" | "both" | string;
  publisherPlatforms?: string[];
  facebookPositions?: string[];
  instagramPositions?: string[];
  leadFormId?: string;
  formId?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
  link?: string;
  displayLink?: string;
  imageHash?: string;
  imageUrl?: string;
  picture?: string;
  videoId?: string;
  creativeFormat?: "single" | "video" | "carousel" | string;
  callToAction?: string;
  ctaCustom?: string;
  carouselCards?: MetaCarouselCard[];
  adSets?: MetaCampaignAdSet[];
  ads?: MetaCampaignAd[];
  lastSynced?: string | null;
  issues?: MetaIssueInfo[];
  audienceSummary?: string;
};

export type MetaCampaignSeriesPoint = {
  date: string;
  leads: number | null;
  spend: number | null;
  clicks: number | null;
  impressions: number | null;
  reach?: number | null;
  linkClicks?: number | null;
  landingPageViews?: number | null;
  purchases?: number | null;
  results?: number | null;
  ctr?: number | null;
  cpc?: number | null;
  frequency?: number | null;
  sales?: number;
  traffic?: number;
  engagement?: number;
};

export type MetaCampaignInsight = {
  id: string;
  tone: "success" | "warning" | "info";
  title?: string;
  body?: string;
  titleKey?: string;
  bodyKey?: string;
  bodyParams?: Record<string, string | number>;
  action?: string;
  demoData?: boolean;
};

export type MetaIssueInfo = {
  level?: string;
  errorType?: string;
  message: string;
};

export type MetaCampaignAd = {
  id: string;
  name: string;
  status?: string;
  configuredStatus?: string;
  effectiveStatus?: string;
  headline?: string;
  primaryText?: string;
  description?: string;
  displayLink?: string;
  imageUrl?: string;
  imageHash?: string;
  videoId?: string;
  creativeId?: string;
  leadFormId?: string;
  formId?: string;
  link?: string;
  callToAction?: string;
  pageId?: string;
  instagramUserId?: string;
  results?: number;
  issues?: MetaIssueInfo[];
  metrics?: MetaCampaignMetrics;
  campaignId?: string;
  campaignName?: string;
  adSetId?: string;
};

export type MetaCampaignAdSet = {
  id: string;
  name: string;
  status?: string;
  configuredStatus?: string;
  effectiveStatus?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  audience?: string;
  ads?: MetaCampaignAd[];
  issues?: MetaIssueInfo[];
  learningStageInfo?: { status?: string } | null;
  metrics?: MetaCampaignMetrics;
  campaignId?: string;
  campaignName?: string;
  optimizationGoal?: string;
  billingEvent?: string;
  startTime?: string | null;
  endTime?: string | null;
  locations?: MetaLocationTarget[];
  excludedLocations?: MetaLocationTarget[];
  interests?: MetaInterestTarget[];
  behaviors?: MetaInterestTarget[];
  /** All flexible_spec entries (interests + behaviors + demographics). */
  detailedTargets?: MetaDetailedTarget[];
  customAudiences?: MetaInterestTarget[];
  excludedAudiences?: MetaInterestTarget[];
  locales?: Array<string | number>;
  ageMin?: number | null;
  ageMax?: number | null;
  genders?: number[];
  gender?: string;
  advantageAudience?: boolean | null;
  pageId?: string;
  publisherPlatforms?: string[];
  facebookPositions?: string[];
  instagramPositions?: string[];
  placementMode?: string;
  targetingRaw?: Record<string, unknown> | null;
  targetingLoaded?: boolean;
  recoveredDraft?: boolean;
  recoveredPublishId?: string;
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
  contextCard?: {
    title?: string;
    content?: string;
    style?: string;
  };
  thankYouPage?: {
    title?: string;
    body?: string;
    buttonText?: string;
    buttonType?: string;
    websiteUrl?: string;
    businessPhoneNumber?: string;
  };
  followUpActionUrl?: string;
};

/** Marketing API Ad Account billing health (separate from WABA). */
export type MetaAdAccountBillingHealth = {
  kind: "meta_ad_account";
  billingOwner: "meta_ads";
  billingSeparationNote: string;
  connected: boolean;
  id: string;
  accountId: string;
  name: string;
  currency: string;
  statusCode: number | null;
  statusKey: string;
  statusLabel: string;
  disableReasonCode?: number;
  disableReasonKey?: string;
  hasPaymentMethod: boolean | null;
  paymentMethodDisplay?: string | null;
  fundingSourceId?: string | null;
  severity: "ok" | "warning" | "error";
  ok: boolean;
  actionRequired: boolean;
  issues: string[];
  manageBillingUrl: string;
  actionLabel?: string;
  actionUrl?: string;
};

export type MetaBusinessPortfolio = {
  id: string;
  name: string;
};

export type MetaAdsConnectionStatus = {
  success?: boolean;
  connected: boolean;
  isConnected: boolean;
  isGuidedDemo?: boolean;
  demoData?: boolean;
  metaUserName?: string;
  adAccounts: MetaAdAccount[];
  businesses?: MetaBusinessPortfolio[];
  selectedBusiness?: {
    id: string;
    name: string;
    selectedAt?: string | null;
  } | null;
  selectedAdAccount: MetaSelectedAdAccount | null;
  pages: MetaAdsPage[];
  selectedPage: {
    pageId: string;
    pageName: string;
    selectedAt?: string | null;
    instagramBusinessAccountId?: string;
  } | null;
  lastSyncAt?: string | null;
  lastError?: string;
  hasAccessToken?: boolean;
  tokenExpiresAt?: string | null;
  tokenInvalid?: boolean;
  grantedScopes?: string[];
  hasPagesManageAds?: boolean;
  adAccountBillingHealth?: MetaAdAccountBillingHealth | null;
  objectives?: MetaLabeledOption[];
  specialAdCategories?: MetaLabeledOption[];
  callToActions?: MetaLabeledOption[];
  previewFormats?: MetaLabeledOption[];
  leadFormQuestionTypes?: MetaLeadFormQuestionType[];
  isShowcaseDemo?: boolean;
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
    linkClicks?: number;
    impressions?: number;
    reach?: number;
    frequency?: number;
    ctr?: number;
    cpc?: number;
    cpm?: number;
  };
  series: MetaCampaignSeriesPoint[];
  comparisonSeries?: MetaCampaignSeriesPoint[];
  campaigns: MetaCampaign[];
  insights: MetaCampaignInsight[];
  comparison?: {
    current?: MetaCampaignsOverview["kpis"];
    previous?: MetaCampaignsOverview["kpis"];
    changes?: Partial<Record<keyof MetaCampaignsOverview["kpis"], number | null>>;
    previousRange?: { since: string; until: string };
  } | null;
  demoData?: boolean;
  insightsSync?: {
    ok: boolean;
    level?: string;
    syncedAt?: string | null;
    error?: "rate_limit" | "unavailable" | null;
  } | null;
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
  /** Meta flexible_spec key: interests | behaviors | life_events | … */
  type?: string;
  /** Browse root: demographics | interests | behaviors */
  branch?: string;
  selectable?: boolean;
  /**
   * Why a browse/search row cannot be selected:
   * unsupported_flexible_spec | category_not_selectable | category
   */
  unsupportedReason?: string;
  parent?: string;
};

export type MetaDetailedTarget = MetaInterestTarget;

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
  adSetId?: string;
  adId?: string;
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
  lastMetaErrorSubcode?: string;
  lastMetaFbtraceId?: string;
  outcome?:
    | "creation_failed"
    | "rejected"
    | "pending_review"
    | "active"
    | "created_paused"
    | "publishing"
    | "unknown"
    | string;
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
    metaErrorSubcode?: string;
    metaFbtraceId?: string;
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
  demoSafe?: boolean;
  activationBlockers?: Array<{
    component: string;
    id?: string;
    configuredStatus: string;
    effectiveStatus: string;
  }>;
};

/** Meta publish walks campaign → ad set → creative → ad and can exceed 20s. */
export const META_PUBLISH_TIMEOUT_MS = 180000;
export const META_GRAPH_READ_TIMEOUT_MS = 60000;

function withBusiness(businessId?: string, extra?: Record<string, unknown>) {
  const params: Record<string, unknown> = { ...(extra || {}) };
  if (businessId) params.businessId = businessId;
  return { params };
}

function withMetaTimeout(
  businessId?: string,
  extra?: Record<string, unknown>,
  timeout = META_GRAPH_READ_TIMEOUT_MS
) {
  return { ...withBusiness(businessId, extra), timeout };
}

export async function getMetaCampaignsStatus(businessId?: string) {
  const { data } = await API.get<MetaAdsConnectionStatus>(
    "/meta-campaigns/status",
    withMetaTimeout(businessId)
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

export async function selectMetaBusiness(
  businessId: string | undefined,
  metaBusinessId: string
) {
  const { data } = await API.post<MetaAdsConnectionStatus>(
    "/meta-campaigns/select-business",
    { metaBusinessId, businessId },
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
  range?: { since?: string; until?: string; days?: number; datePreset?: string; compare?: number; compareSince?: string; compareUntil?: string; timezone?: string }
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
  range?: { since?: string; until?: string; days?: number; datePreset?: string }
) {
  const { data } = await API.get<{
    success: boolean;
    campaign: MetaCampaign;
    series: MetaCampaignSeriesPoint[];
    currency?: string;
    objectives?: MetaAdsConnectionStatus["objectives"];
    specialAdCategories?: MetaAdsConnectionStatus["specialAdCategories"];
    connection?: MetaAdsConnectionStatus;
  }>(`/meta-campaigns/campaigns/${campaignId}`, withMetaTimeout(businessId, range));
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
  status: string,
  options?: { confirmActivate?: boolean }
) {
  const { data } = await API.post<{ success: boolean; campaign: MetaCampaign }>(
    `/meta-campaigns/campaigns/${campaignId}/status`,
    {
      status,
      businessId,
      ...(status === "ACTIVE" ? { confirmActivate: options?.confirmActivate === true } : {}),
    },
    withBusiness(businessId)
  );
  return data;
}

export type MetaManagerLevel = "campaign" | "adset" | "ad";

export type MetaManagerRow = {
  id: string;
  name: string;
  level: MetaManagerLevel;
  campaignId?: string;
  campaignName?: string;
  adSetId?: string;
  adSetName?: string;
  status?: string;
  configuredStatus?: string;
  effectiveStatus?: string;
  objective?: string;
  optimizationGoal?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  createdTime?: string | null;
  updatedTime?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  headline?: string;
  primaryText?: string;
  imageUrl?: string;
  localOnly?: boolean;
  metrics?: MetaCampaignMetrics | null;
};

export type MetaManagerQuery = {
  level?: MetaManagerLevel;
  limit?: number;
  after?: string;
  campaignId?: string;
  adSetId?: string;
  status?: string;
  q?: string;
  createdSince?: string;
  createdUntil?: string;
  datePreset?: string;
  since?: string;
  until?: string;
  days?: number;
  refresh?: number;
  grain?: "day" | "week" | "month";
  ids?: string;
  breakdown?: string;
};

export async function getMetaAdsManager(businessId: string | undefined, query: MetaManagerQuery) {
  const { data } = await API.get<{
    success: boolean;
    level: MetaManagerLevel;
    rows: MetaManagerRow[];
    paging?: { limit: number; after: string; hasNext: boolean };
    account?: { adAccountId?: string; currency?: string; timezoneName?: string };
    insightsSync?: { ok: boolean; cached?: boolean; error?: string | null; syncedAt?: string | null; attribution?: string };
    reporting?: { reachSummed?: boolean };
  }>("/meta-campaigns/manager", withBusiness(businessId, query));
  return data;
}

export async function getMetaAdsManagerSeries(businessId: string | undefined, query: MetaManagerQuery) {
  const { data } = await API.get<{
    success: boolean;
    grain: string;
    series: Array<{ id: string; points: Array<MetaCampaignMetrics & { date?: string }> }>;
    insightsSync?: { ok: boolean; error?: string | null; syncedAt?: string | null };
  }>("/meta-campaigns/manager/series", withBusiness(businessId, query));
  return data;
}

export async function getMetaAdsManagerBreakdown(businessId: string | undefined, query: MetaManagerQuery) {
  const { data } = await API.get<{
    success: boolean;
    breakdown: string;
    slices: Array<{ label: string; metrics: MetaCampaignMetrics }>;
    totals?: MetaCampaignMetrics;
    reporting?: { reachSummed?: boolean; note?: string };
    insightsSync?: { ok: boolean; error?: string | null };
  }>("/meta-campaigns/manager/breakdowns", withBusiness(businessId, query));
  return data;
}

export async function getMetaAdsManagerCompare(businessId: string | undefined, query: MetaManagerQuery) {
  const { data } = await API.get<{
    success: boolean;
    rows: Array<{ id: string; metrics: MetaCampaignMetrics }>;
    reporting?: { reachSummed?: boolean };
  }>("/meta-campaigns/manager/compare", withBusiness(businessId, query));
  return data;
}

export async function listMetaChangeHistory(businessId: string | undefined, entityId: string) {
  const { data } = await API.get<{
    success: boolean;
    changes: Array<{
      id: string;
      action: string;
      entityType: string;
      metaEntityId: string;
      field?: string;
      success: boolean;
      errorMessage?: string;
      createdAt?: string | null;
    }>;
  }>("/meta-campaigns/changes", withBusiness(businessId, { entityId }));
  return data;
}

export async function getMetaPerformance(
  businessId: string | undefined,
  query: { level: "campaign" | "adset" | "ad"; datePreset?: string; since?: string; until?: string; days?: number }
) {
  const { data } = await API.get<{
    success: boolean;
    level: string;
    rows: Array<MetaCampaign | MetaCampaignAdSet | MetaCampaignAd>;
  }>("/meta-campaigns/performance", withBusiness(businessId, query));
  return data;
}

export async function listMetaMediaLibrary(businessId?: string) {
  const { data } = await API.get<{
    success: boolean;
    images: Array<{ kind: "image"; hash: string; url: string; name?: string; createdTime?: string | null }>;
    videos: Array<{ kind: "video"; videoId: string; url?: string; picture?: string; name?: string; createdTime?: string | null }>;
  }>("/meta-campaigns/media", withBusiness(businessId));
  return data;
}

export async function updateMetaAdSet(
  businessId: string | undefined,
  adSetId: string,
  payload: Record<string, unknown>
) {
  const { data } = await API.patch<{ success: boolean; adSet: MetaCampaignAdSet }>(
    `/meta-campaigns/adsets/${adSetId}`,
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function updateMetaAd(
  businessId: string | undefined,
  adId: string,
  payload: Record<string, unknown>
) {
  const { data } = await API.patch<{ success: boolean; ad: MetaCampaignAd }>(
    `/meta-campaigns/ads/${adId}`,
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export type MetaEditorDraftSaveResult = {
  success: boolean;
  publishId: string;
  editorDraft?: {
    ads?: Array<Record<string, string>>;
    workspace?: Record<string, unknown> | null;
    revision?: number;
    savedAt?: string;
  } | null;
  revision?: number;
  savedAt?: string | null;
  hasUnpublishedChanges?: boolean;
  localOnly?: boolean;
  publishStatus?: string;
  displayStatus?: string;
  metaCampaignId?: string;
  metaAdSetId?: string;
  metaCreativeId?: string;
  metaAdId?: string;
  creativeOnMeta?: boolean;
  error?: string;
  code?: string;
};

export async function saveMetaEditorDraft(
  businessId: string,
  body: {
    publishId?: string;
    metaCampaignId?: string;
    localName?: string;
    objective?: string;
    editorDraft: unknown;
    expectedRevision?: number;
    differsFromMeta?: boolean;
    markPublished?: boolean;
    restorePublished?: boolean;
    metaBaseline?: unknown;
  }
) {
  const path = body.publishId
    ? `/meta-campaigns/publishes/${body.publishId}/editor-draft`
    : "/meta-campaigns/publishes/editor-draft";
  const { data } = await API.post<MetaEditorDraftSaveResult>(
    path,
    {
      businessId,
      ...body,
    },
    { timeout: META_GRAPH_READ_TIMEOUT_MS }
  );
  return data;
}

export async function deleteLocalCampaignDraft(businessId: string | undefined, publishId: string) {
  const { data } = await API.delete<{ success: boolean; publishId: string }>(
    `/meta-campaigns/publishes/${publishId}/draft`,
    withBusiness(businessId)
  );
  return data;
}

export type MetaDeleteItem = {
  id: string;
  level?: "campaign" | "adset" | "ad";
  name?: string;
  campaignId?: string;
  adSetId?: string;
};

export type MetaDeleteResultRow = {
  id: string;
  level?: string;
  name?: string;
  ok: boolean;
  kind?: string;
  error?: string;
  code?: string;
};

export async function deleteMetaObjects(
  businessId: string | undefined,
  items: MetaDeleteItem[],
  options?: { confirm?: boolean }
) {
  const { data } = await API.post<{
    success: boolean;
    results: MetaDeleteResultRow[];
    deletedIds: string[];
    failed: MetaDeleteResultRow[];
  }>(
    "/meta-campaigns/objects/delete",
    {
      businessId,
      confirm: options?.confirm !== false,
      items,
    },
    withBusiness(businessId)
  );
  return data;
}

export async function duplicateLocalCampaignDraft(businessId: string | undefined, publishId: string) {
  const { data } = await API.post<MetaEditorDraftSaveResult>(
    `/meta-campaigns/publishes/${publishId}/duplicate-draft`,
    { businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function duplicateMetaCampaign(businessId: string | undefined, campaignId: string) {
  const { data } = await API.post<{ success: boolean; result: unknown; status: string }>(
    `/meta-campaigns/campaigns/${campaignId}/duplicate`,
    { businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function duplicateMetaAdSet(
  businessId: string | undefined,
  adSetId: string,
  campaignId?: string
) {
  const { data } = await API.post<{ success: boolean; result: unknown; status: string }>(
    `/meta-campaigns/adsets/${adSetId}/duplicate`,
    { businessId, campaignId },
    withBusiness(businessId)
  );
  return data;
}

export async function duplicateMetaAd(
  businessId: string | undefined,
  adId: string,
  adSetId?: string
) {
  const { data } = await API.post<{ success: boolean; result: unknown; status: string }>(
    `/meta-campaigns/ads/${adId}/duplicate`,
    { businessId, adSetId },
    withBusiness(businessId)
  );
  return data;
}

export async function setMetaAdSetStatus(
  businessId: string | undefined,
  adSetId: string,
  status: string,
  options?: { confirmActivate?: boolean }
) {
  const { data } = await API.post<{ success: boolean; adSet: MetaCampaignAdSet }>(
    `/meta-campaigns/adsets/${adSetId}/status`,
    {
      status,
      businessId,
      ...(status === "ACTIVE" ? { confirmActivate: options?.confirmActivate === true } : {}),
    },
    withBusiness(businessId)
  );
  return data;
}

export async function setMetaAdStatus(
  businessId: string | undefined,
  adId: string,
  status: string,
  options?: { confirmActivate?: boolean }
) {
  const { data } = await API.post<{ success: boolean; ad: MetaCampaignAd }>(
    `/meta-campaigns/ads/${adId}/status`,
    {
      status,
      businessId,
      ...(status === "ACTIVE" ? { confirmActivate: options?.confirmActivate === true } : {}),
    },
    withBusiness(businessId)
  );
  return data;
}

export async function deleteMetaCampaign(
  businessId: string | undefined,
  campaignId: string,
  options?: { confirm?: boolean; name?: string }
) {
  return deleteMetaObjects(
    businessId,
    [{ id: campaignId, level: "campaign", name: options?.name }],
    { confirm: options?.confirm !== false }
  );
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

export type MetaLeadgenTosStatusName =
  | "accepted"
  | "required"
  | "missing_permission"
  | "unavailable"
  | "demo"
  | "partnership";

export type MetaLeadgenTosStatus = {
  success: boolean;
  pageId: string;
  pageName?: string;
  accepted: boolean;
  verified: boolean;
  status: MetaLeadgenTosStatusName;
  tosUrl: string;
  acceptanceTime?: string | null;
  checkedAt?: string;
  message?: string;
  demoSafe?: boolean;
};

export async function getMetaLeadgenTos(
  businessId: string | undefined,
  pageId: string
) {
  const { data } = await API.get<MetaLeadgenTosStatus>(
    "/meta-campaigns/leadgen-tos",
    withMetaTimeout(businessId, { pageId })
  );
  return data;
}

export type MetaPageWhatsAppNumber = {
  id: string;
  phone: string;
  e164?: string;
  displayNumber: string;
  isWhatsAppBusiness?: boolean;
  linkedToPage?: boolean;
  pageId?: string;
};

export type MetaPageWhatsAppResult = {
  success?: boolean;
  ok?: boolean;
  linked?: boolean;
  alreadyLinkedToThisPage?: boolean;
  needsVerification?: boolean;
  codeSent?: boolean;
  demoSafe?: boolean;
  officialFlow?: boolean;
  pageId?: string;
  pageName?: string;
  numbers?: MetaPageWhatsAppNumber[];
  number?: MetaPageWhatsAppNumber | null;
  hasWhatsAppNumber?: boolean;
  canConnectAdditional?: boolean;
  maxNumbers?: number;
  message?: string;
  code?: string;
  verificationStatus?: string | null;
  settingsHelpUrl?: string;
  adsHelpUrl?: string;
};

export async function listPageWhatsAppNumbers(
  businessId: string | undefined,
  pageId: string
) {
  const { data } = await API.get<MetaPageWhatsAppResult>(
    `/meta-campaigns/pages/${encodeURIComponent(pageId)}/whatsapp-numbers`,
    withBusiness(businessId, { pageId })
  );
  return data;
}

export async function inspectPageWhatsAppNumber(
  businessId: string | undefined,
  pageId: string,
  phone: string
) {
  const { data } = await API.post<MetaPageWhatsAppResult>(
    `/meta-campaigns/pages/${encodeURIComponent(pageId)}/whatsapp-numbers/inspect`,
    { businessId, pageId, phone },
    withBusiness(businessId)
  );
  return data;
}

export async function requestPageWhatsAppCode(
  businessId: string | undefined,
  pageId: string,
  phone: string
) {
  const { data } = await API.post<MetaPageWhatsAppResult>(
    `/meta-campaigns/pages/${encodeURIComponent(pageId)}/whatsapp-numbers/request-code`,
    { businessId, pageId, phone },
    withBusiness(businessId)
  );
  return data;
}

export async function verifyPageWhatsAppCode(
  businessId: string | undefined,
  pageId: string,
  phone: string,
  code: string
) {
  const { data } = await API.post<MetaPageWhatsAppResult>(
    `/meta-campaigns/pages/${encodeURIComponent(pageId)}/whatsapp-numbers/verify`,
    { businessId, pageId, phone, code },
    withBusiness(businessId)
  );
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
    drafts?: MetaLeadFormDraft[];
    questionTypes?: MetaLeadFormQuestionType[];
    warning?: string;
    metaUnavailable?: boolean;
  }>("/meta-campaigns/lead-forms", withMetaTimeout(businessId, { pageId }));
  return data;
}

export type MetaLeadFormWriteResult = {
  success: boolean;
  form?: MetaLeadForm & { pageId?: string };
  confirmedByMeta?: boolean;
  demoSafe?: boolean;
  savedLocally?: boolean;
  recovered?: boolean;
  campaignLinked?: boolean;
  leadIntake?: {
    active?: boolean;
    webhookSubscribed?: boolean;
    reason?: string;
  };
  error?: string;
};

export async function createMetaLeadForm(
  businessId: string | undefined,
  payload: {
    pageId?: string;
    name: string;
    questions?: MetaLeadFormQuestion[];
    locale?: string;
    /** Restricted = ad viewers only; Open = shareable */
    sharing?: "restricted" | "open";
    blockDisplayForNonTargetedViewer?: boolean;
    trackingParameters?: Array<string | { key: string; value?: string }>;
    introTitle?: string;
    introDescription?: string;
    privacyPolicyUrl?: string;
    privacyPolicyLinkText?: string;
    thankYouTitle?: string;
    thankYouBody?: string;
    thankYouUrl?: string;
    thankYouButtonText?: string;
    /** Meta Instant Form thank-you additional action */
    additionalAction?: "website" | "file" | "call" | "whatsapp";
    whatsappPhone?: string;
    callPhone?: string;
    idempotencyKey?: string;
    publishId?: string;
    adDraftId?: string;
  }
) {
  const { data } = await API.post<MetaLeadFormWriteResult>(
    "/meta-campaigns/lead-forms",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export type MetaLeadFormDraft = {
  draftId: string;
  sourceFormId: string;
  pageId?: string;
  name?: string;
  editor?: Record<string, unknown>;
  updatedAt?: string | null;
};

export async function saveMetaLeadFormDraft(
  businessId: string | undefined,
  payload: {
    pageId?: string;
    sourceFormId: string;
    name?: string;
    editor?: Record<string, unknown>;
    discard?: boolean;
  }
) {
  const { data } = await API.post<{
    success: boolean;
    savedOnMeta?: boolean;
    discarded?: boolean;
    draft?: MetaLeadFormDraft | null;
  }>(
    "/meta-campaigns/lead-forms/drafts",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function duplicateMetaLeadForm(
  businessId: string | undefined,
  payload: {
    pageId?: string;
    sourceFormId: string;
    confirmDuplicate: true;
    idempotencyKey?: string;
  }
) {
  const { data } = await API.post<MetaLeadFormWriteResult>(
    "/meta-campaigns/lead-forms/duplicate",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function setMetaLeadFormStatus(
  businessId: string | undefined,
  payload: {
    pageId?: string;
    formId: string;
    status: "ARCHIVED" | "ACTIVE";
    confirmStatus: true;
  }
) {
  const { data } = await API.post<MetaLeadFormWriteResult>(
    "/meta-campaigns/lead-forms/status",
    { ...payload, businessId },
    withBusiness(businessId)
  );
  return data;
}

export async function syncMetaLeadForm(
  businessId: string | undefined,
  payload: {
    pageId?: string;
    formId: string;
    name?: string;
    idempotencyKey?: string;
    publishId?: string;
    adDraftId?: string;
  }
) {
  const { data } = await API.post<MetaLeadFormWriteResult>(
    "/meta-campaigns/lead-forms/sync",
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

export async function estimateMetaAudienceReach(
  businessId: string | undefined,
  payload: {
    locations?: Array<
      MetaLocationTarget & {
        radiusMiles?: number | null;
        cityOnly?: boolean;
      }
    >;
    countries?: string[];
    ageMin?: number;
    ageMax?: number;
    genders?: number[];
    locationsSummary?: string;
    advantageAudience?: boolean;
    suggestAudience?: boolean;
    furtherLimitReach?: boolean;
    estimateWithSuggestions?: boolean;
    interests?: Array<{ id: string; name?: string }>;
    objective?: string;
    optimizationGoal?: string;
    pageId?: string;
    advantagePlacements?: boolean;
    strictEstimate?: boolean;
    noGeoFallback?: boolean;
  }
) {
  const { data } = await API.post<{
    success: boolean;
    lower: number | null;
    upper: number | null;
    spectrum: number | null;
    estimateReady?: boolean;
    source?: string;
    metric?: string;
    warning?: string;
    optimizationGoal?: string;
    forecast?: {
      metric?: string;
      reach?: number | null;
      impressions?: number | null;
      actions?: number | null;
    } | null;
  }>(
    "/meta-campaigns/targeting/reach-estimate",
    payload,
    withMetaTimeout(businessId)
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

/** Account-scoped Meta targetingbrowse catalog (demographics / interests / behaviors). */
export async function browseMetaDetailedTargeting(
  businessId: string | undefined,
  query?: { locale?: string; limit?: number }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaDetailedTarget[];
  }>(
    "/meta-campaigns/targeting/detailed-browse",
    withBusiness(businessId, {
      locale: query?.locale,
      limit: query?.limit,
    })
  );
  return data;
}

/** Account-scoped Meta targetingsearch across detailed targeting types. */
export async function searchMetaDetailedTargeting(
  businessId: string | undefined,
  query: { q: string; locale?: string; limit?: number; limitType?: string }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaDetailedTarget[];
  }>(
    "/meta-campaigns/targeting/detailed-search",
    withBusiness(businessId, {
      q: query.q,
      locale: query.locale,
      limit: query.limit,
      limit_type: query.limitType,
    })
  );
  return data;
}

/**
 * Empty-search / seed-based detailed targeting suggestions (Relevance | Size).
 * Official Meta /targetingsuggestions only (selected targets or Page-category seeds).
 */
export async function suggestMetaDetailedTargeting(
  businessId: string | undefined,
  query?: {
    locale?: string;
    limit?: number;
    sort?: "relevance" | "size";
    targetingList?: Array<{ id: string; type?: string }>;
  }
) {
  const { data } = await API.get<{
    success: boolean;
    results: MetaDetailedTarget[];
    source?: string;
    sort?: string;
    seedSource?: string;
    apiGap?: string;
  }>(
    "/meta-campaigns/targeting/detailed-suggestions",
    withBusiness(businessId, {
      locale: query?.locale,
      limit: query?.limit,
      sort: query?.sort || "relevance",
      targeting_list: query?.targetingList?.length
        ? JSON.stringify(query.targetingList)
        : undefined,
    })
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
    { businessId, ...payload },
    { timeout: META_PUBLISH_TIMEOUT_MS }
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
  }>(
    `/meta-campaigns/publishes/${publishId}/sync`,
    { businessId },
    { timeout: META_PUBLISH_TIMEOUT_MS }
  );
  return data;
}

export async function getMetaPublish(businessId: string, publishId: string) {
  const { data } = await API.get<{
    success: boolean;
    publish: MetaCampaignPublishRecord;
  }>(`/meta-campaigns/publishes/${publishId}`, withMetaTimeout(businessId));
  return data.publish;
}

export async function waitForMetaPublish(
  businessId: string,
  publishId: string,
  options?: { timeoutMs?: number; intervalMs?: number }
) {
  const timeoutMs = options?.timeoutMs ?? 120000;
  const intervalMs = options?.intervalMs ?? 2500;
  const started = Date.now();
  let last = await getMetaPublish(businessId, publishId);
  while (Date.now() - started < timeoutMs) {
    const status = String(last?.publishStatus || "");
    if (
      status === "submitted" ||
      status === "failed" ||
      status === "partial_failed"
    ) {
      return last;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    last = await getMetaPublish(businessId, publishId);
  }
  return last;
}

export type MetaLeadFormUpdatePlan = {
  success: boolean;
  readOnly?: boolean;
  strategy: "replace_creative_on_existing_ad" | "new_ad_required" | string;
  reason: string;
  message: string;
  createsNewAd: boolean;
  createsNewCreative: boolean;
  canUpdateExistingAd: boolean;
  currentLeadFormId?: string;
  requestedLeadFormId?: string;
  campaignId?: string;
  adSetId?: string;
  adId?: string;
  creativeId?: string;
  publishRecordId?: string;
  recovered?: Record<string, boolean>;
};

export type MetaExistingPublishResult = {
  success: boolean;
  verified: boolean;
  verifiedOnExistingAd: boolean;
  verifiedLeadFormId?: string;
  previousLeadFormId?: string;
  message?: string;
  strategy?: string;
  reason?: string;
  campaignId: string;
  adSetId: string;
  adId: string;
  previousAdId?: string;
  creativeId?: string;
  createdNewCampaign: boolean;
  createdNewAdSet: boolean;
  createdNewAd: boolean;
  createdNewCreative: boolean;
  publish?: MetaCampaignPublishRecord | null;
  code?: string;
  error?: string;
  plan?: MetaLeadFormUpdatePlan | null;
  draftPreserved?: boolean;
};

export async function planMetaCampaignChanges(
  businessId: string,
  campaignId: string,
  payload: {
    publishRecordId?: string;
    metaCampaignId?: string;
    metaAdSetId?: string;
    metaAdId?: string;
    metaCreativeId?: string;
    leadFormId?: string;
  }
) {
  const { data } = await API.post<MetaLeadFormUpdatePlan>(
    `/meta-campaigns/campaigns/${campaignId}/publish-changes/plan`,
    { businessId, ...payload }
  );
  return data;
}

export async function publishMetaCampaignChanges(
  businessId: string,
  campaignId: string,
  payload: Record<string, unknown>
) {
  const { data } = await API.post<MetaExistingPublishResult>(
    `/meta-campaigns/campaigns/${campaignId}/publish-changes`,
    { businessId, ...payload },
    { timeout: META_PUBLISH_TIMEOUT_MS }
  );
  return data;
}

export async function retryMetaPublish(
  businessId: string,
  publishId: string,
  payload?: Record<string, unknown>
) {
  const { data } = await API.post<MetaPublishResult>(
    `/meta-campaigns/publishes/${publishId}/retry`,
    { businessId, ...(payload || {}) },
    { timeout: META_PUBLISH_TIMEOUT_MS }
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

export type CampaignHealthStatus =
  | "HEALTHY"
  | "WATCH"
  | "ACTION_RECOMMENDED"
  | "CRITICAL";

export type CampaignHealthMetrics = {
  spend?: number;
  impressions?: number;
  ctr?: number;
  cpc?: number;
  cpl?: number;
  leads?: number;
  roas?: number;
  frequency?: number;
};

export type AiCampaignRecommendation = {
  id: string;
  businessId: string;
  metaCampaignId: string;
  campaignName?: string;
  sourceRuleKeys: string[];
  severity: "INFO" | "OPPORTUNITY" | "WARNING" | "CRITICAL";
  title: string;
  finding: string;
  explanation: string;
  recommendedActionType: string;
  recommendedAction: string;
  requiresApproval: boolean;
  status:
    | "OPEN"
    | "VIEWED"
    | "ACCEPTED"
    | "DISMISSED"
    | "EXPIRED"
    | "NEW"
    | "REVIEWED"
    | "APPLIED"
    | "FAILED"
    | "ROLLED_BACK";
  actionPayload?: Record<string, unknown>;
  confirmation?: {
    object?: { type?: string; id?: string; campaignId?: string; name?: string };
    currentValue?: unknown;
    newValue?: unknown;
    why?: string;
    expectedImpact?: string;
    canAffectSpend?: boolean;
  };
  applyable?: boolean;
  undoable?: boolean;
  freshness?: {
    generatedAt?: string | null;
    metricsWindow?: string;
    metricsSnapshotHash?: string;
    stale?: boolean;
    valid?: boolean;
    reason?: string;
  };
  applyAudit?: Record<string, unknown> | null;
  metricsSummary?: {
    current?: CampaignHealthMetrics;
    previous?: CampaignHealthMetrics;
    changes?: Record<string, number | null>;
  };
  aiGenerated: boolean;
  healthStatus?: CampaignHealthStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CampaignHealth = {
  metaCampaignId: string;
  healthStatus: CampaignHealthStatus;
  metrics: CampaignHealthMetrics;
  changes?: Record<string, number | null>;
  recommendation: AiCampaignRecommendation | null;
};

export async function getMetaCampaignHealth(
  businessId: string,
  campaignId: string
) {
  const { data } = await API.get<{ success: boolean; health: CampaignHealth }>(
    `/meta-campaigns/campaigns/${campaignId}/health`,
    withBusiness(businessId)
  );
  return data.health;
}

export async function getMetaCampaignHealthSummary(
  businessId: string,
  campaignIds: string[] = []
) {
  const { data } = await API.get<{
    success: boolean;
    items: Array<{
      metaCampaignId: string;
      healthStatus: CampaignHealthStatus;
      recommendation: AiCampaignRecommendation | null;
    }>;
  }>(
    "/meta-campaigns/health-summary",
    withBusiness(businessId, {
      campaignIds: campaignIds.join(","),
    })
  );
  return data.items || [];
}

export async function listAiCampaignRecommendations(
  businessId: string,
  status?: "open" | "closed"
) {
  const { data } = await API.get<{
    success: boolean;
    recommendations: AiCampaignRecommendation[];
  }>(
    "/meta-campaigns/recommendations",
    withBusiness(businessId, status ? { status } : undefined)
  );
  return data.recommendations || [];
}

export async function getAiCampaignRecommendation(
  businessId: string,
  recommendationId: string
) {
  const { data } = await API.get<{
    success: boolean;
    recommendation: AiCampaignRecommendation;
  }>(`/meta-campaigns/recommendations/${recommendationId}`, withBusiness(businessId));
  return data.recommendation;
}

export async function viewAiCampaignRecommendation(
  businessId: string,
  recommendationId: string
) {
  const { data } = await API.post<{
    success: boolean;
    recommendation: AiCampaignRecommendation;
  }>(`/meta-campaigns/recommendations/${recommendationId}/view`, { businessId });
  return data.recommendation;
}

export async function generateAiCampaignRecommendations(
  businessId: string,
  campaignId: string
) {
  const { data } = await API.post<{
    success: boolean;
    lowData?: boolean;
    message?: string;
    recommendations: AiCampaignRecommendation[];
  }>("/meta-campaigns/recommendations/generate", { businessId, campaignId });
  return data;
}

export async function applyAiCampaignRecommendation(
  businessId: string,
  recommendationId: string
) {
  const { data } = await API.post<{
    success: boolean;
    applied?: boolean;
    recommendation: AiCampaignRecommendation;
    readBack?: { expected?: unknown; actual?: unknown; matched?: boolean };
  }>(`/meta-campaigns/recommendations/${recommendationId}/apply`, {
    businessId,
    confirm: true,
  });
  return data;
}

export async function undoAiCampaignRecommendation(
  businessId: string,
  recommendationId: string
) {
  const { data } = await API.post<{
    success: boolean;
    undone?: boolean;
    recommendation: AiCampaignRecommendation;
    readBack?: { expected?: unknown; actual?: unknown; matched?: boolean };
  }>(`/meta-campaigns/recommendations/${recommendationId}/undo`, { businessId });
  return data;
}

export async function dismissAiCampaignRecommendation(
  businessId: string,
  recommendationId: string
) {
  const { data } = await API.post<{
    success: boolean;
    recommendation: AiCampaignRecommendation;
  }>(`/meta-campaigns/recommendations/${recommendationId}/dismiss`, {
    businessId,
  });
  return data.recommendation;
}

export type AutomationRule = {
  id: string;
  name: string;
  enabled: boolean;
  scope: string;
  objectIds: string[];
  conditions: Array<{ metric: string; operator: string; threshold: number }>;
  window: string;
  consecutivePeriods: number;
  minImpressions: number;
  minSpend: number;
  minResults: number;
  minAgeHours: number;
  action: string;
  actionValue?: number | null;
  mode: "RECOMMEND" | "AUTOMATIC";
  cooldownHours: number;
  lastEvaluatedAt?: string | null;
  lastTriggeredAt?: string | null;
  executionCount?: number;
};

export async function listAutomationRules(businessId: string) {
  const { data } = await API.get<{ success: boolean; rules: AutomationRule[] }>(
    "/meta-campaigns/automation-rules",
    withBusiness(businessId)
  );
  return data.rules || [];
}

export async function saveAutomationRule(
  businessId: string,
  payload: Partial<AutomationRule> & { name: string; action: string },
  id?: string
) {
  const body = { ...payload, businessId };
  const { data } = id
    ? await API.put<{ success: boolean; rule: AutomationRule }>(
        `/meta-campaigns/automation-rules/${id}`,
        body
      )
    : await API.post<{ success: boolean; rule: AutomationRule }>(
        "/meta-campaigns/automation-rules",
        body
      );
  return data.rule;
}

export async function deleteAutomationRule(businessId: string, id: string) {
  await API.delete(`/meta-campaigns/automation-rules/${id}`, withBusiness(businessId));
}

export async function getAutomationRuleHistory(businessId: string, id: string) {
  const { data } = await API.get<{ success: boolean; history: Array<Record<string, unknown>> }>(
    `/meta-campaigns/automation-rules/${id}/history`,
    withBusiness(businessId)
  );
  return data.history || [];
}

export async function testAutomationRule(businessId: string, id: string) {
  const { data } = await API.post<{ success: boolean; results?: Array<Record<string, unknown>> }>(
    `/meta-campaigns/automation-rules/${id}/test`,
    { businessId }
  );
  return data;
}

export async function evaluateAutomationRule(businessId: string, id: string) {
  const { data } = await API.post<{ success: boolean; results?: Array<Record<string, unknown>> }>(
    `/meta-campaigns/automation-rules/${id}/evaluate`,
    { businessId }
  );
  return data;
}

export type CampaignGoal = {
  id: string;
  name: string;
  scope: string;
  metaCampaignId?: string;
  objective: string;
  primaryKpi: string;
  targetValue: number;
  supportingKpis?: string[];
  generatedRules?: Array<Record<string, unknown>>;
  ruleIds?: string[];
  safetyLimits?: Record<string, unknown>;
  automationPreference: "RECOMMEND" | "AUTOMATIC";
  status: "DRAFT" | "ACTIVE" | "PAUSED";
  explanation?: string;
  lastHealth?: string;
  startingSnapshot?: { cpl?: number } | null;
  lastSnapshot?: { cpl?: number } | null;
  evaluationWindow?: string;
};

export async function listCampaignGoals(businessId: string, campaignId?: string) {
  const { data } = await API.get<{ success: boolean; goals: CampaignGoal[] }>(
    "/meta-campaigns/goals",
    withBusiness(businessId, campaignId ? { campaignId } : undefined)
  );
  return data.goals || [];
}

export async function draftCampaignGoal(
  businessId: string,
  payload: Record<string, unknown>
) {
  const { data } = await API.post<{
    success: boolean;
    goal: CampaignGoal;
    plan: Record<string, unknown>;
    explanation: string;
  }>("/meta-campaigns/goals/draft", { ...payload, businessId });
  return data;
}

export async function updateCampaignGoal(
  businessId: string,
  id: string,
  payload: Record<string, unknown>
) {
  const { data } = await API.put<{ success: boolean; goal: CampaignGoal }>(
    `/meta-campaigns/goals/${id}`,
    { ...payload, businessId }
  );
  return data.goal;
}

export async function activateCampaignGoal(businessId: string, id: string) {
  const { data } = await API.post<{
    success: boolean;
    goal: CampaignGoal;
    rules: Array<{ id: string; name: string }>;
  }>(`/meta-campaigns/goals/${id}/activate`, { businessId });
  return data;
}

export async function evaluateCampaignGoal(businessId: string, id: string) {
  const { data } = await API.post<{
    success: boolean;
    goal: CampaignGoal;
    health: { status: string; currentValue: number; differencePct: number | null };
  }>(`/meta-campaigns/goals/${id}/evaluate`, { businessId });
  return data;
}

export async function getCampaignGoalHistory(businessId: string, id: string) {
  const { data } = await API.get<{ success: boolean; history: Array<Record<string, unknown>> }>(
    `/meta-campaigns/goals/${id}/history`,
    withBusiness(businessId)
  );
  return data.history || [];
}

export async function getCampaignGoalDashboard(businessId: string, campaignId: string) {
  const { data } = await API.get<{
    success: boolean;
    dashboard: {
      goal: CampaignGoal;
      current: { cpl?: number };
      health: { status: string; currentValue: number; differencePct: number | null };
      progress: { target: number; current: number; differencePct: number | null; started: number | null };
    } | null;
  }>(`/meta-campaigns/campaigns/${campaignId}/goal`, withBusiness(businessId));
  return data.dashboard;
}

export type PortfolioCampaignRow = {
  campaignId: string;
  name: string;
  status: string;
  currentBudget: number;
  proposedBudget: number;
  delta: number;
  spend: number;
  results: number;
  cpl: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  recommendation: string;
  reason: string;
  goalTarget?: number | null;
};

export type PortfolioAllocation = {
  id?: string;
  objective: string;
  mode: string;
  campaigns: PortfolioCampaignRow[];
  blended: {
    totalSpend: number;
    totalResults: number;
    blendedCpl: number;
    weightedCtr: number;
    totalDailyBudget: number;
  };
  totals: { currentBudget: number; proposedBudget: number; delta: number };
  explanation?: string;
  status?: string;
  applyResults?: Array<Record<string, unknown>>;
};

export async function getMetaPortfolio(businessId: string, query?: { window?: string; since?: string; until?: string }) {
  const { data } = await API.get<{ success: boolean; allocation?: PortfolioAllocation; campaigns: PortfolioCampaignRow[]; blended: PortfolioAllocation["blended"]; totals: PortfolioAllocation["totals"] }>(
    "/meta-campaigns/portfolio",
    withBusiness(businessId, query)
  );
  return data;
}

export async function analyzeMetaPortfolio(businessId: string, payload: Record<string, unknown>) {
  const { data } = await API.post<{ success: boolean; allocation: PortfolioAllocation }>(
    "/meta-campaigns/portfolio/analyze",
    { ...payload, businessId }
  );
  return data;
}

export async function simulateMetaPortfolio(businessId: string, payload: Record<string, unknown>) {
  const { data } = await API.post<{ success: boolean; allocation: PortfolioAllocation }>(
    "/meta-campaigns/portfolio/simulate",
    { ...payload, businessId }
  );
  return data;
}

export async function applyMetaPortfolio(businessId: string, id: string) {
  const { data } = await API.post<{
    success: boolean;
    allocation: PortfolioAllocation;
    partial?: boolean;
  }>(`/meta-campaigns/portfolio/${id}/apply`, { businessId, confirm: true });
  return data;
}

export type MarketingCopilotAnswer = {
  answer: string;
  supportingFacts: Array<{ text: string; campaignId?: string }>;
  suggestedActions: Array<{
    label: string;
    recommendationId?: string | null;
    campaignId?: string;
    actionType?: string;
    handoff?: { allowed: boolean; recommendationId?: string | null; confirmRequired?: boolean };
  }>;
  confidence: string;
  insufficientData: boolean;
  sources: string[];
  period?: string;
  syncedMinutesAgo?: number;
  cached?: boolean;
  usedAi?: boolean;
  sessionId?: string;
};

export async function askMarketingCopilot(
  businessId: string,
  question: string,
  sessionId?: string,
  window?: string
) {
  const { data } = await API.post<{ success: boolean } & MarketingCopilotAnswer>(
    "/meta-campaigns/copilot/ask",
    { businessId, question, sessionId, window }
  );
  return data;
}

export async function getMetaPortfolioHistory(businessId: string) {
  const { data } = await API.get<{ success: boolean; history: PortfolioAllocation[] }>(
    "/meta-campaigns/portfolio/history",
    withBusiness(businessId)
  );
  return data.history || [];
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
