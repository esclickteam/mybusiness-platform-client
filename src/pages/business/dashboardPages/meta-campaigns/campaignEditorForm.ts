import type {
  MetaCampaign,
  MetaInterestTarget,
  MetaLocationTarget,
} from "../../../../api/metaCampaignsApi";
import { DEFAULT_ISRAEL_LOCATION } from "./MetaAudienceTargetingPanel";

export type CarouselCard = {
  headline: string;
  description: string;
  link: string;
  imageHash: string;
  imageUrl: string;
};

export type CampaignEditorFormState = {
  name: string;
  objective: string;
  status: string;
  dailyBudget: string;
  lifetimeBudget: string;
  specialAdCategories: string[];
  startTime: string;
  stopTime: string;
  pageId: string;
  locations: MetaLocationTarget[];
  locationMode: "places" | "radius";
  interests: MetaInterestTarget[];
  ageMin: string;
  ageMax: string;
  gender: "all" | "1" | "2";
  advantageAudience: boolean;
  placementMode: "advantage" | "facebook" | "instagram" | "both";
  facebookFeed: boolean;
  facebookStory: boolean;
  facebookReels: boolean;
  instagramFeed: boolean;
  instagramStory: boolean;
  instagramReels: boolean;
  leadFormId: string;
  primaryText: string;
  headline: string;
  description: string;
  link: string;
  displayLink: string;
  imageHash: string;
  imagePreviewUrl: string;
  videoId: string;
  creativeFormat: "single" | "video" | "carousel";
  callToAction: string;
  ctaCustom: string;
  carouselCards: CarouselCard[];
};

export function defaultStartLocal() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function defaultStopLocal() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export const EMPTY_CARD: CarouselCard = {
  headline: "",
  description: "",
  link: "",
  imageHash: "",
  imageUrl: "",
};

export const EMPTY_FORM: CampaignEditorFormState = {
  name: "",
  objective: "OUTCOME_LEADS",
  status: "PAUSED",
  dailyBudget: "50",
  lifetimeBudget: "",
  specialAdCategories: [],
  startTime: defaultStartLocal(),
  stopTime: "",
  pageId: "",
  locations: [{ ...DEFAULT_ISRAEL_LOCATION }],
  locationMode: "places",
  interests: [],
  ageMin: "18",
  ageMax: "65",
  gender: "all",
  advantageAudience: true,
  placementMode: "both",
  facebookFeed: true,
  facebookStory: true,
  facebookReels: true,
  instagramFeed: true,
  instagramStory: true,
  instagramReels: true,
  leadFormId: "",
  primaryText: "",
  headline: "",
  description: "",
  link: "",
  displayLink: "",
  imageHash: "",
  imagePreviewUrl: "",
  videoId: "",
  creativeFormat: "single",
  callToAction: "SIGN_UP",
  ctaCustom: "",
  carouselCards: [{ ...EMPTY_CARD }, { ...EMPTY_CARD }],
};

export function toInputDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function placementsFromCampaign(campaign: MetaCampaign) {
  const facebookPositions = campaign.facebookPositions || [];
  const instagramPositions = campaign.instagramPositions || [];
  const platforms = campaign.publisherPlatforms || [];
  const placementMode =
    campaign.placementMode ||
    (platforms.length === 1 && platforms[0] === "facebook"
      ? "facebook"
      : platforms.length === 1 && platforms[0] === "instagram"
        ? "instagram"
        : "both");
  const hasFb = facebookPositions.length > 0;
  const hasIg = instagramPositions.length > 0;
  return {
    placementMode: placementMode as CampaignEditorFormState["placementMode"],
    facebookFeed: hasFb ? facebookPositions.includes("feed") : true,
    facebookStory: hasFb ? facebookPositions.includes("story") : true,
    facebookReels: hasFb ? facebookPositions.includes("facebook_reels") : true,
    instagramFeed: hasIg ? instagramPositions.includes("stream") : true,
    instagramStory: hasIg ? instagramPositions.includes("story") : true,
    instagramReels: hasIg ? instagramPositions.includes("reels") : true,
  };
}

function genderFromCampaign(
  campaign: MetaCampaign
): CampaignEditorFormState["gender"] {
  if (
    campaign.gender === "1" ||
    campaign.gender === "2" ||
    campaign.gender === "all"
  ) {
    return campaign.gender;
  }
  const first = campaign.genders?.[0];
  if (first === 1 || first === 2) return String(first) as "1" | "2";
  return "all";
}

export function campaignToForm(
  campaign: MetaCampaign,
  pageId = ""
): CampaignEditorFormState {
  const placements = placementsFromCampaign(campaign);
  const cards = (campaign.carouselCards || []).map((card) => ({
    headline: card.headline || "",
    description: card.description || "",
    link: card.link || "",
    imageHash: card.imageHash || "",
    imageUrl: card.imageUrl || card.picture || "",
  }));
  return {
    ...EMPTY_FORM,
    name: campaign.name || "",
    objective: campaign.objective || "OUTCOME_LEADS",
    status: campaign.status || "PAUSED",
    dailyBudget: campaign.dailyBudget ? String(campaign.dailyBudget) : "",
    lifetimeBudget: campaign.lifetimeBudget
      ? String(campaign.lifetimeBudget)
      : "",
    specialAdCategories: campaign.specialAdCategories || [],
    startTime: toInputDate(campaign.startTime) || defaultStartLocal(),
    stopTime: toInputDate(campaign.stopTime) || "",
    pageId: campaign.pageId || pageId,
    locations:
      campaign.locations && campaign.locations.length
        ? campaign.locations
        : [{ ...DEFAULT_ISRAEL_LOCATION }],
    locationMode: campaign.locationMode === "radius" ? "radius" : "places",
    interests: campaign.interests || [],
    ageMin: campaign.ageMin != null ? String(campaign.ageMin) : "18",
    ageMax: campaign.ageMax != null ? String(campaign.ageMax) : "65",
    gender: genderFromCampaign(campaign),
    advantageAudience: campaign.advantageAudience !== false,
    ...placements,
    leadFormId: campaign.leadFormId || campaign.formId || "",
    primaryText: campaign.primaryText || "",
    headline: campaign.headline || "",
    description: campaign.description || "",
    link: campaign.link || "",
    displayLink: campaign.displayLink || "",
    imageHash: campaign.imageHash || "",
    imagePreviewUrl: campaign.imageUrl || campaign.picture || "",
    videoId: campaign.videoId || "",
    creativeFormat:
      campaign.creativeFormat === "video" ||
      campaign.creativeFormat === "carousel"
        ? campaign.creativeFormat
        : "single",
    callToAction: campaign.callToAction || EMPTY_FORM.callToAction,
    ctaCustom: campaign.ctaCustom || "",
    carouselCards: cards.length >= 2 ? cards : EMPTY_FORM.carouselCards,
  };
}
