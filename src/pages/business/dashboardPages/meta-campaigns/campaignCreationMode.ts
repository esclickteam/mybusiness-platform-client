export type CampaignCreationMode = "MANUAL" | "AI_ASSISTED";

export const META_CAMPAIGNS_CREATE_PATH = "create";
export const META_CAMPAIGNS_CREATE_AI_PATH = "create-ai";

/** Deep-link query used by Bizuply AI Studio / Advisor entry points. */
export const META_AI_CAMPAIGN_STUDIO_FROM = "ai-studio";

export function metaCampaignsChildPath(
  basePath: string,
  child: typeof META_CAMPAIGNS_CREATE_PATH | typeof META_CAMPAIGNS_CREATE_AI_PATH
): string {
  return `${String(basePath || "").replace(/\/+$/, "")}/${child}`;
}

/**
 * Future AI Studio / Advisor entry — reuses the existing /create-ai wizard
 * without duplicating the campaign engine. Optional intent seed via query.
 */
export function metaAiCampaignStudioDeepLink(
  businessId: string,
  extras: { objective?: string; destination?: string } = {}
): string {
  const params = new URLSearchParams({ from: META_AI_CAMPAIGN_STUDIO_FROM });
  if (extras.objective) params.set("objective", extras.objective);
  if (extras.destination) params.set("destination", extras.destination);
  return `/business/${businessId}/dashboard/meta-campaigns/${META_CAMPAIGNS_CREATE_AI_PATH}?${params.toString()}`;
}

/** Parse Studio/Advisor query seed from the /create-ai URL. */
export function parseMetaAiCampaignStudioSeed(
  search: string | URLSearchParams
): {
  fromStudio: boolean;
  seed?: { objective?: string; destination?: string };
} {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const fromStudio = params.get("from") === META_AI_CAMPAIGN_STUDIO_FROM;
  const objective = String(params.get("objective") || "").trim();
  const destination = String(params.get("destination") || "").trim();
  if (!fromStudio && !objective && !destination) {
    return { fromStudio: false };
  }
  const seed =
    objective || destination
      ? {
          ...(objective ? { objective } : {}),
          ...(destination ? { destination } : {}),
        }
      : undefined;
  return { fromStudio, seed };
}

export function isMetaCampaignsKnownChildPath(pathSegment: string): boolean {
  return (
    pathSegment === "overview" ||
    pathSegment === "campaigns" ||
    pathSegment === "create" ||
    pathSegment === "create-ai" ||
    pathSegment === "settings" ||
    pathSegment === "goals" ||
    pathSegment === "recommendations" ||
    pathSegment === "portfolio" ||
    pathSegment === "library" ||
    pathSegment === "edit"
  );
}
