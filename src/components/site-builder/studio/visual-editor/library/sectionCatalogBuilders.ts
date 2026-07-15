import {
  absoluteLayout,
  boxNode,
  buttonNode,
  iconNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import { VISUAL_LIBRARY_IMAGES } from "./libraryAssets";
import type {
  VisualLibraryCategory,
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

type ImgKey = keyof typeof VISUAL_LIBRARY_IMAGES;

const copy = {
  color: "#475569",
  fontSize: "17px",
  fontWeight: "500",
  lineHeight: "1.7",
} as const;

const btnPrimary = {
  color: "#ffffff",
  backgroundColor: "#0f172a",
  borderRadius: "999px",
  padding: "14px 26px",
  fontSize: "16px",
  fontWeight: "900",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

const btnSoft = {
  color: "#0f172a",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  padding: "14px 26px",
  fontSize: "16px",
  fontWeight: "900",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

function section(
  id: string,
  category: VisualLibraryCategory,
  title: string,
  description: string,
  opts: {
    keywords?: string[];
    thumbnail?: string;
    minHeight?: string;
    backgroundColor?: string;
    previewLayout?: string;
    nodes: VisualLibraryNodeTemplate[];
  },
): VisualLibrarySectionTemplate {
  return {
    id,
    kind: "section",
    tab: "sections",
    category,
    title,
    description,
    keywords: opts.keywords || [title, category],
    thumbnail: opts.thumbnail,
    minHeight: opts.minHeight || "520px",
    backgroundColor: opts.backgroundColor || "#ffffff",
    previewLayout: opts.previewLayout || category,
    nodes: opts.nodes,
  };
}

function img(key: ImgKey = "office") {
  return VISUAL_LIBRARY_IMAGES[key];
}

/** Hero: text left, image right */
export function heroSplit(opts: {
  id: string;
  title: string;
  description?: string;
  badge: string;
  headline: string;
  copy: string;
  primary: string;
  secondary?: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "office");
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "badge",
      opts.badge,
      {
        color: "#7c3aed",
        backgroundColor: "#f5f3ff",
        borderRadius: "999px",
        padding: "8px 14px",
        fontSize: "13px",
        fontWeight: "900",
      },
      absoluteLayout(60, 70, "210px", "38px", 20),
    ),
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "56px",
        fontWeight: "900",
        lineHeight: "1.05",
      },
      absoluteLayout(60, 130, "480px", "160px", 20),
    ),
    textNode(
      "copy",
      opts.copy,
      copy,
      absoluteLayout(60, 310, "440px", "90px", 20),
    ),
    buttonNode(
      "primary",
      opts.primary,
      { ...btnPrimary, backgroundColor: "#7c3aed" },
      absoluteLayout(60, 430, "170px", "52px", 22),
    ),
    imageNode(
      "image",
      image,
      { borderRadius: "28px", objectFit: "cover" },
      absoluteLayout(560, 60, "520px", "420px", 10),
      "תמונת גיבור",
    ),
  ];
  if (opts.secondary) {
    nodes.splice(
      4,
      0,
      buttonNode(
        "secondary",
        opts.secondary,
        btnSoft,
        absoluteLayout(250, 430, "160px", "52px", 22),
      ),
    );
  }
  return section(opts.id, "hero", opts.title, opts.description || "ברוכים הבאים", {
    keywords: ["ברוכים הבאים", "hero", "כותרת"],
    thumbnail: image,
    minHeight: "540px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes,
  });
}

/** Hero: centered dark overlay look */
export function heroCentered(opts: {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  headline: string;
  copy: string;
  primary: string;
  image?: ImgKey;
  bg?: string;
  light?: boolean;
}): VisualLibrarySectionTemplate {
  const light = Boolean(opts.light);
  const image = img(opts.image || "abstract");
  return section(opts.id, "hero", opts.title, opts.description || "גיבור ממורכז", {
    keywords: ["ברוכים הבאים", "מרכז", "hero"],
    thumbnail: image,
    minHeight: "560px",
    backgroundColor: opts.bg || (light ? "#fff7ed" : "#0f172a"),
    nodes: [
      ...(opts.badge
        ? [
            textNode(
              "badge",
              opts.badge,
              {
                color: light ? "#c2410c" : "#c4b5fd",
                fontSize: "14px",
                fontWeight: "900",
                textAlign: "center",
              },
              absoluteLayout(300, 90, "480px", "30px", 20),
            ),
          ]
        : []),
      textNode(
        "title",
        opts.headline,
        {
          color: light ? "#0f172a" : "#ffffff",
          fontSize: "58px",
          fontWeight: "900",
          lineHeight: "1.08",
          textAlign: "center",
        },
        absoluteLayout(180, 140, "720px", "140px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          ...copy,
          color: light ? "#475569" : "#cbd5e1",
          textAlign: "center",
        },
        absoluteLayout(260, 300, "560px", "80px", 20),
      ),
      buttonNode(
        "primary",
        opts.primary,
        {
          ...btnPrimary,
          backgroundColor: light ? "#ea580c" : "#8b5cf6",
        },
        absoluteLayout(440, 420, "200px", "54px", 22),
      ),
      imageNode(
        "image",
        image,
        {
          borderRadius: "24px",
          objectFit: "cover",
          opacity: light ? "0.95" : "0.35",
        },
        absoluteLayout(60, 40, "960px", "480px", 5),
        "רקע",
      ),
    ],
  });
}

/** About / split text+image with flip option via x positions */
export function aboutSplit(opts: {
  id: string;
  title: string;
  description?: string;
  eyebrow: string;
  headline: string;
  copy: string;
  cta: string;
  image?: ImgKey;
  imageRight?: boolean;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "team");
  const textX = opts.imageRight ? 60 : 560;
  const imgX = opts.imageRight ? 560 : 60;
  return section(opts.id, "about", opts.title, opts.description || "אודות", {
    keywords: ["אודות", "סיפור", "עסק"],
    thumbnail: image,
    minHeight: "500px",
    backgroundColor: opts.bg || "#ffffff",
    nodes: [
      imageNode(
        "image",
        image,
        { borderRadius: "28px", objectFit: "cover" },
        absoluteLayout(imgX, 55, "460px", "390px", 10),
        "תמונת אודות",
      ),
      textNode(
        "eyebrow",
        opts.eyebrow,
        { color: "#7c3aed", fontSize: "14px", fontWeight: "900" },
        absoluteLayout(textX, 80, "220px", "28px", 20),
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "42px",
          fontWeight: "900",
          lineHeight: "1.15",
        },
        absoluteLayout(textX, 120, "460px", "110px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        copy,
        absoluteLayout(textX, 250, "440px", "110px", 20),
      ),
      buttonNode(
        "primary",
        opts.cta,
        btnPrimary,
        absoluteLayout(textX, 390, "170px", "50px", 22),
      ),
    ],
  });
}

/** Services: N vertical cards */
export function servicesCards(opts: {
  id: string;
  title: string;
  description?: string;
  headline: string;
  items: Array<{ title: string; copy: string; cta?: string }>;
  bg?: string;
  withImages?: boolean;
  imageKeys?: ImgKey[];
}): VisualLibrarySectionTemplate {
  const count = Math.min(4, Math.max(2, opts.items.length));
  const gap = 24;
  const cardW = count === 4 ? 230 : count === 2 ? 460 : 300;
  const startX = 60;
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 40, "680px", "60px", 20),
    ),
  ];

  opts.items.slice(0, count).forEach((item, i) => {
    const x = startX + i * (cardW + gap);
    const yBase = 130;
    if (opts.withImages) {
      const key = opts.imageKeys?.[i] || (["beauty", "food", "wellness", "tech"][i] as ImgKey);
      nodes.push(
        imageNode(
          `img${i + 1}`,
          img(key),
          { borderRadius: "20px", objectFit: "cover" },
          absoluteLayout(x, yBase, `${cardW}px`, "180px", 10),
          item.title,
        ),
      );
    } else {
      nodes.push(
        boxNode(
          `card${i + 1}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
          },
          absoluteLayout(x, yBase, `${cardW}px`, "280px", 8),
          item.title,
        ),
        iconNode(
          `icon${i + 1}`,
          ["✦", "◆", "●", "▲"][i] || "✦",
          {
            color: "#7c3aed",
            fontSize: "28px",
            fontWeight: "900",
          },
          absoluteLayout(x + 24, yBase + 28, "40px", "40px", 12),
        ),
      );
    }
    const textY = opts.withImages ? yBase + 200 : yBase + 90;
    nodes.push(
      textNode(
        `title${i + 1}`,
        item.title,
        { color: "#0f172a", fontSize: "20px", fontWeight: "900" },
        absoluteLayout(x + 20, textY, `${cardW - 40}px`, "40px", 20),
      ),
      textNode(
        `copy${i + 1}`,
        item.copy,
        { ...copy, fontSize: "15px" },
        absoluteLayout(x + 20, textY + 45, `${cardW - 40}px`, "70px", 20),
      ),
    );
    if (item.cta) {
      nodes.push(
        buttonNode(
          `cta${i + 1}`,
          item.cta,
          {
            ...btnSoft,
            color: "#7c3aed",
            border: "none",
            padding: "8px 0",
          },
          absoluteLayout(x + 20, textY + 120, "120px", "36px", 22),
        ),
      );
    }
  });

  return section(opts.id, "services", opts.title, opts.description || "שירותים", {
    keywords: ["שירותים", "הצעות", "כרטיסים"],
    minHeight: opts.withImages ? "560px" : "520px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes,
  });
}

/** Services list (rows) */
export function servicesList(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; copy: string; meta?: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
      absoluteLayout(60, 50, "360px", "70px", 20),
    ),
  ];
  opts.items.slice(0, 4).forEach((item, i) => {
    const y = 140 + i * 90;
    nodes.push(
      textNode(
        `title${i + 1}`,
        item.title,
        { color: "#0f172a", fontSize: "20px", fontWeight: "900" },
        absoluteLayout(420, y, "280px", "36px", 20),
      ),
      textNode(
        `copy${i + 1}`,
        item.copy,
        { ...copy, fontSize: "15px" },
        absoluteLayout(700, y, "280px", "60px", 20),
      ),
    );
    if (item.meta) {
      nodes.push(
        textNode(
          `meta${i + 1}`,
          item.meta,
          { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(420, y + 36, "120px", "24px", 20),
        ),
      );
    }
    nodes.push(
      boxNode(
        `line${i + 1}`,
        { backgroundColor: "#e2e8f0", height: "1px" },
        absoluteLayout(420, y + 72, "560px", "1px", 5),
      ),
    );
  });
  return section(opts.id, "services", opts.title, "רשימת שירותים נקייה", {
    keywords: ["שירותים", "רשימה"],
    minHeight: "540px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}

/** Features icon row / grid */
export function featuresGrid(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; copy: string }>;
  cols?: 2 | 3 | 4;
  bg?: string;
  numbered?: boolean;
}): VisualLibrarySectionTemplate {
  const cols = opts.cols || 3;
  const count = Math.min(cols * 2, opts.items.length);
  const cardW = cols === 4 ? 230 : cols === 2 ? 460 : 300;
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 40, "680px", "55px", 20),
    ),
  ];
  opts.items.slice(0, count).forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 60 + col * (cardW + 24);
    const y = 130 + row * 160;
    nodes.push(
      textNode(
        `mark${i + 1}`,
        opts.numbered ? String(i + 1).padStart(2, "0") : "✦",
        {
          color: "#7c3aed",
          fontSize: opts.numbered ? "28px" : "22px",
          fontWeight: "900",
        },
        absoluteLayout(x, y, "60px", "36px", 20),
      ),
      textNode(
        `title${i + 1}`,
        item.title,
        { color: "#0f172a", fontSize: "20px", fontWeight: "900" },
        absoluteLayout(x, y + 40, `${cardW - 20}px`, "36px", 20),
      ),
      textNode(
        `copy${i + 1}`,
        item.copy,
        { ...copy, fontSize: "15px" },
        absoluteLayout(x, y + 80, `${cardW - 20}px`, "60px", 20),
      ),
    );
  });
  return section(opts.id, "features", opts.title, "יתרונות ופיצ׳רים", {
    keywords: ["יתרונות", "features", "למה אנחנו"],
    minHeight: "480px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}

/** Features split with image */
export function featuresSplit(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; copy: string }>;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "tech");
  const nodes: VisualLibraryNodeTemplate[] = [
    imageNode(
      "image",
      image,
      { borderRadius: "28px", objectFit: "cover" },
      absoluteLayout(60, 50, "420px", "440px", 10),
      "תמונת יתרונות",
    ),
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "38px",
        fontWeight: "900",
        lineHeight: "1.15",
      },
      absoluteLayout(520, 50, "460px", "80px", 20),
    ),
  ];
  opts.items.slice(0, 4).forEach((item, i) => {
    const y = 150 + i * 85;
    nodes.push(
      textNode(
        `title${i + 1}`,
        item.title,
        { color: "#0f172a", fontSize: "18px", fontWeight: "900" },
        absoluteLayout(520, y, "440px", "30px", 20),
      ),
      textNode(
        `copy${i + 1}`,
        item.copy,
        { ...copy, fontSize: "14px" },
        absoluteLayout(520, y + 32, "440px", "45px", 20),
      ),
    );
  });
  return section(opts.id, "features", opts.title, "יתרונות לצד תמונה", {
    keywords: ["יתרונות", "מומחיות"],
    thumbnail: image,
    minHeight: "540px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes,
  });
}

/** Contact form + details */
export function contactBlock(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  variant?: "split" | "form-focus" | "details";
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "office");
  const variant = opts.variant || "split";
  if (variant === "details") {
    return section(opts.id, "contact", opts.title, "פרטי קשר", {
      keywords: ["צור קשר", "כתובת", "טלפון"],
      minHeight: "420px",
      backgroundColor: opts.bg || "#ffffff",
      nodes: [
        textNode(
          "title",
          opts.headline,
          { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
          absoluteLayout(60, 50, "500px", "60px", 20),
        ),
        textNode(
          "addr-title",
          "כתובת",
          { color: "#94a3b8", fontSize: "13px", fontWeight: "900" },
          absoluteLayout(60, 150, "200px", "24px", 20),
        ),
        textNode(
          "addr",
          "רחוב הדוגמה 12, תל אביב",
          { color: "#0f172a", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(60, 180, "280px", "50px", 20),
        ),
        textNode(
          "phone-title",
          "טלפון",
          { color: "#94a3b8", fontSize: "13px", fontWeight: "900" },
          absoluteLayout(380, 150, "200px", "24px", 20),
        ),
        textNode(
          "phone",
          "03-555-5555",
          { color: "#0f172a", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(380, 180, "220px", "40px", 20),
        ),
        textNode(
          "mail-title",
          "אימייל",
          { color: "#94a3b8", fontSize: "13px", fontWeight: "900" },
          absoluteLayout(640, 150, "200px", "24px", 20),
        ),
        textNode(
          "mail",
          "hello@example.com",
          { color: "#0f172a", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(640, 180, "280px", "40px", 20),
        ),
        textNode(
          "hours-title",
          "שעות פעילות",
          { color: "#94a3b8", fontSize: "13px", fontWeight: "900" },
          absoluteLayout(60, 280, "200px", "24px", 20),
        ),
        textNode(
          "hours",
          "א׳–ה׳ 09:00–18:00",
          { color: "#0f172a", fontSize: "17px", fontWeight: "700" },
          absoluteLayout(60, 310, "280px", "40px", 20),
        ),
      ],
    });
  }

  return section(opts.id, "contact", opts.title, "טופס יצירת קשר", {
    keywords: ["צור קשר", "טופס", "מיקום"],
    thumbnail: image,
    minHeight: "540px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes: [
      textNode(
        "title",
        opts.headline,
        { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(60, 50, "420px", "70px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        copy,
        absoluteLayout(60, 140, "400px", "80px", 20),
      ),
      boxNode(
        "form",
        {
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
        },
        absoluteLayout(60, 240, "420px", "240px", 8),
        "טופס",
      ),
      textNode(
        "field1",
        "שם מלא",
        { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(90, 265, "160px", "28px", 20),
      ),
      textNode(
        "field2",
        "אימייל",
        { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(90, 310, "160px", "28px", 20),
      ),
      textNode(
        "field3",
        "הודעה",
        { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(90, 355, "160px", "28px", 20),
      ),
      buttonNode(
        "primary",
        "שליחה",
        { ...btnPrimary, backgroundColor: "#7c3aed" },
        absoluteLayout(90, 410, "140px", "48px", 22),
      ),
      imageNode(
        "image",
        image,
        { borderRadius: "28px", objectFit: "cover" },
        absoluteLayout(540, 50, "460px", "430px", 10),
        "תמונת קשר",
      ),
    ],
  });
}

/** Products grid */
export function productsGrid(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; price: string; image?: ImgKey }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 40, "680px", "55px", 20),
    ),
  ];
  opts.items.slice(0, 4).forEach((item, i) => {
    const x = 60 + i * 255;
    const key = item.image || (["product", "fashion", "beauty", "food"][i] as ImgKey);
    nodes.push(
      imageNode(
        `img${i + 1}`,
        img(key),
        { borderRadius: "20px", objectFit: "cover" },
        absoluteLayout(x, 120, "230px", "220px", 10),
        item.title,
      ),
      textNode(
        `title${i + 1}`,
        item.title,
        { color: "#0f172a", fontSize: "17px", fontWeight: "900" },
        absoluteLayout(x, 360, "230px", "32px", 20),
      ),
      textNode(
        `price${i + 1}`,
        item.price,
        { color: "#7c3aed", fontSize: "16px", fontWeight: "900" },
        absoluteLayout(x, 395, "120px", "28px", 20),
      ),
      buttonNode(
        `cta${i + 1}`,
        "לרכישה",
        { ...btnSoft, fontSize: "14px", padding: "8px 16px" },
        absoluteLayout(x, 430, "110px", "40px", 22),
      ),
    );
  });
  return section(opts.id, "commerce", opts.title, "תצוגת מוצרים", {
    keywords: ["מוצרים", "חנות", "מכירה"],
    minHeight: "520px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}

/** Featured product spotlight */
export function productSpotlight(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  price: string;
  cta: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "product");
  return section(opts.id, "commerce", opts.title, "מוצר מוביל", {
    keywords: ["מוצר", "מבצע", "חנות"],
    thumbnail: image,
    minHeight: "500px",
    backgroundColor: opts.bg || "#0f172a",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#ffffff",
          fontSize: "48px",
          fontWeight: "900",
          lineHeight: "1.1",
        },
        absoluteLayout(60, 100, "440px", "120px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        { ...copy, color: "#cbd5e1" },
        absoluteLayout(60, 240, "400px", "80px", 20),
      ),
      textNode(
        "price",
        opts.price,
        { color: "#c4b5fd", fontSize: "28px", fontWeight: "900" },
        absoluteLayout(60, 340, "180px", "40px", 20),
      ),
      buttonNode(
        "primary",
        opts.cta,
        { ...btnPrimary, backgroundColor: "#8b5cf6" },
        absoluteLayout(60, 400, "170px", "52px", 22),
      ),
      imageNode(
        "image",
        image,
        { borderRadius: "28px", objectFit: "cover" },
        absoluteLayout(540, 60, "460px", "400px", 10),
        "מוצר",
      ),
    ],
  });
}

/** Promote / newsletter */
export function promoteBlock(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  cta: string;
  variant?: "newsletter" | "banner" | "arched";
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "beauty");
  const variant = opts.variant || "newsletter";
  if (variant === "banner") {
    return section(opts.id, "promote", opts.title, "באנר קידום", {
      keywords: ["קידום", "מבצע", "ניוזלטר"],
      thumbnail: image,
      minHeight: "420px",
      backgroundColor: opts.bg || "#fff1f2",
      nodes: [
        textNode(
          "title",
          opts.headline,
          {
            color: "#881337",
            fontSize: "44px",
            fontWeight: "900",
            lineHeight: "1.1",
          },
          absoluteLayout(60, 100, "480px", "110px", 20),
        ),
        textNode(
          "copy",
          opts.copy,
          { ...copy, color: "#9f1239" },
          absoluteLayout(60, 230, "420px", "70px", 20),
        ),
        buttonNode(
          "primary",
          opts.cta,
          { ...btnPrimary, backgroundColor: "#e11d48" },
          absoluteLayout(60, 320, "180px", "52px", 22),
        ),
        imageNode(
          "image",
          image,
          { borderRadius: "24px", objectFit: "cover" },
          absoluteLayout(560, 50, "460px", "320px", 10),
          "קידום",
        ),
      ],
    });
  }
  return section(opts.id, "promote", opts.title, "הרשמה לניוזלטר", {
    keywords: ["ניוזלטר", "מייל", "עדכונים"],
    thumbnail: image,
    minHeight: "420px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes: [
      imageNode(
        "image",
        image,
        { borderRadius: "24px", objectFit: "cover" },
        absoluteLayout(60, 50, "420px", "320px", 10),
        "ניוזלטר",
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "40px",
          fontWeight: "900",
          lineHeight: "1.15",
        },
        absoluteLayout(520, 80, "440px", "100px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        copy,
        absoluteLayout(520, 200, "420px", "70px", 20),
      ),
      boxNode(
        "input",
        {
          backgroundColor: "#ffffff",
          borderRadius: "999px",
          border: "1px solid #e2e8f0",
        },
        absoluteLayout(520, 290, "280px", "50px", 8),
        "שדה אימייל",
      ),
      textNode(
        "placeholder",
        "האימייל שלכם",
        { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(545, 302, "160px", "28px", 20),
      ),
      buttonNode(
        "primary",
        opts.cta,
        { ...btnPrimary, backgroundColor: "#7c3aed" },
        absoluteLayout(820, 290, "120px", "50px", 22),
      ),
    ],
  });
}

/** CTA strip */
export function ctaBlock(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  primary: string;
  secondary?: string;
  bg?: string;
  dark?: boolean;
}): VisualLibrarySectionTemplate {
  const dark = opts.dark !== false;
  return section(opts.id, "cta", opts.title, "קריאה לפעולה", {
    keywords: ["cta", "התחילו", "פעולה"],
    minHeight: "360px",
    backgroundColor: opts.bg || (dark ? "#0f172a" : "#eef2ff"),
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: dark ? "#ffffff" : "#0f172a",
          fontSize: "44px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(180, 80, "720px", "80px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          ...copy,
          color: dark ? "#cbd5e1" : "#475569",
          textAlign: "center",
        },
        absoluteLayout(260, 180, "560px", "60px", 20),
      ),
      buttonNode(
        "primary",
        opts.primary,
        {
          ...btnPrimary,
          backgroundColor: dark ? "#8b5cf6" : "#4f46e5",
        },
        absoluteLayout(opts.secondary ? 360 : 440, 270, "180px", "52px", 22),
      ),
      ...(opts.secondary
        ? [
            buttonNode(
              "secondary",
              opts.secondary,
              dark
                ? {
                    ...btnSoft,
                    backgroundColor: "transparent",
                    color: "#ffffff",
                    border: "1px solid #475569",
                  }
                : btnSoft,
              absoluteLayout(560, 270, "180px", "52px", 22),
            ),
          ]
        : []),
    ],
  });
}

/** Testimonials */
export function testimonialsBlock(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ quote: string; name: string; role?: string }>;
  variant?: "grid" | "rows" | "logos";
  bg?: string;
}): VisualLibrarySectionTemplate {
  const variant = opts.variant || "grid";
  if (variant === "logos") {
    return section(opts.id, "testimonials", opts.title, "לוגואים ואמון", {
      keywords: ["אמון", "לקוחות", "לוגואים"],
      minHeight: "320px",
      backgroundColor: opts.bg || "#ffffff",
      nodes: [
        textNode(
          "title",
          opts.headline,
          {
            color: "#0f172a",
            fontSize: "32px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(200, 50, "680px", "50px", 20),
        ),
        ...["BRAND", "STUDIO", "LOCAL", "CRAFT", "TRUST"].map((name, i) =>
          textNode(
            `logo${i + 1}`,
            name,
            {
              color: "#94a3b8",
              fontSize: "20px",
              fontWeight: "900",
              letterSpacing: "2px",
              textAlign: "center",
            },
            absoluteLayout(80 + i * 200, 160, "160px", "40px", 20),
          ),
        ),
      ],
    });
  }

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 40, "680px", "55px", 20),
    ),
  ];
  opts.items.slice(0, 3).forEach((item, i) => {
    const x = 60 + i * 340;
    nodes.push(
      boxNode(
        `card${i + 1}`,
        {
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
        },
        absoluteLayout(x, 120, "310px", "280px", 8),
      ),
      textNode(
        `stars${i + 1}`,
        "★★★★★",
        { color: "#f59e0b", fontSize: "16px", fontWeight: "900" },
        absoluteLayout(x + 24, 145, "140px", "28px", 20),
      ),
      textNode(
        `quote${i + 1}`,
        item.quote,
        { ...copy, fontSize: "15px" },
        absoluteLayout(x + 24, 185, "260px", "110px", 20),
      ),
      textNode(
        `name${i + 1}`,
        item.name,
        { color: "#0f172a", fontSize: "16px", fontWeight: "900" },
        absoluteLayout(x + 24, 320, "200px", "28px", 20),
      ),
      textNode(
        `role${i + 1}`,
        item.role || "לקוח/ה",
        { color: "#94a3b8", fontSize: "13px", fontWeight: "700" },
        absoluteLayout(x + 24, 348, "200px", "24px", 20),
      ),
    );
  });
  return section(opts.id, "testimonials", opts.title, "המלצות לקוחות", {
    keywords: ["ביקורות", "המלצות", "אמון"],
    minHeight: "480px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes,
  });
}

/** Events */
export function eventsBlock(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; date: string; place: string }>;
  variant?: "cards" | "list" | "agenda";
  bg?: string;
}): VisualLibrarySectionTemplate {
  const variant = opts.variant || "cards";
  if (variant === "list") {
    const nodes: VisualLibraryNodeTemplate[] = [
      textNode(
        "title",
        opts.headline,
        { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(60, 40, "500px", "55px", 20),
      ),
    ];
    opts.items.slice(0, 4).forEach((item, i) => {
      const y = 120 + i * 85;
      nodes.push(
        textNode(
          `date${i + 1}`,
          item.date,
          { color: "#7c3aed", fontSize: "14px", fontWeight: "900" },
          absoluteLayout(60, y, "140px", "28px", 20),
        ),
        textNode(
          `title${i + 1}`,
          item.title,
          { color: "#0f172a", fontSize: "20px", fontWeight: "900" },
          absoluteLayout(220, y, "420px", "32px", 20),
        ),
        textNode(
          `place${i + 1}`,
          item.place,
          { color: "#64748b", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(220, y + 34, "300px", "24px", 20),
        ),
        buttonNode(
          `cta${i + 1}`,
          "הרשמה",
          { ...btnPrimary, backgroundColor: "#7c3aed", fontSize: "14px", padding: "10px 18px" },
          absoluteLayout(860, y + 8, "110px", "42px", 22),
        ),
      );
    });
    return section(opts.id, "events", opts.title, "רשימת אירועים", {
      keywords: ["אירועים", "לוח", "הרשמה"],
      minHeight: "500px",
      backgroundColor: opts.bg || "#ffffff",
      nodes,
    });
  }

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 40, "680px", "55px", 20),
    ),
  ];
  opts.items.slice(0, 3).forEach((item, i) => {
    const x = 60 + i * 340;
    const key = (["wellness", "travel", "team"][i] || "office") as ImgKey;
    nodes.push(
      imageNode(
        `img${i + 1}`,
        img(key),
        { borderRadius: "20px", objectFit: "cover" },
        absoluteLayout(x, 120, "310px", "180px", 10),
        item.title,
      ),
      textNode(
        `title${i + 1}`,
        item.title,
        { color: "#0f172a", fontSize: "20px", fontWeight: "900" },
        absoluteLayout(x, 320, "300px", "36px", 20),
      ),
      textNode(
        `meta${i + 1}`,
        `${item.date} · ${item.place}`,
        { color: "#64748b", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(x, 360, "300px", "28px", 20),
      ),
      buttonNode(
        `cta${i + 1}`,
        "פרטים",
        { ...btnPrimary, backgroundColor: "#7c3aed", fontSize: "14px" },
        absoluteLayout(x, 400, "120px", "44px", 22),
      ),
    );
  });
  return section(opts.id, "events", opts.title, "כרטיסי אירועים", {
    keywords: ["אירועים", "כרטיסים"],
    minHeight: "520px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes,
  });
}

/** Blog */
export function blogBlock(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; excerpt: string; date?: string }>;
  featured?: boolean;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
      absoluteLayout(60, 40, "500px", "55px", 20),
    ),
  ];

  if (opts.featured) {
    nodes.push(
      imageNode(
        "featured-img",
        img("tech"),
        { borderRadius: "24px", objectFit: "cover" },
        absoluteLayout(60, 120, "480px", "320px", 10),
        "פוסט מומלץ",
      ),
      textNode(
        "featured-title",
        opts.items[0]?.title || "כותרת הפוסט",
        {
          color: "#0f172a",
          fontSize: "28px",
          fontWeight: "900",
          lineHeight: "1.2",
        },
        absoluteLayout(580, 140, "400px", "90px", 20),
      ),
      textNode(
        "featured-copy",
        opts.items[0]?.excerpt || "",
        copy,
        absoluteLayout(580, 250, "380px", "100px", 20),
      ),
      buttonNode(
        "primary",
        "קראו עוד",
        btnPrimary,
        absoluteLayout(580, 380, "140px", "48px", 22),
      ),
    );
  } else {
    opts.items.slice(0, 3).forEach((item, i) => {
      const x = 60 + i * 340;
      const key = (["office", "fashion", "travel"][i] || "office") as ImgKey;
      nodes.push(
        imageNode(
          `img${i + 1}`,
          img(key),
          { borderRadius: "18px", objectFit: "cover" },
          absoluteLayout(x, 120, "310px", "170px", 10),
          item.title,
        ),
        textNode(
          `date${i + 1}`,
          item.date || "מרץ 2026",
          { color: "#94a3b8", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(x, 310, "160px", "24px", 20),
        ),
        textNode(
          `title${i + 1}`,
          item.title,
          { color: "#0f172a", fontSize: "18px", fontWeight: "900" },
          absoluteLayout(x, 340, "300px", "50px", 20),
        ),
        buttonNode(
          `cta${i + 1}`,
          "קראו עוד",
          { ...btnSoft, color: "#7c3aed", border: "none", padding: "6px 0" },
          absoluteLayout(x, 410, "100px", "32px", 22),
        ),
      );
    });
  }

  return section(opts.id, "blog", opts.title, "בלוג ותוכן", {
    keywords: ["בלוג", "מאמרים", "תוכן"],
    minHeight: "520px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}

/** Pricing */
export function pricingBlock(opts: {
  id: string;
  title: string;
  headline: string;
  plans: Array<{
    name: string;
    price: string;
    features: string;
    popular?: boolean;
  }>;
  variant?: "cards" | "rows";
  bg?: string;
}): VisualLibrarySectionTemplate {
  if (opts.variant === "rows") {
    const nodes: VisualLibraryNodeTemplate[] = [
      textNode(
        "title",
        opts.headline,
        { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
        absoluteLayout(60, 40, "400px", "55px", 20),
      ),
    ];
    opts.plans.slice(0, 3).forEach((plan, i) => {
      const y = 130 + i * 110;
      nodes.push(
        textNode(
          `name${i + 1}`,
          plan.name,
          { color: "#0f172a", fontSize: "22px", fontWeight: "900" },
          absoluteLayout(60, y, "200px", "36px", 20),
        ),
        textNode(
          `copy${i + 1}`,
          plan.features,
          { ...copy, fontSize: "15px" },
          absoluteLayout(280, y, "420px", "60px", 20),
        ),
        textNode(
          `price${i + 1}`,
          plan.price,
          { color: "#7c3aed", fontSize: "22px", fontWeight: "900" },
          absoluteLayout(720, y, "120px", "36px", 20),
        ),
        buttonNode(
          `cta${i + 1}`,
          "בחירה",
          btnPrimary,
          absoluteLayout(860, y, "110px", "44px", 22),
        ),
      );
    });
    return section(opts.id, "pricing", opts.title, "חבילות בשורות", {
      keywords: ["תמחור", "חבילות"],
      minHeight: "480px",
      backgroundColor: opts.bg || "#ffffff",
      nodes,
    });
  }

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 30, "680px", "55px", 20),
    ),
  ];
  opts.plans.slice(0, 3).forEach((plan, i) => {
    const x = 60 + i * 340;
    nodes.push(
      boxNode(
        `card${i + 1}`,
        {
          backgroundColor: plan.popular ? "#0f172a" : "#ffffff",
          borderRadius: "28px",
          border: plan.popular ? "none" : "1px solid #e2e8f0",
        },
        absoluteLayout(x, 110, "310px", "360px", 8),
      ),
      textNode(
        `name${i + 1}`,
        plan.name,
        {
          color: plan.popular ? "#c4b5fd" : "#64748b",
          fontSize: "16px",
          fontWeight: "900",
        },
        absoluteLayout(x + 28, 140, "240px", "28px", 20),
      ),
      textNode(
        `price${i + 1}`,
        plan.price,
        {
          color: plan.popular ? "#ffffff" : "#0f172a",
          fontSize: "42px",
          fontWeight: "900",
        },
        absoluteLayout(x + 28, 180, "240px", "55px", 20),
      ),
      textNode(
        `features${i + 1}`,
        plan.features,
        {
          color: plan.popular ? "#cbd5e1" : "#475569",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "1.8",
          whiteSpace: "pre-line",
        },
        absoluteLayout(x + 28, 250, "250px", "120px", 20),
      ),
      buttonNode(
        `cta${i + 1}`,
        plan.popular ? "הכי פופולרי" : "בחירה",
        {
          ...btnPrimary,
          backgroundColor: plan.popular ? "#8b5cf6" : "#0f172a",
        },
        absoluteLayout(x + 28, 390, "160px", "48px", 22),
      ),
    );
  });
  return section(opts.id, "pricing", opts.title, "מחירון כרטיסים", {
    keywords: ["תמחור", "מחירים", "מנויים"],
    minHeight: "540px",
    backgroundColor: opts.bg || "#f8fafc",
    nodes,
  });
}

/** Resume / CV */
export function resumeBlock(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ role: string; place: string; dates: string; copy?: string }>;
  variant?: "timeline" | "skills" | "awards";
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const variant = opts.variant || "timeline";
  if (variant === "skills") {
    return section(opts.id, "resume", opts.title, "מיומנויות", {
      keywords: ["קורות חיים", "כישורים"],
      minHeight: "400px",
      backgroundColor: opts.bg || "#ffffff",
      nodes: [
        textNode(
          "title",
          opts.headline,
          { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
          absoluteLayout(60, 50, "400px", "55px", 20),
        ),
        ...opts.items.slice(0, 6).map((item, i) =>
          textNode(
            `skill${i + 1}`,
            item.role,
            {
              color: "#0f172a",
              fontSize: "18px",
              fontWeight: "800",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "10px",
            },
            absoluteLayout(60, 140 + i * 50, "900px", "40px", 20),
          ),
        ),
      ],
    });
  }

  const image = img(opts.image || "team");
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
      absoluteLayout(60, 40, "480px", "60px", 20),
    ),
  ];
  opts.items.slice(0, 4).forEach((item, i) => {
    const y = 120 + i * 90;
    nodes.push(
      textNode(
        `dates${i + 1}`,
        item.dates,
        { color: "#7c3aed", fontSize: "14px", fontWeight: "900" },
        absoluteLayout(60, y, "160px", "28px", 20),
      ),
      textNode(
        `role${i + 1}`,
        item.role,
        { color: "#0f172a", fontSize: "20px", fontWeight: "900" },
        absoluteLayout(240, y, "360px", "32px", 20),
      ),
      textNode(
        `place${i + 1}`,
        item.place,
        { color: "#64748b", fontSize: "15px", fontWeight: "700" },
        absoluteLayout(240, y + 34, "360px", "28px", 20),
      ),
    );
  });
  nodes.push(
    imageNode(
      "image",
      image,
      { borderRadius: "28px", objectFit: "cover" },
      absoluteLayout(680, 100, "300px", "380px", 10),
      "דיוקן",
    ),
  );
  return section(opts.id, "resume", opts.title, "ניסיון מקצועי", {
    keywords: ["קורות חיים", "ניסיון", "עבודה"],
    thumbnail: image,
    minHeight: "540px",
    backgroundColor: opts.bg || "#fafaf9",
    nodes,
  });
}

/** Portfolio gallery */
export function portfolioGrid(opts: {
  id: string;
  title: string;
  headline: string;
  count?: 3 | 4 | 6;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const count = opts.count || 6;
  const keys: ImgKey[] = [
    "construction",
    "fashion",
    "realestate",
    "food",
    "travel",
    "tech",
  ];
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 35, "680px", "55px", 20),
    ),
  ];
  const cols = count === 3 ? 3 : count === 4 ? 4 : 3;
  const w = cols === 4 ? 230 : 300;
  keys.slice(0, count).forEach((key, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 60 + col * (w + 24);
    const y = 110 + row * 210;
    nodes.push(
      imageNode(
        `img${i + 1}`,
        img(key),
        { borderRadius: "20px", objectFit: "cover" },
        absoluteLayout(x, y, `${w}px`, "180px", 10),
        `פרויקט ${i + 1}`,
      ),
      textNode(
        `title${i + 1}`,
        `פרויקט ${i + 1}`,
        { color: "#0f172a", fontSize: "16px", fontWeight: "900" },
        absoluteLayout(x, y + 190, `${w}px`, "28px", 20),
      ),
    );
  });
  return section(opts.id, "portfolio", opts.title, "גלריית עבודות", {
    keywords: ["פורטפוליו", "עבודות", "גלריה"],
    minHeight: count > 3 ? "560px" : "420px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}

/** FAQ accordion-like list */
export function faqBlock(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ q: string; a: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
      absoluteLayout(60, 40, "500px", "55px", 20),
    ),
  ];
  opts.items.slice(0, 4).forEach((item, i) => {
    const y = 120 + i * 95;
    nodes.push(
      textNode(
        `q${i + 1}`,
        item.q,
        { color: "#0f172a", fontSize: "18px", fontWeight: "900" },
        absoluteLayout(60, y, "900px", "32px", 20),
      ),
      textNode(
        `a${i + 1}`,
        item.a,
        { ...copy, fontSize: "15px" },
        absoluteLayout(60, y + 36, "900px", "45px", 20),
      ),
    );
  });
  return section(opts.id, "faq", opts.title, "שאלות ותשובות", {
    keywords: ["שאלות", "faq"],
    minHeight: "520px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}

/** Stats strip */
export function statsBlock(opts: {
  id: string;
  title: string;
  items: Array<{ value: string; label: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  return section(opts.id, "stats", opts.title, "מספרים שמספרים", {
    keywords: ["סטטיסטיקה", "הישגים"],
    minHeight: "280px",
    backgroundColor: opts.bg || "#0f172a",
    nodes: opts.items.slice(0, 4).map((item, i) => {
      const x = 80 + i * 250;
      return [
        textNode(
          `value${i + 1}`,
          item.value,
          {
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(x, 80, "200px", "60px", 20),
        ),
        textNode(
          `label${i + 1}`,
          item.label,
          {
            color: "#94a3b8",
            fontSize: "15px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x, 155, "200px", "40px", 20),
        ),
      ];
    }).flat(),
  });
}

/** Team */
export function teamBlock(opts: {
  id: string;
  title: string;
  headline: string;
  members: Array<{ name: string; role: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        textAlign: "center",
      },
      absoluteLayout(200, 35, "680px", "55px", 20),
    ),
  ];
  opts.members.slice(0, 4).forEach((m, i) => {
    const x = 60 + i * 255;
    nodes.push(
      imageNode(
        `img${i + 1}`,
        img("team"),
        { borderRadius: "24px", objectFit: "cover" },
        absoluteLayout(x, 110, "230px", "240px", 10),
        m.name,
      ),
      textNode(
        `name${i + 1}`,
        m.name,
        { color: "#0f172a", fontSize: "18px", fontWeight: "900" },
        absoluteLayout(x, 370, "230px", "30px", 20),
      ),
      textNode(
        `role${i + 1}`,
        m.role,
        { color: "#64748b", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(x, 402, "230px", "28px", 20),
      ),
    );
  });
  return section(opts.id, "team", opts.title, "הצוות שלנו", {
    keywords: ["צוות", "אנשים"],
    minHeight: "500px",
    backgroundColor: opts.bg || "#ffffff",
    nodes,
  });
}
