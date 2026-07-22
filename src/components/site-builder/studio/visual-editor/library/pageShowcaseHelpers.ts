import {
  absoluteLayout,
  boxNode,
  buttonNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import type {
  VisualLibraryCategory,
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

export type PageLayoutKind =
  | "split"
  | "center"
  | "magazine"
  | "cards"
  | "timeline"
  | "stats"
  | "dark"
  | "lifestyle"
  | "listMedia"
  | "ctaForm";

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

export const LAYOUT_META: Record<
  PageLayoutKind,
  { backgroundColor: string; minHeight: string }
> = {
  split: { backgroundColor: "#ffffff", minHeight: "1600px" },
  center: { backgroundColor: "#f7f1ea", minHeight: "1500px" },
  magazine: { backgroundColor: "#ffffff", minHeight: "1550px" },
  cards: { backgroundColor: "#eef6ff", minHeight: "1500px" },
  timeline: { backgroundColor: "#f6f4ff", minHeight: "1580px" },
  stats: { backgroundColor: "#111827", minHeight: "1480px" },
  dark: { backgroundColor: "#09090b", minHeight: "1500px" },
  lifestyle: { backgroundColor: "#fde8e4", minHeight: "1520px" },
  listMedia: { backgroundColor: "#f0faf4", minHeight: "1450px" },
  ctaForm: { backgroundColor: "#fff7ed", minHeight: "1450px" },
};

export function makePageSection(options: {
  id: string;
  category: VisualLibraryCategory;
  title: string;
  previewLayout: string;
  backgroundColor: string;
  minHeight: string;
  thumbnail: string;
  keywords: string[];
  nodes: VisualLibraryNodeTemplate[];
}): VisualLibrarySectionTemplate {
  return {
    id: options.id,
    kind: "section",
    tab: "sections",
    category: options.category,
    title: options.title,
    description: "עמוד מלא בסגנון Wix – קומפוזיציה ייחודית",
    keywords: options.keywords,
    previewLayout: options.previewLayout,
    backgroundColor: options.backgroundColor,
    minHeight: options.minHeight,
    thumbnail: options.thumbnail,
    nodes: options.nodes,
  };
}

function btn(
  bg: string,
  color: string,
  radius = "999px",
  border?: string,
) {
  return {
    color,
    backgroundColor: bg,
    border: border || "none",
    borderRadius: radius,
    padding: "13px 24px",
    fontSize: "14px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  };
}

/**
 * Ten visually unrelated recipes — different palette, type, shapes, and structure.
 */
export function buildLayoutNodes(
  kind: PageLayoutKind,
  content: PageContent,
): VisualLibraryNodeTemplate[] {
  const img = content.image;
  const items = content.items || [];
  const stats = content.stats || [];

  switch (kind) {
    /* 1 — Corporate navy split */
    case "split": {
      const navy = "#0b1f3a";
      const accent = "#2563eb";
      return [
        boxNode(
          "rail",
          { backgroundColor: accent },
          absoluteLayout(0, 0, "14px", "1600px", 2),
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: accent,
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.22em",
          },
          absoluteLayout(60, 70, "420px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: navy,
            fontSize: "68px",
            fontWeight: "800",
            letterSpacing: "-0.06em",
            lineHeight: "0.98",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "520px", "180px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { color: "#475569", fontSize: "17px", lineHeight: "1.7" },
          absoluteLayout(60, 310, "480px", "90px", 20),
        ),
        buttonNode(
          "cta",
          content.cta,
          btn(accent, "#ffffff", "8px"),
          absoluteLayout(60, 420, "190px", "50px", 20),
        ),
        ...(content.secondaryCta
          ? [
              buttonNode(
                "cta2",
                content.secondaryCta,
                btn("#ffffff", navy, "8px", "2px solid #0b1f3a"),
                absoluteLayout(270, 420, "180px", "50px", 20),
              ),
            ]
          : []),
        imageNode(
          "hero",
          img,
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(600, 0, "500px", "620px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 60 + index * 340;
          return [
            boxNode(
              `card-${index}`,
              {
                backgroundColor: index === 0 ? navy : "#f1f5f9",
                borderRadius: "0px",
              },
              absoluteLayout(x, 680, "320px", "240px", 5),
            ),
            textNode(
              `card-title-${index}`,
              item.title,
              {
                color: index === 0 ? "#ffffff" : navy,
                fontSize: "22px",
                fontWeight: "800",
              },
              absoluteLayout(x + 24, 720, "270px", "40px", 20),
            ),
            textNode(
              `card-copy-${index}`,
              item.copy,
              {
                color: index === 0 ? "rgba(255,255,255,.78)" : "#64748b",
                fontSize: "14px",
                lineHeight: "1.6",
              },
              absoluteLayout(x + 24, 780, "270px", "90px", 20),
            ),
          ];
        }),
        ...stats.slice(0, 3).flatMap((stat, index) => {
          const x = 60 + index * 340;
          return [
            textNode(
              `stat-v-${index}`,
              stat.value,
              {
                color: accent,
                fontSize: "52px",
                fontWeight: "900",
                letterSpacing: "-0.05em",
              },
              absoluteLayout(x, 980, "300px", "60px", 20),
            ),
            textNode(
              `stat-l-${index}`,
              stat.label,
              { color: navy, fontSize: "15px", fontWeight: "700" },
              absoluteLayout(x, 1050, "300px", "30px", 20),
            ),
          ];
        }),
        boxNode(
          "bottom",
          { backgroundColor: navy },
          absoluteLayout(0, 1160, "1100px", "320px", 1),
        ),
        textNode(
          "bottom-title",
          "מוכנים להתחיל?",
          {
            color: "#ffffff",
            fontSize: "36px",
            fontWeight: "800",
          },
          absoluteLayout(60, 1240, "520px", "50px", 20),
        ),
        buttonNode(
          "bottom-cta",
          content.cta,
          btn(accent, "#ffffff", "8px"),
          absoluteLayout(60, 1320, "200px", "50px", 20),
        ),
        imageNode(
          "bottom-img",
          img,
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(640, 1210, "400px", "220px", 8),
          "תצוגה",
        ),
      ];
    }

    /* 2 — Warm editorial center */
    case "center": {
      const ink = "#2a2118";
      const terracotta = "#c2410c";
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: terracotta,
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.28em",
            textAlign: "center",
          },
          absoluteLayout(300, 90, "500px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "72px",
            fontWeight: "500",
            letterSpacing: "-0.04em",
            lineHeight: "1.02",
            textAlign: "center",
            whiteSpace: "pre-line",
            fontFamily: "Georgia, 'Times New Roman', serif",
          },
          absoluteLayout(140, 140, "820px", "170px", 20),
        ),
        boxNode(
          "rule",
          { backgroundColor: terracotta },
          absoluteLayout(480, 340, "140px", "3px", 5),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          {
            color: "#6b5e52",
            fontSize: "18px",
            lineHeight: "1.75",
            textAlign: "center",
          },
          absoluteLayout(250, 370, "600px", "70px", 20),
        ),
        buttonNode(
          "cta",
          content.cta,
          btn(terracotta, "#ffffff", "999px"),
          absoluteLayout(450, 460, "200px", "50px", 20),
        ),
        imageNode(
          "hero",
          img,
          { borderRadius: "200px 200px 8px 8px", objectFit: "cover" },
          absoluteLayout(220, 550, "660px", "420px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 80 + index * 340;
          return [
            textNode(
              `i-title-${index}`,
              item.title,
              {
                color: ink,
                fontSize: "22px",
                fontWeight: "700",
                textAlign: "center",
                fontFamily: "Georgia, serif",
              },
              absoluteLayout(x, 1020, "300px", "36px", 20),
            ),
            textNode(
              `i-copy-${index}`,
              item.copy,
              {
                color: "#6b5e52",
                fontSize: "14px",
                lineHeight: "1.6",
                textAlign: "center",
              },
              absoluteLayout(x, 1070, "300px", "80px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta2",
          content.secondaryCta || content.cta,
          btn("transparent", terracotta, "999px", `2px solid ${terracotta}`),
          absoluteLayout(450, 1220, "200px", "50px", 20),
        ),
      ];
    }

    /* 3 — Black/white magazine collage */
    case "magazine": {
      return [
        imageNode(
          "img-a",
          img,
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(0, 0, "520px", "640px", 8),
          "A",
        ),
        imageNode(
          "img-b",
          img,
          { borderRadius: "0px", objectFit: "cover", opacity: "0.85" },
          absoluteLayout(540, 80, "260px", "260px", 7),
          "B",
        ),
        imageNode(
          "img-c",
          img,
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(820, 40, "260px", "360px", 6),
          "C",
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#111111",
            fontSize: "11px",
            fontWeight: "900",
            letterSpacing: "0.3em",
          },
          absoluteLayout(540, 380, "420px", "22px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#111111",
            fontSize: "64px",
            fontWeight: "900",
            letterSpacing: "-0.07em",
            lineHeight: "0.95",
            whiteSpace: "pre-line",
            textTransform: "uppercase",
          },
          absoluteLayout(540, 420, "520px", "160px", 20),
        ),
        boxNode(
          "bar",
          { backgroundColor: "#111111" },
          absoluteLayout(0, 680, "1100px", "120px", 5),
        ),
        textNode(
          "bar-copy",
          content.subtitle,
          {
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
          },
          absoluteLayout(80, 720, "940px", "40px", 20),
        ),
        ...items.slice(0, 4).flatMap((item, index) => {
          const y = 860 + index * 100;
          return [
            textNode(
              `n-${index}`,
              String(index + 1).padStart(2, "0"),
              {
                color: "#111111",
                fontSize: "28px",
                fontWeight: "900",
              },
              absoluteLayout(60, y, "80px", "36px", 20),
            ),
            textNode(
              `t-${index}`,
              item.title,
              { color: "#111111", fontSize: "22px", fontWeight: "800" },
              absoluteLayout(160, y, "300px", "32px", 20),
            ),
            textNode(
              `c-${index}`,
              item.copy,
              { color: "#525252", fontSize: "15px", lineHeight: "1.5" },
              absoluteLayout(480, y, "560px", "50px", 20),
            ),
            boxNode(
              `line-${index}`,
              { backgroundColor: "#e5e5e5" },
              absoluteLayout(60, y + 70, "980px", "1px", 5),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          btn("#111111", "#ffffff", "0px"),
          absoluteLayout(60, 1300, "220px", "52px", 20),
        ),
      ];
    }

    /* 4 — Colorful product-style cards */
    case "cards": {
      const accents = ["#0ea5e9", "#f43f5e", "#a855f7", "#10b981", "#f59e0b", "#6366f1"];
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#0369a1",
            fontSize: "13px",
            fontWeight: "800",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 60, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#0f172a",
            fontSize: "58px",
            fontWeight: "900",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 100, "900px", "130px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { color: "#475569", fontSize: "17px", lineHeight: "1.6" },
          absoluteLayout(60, 250, "700px", "50px", 20),
        ),
        ...items.slice(0, 6).flatMap((item, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 50 + col * 350;
          const y = 340 + row * 340;
          const accent = accents[index % accents.length];
          return [
            boxNode(
              `c-${index}`,
              {
                backgroundColor: "#ffffff",
                borderRadius: "28px",
                boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
              },
              absoluteLayout(x, y, "330px", "310px", 5),
            ),
            boxNode(
              `c-chip-${index}`,
              { backgroundColor: accent, borderRadius: "999px" },
              absoluteLayout(x + 22, y + 22, "72px", "10px", 8),
            ),
            imageNode(
              `c-img-${index}`,
              img,
              { borderRadius: "18px", objectFit: "cover" },
              absoluteLayout(x + 22, y + 50, "286px", "120px", 8),
              item.title,
            ),
            textNode(
              `c-t-${index}`,
              item.title,
              { color: "#0f172a", fontSize: "20px", fontWeight: "800" },
              absoluteLayout(x + 22, y + 190, "286px", "34px", 20),
            ),
            textNode(
              `c-c-${index}`,
              item.copy,
              { color: "#64748b", fontSize: "13px", lineHeight: "1.5" },
              absoluteLayout(x + 22, y + 230, "286px", "50px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          btn("#0ea5e9", "#ffffff", "18px"),
          absoluteLayout(50, 1080, "220px", "52px", 20),
        ),
      ];
    }

    /* 5 — Purple timeline */
    case "timeline": {
      const purple = "#6d28d9";
      return [
        boxNode(
          "side",
          { backgroundColor: "#ede9fe" },
          absoluteLayout(700, 0, "400px", "1580px", 1),
        ),
        imageNode(
          "side-img",
          img,
          { borderRadius: "24px", objectFit: "cover" },
          absoluteLayout(740, 80, "320px", "420px", 8),
          content.imageAlt || content.title,
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: purple,
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.2em",
          },
          absoluteLayout(60, 70, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#1e1b4b",
            fontSize: "56px",
            fontWeight: "800",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "600px", "140px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { color: "#5b5675", fontSize: "16px", lineHeight: "1.7" },
          absoluteLayout(60, 270, "560px", "70px", 20),
        ),
        boxNode(
          "line",
          { backgroundColor: purple },
          absoluteLayout(88, 390, "4px", "900px", 5),
        ),
        ...items.slice(0, 5).flatMap((item, index) => {
          const y = 390 + index * 150;
          return [
            boxNode(
              `dot-${index}`,
              {
                backgroundColor: index % 2 === 0 ? purple : "#ffffff",
                border: `4px solid ${purple}`,
                borderRadius: "999px",
              },
              absoluteLayout(74, y + 8, "32px", "32px", 10),
            ),
            textNode(
              `meta-${index}`,
              item.meta || `שלב ${index + 1}`,
              {
                color: purple,
                fontSize: "12px",
                fontWeight: "800",
                letterSpacing: "0.14em",
              },
              absoluteLayout(140, y, "220px", "22px", 20),
            ),
            textNode(
              `t-${index}`,
              item.title,
              { color: "#1e1b4b", fontSize: "26px", fontWeight: "800" },
              absoluteLayout(140, y + 30, "500px", "36px", 20),
            ),
            textNode(
              `c-${index}`,
              item.copy,
              { color: "#5b5675", fontSize: "15px", lineHeight: "1.55" },
              absoluteLayout(140, y + 75, "500px", "45px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          btn(purple, "#ffffff", "999px"),
          absoluteLayout(140, 1220, "210px", "52px", 20),
        ),
      ];
    }

    /* 6 — Dark stats board */
    case "stats": {
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#fbbf24",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.24em",
          },
          absoluteLayout(60, 70, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#ffffff",
            fontSize: "60px",
            fontWeight: "900",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "980px", "130px", 20),
        ),
        ...stats.slice(0, 4).flatMap((stat, index) => {
          const x = 50 + index * 260;
          const hues = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6"];
          return [
            boxNode(
              `s-box-${index}`,
              {
                backgroundColor: "#1f2937",
                borderRadius: "20px",
                border: `1px solid ${hues[index]}55`,
              },
              absoluteLayout(x, 280, "240px", "170px", 5),
            ),
            textNode(
              `s-v-${index}`,
              stat.value,
              {
                color: hues[index],
                fontSize: "46px",
                fontWeight: "900",
              },
              absoluteLayout(x + 20, 315, "200px", "55px", 20),
            ),
            textNode(
              `s-l-${index}`,
              stat.label,
              { color: "#d1d5db", fontSize: "14px", fontWeight: "700" },
              absoluteLayout(x + 20, 385, "200px", "40px", 20),
            ),
          ];
        }),
        imageNode(
          "wide",
          img,
          { borderRadius: "18px", objectFit: "cover", opacity: "0.92" },
          absoluteLayout(50, 500, "1000px", "340px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 50 + index * 340;
          return [
            textNode(
              `f-t-${index}`,
              item.title,
              { color: "#ffffff", fontSize: "20px", fontWeight: "800" },
              absoluteLayout(x, 900, "300px", "34px", 20),
            ),
            textNode(
              `f-c-${index}`,
              item.copy,
              {
                color: "#9ca3af",
                fontSize: "14px",
                lineHeight: "1.55",
              },
              absoluteLayout(x, 945, "300px", "70px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          btn("#fbbf24", "#111827", "12px"),
          absoluteLayout(50, 1080, "220px", "52px", 20),
        ),
      ];
    }

    /* 7 — Cinematic gold on black */
    case "dark": {
      return [
        imageNode(
          "bg",
          img,
          {
            borderRadius: "0px",
            objectFit: "cover",
            opacity: "0.35",
          },
          absoluteLayout(0, 0, "1100px", "700px", 2),
          "bg",
        ),
        boxNode(
          "veil",
          { backgroundColor: "rgba(9,9,11,0.55)" },
          absoluteLayout(0, 0, "1100px", "700px", 3),
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#d4af37",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.32em",
          },
          absoluteLayout(60, 120, "500px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#ffffff",
            fontSize: "70px",
            fontWeight: "500",
            letterSpacing: "-0.04em",
            lineHeight: "1",
            whiteSpace: "pre-line",
            fontFamily: "Georgia, serif",
          },
          absoluteLayout(55, 170, "780px", "180px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          {
            color: "rgba(255,255,255,.72)",
            fontSize: "18px",
            lineHeight: "1.7",
          },
          absoluteLayout(60, 380, "560px", "80px", 20),
        ),
        buttonNode(
          "cta",
          content.cta,
          btn("#d4af37", "#09090b", "0px"),
          absoluteLayout(60, 490, "210px", "52px", 20),
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const y = 760 + index * 140;
          return [
            boxNode(
              `line-${index}`,
              { backgroundColor: "#d4af37" },
              absoluteLayout(60, y, "40px", "2px", 5),
            ),
            textNode(
              `t-${index}`,
              item.title,
              { color: "#ffffff", fontSize: "26px", fontWeight: "700" },
              absoluteLayout(60, y + 20, "700px", "36px", 20),
            ),
            textNode(
              `c-${index}`,
              item.copy,
              {
                color: "rgba(255,255,255,.6)",
                fontSize: "15px",
                lineHeight: "1.55",
              },
              absoluteLayout(60, y + 65, "800px", "45px", 20),
            ),
          ];
        }),
        ...stats.slice(0, 3).flatMap((stat, index) => {
          const x = 60 + index * 340;
          return [
            textNode(
              `sv-${index}`,
              stat.value,
              {
                color: "#d4af37",
                fontSize: "42px",
                fontWeight: "800",
              },
              absoluteLayout(x, 1220, "300px", "50px", 20),
            ),
            textNode(
              `sl-${index}`,
              stat.label,
              {
                color: "rgba(255,255,255,.55)",
                fontSize: "14px",
                fontWeight: "600",
              },
              absoluteLayout(x, 1280, "300px", "30px", 20),
            ),
          ];
        }),
      ];
    }

    /* 8 — Soft blush lifestyle */
    case "lifestyle": {
      const blush = "#be185d";
      return [
        imageNode(
          "hero",
          img,
          { borderRadius: "40px", objectFit: "cover" },
          absoluteLayout(40, 40, "1020px", "460px", 8),
          content.imageAlt || content.title,
        ),
        boxNode(
          "pill",
          {
            backgroundColor: "#ffffff",
            borderRadius: "999px",
          },
          absoluteLayout(380, 430, "340px", "54px", 12),
        ),
        textNode(
          "pill-text",
          content.eyebrow,
          {
            color: blush,
            fontSize: "13px",
            fontWeight: "800",
            letterSpacing: "0.16em",
            textAlign: "center",
          },
          absoluteLayout(380, 445, "340px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#831843",
            fontSize: "58px",
            fontWeight: "700",
            letterSpacing: "-0.045em",
            textAlign: "center",
            whiteSpace: "pre-line",
          },
          absoluteLayout(160, 540, "780px", "130px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          {
            color: "#9d174d",
            fontSize: "17px",
            lineHeight: "1.7",
            textAlign: "center",
          },
          absoluteLayout(240, 690, "620px", "70px", 20),
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 70 + index * 340;
          return [
            boxNode(
              `card-${index}`,
              {
                backgroundColor: "#ffffff",
                borderRadius: "32px",
              },
              absoluteLayout(x, 800, "320px", "260px", 5),
            ),
            textNode(
              `t-${index}`,
              item.title,
              {
                color: "#831843",
                fontSize: "22px",
                fontWeight: "800",
                textAlign: "center",
              },
              absoluteLayout(x + 20, 860, "280px", "40px", 20),
            ),
            textNode(
              `c-${index}`,
              item.copy,
              {
                color: "#9d174d",
                fontSize: "14px",
                lineHeight: "1.6",
                textAlign: "center",
              },
              absoluteLayout(x + 20, 920, "280px", "80px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          btn(blush, "#ffffff", "999px"),
          absoluteLayout(440, 1120, "220px", "52px", 20),
        ),
      ];
    }

    /* 9 — Sage list + media */
    case "listMedia": {
      const sage = "#047857";
      return [
        boxNode(
          "media-bg",
          { backgroundColor: "#d1fae5" },
          absoluteLayout(560, 0, "540px", "1450px", 1),
        ),
        imageNode(
          "media",
          img,
          { borderRadius: "28px", objectFit: "cover" },
          absoluteLayout(600, 80, "460px", "700px", 8),
          content.imageAlt || content.title,
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: sage,
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.2em",
          },
          absoluteLayout(50, 70, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#064e3b",
            fontSize: "54px",
            fontWeight: "900",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(45, 110, "480px", "140px", 20),
        ),
        ...items.slice(0, 5).flatMap((item, index) => {
          const y = 290 + index * 110;
          return [
            boxNode(
              `num-${index}`,
              {
                backgroundColor: index % 2 === 0 ? sage : "#34d399",
                borderRadius: "16px",
              },
              absoluteLayout(50, y, "54px", "54px", 8),
            ),
            textNode(
              `n-${index}`,
              String(index + 1),
              {
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: "900",
                textAlign: "center",
              },
              absoluteLayout(50, y + 12, "54px", "30px", 20),
            ),
            textNode(
              `t-${index}`,
              item.title,
              { color: "#064e3b", fontSize: "20px", fontWeight: "800" },
              absoluteLayout(120, y, "400px", "30px", 20),
            ),
            textNode(
              `c-${index}`,
              item.copy,
              { color: "#047857", fontSize: "14px", lineHeight: "1.5" },
              absoluteLayout(120, y + 36, "400px", "40px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          btn(sage, "#ffffff", "16px"),
          absoluteLayout(50, 900, "220px", "52px", 20),
        ),
        textNode(
          "note",
          content.subtitle,
          { color: "#065f46", fontSize: "15px", lineHeight: "1.6" },
          absoluteLayout(50, 980, "460px", "70px", 20),
        ),
        ...stats.slice(0, 3).flatMap((stat, index) => {
          const x = 50 + index * 160;
          return [
            textNode(
              `sv-${index}`,
              stat.value,
              { color: sage, fontSize: "34px", fontWeight: "900" },
              absoluteLayout(x, 1100, "140px", "40px", 20),
            ),
            textNode(
              `sl-${index}`,
              stat.label,
              { color: "#065f46", fontSize: "12px", fontWeight: "700" },
              absoluteLayout(x, 1150, "140px", "30px", 20),
            ),
          ];
        }),
      ];
    }

    /* 10 — Orange conversion / form */
    case "ctaForm": {
      const orange = "#ea580c";
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: orange,
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.22em",
          },
          absoluteLayout(50, 70, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#7c2d12",
            fontSize: "58px",
            fontWeight: "900",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(45, 110, "560px", "150px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { color: "#9a3412", fontSize: "16px", lineHeight: "1.7" },
          absoluteLayout(50, 290, "520px", "70px", 20),
        ),
        boxNode(
          "form",
          {
            backgroundColor: "#ffffff",
            borderRadius: "28px",
            border: `3px solid ${orange}`,
          },
          absoluteLayout(620, 60, "430px", "460px", 5),
        ),
        textNode(
          "form-title",
          "השאירו פרטים",
          { color: "#7c2d12", fontSize: "26px", fontWeight: "900" },
          absoluteLayout(650, 95, "370px", "40px", 20),
        ),
        boxNode(
          "f1",
          { backgroundColor: "#ffedd5", borderRadius: "14px" },
          absoluteLayout(650, 160, "370px", "52px", 6),
        ),
        textNode(
          "f1l",
          "שם מלא",
          { color: "#c2410c", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(670, 174, "300px", "24px", 20),
        ),
        boxNode(
          "f2",
          { backgroundColor: "#ffedd5", borderRadius: "14px" },
          absoluteLayout(650, 230, "370px", "52px", 6),
        ),
        textNode(
          "f2l",
          "טלפון / אימייל",
          { color: "#c2410c", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(670, 244, "300px", "24px", 20),
        ),
        boxNode(
          "f3",
          { backgroundColor: "#ffedd5", borderRadius: "14px" },
          absoluteLayout(650, 300, "370px", "90px", 6),
        ),
        textNode(
          "f3l",
          "איך נוכל לעזור?",
          { color: "#c2410c", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(670, 320, "300px", "24px", 20),
        ),
        buttonNode(
          "form-cta",
          content.cta,
          btn(orange, "#ffffff", "14px"),
          absoluteLayout(650, 420, "370px", "54px", 20),
        ),
        imageNode(
          "wide",
          img,
          { borderRadius: "24px", objectFit: "cover" },
          absoluteLayout(50, 560, "1000px", "300px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 50 + index * 340;
          return [
            boxNode(
              `chip-${index}`,
              { backgroundColor: orange, borderRadius: "999px" },
              absoluteLayout(x, 910, "48px", "8px", 5),
            ),
            textNode(
              `t-${index}`,
              item.title,
              { color: "#7c2d12", fontSize: "20px", fontWeight: "800" },
              absoluteLayout(x, 935, "300px", "34px", 20),
            ),
            textNode(
              `c-${index}`,
              item.copy,
              { color: "#9a3412", fontSize: "14px", lineHeight: "1.55" },
              absoluteLayout(x, 980, "300px", "70px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta2",
          content.secondaryCta || content.cta,
          btn("#ffffff", orange, "14px", `2px solid ${orange}`),
          absoluteLayout(50, 1100, "220px", "52px", 20),
        ),
      ];
    }

    default:
      return [];
  }
}
