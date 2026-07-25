#!/usr/bin/env node
/**
 * Generates 10 DISTINCT full multi-page agency websites with unique layouts + motion.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatesDir = path.join(root, "src/components/site-builder/studio/data/templates");

const agencies = [
  {
    key: "growthly",
    name: "Growthly",
    niche: "marketing-agency",
    nicheHe: "סוכנות שיווק",
    layout: "cinematic",
    tagline: "Growth Engine",
    primary: "#0D9488",
    accent: "#2DD4BF",
    bg: "#041F1E",
    surface: "#0A2F2D",
    text: "#ECFDF5",
    muted: "#99F6E4",
    dark: "#021412",
    font: "Heebo",
    display: "Manrope",
    darkTheme: true,
    heroTitle: "מנועי צמיחה שעובדים בלילה.",
    heroSubtitle: "אסטרטגיה, מדיה ותוכן שמזיזים לידים — לא רק מצגות יפות.",
    heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=88",
    stats: [["186%", "עלייה בלידים"], ["42", "קמפיינים חיים"], ["11", "שווקים"], ["3.2x", "ROAS ממוצע"]],
    services: [["Growth OS", "מערכת מדדים ואחריות לכל ערוץ."], ["Performance Media", "מטא, גוגל ולינקדאין עם אופטימיזציה יומית."], ["Content Loops", "תוכן שמזין את המשפך ולא מת במדיה."], ["CRM Automation", "לידים שלא נופלים בין הכיסאות."]],
    cases: [["Fintech Scale", "לידים איכותיים פי 2.4 ברבעון."], ["DTC Relaunch", "המרה עלתה ב-61% אחרי ריסטראקט משפך."], ["B2B Pipeline", "פגישות מאושרות +180% בלי הגדלת תקציב."]],
    team: [["נועה כהן", "Head of Growth"], ["איתי לוי", "Performance"], ["מאיה ברק", "Content"]],
    email: "hello@growthly.co.il", phone: "03-555-1200",
  },
  {
    key: "insureva",
    name: "Insureva",
    niche: "insurance-agency",
    nicheHe: "סוכנות ביטוח",
    layout: "trust",
    tagline: "שקט ביטוחי",
    primary: "#1D4ED8",
    accent: "#60A5FA",
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#64748B",
    dark: "#0B1B3A",
    font: "Heebo",
    display: "IBM Plex Sans Hebrew",
    heroTitle: "ביטוח שמרגיש כמו שקט, לא כמו טפסים.",
    heroSubtitle: "ליווי אישי למשפחות ועסקים — כיסויים מדויקים, שקיפות מלאה וטיפול בתביעות עד הסוף.",
    heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=88",
    stats: [["2,400+", "משפחות מלוות"], ["98%", "שביעות רצון"], ["14", "שנות ניסיון"], ["24ש׳", "מענה לתביעה"]],
    services: [["ביטוח עסקי", "רכוש, אחריות והמשכיות עסקית."], ["משפחה ובריאות", "חיים, בריאות וסיעוד בהתאמה אישית."], ["רכב ודירה", "השוואת פוליסות בלי לוותר על כיסוי."], ["ניהול תביעות", "ליווי צמוד מרגע האירוע."]],
    cases: [["מפעל תעשייה", "מעטפת מלאה עם חיסכון שנתי משמעותי."], ["משפחה צעירה", "תכנון כיסויים לפי שלבי חיים."], ["קליניקה", "אחריות מקצועית וציוד מתקדם."]],
    team: [["דניאל שפירא", "סוכן בכיר"], ["רוני אדרי", "יועצת משפחות"], ["יואב מזרחי", "מומחה עסקי"]],
    email: "care@insureva.co.il", phone: "03-555-2200",
  },
  {
    key: "closora",
    name: "Closora",
    niche: "sales-agency",
    nicheHe: "סוכנות מכירות",
    layout: "leaderboard",
    tagline: "Close Harder",
    primary: "#EA580C",
    accent: "#FB923C",
    bg: "#1C1917",
    surface: "#292524",
    text: "#FFF7ED",
    muted: "#FDBA74",
    dark: "#0C0A09",
    font: "Heebo",
    display: "Oswald",
    darkTheme: true,
    heroTitle: "סוגרים עסקאות. לא מבלים בשיחות סרק.",
    heroSubtitle: "בניית מערכי מכירה, סקריפטים, SDR וסגירה — עם לוח תוצאות שרואים כל בוקר.",
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=88",
    stats: [["37%", "שיעור סגירה"], ["210", "פגישות/חודש"], ["9 ימים", "מחזור ממוצע"], ["₪14M", "נסגר השנה"]],
    services: [["Sales Machine", "גיוס, הדרכה ומבנה תגמול."], ["Script Lab", "שיחות שמובילות לסגירה."], ["Pipeline CRM", "SLA, שלבים ומדידה יומית."], ["Outsourced SDR", "פגישות איכותיות מבחוץ."]],
    cases: [["SaaS Close-up", "שיעור סגירה הוכפל ב-90 יום."], ["Services Surge", "פייפליין יציב לרבעון קדימה."], ["Upsell Engine", "הכנסה חוזרת עלתה ב-44%."]],
    team: [["גל עדן", "Sales Director"], ["שירה כץ", "Enablement"], ["עומר דהן", "Closing Coach"]],
    email: "deal@closora.co.il", phone: "03-555-3300",
  },
  {
    key: "adspire",
    name: "Adspire",
    niche: "advertising-agency",
    nicheHe: "סוכנות פרסום",
    layout: "kinetic",
    tagline: "Ideas That Interrupt",
    primary: "#A855F7",
    accent: "#E879F9",
    bg: "#09020F",
    surface: "#160824",
    text: "#FAF5FF",
    muted: "#D8B4FE",
    dark: "#05010A",
    font: "Heebo",
    display: "Space Grotesk",
    darkTheme: true,
    heroTitle: "רעיונות שעוצרים גלילה.",
    heroSubtitle: "קריאייטיב, הפקה ומדיה — קמפיינים שאי אפשר להתעלם מהם.",
    heroImage: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=88",
    stats: [["48M", "חשיפות/שנה"], ["120+", "סרטונים"], ["16", "פרסים"], ["4.8x", "מעורבות"]],
    services: [["Concept Lab", "רעיונות גדולים לשפה ויזואלית."], ["Multi-Channel", "TV, דיגיטל, OOH ורשתות."], ["Film Unit", "סרטונים ורילס בקצב גבוה."], ["Media Plan", "תקציב חכם ומדידה."]],
    cases: [["Product Drop", "קמפיין ארצי עם ויראליות אמיתית."], ["Fashion Cut", "מעורבות פי 4 בסדרת סרטונים."], ["OOH Night", "שילוט + דיגיטל משולב לאירוע."]],
    team: [["תמר אביב", "Creative Director"], ["ליאור חן", "Strategy"], ["נטע רוזן", "Art Director"]],
    email: "hello@adspire.co.il", phone: "03-555-4400",
  },
  {
    key: "talentix",
    name: "Talentix",
    niche: "recruitment-agency",
    nicheHe: "סוכנות גיוס",
    layout: "mosaic",
    tagline: "People First",
    primary: "#0891B2",
    accent: "#22D3EE",
    bg: "#ECFEFF",
    surface: "#FFFFFF",
    text: "#083344",
    muted: "#0E7490",
    dark: "#164E63",
    font: "Heebo",
    display: "Sora",
    heroTitle: "הטאלנט הנכון משנה רבעון שלם.",
    heroSubtitle: "גיוס הייטק, מכירות ומנהלים — תהליך מהיר, שקוף ומדויק.",
    heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=88",
    stats: [["640+", "מינויים"], ["19 ימים", "זמן לאיוש"], ["92%", "נשארים שנה"], ["35", "חברות פעילות"]],
    services: [["Tech Hiring", "מפתחים, פרודקט ודאטה."], ["Sales Talent", "SDR עד Sales Leaders."], ["Executive Search", "בכירים בדיסקרטיות."], ["Employer Brand", "מיתוג מעסיק שמושך חזקים."]],
    cases: [["Cyber Team", "12 תפקידים ב-60 יום."], ["Series A Core", "צוות ליבה מלא לסטארטאפ."], ["Retail Leaders", "מנהלי סניפים ארצי."]],
    team: [["הילה נחום", "Managing Partner"], ["רון אלון", "Tech Recruiter"], ["מיכל פרץ", "Talent Partner"]],
    email: "talent@talentix.co.il", phone: "03-555-5500",
  },
  {
    key: "narrativa",
    name: "Narrativa",
    niche: "pr-agency",
    nicheHe: "סוכנות יחסי ציבור",
    layout: "editorial",
    tagline: "Stories That Stick",
    primary: "#BE123C",
    accent: "#FB7185",
    bg: "#FFF1F2",
    surface: "#FFFFFF",
    text: "#4C0519",
    muted: "#9F1239",
    dark: "#1F0A12",
    font: "Heebo",
    display: "Playfair Display",
    heroTitle: "הסיפור הנכון מגיע לכותרת הנכונה.",
    heroSubtitle: "יחסי ציבור, משברים ודוברות מנכ״ל — מוניטין שנבנה לאורך זמן.",
    heroImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=88",
    stats: [["320+", "כתבות"], ["48ש׳", "משבר→ייצוב"], ["85", "דוברים"], ["12", "ענפים"]],
    services: [["Press Relations", "עיתונות, פודקאסטים ומדיה."], ["Crisis Desk", "פרוטוקולים ותגובה מהירה."], ["CEO Voice", "מיצוב אישי למנהיגים."], ["Launch PR", "מדיה להשקות ואירועים."]],
    cases: [["App Launch Week", "סבב מדיה ארצי בשבוע אחד."], ["Crisis 48", "ייצוב מוניטין תוך יומיים."], ["Founder Series", "ראיונות ופודקאסטים מובילים."]],
    team: [["יעל סגל", "PR Director"], ["אסף גרין", "Media Relations"], ["דנה אור", "Crisis Lead"]],
    email: "press@narrativa.co.il", phone: "03-555-6600",
  },
  {
    key: "brandforge",
    name: "Brandforge",
    niche: "branding-agency",
    nicheHe: "סוכנות מיתוג",
    layout: "typeblocks",
    tagline: "Identity Systems",
    primary: "#111827",
    accent: "#F59E0B",
    bg: "#FFFBEB",
    surface: "#FFFFFF",
    text: "#111827",
    muted: "#78716C",
    dark: "#0A0A0A",
    font: "Heebo",
    display: "Syne",
    heroTitle: "מותג שלא צריך להציג את עצמו פעמיים.",
    heroSubtitle: "אסטרטגיית מותג, זהות ויזואלית ושפה — ממחקר ועד מערכת נכסים חיה.",
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1400&q=88",
    stats: [["90+", "מותגים"], ["6 שבועות", "ממוצע לזהות"], ["28", "מערכות עיצוב"], ["100%", "נכסי מסירה"]],
    services: [["Brand Strategy", "מיצוב, קהל והבטחה."], ["Visual Identity", "לוגו, צבע, טיפוגרפיה."], ["Brand Voice", "טון מסרים וקופי."], ["Design System", "ספריית נכסים חיה."]],
    cases: [["Retail Rebrand", "זהות חדשה לכל נקודות המגע."], ["SaaS Naming", "שם + מערכת ויזואלית גלובלית."], ["Hospitality Pack", "שפה לענף האירוח."]],
    team: [["עדי נריה", "Brand Director"], ["תום אזולאי", "Identity Lead"], ["כרמל שמש", "Verbal"]],
    email: "studio@brandforge.co.il", phone: "03-555-7700",
  },
  {
    key: "mediavault",
    name: "Mediavault",
    niche: "media-agency",
    nicheHe: "סוכנות מדיה",
    layout: "dashboard",
    tagline: "Media Intelligence",
    primary: "#2563EB",
    accent: "#38BDF8",
    bg: "#0B1220",
    surface: "#111827",
    text: "#E2E8F0",
    muted: "#94A3B8",
    dark: "#020617",
    font: "Heebo",
    display: "IBM Plex Sans Hebrew",
    darkTheme: true,
    heroTitle: "מדיה עם מוח: תקציב חכם, תוצאה ברורה.",
    heroSubtitle: "תכנון מדיה, רכישה ואופטימיזציה — דשבורד אחד לכל הערוצים.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=88",
    stats: [["₪62M", "מדיה מנוהלת"], ["22", "ערוצים"], ["1.9ש׳", "זמן לאופטימיזציה"], ["31%", "חיסכון ממוצע"]],
    services: [["Media Mix", "תמהיל ערוצים לפי יעד."], ["Programmatic", "רכישה חכמה בזמן אמת."], ["Retail Media", "מדפים דיגיטליים ומדידה."], ["Attribution", "מודלים שמסבירים מה עובד."]],
    cases: [["Retail Burst", "חיסכון 28% באותה חשיפה."], ["App UA", "CPA ירד ב-35% בשבועיים."], ["Brand Always-On", "נוכחות יציבה עם ROAS חיובי."]],
    team: [["עידו פרץ", "Media Director"], ["ליאת כהן", "Programmatic"], ["אלון ביטון", "Analytics"]],
    email: "ops@mediavault.co.il", phone: "03-555-8800",
  },
  {
    key: "summitops",
    name: "Summitops",
    niche: "consulting-agency",
    nicheHe: "סוכנות ייעוץ עסקי",
    layout: "rail",
    tagline: "Operating Clarity",
    primary: "#0F766E",
    accent: "#134E4A",
    bg: "#F0FDFA",
    surface: "#FFFFFF",
    text: "#134E4A",
    muted: "#5F7A76",
    dark: "#042F2E",
    font: "Heebo",
    display: "Manrope",
    heroTitle: "ייעוץ שמתרגם אסטרטגיה לפעולות בשטח.",
    heroSubtitle: "תהליכים, מדדים וצוותים — ליווי ניהולי שמזיז את הארגון קדימה.",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1553877522-432897b69856?auto=format&fit=crop&w=1400&q=88",
    stats: [["70+", "ארגונים"], ["5 חודשים", "ממוצע לליווי"], ["2.1x", "שיפור תפוקה"], ["18%", "צמצום עלויות"]],
    services: [["Ops Audit", "מיפוי צווארי בקבוק."], ["OKR System", "יעדים שמחוברים לביצוע."], ["Team Design", "מבנה ארגוני שעובד."], ["Exec Coaching", "ליווי מנהלים בקבלת החלטות."]],
    cases: [["Scale-up Ops", "זמן אספקה ירד ב-40%."], ["Board Ready", "תכנית צמיחה לדירקטוריון."], ["Unit Economics", "רווחיות יחידה חזרה לירוק."]],
    team: [["מיכל ארז", "Managing Partner"], ["יונתן שחר", "Ops Lead"], ["ספיר לוי", "Strategy"]],
    email: "hello@summitops.co.il", phone: "03-555-9900",
  },
  {
    key: "eventide",
    name: "Eventide",
    niche: "event-agency",
    nicheHe: "סוכנות אירועים",
    layout: "schedule",
    tagline: "Moments On Cue",
    primary: "#7C3AED",
    accent: "#C4B5FD",
    bg: "#0F0A1A",
    surface: "#1A1030",
    text: "#F5F3FF",
    muted: "#C4B5FD",
    dark: "#07040E",
    font: "Heebo",
    display: "Space Grotesk",
    darkTheme: true,
    heroTitle: "אירועים שמתוזמרים כמו הופעה חיה.",
    heroSubtitle: "השקות, כנסים וערב מותג — חוויה, לוגיסטיקה ותוכן באותו קצב.",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=88",
    aboutImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=88",
    stats: [["180+", "אירועים"], ["12K", "אורחים/שנה"], ["0", "פספוסי במה"], ["45 ימים", "ממוצע להפקה"]],
    services: [["Show Direction", "תסריט ערב וקצב במה."], ["Production", "ספקים, במה וטכני."], ["Guest Journey", "חוויית אורח מקצה לקצה."], ["Content Capture", "צילום ותוכן ליום שאחרי."]],
    cases: [["Product Night", "השקה ל-900 אורחים עם שידור חי."], ["Summit XL", "כנס דו-יומי עם 40 דוברים."], ["Brand Dinner", "ערב VIP אינטימי עם וואו."]],
    team: [["נועם הלוי", "Show Director"], ["רותם גבאי", "Production"], ["שי קדם", "Experience"]],
    email: "studio@eventide.co.il", phone: "03-555-1010",
  },
];

function pascal(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function write(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function fontImport(a) {
  const map = {
    Manrope: "family=Manrope:wght@500;600;700;800",
    Oswald: "family=Oswald:wght@500;600;700",
    "Space Grotesk": "family=Space+Grotesk:wght@500;600;700",
    "IBM Plex Sans Hebrew": "family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700",
    Sora: "family=Sora:wght@500;600;700;800",
    "Playfair Display": "family=Playfair+Display:wght@600;700;800",
    Syne: "family=Syne:wght@600;700;800",
  };
  return `${map[a.display] || map.Manrope}&family=Heebo:wght@400;500;600;700;800`;
}

function defaultData(a) {
  return `export const ${a.key}DefaultData = {
  templateId: "${a.key}",
  name: "${a.name}",
  brandName: "${a.name}",
  logoText: "${a.name.slice(0, 2).toUpperCase()}",
  tagline: "${a.tagline}",
  nicheLabel: "${a.nicheHe}",
  navHome: "בית",
  navAbout: "אודות",
  navServices: "שירותים",
  navCases: "פרויקטים",
  navTeam: "צוות",
  navInsights: "תובנות",
  navProcess: "תהליך",
  navContact: "צור קשר",
  heroEyebrow: "${a.nicheHe}",
  heroTitle: ${JSON.stringify(a.heroTitle)},
  heroSubtitle: ${JSON.stringify(a.heroSubtitle)},
  heroPrimaryButton: "שיחת היכרות",
  heroSecondaryButton: "לתיק עבודות",
  heroImage: "${a.heroImage}",
  aboutImage: "${a.aboutImage}",
  aboutEyebrow: "מי אנחנו",
  aboutTitle: ${JSON.stringify(`${a.name} — ${a.nicheHe} עם תהליך חד ותוצאות מדידות.`)},
  aboutText: ${JSON.stringify(`צוות ${a.nicheHe} שעובד צמוד ללקוח: אבחון, תכנון, ביצוע ומדידה — בלי רעש מיותר.`)},
  servicesEyebrow: "שירותים",
  servicesTitle: "מה אנחנו מביאים לשולחן.",
  serviceOneTitle: ${JSON.stringify(a.services[0][0])},
  serviceOneText: ${JSON.stringify(a.services[0][1])},
  serviceTwoTitle: ${JSON.stringify(a.services[1][0])},
  serviceTwoText: ${JSON.stringify(a.services[1][1])},
  serviceThreeTitle: ${JSON.stringify(a.services[2][0])},
  serviceThreeText: ${JSON.stringify(a.services[2][1])},
  serviceFourTitle: ${JSON.stringify(a.services[3][0])},
  serviceFourText: ${JSON.stringify(a.services[3][1])},
  casesEyebrow: "פרויקטים",
  casesTitle: "עבודות מהשטח.",
  caseOneTitle: ${JSON.stringify(a.cases[0][0])},
  caseOneText: ${JSON.stringify(a.cases[0][1])},
  caseTwoTitle: ${JSON.stringify(a.cases[1][0])},
  caseTwoText: ${JSON.stringify(a.cases[1][1])},
  caseThreeTitle: ${JSON.stringify(a.cases[2][0])},
  caseThreeText: ${JSON.stringify(a.cases[2][1])},
  teamEyebrow: "הצוות",
  teamTitle: "האנשים מאחורי התוצאות.",
  teamOneName: ${JSON.stringify(a.team[0][0])},
  teamOneRole: ${JSON.stringify(a.team[0][1])},
  teamTwoName: ${JSON.stringify(a.team[1][0])},
  teamTwoRole: ${JSON.stringify(a.team[1][1])},
  teamThreeName: ${JSON.stringify(a.team[2][0])},
  teamThreeRole: ${JSON.stringify(a.team[2][1])},
  insightsEyebrow: "תובנות",
  insightsTitle: "נקודות מבט מהשטח.",
  insightOneTitle: "איך בונים תוכנית רבעונית שעובדת",
  insightOneText: "מסגרת פשוטה לתעדוף מהלכים לפי השפעה.",
  insightTwoTitle: "סימנים מוקדמים שכדאי לתפוס",
  insightTwoText: "מה למדנו מקמפיינים ותהליכים שנכשלו.",
  insightThreeTitle: "מדדי הצלחה שסוכנות חייבת",
  insightThreeText: "KPI ברורים ללקוח, לצוות ולהנהלה.",
  processEyebrow: "תהליך",
  processTitle: "איך העבודה נראית בפועל.",
  processOneTitle: "אבחון",
  processOneText: "הבנת מצב, יעדים ואילוצים.",
  processTwoTitle: "תכנון",
  processTwoText: "מפת דרכים, תקציב ולוחות זמנים.",
  processThreeTitle: "ביצוע",
  processThreeText: "יישום מדורג עם שקיפות מלאה.",
  processFourTitle: "מדידה",
  processFourText: "דוחות, תובנות ושיפור מתמשך.",
  contactEyebrow: "צור קשר",
  contactTitle: "מוכנים לדבר על הצעד הבא?",
  contactText: "השאירו פרטים ונחזור עם מסלול ברור.",
  contactButton: "שליחת פנייה",
  phone: "${a.phone}",
  email: "${a.email}",
  address: "תל אביב, ישראל",
  footerText: "אתר מלא לסוכנות — 8 עמודים עם תנועה ואפקטים.",
  ctaTitle: "בואו נבנה את השלב הבא.",
  ctaText: "שיחת היכרות קצרה מספיקה כדי להבין התאמה.",
  ctaButton: "קבעו שיחה",
  marqueeOne: ${JSON.stringify(a.services[0][0])},
  marqueeTwo: ${JSON.stringify(a.services[1][0])},
  marqueeThree: ${JSON.stringify(a.services[2][0])},
  marqueeFour: ${JSON.stringify(a.services[3][0])},
  marqueeFive: ${JSON.stringify(a.nicheHe)},
  statOne: ${JSON.stringify(a.stats[0][0])},
  statOneLabel: ${JSON.stringify(a.stats[0][1])},
  statTwo: ${JSON.stringify(a.stats[1][0])},
  statTwoLabel: ${JSON.stringify(a.stats[1][1])},
  statThree: ${JSON.stringify(a.stats[2][0])},
  statThreeLabel: ${JSON.stringify(a.stats[2][1])},
  statFour: ${JSON.stringify(a.stats[3][0])},
  statFourLabel: ${JSON.stringify(a.stats[3][1])},
};
`;
}

function editorCss(a) {
  return `export const ${a.key}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?${fontImport(a)}&display=swap');
[data-template-id="${a.key}"], [data-template-id="${a.key}-preview"] {
  --p: ${a.primary};
  --accent: ${a.accent};
  --bg: ${a.bg};
  --surface: ${a.surface};
  --text: ${a.text};
  --muted: ${a.muted};
  --dark: ${a.dark};
  font-family: "Heebo", sans-serif;
  color: var(--text);
  background: var(--bg);
  text-align: right;
}
[data-template-id="${a.key}"] .text-center,
[data-template-id="${a.key}-preview"] .text-center { text-align: center; }
[data-template-id="${a.key}"] .ag-display,
[data-template-id="${a.key}-preview"] .ag-display {
  font-family: "${a.display}", "Heebo", sans-serif;
}
[data-template-id="${a.key}"] .ag-marquee,
[data-template-id="${a.key}-preview"] .ag-marquee {
  animation: ${a.key}Marquee 28s linear infinite;
  width: max-content;
}
[data-template-id="${a.key}"] .ag-float,
[data-template-id="${a.key}-preview"] .ag-float {
  animation: ${a.key}Float 7s ease-in-out infinite;
}
[data-template-id="${a.key}"] .ag-pulse,
[data-template-id="${a.key}-preview"] .ag-pulse {
  animation: ${a.key}Pulse 2.8s ease-in-out infinite;
}
[data-template-id="${a.key}"] .ag-card,
[data-template-id="${a.key}-preview"] .ag-card {
  transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease;
}
[data-template-id="${a.key}"] .ag-card:hover,
[data-template-id="${a.key}-preview"] .ag-card:hover {
  transform: translateY(-8px);
  border-color: var(--p);
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
[data-template-id="${a.key}"] .ag-ken,
[data-template-id="${a.key}-preview"] .ag-ken {
  animation: ${a.key}Ken 18s ease-in-out infinite alternate;
}
@keyframes ${a.key}Marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes ${a.key}Float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes ${a.key}Pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.0); transform: scale(1); }
  50% { box-shadow: 0 0 0 12px rgba(0,0,0,0.0); transform: scale(1.03); }
}
@keyframes ${a.key}Ken {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  [data-template-id="${a.key}"] .ag-marquee,
  [data-template-id="${a.key}-preview"] .ag-marquee,
  [data-template-id="${a.key}"] .ag-float,
  [data-template-id="${a.key}-preview"] .ag-float,
  [data-template-id="${a.key}"] .ag-ken,
  [data-template-id="${a.key}-preview"] .ag-ken,
  [data-template-id="${a.key}"] .ag-pulse,
  [data-template-id="${a.key}-preview"] .ag-pulse { animation: none; }
}
\`;
`;
}

/** Shared multipage shell + layout-specific home sections */
function pagesTsx(a) {
  const P = pascal(a.key);
  const isDark = !!a.darkTheme;
  const border = isDark ? "border-white/15" : "border-black/10";
  const headerBg = isDark ? "bg-[var(--dark)]/85 text-white" : "bg-[var(--surface)]/90 text-[var(--text)]";

  const heroByLayout = {
    cinematic: `
    <section data-template-section-type="hero" className="relative min-h-[92svh] overflow-hidden">
      <img src={getValue(data, "heroImage")} alt="" className="ag-ken absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
        <Reveal variant="up">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-5 max-w-5xl text-5xl font-extrabold leading-[0.95] md:text-7xl lg:text-8xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="ag-pulse bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-white/30 px-8 py-4 text-sm font-black text-white">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([v,l],i) => (
            <Reveal key={l} delayMs={i*80} variant="scale">
              <div className="ag-float border border-white/15 bg-white/10 p-5 backdrop-blur-xl text-center" style={{animationDelay:\`\${i*0.4}s\`}}>
                <p className="ag-display text-3xl font-extrabold text-[var(--accent)]">{v}</p>
                <p className="mt-2 text-xs font-bold text-white/70">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
    trust: `
    <section data-template-section-type="hero" className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="ag-pulse inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--p)] text-xl font-black text-[var(--p)]">✓</span>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-5 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("about")} className="border border-[var(--p)] px-8 py-4 text-sm font-black text-[var(--p)]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
      <Reveal delayMs={120} className="mx-auto mt-14 max-w-5xl overflow-hidden border ${border}">
        <img src={getValue(data, "heroImage")} alt="" className="aspect-[21/9] w-full object-cover" />
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-4">
        {stats.map(([v,l],i)=>(
          <Reveal key={l} delayMs={i*70} className="border ${border} bg-[var(--surface)] p-5 text-center">
            <p className="ag-display text-3xl font-extrabold text-[var(--p)]">{v}</p>
            <p className="mt-2 text-xs font-bold text-[var(--muted)]">{l}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
    leaderboard: `
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rotate-12 bg-[var(--p)]/30 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-5xl font-extrabold uppercase leading-[0.9] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-[var(--p)] px-8 py-4 text-sm font-black">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <div className="space-y-3">
            {stats.map(([v,l],i)=>(
              <div key={l} className="ag-card flex items-center justify-between border ${border} bg-[var(--surface)] px-5 py-4">
                <span className="text-sm font-bold text-[var(--muted)]">#{i+1} {l}</span>
                <span className="ag-display text-3xl font-extrabold text-[var(--accent)]">{v}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>`,
    kinetic: `
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 pb-10 pt-16 lg:px-8">
      <div className="ag-marquee flex gap-10 whitespace-nowrap py-3 text-6xl font-black uppercase opacity-20 md:text-8xl">
        {[0,1].flatMap(()=>[getValue(data,"brandName"), getValue(data,"tagline"), getValue(data,"nicheLabel")]).map((t,i)=>(
          <span key={i} className="ag-display mx-6">{t}</span>
        ))}
      </div>
      <div className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <Reveal variant="right">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-5xl font-extrabold leading-[0.92] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("cases")} className="border border-[var(--accent)] px-8 py-4 text-sm font-black text-[var(--accent)]">{getValue(data, "heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <Reveal variant="scale" delayMs={120}>
          <div className="relative overflow-hidden border ${border}">
            <img src={getValue(data, "heroImage")} alt="" className="ag-ken aspect-[16/11] w-full object-cover" />
            <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-2">
              {stats.slice(0,2).map(([v,l])=>(
                <div key={l} className="border border-white/20 bg-black/55 px-4 py-3 backdrop-blur text-center">
                  <p className="ag-display text-2xl font-extrabold text-[var(--accent)]">{v}</p>
                  <p className="text-[10px] font-bold text-white/70">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>`,
    mosaic: `
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" variant="right">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("team")} className="border border-[var(--p)] px-8 py-4 text-sm font-black text-[var(--p)]">הכירו את הצוות</button>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5" delayMs={100}>
          <div className="grid grid-cols-2 gap-3">
            <img src={getValue(data, "heroImage")} alt="" className="ag-float col-span-2 aspect-[16/10] object-cover border ${border}" />
            <img src={getValue(data, "aboutImage")} alt="" className="aspect-square object-cover border ${border}" />
            <div className="flex aspect-square flex-col justify-center border ${border} bg-[var(--p)] p-5 text-center text-white">
              <p className="ag-display text-4xl font-extrabold">{stats[0][0]}</p>
              <p className="mt-2 text-xs font-bold">{stats[0][1]}</p>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-3 sm:grid-cols-3">
        {stats.slice(1).map(([v,l],i)=>(
          <Reveal key={l} delayMs={i*80} className="border ${border} bg-[var(--surface)] p-5 text-center">
            <p className="ag-display text-3xl font-extrabold text-[var(--p)]">{v}</p>
            <p className="mt-2 text-xs font-bold text-[var(--muted)]">{l}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
    editorial: `
    <section data-template-section-type="hero" className="border-b ${border} px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b ${border} pb-6">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data, "heroEyebrow")} · Vol. 01</p>
            <p className="text-xs font-bold text-[var(--muted)]">{getValue(data, "tagline")}</p>
          </div>
          <h1 className="ag-display mt-8 max-w-4xl text-5xl font-bold leading-[1.05] md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <img src={getValue(data, "heroImage")} alt="" className="aspect-[16/10] w-full object-cover border ${border}" />
            <div className="flex flex-col justify-between border ${border} bg-[var(--surface)] p-7 text-right">
              <p className="text-lg leading-9 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
              <div className="mt-8 space-y-3">
                {stats.slice(0,3).map(([v,l])=>(
                  <div key={l} className="flex items-baseline justify-between border-t ${border} pt-3">
                    <span className="text-sm font-bold text-[var(--muted)]">{l}</span>
                    <span className="ag-display text-2xl font-bold text-[var(--p)]">{v}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => goTo("contact")} className="mt-8 bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>`,
    typeblocks: `
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-3 md:grid-cols-12">
            <div className="bg-[var(--dark)] p-8 text-white md:col-span-7 md:min-h-[420px] md:p-12">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
              <h1 className="ag-display mt-6 text-5xl font-extrabold leading-[0.95] md:text-7xl">{getValue(data, "heroTitle")}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/70">{getValue(data, "heroSubtitle")}</p>
              <button type="button" onClick={() => goTo("contact")} className="mt-8 bg-[var(--accent)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data, "heroPrimaryButton")}</button>
            </div>
            <div className="grid gap-3 md:col-span-5">
              <img src={getValue(data, "heroImage")} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="grid grid-cols-2 gap-3">
                {stats.slice(0,2).map(([v,l])=>(
                  <div key={l} className="bg-[var(--accent)] p-5 text-center text-[var(--dark)]">
                    <p className="ag-display text-3xl font-extrabold">{v}</p>
                    <p className="mt-1 text-xs font-bold">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>`,
    dashboard: `
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
            <h1 className="ag-display mt-3 max-w-3xl text-4xl font-extrabold md:text-6xl">{getValue(data, "heroTitle")}</h1>
          </div>
          <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-7 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-8" variant="scale">
            <div className="border ${border} bg-[var(--surface)] p-3">
              <img src={getValue(data, "heroImage")} alt="" className="aspect-[16/9] w-full object-cover opacity-90" />
              <p className="mt-3 px-2 text-sm leading-7 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
            </div>
          </Reveal>
          <div className="grid gap-3 lg:col-span-4">
            {stats.map(([v,l],i)=>(
              <Reveal key={l} delayMs={i*70} className="ag-card border ${border} bg-[var(--surface)] p-5 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">{l}</p>
                <p className="ag-display mt-2 text-4xl font-extrabold text-[var(--accent)]">{v}</p>
                <div className="mt-3 h-1.5 w-full bg-white/10"><span className="block h-full bg-[var(--p)]" style={{width: \`\${70-i*8}%\`}} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>`,
    rail: `
    <section data-template-section-type="hero" className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal variant="right" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mt-4 text-4xl font-extrabold leading-tight md:text-6xl">{getValue(data, "heroTitle")}</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo("contact")} className="bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
            <button type="button" onClick={() => goTo("process")} className="border border-[var(--p)] px-8 py-4 text-sm font-black text-[var(--p)]">לתהליך</button>
          </div>
        </Reveal>
        <div className="space-y-4">
          {stats.map(([v,l],i)=>(
            <Reveal key={l} delayMs={i*90} className="ag-card flex items-center gap-6 border ${border} bg-[var(--surface)] p-6">
              <span className="ag-display text-5xl font-extrabold text-[var(--p)]">0{i+1}</span>
              <div className="text-right">
                <p className="ag-display text-3xl font-extrabold">{v}</p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
    schedule: `
    <section data-template-section-type="hero" className="relative overflow-hidden px-5 py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--p)]/25 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{getValue(data, "heroEyebrow")}</p>
          <h1 className="ag-display mx-auto mt-5 max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">{getValue(data, "heroTitle")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <button type="button" onClick={() => goTo("contact")} className="ag-pulse mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "heroPrimaryButton")}</button>
        </Reveal>
        <Reveal delayMs={120} className="mt-12 overflow-hidden border ${border}">
          <img src={getValue(data, "heroImage")} alt="" className="ag-ken aspect-[21/8] w-full object-cover" />
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {stats.map(([v,l],i)=>(
            <Reveal key={l} delayMs={i*70} className="border ${border} bg-[var(--surface)] p-5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">Act 0{i+1}</p>
              <p className="ag-display mt-2 text-3xl font-extrabold">{v}</p>
              <p className="mt-1 text-xs font-bold text-[var(--muted)]">{l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
  };

  const servicesByLayout = {
    cinematic: `
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*90} variant="up">
              <article className="ag-card group relative min-h-[220px] overflow-hidden border ${border} bg-[var(--surface)] p-7 text-right">
                <span className="ag-display absolute -left-2 -top-4 text-8xl font-black text-[var(--p)]/15">0{i+1}</span>
                <h3 className="relative text-2xl font-bold">{title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    trust: `
        <div className="relative mt-14 space-y-6">
          <div className="absolute bottom-0 right-6 top-0 w-px bg-[var(--p)]/40" />
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*100} variant="left">
              <article className="relative mr-12 border ${border} bg-[var(--surface)] p-6 text-right">
                <span className="absolute -right-12 top-6 grid h-10 w-10 place-items-center rounded-full bg-[var(--p)] text-sm font-black text-white">{i+1}</span>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    leaderboard: `
        <div className="mt-12 space-y-3">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className="ag-card grid gap-4 border ${border} bg-[var(--surface)] p-5 md:grid-cols-[80px_1fr_auto] md:items-center">
                <span className="ag-display text-4xl font-extrabold text-[var(--accent)]">0{i+1}</span>
                <div className="text-right"><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div>
                <button type="button" onClick={() => goTo("contact")} className="border border-[var(--p)] px-4 py-2 text-xs font-black text-[var(--p)]">GO</button>
              </article>
            </Reveal>
          ))}
        </div>`,
    kinetic: `
        <div className="mt-12 flex gap-4 overflow-x-auto pb-4">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*90} className="min-w-[280px] shrink-0">
              <article className="ag-card flex aspect-square flex-col justify-between border ${border} bg-[var(--surface)] p-7 text-right">
                <span className="ag-display text-5xl font-extrabold text-[var(--p)]">0{i+1}</span>
                <div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p></div>
              </article>
            </Reveal>
          ))}
        </div>`,
    mosaic: `
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80} variant="scale">
              <article className={\`ag-card border ${border} bg-[var(--surface)] p-6 text-right \${i%2===0?"lg:translate-y-6":""}\`}>
                <div className="mb-4 h-2 w-12 bg-[var(--p)]" />
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    editorial: `
        <div className="mt-12 grid gap-0 border ${border} md:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*70}>
              <article className={\`border-b ${border} p-7 text-right md:border-l \${i<2?"md:border-b":"md:border-b-0"}\`}>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--p)]">Column 0{i+1}</p>
                <h3 className="ag-display mt-3 text-3xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-8 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    typeblocks: `
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className={\`ag-card min-h-[200px] p-8 text-right \${i%2===0?"bg-[var(--dark)] text-white":"bg-[var(--accent)] text-[var(--dark)]"}\`}>
                <h3 className="ag-display text-3xl font-extrabold">{title}</h3>
                <p className="mt-4 text-sm leading-7 opacity-80">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    dashboard: `
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className="ag-card border ${border} bg-[var(--surface)] p-6 text-right">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--accent)]">MODULE 0{i+1}</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--p)]" />
                </div>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    rail: `
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*90} variant="up">
              <article className="ag-card border-r-4 border-r-[var(--p)] border ${border} bg-[var(--surface)] p-7 text-right">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>`,
    schedule: `
        <div className="mt-12 space-y-3">
          {services.map(([title,text],i)=>(
            <Reveal key={title} delayMs={i*80}>
              <article className="ag-card grid gap-4 border ${border} bg-[var(--surface)] p-5 md:grid-cols-[120px_1fr] md:items-center">
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">Slot</p>
                  <p className="ag-display text-3xl font-extrabold text-[var(--p)]">0{i+1}:00</p>
                </div>
                <div className="text-right"><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div>
              </article>
            </Reveal>
          ))}
        </div>`,
  };

  const hero = heroByLayout[a.layout] || heroByLayout.cinematic;
  const servicesGrid = servicesByLayout[a.layout] || servicesByLayout.cinematic;

  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { Reveal } from "../shared/Reveal";
import { ${a.key}DefaultData } from "./defaultData";
import { ${a.key}EditorCss } from "./editorCss";

export const ${a.key}Pages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "cases", label: "פרויקטים", slug: "/cases" },
  { id: "team", label: "צוות", slug: "/team" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "process", label: "תהליך", slug: "/process" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const allowedPages = ${a.key}Pages.map((p) => p.id);

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
  return data?.[key] ?? (${a.key}DefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
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
    <header data-visual-flow-lock="true" data-template-section-type="header" className={\`sticky top-0 z-50 border-b ${border} ${headerBg} backdrop-blur-xl\`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="text-right">
          <div className="flex items-center gap-3">
            <span className="ag-pulse grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-black text-white">{getValue(data, "logoText")}</span>
            <div>
              <p className="ag-display text-xl font-extrabold leading-none">{getValue(data, "brandName")}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{getValue(data, "tagline")}</p>
            </div>
          </div>
        </button>
        <nav className="hidden items-center gap-4 lg:flex">
          {nav.map(([id, label]) => (
            <button key={id} type="button" onClick={() => goTo(id)} className={\`text-xs font-bold uppercase tracking-[0.12em] transition \${currentPage === id ? "text-[var(--p)]" : "opacity-70 hover:opacity-100"}\`}>{label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo("contact")} className="hidden bg-[var(--p)] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white md:inline-flex">{getValue(data, "heroPrimaryButton")}</button>
          <button type="button" className={\`grid h-11 w-11 place-items-center border ${border} lg:hidden\`} onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
        </div>
      </div>
      {open ? (
        <div className={\`border-t ${border} px-5 py-4 lg:hidden\`}>
          <div className="grid gap-2">
            {nav.map(([id, label]) => (
              <button key={id} type="button" onClick={() => { goTo(id); setOpen(false); }} className="py-2 text-right text-sm font-bold">{label}</button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Marquee({ data }: { data: Record<string, any> }) {
  const items = [getValue(data,"marqueeOne"), getValue(data,"marqueeTwo"), getValue(data,"marqueeThree"), getValue(data,"marqueeFour"), getValue(data,"marqueeFive")];
  const loop = [...items, ...items, ...items];
  return (
    <section className="overflow-hidden border-y ${border} bg-[var(--p)] py-4 text-white">
      <div className="ag-marquee flex items-center gap-8 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={\`\${item}-\${i}\`} className="ag-display text-2xl font-extrabold uppercase md:text-4xl">
            {item}<span className="mx-6 inline-block h-2 w-2 bg-white/80" />
          </span>
        ))}
      </div>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <Reveal variant="scale"><img src={getValue(data, "aboutImage")} alt="" className={\`aspect-[4/3] w-full object-cover border ${border}\`} /></Reveal>
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "aboutEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold leading-tight md:text-5xl">{getValue(data, "aboutTitle")}</h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)]">{getValue(data, "aboutText")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Services({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const services = [
    [getValue(data, "serviceOneTitle"), getValue(data, "serviceOneText")],
    [getValue(data, "serviceTwoTitle"), getValue(data, "serviceTwoText")],
    [getValue(data, "serviceThreeTitle"), getValue(data, "serviceThreeText")],
    [getValue(data, "serviceFourTitle"), getValue(data, "serviceFourText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "servicesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "servicesTitle")}</h2>
        </Reveal>
        ${servicesGrid}
      </div>
    </section>
  );
}

function Cases({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "caseOneTitle"), getValue(data, "caseOneText")],
    [getValue(data, "caseTwoTitle"), getValue(data, "caseTwoText")],
    [getValue(data, "caseThreeTitle"), getValue(data, "caseThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "casesEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "casesTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} variant="up">
              <article className={\`ag-card min-h-[260px] border ${border} bg-[var(--surface)] p-7 text-right\`}>
                <p className="ag-display text-6xl font-extrabold text-[var(--p)]/25">0{i + 1}</p>
                <h3 className="mt-2 text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ data }: { data: Record<string, any> }) {
  const items = [
    [getValue(data, "teamOneName"), getValue(data, "teamOneRole")],
    [getValue(data, "teamTwoName"), getValue(data, "teamTwoRole")],
    [getValue(data, "teamThreeName"), getValue(data, "teamThreeRole")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "teamEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "teamTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([name, role], i) => (
            <Reveal key={name} delayMs={i * 90} variant="scale">
              <article className={\`ag-card border ${border} bg-[var(--bg)] p-8 text-center\`}>
                <div className="ag-float mx-auto grid h-24 w-24 place-items-center bg-[var(--p)] text-3xl font-black text-white" style={{ animationDelay: \`\${i * 0.35}s\` }}>{String(name).slice(0, 1)}</div>
                <h3 className="mt-5 text-xl font-bold">{name}</h3>
                <p className="mt-2 text-sm font-semibold text-[var(--muted)]">{role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const items = [
    [getValue(data, "insightOneTitle"), getValue(data, "insightOneText")],
    [getValue(data, "insightTwoTitle"), getValue(data, "insightTwoText")],
    [getValue(data, "insightThreeTitle"), getValue(data, "insightThreeText")],
  ];
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "insightsEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "insightsTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90}>
              <article className={\`ag-card border ${border} bg-[var(--surface)] p-7 text-right\`}>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
                <button type="button" onClick={() => goTo("contact")} className="mt-5 text-sm font-black text-[var(--p)]">קראו עוד ←</button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    [getValue(data, "processOneTitle"), getValue(data, "processOneText")],
    [getValue(data, "processTwoTitle"), getValue(data, "processTwoText")],
    [getValue(data, "processThreeTitle"), getValue(data, "processThreeText")],
    [getValue(data, "processFourTitle"), getValue(data, "processFourText")],
  ];
  return (
    <section className="bg-[var(--surface)] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "processEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "processTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} variant="up">
              <article className={\`ag-card border ${border} bg-[var(--bg)] p-6 text-right\`}>
                <p className="text-sm font-black text-[var(--p)]">שלב 0{i + 1}</p>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data }: { data: Record<string, any> }) {
  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className={\`mx-auto grid max-w-7xl gap-8 border ${border} bg-[var(--surface)] p-6 md:p-10 lg:grid-cols-2\`}>
        <Reveal variant="right" className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "contactEyebrow")}</p>
          <h2 className="ag-display mt-4 text-3xl font-extrabold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-2 text-sm font-bold">
            <p>{getValue(data, "phone")}</p>
            <p>{getValue(data, "email")}</p>
            <p>{getValue(data, "address")}</p>
          </div>
        </Reveal>
        <Reveal variant="left" delayMs={100}>
          <form className="grid gap-3">
            <input className={\`border ${border} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="שם מלא" />
            <input className={\`border ${border} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="טלפון" />
            <input className={\`border ${border} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="חברה / תחום" />
            <textarea className={\`min-h-32 border ${border} bg-[var(--bg)] px-4 py-4 text-right outline-none\`} placeholder="במה נוכל לעזור?" />
            <button type="button" className="bg-[var(--p)] px-6 py-4 text-sm font-black text-white">{getValue(data, "contactButton")}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const links = ${a.key}Pages.filter((p) => p.id !== "home");
  return (
    <footer className="bg-[var(--dark)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <Reveal>
          <p className="ag-display text-4xl font-extrabold md:text-6xl">{getValue(data, "brandName")}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-bold md:text-4xl">{getValue(data, "ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">{getValue(data, "ctaText")}</p>
          <button type="button" onClick={() => goTo("contact")} className="ag-pulse mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data, "ctaButton")}</button>
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((p) => (
            <button key={p.id} type="button" onClick={() => goTo(p.id)} className="border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">{p.label}</button>
          ))}
        </div>
        <p className="mt-10 text-xs text-white/50">© {new Date().getFullYear()} {getValue(data, "brandName")} · {getValue(data, "footerText")}</p>
      </div>
    </footer>
  );
}

function PageHero({ data, title }: { data: Record<string, any>; title: string }) {
  return (
    <section className={\`border-b ${border} px-5 py-14 lg:px-8 lg:py-20\`}>
      <Reveal className="mx-auto max-w-7xl text-right">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data, "brandName")} · {getValue(data, "nicheLabel")}</p>
        <h1 className="ag-display mt-4 text-4xl font-extrabold md:text-6xl">{title}</h1>
      </Reveal>
    </section>
  );
}

function Hero({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  const stats = [
    [getValue(data, "statOne"), getValue(data, "statOneLabel")],
    [getValue(data, "statTwo"), getValue(data, "statTwoLabel")],
    [getValue(data, "statThree"), getValue(data, "statThreeLabel")],
    [getValue(data, "statFour"), getValue(data, "statFourLabel")],
  ];
  return (<>${hero}</>);
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      <Hero data={data} goTo={goTo} />
      <Marquee data={data} />
      <About data={data} />
      <Services data={data} goTo={goTo} />
      <Cases data={data} />
      <Team data={data} />
      <Insights data={data} goTo={goTo} />
      <Process data={data} />
      <Contact data={data} />
      <Footer data={data} goTo={goTo} />
    </>
  );
}

function InnerPage({ data, type, goTo }: { data: Record<string, any>; type: string; goTo: (id: string) => void }) {
  const titles: Record<string, string> = {
    about: getValue(data, "navAbout"),
    services: getValue(data, "navServices"),
    cases: getValue(data, "navCases"),
    team: getValue(data, "navTeam"),
    insights: getValue(data, "navInsights"),
    process: getValue(data, "navProcess"),
    contact: getValue(data, "navContact"),
  };
  const map: Record<string, React.ReactNode> = {
    about: (<><About data={data} /><Team data={data} /></>),
    services: (<><Services data={data} goTo={goTo} /><Process data={data} /></>),
    cases: (<><Cases data={data} /><Marquee data={data} /></>),
    team: (<><Team data={data} /><About data={data} /></>),
    insights: (<><Insights data={data} goTo={goTo} /><Cases data={data} /></>),
    process: (<><Process data={data} /><Services data={data} goTo={goTo} /></>),
    contact: (<><Contact data={data} /></>),
  };
  return (
    <>
      <PageHero data={data} title={titles[type] || getValue(data, "brandName")} />
      {map[type] ?? null}
      <Footer data={data} goTo={goTo} />
    </>
  );
}

export default function ${P}Pages({
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
  const mergedData = useMemo(() => ({ ...${a.key}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );
  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${a.key}-preview" : "${a.key}"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ${a.key}EditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[
          { id: "home", content: <HomePage data={mergedData} goTo={goTo} /> },
          ...${a.key}Pages.filter((p) => p.id !== "home").map((p) => ({
            id: p.id,
            content: <InnerPage data={mergedData} type={p.id} goTo={goTo} />,
          })),
        ]}
      />
    </div>
  );
}
`;
}

function metaTs(a) {
  const P = pascal(a.key);
  return `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${a.key}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${a.key}EditorCss } from "./editorCss";
import { ${a.key}Schema } from "./schema";
import { ${a.key}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${a.primary}",
  secondary: "${a.dark}",
  accent: "${a.accent}",
  background: "${a.bg}",
  surface: "${a.surface}",
  text: "${a.text}",
  muted: "${a.muted}",
  dark: "${a.dark}",
};

export const ${a.key}Seed = {
  id: "${a.key}",
  key: "${a.key}",
  name: "${a.name}",
  title: "${a.name}",
  description: "אתר מלא ל${a.nicheHe}: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "${a.niche}",
  layout: "full",
  image: (${a.key}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${a.key}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${a.key}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "${a.key}-header", title: "Header" },
    { type: "hero", variant: "${a.key}-hero", title: "Hero" },
    { type: "services", variant: "${a.key}-services", title: "Services" },
    { type: "cases", variant: "${a.key}-cases", title: "Cases" },
    { type: "team", variant: "${a.key}-team", title: "Team" },
    { type: "contact", variant: "${a.key}-contact", title: "Contact" },
    { type: "footer", variant: "${a.key}-footer", title: "Footer" },
  ].map((block, index) => ({ id: \`${a.key}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${a.key}Pages,
  editor: { pages: ${a.key}Pages, css: ${a.key}EditorCss },
  css: ${a.key}EditorCss,
  data: ${a.key}DefaultData,
  defaultData: ${a.key}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${a.key}Template = {
  id: "${a.key}",
  key: "${a.key}",
  name: "${a.name}",
  title: "${a.name}",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא ל${a.nicheHe} עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(${P}Thumbnail),
  preview: React.createElement(${P}Preview),
  component: ${P}Pages,
  Component: ${P}Pages,
  seed: ${a.key}Seed,
  pages: ${a.key}Pages,
  editorCss: ${a.key}EditorCss,
  schema: ${a.key}Schema,
  defaultData: ${a.key}DefaultData,
  renderer: {
    key: "${a.key}",
    name: "${a.name}",
    Component: ${P}Pages,
    component: ${P}Pages,
    pages: ${a.key}Pages,
    editorMode: "visual-react",
    editorCss: ${a.key}EditorCss,
    schema: ${a.key}Schema,
    defaultData: ${a.key}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${a.key}Template;
`;
}

function schemaTs(a) {
  return `export const ${a.key}Schema = {
  templateId: "${a.key}",
  name: "${a.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "תת-כותרת", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "servicesTitle", label: "כותרת שירותים", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
`;
}

function previewTsx(a) {
  const P = pascal(a.key);
  return `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${a.key}-preview" className="min-h-screen w-full overflow-x-hidden">
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function thumbnailTsx(a) {
  return `import React from "react";

export default function ${pascal(a.key)}Thumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "${a.bg}", color: "${a.text}", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "${a.primary}" }}>${a.nicheHe}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">${a.name}</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">${a.tagline}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-2 py-4 text-center text-[11px] font-black text-white" style={{ background: "${a.primary}" }}>${a.stats[0][0]}</div>
        <div className="border px-2 py-4 text-center text-[11px] font-bold" style={{ borderColor: "${a.primary}66" }}>${a.layout}</div>
      </div>
    </div>
  );
}
`;
}

for (const a of agencies) {
  const dir = path.join(templatesDir, a.key);
  write(path.join(dir, "defaultData.ts"), defaultData(a));
  write(path.join(dir, "editorCss.ts"), editorCss(a));
  write(path.join(dir, "pages.tsx"), pagesTsx(a));
  write(path.join(dir, "meta.ts"), metaTs(a));
  write(path.join(dir, "schema.ts"), schemaTs(a));
  write(path.join(dir, "preview.tsx"), previewTsx(a));
  write(path.join(dir, "thumbnail.tsx"), thumbnailTsx(a));
  console.log("wow", a.key, a.layout);
}
console.log("done", agencies.length);
