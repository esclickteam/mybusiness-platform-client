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
export const websiteHeroTemplates: WebsiteHeroTemplate[] = [
  {
    id: "florique",
    title: "Florique",
    category: "ביוטי וקוסמטיקה",
    desktopImage: "/floriquedesk.png",
    accent: "#E11D8C",
    accentSoft: "#F9A8D4",
  },
  {
    id: "velmora",
    title: "Velmora",
    category: "חנות אונליין",
    desktopImage: "/velmoradesk.png",
    accent: "#9A6F3B",
    accentSoft: "#E7C9A0",
  },
  {
    id: "lunelle",
    title: "Lunelle",
    category: "אתר שירותים",
    desktopImage: "/lunelledesk.png",
    accent: "#2A171C",
    accentSoft: "#E8B8C1",
  },
  {
    id: "adion",
    title: "Adion",
    category: "אתר עסקי מודרני",
    desktopImage: "/Adiondesk.png",
    accent: "#D4A017",
    accentSoft: "#F7E7C2",
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
    accentSoft: "#67E8F9",
  },
  {
    id: "aurayoga",
    title: "AuraYoga",
    category: "מסעדה / לייפסטייל",
    desktopImage: "/AuraYogadesk.png",
    accent: "#7C3AED",
    accentSoft: "#C4B5FD",
  },
];
