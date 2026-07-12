export const VISUAL_LIBRARY_IMAGES = {
  "office": "/visual-library/images/office.svg",
  "beauty": "/visual-library/images/beauty.svg",
  "food": "/visual-library/images/food.svg",
  "realestate": "/visual-library/images/realestate.svg",
  "tech": "/visual-library/images/tech.svg",
  "wellness": "/visual-library/images/wellness.svg",
  "team": "/visual-library/images/team.svg",
  "product": "/visual-library/images/product.svg",
  "finance": "/visual-library/images/finance.svg",
  "travel": "/visual-library/images/travel.svg",
  "construction": "/visual-library/images/construction.svg",
  "abstract": "/visual-library/images/abstract.svg"
} as const;

export type VisualLibraryImageKey =
  keyof typeof VISUAL_LIBRARY_IMAGES;

export function getVisualLibraryImage(
  key: VisualLibraryImageKey,
) {
  return VISUAL_LIBRARY_IMAGES[key];
}
