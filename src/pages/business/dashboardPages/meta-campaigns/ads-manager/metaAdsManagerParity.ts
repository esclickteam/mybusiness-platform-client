export const PUBLISHER_PLATFORMS = [
  "facebook",
  "instagram",
  "threads",
  "messenger",
  "audience_network",
] as const;

export const FACEBOOK_POSITIONS = [
  "feed",
  "facebook_reels",
  "story",
  "marketplace",
  "video_feeds",
  "search",
  "right_hand_column",
  "instream_video",
  "profile_feed",
] as const;

export const INSTAGRAM_POSITIONS = [
  "stream",
  "story",
  "explore",
  "reels",
  "explore_home",
  "profile_feed",
  "ig_search",
] as const;

export const MESSENGER_POSITIONS = ["story"] as const;
export const AUDIENCE_NETWORK_POSITIONS = ["classic", "rewarded_video"] as const;
export const DEVICE_PLATFORMS = ["mobile", "desktop"] as const;

export const BID_STRATEGY_OPTIONS = [
  { value: "LOWEST_COST_WITHOUT_CAP", labelKey: "highestVolume" },
  { value: "COST_CAP", labelKey: "costPerResult" },
  { value: "LOWEST_COST_WITH_BID_CAP", labelKey: "bidCap" },
  { value: "LOWEST_COST_WITH_MIN_ROAS", labelKey: "minRoas" },
] as const;

export function mapUiBidStrategy(raw: string): string {
  const text = String(raw || "").trim();
  const upper = text.toUpperCase().replace(/\s+/g, "_");
  if (upper === "COST_CAP" || /cost per result/i.test(text)) return "COST_CAP";
  if (upper === "LOWEST_COST_WITH_BID_CAP" || /^bid cap$/i.test(text)) {
    return "LOWEST_COST_WITH_BID_CAP";
  }
  if (upper === "LOWEST_COST_WITH_MIN_ROAS" || /roas|highest value/i.test(text)) {
    return "LOWEST_COST_WITH_MIN_ROAS";
  }
  if (upper === "LOWEST_COST_WITHOUT_CAP" || /highest volume/i.test(text)) {
    return "LOWEST_COST_WITHOUT_CAP";
  }
  return "LOWEST_COST_WITHOUT_CAP";
}

export function toggleValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function placementPayload(adSet: {
  advantagePlacements?: boolean;
  publisherPlatforms?: string[];
  facebookPositions?: string[];
  instagramPositions?: string[];
  messengerPositions?: string[];
  audienceNetworkPositions?: string[];
  threadsPositions?: string[];
  devicePlatforms?: string[];
}) {
  if (adSet.advantagePlacements !== false) {
    return { advantagePlacements: true as const };
  }
  const platforms = adSet.publisherPlatforms?.length
    ? adSet.publisherPlatforms
    : ["facebook", "instagram"];
  return {
    advantagePlacements: false as const,
    placementMode: "manual" as const,
    publisherPlatforms: platforms.includes("threads")
      ? Array.from(new Set([...platforms, "instagram"]))
      : platforms,
    facebookPositions: adSet.facebookPositions || ["feed", "story", "facebook_reels"],
    instagramPositions: adSet.instagramPositions || ["stream", "story", "reels"],
    messengerPositions: adSet.messengerPositions || [],
    audienceNetworkPositions: adSet.audienceNetworkPositions || [],
    threadsPositions: platforms.includes("threads") ? ["threads_stream"] : [],
    devicePlatforms: adSet.devicePlatforms || [],
  };
}
