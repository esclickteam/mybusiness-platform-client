export type WebsiteHeroTemplate = {
  id: string;
  title: string;
  category: string;
  desktopImage: string;
  accent: string;
};

/**
 * Desktop template screenshots for the website-builder marketing hero.
 * Place PNG files in /public with these exact filenames.
 */
export const websiteHeroTemplates: WebsiteHeroTemplate[] = [
  {
    id: "florique",
    title: "Florique",
    category: "ביוטי וקוסמטיקה",
    desktopImage: "/floriquedesk.png",
    accent: "#c084fc",
  },
  {
    id: "velmora",
    title: "Velmora",
    category: "חנות אונליין",
    desktopImage: "/velmoradesk.png",
    accent: "#818cf8",
  },
  {
    id: "lunelle",
    title: "Lunelle",
    category: "אתר שירותים",
    desktopImage: "/lunelledesk.png",
    accent: "#38bdf8",
  },
  {
    id: "adion",
    title: "Adion",
    category: "אתר עסקי מודרני",
    desktopImage: "/Adiondesk.png",
    accent: "#6366f1",
  },
  {
    id: "pulsecore",
    title: "PulseCore",
    category: "אתר עם תורים",
    desktopImage: "/PulseCoredesk.png",
    accent: "#a78bfa",
  },
  {
    id: "aeline",
    title: "Aeline",
    category: "שירותים מקצועיים",
    desktopImage: "/Aelinedesk.png",
    accent: "#22d3ee",
  },
  {
    id: "talentix",
    title: "Talentix",
    category: "נדל״ן",
    desktopImage: "/talentixdesk.png",
    accent: "#60a5fa",
  },
  {
    id: "aurayoga",
    title: "AuraYoga",
    category: "מסעדה / לייפסטייל",
    desktopImage: "/AuraYogadesk.png",
    accent: "#7dd3fc",
  },
];
