export type CampaignCreationMode = "MANUAL" | "AI_ASSISTED";

export const META_CAMPAIGNS_CREATE_PATH = "create";
export const META_CAMPAIGNS_CREATE_AI_PATH = "create-ai";

export function metaCampaignsChildPath(
  basePath: string,
  child: typeof META_CAMPAIGNS_CREATE_PATH | typeof META_CAMPAIGNS_CREATE_AI_PATH
): string {
  return `${String(basePath || "").replace(/\/+$/, "")}/${child}`;
}

export function isMetaCampaignsKnownChildPath(pathSegment: string): boolean {
  return (
    pathSegment === "overview" ||
    pathSegment === "create" ||
    pathSegment === "create-ai" ||
    pathSegment === "settings" ||
    pathSegment === "edit"
  );
}
