import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";

export const pulsecoreImages = {
  hero:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=90",
  trainer:
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=90",
  workout:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=90",
  boxing:
    "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=90",
  gym:
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=90",
};

export const pulsecorePalette = {
  primary: "#101010",
  secondary: "#FF4D1D",
  accent: "#D7FF36",
  background: "#080808",
  surface: "#171717",
  text: "#FFFFFF",
  muted: "#A3A3A3",
  dark: "#000000",
};

export const pulsecoreSeed: ReadyWebsiteTemplateSeed = {
  id: "pulsecore",
  name: "PulseCore",
  category: "fitness",
  niche: "סטודיו כושר",
  layout: "high-energy-fitness-studio",
  description:
    "תבנית פיטנס אנרגטית למאמנים, סטודיו כושר, חדרי כושר ותוכניות אימון.",
  heroTitle: "אימונים שמדליקים תוצאות",
  heroSubtitle:
    "תבנית פיטנס מודרנית עם חוויית משתמש חזקה, תוכניות אימון, מאמנים, מחירים וטופס הצטרפות.",
  image: pulsecoreImages.hero,
  palette: pulsecorePalette,
  blocks: [],
};