export type StoreLayoutId =
  | "techCinema"
  | "marketBento"
  | "athleticStack"
  | "softCloud"
  | "editorialRoom"
  | "playfulPets"
  | "libraryStacks"
  | "beautyGloss"
  | "industrialYard"
  | "jewelGallery";

export const STORE_LAYOUT_BY_TEMPLATE: Record<string, StoreLayoutId> = {
  lumenware: "techCinema",
  greenbite: "marketBento",
  sportifya: "athleticStack",
  babynest: "softCloud",
  homecraft: "editorialRoom",
  petora: "playfulPets",
  booknook: "libraryStacks",
  glowlab: "beautyGloss",
  toolhaus: "industrialYard",
  jewelis: "jewelGallery",
};

export function resolveStoreLayout(
  templateId: string,
  explicit?: StoreLayoutId,
): StoreLayoutId {
  if (explicit) return explicit;
  return STORE_LAYOUT_BY_TEMPLATE[templateId] || "editorialRoom";
}
