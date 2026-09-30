export type AdsManagerLevel = "campaign" | "adset" | "ad";
export type AdsManagerMode = "edit" | "review";
export type AdsManagerSessionMode = "create" | "edit";
export type BudgetStrategy = "campaign" | "adset";
export type BudgetType = "daily" | "lifetime";
export type BuyingType = "auction" | "reserved";

export type CampaignObjective =
  | "OUTCOME_AWARENESS"
  | "OUTCOME_TRAFFIC"
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_LEADS"
  | "OUTCOME_APP_PROMOTION"
  | "OUTCOME_SALES";

export type ValidationSeverity = "none" | "warning" | "error";

export type InstantFormItem = {
  id: string;
  name: string;
  status: "active" | "archived";
  customQuestions: number;
  updatedAt: string;
};

export type CampaignDraft = {
  id: string;
  name: string;
  buyingType: BuyingType;
  objective: CampaignObjective;
  status: string;
  budgetStrategy: BudgetStrategy;
  budgetType: BudgetType;
  budgetAmount: string;
  currency: string;
  bidStrategy: string;
  advantagePlusLeads: boolean;
  showMoreDetails: boolean;
  showMoreBudget: boolean;
};

export type AdsManagerGender = "all" | "male" | "female";

export type AdsManagerLocation = {
  key: string;
  name: string;
  type: string;
  countryCode?: string;
  countryName?: string;
  region?: string;
  /** Meta city key for radius targeting. */
  metaCityKey?: string;
  /**
   * City targeting mode (Meta):
   * - true  → "Current city only" (no radius)
   * - false → "Cities within radius"
   */
  cityOnly?: boolean;
  /** Radius in miles when cityOnly is false (Meta UI: 10–50). */
  radiusMiles?: number | null;
  /** Kept for map / publish (km). Derived from radiusMiles when using miles. */
  radiusKm?: number | null;
  distanceUnit?: "mile" | "kilometer";
  latitude?: number | null;
  longitude?: number | null;
  include?: boolean;
};

export type AdSetInterest = { id: string; name: string };

export type AdSetDraft = {
  id: string;
  name: string;
  status: string;
  conversionLocation: string;
  /** Facebook Page used for Instant forms / lead conversion */
  facebookPageId: string;
  facebookPageName: string;
  performanceGoal: string;
  costPerResultGoal: string;
  dataset: string;
  conversionEvent: string;
  attributionModel: string;
  dynamicCreative: boolean;
  spendingLimitEnabled: boolean;
  spendingLimitMin: string;
  spendingLimitMax: string;
  startDate: string;
  startTime: string;
  endDateEnabled: boolean;
  endDate: string;
  endTime: string;
  advantageAudience: boolean;
  savedAudienceId: string;
  locationsSummary: string;
  locations: AdsManagerLocation[];
  ageMin: number | null;
  ageMax: number | null;
  gender: AdsManagerGender;
  interests: AdSetInterest[];
  optimizationGoal: string;
  billingEvent: string;
  dailyBudget: string;
  lifetimeBudget: string;
  includeCustomAudiences: string[];
  customAudiences: AdSetInterest[];
  excludedAudiences: AdSetInterest[];
  targetingLoaded: boolean;
  targetingRaw: Record<string, unknown> | null;
  suggestAudience: boolean;
  furtherLimitReach: boolean;
  advertiserId: string;
  advertiserDifferentFromPayer: boolean;
  advantagePlacements: boolean;
  showMoreConversion: boolean;
  showMoreBudget: boolean;
  showMoreAudience: boolean;
  showMorePlacements: boolean;
  ageExpanded: boolean;
  locationsExpanded: boolean;
};

export type AdCreativeFormat = "image" | "video";

export type AdDraft = {
  id: string;
  adSetId: string;
  name: string;
  status: string;
  creativeId: string;
  partnershipAd: boolean;
  facebookPageId: string;
  facebookPageName: string;
  instagramAccountId: string;
  threadsAccountId: string;
  useInstagramForThreads: boolean;
  websiteUrl: string;
  displayLink: string;
  instantFormId: string;
  formTab: "active" | "archived";
  requireSmsVerification: boolean;
  requireWorkEmail: boolean;
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
  mediaLabel: string;
  creativeFormat: AdCreativeFormat;
  imageHash: string;
  imagePreviewUrl: string;
  videoId: string;
};

export type AdsManagerTreeNode = {
  id: string;
  level: AdsManagerLevel;
  name: string;
  parentId: string | null;
  validation: ValidationSeverity;
};

export type AdsManagerState = {
  sessionMode: AdsManagerSessionMode;
  mode: AdsManagerMode;
  selectedLevel: AdsManagerLevel;
  selectedId: string;
  saveStatus: "saving" | "saved" | "error";
  lastSavedAt: string | null;
  campaign: CampaignDraft;
  adSets: AdSetDraft[];
  ads: AdDraft[];
  instantForms: InstantFormItem[];
  audienceEstimate: {
    lower: number;
    upper: number;
    spectrum: number; // 0 narrow … 1 broad
    ready?: boolean;
  };
  campaignScore: number;
};
