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
  | "aromaSalon"
  | "runwayRail"
  | "indigoStack"
  | "lastBench"
  | "courtDrop"
  | "luxeVitrine"
  | "roomShelf"
  | "softFold"
  | "cleanCabinet"
  | "doseGrid"
  | "strapStudio"
  | "dialAtelier"
  | "quietLounge";

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
  clothora: "runwayRail",
  denimlab: "indigoStack",
  soleora: "lastBench",
  sneakhaus: "courtDrop",
  gleamora: "luxeVitrine",
  nestware: "roomShelf",
  linenhaus: "softFold",
  pharmora: "cleanCabinet",
  vitara: "doseGrid",
  bagora: "strapStudio",
  watchora: "dialAtelier",
  loungora: "quietLounge",
};

export function resolveRichStoreLayout(
  templateId: string,
  explicit?: RichStoreLayoutId,
): RichStoreLayoutId {
  if (explicit) return explicit;
  return RICH_STORE_LAYOUT_BY_TEMPLATE[templateId] || "roastBar";
}
