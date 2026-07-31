import type {
  AdDraft,
  AdsManagerState,
  AdSetDraft,
  CampaignDraft,
  InstantFormItem,
} from "./adsManagerTypes";

export const MOCK_INSTANT_FORMS: InstantFormItem[] = [
  {
    id: "form_leads_main",
    name: "Business inquiry form",
    status: "active",
    customQuestions: 3,
    updatedAt: "2026-07-28",
  },
  {
    id: "form_demo_request",
    name: "Book a demo",
    status: "active",
    customQuestions: 5,
    updatedAt: "2026-07-20",
  },
  {
    id: "form_newsletter",
    name: "Newsletter signup",
    status: "active",
    customQuestions: 1,
    updatedAt: "2026-07-12",
  },
  {
    id: "form_old_promo",
    name: "Summer promo 2025",
    status: "archived",
    customQuestions: 2,
    updatedAt: "2025-08-01",
  },
];

export function createDefaultCampaign(): CampaignDraft {
  return {
    id: "camp_1",
    name: "New leads campaign",
    buyingType: "auction",
    objective: "OUTCOME_LEADS",
    budgetStrategy: "campaign",
    budgetType: "daily",
    budgetAmount: "70.00",
    currency: "ILS",
    bidStrategy: "Highest volume",
    advantagePlusLeads: true,
    showMoreDetails: false,
    showMoreBudget: false,
  };
}

export function createDefaultAdSet(campaignName: string): AdSetDraft {
  return {
    id: "adset_1",
    name: `${campaignName} — Ad set`,
    conversionLocation: "Instant forms",
    performanceGoal: "Maximize number of leads",
    dataset: "BizUply Pixel",
    conversionEvent: "",
    attributionModel: "7-day click, 1-day view",
    dynamicCreative: false,
    spendingLimitEnabled: false,
    spendingLimitMin: "",
    spendingLimitMax: "",
    startDate: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endDateEnabled: false,
    endDate: "",
    endTime: "21:00",
    advantageAudience: true,
    savedAudienceId: "",
    locationsSummary: "Israel",
    includeCustomAudiences: [],
    suggestAudience: true,
    furtherLimitReach: false,
    advertiserId: "biz_main",
    advertiserDifferentFromPayer: false,
    advantagePlacements: true,
    showMoreConversion: false,
    showMoreBudget: false,
    showMoreAudience: false,
    showMorePlacements: false,
  };
}

export function createDefaultAd(adSetName: string): AdDraft {
  return {
    id: "ad_1",
    name: `${adSetName} — Ad`,
    partnershipAd: false,
    facebookPageId: "page_1",
    facebookPageName: "Your Business Page",
    instagramAccountId: "ig_1",
    threadsAccountId: "",
    useInstagramForThreads: true,
    websiteUrl: "https://www.example.com",
    displayLink: "example.com",
    instantFormId: "",
    formTab: "active",
    requireSmsVerification: false,
    requireWorkEmail: false,
    primaryText:
      "Get expert help for your business. Fill out the form and we’ll get back to you shortly.",
    headline: "Talk to our team",
    description: "Free consultation",
    callToAction: "LEARN_MORE",
    mediaLabel: "Image · 1080×1080",
  };
}

export function createDefaultAdsManagerState(): AdsManagerState {
  const campaign = createDefaultCampaign();
  const adSet = createDefaultAdSet(campaign.name);
  const ad = createDefaultAd(adSet.name);
  return {
    mode: "edit",
    selectedLevel: "campaign",
    selectedId: campaign.id,
    saveStatus: "saved",
    lastSavedAt: new Date().toISOString(),
    campaign,
    adSets: [adSet],
    ads: [ad],
    instantForms: MOCK_INSTANT_FORMS,
    audienceEstimate: {
      lower: 480_000,
      upper: 560_000,
      spectrum: 0.62,
    },
    campaignScore: 72,
  };
}
