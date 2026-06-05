/*
  Bizuply Website Studio — Full Website Page Templates
  Path: src/components/site-builder/studio/data/pageTemplates.ts

  תבניות אתר מלאות.
  כל תבנית בנויה מה־sectionLayoutVariants החדשים, כדי שלא תהיה כפילות.
*/

import type { PageTemplate, PageTemplateKind, StudioPageTemplate } from "../types";
import {
  sectionLayoutVariants,
  type SectionKind,
  type SectionLayoutVariant,
} from "./sectionLayoutVariants";

type PageSectionRequest = {
  kind: SectionKind;
  tags?: string[];
  index?: number;
  fallbackTitle?: string;
};

type FullPagePreset = {
  id: string;
  name: string;
  title: string;
  category: string;
  kind: PageTemplateKind;
  badge: string;
  description: string;
  preview: string;
  previewImage?: string;
  sections: PageSectionRequest[];
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    muted?: string;
  };
};

function normalize(value: string) {
  return String(value || "").trim().toLowerCase();
}

function hasTags(variant: SectionLayoutVariant, tags: string[]) {
  if (!tags.length) return true;
  const variantTags = (variant.tags || []).map(normalize);
  return tags.every((tag) => variantTags.includes(normalize(tag)));
}

function getVariantsByKind(kind: SectionKind) {
  return sectionLayoutVariants.filter((variant) => variant.kind === kind);
}

function pickVariant(request: PageSectionRequest) {
  const variants = getVariantsByKind(request.kind);
  if (!variants.length) return null;

  const tagged = request.tags?.length
    ? variants.filter((variant) => hasTags(variant, request.tags || []))
    : variants;

  const source = tagged.length ? tagged : variants;
  const index = Math.max(0, request.index || 0);
  return source[index % source.length] || source[0] || null;
}

function fallbackSection(request: PageSectionRequest) {
  const title = request.fallbackTitle || "סקשן חדש";
  return `
<section
  data-section-kind="${request.kind}"
  class="relative mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 lg:px-10"
>
  <div class="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
    <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]">
      ${request.kind}
    </p>
    <h2 class="text-4xl font-black tracking-[-0.04em] text-slate-950">
      ${title}
    </h2>
    <p class="mt-4 text-base font-bold leading-8 text-slate-500">
      לא נמצאה עדיין תבנית לסוג הזה. אפשר לערוך או להחליף מבנה בהמשך.
    </p>
  </div>
</section>
`;
}

function ensureRootKind(html: string, kind: SectionKind) {
  if (/data-section-kind=["']/.test(html)) return html;
  if (/<header\b/i.test(html)) {
    return html.replace(/<header\b/i, `<header data-section-kind="${kind}"`);
  }
  if (/<section\b/i.test(html)) {
    return html.replace(/<section\b/i, `<section data-section-kind="${kind}"`);
  }
  return fallbackSection({ kind, fallbackTitle: "סקשן" });
}

function renderSection(request: PageSectionRequest) {
  const variant = pickVariant(request);
  if (!variant) return fallbackSection(request);
  return ensureRootKind(variant.html, request.kind);
}

function renderPage(preset: FullPagePreset) {
  const primary = preset.theme?.primary || "#7C3AED";
  const secondary = preset.theme?.secondary || "#F3E8FF";
  const accent = preset.theme?.accent || "#EC4899";
  const background = preset.theme?.background || "#FFF7FD";
  const text = preset.theme?.text || "#0F172A";
  const muted = preset.theme?.muted || "#64748B";
  const html = preset.sections.map(renderSection).join("\n\n");

  return `
<main
  dir="rtl"
  class="min-h-screen overflow-x-hidden"
  style="--biz-primary:${primary};--biz-secondary:${secondary};--biz-accent:${accent};--biz-bg:${background};--biz-text:${text};--biz-muted:${muted};background:var(--biz-bg);color:var(--biz-text);font-family:Assistant,Heebo,Arial,sans-serif;"
  data-bizuply-page-template="${preset.id}"
>
  ${html}
</main>
`;
}

function firstPreviewImage(preset: FullPagePreset) {
  if (preset.previewImage) return preset.previewImage;

  for (const request of preset.sections) {
    const variant = pickVariant(request);
    const html = variant?.html || "";
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
    const bgMatch = html.match(/url\(["']?([^"')]+)["']?\)/i);
    if (bgMatch?.[1]) return bgMatch[1];
  }

  return "";
}

const fullPagePresets: FullPagePreset[] = [
  {
    id: "business-premium",
    name: "Business Premium",
    title: "עסק פרימיום מלא",
    category: "Business",
    kind: "business",
    badge: "מומלץ",
    description: "אתר עסק מלא עם הידר, דף בית, אודות, שירותים, גלריה, ביקורות, תורים, בוט חכם ויצירת קשר.",
    preview: "עסק פרימיום",
    sections: [
      { kind: "header", tags: ["premium"], index: 0 },
      { kind: "hero", tags: ["premium"], index: 0 },
      { kind: "about", index: 0 },
      { kind: "services", index: 0 },
      { kind: "gallery", index: 0 },
      { kind: "reviews", index: 0 },
      { kind: "booking", index: 0 },
      { kind: "bot", index: 0 },
      { kind: "contact", index: 0 },
      { kind: "social", index: 0 },
    ],
  },
  {
    id: "business-corporate",
    name: "Corporate Clean",
    title: "עסק נקי ומרובע",
    category: "Business",
    kind: "business",
    badge: "Corporate",
    description: "אתר עסקי נקי, מקצועי ופחות מעוגל — מתאים לעורכי דין, יועצים, משרדים, רואי חשבון ו־B2B.",
    preview: "Corporate",
    sections: [
      { kind: "header", tags: ["corporate"], index: 0 },
      { kind: "hero", tags: ["minimal"], index: 0 },
      { kind: "about", tags: ["corporate"], index: 0 },
      { kind: "services", tags: ["cards"], index: 0 },
      { kind: "clients", index: 0 },
      { kind: "reviews", tags: ["minimal"], index: 0 },
      { kind: "contact", index: 1 },
    ],
    theme: { primary: "#111827", secondary: "#F8FAFC", accent: "#64748B", background: "#F8FAFC", text: "#0F172A", muted: "#64748B" },
  },
  {
    id: "clinic-booking",
    name: "Clinic Booking",
    title: "קליניקה עם תיאום תורים",
    category: "Booking",
    kind: "booking",
    badge: "תורים",
    description: "אתר לקליניקות, יופי, טיפולים, מאמנים ונותני שירות — עם שירותים, ביקורות, תורים ווואטסאפ.",
    preview: "Clinic",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["image"], index: 0 },
      { kind: "services", index: 0 },
      { kind: "about", index: 0 },
      { kind: "booking", index: 0 },
      { kind: "reviews", tags: ["service"], index: 0 },
      { kind: "gallery", index: 0 },
      { kind: "contact", index: 0 },
    ],
    theme: { primary: "#7C3AED", secondary: "#F3E8FF", accent: "#EC4899", background: "#FFF7FD", text: "#171321", muted: "#7C8798" },
  },
  {
    id: "store-luxury",
    name: "Luxury Store",
    title: "חנות פרימיום",
    category: "Store",
    kind: "store",
    badge: "Ecommerce",
    description: "אתר חנות עם Hero, מוצרים, מבצע, ביקורות, סושיאל, מועדון לקוחות והרשמה.",
    preview: "Store",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["product"], index: 0 },
      { kind: "promotion", index: 0 },
      { kind: "store", index: 0 },
      { kind: "gallery", index: 0 },
      { kind: "reviews", tags: ["store"], index: 0 },
      { kind: "club", index: 0 },
      { kind: "subscribe", index: 0 },
      { kind: "social", tags: ["store"], index: 0 },
    ],
    theme: { primary: "#BE185D", secondary: "#FCE7F3", accent: "#F59E0B", background: "#FFF7FD", text: "#111827", muted: "#6B7280" },
  },
  {
    id: "landing-leads",
    name: "Lead Landing",
    title: "דף נחיתה ללידים",
    category: "Landing",
    kind: "landing",
    badge: "Leads",
    description: "דף נחיתה ממיר עם Hero, יתרונות, ביקורות, טופס, בוט חכם ו־CTA.",
    preview: "Landing",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["minimal"], index: 0 },
      { kind: "services", index: 1 },
      { kind: "reviews", index: 0 },
      { kind: "bot", tags: ["leads"], index: 0 },
      { kind: "form", index: 0 },
      { kind: "contact", index: 0 },
    ],
  },
  {
    id: "portfolio-gallery",
    name: "Portfolio",
    title: "פורטפוליו / גלריה",
    category: "Portfolio",
    kind: "portfolio",
    badge: "Gallery",
    description: "אתר תצוגה לעבודות, תמונות, פרויקטים, לקוחות, אודות ויצירת קשר.",
    preview: "Portfolio",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["gallery"], index: 0 },
      { kind: "about", index: 0 },
      { kind: "gallery", index: 1 },
      { kind: "clients", index: 0 },
      { kind: "testimonials", index: 0 },
      { kind: "contact", index: 0 },
    ],
    theme: { primary: "#111827", secondary: "#F8FAFC", accent: "#7C3AED", background: "#FFFFFF", text: "#0F172A", muted: "#64748B" },
  },
  {
    id: "course-digital",
    name: "Digital Course",
    title: "קורס דיגיטלי",
    category: "Course",
    kind: "course",
    badge: "Course",
    description: "אתר לקורס דיגיטלי עם Hero, סילבוס, יתרונות, מחירון, ביקורות והרשמה.",
    preview: "Course",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", index: 0 },
      { kind: "course", index: 0 },
      { kind: "services", index: 0 },
      { kind: "reviews", index: 0 },
      { kind: "form", index: 0 },
      { kind: "subscribe", index: 0 },
    ],
    theme: { primary: "#2563EB", secondary: "#DBEAFE", accent: "#F59E0B", background: "#F8FAFC", text: "#0F172A", muted: "#64748B" },
  },
  {
    id: "mini-saas",
    name: "Mini SaaS",
    title: "Mini SaaS לעסק",
    category: "SaaS",
    kind: "miniSaas",
    badge: "SaaS",
    description: "אתר למערכת קטנה: הצגת מוצר, פיצ׳רים, בוט, הרשמה, תשלום ודמו.",
    preview: "Mini SaaS",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["saas"], index: 0 },
      { kind: "miniSaas", index: 0 },
      { kind: "bot", tags: ["saas"], index: 0 },
      { kind: "clients", index: 0 },
      { kind: "reviews", tags: ["saas"], index: 0 },
      { kind: "contact", index: 0 },
    ],
    theme: { primary: "#4F46E5", secondary: "#EEF2FF", accent: "#06B6D4", background: "#F8FAFC", text: "#0F172A", muted: "#64748B" },
  },
  {
    id: "restaurant-events",
    name: "Restaurant / Events",
    title: "מסעדה / אירועים",
    category: "Events",
    kind: "business",
    badge: "Events",
    description: "אתר למסעדה, אולם, אירועים או סדנאות — עם גלריה, הזמנות, אירועים ויצירת קשר.",
    preview: "Events",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["background"], index: 0 },
      { kind: "about", index: 0 },
      { kind: "events", index: 0 },
      { kind: "gallery", index: 0 },
      { kind: "reviews", index: 0 },
      { kind: "booking", index: 0 },
      { kind: "contact", index: 0 },
    ],
    theme: { primary: "#92400E", secondary: "#FEF3C7", accent: "#EA580C", background: "#FFFBEB", text: "#1F2937", muted: "#78716C" },
  },
  {
    id: "blank-professional",
    name: "Blank Professional",
    title: "אתר ריק מקצועי",
    category: "Blank",
    kind: "blank",
    badge: "Blank",
    description: "בסיס נקי להתחלה מהירה — Header, Hero ריק, Basic ויצירת קשר.",
    preview: "Blank",
    sections: [
      { kind: "header", index: 0 },
      { kind: "hero", tags: ["minimal"], index: 0 },
      { kind: "basic", index: 0 },
      { kind: "contact", index: 0 },
    ],
  },
];

export const pageTemplates: PageTemplate[] = fullPagePresets.map((preset) => ({
  id: preset.id,
  name: preset.name,
  category: preset.category,
  description: preset.description,
  preview: firstPreviewImage(preset) || preset.preview,
  html: renderPage(preset),
}));

export const studioPageTemplates: StudioPageTemplate[] = fullPagePresets.map((preset) => ({
  id: preset.id,
  title: preset.title,
  description: preset.description,
  badge: preset.badge,
  kind: preset.kind,
  previewImage: firstPreviewImage(preset),
  html: renderPage(preset),
}));

export function getPageTemplateById(id: string) {
  return pageTemplates.find((template) => template.id === id) || null;
}

export function getStudioPageTemplateById(id: string) {
  return studioPageTemplates.find((template) => template.id === id) || null;
}

export function getPageTemplatesByCategory(category: string) {
  return pageTemplates.filter((template) => template.category === category);
}

export function getStudioPageTemplatesByKind(kind: PageTemplateKind) {
  return studioPageTemplates.filter((template) => template.kind === kind);
}
