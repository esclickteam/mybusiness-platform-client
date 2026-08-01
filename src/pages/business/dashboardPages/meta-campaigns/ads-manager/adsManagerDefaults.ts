import type {
  AdDraft,
  AdsManagerState,
  AdSetDraft,
  CampaignDraft,
  InstantFormItem,
} from "./adsManagerTypes";

/** Instant forms must come from Meta (`/lead-forms`) — never seed mock forms. */
export const EMPTY_INSTANT_FORMS: InstantFormItem[] = [];

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
    facebookPageId: "",
    facebookPageName: "",
    performanceGoal: "Maximize number of leads",
    costPerResultGoal: "None",
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
    locations: [
      {
        key: "IL",
        name: "Israel",
        type: "country",
        countryCode: "IL",
        countryName: "Israel",
        latitude: 31.5,
        longitude: 34.75,
        include: true,
      },
    ],
    ageMin: 18,
    ageMax: 65,
    gender: "all",
    includeCustomAudiences: [],
    /** Meta: show Age / Gender / Detailed targeting under Suggest an audience */
    suggestAudience: true,
    furtherLimitReach: false,
    advertiserId: "biz_main",
    advertiserDifferentFromPayer: false,
    advantagePlacements: true,
    showMoreConversion: false,
    showMoreBudget: false,
    showMoreAudience: false,
    showMorePlacements: false,
    ageExpanded: false,
    locationsExpanded: true,
  };
}

export function createDefaultAd(adSetName: string): AdDraft {
  return {
    id: "ad_1",
    name: `${adSetName} — Ad`,
    partnershipAd: false,
    facebookPageId: "",
    facebookPageName: "",
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
    mediaLabel: "Choose media for this ad",
    creativeFormat: "image",
    imageHash: "",
    imagePreviewUrl: "",
    videoId: "",
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
    instantForms: EMPTY_INSTANT_FORMS,
    // Meta Ads Manager Israel (country) broad estimate baseline.
    audienceEstimate: {
      lower: 3_800_000,
      upper: 4_500_000,
      spectrum: 0.9,
    },
    campaignScore: 72,
  };
}
