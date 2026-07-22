import {
  absoluteLayout,
  boxNode,
  buttonNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import type { VisualLibraryNodeTemplate } from "./visualLibraryTypes";

export type PageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  secondaryCta?: string;
  image: string;
  imageAlt?: string;
  items?: Array<{ title: string; copy: string; meta?: string }>;
  stats?: Array<{ value: string; label: string }>;
};

export type ShowcaseTheme = {
  ink: string;
  accent: string;
  muted: string;
  surface: string;
  surfaceAlt: string;
  soft: string;
  radius: string;
  sharpRadius: string;
  titleSize: string;
  titleWeight: string;
  letterSpacing: string;
};

export type Geometry = {
  ox: number;
  oy: number;
  gap: number;
  cardW: number;
  cardH: number;
};

export function btn(
  theme: ShowcaseTheme,
  variant: "solid" | "ghost" | "soft" = "solid",
) {
  if (variant === "ghost") {
    return {
      color: theme.ink,
      backgroundColor: "transparent",
      border: `2px solid ${theme.ink}`,
      borderRadius: theme.sharpRadius,
      padding: "13px 24px",
      fontSize: "14px",
      fontWeight: "700",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
    };
  }
  if (variant === "soft") {
    return {
      color: theme.accent,
      backgroundColor: theme.soft,
      border: "none",
      borderRadius: theme.radius,
      padding: "13px 24px",
      fontSize: "14px",
      fontWeight: "700",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
    };
  }
  return {
    color: "#ffffff",
    backgroundColor: theme.accent,
    border: "none",
    borderRadius: theme.sharpRadius,
    padding: "13px 24px",
    fontSize: "14px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  };
}

function L(
  g: Geometry,
  x: number,
  y: number,
  w: string | number,
  h?: string | number,
  z = 10,
) {
  return absoluteLayout(x + g.ox, y + g.oy, w, h, z);
}

export type PatternFn = (
  content: PageContent,
  theme: ShowcaseTheme,
  g: Geometry,
) => VisualLibraryNodeTemplate[];

/** Left copy + tall right media + 3 bottom cards */
export const patternSplitHero: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  const stats = content.stats || [];
  return [
    boxNode("rail", { backgroundColor: theme.accent }, L(g, 0, 0, "12px", "1580px", 2)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 56, 64, "420px", "24px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: theme.titleSize, fontWeight: theme.titleWeight, letterSpacing: theme.letterSpacing, lineHeight: "0.98", whiteSpace: "pre-line" }, L(g, 50, 100, "500px", "180px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "17px", lineHeight: "1.65" }, L(g, 56, 300, "460px", "90px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 56, 410, "190px", "50px", 20)),
    ...(content.secondaryCta ? [buttonNode("cta2", content.secondaryCta, btn(theme, "ghost"), L(g, 260, 410, "170px", "50px", 20))] : []),
    imageNode("hero", content.image, { borderRadius: theme.sharpRadius, objectFit: "cover" }, L(g, 580, 0, "520px", "600px", 8), content.imageAlt || content.title),
    ...items.slice(0, 3).flatMap((item, i) => {
      const x = 56 + i * (g.cardW + g.gap);
      return [
        boxNode(`card-${i}`, { backgroundColor: i === 0 ? theme.ink : theme.surfaceAlt, borderRadius: theme.sharpRadius }, L(g, x, 660, `${g.cardW}px`, `${g.cardH}px`, 5)),
        textNode(`card-t-${i}`, item.title, { color: i === 0 ? "#fff" : theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, x + 22, 700, `${g.cardW - 44}px`, "40px", 20)),
        textNode(`card-c-${i}`, item.copy, { color: i === 0 ? "rgba(255,255,255,.75)" : theme.muted, fontSize: "14px", lineHeight: "1.55" }, L(g, x + 22, 760, `${g.cardW - 44}px`, "80px", 20)),
      ];
    }),
    ...stats.slice(0, 3).flatMap((st, i) => {
      const x = 56 + i * (g.cardW + g.gap);
      return [
        textNode(`sv-${i}`, st.value, { color: theme.accent, fontSize: "48px", fontWeight: "900", letterSpacing: "-0.04em" }, L(g, x, 960, "280px", "56px", 20)),
        textNode(`sl-${i}`, st.label, { color: theme.ink, fontSize: "14px", fontWeight: "700" }, L(g, x, 1025, "280px", "28px", 20)),
      ];
    }),
    boxNode("footer-bar", { backgroundColor: theme.ink }, L(g, 0, 1120, "1100px", "300px", 1)),
    textNode("footer-t", "מוכנים להתחיל?", { color: "#fff", fontSize: "34px", fontWeight: "800" }, L(g, 56, 1200, "480px", "48px", 20)),
    buttonNode("footer-cta", content.cta, btn(theme), L(g, 56, 1280, "200px", "50px", 20)),
    imageNode("footer-img", content.image, { borderRadius: theme.sharpRadius, objectFit: "cover" }, L(g, 620, 1170, "400px", "210px", 8), "תצוגה"),
  ];
};

/** Centered editorial opening with large media */
export const patternCenterEditorial: PatternFn = (content, theme, g) => [
  textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "13px", fontWeight: "700", letterSpacing: "0.28em", textAlign: "center" }, L(g, 300, 70, "500px", "24px", 20)),
  textNode("title", content.title, { color: theme.ink, fontSize: "64px", fontWeight: "700", letterSpacing: "-0.04em", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.05" }, L(g, 180, 120, "740px", "150px", 20)),
  textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "18px", textAlign: "center", lineHeight: "1.6" }, L(g, 260, 290, "580px", "70px", 20)),
  buttonNode("cta", content.cta, btn(theme, "soft"), L(g, 430, 380, "220px", "52px", 20)),
  imageNode("hero", content.image, { borderRadius: "28px", objectFit: "cover" }, L(g, 160, 470, "780px", "420px", 8), content.imageAlt || content.title),
  ...(content.items || []).slice(0, 3).flatMap((item, i) => {
    const x = 160 + i * 270;
    return [
      textNode(`it-${i}`, item.title, { color: theme.ink, fontSize: "20px", fontWeight: "800", textAlign: "center" }, L(g, x, 940, "240px", "36px", 20)),
      textNode(`ic-${i}`, item.copy, { color: theme.muted, fontSize: "14px", textAlign: "center", lineHeight: "1.5" }, L(g, x, 985, "240px", "50px", 20)),
    ];
  }),
  boxNode("rule", { backgroundColor: theme.soft }, L(g, 200, 1080, "700px", "2px", 5)),
  ...(content.stats || []).slice(0, 4).flatMap((st, i) => {
    const x = 180 + i * 190;
    return [
      textNode(`sv-${i}`, st.value, { color: theme.accent, fontSize: "36px", fontWeight: "800", textAlign: "center" }, L(g, x, 1130, "160px", "44px", 20)),
      textNode(`sl-${i}`, st.label, { color: theme.ink, fontSize: "13px", fontWeight: "600", textAlign: "center" }, L(g, x, 1180, "160px", "28px", 20)),
    ];
  }),
];

/** Bold magazine collage */
export const patternMagazine: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    imageNode("a", content.image, { borderRadius: "0px", objectFit: "cover", filter: "grayscale(1)" }, L(g, 40, 40, "420px", "320px", 8), "A"),
    imageNode("b", content.image, { borderRadius: "0px", objectFit: "cover" }, L(g, 480, 40, "280px", "200px", 8), "B"),
    imageNode("c", content.image, { borderRadius: "0px", objectFit: "cover", filter: "grayscale(1)" }, L(g, 780, 40, "280px", "320px", 8), "C"),
    imageNode("d", content.image, { borderRadius: "0px", objectFit: "cover" }, L(g, 480, 260, "280px", "100px", 8), "D"),
    boxNode("band", { backgroundColor: theme.ink }, L(g, 40, 400, "1020px", "280px", 5)),
    textNode("eyebrow", content.eyebrow, { color: "rgba(255,255,255,.55)", fontSize: "12px", fontWeight: "800", letterSpacing: "0.24em" }, L(g, 70, 440, "400px", "22px", 20)),
    textNode("title", content.title, { color: "#fff", fontSize: "56px", fontWeight: "900", letterSpacing: "-0.05em", whiteSpace: "pre-line", lineHeight: "0.95" }, L(g, 70, 480, "620px", "140px", 20)),
    buttonNode("cta", content.cta, { ...btn(theme), backgroundColor: "#fff", color: theme.ink, borderRadius: "0px" }, L(g, 70, 640, "180px", "48px", 20)),
    ...items.slice(0, 4).flatMap((item, i) => {
      const y = 720 + i * 90;
      return [
        textNode(`n-${i}`, item.meta || `0${i + 1}`, { color: theme.accent, fontSize: "18px", fontWeight: "900" }, L(g, 70, y, "60px", "28px", 20)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, 140, y, "400px", "28px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px" }, L(g, 560, y, "480px", "28px", 20)),
      ];
    }),
  ];
};

/** Colorful 2x3 card grid */
export const patternColorCards: PatternFn = (content, theme, g) => {
  const accents = [theme.accent, "#e11d48", "#7c3aed", "#059669", "#ea580c", "#0891b2"];
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 50, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "52px", fontWeight: "800", letterSpacing: "-0.04em", whiteSpace: "pre-line", lineHeight: "1" }, L(g, 60, 90, "700px", "120px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "16px", lineHeight: "1.55" }, L(g, 60, 230, "520px", "60px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 310, "200px", "50px", 20)),
    ...items.slice(0, 6).flatMap((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 60 + col * 340;
      const y = 400 + row * 280;
      return [
        boxNode(`c-${i}`, { backgroundColor: "#fff", borderRadius: "18px", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }, L(g, x, y, "310px", "250px", 5)),
        boxNode(`bar-${i}`, { backgroundColor: accents[i % accents.length], borderRadius: "18px 18px 0 0" }, L(g, x, y, "310px", "10px", 6)),
        boxNode(`dot-${i}`, { backgroundColor: accents[i % accents.length], borderRadius: "999px" }, L(g, x + 24, y + 36, "36px", "36px", 7)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, x + 24, y + 90, "260px", "36px", 20)),
        textNode(`p-${i}`, item.copy, { color: theme.muted, fontSize: "14px", lineHeight: "1.5" }, L(g, x + 24, y + 140, "260px", "70px", 20)),
      ];
    }),
  ];
};

/** Vertical process timeline + media */
export const patternTimeline: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.22em" }, L(g, 60, 50, "360px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "54px", fontWeight: "800", letterSpacing: "-0.04em", whiteSpace: "pre-line", lineHeight: "1" }, L(g, 60, 90, "520px", "130px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "16px", lineHeight: "1.55" }, L(g, 60, 240, "480px", "60px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 320, "200px", "50px", 20)),
    boxNode("axis", { backgroundColor: theme.accent }, L(g, 90, 420, "4px", "900px", 4)),
    ...items.slice(0, 5).flatMap((item, i) => {
      const y = 430 + i * 170;
      return [
        boxNode(`dot-${i}`, { backgroundColor: theme.accent, borderRadius: "999px" }, L(g, 78, y + 8, "28px", "28px", 6)),
        textNode(`meta-${i}`, item.meta || `0${i + 1}`, { color: theme.accent, fontSize: "13px", fontWeight: "800" }, L(g, 130, y, "80px", "22px", 20)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "24px", fontWeight: "800" }, L(g, 130, y + 28, "360px", "36px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px" }, L(g, 130, y + 70, "360px", "40px", 20)),
      ];
    }),
    imageNode("side", content.image, { borderRadius: "24px", objectFit: "cover" }, L(g, 580, 420, "460px", "700px", 8), content.imageAlt || content.title),
  ];
};

/** Dark metrics board */
export const patternDarkStats: PatternFn = (content, theme, g) => {
  const stats = content.stats || [];
  const items = content.items || [];
  return [
    boxNode("bg", { backgroundColor: theme.ink }, L(g, 0, 0, "1100px", "1500px", 1)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.22em" }, L(g, 60, 60, "400px", "22px", 20)),
    textNode("title", content.title, { color: "#fff", fontSize: "58px", fontWeight: "800", letterSpacing: "-0.05em", whiteSpace: "pre-line", lineHeight: "0.98" }, L(g, 60, 110, "700px", "140px", 20)),
    textNode("subtitle", content.subtitle, { color: "rgba(255,255,255,.65)", fontSize: "17px", lineHeight: "1.55" }, L(g, 60, 280, "560px", "70px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 370, "200px", "50px", 20)),
    ...stats.slice(0, 4).flatMap((st, i) => {
      const x = 60 + i * 250;
      return [
        textNode(`sv-${i}`, st.value, { color: theme.accent, fontSize: "56px", fontWeight: "900", letterSpacing: "-0.05em" }, L(g, x, 480, "220px", "64px", 20)),
        textNode(`sl-${i}`, st.label, { color: "rgba(255,255,255,.7)", fontSize: "14px", fontWeight: "600" }, L(g, x, 550, "220px", "28px", 20)),
      ];
    }),
    boxNode("panel", { backgroundColor: "rgba(255,255,255,.06)", borderRadius: "20px" }, L(g, 60, 640, "980px", "520px", 4)),
    imageNode("chart", content.image, { borderRadius: "16px", objectFit: "cover", opacity: "0.9" }, L(g, 90, 680, "920px", "280px", 8), "מדדים"),
    ...items.slice(0, 3).flatMap((item, i) => {
      const x = 90 + i * 310;
      return [
        textNode(`t-${i}`, item.title, { color: "#fff", fontSize: "20px", fontWeight: "800" }, L(g, x, 1000, "280px", "32px", 20)),
        textNode(`c-${i}`, item.copy, { color: "rgba(255,255,255,.55)", fontSize: "14px" }, L(g, x, 1040, "280px", "40px", 20)),
      ];
    }),
  ];
};

/** Cinematic full-bleed dark */
export const patternCinematic: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    imageNode("bg", content.image, { borderRadius: "0px", objectFit: "cover" }, L(g, 0, 0, "1100px", "700px", 2), content.imageAlt || content.title),
    boxNode("veil", { backgroundColor: "rgba(9,9,11,0.62)" }, L(g, 0, 0, "1100px", "700px", 3)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.28em" }, L(g, 70, 180, "500px", "22px", 20)),
    textNode("title", content.title, { color: "#fff", fontSize: "64px", fontWeight: "800", letterSpacing: "-0.05em", whiteSpace: "pre-line", lineHeight: "0.96" }, L(g, 70, 230, "760px", "160px", 20)),
    buttonNode("cta", content.cta, { ...btn(theme), backgroundColor: theme.accent, color: theme.ink }, L(g, 70, 430, "210px", "52px", 20)),
    ...items.slice(0, 3).flatMap((item, i) => {
      const y = 760 + i * 140;
      return [
        boxNode(`line-${i}`, { backgroundColor: theme.accent }, L(g, 70, y, "42px", "2px", 5)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "26px", fontWeight: "700" }, L(g, 70, y + 18, "700px", "36px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px" }, L(g, 70, y + 62, "800px", "40px", 20)),
      ];
    }),
  ];
};

/** Soft lifestyle with giant rounded image */
export const patternLifestyle: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    imageNode("hero", content.image, { borderRadius: "40px", objectFit: "cover" }, L(g, 40, 40, "1020px", "440px", 8), content.imageAlt || content.title),
    boxNode("pill", { backgroundColor: "#fff", borderRadius: "999px" }, L(g, 380, 420, "340px", "54px", 12)),
    textNode("pill-t", content.eyebrow, { color: theme.accent, fontSize: "13px", fontWeight: "800", letterSpacing: "0.16em", textAlign: "center" }, L(g, 380, 435, "340px", "24px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "56px", fontWeight: "700", letterSpacing: "-0.04em", textAlign: "center", whiteSpace: "pre-line" }, L(g, 160, 520, "780px", "120px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "17px", textAlign: "center", lineHeight: "1.55" }, L(g, 250, 670, "600px", "60px", 20)),
    buttonNode("cta", content.cta, btn(theme, "soft"), L(g, 430, 760, "220px", "52px", 20)),
    ...items.slice(0, 3).flatMap((item, i) => {
      const x = 120 + i * 300;
      return [
        boxNode(`c-${i}`, { backgroundColor: "#fff", borderRadius: "24px" }, L(g, x, 880, "270px", "200px", 5)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "20px", fontWeight: "800", textAlign: "center" }, L(g, x + 20, 930, "230px", "36px", 20)),
        textNode(`p-${i}`, item.copy, { color: theme.muted, fontSize: "14px", textAlign: "center" }, L(g, x + 20, 980, "230px", "50px", 20)),
      ];
    }),
  ];
};

/** Numbered list + dominant media */
export const patternListMedia: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 50, "360px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "50px", fontWeight: "800", letterSpacing: "-0.04em", whiteSpace: "pre-line", lineHeight: "1" }, L(g, 60, 90, "480px", "130px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "16px", lineHeight: "1.55" }, L(g, 60, 240, "440px", "60px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 320, "190px", "50px", 20)),
    ...items.slice(0, 5).flatMap((item, i) => {
      const y = 420 + i * 110;
      return [
        textNode(`n-${i}`, item.meta || `0${i + 1}`, { color: theme.accent, fontSize: "28px", fontWeight: "900" }, L(g, 60, y, "70px", "40px", 20)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, 140, y, "360px", "34px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "14px" }, L(g, 140, y + 38, "360px", "36px", 20)),
        boxNode(`rule-${i}`, { backgroundColor: theme.soft }, L(g, 60, y + 90, "440px", "1px", 4)),
      ];
    }),
    imageNode("media", content.image, { borderRadius: theme.radius, objectFit: "cover" }, L(g, 560, 90, "480px", "980px", 8), content.imageAlt || content.title),
  ];
};

/** Conversion form panel */
export const patternFormPanel: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 70, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "54px", fontWeight: "800", letterSpacing: "-0.04em", whiteSpace: "pre-line", lineHeight: "1" }, L(g, 60, 110, "520px", "140px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "17px", lineHeight: "1.55" }, L(g, 60, 280, "480px", "70px", 20)),
    ...items.slice(0, 3).flatMap((item, i) => {
      const y = 380 + i * 70;
      return [
        boxNode(`check-${i}`, { backgroundColor: theme.accent, borderRadius: "6px" }, L(g, 60, y + 6, "18px", "18px", 5)),
        textNode(`t-${i}`, `${item.title} — ${item.copy}`, { color: theme.ink, fontSize: "16px", fontWeight: "600" }, L(g, 95, y, "440px", "30px", 20)),
      ];
    }),
    boxNode("form", { backgroundColor: "#fff", borderRadius: "24px", border: `3px solid ${theme.accent}` }, L(g, 580, 80, "460px", "620px", 6)),
    textNode("form-t", "השאירו פרטים", { color: theme.ink, fontSize: "28px", fontWeight: "800" }, L(g, 620, 120, "380px", "40px", 20)),
    boxNode("f1", { backgroundColor: theme.surfaceAlt, borderRadius: "12px" }, L(g, 620, 190, "380px", "54px", 7)),
    boxNode("f2", { backgroundColor: theme.surfaceAlt, borderRadius: "12px" }, L(g, 620, 270, "380px", "54px", 7)),
    boxNode("f3", { backgroundColor: theme.surfaceAlt, borderRadius: "12px" }, L(g, 620, 350, "380px", "120px", 7)),
    buttonNode("cta", content.cta, btn(theme), L(g, 620, 510, "380px", "54px", 20)),
    ...(content.secondaryCta ? [buttonNode("cta2", content.secondaryCta, btn(theme, "ghost"), L(g, 620, 580, "380px", "50px", 20))] : []),
    imageNode("side", content.image, { borderRadius: "20px", objectFit: "cover" }, L(g, 60, 640, "480px", "420px", 8), content.imageAlt || content.title),
  ];
};

/** Irregular masonry for galleries */
export const patternMasonry: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  const tiles = [
    { x: 40, y: 40, w: 360, h: 420 },
    { x: 420, y: 40, w: 320, h: 250 },
    { x: 760, y: 40, w: 300, h: 320 },
    { x: 420, y: 310, w: 320, h: 280 },
    { x: 760, y: 380, w: 300, h: 210 },
    { x: 40, y: 480, w: 360, h: 240 },
  ];
  return [
    ...tiles.map((t, i) =>
      imageNode(`tile-${i}`, content.image, { borderRadius: i % 2 ? "28px" : "8px", objectFit: "cover" }, L(g, t.x, t.y, `${t.w}px`, `${t.h}px`, 8), items[i]?.title || `עבודה ${i + 1}`),
    ),
    boxNode("caption", { backgroundColor: theme.ink }, L(g, 40, 760, "1020px", "220px", 5)),
    textNode("title", content.title, { color: "#fff", fontSize: "42px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 80, 800, "700px", "100px", 20)),
    buttonNode("cta", content.cta, { ...btn(theme), borderRadius: "0px" }, L(g, 80, 920, "200px", "48px", 20)),
    textNode("sub", content.subtitle, { color: "rgba(255,255,255,.65)", fontSize: "15px" }, L(g, 320, 930, "600px", "40px", 20)),
  ];
};

/** Horizontal filmstrip */
export const patternFilmstrip: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.24em" }, L(g, 50, 40, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "48px", fontWeight: "800", whiteSpace: "pre-line", letterSpacing: "-0.04em" }, L(g, 50, 80, "900px", "110px", 20)),
    ...[0, 1, 2, 3, 4].map((i) =>
      imageNode(`f-${i}`, content.image, { borderRadius: "0px", objectFit: "cover", border: `4px solid ${theme.ink}` }, L(g, 40 + i * 210, 230, "195px", "260px", 8), items[i]?.title || `פריים ${i + 1}`),
    ),
    boxNode("strip", { backgroundColor: theme.accent }, L(g, 40, 510, "1020px", "12px", 4)),
    ...items.slice(0, 4).flatMap((item, i) => {
      const x = 50 + i * 260;
      return [
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "20px", fontWeight: "800" }, L(g, x, 560, "230px", "32px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "14px" }, L(g, x, 600, "230px", "50px", 20)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 50, 720, "220px", "52px", 20)),
    imageNode("feature", content.image, { borderRadius: "16px", objectFit: "cover" }, L(g, 320, 700, "720px", "360px", 8), content.imageAlt || content.title),
  ];
};

/** Three big package/tier columns */
export const patternPackageTiers: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  const accents = [theme.surfaceAlt, theme.ink, theme.soft];
  const textColors = [theme.ink, "#fff", theme.ink];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em", textAlign: "center" }, L(g, 300, 40, "500px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "50px", fontWeight: "800", textAlign: "center", whiteSpace: "pre-line" }, L(g, 180, 80, "740px", "110px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "16px", textAlign: "center" }, L(g, 260, 210, "580px", "50px", 20)),
    ...[0, 1, 2].flatMap((i) => {
      const x = 60 + i * 340;
      const item = items[i] || { title: `חבילה ${i + 1}`, copy: "פירוט החבילה." };
      return [
        boxNode(`tier-${i}`, { backgroundColor: accents[i], borderRadius: "28px", border: i === 1 ? `3px solid ${theme.accent}` : "none" }, L(g, x, 300, "310px", "520px", 5)),
        textNode(`name-${i}`, item.title, { color: textColors[i], fontSize: "28px", fontWeight: "800", textAlign: "center" }, L(g, x + 20, 360, "270px", "40px", 20)),
        textNode(`copy-${i}`, item.copy, { color: i === 1 ? "rgba(255,255,255,.75)" : theme.muted, fontSize: "15px", textAlign: "center", lineHeight: "1.55" }, L(g, x + 30, 430, "250px", "120px", 20)),
        textNode(`price-${i}`, (content.stats || [])[i]?.value || "₪—", { color: i === 1 ? theme.accent : theme.ink, fontSize: "42px", fontWeight: "900", textAlign: "center" }, L(g, x + 20, 580, "270px", "50px", 20)),
        buttonNode(`cta-${i}`, content.cta, i === 1 ? btn(theme) : btn(theme, "ghost"), L(g, x + 45, 700, "220px", "50px", 20)),
      ];
    }),
    imageNode("band", content.image, { borderRadius: "20px", objectFit: "cover" }, L(g, 60, 880, "980px", "280px", 8), content.imageAlt || content.title),
  ];
};

/** Quote / testimonial wall */
export const patternQuoteWall: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 40, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "48px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 80, "700px", "110px", 20)),
    ...items.slice(0, 6).flatMap((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 60 + col * 520;
      const y = 230 + row * 220;
      return [
        boxNode(`q-${i}`, { backgroundColor: i % 3 === 0 ? theme.ink : "#fff", borderRadius: "20px", border: `1px solid ${theme.soft}` }, L(g, x, y, "490px", "190px", 5)),
        textNode(`mark-${i}`, "״", { color: theme.accent, fontSize: "54px", fontWeight: "900" }, L(g, x + 24, y + 10, "50px", "50px", 20)),
        textNode(`t-${i}`, item.title, { color: i % 3 === 0 ? "#fff" : theme.ink, fontSize: "20px", fontWeight: "700", lineHeight: "1.4" }, L(g, x + 24, y + 70, "440px", "60px", 20)),
        textNode(`c-${i}`, item.copy, { color: i % 3 === 0 ? "rgba(255,255,255,.65)" : theme.muted, fontSize: "14px" }, L(g, x + 24, y + 140, "440px", "30px", 20)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 920, "220px", "52px", 20)),
    imageNode("portrait", content.image, { borderRadius: "999px", objectFit: "cover" }, L(g, 820, 880, "180px", "180px", 8), "דיוקן"),
  ];
};

/** Agenda / event rows */
export const patternAgendaRows: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    boxNode("hero-bg", { backgroundColor: theme.ink }, L(g, 0, 0, "1100px", "360px", 1)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.22em" }, L(g, 60, 60, "400px", "22px", 20)),
    textNode("title", content.title, { color: "#fff", fontSize: "52px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 110, "700px", "120px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 260, "210px", "50px", 20)),
    imageNode("poster", content.image, { borderRadius: "16px", objectFit: "cover" }, L(g, 700, 40, "340px", "280px", 8), "פוסטר"),
    ...items.slice(0, 5).flatMap((item, i) => {
      const y = 400 + i * 120;
      return [
        boxNode(`row-${i}`, { backgroundColor: i % 2 ? theme.surfaceAlt : "#fff", borderRadius: "14px" }, L(g, 40, y, "1020px", "100px", 4)),
        textNode(`time-${i}`, item.meta || `${10 + i}:00`, { color: theme.accent, fontSize: "22px", fontWeight: "900" }, L(g, 70, y + 32, "120px", "36px", 20)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, 220, y + 22, "500px", "34px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "14px" }, L(g, 220, y + 58, "500px", "28px", 20)),
        boxNode(`chip-${i}`, { backgroundColor: theme.soft, borderRadius: "999px" }, L(g, 820, y + 30, "180px", "40px", 6)),
        textNode(`chip-t-${i}`, "פרטים", { color: theme.accent, fontSize: "13px", fontWeight: "800", textAlign: "center" }, L(g, 820, y + 40, "180px", "24px", 20)),
      ];
    }),
  ];
};

/** Portrait / team grid */
export const patternPortraitGrid: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 40, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "50px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 80, "700px", "110px", 20)),
    ...items.slice(0, 6).flatMap((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 60 + col * 340;
      const y = 230 + row * 360;
      return [
        imageNode(`p-${i}`, content.image, { borderRadius: "22px", objectFit: "cover" }, L(g, x, y, "310px", "240px", 8), item.title),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, x, y + 260, "310px", "32px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "14px" }, L(g, x, y + 298, "310px", "28px", 20)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 1000, "220px", "52px", 20)),
  ];
};

/** FAQ accordion-style stacked bars */
export const patternAccordion: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 40, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "50px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 80, "620px", "110px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "16px", lineHeight: "1.55" }, L(g, 60, 210, "520px", "60px", 20)),
    ...items.slice(0, 6).flatMap((item, i) => {
      const y = 300 + i * 110;
      return [
        boxNode(`bar-${i}`, { backgroundColor: i === 0 ? theme.ink : "#fff", borderRadius: "16px", border: `1px solid ${theme.soft}` }, L(g, 60, y, "700px", "90px", 5)),
        textNode(`t-${i}`, item.title, { color: i === 0 ? "#fff" : theme.ink, fontSize: "20px", fontWeight: "800" }, L(g, 90, y + 18, "560px", "30px", 20)),
        textNode(`c-${i}`, item.copy, { color: i === 0 ? "rgba(255,255,255,.7)" : theme.muted, fontSize: "14px" }, L(g, 90, y + 52, "560px", "28px", 20)),
        textNode(`plus-${i}`, i === 0 ? "−" : "+", { color: theme.accent, fontSize: "28px", fontWeight: "700", textAlign: "center" }, L(g, 690, y + 24, "40px", "40px", 20)),
      ];
    }),
    imageNode("side", content.image, { borderRadius: "24px", objectFit: "cover" }, L(g, 800, 300, "250px", "660px", 8), content.imageAlt || content.title),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 1000, "240px", "52px", 20)),
  ];
};

/** Product catalog shelf */
export const patternCatalogShelf: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    boxNode("top", { backgroundColor: theme.soft }, L(g, 0, 0, "1100px", "220px", 1)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 50, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "48px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 90, "700px", "100px", 20)),
    ...items.slice(0, 6).flatMap((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 50 + col * 350;
      const y = 260 + row * 340;
      return [
        boxNode(`prod-${i}`, { backgroundColor: "#fff", borderRadius: "18px", border: `1px solid ${theme.soft}` }, L(g, x, y, "320px", "300px", 5)),
        imageNode(`img-${i}`, content.image, { borderRadius: "14px", objectFit: "cover" }, L(g, x + 16, y + 16, "288px", "160px", 8), item.title),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "20px", fontWeight: "800" }, L(g, x + 20, y + 195, "280px", "30px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "13px" }, L(g, x + 20, y + 230, "200px", "28px", 20)),
        textNode(`price-${i}`, (content.stats || [])[i % 4]?.value || "₪99", { color: theme.accent, fontSize: "18px", fontWeight: "900" }, L(g, x + 220, y + 230, "80px", "28px", 20)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 50, 980, "220px", "52px", 20)),
  ];
};

/** Asymmetric feature mosaic */
export const patternFeatureMosaic: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    boxNode("big", { backgroundColor: theme.ink, borderRadius: theme.sharpRadius }, L(g, 40, 40, "640px", "420px", 4)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 70, 80, "400px", "22px", 20)),
    textNode("title", content.title, { color: "#fff", fontSize: "48px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 70, 130, "560px", "140px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 70, 320, "200px", "50px", 20)),
    imageNode("side", content.image, { borderRadius: theme.radius, objectFit: "cover" }, L(g, 700, 40, "360px", "420px", 8), content.imageAlt || content.title),
    ...items.slice(0, 4).flatMap((item, i) => {
      const x = 40 + (i % 2) * 530;
      const y = 500 + Math.floor(i / 2) * 220;
      return [
        boxNode(`m-${i}`, { backgroundColor: theme.surfaceAlt, borderRadius: "20px" }, L(g, x, y, "500px", "190px", 5)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "24px", fontWeight: "800" }, L(g, x + 28, y + 40, "440px", "36px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px", lineHeight: "1.5" }, L(g, x + 28, y + 90, "440px", "60px", 20)),
      ];
    }),
  ];
};

/** Contact channels + mini form */
export const patternContactDesk: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    imageNode("map", content.image, { borderRadius: "0px", objectFit: "cover" }, L(g, 0, 0, "1100px", "340px", 2), "מפה"),
    boxNode("overlay", { backgroundColor: "rgba(15,23,42,0.45)" }, L(g, 0, 0, "1100px", "340px", 3)),
    textNode("title", content.title, { color: "#fff", fontSize: "52px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 100, "700px", "120px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 250, "200px", "50px", 20)),
    ...items.slice(0, 4).flatMap((item, i) => {
      const x = 40 + (i % 2) * 340;
      const y = 380 + Math.floor(i / 2) * 180;
      return [
        boxNode(`ch-${i}`, { backgroundColor: "#fff", borderRadius: "18px", border: `2px solid ${theme.soft}` }, L(g, x, y, "310px", "150px", 5)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, x + 24, y + 30, "260px", "34px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "14px" }, L(g, x + 24, y + 75, "260px", "40px", 20)),
      ];
    }),
    boxNode("form", { backgroundColor: theme.ink, borderRadius: "24px" }, L(g, 720, 380, "340px", "520px", 6)),
    textNode("form-t", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.18em" }, L(g, 750, 420, "280px", "22px", 20)),
    textNode("form-h", "כתבו לנו", { color: "#fff", fontSize: "28px", fontWeight: "800" }, L(g, 750, 460, "280px", "40px", 20)),
    boxNode("f1", { backgroundColor: "rgba(255,255,255,.1)", borderRadius: "12px" }, L(g, 750, 530, "280px", "48px", 7)),
    boxNode("f2", { backgroundColor: "rgba(255,255,255,.1)", borderRadius: "12px" }, L(g, 750, 600, "280px", "48px", 7)),
    boxNode("f3", { backgroundColor: "rgba(255,255,255,.1)", borderRadius: "12px" }, L(g, 750, 670, "280px", "100px", 7)),
    buttonNode("send", content.cta, btn(theme), L(g, 750, 800, "280px", "50px", 20)),
  ];
};

/** Resume / CV two columns */
export const patternCvColumns: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  const stats = content.stats || [];
  return [
    boxNode("sidebar", { backgroundColor: theme.ink }, L(g, 0, 0, "360px", "1500px", 2)),
    imageNode("avatar", content.image, { borderRadius: "999px", objectFit: "cover" }, L(g, 70, 60, "220px", "220px", 8), "דיוקן"),
    textNode("name", content.title.replace(/\n/g, " "), { color: "#fff", fontSize: "28px", fontWeight: "800" }, L(g, 40, 310, "280px", "70px", 20)),
    textNode("role", content.eyebrow, { color: theme.accent, fontSize: "13px", fontWeight: "800", letterSpacing: "0.16em" }, L(g, 40, 390, "280px", "24px", 20)),
    ...stats.slice(0, 3).flatMap((st, i) => {
      const y = 460 + i * 90;
      return [
        textNode(`sv-${i}`, st.value, { color: theme.accent, fontSize: "32px", fontWeight: "900" }, L(g, 40, y, "280px", "40px", 20)),
        textNode(`sl-${i}`, st.label, { color: "rgba(255,255,255,.65)", fontSize: "13px" }, L(g, 40, y + 40, "280px", "24px", 20)),
      ];
    }),
    textNode("main-h", content.subtitle, { color: theme.ink, fontSize: "18px", fontWeight: "700" }, L(g, 420, 60, "600px", "40px", 20)),
    ...items.slice(0, 5).flatMap((item, i) => {
      const y = 120 + i * 140;
      return [
        textNode(`meta-${i}`, item.meta || `0${i + 1}`, { color: theme.accent, fontSize: "14px", fontWeight: "800" }, L(g, 420, y, "80px", "24px", 20)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "24px", fontWeight: "800" }, L(g, 510, y, "500px", "34px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px", lineHeight: "1.55" }, L(g, 510, y + 40, "500px", "50px", 20)),
        boxNode(`rule-${i}`, { backgroundColor: theme.soft }, L(g, 420, y + 110, "600px", "1px", 4)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 420, 880, "220px", "52px", 20)),
  ];
};

/** Ticket-style event hero */
export const patternTicketHero: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  const stats = content.stats || [];
  return [
    boxNode("ticket", { backgroundColor: theme.ink, borderRadius: "32px" }, L(g, 60, 60, "980px", "420px", 4)),
    boxNode("stub", { backgroundColor: theme.accent }, L(g, 760, 60, "280px", "420px", 5)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.22em" }, L(g, 100, 100, "400px", "22px", 20)),
    textNode("title", content.title, { color: "#fff", fontSize: "48px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 100, 150, "580px", "130px", 20)),
    textNode("subtitle", content.subtitle, { color: "rgba(255,255,255,.7)", fontSize: "16px" }, L(g, 100, 310, "520px", "50px", 20)),
    textNode("stub-t", "TICKET", { color: theme.ink, fontSize: "14px", fontWeight: "900", letterSpacing: "0.3em", textAlign: "center" }, L(g, 780, 140, "240px", "24px", 20)),
    textNode("stub-v", stats[0]?.value || "LIVE", { color: theme.ink, fontSize: "42px", fontWeight: "900", textAlign: "center" }, L(g, 780, 220, "240px", "50px", 20)),
    buttonNode("cta", content.cta, { ...btn(theme), backgroundColor: theme.ink, color: "#fff" }, L(g, 800, 340, "200px", "50px", 20)),
    ...items.slice(0, 4).flatMap((item, i) => {
      const x = 60 + i * 255;
      return [
        boxNode(`info-${i}`, { backgroundColor: theme.surfaceAlt, borderRadius: "16px" }, L(g, x, 540, "235px", "160px", 5)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "18px", fontWeight: "800" }, L(g, x + 18, 580, "200px", "30px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "13px" }, L(g, x + 18, 620, "200px", "40px", 20)),
      ];
    }),
    imageNode("venue", content.image, { borderRadius: "20px", objectFit: "cover" }, L(g, 60, 760, "980px", "360px", 8), "מקום"),
  ];
};

/** Comparison / matrix rows */
export const patternComparisonMatrix: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 40, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "48px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 80, "800px", "110px", 20)),
    boxNode("head", { backgroundColor: theme.ink, borderRadius: "16px 16px 0 0" }, L(g, 60, 230, "980px", "70px", 4)),
    textNode("h1", "פיצ׳ר", { color: "#fff", fontSize: "16px", fontWeight: "700" }, L(g, 90, 252, "300px", "28px", 20)),
    textNode("h2", "Basic", { color: "#fff", fontSize: "16px", fontWeight: "700", textAlign: "center" }, L(g, 450, 252, "160px", "28px", 20)),
    textNode("h3", "Pro", { color: theme.accent, fontSize: "16px", fontWeight: "800", textAlign: "center" }, L(g, 650, 252, "160px", "28px", 20)),
    textNode("h4", "Max", { color: "#fff", fontSize: "16px", fontWeight: "700", textAlign: "center" }, L(g, 850, 252, "160px", "28px", 20)),
    ...items.slice(0, 6).flatMap((item, i) => {
      const y = 300 + i * 90;
      return [
        boxNode(`r-${i}`, { backgroundColor: i % 2 ? theme.surfaceAlt : "#fff" }, L(g, 60, y, "980px", "90px", 3)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "18px", fontWeight: "700" }, L(g, 90, y + 30, "300px", "30px", 20)),
        textNode(`a-${i}`, i % 2 ? "—" : "✓", { color: theme.muted, fontSize: "22px", textAlign: "center" }, L(g, 450, y + 28, "160px", "30px", 20)),
        textNode(`b-${i}`, "✓", { color: theme.accent, fontSize: "22px", fontWeight: "900", textAlign: "center" }, L(g, 650, y + 28, "160px", "30px", 20)),
        textNode(`c-${i}`, "✓", { color: theme.ink, fontSize: "22px", fontWeight: "900", textAlign: "center" }, L(g, 850, y + 28, "160px", "30px", 20)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 900, "240px", "52px", 20)),
    imageNode("side", content.image, { borderRadius: "16px", objectFit: "cover" }, L(g, 360, 900, "680px", "220px", 8), content.imageAlt || content.title),
  ];
};

/** Overlapping carousel rail */
export const patternCarouselRail: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 60, 40, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "50px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 60, 80, "700px", "110px", 20)),
    ...[0, 1, 2, 3].flatMap((i) => {
      const x = 60 + i * 220;
      const y = 240 + (i % 2) * 30;
      const item = items[i] || { title: `כרטיס ${i + 1}`, copy: "תוכן." };
      return [
        boxNode(`card-${i}`, { backgroundColor: "#fff", borderRadius: "24px", border: `1px solid ${theme.soft}`, boxShadow: "0 18px 40px rgba(15,23,42,.12)" }, L(g, x, y, "300px", "380px", 5 + i)),
        imageNode(`img-${i}`, content.image, { borderRadius: "18px", objectFit: "cover" }, L(g, x + 18, y + 18, "264px", "180px", 8), item.title),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "20px", fontWeight: "800" }, L(g, x + 24, y + 220, "250px", "34px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "14px" }, L(g, x + 24, y + 265, "250px", "50px", 20)),
      ];
    }),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 720, "220px", "52px", 20)),
    ...(content.stats || []).slice(0, 3).flatMap((st, i) => {
      const x = 320 + i * 220;
      return [
        textNode(`sv-${i}`, st.value, { color: theme.accent, fontSize: "36px", fontWeight: "900" }, L(g, x, 720, "180px", "44px", 20)),
        textNode(`sl-${i}`, st.label, { color: theme.ink, fontSize: "13px", fontWeight: "700" }, L(g, x, 770, "180px", "24px", 20)),
      ];
    }),
    imageNode("wide", content.image, { borderRadius: "20px", objectFit: "cover" }, L(g, 60, 860, "980px", "280px", 8), content.imageAlt || content.title),
  ];
};

/** Huge typography statement */
export const patternBoldStatement: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  return [
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "14px", fontWeight: "800", letterSpacing: "0.32em" }, L(g, 60, 80, "500px", "24px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "84px", fontWeight: "900", letterSpacing: "-0.07em", whiteSpace: "pre-line", lineHeight: "0.92" }, L(g, 40, 140, "1020px", "260px", 20)),
    textNode("subtitle", content.subtitle, { color: theme.muted, fontSize: "20px", lineHeight: "1.55" }, L(g, 60, 440, "640px", "70px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 60, 540, "220px", "54px", 20)),
    ...(content.secondaryCta ? [buttonNode("cta2", content.secondaryCta, btn(theme, "ghost"), L(g, 300, 540, "200px", "54px", 20))] : []),
    boxNode("rule", { backgroundColor: theme.ink }, L(g, 60, 660, "980px", "4px", 4)),
    ...items.slice(0, 3).flatMap((item, i) => {
      const x = 60 + i * 340;
      return [
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, x, 720, "300px", "34px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px" }, L(g, x, 770, "300px", "50px", 20)),
      ];
    }),
    imageNode("strip", content.image, { borderRadius: "0px", objectFit: "cover" }, L(g, 0, 900, "1100px", "320px", 8), content.imageAlt || content.title),
  ];
};

/** Case study: big media + story column */
export const patternCaseStudy: PatternFn = (content, theme, g) => {
  const items = content.items || [];
  const stats = content.stats || [];
  return [
    imageNode("cover", content.image, { borderRadius: "0px", objectFit: "cover" }, L(g, 0, 0, "1100px", "520px", 2), content.imageAlt || content.title),
    boxNode("card", { backgroundColor: "#fff", borderRadius: "24px" }, L(g, 80, 380, "940px", "280px", 6)),
    textNode("eyebrow", content.eyebrow, { color: theme.accent, fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" }, L(g, 120, 420, "400px", "22px", 20)),
    textNode("title", content.title, { color: theme.ink, fontSize: "40px", fontWeight: "800", whiteSpace: "pre-line" }, L(g, 120, 460, "700px", "100px", 20)),
    buttonNode("cta", content.cta, btn(theme), L(g, 120, 580, "200px", "48px", 20)),
    ...stats.slice(0, 3).flatMap((st, i) => {
      const x = 120 + i * 280;
      return [
        textNode(`sv-${i}`, st.value, { color: theme.accent, fontSize: "40px", fontWeight: "900" }, L(g, x, 720, "240px", "48px", 20)),
        textNode(`sl-${i}`, st.label, { color: theme.ink, fontSize: "14px", fontWeight: "700" }, L(g, x, 775, "240px", "28px", 20)),
      ];
    }),
    ...items.slice(0, 3).flatMap((item, i) => {
      const y = 860 + i * 100;
      return [
        textNode(`meta-${i}`, item.meta || `0${i + 1}`, { color: theme.accent, fontSize: "16px", fontWeight: "900" }, L(g, 120, y, "60px", "28px", 20)),
        textNode(`t-${i}`, item.title, { color: theme.ink, fontSize: "22px", fontWeight: "800" }, L(g, 200, y, "400px", "30px", 20)),
        textNode(`c-${i}`, item.copy, { color: theme.muted, fontSize: "15px" }, L(g, 620, y, "400px", "30px", 20)),
      ];
    }),
  ];
};

export const PATTERN_MAP = {
  splitHero: patternSplitHero,
  centerEditorial: patternCenterEditorial,
  magazine: patternMagazine,
  colorCards: patternColorCards,
  timeline: patternTimeline,
  darkStats: patternDarkStats,
  cinematic: patternCinematic,
  lifestyle: patternLifestyle,
  listMedia: patternListMedia,
  formPanel: patternFormPanel,
  masonry: patternMasonry,
  filmstrip: patternFilmstrip,
  packageTiers: patternPackageTiers,
  quoteWall: patternQuoteWall,
  agendaRows: patternAgendaRows,
  portraitGrid: patternPortraitGrid,
  accordion: patternAccordion,
  catalogShelf: patternCatalogShelf,
  featureMosaic: patternFeatureMosaic,
  contactDesk: patternContactDesk,
  cvColumns: patternCvColumns,
  ticketHero: patternTicketHero,
  comparisonMatrix: patternComparisonMatrix,
  carouselRail: patternCarouselRail,
  boldStatement: patternBoldStatement,
  caseStudy: patternCaseStudy,
} as const;

export type PatternName = keyof typeof PATTERN_MAP;
