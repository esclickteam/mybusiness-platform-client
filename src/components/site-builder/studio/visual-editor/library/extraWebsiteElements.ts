import {
  absoluteLayout,
  boxNode,
  buttonNode,
  textNode,
} from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

const TABLE_HTML = `
<table style="width:100%;border-collapse:collapse;font-family:inherit;direction:rtl;text-align:right">
  <thead>
    <tr>
      <th style="padding:14px 16px;background:#0f172a;color:#fff;font-weight:800;border:1px solid #0f172a">פריט</th>
      <th style="padding:14px 16px;background:#0f172a;color:#fff;font-weight:800;border:1px solid #0f172a">תיאור</th>
      <th style="padding:14px 16px;background:#0f172a;color:#fff;font-weight:800;border:1px solid #0f172a">מחיר</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;font-weight:700">שירות א׳</td>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;color:#475569">תיאור קצר של השירות</td>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;font-weight:800">₪250</td>
    </tr>
    <tr>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700">שירות ב׳</td>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;background:#f8fafc;color:#475569">תיאור קצר של השירות</td>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:800">₪480</td>
    </tr>
    <tr>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;font-weight:700">שירות ג׳</td>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;color:#475569">תיאור קצר של השירות</td>
      <td style="padding:14px 16px;border:1px solid #e2e8f0;font-weight:800">₪990</td>
    </tr>
  </tbody>
</table>
`.trim();

export const EXTRA_WEBSITE_ELEMENTS: VisualLibraryElementItem[] = [
  {
    id: "table-pricing",
    kind: "element",
    tab: "elements",
    category: "tables",
    title: "טבלת מחירים",
    description: "טבלה ניתנת לעריכה עם כותרות ושורות",
    keywords: ["טבלה", "מחירים", "table", "pricing"],
    previewHtml:
      '<div style="padding:10px;font-size:11px;font-weight:800"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;background:#0f172a;color:#fff;padding:6px;border-radius:6px 6px 0 0"><span>פריט</span><span>תיאור</span><span>מחיר</span></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;padding:6px;border:1px solid #e2e8f0">א · ב · ₪</div></div>',
    nodes: [
      {
        key: "root",
        type: "embed",
        label: "טבלת מחירים",
        tagName: "div",
        content: { html: TABLE_HTML, embedType: "table" },
        style: {
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(15,23,42,.1)",
        },
        layout: absoluteLayout(40, 40, "640px", "260px", 10),
      },
    ],
  },
  {
    id: "table-simple",
    kind: "element",
    tab: "elements",
    category: "tables",
    title: "טבלה פשוטה",
    description: "טבלת נתונים נקייה עם 3 עמודות",
    keywords: ["טבלה", "נתונים", "table"],
    previewHtml:
      '<div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;font-size:11px;font-weight:700"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:#f1f5f9;padding:8px"><span>עמודה</span><span>עמודה</span><span>עמודה</span></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:8px;color:#64748b"><span>—</span><span>—</span><span>—</span></div></div>',
    nodes: [
      {
        key: "root",
        type: "embed",
        label: "טבלה",
        tagName: "div",
        content: {
          embedType: "table",
          html: `
<table style="width:100%;border-collapse:collapse;direction:rtl;text-align:right;font-family:inherit">
  <thead>
    <tr>
      <th style="padding:12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:800">עמודה א׳</th>
      <th style="padding:12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:800">עמודה ב׳</th>
      <th style="padding:12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:800">עמודה ג׳</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:12px;border:1px solid #e2e8f0">תא 1</td>
      <td style="padding:12px;border:1px solid #e2e8f0">תא 2</td>
      <td style="padding:12px;border:1px solid #e2e8f0">תא 3</td>
    </tr>
    <tr>
      <td style="padding:12px;border:1px solid #e2e8f0">תא 4</td>
      <td style="padding:12px;border:1px solid #e2e8f0">תא 5</td>
      <td style="padding:12px;border:1px solid #e2e8f0">תא 6</td>
    </tr>
  </tbody>
</table>`.trim(),
        },
        style: {
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        },
        layout: absoluteLayout(40, 40, "560px", "200px", 10),
      },
    ],
  },
  {
    id: "card-feature",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיסיית פיצ׳ר",
    description: "כרטיס עם כותרת, טקסט וכפתור — הכל ניתן לעריכה",
    keywords: ["כרטיס", "card", "פיצ׳ר", "שירות"],
    previewHtml:
      '<div style="border-radius:18px;background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.12);padding:16px;text-align:right"><div style="font-size:16px;font-weight:900">כותרת</div><div style="margin-top:6px;font-size:12px;color:#64748b">תיאור קצר</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          border: "1px solid rgba(15,23,42,.08)",
          boxShadow: "0 22px 55px rgba(15,23,42,.12)",
        },
        absoluteLayout(40, 40, "320px", "280px", 5),
        "כרטיסייה",
      ),
      textNode(
        "title",
        "כותרת הכרטיס",
        {
          color: "#0f172a",
          fontSize: "26px",
          fontWeight: "900",
        },
        absoluteLayout(68, 70, "260px", "44px", 10),
      ),
      textNode(
        "body",
        "כתבו כאן תיאור קצר של השירות, המוצר או הערך ללקוח.",
        {
          color: "#64748b",
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "1.6",
        },
        absoluteLayout(68, 128, "260px", "80px", 10),
      ),
      buttonNode(
        "cta",
        "לפרטים",
        {
          color: "#ffffff",
          backgroundColor: "#0f172a",
          fontSize: "15px",
          fontWeight: "900",
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        },
        absoluteLayout(68, 230, "140px", "46px", 11),
      ),
    ],
  },
  {
    id: "card-stat",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס מספר",
    description: "מספר גדול עם כותרת משנה — אידיאלי לסטטיסטיקות",
    keywords: ["כרטיס", "מספר", "סטטיסטיקה", "stat"],
    previewHtml:
      '<div style="border-radius:18px;background:#0f172a;color:#fff;padding:18px;text-align:center"><div style="font-size:28px;font-weight:900">250+</div><div style="font-size:12px;opacity:.7">לקוחות מרוצים</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#0f172a",
          borderRadius: "28px",
        },
        absoluteLayout(40, 40, "240px", "180px", 5),
        "כרטיס מספר",
      ),
      textNode(
        "value",
        "250+",
        {
          color: "#ffffff",
          fontSize: "52px",
          fontWeight: "900",
          textAlign: "center",
        },
        absoluteLayout(60, 70, "200px", "70px", 10),
      ),
      textNode(
        "caption",
        "לקוחות מרוצים",
        {
          color: "rgba(255,255,255,.72)",
          fontSize: "16px",
          fontWeight: "700",
          textAlign: "center",
        },
        absoluteLayout(60, 140, "200px", "30px", 10),
      ),
    ],
  },
  {
    id: "card-testimonial",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס המלצה",
    description: "ציטוט לקוח עם שם ותפקיד",
    keywords: ["המלצה", "ביקורת", "testimonial", "כרטיס"],
    previewHtml:
      '<div style="border-radius:18px;background:#fff;border:1px solid #e2e8f0;padding:14px;text-align:right"><div style="font-size:13px;font-weight:700;color:#334155">“שירות מעולה ומקצועי.”</div><div style="margin-top:8px;font-size:11px;color:#94a3b8">דנה כהן</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#ffffff",
          borderRadius: "26px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 16px 40px rgba(15,23,42,.08)",
        },
        absoluteLayout(40, 40, "360px", "220px", 5),
        "כרטיס המלצה",
      ),
      textNode(
        "quote",
        "“שירות מעולה, מקצועי ואישי. ממליצה בחום!”",
        {
          color: "#334155",
          fontSize: "20px",
          fontWeight: "700",
          lineHeight: "1.55",
        },
        absoluteLayout(68, 70, "300px", "90px", 10),
      ),
      textNode(
        "name",
        "דנה כהן · לקוחה",
        {
          color: "#94a3b8",
          fontSize: "14px",
          fontWeight: "800",
        },
        absoluteLayout(68, 180, "240px", "28px", 10),
      ),
    ],
  },
  {
    id: "card-icon-info",
    kind: "group",
    tab: "elements",
    category: "cards",
    title: "כרטיס עם אייקון",
    description: "אייקון, כותרת וטקסט קצר",
    keywords: ["כרטיס", "אייקון", "מידע"],
    previewHtml:
      '<div style="border-radius:16px;background:#f8fafc;padding:14px;text-align:right"><div style="width:28px;height:28px;border-radius:999px;background:#ddd6fe;margin-bottom:8px"></div><div style="font-weight:900;font-size:13px">כותרת</div></div>',
    nodes: [
      boxNode(
        "card",
        {
          backgroundColor: "#f8fafc",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
        },
        absoluteLayout(40, 40, "280px", "220px", 5),
        "כרטיס מידע",
      ),
      boxNode(
        "icon-bg",
        {
          backgroundColor: "#ddd6fe",
          borderRadius: "999px",
        },
        absoluteLayout(68, 68, "48px", "48px", 8),
        "רקע אייקון",
      ),
      textNode(
        "title",
        "יתרון מרכזי",
        {
          color: "#0f172a",
          fontSize: "22px",
          fontWeight: "900",
        },
        absoluteLayout(68, 132, "220px", "36px", 10),
      ),
      textNode(
        "body",
        "הסבירו בקצרה למה זה חשוב ללקוח.",
        {
          color: "#64748b",
          fontSize: "15px",
          fontWeight: "500",
          lineHeight: "1.5",
        },
        absoluteLayout(68, 172, "220px", "50px", 10),
      ),
    ],
  },
  {
    id: "faq-item",
    kind: "group",
    tab: "elements",
    category: "lists",
    title: "שאלת FAQ",
    description: "שאלה ותשובה ניתנות לעריכה מלאה",
    keywords: ["faq", "שאלה", "תשובה", "שאלות נפוצות"],
    previewHtml:
      '<div style="text-align:right;padding:8px"><div style="font-weight:900;font-size:13px">שאלה נפוצה?</div><div style="margin-top:6px;font-size:11px;color:#64748b">תשובה קצרה כאן</div></div>',
    nodes: [
      textNode(
        "question",
        "מה כולל השירות?",
        {
          color: "#0f172a",
          fontSize: "22px",
          fontWeight: "900",
        },
        absoluteLayout(40, 40, "420px", "40px", 10),
        "שאלה",
      ),
      textNode(
        "answer",
        "כתבו כאן תשובה ברורה ומקצועית שתעזור ללקוח להבין.",
        {
          color: "#64748b",
          fontSize: "17px",
          fontWeight: "500",
          lineHeight: "1.65",
        },
        absoluteLayout(40, 90, "420px", "80px", 10),
        "תשובה",
      ),
    ],
  },
  {
    id: "badge-pill",
    kind: "element",
    tab: "elements",
    category: "graphics",
    title: "תגית תווית",
    description: "תווית קטנה להדגשת יתרון או מבצע",
    keywords: ["תגית", "badge", "תווית"],
    previewHtml:
      '<div style="display:flex;align-items:center;justify-content:center;height:100%"><span style="background:#ecfccb;color:#3f6212;padding:8px 14px;border-radius:999px;font-weight:900;font-size:12px">מומלץ</span></div>',
    nodes: [
      textNode(
        "root",
        "מומלץ",
        {
          color: "#3f6212",
          backgroundColor: "#ecfccb",
          fontSize: "14px",
          fontWeight: "900",
          borderRadius: "999px",
          padding: "10px 18px",
          textAlign: "center",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        absoluteLayout(40, 40, "110px", "40px", 20),
        "תגית",
      ),
    ],
  },
  {
    id: "cta-banner",
    kind: "group",
    tab: "elements",
    category: "shapes",
    title: "באנר קריאה לפעולה",
    description: "רצועת CTA עם כותרת וכפתור",
    keywords: ["cta", "באנר", "קריאה לפעולה"],
    previewHtml:
      '<div style="border-radius:14px;background:linear-gradient(90deg,#0f172a,#334155);color:#fff;padding:14px;display:flex;justify-content:space-between;align-items:center"><span style="font-weight:900;font-size:13px">מוכנים להתחיל?</span><span style="background:#fff;color:#0f172a;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:900">צרו קשר</span></div>',
    nodes: [
      boxNode(
        "banner",
        {
          backgroundImage: "linear-gradient(90deg,#0f172a 0%,#334155 100%)",
          borderRadius: "24px",
        },
        absoluteLayout(40, 40, "720px", "120px", 5),
        "באנר CTA",
      ),
      textNode(
        "title",
        "מוכנים להתחיל?",
        {
          color: "#ffffff",
          fontSize: "28px",
          fontWeight: "900",
        },
        absoluteLayout(80, 70, "320px", "50px", 10),
      ),
      buttonNode(
        "cta",
        "צרו קשר",
        {
          color: "#0f172a",
          backgroundColor: "#ffffff",
          fontSize: "15px",
          fontWeight: "900",
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        },
        absoluteLayout(540, 72, "160px", "48px", 11),
      ),
    ],
  },
  {
    id: "spacer-block",
    kind: "element",
    tab: "elements",
    category: "shapes",
    title: "מרווח",
    description: "בלוק ריק ליצירת אוויר בין אלמנטים",
    keywords: ["מרווח", "spacer", "ריק"],
    previewHtml:
      '<div style="height:100%;display:flex;align-items:center;justify-content:center"><div style="width:80%;border-top:2px dashed #cbd5e1"></div></div>',
    nodes: [
      boxNode(
        "root",
        {
          backgroundColor: "transparent",
          border: "1px dashed #cbd5e1",
          borderRadius: "12px",
        },
        absoluteLayout(40, 40, "400px", "80px", 1),
        "מרווח",
      ),
    ],
  },
];
