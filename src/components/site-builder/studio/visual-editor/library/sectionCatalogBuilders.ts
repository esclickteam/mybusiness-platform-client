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
  previewLayout?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "team");
  const textX = opts.imageRight ? 60 : 560;
  const imgX = opts.imageRight ? 560 : 60;
  return section(opts.id, "about", opts.title, opts.description || "אודות", {
    keywords: ["אודות", "סיפור", "עסק"],
    thumbnail: image,
    minHeight: "500px",
    backgroundColor: opts.bg || "#ffffff",
    previewLayout:
      opts.previewLayout ||
      (opts.imageRight ? "about-split-image-right" : "about-split-image-left"),
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
  /** Mixed shapes: each card can look different */
  cardRadius?: string | string[];
  imageRadius?: string | string[];
  previewLayout?: string;
}): VisualLibrarySectionTemplate {
  const count = Math.min(4, Math.max(2, opts.items.length));
  const gap = 24;
  const cardW = count === 4 ? 230 : count === 2 ? 460 : 300;
  const startX = 60;
  const radiusAt = (value: string | string[] | undefined, i: number, fallback: string) =>
    Array.isArray(value) ? value[i % value.length] : value || fallback;

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
    const cardR = radiusAt(opts.cardRadius, i, "24px");
    const imgR = radiusAt(opts.imageRadius, i, "20px");
    if (opts.withImages) {
      const key = opts.imageKeys?.[i] || (["beauty", "food", "wellness", "tech"][i] as ImgKey);
      nodes.push(
        imageNode(
          `img${i + 1}`,
          img(key),
          { borderRadius: imgR, objectFit: "cover" },
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
            borderRadius: cardR,
            border: cardR === "0px" ? "2px solid #0f172a" : "1px solid #e2e8f0",
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
    previewLayout: opts.previewLayout,
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
  imageRadius?: string;
  formRadius?: string;
  previewLayout?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "office");
  const variant = opts.variant || "split";
  const imageRadius = opts.imageRadius ?? "28px";
  const formRadius = opts.formRadius ?? "24px";
  const btnRadius =
    formRadius === "0px" ? "0px" : formRadius === "32px" ? "999px" : "14px";

  if (variant === "details") {
    return section(opts.id, "contact", opts.title, "פרטי קשר", {
      keywords: ["צור קשר", "כתובת", "טלפון"],
      minHeight: "420px",
      backgroundColor: opts.bg || "#ffffff",
      previewLayout: opts.previewLayout || "contact-details-icons-grid",
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

  if (variant === "form-focus") {
    return section(opts.id, "contact", opts.title, "טופס מרכזי", {
      keywords: ["צור קשר", "טופס"],
      thumbnail: image,
      minHeight: "520px",
      backgroundColor: opts.bg || "#ffffff",
      previewLayout: opts.previewLayout || "contact-centered-minimal-form",
      nodes: [
        textNode(
          "title",
          opts.headline,
          {
            color: "#0f172a",
            fontSize: "40px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(260, 50, "520px", "60px", 20),
        ),
        textNode(
          "copy",
          opts.copy,
          { ...copy, textAlign: "center" },
          absoluteLayout(280, 120, "480px", "60px", 20),
        ),
        boxNode(
          "form",
          {
            backgroundColor: "#ffffff",
            borderRadius: formRadius,
            border:
              formRadius === "0px" ? "2px solid #0f172a" : "1px solid #e2e8f0",
          },
          absoluteLayout(300, 200, "480px", "260px", 8),
          "טופס",
        ),
        textNode(
          "field1",
          "שם מלא",
          { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(340, 230, "200px", "28px", 20),
        ),
        textNode(
          "field2",
          "אימייל",
          { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(340, 280, "200px", "28px", 20),
        ),
        textNode(
          "field3",
          "הודעה",
          { color: "#94a3b8", fontSize: "14px", fontWeight: "700" },
          absoluteLayout(340, 330, "200px", "28px", 20),
        ),
        buttonNode(
          "primary",
          "שליחה",
          {
            ...btnPrimary,
            backgroundColor: "#ea580c",
            borderRadius: btnRadius,
          },
          absoluteLayout(470, 390, "140px", "48px", 22),
        ),
      ],
    });
  }

  return section(opts.id, "contact", opts.title, "טופס יצירת קשר", {
    keywords: ["צור קשר", "טופס", "מיקום"],
    thumbnail: image,
    minHeight: "540px",
    backgroundColor: opts.bg || "#f8fafc",
    previewLayout: opts.previewLayout || "contact-form-left-image-right",
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
          borderRadius: formRadius,
          border:
            formRadius === "0px" ? "2px solid #0f172a" : "1px solid #e2e8f0",
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
        {
          ...btnPrimary,
          backgroundColor: "#7c3aed",
          borderRadius: btnRadius,
        },
        absoluteLayout(90, 410, "140px", "48px", 22),
      ),
      imageNode(
        "image",
        image,
        { borderRadius: imageRadius, objectFit: "cover" },
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
  variant?: "cards" | "featured" | "list" | "magazine" | "overlay" | "square-grid";
  cardRadius?: string;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const variant = opts.variant ?? (opts.featured ? "featured" : "cards");
  const cardRadius = opts.cardRadius ?? "18px";
  const imgKeys = ["office", "fashion", "travel", "tech", "food", "wellness"] as const;

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      { color: "#0f172a", fontSize: "40px", fontWeight: "900" },
      absoluteLayout(60, 40, "500px", "55px", 20),
    ),
  ];

  if (variant === "featured") {
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
  } else if (variant === "list") {
    opts.items.slice(0, 4).forEach((item, i) => {
      const y = 120 + i * 95;
      const key = imgKeys[i % imgKeys.length];
      nodes.push(
        imageNode(
          `thumb${i + 1}`,
          img(key),
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(60, y, "80px", "80px", 10),
          item.title,
        ),
        textNode(
          `title${i + 1}`,
          item.title,
          { color: "#0f172a", fontSize: "18px", fontWeight: "900" },
          absoluteLayout(160, y + 8, "520px", "40px", 20),
        ),
        textNode(
          `date${i + 1}`,
          item.date || "מרץ 2026",
          { color: "#94a3b8", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(160, y + 52, "200px", "24px", 20),
        ),
      );
    });
  } else if (variant === "magazine") {
    nodes.push(
      imageNode(
        "featured-img",
        img("fashion"),
        { borderRadius: "0px", objectFit: "cover" },
        absoluteLayout(60, 120, "520px", "360px", 10),
        "כתבה ראשית",
      ),
    );
    opts.items.slice(0, 2).forEach((item, i) => {
      const y = 120 + i * 185;
      const key = imgKeys[i + 2];
      nodes.push(
        imageNode(
          `thumb${i + 1}`,
          img(key),
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(620, y, "120px", "90px", 10),
          item.title,
        ),
        textNode(
          `title${i + 1}`,
          item.title,
          { color: "#0f172a", fontSize: "17px", fontWeight: "900", lineHeight: "1.3" },
          absoluteLayout(760, y + 4, "260px", "50px", 20),
        ),
        textNode(
          `date${i + 1}`,
          item.date || "מרץ 2026",
          { color: "#94a3b8", fontSize: "12px", fontWeight: "700" },
          absoluteLayout(760, y + 58, "160px", "24px", 20),
        ),
      );
    });
  } else if (variant === "overlay") {
    opts.items.slice(0, 3).forEach((item, i) => {
      const x = 60 + i * 340;
      const key = imgKeys[i];
      nodes.push(
        imageNode(
          `img${i + 1}`,
          img(key),
          { borderRadius: "8px", objectFit: "cover" },
          absoluteLayout(x, 120, "310px", "280px", 10),
          item.title,
        ),
        boxNode(
          `overlay${i + 1}`,
          {
            backgroundImage: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)",
            borderRadius: "8px",
          },
          absoluteLayout(x, 120, "310px", "280px", 11),
          "שכבה",
        ),
        textNode(
          `title${i + 1}`,
          item.title,
          { color: "#ffffff", fontSize: "17px", fontWeight: "900", lineHeight: "1.3" },
          absoluteLayout(x + 20, 330, "270px", "50px", 20),
        ),
        textNode(
          `date${i + 1}`,
          item.date || "מרץ 2026",
          { color: "#cbd5e1", fontSize: "12px", fontWeight: "700" },
          absoluteLayout(x + 20, 370, "160px", "20px", 20),
        ),
      );
    });
  } else if (variant === "square-grid") {
    opts.items.slice(0, 4).forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 60 + col * 500;
      const y = 120 + row * 200;
      const key = imgKeys[i];
      nodes.push(
        imageNode(
          `img${i + 1}`,
          img(key),
          { borderRadius: "0px", objectFit: "cover" },
          absoluteLayout(x, y, "460px", "160px", 10),
          item.title,
        ),
        textNode(
          `title${i + 1}`,
          item.title,
          { color: "#0f172a", fontSize: "16px", fontWeight: "900" },
          absoluteLayout(x, y + 170, "440px", "24px", 20),
        ),
      );
    });
  } else {
    opts.items.slice(0, 3).forEach((item, i) => {
      const x = 60 + i * 340;
      const key = imgKeys[i] || "office";
      nodes.push(
        imageNode(
          `img${i + 1}`,
          img(key),
          { borderRadius: cardRadius, objectFit: "cover" },
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
  imageRadius?: string | string[];
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
  const radiusAt = (i: number) =>
    Array.isArray(opts.imageRadius)
      ? opts.imageRadius[i % opts.imageRadius.length]
      : opts.imageRadius || "20px";
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
        { borderRadius: radiusAt(i), objectFit: "cover" },
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
/* ============================================================================
 * PREMIUM DIVERSE SECTION BUILDERS
 * These builders intentionally use different compositions instead of repeating
 * the same centered headline + equal cards layout.
 * ========================================================================== */

/** Hero: editorial layout with oversized type and vertical image */
export function heroEditorial(opts: {
  id: string;
  title: string;
  description?: string;
  eyebrow?: string;
  headline: string;
  copy: string;
  primary: string;
  secondary?: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "fashion");

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "eyebrow",
      opts.eyebrow || "EST. 2026",
      {
        color: "#9a3412",
        fontSize: "13px",
        fontWeight: "900",
        letterSpacing: "2px",
      },
      absoluteLayout(60, 55, "260px", "28px", 20),
    ),
    textNode(
      "title",
      opts.headline,
      {
        color: "#1c1917",
        fontSize: "72px",
        fontWeight: "900",
        lineHeight: "0.95",
        letterSpacing: "-3px",
      },
      absoluteLayout(60, 95, "600px", "220px", 20),
    ),
    textNode(
      "copy",
      opts.copy,
      {
        color: "#57534e",
        fontSize: "17px",
        fontWeight: "500",
        lineHeight: "1.75",
      },
      absoluteLayout(60, 340, "430px", "90px", 20),
    ),
    buttonNode(
      "primary",
      opts.primary,
      {
        ...btnPrimary,
        backgroundColor: "#1c1917",
        borderRadius: "0px",
      },
      absoluteLayout(60, 455, "170px", "54px", 22),
    ),
    imageNode(
      "image",
      image,
      {
        borderRadius: "160px 160px 12px 12px",
        objectFit: "cover",
      },
      absoluteLayout(690, 45, "330px", "480px", 10),
      "תמונת גיבור",
    ),
    textNode(
      "index",
      "01",
      {
        color: "#d6d3d1",
        fontSize: "84px",
        fontWeight: "900",
        lineHeight: "1",
      },
      absoluteLayout(520, 430, "130px", "90px", 5),
    ),
  ];

  if (opts.secondary) {
    nodes.push(
      buttonNode(
        "secondary",
        opts.secondary,
        {
          ...btnSoft,
          backgroundColor: "transparent",
          borderRadius: "0px",
          border: "none",
          borderBottom: "1px solid #1c1917",
          padding: "12px 4px",
        },
        absoluteLayout(250, 455, "150px", "54px", 22),
      ),
    );
  }

  return section(opts.id, "hero", opts.title, opts.description || "Hero editorial", {
    keywords: ["hero", "editorial", "יוקרתי", "מגזין"],
    thumbnail: image,
    minHeight: "580px",
    backgroundColor: opts.bg || "#f5f0e8",
    previewLayout: "hero-editorial-arch",
    nodes,
  });
}

/** Hero: collage composition */
export function heroCollage(opts: {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  headline: string;
  copy: string;
  primary: string;
  images?: ImgKey[];
  bg?: string;
}): VisualLibrarySectionTemplate {
  const images = opts.images || ["travel", "food", "beauty"];

  return section(opts.id, "hero", opts.title, opts.description || "Hero collage", {
    keywords: ["hero", "קולאז", "תמונות", "יצירתי"],
    thumbnail: img(images[0]),
    minHeight: "600px",
    backgroundColor: opts.bg || "#eef2ff",
    previewLayout: "hero-asymmetric-collage",
    nodes: [
      textNode(
        "badge",
        opts.badge || "NEW COLLECTION",
        {
          color: "#4338ca",
          backgroundColor: "#ffffff",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: "900",
        },
        absoluteLayout(60, 65, "220px", "36px", 30),
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#111827",
          fontSize: "58px",
          fontWeight: "900",
          lineHeight: "1",
          letterSpacing: "-2px",
        },
        absoluteLayout(60, 125, "470px", "180px", 30),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          ...copy,
          color: "#4b5563",
        },
        absoluteLayout(60, 325, "420px", "90px", 30),
      ),
      buttonNode(
        "primary",
        opts.primary,
        {
          ...btnPrimary,
          backgroundColor: "#4338ca",
          borderRadius: "14px",
        },
        absoluteLayout(60, 455, "180px", "54px", 32),
      ),
      imageNode(
        "image1",
        img(images[0]),
        { borderRadius: "28px", objectFit: "cover", transform: "rotate(-3deg)" },
        absoluteLayout(560, 70, "250px", "340px", 10),
        "תמונה ראשית",
      ),
      imageNode(
        "image2",
        img(images[1] || "food"),
        { borderRadius: "28px", objectFit: "cover", transform: "rotate(4deg)" },
        absoluteLayout(790, 120, "230px", "260px", 12),
        "תמונה משנית",
      ),
      imageNode(
        "image3",
        img(images[2] || "beauty"),
        { borderRadius: "999px", objectFit: "cover" },
        absoluteLayout(720, 390, "220px", "150px", 14),
        "תמונה עגולה",
      ),
    ],
  });
}

/** About: story layout with quote and overlapping image */
export function aboutStory(opts: {
  id: string;
  title: string;
  eyebrow?: string;
  headline: string;
  copy: string;
  quote?: string;
  cta: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "team");

  return section(opts.id, "about", opts.title, "סיפור מותג עם ציטוט", {
    keywords: ["אודות", "סיפור", "מותג", "מייסד"],
    thumbnail: image,
    minHeight: "580px",
    backgroundColor: opts.bg || "#f8fafc",
    previewLayout: "about-story-overlap",
    nodes: [
      boxNode(
        "panel",
        {
          backgroundColor: "#0f172a",
          borderRadius: "0px 48px 48px 0px",
        },
        absoluteLayout(0, 0, "600px", "580px", 5),
        "רקע כהה",
      ),
      textNode(
        "eyebrow",
        opts.eyebrow || "הסיפור שלנו",
        {
          color: "#67e8f9",
          fontSize: "14px",
          fontWeight: "900",
          letterSpacing: "1px",
        },
        absoluteLayout(60, 70, "240px", "28px", 20),
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#ffffff",
          fontSize: "46px",
          fontWeight: "900",
          lineHeight: "1.1",
        },
        absoluteLayout(60, 115, "440px", "130px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          color: "#cbd5e1",
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "1.8",
        },
        absoluteLayout(60, 265, "420px", "120px", 20),
      ),
      textNode(
        "quote",
        opts.quote || "אנחנו מאמינים שעיצוב טוב צריך להרגיש נכון עוד לפני שמסבירים אותו.",
        {
          color: "#ffffff",
          fontSize: "19px",
          fontWeight: "800",
          lineHeight: "1.5",
          borderLeft: "3px solid #67e8f9",
          paddingLeft: "18px",
        },
        absoluteLayout(60, 405, "430px", "80px", 20),
      ),
      buttonNode(
        "primary",
        opts.cta,
        {
          ...btnPrimary,
          backgroundColor: "#ffffff",
          color: "#0f172a",
        },
        absoluteLayout(60, 510, "160px", "48px", 22),
      ),
      imageNode(
        "image",
        image,
        {
          borderRadius: "32px",
          objectFit: "cover",
        },
        absoluteLayout(540, 70, "480px", "440px", 10),
        "תמונת אודות",
      ),
      boxNode(
        "badge",
        {
          backgroundColor: "#22d3ee",
          borderRadius: "24px",
        },
        absoluteLayout(500, 380, "150px", "120px", 14),
        "כרטיס ניסיון",
      ),
      textNode(
        "badge-value",
        "10+",
        {
          color: "#083344",
          fontSize: "38px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(515, 400, "120px", "45px", 20),
      ),
      textNode(
        "badge-label",
        "שנות ניסיון",
        {
          color: "#164e63",
          fontSize: "14px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(515, 452, "120px", "24px", 20),
      ),
    ],
  });
}

/** About: vertical timeline milestones */
export function aboutTimeline(opts: {
  id: string;
  title: string;
  headline: string;
  copy?: string;
  steps?: Array<{ year: string; label: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const steps = opts.steps || [
    { year: "2016", label: "ההתחלה – סטודיו קטן עם חזון גדול" },
    { year: "2019", label: "התרחבות לצוות מקצועי ושירות ארצי" },
    { year: "2022", label: "פרסים והכרה בתעשייה" },
    { year: "היום", label: "מאות לקוחות מרוצים בכל רחבי הארץ" },
  ];

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "44px",
        fontWeight: "900",
        lineHeight: "1.1",
      },
      absoluteLayout(60, 40, "560px", "90px", 20),
    ),
    textNode(
      "copy",
      opts.copy || "המסע שלנו – צעד אחרי צעד.",
      copy,
      absoluteLayout(60, 140, "500px", "50px", 20),
    ),
    boxNode(
      "line",
      { backgroundColor: "#c4b5fd" },
      absoluteLayout(130, 220, "4px", "300px", 5),
      "קו זמן",
    ),
  ];

  steps.slice(0, 4).forEach((step, i) => {
    const y = 210 + i * 75;
    nodes.push(
      boxNode(
        `dot-${i}`,
        { backgroundColor: "#7c3aed", borderRadius: "999px" },
        absoluteLayout(118, y + 8, "28px", "28px", 12),
        "נקודה",
      ),
      textNode(
        `year-${i}`,
        step.year,
        { color: "#7c3aed", fontSize: "18px", fontWeight: "900" },
        absoluteLayout(170, y, "100px", "32px", 20),
      ),
      textNode(
        `step-${i}`,
        step.label,
        { color: "#334155", fontSize: "16px", fontWeight: "700", lineHeight: "1.4" },
        absoluteLayout(280, y, "700px", "50px", 20),
      ),
    );
  });

  return section(opts.id, "about", opts.title, "ציר זמן אודות", {
    keywords: ["אודות", "ציר זמן", "היסטוריה"],
    minHeight: "560px",
    backgroundColor: opts.bg || "#faf5ff",
    previewLayout: "about-timeline-vertical",
    nodes,
  });
}

/** About: large founder quote + circular portrait */
export function aboutFounderQuote(opts: {
  id: string;
  title: string;
  headline: string;
  quote?: string;
  founder?: string;
  role?: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "team");
  return section(opts.id, "about", opts.title, "ציטוט מייסד", {
    keywords: ["אודות", "מייסד", "ציטוט"],
    thumbnail: image,
    minHeight: "520px",
    backgroundColor: opts.bg || "#0f172a",
    previewLayout: "about-founder-quote",
    nodes: [
      textNode(
        "mark",
        "״",
        {
          color: "#a78bfa",
          fontSize: "120px",
          fontWeight: "900",
          lineHeight: "0.8",
        },
        absoluteLayout(60, 40, "100px", "100px", 10),
      ),
      textNode(
        "quote",
        opts.quote ||
          opts.headline ||
          "בנינו את העסק סביב אמון – והלקוחות מרגישים את זה בכל מפגש.",
        {
          color: "#ffffff",
          fontSize: "36px",
          fontWeight: "800",
          lineHeight: "1.35",
        },
        absoluteLayout(60, 130, "620px", "200px", 20),
      ),
      textNode(
        "title",
        opts.founder || "שם המייסד/ת",
        {
          color: "#e2e8f0",
          fontSize: "20px",
          fontWeight: "900",
        },
        absoluteLayout(60, 360, "280px", "36px", 20),
      ),
      textNode(
        "copy",
        opts.role || "מייסד/ת ומנכ״ל/ית",
        {
          color: "#94a3b8",
          fontSize: "15px",
          fontWeight: "600",
        },
        absoluteLayout(60, 400, "280px", "28px", 20),
      ),
      imageNode(
        "portrait",
        image,
        {
          borderRadius: "999px",
          objectFit: "cover",
          border: "6px solid #a78bfa",
        },
        absoluteLayout(760, 120, "280px", "280px", 10),
        "דיוקן",
      ),
    ],
  });
}

/** About: stats row + overlapping photo collage */
export function aboutStatsCollage(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  stats?: Array<{ value: string; label: string }>;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "office");
  const image2 = img("team");
  const image3 = img("beauty");
  const stats = opts.stats || [
    { value: "500+", label: "לקוחות" },
    { value: "12", label: "שנות ניסיון" },
    { value: "98%", label: "שביעות רצון" },
  ];

  const nodes: VisualLibraryNodeTemplate[] = [
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "40px",
        fontWeight: "900",
        lineHeight: "1.12",
      },
      absoluteLayout(60, 40, "480px", "100px", 20),
    ),
    textNode(
      "copy",
      opts.copy,
      copy,
      absoluteLayout(60, 150, "440px", "90px", 20),
    ),
    imageNode(
      "img1",
      image,
      { borderRadius: "24px", objectFit: "cover" },
      absoluteLayout(580, 40, "280px", "220px", 10),
      "קולאז׳ 1",
    ),
    imageNode(
      "img2",
      image2,
      { borderRadius: "20px", objectFit: "cover", border: "4px solid #fff" },
      absoluteLayout(800, 180, "220px", "180px", 14),
      "קולאז׳ 2",
    ),
    imageNode(
      "img3",
      image3,
      { borderRadius: "999px", objectFit: "cover" },
      absoluteLayout(520, 280, "160px", "160px", 16),
      "קולאז׳ 3",
    ),
  ];

  stats.slice(0, 3).forEach((stat, i) => {
    const x = 60 + i * 160;
    nodes.push(
      textNode(
        `stat-value-${i}`,
        stat.value,
        { color: "#7c3aed", fontSize: "36px", fontWeight: "900" },
        absoluteLayout(x, 280, "140px", "44px", 20),
      ),
      textNode(
        `stat-label-${i}`,
        stat.label,
        { color: "#64748b", fontSize: "14px", fontWeight: "700" },
        absoluteLayout(x, 330, "140px", "28px", 20),
      ),
    );
  });

  return section(opts.id, "about", opts.title, "אודות עם סטטיסטיקות וקולאז׳", {
    keywords: ["אודות", "מספרים", "קולאז׳"],
    thumbnail: image,
    minHeight: "520px",
    backgroundColor: opts.bg || "#ffffff",
    previewLayout: "about-stats-collage",
    nodes,
  });
}

/** About: editorial huge type + thin media strip */
export function aboutEditorial(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  cta?: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "fashion");
  return section(opts.id, "about", opts.title, "אודות editorial", {
    keywords: ["אודות", "editorial", "טיפוגרפיה"],
    thumbnail: image,
    minHeight: "560px",
    backgroundColor: opts.bg || "#fafaf9",
    previewLayout: "about-editorial-asymmetric",
    nodes: [
      textNode(
        "eyebrow",
        "ABOUT",
        {
          color: "#a8a29e",
          fontSize: "13px",
          fontWeight: "900",
          letterSpacing: "4px",
        },
        absoluteLayout(60, 50, "200px", "24px", 20),
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#1c1917",
          fontSize: "64px",
          fontWeight: "900",
          lineHeight: "0.98",
          letterSpacing: "-1px",
        },
        absoluteLayout(60, 90, "640px", "200px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          color: "#57534e",
          fontSize: "17px",
          fontWeight: "500",
          lineHeight: "1.75",
        },
        absoluteLayout(60, 320, "420px", "120px", 20),
      ),
      buttonNode(
        "primary",
        opts.cta || "קראו עוד",
        {
          ...btnPrimary,
          backgroundColor: "#1c1917",
          borderRadius: "0px",
        },
        absoluteLayout(60, 460, "160px", "50px", 22),
      ),
      imageNode(
        "image",
        image,
        { borderRadius: "0px", objectFit: "cover" },
        absoluteLayout(780, 0, "300px", "560px", 8),
        "פס תמונה",
      ),
    ],
  });
}

/** About: full-bleed cover with overlay text */
export function aboutCover(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  cta?: string;
  image?: ImgKey;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "travel");
  return section(opts.id, "about", opts.title, "אודות על תמונת רקע", {
    keywords: ["אודות", "כיסוי", "רקע"],
    thumbnail: image,
    minHeight: "560px",
    backgroundColor: "#0f172a",
    previewLayout: "about-cover-overlay",
    nodes: [
      imageNode(
        "image",
        image,
        { borderRadius: "0px", objectFit: "cover" },
        absoluteLayout(0, 0, "1080px", "560px", 1),
        "רקע מלא",
      ),
      boxNode(
        "overlay",
        { backgroundColor: "rgba(15,23,42,0.55)" },
        absoluteLayout(0, 0, "1080px", "560px", 5),
        "שכבת כהות",
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#ffffff",
          fontSize: "52px",
          fontWeight: "900",
          lineHeight: "1.08",
          textAlign: "center",
        },
        absoluteLayout(140, 160, "800px", "140px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          color: "#e2e8f0",
          fontSize: "18px",
          fontWeight: "500",
          lineHeight: "1.6",
          textAlign: "center",
        },
        absoluteLayout(220, 320, "640px", "80px", 20),
      ),
      buttonNode(
        "primary",
        opts.cta || "הכירו אותנו",
        {
          ...btnPrimary,
          backgroundColor: "#ffffff",
          color: "#0f172a",
        },
        absoluteLayout(440, 430, "200px", "52px", 22),
      ),
    ],
  });
}

/** Services: asymmetric bento grid */
export function servicesBento(opts: {
  id: string;
  title: string;
  headline: string;
  copy?: string;
  items: Array<{ title: string; copy: string }>;
  bg?: string;
  image?: ImgKey;
}): VisualLibrarySectionTemplate {
  const items = opts.items.slice(0, 4);
  const image = img(opts.image || "tech");

  return section(opts.id, "services", opts.title, "שירותים בגריד Bento", {
    keywords: ["שירותים", "bento", "גריד", "מודרני"],
    thumbnail: image,
    minHeight: "620px",
    backgroundColor: opts.bg || "#f1f5f9",
    previewLayout: "services-bento-asymmetric",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "46px",
          fontWeight: "900",
          lineHeight: "1.05",
        },
        absoluteLayout(60, 45, "520px", "100px", 20),
      ),
      textNode(
        "copy",
        opts.copy || "כל מה שהעסק צריך, בחוויה אחת מדויקת ומחוברת.",
        {
          ...copy,
          fontSize: "16px",
        },
        absoluteLayout(620, 58, "380px", "65px", 20),
      ),
      boxNode(
        "card1",
        { backgroundColor: "#0f172a", borderRadius: "30px" },
        absoluteLayout(60, 170, "460px", "360px", 8),
        items[0]?.title || "שירות מרכזי",
      ),
      imageNode(
        "image",
        image,
        { borderRadius: "24px", objectFit: "cover", opacity: "0.55" },
        absoluteLayout(80, 190, "420px", "190px", 10),
        "שירות מרכזי",
      ),
      textNode(
        "title1",
        items[0]?.title || "פתרון מלא לעסק",
        { color: "#ffffff", fontSize: "28px", fontWeight: "900" },
        absoluteLayout(90, 405, "350px", "44px", 20),
      ),
      textNode(
        "copy1",
        items[0]?.copy || "מערכת מקצועית שמרכזת את כל העבודה במקום אחד.",
        { color: "#cbd5e1", fontSize: "15px", fontWeight: "500", lineHeight: "1.6" },
        absoluteLayout(90, 455, "360px", "65px", 20),
      ),
      ...items.slice(1, 4).flatMap((item, index) => {
        const layouts = [
          { x: 550, y: 170, w: 450, h: 150, bg: "#ffffff" },
          { x: 550, y: 340, w: 215, h: 190, bg: "#fef3c7" },
          { x: 785, y: 340, w: 215, h: 190, bg: "#ede9fe" },
        ];
        const l = layouts[index];
        return [
          boxNode(
            `card${index + 2}`,
            {
              backgroundColor: l.bg,
              borderRadius: "26px",
              border: index === 0 ? "1px solid #e2e8f0" : "none",
            },
            absoluteLayout(l.x, l.y, `${l.w}px`, `${l.h}px`, 8),
            item.title,
          ),
          textNode(
            `index${index + 2}`,
            `0${index + 2}`,
            {
              color: index === 0 ? "#7c3aed" : "#0f172a",
              fontSize: "14px",
              fontWeight: "900",
            },
            absoluteLayout(l.x + 24, l.y + 22, "50px", "24px", 20),
          ),
          textNode(
            `title${index + 2}`,
            item.title,
            {
              color: "#0f172a",
              fontSize: index === 0 ? "22px" : "19px",
              fontWeight: "900",
            },
            absoluteLayout(l.x + 24, l.y + 54, `${l.w - 48}px`, "38px", 20),
          ),
          textNode(
            `copy${index + 2}`,
            item.copy,
            {
              color: "#475569",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "1.55",
            },
            absoluteLayout(l.x + 24, l.y + 96, `${l.w - 48}px`, `${l.h - 110}px`, 20),
          ),
        ];
      }),
    ],
  });
}

/** Services: premium vertical spotlight */
export function servicesSpotlight(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; copy: string; meta?: string }>;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "beauty");
  const items = opts.items.slice(0, 4);

  return section(opts.id, "services", opts.title, "שירות מרכזי ורשימה אנכית", {
    keywords: ["שירותים", "יוקרתי", "רשימה", "תמונה"],
    thumbnail: image,
    minHeight: "600px",
    backgroundColor: opts.bg || "#fffaf5",
    previewLayout: "services-vertical-spotlight",
    nodes: [
      imageNode(
        "image",
        image,
        { borderRadius: "220px 220px 24px 24px", objectFit: "cover" },
        absoluteLayout(60, 60, "390px", "480px", 10),
        "שירות נבחר",
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#292524",
          fontSize: "44px",
          fontWeight: "900",
          lineHeight: "1.1",
        },
        absoluteLayout(520, 55, "460px", "100px", 20),
      ),
      ...items.flatMap((item, i) => {
        const y = 175 + i * 95;
        return [
          textNode(
            `number${i + 1}`,
            String(i + 1).padStart(2, "0"),
            {
              color: "#c2410c",
              fontSize: "14px",
              fontWeight: "900",
              letterSpacing: "1px",
            },
            absoluteLayout(520, y, "50px", "24px", 20),
          ),
          textNode(
            `item-title${i + 1}`,
            item.title,
            {
              color: "#292524",
              fontSize: "20px",
              fontWeight: "900",
            },
            absoluteLayout(590, y, "250px", "32px", 20),
          ),
          textNode(
            `item-copy${i + 1}`,
            item.copy,
            {
              color: "#78716c",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "1.5",
            },
            absoluteLayout(590, y + 34, "360px", "45px", 20),
          ),
          boxNode(
            `line${i + 1}`,
            { backgroundColor: "#e7e5e4" },
            absoluteLayout(520, y + 80, "450px", "1px", 5),
          ),
        ];
      }),
    ],
  });
}

/** Features: timeline process */
export function featuresTimeline(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; copy: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const items = opts.items.slice(0, 4);

  return section(opts.id, "features", opts.title, "תהליך עבודה בציר זמן", {
    keywords: ["תהליך", "שלבים", "יתרונות", "timeline"],
    minHeight: "520px",
    backgroundColor: opts.bg || "#ffffff",
    previewLayout: "features-horizontal-timeline",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "42px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(220, 45, "640px", "60px", 20),
      ),
      boxNode(
        "line",
        { backgroundColor: "#cbd5e1" },
        absoluteLayout(135, 205, "810px", "2px", 5),
      ),
      ...items.flatMap((item, i) => {
        const x = 80 + i * 250;
        return [
          boxNode(
            `dot${i + 1}`,
            {
              backgroundColor: i === 0 ? "#7c3aed" : "#ffffff",
              borderRadius: "999px",
              border: "3px solid #7c3aed",
            },
            absoluteLayout(x + 85, 185, "42px", "42px", 10),
            `שלב ${i + 1}`,
          ),
          textNode(
            `number${i + 1}`,
            String(i + 1),
            {
              color: i === 0 ? "#ffffff" : "#7c3aed",
              fontSize: "14px",
              fontWeight: "900",
              textAlign: "center",
            },
            absoluteLayout(x + 95, 194, "22px", "22px", 20),
          ),
          textNode(
            `item-title${i + 1}`,
            item.title,
            {
              color: "#0f172a",
              fontSize: "19px",
              fontWeight: "900",
              textAlign: "center",
            },
            absoluteLayout(x, 250, "210px", "34px", 20),
          ),
          textNode(
            `item-copy${i + 1}`,
            item.copy,
            {
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "1.55",
              textAlign: "center",
            },
            absoluteLayout(x, 295, "210px", "80px", 20),
          ),
        ];
      }),
    ],
  });
}

/** Features: orbit around image */
export function featuresOrbit(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ title: string; copy: string }>;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "product");
  const items = opts.items.slice(0, 4);
  const positions = [
    { x: 70, y: 150, align: "right" },
    { x: 70, y: 350, align: "right" },
    { x: 790, y: 150, align: "left" },
    { x: 790, y: 350, align: "left" },
  ] as const;

  return section(opts.id, "features", opts.title, "פיצ׳רים סביב מוצר", {
    keywords: ["יתרונות", "מוצר", "סביב תמונה", "orbit"],
    thumbnail: image,
    minHeight: "600px",
    backgroundColor: opts.bg || "#f8fafc",
    previewLayout: "features-orbit-product",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "40px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(240, 35, "600px", "60px", 20),
      ),
      boxNode(
        "halo",
        {
          backgroundColor: "#ede9fe",
          borderRadius: "999px",
        },
        absoluteLayout(390, 135, "300px", "300px", 6),
        "הילה",
      ),
      imageNode(
        "image",
        image,
        {
          borderRadius: "999px",
          objectFit: "cover",
        },
        absoluteLayout(430, 175, "220px", "220px", 10),
        "מוצר",
      ),
      ...items.flatMap((item, i) => {
        const p = positions[i];
        return [
          iconNode(
            `icon${i + 1}`,
            ["✦", "◆", "●", "▲"][i],
            {
              color: "#7c3aed",
              fontSize: "24px",
              fontWeight: "900",
              textAlign: p.align,
            },
            absoluteLayout(p.x, p.y, "220px", "30px", 20),
          ),
          textNode(
            `item-title${i + 1}`,
            item.title,
            {
              color: "#0f172a",
              fontSize: "18px",
              fontWeight: "900",
              textAlign: p.align,
            },
            absoluteLayout(p.x, p.y + 38, "220px", "32px", 20),
          ),
          textNode(
            `item-copy${i + 1}`,
            item.copy,
            {
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "1.5",
              textAlign: p.align,
            },
            absoluteLayout(p.x, p.y + 75, "220px", "65px", 20),
          ),
        ];
      }),
    ],
  });
}

/** Contact: map/details plus floating form */
export function contactMap(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "realestate");

  return section(opts.id, "contact", opts.title, "מפה עם טופס צף", {
    keywords: ["צור קשר", "מפה", "טופס", "כתובת"],
    thumbnail: image,
    minHeight: "600px",
    backgroundColor: opts.bg || "#e2e8f0",
    previewLayout: "contact-map-floating-form",
    nodes: [
      imageNode(
        "map",
        image,
        {
          borderRadius: "0px",
          objectFit: "cover",
          opacity: "0.78",
        },
        absoluteLayout(0, 0, "1080px", "600px", 5),
        "מפה",
      ),
      boxNode(
        "details",
        {
          backgroundColor: "#0f172a",
          borderRadius: "28px",
        },
        absoluteLayout(60, 80, "360px", "420px", 10),
        "פרטי קשר",
      ),
      textNode(
        "title",
        opts.headline,
        {
          color: "#ffffff",
          fontSize: "38px",
          fontWeight: "900",
          lineHeight: "1.1",
        },
        absoluteLayout(95, 115, "290px", "90px", 20),
      ),
      textNode(
        "copy",
        opts.copy,
        {
          color: "#cbd5e1",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "1.65",
        },
        absoluteLayout(95, 220, "280px", "75px", 20),
      ),
      textNode(
        "phone",
        "טלפון  ·  03-555-5555",
        { color: "#ffffff", fontSize: "15px", fontWeight: "800" },
        absoluteLayout(95, 330, "260px", "28px", 20),
      ),
      textNode(
        "mail",
        "אימייל  ·  hello@example.com",
        { color: "#ffffff", fontSize: "15px", fontWeight: "800" },
        absoluteLayout(95, 375, "260px", "28px", 20),
      ),
      textNode(
        "address",
        "כתובת  ·  רחוב הדוגמה 12",
        { color: "#ffffff", fontSize: "15px", fontWeight: "800" },
        absoluteLayout(95, 420, "260px", "28px", 20),
      ),
      boxNode(
        "form",
        {
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          boxShadow: "0 24px 60px rgba(15,23,42,0.2)",
        },
        absoluteLayout(570, 75, "450px", "440px", 12),
        "טופס יצירת קשר",
      ),
      textNode(
        "form-title",
        "השאירו פרטים",
        {
          color: "#0f172a",
          fontSize: "25px",
          fontWeight: "900",
        },
        absoluteLayout(610, 115, "300px", "40px", 20),
      ),
      ...["שם מלא", "אימייל", "טלפון", "איך נוכל לעזור?"].map((label, i) =>
        boxNode(
          `field${i + 1}`,
          {
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          },
          absoluteLayout(610, 180 + i * 60, "370px", i === 3 ? "70px" : "46px", 15),
          label,
        ),
      ),
      ...["שם מלא", "אימייל", "טלפון", "איך נוכל לעזור?"].map((label, i) =>
        textNode(
          `placeholder${i + 1}`,
          label,
          { color: "#94a3b8", fontSize: "13px", fontWeight: "700" },
          absoluteLayout(630, 192 + i * 60, "240px", "24px", 20),
        ),
      ),
      buttonNode(
        "submit",
        "שליחת הודעה",
        {
          ...btnPrimary,
          backgroundColor: "#7c3aed",
          borderRadius: "12px",
        },
        absoluteLayout(610, 435, "180px", "48px", 22),
      ),
    ],
  });
}

/** Testimonials: one featured review plus side reviews */
export function testimonialsFeatured(opts: {
  id: string;
  title: string;
  headline: string;
  items: Array<{ quote: string; name: string; role?: string }>;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const items = opts.items.slice(0, 3);
  const image = img(opts.image || "team");

  return section(opts.id, "testimonials", opts.title, "המלצה מרכזית עם תמונה", {
    keywords: ["המלצות", "לקוחות", "ציטוט", "featured"],
    thumbnail: image,
    minHeight: "560px",
    backgroundColor: opts.bg || "#fff7ed",
    previewLayout: "testimonials-featured-editorial",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#431407",
          fontSize: "42px",
          fontWeight: "900",
        },
        absoluteLayout(60, 45, "540px", "60px", 20),
      ),
      imageNode(
        "image",
        image,
        { borderRadius: "32px", objectFit: "cover" },
        absoluteLayout(60, 130, "330px", "360px", 10),
        items[0]?.name || "לקוחה",
      ),
      textNode(
        "quote-mark",
        "“",
        {
          color: "#fb923c",
          fontSize: "100px",
          fontWeight: "900",
          lineHeight: "0.8",
        },
        absoluteLayout(430, 135, "80px", "90px", 20),
      ),
      textNode(
        "quote",
        items[0]?.quote || "חוויה מקצועית, מדויקת והרבה מעבר למה שציפינו.",
        {
          color: "#431407",
          fontSize: "28px",
          fontWeight: "800",
          lineHeight: "1.45",
        },
        absoluteLayout(470, 170, "500px", "180px", 20),
      ),
      textNode(
        "name",
        items[0]?.name || "נועה לוי",
        {
          color: "#9a3412",
          fontSize: "17px",
          fontWeight: "900",
        },
        absoluteLayout(470, 375, "250px", "30px", 20),
      ),
      textNode(
        "role",
        items[0]?.role || "בעלת עסק",
        {
          color: "#78716c",
          fontSize: "14px",
          fontWeight: "700",
        },
        absoluteLayout(470, 407, "250px", "26px", 20),
      ),
      ...items.slice(1, 3).flatMap((item, i) => {
        const x = 470 + i * 260;
        return [
          boxNode(
            `mini-card${i + 1}`,
            {
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              border: "1px solid #fed7aa",
            },
            absoluteLayout(x, 455, "240px", "80px", 8),
            item.name,
          ),
          textNode(
            `mini-name${i + 1}`,
            item.name,
            {
              color: "#431407",
              fontSize: "14px",
              fontWeight: "900",
            },
            absoluteLayout(x + 18, 472, "200px", "24px", 20),
          ),
          textNode(
            `mini-quote${i + 1}`,
            item.quote,
            {
              color: "#78716c",
              fontSize: "12px",
              fontWeight: "500",
              lineHeight: "1.35",
            },
            absoluteLayout(x + 18, 500, "200px", "28px", 20),
          ),
        ];
      }),
    ],
  });
}

/** Pricing: comparison table */
export function pricingComparison(opts: {
  id: string;
  title: string;
  headline: string;
  plans: Array<{
    name: string;
    price: string;
    features: string;
    popular?: boolean;
  }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const plans = opts.plans.slice(0, 3);
  const featureRows = ["שימוש מלא במערכת", "תמיכה מקצועית", "אוטומציות", "גישה לכלים מתקדמים"];

  return section(opts.id, "pricing", opts.title, "טבלת השוואת חבילות", {
    keywords: ["מחירון", "השוואה", "חבילות", "טבלה"],
    minHeight: "620px",
    backgroundColor: opts.bg || "#ffffff",
    previewLayout: "pricing-comparison-table",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "42px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(200, 40, "680px", "60px", 20),
      ),
      textNode(
        "feature-head",
        "מה כלול",
        {
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "900",
        },
        absoluteLayout(60, 145, "230px", "30px", 20),
      ),
      ...plans.flatMap((plan, i) => {
        const x = 340 + i * 225;
        return [
          boxNode(
            `head-bg${i + 1}`,
            {
              backgroundColor: plan.popular ? "#0f172a" : "#f8fafc",
              borderRadius: "18px 18px 0px 0px",
              border: plan.popular ? "none" : "1px solid #e2e8f0",
            },
            absoluteLayout(x, 120, "205px", "130px", 8),
            plan.name,
          ),
          textNode(
            `name${i + 1}`,
            plan.name,
            {
              color: plan.popular ? "#c4b5fd" : "#475569",
              fontSize: "15px",
              fontWeight: "900",
              textAlign: "center",
            },
            absoluteLayout(x + 15, 145, "175px", "28px", 20),
          ),
          textNode(
            `price${i + 1}`,
            plan.price,
            {
              color: plan.popular ? "#ffffff" : "#0f172a",
              fontSize: "30px",
              fontWeight: "900",
              textAlign: "center",
            },
            absoluteLayout(x + 15, 185, "175px", "45px", 20),
          ),
        ];
      }),
      ...featureRows.flatMap((feature, row) => {
        const y = 270 + row * 65;
        const rowNodes: VisualLibraryNodeTemplate[] = [
          boxNode(
            `row-bg${row + 1}`,
            { backgroundColor: row % 2 === 0 ? "#f8fafc" : "#ffffff" },
            absoluteLayout(60, y, "955px", "58px", 5),
            feature,
          ),
          textNode(
            `feature${row + 1}`,
            feature,
            {
              color: "#0f172a",
              fontSize: "15px",
              fontWeight: "800",
            },
            absoluteLayout(80, y + 16, "230px", "28px", 20),
          ),
        ];
        plans.forEach((_, col) => {
          rowNodes.push(
            textNode(
              `check${row + 1}-${col + 1}`,
              row <= col + 1 ? "✓" : "—",
              {
                color: row <= col + 1 ? "#16a34a" : "#94a3b8",
                fontSize: "20px",
                fontWeight: "900",
                textAlign: "center",
              },
              absoluteLayout(340 + col * 225, y + 14, "205px", "30px", 20),
            ),
          );
        });
        return rowNodes;
      }),
      ...plans.map((plan, i) =>
        buttonNode(
          `cta${i + 1}`,
          "בחירת חבילה",
          {
            ...btnPrimary,
            backgroundColor: plan.popular ? "#7c3aed" : "#0f172a",
            borderRadius: "12px",
          },
          absoluteLayout(365 + i * 225, 550, "155px", "46px", 22),
        ),
      ),
    ],
  });
}

/** Portfolio: masonry layout */
export function portfolioMasonry(opts: {
  id: string;
  title: string;
  headline: string;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const keys: ImgKey[] = ["construction", "fashion", "realestate", "food", "travel"];

  return section(opts.id, "portfolio", opts.title, "פורטפוליו Masonry", {
    keywords: ["פורטפוליו", "masonry", "גלריה", "פרויקטים"],
    thumbnail: img(keys[0]),
    minHeight: "660px",
    backgroundColor: opts.bg || "#0f172a",
    previewLayout: "portfolio-masonry-dark",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#ffffff",
          fontSize: "46px",
          fontWeight: "900",
        },
        absoluteLayout(60, 45, "600px", "65px", 20),
      ),
      textNode(
        "count",
        "05 PROJECTS",
        {
          color: "#94a3b8",
          fontSize: "13px",
          fontWeight: "900",
          letterSpacing: "2px",
          textAlign: "right",
        },
        absoluteLayout(800, 62, "220px", "28px", 20),
      ),
      imageNode(
        "img1",
        img(keys[0]),
        { borderRadius: "18px", objectFit: "cover" },
        absoluteLayout(60, 130, "440px", "420px", 10),
        "פרויקט 1",
      ),
      imageNode(
        "img2",
        img(keys[1]),
        { borderRadius: "18px", objectFit: "cover" },
        absoluteLayout(525, 130, "240px", "200px", 10),
        "פרויקט 2",
      ),
      imageNode(
        "img3",
        img(keys[2]),
        { borderRadius: "18px", objectFit: "cover" },
        absoluteLayout(790, 130, "230px", "300px", 10),
        "פרויקט 3",
      ),
      imageNode(
        "img4",
        img(keys[3]),
        { borderRadius: "18px", objectFit: "cover" },
        absoluteLayout(525, 355, "240px", "270px", 10),
        "פרויקט 4",
      ),
      imageNode(
        "img5",
        img(keys[4]),
        { borderRadius: "18px", objectFit: "cover" },
        absoluteLayout(790, 455, "230px", "170px", 10),
        "פרויקט 5",
      ),
      textNode(
        "label1",
        "01 / CONCEPT",
        {
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: "900",
          letterSpacing: "1px",
        },
        absoluteLayout(85, 575, "220px", "28px", 20),
      ),
    ],
  });
}

/** FAQ: split with highlighted active item */
export function faqSplit(opts: {
  id: string;
  title: string;
  headline: string;
  copy?: string;
  items: Array<{ q: string; a: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const items = opts.items.slice(0, 4);

  return section(opts.id, "faq", opts.title, "FAQ מפוצל עם שאלה פעילה", {
    keywords: ["שאלות", "faq", "תמיכה", "אקורדיון"],
    minHeight: "560px",
    backgroundColor: opts.bg || "#f8fafc",
    previewLayout: "faq-split-active",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#0f172a",
          fontSize: "44px",
          fontWeight: "900",
          lineHeight: "1.1",
        },
        absoluteLayout(60, 70, "360px", "110px", 20),
      ),
      textNode(
        "copy",
        opts.copy || "כל התשובות החשובות במקום אחד. לא מצאתם? דברו איתנו.",
        {
          color: "#64748b",
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "1.7",
        },
        absoluteLayout(60, 210, "330px", "90px", 20),
      ),
      buttonNode(
        "contact",
        "דברו איתנו",
        {
          ...btnPrimary,
          backgroundColor: "#7c3aed",
          borderRadius: "12px",
        },
        absoluteLayout(60, 330, "160px", "48px", 22),
      ),
      ...items.flatMap((item, i) => {
        const y = 70 + i * 110;
        const active = i === 0;
        return [
          boxNode(
            `item-bg${i + 1}`,
            {
              backgroundColor: active ? "#0f172a" : "#ffffff",
              borderRadius: "18px",
              border: active ? "none" : "1px solid #e2e8f0",
            },
            absoluteLayout(480, y, "540px", active ? "100px" : "82px", 8),
            item.q,
          ),
          textNode(
            `q${i + 1}`,
            item.q,
            {
              color: active ? "#ffffff" : "#0f172a",
              fontSize: "17px",
              fontWeight: "900",
            },
            absoluteLayout(510, y + 22, "430px", "32px", 20),
          ),
          textNode(
            `icon${i + 1}`,
            active ? "−" : "+",
            {
              color: active ? "#c4b5fd" : "#7c3aed",
              fontSize: "24px",
              fontWeight: "900",
              textAlign: "center",
            },
            absoluteLayout(955, y + 18, "35px", "35px", 20),
          ),
          ...(active
            ? [
                textNode(
                  "active-answer",
                  item.a,
                  {
                    color: "#cbd5e1",
                    fontSize: "13px",
                    fontWeight: "500",
                    lineHeight: "1.45",
                  },
                  absoluteLayout(510, y + 56, "430px", "35px", 20),
                ),
              ]
            : []),
        ];
      }),
    ],
  });
}

/** Stats: editorial with one dominant statistic */
export function statsEditorial(opts: {
  id: string;
  title: string;
  items: Array<{ value: string; label: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const items = opts.items.slice(0, 4);
  const lead = items[0] || { value: "98%", label: "לקוחות מרוצים" };

  return section(opts.id, "stats", opts.title, "סטטיסטיקה Editorial", {
    keywords: ["נתונים", "סטטיסטיקה", "מספרים", "editorial"],
    minHeight: "440px",
    backgroundColor: opts.bg || "#fefce8",
    previewLayout: "stats-editorial-dominant",
    nodes: [
      textNode(
        "label",
        "BY THE NUMBERS",
        {
          color: "#a16207",
          fontSize: "13px",
          fontWeight: "900",
          letterSpacing: "2px",
        },
        absoluteLayout(60, 55, "250px", "28px", 20),
      ),
      textNode(
        "lead-value",
        lead.value,
        {
          color: "#422006",
          fontSize: "120px",
          fontWeight: "900",
          lineHeight: "0.9",
          letterSpacing: "-6px",
        },
        absoluteLayout(60, 115, "470px", "130px", 20),
      ),
      textNode(
        "lead-label",
        lead.label,
        {
          color: "#854d0e",
          fontSize: "20px",
          fontWeight: "900",
        },
        absoluteLayout(70, 270, "350px", "38px", 20),
      ),
      boxNode(
        "line",
        { backgroundColor: "#fde68a" },
        absoluteLayout(560, 80, "2px", "280px", 5),
      ),
      ...items.slice(1, 4).flatMap((item, i) => {
        const y = 80 + i * 100;
        return [
          textNode(
            `value${i + 2}`,
            item.value,
            {
              color: "#422006",
              fontSize: "42px",
              fontWeight: "900",
            },
            absoluteLayout(620, y, "180px", "52px", 20),
          ),
          textNode(
            `label${i + 2}`,
            item.label,
            {
              color: "#a16207",
              fontSize: "15px",
              fontWeight: "700",
            },
            absoluteLayout(810, y + 12, "200px", "32px", 20),
          ),
        ];
      }),
    ],
  });
}

/** Team: editorial profiles with mixed sizes */
export function teamEditorial(opts: {
  id: string;
  title: string;
  headline: string;
  members: Array<{ name: string; role: string }>;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const members = opts.members.slice(0, 4);
  const keys: ImgKey[] = ["team", "fashion", "office", "beauty"];

  return section(opts.id, "team", opts.title, "צוות Editorial א-סימטרי", {
    keywords: ["צוות", "אנשים", "editorial", "פרופילים"],
    thumbnail: img(keys[0]),
    minHeight: "650px",
    backgroundColor: opts.bg || "#f5f5f4",
    previewLayout: "team-editorial-asymmetric",
    nodes: [
      textNode(
        "title",
        opts.headline,
        {
          color: "#1c1917",
          fontSize: "46px",
          fontWeight: "900",
        },
        absoluteLayout(60, 45, "520px", "65px", 20),
      ),
      textNode(
        "intro",
        "אנשים טובים יוצרים עבודה יוצאת דופן.",
        {
          color: "#78716c",
          fontSize: "16px",
          fontWeight: "600",
          textAlign: "right",
        },
        absoluteLayout(700, 60, "320px", "40px", 20),
      ),
      ...members.flatMap((member, i) => {
        const layouts = [
          { x: 60, y: 140, w: 300, h: 360 },
          { x: 390, y: 140, w: 250, h: 250 },
          { x: 670, y: 140, w: 350, h: 300 },
          { x: 390, y: 425, w: 250, h: 170 },
        ];
        const l = layouts[i];
        return [
          imageNode(
            `img${i + 1}`,
            img(keys[i]),
            {
              borderRadius: i === 1 ? "999px" : i === 3 ? "100px 100px 18px 18px" : "24px",
              objectFit: "cover",
            },
            absoluteLayout(l.x, l.y, `${l.w}px`, `${l.h}px`, 10),
            member.name,
          ),
          textNode(
            `name${i + 1}`,
            member.name,
            {
              color: "#1c1917",
              fontSize: "17px",
              fontWeight: "900",
            },
            absoluteLayout(l.x, l.y + l.h + 14, `${l.w}px`, "30px", 20),
          ),
          textNode(
            `role${i + 1}`,
            member.role,
            {
              color: "#78716c",
              fontSize: "13px",
              fontWeight: "700",
            },
            absoluteLayout(l.x, l.y + l.h + 45, `${l.w}px`, "24px", 20),
          ),
        ];
      }),
    ],
  });
}

/** CTA: image background with floating panel */
export function ctaImage(opts: {
  id: string;
  title: string;
  headline: string;
  copy: string;
  primary: string;
  secondary?: string;
  image?: ImgKey;
  bg?: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "travel");

  const nodes: VisualLibraryNodeTemplate[] = [
    imageNode(
      "image",
      image,
      {
        borderRadius: "0px",
        objectFit: "cover",
        opacity: "0.9",
      },
      absoluteLayout(0, 0, "1080px", "480px", 5),
      "רקע",
    ),
    boxNode(
      "panel",
      {
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: "28px",
        backdropFilter: "blur(12px)",
      },
      absoluteLayout(80, 70, "520px", "340px", 10),
      "קריאה לפעולה",
    ),
    textNode(
      "title",
      opts.headline,
      {
        color: "#0f172a",
        fontSize: "44px",
        fontWeight: "900",
        lineHeight: "1.08",
      },
      absoluteLayout(120, 115, "430px", "110px", 20),
    ),
    textNode(
      "copy",
      opts.copy,
      {
        color: "#475569",
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "1.65",
      },
      absoluteLayout(120, 240, "400px", "70px", 20),
    ),
    buttonNode(
      "primary",
      opts.primary,
      {
        ...btnPrimary,
        backgroundColor: "#0f172a",
        borderRadius: "12px",
      },
      absoluteLayout(120, 335, "170px", "50px", 22),
    ),
  ];

  if (opts.secondary) {
    nodes.push(
      buttonNode(
        "secondary",
        opts.secondary,
        {
          ...btnSoft,
          backgroundColor: "transparent",
          borderRadius: "12px",
        },
        absoluteLayout(310, 335, "160px", "50px", 22),
      ),
    );
  }

  return section(opts.id, "cta", opts.title, "CTA עם תמונת רקע", {
    keywords: ["cta", "תמונה", "קריאה לפעולה", "באנר"],
    thumbnail: image,
    minHeight: "480px",
    backgroundColor: opts.bg || "#0f172a",
    previewLayout: "cta-image-floating-panel",
    nodes,
  });
}
