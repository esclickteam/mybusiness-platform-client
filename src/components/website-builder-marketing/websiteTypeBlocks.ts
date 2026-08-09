type TFn = (key: string, options?: Record<string, unknown>) => any;

export type WebsiteTypeBlock = {
  id: string;
  label: string;
  /** Short teaser under the block title */
  teaser: string;
  /** Concrete capabilities this website type gets in Bizuply */
  points: string[];
  templateId: string;
  templateTitle: string;
  accent: string;
  accentSoft: string;
};

export function getWebsiteTypeBlocks(t: TFn): WebsiteTypeBlock[] {
  return [
    {
      id: "branding",
      label: t("websitePage.typeBlocks.branding.label") as string,
      teaser: t("websitePage.typeBlocks.branding.teaser") as string,
      points: t("websitePage.typeBlocks.branding.points", {
        returnObjects: true,
      }) as string[],
      templateId: "brandforge",
      templateTitle: "Brandforge",
      accent: "#111827",
      accentSoft: "#F59E0B",
    },
    {
      id: "store",
      label: t("websitePage.typeBlocks.store.label") as string,
      teaser: t("websitePage.typeBlocks.store.teaser") as string,
      points: t("websitePage.typeBlocks.store.points", {
        returnObjects: true,
      }) as string[],
      templateId: "novastra",
      templateTitle: "Novastra",
      accent: "#9A6F3B",
      accentSoft: "#E7C9A0",
    },
    {
      id: "booking",
      label: t("websitePage.typeBlocks.booking.label") as string,
      teaser: t("websitePage.typeBlocks.booking.teaser") as string,
      points: t("websitePage.typeBlocks.booking.points", {
        returnObjects: true,
      }) as string[],
      templateId: "pulsecore",
      templateTitle: "PulseCore",
      accent: "#FF4D1D",
      accentSoft: "#FFD5C8",
    },
    {
      id: "real-estate",
      label: t("websitePage.typeBlocks.realEstate.label") as string,
      teaser: t("websitePage.typeBlocks.realEstate.teaser") as string,
      points: t("websitePage.typeBlocks.realEstate.points", {
        returnObjects: true,
      }) as string[],
      templateId: "brokeria",
      templateTitle: "Brokeria",
      accent: "#C9A962",
      accentSoft: "#E8D5A3",
    },
    {
      id: "restaurant",
      label: t("websitePage.typeBlocks.restaurant.label") as string,
      teaser: t("websitePage.typeBlocks.restaurant.teaser") as string,
      points: t("websitePage.typeBlocks.restaurant.points", {
        returnObjects: true,
      }) as string[],
      templateId: "aurelia",
      templateTitle: "Aurelia",
      accent: "#8B1E3F",
      accentSoft: "#E8B4B8",
    },
    {
      id: "courses",
      label: t("websitePage.typeBlocks.courses.label") as string,
      teaser: t("websitePage.typeBlocks.courses.teaser") as string,
      points: t("websitePage.typeBlocks.courses.points", {
        returnObjects: true,
      }) as string[],
      templateId: "lectora",
      templateTitle: "Lectora",
      accent: "#1D4ED8",
      accentSoft: "#93C5FD",
    },
  ];
}
