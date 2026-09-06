/*
  Bizuply Website Studio — Section Templates
  Path: src/components/site-builder/studio/data/sectionTemplates.ts

  מקור אחד לכל הסקשנים:
  כל מה שמופיע ב"הוספת סקשן" נמשך אוטומטית מתוך sectionLayoutVariants.
*/

import type { SectionCategory, SectionTemplate } from "../types";
import {
  sectionLayoutVariants,
  type SectionKind,
  type SectionLayoutVariant,
} from "./sectionLayoutVariants";

type SectionCategoryMeta = {
  key: SectionCategory;
  label: string;
  icon: string;
  description: string;
};

const sectionCategoryMeta: SectionCategoryMeta[] = [
  { key: "header", label: "Header", icon: "▤", description: "Top menu, logo, navigation, buttons, and sign-in/out" },
  { key: "hero", label: "Home", icon: "★", description: "Site opening, hero, main headline, and atmosphere image" },
  { key: "welcome", label: "Welcome", icon: "✦", description: "Soft opening, greeting, business intro, and a call to action" },
  { key: "about", label: "About", icon: "ℹ", description: "Business story, values, experience, and a photo" },
  { key: "team", label: "Team", icon: "◉", description: "Team members, owner, profiles, and roles" },
  { key: "services", label: "Services", icon: "✦", description: "Service cards, price list, packages, and descriptions" },
  { key: "gallery", label: "Gallery", icon: "▧", description: "Photos, work, carousel, grid, and media" },
  { key: "contact", label: "Contact", icon: "@", description: "Forms, WhatsApp, phone, map, and business details" },
  { key: "promotion", label: "Promotion", icon: "%", description: "Promos, coupons, banners, and purchase prompts" },
  { key: "subscribe", label: "Subscribe", icon: "+", description: "Newsletter, waitlist, coupon, and updates signup" },
  { key: "testimonials", label: "Testimonials", icon: "❝", description: "Customer quotes and social proof" },
  { key: "reviews", label: "Reviews", icon: "★", description: "Reviews, ratings, stars, and a review form" },
  { key: "clients", label: "Clients", icon: "◫", description: "Logos, clients, brands, and partners" },
  { key: "store", label: "Store", icon: "₪", description: "Products, price, buy button, collections, and ecommerce" },
  { key: "booking", label: "Appointments", icon: "☷", description: "Appointment calendar connected to CRM hours and services" },
  { key: "bookings", label: "Appointments", icon: "☷", description: "Legacy bookings name support" },
  { key: "events", label: "Events", icon: "◇", description: "Events, schedule, talks, workshops, and signup" },
  { key: "club", label: "Customer club", icon: "♛", description: "VIP, coupons, benefits, and customer signup" },
  { key: "bot", label: "Smart bot", icon: "AI", description: "AI assistant, chat, leads, WhatsApp, and bookings" },
  { key: "social", label: "Social networks", icon: "#", description: "Instagram, Facebook, TikTok, YouTube, LinkedIn, and WhatsApp" },
  { key: "course", label: "Digital course", icon: "▶", description: "Courses, lessons, content, pricing, and syllabus" },
  { key: "miniSaas", label: "Mini SaaS", icon: "S", description: "Small business system, dashboard, login, and payment" },
  { key: "basic", label: "Basic", icon: "+", description: "Basic, empty, numbers, CTA, and text sections" },
  { key: "text", label: "Text", icon: "T", description: "Headings, paragraphs, quotes, and text content" },
  { key: "list", label: "List", icon: "☰", description: "Lists, steps, benefits, FAQ, and price lists" },
  { key: "form", label: "Form", icon: "▣", description: "Lead, contact, signup, request, and support forms" },
  { key: "forms", label: "Forms", icon: "▣", description: "Legacy forms name support" },
];

export const sectionCategories: { key: SectionCategory; label: string }[] =
  sectionCategoryMeta
    .filter((category) => sectionLayoutVariants.some((variant) => variant.kind === category.key))
    .map(({ key, label }) => ({ key, label }));

export const sectionCategoriesDetailed = sectionCategoryMeta.filter((category) =>
  sectionLayoutVariants.some((variant) => variant.kind === category.key)
);

function toSectionCategory(kind: SectionKind): SectionCategory {
  if (kind === "booking") return "booking";
  if (kind === "bookings") return "bookings";
  if (kind === "form") return "form";
  if (kind === "forms") return "forms";
  return kind as SectionCategory;
}

function stripUnsafePreviewCode(html: string) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getPreviewImage(variant: SectionLayoutVariant) {
  if (variant.previewImage) return variant.previewImage;
  const html = String(variant.html || "");
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];
  const bgMatch = html.match(/url\(["']?([^"')]+)["']?\)/i);
  if (bgMatch?.[1]) return bgMatch[1];
  return "";
}

function ensureSectionKindOnRoot(html: string, kind: SectionKind) {
  if (/data-section-kind=["']/.test(html)) return html;
  if (/<header\b/i.test(html)) {
    return html.replace(/<header\b/i, `<header data-section-kind="${kind}"`);
  }
  if (/<section\b/i.test(html)) {
    return html.replace(/<section\b/i, `<section data-section-kind="${kind}"`);
  }
  return `
<section
  data-section-kind="${kind}"
  class="relative mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 lg:px-10"
>
  ${html}
</section>
`;
}

function variantToTemplate(variant: SectionLayoutVariant): SectionTemplate {
  return {
    id: variant.id,
    category: toSectionCategory(variant.kind),
    title: variant.title,
    description: variant.description,
    preview: getPreviewImage(variant) || stripUnsafePreviewCode(variant.html),
    html: ensureSectionKindOnRoot(variant.html, variant.kind),
  };
}

export const sectionTemplates: SectionTemplate[] = sectionLayoutVariants
  .filter((variant) => variant.kind !== "savedSections")
  .map(variantToTemplate);

export function getSectionTemplatesByCategory(category: SectionCategory) {
  return sectionTemplates.filter((template) => template.category === category);
}

export function getSectionTemplateById(id: string) {
  return sectionTemplates.find((template) => template.id === id) || null;
}

export function getSectionCategoryMeta(category: SectionCategory) {
  return (
    sectionCategoryMeta.find((item) => item.key === category) || {
      key: category,
      label: String(category),
      icon: "▣",
      description: "",
    }
  );
}
