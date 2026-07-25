#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatesDir = path.join(root, "src/components/site-builder/studio/data/templates");

const pageDefs = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const portraits = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1525875975471-999f65706a10?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=900&q=85",
];

const agencies = [
  {
    id: "pitchora",
    name: "Pitchora",
    niche: "startup-pitch-investor-relations",
    nicheHe: "סוכנות פיץ' ויחסי משקיעים",
    dna: "dark pitch-deck slides",
    primary: "#FFB703",
    accent: "#FB8500",
    bg: "#05070F",
    surface: "#101522",
    text: "#F8FAFC",
    muted: "#B7C2D6",
    dark: "#02040A",
    font: "Assistant",
    display: "Space Grotesk",
    heroTitle: "מצגת משקיעים שמרגישה כמו רגע לפני סבב.",
    heroSubtitle: "אסטרטגיית סיפור, דק פיננסי וחדר משקיעים שמכינים סטארטאפים לשיחות הכי חשובות.",
    heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=88",
    stats: [["72", "דקים לסבבים"], ["₪410M", "הון שגויס"], ["18 ימים", "עד גרסה מוכנה"], ["94%", "מוכנות Q&A"]],
    services: [["Investor Narrative", "קו סיפור חד לשוק, צוות, מוצר ומספרים."], ["Deck Architecture", "שקפים שמובילים החלטה ולא רק מסבירים."], ["Data Room", "חומרים, תשובות ומדדי אמון למשקיעים."], ["Founder Rehearsal", "חזרות פיץ' עם התנגדויות אמיתיות."]],
    cases: [["Seed Infra", "דק חדש הוביל ל-11 שיחות קרן בשבועיים."], ["Climate SaaS", "מסר שוק ממוקד וקיצור שיחת היכרות בחצי."], ["Fintech Bridge", "חדר משקיעים סגר פערי אמון לפני בדיקת נאותות."]],
    why: [["שקף לפני עיצוב", "כל עמוד מקבל תפקיד בשיחה."], ["מספרים עם הקשר", "מודל עסקי שמובן גם בלי גיליון פתוח."], ["מוכנות ללחץ", "שאלות קשות נכנסות לתהליך, לא בסוף."]],
    outcomes: [["פיץ' קצר יותר", "סיפור שנכנס ל-12 דקות בלי לאבד עומק."], ["חומרים עקביים", "דק, אימייל וחדר נתונים מדברים אותה שפה."], ["ביטחון מייסדים", "צוות שמגיע לשיחה עם תשובות ולא עם תקווה."]],
    insights: [["למה שקף הבעיה נכשל", "רוב הדקים מסבירים כאב, לא מוכיחים דחיפות."], ["מדדים שמרגיעים קרן", "המספרים שגורמים למשקיע להמשיך לשקף הבא."], ["איך לבנות Q&A", "מאגר תשובות שלא נשמע כמו מסמך משפטי."]],
    pricing: [["Sprint", "₪18,000", "דק פיץ' ממוקד לשלב מוקדם."], ["Round Room", "₪34,000", "דק, חדר נתונים וחזרות פיץ'."], ["IR Partner", "₪9,500/חודש", "ליווי שוטף לשיחות משקיעים."]],
    email: "hello@pitchora.co.il",
    phone: "03-555-7101",
  },
  {
    id: "socialux",
    name: "Socialux",
    niche: "social-media-agency",
    nicheHe: "סוכנות סושיאל",
    dna: "kinetic feed grid",
    primary: "#00C2FF",
    accent: "#F72585",
    bg: "#08111F",
    surface: "#0E1B2E",
    text: "#F2FBFF",
    muted: "#9BD8EB",
    dark: "#030812",
    font: "Rubik",
    display: "Bebas Neue",
    heroTitle: "פיד שלא עומד במקום.",
    heroSubtitle: "אסטרטגיית סושיאל, קריאייטיב ורילס שמייצרים קצב קבוע סביב מותגים עם אופי.",
    heroImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1600&q=88",
    stats: [["38M", "צפיות אורגניות"], ["210", "נכסים בחודש"], ["7.4%", "מעורבות ממוצעת"], ["14", "קהילות פעילות"]],
    services: [["Content Engine", "מערכת רעיונות, צילום ועריכה בקצב שבועי."], ["Reels Studio", "פורמטים קצרים עם פתיחה חזקה."], ["Community Ops", "ניהול תגובות, DM וקול מותג."], ["Social Analytics", "למידה מהירה לפי פורמט, קהל וזמן."]],
    cases: [["Beauty Feed", "סדרת רילס העלתה שמירות ב-220%."], ["Food Chain", "לוח תוכן מקומי ל-19 סניפים."], ["B2B Voice", "לינקדאין הפך לערוץ פגישות יציב."]],
    why: [["קצב הפקה", "צוות שמסוגל לפרסם בלי לחכות לקמפיין."], ["שפה חיה", "פורמטים שמתעדכנים לפי הפיד, לא לפי מצגת."], ["קהילה קודם", "כל תגובה היא נקודת מגע מסחרית."]],
    outcomes: [["יותר שמירות", "תוכן שנשאר אצל הקהל ולא חולף."], ["זיהוי פורמטים", "מבינים מה עובד לפני סוף החודש."], ["נוכחות עקבית", "המותג מופיע גם כשאין השקה."]],
    insights: [["הפוסט שמתאים לאלגוריתם", "איך בונים סדרה ולא הברקה חד פעמית."], ["תגובות הן מדיה", "קהילה יכולה להפוך לערוץ מכירות."], ["רילס בלי קלישאות", "פתיחות שמחזיקות צפייה בלי טריקים זולים."]],
    pricing: [["Feed Flow", "₪12,500", "תוכן וניהול ל-2 ערוצים."], ["Motion Grid", "₪22,000", "רילס, צילום וקהילה."], ["Always On", "₪32,000", "סטודיו סושיאל מלא למותג."]],
    email: "feed@socialux.co.il",
    phone: "03-555-7102",
  },
  {
    id: "influencix",
    name: "Influencix",
    niche: "influencer-marketing",
    nicheHe: "סוכנות משפיענים",
    dna: "creator spotlight",
    primary: "#FF4D6D",
    accent: "#FFD166",
    bg: "#14070C",
    surface: "#241018",
    text: "#FFF5F7",
    muted: "#F7B4C2",
    dark: "#090306",
    font: "Alef",
    display: "Cormorant Garamond",
    heroTitle: "היוצר הנכון הופך קמפיין לשיחה.",
    heroSubtitle: "איתור, ליהוק וניהול משפיענים עם התאמה אמיתית בין קהל, תוכן ותוצאה.",
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=88",
    stats: [["1,260", "יוצרים ממופים"], ["62%", "צפייה עד סוף"], ["4.1x", "החזר קמפיין"], ["9", "נישות עומק"]],
    services: [["Creator Casting", "התאמה לפי קהל, סגנון ואמון."], ["Brief Studio", "בריפים שמאפשרים ליוצר להיות הוא."], ["Usage Rights", "ניהול זכויות לתוכן ממומן ואורגני."], ["Performance Layer", "מדידה לפי קודים, לינקים ומכירות."]],
    cases: [["Wellness Drop", "28 יוצרים ייצרו מלאי UGC לחודשיים."], ["Tech Creators", "יוצרי נישה הביאו דמוים איכותיים."], ["Retail Buzz", "קמפיין מיקרו השיג מכירות בסניפים."]],
    why: [["לא רק עוקבים", "בודקים התאמת קהל ואמון לפני מחיר."], ["בריף גמיש", "שומרים על קול היוצר כדי שהתוכן יעבוד."], ["זכויות מסודרות", "המותג יודע בדיוק מה מותר לפרסם מחדש."]],
    outcomes: [["תוכן שמרגיש טבעי", "המסר עובר בלי להישמע כמו מודעה."], ["ספריית UGC", "נכסים שאפשר להפעיל גם במדיה בתשלום."], ["מדידה מסחרית", "קודים ולינקים שמחברים תוכן להכנסה."]],
    insights: [["מיקרו מול מאקרו", "מתי עדיף קהילה קטנה ומדויקת."], ["בריף שלא חונק", "איך להשאיר ליוצר מקום להביא אמת."], ["זכויות שימוש", "הסעיפים שחוסכים כאבי ראש בקמפיין הבא."]],
    pricing: [["Micro Cast", "₪14,000", "עד 8 יוצרים וניהול מלא."], ["Creator Wave", "₪28,000", "קמפיין משפיענים רב ערוצי."], ["Ambassador Club", "₪18,000/חודש", "מערכת שגרירים מתמשכת."]],
    email: "creators@influencix.co.il",
    phone: "03-555-7103",
  },
  {
    id: "seora",
    name: "Seora",
    niche: "seo-agency",
    nicheHe: "סוכנות SEO",
    dna: "data dashboard serp",
    primary: "#2DD4BF",
    accent: "#A3E635",
    bg: "#071513",
    surface: "#0F2421",
    text: "#ECFDF5",
    muted: "#99F6E4",
    dark: "#03100E",
    font: "Frank Ruhl Libre",
    display: "JetBrains Mono",
    heroTitle: "מיקומים הם רק הסימפטום. הכוונה היא הנכס.",
    heroSubtitle: "SEO טכני, תוכן וסמכות שמחברים חיפושים אמיתיים לעמודים שממירים.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=88",
    stats: [["312%", "צמיחה אורגנית"], ["48K", "מילות מפתח"], ["91", "ציוני Core Web"], ["27", "אשכולות תוכן"]],
    services: [["Technical SEO", "אינדוקס, ביצועים, מבנה ותקינות."], ["SERP Strategy", "אשכולות לפי כוונת חיפוש ותחרות."], ["Content Ops", "מערכת כתיבה ועדכון עמודים."], ["Authority Maps", "קישורים, אזכורים וסמכות ענפית."]],
    cases: [["Marketplace Rise", "קטגוריות אורגניות צמחו פי 3.1."], ["Legal SERP", "עמודי שירות נכנסו לטופ 3."], ["SaaS Knowledge", "בלוג הפך לערוץ דמוים."]],
    why: [["דשבורד פתוח", "כל שינוי מקושר למיקום, טראפיק והמרה."], ["כוונה לפני נפח", "לא רודפים אחרי מילה שלא מביאה לקוח."], ["טכני ותוכן יחד", "אין הפרדה בין קוד, מבנה וסיפור."]],
    outcomes: [["תנועה איכותית", "כניסות שמבינות מה הן מחפשות."], ["עמודים שמחזיקים", "תוכן שמתעדכן לפי SERP אמיתי."], ["פחות תלות במדיה", "ערוץ נכנס שנבנה לאורך זמן."]],
    insights: [["למה נפח מטעה", "מילה גדולה יכולה להיות קטנה עסקית."], ["איך לקרוא SERP", "העמודים הקיימים מספרים מה גוגל רוצה."], ["עדכון תוכן חכם", "מתי לשכתב ומתי לבנות עמוד חדש."]],
    pricing: [["Audit Sprint", "₪9,800", "מיפוי טכני ותוכנית 90 יום."], ["Organic Engine", "₪18,500", "SEO שוטף ותוכן חודשי."], ["SERP Domination", "₪34,000", "מערכת אורגנית רחבה לארגונים."]],
    email: "rank@seora.co.il",
    phone: "03-555-7104",
  },
  {
    id: "contentra",
    name: "Contentra",
    niche: "content-marketing",
    nicheHe: "סוכנות תוכן",
    dna: "editorial magazine",
    primary: "#7C2D12",
    accent: "#EAB308",
    bg: "#FFF7ED",
    surface: "#FFFFFF",
    text: "#2B1608",
    muted: "#8A4B25",
    dark: "#1C0B03",
    font: "Noto Serif Hebrew",
    display: "Libre Baskerville",
    heroTitle: "מערכת תוכן שנראית כמו מגזין ומוכרת כמו צוות מכירות.",
    heroSubtitle: "אסטרטגיית תוכן, כתיבה ועריכה למותגים שרוצים עומק, עקביות וקול ברור.",
    heroImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=88",
    stats: [["184", "מאמרים בשנה"], ["56%", "עלייה בזמן קריאה"], ["31", "מדריכים"], ["12", "עורכי תחום"]],
    services: [["Editorial Strategy", "עמודי תוכן לפי משפך וקהלים."], ["Thought Leadership", "מאמרי דעה למנהלים ומומחים."], ["Newsletter Desk", "ניוזלטרים שמחזירים קוראים."], ["Content Refresh", "עדכון נכסים קיימים לפי ביצועים."]],
    cases: [["Health Magazine", "מרכז ידע הפך לערוץ לידים."], ["Fintech Journal", "תוכן מומחים יצר אמון לפני דמו."], ["Retail Stories", "מגזין מותג הגדיל רכישות חוזרות."]],
    why: [["עריכה אמיתית", "כל טקסט עובר שולחן עורך, לא רק הגהה."], ["קול מותג", "סגנון עקבי בין מדריך, מייל ופוסט."], ["תוכן עם יעד", "לכל כתבה יש תפקיד במסע לקוח."]],
    outcomes: [["אמון לפני פנייה", "לקוח מגיע כשהוא כבר מבין את הערך."], ["ספריית ידע", "נכס שנצבר ולא נעלם אחרי קמפיין."], ["קול מנהיגות", "מנהלים נשמעים כמו מומחים, לא כמו מודעות."]],
    insights: [["איך בונים מערכת", "לוח תוכן צריך עורך, לא רק תאריכים."], ["כותרת שאינה קליקבייט", "פתיחה שמכבדת קורא ועדיין מושכת."], ["תוכן ארוך בעידן קצר", "איפה עומק עדיין מנצח."]],
    pricing: [["Editorial Kit", "₪11,000", "אסטרטגיה ו-4 נכסי תוכן."], ["Magazine Desk", "₪21,000", "מערכת תוכן חודשית."], ["Authority Room", "₪36,000", "תוכן מומחים וניוזלטר מלא."]],
    email: "desk@contentra.co.il",
    phone: "03-555-7105",
  },
  {
    id: "productix",
    name: "Productix",
    niche: "product-marketing",
    nicheHe: "סוכנות שיווק מוצר",
    dna: "roadmap product ui",
    primary: "#2563EB",
    accent: "#F97316",
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#475569",
    dark: "#0B1120",
    font: "Noto Sans Hebrew",
    display: "Sora",
    heroTitle: "מוצר טוב צריך מסר שמגיע בדיוק בזמן.",
    heroSubtitle: "מיצוב, GTM, דפי מוצר ונכסי מכירה לחברות מוצר שרוצות להסביר מהר ולמכור ברור.",
    heroImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1600&q=88",
    stats: [["41", "השקות מוצר"], ["29%", "שיפור המרה"], ["6", "פלייבוקים"], ["83", "נכסי enablement"]],
    services: [["Positioning", "מי קונה, למה עכשיו ולמה אתם."], ["GTM Roadmap", "תוכנית השקה לפי קהלים וערוצים."], ["Product Pages", "דפי מוצר שמסבירים ערך דרך UI."], ["Sales Enablement", "מצגות, battlecards וסקריפטים."]],
    cases: [["Feature Suite", "אריזת פיצ'רים שיצרה קו מוצר חדש."], ["B2B Relaunch", "מסרים חדשים העלו דמוים ב-34%."], ["PLG Upgrade", "מסע משתמש הפך למסע רכישה."]],
    why: [["מוצר ומסחר", "מחברים בין roadmap לבין קמפיין."], ["UI כראיה", "מראים ערך דרך מסכים, לא רק מילים."], ["מכירות בתוך התהליך", "צוותי sales מקבלים חומר שמיש מהיום הראשון."]],
    outcomes: [["מסר קצר", "כולם יודעים להסביר את המוצר באותה דרך."], ["השקה מתוזמנת", "תוכן, מכירות ומוצר יוצאים יחד."], ["פחות חיכוך", "עמודים וחומרים עונים לשאלות מוקדם."]],
    insights: [["מיצוב לפני דף נחיתה", "בלי בחירת זירה, כל מסר נשמע כללי."], ["איך לתרגם פיצ'ר", "המעבר מיכולת לערך עסקי."], ["GTM שלא נשאר במצגת", "מה חייב להפוך למשימות."]],
    pricing: [["Position Sprint", "₪16,000", "מיצוב ומסרים למוצר."], ["Launch Kit", "₪29,000", "GTM, דפים ונכסי מכירה."], ["PMM Partner", "₪24,000/חודש", "ליווי שיווק מוצר מתמשך."]],
    email: "gtm@productix.co.il",
    phone: "03-555-7106",
  },
  {
    id: "launchora",
    name: "Launchora",
    niche: "product-launch-agency",
    nicheHe: "סוכנות השקות מוצר",
    dna: "countdown ignition",
    primary: "#EF4444",
    accent: "#FBBF24",
    bg: "#170B0B",
    surface: "#261111",
    text: "#FFF7ED",
    muted: "#FDBA74",
    dark: "#090303",
    font: "Varela Round",
    display: "Anton",
    heroTitle: "השקה היא לא יום. היא הצתה מתוכננת.",
    heroSubtitle: "טיזרים, רשימות המתנה, אירועי השקה וקמפיינים שיוצרים מומנטום לפני שהמוצר באוויר.",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=88",
    stats: [["21", "השקות בשנה"], ["86K", "נרשמים מוקדמים"], ["4.8x", "באז להשקה"], ["72ש׳", "חדר מלחמה"]],
    services: [["Launch Calendar", "ספירה לאחור עם משימות, נכסים וערוצים."], ["Waitlist Funnels", "רשימות המתנה, הזמנות וקהילה."], ["Event Ignition", "אירועי השקה פיזיים ודיגיטליים."], ["War Room", "ניהול תגובות, מדיה ותיקונים בזמן אמת."]],
    cases: [["App Countdown", "רשימת המתנה של 18K לפני פתיחה."], ["Hardware Reveal", "אירוע דמו יצר הזמנות מוקדמות."], ["Retail Drop", "השקת קולקציה נמכרה ב-36 שעות."]],
    why: [["תזמון מדויק", "כל נכס יודע מתי להידלק."], ["רגע שיא", "בונים מתח לפני שמבקשים פעולה."], ["חדר שליטה", "השקה מנוהלת לפי נתונים בזמן אמת."]],
    outcomes: [["פתיחה חזקה", "היום הראשון מגיע עם ביקוש קיים."], ["מדיה מוכנה", "עיתונות, יוצרים ולקוחות מקבלים חומרים מראש."], ["למידה מהירה", "מתקנים מסרים תוך כדי מומנטום."]],
    insights: [["טיזר שאומר מספיק", "איך ליצור סקרנות בלי לחשוף הכול."], ["רשימת המתנה חכמה", "ההבדל בין אימיילים לבין קהילה."], ["יום השקה בלי פאניקה", "מה חייב להיות בחדר המלחמה."]],
    pricing: [["Ignition Sprint", "₪18,500", "תוכנית השקה וטיזרים."], ["Launch Room", "₪38,000", "קמפיין מלא וחדר מלחמה."], ["Drop Partner", "₪26,000/חודש", "השקות חוזרות למותגים פעילים."]],
    email: "go@launchora.co.il",
    phone: "03-555-7107",
  },
  {
    id: "partnerly",
    name: "Partnerly",
    niche: "partnerships-affiliate",
    nicheHe: "סוכנות שותפויות ואפיליאציה",
    dna: "network nodes",
    primary: "#16A34A",
    accent: "#38BDF8",
    bg: "#F0FDF4",
    surface: "#FFFFFF",
    text: "#052E16",
    muted: "#166534",
    dark: "#052814",
    font: "Secular One",
    display: "Montserrat",
    heroTitle: "צמיחה דרך שותפים שמביאים אמון קיים.",
    heroSubtitle: "בניית תוכניות שותפים, אפיליאציה ו-B2B alliances שמחברים מותגים לקהלים חדשים.",
    heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=88",
    stats: [["340", "שותפים פעילים"], ["27%", "הכנסה משותפים"], ["52", "אינטגרציות"], ["11", "רשתות נישה"]],
    services: [["Partner Strategy", "מפת שותפים לפי קהל, ערך ומודל תגמול."], ["Affiliate Ops", "מערכת לינקים, קופונים ודיווח."], ["Co-Marketing", "וובינרים, מדריכים וקמפיינים משותפים."], ["Partner Enablement", "חומרים שמאפשרים לשותף למכור נכון."]],
    cases: [["SaaS Alliance", "שותפי אינטגרציה יצרו 31% מהדמוים."], ["Creator Affiliate", "מערך קופונים הפך לערוץ רווחי."], ["Retail Partners", "שיתופי פעולה מקומיים הביאו תנועה לסניפים."]],
    why: [["ערך הדדי", "שותפות טובה מתחילה במה הצד השני מקבל."], ["מדידה נקייה", "כל ליד והכנסה משויכים למקור."], ["הפעלה רציפה", "שותפים צריכים תוכן, תזכורות ותמריצים."]],
    outcomes: [["ערוץ אמון", "כניסות מגיעות מהמלצה ולא מהפרעה."], ["הכנסה חוזרת", "שותפים פעילים מייצרים לאורך זמן."], ["קהלים חדשים", "המותג נכנס לשיחות קיימות."]],
    insights: [["שותף אינו ערוץ מדיה", "איך לבנות מערכת יחסים ולא רק לינק."], ["תגמול שמניע", "מודלים שמתאימים למחזור מכירה."], ["Enablement לשותפים", "מה חייב להיות בערכת המכירה."]],
    pricing: [["Map", "₪13,500", "אסטרטגיה ומפת שותפים."], ["Network Build", "₪27,000", "הקמת תוכנית אפיליאציה."], ["Partner Desk", "₪19,000/חודש", "ניהול שותפים שוטף."]],
    email: "network@partnerly.co.il",
    phone: "03-555-7108",
  },
  {
    id: "insightix",
    name: "Insightix",
    niche: "market-research",
    nicheHe: "סוכנות מחקר שוק",
    dna: "charts insight cards",
    primary: "#0F766E",
    accent: "#F59E0B",
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#475569",
    dark: "#0A1F1D",
    font: "Suez One",
    display: "IBM Plex Sans Hebrew",
    heroTitle: "תובנה טובה מקצרת חודשים של ניחושים.",
    heroSubtitle: "מחקר שוק, ראיונות, סקרים וניתוח תחרות שמתרגמים נתונים להחלטות ברורות.",
    heroImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=88",
    stats: [["14K", "משיבים"], ["920", "ראיונות עומק"], ["36", "דוחות שוק"], ["8.7", "ציון פעולה"]],
    services: [["Market Sizing", "TAM/SAM/SOM עם הנחות שקופות."], ["Customer Interviews", "ראיונות עומק שמגלים טריגרים וחסמים."], ["Survey Lab", "סקרים מדויקים עם ניתוח חתכים."], ["Competitive Intel", "מפת מתחרים, מסרים ומחירים."]],
    cases: [["Retail Expansion", "מחקר אזורי בחר 6 מיקומים חדשים."], ["SaaS ICP", "ראיונות הגדירו פלח לקוחות רווחי."], ["Healthcare Survey", "סקר צרכנים שינה מסר השקה."]],
    why: [["שאלה נקייה", "מחקר טוב מתחיל במה באמת צריך להחליט."], ["נתונים עם סיפור", "דוח שמוביל פעולה, לא רק גרפים."], ["שקיפות הנחות", "כל מסקנה מחוברת למקור ולביטחון."]],
    outcomes: [["החלטה מהירה", "מנהלים מבינים מה לעשות ביום שאחרי."], ["פחות סיכון", "השקה או כניסה לשוק עם ראיות."], ["שפה משותפת", "צוותים מתיישרים סביב אותה תמונת שוק."]],
    insights: [["איך לשאול בלי להוביל", "שאלות מחקר שמגלות אמת."], ["גרף שאומר פעולה", "ויזואליזציה שמנהלים זוכרים."], ["מתי סקר לא מספיק", "הפער בין כמות לעומק."]],
    pricing: [["Insight Sprint", "₪15,000", "מחקר ממוקד להחלטה אחת."], ["Market Map", "₪32,000", "סקר, ראיונות ודוח שוק."], ["Research Desk", "₪18,000/חודש", "מודיעין שוק שוטף."]],
    email: "research@insightix.co.il",
    phone: "03-555-7109",
  },
  {
    id: "uxforge",
    name: "UXForge",
    niche: "ux-ui-design-agency",
    nicheHe: "סוכנות UX/UI",
    dna: "wireframe craft",
    primary: "#111827",
    accent: "#06B6D4",
    bg: "#F3F4F6",
    surface: "#FFFFFF",
    text: "#111827",
    muted: "#4B5563",
    dark: "#030712",
    font: "Miriam Libre",
    display: "Syne",
    heroTitle: "ממשקים שנראים נקיים כי החשיבה מאחוריהם מדויקת.",
    heroSubtitle: "מחקר משתמשים, UX, UI ומערכות עיצוב למוצרים שצריכים להפוך מורכבות לפעולה פשוטה.",
    heroImage: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1600&q=88",
    stats: [["128", "מסכים שעוצבו"], ["42%", "ירידה בנטישה"], ["19", "מערכות עיצוב"], ["6", "בדיקות שמישות"]],
    services: [["UX Discovery", "מסעות משתמש, כאבים וזרימות."], ["Interface Design", "מסכים, קומפוננטות ומיקרו-קופי."], ["Design Systems", "טוקנים, רכיבים וכללי שימוש."], ["Usability Tests", "בדיקות עם משתמשים ותיעדוף תיקונים."]],
    cases: [["Fintech App", "תהליך פתיחת חשבון קוצר ב-38%."], ["Ops Dashboard", "דשבורד מורכב הפך לפעולות יומיות."], ["Marketplace UX", "שיפור פילטרים העלה המרות."]],
    why: [["ויירפריים לפני צבע", "מבנה נבחן לפני שמחליטים על אסתטיקה."], ["מערכת ולא מסכים", "כל רכיב נבנה לשימוש חוזר."], ["בדיקה עם אנשים", "החלטות עיצוב מקבלות ראיות."]],
    outcomes: [["פחות חיכוך", "משתמשים מוצאים פעולה מהר יותר."], ["מוצר עקבי", "צוות פיתוח מקבל מערכת ברורה."], ["שיפור מדיד", "בדיקות לפני ואחרי מראות התקדמות."]],
    insights: [["ויירפריים טוב", "מה הוא צריך לפתור לפני UI."], ["מיקרו-קופי במוצר", "המילים הקטנות שמורידות תמיכה."], ["Design system חי", "איך למנוע ספרייה שאף אחד לא פותח."]],
    pricing: [["UX Audit", "₪12,000", "מיפוי חיכוך ותוכנית תיקון."], ["Product Flow", "₪31,000", "מחקר, UX ו-UI לזרימה מרכזית."], ["Design System", "₪45,000", "מערכת רכיבים מלאה."]],
    email: "studio@uxforge.co.il",
    phone: "03-555-7110",
  },
  {
    id: "reelhaus",
    name: "Reelhaus",
    niche: "video-production",
    nicheHe: "סוכנות וידאו",
    dna: "filmstrip cinema",
    primary: "#D4AF37",
    accent: "#E11D48",
    bg: "#0C0A09",
    surface: "#1C1917",
    text: "#FFF7ED",
    muted: "#D6D3D1",
    dark: "#050403",
    font: "David Libre",
    display: "Playfair Display",
    heroTitle: "וידאו שמרגיש כמו סצנה, לא כמו נכס שיווקי.",
    heroSubtitle: "קונספט, צילום, עריכה ופוסט לפרסומות, סרטי מותג וסדרות תוכן עם שפה קולנועית.",
    heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=88",
    stats: [["240", "סרטונים"], ["18", "ימי צילום"], ["11", "במאים"], ["4K", "סטנדרט הפקה"]],
    services: [["Creative Treatment", "קונספט, תסריט ושוטליסט."], ["Production Crew", "צילום, תאורה, סאונד וניהול סט."], ["Post House", "עריכה, צבע, סאונד וגרפיקות."], ["Video Ads", "גזרות למדיה, רילס ויוטיוב."]],
    cases: [["Brand Film", "סרט מותג שהפך לנכס מכירות."], ["Restaurant Series", "סדרת וידאו הביאה הזמנות שבועיות."], ["Product Demo", "דמו מצולם קיצר שיחות מכירה."]],
    why: [["תסריט לפני מצלמה", "כל צילום יודע איזה רגש או פעולה לשרת."], ["סט מסודר", "הפקה מנוהלת בזמן, תקציב ואישורים."], ["גזרות חכמות", "מכל יום צילום יוצאים נכסים רבים."]],
    outcomes: [["נכס מרכזי", "סרט שמשרת אתר, מכירות ומדיה."], ["שפה קולנועית", "מותג שנראה יקר ומדויק."], ["יותר שימושים", "גזרות לכל ערוץ בלי להרגיש ממוחזר."]],
    insights: [["תסריט לפרסומת קצרה", "איך לבנות רגע פתיחה שעובד."], ["יום צילום יעיל", "מה מכינים כדי לא לבזבז שעות סט."], ["צבע וסאונד", "הפרטים שגורמים לווידאו להרגיש מקצועי."]],
    pricing: [["Reel Day", "₪14,500", "יום צילום וגזרות קצרות."], ["Brand Film", "₪42,000", "סרט מותג מלא."], ["Video Studio", "₪28,000/חודש", "הפקת וידאו חודשית."]],
    email: "roll@reelhaus.co.il",
    phone: "03-555-7111",
  },
  {
    id: "podcastix",
    name: "Podcastix",
    niche: "podcast-audio-agency",
    nicheHe: "סוכנות פודקאסט ואודיו",
    dna: "waveform mic",
    primary: "#8B5CF6",
    accent: "#22D3EE",
    bg: "#0F0A1F",
    surface: "#1D1235",
    text: "#F5F3FF",
    muted: "#C4B5FD",
    dark: "#070313",
    font: "Arimo",
    display: "DM Sans",
    heroTitle: "קול מותג שאנשים בוחרים לשמוע.",
    heroSubtitle: "פיתוח, הקלטה, עריכה והפצה של פודקאסטים ותוכן אודיו שמחזיקים קהילה לאורך זמן.",
    heroImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=88",
    stats: [["420", "פרקים"], ["68%", "האזנה מלאה"], ["31", "סדרות"], ["12K", "מאזינים חודשיים"]],
    services: [["Show Strategy", "פורמט, קהל, עונות ומבנה פרקים."], ["Studio Recording", "הקלטה מקצועית באולפן או מרחוק."], ["Audio Post", "עריכה, מיקס, פתיחים וסאונד."], ["Distribution", "הפצה, קליפים, ניוזלטר וקידום."]],
    cases: [["Founder Show", "סדרת ראיונות הפכה לערוץ אמון."], ["Internal Radio", "פודקאסט פנים ארגוני שיפר חיבור עובדים."], ["Expert Channel", "תוכן מומחים יצר לידים איכותיים."]],
    why: [["פורמט מחזיק", "סדרה טובה לא נשענת על אורח אחד."], ["סאונד נקי", "האזנה נעימה היא תנאי לאמון."], ["הפצה רב ערוצית", "כל פרק הופך לקליפים, פוסטים ומייל."]],
    outcomes: [["קהילה מקשיבה", "אנשים חוזרים לפרק הבא."], ["מומחיות נשמעת", "המותג תופס מקום בשיחה מקצועית."], ["נכסים מתמשכים", "פרק אחד הופך לשבוע תוכן."]],
    insights: [["פתיח שלא מבריח", "איך להגיע לערך בדקה הראשונה."], ["ראיון טוב", "שאלות שמוציאות סיפור ולא תשובה שיווקית."], ["קליפים מפודקאסט", "איך לבחור רגעים שעובדים בפיד."]],
    pricing: [["Pilot", "₪9,500", "פיתוח והפקת פרק ניסיון."], ["Season", "₪36,000", "עונה מלאה של 8 פרקים."], ["Audio Desk", "₪16,000/חודש", "הפקה והפצה שוטפת."]],
    email: "listen@podcastix.co.il",
    phone: "03-555-7112",
  },
  {
    id: "crisisdesk",
    name: "CrisisDesk",
    niche: "crisis-communications",
    nicheHe: "סוכנות תקשורת משברים",
    dna: "newsroom alert",
    primary: "#DC2626",
    accent: "#FDE047",
    bg: "#111827",
    surface: "#1F2937",
    text: "#F9FAFB",
    muted: "#D1D5DB",
    dark: "#030712",
    font: "Tinos",
    display: "Oswald",
    heroTitle: "כשכל דקה משנה, המסר חייב להיות מוכן.",
    heroSubtitle: "חדר משבר, דוברות, מדיה ופרוטוקולים לארגונים שצריכים להגיב מהר בלי לאבד אמון.",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=88",
    stats: [["24/7", "חדר תגובה"], ["38", "משברים נוהלו"], ["42ד׳", "טיוטת תגובה"], ["120", "דוברים אומנו"]],
    services: [["Crisis Protocols", "תרחישים, אחריות, אישורים וערוצי תגובה."], ["Media Response", "מסרים, שאלות עיתונאים ותדרוכים."], ["Stakeholder Comms", "לקוחות, עובדים, רגולטור וקהילה."], ["Simulation Training", "סימולציות לחץ לדוברים והנהלה."]],
    cases: [["Service Outage", "תגובה רב ערוצית שמרה על אמון לקוחות."], ["Executive Issue", "מסרים פנימיים וחיצוניים ייצבו שיח."], ["Recall Notice", "ניהול הודעות לציבור ולרגולטור."]],
    why: [["פרוטוקול לפני משבר", "לא מחליטים מי מאשר כשהטלפון מצלצל."], ["שפה מדויקת", "אמפתיה, עובדות ואחריות בסדר הנכון."], ["מעקב שיח", "מזהים התלקחות לפני שהיא הופכת לכותרת."]],
    outcomes: [["תגובה מהירה", "הארגון מדבר לפני שהרעש מכתיב נרטיב."], ["אמון נשמר", "מחזיקים עובדות ואנושיות יחד."], ["למידה אחרי", "כל אירוע הופך לפרוטוקול טוב יותר."]],
    insights: [["המשפט הראשון במשבר", "מה חייב להיאמר ומה אסור להבטיח."], ["דובר תחת לחץ", "איך מתאמנים לשאלה עוינת."], ["תקשורת פנימית", "עובדים הם קהל ראשון, לא הערת שוליים."]],
    pricing: [["Readiness Audit", "₪14,000", "בדיקת מוכנות ופרוטוקולים."], ["War Room", "₪32,000", "ניהול משבר פעיל."], ["Retainer", "₪18,000/חודש", "זמינות ותרגול שוטף."]],
    email: "alert@crisisdesk.co.il",
    phone: "03-555-7113",
  },
  {
    id: "lobbyhaus",
    name: "Lobbyhaus",
    niche: "public-affairs-lobbying",
    nicheHe: "סוכנות ממשל ולובינג",
    dna: "institutional formal",
    primary: "#1E3A8A",
    accent: "#B45309",
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#111827",
    muted: "#475569",
    dark: "#0B1736",
    font: "IBM Plex Sans Hebrew",
    display: "Cinzel",
    heroTitle: "מדיניות משתנה כשעובדות נכנסות לחדר הנכון.",
    heroSubtitle: "אסטרטגיית ממשל, קשרי רגולציה ומסמכי עמדה לארגונים שצריכים השפעה אחראית.",
    heroImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=88",
    stats: [["64", "מהלכי מדיניות"], ["18", "ועדות"], ["220", "פגישות מוסדיות"], ["9", "תחומי רגולציה"]],
    services: [["Policy Strategy", "מיפוי אינטרסים, רגולציה ושחקנים."], ["Position Papers", "מסמכי עמדה מבוססי נתונים."], ["Stakeholder Access", "פגישות, תדרוכים וניהול קשרים."], ["Coalition Building", "חיבור שותפים סביב אינטרס ציבורי."]],
    cases: [["Energy Policy", "קואליציה ענפית קידמה תיקון רגולטורי."], ["Health Access", "מסמך עמדה השפיע על דיון ועדה."], ["Urban Mobility", "מפת בעלי עניין פתחה ערוצי פעולה."]],
    why: [["השפעה אחראית", "עובדות, שקיפות וקשרים מקצועיים."], ["מפה מוסדית", "יודעים מי מחליט, מי משפיע ומתי."], ["מסר ציבורי", "אינטרס עסקי מתורגם לערך ציבורי."]],
    outcomes: [["גישה נכונה", "הדיון מגיע לאנשים הרלוונטיים."], ["עמדה מנומקת", "נתונים הופכים לטיעון שאפשר לדון בו."], ["קואליציה רחבה", "שותפים מחזקים לגיטימציה."]],
    insights: [["מסמך עמדה יעיל", "איך לכתוב למקבלי החלטות עסוקים."], ["מיפוי ועדות", "איפה באמת נוצרת השפעה."], ["קואליציה ציבורית", "איך מחברים אינטרסים בלי לטשטש אותם."]],
    pricing: [["Policy Map", "₪17,000", "מיפוי רגולציה ובעלי עניין."], ["Affairs Program", "₪38,000", "מהלך ממשל מלא."], ["Institution Desk", "₪24,000/חודש", "ליווי ציבורי שוטף."]],
    email: "policy@lobbyhaus.co.il",
    phone: "03-555-7114",
  },
  {
    id: "franchora",
    name: "Franchora",
    niche: "franchise-development",
    nicheHe: "סוכנות פיתוח זכיינות",
    dna: "system map multi-location",
    primary: "#92400E",
    accent: "#10B981",
    bg: "#FFFBEB",
    surface: "#FFFFFF",
    text: "#2B1704",
    muted: "#78350F",
    dark: "#1C0F02",
    font: "Bellefair",
    display: "Poppins",
    heroTitle: "מותג אחד. מערכת שמוכנה לעשרות נקודות.",
    heroSubtitle: "פיתוח מודל זכיינות, חוברות הפעלה וגיוס זכיינים למותגים שרוצים לצמוח בלי לאבד שליטה.",
    heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=88",
    aboutImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=88",
    stats: [["86", "סניפים תוכננו"], ["14", "רשתות לוו"], ["31", "נהלי הפעלה"], ["6.2ח׳", "עד סניף ראשון"]],
    services: [["Franchise Model", "כלכלה, תמלוגים, טריטוריות ותנאים."], ["Operations Manual", "נהלים, הדרכה ובקרת איכות."], ["Franchise Marketing", "עמודי גיוס, מצגות וקמפיינים."], ["Pilot Rollout", "ליווי זכיין ראשון והטמעת מערכת."]],
    cases: [["Cafe Chain", "מודל זכיינות ל-12 סניפים חדשים."], ["Fitness Studio", "חוברת הפעלה קיצרה הכשרת זכיין."], ["Retail Concept", "גיוס זכיינים אזורי עם מסר כלכלי ברור."]],
    why: [["מערכת לפני מכירה", "לא מגייסים זכיין לפני שהשיטה כתובה."], ["כלכלה שקופה", "זכיין מבין השקעה, תפעול ורווחיות."], ["שליטה במותג", "צמיחה לא צריכה לפגוע בחוויה."]],
    outcomes: [["מוכנות להתרחבות", "המותג יודע לשכפל את עצמו."], ["זכיינים מתאימים", "מסננים לפי יכולת והתאמה, לא רק כסף."], ["איכות אחידה", "נהלים ובקרה שומרים על חוויית לקוח."]],
    insights: [["מתי מותג מוכן לזכיינות", "הסימנים שחייבים לבדוק לפני גיוס."], ["חוברת הפעלה חיה", "מסמך שמנהל סניף, לא קלסר על מדף."], ["בחירת זכיין ראשון", "החלטה שתקבע את כל הרשת."]],
    pricing: [["Franchise Audit", "₪13,000", "בדיקת מוכנות ומודל ראשוני."], ["System Build", "₪39,000", "מודל, נהלים וחומרי גיוס."], ["Rollout Desk", "₪22,000/חודש", "גיוס וליווי זכיינים."]],
    email: "expand@franchora.co.il",
    phone: "03-555-7115",
  },
];

const imagePools = [
  ["https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1593697909683-bccb1b9e68a4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=85"],
  ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1300&q=85", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1300&q=85"],
];

const sectionNames = ["About", "Services", "Cases", "WhyUs", "Method", "Team", "Gallery", "Stats", "Outcomes", "Insights", "Pricing", "Faq", "CTABand", "Contact"];
const pageMiddles = {
  home: ["About", "Services", "WhyUs", "Cases", "Method", "Team", "Gallery", "Stats", "Outcomes", "Insights", "Pricing", "Faq", "CTABand", "Contact"],
  about: ["About", "WhyUs", "Stats", "Team", "Gallery", "Method", "Outcomes", "Insights", "Services", "Faq", "CTABand", "Contact"],
  services: ["Services", "Method", "Pricing", "WhyUs", "Cases", "Stats", "Outcomes", "Team", "Insights", "Faq", "CTABand", "Contact"],
  cases: ["Cases", "Stats", "Outcomes", "Gallery", "Services", "WhyUs", "Method", "Team", "Insights", "Pricing", "CTABand", "Contact"],
  team: ["Team", "About", "WhyUs", "Gallery", "Method", "Stats", "Outcomes", "Services", "Cases", "Insights", "CTABand", "Contact"],
  insights: ["Insights", "Stats", "Cases", "Method", "WhyUs", "Services", "Outcomes", "Gallery", "Team", "Pricing", "Faq", "Contact"],
  process: ["Method", "Services", "WhyUs", "Stats", "Cases", "Team", "Outcomes", "Gallery", "Insights", "Pricing", "Faq", "Contact"],
  contact: ["Contact", "CTABand", "About", "Services", "Cases", "WhyUs", "Method", "Stats", "Team", "Gallery", "Faq", "Footer"],
};

function pascal(id) {
  return id.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
}

function quote(value) {
  return JSON.stringify(value);
}

function rotate(items, offset) {
  const copy = [...items];
  const n = offset % copy.length;
  return [...copy.slice(n), ...copy.slice(0, n)];
}

function pageSectionOrder(index) {
  const order = {};
  for (const page of pageDefs) {
    if (page.id === "home") {
      order.home = ["Hero", ...rotate(pageMiddles.home, index), "Footer"];
      continue;
    }
    if (page.id === "contact") {
      order.contact = ["PageHero", ...rotate(pageMiddles.contact, index).filter((x) => x !== "Footer"), "Footer"];
      continue;
    }
    order[page.id] = ["PageHero", ...rotate(pageMiddles[page.id], index), "Footer"];
  }
  return order;
}

function commonData(agency, index) {
  const pool = imagePools[index];
  const team = portraits.slice(index * 3, index * 3 + 3);
  const logo = agency.name.slice(0, 2).toUpperCase();
  return {
    templateId: agency.id,
    name: agency.name,
    brandName: agency.name,
    logoText: logo,
    tagline: agency.dna,
    nicheLabel: agency.nicheHe,
    navHome: "בית",
    navAbout: "אודות",
    navServices: "שירותים",
    navCases: "פרויקטים",
    navTeam: "צוות",
    navInsights: "תובנות",
    navProcess: "תהליך",
    navContact: "צור קשר",
    heroEyebrow: agency.nicheHe,
    heroTitle: agency.heroTitle,
    heroSubtitle: agency.heroSubtitle,
    heroPrimaryButton: "קבעו שיחה",
    heroSecondaryButton: "צפו בעבודות",
    heroImage: agency.heroImage,
    aboutImage: agency.aboutImage,
    aboutEyebrow: "מי אנחנו",
    aboutTitle: `${agency.name} — ${agency.nicheHe} עם חתימת ${agency.dna}.`,
    aboutText: `אנחנו בונים מערכות עבודה שמחברות אסטרטגיה, קריאייטיב וביצוע. כל פרויקט מתחיל באבחון חד ומסתיים בנכסים שאפשר להפעיל מיד.`,
    servicesEyebrow: "שירותים",
    servicesTitle: "מה אנחנו מפעילים עבורכם.",
    serviceOneTitle: agency.services[0][0],
    serviceOneText: agency.services[0][1],
    serviceTwoTitle: agency.services[1][0],
    serviceTwoText: agency.services[1][1],
    serviceThreeTitle: agency.services[2][0],
    serviceThreeText: agency.services[2][1],
    serviceFourTitle: agency.services[3][0],
    serviceFourText: agency.services[3][1],
    casesEyebrow: "קייסים",
    casesTitle: "עבודות שמראות את השיטה.",
    caseOneTitle: agency.cases[0][0],
    caseOneText: agency.cases[0][1],
    caseTwoTitle: agency.cases[1][0],
    caseTwoText: agency.cases[1][1],
    caseThreeTitle: agency.cases[2][0],
    caseThreeText: agency.cases[2][1],
    caseOneImage: pool[0],
    caseTwoImage: pool[1],
    caseThreeImage: pool[2],
    teamEyebrow: "צוות",
    teamTitle: "אנשים שמחזיקים מקצוע וקצב.",
    teamOneName: ["נועה ברק", "איתי רם", "מאיה דגן", "רוני לוי", "אלון שחר", "תמר כהן", "גיא פרץ", "הילה עמית", "דנה מור", "יואב גל", "ליה אור", "עומר שניר", "שירי רז", "אריאל נוה", "מיכל סלע"][index],
    teamOneRole: ["Strategy Lead", "Creative Lead", "Creator Director", "SEO Lead", "Editor in Chief", "Product Marketing", "Launch Director", "Partnerships Lead", "Research Lead", "UX Director", "Film Director", "Audio Producer", "Crisis Lead", "Public Affairs", "Franchise Lead"][index],
    teamTwoName: ["עמית גל", "שירה טל", "גל רוזן", "ליאור בן", "יעל סער", "רועי חן", "מאור כהן", "נעמה סגל", "תום ארז", "עדי צור", "רם קפלן", "נועה תירוש", "אורי דביר", "טליה ארד", "דניאל כהן"][index],
    teamTwoRole: ["Design Systems", "Social Producer", "Talent Manager", "Technical SEO", "Senior Writer", "GTM Planner", "Media Ops", "Affiliate Ops", "Quant Analyst", "UI Craft", "Post Producer", "Sound Design", "Newsroom Ops", "Policy Analyst", "Ops Manual"][index],
    teamThreeName: ["כרמל ניר", "דניאל אור", "נעמה בר", "אדם לוין", "רעות פלג", "ענבר רון", "ליה שהם", "יובל חן", "מיקה גבע", "טל בן", "הילה שקד", "גפן שור", "מור הדר", "נמרוד איל", "שרון רגב"][index],
    teamThreeRole: ["Client Partner", "Community Lead", "Measurement", "Content SEO", "Newsletter", "Sales Enablement", "War Room", "Co-Marketing", "Insight Design", "Research Ops", "Cinematography", "Distribution", "Spokesperson Training", "Stakeholder Lead", "Franchise Marketing"][index],
    teamOneImage: team[0],
    teamTwoImage: team[1],
    teamThreeImage: team[2],
    galleryEyebrow: "גלריה",
    galleryTitle: "פריימים מתוך תהליך העבודה.",
    galleryOneImage: pool[3],
    galleryTwoImage: pool[4],
    galleryThreeImage: pool[5],
    galleryFourImage: pool[6],
    whyEyebrow: "למה אנחנו",
    whyTitle: "היתרונות שמורגשים בשטח.",
    whyOneTitle: agency.why[0][0],
    whyOneText: agency.why[0][1],
    whyTwoTitle: agency.why[1][0],
    whyTwoText: agency.why[1][1],
    whyThreeTitle: agency.why[2][0],
    whyThreeText: agency.why[2][1],
    outcomesEyebrow: "תוצאות",
    outcomesTitle: "מה משתנה אחרי העבודה.",
    outcomeOneTitle: agency.outcomes[0][0],
    outcomeOneText: agency.outcomes[0][1],
    outcomeTwoTitle: agency.outcomes[1][0],
    outcomeTwoText: agency.outcomes[1][1],
    outcomeThreeTitle: agency.outcomes[2][0],
    outcomeThreeText: agency.outcomes[2][1],
    insightsEyebrow: "תובנות",
    insightsTitle: "מחשבות מהסטודיו.",
    insightOneTitle: agency.insights[0][0],
    insightOneText: agency.insights[0][1],
    insightTwoTitle: agency.insights[1][0],
    insightTwoText: agency.insights[1][1],
    insightThreeTitle: agency.insights[2][0],
    insightThreeText: agency.insights[2][1],
    processEyebrow: "תהליך",
    processTitle: "איך מתקדמים בלי לאבד חדות.",
    processOneTitle: "אבחון",
    processOneText: "מגדירים קהל, יעד ומגבלות פעולה.",
    processTwoTitle: "ארכיטקטורה",
    processTwoText: "בונים שיטה, נכסים ולוחות זמנים.",
    processThreeTitle: "הפקה",
    processThreeText: "מוציאים לפועל בקצב מדוד ושקוף.",
    processFourTitle: "כיול",
    processFourText: "מודדים, משפרים ומרחיבים את מה שעובד.",
    pricingEyebrow: "מסלולים",
    pricingTitle: "אפשר להתחיל ממוקד או לבנות מערכת.",
    pricingOneTitle: agency.pricing[0][0],
    pricingOnePrice: agency.pricing[0][1],
    pricingOneText: agency.pricing[0][2],
    pricingTwoTitle: agency.pricing[1][0],
    pricingTwoPrice: agency.pricing[1][1],
    pricingTwoText: agency.pricing[1][2],
    pricingThreeTitle: agency.pricing[2][0],
    pricingThreePrice: agency.pricing[2][1],
    pricingThreeText: agency.pricing[2][2],
    faqEyebrow: "שאלות",
    faqTitle: "לפני שמתחילים.",
    faqOneQuestion: "כמה מהר אפשר לצאת לדרך?",
    faqOneAnswer: "ברוב המקרים מתחילים באבחון תוך שבוע ומציגים תוכנית פעולה ראשונה עד שבועיים.",
    faqTwoQuestion: "האם אפשר לערוך את כל התוכן באתר?",
    faqTwoAnswer: "כן. כל הכותרות, התמונות, השירותים, הצוות והפרטים בנויים כשדות עריכה.",
    faqThreeQuestion: "האם אתם עובדים עם צוות פנימי?",
    faqThreeAnswer: "כן. אנחנו משתלבים עם שיווק, מוצר, מכירות או הנהלה לפי אופי הפרויקט.",
    contactEyebrow: "צור קשר",
    contactTitle: "בואו נבנה את המהלך הבא.",
    contactText: `ספרו לנו איפה ${agency.name} יכולה לעזור ונחזור עם כיוון פעולה ברור.`,
    contactButton: "שליחת פנייה",
    ctaTitle: "רוצים לראות איך זה יכול לעבוד אצלכם?",
    ctaText: "שיחה קצרה תספיק כדי להבין אם יש התאמה ומה הצעד הראשון.",
    ctaButton: "דברו איתנו",
    phone: agency.phone,
    email: agency.email,
    address: "תל אביב, ישראל",
    footerText: "אתר מלא לסוכנות עם 8 עמודים, תנועה ותוכן עריך.",
    statOne: agency.stats[0][0],
    statOneLabel: agency.stats[0][1],
    statTwo: agency.stats[1][0],
    statTwoLabel: agency.stats[1][1],
    statThree: agency.stats[2][0],
    statThreeLabel: agency.stats[2][1],
    statFour: agency.stats[3][0],
    statFourLabel: agency.stats[3][1],
  };
}

function dataTs(agency, index) {
  return `export const ${agency.id}DefaultData = ${JSON.stringify(commonData(agency, index), null, 2)};\n`;
}

function editorCss(agency, index) {
  const selector = `[data-template-id="${agency.id}"], [data-template-id="${agency.id}-preview"]`;
  const darkShadow = index % 2 === 0 ? "rgba(0,0,0,0.28)" : "rgba(15,23,42,0.16)";
  return `export const ${agency.id}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?family=${agency.font.replaceAll(" ", "+")}:wght@400;500;600;700;800&family=${agency.display.replaceAll(" ", "+")}:wght@400;500;600;700;800;900&display=swap');
${selector} {
  --p: ${agency.primary};
  --a: ${agency.accent};
  --bg: ${agency.bg};
  --surface: ${agency.surface};
  --text: ${agency.text};
  --muted: ${agency.muted};
  --dark: ${agency.dark};
  font-family: "${agency.font}", sans-serif;
  background: var(--bg);
  color: var(--text);
  text-align: right;
}
[data-template-id="${agency.id}"] .text-center,
[data-template-id="${agency.id}-preview"] .text-center { text-align: center; }
[data-template-id="${agency.id}"] .ag-display,
[data-template-id="${agency.id}-preview"] .ag-display { font-family: "${agency.display}", "${agency.font}", sans-serif; }
[data-template-id="${agency.id}"] .ag-card,
[data-template-id="${agency.id}-preview"] .ag-card {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), border-color 460ms ease, box-shadow 460ms ease, filter 460ms ease;
}
[data-template-id="${agency.id}"] .ag-card:hover,
[data-template-id="${agency.id}-preview"] .ag-card:hover {
  transform: translateY(-${6 + index}px) rotate(${index % 2 === 0 ? "-" : ""}${(index % 4) * 0.35}deg);
  border-color: var(--a);
  box-shadow: 0 24px 70px ${darkShadow};
}
[data-template-id="${agency.id}"] .ag-ken,
[data-template-id="${agency.id}-preview"] .ag-ken { animation: ${agency.id}Ken ${16 + index}s ease-in-out infinite alternate; }
[data-template-id="${agency.id}"] .ag-float,
[data-template-id="${agency.id}-preview"] .ag-float { animation: ${agency.id}Float ${5 + (index % 5)}s ease-in-out infinite; }
[data-template-id="${agency.id}"] .ag-pulse,
[data-template-id="${agency.id}-preview"] .ag-pulse { animation: ${agency.id}Pulse ${2.5 + (index % 4) * 0.3}s ease-in-out infinite; }
[data-template-id="${agency.id}"] .ag-scan,
[data-template-id="${agency.id}-preview"] .ag-scan { animation: ${agency.id}Scan ${9 + index}s linear infinite; }
[data-template-id="${agency.id}"] .ag-drift,
[data-template-id="${agency.id}-preview"] .ag-drift { animation: ${agency.id}Drift ${10 + index}s ease-in-out infinite alternate; }
@keyframes ${agency.id}Ken { from { transform: scale(1) translate3d(0,0,0); } to { transform: scale(${1.07 + index * 0.004}) translate3d(${index % 2 === 0 ? "-" : ""}${4 + index}px, ${2 + (index % 5)}px, 0); } }
@keyframes ${agency.id}Float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-${10 + index}px); } }
@keyframes ${agency.id}Pulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 28%, transparent); } 50% { box-shadow: 0 0 0 ${8 + index}px color-mix(in srgb, var(--p) 0%, transparent); } }
@keyframes ${agency.id}Scan { from { transform: translateX(35%); } to { transform: translateX(-35%); } }
@keyframes ${agency.id}Drift { from { transform: rotate(-${2 + index * 0.2}deg) translateY(0); } to { transform: rotate(${2 + index * 0.2}deg) translateY(-${8 + index}px); } }
@media (prefers-reduced-motion: reduce) {
  [data-template-id="${agency.id}"] .ag-ken,
  [data-template-id="${agency.id}-preview"] .ag-ken,
  [data-template-id="${agency.id}"] .ag-float,
  [data-template-id="${agency.id}-preview"] .ag-float,
  [data-template-id="${agency.id}"] .ag-pulse,
  [data-template-id="${agency.id}-preview"] .ag-pulse,
  [data-template-id="${agency.id}"] .ag-scan,
  [data-template-id="${agency.id}-preview"] .ag-scan,
  [data-template-id="${agency.id}"] .ag-drift,
  [data-template-id="${agency.id}-preview"] .ag-drift { animation: none; }
}
\`;\n`;
}

function schemaTs(agency) {
  return `export const ${agency.id}Schema = {
  templateId: ${quote(agency.id)},
  name: ${quote(agency.name)},
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "תת כותרת", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "servicesTitle", label: "כותרת שירותים", type: "textarea" },
    { key: "casesTitle", label: "כותרת פרויקטים", type: "textarea" },
    { key: "teamTitle", label: "כותרת צוות", type: "textarea" },
    { key: "galleryTitle", label: "כותרת גלריה", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};\n`;
}

function previewTsx(agency) {
  const pc = pascal(agency.id);
  return `import React from "react";
import ${pc}Pages from "./pages";

export default function ${pc}Preview() {
  return (
    <div dir="rtl" data-template-id="${agency.id}-preview" className="min-h-screen w-full overflow-x-hidden">
      <${pc}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function thumbnailTsx(agency, index) {
  const pc = pascal(agency.id);
  return `import React from "react";

export default function ${pc}Thumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: ${quote(agency.bg)}, color: ${quote(agency.text)}, fontFamily: ${quote(`${agency.font}, sans-serif`)} }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: ${quote(agency.primary)}, color: "#fff" }}>${agency.nicheHe}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">${agency.name}</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">${agency.dna}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: ${quote(agency.surface)}, border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: ${quote(agency.accent)}, color: ${index % 2 === 0 ? '"#111827"' : '"#fff"'} }}>${agency.stats[0][0]}</div>
      </div>
    </div>
  );
}
`;
}

function metaTs(agency) {
  const pc = pascal(agency.id);
  return `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${pc}Pages, { ${agency.id}Pages } from "./pages";
import ${pc}Preview from "./preview";
import ${pc}Thumbnail from "./thumbnail";
import { ${agency.id}EditorCss } from "./editorCss";
import { ${agency.id}Schema } from "./schema";
import { ${agency.id}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: ${quote(agency.primary)},
  secondary: ${quote(agency.dark)},
  accent: ${quote(agency.accent)},
  background: ${quote(agency.bg)},
  surface: ${quote(agency.surface)},
  text: ${quote(agency.text)},
  muted: ${quote(agency.muted)},
  dark: ${quote(agency.dark)},
};

export const ${agency.id}Seed = {
  id: ${quote(agency.id)},
  key: ${quote(agency.id)},
  name: ${quote(agency.name)},
  title: ${quote(agency.name)},
  description: ${quote(`אתר מלא ל${agency.nicheHe}: 8 עמודים, תנועה, אפקטים ועיצוב ${agency.dna}.`)},
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: ${quote(agency.niche)},
  layout: "full-agency",
  image: (${agency.id}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${agency.id}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${agency.id}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "${agency.id}-header", title: "Header" },
    { type: "hero", variant: "${agency.id}-hero", title: "Hero" },
    { type: "about", variant: "${agency.id}-about", title: "About" },
    { type: "services", variant: "${agency.id}-services", title: "Services" },
    { type: "cases", variant: "${agency.id}-cases", title: "Cases" },
    { type: "team", variant: "${agency.id}-team", title: "Team" },
    { type: "gallery", variant: "${agency.id}-gallery", title: "Gallery" },
    { type: "contact", variant: "${agency.id}-contact", title: "Contact" },
    { type: "footer", variant: "${agency.id}-footer", title: "Footer" },
  ].map((block, index) => ({ id: \`${agency.id}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${agency.id}Pages,
  editor: { pages: ${agency.id}Pages, css: ${agency.id}EditorCss },
  css: ${agency.id}EditorCss,
  data: ${agency.id}DefaultData,
  defaultData: ${agency.id}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${agency.id}Template = {
  id: ${quote(agency.id)},
  key: ${quote(agency.id)},
  name: ${quote(agency.name)},
  title: ${quote(agency.name)},
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: ${quote(`אתר מלא ל${agency.nicheHe} עם 8 עמודים, תנועה ואפקטים — ${agency.dna}.`)},
  thumbnail: React.createElement(${pc}Thumbnail),
  preview: React.createElement(${pc}Preview),
  component: ${pc}Pages,
  Component: ${pc}Pages,
  seed: ${agency.id}Seed,
  pages: ${agency.id}Pages,
  editorCss: ${agency.id}EditorCss,
  schema: ${agency.id}Schema,
  defaultData: ${agency.id}DefaultData,
  renderer: {
    key: ${quote(agency.id)},
    name: ${quote(agency.name)},
    Component: ${pc}Pages,
    component: ${pc}Pages,
    pages: ${agency.id}Pages,
    editorMode: "visual-react",
    editorCss: ${agency.id}EditorCss,
    schema: ${agency.id}Schema,
    defaultData: ${agency.id}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${agency.id}Template;
`;
}

function headerSection(agency, index) {
  const shell = [
    "rounded-b-[2rem] border-b border-white/15 bg-[var(--dark)]/90 text-white backdrop-blur-2xl",
    "border-b border-white/10 bg-[var(--bg)]/80 text-[var(--text)] shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl",
    "mx-3 mt-3 rounded-full border border-white/15 bg-[var(--surface)]/85 text-[var(--text)] backdrop-blur-xl",
  ][index % 3];
  return `function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  void "${agency.id}:Header:${index}:${agency.dna}";
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["services", getValue(data, "navServices")],
    ["cases", getValue(data, "navCases")],
    ["team", getValue(data, "navTeam")],
    ["insights", getValue(data, "navInsights")],
    ["process", getValue(data, "navProcess")],
    ["contact", getValue(data, "navContact")],
  ];
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 ${shell}">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="group flex items-center gap-3 text-right">
          <span className="ag-pulse grid h-11 w-11 place-items-center ${index % 2 === 0 ? "rounded-2xl" : "rounded-full"} bg-[var(--p)] text-sm font-black text-white">${agency.name.slice(0, 2).toUpperCase()}</span>
          <span>
            <span className="ag-display block text-xl font-black leading-none">{getValue(data, "brandName")}</span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{getValue(data, "tagline")}</span>
          </span>
        </button>
        <nav className="hidden items-center gap-2 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className={(currentPage === id ? "bg-[var(--p)] text-white " : "text-current/70 hover:text-current ") + "rounded-full px-4 py-2 text-xs font-black transition"}>{label}</button>
          ))}
        </nav>
        <button type="button" onClick={() => goTo("contact")} className="hidden rounded-full bg-[var(--a)] px-5 py-3 text-xs font-black text-[var(--dark)] md:inline-flex">{getValue(data, "heroPrimaryButton")}</button>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-current/20 lg:hidden" onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
      </div>
      {open ? (
        <div className="border-t border-current/10 px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="rounded-2xl bg-current/5 px-4 py-3 text-right text-sm font-bold">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}`;
}

function heroSection(agency, index) {
  const variants = [
    `<section data-template-section-type="hero" className="relative overflow-hidden bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_center,var(--p),transparent_55%)] opacity-25" />
      <div className="mx-auto grid min-h-[86svh] max-w-7xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal variant="right" className="relative z-10 text-right">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-5 text-5xl font-black leading-[0.92] md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="ag-pulse rounded-full bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="rounded-full border border-white/25 px-8 py-4 text-sm font-black text-white">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <Reveal variant="scale" className="relative">
          <div className="ag-drift absolute -right-8 top-10 z-10 w-56 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
            <p className="text-xs font-black text-[var(--a)]">SLIDE 04</p>
            <p className="ag-display mt-6 text-4xl font-black">{stats[0][0]}</p>
            <p className="text-sm text-white/70">{stats[0][1]}</p>
          </div>
          <div className="grid rotate-[-3deg] gap-4">
            {[0, 1, 2].map((n) => (
              <div key={n} className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl">
                <img src={getValue(data, n === 0 ? "heroImage" : n === 1 ? "caseOneImage" : "galleryOneImage")} alt="" className="ag-ken h-48 w-full rounded-[1.5rem] object-cover opacity-80 md:h-56" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>`,
    `<section data-template-section-type="hero" className="relative min-h-[90svh] overflow-hidden bg-[var(--bg)] px-5 py-20 lg:px-8">
      <div className="ag-scan absolute top-24 flex w-[140%] gap-4 opacity-25">
        {[getValue(data, "caseOneImage"), getValue(data, "caseTwoImage"), getValue(data, "caseThreeImage"), getValue(data, "galleryOneImage")].map((image) => <img key={image} src={image} alt="" className="h-44 w-44 rounded-[2rem] object-cover" />)}
      </div>
      <div className="relative z-10 mx-auto grid min-h-[80svh] max-w-7xl items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal variant="up" className="rounded-[2.5rem] border border-white/15 bg-[var(--surface)]/85 p-7 text-right backdrop-blur-xl md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--a)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-5 text-5xl font-black leading-none md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="rounded-2xl bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="rounded-2xl border border-current/20 px-8 py-4 text-sm font-black">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <div className="grid gap-3">
          {stats.map(([value, label], i) => (
            <Reveal key={label} delayMs={i * 80} variant="left">
              <div className="ag-float flex items-center justify-between rounded-[2rem] border border-current/10 bg-[var(--surface)] p-5" style={{ animationDelay: String(i * 160) + "ms" }}>
                <span className="text-sm font-bold text-[var(--muted)]">{label}</span>
                <span className="ag-display text-4xl font-black text-[var(--p)]">{value}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
    `<section data-template-section-type="hero" className="relative overflow-hidden bg-[var(--dark)] text-white">
      <img src={getValue(data, "heroImage")} alt="" className="ag-ken absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-l from-[var(--dark)] via-[var(--dark)]/80 to-[var(--p)]/30" />
      <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-7xl items-center gap-8 px-5 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <Reveal variant="scale" className="order-2 grid gap-4 lg:order-1">
          {stats.map(([value, label], i) => (
            <div key={label} className="ag-card rounded-full border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl">
              <p className="ag-display text-3xl font-black text-[var(--a)]">{value}</p>
              <p className="text-xs font-bold text-white/70">{label}</p>
            </div>
          ))}
        </Reveal>
        <Reveal variant="right" className="order-1 text-right lg:order-2">
          <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-black text-[var(--a)]">{getValue(data, "heroEyebrow")}</div>
          <h1 className="ag-display max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="ag-pulse bg-[var(--a)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-white/30 px-8 py-4 text-sm font-black">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
    </section>`,
  ];
  return `function Hero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "${agency.id}:Hero:${index}:${agency.dna}";
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
  return (
    ${variants[index % variants.length]}
  );
}`;
}

function pageHeroSection(agency, index) {
  const style = [
    "grid min-h-[360px] items-end rounded-b-[3rem] bg-[var(--dark)] px-5 py-16 text-white lg:px-8",
    "border-y border-current/10 bg-[var(--surface)] px-5 py-20 lg:px-8",
    "relative overflow-hidden bg-[var(--bg)] px-5 py-20 lg:px-8",
  ][index % 3];
  return `function PageHero({ data, pageId }: { data: Record<string, any>; pageId: string }) {
  void "${agency.id}:PageHero:${index}:${agency.dna}";
  const pageTitles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };
  return (
    <section className="${style}">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--a)]/60" />
      <Reveal variant="${index % 2 === 0 ? "right" : "up"}" className="mx-auto max-w-7xl text-right">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-5 max-w-5xl text-5xl font-black leading-none md:text-7xl">{pageTitles[pageId] || getValue(data, "brandName")}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
      </Reveal>
    </section>
  );
}`;
}

function aboutSection(agency, index) {
  const shape = [
    "lg:grid-cols-[0.9fr_1.1fr]",
    "lg:grid-cols-[1.2fr_0.8fr]",
    "lg:grid-cols-[0.75fr_1.25fr]",
  ][index % 3];
  return `function About({ data }: { data: Record<string, any> }) {
  void "${agency.id}:About:${index}:${agency.dna}";
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 ${shape} items-center">
        <Reveal variant="${index % 2 === 0 ? "scale" : "right"}" className="${index % 2 === 0 ? "order-2 lg:order-1" : ""}">
          <div className="relative overflow-hidden ${index % 3 === 0 ? "rounded-[3rem]" : index % 3 === 1 ? "rounded-t-[5rem] rounded-b-3xl" : "rounded-[1rem_5rem_1rem_5rem]"} border border-current/10 bg-[var(--surface)] p-3">
            <img src={getValue(data, "aboutImage")} alt="" className="ag-ken h-[520px] w-full object-cover" />
            <div className="absolute bottom-6 right-6 rounded-3xl bg-[var(--dark)]/80 p-5 text-white backdrop-blur">
              <p className="text-xs font-black text-[var(--a)]">${agency.dna.toUpperCase()}</p>
              <p className="ag-display mt-2 text-3xl font-black">{getValue(data, "statOne")}</p>
            </div>
          </div>
        </Reveal>
        <Reveal variant="up" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black leading-tight md:text-6xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[getValue(data, "whyOneTitle"), getValue(data, "whyTwoTitle"), getValue(data, "whyThreeTitle")].map((item, i) => (
              <div key={item} className="ag-card rounded-3xl border border-current/10 bg-[var(--surface)] p-5">
                <span className="ag-display text-3xl font-black text-[var(--a)]">0{i + 1}</span>
                <p className="mt-3 text-sm font-bold">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}`;
}

function servicesSection(agency, index) {
  return `function Services({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "${agency.id}:Services:${index}:${agency.dna}";
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];
  return (
    <section className="${index % 2 === 0 ? "bg-[var(--surface)]" : "bg-[var(--dark)] text-white"} px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="${index % 3 === 0 ? "max-w-4xl text-right" : "mx-auto max-w-3xl text-center"}">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "servicesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 ${index % 3 === 0 ? "lg:grid-cols-4" : index % 3 === 1 ? "lg:grid-cols-2" : "lg:grid-cols-[1.2fr_0.8fr_1fr_0.9fr]"}">
          {services.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="${index % 2 === 0 ? "up" : "scale"}">
              <article className="ag-card group min-h-[260px] rounded-[2rem] border border-current/10 bg-[var(--bg)]/60 p-6 text-right ${index % 2 === 0 ? "" : "backdrop-blur"}">
                <div className="flex items-start justify-between gap-4">
                  <span className="ag-display text-5xl font-black text-[var(--p)]/40">0{i + 1}</span>
                  <span className="h-12 w-12 rounded-full bg-[var(--a)]/20 transition group-hover:scale-125" />
                </div>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo("contact")} className="mt-6 text-xs font-black text-[var(--a)]">בדקו התאמה ←</button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
}

function casesSection(agency, index) {
  return `function Cases({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Cases:${index}:${agency.dna}";
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText"), getValue(data, "caseOneImage")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText"), getValue(data, "caseTwoImage")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText"), getValue(data, "caseThreeImage")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 ${index % 3 === 0 ? "lg:grid-cols-[1fr_1fr_0.8fr]" : index % 3 === 1 ? "lg:grid-cols-[0.7fr_1.3fr]" : "lg:grid-cols-3"}">
          {items.map(([title, text, image], i) => (
            <Reveal key={title} delayMs={i * 110} variant="${index % 2 === 0 ? "scale" : "up"}">
              <article className="ag-card relative min-h-[${index % 3 === 1 ? "430" : "520"}px] overflow-hidden ${index % 2 === 0 ? "rounded-[3rem]" : "rounded-t-[5rem] rounded-b-3xl"} border border-current/10 bg-[var(--surface)] text-right">
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/55 to-transparent" />
                <div className="relative z-10 flex min-h-[inherit] flex-col justify-end p-7 text-white">
                  <span className="mb-5 w-fit rounded-full bg-[var(--a)] px-4 py-2 text-xs font-black text-[var(--dark)]">CASE 0{i + 1}</span>
                  <h3 className="ag-display text-3xl font-black md:text-5xl">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/75">{text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
}

function teamSection(agency, index) {
  return `function Team({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Team:${index}:${agency.dna}";
  const people = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole"), getValue(data, "teamOneImage")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole"), getValue(data, "teamTwoImage")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole"), getValue(data, "teamThreeImage")],
  ];
  return (
    <section className="${index % 2 === 0 ? "bg-[var(--surface)]" : "bg-[var(--bg)]"} px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="${index % 3 === 2 ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-right"}">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 ${index % 3 === 0 ? "lg:grid-cols-[0.8fr_1.2fr_0.8fr]" : "lg:grid-cols-3"}">
          {people.map(([name, role, image], i) => (
            <Reveal key={name} delayMs={i * 100} variant="${index % 2 === 0 ? "up" : "scale"}">
              <article className="ag-card overflow-hidden ${index % 3 === 1 ? "rounded-full" : "rounded-[2.5rem]"} border border-current/10 bg-[var(--surface)] text-right">
                <div className="relative h-[420px]">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/90 to-transparent" />
                  <div className="absolute bottom-0 right-0 p-6 text-white">
                    <p className="ag-display text-5xl font-black text-[var(--a)]">0{i + 1}</p>
                    <h3 className="mt-2 text-3xl font-black">{name}</h3>
                    <p className="mt-1 text-sm font-bold text-white/70">{role}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
}

function gallerySection(agency, index) {
  return `function Gallery({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Gallery:${index}:${agency.dna}";
  const images = [
    getValue(data, "galleryOneImage"),
    getValue(data, "galleryTwoImage"),
    getValue(data, "galleryThreeImage"),
    getValue(data, "galleryFourImage"),
  ];
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "galleryEyebrow")}</p>
          <h2 className="ag-display mt-3 text-4xl font-black md:text-6xl">{getValue(data, "galleryTitle")}</h2>
        </Reveal>
        <div className="grid gap-4 ${index % 3 === 0 ? "md:grid-cols-4" : index % 3 === 1 ? "md:grid-cols-[1.3fr_0.7fr_1fr]" : "md:grid-cols-2"}">
          {images.map((image, i) => (
            <Reveal key={image} delayMs={i * 80} variant="scale" className="${index % 3 === 0 ? "first:md:col-span-2 first:md:row-span-2" : index % 3 === 2 ? "even:md:translate-y-10" : ""}">
              <div className="ag-card h-[${index % 3 === 1 ? "360" : "300"}px] overflow-hidden ${index % 2 === 0 ? "rounded-[2.5rem]" : "rounded-[1rem_4rem_1rem_4rem]"} border border-current/10 bg-[var(--surface)] p-2">
                <img src={image} alt="" className="ag-ken h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
}

function supportingSection(name, agency, index) {
  const bg = index % 2 === 0 ? "bg-[var(--bg)]" : "bg-[var(--surface)]";
  const card = index % 3 === 0 ? "rounded-[2rem]" : index % 3 === 1 ? "rounded-t-[4rem] rounded-b-2xl" : "rounded-[1rem_3rem_1rem_3rem]";
  const variant = index % 2 === 0 ? "up" : "scale";
  if (name === "Stats") {
    return `function Stats({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Stats:${index}:${agency.dna}";
  const stats = [[getValue(data, "statOne"), getValue(data, "statOneLabel")], [getValue(data, "statTwo"), getValue(data, "statTwoLabel")], [getValue(data, "statThree"), getValue(data, "statThreeLabel")], [getValue(data, "statFour"), getValue(data, "statFourLabel")]];
  return (
    <section className="${bg} px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {stats.map(([value, label], i) => (
          <Reveal key={label} delayMs={i * 80} variant="${variant}">
            <div className="ag-card ${card} border border-current/10 bg-[var(--surface)] p-7 text-right">
              <p className="ag-display text-5xl font-black text-[var(--p)]">{value}</p>
              <p className="mt-3 text-sm font-bold text-[var(--muted)]">{label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}`;
  }
  if (name === "WhyUs" || name === "Outcomes" || name === "Insights") {
    const prefix = name === "WhyUs" ? "why" : name === "Outcomes" ? "outcome" : "insight";
    const eyebrowKey = name === "WhyUs" ? "whyEyebrow" : name === "Outcomes" ? "outcomesEyebrow" : "insightsEyebrow";
    const titleKey = name === "WhyUs" ? "whyTitle" : name === "Outcomes" ? "outcomesTitle" : "insightsTitle";
    return `function ${name}({ data, goTo }: { data: Record<string, any>; goTo?: (id: string) => void }) {
  void "${agency.id}:${name}:${index}:${agency.dna}";
  const items = [
    [getValue(data, "${prefix}OneTitle"), getValue(data, "${prefix}OneText")],
    [getValue(data, "${prefix}TwoTitle"), getValue(data, "${prefix}TwoText")],
    [getValue(data, "${prefix}ThreeTitle"), getValue(data, "${prefix}ThreeText")],
  ];
  return (
    <section className="${bg} px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="${index % 3 === 1 ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-right"}">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "${eyebrowKey}")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "${titleKey}")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="${variant}">
              <article className="ag-card ${card} border border-current/10 bg-[var(--surface)] p-7 text-right">
                <div className="mb-7 h-2 w-${index % 3 === 0 ? "20" : index % 3 === 1 ? "12" : "28"} rounded-full bg-[var(--a)]" />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
                ${name === "Insights" ? '<button type="button" onClick={() => goTo?.("contact")} className="mt-6 text-xs font-black text-[var(--p)]">קראו עוד</button>' : ""}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
  }
  if (name === "Method") {
    return `function Method({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Method:${index}:${agency.dna}";
  const steps = [[getValue(data, "processOneTitle"), getValue(data, "processOneText")], [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")], [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")], [getValue(data, "processFourTitle"), getValue(data, "processFourText")]];
  return (
    <section className="${index % 2 === 0 ? "bg-[var(--dark)] text-white" : "bg-[var(--bg)]"} px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 100} variant="${variant}">
              <article className="ag-card ${card} border border-current/10 bg-[var(--surface)]/80 p-6 text-right ${index % 2 === 0 ? "text-[var(--text)]" : ""}">
                <span className="ag-display grid h-14 w-14 place-items-center rounded-full bg-[var(--p)] text-xl font-black text-white">0{i + 1}</span>
                <h3 className="mt-8 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
  }
  if (name === "Pricing") {
    return `function Pricing({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Pricing:${index}:${agency.dna}";
  const tiers = [[getValue(data, "pricingOneTitle"), getValue(data, "pricingOnePrice"), getValue(data, "pricingOneText")], [getValue(data, "pricingTwoTitle"), getValue(data, "pricingTwoPrice"), getValue(data, "pricingTwoText")], [getValue(data, "pricingThreeTitle"), getValue(data, "pricingThreePrice"), getValue(data, "pricingThreeText")]];
  return (
    <section className="${bg} px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "pricingEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "pricingTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {tiers.map(([title, price, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="${variant}">
              <article className="ag-card ${card} border border-current/10 bg-[var(--surface)] p-7 text-right">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="ag-display mt-6 text-4xl font-black text-[var(--p)]">{price}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
  }
  if (name === "Faq") {
    return `function Faq({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Faq:${index}:${agency.dna}";
  const faqs = [[getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")], [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")], [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")]];
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "faqEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "faqTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-3">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delayMs={i * 80} variant="up">
              <article className="ag-card ${card} border border-current/10 bg-[var(--surface)] p-6 text-right">
                <h3 className="text-xl font-black">{q}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{a}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}`;
  }
  if (name === "CTABand") {
    return `function CTABand({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "${agency.id}:CTABand:${index}:${agency.dna}";
  return (
    <section className="px-5 py-12 lg:px-8">
      <Reveal variant="scale" className="mx-auto max-w-7xl overflow-hidden ${card} bg-[var(--p)] p-8 text-right text-white md:p-12">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">{getValue(data, "nicheLabel")}</p>
            <h2 className="ag-display mt-3 text-4xl font-black md:text-6xl">{getValue(data, "ctaTitle")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">{getValue(data, "ctaText")}</p>
          </div>
          <button type="button" onClick={() => goTo("contact")} className="ag-pulse rounded-full bg-[var(--a)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data, "ctaButton")}</button>
        </div>
      </Reveal>
    </section>
  );
}`;
  }
  if (name === "Contact") {
    return `function Contact({ data }: { data: Record<string, any> }) {
  void "${agency.id}:Contact:${index}:${agency.dna}";
  return (
    <section className="${index % 2 === 0 ? "bg-[var(--surface)]" : "bg-[var(--dark)] text-white"} px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--a)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-4xl font-black md:text-6xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 grid gap-3 text-sm font-bold">
            <span className="rounded-full border border-current/10 px-4 py-3">{getValue(data, "phone")}</span>
            <span className="rounded-full border border-current/10 px-4 py-3">{getValue(data, "email")}</span>
            <span className="rounded-full border border-current/10 px-4 py-3">{getValue(data, "address")}</span>
          </div>
        </Reveal>
        <Reveal variant="scale" className="${card} border border-current/10 bg-[var(--bg)]/60 p-5 md:p-8">
          <form className="grid gap-3">
            <input className="rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="שם מלא" />
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="טלפון" />
              <input className="rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="חברה / תחום" />
            </div>
            <textarea className="min-h-32 rounded-2xl border border-current/10 bg-[var(--surface)] px-4 py-4 text-right outline-none" placeholder="במה נוכל לעזור?" />
            <button type="button" className="rounded-2xl bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}`;
  }
  if (name === "Footer") {
    return `function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  void "${agency.id}:Footer:${index}:${agency.dna}";
  const links = ${agency.id}Pages.filter((p) => p.id !== "home");
  return (
    <footer data-template-section-type="footer" className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 text-right lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="ag-display text-5xl font-black">{getValue(data, "brandName")}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/60">{getValue(data, "footerText")}</p>
        </Reveal>
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {links.map((p) => (
              <button key={p.id} type="button" onClick={() => goTo(p.id)} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/75">{p.label}</button>
            ))}
          </div>
          <p className="text-xs text-white/45">© {new Date().getFullYear()} {getValue(data, "brandName")} · Bizuply</p>
        </div>
      </div>
    </footer>
  );
}`;
  }
  throw new Error(`Unknown section ${name}`);
}

function pagesTsx(agency, index) {
  const pc = pascal(agency.id);
  const order = pageSectionOrder(index);
  const orderLiteral = JSON.stringify(order, null, 2).replace(/"([^"]+)":/g, "$1:");
  const sections = [
    headerSection(agency, index),
    pageHeroSection(agency, index),
    heroSection(agency, index),
    aboutSection(agency, index),
    servicesSection(agency, index),
    casesSection(agency, index),
    teamSection(agency, index),
    gallerySection(agency, index),
    ...["WhyUs", "Method", "Stats", "Outcomes", "Insights", "Pricing", "Faq", "CTABand", "Contact", "Footer"].map((name) =>
      supportingSection(name, agency, index),
    ),
  ].join("\n\n");
  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { ${agency.id}DefaultData } from "./defaultData";
import { ${agency.id}EditorCss } from "./editorCss";

export const ${agency.id}Pages = ${JSON.stringify(pageDefs, null, 2)};

export const pageSectionOrder = ${orderLiteral} as const;

const allowedPages = ${agency.id}Pages.map((p) => p.id);

type Props = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (${agency.id}DefaultData as Record<string, any>)[key] ?? "";
}

${sections}

function RenderSection({ name, data, goTo, pageId }: { name: string; data: Record<string, any>; goTo: (id: string) => void; pageId: string }) {
  switch (name) {
    case "PageHero":
      return <PageHero data={data} pageId={pageId} />;
    case "Hero":
      return <Hero data={data} goTo={goTo} />;
    case "About":
      return <About data={data} />;
    case "Services":
      return <Services data={data} goTo={goTo} />;
    case "Cases":
      return <Cases data={data} />;
    case "WhyUs":
      return <WhyUs data={data} goTo={goTo} />;
    case "Method":
      return <Method data={data} />;
    case "Team":
      return <Team data={data} />;
    case "Gallery":
      return <Gallery data={data} />;
    case "Stats":
      return <Stats data={data} />;
    case "Outcomes":
      return <Outcomes data={data} goTo={goTo} />;
    case "Insights":
      return <Insights data={data} goTo={goTo} />;
    case "Pricing":
      return <Pricing data={data} />;
    case "Faq":
      return <Faq data={data} />;
    case "CTABand":
      return <CTABand data={data} goTo={goTo} />;
    case "Contact":
      return <Contact data={data} />;
    case "Footer":
      return <Footer data={data} goTo={goTo} />;
    default:
      return null;
  }
}

function TemplatePage({ pageId, data, goTo }: { pageId: keyof typeof pageSectionOrder; data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      {pageSectionOrder[pageId].map((sectionName) => (
        <RenderSection key={sectionName} name={sectionName} data={data} goTo={goTo} pageId={pageId} />
      ))}
    </>
  );
}

export default function ${pc}Pages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: Props) {
  const mergedData = useMemo(() => ({ ...${agency.id}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${agency.id}-preview" : "${agency.id}"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ${agency.id}EditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={${agency.id}Pages.map((p) => ({
          id: p.id,
          content: <TemplatePage pageId={p.id as keyof typeof pageSectionOrder} data={mergedData} goTo={goTo} />,
        }))}
      />
    </div>
  );
}
`;
}

function writeTemplate(agency, index) {
  const dir = path.join(templatesDir, agency.id);
  fs.mkdirSync(dir, { recursive: true });
  const files = {
    "defaultData.ts": dataTs(agency, index),
    "editorCss.ts": editorCss(agency, index),
    "schema.ts": schemaTs(agency),
    "preview.tsx": previewTsx(agency),
    "thumbnail.tsx": thumbnailTsx(agency, index),
    "meta.ts": metaTs(agency),
    "pages.tsx": pagesTsx(agency, index),
  };
  for (const [name, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), contents);
  }
}

function insertOnce(file, anchor, insertion, description) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes(insertion.trim().split("\n")[0])) {
    return;
  }
  if (!source.includes(anchor)) {
    throw new Error(`Could not find ${description} anchor in ${file}`);
  }
  source = source.replace(anchor, `${anchor}${insertion}`);
  fs.writeFileSync(file, source);
}

function wireIndex() {
  const file = path.join(templatesDir, "index.ts");
  const importBlock = agencies.map((agency) => `import { ${agency.id}Template } from "./${agency.id}/meta";`).join("\n") + "\n";
  insertOnce(file, 'import { eventideTemplate } from "./eventide/meta";\n', importBlock, "index import");
  const arrayBlock = agencies.map((agency) => `  ${agency.id}Template,`).join("\n") + "\n";
  insertOnce(file, "  eventideTemplate,\n", arrayBlock, "index array");
}

function wireRegistry() {
  const file = path.join(templatesDir, "templateRendererRegistry.ts");
  const imports = agencies
    .map((agency) => {
      const pc = pascal(agency.id);
      return `import ${pc}Pages, { ${agency.id}Pages } from "./${agency.id}/pages";
import { ${agency.id}EditorCss } from "./${agency.id}/editorCss";
import { ${agency.id}Schema } from "./${agency.id}/schema";
import { ${agency.id}DefaultData } from "./${agency.id}/defaultData";`;
    })
    .join("\n\n") + "\n\n";
  insertOnce(file, 'import { eventideDefaultData } from "./eventide/defaultData";\n', imports, "registry import");
  const entries = agencies
    .map((agency) => {
      const pc = pascal(agency.id);
      return `  ${agency.id}: createRenderer({
    key: "${agency.id}",
    name: "${agency.name}",
    Component: ${pc}Pages,
    pages: ${agency.id}Pages,
    editorMode: "visual-react",
    schema: ${agency.id}Schema as unknown as StudioTemplateRenderer["schema"],
    defaultData: ${agency.id}DefaultData as unknown as Record<string, any>,
    editorCss: ${agency.id}EditorCss,
  }),`;
    })
    .join("\n");
  insertOnce(file, "  eventide: createRenderer({\n    key: \"eventide\",\n    name: \"Eventide\",\n    Component: EventidePages,\n    pages: eventidePages,\n    editorMode: \"visual-react\",\n    schema: eventideSchema as unknown as StudioTemplateRenderer[\"schema\"],\n    defaultData: eventideDefaultData as unknown as Record<string, any>,\n    editorCss: eventideEditorCss,\n  }),\n", `${entries}\n`, "registry entries");
}

for (const [index, agency] of agencies.entries()) {
  writeTemplate(agency, index);
}
wireIndex();
wireRegistry();

console.log(`Generated ${agencies.length} agency templates: ${agencies.map((a) => a.id).join(", ")}`);
