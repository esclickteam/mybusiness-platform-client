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

function contact(
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
    category: "contact",
    title,
    description: "סקשן יצירת קשר מקצועי בקומפוזיציה Editorial ייחודית",
    keywords: ["יצירת קשר", "contact", "טופס", "כתובת", "wix"],
    previewLayout,
    backgroundColor,
    minHeight,
    thumbnail,
    nodes,
  };
}

/** 1 — פיצול: תמונה + טופס */
const splitFormImage = contact(
  "section-contact-showcase-split-form-image",
  "יצירת קשר — פיצול טופס ותמונה",
  "contact-showcase-split-form-image",
  "#f6f3ef",
  "680px",
  IMG.office,
  [
    imageNode(
      "image",
      IMG.office,
      { borderRadius: "0", objectFit: "cover" },
      absoluteLayout(0, 0, "480px", "680px", 5),
      "המשרד שלנו",
    ),
    textNode(
      "eyebrow",
      "נשמח לשמוע מכם",
      {
        color: "#8a7359",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
      },
      absoluteLayout(540, 55, "240px", "24px", 20),
    ),
    textNode(
      "title",
      "בואו נדבר\nעל הפרויקט",
      {
        color: ink,
        fontSize: "46px",
        fontWeight: "500",
        lineHeight: "1.02",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(540, 95, "480px", "110px", 20),
    ),
    textNode(
      "copy",
      "מלאו את הפרטים ונחזור אליכם תוך יום עסקים אחד.",
      { ...body, fontSize: "15px" },
      absoluteLayout(540, 220, "420px", "40px", 20),
    ),
    boxNode(
      "field-name",
      {
        backgroundColor: "#ffffff",
        border: "1px solid #e3e0da",
        borderRadius: "10px",
      },
      absoluteLayout(540, 285, "480px", "48px", 8),
    ),
    textNode(
      "field-name-label",
      "שם מלא",
      { color: "#9a9590", fontSize: "14px" },
      absoluteLayout(560, 298, "200px", "24px", 20),
    ),
    boxNode(
      "field-email",
      {
        backgroundColor: "#ffffff",
        border: "1px solid #e3e0da",
        borderRadius: "10px",
      },
      absoluteLayout(540, 350, "480px", "48px", 8),
    ),
    textNode(
      "field-email-label",
      "אימייל",
      { color: "#9a9590", fontSize: "14px" },
      absoluteLayout(560, 363, "200px", "24px", 20),
    ),
    boxNode(
      "field-message",
      {
        backgroundColor: "#ffffff",
        border: "1px solid #e3e0da",
        borderRadius: "10px",
      },
      absoluteLayout(540, 415, "480px", "120px", 8),
    ),
    textNode(
      "field-message-label",
      "איך נוכל לעזור?",
      { color: "#9a9590", fontSize: "14px" },
      absoluteLayout(560, 430, "240px", "24px", 20),
    ),
    buttonNode(
      "submit",
      "שליחת הודעה",
      button,
      absoluteLayout(540, 560, "480px", "50px", 20),
    ),
  ],
);

/** 2 — מפה + פרטי התקשרות */
const mapAndDetails = contact(
  "section-contact-showcase-map-details",
  "יצירת קשר — מפה ופרטים",
  "contact-showcase-map-details",
  "#ffffff",
  "700px",
  IMG.realestate,
  [
    textNode(
      "title",
      "איפה אנחנו",
      {
        color: ink,
        fontSize: "44px",
        fontWeight: "600",
        letterSpacing: "-0.045em",
      },
      absoluteLayout(45, 40, "400px", "55px", 20),
    ),
    textNode(
      "copy",
      "בואו לבקר, להתייעץ או פשוט לשלוח הודעה — אנחנו כאן.",
      { ...body, fontSize: "16px" },
      absoluteLayout(45, 100, "420px", "45px", 20),
    ),
    boxNode(
      "map",
      {
        backgroundColor: "#e8edf2",
        borderRadius: "14px",
        backgroundImage:
          "linear-gradient(135deg, #dce4ec 0%, #c8d4df 50%, #b8c8d6 100%)",
      },
      absoluteLayout(45, 170, "620px", "480px", 5),
    ),
    textNode(
      "map-pin",
      "📍",
      { fontSize: "28px", textAlign: "center" },
      absoluteLayout(310, 360, "50px", "40px", 20),
    ),
    boxNode(
      "details-card",
      {
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        border: "1px solid #eceef1",
        boxShadow: "0 18px 45px rgba(17,19,24,.08)",
      },
      absoluteLayout(700, 170, "360px", "480px", 10),
    ),
    ...[
      ["כתובת", "רothschild 45, Tel Aviv"],
      ["טלפון", "03-555-0198"],
      ["אימייל", "hello@studio.co.il"],
      ["שעות", "א׳–ה׳ · 09:00–18:00"],
    ].flatMap(([label, value], index) => {
      const y = 210 + index * 105;
      return [
        textNode(
          `label-${index}`,
          label,
          { color: "#8b9098", fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em" },
          absoluteLayout(735, y, "120px", "22px", 20),
        ),
        textNode(
          `value-${index}`,
          value,
          { color: ink, fontSize: "18px", fontWeight: "600" },
          absoluteLayout(735, y + 28, "290px", "30px", 20),
        ),
        ...(index < 3
          ? [
              boxNode(
                `rule-${index}`,
                { backgroundColor: "#eceef1" },
                absoluteLayout(735, y + 72, "290px", "1px", 5),
              ),
            ]
          : []),
      ];
    }),
    buttonNode(
      "directions",
      "ניווט במפה",
      { ...button, backgroundColor: "#2d6cdf" },
      absoluteLayout(735, 560, "260px", "46px", 20),
    ),
  ],
);

/** 3 — כרטיסים מוערמים */
const stackedCards = contact(
  "section-contact-showcase-stacked-cards",
  "יצירת קשר — כרטיסים מוערמים",
  "contact-showcase-stacked-cards",
  "#f3f4f6",
  "640px",
  IMG.workspace,
  [
    textNode(
      "eyebrow",
      "דרכים להגיע אלינו",
      {
        color: "#777b82",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        textAlign: "center",
      },
      absoluteLayout(340, 35, "400px", "24px", 20),
    ),
    textNode(
      "title",
      "בחרו את הדרך\nשנוחה לכם",
      {
        color: ink,
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "1.02",
        letterSpacing: "-0.05em",
        whiteSpace: "pre-line",
        textAlign: "center",
      },
      absoluteLayout(250, 68, "580px", "110px", 20),
    ),
    ...[
      [IMG.workspace, "שיחה", "050-123-4567", "זמינים בימים א׳–ה׳"],
      [IMG.office, "מייל", "info@biz.co.il", "מענה תוך 24 שעות"],
      [IMG.team, "פגישה", "קביעת ייעוץ", "במשרד או בזום"],
    ].flatMap(([src, heading, main, sub], index) => {
      const y = 210 + index * 130;
      return [
        boxNode(
          `card-${index}`,
          { backgroundColor: "#ffffff", borderRadius: "18px" },
          absoluteLayout(180, y, "720px", "110px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "12px", objectFit: "cover" },
          absoluteLayout(200, y + 15, "120px", "80px", 10),
          String(heading),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(345, y + 22, "200px", "32px", 20),
        ),
        textNode(
          `main-${index}`,
          String(main),
          { color: ink, fontSize: "18px", fontWeight: "600" },
          absoluteLayout(345, y + 58, "280px", "28px", 20),
        ),
        textNode(
          `sub-${index}`,
          String(sub),
          { ...body, fontSize: "13px" },
          absoluteLayout(650, y + 42, "230px", "30px", 20),
        ),
      ];
    }),
  ],
);

/** 4 — שכבת כהה על תמונה */
const darkOverlay = contact(
  "section-contact-showcase-dark-overlay",
  "יצירת קשר — שכבה כהה",
  "contact-showcase-dark-overlay",
  "#171717",
  "620px",
  IMG.hospitality,
  [
    imageNode(
      "image",
      IMG.hospitality,
      {
        borderRadius: "0",
        objectFit: "cover",
        filter: "brightness(.7) saturate(.9)",
      },
      absoluteLayout(0, 0, "1100px", "620px", 2),
      "רקע יצירת קשר",
    ),
    boxNode(
      "shade",
      {
        backgroundImage:
          "linear-gradient(90deg,rgba(9,12,14,.92) 0%,rgba(9,12,14,.55) 50%,rgba(9,12,14,.15) 100%)",
      },
      absoluteLayout(0, 0, "1100px", "620px", 5),
    ),
    textNode(
      "eyebrow",
      "זמינים עבורכם",
      {
        color: "#f5c86f",
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "0.15em",
      },
      absoluteLayout(65, 90, "240px", "26px", 20),
    ),
    textNode(
      "title",
      "דברו איתנו\nעוד היום",
      {
        color: "#ffffff",
        fontSize: "58px",
        fontWeight: "600",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(60, 135, "480px", "130px", 20),
    ),
    textNode(
      "phone",
      "050-987-6543",
      { color: "#ffffff", fontSize: "28px", fontWeight: "700" },
      absoluteLayout(65, 310, "320px", "40px", 20),
    ),
    textNode(
      "email",
      "contact@studio.co.il",
      { color: "rgba(255,255,255,.82)", fontSize: "18px" },
      absoluteLayout(65, 360, "320px", "28px", 20),
    ),
    textNode(
      "hours",
      "ראשון–חמישי · 08:30–19:00",
      { color: "rgba(255,255,255,.65)", fontSize: "15px" },
      absoluteLayout(65, 400, "320px", "28px", 20),
    ),
    buttonNode(
      "cta",
      "שליחת הודעה",
      {
        ...button,
        color: "#17120a",
        backgroundColor: "#f5c86f",
      },
      absoluteLayout(65, 470, "190px", "48px", 22),
    ),
  ],
);

/** 5 — מינימליסטי ממורכז */
const centeredMinimal = contact(
  "section-contact-showcase-centered-minimal",
  "יצירת קשר — מינימליסטי ממורכז",
  "contact-showcase-centered-minimal",
  "#ffffff",
  "580px",
  IMG.abstract,
  [
    textNode(
      "eyebrow",
      "יצירת קשר",
      {
        color: "#8b9098",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.18em",
        textAlign: "center",
      },
      absoluteLayout(390, 55, "300px", "24px", 20),
    ),
    textNode(
      "title",
      "נשמח לשמוע מכם",
      {
        color: ink,
        fontSize: "52px",
        fontWeight: "500",
        letterSpacing: "-0.055em",
        textAlign: "center",
      },
      absoluteLayout(240, 95, "600px", "65px", 20),
    ),
    textNode(
      "copy",
      "שאלה, הצעה או פרויקט חדש — כתבו לנו ונחזור אליכם בהקדם.",
      {
        ...body,
        fontSize: "16px",
        textAlign: "center",
      },
      absoluteLayout(280, 175, "520px", "45px", 20),
    ),
    buttonNode(
      "email-cta",
      "hello@studio.co.il",
      {
        ...button,
        backgroundColor: "#eef0f3",
        color: ink,
        borderRadius: "12px",
      },
      absoluteLayout(340, 260, "400px", "52px", 20),
    ),
    buttonNode(
      "phone-cta",
      "050-555-0123",
      button,
      absoluteLayout(340, 330, "400px", "52px", 20),
    ),
    buttonNode(
      "whatsapp",
      "WhatsApp",
      {
        ...button,
        backgroundColor: "#25d366",
      },
      absoluteLayout(340, 400, "400px", "52px", 20),
    ),
    textNode(
      "footer",
      "מענה בימים א׳–ה׳ · 09:00–18:00",
      {
        color: "#a0a4ab",
        fontSize: "13px",
        textAlign: "center",
      },
      absoluteLayout(380, 490, "320px", "24px", 20),
    ),
  ],
);

/** 6 — עמודות מידע */
const multiColumnInfo = contact(
  "section-contact-showcase-multi-column-info",
  "יצירת קשר — עמודות מידע",
  "contact-showcase-multi-column-info",
  "#f7f3ee",
  "620px",
  IMG.legal,
  [
    textNode(
      "title",
      "פרטי התקשרות",
      {
        color: ink,
        fontSize: "42px",
        fontWeight: "600",
        letterSpacing: "-0.04em",
      },
      absoluteLayout(45, 40, "500px", "55px", 20),
    ),
    textNode(
      "copy",
      "שלושה ערוצים. תגובה מהירה. שירות אישי.",
      { ...body, fontSize: "16px" },
      absoluteLayout(45, 100, "480px", "35px", 20),
    ),
    ...[
      ["משרד ראשי", "Herzl 12, Ramat Gan", "03-444-7788", IMG.office],
      ["תמיכה", "support@biz.co.il", "זמין 24/7", IMG.tech],
      ["מכירות", "sales@biz.co.il", "050-777-8899", IMG.finance],
    ].flatMap(([heading, line1, line2, src], index) => {
      const x = 45 + index * 340;
      return [
        boxNode(
          `col-${index}`,
          {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e8e4dd",
          },
          absoluteLayout(x, 170, "310px", "400px", 8),
        ),
        imageNode(
          `image-${index}`,
          String(src),
          { borderRadius: "10px", objectFit: "cover" },
          absoluteLayout(x + 20, 190, "270px", "120px", 10),
          String(heading),
        ),
        textNode(
          `heading-${index}`,
          String(heading),
          { color: ink, fontSize: "22px", fontWeight: "700" },
          absoluteLayout(x + 24, 330, "260px", "32px", 20),
        ),
        textNode(
          `line1-${index}`,
          String(line1),
          { ...body, fontSize: "15px" },
          absoluteLayout(x + 24, 375, "260px", "28px", 20),
        ),
        textNode(
          `line2-${index}`,
          String(line2),
          { color: ink, fontSize: "15px", fontWeight: "600" },
          absoluteLayout(x + 24, 410, "260px", "28px", 20),
        ),
        buttonNode(
          `cta-${index}`,
          "יצירת קשר",
          {
            ...button,
            padding: "10px 18px",
            fontSize: "13px",
          },
          absoluteLayout(x + 24, 490, "260px", "42px", 20),
        ),
      ];
    }),
  ],
);

/** 7 — מגזין: תמונה + רשימת פרטים */
const magazineLedger = contact(
  "section-contact-showcase-magazine-ledger",
  "יצירת קשר — מגזין Ledger",
  "contact-showcase-magazine-ledger",
  "#faf8f4",
  "700px",
  IMG.architecture,
  [
    textNode(
      "eyebrow",
      "יצירת קשר · Studio",
      {
        color: "#9a8b78",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(45, 40, "260px", "22px", 20),
    ),
    textNode(
      "title",
      "נשמח\nלשוחח",
      {
        color: "#1c1915",
        fontSize: "56px",
        fontWeight: "500",
        lineHeight: "0.98",
        letterSpacing: "-0.055em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(45, 75, "420px", "130px", 20),
    ),
    imageNode(
      "main",
      IMG.architecture,
      { borderRadius: "2px", objectFit: "cover" },
      absoluteLayout(45, 240, "500px", "400px", 5),
      "המשרד",
    ),
    textNode(
      "main-label",
      "ביקור במשרד · בתיאום מראש",
      {
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "700",
        backgroundColor: "rgba(28,25,21,.7)",
        borderRadius: "999px",
        padding: "10px 16px",
      },
      absoluteLayout(70, 580, "300px", "40px", 20),
    ),
    ...[
      ["01", "טלפון", "03-555-0198 · שלוחה 2"],
      ["02", "אימייל", "hello@studio.co.il"],
      ["03", "כתובת", "Dizengoff 100, Tel Aviv"],
      ["04", "שעות", "א׳–ה׳ 09:00–18:00 · ו׳ 09:00–13:00"],
      ["05", "רשתות", "@studio · LinkedIn · Instagram"],
    ].flatMap(([num, heading, copy], index) => {
      const y = 75 + index * 105;
      return [
        textNode(
          `num-${index}`,
          num,
          { color: "#c4b8a8", fontSize: "18px", fontWeight: "700" },
          absoluteLayout(600, y, "50px", "28px", 20),
        ),
        textNode(
          `heading-${index}`,
          heading,
          { color: "#1c1915", fontSize: "22px", fontWeight: "700" },
          absoluteLayout(660, y, "360px", "30px", 20),
        ),
        textNode(
          `copy-${index}`,
          copy,
          { color: "#7a7166", fontSize: "14px" },
          absoluteLayout(660, y + 34, "360px", "28px", 20),
        ),
        boxNode(
          `rule-${index}`,
          { backgroundColor: "#e6dfd4" },
          absoluteLayout(600, y + 78, "430px", "1px", 5),
        ),
      ];
    }),
  ],
);

/** 8 — Bento: טופס קצר + שעות + מיקום */
const bentoContact = contact(
  "section-contact-showcase-bento-grid",
  "יצירת קשר — רשת Bento",
  "contact-showcase-bento-grid",
  "#111318",
  "720px",
  IMG.education,
  [
    textNode(
      "eyebrow",
      "נשארים בקשר",
      {
        color: "rgba(255,255,255,.55)",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
      },
      absoluteLayout(45, 40, "240px", "22px", 20),
    ),
    textNode(
      "title",
      "כל מה שצריך\nבמקום אחד",
      {
        color: "#ffffff",
        fontSize: "44px",
        fontWeight: "500",
        lineHeight: "1.05",
        letterSpacing: "-0.045em",
        whiteSpace: "pre-line",
      },
      absoluteLayout(45, 72, "520px", "100px", 20),
    ),
    boxNode(
      "card-form",
      { backgroundColor: "#1c1f26", borderRadius: "18px" },
      absoluteLayout(45, 200, "520px", "480px", 8),
    ),
    textNode(
      "form-title",
      "שליחת הודעה",
      { color: "#ffffff", fontSize: "24px", fontWeight: "700" },
      absoluteLayout(70, 230, "300px", "36px", 20),
    ),
    boxNode(
      "input-a",
      { backgroundColor: "#2a2e38", borderRadius: "10px" },
      absoluteLayout(70, 285, "470px", "44px", 10),
    ),
    textNode(
      "input-a-label",
      "שם",
      { color: "rgba(255,255,255,.45)", fontSize: "14px" },
      absoluteLayout(88, 297, "120px", "22px", 20),
    ),
    boxNode(
      "input-b",
      { backgroundColor: "#2a2e38", borderRadius: "10px" },
      absoluteLayout(70, 345, "470px", "44px", 10),
    ),
    textNode(
      "input-b-label",
      "אימייל",
      { color: "rgba(255,255,255,.45)", fontSize: "14px" },
      absoluteLayout(88, 357, "120px", "22px", 20),
    ),
    boxNode(
      "input-c",
      { backgroundColor: "#2a2e38", borderRadius: "10px" },
      absoluteLayout(70, 405, "470px", "100px", 10),
    ),
    textNode(
      "input-c-label",
      "הודעה",
      { color: "rgba(255,255,255,.45)", fontSize: "14px" },
      absoluteLayout(88, 420, "120px", "22px", 20),
    ),
    buttonNode(
      "submit",
      "שליחה",
      {
        ...button,
        backgroundColor: "#ffffff",
        color: ink,
      },
      absoluteLayout(70, 530, "470px", "46px", 20),
    ),
    ...[
      [IMG.education, 590, 200, 450, 220, "שעות פעילות", "א׳–ה׳ · 09:00–18:00\nו׳ · 09:00–13:00"],
      [IMG.travel, 590, 440, 450, 240, "מיקום", "מרכז תל אביב · חניה בקרבת מקום"],
    ].flatMap(([src, x, y, w, h, heading, copy], index) => [
      boxNode(
        `side-${index}`,
        { backgroundColor: "#1c1f26", borderRadius: "18px" },
        absoluteLayout(Number(x), Number(y), `${Number(w)}px`, `${Number(h)}px`, 8),
      ),
      imageNode(
        `side-image-${index}`,
        String(src),
        { borderRadius: "12px", objectFit: "cover", opacity: "0.88" },
        absoluteLayout(Number(x) + 20, Number(y) + 18, `${Number(w) - 40}px`, "90px", 10),
        String(heading),
      ),
      textNode(
        `side-heading-${index}`,
        String(heading),
        { color: "#ffffff", fontSize: "20px", fontWeight: "700" },
        absoluteLayout(Number(x) + 24, Number(y) + Number(h) - 88, "380px", "28px", 20),
      ),
      textNode(
        `side-copy-${index}`,
        String(copy),
        {
          color: "rgba(255,255,255,.65)",
          fontSize: "13px",
          lineHeight: "1.5",
          whiteSpace: "pre-line",
        },
        absoluteLayout(Number(x) + 24, Number(y) + Number(h) - 52, "380px", "40px", 20),
      ),
    ]),
  ],
);

export const CONTACT_SHOWCASE_SECTIONS: VisualLibrarySectionTemplate[] = [
  splitFormImage,
  mapAndDetails,
  stackedCards,
  darkOverlay,
  centeredMinimal,
  multiColumnInfo,
  magazineLedger,
  bentoContact,
];
