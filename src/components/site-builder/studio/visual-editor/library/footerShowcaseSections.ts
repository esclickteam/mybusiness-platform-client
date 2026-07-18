import {
  absoluteLayout,
  boxNode,
  buttonNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import { VISUAL_LIBRARY_IMAGES as IMG } from "./libraryAssets";
import type {
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

const ink = "#111318";
const body = {
  color: "#5a5f66",
  fontSize: "14px",
  lineHeight: "1.55",
};
const button = {
  color: "#ffffff",
  backgroundColor: ink,
  borderRadius: "999px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "700",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

function footer(
  id: string,
  title: string,
  previewLayout: string,
  backgroundColor: string,
  minHeight: string,
  thumbnail: string,
  nodes: VisualLibraryNodeTemplate[],
): VisualLibrarySectionTemplate {
  return {
    id,
    kind: "section",
    tab: "sections",
    category: "footer",
    title,
    description: "סקשן פוטר מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["פוטר", "footer", "תחתית", "קישורים", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — רב-עמודות קלאסי */
const multiColumn = footer(
  "section-footer-showcase-multi-column",
  "פוטר — רב-עמודות",
  "footer-showcase-multi-column",
  "#111318",
  "420px",
  IMG.office,
  [
    textNode(
      "logo",
      "BizUply",
      {
        color: "#ffffff",
        fontSize: "28px",
        fontWeight: "700",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(45, 50, "200px", "36px", 20),
    ),
    textNode(
      "tagline",
      "בונים אתרים שעובדים.",
      { color: "rgba(255,255,255,.55)", fontSize: "14px" },
      absoluteLayout(45, 90, "280px", "24px", 20),
    ),
    ...[
      ["מוצר", ["תמחור", "תכונות", "דוגמאות", "API"]],
      ["חברה", ["אודות", "בלוג", "קריירה", "צור קשר"]],
      ["משפטי", ["פרטיות", "תנאים", "עוגיות", "GDPR"]],
    ].flatMap(([heading, links], colIndex) => {
      const x = 380 + colIndex * 220;
      const linkList = links as string[];
      return [
        textNode(
          `heading-${colIndex}`,
          String(heading),
          { color: "#ffffff", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(x, 50, "180px", "24px", 20),
        ),
        ...linkList.flatMap((link, linkIndex) =>
          textNode(
            `link-${colIndex}-${linkIndex}`,
            link,
            { color: "rgba(255,255,255,.55)", fontSize: "14px", lineHeight: "2" },
            absoluteLayout(x, 85 + linkIndex * 30, "180px", "24px", 20),
          ),
        ),
      ];
    }),
    boxNode(
      "divider",
      { backgroundColor: "rgba(255,255,255,.1)" },
      absoluteLayout(45, 230, "990px", "1px", 5),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply. כל הזכויות שמורות.",
      { color: "rgba(255,255,255,.4)", fontSize: "13px" },
      absoluteLayout(45, 260, "400px", "22px", 20),
    ),
    textNode(
      "social",
      "LinkedIn · Instagram · Twitter",
      { color: "rgba(255,255,255,.55)", fontSize: "13px" },
      absoluteLayout(700, 260, "340px", "22px", 20),
    ),
  ],
);

/** 2 — מינימלי ממורכז */
const minimalCentered = footer(
  "section-footer-showcase-minimal-centered",
  "פוטר — מינימלי ממורכז",
  "footer-showcase-minimal-centered",
  "#ffffff",
  "320px",
  IMG.abstract,
  [
    textNode(
      "logo",
      "BizUply",
      {
        color: ink,
        fontSize: "32px",
        fontWeight: "700",
        letterSpacing: "-0.03em",
        textAlign: "center",
      },
      absoluteLayout(390, 60, "300px", "40px", 20),
    ),
    textNode(
      "links",
      "אודות  ·  תמחור  ·  בלוג  ·  צור קשר",
      {
        color: "#777b82",
        fontSize: "14px",
        fontWeight: "600",
        textAlign: "center",
      },
      absoluteLayout(290, 120, "500px", "24px", 20),
    ),
    boxNode(
      "divider",
      { backgroundColor: "#eceef1" },
      absoluteLayout(290, 170, "500px", "1px", 5),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply · תל אביב, ישראל",
      { color: "#b8bcc3", fontSize: "13px", textAlign: "center" },
      absoluteLayout(290, 200, "500px", "22px", 20),
    ),
    textNode(
      "social",
      "in  ·  ig  ·  tw",
      { color: "#777b82", fontSize: "14px", fontWeight: "600", textAlign: "center" },
      absoluteLayout(390, 240, "300px", "24px", 20),
    ),
  ],
);

/** 3 — כהה Full Width */
const darkFullWidth = footer(
  "section-footer-showcase-dark-fullwidth",
  "פוטר — כהה Full Width",
  "footer-showcase-dark-fullwidth",
  "#171717",
  "380px",
  IMG.architecture,
  [
    imageNode(
      "bg",
      IMG.architecture,
      {
        borderRadius: "0px",
        objectFit: "cover",
        filter: "brightness(.25) saturate(.7)",
        opacity: "0.5",
      },
      absoluteLayout(0, 0, "1080px", "380px", 2),
      "רקע",
    ),
    boxNode(
      "shade",
      { backgroundColor: "rgba(9,12,14,.88)" },
      absoluteLayout(0, 0, "1080px", "380px", 5),
    ),
    textNode(
      "logo",
      "BizUply",
      {
        color: "#ffffff",
        fontSize: "36px",
        fontWeight: "700",
        letterSpacing: "-0.03em",
      },
      absoluteLayout(45, 60, "250px", "45px", 20),
    ),
    textNode(
      "copy",
      "פלטפורמה לבניית אתרים מקצועיים — מהר, יפה ובלי קוד.",
      { color: "rgba(255,255,255,.65)", fontSize: "15px", lineHeight: "1.55" },
      absoluteLayout(45, 120, "400px", "50px", 20),
    ),
    ...[
      ["מוצר", "תמחור · תכונות · דוגמאות"],
      ["תמיכה", "מרכז עזרה · צ׳אט · דוא״ל"],
      ["חברה", "אודות · בלוג · קריירה"],
    ].flatMap(([heading, links], index) => {
      const x = 520 + index * 180;
      return [
        textNode(
          `heading-${index}`,
          heading,
          { color: "#ffffff", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(x, 60, "160px", "24px", 20),
        ),
        textNode(
          `links-${index}`,
          links,
          { color: "rgba(255,255,255,.5)", fontSize: "13px", lineHeight: "1.8" },
          absoluteLayout(x, 90, "160px", "60px", 20),
        ),
      ];
    }),
    boxNode(
      "divider",
      { backgroundColor: "rgba(255,255,255,.1)" },
      absoluteLayout(45, 280, "990px", "1px", 5),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply",
      { color: "rgba(255,255,255,.4)", fontSize: "13px" },
      absoluteLayout(45, 310, "200px", "22px", 20),
    ),
  ],
);

/** 4 — ניוזלטר + קישורים */
const newsletterLinks = footer(
  "section-footer-showcase-newsletter",
  "פוטר — ניוזלטר",
  "footer-showcase-newsletter",
  "#f3f4f6",
  "400px",
  IMG.event,
  [
    textNode(
      "logo",
      "BizUply",
      { color: ink, fontSize: "26px", fontWeight: "700", letterSpacing: "-0.03em" },
      absoluteLayout(45, 45, "200px", "34px", 20),
    ),
    textNode(
      "newsletter-title",
      "הישארו מעודכנים",
      { color: ink, fontSize: "20px", fontWeight: "700" },
      absoluteLayout(45, 100, "300px", "28px", 20),
    ),
    textNode(
      "newsletter-copy",
      "טיפים, עדכונים ותוכן — ישירות לתיבה.",
      { ...body, fontSize: "14px" },
      absoluteLayout(45, 135, "350px", "24px", 20),
    ),
    boxNode(
      "input",
      { backgroundColor: "#ffffff", borderRadius: "999px", border: "1px solid #eceef1" },
      absoluteLayout(45, 175, "320px", "46px", 8),
    ),
    textNode(
      "input-placeholder",
      "your@email.com",
      { color: "#b8bcc3", fontSize: "14px" },
      absoluteLayout(65, 188, "200px", "24px", 20),
    ),
    buttonNode(
      "subscribe",
      "הרשמה",
      { ...button, padding: "10px 22px" },
      absoluteLayout(380, 175, "120px", "46px", 20),
    ),
    ...[
      ["מוצר", ["תמחור", "תכונות", "דוגמאות"]],
      ["חברה", ["אודות", "בלוג", "קריירה"]],
      ["עזרה", ["FAQ", "תמיכה", "צור קשר"]],
    ].flatMap(([heading, links], colIndex) => {
      const x = 560 + colIndex * 170;
      const linkList = links as string[];
      return [
        textNode(
          `heading-${colIndex}`,
          String(heading),
          { color: ink, fontSize: "14px", fontWeight: "700" },
          absoluteLayout(x, 45, "150px", "24px", 20),
        ),
        ...linkList.flatMap((link, linkIndex) =>
          textNode(
            `link-${colIndex}-${linkIndex}`,
            link,
            { ...body, fontSize: "14px", lineHeight: "2" },
            absoluteLayout(x, 80 + linkIndex * 30, "150px", "24px", 20),
          ),
        ),
      ];
    }),
    boxNode(
      "divider",
      { backgroundColor: "#eceef1" },
      absoluteLayout(45, 280, "990px", "1px", 5),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply · פרטיות · תנאים",
      { color: "#b8bcc3", fontSize: "13px" },
      absoluteLayout(45, 310, "500px", "22px", 20),
    ),
  ],
);

/** 5 — לוגו + רשתות חברתיות */
const logoSocial = footer(
  "section-footer-showcase-logo-social",
  "פוטר — לוגו ורשתות",
  "footer-showcase-logo-social",
  "#faf8f4",
  "360px",
  IMG.fashion,
  [
    textNode(
      "logo",
      "BizUply",
      {
        color: "#1c1915",
        fontSize: "40px",
        fontWeight: "700",
        letterSpacing: "-0.04em",
        textAlign: "center",
      },
      absoluteLayout(340, 50, "400px", "50px", 20),
    ),
    textNode(
      "tagline",
      "עיצוב · פיתוח · צמיחה",
      {
        color: "#7a7166",
        fontSize: "15px",
        fontWeight: "600",
        textAlign: "center",
      },
      absoluteLayout(340, 110, "400px", "24px", 20),
    ),
    ...[
      ["in", "LinkedIn"],
      ["ig", "Instagram"],
      ["tw", "Twitter"],
      ["fb", "Facebook"],
    ].flatMap(([icon, label], index) => {
      const x = 280 + index * 130;
      return [
        boxNode(
          `social-${index}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            border: "1px solid #e6dfd4",
          },
          absoluteLayout(x, 170, "56px", "56px", 8),
        ),
        textNode(
          `icon-${index}`,
          icon,
          {
            color: "#1c1915",
            fontSize: "14px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x, 188, "56px", "24px", 20),
        ),
      ];
    }),
    boxNode(
      "divider",
      { backgroundColor: "#e6dfd4" },
      absoluteLayout(45, 260, "990px", "1px", 5),
    ),
    textNode(
      "links",
      "אודות  ·  תמחור  ·  בלוג  ·  צור קשר  ·  פרטיות",
      { color: "#7a7166", fontSize: "13px", textAlign: "center" },
      absoluteLayout(190, 290, "700px", "22px", 20),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply",
      { color: "#c4b8a8", fontSize: "12px", textAlign: "center" },
      absoluteLayout(440, 320, "200px", "20px", 20),
    ),
  ],
);

/** 6 — פיצול עם CTA */
const splitWithCta = footer(
  "section-footer-showcase-split-cta",
  "פוטר — פיצול עם CTA",
  "footer-showcase-split-cta",
  "#111318",
  "400px",
  IMG.tech,
  [
    textNode(
      "cta-title",
      "מוכנים להתחיל?",
      {
        color: "#ffffff",
        fontSize: "36px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(45, 60, "450px", "45px", 20),
    ),
    textNode(
      "cta-copy",
      "בנו את האתר שלכם היום — בחינם, בלי כרטיס אשראי.",
      { color: "rgba(255,255,255,.65)", fontSize: "16px", lineHeight: "1.55" },
      absoluteLayout(45, 115, "450px", "50px", 20),
    ),
    buttonNode(
      "cta",
      "התחילו בחינם",
      { ...button, backgroundColor: "#f5c86f", color: ink },
      absoluteLayout(45, 190, "190px", "48px", 20),
    ),
    boxNode(
      "divider-v",
      { backgroundColor: "rgba(255,255,255,.1)" },
      absoluteLayout(540, 50, "1px", "300px", 5),
    ),
    textNode(
      "logo",
      "BizUply",
      { color: "#ffffff", fontSize: "24px", fontWeight: "700" },
      absoluteLayout(580, 60, "200px", "32px", 20),
    ),
    ...[
      ["מוצר", "תמחור · תכונות"],
      ["תמיכה", "עזרה · צור קשר"],
      ["משפטי", "פרטיות · תנאים"],
    ].flatMap(([heading, links], index) => {
      const y = 110 + index * 70;
      return [
        textNode(
          `heading-${index}`,
          heading,
          { color: "#ffffff", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(580, y, "150px", "22px", 20),
        ),
        textNode(
          `links-${index}`,
          links,
          { color: "rgba(255,255,255,.5)", fontSize: "13px" },
          absoluteLayout(580, y + 26, "200px", "22px", 20),
        ),
      ];
    }),
    textNode(
      "copyright",
      "© 2026 BizUply",
      { color: "rgba(255,255,255,.35)", fontSize: "12px" },
      absoluteLayout(580, 310, "200px", "20px", 20),
    ),
  ],
);

/** 7 — קומpact שורה אחת */
const compactRow = footer(
  "section-footer-showcase-compact-row",
  "פוטר — שורה קומpact",
  "footer-showcase-compact-row",
  "#ffffff",
  "280px",
  IMG.workspace,
  [
    textNode(
      "logo",
      "BizUply",
      { color: ink, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.03em" },
      absoluteLayout(45, 50, "150px", "30px", 20),
    ),
    textNode(
      "links",
      "אודות  ·  תמחור  ·  בלוג  ·  FAQ  ·  צור קשר  ·  פרטיות  ·  תנאים",
      { color: "#777b82", fontSize: "13px", fontWeight: "600" },
      absoluteLayout(220, 55, "700px", "22px", 20),
    ),
    textNode(
      "social",
      "in  ig  tw",
      { color: "#777b82", fontSize: "13px", fontWeight: "700" },
      absoluteLayout(960, 55, "80px", "22px", 20),
    ),
    boxNode(
      "divider",
      { backgroundColor: "#eceef1" },
      absoluteLayout(45, 110, "990px", "1px", 5),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply · תל אביב, ישראל · כל הזכויות שמורות",
      { color: "#b8bcc3", fontSize: "12px" },
      absoluteLayout(45, 140, "600px", "20px", 20),
    ),
    textNode(
      "lang",
      "עברית  ·  English",
      { color: "#b8bcc3", fontSize: "12px" },
      absoluteLayout(880, 140, "160px", "20px", 20),
    ),
    ...[
      ["🔒", "SSL מאובטח"],
      ["⚡", "99.9% Uptime"],
      ["🇮🇱", "Made in Israel"],
    ].flatMap(([icon, label], index) => {
      const x = 45 + index * 200;
      return [
        textNode(
          `badge-${index}`,
          `${icon}  ${label}`,
          {
            color: "#777b82",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: "#f8f9fa",
            borderRadius: "999px",
            padding: "6px 14px",
          },
          absoluteLayout(x, 190, "170px", "30px", 20),
        ),
      ];
    }),
  ],
);

/** 8 — סגנון מגזין */
const magazineStyle = footer(
  "section-footer-showcase-magazine",
  "פוטר — סגנון מגזין",
  "footer-showcase-magazine",
  "#f1efeb",
  "440px",
  IMG.interior,
  [
    textNode(
      "eyebrow",
      "BizUply · 2026",
      {
        color: "#726a60",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(45, 45, "260px", "22px", 20),
    ),
    textNode(
      "logo",
      "BizUply",
      {
        color: "#181715",
        fontSize: "48px",
        fontWeight: "600",
        letterSpacing: "-0.05em",
      },
      absoluteLayout(45, 75, "300px", "55px", 20),
    ),
    textNode(
      "copy",
      "פלטפורמה ישראלית לבניית אתרים מקצועיים — מהר, יפה, ובלי להתפשר על איכות.",
      { color: "#625d56", fontSize: "15px", lineHeight: "1.6" },
      absoluteLayout(45, 145, "400px", "60px", 20),
    ),
    imageNode(
      "image",
      IMG.interior,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(620, 45, "410px", "200px", 8),
      "הסטודיו",
    ),
    ...[
      ["01", "מוצר", "תמחור · תכונות · דוגמאות · API"],
      ["02", "חברה", "אודות · בלוג · קריירה · עיתונות"],
      ["03", "עזרה", "FAQ · מרכז עזרה · צ׳אט · דוא״ל"],
      ["04", "משפטי", "פרטיות · תנאים · עוגיות · GDPR"],
    ].flatMap(([num, heading, links], index) => {
      const y = 240 + index * 45;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#c4b8a8", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(45, y, "40px", "22px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#181715", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(90, y, "100px", "22px", 20),
        ),
        textNode(
          `links-${index}`,
          links,
          { color: "#777169", fontSize: "13px" },
          absoluteLayout(200, y, "400px", "22px", 20),
        ),
      ];
    }),
    boxNode(
      "divider",
      { backgroundColor: "rgba(24,23,21,.08)" },
      absoluteLayout(45, 420, "990px", "1px", 5),
    ),
    textNode(
      "copyright",
      "© 2026 BizUply · תל אביב",
      { color: "#9a9590", fontSize: "12px" },
      absoluteLayout(45, 440, "300px", "20px", 20),
    ),
    textNode(
      "social",
      "LinkedIn · Instagram · Twitter · Facebook",
      { color: "#777169", fontSize: "12px" },
      absoluteLayout(550, 440, "480px", "20px", 20),
    ),
  ],
);

export const FOOTER_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  multiColumn,
  minimalCentered,
  darkFullWidth,
  newsletterLinks,
  logoSocial,
  splitWithCta,
  compactRow,
  magazineStyle,
];
