import type { AdsManagerChange } from "./adsManagerDiff";

export type PublishIntent = "create" | "update" | "noop";

const NON_PUBLISHABLE = new Set(["changeSelection"]);

export const CREATIVE_CHANGE_KEYS = new Set([
  "changeHeadline",
  "changeDescription",
  "changePrimaryText",
  "changeCta",
  "changeMedia",
  "changeLeadForm",
  "changeWebsite",
  "changeFacebookPage",
  "changeInstagram",
]);

export function publishableAdsManagerChanges(changes: AdsManagerChange[]) {
  return changes.filter((change) => !NON_PUBLISHABLE.has(change.labelKey));
}

export function resolvePublishIntent(input: {
  existingCampaign: boolean;
  publishableChangeCount: number;
}): PublishIntent {
  if (!input.existingCampaign) return "create";
  return input.publishableChangeCount > 0 ? "update" : "noop";
}

export function publishIntentLabelKey(intent: PublishIntent) {
  if (intent === "create") return "publishCampaign";
  if (intent === "update") return "publishChanges";
  return "noChangesToPublish";
}
