#!/usr/bin/env node
/**
 * Generates 10 NEW rich multi-page store templates (does NOT touch existing stores).
 * Run: node scripts/generate-rich-store-templates.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatesDir = path.join(
  root,
  "src/components/site-builder/studio/data/templates",
);

const STORES = [
  {
    key: "brewora",
    name: "Brewora",
    layout: "roastBar",
    niche: "specialty-coffee",
    nicheHe: "קפה ספיישלטי",
    tagline: "קלייה טרייה. כוס מדויקת.",
    description:
      "חנות קפה ספיישלטי עשירה: 11 עמודים, 10 סקשנים בכל עמוד, קטלוג מתוסף החנות.",
    primary: "#8B4513",
    accent: "#D97706",
    onPrimary: "#FFF7ED",
    bg: "#FFF7ED",
    bgSoft: "#FFEDD5",
    surface: "#FFFFFF",
    text: "#431407",
    muted: "#9A3412",
    dark: "#1C0A00",
    line: "rgba(67,20,7,0.14)",
    font: "Heebo",
    display: "Fraunces",
    heroTitle: "קפה שנקלה בבוקר ומגיע אליכם חם מהדלפק.",
    heroSubtitle:
      "פולי ספיישלטי, מטחנות, כוסות ואביזרי בריסטה — עם קטגוריות, סינון וחיבור מלא לתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["פולי קפה", "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80"],
      ["ציוד בריסטה", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80"],
      ["כוסות", "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"],
      ["מארזי מתנה", "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["אספרסו House Blend", 68, "פולי קפה", "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80", true, "קלייה חדשה"],
      ["אתיופיה יירגצ׳פה", 84, "פולי קפה", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80", true],
      ["מטחנת Baratza", 890, "ציוד בריסטה", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"],
      ["קנקן Pour Over", 129, "ציוד בריסטה", "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80"],
      ["כוס קרמיקה 250ml", 59, "כוסות", "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["כוס טרמי 350ml", 99, "כוסות", "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80"],
      ["מארז בוקר זוגי", 149, "מארזי מתנה", "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80", true],
      ["סירופ וניל טבעי", 45, "מארזי מתנה", "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "vinora",
    name: "Vinora",
    layout: "cellarVault",
    niche: "wine-cellar",
    nicheHe: "יקב ויינות",
    tagline: "מרתף נבחר. כוס מדויקת.",
    description:
      "חנות יינות ומרתף: 11 עמודים עשירים, קולקציות יקבים ומוצרים מתוסף החנות.",
    primary: "#7F1D1D",
    accent: "#F59E0B",
    onPrimary: "#FFFBEB",
    bg: "#FFFBF5",
    bgSoft: "#F5E6D3",
    surface: "#FFFFFF",
    text: "#3F1D12",
    muted: "#7C2D12",
    dark: "#1A0A08",
    line: "rgba(63,29,18,0.14)",
    font: "Heebo",
    display: "Playfair+Display",
    heroTitle: "יינות שנבחרו למרתף, לא למדף גנרי.",
    heroSubtitle:
      "אדומים, לבנים, מבעבעים ומארזי טעימות — חוויית קנייה עמוקה עם חיבור לתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["אדומים", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80"],
      ["לבנים", "https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=900&q=80"],
      ["מבעבעים", "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80"],
      ["מארזים", "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["קברנה רזרב", 129, "אדומים", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80", true, "בחירת הסומלייה"],
      ["מרלו גלילי", 98, "אדומים", "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80"],
      ["שרדונה חבית", 112, "לבנים", "https://images.unsplash.com/photo-1566995541428-f2246c17cda1?auto=format&fit=crop&w=900&q=80", true],
      ["סוביניון בלאן", 89, "לבנים", "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80"],
      ["ברוט קלאסי", 149, "מבעבעים", "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80", true],
      ["פרוסקו איטלקי", 79, "מבעבעים", "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80"],
      ["מארז טעימות 4", 299, "מארזים", "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80", true],
      ["מארז חג זוגי", 219, "מארזים", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "trailhaus",
    name: "Trailhaus",
    layout: "ridgeTrail",
    niche: "outdoor-camping",
    nicheHe: "טיולים וקמפינג",
    tagline: "מהשביל עד הבסיס.",
    description:
      "חנות outdoor מלאה: ציוד שטח, אוהלים ותרמילים — 11 עמודים עם 10 סקשנים בכל אחד.",
    primary: "#166534",
    accent: "#F59E0B",
    onPrimary: "#F0FDF4",
    bg: "#F4F7F0",
    bgSoft: "#E7EFE0",
    surface: "#FFFFFF",
    text: "#14532D",
    muted: "#3F6212",
    dark: "#052E16",
    line: "rgba(20,83,45,0.14)",
    font: "Heebo",
    display: "Oswald",
    heroTitle: "ציוד שטח שנבנה לשבילים ארוכים וללילות קרים.",
    heroSubtitle:
      "אוהלים, תרמילים, בישול שטח ושכבות — קטלוג מלא שמגיע מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["אוהלים", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"],
      ["תרמילים", "https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=900&q=80"],
      ["בישול שטח", "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80"],
      ["שכבות", "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["אוהל Ridge 2P", 1290, "אוהלים", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80", true, "חדש"],
      ["אוהל Base 4P", 1890, "אוהלים", "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80"],
      ["תרמיל Summit 45L", 649, "תרמילים", "https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=900&q=80", true],
      ["תרמיל Daypack 22L", 289, "תרמילים", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
      ["כירת גז Trail", 219, "בישול שטח", "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80"],
      ["סט סירים Titanium", 349, "בישול שטח", "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["מעיל Softshell", 459, "שכבות", "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80", true],
      ["כובע Trail Cap", 99, "שכבות", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "audiolux",
    name: "Audiolux",
    layout: "soundStage",
    niche: "audio-gear",
    nicheHe: "אודיו וסאונד",
    tagline: "במה פרטית בבית.",
    description:
      "חנות אודיו קולנועית: אוזניות, רמקולים ומערכות — 11 עמודים עשירים.",
    primary: "#06B6D4",
    accent: "#A78BFA",
    onPrimary: "#041016",
    bg: "#050915",
    bgSoft: "#0B1224",
    surface: "#111827",
    text: "#E0F2FE",
    muted: "#94A3B8",
    dark: "#020617",
    line: "rgba(255,255,255,0.12)",
    font: "Heebo",
    display: "Space+Grotesk",
    heroTitle: "סאונד חד כמו במה חיה — בסלון שלכם.",
    heroSubtitle:
      "אוזניות, רמקולים, דאקים וסאונדבר — עם תצוגת מוצרים חיה מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["אוזניות", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
      ["רמקולים", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"],
      ["סאונדבר", "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"],
      ["אביזרים", "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["אוזניות Pulse Pro", 899, "אוזניות", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", true, "חדש"],
      ["אוזניות Studio ANC", 649, "אוזניות", "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"],
      ["רמקול Orbit X", 1290, "רמקולים", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80", true],
      ["רמקול Bookshelf", 1790, "רמקולים", "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80"],
      ["סאונדבר Cinema 3.1", 2190, "סאונדבר", "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80", true],
      ["סאב Bass Cube", 990, "סאונדבר", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"],
      ["DAC USB Mini", 349, "אביזרים", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80"],
      ["כבל Optical Pro", 89, "אביזרים", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
    ],
  },
  {
    key: "wheelora",
    name: "Wheelora",
    layout: "veloTrack",
    niche: "bicycles",
    nicheHe: "אופניים וציוד רכיבה",
    tagline: "קילומטרים מתחילים כאן.",
    description:
      "חנות אופניים מלאה: כביש, שטח ואביזרי רכיבה — 11 עמודים עם תוכן עשיר.",
    primary: "#DC2626",
    accent: "#FDE047",
    onPrimary: "#FFFFFF",
    bg: "#FAFAFA",
    bgSoft: "#F3F4F6",
    surface: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    dark: "#0F172A",
    line: "rgba(17,24,39,0.12)",
    font: "Heebo",
    display: "Barlow+Condensed",
    heroTitle: "אופניים ואביזרים שנבנו לקצב שלכם.",
    heroSubtitle:
      "כביש, שטח, עיר ואביזרי רכיבה — קטלוג חי מתוסף החנות עם סינון וקולקציות.",
    heroImage:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["כביש", "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80"],
      ["שטח", "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80"],
      ["עיר", "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80"],
      ["אביזרים", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["אופני כביש Aero 12", 8990, "כביש", "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80", true, "חדש"],
      ["אופני כביש Endurance", 6490, "כביש", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"],
      ["MTB Trail 29", 5790, "שטח", "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80", true],
      ["MTB Hardtail", 3990, "שטח", "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"],
      ["אופני עיר City Flex", 2890, "עיר", "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80"],
      ["קסדת Aero Pro", 449, "אביזרים", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", true],
      ["משאבת רצפה", 189, "אביזרים", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80"],
      ["אור קדמי 800lm", 159, "אביזרים", "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
    ],
  },
  {
    key: "fernora",
    name: "Fernora",
    layout: "greenhouseGrid",
    niche: "plants-nursery",
    nicheHe: "צמחים ומשתלה",
    tagline: "ירוק שנכנס הביתה.",
    description:
      "משתלה דיגיטלית: צמחי בית, עציצים וכלי גינון — 11 עמודים עשירים.",
    primary: "#15803D",
    accent: "#86EFAC",
    onPrimary: "#F0FDF4",
    bg: "#F3FAF4",
    bgSoft: "#E8F5E9",
    surface: "#FFFFFF",
    text: "#14532D",
    muted: "#4D7C5C",
    dark: "#052E16",
    line: "rgba(20,83,45,0.12)",
    font: "Heebo",
    display: "Cormorant+Garamond",
    heroTitle: "צמחים, עציצים ואווירה של חממה בסלון.",
    heroSubtitle:
      "צמחי בית, סוקולנטים ואביזרי טיפול — עם קטגוריות ומוצרים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["צמחי בית", "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80"],
      ["סוקולנטים", "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=80"],
      ["עציצים", "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=80"],
      ["טיפול", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["מונסטרה דליסיוזה", 149, "צמחי בית", "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80", true, "פופולרי"],
      ["פיקוס לירטה", 189, "צמחי בית", "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80"],
      ["סוקולנט מיקס", 49, "סוקולנטים", "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=900&q=80", true],
      ["אלוורה ביתית", 59, "סוקולנטים", "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80"],
      ["עציץ קרמיקה Sand", 79, "עציצים", "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=80"],
      ["עציץ טרה קוטה", 45, "עציצים", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["דשן נוזלי Green", 39, "טיפול", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80"],
      ["מרסס עלים", 29, "טיפול", "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80", true],
    ],
  },
  {
    key: "playora",
    name: "Playora",
    layout: "toyArcade",
    niche: "toys-games",
    nicheHe: "צעצועים ומשחקים",
    tagline: "כיף ברמה גבוהה.",
    description:
      "חנות צעצועים ארקיידית: משחקים, דמויות ויצירה — 11 עמודים צבעוניים ועשירים.",
    primary: "#DB2777",
    accent: "#FDE047",
    onPrimary: "#FFFFFF",
    bg: "#FFF7FB",
    bgSoft: "#FCE7F3",
    surface: "#FFFFFF",
    text: "#831843",
    muted: "#9D174D",
    dark: "#500724",
    line: "rgba(131,24,67,0.14)",
    font: "Heebo",
    display: "Fredoka",
    heroTitle: "צעצועים ומשחקים שהופכים כל אחר צהריים להרפתקה.",
    heroSubtitle:
      "משחקי קופסה, דמויות ויצירה — קטלוג חי עם סינון וקולקציות מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["משחקי קופסה", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=900&q=80"],
      ["דמויות", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=900&q=80"],
      ["יצירה", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80"],
      ["חוץ", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["משחק אסטרטגיה Quest", 149, "משחקי קופסה", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=900&q=80", true, "HIT"],
      ["משחק משפחה Fun 4", 99, "משחקי קופסה", "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=900&q=80"],
      ["דמות Hero Bot", 79, "דמויות", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=900&q=80", true],
      ["סט דינוזאורים", 119, "דמויות", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80"],
      ["ערכת יצירה Colors", 69, "יצירה", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80", true],
      ["פלסטלינה Pro", 39, "יצירה", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80"],
      ["כדור פעילות", 89, "חוץ", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80"],
      ["ערכת פיקניק משחק", 129, "חוץ", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
    ],
  },
  {
    key: "panora",
    name: "Panora",
    layout: "chefAtelier",
    niche: "kitchen-cookware",
    nicheHe: "מטבח וכלי בישול",
    tagline: "המטבח כסטודיו.",
    description:
      "חנות כלי מטבח בסגנון ספר מתכונים: סירים, סכינים ואביזרים — 11 עמודים עשירים.",
    primary: "#C2410C",
    accent: "#FDBA74",
    onPrimary: "#FFF7ED",
    bg: "#FFFAF5",
    bgSoft: "#FFF1E6",
    surface: "#FFFFFF",
    text: "#431407",
    muted: "#9A3412",
    dark: "#1C1917",
    line: "rgba(67,20,7,0.12)",
    font: "Heebo",
    display: "Libre+Baskerville",
    heroTitle: "כלי מטבח שנראים כמו פרק בספר שף.",
    heroSubtitle:
      "סירים, מחבתות, סכינים ואביזרי שירות — חוויית חנות מלאה מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["סירים", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80"],
      ["סכינים", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80"],
      ["אפייה", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"],
      ["שירות", "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["סיר נירוסטה 5L", 349, "סירים", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80", true, "שף"],
      ["מחבת יציקה 28", 289, "סירים", "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=900&q=80"],
      ["סכין שף 20cm", 219, "סכינים", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80", true],
      ["סט סכינים 5", 459, "סכינים", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80"],
      ["תבנית אפייה Pro", 129, "אפייה", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"],
      ["מיקסר ידני", 199, "אפייה", "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["קרש חיתוך אלון", 149, "שירות", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80", true],
      ["סט כפות מדידה", 59, "שירות", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "kickora",
    name: "Kickora",
    layout: "streetDrop",
    niche: "sneakers-streetwear",
    nicheHe: "סניקרס וסטריטוור",
    tagline: "דרופ. סטייל. רחוב.",
    description:
      "חנות סניקרס וסטריט: דרופים, קולקציות ואביזרים — 11 עמודים עם אנרגיית רחוב.",
    primary: "#111827",
    accent: "#F43F5E",
    onPrimary: "#FFFFFF",
    bg: "#0B0B0F",
    bgSoft: "#15151C",
    surface: "#1C1C26",
    text: "#F5F5F7",
    muted: "#A1A1AA",
    dark: "#050507",
    line: "rgba(255,255,255,0.12)",
    font: "Heebo",
    display: "Anton",
    heroTitle: "סניקרס ודרופים שמגיעים ישר מהרחוב.",
    heroSubtitle:
      "נעליים, הודים ואקססוריז — קטלוג חי עם סינון וקולקציות מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["סניקרס", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
      ["הודים", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"],
      ["כובעים", "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80"],
      ["אקססוריז", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["Volt Runner", 549, "סניקרס", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", true, "DROP"],
      ["Street Low", 429, "סניקרס", "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80", true],
      ["Hoodie Shadow", 289, "הודים", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"],
      ["Hoodie Neon Zip", 319, "הודים", "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=80"],
      ["כובע Dad Cap", 119, "כובעים", "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80", true],
      ["כובע Beanie", 89, "כובעים", "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80"],
      ["תיק Crossbody", 199, "אקססוריז", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"],
      ["גרבי Crew 3-Pack", 69, "אקססוריז", "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
    ],
  },
  {
    key: "scentora",
    name: "Scentora",
    layout: "aromaSalon",
    niche: "candles-fragrance",
    nicheHe: "נרות וריחות",
    tagline: "ניחוח שממלא חדר.",
    description:
      "חנות נרות וריחות יוקרתית: נרות, דיפיוזרים ומארזים — 11 עמודים רכים ועשירים.",
    primary: "#9D174D",
    accent: "#F9A8D4",
    onPrimary: "#FFF1F2",
    bg: "#FFF7F9",
    bgSoft: "#FCE7F3",
    surface: "#FFFFFF",
    text: "#500724",
    muted: "#9D174D",
    dark: "#2D0A1A",
    line: "rgba(80,7,36,0.12)",
    font: "Heebo",
    display: "Cormorant+Garamond",
    heroTitle: "נרות וריחות שמעצבים את האווירה של הבית.",
    heroSubtitle:
      "נרות סויה, דיפיוזרים ומארזי מתנה — חוויית חנות מלאה עם מוצרים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["נרות", "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80"],
      ["דיפיוזרים", "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80"],
      ["שמנים", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80"],
      ["מארזים", "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["נר סויה Rose Mist", 129, "נרות", "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80", true, "סלון"],
      ["נר Cedar Night", 119, "נרות", "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=900&q=80"],
      ["דיפיוזר Linen", 159, "דיפיוזרים", "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80", true],
      ["דיפיוזר Amber", 149, "דיפיוזרים", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80"],
      ["שמן אתרי לבנדר", 79, "שמנים", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80"],
      ["שמן אתרי הדרים", 69, "שמנים", "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["מארז מתנה Soft", 229, "מארזים", "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=900&q=80", true],
      ["מארז זוגי Evening", 259, "מארזים", "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80"],
    ],
  },
];

function pascal(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function logoText(name) {
  return name.slice(0, 2).toUpperCase();
}

function displayCss(display) {
  return display.replace(/\+/g, " ").replace(/:.*$/, "");
}

function write(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function buildDefaultData(store) {
  const [c1, c2, c3, c4] = store.cats;
  const products = store.products.map(([name, price, category, image, featured, badge]) => ({
    name,
    price,
    category,
    image,
    shortDescription: `${name} מתוך קטלוג ${store.name} — ${store.nicheHe}.`,
    featured: Boolean(featured),
    badge: badge || undefined,
  }));

  const data = {
    templateId: store.key,
    name: store.name,
    brandName: store.name,
    logoText: logoText(store.name),
    tagline: store.tagline,
    nicheLabel: store.nicheHe,
    navHome: "בית",
    navShop: "חנות",
    navCollections: "קולקציות",
    navProduct: "מוצר",
    navCart: "סל",
    navLookbook: "גלריה",
    navAbout: "אודות",
    navJournal: "מגזין",
    navContact: "צור קשר",
    navFaq: "שאלות",
    navShipping: "משלוחים",
    promoText: `${store.name} · ${store.tagline} · מוצרים מתוסף החנות`,
    heroEyebrow: store.nicheHe,
    heroTitle: store.heroTitle,
    heroSubtitle: store.heroSubtitle,
    heroPrimaryButton: "לכל המוצרים",
    heroSecondaryButton: "הסיפור שלנו",
    heroImage: store.heroImage,
    categoriesEyebrow: "קטגוריות",
    categoriesTitle: `המחלקות של ${store.name}.`,
    categoriesText: "בחרו קטגוריה ועברו ישירות לסינון חי בחנות.",
    collectionsEyebrow: "קולקציות",
    collectionsTitle: "אוספים שנבנו סביב חוויית קנייה אמיתית.",
    collectionsText: "כל קולקציה מובילה למוצרים שמגיעים מתוסף החנות.",
    catOne: c1[0],
    catOneImage: c1[1],
    catTwo: c2[0],
    catTwoImage: c2[1],
    catThree: c3[0],
    catThreeImage: c3[1],
    catFour: c4[0],
    catFourImage: c4[1],
    productsEyebrow: "נבחרים",
    productsTitle: "מוצרים שנבחרו לתצוגה עשירה.",
    productsText: "הקטלוג נטען מתוסף החנות — עם דמו עד שתמלאו מוצרים אמיתיים.",
    valueOneTitle: "בחירה מדויקת",
    valueOneText: "כל מוצר מוצג עם קטגוריה, מחיר ותיאור ברור.",
    valueTwoTitle: "חוויית קנייה מלאה",
    valueTwoText: "11 עמודים עם סינון, סל, גלריה, אודות ומשלוחים.",
    valueThreeTitle: "עיצוב ייחודי",
    valueThreeText: `לייאאוט ${store.layout} שלא נראה כמו חנויות אחרות.`,
    lookbookEyebrow: "גלריה",
    lookbookTitle: "תמונות שמספרות את האווירה של המותג.",
    lookbookText: "גלריה עשירה עם סצנות מוצר ואטמוספירה.",
    lookOne: store.heroImage,
    lookTwo: store.aboutImage,
    lookThree: c1[1],
    testimonialsEyebrow: "לקוחות",
    testimonialsTitle: "מה אומרים מי שכבר קנו.",
    reviewOneName: "נועה כ.",
    reviewOneText: "האתר מרגיש כמו חנות אמיתית — עשיר, יפה ומדויק.",
    reviewTwoName: "יואב מ.",
    reviewTwoText: "הסינון והעמודים הפנימיים חוסכים זמן ומעלים אמון.",
    reviewThreeName: "דנה ר.",
    reviewThreeText: "כל עמוד מרגיש מלא — לא רק דף בית יפה.",
    journalEyebrow: "מגזין",
    journalTitle: "השראה, מדריכים ובחירות מערכת.",
    journalText: "תוכן שמלווה את הקנייה ומחזק את המותג.",
    journalOneTitle: "איך לבחור נכון בפעם הראשונה",
    journalOneText: "טיפים קצרים להתאמה מהירה לצרכים שלכם.",
    journalTwoTitle: "מאחורי הקלעים של הקולקציה",
    journalTwoText: "סיפור קצר על בחירת מוצרים וחומרים.",
    journalThreeTitle: "שילובים שעובדים תמיד",
    journalThreeText: "המלצות שמעלות את חוויית השימוש.",
    newsletterEyebrow: "ניוזלטר",
    newsletterTitle: "היו הראשונים לדעת על הגעות חדשות.",
    newsletterText: "מבצעים, קולקציות וטיפים ישירות למייל.",
    newsletterButton: "הרשמה",
    shopEyebrow: "החנות",
    shopTitle: "כל המוצרים במקום אחד.",
    shopText: "חיפוש, סינון לפי קטגוריה ומיון — המוצרים מתוסף החנות.",
    shipBenefit: "משלוח מהיר לכל הארץ",
    returnBenefit: "החזרות עד 14 יום",
    supportBenefit: "שירות לקוחות אנושי",
    secureBenefit: "תשלום מאובטח",
    shopCtaTitle: "צריכים עזרה בבחירה?",
    shopCtaText: "כתבו לנו ונכוון אתכם למוצר המתאים.",
    shopCtaButton: "דברו איתנו",
    aboutEyebrow: "אודות",
    aboutTitle: `${store.name} — ${store.nicheHe} עם חוויית חנות מלאה.`,
    aboutText: `${store.name} נבנתה כחנות גדולה עם עשרות סקשנים, עמודי תוכן וחיבור מלא לתוסף החנות של Bizuply.`,
    aboutTextTwo: "המוצרים בתצוגה הם דמו עד שתגדירו את הקטלוג האמיתי בניהול החנות.",
    aboutImage: store.aboutImage,
    productFallbackText: "תיאור המוצר יופיע כאן מתוך תוסף החנות.",
    productDetailOne: "פרטי מוצר ברורים: שימוש, התאמה ותועלת.",
    productDetailTwo: "מידע על משלוח, החזרה ושירות מופיע בכל עמוד רלוונטי.",
    productDetailThree: "אפשר להתייעץ לפני רכישה דרך עמוד יצירת הקשר.",
    cartTitle: "הסל שלכם",
    cartText: "בדקו את הפריטים לפני מעבר לתשלום או יצירת קשר.",
    contactEyebrow: "צור קשר",
    contactTitle: "נשמח לעזור בבחירה.",
    contactText: "השאירו פרטים ונחזור עם המלצה מדויקת.",
    contactButton: "שליחת פנייה",
    phone: "03-555-0100",
    email: `hello@${store.key}.co.il`,
    address: "תל אביב",
    faqTitle: "שאלות נפוצות",
    faqText: "תשובות מהירות לפני הקנייה.",
    faqOneQ: "מאיפה מגיעים המוצרים?",
    faqOneA: "המוצרים נטענים מתוסף החנות ברגע שתגדירו אותם בניהול.",
    faqTwoQ: "אפשר לסנן לפי קטגוריה?",
    faqTwoA: "כן — בעמוד החנות יש חיפוש, קטגוריות ומיון.",
    faqThreeQ: "כמה זמן לוקח משלוח?",
    faqThreeA: "בדרך כלל 1–3 ימי עסקים, לפי אזור ושירות שנבחר.",
    faqFourQ: "איך יוצרים קשר?",
    faqFourA: "דרך עמוד צור קשר, טלפון או אימייל שמופיעים באתר.",
    faqFiveQ: "אפשר להחזיר מוצר?",
    faqFiveA: "כן, לפי מדיניות ההחזרות בעמוד המשלוחים.",
    shippingTitle: "משלוחים והחזרות",
    shippingText: "שקיפות מלאה על זמנים, עלויות ומדיניות.",
    shipOneTitle: "משלוח מהיר",
    shipOneText: "שילוח לכל הארץ עם מעקב.",
    shipTwoTitle: "אריזה בטוחה",
    shipTwoText: "אריזה שמותאמת לסוג המוצר.",
    shipThreeTitle: "החזרות פשוטות",
    shipThreeText: "תהליך החזרה ברור תוך 14 יום.",
    shipFourTitle: "איסוף עצמי",
    shipFourText: "אפשר לתאם איסוף לפי זמינות.",
    ctaTitle: "מוכנים להתחיל לקנות?",
    ctaText: "עברו לחנות או כתבו לנו להכוונה אישית.",
    ctaButton: "לחנות",
    footerText: `${store.name} · ${store.nicheHe} · Powered by Bizuply`,
    footerNote: "המוצרים מתעדכנים אוטומטית מתוסף החנות.",
  };

  return { data, products };
}

function buildEditorCss(store) {
  const displayFamily = displayCss(store.display);
  const fontImport = `https://fonts.googleapis.com/css2?family=${store.display}:wght@600;700;800&family=${store.font}:wght@400;500;600;700;800;900&display=swap`;
  return `export const ${store.key}EditorCss = \`
@import url('${fontImport}');
[data-template-id="${store.key}"], [data-template-id="${store.key}-preview"] {
  --p: ${store.primary};
  --accent: ${store.accent};
  --on-p: ${store.onPrimary};
  --bg: ${store.bg};
  --bg-soft: ${store.bgSoft};
  --surface: ${store.surface};
  --text: ${store.text};
  --muted: ${store.muted};
  --dark: ${store.dark};
  --line: ${store.line};
  font-family: "${store.font}", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1100px 520px at 100% -10%, ${store.primary}22, transparent 55%),
    radial-gradient(900px 480px at 0% 100%, ${store.accent}18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="${store.key}"] .store-display,
[data-template-id="${store.key}-preview"] .store-display {
  font-family: "${displayFamily}", "${store.font}", serif;
}
[data-template-id="${store.key}"] .store-card,
[data-template-id="${store.key}-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="${store.key}"] .store-card:hover,
[data-template-id="${store.key}-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="${store.key}"] .store-marquee,
[data-template-id="${store.key}-preview"] .store-marquee {
  animation: ${store.key}-marquee 22s linear infinite;
}
@keyframes ${store.key}-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="${store.key}"] .store-marquee,
  [data-template-id="${store.key}-preview"] .store-marquee {
    animation: none !important;
  }
}
\`;
`;
}

function generateStore(store) {
  const Name = pascal(store.key);
  const dir = path.join(templatesDir, store.key);
  if (fs.existsSync(dir)) {
    console.log(`skip existing ${store.key}`);
    return;
  }

  const { data, products } = buildDefaultData(store);

  write(
    path.join(dir, "defaultData.ts"),
    `export const ${store.key}DefaultData = ${JSON.stringify(data, null, 2)} as const;

export const ${store.key}DemoProducts = ${JSON.stringify(products, null, 2)};
`,
  );

  write(path.join(dir, "editorCss.ts"), buildEditorCss(store));

  write(
    path.join(dir, "schema.ts"),
    `export const ${store.key}Schema = {
  templateId: "${store.key}",
  name: "${store.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "תת-כותרת", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "shopTitle", label: "כותרת חנות", type: "textarea" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
`,
  );

  write(
    path.join(dir, "pages.tsx"),
    `import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { ${store.key}DefaultData, ${store.key}DemoProducts } from "./defaultData";
import { ${store.key}EditorCss } from "./editorCss";

export const ${store.key}Pages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "collections", label: "קולקציות", slug: "/collections" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "lookbook", label: "גלריה", slug: "/lookbook" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "journal", label: "מגזין", slug: "/journal" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function ${Name}Pages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="${store.key}"
      layout="${store.layout}"
      defaultData={${store.key}DefaultData}
      editorCss={${store.key}EditorCss}
      demoProducts={${store.key}DemoProducts}
      pages={${store.key}Pages}
    />
  );
}
`,
  );

  write(
    path.join(dir, "preview.tsx"),
    `import React from "react";
import ${Name}Pages from "./pages";

export default function ${Name}Preview() {
  return (
    <div dir="rtl" data-template-id="${store.key}-preview" className="min-h-screen w-full overflow-x-hidden">
      <${Name}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`,
  );

  write(
    path.join(dir, "thumbnail.tsx"),
    `import React from "react";

export default function ${Name}Thumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "${store.bg}", color: "${store.text}", fontFamily: "${store.font}, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: \`radial-gradient(circle at 80% 20%, ${store.primary}66, transparent 45%)\` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "${store.primary}", color: "${store.onPrimary}" }}>${store.nicheHe}</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "${displayCss(store.display)}, serif" }}>${store.name}</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">${store.tagline}</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "גלריה", "אודות", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "${store.primary}55", background: "${store.surface}" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
`,
  );

  write(
    path.join(dir, "meta.ts"),
    `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${Name}Pages, { ${store.key}Pages } from "./pages";
import ${Name}Preview from "./preview";
import ${Name}Thumbnail from "./thumbnail";
import { ${store.key}EditorCss } from "./editorCss";
import { ${store.key}Schema } from "./schema";
import { ${store.key}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${store.primary}",
  secondary: "${store.dark}",
  accent: "${store.accent}",
  background: "${store.bg}",
  surface: "${store.surface}",
  text: "${store.text}",
  muted: "${store.muted}",
  dark: "${store.dark}",
};

export const ${store.key}Seed = {
  id: "${store.key}",
  key: "${store.key}",
  name: "${store.name}",
  title: "${store.name}",
  description: "${store.description}",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "${store.niche}",
  layout: "${store.layout}",
  image: (${store.key}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${store.key}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${store.key}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "${store.key}-header", title: "Header" },
    { type: "hero", variant: "${store.key}-hero", title: "Hero" },
    { type: "categories", variant: "${store.key}-categories", title: "Categories" },
    { type: "store", variant: "${store.key}-products", title: "Products" },
    { type: "gallery", variant: "${store.key}-lookbook", title: "Lookbook" },
    { type: "about", variant: "${store.key}-about", title: "About" },
    { type: "testimonials", variant: "${store.key}-reviews", title: "Testimonials" },
    { type: "faq", variant: "${store.key}-faq", title: "FAQ" },
    { type: "contact", variant: "${store.key}-contact", title: "Contact" },
    { type: "footer", variant: "${store.key}-footer", title: "Footer" },
  ].map((block, index) => ({ id: \`${store.key}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${store.key}Pages,
  editor: { pages: ${store.key}Pages, css: ${store.key}EditorCss },
  css: ${store.key}EditorCss,
  data: ${store.key}DefaultData,
  defaultData: ${store.key}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${store.key}Template = {
  id: "${store.key}",
  key: "${store.key}",
  name: "${store.name}",
  title: "${store.name}",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "${store.description}",
  thumbnail: React.createElement(${Name}Thumbnail),
  preview: React.createElement(${Name}Preview),
  component: ${Name}Pages,
  Component: ${Name}Pages,
  seed: ${store.key}Seed,
  pages: ${store.key}Pages,
  editorCss: ${store.key}EditorCss,
  schema: ${store.key}Schema,
  defaultData: ${store.key}DefaultData,
  renderer: {
    key: "${store.key}",
    name: "${store.name}",
    Component: ${Name}Pages,
    component: ${Name}Pages,
    pages: ${store.key}Pages,
    editorMode: "visual-react",
    editorCss: ${store.key}EditorCss,
    schema: ${store.key}Schema,
    defaultData: ${store.key}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${store.key}Template;
`,
  );

  console.log(`created ${store.key}`);
}

function patchIndex() {
  const indexPath = path.join(templatesDir, "index.ts");
  let src = fs.readFileSync(indexPath, "utf8");
  if (src.includes("breworaTemplate")) {
    console.log("index.ts already wired");
    return;
  }

  const importBlock = STORES.map(
    (s) => `import { ${s.key}Template } from "./${s.key}/meta";`,
  ).join("\n");

  src = src.replace(
    `import { jewelisTemplate } from "./jewelis/meta";`,
    `import { jewelisTemplate } from "./jewelis/meta";\n${importBlock}`,
  );

  const listBlock = STORES.map((s) => `  ${s.key}Template,`).join("\n");
  src = src.replace(
    `  jewelisTemplate,\n`,
    `  jewelisTemplate,\n${listBlock}\n`,
  );

  fs.writeFileSync(indexPath, src);
  console.log("patched index.ts");
}

function patchRegistry() {
  const registryPath = path.join(templatesDir, "templateRendererRegistry.ts");
  let src = fs.readFileSync(registryPath, "utf8");
  if (src.includes("brewora: createRenderer")) {
    console.log("registry already wired");
    return;
  }

  const importBlock = STORES.map((s) => {
    const Name = pascal(s.key);
    return `import ${Name}Pages, { ${s.key}Pages } from "./${s.key}/pages";
import { ${s.key}EditorCss } from "./${s.key}/editorCss";
import { ${s.key}Schema } from "./${s.key}/schema";
import { ${s.key}DefaultData } from "./${s.key}/defaultData";`;
  }).join("\n\n");

  src = src.replace(
    `import { jewelisDefaultData } from "./jewelis/defaultData";`,
    `import { jewelisDefaultData } from "./jewelis/defaultData";\n\n${importBlock}`,
  );

  const rendererBlock = STORES.map((s) => {
    const Name = pascal(s.key);
    return `
  ${s.key}: createRenderer({
    key: "${s.key}",
    name: "${s.name}",
    Component: ${Name}Pages,
    pages: ${s.key}Pages,
    editorMode: "visual-react",
    schema: ${s.key}Schema as unknown as StudioTemplateRenderer["schema"],
    defaultData: ${s.key}DefaultData as unknown as Record<string, any>,
    editorCss: ${s.key}EditorCss,
  }),`;
  }).join("\n");

  src = src.replace(
    `  jewelis: createRenderer({
    key: "jewelis",
    name: "Jewelis",
    Component: JewelisPages,
    pages: jewelisPages,
    editorMode: "visual-react",
    schema: jewelisSchema as unknown as StudioTemplateRenderer["schema"],
    defaultData: jewelisDefaultData as unknown as Record<string, any>,
    editorCss: jewelisEditorCss,
  }),`,
    `  jewelis: createRenderer({
    key: "jewelis",
    name: "Jewelis",
    Component: JewelisPages,
    pages: jewelisPages,
    editorMode: "visual-react",
    schema: jewelisSchema as unknown as StudioTemplateRenderer["schema"],
    defaultData: jewelisDefaultData as unknown as Record<string, any>,
    editorCss: jewelisEditorCss,
  }),
${rendererBlock}`,
  );

  fs.writeFileSync(registryPath, src);
  console.log("patched templateRendererRegistry.ts");
}

for (const store of STORES) generateStore(store);
patchIndex();
patchRegistry();
console.log(`Done. Generated ${STORES.length} rich stores.`);
