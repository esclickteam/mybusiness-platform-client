export type RichStoreLayoutId =
  | "roastBar"
  | "cellarVault"
  | "ridgeTrail"
  | "soundStage"
  | "veloTrack"
  | "greenhouseGrid"
  | "toyArcade"
  | "chefAtelier"
  | "streetDrop"
  | "aromaSalon";

export const RICH_STORE_LAYOUT_BY_TEMPLATE: Record<string, RichStoreLayoutId> = {
  brewora: "roastBar",
  vinora: "cellarVault",
  trailhaus: "ridgeTrail",
  audiolux: "soundStage",
  wheelora: "veloTrack",
  fernora: "greenhouseGrid",
  playora: "toyArcade",
  panora: "chefAtelier",
  kickora: "streetDrop",
  scentora: "aromaSalon",
};

export function resolveRichStoreLayout(
  templateId: string,
  explicit?: RichStoreLayoutId,
): RichStoreLayoutId {
  if (explicit) return explicit;
  return RICH_STORE_LAYOUT_BY_TEMPLATE[templateId] || "roastBar";
}
