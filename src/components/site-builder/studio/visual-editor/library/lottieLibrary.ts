import { absoluteLayout } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

const LOTTIE_PLAYER =
  "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";

type LottieAsset = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  src: string;
  size: number;
};

const LOTTIE_ASSETS: LottieAsset[] = [
  { id: "success-check", title: "וי הצלחה", description: "אנימציית אישור ירוקה", keywords: ["הצלחה", "וי", "אישור"], src: "https://assets2.lottiefiles.com/packages/lf20_jbrwj3pe.json", size: 160 },
  { id: "loading-spinner", title: "טעינה", description: "ספינר טעינה מקצועי", keywords: ["טעינה", "loader"], src: "https://assets9.lottiefiles.com/packages/lf20_usmfx6bp.json", size: 120 },
  { id: "shopping-bag", title: "שקית קניות", description: "אנימציית חנות", keywords: ["חנות", "קניות"], src: "https://assets3.lottiefiles.com/packages/lf20_ydo1amjm.json", size: 180 },
  { id: "heart-like", title: "לייק לב", description: "לב פועם", keywords: ["לב", "לייק"], src: "https://assets4.lottiefiles.com/packages/lf20_qmfs6c3i.json", size: 150 },
  { id: "confetti", title: "קונפטי", description: "חגיגת הצלחה", keywords: ["קונפטי", "חגיגה"], src: "https://assets1.lottiefiles.com/packages/lf20_u4yraugn.json", size: 200 },
  { id: "rocket", title: "טיל שיגור", description: "השקה וצמיחה", keywords: ["טיל", "השקה"], src: "https://assets9.lottiefiles.com/packages/lf20_l5qvxwtf.json", size: 170 },
  { id: "email-send", title: "שליחת מייל", description: "מעטפה נשלחת", keywords: ["מייל", "שליחה"], src: "https://assets3.lottiefiles.com/packages/lf20_vybwn7df.json", size: 150 },
  { id: "notification-bell", title: "התראה", description: "פעמון התראות", keywords: ["התראה", "פעמון"], src: "https://assets10.lottiefiles.com/packages/lf20_iorpbol0.json", size: 140 },
  { id: "money-growth", title: "צמיחה כספית", description: "גרף עולה", keywords: ["כסף", "צמיחה"], src: "https://assets9.lottiefiles.com/packages/lf20_qp1spzqv.json", size: 180 },
  { id: "team-work", title: "עבודת צוות", description: "שיתוף פעולה", keywords: ["צוות", "שיתוף"], src: "https://assets8.lottiefiles.com/packages/lf20_5tl1xxnz.json", size: 190 },
  { id: "calendar", title: "יומן", description: "תזמון ופגישות", keywords: ["יומן", "תאריך"], src: "https://assets4.lottiefiles.com/packages/lf20_ab8iybdt.json", size: 150 },
  { id: "chat-bubble", title: "צ'אט", description: "בועת שיחה", keywords: ["צאט", "הודעה"], src: "https://assets2.lottiefiles.com/packages/lf20_1pxqjqps.json", size: 140 },
  { id: "star-rating", title: "דירוג כוכבים", description: "5 כוכבים", keywords: ["כוכבים", "דירוג"], src: "https://assets3.lottiefiles.com/packages/lf20_qm8eqpvq.json", size: 150 },
  { id: "gift-box", title: "מתנה", description: "קופסת מתנה", keywords: ["מתנה", "הפתעה"], src: "https://assets1.lottiefiles.com/packages/lf20_1a8dx7yd.json", size: 170 },
  { id: "coffee-cup", title: "קפה", description: "כוס קפה מעוררת", keywords: ["קפה", "בוקר"], src: "https://assets9.lottiefiles.com/packages/lf20_q5pk4pyc.json", size: 140 },
  { id: "location-pin", title: "מיקום", description: "סימון מפה", keywords: ["מיקום", "מפה"], src: "https://assets4.lottiefiles.com/packages/lf20_uu0x8lqv.json", size: 130 },
  { id: "camera-photo", title: "מצלמה", description: "צילום תמונה", keywords: ["מצלמה", "צילום"], src: "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json", size: 150 },
  { id: "music-note", title: "מוזיקה", description: "תו מוזיקלי", keywords: ["מוזיקה", "סאונד"], src: "https://assets3.lottiefiles.com/packages/lf20_rea6eqwt.json", size: 140 },
  { id: "cloud-sync", title: "סנכרון ענן", description: "העלאה לענן", keywords: ["ענן", "סנכרון"], src: "https://assets1.lottiefiles.com/packages/lf20_tfa8ajft.json", size: 160 },
  { id: "security-lock", title: "אבטחה", description: "מנעול מאובטח", keywords: ["אבטחה", "מנעול"], src: "https://assets9.lottiefiles.com/packages/lf20_49rdyysj.json", size: 140 },
  { id: "idea-bulb", title: "רעיון", description: "נורה ורעיון", keywords: ["רעיון", "יצירתיות"], src: "https://assets4.lottiefiles.com/packages/lf20_ncztkcei.json", size: 150 },
  { id: "delivery-truck", title: "משלוח", description: "משאית משלוחים", keywords: ["משלוח", "הובלה"], src: "https://assets10.lottiefiles.com/packages/lf20_yzvbwrte.json", size: 180 },
  { id: "discount-tag", title: "מבצע", description: "תג הנחה", keywords: ["מבצע", "הנחה"], src: "https://assets2.lottiefiles.com/packages/lf20_g4iltdew.json", size: 150 },
  { id: "user-profile", title: "פרופיל", description: "משתמש", keywords: ["פרופיל", "משתמש"], src: "https://assets9.lottiefiles.com/packages/lf20_ab8iybdt.json", size: 140 },
  { id: "search-zoom", title: "חיפוש", description: "זכוכית מגדלת", keywords: ["חיפוש", "חיפושים"], src: "https://assets3.lottiefiles.com/packages/lf20_myejiggj.json", size: 130 },
  { id: "play-video", title: "נגן וידאו", description: "כפתור הפעלה", keywords: ["וידאו", "הפעלה"], src: "https://assets1.lottiefiles.com/packages/lf20_khzniaya.json", size: 150 },
  { id: "settings-gear", title: "הגדרות", description: "גלגל שיניים", keywords: ["הגדרות", "התאמה"], src: "https://assets9.lottiefiles.com/packages/lf20_ebqzvl7q.json", size: 140 },
  { id: "thumbs-up", title: "לייק", description: "אגודל למעלה", keywords: ["לייק", "אהבתי"], src: "https://assets4.lottiefiles.com/packages/lf20_aZTBR2.json", size: 140 },
  { id: "world-globe", title: "גלובוס", description: "עולם ורשת", keywords: ["עולם", "גלובלי"], src: "https://assets8.lottiefiles.com/packages/lf20_x62chJ.json", size: 170 },
  { id: "writing-pen", title: "כתיבה", description: "עט וכתיבה", keywords: ["כתיבה", "עט"], src: "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json", size: 140 },
];

function lottieHtml(src: string) {
  return `<script src="${LOTTIE_PLAYER}"></script><lottie-player src="${src}" background="transparent" speed="1" style="width:100%;height:100%" loop autoplay></lottie-player>`;
}

export const LOTTIE_LIBRARY: VisualLibraryElementItem[] = LOTTIE_ASSETS.map(
  (asset, index) => ({
    id: `lottie-${asset.id}`,
    kind: "element",
    tab: "elements",
    category: "graphics",
    title: asset.title,
    description: `${asset.description} — LottieFiles`,
    keywords: ["lottie", "אנימציה", ...asset.keywords],
    previewHtml: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:12px;font-weight:800;color:#7c3aed">Lottie</div>`,
    nodes: [
      {
        key: "root",
        type: "embed",
        label: asset.title,
        tagName: "div",
        content: {
          html: lottieHtml(asset.src),
          embedType: "lottie",
          lottieSrc: asset.src,
        },
        style: {
          width: `${asset.size}px`,
          height: `${asset.size}px`,
          backgroundColor: "transparent",
        },
        layout: absoluteLayout(
          40 + (index % 3) * 20,
          40 + (index % 4) * 16,
          `${asset.size}px`,
          `${asset.size}px`,
          30,
        ),
      },
    ],
  }),
);
