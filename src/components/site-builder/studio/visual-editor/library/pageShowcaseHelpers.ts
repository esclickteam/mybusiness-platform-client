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

export const ink = "#111318";
export const muted = "#5a5f66";
export const hairline = "rgba(17,19,24,.12)";
export const cream = "#faf9f7";
export const dark = "#0f1115";

export const body = {
  color: muted,
  fontSize: "16px",
  lineHeight: "1.7",
};

export const darkButton = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "999px",
  padding: "12px 22px",
  fontSize: "14px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

export const lightButton = {
  color: ink,
  backgroundColor: "#ffffff",
  border: "1px solid rgba(17,19,24,.14)",
  borderRadius: "999px",
  padding: "12px 22px",
  fontSize: "14px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

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

export function buildLayoutNodes(
  kind: PageLayoutKind,
  content: PageContent,
): VisualLibraryNodeTemplate[] {
  const img = content.image;
  const items = content.items || [];
  const stats = content.stats || [];

  switch (kind) {
    case "split":
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 70, "360px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "64px",
            fontWeight: "600",
            letterSpacing: "-0.055em",
            lineHeight: "1.02",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "520px", "170px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { ...body, fontSize: "17px" },
          absoluteLayout(60, 300, "480px", "90px", 20),
        ),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(60, 410, "180px", "48px", 20),
        ),
        ...(content.secondaryCta
          ? [
              buttonNode(
                "cta2",
                content.secondaryCta,
                lightButton,
                absoluteLayout(260, 410, "180px", "48px", 20),
              ),
            ]
          : []),
        imageNode(
          "hero",
          img,
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(580, 70, "480px", "520px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 60 + index * 340;
          return [
            boxNode(
              `card-${index}`,
              {
                backgroundColor: "#ffffff",
                border: `1px solid ${hairline}`,
                borderRadius: "16px",
              },
              absoluteLayout(x, 640, "320px", "220px", 5),
            ),
            textNode(
              `card-title-${index}`,
              item.title,
              { color: ink, fontSize: "22px", fontWeight: "700" },
              absoluteLayout(x + 24, 670, "270px", "40px", 20),
            ),
            textNode(
              `card-copy-${index}`,
              item.copy,
              { color: muted, fontSize: "14px", lineHeight: "1.6" },
              absoluteLayout(x + 24, 725, "270px", "90px", 20),
            ),
          ];
        }),
        textNode(
          "band-title",
          "למה לבחור בנו",
          {
            color: ink,
            fontSize: "36px",
            fontWeight: "600",
            letterSpacing: "-0.04em",
          },
          absoluteLayout(60, 920, "600px", "50px", 20),
        ),
        ...stats.slice(0, 3).flatMap((stat, index) => {
          const x = 60 + index * 340;
          return [
            textNode(
              `stat-v-${index}`,
              stat.value,
              {
                color: ink,
                fontSize: "48px",
                fontWeight: "700",
                letterSpacing: "-0.04em",
              },
              absoluteLayout(x, 1000, "300px", "60px", 20),
            ),
            textNode(
              `stat-l-${index}`,
              stat.label,
              { color: muted, fontSize: "15px", fontWeight: "600" },
              absoluteLayout(x, 1070, "300px", "30px", 20),
            ),
          ];
        }),
        boxNode(
          "bottom-band",
          { backgroundColor: cream },
          absoluteLayout(0, 1160, "1100px", "280px", 1),
        ),
        textNode(
          "bottom-title",
          "מוכנים להתחיל?",
          {
            color: ink,
            fontSize: "34px",
            fontWeight: "600",
            letterSpacing: "-0.03em",
          },
          absoluteLayout(60, 1230, "500px", "48px", 20),
        ),
        textNode(
          "bottom-copy",
          "צרו קשר עוד היום ונבנה יחד את הצעד הבא של העסק.",
          { ...body, fontSize: "16px" },
          absoluteLayout(60, 1290, "520px", "50px", 20),
        ),
        buttonNode(
          "bottom-cta",
          content.cta,
          darkButton,
          absoluteLayout(60, 1360, "200px", "48px", 20),
        ),
        imageNode(
          "bottom-img",
          img,
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(640, 1210, "400px", "200px", 8),
          content.imageAlt || "תצוגה",
        ),
      ];

    case "center":
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.18em",
            textAlign: "center",
          },
          absoluteLayout(300, 80, "500px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "68px",
            fontWeight: "600",
            letterSpacing: "-0.055em",
            lineHeight: "1.02",
            textAlign: "center",
            whiteSpace: "pre-line",
          },
          absoluteLayout(160, 130, "780px", "160px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          {
            ...body,
            fontSize: "18px",
            textAlign: "center",
          },
          absoluteLayout(250, 310, "600px", "70px", 20),
        ),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(460, 400, "180px", "48px", 20),
        ),
        imageNode(
          "hero",
          img,
          { borderRadius: "6px", objectFit: "cover" },
          absoluteLayout(140, 490, "820px", "380px", 8),
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
              },
              absoluteLayout(x, 920, "300px", "36px", 20),
            ),
            textNode(
              `i-copy-${index}`,
              item.copy,
              {
                color: muted,
                fontSize: "14px",
                lineHeight: "1.6",
                textAlign: "center",
              },
              absoluteLayout(x, 970, "300px", "80px", 20),
            ),
          ];
        }),
        boxNode(
          "cta-band",
          { backgroundColor: ink },
          absoluteLayout(60, 1120, "980px", "200px", 5),
        ),
        textNode(
          "cta-band-title",
          "הצעד הבא מתחיל כאן",
          {
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: "600",
            textAlign: "center",
          },
          absoluteLayout(180, 1170, "740px", "48px", 20),
        ),
        buttonNode(
          "cta-band-btn",
          content.cta,
          {
            ...lightButton,
            backgroundColor: "#ffffff",
          },
          absoluteLayout(460, 1240, "180px", "48px", 20),
        ),
      ];

    case "magazine":
      return [
        imageNode(
          "img-a",
          img,
          { borderRadius: "2px", objectFit: "cover" },
          absoluteLayout(60, 60, "420px", "520px", 8),
          "תמונה ראשית",
        ),
        imageNode(
          "img-b",
          img,
          { borderRadius: "2px", objectFit: "cover", opacity: "0.92" },
          absoluteLayout(520, 120, "280px", "220px", 7),
          "תמונה משנית",
        ),
        imageNode(
          "img-c",
          img,
          { borderRadius: "2px", objectFit: "cover", opacity: "0.88" },
          absoluteLayout(820, 180, "220px", "280px", 6),
          "תמונה שלישית",
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.18em",
          },
          absoluteLayout(520, 380, "400px", "22px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "56px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            lineHeight: "1.05",
            whiteSpace: "pre-line",
          },
          absoluteLayout(520, 420, "520px", "140px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { ...body, fontSize: "15px" },
          absoluteLayout(60, 640, "980px", "60px", 20),
        ),
        ...items.slice(0, 4).flatMap((item, index) => {
          const y = 740 + index * 100;
          return [
            textNode(
              `row-t-${index}`,
              item.title,
              { color: ink, fontSize: "20px", fontWeight: "700" },
              absoluteLayout(60, y, "320px", "30px", 20),
            ),
            textNode(
              `row-c-${index}`,
              item.copy,
              { color: muted, fontSize: "14px", lineHeight: "1.55" },
              absoluteLayout(400, y, "640px", "50px", 20),
            ),
            boxNode(
              `row-line-${index}`,
              { backgroundColor: hairline },
              absoluteLayout(60, y + 70, "980px", "1px", 5),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(60, 1180, "200px", "48px", 20),
        ),
      ];

    case "cards":
      return [
        boxNode(
          "top",
          { backgroundColor: cream },
          absoluteLayout(0, 0, "1100px", "320px", 1),
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 70, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "56px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "700px", "120px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { ...body },
          absoluteLayout(60, 240, "640px", "50px", 20),
        ),
        ...items.slice(0, 6).flatMap((item, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 60 + col * 340;
          const y = 360 + row * 280;
          return [
            boxNode(
              `c-${index}`,
              {
                backgroundColor: "#ffffff",
                border: `1px solid ${hairline}`,
                borderRadius: "18px",
              },
              absoluteLayout(x, y, "320px", "250px", 5),
            ),
            imageNode(
              `c-img-${index}`,
              img,
              { borderRadius: "12px", objectFit: "cover" },
              absoluteLayout(x + 18, y + 18, "284px", "110px", 8),
              item.title,
            ),
            textNode(
              `c-t-${index}`,
              item.title,
              { color: ink, fontSize: "18px", fontWeight: "700" },
              absoluteLayout(x + 22, y + 145, "270px", "30px", 20),
            ),
            textNode(
              `c-c-${index}`,
              item.copy,
              { color: muted, fontSize: "13px", lineHeight: "1.5" },
              absoluteLayout(x + 22, y + 180, "270px", "50px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(60, 980, "200px", "48px", 20),
        ),
      ];

    case "timeline":
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 70, "360px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "58px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "640px", "140px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { ...body },
          absoluteLayout(60, 270, "520px", "70px", 20),
        ),
        imageNode(
          "side",
          img,
          { borderRadius: "4px", objectFit: "cover" },
          absoluteLayout(640, 70, "420px", "320px", 8),
          content.imageAlt || content.title,
        ),
        boxNode(
          "line",
          { backgroundColor: ink },
          absoluteLayout(88, 420, "2px", "700px", 5),
        ),
        ...items.slice(0, 5).flatMap((item, index) => {
          const y = 420 + index * 130;
          return [
            boxNode(
              `dot-${index}`,
              {
                backgroundColor: ink,
                borderRadius: "999px",
              },
              absoluteLayout(78, y + 8, "22px", "22px", 10),
            ),
            textNode(
              `tl-meta-${index}`,
              item.meta || `שלב ${index + 1}`,
              {
                color: "#8a8f96",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.12em",
              },
              absoluteLayout(140, y, "200px", "22px", 20),
            ),
            textNode(
              `tl-t-${index}`,
              item.title,
              { color: ink, fontSize: "24px", fontWeight: "700" },
              absoluteLayout(140, y + 28, "700px", "36px", 20),
            ),
            textNode(
              `tl-c-${index}`,
              item.copy,
              { color: muted, fontSize: "15px", lineHeight: "1.55" },
              absoluteLayout(140, y + 70, "800px", "40px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(140, 1120, "200px", "48px", 20),
        ),
      ];

    case "stats":
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 70, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "60px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "980px", "130px", 20),
        ),
        ...stats.slice(0, 4).flatMap((stat, index) => {
          const x = 60 + index * 260;
          return [
            boxNode(
              `s-box-${index}`,
              {
                backgroundColor: cream,
                borderRadius: "18px",
              },
              absoluteLayout(x, 280, "240px", "160px", 5),
            ),
            textNode(
              `s-v-${index}`,
              stat.value,
              {
                color: ink,
                fontSize: "42px",
                fontWeight: "700",
                letterSpacing: "-0.04em",
              },
              absoluteLayout(x + 20, 315, "200px", "55px", 20),
            ),
            textNode(
              `s-l-${index}`,
              stat.label,
              { color: muted, fontSize: "14px", fontWeight: "600" },
              absoluteLayout(x + 20, 380, "200px", "40px", 20),
            ),
          ];
        }),
        imageNode(
          "wide",
          img,
          { borderRadius: "6px", objectFit: "cover" },
          absoluteLayout(60, 490, "980px", "320px", 8),
          content.imageAlt || content.title,
        ),
        textNode(
          "story",
          content.subtitle,
          { ...body, fontSize: "18px" },
          absoluteLayout(60, 860, "700px", "70px", 20),
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 60 + index * 340;
          return [
            textNode(
              `f-t-${index}`,
              item.title,
              { color: ink, fontSize: "20px", fontWeight: "700" },
              absoluteLayout(x, 960, "300px", "34px", 20),
            ),
            textNode(
              `f-c-${index}`,
              item.copy,
              { color: muted, fontSize: "14px", lineHeight: "1.55" },
              absoluteLayout(x, 1005, "300px", "70px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(60, 1140, "200px", "48px", 20),
        ),
      ];

    case "dark":
      return [
        boxNode(
          "bg",
          { backgroundColor: dark },
          absoluteLayout(0, 0, "1100px", "1450px", 1),
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "rgba(255,255,255,.55)",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.18em",
          },
          absoluteLayout(60, 80, "400px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#ffffff",
            fontSize: "66px",
            fontWeight: "600",
            letterSpacing: "-0.055em",
            lineHeight: "1.02",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 130, "700px", "170px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          {
            color: "rgba(255,255,255,.72)",
            fontSize: "17px",
            lineHeight: "1.7",
          },
          absoluteLayout(60, 330, "520px", "80px", 20),
        ),
        buttonNode(
          "cta",
          content.cta,
          {
            ...darkButton,
            backgroundColor: "#ffffff",
            color: dark,
          },
          absoluteLayout(60, 430, "190px", "48px", 20),
        ),
        imageNode(
          "hero",
          img,
          { borderRadius: "4px", objectFit: "cover", opacity: "0.9" },
          absoluteLayout(620, 90, "420px", "480px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const y = 640 + index * 130;
          return [
            textNode(
              `d-t-${index}`,
              item.title,
              { color: "#ffffff", fontSize: "24px", fontWeight: "700" },
              absoluteLayout(60, y, "500px", "36px", 20),
            ),
            textNode(
              `d-c-${index}`,
              item.copy,
              {
                color: "rgba(255,255,255,.65)",
                fontSize: "15px",
                lineHeight: "1.55",
              },
              absoluteLayout(60, y + 42, "700px", "50px", 20),
            ),
            boxNode(
              `d-line-${index}`,
              { backgroundColor: "rgba(255,255,255,.12)" },
              absoluteLayout(60, y + 105, "980px", "1px", 5),
            ),
          ];
        }),
        ...stats.slice(0, 3).flatMap((stat, index) => {
          const x = 60 + index * 340;
          return [
            textNode(
              `ds-v-${index}`,
              stat.value,
              {
                color: "#ffffff",
                fontSize: "44px",
                fontWeight: "700",
              },
              absoluteLayout(x, 1100, "300px", "55px", 20),
            ),
            textNode(
              `ds-l-${index}`,
              stat.label,
              {
                color: "rgba(255,255,255,.55)",
                fontSize: "14px",
                fontWeight: "600",
              },
              absoluteLayout(x, 1165, "300px", "30px", 20),
            ),
          ];
        }),
      ];

    case "lifestyle":
      return [
        boxNode(
          "bg",
          { backgroundColor: cream },
          absoluteLayout(0, 0, "1100px", "1450px", 1),
        ),
        imageNode(
          "hero",
          img,
          { borderRadius: "28px", objectFit: "cover" },
          absoluteLayout(60, 60, "980px", "420px", 8),
          content.imageAlt || content.title,
        ),
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a847c",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
            textAlign: "center",
          },
          absoluteLayout(300, 520, "500px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: "#1b1917",
            fontSize: "58px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            textAlign: "center",
            whiteSpace: "pre-line",
          },
          absoluteLayout(160, 560, "780px", "130px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          {
            color: "#5d574f",
            fontSize: "17px",
            lineHeight: "1.7",
            textAlign: "center",
          },
          absoluteLayout(240, 710, "620px", "70px", 20),
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 80 + index * 340;
          return [
            boxNode(
              `l-card-${index}`,
              {
                backgroundColor: "#ffffff",
                borderRadius: "22px",
              },
              absoluteLayout(x, 820, "310px", "240px", 5),
            ),
            textNode(
              `l-t-${index}`,
              item.title,
              {
                color: "#1b1917",
                fontSize: "22px",
                fontWeight: "700",
                textAlign: "center",
              },
              absoluteLayout(x + 20, 870, "270px", "40px", 20),
            ),
            textNode(
              `l-c-${index}`,
              item.copy,
              {
                color: "#655f58",
                fontSize: "14px",
                lineHeight: "1.6",
                textAlign: "center",
              },
              absoluteLayout(x + 20, 930, "270px", "80px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.cta,
          {
            ...darkButton,
            backgroundColor: "#1b1917",
          },
          absoluteLayout(460, 1120, "180px", "48px", 20),
        ),
      ];

    case "listMedia":
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 70, "360px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "56px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "520px", "140px", 20),
        ),
        ...items.slice(0, 5).flatMap((item, index) => {
          const y = 280 + index * 100;
          return [
            textNode(
              `lm-n-${index}`,
              String(index + 1).padStart(2, "0"),
              {
                color: "#c5c8ce",
                fontSize: "18px",
                fontWeight: "700",
              },
              absoluteLayout(60, y, "60px", "28px", 20),
            ),
            textNode(
              `lm-t-${index}`,
              item.title,
              { color: ink, fontSize: "22px", fontWeight: "700" },
              absoluteLayout(130, y, "400px", "32px", 20),
            ),
            textNode(
              `lm-c-${index}`,
              item.copy,
              { color: muted, fontSize: "14px", lineHeight: "1.5" },
              absoluteLayout(130, y + 36, "400px", "40px", 20),
            ),
          ];
        }),
        imageNode(
          "media",
          img,
          { borderRadius: "6px", objectFit: "cover" },
          absoluteLayout(600, 110, "460px", "640px", 8),
          content.imageAlt || content.title,
        ),
        buttonNode(
          "cta",
          content.cta,
          darkButton,
          absoluteLayout(60, 820, "200px", "48px", 20),
        ),
        textNode(
          "note",
          content.subtitle,
          { ...body, fontSize: "15px" },
          absoluteLayout(60, 900, "500px", "70px", 20),
        ),
        ...stats.slice(0, 3).flatMap((stat, index) => {
          const x = 60 + index * 180;
          return [
            textNode(
              `lm-s-${index}`,
              stat.value,
              { color: ink, fontSize: "36px", fontWeight: "700" },
              absoluteLayout(x, 1020, "160px", "45px", 20),
            ),
            textNode(
              `lm-sl-${index}`,
              stat.label,
              { color: muted, fontSize: "13px", fontWeight: "600" },
              absoluteLayout(x, 1070, "160px", "30px", 20),
            ),
          ];
        }),
      ];

    case "ctaForm":
      return [
        textNode(
          "eyebrow",
          content.eyebrow,
          {
            color: "#8a8f96",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.16em",
          },
          absoluteLayout(60, 70, "360px", "24px", 20),
        ),
        textNode(
          "title",
          content.title,
          {
            color: ink,
            fontSize: "58px",
            fontWeight: "600",
            letterSpacing: "-0.05em",
            whiteSpace: "pre-line",
          },
          absoluteLayout(55, 110, "560px", "140px", 20),
        ),
        textNode(
          "subtitle",
          content.subtitle,
          { ...body },
          absoluteLayout(60, 270, "520px", "70px", 20),
        ),
        boxNode(
          "form",
          {
            backgroundColor: "#ffffff",
            border: `1px solid ${hairline}`,
            borderRadius: "22px",
          },
          absoluteLayout(620, 70, "420px", "420px", 5),
        ),
        textNode(
          "form-title",
          "השאירו פרטים",
          { color: ink, fontSize: "24px", fontWeight: "700" },
          absoluteLayout(650, 100, "360px", "36px", 20),
        ),
        boxNode(
          "field1",
          {
            backgroundColor: cream,
            borderRadius: "12px",
          },
          absoluteLayout(650, 160, "360px", "48px", 6),
        ),
        textNode(
          "field1-label",
          "שם מלא",
          { color: "#8a8f96", fontSize: "14px", fontWeight: "600" },
          absoluteLayout(670, 172, "300px", "24px", 20),
        ),
        boxNode(
          "field2",
          {
            backgroundColor: cream,
            borderRadius: "12px",
          },
          absoluteLayout(650, 230, "360px", "48px", 6),
        ),
        textNode(
          "field2-label",
          "טלפון / אימייל",
          { color: "#8a8f96", fontSize: "14px", fontWeight: "600" },
          absoluteLayout(670, 242, "300px", "24px", 20),
        ),
        boxNode(
          "field3",
          {
            backgroundColor: cream,
            borderRadius: "12px",
          },
          absoluteLayout(650, 300, "360px", "80px", 6),
        ),
        textNode(
          "field3-label",
          "איך נוכל לעזור?",
          { color: "#8a8f96", fontSize: "14px", fontWeight: "600" },
          absoluteLayout(670, 312, "300px", "24px", 20),
        ),
        buttonNode(
          "form-cta",
          content.cta,
          darkButton,
          absoluteLayout(650, 405, "360px", "48px", 20),
        ),
        imageNode(
          "wide",
          img,
          { borderRadius: "6px", objectFit: "cover" },
          absoluteLayout(60, 540, "980px", "280px", 8),
          content.imageAlt || content.title,
        ),
        ...items.slice(0, 3).flatMap((item, index) => {
          const x = 60 + index * 340;
          return [
            textNode(
              `cf-t-${index}`,
              item.title,
              { color: ink, fontSize: "20px", fontWeight: "700" },
              absoluteLayout(x, 870, "300px", "34px", 20),
            ),
            textNode(
              `cf-c-${index}`,
              item.copy,
              { color: muted, fontSize: "14px", lineHeight: "1.55" },
              absoluteLayout(x, 915, "300px", "70px", 20),
            ),
          ];
        }),
        buttonNode(
          "cta",
          content.secondaryCta || content.cta,
          lightButton,
          absoluteLayout(60, 1040, "200px", "48px", 20),
        ),
      ];

    default:
      return [];
  }
}
