#!/usr/bin/env node
/**
 * Scaffolds 10 full multi-page store templates for חנויות ומסחר.
 * Products hydrate from the store plugin via shared StoreSiteRuntime.
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

const stores = [
  {
    key: "lumenware",
    name: "Lumenware",
    niche: "electronics",
    nicheHe: "אלקטרוניקה וגאדג׳טים",
    tagline: "טכנולוגיה שמאירה קדימה",
    primary: "#0EA5E9",
    accent: "#38BDF8",
    onPrimary: "#041018",
    bg: "#07111A",
    bgSoft: "#0E1A26",
    surface: "#122232",
    text: "#E8F4FF",
    muted: "#8AA9C2",
    dark: "#02070C",
    line: "rgba(255,255,255,0.12)",
    font: "Heebo",
    display: "Space Grotesk",
    heroTitle: "גאדג׳טים חכמים לבית, למשרד ולדרך.",
    heroSubtitle:
      "חנות אלקטרוניקה פרימיום עם קטגוריות, סינונים ומוצרים שמגיעים ישירות מתוסף החנות של Bizuply.",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["אודיו", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"],
      ["סמארט הום", "https://images.unsplash.com/photo-1558002038-809eabcf0d0b?auto=format&fit=crop&w=900&q=80"],
      ["לפטופים", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
      ["אביזרים", "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["אוזניות Pulse Air", 499, "אודיו", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", true, "חדש"],
      ["רמקול Orbit", 379, "אודיו", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"],
      ["נורה חכמה Halo", 129, "סמארט הום", "https://images.unsplash.com/photo-1558002038-809eabcf0d0b?auto=format&fit=crop&w=900&q=80", true],
      ["לפטופ Nova 14", 4290, "לפטופים", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
      ["מטען Turbo 65W", 149, "אביזרים", "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"],
      ["עכבר Flux", 189, "אביזרים", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["מצלמת בית Lens+", 299, "סמארט הום", "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80"],
      ["מקלדת Mech Pro", 449, "אביזרים", "https://images.unsplash.com/photo-1511467687858-23d96c32dbc8?auto=format&fit=crop&w=900&q=80", true],
    ],
  },
  {
    key: "greenbite",
    name: "Greenbite",
    niche: "organic-grocery",
    nicheHe: "מזון אורגני",
    tagline: "טרי מהשדה עד הבית",
    primary: "#15803D",
    accent: "#4ADE80",
    onPrimary: "#F0FDF4",
    bg: "#F7FBF4",
    bgSoft: "#EEF7E8",
    surface: "#FFFFFF",
    text: "#14532D",
    muted: "#4D7C5C",
    dark: "#052E16",
    line: "rgba(20,83,45,0.12)",
    font: "Heebo",
    display: "Fraunces",
    heroTitle: "מזווה אורגני שמרגיש כמו שוק איכרים דיגיטלי.",
    heroSubtitle:
      "ירקות, פירות, דגנים וממרחים נבחרים — עם קטגוריות, סינון וחיבור מלא לתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["ירקות", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80"],
      ["פירות", "https://images.unsplash.com/photo-1619566636858-adf3ef4644b9?auto=format&fit=crop&w=900&q=80"],
      ["דגנים", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80"],
      ["ממרחים", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["סלט עלים מיקס", 24, "ירקות", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80", true, "טרי"],
      ["עגבניות שרי", 18, "ירקות", "https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=900&q=80"],
      ["תפוחים אורגניים", 22, "פירות", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=80", true],
      ["בננות Fair", 16, "פירות", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80"],
      ["שיבולת שועל", 29, "דגנים", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80"],
      ["קינואה טריקולור", 39, "דגנים", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80", false, "נמכר"],
      ["טחינה גולמית", 34, "ממרחים", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80", true],
      ["דבש בר", 48, "ממרחים", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "sportifya",
    name: "Sportifya",
    niche: "sports-fitness",
    nicheHe: "ספורט וכושר",
    tagline: "ציוד שמזיז אותך",
    primary: "#EF4444",
    accent: "#FCA5A5",
    onPrimary: "#FFFFFF",
    bg: "#0B0B0F",
    bgSoft: "#15151C",
    surface: "#1C1C26",
    text: "#F5F5F7",
    muted: "#A1A1AA",
    dark: "#050507",
    line: "rgba(255,255,255,0.12)",
    font: "Heebo",
    display: "Oswald",
    heroTitle: "ציוד ספורט חד, קל ומוכן לאימון הבא.",
    heroSubtitle:
      "נעליים, בגדי כושר ואביזרי אימון — חנות מלאה עם פילטרים ומוצרים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["נעליים", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
      ["ביגוד", "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80"],
      ["משקולות", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80"],
      ["אביזרים", "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["נעלי ריצה Volt", 549, "נעליים", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", true, "חדש"],
      ["טייץ Performance", 219, "ביגוד", "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80"],
      ["חולצת Dry-Fit", 149, "ביגוד", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50e?auto=format&fit=crop&w=900&q=80", true],
      ["משקולות 2×10", 289, "משקולות", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80"],
      ["רצועות התנגדות", 99, "אביזרים", "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=80", false, "מבצע"],
      ["בקבוק Thermo", 79, "אביזרים", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"],
      ["מזרן יוגה Pro", 169, "אביזרים", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80", true],
      ["כפפות אימון", 89, "אביזרים", "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "babynest",
    name: "Babynest",
    niche: "baby-kids",
    nicheHe: "תינוקות וילדים",
    tagline: "רכות שמתחילה ביום הראשון",
    primary: "#F472B6",
    accent: "#FBCFE8",
    onPrimary: "#3B0A22",
    bg: "#FFF7FB",
    bgSoft: "#FFEAF4",
    surface: "#FFFFFF",
    text: "#4A1942",
    muted: "#9D6B8A",
    dark: "#2A1024",
    line: "rgba(74,25,66,0.12)",
    font: "Heebo",
    display: "Nunito",
    heroTitle: "הכול לקטנטנים — בעיצוב רך ובטוח.",
    heroSubtitle:
      "ביגוד, צעצועים ואביזרי חדר — חנות מלאה עם קטגוריות וסינונים שמחוברים לתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["ביגוד", "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80"],
      ["צעצועים", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80"],
      ["חדר", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80"],
      ["טיולים", "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["אוברול כותנה", 129, "ביגוד", "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80", true, "רך"],
      ["סט פיג׳מה", 99, "ביגוד", "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"],
      ["רעשן עץ", 69, "צעצועים", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80", true],
      ["קוביות חינוכיות", 89, "צעצועים", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80"],
      ["מצעים עננים", 179, "חדר", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80"],
      ["מנורת לילה", 119, "חדר", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", false, "אהוב"],
      ["תיק החתלה", 249, "טיולים", "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80", true],
      ["שמיכת עגלה", 109, "טיולים", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "homecraft",
    name: "Homecraft",
    niche: "home-decor",
    nicheHe: "בית ועיצוב",
    tagline: "חללים שמרגישים בית",
    primary: "#B45309",
    accent: "#F59E0B",
    onPrimary: "#FFFBEB",
    bg: "#FFFBF5",
    bgSoft: "#F7EFE3",
    surface: "#FFFFFF",
    text: "#3F2A14",
    muted: "#8B7355",
    dark: "#1C140C",
    line: "rgba(63,42,20,0.12)",
    font: "Heebo",
    display: "Libre Baskerville",
    heroTitle: "רהיטים ואקססוריז שמעצבים אווירה.",
    heroSubtitle:
      "חנות עיצוב הבית עם קולקציות, סינונים ומוצרים חיים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["תאורה", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"],
      ["טקסטיל", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80"],
      ["רהיטים", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"],
      ["דקור", "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["מנורת קשת", 690, "תאורה", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", true, "עיצוב"],
      ["כריות פשתן", 149, "טקסטיל", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80"],
      ["ספה Nova", 4290, "רהיטים", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80", true],
      ["שולחן צד Oak", 890, "רהיטים", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"],
      ["אגרטל קרמי", 189, "דקור", "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=80"],
      ["מראה קשת", 540, "דקור", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80", false, "נבחר"],
      ["שטיח צמר", 990, "טקסטיל", "https://images.unsplash.com/photo-1600166894406-5f0d6f0e0f1b?auto=format&fit=crop&w=900&q=80", true],
      ["נרות ארומה", 79, "דקור", "https://images.unsplash.com/photo-1602607387756-0b9b0a1b0b0b?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "petora",
    name: "Petora",
    niche: "pet-supplies",
    nicheHe: "ציוד לחיות מחמד",
    tagline: "אהבה בארבע רגליים",
    primary: "#EA580C",
    accent: "#FB923C",
    onPrimary: "#FFF7ED",
    bg: "#FFF8F1",
    bgSoft: "#FFEDD5",
    surface: "#FFFFFF",
    text: "#431407",
    muted: "#9A3412",
    dark: "#1C1917",
    line: "rgba(67,20,7,0.12)",
    font: "Heebo",
    display: "Sora",
    heroTitle: "הכול לכלבים וחתולים — בבחירה מדויקת.",
    heroSubtitle:
      "מזון, צעצועים ואביזרים עם קטגוריות, סינון ומוצרים חיים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["מזון", "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80"],
      ["צעצועים", "https://images.unsplash.com/photo-1535295972055-1c762f4483cb?auto=format&fit=crop&w=900&q=80"],
      ["מיטות", "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"],
      ["טיולים", "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["מזון פרימיום 3ק״ג", 129, "מזון", "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80", true, "אהוב"],
      ["חטיפי אימון", 39, "מזון", "https://images.unsplash.com/photo-1568640347023-5dba3c0d0b0b?auto=format&fit=crop&w=900&q=80"],
      ["כדור חבל", 49, "צעצועים", "https://images.unsplash.com/photo-1535295972055-1c762f4483cb?auto=format&fit=crop&w=900&q=80", true],
      ["עמוד גירוד", 219, "צעצועים", "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80"],
      ["מיטת ענן", 249, "מיטות", "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"],
      ["שמיכת פליז", 89, "מיטות", "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80", false, "רך"],
      ["רצועה רפלקטיבית", 79, "טיולים", "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80", true],
      ["קערת נירוסטה", 59, "טיולים", "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "booknook",
    name: "Booknook",
    niche: "books-stationery",
    nicheHe: "ספרים ומכתבים",
    tagline: "דפים שפותחים עולמות",
    primary: "#1D4ED8",
    accent: "#93C5FD",
    onPrimary: "#EFF6FF",
    bg: "#F8FAFC",
    bgSoft: "#EFF6FF",
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#64748B",
    dark: "#020617",
    line: "rgba(15,23,42,0.12)",
    font: "Heebo",
    display: "Literata",
    heroTitle: "חנות ספרים ומכתבים למי שאוהב לקרוא לאט.",
    heroSubtitle:
      "ספרות, ילדים, מחברות וכלי כתיבה — עם סינון קטגוריות ומוצרים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["ספרות", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"],
      ["ילדים", "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80"],
      ["מחברות", "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80"],
      ["כתיבה", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["רומן השנה", 89, "ספרות", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80", true, "בסטסלר"],
      ["שירה נבחרת", 69, "ספרות", "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80"],
      ["ספר ילדים מאויר", 79, "ילדים", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80", true],
      ["סיפור לפני השינה", 59, "ילדים", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80"],
      ["מחברת פשתן", 45, "מחברות", "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80"],
      ["יומן תכנון", 69, "מחברות", "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80", false, "חדש"],
      ["עט נובע", 129, "כתיבה", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", true],
      ["סט עפרונות", 39, "כתיבה", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "glowlab",
    name: "Glowlab",
    niche: "beauty-cosmetics",
    nicheHe: "קוסמטיקה ויופי",
    tagline: "זוהר שנבנה בשגרה",
    primary: "#BE185D",
    accent: "#F9A8D4",
    onPrimary: "#FFF1F5",
    bg: "#1A0B14",
    bgSoft: "#2A1220",
    surface: "#341828",
    text: "#FFF1F5",
    muted: "#E8A0BF",
    dark: "#0C0509",
    line: "rgba(255,255,255,0.12)",
    font: "Heebo",
    display: "Cormorant Garamond",
    heroTitle: "קוסמטיקה נקייה שנראית כמו סלון יוקרה.",
    heroSubtitle:
      "טיפוח, איפור ואביזרים — חנות מלאה עם קטגוריות וסינונים מהתוסף.",
    heroImage:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["טיפוח", "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80"],
      ["איפור", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80"],
      ["שיער", "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80"],
      ["אביזרים", "https://images.unsplash.com/photo-1631214524020-7e18db5a1df0?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["סרום זוהר", 189, "טיפוח", "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80", true, "VIP"],
      ["קרם לחות", 149, "טיפוח", "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?auto=format&fit=crop&w=900&q=80"],
      ["שפתון Soft Matte", 99, "איפור", "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80", true],
      ["פלטת צלליות", 169, "איפור", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80"],
      ["שמפו בוטני", 79, "שיער", "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80"],
      ["מסכה משקמת", 89, "שיער", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=80", false, "חדש"],
      ["מברשת איפור", 59, "אביזרים", "https://images.unsplash.com/photo-1631214524020-7e18db5a1df0?auto=format&fit=crop&w=900&q=80", true],
      ["מראה כיס", 45, "אביזרים", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "toolhaus",
    name: "Toolhaus",
    niche: "tools-diy",
    nicheHe: "כלי עבודה ו-DIY",
    tagline: "כלים לעבודה מדויקת",
    primary: "#CA8A04",
    accent: "#FACC15",
    onPrimary: "#1C1917",
    bg: "#111827",
    bgSoft: "#1F2937",
    surface: "#243044",
    text: "#F8FAFC",
    muted: "#94A3B8",
    dark: "#030712",
    line: "rgba(255,255,255,0.12)",
    font: "Heebo",
    display: "IBM Plex Sans",
    heroTitle: "כלי עבודה מקצועיים לפרויקט הבא שלכם.",
    heroSubtitle:
      "מקדחות, ארגזים ואביזרי DIY — חנות מלאה עם סינון קטגוריות ומוצרים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["חשמל", "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80"],
      ["ידניים", "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80"],
      ["אחסון", "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80"],
      ["בטיחות", "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["מקדחה Brushless", 690, "חשמל", "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80", true, "Pro"],
      ["משחזת זווית", 420, "חשמל", "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80"],
      ["סט מברגים", 129, "ידניים", "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80", true],
      ["פטיש טיטניום", 99, "ידניים", "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80"],
      ["ארגז כלים", 249, "אחסון", "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80"],
      ["מדפים לסדנה", 319, "אחסון", "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80", false, "חזק"],
      ["משקפי מגן", 49, "בטיחות", "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80", true],
      ["כפפות עבודה", 39, "בטיחות", "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80"],
    ],
  },
  {
    key: "jewelis",
    name: "Jewelis",
    niche: "jewelry-watches",
    nicheHe: "תכשיטים ושעונים",
    tagline: "יוקרה עדינה ליום־יום",
    primary: "#A16207",
    accent: "#E7C873",
    onPrimary: "#1C1408",
    bg: "#0C0A09",
    bgSoft: "#1C1917",
    surface: "#292524",
    text: "#FAF7F0",
    muted: "#A8A29E",
    dark: "#050403",
    line: "rgba(231,200,115,0.2)",
    font: "Heebo",
    display: "Cormorant",
    heroTitle: "תכשיטים ושעונים שנבחרים כמו יצירת אמנות.",
    heroSubtitle:
      "טבעות, שרשראות ושעונים — חנות יוקרה מלאה עם קטגוריות, סינונים ומוצרים מתוסף החנות.",
    heroImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2200&q=88",
    aboutImage:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=88",
    cats: [
      ["טבעות", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"],
      ["שרשראות", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"],
      ["עגילים", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"],
      ["שעונים", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80"],
    ],
    products: [
      ["טבעת Aura", 890, "טבעות", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80", true, "יוקרה"],
      ["טבעת מינימל", 490, "טבעות", "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80"],
      ["שרשרת Pearl", 720, "שרשראות", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80", true],
      ["שרשרת שכבות", 560, "שרשראות", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80"],
      ["עגילי טיפה", 390, "עגילים", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"],
      ["עגילי חישוק", 320, "עגילים", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80", false, "חדש"],
      ["שעון Classic", 1290, "שעונים", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80", true],
      ["שעון Night", 1490, "שעונים", "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80"],
    ],
  },
];

function pascal(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function fontImport(display) {
  const map = {
    "Space Grotesk": "Space+Grotesk:wght@500;600;700",
    Fraunces: "Fraunces:wght@600;700",
    Oswald: "Oswald:wght@500;600;700",
    Nunito: "Nunito:wght@600;700;800",
    "Libre Baskerville": "Libre+Baskerville:wght@400;700",
    Sora: "Sora:wght@500;600;700;800",
    Literata: "Literata:wght@500;600;700",
    "Cormorant Garamond": "Cormorant+Garamond:wght@500;600;700",
    "IBM Plex Sans": "IBM+Plex+Sans:wght@500;600;700",
    Cormorant: "Cormorant:wght@500;600;700",
  };
  return map[display] || "Manrope:wght@600;700;800";
}

function write(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function defaultData(s) {
  const [c1, c2, c3, c4] = s.cats;
  return `export const ${s.key}DefaultData = {
  templateId: "${s.key}",
  name: "${s.name}",
  brandName: "${s.name}",
  logoText: "${s.name.slice(0, 2).toUpperCase()}",
  tagline: ${JSON.stringify(s.tagline)},
  nicheLabel: ${JSON.stringify(s.nicheHe)},
  navHome: "בית",
  navShop: "חנות",
  navProduct: "מוצר",
  navCart: "סל",
  navAbout: "אודות",
  navContact: "צור קשר",
  navFaq: "שאלות",
  navShipping: "משלוחים",
  promoText: ${JSON.stringify(`${s.name} · משלוח מהיר · איסוף עצמי · מוצרים מתוסף החנות`)},
  heroEyebrow: ${JSON.stringify(s.nicheHe)},
  heroTitle: ${JSON.stringify(s.heroTitle)},
  heroSubtitle: ${JSON.stringify(s.heroSubtitle)},
  heroPrimaryButton: "לקולקציה",
  heroSecondaryButton: "הסיפור שלנו",
  heroImage: "${s.heroImage}",
  categoriesEyebrow: "קטגוריות",
  categoriesTitle: "בחרו מסלול קנייה מדויק.",
  categoriesText: "כל קטגוריה מובילה לחנות עם סינון חי על המוצרים מתוסף החנות.",
  catOne: ${JSON.stringify(c1[0])},
  catOneImage: "${c1[1]}",
  catTwo: ${JSON.stringify(c2[0])},
  catTwoImage: "${c2[1]}",
  catThree: ${JSON.stringify(c3[0])},
  catThreeImage: "${c3[1]}",
  catFour: ${JSON.stringify(c4[0])},
  catFourImage: "${c4[1]}",
  productsEyebrow: "נבחרים",
  productsTitle: "מוצרים שמגיעים מתוסף החנות.",
  productsText: "ברגע שתגדירו מוצרים בניהול החנות — הם יופיעו כאן אוטומטית.",
  valueOneTitle: "איכות נבחרת",
  valueOneText: "כל פריט נבחר בקפידה כדי להתאים למותג ולקהל.",
  valueTwoTitle: "קנייה חלקה",
  valueTwoText: "קטגוריות, חיפוש וסינון שמקצרים את הדרך למוצר הנכון.",
  valueThreeTitle: "שירות אנושי",
  valueThreeText: "צוות זמין לשאלות, החלפות והתאמות אישיות.",
  lookbookEyebrow: "ויז׳ואל",
  lookbookTitle: "אווירה שנכנסת לעמוד.",
  lookOne: "${s.heroImage}",
  lookTwo: "${s.aboutImage}",
  lookThree: "${c1[1]}",
  testimonialsEyebrow: "לקוחות",
  testimonialsTitle: "מילים מהשטח.",
  reviewOneName: "נועה כ.",
  reviewOneText: "האתר נראה פרימיום והמוצרים מתעדכנים ישר מהחנות.",
  reviewTwoName: "יואב מ.",
  reviewTwoText: "הסינון לפי קטגוריה חוסך זמן — חוויית קנייה אמיתית.",
  reviewThreeName: "דנה ר.",
  reviewThreeText: "עיצוב מטורף עם תנועה, ובלי לוותר על פונקציונליות.",
  journalEyebrow: "יומן",
  journalTitle: "טיפים והשראה מהתחום.",
  journalOneTitle: "איך בוחרים נכון",
  journalOneText: "מדריך קצר לבחירה חכמה לפי צורך ותקציב.",
  journalTwoTitle: "טרנדים העונה",
  journalTwoText: "מה חם עכשיו ואיך לשלב בלי להגזים.",
  journalThreeTitle: "טיפ מהמומחים",
  journalThreeText: "הרגלים קטנים שמשדרגים את חוויית השימוש.",
  newsletterEyebrow: "ניוזלטר",
  newsletterTitle: "היו ראשונים לדעת על הגעות חדשות.",
  newsletterText: "מבצעים, קולקציות וטיפים ישירות למייל.",
  newsletterButton: "הרשמה",
  shopEyebrow: "החנות",
  shopTitle: "כל המוצרים במקום אחד.",
  shopText: "סננו לפי קטגוריה, חפשו לפי שם ומיינו לפי מחיר — המוצרים נטענים מתוסף החנות.",
  shipBenefit: "משלוח מהיר לכל הארץ",
  returnBenefit: "החזרות עד 14 יום",
  supportBenefit: "שירות לקוחות אנושי",
  secureBenefit: "תשלום מאובטח",
  shopCtaTitle: "צריכים עזרה בבחירה?",
  shopCtaText: "כתבו לנו ונכוון אתכם למוצר המתאים.",
  shopCtaButton: "דברו איתנו",
  aboutEyebrow: "אודות",
  aboutTitle: ${JSON.stringify(`${s.name} — ${s.nicheHe} עם חוויית קנייה מלאה.`)},
  aboutText: ${JSON.stringify(`אנחנו בונים חנות ${s.nicheHe} שמכבדת גם עיצוב וגם תפעול: קטגוריות, סינונים, עמודי מוצר וסל — והכול מחובר לתוסף החנות.`)},
  aboutTextTwo: "המוצרים שמוצגים בתצוגה הם דמו עד שתגדירו את הקטלוג האמיתי בניהול החנות.",
  aboutImage: "${s.aboutImage}",
  productFallbackText: "תיאור המוצר יופיע כאן מתוך תוסף החנות ברגע שתמלאו אותו בניהול.",
  productDetailOne: "חומרים ותועלות מפורטים בעמוד המוצר.",
  productDetailTwo: "אפשרויות משלוח ואיסוף גמישות.",
  productDetailThree: "שאלות? אנחנו כאן בוואטסאפ ובמייל.",
  cartTitle: "הסל שלכם",
  cartText: "בדקו את הפריטים לפני מעבר לתשלום או יצירת קשר.",
  contactEyebrow: "צור קשר",
  contactTitle: "נשמח לעזור בבחירה.",
  contactText: "השאירו פרטים ונחזור עם המלצה מדויקת.",
  contactButton: "שליחת פנייה",
  phone: "03-555-${String(1000 + stores.indexOf(s)).slice(-4)}",
  email: "hello@${s.key}.co.il",
  address: "תל אביב, ישראל",
  faqTitle: "שאלות נפוצות",
  faqText: "תשובות מהירות לפני הקנייה.",
  faqOneQ: "מאיפה מגיעים המוצרים בעמוד?",
  faqOneA: "מהתוסף חנות בניהול העסק — ברגע שמוסיפים מוצרים הם נמשכים אוטומטית.",
  faqTwoQ: "אפשר לסנן לפי קטגוריה?",
  faqTwoA: "כן. בעמוד החנות יש סינון קטגוריות, חיפוש ומיון מחיר.",
  faqThreeQ: "מה מדיניות ההחזרות?",
  faqThreeA: "החזרה תוך 14 יום למוצרים שלא נעשה בהם שימוש, בהתאם לתנאי החנות.",
  faqFourQ: "יש משלוחים לכל הארץ?",
  faqFourA: "כן, עם אפשרות איסוף עצמי בתיאום מראש.",
  faqFiveQ: "איך מעדכנים מחירים?",
  faqFiveA: "דרך מסך ניהול המוצרים בתוסף החנות — האתר מתעדכן בהתאם.",
  shippingTitle: "משלוחים והחזרות",
  shippingText: "שקיפות מלאה לגבי זמני אספקה וטיפול בהחזרות.",
  shipOneTitle: "משלוח רגיל",
  shipOneText: "2–5 ימי עסקים לכל הארץ.",
  shipTwoTitle: "משלוח מהיר",
  shipTwoText: "עד 24–48 שעות באזורי כיסוי.",
  shipThreeTitle: "איסוף עצמי",
  shipThreeText: "תיאום מראש מהסניף / המחסן.",
  shipFourTitle: "החזרות",
  shipFourText: "תהליך פשוט דרך יצירת קשר תוך 14 יום.",
  ctaTitle: "מוכנים להתחיל לקנות?",
  ctaText: "עברו לחנות, סננו לפי קטגוריה ובחרו את המוצר הבא.",
  ctaButton: "לעמוד החנות",
  footerText: ${JSON.stringify(`חנות ${s.nicheHe} מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.`)},
};

export const ${s.key}DemoProducts = [
${s.products
  .map(
    ([name, price, category, image, featured, badge]) => `  {
    name: ${JSON.stringify(name)},
    price: ${price},
    category: ${JSON.stringify(category)},
    image: "${image}",
    shortDescription: ${JSON.stringify(`מוצר ${category} מתוך קטלוג ${s.name}.`)},
    featured: ${Boolean(featured)},
${badge ? `    badge: ${JSON.stringify(badge)},` : ""}
  },`,
  )
  .join("\n")}
];
`;
}

function editorCss(s) {
  return `export const ${s.key}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?family=${fontImport(s.display)}&family=Heebo:wght@400;500;600;700;800;900&display=swap');
[data-template-id="${s.key}"], [data-template-id="${s.key}-preview"] {
  --p: ${s.primary};
  --accent: ${s.accent};
  --on-p: ${s.onPrimary};
  --bg: ${s.bg};
  --bg-soft: ${s.bgSoft};
  --surface: ${s.surface};
  --text: ${s.text};
  --muted: ${s.muted};
  --dark: ${s.dark};
  --line: ${s.line};
  font-family: "${s.font}", sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 100% -10%, ${s.primary}22, transparent 55%),
    radial-gradient(900px 500px at 0% 100%, ${s.accent}18, transparent 50%),
    var(--bg);
  text-align: right;
}
[data-template-id="${s.key}"] .store-display,
[data-template-id="${s.key}-preview"] .store-display {
  font-family: "${s.display}", "${s.font}", serif;
}
[data-template-id="${s.key}"] .store-card,
[data-template-id="${s.key}-preview"] .store-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms ease, border-color 420ms ease;
}
[data-template-id="${s.key}"] .store-card:hover,
[data-template-id="${s.key}-preview"] .store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  border-color: var(--p);
}
[data-template-id="${s.key}"] .store-marquee,
[data-template-id="${s.key}-preview"] .store-marquee {
  animation: ${s.key}-marquee 22s linear infinite;
}
[data-template-id="${s.key}"] .store-kenburns,
[data-template-id="${s.key}-preview"] .store-kenburns {
  animation: ${s.key}-kenburns 18s ease-in-out infinite alternate;
}
[data-template-id="${s.key}"] .store-float-a,
[data-template-id="${s.key}-preview"] .store-float-a { animation: ${s.key}-float 7s ease-in-out infinite; }
[data-template-id="${s.key}"] .store-float-b,
[data-template-id="${s.key}-preview"] .store-float-b { animation: ${s.key}-float 8.5s ease-in-out infinite reverse; }
[data-template-id="${s.key}"] .store-float-c,
[data-template-id="${s.key}-preview"] .store-float-c { animation: ${s.key}-float 6.5s ease-in-out infinite 0.4s; }
[data-template-id="${s.key}"] .store-logo,
[data-template-id="${s.key}-preview"] .store-logo {
  box-shadow: 0 0 0 0 ${s.primary}66;
  animation: ${s.key}-pulse 2.8s ease-out infinite;
}
@keyframes ${s.key}-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes ${s.key}-kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
}
@keyframes ${s.key}-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes ${s.key}-pulse {
  0% { box-shadow: 0 0 0 0 ${s.primary}66; }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="${s.key}"] .store-marquee,
  [data-template-id="${s.key}"] .store-kenburns,
  [data-template-id="${s.key}"] .store-float-a,
  [data-template-id="${s.key}"] .store-float-b,
  [data-template-id="${s.key}"] .store-float-c,
  [data-template-id="${s.key}"] .store-logo,
  [data-template-id="${s.key}-preview"] .store-marquee,
  [data-template-id="${s.key}-preview"] .store-kenburns,
  [data-template-id="${s.key}-preview"] .store-float-a,
  [data-template-id="${s.key}-preview"] .store-float-b,
  [data-template-id="${s.key}-preview"] .store-float-c,
  [data-template-id="${s.key}-preview"] .store-logo {
    animation: none !important;
  }
}
\`;
`;
}

function pagesTsx(s) {
  const P = pascal(s.key);
  return `import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { ${s.key}DefaultData, ${s.key}DemoProducts } from "./defaultData";
import { ${s.key}EditorCss } from "./editorCss";

export const ${s.key}Pages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function ${P}Pages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="${s.key}"
      defaultData={${s.key}DefaultData}
      editorCss={${s.key}EditorCss}
      demoProducts={${s.key}DemoProducts}
      pages={${s.key}Pages}
    />
  );
}
`;
}

function metaTs(s) {
  const P = pascal(s.key);
  return `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${s.key}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${s.key}EditorCss } from "./editorCss";
import { ${s.key}Schema } from "./schema";
import { ${s.key}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${s.primary}",
  secondary: "${s.dark}",
  accent: "${s.accent}",
  background: "${s.bg}",
  surface: "${s.surface}",
  text: "${s.text}",
  muted: "${s.muted}",
  dark: "${s.dark}",
};

export const ${s.key}Seed = {
  id: "${s.key}",
  key: "${s.key}",
  name: "${s.name}",
  title: "${s.name}",
  description: "חנות ${s.nicheHe} מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות.",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  niche: "${s.niche}",
  layout: "full-store",
  image: (${s.key}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${s.key}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${s.key}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "${s.key}-header", title: "Header" },
    { type: "hero", variant: "${s.key}-hero", title: "Hero" },
    { type: "categories", variant: "${s.key}-categories", title: "Categories" },
    { type: "store", variant: "${s.key}-products", title: "Products" },
    { type: "gallery", variant: "${s.key}-lookbook", title: "Lookbook" },
    { type: "testimonials", variant: "${s.key}-reviews", title: "Testimonials" },
    { type: "faq", variant: "${s.key}-faq", title: "FAQ" },
    { type: "contact", variant: "${s.key}-contact", title: "Contact" },
    { type: "footer", variant: "${s.key}-footer", title: "Footer" },
  ].map((block, index) => ({ id: \`${s.key}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${s.key}Pages,
  editor: { pages: ${s.key}Pages, css: ${s.key}EditorCss },
  css: ${s.key}EditorCss,
  data: ${s.key}DefaultData,
  defaultData: ${s.key}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${s.key}Template = {
  id: "${s.key}",
  key: "${s.key}",
  name: "${s.name}",
  title: "${s.name}",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "store",
  categoryLabel: "חנויות ומסחר",
  badge: "חדש",
  description: "חנות ${s.nicheHe} מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות.",
  thumbnail: React.createElement(${P}Thumbnail),
  preview: React.createElement(${P}Preview),
  component: ${P}Pages,
  Component: ${P}Pages,
  seed: ${s.key}Seed,
  pages: ${s.key}Pages,
  editorCss: ${s.key}EditorCss,
  schema: ${s.key}Schema,
  defaultData: ${s.key}DefaultData,
  renderer: {
    key: "${s.key}",
    name: "${s.name}",
    Component: ${P}Pages,
    component: ${P}Pages,
    pages: ${s.key}Pages,
    editorMode: "visual-react",
    editorCss: ${s.key}EditorCss,
    schema: ${s.key}Schema,
    defaultData: ${s.key}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${s.key}Template;
`;
}

function schemaTs(s) {
  return `export const ${s.key}Schema = {
  templateId: "${s.key}",
  name: "${s.name}",
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
`;
}

function previewTsx(s) {
  const P = pascal(s.key);
  return `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${s.key}-preview" className="min-h-screen w-full overflow-x-hidden">
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function thumbnailTsx(s) {
  const P = pascal(s.key);
  return `import React from "react";

export default function ${P}Thumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "${s.bg}", color: "${s.text}", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: \`radial-gradient(circle at 80% 20%, ${s.primary}66, transparent 45%)\` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "${s.primary}", color: "${s.onPrimary}" }}>${s.nicheHe}</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "${s.display}, serif" }}>${s.name}</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">${s.tagline}</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "מוצר", "סל", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "${s.primary}55", background: "${s.surface}" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
`;
}

for (const s of stores) {
  const dir = path.join(templatesDir, s.key);
  write(path.join(dir, "defaultData.ts"), defaultData(s));
  write(path.join(dir, "editorCss.ts"), editorCss(s));
  write(path.join(dir, "pages.tsx"), pagesTsx(s));
  write(path.join(dir, "meta.ts"), metaTs(s));
  write(path.join(dir, "schema.ts"), schemaTs(s));
  write(path.join(dir, "preview.tsx"), previewTsx(s));
  write(path.join(dir, "thumbnail.tsx"), thumbnailTsx(s));
  console.log("created", s.key);
}

// Wire index.ts
const indexPath = path.join(templatesDir, "index.ts");
let index = fs.readFileSync(indexPath, "utf8");
const importBlock = stores
  .map((s) => `import { ${s.key}Template } from "./${s.key}/meta";`)
  .join("\n");
const entryBlock = stores.map((s) => `  ${s.key}Template,`).join("\n");

if (!index.includes("lumenwareTemplate")) {
  index = index.replace(
    'import { narrativaTemplate } from "./narrativa/meta";',
    'import { narrativaTemplate } from "./narrativa/meta";\n' + importBlock,
  );
  index = index.replace(
    "  narrativaTemplate,\n];",
    "  narrativaTemplate,\n" + entryBlock + "\n];",
  );
  fs.writeFileSync(indexPath, index, "utf8");
  console.log("index.ts updated");
}

// Wire registry
const regPath = path.join(templatesDir, "templateRendererRegistry.ts");
let reg = fs.readFileSync(regPath, "utf8");
if (!reg.includes('from "./lumenware/pages"')) {
  const regImports = stores
    .map((s) => {
      const P = pascal(s.key);
      return `
import ${P}Pages, { ${s.key}Pages } from "./${s.key}/pages";
import { ${s.key}EditorCss } from "./${s.key}/editorCss";
import { ${s.key}Schema } from "./${s.key}/schema";
import { ${s.key}DefaultData } from "./${s.key}/defaultData";
`;
    })
    .join("");

  // Append imports near narrativa imports if present, else before createRenderer usage block end of imports
  if (reg.includes('from "./narrativa/defaultData"')) {
    reg = reg.replace(
      'import { narrativaDefaultData } from "./narrativa/defaultData";',
      'import { narrativaDefaultData } from "./narrativa/defaultData";' +
        regImports,
    );
  } else {
    reg = reg.replace(
      "function normalizeTemplateKey",
      regImports + "\nfunction normalizeTemplateKey",
    );
  }

  const regEntries = stores
    .map((s) => {
      const P = pascal(s.key);
      return `  ${s.key}: createRenderer({
    key: "${s.key}",
    name: "${s.name}",
    Component: ${P}Pages,
    pages: ${s.key}Pages,
    editorMode: "visual-react",
    schema: ${s.key}Schema as unknown as StudioTemplateRenderer["schema"],
    defaultData: ${s.key}DefaultData as unknown as Record<string, any>,
    editorCss: ${s.key}EditorCss,
  }),
`;
    })
    .join("\n");

  reg = reg.replace(
    `  narrativa: createRenderer({
    key: "narrativa",
    name: "Narrativa",
    Component: NarrativaPages,
    pages: narrativaPages,
    editorMode: "visual-react",
    schema: narrativaSchema as unknown as StudioTemplateRenderer["schema"],
    defaultData: narrativaDefaultData as unknown as Record<string, any>,
    editorCss: narrativaEditorCss,
  }),
};`,
    `  narrativa: createRenderer({
    key: "narrativa",
    name: "Narrativa",
    Component: NarrativaPages,
    pages: narrativaPages,
    editorMode: "visual-react",
    schema: narrativaSchema as unknown as StudioTemplateRenderer["schema"],
    defaultData: narrativaDefaultData as unknown as Record<string, any>,
    editorCss: narrativaEditorCss,
  }),
${regEntries}
};`,
  );

  fs.writeFileSync(regPath, reg, "utf8");
  console.log("registry updated");
}

console.log("done", stores.length);
