export type AdsManagerLevel = "campaign" | "adset" | "ad";
export type AdsManagerMode = "edit" | "review";
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
  radiusKm?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  include?: boolean;
};

export type AdSetDraft = {
  id: string;
  name: string;
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
  ageMin: number;
  ageMax: number;
  gender: AdsManagerGender;
  includeCustomAudiences: string[];
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

export type AdDraft = {
  id: string;
  name: string;
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
};

export type AdsManagerTreeNode = {
  id: string;
  level: AdsManagerLevel;
  name: string;
  parentId: string | null;
  validation: ValidationSeverity;
};

export type AdsManagerState = {
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
  };
  campaignScore: number;
};
