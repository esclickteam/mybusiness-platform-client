import {
  PATTERN_MAP,
  type Geometry,
  type PageContent,
  type PatternName,
  type ShowcaseTheme,
} from "./pageShowcaseBlocks";
import type { VisualLibraryNodeTemplate } from "./visualLibraryTypes";

export type ShowcaseCategoryKey =
  | "hero"
  | "services"
  | "gallery"
  | "contact"
  | "commerce"
  | "pricing"
  | "blog"
  | "events"
  | "testimonials"
  | "team"
  | "faq"
  | "promote"
  | "resume";

export type RecipeMeta = {
  backgroundColor: string;
  minHeight: string;
  pattern: PatternName;
  label: string;
};

type RecipeDef = {
  pattern: PatternName;
  label: string;
  backgroundColor: string;
  minHeight: string;
  theme: ShowcaseTheme;
  geometry: Geometry;
};

const CAT_INDEX: Record<ShowcaseCategoryKey, number> = {
  hero: 0,
  services: 1,
  gallery: 2,
  contact: 3,
  commerce: 4,
  pricing: 5,
  blog: 6,
  events: 7,
  testimonials: 8,
  team: 9,
  faq: 10,
  promote: 11,
  resume: 12,
};

function theme(
  ink: string,
  accent: string,
  muted: string,
  surface: string,
  surfaceAlt: string,
  soft: string,
  radius = "16px",
  sharpRadius = "8px",
  titleSize = "58px",
  titleWeight = "800",
  letterSpacing = "-0.05em",
): ShowcaseTheme {
  return {
    ink,
    accent,
    muted,
    surface,
    surfaceAlt,
    soft,
    radius,
    sharpRadius,
    titleSize,
    titleWeight,
    letterSpacing,
  };
}

function geo(cat: ShowcaseCategoryKey, slot: number): Geometry {
  const c = CAT_INDEX[cat];
  return {
    ox: (c * 13 + slot * 5) % 48,
    oy: (c * 9 + slot * 7) % 36,
    gap: 16 + ((c + slot) % 4) * 4,
    cardW: 300 + ((c * 3 + slot) % 5) * 4,
    cardH: 220 + ((c + slot * 2) % 4) * 8,
  };
}

/** Each category gets 10 distinct patterns — no shared pattern at the same slot across categories. */
const CATEGORY_PATTERNS: Record<ShowcaseCategoryKey, PatternName[]> = {
  hero: [
    "featureMosaic",
    "boldStatement",
    "darkStats",
    "lifestyle",
    "formPanel",
    "carouselRail",
    "catalogShelf",
    "cinematic",
    "listMedia",
    "splitHero",
  ],
  services: [
    "packageTiers",
    "timeline",
    "comparisonMatrix",
    "colorCards",
    "caseStudy",
    "centerEditorial",
    "carouselRail",
    "magazine",
    "listMedia",
    "formPanel",
  ],
  gallery: [
    "masonry",
    "filmstrip",
    "caseStudy",
    "magazine",
    "listMedia",
    "cinematic",
    "lifestyle",
    "colorCards",
    "carouselRail",
    "contactDesk",
  ],
  contact: [
    "contactDesk",
    "splitHero",
    "portraitGrid",
    "formPanel",
    "colorCards",
    "cinematic",
    "lifestyle",
    "listMedia",
    "featureMosaic",
    "agendaRows",
  ],
  commerce: [
    "catalogShelf",
    "caseStudy",
    "masonry",
    "comparisonMatrix",
    "cinematic",
    "lifestyle",
    "packageTiers",
    "carouselRail",
    "filmstrip",
    "ticketHero",
  ],
  pricing: [
    "packageTiers",
    "comparisonMatrix",
    "featureMosaic",
    "cinematic",
    "lifestyle",
    "listMedia",
    "accordion",
    "boldStatement",
    "darkStats",
    "quoteWall",
  ],
  blog: [
    "listMedia",
    "caseStudy",
    "magazine",
    "colorCards",
    "portraitGrid",
    "cinematic",
    "lifestyle",
    "timeline",
    "catalogShelf",
    "accordion",
  ],
  events: [
    "ticketHero",
    "agendaRows",
    "caseStudy",
    "colorCards",
    "portraitGrid",
    "cinematic",
    "lifestyle",
    "darkStats",
    "timeline",
    "formPanel",
  ],
  testimonials: [
    "quoteWall",
    "caseStudy",
    "carouselRail",
    "magazine",
    "darkStats",
    "cinematic",
    "lifestyle",
    "timeline",
    "filmstrip",
    "formPanel",
  ],
  team: [
    "portraitGrid",
    "splitHero",
    "masonry",
    "colorCards",
    "cinematic",
    "lifestyle",
    "boldStatement",
    "listMedia",
    "darkStats",
    "formPanel",
  ],
  faq: [
    "accordion",
    "listMedia",
    "colorCards",
    "cinematic",
    "lifestyle",
    "timeline",
    "contactDesk",
    "featureMosaic",
    "magazine",
    "formPanel",
  ],
  promote: [
    "boldStatement",
    "featureMosaic",
    "ticketHero",
    "listMedia",
    "cinematic",
    "lifestyle",
    "caseStudy",
    "colorCards",
    "comparisonMatrix",
    "formPanel",
  ],
  resume: [
    "cvColumns",
    "timeline",
    "colorCards",
    "caseStudy",
    "cinematic",
    "lifestyle",
    "listMedia",
    "darkStats",
    "splitHero",
    "formPanel",
  ],
};

const CATEGORY_THEMES: Record<ShowcaseCategoryKey, ShowcaseTheme[]> = {
  hero: [
    theme("#0f172a", "#2563eb", "#64748b", "#fff", "#e2e8f0", "#dbeafe", "12px", "6px", "56px"),
    theme("#1c1917", "#c2410c", "#78716c", "#fff7ed", "#ffedd5", "#fed7aa", "24px", "12px", "62px", "700"),
    theme("#09090b", "#f59e0b", "#a1a1aa", "#18181b", "#27272a", "#422006", "8px", "0px", "60px", "900"),
    theme("#831843", "#db2777", "#9d174d", "#fdf2f8", "#fce7f3", "#fbcfe8", "40px", "24px", "54px", "700"),
    theme("#7c2d12", "#ea580c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "20px", "10px", "52px"),
    theme("#1e3a8a", "#38bdf8", "#64748b", "#eff6ff", "#dbeafe", "#bae6fd", "18px", "8px", "50px"),
    theme("#14532d", "#16a34a", "#4d7c0f", "#f0fdf4", "#dcfce7", "#bbf7d0", "16px", "8px", "52px"),
    theme("#111827", "#d4af37", "#9ca3af", "#030712", "#1f2937", "#78350f", "4px", "0px", "58px", "800"),
    theme("#064e3b", "#10b981", "#6b7280", "#ecfdf5", "#d1fae5", "#a7f3d0", "14px", "6px", "50px"),
    theme("#9a3412", "#f97316", "#78716c", "#fff7ed", "#ffedd5", "#fed7aa", "22px", "10px", "54px"),
  ],
  services: [
    theme("#0b1f3a", "#2563eb", "#475569", "#fff", "#f1f5f9", "#dbeafe", "10px", "0px", "54px"),
    theme("#312e81", "#7c3aed", "#6b7280", "#f5f3ff", "#ede9fe", "#ddd6fe", "18px", "8px", "52px"),
    theme("#0f172a", "#0ea5e9", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "8px", "4px", "50px"),
    theme("#1e293b", "#f43f5e", "#64748b", "#fff1f2", "#ffe4e6", "#fecdd3", "20px", "10px", "52px"),
    theme("#111827", "#22d3ee", "#9ca3af", "#0f172a", "#1e293b", "#164e63", "12px", "4px", "56px"),
    theme("#292524", "#b45309", "#78716c", "#fafaf9", "#f5f5f4", "#fde68a", "28px", "14px", "54px", "700"),
    theme("#1e1b4b", "#818cf8", "#6b7280", "#eef2ff", "#e0e7ff", "#c7d2fe", "16px", "8px", "50px"),
    theme("#18181b", "#a3a3a3", "#737373", "#fafafa", "#f4f4f5", "#e4e4e7", "0px", "0px", "56px", "900"),
    theme("#14532d", "#84cc16", "#4d7c0f", "#f7fee7", "#ecfccb", "#d9f99d", "14px", "6px", "50px"),
    theme("#9a3412", "#fb923c", "#78716c", "#fff7ed", "#ffedd5", "#fdba74", "18px", "8px", "52px"),
  ],
  gallery: [
    theme("#111111", "#ffffff", "#737373", "#fafafa", "#e5e5e5", "#d4d4d4", "4px", "0px", "46px", "900"),
    theme("#1c1917", "#a8a29e", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "0px", "0px", "48px", "800"),
    theme("#0c4a6e", "#38bdf8", "#64748b", "#f0f9ff", "#e0f2fe", "#bae6fd", "12px", "4px", "50px"),
    theme("#3b0764", "#e879f9", "#6b7280", "#fdf4ff", "#fae8ff", "#f5d0fe", "20px", "8px", "48px"),
    theme("#365314", "#a3e635", "#4d7c0f", "#f7fee7", "#ecfccb", "#d9f99d", "10px", "4px", "48px"),
    theme("#09090b", "#fafafa", "#a1a1aa", "#18181b", "#27272a", "#3f3f46", "0px", "0px", "52px", "900"),
    theme("#4c0519", "#fb7185", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "32px", "20px", "50px", "700"),
    theme("#172554", "#60a5fa", "#64748b", "#eff6ff", "#dbeafe", "#bfdbfe", "16px", "8px", "48px"),
    theme("#1f2937", "#fbbf24", "#9ca3af", "#111827", "#1f2937", "#78350f", "8px", "0px", "50px"),
    theme("#7c2d12", "#fdba74", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "18px", "8px", "48px"),
  ],
  contact: [
    theme("#0f766e", "#14b8a6", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "16px", "8px", "50px"),
    theme("#1e3a8a", "#3b82f6", "#64748b", "#eff6ff", "#dbeafe", "#bfdbfe", "12px", "6px", "52px"),
    theme("#44403c", "#d6d3d1", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "20px", "10px", "50px"),
    theme("#9a3412", "#f97316", "#78716c", "#fff7ed", "#ffedd5", "#fed7aa", "18px", "8px", "52px"),
    theme("#4c1d95", "#a78bfa", "#6b7280", "#f5f3ff", "#ede9fe", "#ddd6fe", "16px", "8px", "50px"),
    theme("#09090b", "#22d3ee", "#a1a1aa", "#18181b", "#27272a", "#164e63", "8px", "0px", "52px"),
    theme("#9f1239", "#fb7185", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "28px", "16px", "50px", "700"),
    theme("#14532d", "#4ade80", "#4d7c0f", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "50px"),
    theme("#0c4a6e", "#7dd3fc", "#0369a1", "#f0f9ff", "#e0f2fe", "#bae6fd", "16px", "8px", "50px"),
    theme("#c2410c", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "20px", "10px", "52px"),
  ],
  commerce: [
    theme("#18181b", "#f43f5e", "#71717a", "#fafafa", "#f4f4f5", "#ffe4e6", "14px", "6px", "48px"),
    theme("#0f172a", "#38bdf8", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "12px", "4px", "50px"),
    theme("#3f1d0f", "#f59e0b", "#78716c", "#fffbeb", "#fef3c7", "#fde68a", "18px", "8px", "48px"),
    theme("#1e1b4b", "#818cf8", "#6b7280", "#eef2ff", "#e0e7ff", "#c7d2fe", "10px", "4px", "50px"),
    theme("#09090b", "#eab308", "#a1a1aa", "#18181b", "#27272a", "#713f12", "4px", "0px", "52px"),
    theme("#831843", "#f9a8d4", "#9d174d", "#fdf2f8", "#fce7f3", "#fbcfe8", "28px", "16px", "48px", "700"),
    theme("#134e4a", "#2dd4bf", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "16px", "8px", "48px"),
    theme("#7f1d1d", "#fb7185", "#991b1b", "#fef2f2", "#fee2e2", "#fecaca", "14px", "6px", "48px"),
    theme("#172554", "#93c5fd", "#1e3a8a", "#eff6ff", "#dbeafe", "#bfdbfe", "12px", "4px", "48px"),
    theme("#9a3412", "#fdba74", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "18px", "8px", "50px"),
  ],
  pricing: [
    theme("#0b1220", "#22c55e", "#64748b", "#f8fafc", "#e2e8f0", "#bbf7d0", "16px", "8px", "50px"),
    theme("#1e293b", "#38bdf8", "#64748b", "#f1f5f9", "#e2e8f0", "#bae6fd", "14px", "6px", "50px"),
    theme("#111827", "#a78bfa", "#9ca3af", "#f9fafb", "#f3f4f6", "#ddd6fe", "12px", "4px", "50px"),
    theme("#09090b", "#fbbf24", "#a1a1aa", "#18181b", "#27272a", "#78350f", "8px", "0px", "54px"),
    theme("#4c0519", "#fb7185", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "24px", "12px", "50px", "700"),
    theme("#14532d", "#86efac", "#166534", "#f0fdf4", "#dcfce7", "#bbf7d0", "16px", "8px", "50px"),
    theme("#1e3a8a", "#60a5fa", "#64748b", "#eff6ff", "#dbeafe", "#bfdbfe", "14px", "6px", "50px"),
    theme("#18181b", "#fafafa", "#737373", "#fafafa", "#f4f4f5", "#e4e4e7", "0px", "0px", "56px", "900"),
    theme("#0f766e", "#5eead4", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "16px", "8px", "50px"),
    theme("#c2410c", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "18px", "8px", "52px"),
  ],
  blog: [
    theme("#1c1917", "#b45309", "#78716c", "#fafaf9", "#f5f5f4", "#fde68a", "12px", "4px", "50px", "700"),
    theme("#0f172a", "#0ea5e9", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "14px", "6px", "50px"),
    theme("#18181b", "#fafafa", "#737373", "#fafafa", "#e5e5e5", "#d4d4d4", "0px", "0px", "52px", "900"),
    theme("#312e81", "#c4b5fd", "#6b7280", "#f5f3ff", "#ede9fe", "#ddd6fe", "18px", "8px", "48px"),
    theme("#44403c", "#a8a29e", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "20px", "10px", "50px"),
    theme("#09090b", "#f59e0b", "#a1a1aa", "#18181b", "#27272a", "#78350f", "6px", "0px", "52px"),
    theme("#9f1239", "#fda4af", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "28px", "16px", "48px", "700"),
    theme("#4c1d95", "#a78bfa", "#6b7280", "#f5f3ff", "#ede9fe", "#ddd6fe", "14px", "6px", "48px"),
    theme("#14532d", "#86efac", "#166534", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "48px"),
    theme("#ea580c", "#fdba74", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "18px", "8px", "50px"),
  ],
  events: [
    theme("#4c1d95", "#f472b6", "#6b7280", "#fdf4ff", "#fae8ff", "#f5d0fe", "18px", "8px", "50px"),
    theme("#0f172a", "#38bdf8", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "14px", "6px", "50px"),
    theme("#7c2d12", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "16px", "8px", "50px"),
    theme("#164e63", "#22d3ee", "#0e7490", "#ecfeff", "#cffafe", "#a5f3fc", "14px", "6px", "48px"),
    theme("#1e1b4b", "#818cf8", "#6b7280", "#eef2ff", "#e0e7ff", "#c7d2fe", "16px", "8px", "48px"),
    theme("#09090b", "#fbbf24", "#a1a1aa", "#18181b", "#27272a", "#78350f", "8px", "0px", "54px"),
    theme("#831843", "#f9a8d4", "#9d174d", "#fdf2f8", "#fce7f3", "#fbcfe8", "28px", "16px", "50px", "700"),
    theme("#111827", "#34d399", "#9ca3af", "#0f172a", "#1f2937", "#064e3b", "12px", "4px", "50px"),
    theme("#312e81", "#c4b5fd", "#6b7280", "#f5f3ff", "#ede9fe", "#ddd6fe", "14px", "6px", "48px"),
    theme("#c2410c", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "18px", "8px", "50px"),
  ],
  testimonials: [
    theme("#1e3a8a", "#60a5fa", "#64748b", "#eff6ff", "#dbeafe", "#bfdbfe", "20px", "10px", "48px"),
    theme("#292524", "#d6d3d1", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "24px", "12px", "50px", "700"),
    theme("#4c1d95", "#e879f9", "#6b7280", "#fdf4ff", "#fae8ff", "#f5d0fe", "18px", "8px", "48px"),
    theme("#0f766e", "#5eead4", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "16px", "8px", "48px"),
    theme("#111827", "#fbbf24", "#9ca3af", "#0f172a", "#1f2937", "#78350f", "10px", "0px", "52px"),
    theme("#09090b", "#fafafa", "#a1a1aa", "#18181b", "#27272a", "#3f3f46", "4px", "0px", "52px", "900"),
    theme("#9f1239", "#fb7185", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "28px", "16px", "48px", "700"),
    theme("#14532d", "#86efac", "#166534", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "48px"),
    theme("#1c1917", "#f59e0b", "#78716c", "#fffbeb", "#fef3c7", "#fde68a", "16px", "8px", "48px"),
    theme("#ea580c", "#fdba74", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "18px", "8px", "50px"),
  ],
  team: [
    theme("#0f172a", "#38bdf8", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "16px", "8px", "50px"),
    theme("#1c1917", "#a8a29e", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "20px", "10px", "50px", "700"),
    theme("#3b0764", "#d8b4fe", "#6b7280", "#faf5ff", "#f3e8ff", "#e9d5ff", "18px", "8px", "48px"),
    theme("#134e4a", "#2dd4bf", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "14px", "6px", "48px"),
    theme("#09090b", "#fbbf24", "#a1a1aa", "#18181b", "#27272a", "#78350f", "6px", "0px", "52px"),
    theme("#831843", "#f9a8d4", "#9d174d", "#fdf2f8", "#fce7f3", "#fbcfe8", "28px", "16px", "48px", "700"),
    theme("#7c2d12", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "16px", "8px", "50px"),
    theme("#14532d", "#86efac", "#166534", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "48px"),
    theme("#111827", "#34d399", "#9ca3af", "#0f172a", "#1f2937", "#064e3b", "12px", "4px", "50px"),
    theme("#c2410c", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "18px", "8px", "50px"),
  ],
  faq: [
    theme("#1e293b", "#38bdf8", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "14px", "6px", "50px"),
    theme("#292524", "#a8a29e", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "16px", "8px", "50px"),
    theme("#4c1d95", "#c4b5fd", "#6b7280", "#f5f3ff", "#ede9fe", "#ddd6fe", "16px", "8px", "48px"),
    theme("#09090b", "#22d3ee", "#a1a1aa", "#18181b", "#27272a", "#164e63", "8px", "0px", "52px"),
    theme("#9f1239", "#fb7185", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "24px", "12px", "48px", "700"),
    theme("#14532d", "#86efac", "#166534", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "48px"),
    theme("#0f766e", "#5eead4", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "16px", "8px", "48px"),
    theme("#1e3a8a", "#60a5fa", "#64748b", "#eff6ff", "#dbeafe", "#bfdbfe", "14px", "6px", "48px"),
    theme("#18181b", "#fafafa", "#737373", "#fafafa", "#f4f4f5", "#e4e4e7", "0px", "0px", "52px", "900"),
    theme("#ea580c", "#fdba74", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "18px", "8px", "50px"),
  ],
  promote: [
    theme("#7c2d12", "#f97316", "#9a3412", "#fff7ed", "#ffedd5", "#fed7aa", "16px", "8px", "56px", "900"),
    theme("#0f172a", "#22c55e", "#64748b", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "52px"),
    theme("#4c1d95", "#f472b6", "#6b7280", "#fdf4ff", "#fae8ff", "#f5d0fe", "18px", "8px", "52px"),
    theme("#14532d", "#84cc16", "#4d7c0f", "#f7fee7", "#ecfccb", "#d9f99d", "14px", "6px", "50px"),
    theme("#09090b", "#fbbf24", "#a1a1aa", "#18181b", "#27272a", "#78350f", "6px", "0px", "56px", "900"),
    theme("#831843", "#f9a8d4", "#9d174d", "#fdf2f8", "#fce7f3", "#fbcfe8", "28px", "16px", "50px", "700"),
    theme("#0c4a6e", "#38bdf8", "#0369a1", "#f0f9ff", "#e0f2fe", "#bae6fd", "14px", "6px", "50px"),
    theme("#1e1b4b", "#a78bfa", "#6b7280", "#eef2ff", "#e0e7ff", "#c7d2fe", "16px", "8px", "50px"),
    theme("#111827", "#34d399", "#9ca3af", "#0f172a", "#1f2937", "#064e3b", "12px", "4px", "50px"),
    theme("#c2410c", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "18px", "8px", "52px"),
  ],
  resume: [
    theme("#0f172a", "#38bdf8", "#64748b", "#f8fafc", "#e2e8f0", "#bae6fd", "10px", "4px", "48px"),
    theme("#312e81", "#818cf8", "#6b7280", "#eef2ff", "#e0e7ff", "#c7d2fe", "14px", "6px", "48px"),
    theme("#134e4a", "#2dd4bf", "#0f766e", "#f0fdfa", "#ccfbf1", "#99f6e4", "14px", "6px", "48px"),
    theme("#1c1917", "#d6d3d1", "#78716c", "#fafaf9", "#f5f5f4", "#e7e5e4", "12px", "4px", "50px"),
    theme("#09090b", "#fbbf24", "#a1a1aa", "#18181b", "#27272a", "#78350f", "6px", "0px", "52px"),
    theme("#9f1239", "#fb7185", "#9f1239", "#fff1f2", "#ffe4e6", "#fecdd3", "24px", "12px", "48px", "700"),
    theme("#14532d", "#86efac", "#166534", "#f0fdf4", "#dcfce7", "#bbf7d0", "14px", "6px", "48px"),
    theme("#111827", "#22d3ee", "#9ca3af", "#0f172a", "#1f2937", "#164e63", "12px", "4px", "50px"),
    theme("#1e3a8a", "#60a5fa", "#64748b", "#eff6ff", "#dbeafe", "#bfdbfe", "14px", "6px", "50px"),
    theme("#c2410c", "#fb923c", "#9a3412", "#fff7ed", "#ffedd5", "#fdba74", "18px", "8px", "50px"),
  ],
};

const RECIPE_LABELS: Record<ShowcaseCategoryKey, string[]> = {
  hero: ["פסיפס פיצ׳רים", "סטייטמנט גדול", "מדדים כהים", "לייפסטייל", "טופס המרה", "קרוסלה", "מדף מוצרים", "סינמטי", "רשימה+מדיה", "מפוצל"],
  services: ["חבילות", "תהליך", "השוואה", "יכולות", "קייס סטדי", "Editorial", "קרוסלה", "מגזין", "תפריט", "ייעוץ"],
  gallery: ["מייסון", "פילמסטריפ", "קייס", "קולאז׳", "ארכיון", "תערוכה כהה", "סטודיו רך", "רשת צבעונית", "קרוסלה", "פנייה"],
  contact: ["דלפק", "מפוצל", "צוות", "טופס ראשון", "ערוצים", "פרימיום", "קבלת פנים", "רשימה", "פסיפס", "שעות פעילות"],
  commerce: ["קטלוג", "מוצר מוביל", "קולקציה", "מפרט", "מרצ׳ כהה", "בוטיק", "השוואה", "בסטסלרים", "לוקבּוק", "הזמנה"],
  pricing: ["3 מסלולים", "מטריצה", "ערך", "פרימיום", "סטארטר", "סטאק", "FAQ+מחיר", "סטייטמנט", "מדדים", "הצעת מחיר"],
  blog: ["רשימת מאמרים", "כתבה מובילה", "מגזין", "נושאים", "כותב", "קריאה כהה", "ניוזלטר", "סדרה", "ארכיון", "הרשמה"],
  events: ["כרטיס", "אג׳נדה", "מקום", "לוח", "דוברים", "לילה", "סדנה", "ספירה", "לו״ז", "RSVP"],
  testimonials: ["קיר ציטוטים", "המלצה מובילה", "קרוסלה", "לוגו+ציטוט", "דירוגים", "כהה", "מילים חמות", "לפני/אחרי", "פילמסטריפ", "טופס ביקורת"],
  team: ["פורטרטים", "הנהלה", "פסיפס", "תפקידים", "סטודיו כהה", "אנשים", "גיוס", "כישורים", "תרבות", "הצטרפות"],
  faq: ["אקורדיון", "חיפוש", "נושאים", "עזרה כהה", "תמיכה רכה", "שלבים", "קשר+FAQ", "פסיפס", "מדריך", "שאלה"],
  promote: ["CTA יחיד", "הוכחה חברתית", "הצעה", "יתרונות", "השקה כהה", "ווייטליסט", "דמו", "פסיפס", "השוואה", "ליד"],
  resume: ["עמודות CV", "ציר קריירה", "כישורים", "פרויקטים", "פורטפוליו כהה", "אישי", "השכלה", "הישגים", "מפוצל", "גיוס"],
};

function buildRecipe(cat: ShowcaseCategoryKey, index: number): RecipeDef {
  const pattern = CATEGORY_PATTERNS[cat][index];
  const t = CATEGORY_THEMES[cat][index];
  return {
    pattern,
    label: RECIPE_LABELS[cat][index],
    backgroundColor: t.surface,
    minHeight: "1500px",
    theme: t,
    geometry: geo(cat, index),
  };
}

const RECIPE_CACHE = new Map<string, RecipeDef>();

function getRecipe(category: ShowcaseCategoryKey, index: number): RecipeDef {
  const key = `${category}:${index}`;
  let recipe = RECIPE_CACHE.get(key);
  if (!recipe) {
    recipe = buildRecipe(category, index);
    RECIPE_CACHE.set(key, recipe);
  }
  return recipe;
}

export function getRecipeMeta(
  category: ShowcaseCategoryKey,
  index: number,
): RecipeMeta {
  const r = getRecipe(category, index);
  return {
    backgroundColor: r.backgroundColor,
    minHeight: r.minHeight,
    pattern: r.pattern,
    label: r.label,
  };
}

export function buildCategoryPageNodes(
  category: ShowcaseCategoryKey,
  index: number,
  content: PageContent,
): VisualLibraryNodeTemplate[] {
  const recipe = getRecipe(category, index);
  const fn = PATTERN_MAP[recipe.pattern];
  return fn(content, recipe.theme, recipe.geometry);
}

/** Structural fingerprint for uniqueness checks (coords quantized). */
export function fingerprintNodes(nodes: VisualLibraryNodeTemplate[]): string {
  return nodes
    .map((n) => {
      const x = Math.round(Number(n.layout?.x ?? n.layout?.translateX ?? 0) / 20);
      const y = Math.round(Number(n.layout?.y ?? n.layout?.translateY ?? 0) / 20);
      const w = String(n.layout?.width ?? "");
      return `${n.type}:${x}:${y}:${w}`;
    })
    .join("|");
}

export function assertCrossCategoryUniqueness(): {
  ok: boolean;
  collisions: string[];
} {
  const dummy: PageContent = {
    eyebrow: "E",
    title: "T\nT",
    subtitle: "S",
    cta: "C",
    image: "https://example.com/x.jpg",
    items: [
      { title: "A", copy: "a", meta: "01" },
      { title: "B", copy: "b", meta: "02" },
      { title: "C", copy: "c", meta: "03" },
      { title: "D", copy: "d", meta: "04" },
      { title: "E", copy: "e", meta: "05" },
      { title: "F", copy: "f", meta: "06" },
    ],
    stats: [
      { value: "1", label: "l" },
      { value: "2", label: "l" },
      { value: "3", label: "l" },
      { value: "4", label: "l" },
    ],
  };
  const seen = new Map<string, string>();
  const collisions: string[] = [];
  for (const cat of Object.keys(CATEGORY_PATTERNS) as ShowcaseCategoryKey[]) {
    for (let i = 0; i < 10; i++) {
      const fp = fingerprintNodes(buildCategoryPageNodes(cat, i, dummy));
      const id = `${cat}-${i}-${CATEGORY_PATTERNS[cat][i]}`;
      const prev = seen.get(fp);
      if (prev) collisions.push(`${prev} == ${id}`);
      else seen.set(fp, id);
    }
  }
  return { ok: collisions.length === 0, collisions };
}
