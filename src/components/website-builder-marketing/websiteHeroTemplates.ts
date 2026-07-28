export type WebsiteHeroTemplate = {
  id: string;
  title: string;
  category: string;
  desktopImage: string;
  /** Primary brand glow behind the mockup */
  accent: string;
  /** Softer companion tone for the glow gradient */
  accentSoft: string;
};

/**
 * Desktop template screenshots for the website-builder marketing hero.
 * Filenames are `{TemplateName}desk.png` — accents match each template's brand palette.
 */
export const websiteHeroTemplates: WebsiteHeroTemplate[] = [
  {
    id: "florique",
    title: "Florique",
    category: "ביוטי וקוסמטיקה",
    desktopImage: "/floriquedesk.png",
    accent: "#E11D8C",
    accentSoft: "#F472B6",
  },
  {
    id: "velmora",
    title: "Velmora",
    category: "חנות אונליין",
    desktopImage: "/velmoradesk.png",
    accent: "#9A6F3B",
    accentSoft: "#D4B483",
  },
  {
    id: "lunelle",
    title: "Lunelle",
    category: "אתר שירותים",
    desktopImage: "/lunelledesk.png",
    accent: "#C98B96",
    accentSoft: "#E8B8C1",
  },
  {
    id: "adion",
    title: "Adion",
    category: "אתר עסקי מודרני",
    desktopImage: "/Adiondesk.png",
    accent: "#F7C873",
    accentSoft: "#F6EFE3",
  },
  {
    id: "pulsecore",
    title: "PulseCore",
    category: "אתר עם תורים",
    desktopImage: "/PulseCoredesk.png",
    accent: "#FF4D1D",
    accentSoft: "#D7FF36",
  },
  {
    id: "aeline",
    title: "Aeline",
    category: "שירותים מקצועיים",
    desktopImage: "/Aelinedesk.png",
    accent: "#3C1D6E",
    accentSoft: "#7FFFD4",
  },
  {
    id: "talentix",
    title: "Talentix",
    category: "נדל״ן",
    desktopImage: "/talentixdesk.png",
    accent: "#0891B2",
    accentSoft: "#22D3EE",
  },
  {
    id: "aurayoga",
    title: "AuraYoga",
    category: "מסעדה / לייפסטייל",
    desktopImage: "/AuraYogadesk.png",
    accent: "#A78BFA",
    accentSoft: "#C4B5FD",
  },
];
