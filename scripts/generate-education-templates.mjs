#!/usr/bin/env node
/**
 * Generates 10 unique education / courses website templates.
 * Run: node scripts/generate-education-templates.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  {
    id: "lectora",
    name: "Lectora",
    logo: "L",
    niche: "online-courses",
    badge: "חדש",
    tagline: "קורסים אונליין",
    description: "פלטפורמת קורסים קולנועית: הירו מלא, מארקי של קורסים, סילבוס ממוספר ומנטורים.",
    fonts: { display: "Syne:wght@600;700;800", body: "DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700", displayCss: '"Syne"', bodyCss: '"DM Sans"' },
    palette: { primary: "#0D9488", secondary: "#041F1E", accent: "#F97316", background: "#041F1E", surface: "#0A2F2D", text: "#ECFDF5", muted: "#99F6E4", dark: "#021412" },
    heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
    style: "cinemaTeal",
    copy: {
      heroTitle: "Lectora\nלומדים כמו בסרט.",
      heroSubtitle: "קורסים אונליין עם קצב קולנועי — שיעורים חדים, מנטורים חיים, ותוצאות שרואים על המסך.",
      heroPrimary: "התחילו ללמוד",
      heroSecondary: "לקורסים",
      s2: "קורסים שרצים עכשיו",
      s3: "סילבוס ממוספר",
      s4: "המנחים על הסט",
      s5: "תוצאות שבוגרינו משיגים",
      s6: "סטודנטים מספרים",
      s7: "שאלות נפוצות",
      s8: "הרשמה לקורס",
      cta: "הסצנה הבאה שלכם מתחילה כאן.",
      phone: "03-700-1100",
      email: "hello@lectora.co.il",
      address: "רוטשילד 45, תל אביב",
      items: [
        ["בימוי דיגיטלי", "סיפור, צילום ועריכה לקריירה יצירתית."],
        ["מסחר אונליין", "בניית חנות, תנועה והמרות."],
        ["AI ליוצרים", "כלים חכמים לעבודה יומיומית."],
      ],
    },
  },
  {
    id: "mentora",
    name: "Mentora",
    logo: "M",
    niche: "mentorship",
    badge: "Premium",
    tagline: "מנטורשיפ אישי",
    description: "אתר מנטורשיפ: הירו מפוצל דביק, מסלולי ליווי, תהליך מעגלי ומנטורים.",
    fonts: { display: "Fraunces:opsz,wght@9..144,600;9..144,700", body: "Source+Sans+3:wght@400;500;600;700", displayCss: '"Fraunces"', bodyCss: '"Source Sans 3"' },
    palette: { primary: "#F59E0B", secondary: "#111827", accent: "#FBBF24", background: "#0F172A", surface: "#1E293B", text: "#F8FAFC", muted: "#94A3B8", dark: "#020617" },
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=85",
    style: "inkAmber",
    copy: {
      heroTitle: "Mentora\nליווי שמשנה מסלול.",
      heroSubtitle: "מנטורשיפ אחד־על־אחד לקריירה, עסק וצמיחה אישית — עם מפת דרכים ברורה.",
      heroPrimary: "שיחת התאמה",
      heroSecondary: "למסלולים",
      s2: "מסלולי מנטורשיפ",
      s3: "איך זה עובד",
      s4: "המנטורים שלנו",
      s5: "מספרים מהשטח",
      s6: "מנטים מספרים",
      s7: "שאלות נפוצות",
      s8: "בקשת ליווי",
      cta: "הצעד הבא מתחיל בשיחה אחת.",
      phone: "03-700-2200",
      email: "guide@mentora.co.il",
      address: "הרצל 12, תל אביב",
      items: [
        ["קריירה מקצועית", "מיצוב, ראיונות וקידום."],
        ["יזמות", "מאידאה למוצר ולשוק."],
        ["מנהיגות", "ניהול צוותים והחלטות."],
      ],
    },
  },
  {
    id: "polyglota",
    name: "Polyglota",
    logo: "P",
    niche: "language-school",
    badge: "חדש",
    tagline: "בית ספר לשפות",
    description: "בית ספר לשפות: הירו ממורכז, מארקי שפות, מסלול זיגזג ומורים.",
    fonts: { display: "Sora:wght@600;700;800", body: "Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700", displayCss: '"Sora"', bodyCss: '"Nunito Sans"' },
    palette: { primary: "#0284C7", secondary: "#F0F9FF", accent: "#38BDF8", background: "#F0F9FF", surface: "#FFFFFF", text: "#0C4A6E", muted: "#64748B", dark: "#082F49" },
    heroImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=85",
    style: "skyBlue",
    copy: {
      heroTitle: "Polyglota\nשפה חדשה. עולם חדש.",
      heroSubtitle: "אנגלית, ספרדית, ערבית ועוד — שיעורים חיים, תרגול יומי, וביטחון לדבר.",
      heroPrimary: "בחרו שפה",
      heroSecondary: "למסלולים",
      s2: "השפות שלנו",
      s3: "מסלול הלמידה",
      s4: "המורים",
      s5: "למה Polyglota",
      s6: "תלמידים מספרים",
      s7: "שאלות נפוצות",
      s8: "הרשמה לקורס שפה",
      cta: "המשפט הראשון שלכם מחכה.",
      phone: "03-700-3300",
      email: "hola@polyglota.co.il",
      address: "דיזנגוף 99, תל אביב",
      items: [
        ["אנגלית עסקית", "שיחות, מצגות ומיילים."],
        ["ספרדית לטיול", "שיחה יומיומית בביטחון."],
        ["ערבית מדוברת", "הבנה ודיבור מהשטח."],
      ],
    },
  },
  {
    id: "codehaus",
    name: "Codehaus",
    logo: "C",
    niche: "coding-bootcamp",
    badge: "Premium",
    tagline: "בוטקמפ תכנות",
    description: "בוטקמפ תכנות בסגנון טרמינל: הירו עם שורות מוקלדות, קורסי קוד וטיימליין.",
    fonts: { display: "JetBrains+Mono:wght@500;600;700", body: "IBM+Plex+Sans:wght@400;500;600;700", displayCss: '"JetBrains Mono"', bodyCss: '"IBM Plex Sans"' },
    palette: { primary: "#22C55E", secondary: "#020617", accent: "#4ADE80", background: "#020617", surface: "#0F172A", text: "#E2E8F0", muted: "#64748B", dark: "#000000" },
    heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=85",
    style: "terminalGreen",
    copy: {
      heroTitle: "Codehaus\n> learn. ship. repeat.",
      heroSubtitle: "בוטקמפ מעשי לפולסטאק — פרויקטים אמיתיים, מנטורים מהתעשייה, ופורטפוליו שמגייס.",
      heroPrimary: "הגשת מועמדות",
      heroSecondary: "לסילבוס",
      s2: "מסלולי קוד",
      s3: "טיימליין קומיטים",
      s4: "הקונטריביוטורים",
      s5: "סטטיסטיקות ASCII",
      s6: "Pull Requests מהבוגרים",
      s7: "FAQ בקונסול",
      s8: "open application.js",
      cta: "git commit -m \"career upgrade\"",
      phone: "03-700-4400",
      email: "root@codehaus.co.il",
      address: "תל אביב · לימוד מרחוק",
      items: [
        ["Fullstack JS", "React, Node ופריסה."],
        ["Python Data", "ניתוח נתונים ומודלים."],
        ["DevOps Basics", "CI/CD, Docker וענן."],
      ],
    },
  },
  {
    id: "noteline",
    name: "Noteline",
    logo: "N",
    niche: "music-school",
    badge: "חדש",
    tagline: "בית ספר למוזיקה",
    description: "בית ספר למוזיקה: הירו עם גלי קול, טרקליסט קורסים וקו מנחים על הבמה.",
    fonts: { display: "Outfit:wght@500;600;700;800", body: "Space+Grotesk:wght@400;500;600;700", displayCss: '"Outfit"', bodyCss: '"Space Grotesk"' },
    palette: { primary: "#C2410C", secondary: "#1C1917", accent: "#EA580C", background: "#1C1917", surface: "#292524", text: "#FAFAF9", muted: "#A8A29E", dark: "#0C0A09" },
    heroImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=85",
    style: "copperCharcoal",
    copy: {
      heroTitle: "Noteline\nהמוזיקה שלכם, בנפח מלא.",
      heroSubtitle: "שיעורי גיטרה, פסנתר, שירה והפקה — מהתו הראשון ועד הבמה.",
      heroPrimary: "קביעת אודישן",
      heroSecondary: "לטראקים",
      s2: "טרקליסט הקורסים",
      s3: "תווים ומסלול",
      s4: "הליינאפ על הבמה",
      s5: "ווייב בגלים",
      s6: "מילים מהתלמידים",
      s7: "שאלות בתווים",
      s8: "הזמנת אודישן",
      cta: "הסט הבא שלכם מתחיל כאן.",
      phone: "03-700-5500",
      email: "play@noteline.co.il",
      address: "אלנבי 120, תל אביב",
      items: [
        ["גיטרה חשמלית", "ריפים, טכניקה ובמה."],
        ["פסנתר קלאסי", "טכניקה, האזנה וביטוי."],
        ["הפקת מוזיקה", "DAW, מיקס וסידור."],
      ],
    },
  },
  {
    id: "kidwise",
    name: "Kidwise",
    logo: "K",
    niche: "kids-education",
    badge: "חדש",
    tagline: "חינוך לילדים",
    description: "חינוך לילדים: הירו שובב עם צורות רכות, מסלול צבעוני ומורים חברותיים.",
    fonts: { display: "Fredoka:wght@500;600;700", body: "Nunito:wght@400;600;700;800", displayCss: '"Fredoka"', bodyCss: '"Nunito"' },
    palette: { primary: "#10B981", secondary: "#ECFDF5", accent: "#FBBF24", background: "#ECFDF5", surface: "#FFFFFF", text: "#064E3B", muted: "#6B7280", dark: "#022C22" },
    heroImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1400&q=85",
    style: "mintSunshine",
    copy: {
      heroTitle: "Kidwise\nלמידה שמרגישה כמו משחק.",
      heroSubtitle: "חוגים, העשרה וכישורי חיים לילדים — עם הנאה, ביטחון וסקרנות.",
      heroPrimary: "להורים — התחילו כאן",
      heroSecondary: "לפעילויות",
      s2: "מסלולים צבעוניים",
      s3: "הרפתקת הלמידה",
      s4: "המורים החברותיים",
      s5: "רגעים שמקפצים",
      s6: "הורים מספרים",
      s7: "שאלות גדולות",
      s8: "טופס להורים",
      cta: "בואו נגלה יחד מה הילד אוהב.",
      phone: "03-700-6600",
      email: "hello@kidwise.co.il",
      address: "רמת גן · סניפים בארץ",
      items: [
        ["מדע קטן", "ניסויים וסקרנות."],
        ["יצירה וצבע", "סטודיו לילדים."],
        ["אנגלית בכיף", "שירים, משחקים ושיחה."],
      ],
    },
  },
  {
    id: "craftora",
    name: "Craftora",
    logo: "C",
    niche: "art-workshops",
    badge: "Premium",
    tagline: "סדנאות אמנות",
    description: "סדנאות אמנות: הירו קולאז׳ עיתונאי, רשימת סדנאות אסימטרית ואטלייה.",
    fonts: { display: "Bitter:wght@500;600;700", body: "Karla:wght@400;500;600;700", displayCss: '"Bitter"', bodyCss: '"Karla"' },
    palette: { primary: "#4D7C0F", secondary: "#F5F5F4", accent: "#78716C", background: "#F5F5F4", surface: "#FFFFFF", text: "#1C1917", muted: "#78716C", dark: "#292524" },
    heroImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=85",
    style: "stoneOlive",
    copy: {
      heroTitle: "Craftora\nידיים שעובדות. רעיונות שנושמים.",
      heroSubtitle: "סדנאות קרמיקה, ציור, הדפס ועיצוב — באטלייה שקטה עם חומרים אמיתיים.",
      heroPrimary: "להרשמה לסדנה",
      heroSecondary: "ללוח זמנים",
      s2: "הסדנאות",
      s3: "שלבי האטלייה",
      s4: "האמנים",
      s5: "הסטודיו במספרים",
      s6: "ציטוטים מהשולחן",
      s7: "שאלות ממוספרות",
      s8: "שעות הסטודיו",
      cta: "בואו ליצור משהו שנשאר.",
      phone: "03-700-7700",
      email: "studio@craftora.co.il",
      address: "יפו 18, תל אביב",
      items: [
        ["קרמיקה", "גלגל, עיצוב ושריפה."],
        ["ציור בשמן", "אור, שכבות וטכניקה."],
        ["הדפס רשת", "פוסטרים וטקסטיל."],
      ],
    },
  },
  {
    id: "skillforge",
    name: "Skillforge",
    logo: "S",
    niche: "career-skills",
    badge: "חדש",
    tagline: "כישורי קריירה",
    description: "כישורי קריירה בסגנון תעשייתי: טיפוגרפיה נועזת, לוחות מתכת ותהליך חישול.",
    fonts: { display: "Oswald:wght@500;600;700", body: "Barlow:wght@400;500;600;700", displayCss: '"Oswald"', bodyCss: '"Barlow"' },
    palette: { primary: "#A3E635", secondary: "#18181B", accent: "#84CC16", background: "#18181B", surface: "#27272A", text: "#FAFAFA", muted: "#A1A1AA", dark: "#09090B" },
    heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85",
    style: "steelLime",
    copy: {
      heroTitle: "Skillforge\nכישורים שנבנים בחום.",
      heroSubtitle: "הכשרות קריירה פרקטיות — מכירות, ניהול, דאטה ותקשורת — בלי מילים ריקות.",
      heroPrimary: "הגשת מועמדות",
      heroSecondary: "לכישורים",
      s2: "לוחות כישורים",
      s3: "תהליך החישול",
      s4: "המאמנים",
      s5: "לוח LED",
      s6: "טיקר בוגרים",
      s7: "FAQ עם מסמרות",
      s8: "טופס הגשה",
      cta: "הכישרון שלכם מחכה לחישול.",
      phone: "03-700-8800",
      email: "forge@skillforge.co.il",
      address: "פתח תקווה · היברידי",
      items: [
        ["מכירות B2B", "סקריפטים וסגירה."],
        ["ניהול צוות", "שגרות, KPI ואחריות."],
        ["אנליטיקה", "דאטה להחלטות."],
      ],
    },
  },
  {
    id: "campusly",
    name: "Campusly",
    logo: "C",
    niche: "academic-tutoring",
    badge: "חדש",
    tagline: "שיעורים פרטיים",
    description: "שיעורים פרטיים אקדמיים: הירו ספרייה, טבלת מקצועות ולוח סמסטר.",
    fonts: { display: "Literata:opsz,wght@7..72,600;7..72,700", body: "Source+Sans+3:wght@400;500;600;700", displayCss: '"Literata"', bodyCss: '"Source Sans 3"' },
    palette: { primary: "#1D4ED8", secondary: "#EFF6FF", accent: "#3B82F6", background: "#EFF6FF", surface: "#FFFFFF", text: "#1E3A8A", muted: "#64748B", dark: "#1E3A8A" },
    heroImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=85",
    style: "campusBlue",
    copy: {
      heroTitle: "Campusly\nציונים שעולים. ביטחון שנשאר.",
      heroSubtitle: "שיעורים פרטיים לבגרות, אקדמיה ופסיכומטרי — עם מרצים שמדברים בגובה העיניים.",
      heroPrimary: "תיאום אבחון",
      heroSecondary: "למקצועות",
      s2: "טבלת מקצועות",
      s3: "לוח סמסטר",
      s4: "סגל המרצים",
      s5: "ממוצע GPA",
      s6: "ציטוטים מגזין",
      s7: "שאלות הקמפוס",
      s8: "טופס הרשמה",
      cta: "הסמסטר הבא יכול להיראות אחרת.",
      phone: "03-700-9900",
      email: "study@campusly.co.il",
      address: "רחובות · זום ארצי",
      items: [
        ["מתמטיקה", "5 יח׳ עד קורסי בסיס."],
        ["אנגלית אקדמית", "כתיבה, קריאה ומבחנים."],
        ["פסיכומטרי", "אסטרטגיה ותרגול."],
      ],
    },
  },
  {
    id: "masterly",
    name: "Masterly",
    logo: "M",
    niche: "masterclass",
    badge: "Premium",
    tagline: "מאסטרקלאס",
    description: "מאסטרקלאס יוקרתי: הירו מותג־דומיננטי, כיתות מודגשות ומאסטרים באור זרקור.",
    fonts: { display: "Cinzel:wght@500;600;700", body: "Montserrat:wght@400;500;600;700", displayCss: '"Cinzel"', bodyCss: '"Montserrat"' },
    palette: { primary: "#D4AF37", secondary: "#0A0A0A", accent: "#F5E6C8", background: "#0A0A0A", surface: "#171717", text: "#FAF7F0", muted: "#A3A3A3", dark: "#000000" },
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85",
    style: "champagneNoir",
    copy: {
      heroTitle: "Masterly",
      heroSubtitle: "מאסטרקלאסים בלעדיים עם יוצרים ומנהיגים — עומק, אלגנטיות, ותובנות שלא מקבלים במצגת.",
      heroPrimary: "בקשת הזמנה",
      heroSecondary: "לכיתות",
      s2: "מאסטרקלאסים",
      s3: "פרקים",
      s4: "המאסטרים",
      s5: "במספרים עדינים",
      s6: "עדויות קולנועיות",
      s7: "שאלות מינימליות",
      s8: "טופס בלעדי",
      cta: "הכיתה הבאה מוגבלת במקומות.",
      phone: "03-700-1010",
      email: "invite@masterly.co.il",
      address: "תל אביב · אירועים נבחרים",
      items: [
        ["מנהיגות יצירתית", "קבלת החלטות תחת לחץ."],
        ["סיפור מותג", "נרטיב שמוכר בלי לצעוק."],
        ["ביצועים על במה", "נוכחות, קול וביטחון."],
      ],
    },
  },
];

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function defaultData(t) {
  const c = t.copy;
  const [i1, i2, i3] = c.items;
  return `export const ${t.id}DefaultData = {
  templateId: "${t.id}",
  name: "${t.name}",
  brandName: "${t.name}",
  logoText: "${t.logo}",
  navHome: "בית",
  navCourses: "קורסים",
  navAbout: "אודות",
  navContact: "יצירת קשר",
  heroEyebrow: "${t.tagline}",
  heroTitle: ${JSON.stringify(c.heroTitle)},
  heroSubtitle: ${JSON.stringify(c.heroSubtitle)},
  heroPrimaryButton: "${c.heroPrimary}",
  heroSecondaryButton: "${c.heroSecondary}",
  heroImage: "${t.heroImage}",
  sectionImage: "${t.img2}",
  heroStatOne: "2,400+",
  heroStatOneLabel: "לומדים",
  heroStatTwo: "4.9",
  heroStatTwoLabel: "דירוג ממוצע",
  heroStatThree: "120+",
  heroStatThreeLabel: "קורסים",
  sectionTwoTitle: "${c.s2}",
  sectionThreeTitle: "${c.s3}",
  sectionFourTitle: "${c.s4}",
  sectionFiveTitle: "${c.s5}",
  sectionSixTitle: "${c.s6}",
  sectionSevenTitle: "${c.s7}",
  sectionEightTitle: "${c.s8}",
  itemOneTitle: ${JSON.stringify(i1[0])},
  itemOneText: ${JSON.stringify(i1[1])},
  itemTwoTitle: ${JSON.stringify(i2[0])},
  itemTwoText: ${JSON.stringify(i2[1])},
  itemThreeTitle: ${JSON.stringify(i3[0])},
  itemThreeText: ${JSON.stringify(i3[1])},
  reviewOneText: "הקורס שינה לי את הדרך שבה אני לומדת — ברור, מעשי ומלא אנרגיה.",
  reviewOneName: "נועה שחר",
  reviewOneRole: "בוגרת",
  reviewTwoText: "המנטורים זמינים, התוכן מדויק, והתוצאות הגיעו מהר מהצפוי.",
  reviewTwoName: "איתי ברק",
  reviewTwoRole: "סטודנט",
  reviewThreeText: "חוויה ברמה גבוהה מהשיעור הראשון. ממליצים בחום.",
  reviewThreeName: "מיכל רוזן",
  reviewThreeRole: "תלמידה",
  faqOneQuestion: "איך נרשמים?",
  faqOneAnswer: "בוחרים מסלול, משאירים פרטים — ומתאמים שיחת היכרות קצרה.",
  faqTwoQuestion: "האם הלמידה מתאימה למתחילים?",
  faqTwoAnswer: "כן. יש מסלולים למתחילים ולמתקדמים, עם ליווי אישי לפי הצורך.",
  faqThreeQuestion: "אפשר ללמוד מרחוק?",
  faqThreeAnswer: "רוב המסלולים זמינים אונליין או בהיברידי, עם גישה להקלטות.",
  contactTitle: "${c.s8}",
  contactText: "השאירו פרטים ונחזור אליכם עם המסלול המתאים.",
  contactButton: "שליחה",
  phone: "${c.phone}",
  email: "${c.email}",
  address: "${c.address}",
  ctaTitle: "${c.cta}",
  ctaText: "הצעד הבא בלמידה מתחיל בשיחה קצרה — בלי התחייבות.",
  ctaButton: "${c.heroPrimary}",
};
`;
}

function editorCss(t) {
  const p = t.palette;
  const f = t.fonts;
  const id = t.id;
  return `export const ${id}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?family=${f.display}&family=${f.body}&display=swap');

[data-template-id="${id}"],
[data-template-id="${id}-preview"] {
  --p: ${p.primary};
  --s: ${p.secondary};
  --a: ${p.accent};
  --bg: ${p.background};
  --surface: ${p.surface};
  --text: ${p.text};
  --muted: ${p.muted};
  --dark: ${p.dark};
  font-family: ${f.bodyCss}, sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="${id}"] .t-display,
[data-template-id="${id}-preview"] .t-display {
  font-family: ${f.displayCss}, sans-serif;
}

@keyframes ${id}-ken {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
@keyframes ${id}-up {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ${id}-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ${id}-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
@keyframes ${id}-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes ${id}-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.92; }
}
@keyframes ${id}-wave {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.08); }
}
@keyframes ${id}-type {
  from { width: 0; }
  to { width: 100%; }
}

[data-template-id="${id}"] .t-ken,
[data-template-id="${id}-preview"] .t-ken { animation: ${id}-ken 16s ease-in-out infinite alternate; }
[data-template-id="${id}"] .t-anim,
[data-template-id="${id}-preview"] .t-anim { animation: ${id}-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="${id}"] .t-d1,
[data-template-id="${id}-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="${id}"] .t-d2,
[data-template-id="${id}-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="${id}"] .t-d3,
[data-template-id="${id}-preview"] .t-d3 { animation-delay: .36s; }
[data-template-id="${id}"] .t-fade,
[data-template-id="${id}-preview"] .t-fade { animation: ${id}-fade 1s ease both; }
[data-template-id="${id}"] .t-marquee,
[data-template-id="${id}-preview"] .t-marquee { animation: ${id}-marquee 28s linear infinite; width: max-content; }
[data-template-id="${id}"] .t-float,
[data-template-id="${id}-preview"] .t-float { animation: ${id}-float 6.5s ease-in-out infinite; }
[data-template-id="${id}"] .t-pulse,
[data-template-id="${id}-preview"] .t-pulse { animation: ${id}-pulse 2.6s ease-in-out infinite; }
[data-template-id="${id}"] .t-wave,
[data-template-id="${id}-preview"] .t-wave { animation: ${id}-wave 2.2s ease-in-out infinite; }
[data-template-id="${id}"] .t-hover,
[data-template-id="${id}-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="${id}"] .t-hover:hover,
[data-template-id="${id}-preview"] .t-hover:hover { transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  [data-template-id="${id}"] .t-ken,
  [data-template-id="${id}-preview"] .t-ken,
  [data-template-id="${id}"] .t-anim,
  [data-template-id="${id}-preview"] .t-anim,
  [data-template-id="${id}"] .t-marquee,
  [data-template-id="${id}-preview"] .t-marquee,
  [data-template-id="${id}"] .t-float,
  [data-template-id="${id}-preview"] .t-float,
  [data-template-id="${id}"] .t-pulse,
  [data-template-id="${id}-preview"] .t-pulse,
  [data-template-id="${id}"] .t-wave,
  [data-template-id="${id}-preview"] .t-wave,
  [data-template-id="${id}"] .t-fade,
  [data-template-id="${id}-preview"] .t-fade { animation: none !important; }
}
\`;
`;
}

function schema(t) {
  return `export const ${t.id}Schema = {
  templateId: "${t.id}",
  name: "${t.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "טקסט הירו", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "heroPrimaryButton", label: "כפתור ראשי", type: "text" },
    { key: "sectionTwoTitle", label: "כותרת קורסים", type: "text" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "ctaTitle", label: "כותרת CTA", type: "textarea" },
  ],
};
`;
}

function preview(t) {
  const P = pascal(t.id);
  return `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${t.id}-preview" className="min-h-screen w-full" style={{ background: "${t.palette.background}", overflowX: "hidden" }}>
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function thumbnail(t) {
  const P = pascal(t.id);
  const p = t.palette;
  return `import React from "react";

export default function ${P}Thumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "${p.background}", color: "${p.text}" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, ${p.primary}66, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "${p.primary}" }}>${t.tagline}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: ${JSON.stringify(t.fonts.displayCss)} }}>${t.name}</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">${t.copy.heroSubtitle.slice(0, 70)}…</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "${p.primary}55", color: "${p.primary}" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
}

function meta(t) {
  const P = pascal(t.id);
  const p = t.palette;
  const blocks = ["header", "hero", "courses", "curriculum", "instructors", "stats", "testimonials", "faq", "contact", "footer"];
  return `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${t.id}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${t.id}EditorCss } from "./editorCss";
import { ${t.id}Schema } from "./schema";
import { ${t.id}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${p.primary}",
  secondary: "${p.secondary}",
  accent: "${p.accent}",
  background: "${p.background}",
  surface: "${p.surface}",
  text: "${p.text}",
  muted: "${p.muted}",
  dark: "${p.dark}",
};

const blocks = [
${blocks.map((b) => `  { type: "${b}", variant: "${t.style}-${b}", title: "${b}" },`).join("\n")}
];

export const ${t.id}Seed = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  description: "${t.description}",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  niche: "${t.niche}",
  layout: "full",
  image: (${t.id}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${t.id}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${t.id}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: \`${t.id}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${t.id}Pages,
  editor: { pages: ${t.id}Pages, css: ${t.id}EditorCss },
  css: ${t.id}EditorCss,
  data: ${t.id}DefaultData,
  defaultData: ${t.id}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${t.id}Template = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "education",
  categoryLabel: "חינוך וקורסים",
  badge: "${t.badge}",
  description: "${t.description}",
  thumbnail: React.createElement(${P}Thumbnail),
  preview: React.createElement(${P}Preview),
  component: ${P}Pages,
  Component: ${P}Pages,
  seed: ${t.id}Seed,
  pages: ${t.id}Pages,
  editorCss: ${t.id}EditorCss,
  schema: ${t.id}Schema,
  defaultData: ${t.id}DefaultData,
  renderer: {
    key: "${t.id}",
    name: "${t.name}",
    Component: ${P}Pages,
    component: ${P}Pages,
    pages: ${t.id}Pages,
    editorMode: "visual-react",
    editorCss: ${t.id}EditorCss,
    schema: ${t.id}Schema,
    defaultData: ${t.id}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${t.id}Template;
`;
}

/** Unique section layouts — NO section design may repeat across templates */
function styleLayouts(style) {
  const items = `[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]`;
  const stats = `[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]]`;
  const reviews = `[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]]`;
  const faqs = `[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]]`;

  const all = {
    cinemaTeal: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          <a href="#courses">{getValue(data,"navCourses")}</a>
          <a href="#faq">{getValue(data,"navAbout")}</a>
          <a href="#contact">{getValue(data,"navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="t-pulse bg-[var(--a)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8">
        <Reveal variant="up">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim mt-4 whitespace-pre-line text-6xl font-extrabold leading-[0.92] text-white md:text-8xl lg:text-9xl">{getValue(data,"brandName")}</h1>
          <p className="t-anim t-d1 mt-2 whitespace-pre-line text-2xl text-white/90 md:text-4xl">{getValue(data,"heroTitle").split("\\n").slice(1).join(" ") || getValue(data,"heroSubtitle")}</p>
          <p className="t-anim t-d2 mt-5 max-w-xl text-lg text-white/70">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/30 px-8 py-4 text-sm font-semibold text-white">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
    </section>`,
      courses: `<section id="courses" data-template-section-type="courses" className="overflow-hidden border-y border-[var(--p)]/30 bg-[var(--surface)] py-10">
      <div className="t-marquee flex gap-8 whitespace-nowrap px-4">
        {[...[${items}], ...[${items}]].map(([title], i) => (
          <span key={i} className="inline-flex items-center gap-4 text-2xl font-bold text-[var(--p)]">
            <span className="h-2 w-2 rounded-full bg-[var(--a)]" />{title}<span className="text-[var(--muted)]">· קורס חי</span>
          </span>
        ))}
      </div>
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-5 md:grid-cols-3 lg:px-8">
        {[${items}].map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover border border-[var(--p)]/30 bg-[var(--bg)] p-6">
            <div className="text-3xl font-bold text-[var(--a)]">₪{[890, 1290, 1590][i]}</div>
            <h3 className="mt-3 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
        <div className="mt-10 space-y-3">
          {[["01","פתיחה וקונספט"],["02","תרגול מודרך"],["03","פרויקט גמר"],["04","משוב ומנטורינג"]].map(([n,t],i) => (
            <Reveal key={n} delayMs={i*70}>
              <details className="t-hover group border border-[var(--p)]/25 bg-[var(--surface)] open:border-[var(--a)]">
                <summary className="flex cursor-pointer list-none items-center gap-5 p-5 font-bold">
                  <span className="t-display text-2xl text-[var(--p)]">{n}</span>{t}
                </summary>
                <p className="px-5 pb-5 text-sm text-[var(--muted)]">שיעורים מוקלטים + מפגש חי שבועי עם המנחה.</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display mx-auto max-w-7xl text-4xl font-bold md:text-5xl">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex max-w-7xl gap-5 overflow-x-auto pb-4">
        {[["נועה","בימוי"],["איתי","מוצר"],["מיכל","AI"],["גל","שיווק"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover min-w-[200px] shrink-0">
            <div className="aspect-[3/4] overflow-hidden bg-[var(--bg)]">
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover opacity-80 transition duration-700 hover:scale-110" />
            </div>
            <p className="mt-3 font-bold">{n}</p>
            <p className="text-sm text-[var(--p)]">{r}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="px-5 py-20 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8">
        {${stats}.map(([n,l],i) => (
          <Reveal key={l} delayMs={i*100} variant="scale" className="t-float t-hover grid h-40 w-40 place-items-center rounded-full border border-[var(--p)] bg-[var(--surface)] text-center" style={{animationDelay:\`\${i*0.4}s\`}}>
            <div><div className="t-display text-3xl font-bold text-[var(--a)]">{n}</div><div className="mt-1 text-xs text-[var(--muted)]">{l}</div></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="overflow-hidden border-y border-[var(--p)]/25 bg-[var(--dark)] py-8">
      <div className="t-marquee flex gap-16 whitespace-nowrap text-lg">
        {[...${reviews}, ...${reviews}].map(([text,name],i) => (
          <span key={i} className="text-white/80">"{text}" — <span className="text-[var(--a)]">{name}</span></span>
        ))}
      </div>
    </section>`,
      faq: `<section id="faq" data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
        <Reveal><h2 className="t-display sticky top-28 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        <div className="space-y-3">
          {${faqs}.map(([q,a],i) => (
            <Reveal key={q} delayMs={i*80}>
              <details className="border-r-4 border-[var(--a)] bg-[var(--surface)] p-5">
                <summary className="cursor-pointer list-none font-bold">{q}</summary>
                <p className="mt-3 text-sm text-[var(--muted)]">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
      contact: `<section id="contact" data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-[var(--p)]/30 lg:grid-cols-2">
        <div className="bg-[var(--p)] p-10 text-[var(--dark)] lg:p-14">
          <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
          <p className="mt-4 opacity-80">{getValue(data,"contactText")}</p>
          <p className="mt-8 text-sm">{getValue(data,"phone")}</p>
          <p className="text-sm">{getValue(data,"email")}</p></Reveal>
        </div>
        <form className="grid gap-4 bg-[var(--surface)] p-10 lg:p-14">
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 outline-none" placeholder="טלפון" />
          <button type="button" onClick={openModal} className="bg-[var(--a)] py-4 text-sm font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <span className="t-display text-2xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</span>
        <p className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} · {getValue(data,"address")}</p>
        <button type="button" onClick={openModal} className="border border-[var(--a)] px-5 py-2 text-sm text-[var(--a)]">{getValue(data,"ctaButton")}</button>
      </div>
    </footer>`,
    },

    inkAmber: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/20 bg-[var(--dark)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--p)] text-sm font-bold text-[var(--dark)]">{getValue(data,"logoText")}</span>
          <span className="text-sm font-semibold tracking-wide">{getValue(data,"brandName")}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span>{getValue(data,"phone")}</span>
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-4 py-2 font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
        </div>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[100svh]">
      <div className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="sticky top-0 flex min-h-[50svh] flex-col justify-center bg-[var(--dark)] px-5 py-20 lg:min-h-[100svh] lg:px-12">
          <Reveal variant="right">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
            <h1 className="t-display mt-4 text-6xl font-bold leading-[0.95] text-[var(--p)] md:text-8xl">{getValue(data,"brandName")}</h1>
            <p className="mt-4 whitespace-pre-line text-2xl text-white md:text-3xl">{getValue(data,"heroTitle").replace(getValue(data,"brandName"),"").trim() || "ליווי שמשנה מסלול."}</p>
            <p className="mt-6 max-w-md text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
            <button type="button" onClick={openModal} className="t-pulse mt-8 w-fit bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
          </Reveal>
        </div>
        <div className="relative min-h-[50svh] overflow-hidden lg:min-h-[100svh]">
          <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-5xl space-y-6">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*100} className="t-hover flex flex-col gap-2 border-b border-[var(--p)]/30 pb-6 md:flex-row md:items-end md:justify-between" style={{paddingInlineStart:\`\${i*2}rem\`}}>
            <div><p className="text-xs text-[var(--p)]">מסלול 0{i+1}</p><h3 className="t-display text-3xl font-bold">{title}</h3><p className="mt-2 max-w-lg text-sm text-[var(--muted)]">{text}</p></div>
            <span className="text-xl font-bold text-[var(--p)]">₪{[2400,3600,4800][i]}/חודש</span>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-16 grid max-w-4xl place-items-center">
        <div className="t-pulse absolute h-64 w-64 rounded-full border border-[var(--p)]/40" />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {["אבחון","מיפוי","ליווי","מדידה"].map((s,i) => (
            <Reveal key={s} delayMs={i*90} variant="scale" className="t-float grid h-28 w-28 place-items-center rounded-full border border-[var(--p)] bg-[var(--bg)] text-center text-sm font-bold" style={{animationDelay:\`\${i*0.3}s\`}}>{s}</Reveal>
          ))}
        </div>
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
        <div className="mt-10 flex items-center -space-x-6 space-x-reverse">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="t-hover h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--bg)]" style={{zIndex:5-i}}>
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" style={{filter:\`hue-rotate(\${i*20}deg)\`}} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">12 מנטורים פעילים · התאמה אישית</p>
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="border-y border-[var(--p)]/25 bg-[var(--dark)]">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-x-reverse divide-[var(--p)]/25">
        {${stats}.map(([n,l]) => (
          <div key={l} className="px-4 py-10 text-center">
            <div className="t-display text-3xl font-bold text-[var(--p)] md:text-5xl">{n}</div>
            <div className="mt-2 text-xs text-[var(--muted)] md:text-sm">{l}</div>
          </div>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        {${reviews}.map(([text,name,role],i) => (
          <Reveal key={name} delayMs={i*100} className="t-hover border-r-2 border-[var(--p)] pr-6">
            <p className="text-xl leading-9">"{text}"</p>
            <footer className="mt-3 text-sm text-[var(--p)]">{name} · {role}</footer>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-8 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70}>
            <details className="group mb-3 overflow-hidden bg-[var(--bg)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold transition group-open:bg-[var(--p)] group-open:text-[var(--dark)]">
                {q}<span className="text-xl">+</span>
              </summary>
              <p className="p-5 text-sm text-[var(--muted)]">{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="t-display text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
        <p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p>
      </Reveal>
      <form className="mx-auto mt-10 grid max-w-xl gap-3">
        <input className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none" placeholder="שם" />
        <input className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none" placeholder="טלפון" />
        <select className="border border-[var(--p)]/30 bg-[var(--surface)] px-5 py-4 outline-none"><option>בחרו מסלול</option><option>קריירה</option><option>יזמות</option></select>
        <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-[var(--dark)]">{getValue(data,"contactButton")}</button>
      </form>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="bg-[var(--dark)] px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="t-display text-3xl font-bold text-[var(--p)] md:text-5xl">{getValue(data,"ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">{getValue(data,"ctaText")}</p>
        <button type="button" onClick={openModal} className="t-pulse mt-8 bg-[var(--p)] px-10 py-4 font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button>
        <p className="mt-10 text-xs text-[var(--muted)]">© {new Date().getFullYear()} {getValue(data,"brandName")}</p>
      </div>
    </footer>`,
    },

    skyBlue: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 py-6">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</span>
        <button type="button" onClick={openModal} className="rounded-full border border-[var(--p)] px-6 py-2 text-sm font-bold text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative overflow-hidden bg-[var(--bg)] px-5 pb-10 pt-32 lg:px-8">
      <div className="absolute inset-0 opacity-40" style={{background:"radial-gradient(circle at 50% 0%, #38BDF866, transparent 55%)"}} />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal variant="scale">
          <h1 className="t-display text-6xl font-extrabold leading-[0.95] text-[var(--dark)] md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 text-xl text-[var(--p)] md:text-2xl">{getValue(data,"heroTitle").replace(getValue(data,"brandName"),"").trim() || getValue(data,"heroEyebrow")}</p>
          <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={openModal} className="t-pulse bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-[var(--p)] px-8 py-3.5 text-sm font-bold text-[var(--p)]">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
        <div className="relative mt-14 h-56 overflow-hidden rounded-3xl">
          <img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover" />
        </div>
      </div>
      <div className="relative mt-10 overflow-hidden border-y border-[var(--p)]/20 py-3">
        <div className="t-marquee flex gap-10 text-sm font-bold text-[var(--p)]">
          {["עברית","English","Español","العربية","Français","Deutsch","עברית","English","Español","العربية"].map((l,i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-5xl"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-5xl divide-y divide-[var(--p)]/15">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover grid gap-2 py-6 md:grid-cols-[140px_1fr_100px] md:items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--p)]">שפה 0{i+1}</span>
            <div><h3 className="text-xl font-bold text-[var(--dark)]">{title}</h3><p className="text-sm text-[var(--muted)]">{text}</p></div>
            <button type="button" onClick={openModal} className="justify-self-start text-sm font-bold text-[var(--p)] md:justify-self-end">הרשמה ←</button>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="bg-white px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-14 max-w-4xl space-y-10">
        {[["היכרות","מילים ראשונות וביטחון"],["תרגול","שיחה חיה פעמיים בשבוע"],["שטף","פרויקט דיבור אישי"]].map(([t,d],i) => (
          <Reveal key={t} delayMs={i*90} className={\`flex items-center gap-6 \${i%2===1?"flex-row-reverse text-left":""}\`}>
            <div className="t-float grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[var(--p)] text-xl font-bold text-white">{i+1}</div>
            <div><h3 className="text-xl font-bold text-[var(--dark)]">{t}</h3><p className="text-sm text-[var(--muted)]">{d}</p></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
        {["שרה","חואן","ליאור","אמל"].map((n,i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover min-w-[180px] shrink-0 text-center">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-[var(--a)]">
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 font-bold text-[var(--dark)]">{n}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="bg-[var(--p)] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-around gap-6">
        {${stats}.map(([n,l],i) => (
          <Reveal key={l} delayMs={i*70} className="flex items-center gap-3">
            <span className="t-pulse h-2 w-2 rounded-full bg-white" />
            <div><div className="t-display text-3xl font-bold">{n}</div><div className="text-xs text-white/80">{l}</div></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {${reviews}.map(([text,name],i) => (
          <Reveal key={name} delayMs={i*90} className="t-hover relative bg-white p-6 pt-10 shadow-sm">
            <div className="absolute -top-4 right-6 rounded-2xl rounded-bl-sm bg-[var(--a)] px-3 py-1 text-xs font-bold text-[var(--dark)]">ציטוט</div>
            <p className="text-sm leading-7 text-[var(--muted)]">"{text}"</p>
            <p className="mt-4 font-bold text-[var(--p)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-6 text-center text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["הרשמה","לוז","מחיר"].map((t) => <span key={t} className="rounded-full border border-[var(--p)] px-4 py-1 text-xs font-bold text-[var(--p)]">{t}</span>)}
        </div>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*60} className="mb-3 rounded-2xl border border-[var(--p)]/20 p-5">
            <p className="font-bold text-[var(--dark)]">{q}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <Reveal><h2 className="t-display text-3xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="שם" />
          <input className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="טלפון" />
          <select className="rounded-xl border border-[var(--p)]/20 px-5 py-4 outline-none"><option>בחרו שפה</option><option>אנגלית</option><option>ספרדית</option><option>ערבית</option></select>
          <button type="button" onClick={openModal} className="rounded-xl bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--p)]/15 px-5 py-10 text-center lg:px-8">
      <p className="t-display text-2xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</p>
      <p className="mt-4 text-xs text-[var(--muted)]">© {new Date().getFullYear()}</p>
    </footer>`,
    },

    terminalGreen: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/30 bg-black/90 font-mono text-xs backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <span className="text-[var(--p)]">~/edu/<span className="text-white">{getValue(data,"brandName").toLowerCase()}</span></span>
        <div className="flex gap-4 text-[var(--muted)]">
          <span className="hidden sm:inline">branch: main</span>
          <button type="button" onClick={openModal} className="border border-[var(--p)] px-3 py-1 text-[var(--p)]">apply --now</button>
        </div>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[100svh] bg-black px-5 pt-24 lg:px-8">
      <div className="absolute inset-0 opacity-30"><img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" /></div>
      <div className="relative z-10 mx-auto max-w-4xl border border-[var(--p)]/40 bg-black/85 p-6 font-mono md:p-10">
        <div className="mb-4 flex gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /><span className="h-3 w-3 rounded-full bg-yellow-500" /><span className="h-3 w-3 rounded-full bg-[var(--p)]" /></div>
        <Reveal>
          <p className="text-[var(--muted)]">$ whoami</p>
          <h1 className="t-display mt-2 text-4xl font-bold text-[var(--p)] md:text-6xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 text-sm text-white/80 md:text-base">{getValue(data,"heroTitle")}</p>
          <p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <p className="mt-6 text-[var(--p)]">$ npm run career<span className="t-pulse inline-block">_</span></p>
          <button type="button" onClick={openModal} className="mt-8 border border-[var(--p)] bg-[var(--p)]/10 px-6 py-3 text-sm font-bold text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">// {getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-4xl space-y-4">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover border border-[var(--p)]/30 bg-[var(--surface)] p-5">
            <pre className="text-xs text-[var(--muted)]">{"{"}"</pre>
            <p className="text-[var(--p)]">"track": "{title}",</p>
            <p className="text-white/80">"desc": "{text}",</p>
            <p className="text-[var(--a)]">"price": {[8900,12000,6500][i]}</p>
            <pre className="text-xs text-[var(--muted)]">{"}"}</pre>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="border-y border-[var(--p)]/20 bg-[var(--surface)] px-5 py-24 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">git log --curriculum</h2></Reveal>
      <div className="relative mx-auto mt-10 max-w-3xl border-r-2 border-[var(--p)]/40 pr-8">
        {[["feat: setup env","שבוע 1-2"],["feat: first app","שבוע 3-6"],["feat: APIs","שבוע 7-10"],["release: portfolio","שבוע 11-12"]].map(([c,w],i) => (
          <Reveal key={c} delayMs={i*90} className="relative mb-8">
            <span className="absolute -right-[41px] top-1 h-4 w-4 rounded-full bg-[var(--p)]" />
            <p className="text-xs text-[var(--muted)]">commit {i+1} · {w}</p>
            <p className="text-lg text-white">{c}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-24 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">contributors</h2></Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["@noa","mentor"],["@itai","fullstack"],["@michal","data"],["@gal","devops"]].map(([h,r],i) => (
          <Reveal key={h} delayMs={i*70} className="t-hover border border-[var(--p)]/25 p-4">
            <div className="mb-3 h-16 w-16 overflow-hidden bg-[var(--surface)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" /></div>
            <p className="text-[var(--p)]">{h}</p>
            <p className="text-xs text-[var(--muted)]">{r}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="bg-black px-5 py-16 font-mono lg:px-8">
      <div className="mx-auto max-w-3xl border border-[var(--p)]/40 p-6 text-[var(--p)]">
        <p className="mb-4 text-xs text-[var(--muted)]">$ ./stats --ascii</p>
        {${stats}.map(([n,l]) => (
          <div key={l} className="flex justify-between border-b border-[var(--p)]/20 py-3 text-sm">
            <span>{l}</span><span className="font-bold text-white">{n}</span>
          </div>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="px-5 py-24 font-mono lg:px-8">
      <Reveal><h2 className="text-2xl text-[var(--p)]">pull requests / reviews</h2></Reveal>
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {${reviews}.map(([text,name,role],i) => (
          <Reveal key={name} delayMs={i*80} className="t-hover border border-[var(--p)]/30 bg-[var(--surface)] p-5">
            <p className="text-xs text-[var(--a)]">PR #{120+i} merged · {role}</p>
            <p className="mt-2 text-white/90">"{text}"</p>
            <p className="mt-3 text-sm text-[var(--p)]">@{name.replace(" ","_").toLowerCase()}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 font-mono lg:px-8">
      <div className="mx-auto max-w-3xl border border-[var(--p)]/30 p-6">
        <p className="text-[var(--muted)]">console.faq()</p>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mt-5 border-t border-[var(--p)]/20 pt-5">
            <p className="text-[var(--p)]">Q: {q}</p>
            <p className="mt-2 text-sm text-white/70">A: {a}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 font-mono lg:px-8">
      <div className="mx-auto max-w-xl border border-[var(--p)]/40 bg-black p-6">
        <Reveal>
          <p className="text-xs text-[var(--muted)]">// application.js</p>
          <h2 className="mt-2 text-xl text-[var(--p)]">{getValue(data,"contactTitle")}</h2>
        </Reveal>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/30 bg-transparent px-4 py-3 text-[var(--p)] outline-none" placeholder="name =" />
          <input className="border border-[var(--p)]/30 bg-transparent px-4 py-3 text-[var(--p)] outline-none" placeholder="email =" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-3 font-bold text-black">node submit.js</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-8 font-mono text-xs text-[var(--muted)] lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} {getValue(data,"brandName")} — exit 0</span>
        <button type="button" onClick={openModal} className="text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </div>
    </footer>`,
    },

    copperCharcoal: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-5 py-5 lg:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--a)]">live session</p>
          <span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className="border border-[var(--a)] px-5 py-2 text-sm text-[var(--a)]">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/60 to-transparent" />
      <svg className="absolute bottom-0 left-0 right-0 h-32 w-full text-[var(--bg)]" viewBox="0 0 1440 120" preserveAspectRatio="none"><path fill="currentColor" d="M0,64 C240,120 480,0 720,40 C960,80 1200,100 1440,40 L1440,120 L0,120 Z" className="t-wave" /></svg>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 lg:px-8">
        <Reveal>
          <h1 className="t-display text-6xl font-bold text-[var(--a)] md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 max-w-xl text-2xl text-white">{getValue(data,"heroTitle").replace(getValue(data,"brandName"),"").trim()}</p>
          <p className="mt-5 max-w-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-8 w-fit bg-[var(--p)] px-8 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <ol className="mx-auto mt-10 max-w-3xl space-y-2">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover flex items-center gap-4 border-b border-white/10 py-4">
            <span className="t-display w-10 text-[var(--a)]">{String(i+1).padStart(2,"0")}</span>
            <div className="flex-1"><h3 className="font-bold">{title}</h3><p className="text-sm text-[var(--muted)]">{text}</p></div>
            <span className="text-xs text-[var(--p)]">{[3,4,5][i]}:2{i}</span>
          </Reveal>
        ))}
      </ol>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 max-w-4xl">
        <div className="mb-6 flex justify-between border-b-2 border-[var(--a)] pb-2">
          {[1,2,3,4,5].map((n) => <span key={n} className="text-xs text-[var(--muted)]">♪ {n}</span>)}
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {["טכניקה","רפרטואר","אימפרוביזציה","במה"].map((s,i) => (
            <Reveal key={s} delayMs={i*80} className="t-hover border border-[var(--a)]/30 p-5 text-center">
              <div className="t-wave mx-auto mb-3 h-8 w-1 bg-[var(--a)]" style={{animationDelay:\`\${i*0.2}s\`}} />
              <p className="font-bold">{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-0 md:grid-cols-3">
        {[["דני","גיטרה"],["יעל","שירה"],["עומר","הפקה"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*90} className="t-hover relative min-h-[280px] overflow-hidden">
            <img src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 hover:scale-110" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-6">
              <p className="t-display text-2xl">{n}</p>
              <p className="text-sm text-[var(--a)]">{r}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="border-y border-[var(--a)]/30 px-5 py-14 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-end justify-around gap-4">
        {${stats}.map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="text-center">
            <div className="mx-auto mb-3 flex h-16 items-end justify-center gap-1">
              {[40,70,55,90,60].map((h,j) => (
                <div key={j} className="t-wave w-2 bg-[var(--a)]" style={{ height: h + "%", animationDelay: (i + j) * 0.1 + "s" }} />
              ))}
            </div>
            <div className="t-display text-2xl text-[var(--a)]">{n}</div>
            <div className="text-xs text-[var(--muted)]">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 max-w-3xl space-y-10 text-center">
        {${reviews}.map(([text,name],i) => (
          <Reveal key={name} delayMs={i*100}>
            <p className="t-display text-2xl leading-10 text-[var(--a)]">"{text}"</p>
            <p className="mt-3 text-sm text-[var(--muted)]">— {name}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Reveal><h2 className="t-display mb-8 text-4xl font-bold">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-4 flex gap-4">
            <span className="t-display text-3xl text-[var(--a)]">♪</span>
            <div><p className="font-bold">{q}</p><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <Reveal>
          <h2 className="t-display text-4xl font-bold">{getValue(data,"contactTitle")}</h2>
          <p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p>
          <p className="mt-6 text-sm">{getValue(data,"address")}</p>
        </Reveal>
        <form className="border border-[var(--a)]/40 bg-[var(--surface)] p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--a)]">audition form</p>
          <input className="mb-3 w-full border border-white/10 bg-transparent px-4 py-3 outline-none" placeholder="שם" />
          <input className="mb-3 w-full border border-white/10 bg-transparent px-4 py-3 outline-none" placeholder="כלי / תחום" />
          <button type="button" onClick={openModal} className="w-full bg-[var(--p)] py-3 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--a)]/20 px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <span className="t-display text-xl text-[var(--a)]">{getValue(data,"brandName")}</span>
        <p className="text-xs text-[var(--muted)]">{getValue(data,"ctaTitle")}</p>
        <button type="button" onClick={openModal} className="text-sm text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </div>
    </footer>`,
    },
    mintSunshine: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="t-float grid h-11 w-11 place-items-center rounded-2xl bg-[var(--a)] text-lg font-bold text-[var(--dark)]">{getValue(data,"logoText")}</span>
          <span className="t-display text-xl font-bold text-[var(--dark)]">{getValue(data,"brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className="rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative overflow-hidden px-5 pb-16 pt-12 lg:px-8">
      <div className="t-float absolute -left-10 top-20 h-40 w-40 rounded-full bg-[var(--a)]/40" />
      <div className="t-float absolute right-10 top-40 h-24 w-24 rounded-full bg-[var(--p)]/30" style={{animationDelay:"1s"}} />
      <div className="t-pulse absolute bottom-20 left-1/3 h-16 w-16 rotate-12 bg-[var(--a)]/50" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <Reveal variant="right">
          <h1 className="t-display text-5xl font-bold leading-[1.05] text-[var(--dark)] md:text-7xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 text-xl text-[var(--p)]">{getValue(data,"heroTitle").replace(getValue(data,"brandName"),"").trim()}</p>
          <p className="mt-4 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-8 rounded-full bg-[var(--a)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
        <Reveal variant="scale" delayMs={120} className="relative">
          <div className="overflow-hidden rounded-[2.5rem] border-8 border-white shadow-lg">
            <img src={getValue(data,"heroImage")} alt="" className="t-ken h-[380px] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-6">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*90} className="t-hover flex items-center gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-2xl font-bold text-white" style={{background:["#10B981","#FBBF24","#34D399"][i]}}>{i+1}</span>
            <div className="flex-1 rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--dark)]">{title}</h3>
              <p className="text-sm text-[var(--muted)]">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="bg-white px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["מגלים","סקרנות"],["מנסים","ידיים"],["יוצרים","גאווה"],["משתפים","חברים"]].map(([t,d],i) => (
          <Reveal key={t} delayMs={i*80} variant="up" className="t-hover rounded-3xl border-4 border-dashed p-6 text-center" style={{borderColor:["#10B981","#FBBF24","#34D399","#F59E0B"][i]}}>
            <div className="t-float mx-auto h-3 w-3 rounded-full" style={{background:["#10B981","#FBBF24","#34D399","#F59E0B"][i]}} />
            <h3 className="mt-3 text-lg font-bold text-[var(--dark)]">{t}</h3>
            <p className="text-sm text-[var(--muted)]">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-20 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 flex flex-wrap justify-center gap-8">
        {["תמר","יואב","שירה"].map((n,i) => (
          <Reveal key={n} delayMs={i*100} className="t-hover text-center">
            <div className="t-float mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--a)]" style={{animationDelay:i*0.4+"s"}}>
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 font-bold text-[var(--dark)]">{n}</p>
            <p className="text-sm text-[var(--p)]">מורה חברותי/ת</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="px-5 py-16 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
        {${stats}.map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="t-float rounded-3xl bg-[var(--p)] px-8 py-6 text-center text-white" style={{animationDelay:i*0.35+"s"}}>
            <div className="t-display text-4xl font-bold">{n}</div>
            <div className="text-sm text-white/90">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="bg-white px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {${reviews}.map(([text,name],i) => (
          <Reveal key={name} delayMs={i*90} className="t-hover relative rounded-[2rem] bg-[var(--bg)] p-6">
            <div className="absolute -top-3 right-6 rounded-full bg-[var(--a)] px-3 py-1 text-xs font-bold">הורה</div>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">"{text}"</p>
            <p className="mt-4 font-bold text-[var(--p)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <Reveal><h2 className="t-display mb-8 text-center text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70}>
            <details className="t-hover overflow-hidden rounded-3xl bg-white shadow-sm">
              <summary className="cursor-pointer list-none p-6 text-lg font-bold text-[var(--dark)]">{q}</summary>
              <p className="px-6 pb-6 text-[var(--muted)]">{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-lg rounded-[2rem] bg-[var(--a)] p-8 text-[var(--dark)]">
        <Reveal><h2 className="t-display text-3xl font-bold">{getValue(data,"contactTitle")}</h2>
        <p className="mt-2 text-sm opacity-80">להורים — נחזור אליכם במהירות</p></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="rounded-2xl border-0 px-5 py-4 outline-none" placeholder="שם ההורה" />
          <input className="rounded-2xl border-0 px-5 py-4 outline-none" placeholder="טלפון" />
          <input className="rounded-2xl border-0 px-5 py-4 outline-none" placeholder="גיל הילד/ה" />
          <button type="button" onClick={openModal} className="rounded-2xl bg-[var(--dark)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="px-5 py-12 text-center lg:px-8">
      <p className="t-display text-3xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{getValue(data,"ctaTitle")}</p>
      <p className="mt-6 text-xs text-[var(--muted)]">© {new Date().getFullYear()}</p>
    </footer>`,
    },

    stoneOlive: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-white lg:px-8">
        <span className="t-display text-2xl tracking-wide">{getValue(data,"brandName")}</span>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] md:flex">
          <a href="#courses">{getValue(data,"navCourses")}</a>
          <a href="#contact">{getValue(data,"navContact")}</a>
        </nav>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 opacity-80">
        <img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover" />
        <img src={getValue(data,"sectionImage")} alt="" className="t-ken h-full w-full object-cover" style={{animationDelay:"2s"}} />
        <img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" style={{animationDelay:"4s"}} />
      </div>
      <div className="absolute inset-0 bg-[var(--bg)]/55" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-start justify-end px-5 pb-20 lg:px-8">
        <Reveal>
          <h1 className="t-display text-6xl font-bold leading-[0.95] text-[var(--dark)] md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="mt-8 bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>`,
      courses: `<section id="courses" data-template-section-type="courses" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 max-w-5xl space-y-8">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*100} className={\`t-hover grid items-center gap-6 md:grid-cols-2 \${i%2?"md:[&>div:first-child]:order-2":""}\`}>
            <div className={\`\${i===1?"md:translate-x-8":""} border border-[var(--p)]/30 bg-white p-8\`}>
              <h3 className="t-display text-3xl text-[var(--dark)]">{title}</h3>
              <p className="mt-3 text-[var(--muted)]">{text}</p>
            </div>
            <div className="h-48 overflow-hidden bg-[var(--surface)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--bg)] lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-14 max-w-5xl">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 rotate-12 bg-[var(--p)]/50" />
        {["חומר גלם","תרגול באטלייה","ביקורת עמיתים","תערוכה קטנה"].map((s,i) => (
          <Reveal key={s} delayMs={i*90} className={\`relative mb-10 flex \${i%2?"justify-start":"justify-end"}\`}>
            <div className="w-64 border border-[var(--p)] bg-[var(--dark)] p-5">
              <span className="text-[var(--p)]">0{i+1}</span>
              <p className="mt-2 text-xl font-bold">{s}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-16 h-[420px] max-w-4xl">
        {[["נועה",0],["איתי",1],["מיכל",2]].map(([n,i]) => (
          <Reveal key={n} delayMs={i*120} className="t-hover absolute w-48 overflow-hidden border-4 border-white shadow-lg" style={{top: i*40+"px", right: i*120+"px", zIndex: 3-i}}>
            <img src={getValue(data,"sectionImage")} alt="" className="h-56 w-full object-cover" />
            <p className="bg-white p-3 font-bold text-[var(--dark)]">{n}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="bg-[var(--p)] px-5 py-14 text-white lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 text-center">
        {${stats}.map(([n,l]) => (
          <div key={l}><div className="t-display text-4xl font-bold">{n}</div><div className="mt-1 text-xs opacity-80">{l}</div></div>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        {${reviews}.map(([text,name],i) => (
          <Reveal key={name} delayMs={i*100} className="mt-10 border-r-4 border-[var(--p)] pr-6">
            <p className="t-display text-2xl leading-10 text-[var(--dark)]">"{text}"</p>
            <p className="mt-3 text-sm text-[var(--muted)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-10 text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-6 grid grid-cols-[60px_1fr] gap-4">
            <span className="t-display text-4xl text-[var(--p)]">{i+1}</span>
            <div><p className="font-bold text-[var(--dark)]">{q}</p><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section id="contact" data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 border border-[var(--p)]/25 bg-white p-8 md:grid-cols-2 lg:p-12">
        <Reveal>
          <h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2>
          <p className="mt-4 text-[var(--muted)]">שעות הסטודיו</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--dark)]">
            <li>א׳–ה׳ · 10:00–20:00</li>
            <li>ו׳ · 09:00–13:00</li>
            <li>{getValue(data,"address")}</li>
          </ul>
        </Reveal>
        <form className="grid gap-3">
          <input className="border border-[var(--p)]/30 px-5 py-4 outline-none" placeholder="שם" />
          <input className="border border-[var(--p)]/30 px-5 py-4 outline-none" placeholder="טלפון" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
        <span className="t-display text-xl text-[var(--p)]">{getValue(data,"brandName")}</span>
        <span className="text-[var(--muted)]">© {new Date().getFullYear()}</span>
      </div>
    </footer>`,
    },

    steelLime: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b-2 border-[var(--p)] bg-[var(--dark)]">
      <div className="mx-auto flex max-w-7xl items-stretch lg:px-0">
        <div className="flex items-center bg-[var(--p)] px-5 py-3 text-sm font-black uppercase tracking-wider text-[var(--dark)]">{getValue(data,"brandName")}</div>
        <div className="flex flex-1 items-center justify-end gap-4 px-5 text-xs uppercase tracking-widest text-[var(--muted)]">
          <span className="hidden sm:inline">{getValue(data,"heroEyebrow")}</span>
          <button type="button" onClick={openModal} className="border border-[var(--p)] px-4 py-2 text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
        </div>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[90svh] overflow-hidden bg-[var(--bg)] px-5 py-20 lg:px-8">
      <div className="absolute inset-0 opacity-25"><img src={getValue(data,"heroImage")} alt="" className="t-ken h-full w-full object-cover grayscale" /></div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-4 text-7xl font-bold uppercase leading-[0.88] text-white md:text-9xl">{getValue(data,"brandName")}</h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-10 bg-[var(--p)] px-10 py-4 text-sm font-black uppercase text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold uppercase text-[var(--p)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-5xl space-y-4">
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*80} className="t-hover flex items-center gap-6 border-2 border-[var(--muted)]/30 bg-[var(--surface)] p-5" style={{clipPath:"polygon(0 0, 100% 0, 100% 85%, 96% 100%, 0 100%)"}}>
            <span className="t-display text-4xl text-[var(--p)]">0{i+1}</span>
            <div><h3 className="text-xl font-bold uppercase">{title}</h3><p className="text-sm text-[var(--muted)]">{text}</p></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="border-y-2 border-[var(--p)] bg-[var(--surface)] px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold uppercase">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4">
        {["אבחון חום","חישול ליבה","צינון תרגול","הקשחה בשטח"].map((s,i) => (
          <Reveal key={s} delayMs={i*90} className="t-hover min-w-[220px] shrink-0 border border-[var(--p)] p-6">
            <div className="mb-4 h-1 w-full bg-[var(--p)]" />
            <p className="text-xs text-[var(--p)]">STAGE {i+1}</p>
            <p className="mt-2 text-xl font-bold uppercase">{s}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold uppercase text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
        {[["רן כהן","COACH"],["דנה לוי","LEAD"],["עידו שמש","PRO"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*90} className="t-hover border-2 border-[var(--p)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden border border-[var(--p)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover grayscale" /></div>
              <div>
                <p className="text-[10px] text-[var(--p)]">ID · 00{i+1}</p>
                <p className="font-bold uppercase">{n}</p>
                <p className="text-xs text-[var(--muted)]">{r}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="bg-black px-5 py-12 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3">
        {${stats}.map(([n,l]) => (
          <div key={l} className="t-pulse border border-[var(--p)] bg-[var(--dark)] p-4 text-center">
            <div className="t-display text-3xl font-bold text-[var(--p)] md:text-5xl" style={{textShadow:"0 0 12px #A3E63588"}}>{n}</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--muted)]">{l}</div>
          </div>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="overflow-hidden border-y border-[var(--p)]/40 py-6">
      <div className="t-marquee flex gap-12 whitespace-nowrap text-sm uppercase tracking-wider text-[var(--p)]">
        {[...${reviews}, ...${reviews}].map(([text,name],i) => (
          <span key={i}><span className="text-white">{name}</span>: {text}</span>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal><h2 className="t-display mb-8 text-4xl font-bold uppercase text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-4 border-2 border-[var(--muted)]/40 bg-[var(--surface)]">
            <div className="flex items-start gap-3 p-5">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[var(--p)]" />
              <div><p className="font-bold uppercase">{q}</p><p className="mt-2 text-sm text-[var(--muted)]">{a}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-xl border-2 border-[var(--p)] p-8">
        <Reveal><h2 className="t-display text-3xl font-bold uppercase text-[var(--p)]">{getValue(data,"contactTitle")}</h2></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--muted)]/40 bg-transparent px-4 py-3 uppercase outline-none" placeholder="FULL NAME" />
          <input className="border border-[var(--muted)]/40 bg-transparent px-4 py-3 uppercase outline-none" placeholder="PHONE" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-black uppercase text-[var(--dark)]">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t-2 border-[var(--p)] px-5 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest">
        <span className="text-[var(--p)]">{getValue(data,"brandName")}</span>
        <span className="text-[var(--muted)]">{getValue(data,"ctaTitle")}</span>
        <button type="button" onClick={openModal} className="text-[var(--p)]">{getValue(data,"ctaButton")}</button>
      </div>
    </footer>`,
    },
    campusBlue: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="sticky top-0 z-50 border-b border-[var(--p)]/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border-2 border-[var(--p)] text-sm font-bold text-[var(--p)]">{getValue(data,"logoText")}</span>
          <div>
            <p className="t-display text-lg font-bold text-[var(--dark)]">{getValue(data,"brandName")}</p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Academic Tutoring</p>
          </div>
        </div>
        <button type="button" onClick={openModal} className="bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[88svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[var(--dark)]/55" />
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-5xl flex-col items-center justify-center px-5 text-center text-white">
        <Reveal variant="scale">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-4 text-6xl font-bold md:text-8xl">{getValue(data,"brandName")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={openModal} className="t-pulse bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/40 px-8 py-3.5 text-sm font-semibold">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </Reveal>
      </div>
    </section>`,
      courses: `<section data-template-section-type="courses" className="px-5 py-20 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-8 max-w-4xl overflow-hidden border border-[var(--p)]/20 bg-white">
        <div className="grid grid-cols-[1fr_100px_80px] bg-[var(--p)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">
          <span>מקצוע</span><span>רמה</span><span>ש״ס</span>
        </div>
        {[${items}].map(([title,text],i) => (
          <Reveal key={title} delayMs={i*70} className="t-hover grid grid-cols-[1fr_100px_80px] items-center border-t border-[var(--p)]/10 px-4 py-4">
            <div><p className="font-bold text-[var(--dark)]">{title}</p><p className="text-xs text-[var(--muted)]">{text}</p></div>
            <span className="text-sm text-[var(--p)]">{["5 יח׳","אקדמי","מתקדם"][i]}</span>
            <span className="font-bold text-[var(--dark)]">{[45,60,90][i]}</span>
          </Reveal>
        ))}
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="bg-white px-5 py-24 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="relative mx-auto mt-14 max-w-4xl">
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-[var(--p)]/30" />
        <div className="relative grid grid-cols-4 gap-2">
          {["אבחון","סמסטר א׳","סמסטר ב׳","בחינה"].map((s,i) => (
            <Reveal key={s} delayMs={i*90} className="text-center">
              <div className="t-pulse mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border-4 border-[var(--p)] bg-white text-sm font-bold text-[var(--p)]">{i+1}</div>
              <p className="text-sm font-bold text-[var(--dark)]">{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-10 max-w-4xl divide-y divide-[var(--p)]/15 border border-[var(--p)]/15 bg-white">
        {[["ד״ר יעל אברהם","מתמטיקה"],["פרופ׳ דן לוי","אנגלית"],["מיכל כץ","פסיכומטרי"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*80} className="t-hover flex items-center gap-5 p-5">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-[var(--bg)]"><img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover" /></div>
            <div className="flex-1"><p className="font-bold text-[var(--dark)]">{n}</p><p className="text-sm text-[var(--p)]">{r}</p></div>
            <span className="text-xs text-[var(--muted)]">קבלה</span>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="bg-[var(--dark)] px-5 py-14 text-white lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-8">
        {${stats}.map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-[var(--a)]">GPA / KPI</p>
            <div className="t-display text-5xl font-bold">{n}</div>
            <div className="text-sm text-white/70">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8">
      <Reveal><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        <div className="mx-auto mt-12 max-w-3xl space-y-12">
        {${reviews}.map(([text,name,role],i) => (
          <Reveal key={name} delayMs={i*100} className={\`\${i%2?"text-left":"text-right"}\`}>
            <p className="t-display text-3xl leading-snug text-[var(--p)]">"{text}"</p>
            <p className="mt-4 text-sm font-bold text-[var(--dark)]">{name} · <span className="font-normal text-[var(--muted)]">{role}</span></p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-8 text-center"><h2 className="t-display text-4xl font-bold text-[var(--dark)]">{getValue(data,"sectionSevenTitle")}</h2>
        <p className="text-sm text-[var(--muted)]">University Q&A</p></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-3 border border-[var(--p)]/20 p-5">
            <p className="font-bold text-[var(--dark)]">ש{i+1}. {q}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section data-template-section-type="contact" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-xl border border-[var(--p)]/25 bg-white p-8 shadow-sm">
        <Reveal><h2 className="t-display text-3xl font-bold text-[var(--dark)]">{getValue(data,"contactTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Campus enrollment</p></Reveal>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 px-5 py-4 outline-none" placeholder="טלפון" />
          <select className="border border-[var(--p)]/20 px-5 py-4 outline-none"><option>בחרו מקצוע</option><option>מתמטיקה</option><option>אנגלית</option><option>פסיכומטרי</option></select>
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 font-bold text-white">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--p)]/15 bg-[var(--dark)] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm">
        <span className="t-display text-xl">{getValue(data,"brandName")}</span>
        <span className="text-white/60">{getValue(data,"email")}</span>
        <span className="text-white/60">© {new Date().getFullYear()}</span>
      </div>
    </footer>`,
    },

    champagneNoir: {
      header: `<header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <nav className="hidden gap-8 text-[10px] uppercase tracking-[0.35em] text-[var(--a)] md:flex">
          <a href="#courses">{getValue(data,"navCourses")}</a>
          <a href="#contact">{getValue(data,"navContact")}</a>
        </nav>
        <button type="button" onClick={openModal} className="border border-[var(--p)] px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`,
      hero: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-black">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 text-center">
        <Reveal variant="fade">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-6 text-7xl font-semibold tracking-[0.08em] text-[var(--p)] md:text-9xl">{getValue(data,"brandName")}</h1>
          <div className="mx-auto mt-6 h-px w-24 bg-[var(--p)]" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[var(--muted)] md:text-base">{getValue(data,"heroSubtitle")}</p>
          <button type="button" onClick={openModal} className="t-pulse mt-10 border border-[var(--p)] bg-[var(--p)]/10 px-10 py-4 text-xs uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button>
        </Reveal>
      </div>
    </section>`,
      courses: `<section id="courses" data-template-section-type="courses" className="px-5 py-28 lg:px-8">
      <Reveal className="mx-auto max-w-6xl"><h2 className="t-display text-center text-4xl text-[var(--p)] md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2></Reveal>
      <div className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal variant="scale" className="relative min-h-[360px] overflow-hidden">
          <img src={getValue(data,"sectionImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 p-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--a)]">Featured</p>
            <h3 className="t-display mt-2 text-3xl text-white">{getValue(data,"itemOneTitle")}</h3>
            <p className="mt-2 max-w-md text-sm text-white/70">{getValue(data,"itemOneText")}</p>
          </div>
        </Reveal>
        <div className="space-y-6">
          {[${items}].slice(1).map(([title,text],i) => (
            <Reveal key={title} delayMs={i*100} className="t-hover border-b border-[var(--p)]/30 pb-6">
              <h3 className="t-display text-2xl text-[var(--p)]">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>`,
      curriculum: `<section data-template-section-type="curriculum" className="bg-[var(--surface)] px-5 py-28 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"sectionThreeTitle")}</h2></Reveal>
      <div className="mx-auto mt-16 max-w-4xl space-y-12">
        {[["I","פתיחה והקשר"],["II","עומק ותרגול"],["III","שיא ובמה"]].map(([n,t],i) => (
          <Reveal key={n} delayMs={i*100} className="t-hover flex items-baseline gap-8 border-b border-white/10 pb-8">
            <span className="t-display text-7xl text-[var(--p)]/40 md:text-9xl">{n}</span>
            <div><p className="text-xs uppercase tracking-[0.3em] text-[var(--a)]">Chapter</p><h3 className="mt-2 text-2xl text-white">{t}</h3></div>
          </Reveal>
        ))}
      </div>
    </section>`,
      instructors: `<section data-template-section-type="instructors" className="px-5 py-28 lg:px-8">
      <Reveal className="text-center"><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"sectionFourTitle")}</h2></Reveal>
      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
        {[["אלון","Story"],["נטע","Stage"],["יובל","Brand"]].map(([n,r],i) => (
          <Reveal key={n} delayMs={i*110} variant="scale" className="t-hover group text-center">
            <div className="relative mx-auto h-64 w-full overflow-hidden">
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_40%,#000_100%)]" />
              <img src={getValue(data,"sectionImage")} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <p className="t-display mt-4 text-2xl text-[var(--p)]">{n}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{r}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      stats: `<section data-template-section-type="stats" className="border-y border-[var(--p)]/20 px-5 py-16 lg:px-8">
      <div className="mx-auto flex max-w-4xl justify-between gap-6">
        {${stats}.map(([n,l],i) => (
          <Reveal key={l} delayMs={i*80} className="text-center">
            <div className="t-display text-3xl text-[var(--p)] md:text-4xl">{n}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>`,
      testimonials: `<section data-template-section-type="testimonials" className="relative overflow-hidden px-5 py-28 lg:px-8">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"sectionSixTitle")}</h2></Reveal>
        {${reviews}.slice(0,2).map(([text,name],i) => (
          <Reveal key={name} delayMs={i*120} className="mt-14">
            <p className="text-xl leading-10 text-white/90 md:text-2xl">"{text}"</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--a)]">{name}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      faq: `<section data-template-section-type="faq" className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-12 text-center"><h2 className="t-display text-3xl text-[var(--p)]">{getValue(data,"sectionSevenTitle")}</h2></Reveal>
        {${faqs}.map(([q,a],i) => (
          <Reveal key={q} delayMs={i*70} className="mb-8 text-center">
            <p className="text-sm font-medium text-white">{q}</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[var(--muted)]">{a}</p>
          </Reveal>
        ))}
      </div>
    </section>`,
      contact: `<section id="contact" data-template-section-type="contact" className="px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-md border border-[var(--p)]/40 p-10 text-center">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--a)]">Exclusive</p>
          <h2 className="t-display mt-3 text-3xl text-[var(--p)]">{getValue(data,"contactTitle")}</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"contactText")}</p>
        </Reveal>
        <form className="mt-8 grid gap-3 text-right">
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 text-sm outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/30 bg-transparent px-5 py-4 text-sm outline-none" placeholder="אימייל" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] py-4 text-xs font-bold uppercase tracking-[0.25em] text-black">{getValue(data,"contactButton")}</button>
        </form>
      </div>
    </section>`,
      footer: `<footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 py-12 text-center lg:px-8">
      <p className="t-display text-2xl tracking-[0.2em] text-[var(--p)]">{getValue(data,"brandName")}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">{getValue(data,"ctaTitle")}</p>
      <p className="mt-8 text-[10px] text-[var(--muted)]">© {new Date().getFullYear()}</p>
    </footer>`,
    },
  };

  return all[style] || all.cinemaTeal;
}

function pages(t) {
  const P = pascal(t.id);
  const L = styleLayouts(t.style);

  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { ${t.id}DefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { ${t.id}EditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const ${t.id}Pages = [{ id: "home", label: "בית", slug: "/" }];

type ${P}PagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (${t.id}DefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    ${L.header}
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    ${L.hero}
  );
}

function Courses({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    ${L.courses}
  );
}

function Curriculum({ data }: { data: Record<string, any> }) {
  return (
    ${L.curriculum}
  );
}

function Instructors({ data }: { data: Record<string, any> }) {
  return (
    ${L.instructors}
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  return (
    ${L.stats}
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  return (
    ${L.testimonials}
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  return (
    ${L.faq}
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    ${L.contact}
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    ${L.footer}
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/30 bg-[var(--surface)] p-8">
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="t-display text-3xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button type="button" className="bg-[var(--p)] py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Courses data={data} openModal={openModal} />
      <Curriculum data={data} />
      <Instructors data={data} />
      <Stats data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function ${P}Pages(props: ${P}PagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...${t.id}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${t.id}-preview" : "${t.id}"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ${t.id}EditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
`;
}

// Generate all templates
for (const t of TEMPLATES) {
  const dir = path.join(ROOT, t.id);
  write(path.join(dir, "defaultData.ts"), defaultData(t));
  write(path.join(dir, "editorCss.ts"), editorCss(t));
  write(path.join(dir, "schema.ts"), schema(t));
  write(path.join(dir, "preview.tsx"), preview(t));
  write(path.join(dir, "thumbnail.tsx"), thumbnail(t));
  write(path.join(dir, "meta.ts"), meta(t));
  write(path.join(dir, "pages.tsx"), pages(t));
  console.log("✓", t.id);
}

// AUTO-WIRE index.ts after jewelisTemplate
const indexPath = path.join(ROOT, "index.ts");
let index = fs.readFileSync(indexPath, "utf8");
const importLines = TEMPLATES.map((t) => `import { ${t.id}Template } from "./${t.id}/meta";`).join("\n");
const arrayLines = TEMPLATES.map((t) => `  ${t.id}Template,`).join("\n");

if (!index.includes("lectoraTemplate")) {
  index = index.replace(
    'import { jewelisTemplate } from "./jewelis/meta";',
    'import { jewelisTemplate } from "./jewelis/meta";\n' + importLines,
  );
  if (index.includes("  jewelisTemplate,\n];")) {
    index = index.replace("  jewelisTemplate,\n];", "  jewelisTemplate,\n" + arrayLines + "\n];");
  } else {
    index = index.replace("  jewelisTemplate,", "  jewelisTemplate,\n" + arrayLines);
  }
  fs.writeFileSync(indexPath, index, "utf8");
  console.log("✓ index.ts updated");
} else {
  console.log("index.ts already wired");
}

// AUTO-WIRE templateRendererRegistry.ts after jewelis imports + before closing };
const regPath = path.join(ROOT, "templateRendererRegistry.ts");
let reg = fs.readFileSync(regPath, "utf8");

const regImports = TEMPLATES.map((t) => {
  const P = pascal(t.id);
  return [
    `import ${P}Pages, { ${t.id}Pages } from "./${t.id}/pages";`,
    `import { ${t.id}EditorCss } from "./${t.id}/editorCss";`,
    `import { ${t.id}Schema } from "./${t.id}/schema";`,
    `import { ${t.id}DefaultData } from "./${t.id}/defaultData";`,
  ].join("\n");
}).join("\n\n");

const regEntries = TEMPLATES.map((t) => {
  const P = pascal(t.id);
  return `  ${t.id}: createRenderer({
    key: "${t.id}",
    name: "${t.name}",
    Component: ${P}Pages,
    pages: ${t.id}Pages,
    editorMode: "visual-react",
    schema: ${t.id}Schema as unknown as StudioTemplateRenderer["schema"],
    defaultData: ${t.id}DefaultData as unknown as Record<string, any>,
    editorCss: ${t.id}EditorCss,
  }),`;
}).join("\n\n");

if (!reg.includes('from "./lectora/pages"')) {
  reg = reg.replace(
    'import { jewelisDefaultData } from "./jewelis/defaultData";',
    'import { jewelisDefaultData } from "./jewelis/defaultData";\n\n' + regImports,
  );

  const closeMarker = "editorCss: jewelisEditorCss,\n  }),\n};";
  if (reg.includes(closeMarker)) {
    reg = reg.replace(closeMarker, `editorCss: jewelisEditorCss,\n  }),\n\n${regEntries}\n};`);
  } else {
    reg = reg.replace("\n};\n\nexport function getStudioTemplateRenderer", `\n\n${regEntries}\n};\n\nexport function getStudioTemplateRenderer`);
  }

  fs.writeFileSync(regPath, reg, "utf8");
  console.log("✓ templateRendererRegistry.ts updated");
} else {
  console.log("templateRendererRegistry.ts already wired");
}

console.log("Done. Generated", TEMPLATES.length, "education templates.");
