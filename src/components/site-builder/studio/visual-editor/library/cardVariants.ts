import {
  absoluteLayout,
  boxNode,
  buttonNode,
  textNode,
} from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

export const CARD_VARIANT_ELEMENTS: VisualLibraryElementItem[] = [
  {
    id: "card-vertical-rounded",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס אנכי מעוגל",
    description: "כרטיס גבוה עם פינות מעוגלות",
    keywords: ["כרטיס", "אנכי", "מעוגל", "vertical"],
    previewHtml:
      '<div style="border-radius:22px;background:#fff;box-shadow:0 10px 28px rgba(15,23,42,.12);padding:14px;height:110px;text-align:right"><div style="font-weight:900;font-size:14px">כותרת</div><div style="margin-top:6px;font-size:11px;color:#64748b">תיאור קצר לאורך</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          border: "1px solid rgba(15,23,42,.08)",
          boxShadow: "0 22px 55px rgba(15,23,42,.12)",
        },
        absoluteLayout(40, 40, "280px", "340px", 5),
        "כרטיס אנכי",
      ),
      textNode(
        "title",
        "כותרת אנכית",
        { color: "#0f172a", fontSize: "24px", fontWeight: "900" },
        absoluteLayout(64, 70, "230px", "40px", 10),
      ),
      textNode(
        "body",
        "תוכן ארוך יותר שמתאים לכרטיס אנכי — שירות, מוצר או יתרון.",
        {
          color: "#64748b",
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "1.6",
        },
        absoluteLayout(64, 130, "230px", "120px", 10),
      ),
      buttonNode(
        "cta",
        "לפרטים",
        {
          color: "#fff",
          backgroundColor: "#0f172a",
          borderRadius: "999px",
          fontWeight: "900",
          fontSize: "14px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        },
        absoluteLayout(64, 290, "130px", "44px", 11),
      ),
    ],
  },
  {
    id: "card-horizontal",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס אופקי",
    description: "כרטיס רחב לרוחב עם כותרת וטקסט בצד",
    keywords: ["כרטיס", "אופקי", "horizontal", "רוחב"],
    previewHtml:
      '<div style="border-radius:16px;background:#fff;border:1px solid #e2e8f0;padding:12px;display:flex;gap:10px;align-items:center"><div style="width:48px;height:48px;border-radius:12px;background:#e2e8f0"></div><div style="text-align:right"><div style="font-weight:900;font-size:13px">כותרת</div><div style="font-size:11px;color:#64748b">תיאור לרוחב</div></div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "22px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 16px 40px rgba(15,23,42,.08)",
        },
        absoluteLayout(40, 40, "560px", "140px", 5),
        "כרטיס אופקי",
      ),
      boxNode(
        "media",
        {
          backgroundColor: "#e2e8f0",
          borderRadius: "16px",
        },
        absoluteLayout(60, 60, "100px", "100px", 8),
        "מדיה",
      ),
      textNode(
        "title",
        "כותרת אופקית",
        { color: "#0f172a", fontSize: "22px", fontWeight: "900" },
        absoluteLayout(180, 70, "380px", "36px", 10),
      ),
      textNode(
        "body",
        "תיאור קצר שנמתח לרוחב הכרטיס — אידיאלי לרשימות ושירותים.",
        {
          color: "#64748b",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "1.5",
        },
        absoluteLayout(180, 112, "380px", "40px", 10),
      ),
    ],
  },
  {
    id: "card-square",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס מרובע",
    description: "כרטיס ריבועי עם פינות חדות יחסית",
    keywords: ["כרטיס", "מרובע", "square"],
    previewHtml:
      '<div style="width:90px;height:90px;margin:auto;border-radius:10px;background:#fff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px">מרובע</div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 14px 34px rgba(15,23,42,.1)",
        },
        absoluteLayout(40, 40, "240px", "240px", 5),
        "כרטיס מרובע",
      ),
      textNode(
        "title",
        "כותרת",
        {
          color: "#0f172a",
          fontSize: "22px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(60, 110, "200px", "36px", 10),
      ),
      textNode(
        "body",
        "תוכן קצר",
        {
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "600",
          textAlign: "center",
        },
        absoluteLayout(60, 155, "200px", "28px", 10),
      ),
    ],
  },
  {
    id: "card-soft-pill",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס כמוסה",
    description: "צורת כמוסה מעוגלת מאוד",
    keywords: ["כרטיס", "כמוסה", "pill", "מעוגל"],
    previewHtml:
      '<div style="border-radius:999px;background:#ecfeff;border:1px solid #a5f3fc;padding:14px 22px;font-weight:900;font-size:13px;text-align:center">כמוסה</div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ecfeff",
          borderRadius: "999px",
          border: "1px solid #a5f3fc",
        },
        absoluteLayout(40, 40, "420px", "96px", 5),
        "כרטיס כמוסה",
      ),
      textNode(
        "title",
        "יתרון מרכזי בשורה אחת",
        {
          color: "#0e7490",
          fontSize: "20px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(70, 68, "360px", "40px", 10),
      ),
    ],
  },
  {
    id: "card-dark",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס כהה",
    description: "כרטיס כהה בולט למידע חשוב",
    keywords: ["כרטיס", "כהה", "dark"],
    previewHtml:
      '<div style="border-radius:18px;background:#0f172a;color:#fff;padding:14px;text-align:right"><div style="font-weight:900">כותרת</div><div style="opacity:.7;font-size:11px;margin-top:4px">תיאור</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#0f172a",
          borderRadius: "26px",
        },
        absoluteLayout(40, 40, "320px", "220px", 5),
        "כרטיס כהה",
      ),
      textNode(
        "title",
        "כותרת כהה",
        { color: "#ffffff", fontSize: "24px", fontWeight: "900" },
        absoluteLayout(68, 70, "260px", "40px", 10),
      ),
      textNode(
        "body",
        "טקסט תומך על רקע כהה — מתאים להדגשות.",
        {
          color: "rgba(255,255,255,.72)",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "1.55",
        },
        absoluteLayout(68, 120, "260px", "70px", 10),
      ),
    ],
  },
  {
    id: "card-outline",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס מסגרת",
    description: "כרטיס שקוף עם מסגרת עבה",
    keywords: ["כרטיס", "מסגרת", "outline"],
    previewHtml:
      '<div style="border-radius:16px;border:2px solid #0f172a;padding:14px;text-align:right;font-weight:900;font-size:13px">מסגרת</div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "transparent",
          borderRadius: "24px",
          border: "2px solid #0f172a",
        },
        absoluteLayout(40, 40, "300px", "200px", 5),
        "כרטיס מסגרת",
      ),
      textNode(
        "title",
        "כותרת נקייה",
        { color: "#0f172a", fontSize: "22px", fontWeight: "900" },
        absoluteLayout(68, 80, "240px", "36px", 10),
      ),
      textNode(
        "body",
        "בלי מילוי — רק מסגרת ותוכן.",
        { color: "#64748b", fontSize: "15px", fontWeight: "500" },
        absoluteLayout(68, 130, "240px", "50px", 10),
      ),
    ],
  },
  {
    id: "card-image-left",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס תמונה בצד",
    description: "אופקי: מדיה משמאל ותוכן מימין",
    keywords: ["כרטיס", "תמונה", "אופקי", "מדיה"],
    previewHtml:
      '<div style="display:flex;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;height:70px"><div style="width:70px;background:linear-gradient(135deg,#cbd5e1,#94a3b8)"></div><div style="padding:10px;font-weight:900;font-size:12px">תוכן</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 18px 44px rgba(15,23,42,.1)",
        },
        absoluteLayout(40, 40, "580px", "180px", 5),
        "כרטיס תמונה",
      ),
      boxNode(
        "media",
        {
          backgroundImage:
            "linear-gradient(135deg,#94a3b8 0%,#64748b 55%,#0f172a 100%)",
          borderRadius: "0",
        },
        absoluteLayout(40, 40, "180px", "180px", 6),
        "מדיה",
      ),
      textNode(
        "title",
        "שירות מומלץ",
        { color: "#0f172a", fontSize: "24px", fontWeight: "900" },
        absoluteLayout(250, 70, "330px", "40px", 10),
      ),
      textNode(
        "body",
        "החליפו את הרקע בתמונה אמיתית וערכו את הטקסט חופשי.",
        {
          color: "#64748b",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "1.55",
        },
        absoluteLayout(250, 120, "330px", "60px", 10),
      ),
    ],
  },
  {
    id: "card-metric-row",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "שורת 3 מדדים",
    description: "שלושה כרטיסי מספר אופקיים",
    keywords: ["כרטיס", "מדדים", "מספרים", "סטטיסטיקה"],
    previewHtml:
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px"><div style="background:#0f172a;color:#fff;border-radius:10px;padding:8px;text-align:center;font-weight:900">12</div><div style="background:#0f172a;color:#fff;border-radius:10px;padding:8px;text-align:center;font-weight:900">48</div><div style="background:#0f172a;color:#fff;border-radius:10px;padding:8px;text-align:center;font-weight:900">9</div></div>',
    nodes: [0, 1, 2].flatMap((index) => {
      const x = 40 + index * 200;
      const values = ["12+", "48", "9.8"];
      const labels = ["לקוחות", "טיפולים", "דירוג"];
      return [
        boxNode(
          `card-${index}`,
          {
            backgroundColor: "#0f172a",
            borderRadius: "22px",
          },
          absoluteLayout(x, 40, "180px", "140px", 5),
          `מדד ${index + 1}`,
        ),
        textNode(
          `value-${index}`,
          values[index],
          {
            color: "#ffffff",
            fontSize: "36px",
            fontWeight: "900",
            textAlign: "center",
          },
          absoluteLayout(x + 20, 70, "140px", "48px", 10),
        ),
        textNode(
          `label-${index}`,
          labels[index],
          {
            color: "rgba(255,255,255,.7)",
            fontSize: "14px",
            fontWeight: "700",
            textAlign: "center",
          },
          absoluteLayout(x + 20, 120, "140px", "28px", 10),
        ),
      ];
    }),
  },
  {
    id: "card-soft-shadow",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס צל רך",
    description: "כרטיס בהיר עם צל עדין ופינות גדולות",
    keywords: ["כרטיס", "צל", "רך"],
    previewHtml:
      '<div style="border-radius:24px;background:#fff;box-shadow:0 18px 40px rgba(15,23,42,.12);padding:16px;font-weight:900">צל רך</div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "32px",
          boxShadow: "0 28px 60px rgba(15,23,42,.14)",
          border: "none",
        },
        absoluteLayout(40, 40, "340px", "240px", 5),
        "כרטיס צל",
      ),
      textNode(
        "title",
        "כותרת רכה",
        { color: "#0f172a", fontSize: "26px", fontWeight: "900" },
        absoluteLayout(72, 80, "270px", "40px", 10),
      ),
      textNode(
        "body",
        "עיצוב נקי עם נוכחות בלי מסגרת קשיחה.",
        {
          color: "#64748b",
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "1.6",
        },
        absoluteLayout(72, 140, "270px", "70px", 10),
      ),
    ],
  },
  {
    id: "card-price",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס מחיר",
    description: "כרטיס תמחור עם מחיר וכפתור",
    keywords: ["כרטיס", "מחיר", "תמחור", "pricing"],
    previewHtml:
      '<div style="border-radius:18px;border:1px solid #e2e8f0;padding:12px;text-align:center"><div style="font-weight:900">חבילה</div><div style="font-size:22px;font-weight:900;margin:6px 0">₪199</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 50px rgba(15,23,42,.1)",
        },
        absoluteLayout(40, 40, "280px", "320px", 5),
        "כרטיס מחיר",
      ),
      textNode(
        "plan",
        "חבילה בסיסית",
        {
          color: "#0f172a",
          fontSize: "20px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(60, 70, "240px", "36px", 10),
      ),
      textNode(
        "price",
        "₪199",
        {
          color: "#0f172a",
          fontSize: "48px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(60, 130, "240px", "60px", 10),
      ),
      textNode(
        "note",
        "לחודש · כולל ליווי",
        {
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "600",
          textAlign: "center",
        },
        absoluteLayout(60, 200, "240px", "28px", 10),
      ),
      buttonNode(
        "cta",
        "בחירה",
        {
          color: "#ffffff",
          backgroundColor: "#0f172a",
          borderRadius: "14px",
          fontWeight: "900",
          fontSize: "15px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        },
        absoluteLayout(70, 260, "220px", "48px", 11),
      ),
    ],
  },
];
