type TFn = (key: string, options?: Record<string, unknown>) => any;

export type WebsiteHeroTemplate = {
  id: string;
  title: string;
  category: string;
  desktopImage: string;
  /** Primary lit glow behind the active mockup */
  accent: string;
  /** Soft companion tone for the glow gradient */
  accentSoft: string;
};

/**
 * Curated live templates for the website-builder marketing hero.
 * Accents match each template's real brand palette so the stage glow swaps with the slide.
 */
export function getWebsiteHeroTemplates(t: TFn): WebsiteHeroTemplate[] {
  return [
    {
      id: "florique",
      title: "Florique",
      category: t("websitePage.heroTemplates.florique"),
      desktopImage: "/floriquedesk.webp",
      accent: "#E11D8C",
      accentSoft: "#F9A8D4",
    },
    {
      id: "velmora",
      title: "Velmora",
      category: t("websitePage.heroTemplates.velmora"),
      desktopImage: "/velmoradesk.webp",
      accent: "#9A6F3B",
      accentSoft: "#E7C9A0",
    },
    {
      id: "adion",
      title: "Adion",
      category: t("websitePage.heroTemplates.adion"),
      desktopImage: "/Adiondesk.webp",
      accent: "#D4A017",
      accentSoft: "#F7E7C2",
    },
    {
      id: "pulsecore",
      title: "PulseCore",
      category: t("websitePage.heroTemplates.pulsecore"),
      desktopImage: "/PulseCoredesk.webp",
      accent: "#FF4D1D",
      accentSoft: "#D7FF36",
    },
    {
      id: "aeline",
      title: "Aeline",
      category: t("websitePage.heroTemplates.aeline"),
      desktopImage: "/Aelinedesk.webp",
      accent: "#3C1D6E",
      accentSoft: "#7FFFD4",
    },
    {
      id: "talentix",
      title: "Talentix",
      category: t("websitePage.heroTemplates.talentix"),
      desktopImage: "/talentixdesk.webp",
      accent: "#0891B2",
      accentSoft: "#67E8F9",
    },
    {
      id: "aurayoga",
      title: "AuraYoga",
      category: t("websitePage.heroTemplates.aurayoga"),
      desktopImage: "/AuraYogadesk.webp",
      accent: "#7C3AED",
      accentSoft: "#C4B5FD",
    },
  ];
}

/**
 * Static English-labelled snapshot kept for non-i18n consumers (e.g. the home
 * ScrollStory) that pass an explicit `templates` prop. The marketing page uses
 * the `getWebsiteHeroTemplates(t)` factory above for full bilingual copy.
 */
export const websiteHeroTemplates: WebsiteHeroTemplate[] = [
  {
    id: "florique",
    title: "Florique",
    category: "Beauty & cosmetics",
    desktopImage: "/floriquedesk.webp",
    accent: "#E11D8C",
    accentSoft: "#F9A8D4",
  },
  {
    id: "velmora",
    title: "Velmora",
    category: "Online store",
    desktopImage: "/velmoradesk.webp",
    accent: "#9A6F3B",
    accentSoft: "#E7C9A0",
  },
  {
    id: "adion",
    title: "Adion",
    category: "Modern business site",
    desktopImage: "/Adiondesk.webp",
    accent: "#D4A017",
    accentSoft: "#F7E7C2",
  },
  {
    id: "pulsecore",
    title: "PulseCore",
    category: "Site with booking",
    desktopImage: "/PulseCoredesk.webp",
    accent: "#FF4D1D",
    accentSoft: "#D7FF36",
  },
  {
    id: "aeline",
    title: "Aeline",
    category: "Professional services",
    desktopImage: "/Aelinedesk.webp",
    accent: "#3C1D6E",
    accentSoft: "#7FFFD4",
  },
  {
    id: "talentix",
    title: "Talentix",
    category: "Real estate",
    desktopImage: "/talentixdesk.webp",
    accent: "#0891B2",
    accentSoft: "#67E8F9",
  },
  {
    id: "aurayoga",
    title: "AuraYoga",
    category: "Restaurant / lifestyle",
    desktopImage: "/AuraYogadesk.webp",
    accent: "#7C3AED",
    accentSoft: "#C4B5FD",
  },
];
