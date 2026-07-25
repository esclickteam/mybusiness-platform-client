#!/usr/bin/env node
/**
 * Generates 10 unique beauty / wellness website templates (multi-page).
 * Run: node scripts/generate-beauty-templates.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  {
    id: "velvetine",
    name: "Velvetine",
    logo: "V",
    niche: "luxury-spa",
    badge: "Premium",
    tagline: "ספא יוקרתי",
    description: "ספא לילות קטיפה: הירו דרמטי, טקסי טיפול, גלריה וחבילות פרימיום.",
    fonts: { display: "Cormorant+Garamond:wght@500;600;700", body: "Manrope:wght@400;500;600;700", displayCss: '"Cormorant Garamond"', bodyCss: '"Manrope"' },
    palette: { primary: "#C9A227", secondary: "#1A1210", accent: "#E8D5A3", background: "#120E0C", surface: "#1F1714", text: "#F5EDE3", muted: "#A89888", dark: "#0A0807" },
    heroImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85",
    style: "noirGold",
    copy: {
      heroTitle: "Velvetine\nשקט שנשמע כמו יוקרה.",
      heroSubtitle: "טקסי גוף ופנים באווירת לילה קטיפתית — שמנים נדירים, ידיים מדויקות, זמן בלי רעש.",
      heroPrimary: "קביעת תור",
      heroSecondary: "לטיפולים",
      phone: "03-610-1100",
      email: "concierge@velvetine.co.il",
      address: "רוטשילד 88, תל אביב",
      items: [
        ["עיסוי קטיפה", "90 דק׳ של שחרור עמוק עם שמני ארגן."],
        ["טקס פנים זהב", "מיקרו-טיפול לזוהר עדין ומתוחכם."],
        ["חבילת ערב", "סאונה, עיסוי וחליטת צמחים פרטית."],
      ],
    },
  },
  {
    id: "nailora",
    name: "Nailora",
    logo: "N",
    niche: "nail-salon",
    badge: "חדש",
    tagline: "סלון ציפורניים",
    description: "סלון ציפורניים צבעוני: גריד טיפוליים, לפני/אחרי ויומן תורים אינטראקטיבי.",
    fonts: { display: "Fredoka:wght@500;600;700", body: "Nunito:wght@400;600;700;800", displayCss: '"Fredoka"', bodyCss: '"Nunito"' },
    palette: { primary: "#FF4D8D", secondary: "#FFF5F8", accent: "#FFB3C7", background: "#FFF8FA", surface: "#FFFFFF", text: "#3D1F2E", muted: "#9A6B7C", dark: "#2A1220" },
    heroImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1400&q=85",
    style: "candyPop",
    copy: {
      heroTitle: "Nailora\nציפורניים שמדברות צבע.",
      heroSubtitle: "מניקור, פדיקור ונייל־ארט מדויק — סטייל מתוק, היגיינה ברזל, ותורים בלי המתנה מיותרת.",
      heroPrimary: "תפסו תור",
      heroSecondary: "לקטלוג",
      phone: "03-610-2200",
      email: "hello@nailora.co.il",
      address: "דיזנגוף 142, תל אביב",
      items: [
        ["ג׳ל בנייה", "צורה חזקה וברק שנשאר."],
        ["נייל־ארט", "איורים עדינים או סטייטמנט מלא."],
        ["פדיקור ספא", "רגליים רכות + לכה מושלמת."],
      ],
    },
  },
  {
    id: "blushlab",
    name: "Blushlab",
    logo: "B",
    niche: "makeup-studio",
    badge: "חדש",
    tagline: "סטודיו איפור",
    description: "סטודיו איפור מודרני: לוקים, צוות מאפרות, חבילות כלה ותיאום תורים.",
    fonts: { display: "Playfair+Display:wght@500;600;700", body: "Karla:wght@400;500;600;700", displayCss: '"Playfair Display"', bodyCss: '"Karla"' },
    palette: { primary: "#E11D48", secondary: "#1C0A10", accent: "#FB7185", background: "#14080C", surface: "#241018", text: "#FFF1F2", muted: "#E8A0AE", dark: "#0A0406" },
    heroImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=85",
    style: "roseAtelier",
    copy: {
      heroTitle: "Blushlab\nאיפור שנשאר בתמונה.",
      heroSubtitle: "לוקים לאירועים, כלות וצילומים — עור זוהר, קווים מדויקים, וסטייל שמתאים לפנים שלכן.",
      heroPrimary: "הזמינו איפור",
      heroSecondary: "ללוקים",
      phone: "03-610-3300",
      email: "studio@blushlab.co.il",
      address: "אלנבי 67, תל אביב",
      items: [
        ["איפור ערב", "זוהר מצלמה שנשאר עד הסוף."],
        ["כלת בוקר", "עור רך, עיניים מדויקות, דמעות ידידותיות."],
        ["שיעור איפור", "שגרה אישית שאתן יכולות לחזור עליה."],
      ],
    },
  },
  {
    id: "silkbar",
    name: "Silkbar",
    logo: "S",
    niche: "hair-salon",
    badge: "Premium",
    tagline: "מספרת בוטיק",
    description: "מספרת בוטיק: חיתוכים עיתונאיים, צבע, צוות ספרים ויומן תורים.",
    fonts: { display: "Libre+Baskerville:wght@400;700", body: "Figtree:wght@400;500;600;700", displayCss: '"Libre Baskerville"', bodyCss: '"Figtree"' },
    palette: { primary: "#0F766E", secondary: "#F3FAF9", accent: "#14B8A6", background: "#F7FCFB", surface: "#FFFFFF", text: "#134E4A", muted: "#5F8F8A", dark: "#042F2E" },
    heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1634449571010-02363d35f0f6?auto=format&fit=crop&w=1400&q=85",
    style: "shearInk",
    copy: {
      heroTitle: "Silkbar\nשיער שנופל נכון.",
      heroSubtitle: "חיתוך, צבע וטיפול קרטין בגישה עיתונאית נקייה — פחות רעש, יותר מבנה ותנועה.",
      heroPrimary: "קביעת תור",
      heroSecondary: "לשירותים",
      phone: "03-610-4400",
      email: "cut@silkbar.co.il",
      address: "שינקין 19, תל אביב",
      items: [
        ["חיתוך מדויק", "צורה שחיה גם ביום הרביעי."],
        ["צבע שורש", "גוון טבעי בלי הלם."],
        ["טיפול משי", "ברק רך ותחושת משי אמיתית."],
      ],
    },
  },
  {
    id: "lashora",
    name: "Lashora",
    logo: "L",
    niche: "lashes-brows",
    badge: "חדש",
    tagline: "ריסים וגבות",
    description: "סטודיו ריסים וגבות: הארכות, למינציה, מיפוי גבות ויומן תורים.",
    fonts: { display: "Italiana", body: "Mulish:wght@400;500;600;700", displayCss: '"Italiana"', bodyCss: '"Mulish"' },
    palette: { primary: "#A78BFA", secondary: "#0B0A12", accent: "#DDD6FE", background: "#0B0A12", surface: "#16141F", text: "#F5F3FF", muted: "#A5A0B8", dark: "#05040A" },
    heroImage: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1596465470483-940013d4f0c4?auto=format&fit=crop&w=1400&q=85",
    style: "lashNoir",
    note: "purple accent on dark — ok as not purple-on-white",
    copy: {
      heroTitle: "Lashora\nמבט שנפתח לאט.",
      heroSubtitle: "הארכות ריסים, למינציה ועיצוב גבות — מיפוי אישי, היגיינה קלינית, ותוצאה טבעית עד דרמטית.",
      heroPrimary: "תאמו תור",
      heroSecondary: "לטיפולים",
      phone: "03-610-5500",
      email: "look@lashora.co.il",
      address: "אבן גבירול 55, תל אביב",
      items: [
        ["קלאסיק ליין", "ריס על ריס למראה פתוח."],
        ["ווליום רך", "צפיפות עדינה בלי כובד."],
        ["למינציית גבות", "צורה קבועה ל־6 שבועות."],
      ],
    },
  },
  {
    id: "dermara",
    name: "Dermara",
    logo: "D",
    niche: "skincare-clinic",
    badge: "Premium",
    tagline: "קליניקת עור",
    description: "קליניקת עור נקייה: אבחונים, פרוטוקולים, צוות קוסמטיקאיות ויומן תורים.",
    fonts: { display: "Literata:opsz,wght@7..72,500;7..72,700", body: "Source+Sans+3:wght@400;500;600;700", displayCss: '"Literata"', bodyCss: '"Source Sans 3"' },
    palette: { primary: "#0D9488", secondary: "#F0FDFA", accent: "#2DD4BF", background: "#F7FFFD", surface: "#FFFFFF", text: "#134E4A", muted: "#5B8A84", dark: "#042F2E" },
    heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1400&q=85",
    style: "clinicMint",
    copy: {
      heroTitle: "Dermara\nעור שמדבר בריאות.",
      heroSubtitle: "פרוטוקולים מותאמים אישית — ניקוי עמוק, חומצות עדינות וליווי מדעי לשגרה שעובדת.",
      heroPrimary: "אבחון עור",
      heroSecondary: "לפרוטוקולים",
      phone: "03-610-6600",
      email: "care@dermara.co.il",
      address: "הברזל 10, רמת החייל",
      items: [
        ["אבחון דיגיטלי", "מיפוי עור והמלצות מדויקות."],
        ["טיפול חומצות", "חידוש עדין לפי סוג העור."],
        ["אנטי־אייג׳", "מיצוק וזוהר לאורך זמן."],
      ],
    },
  },
  {
    id: "waxelle",
    name: "Waxelle",
    logo: "W",
    niche: "waxing-studio",
    badge: "חדש",
    tagline: "סטודיו שעווה",
    description: "סטודיו שעווה נקי וידידותי: מחירון ברור, מדריך משך, ומערכת תורים.",
    fonts: { display: "Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700", body: "Work+Sans:wght@400;500;600;700", displayCss: '"Bricolage Grotesque"', bodyCss: '"Work Sans"' },
    palette: { primary: "#EA580C", secondary: "#FFF7ED", accent: "#FB923C", background: "#FFFBF5", surface: "#FFFFFF", text: "#431407", muted: "#9A6B4F", dark: "#1C0A04" },
    heroImage: "https://images.unsplash.com/photo-1519415387724-a480699c50c0?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1400&q=85",
    style: "sandBloom",
    copy: {
      heroTitle: "Waxelle\nחלק. מהיר. בלי דרמה.",
      heroSubtitle: "הסרת שיער מקצועית לנשים וגברים — טכניקה עדינה, סטריליות מלאה, ותוצאה חלקה לשבועות.",
      heroPrimary: "קבעו תור",
      heroSecondary: "למחירון",
      phone: "03-610-7700",
      email: "smooth@waxelle.co.il",
      address: "בוגרשוב 33, תל אביב",
      items: [
        ["רגליים מלאות", "שעווה רכה ותוצאה אחידה."],
        ["ברזילאי", "טכניקה מדויקת ורגישה."],
        ["פנים מדויק", "שפם, סנטר וקווי מתאר."],
      ],
    },
  },
  {
    id: "glowhaus",
    name: "Glowhaus",
    logo: "G",
    niche: "beauty-lounge",
    badge: "Premium",
    tagline: "טרקלין יופי",
    description: "טרקלין יופי אורבני: חבילות זוהר, צוות רב־תחומי וחוויית תורים סלון.",
    fonts: { display: "Archivo:wght@600;700;800", body: "DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700", displayCss: '"Archivo"', bodyCss: '"DM Sans"' },
    palette: { primary: "#22D3EE", secondary: "#071521", accent: "#67E8F9", background: "#061018", surface: "#0D1F2D", text: "#E0F2FE", muted: "#7DA4B8", dark: "#030A10" },
    heroImage: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1470259078422-826894b66757?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1400&q=85",
    style: "neonLounge",
    copy: {
      heroTitle: "Glowhaus\nזוהר של עיר בלילה.",
      heroSubtitle: "סלון רב־תחומי — עור, שיער, גבות ואיפור — במקום אחד עם וייב טרקלין וטיפולים חדים.",
      heroPrimary: "הזמנת תור",
      heroSecondary: "לחבילות",
      phone: "03-610-8800",
      email: "glow@glowhaus.co.il",
      address: "נמל תל אביב 12",
      items: [
        ["Glow Facial", "זוהר מיידי לפני יציאה."],
        ["Blowout Lounge", "שיער מושלם ב־45 דקות."],
        ["Night Out Set", "גבות + איפור קליל."],
      ],
    },
  },
  {
    id: "petaluxe",
    name: "Petaluxe",
    logo: "P",
    niche: "bridal-beauty",
    badge: "Premium",
    tagline: "יופי לכלות",
    description: "יופי לכלות: ניסיונות, לוקים, צוות כלה ויומן חזרות ותורים.",
    fonts: { display: "Great+Vibes", body: "Lora:wght@400;500;600;700", displayCss: '"Great Vibes"', bodyCss: '"Lora"' },
    palette: { primary: "#BE185D", secondary: "#FDF2F8", accent: "#F9A8D4", background: "#FFF5F9", surface: "#FFFFFF", text: "#4A044E", muted: "#9D6B8A", dark: "#500724" },
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1595476108010-b4d1f595b71b?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85",
    style: "bridalPearl",
    copy: {
      heroTitle: "Petaluxe\nהיום הכי יפה — בעדינות.",
      heroSubtitle: "איפור ושיער לכלות ולמלוות — ניסיון מקדים, לוק שנשאר בתמונות, וליווי רגוע ביום האירוע.",
      heroPrimary: "תאמו ניסיון",
      heroSecondary: "לחבילות כלה",
      phone: "03-610-9900",
      email: "bride@petaluxe.co.il",
      address: "הארבעה 28, תל אביב",
      items: [
        ["חבילת כלה", "ניסיון + יום האירוע מלא."],
        ["מלוות כלה", "לוקים מתואמים למשפחה."],
        ["שיער אסוף", "מבנה אלגנטי לכל היום."],
      ],
    },
  },
  {
    id: "formella",
    name: "Formella",
    logo: "F",
    niche: "body-treatments",
    badge: "חדש",
    tagline: "טיפולי גוף",
    description: "סטודיו טיפולי גוף: עיצוב, ניקוז, חבילות מסלול ויומן תורים מקצועי.",
    fonts: { display: "Space+Grotesk:wght@500;600;700", body: "Schibsted+Grotesk:wght@400;500;600;700", displayCss: '"Space Grotesk"', bodyCss: '"Schibsted Grotesk"' },
    palette: { primary: "#84CC16", secondary: "#0A0F08", accent: "#A3E635", background: "#0B1009", surface: "#152014", text: "#F7FEE7", muted: "#9CA88A", dark: "#050705" },
    heroImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=85",
    img3: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1400&q=85",
    style: "sculptInk",
    copy: {
      heroTitle: "Formella\nגוף בתנועה נכונה.",
      heroSubtitle: "טיפולי עיצוב, ניקוז לימפטי והתאוששות — מסלולים מדידים עם תוצאה שמרגישים על העור.",
      heroPrimary: "התחלת מסלול",
      heroSecondary: "לטיפולים",
      phone: "03-610-1010",
      email: "body@formella.co.il",
      address: "יגאל אלון 98, תל אביב",
      items: [
        ["ניקוז לימפטי", "הקלה בנפיחות ותחושת קלילות."],
        ["עיצוב אנטי־צלוליט", "פרוטוקול ממוקד לאזורים."],
        ["התאוששות ספורט", "שחרור שריר אחרי עומס."],
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
  const enrich = (text) => `${text} כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.`;
  const aboutStoryText = `${t.name} נבנה כמקום שמחבר בין טיפול מקצועי לחוויה רגועה: כל ביקור מתחיל בשיחה קצרה, ממשיך בבחירת פרוטוקול מדויק ומסתיים בהנחיות ברורות להמשך בבית. הצוות מתעד העדפות, רגישויות ותוצאות כדי שכל מפגש הבא יהיה אישי יותר, נעים יותר ומדויק יותר.`;
  const servicesIntroText = `קטלוג הטיפולים של ${t.name} מפרט מה מקבלים בכל שירות, כמה זמן כדאי לפנות, למי הוא מתאים ואילו תוספות יכולות לשדרג את התוצאה. המטרה היא שתבחרו טיפול מתוך ידע מלא ולא מתוך ניחוש.`;
  return `export const ${t.id}DefaultData = {
  templateId: "${t.id}",
  name: "${t.name}",
  brandName: "${t.name}",
  logoText: "${t.logo}",
  navHome: "בית",
  navAbout: "אודות",
  navServices: "שירותים",
  navBooking: "תורים",
  heroEyebrow: "${t.tagline}",
  heroTitle: ${JSON.stringify(c.heroTitle)},
  heroSubtitle: ${JSON.stringify(c.heroSubtitle)},
  heroPrimaryButton: "${c.heroPrimary}",
  heroSecondaryButton: "${c.heroSecondary}",
  heroImage: "${t.heroImage}",
  sectionImage: "${t.img2}",
  galleryImage1: "${t.heroImage}",
  galleryImage2: "${t.img2}",
  galleryImage3: "${t.img3}",
  galleryImage4: "${t.img2}",
  aboutImage: "${t.img3}",
  mapImage: "${t.img2}",
  heroStatOne: "4.9",
  heroStatOneLabel: "דירוג",
  heroStatTwo: "12k+",
  heroStatTwoLabel: "טיפולים",
  heroStatThree: "8",
  heroStatThreeLabel: "שנות ניסיון",
  sectionTwoTitle: "הטיפולים שלנו",
  sectionThreeTitle: "הטקס שלנו",
  sectionFourTitle: "רגעים מהסטודיו",
  sectionFiveTitle: "הצוות",
  sectionSixTitle: "מה הלקוחות מספרות",
  sectionSevenTitle: "חבילות",
  sectionEightTitle: "למה אנחנו",
  bookingTeaserTitle: "מוכנות לתור הבא?",
  aboutHeroTitle: "הסיפור מאחורי ${t.name}",
  aboutStoryTitle: "מאיפה הכל התחיל",
  aboutStoryText: ${JSON.stringify(aboutStoryText)},
  spaceTourTitle: "סיור בחלל",
  spaceTourText: "החלל בנוי כשביל חוויה: קבלת פנים שקטה, אזורי טיפול מוארים נכון, עמדות עבודה סטריליות ופינת סיום עם מראה, מוצרים והסבר אישי.",
  valuesTitle: "הערכים שמנחים אותנו",
  valuesText: "דיוק, היגיינה, שקיפות ורוגע הם לא סיסמאות אצלנו — הם מופיעים בלוח התורים, בבחירת החומרים, בקצב העבודה ובשיחה שאחרי הטיפול.",
  specialistsTitle: "המומחיות שלנו",
  specialistsText: "מאחורי כל טיפול עומדת מומחית עם הכשרה, תיק עבודות ותהליך עבודה ברור. אנחנו מחלקות תפקידים לפי ניסיון, רגישות וסוג התוצאה המבוקשת.",
  certsTitle: "הסמכות והכשרות",
  certsText: "הצוות עובר רענון חיטוי, הכשרות מוצר והדרכות בטיחות לאורך השנה, כדי לשמור על תוצאה עקבית ועל סביבת טיפול בטוחה.",
  timelineTitle: "ציר הזמן",
  pressTitle: "מה כותבים עלינו",
  pressText: "לקוחות ועורכות יופי מתארות בעיקר את השילוב בין שקט, סדר, דיוק ותוצאה שנראית טבעית גם אחרי כמה ימים.",
  aboutCtaTitle: "בואו להכיר מקרוב",
  servicesHeroTitle: "קטלוג טיפולים",
  servicesIntroText: ${JSON.stringify(servicesIntroText)},
  catalogTitle: "כל השירותים",
  catalogText: "כל שירות מוצג עם משך, הכנה, תוצאה צפויה ותוספות אפשריות כדי לעזור לכן לבחור נכון עוד לפני התור.",
  featuredTitle: "טיפול הדגל",
  featuredTreatmentText: "טיפול הדגל משלב אבחון אישי, הכנת אזור מדויקת, עבודה בשכבות וסיום שמותאם לשגרת הבית. הוא מתאים למי שרוצה תוצאה מורגשת בלי לוותר על תחושה טבעית.",
  durationTitle: "מדריך משך טיפול",
  durationText: "משך הטיפול כולל זמן התאמה, הכנה וסיכום. אנחנו משאירות מרווחים בין תורים כדי לאפשר עבודה רגועה ולא לדחוס לקוחות.",
  addonsTitle: "תוספות מומלצות",
  addonsText: "תוספות קטנות יכולות לשנות את החוויה: מסכה מרגיעה, עיסוי קצר, אמפולה ממוקדת או צילום תוצאה לתיעוד אישי.",
  beforeAfterTitle: "לפני ואחרי",
  beforeAfterText: "ההשוואה מציגה שינוי אמיתי ועדין: ניקיון, סימטריה, ברק או מרקם טוב יותר — בלי הבטחות מוגזמות ועם הסבר איך לשמור על התוצאה.",
  priceTitle: "מחירון שקוף",
  priceText: "המחירים כוללים את זמן הייעוץ, חומרי העבודה והנחיות ההמשך. לפני כל תוספת תקבלו הסבר ואישור.",
  serviceFaqTitle: "שאלות על טיפולים",
  bookCtaTitle: "רוצות לקבוע?",
  bookingHeroTitle: "קביעת תור",
  calendarTitle: "בחרו יום ושעה",
  servicePickerTitle: "בחירת טיפול",
  specialistTitle: "בחירת מומחית",
  hoursTitle: "שעות פעילות",
  policiesTitle: "מדיניות ביטולים",
  confirmTitle: "פרטי יצירת קשר",
  locationTitle: "איך מגיעים",
  bookingFaqTitle: "שאלות על תורים",
  itemOneTitle: ${JSON.stringify(i1[0])},
  itemOneText: ${JSON.stringify(enrich(i1[1]))},
  itemTwoTitle: ${JSON.stringify(i2[0])},
  itemTwoText: ${JSON.stringify(enrich(i2[1]))},
  itemThreeTitle: ${JSON.stringify(i3[0])},
  itemThreeText: ${JSON.stringify(enrich(i3[1]))},
  reviewOneText: "יצאתי עם תחושה שנדיר למצוא — מקצועיות אמיתית ואווירה שנשארת איתך.",
  reviewOneName: "נועה שחר",
  reviewOneRole: "לקוחה קבועה",
  reviewTwoText: "התיאום היה פשוט, הטיפול מדויק, והתוצאה בדיוק כמו שרציתי.",
  reviewTwoName: "מיכל רוזן",
  reviewTwoRole: "כלה",
  reviewThreeText: "מקום שנעים לחזור אליו. מרגישות שמקשיבים באמת.",
  reviewThreeName: "דנה לוי",
  reviewThreeRole: "לקוחה",
  faqOneQuestion: "כמה זמן מראש כדאי לקבוע?",
  faqOneAnswer: "מומלץ שבוע–שבועיים מראש, ובסופי שבוע אפילו קצת יותר.",
  faqTwoQuestion: "מה מדיניות הביטול?",
  faqTwoAnswer: "ניתן לבטל או לשנות עד 24 שעות לפני התור ללא חיוב.",
  faqThreeQuestion: "יש חניה?",
  faqThreeAnswer: "כן — חניון קרוב או חניה ברחוב לפי המיקום. נפרט בהודעת האישור.",
  contactTitle: "השאירו פרטים",
  contactText: "נחזור אליכן לאישור התור בהקדם.",
  contactButton: "שליחת בקשה",
  phone: "${c.phone}",
  email: "${c.email}",
  address: "${c.address}",
  hours: "א׳–ה׳ 09:00–20:00 · ו׳ 09:00–14:00",
  ctaTitle: "הרגע שלכן מתחיל כאן.",
  ctaText: "בחרו טיפול, יום ושעה — ואנחנו נדאג לשאר.",
  ctaButton: "${c.heroPrimary}",
  packageOneTitle: "חבילת Soft",
  packageOnePrice: "₪390",
  packageOneText: "טיפול יחיד עם ייעוץ פתיחה, התאמת חומרי עבודה וסיכום כתוב להמשך בבית.",
  packageTwoTitle: "חבילת Glow",
  packageTwoPrice: "₪890",
  packageTwoText: "שלושה טיפולים מתוכננים מראש, מעקב תוצאה בין ביקורים ותזכורות לשמירה על רצף.",
  packageThreeTitle: "חבילת Ritual",
  packageThreePrice: "₪1,490",
  packageThreeText: "יום טיפוח מלא עם תוספות, הפסקת שתייה, צילום תוצאה ותיאום תור המשך לפי הצורך.",
  policyText: "ביטול עד 24 שעות · איחור מעל 15 דק׳ עלול לקצר את הטיפול · בריאות מעל הכל.",
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
  font-family: ${f.displayCss}, serif;
}

@keyframes ${id}-ken {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
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
  50% { transform: translateY(-10px); }
}
@keyframes ${id}-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.9; }
}
@keyframes ${id}-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes ${id}-glow {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p) 35%, transparent); }
  50% { box-shadow: 0 0 28px 2px color-mix(in srgb, var(--p) 45%, transparent); }
}
@keyframes ${id}-scalein {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

[data-template-id="${id}"] .t-ken,
[data-template-id="${id}-preview"] .t-ken { animation: ${id}-ken 18s ease-in-out infinite alternate; }
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
[data-template-id="${id}-preview"] .t-marquee { animation: ${id}-marquee 30s linear infinite; width: max-content; }
[data-template-id="${id}"] .t-float,
[data-template-id="${id}-preview"] .t-float { animation: ${id}-float 6s ease-in-out infinite; }
[data-template-id="${id}"] .t-pulse,
[data-template-id="${id}-preview"] .t-pulse { animation: ${id}-pulse 2.8s ease-in-out infinite; }
[data-template-id="${id}"] .t-shimmer,
[data-template-id="${id}-preview"] .t-shimmer {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 35%, transparent), transparent);
  background-size: 200% 100%;
  animation: ${id}-shimmer 2.8s linear infinite;
}
[data-template-id="${id}"] .t-glow,
[data-template-id="${id}-preview"] .t-glow { animation: ${id}-glow 3.2s ease-in-out infinite; }
[data-template-id="${id}"] .t-scalein,
[data-template-id="${id}-preview"] .t-scalein { animation: ${id}-scalein 0.8s cubic-bezier(0.22,1,0.36,1) both; }
[data-template-id="${id}"] .t-hover,
[data-template-id="${id}-preview"] .t-hover {
  transition: transform .45s cubic-bezier(0.22,1,0.36,1), border-color .3s ease, background .3s ease;
}
[data-template-id="${id}"] .t-hover:hover,
[data-template-id="${id}-preview"] .t-hover:hover { transform: translateY(-5px); }

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
  [data-template-id="${id}"] .t-shimmer,
  [data-template-id="${id}-preview"] .t-shimmer,
  [data-template-id="${id}"] .t-glow,
  [data-template-id="${id}-preview"] .t-glow,
  [data-template-id="${id}"] .t-scalein,
  [data-template-id="${id}-preview"] .t-scalein,
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
    { key: "sectionTwoTitle", label: "כותרת שירותים", type: "text" },
    { key: "bookingHeroTitle", label: "כותרת תורים", type: "text" },
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
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, ${p.primary}55, transparent 42%), linear-gradient(135deg, ${p.surface}, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "${p.primary}" }}>${t.tagline}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: ${JSON.stringify(t.fonts.displayCss)} }}>${t.name}</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">${t.copy.heroSubtitle.slice(0, 72)}…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "${p.primary}" }} />
      </div>
    </div>
  );
}
`;
}

function meta(t) {
  const P = pascal(t.id);
  const p = t.palette;
  const blocks = ["header","hero","servicesPreview","ritual","gallery","team","testimonials","packages","whyUs","bookingTeaser","footer","aboutHero","story","spaceTour","values","specialistsDeep","certifications","timeline","pressQuotes","aboutCta","servicesHero","catalog","featuredTreatment","durationGuide","addons","beforeAfter","priceTable","serviceFaq","bookCta","bookingHero","booking","servicePicker","specialistPicker","hoursPanel","policies","confirmationForm","locationMap","bookingFaq"];
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
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
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
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
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

const STYLE_ORDER = [
  "noirGold",
  "candyPop",
  "roseAtelier",
  "shearInk",
  "lashNoir",
  "clinicMint",
  "sandBloom",
  "neonLounge",
  "bridalPearl",
  "sculptInk",
];

const CONTENT_ROLE_ORDER = [
  "servicesPreview",
  "ritual",
  "gallery",
  "team",
  "testimonials",
  "packages",
  "whyUs",
  "bookingTeaser",
  "aboutHero",
  "story",
  "spaceTour",
  "values",
  "specialistsDeep",
  "certifications",
  "timeline",
  "pressQuotes",
  "aboutCta",
  "servicesHero",
  "catalog",
  "featuredTreatment",
  "durationGuide",
  "addons",
  "beforeAfter",
  "priceTable",
  "serviceFaq",
  "bookCta",
  "bookingHero",
  "calendar",
  "servicePicker",
  "specialistPicker",
  "hoursPanel",
  "policies",
  "confirmationForm",
  "locationMap",
  "bookingFaq",
];

const STYLE_LABELS = {
  noirGold: { marker: "NOIR", frame: "סוויטה פרטית", nav: "border-b border-[var(--p)]/25 bg-[var(--dark)]/90 text-[var(--text)] backdrop-blur-xl", button: "bg-[var(--p)] text-[var(--dark)]", accent: "text-[var(--p)]" },
  candyPop: { marker: "POP", frame: "סטודיו צבע", nav: "bg-[var(--bg)]/95 text-[var(--text)] shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur", button: "rounded-full bg-[var(--p)] text-white", accent: "text-[var(--p)]" },
  roseAtelier: { marker: "ATELIER", frame: "איפור מערכת", nav: "absolute inset-x-0 top-0 z-50 text-white", button: "border border-white/50 text-white", accent: "text-[var(--a)]" },
  shearInk: { marker: "CUT", frame: "מספרה עיתונאית", nav: "border-b border-[var(--p)]/20 bg-[var(--surface)]/95 text-[var(--text)] backdrop-blur-xl", button: "bg-[var(--p)] text-white", accent: "text-[var(--p)]" },
  lashNoir: { marker: "LASH", frame: "חדר מבט", nav: "bg-[var(--dark)]/95 text-[var(--text)]", button: "border border-[var(--p)] text-[var(--p)]", accent: "text-[var(--a)]" },
  clinicMint: { marker: "CLINIC", frame: "קליניקה מדויקת", nav: "bg-[var(--surface)]/95 text-[var(--text)] shadow-sm backdrop-blur", button: "rounded-xl bg-[var(--p)] text-white", accent: "text-[var(--p)]" },
  sandBloom: { marker: "WAX", frame: "סטודיו מהיר", nav: "border-b-4 border-[var(--p)] bg-[var(--bg)] text-[var(--text)]", button: "bg-[var(--p)] text-white", accent: "text-[var(--p)]" },
  neonLounge: { marker: "NEON", frame: "טרקלין לילה", nav: "bg-[var(--dark)]/85 text-[var(--text)] backdrop-blur-xl", button: "t-shimmer bg-[var(--p)] text-[var(--dark)]", accent: "text-[var(--p)]" },
  bridalPearl: { marker: "PEARL", frame: "כלה רגועה", nav: "bg-[var(--bg)]/90 text-[var(--text)] backdrop-blur", button: "bg-[var(--p)] text-white", accent: "text-[var(--p)]" },
  sculptInk: { marker: "FORM", frame: "מעבדת גוף", nav: "border-b border-[var(--p)]/30 bg-[var(--bg)] text-[var(--text)]", button: "bg-[var(--p)] text-[var(--dark)]", accent: "text-[var(--p)]" },
};

function navItems() {
  return `[{"id":"home","label":getValue(data,"navHome")||"בית"},{"id":"about","label":getValue(data,"navAbout")||"אודות"},{"id":"services","label":getValue(data,"navServices")||"שירותים"},{"id":"booking","label":getValue(data,"navBooking")||"תורים"}]`;
}

function serviceItems(extra = false) {
  return `[[getValue(data,"itemOneTitle"),getValue(data,"itemOneText"),"45-75 דק׳","01"],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText"),"60-90 דק׳","02"],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText"),"30-60 דק׳","03"]${extra ? `,["ייעוץ והתאמה",getValue(data,"servicesIntroText"),"15 דק׳","04"]` : ""}]`;
}

function reviewItems() {
  return `[[getValue(data,"reviewOneText"),getValue(data,"reviewOneName"),getValue(data,"reviewOneRole")],[getValue(data,"reviewTwoText"),getValue(data,"reviewTwoName"),getValue(data,"reviewTwoRole")],[getValue(data,"reviewThreeText"),getValue(data,"reviewThreeName"),getValue(data,"reviewThreeRole")]]`;
}

function packageItems() {
  return `[[getValue(data,"packageOneTitle"),getValue(data,"packageOnePrice"),getValue(data,"packageOneText")],[getValue(data,"packageTwoTitle"),getValue(data,"packageTwoPrice"),getValue(data,"packageTwoText")],[getValue(data,"packageThreeTitle"),getValue(data,"packageThreePrice"),getValue(data,"packageThreeText")]]`;
}

function imageItems() {
  return `[getValue(data,"galleryImage1"),getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"galleryImage4")]`;
}

function faqItems() {
  return `[[getValue(data,"faqOneQuestion"),getValue(data,"faqOneAnswer")],[getValue(data,"faqTwoQuestion"),getValue(data,"faqTwoAnswer")],[getValue(data,"faqThreeQuestion"),getValue(data,"faqThreeAnswer")]]`;
}

function statItems() {
  return `[[getValue(data,"heroStatOne"),getValue(data,"heroStatOneLabel")],[getValue(data,"heroStatTwo"),getValue(data,"heroStatTwoLabel")],[getValue(data,"heroStatThree"),getValue(data,"heroStatThreeLabel")]]`;
}

function sectionAttrs(role) {
  if (role === "calendar") {
    return `data-section-kind="booking" data-bizuply-block="booking" data-template-section-type="booking"`;
  }
  return `data-template-section-type="${role}" data-section-kind="${role}"`;
}

function framedSection(role, styleName, styleIndex, body) {
  const labels = STYLE_LABELS[styleName];
  const roleIndex = CONTENT_ROLE_ORDER.indexOf(role);
  const frameIndex = (styleIndex + Math.max(roleIndex, 0)) % 10;
  const attrs = sectionAttrs(role);
  const signature = `${styleName}-${role}-frame-${frameIndex}`;
  const outer = `beauty-${signature}`;
  const eyebrow = `<p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--p)]">${labels.marker} / ${role}</p>`;
  const frameNote = `<span className="text-xs text-[var(--muted)]">${labels.frame}</span>`;
  switch (frameIndex) {
    case 0:
      return `<section ${attrs} className="${outer} relative isolate overflow-hidden px-5 py-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--p)_28%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl">
          ${eyebrow}
          ${body}
        </div>
      </section>`;
    case 1:
      return `<section ${attrs} className="${outer} px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit"><div className="t-shimmer mb-5 h-px w-32 bg-[var(--p)]" />${eyebrow}<div className="mt-6 t-display text-5xl leading-none text-[var(--p)]">${String(frameIndex + 1).padStart(2, "0")}</div></aside>
          <div>${body}</div>
        </div>
      </section>`;
    case 2:
      return `<section ${attrs} className="${outer} overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] border border-[var(--p)]/25 bg-[var(--surface)] px-6 py-14 shadow-2xl md:px-12">
          ${eyebrow}
          ${body}
        </div>
      </section>`;
    case 3:
      return `<section ${attrs} className="${outer} px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 md:order-1">${body}</div>
          <div className="order-1 flex items-start justify-between border-r-4 border-[var(--p)] pr-5 md:order-2"><div>${eyebrow}</div>${frameNote}</div>
        </div>
      </section>`;
    case 4:
      return `<section ${attrs} className="${outer} relative overflow-hidden bg-[var(--dark)] px-5 py-24 text-[var(--text)] lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--p)_18%,transparent),transparent)]" />
        <div className="relative mx-auto max-w-7xl border border-[var(--p)]/45 p-6 shadow-[0_0_44px_color-mix(in_srgb,var(--p)_18%,transparent)] md:p-10">
          ${eyebrow}
          ${body}
        </div>
      </section>`;
    case 5:
      return `<section ${attrs} className="${outer} bg-[var(--bg)] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--p)]/20 bg-[var(--surface)] p-7 shadow-xl md:p-12">
          <div className="mb-8 flex items-center gap-3"><span className="t-pulse h-2.5 w-2.5 rounded-full bg-[var(--p)]" />${eyebrow}</div>
          ${body}
        </div>
      </section>`;
    case 6:
      return `<section ${attrs} className="${outer} overflow-hidden px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.85fr_1.15fr_0.55fr]">
          <div className="min-h-28 bg-[var(--p)]/15 p-5">${eyebrow}</div>
          <div className="bg-[var(--surface)] p-6 md:p-10">${body}</div>
          <div className="t-float hidden border border-[var(--p)]/35 p-5 md:block">${frameNote}</div>
        </div>
      </section>`;
    case 7:
      return `<section ${attrs} className="${outer} px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl border-y border-[var(--p)]/35 py-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end">${eyebrow}<div className="h-px bg-[var(--p)]/30" />${frameNote}</div>
          ${body}
        </div>
      </section>`;
    case 8:
      return `<section ${attrs} className="${outer} bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a)_16%,transparent),transparent)] px-5 py-24 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-8 h-16 w-px bg-[var(--p)]" />
          ${eyebrow}
          ${body}
        </div>
      </section>`;
    default:
      return `<section ${attrs} className="${outer} px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="font-mono text-sm text-[var(--p)]">${labels.marker}<div className="mt-3 h-24 w-px bg-[var(--p)]/50" /></div>
            <div className="border-l border-[var(--p)]/30 pl-0 lg:pl-8">${body}</div>
          </div>
        </div>
      </section>`;
  }
}

function buildHeader(styleName, styleIndex) {
  const labels = STYLE_LABELS[styleName];
  const nav = navItems();
  const positions = [
    "sticky top-0 z-50",
    "sticky top-0 z-50 rounded-b-[2rem]",
    "absolute inset-x-0 top-0 z-50",
    "sticky top-0 z-50",
    "sticky top-0 z-50",
    "sticky top-0 z-50",
    "sticky top-0 z-50",
    "sticky top-0 z-50",
    "sticky top-0 z-50",
    "sticky top-0 z-50",
  ];
  if (styleIndex === 0) {
    return `<header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="${positions[styleIndex]} ${labels.nav}">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center bg-[var(--p)] text-sm font-bold text-[var(--dark)]">{getValue(data,"logoText")}</span><span className="t-display text-3xl text-[var(--p)]">{getValue(data,"brandName")}</span></button>
        <nav className="hidden gap-6 text-sm md:flex">{${nav}.map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>))}</nav>
        <button type="button" onClick={() => goTo("booking")} className="t-pulse px-5 py-2.5 text-sm font-bold ${labels.button}">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`;
  }
  if (styleIndex === 1) {
    return `<header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="${positions[styleIndex]} ${labels.nav}">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={() => goTo("home")} className="t-display text-3xl font-bold text-[var(--p)]">{getValue(data,"brandName")}</button>
        <nav className="flex flex-wrap justify-center gap-2">{${nav}.map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={"rounded-full px-3 py-1.5 text-sm " + (currentPage===p.id ? "bg-[var(--p)] text-white" : "bg-[var(--surface)] text-[var(--muted)]")}>{p.label}</button>))}</nav>
        <button type="button" onClick={() => goTo("booking")} className="px-6 py-2 text-sm font-bold ${labels.button}">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`;
  }
  if (styleIndex === 2) {
    return `<header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="${positions[styleIndex]} ${labels.nav}">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-6 lg:px-8">
        <button type="button" onClick={() => goTo("home")} className="justify-self-start t-display text-4xl">{getValue(data,"brandName")}</button>
        <nav className="hidden justify-self-center gap-5 text-sm lg:flex">{${nav}.map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-white/75"}>{p.label}</button>))}</nav>
        <button type="button" onClick={() => goTo("booking")} className="justify-self-end px-5 py-2 text-xs font-bold uppercase tracking-widest ${labels.button}">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`;
  }
  if (styleIndex === 3) {
    return `<header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="${positions[styleIndex]} ${labels.nav}">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-3 lg:px-8">
        <nav className="hidden justify-self-start gap-5 text-sm md:flex">{${nav}.map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "font-bold text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>))}</nav>
        <button type="button" onClick={() => goTo("home")} className="t-display justify-self-center text-2xl font-bold">{getValue(data,"brandName")}</button>
        <button type="button" onClick={() => goTo("booking")} className="justify-self-end px-4 py-2 text-sm font-bold ${labels.button}">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>`;
  }
  return `<header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="${positions[styleIndex]} ${labels.nav}">
    <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-4 lg:px-8">
      <button type="button" onClick={() => goTo("home")} className="t-display text-xl font-bold tracking-[0.18em] ${labels.accent}">{getValue(data,"brandName")}</button>
      <div className="hidden h-px flex-1 bg-[var(--p)]/30 md:block" />
      <nav className="hidden gap-4 text-xs font-bold uppercase tracking-[0.18em] md:flex">{${nav}.map((p) => (<button key={p.id} type="button" onClick={() => goTo(p.id)} className={currentPage===p.id ? "text-[var(--p)]" : "text-[var(--muted)]"}>{p.label}</button>))}</nav>
      <button type="button" onClick={() => goTo("booking")} className="mr-auto px-4 py-2 text-xs font-bold ${labels.button}">{getValue(data,"heroPrimaryButton")}</button>
    </div>
  </header>`;
}

function buildHero(styleName, styleIndex) {
  const labels = STYLE_LABELS[styleName];
  const variants = [
    `<section data-template-section-type="hero" data-section-kind="hero" className="relative min-h-[100svh] overflow-hidden"><img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/70 to-transparent" /><div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-32 lg:px-8"><Reveal><p className="text-xs tracking-[0.4em] text-[var(--p)]">${labels.marker}</p><h1 className="t-display t-anim mt-4 whitespace-pre-line text-6xl leading-[0.95] text-white md:text-8xl">{getValue(data,"heroTitle")}</h1><p className="t-anim t-d1 mt-5 max-w-xl text-lg text-white/75">{getValue(data,"heroSubtitle")}</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button><button type="button" onClick={() => goTo("services")} className="border border-white/30 px-8 py-4 text-sm text-white">{getValue(data,"heroSecondaryButton")}</button></div></Reveal></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="overflow-hidden bg-[var(--bg)] px-4 pb-16 pt-10"><div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2"><Reveal><p className="inline-block rounded-full bg-[var(--a)]/40 px-4 py-1 text-xs font-bold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 whitespace-pre-line text-5xl font-bold leading-tight md:text-6xl">{getValue(data,"heroTitle")}</h1><p className="t-anim t-d1 mt-4 text-base text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="mt-8 rounded-full bg-[var(--p)] px-7 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button></Reveal><Reveal variant="scale" delayMs={120}><div className="relative"><div className="t-float absolute -right-3 -top-3 h-20 w-20 rounded-full bg-[var(--a)]/50" /><img src={getValue(data,"heroImage")} alt="" className="t-ken aspect-[4/5] w-full rounded-[2rem] object-cover" /></div></Reveal></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="relative min-h-[92svh] overflow-hidden bg-[var(--bg)]"><img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,transparent,var(--dark)_70%)]" /><div className="relative z-10 mx-auto flex min-h-[92svh] max-w-4xl flex-col items-center justify-center px-5 text-center"><Reveal variant="scale"><h1 className="t-display t-anim text-6xl text-white md:text-8xl">{getValue(data,"brandName")}</h1><p className="t-anim t-d1 mx-auto mt-6 max-w-lg text-lg text-white/80">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="t-glow mt-10 border border-[var(--a)] bg-[var(--p)] px-10 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button></Reveal></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="bg-[var(--bg)]"><div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]"><div className="flex flex-col justify-center px-5 py-20 lg:px-12 lg:py-28"><Reveal variant="right"><p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-5 whitespace-pre-line text-5xl font-bold leading-[1.05] md:text-6xl">{getValue(data,"heroTitle")}</h1><p className="t-anim t-d1 mt-6 max-w-md text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-7 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button></Reveal></div><div className="relative min-h-[420px] overflow-hidden"><img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" /><div className="t-float absolute bottom-8 left-8 bg-[var(--surface)]/95 px-5 py-3 text-sm font-bold shadow-lg">{getValue(data,"heroStatOne")} {getValue(data,"heroStatOneLabel")}</div></div></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="relative overflow-hidden bg-[var(--dark)] px-5 py-24 lg:px-8"><div className="pointer-events-none absolute inset-0 opacity-30" style={{background:"radial-gradient(circle at 70% 30%, var(--p), transparent 40%)"}} /><div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]"><Reveal><h1 className="t-display t-anim text-5xl tracking-[0.15em] text-[var(--a)] md:text-6xl">{getValue(data,"brandName")}</h1><p className="t-anim t-d1 mt-6 text-xl leading-9 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="mt-8 border-b border-[var(--p)] pb-1 text-sm tracking-[0.25em] text-[var(--p)]">{getValue(data,"heroPrimaryButton")}</button></Reveal><Reveal variant="left" delayMs={100}><div className="grid grid-cols-3 gap-2"><img src={getValue(data,"heroImage")} alt="" className="t-ken col-span-2 aspect-[3/4] object-cover" /><div className="grid gap-2"><img src={getValue(data,"sectionImage")} alt="" className="aspect-square object-cover" /><img src={getValue(data,"galleryImage3")} alt="" className="aspect-square object-cover" /></div></div></Reveal></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="bg-[var(--bg)] px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[var(--surface)] shadow-xl"><div className="grid md:grid-cols-2"><div className="flex flex-col justify-center p-8 md:p-12"><Reveal><p className="text-sm font-semibold text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-3 whitespace-pre-line text-4xl font-bold md:text-5xl">{getValue(data,"heroTitle")}</h1><p className="t-anim t-d1 mt-4 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="t-pulse mt-8 w-fit rounded-xl bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button></Reveal></div><img src={getValue(data,"heroImage")} alt="" className="t-ken h-full min-h-[360px] w-full object-cover" /></div></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="bg-[var(--bg)]"><div className="border-b-8 border-[var(--p)] px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><Reveal><p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 max-w-3xl whitespace-pre-line text-5xl font-black uppercase leading-[1.05] md:text-7xl">{getValue(data,"heroTitle")}</h1><p className="t-anim t-d1 mt-5 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-8 py-4 text-sm font-black text-white">{getValue(data,"heroPrimaryButton")}</button></Reveal></div></div><img src={getValue(data,"heroImage")} alt="" className="t-ken h-[42vh] w-full object-cover" /></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="relative min-h-[95svh] overflow-hidden bg-[var(--dark)]"><img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-40" /><div className="absolute inset-0 bg-gradient-to-br from-[var(--dark)] via-transparent to-[var(--p)]/30" /><div className="relative z-10 mx-auto flex min-h-[95svh] max-w-7xl flex-col justify-center px-5 lg:px-8"><Reveal><h1 className="t-display t-anim max-w-3xl text-6xl font-black uppercase leading-[0.9] text-white md:text-8xl">{getValue(data,"brandName")}</h1><p className="t-anim t-d1 mt-6 max-w-md text-lg text-[var(--a)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="t-glow mt-10 bg-[var(--p)] px-8 py-4 text-sm font-black text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button></Reveal></div></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="relative overflow-hidden bg-[var(--bg)] px-5 pb-20 pt-10 text-center lg:px-8"><div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[var(--a)]/30 to-transparent" /><Reveal variant="fade"><p className="text-xs tracking-[0.4em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mx-auto mt-4 max-w-3xl text-6xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"brandName")}</h1><p className="t-anim t-d1 mx-auto mt-6 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="mt-8 bg-[var(--p)] px-10 py-3.5 text-sm font-semibold text-white">{getValue(data,"heroPrimaryButton")}</button></Reveal><Reveal delayMs={150}><img src={getValue(data,"heroImage")} alt="" className="t-ken mx-auto mt-12 aspect-[21/9] w-full max-w-5xl object-cover" /></Reveal></section>`,
    `<section data-template-section-type="hero" data-section-kind="hero" className="bg-[var(--dark)]"><div className="mx-auto grid min-h-[90svh] max-w-7xl items-stretch lg:grid-cols-[1fr_1.2fr]"><div className="flex flex-col justify-end border-l border-[var(--p)]/40 px-5 py-16 lg:px-10"><Reveal><p className="font-mono text-xs text-[var(--p)]">01 / BODY</p><h1 className="t-display t-anim mt-4 whitespace-pre-line text-5xl font-bold uppercase leading-none md:text-7xl">{getValue(data,"heroTitle")}</h1><p className="t-anim t-d1 mt-6 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p><button type="button" onClick={() => goTo("booking")} className="mt-8 w-fit bg-[var(--p)] px-7 py-3.5 text-sm font-black text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button></Reveal></div><div className="relative min-h-[400px]"><img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" /><div className="t-float absolute left-6 top-6 border border-[var(--p)] bg-[var(--bg)]/80 px-4 py-2 text-xs font-bold text-[var(--p)]">{getValue(data,"heroEyebrow")}</div></div></div></section>`,
  ];
  return variants[styleIndex];
}

function titleBlock(key, introKey = "ctaText") {
  return `<Reveal><h2 className="t-display mt-4 text-4xl leading-tight text-[var(--p)] md:text-5xl">{getValue(data,"${key}")}</h2><p className="mt-4 max-w-2xl text-[var(--muted)]">{getValue(data,"${introKey}")}</p></Reveal>`;
}

function bodyForRole(role) {
  switch (role) {
    case "servicesPreview":
      return `${titleBlock("sectionTwoTitle", "servicesIntroText")}<div className="mt-10 grid gap-4 md:grid-cols-3">{${serviceItems()}.map(([title, text, minutes, n], i) => (<Reveal key={title} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><p className="text-xs font-bold text-[var(--p)]">{n} / {minutes}</p><h3 className="mt-3 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p></Reveal>))}</div>`;
    case "ritual":
      return `${titleBlock("sectionThreeTitle", "aboutStoryText")}<div className="mt-10 grid gap-4 md:grid-cols-4">{[["01","שיחה","מגדירות מטרה, רגישויות וסגנון אישי."],["02","הכנה","ניקוי, התאמה ובדיקת נוחות לפני תחילת הטיפול."],["03","ביצוע","עבודה מדויקת בקצב רגוע עם חומרי פרימיום."],["04","המשך","הנחיות בית ותיאום ביקורת לפי הצורך."]].map(([n,title,text], i) => (<Reveal key={n} delayMs={i*70} className="t-hover border-r-2 border-[var(--p)] bg-[var(--surface)]/70 p-5"><span className="text-sm font-bold text-[var(--p)]">{n}</span><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>))}</div>`;
    case "gallery":
      return `${titleBlock("sectionFourTitle", "spaceTourText")}<div className="mt-10 grid gap-4 md:grid-cols-4">{${imageItems()}.map((src, i) => (<Reveal key={i} delayMs={i*70} variant="scale" className={i===0 ? "md:col-span-2 md:row-span-2" : ""}><img src={src} alt="" className="t-ken h-full min-h-[240px] w-full object-cover" /></Reveal>))}</div>`;
    case "team":
      return `${titleBlock("sectionFiveTitle", "specialistsText")}<div className="mt-10 grid gap-5 md:grid-cols-3">{${serviceItems()}.map(([title, text], i) => (<Reveal key={title} delayMs={i*90} className="t-hover overflow-hidden bg-[var(--surface)]/75"><img src={[getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"aboutImage")][i]} alt="" className="h-52 w-full object-cover" /><div className="p-5"><p className="text-xs text-[var(--p)]">מומחית {i+1}</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></div></Reveal>))}</div>`;
    case "testimonials":
      return `${titleBlock("sectionSixTitle", "pressText")}<div className="mt-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr_1fr]">{${reviewItems()}.map(([text, name, role], i) => (<Reveal key={name} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><p className="text-2xl text-[var(--p)]">״</p><p className="mt-2 text-lg leading-8">{text}</p><p className="mt-5 text-sm font-bold text-[var(--p)]">{name} · {role}</p></Reveal>))}</div>`;
    case "packages":
      return `${titleBlock("sectionSevenTitle", "priceText")}<div className="mt-10 grid gap-5 lg:grid-cols-3">{${packageItems()}.map(([title, price, text], i) => (<Reveal key={title} delayMs={i*90} className="t-hover relative overflow-hidden border border-[var(--p)]/30 bg-[var(--surface)]/75 p-7"><div className="t-shimmer absolute inset-x-0 top-0 h-1 bg-[var(--p)]" /><p className="t-display text-4xl text-[var(--p)]">{price}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p><button type="button" onClick={() => goTo("booking")} className="mt-6 text-sm font-bold text-[var(--p)]">בחירת חבילה</button></Reveal>))}</div>`;
    case "whyUs":
      return `${titleBlock("sectionEightTitle", "valuesText")}<div className="mt-10 grid gap-4 md:grid-cols-3">{${statItems()}.map(([n, label], i) => (<Reveal key={label} delayMs={i*90} variant="scale" className="t-float border-b-4 border-[var(--p)] bg-[var(--surface)]/70 p-7 text-center"><div className="t-display text-5xl text-[var(--p)]">{n}</div><p className="mt-2 font-bold">{label}</p><p className="mt-2 text-sm text-[var(--muted)]">מדד שמספר על עקביות, דיוק וחוויה שחוזרות בכל ביקור.</p></Reveal>))}</div>`;
    case "bookingTeaser":
    case "aboutCta":
    case "bookCta":
      return `<Reveal className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]"><div><h2 className="t-display text-5xl leading-tight text-[var(--p)]">{getValue(data,"${role === "bookingTeaser" ? "bookingTeaserTitle" : role === "aboutCta" ? "aboutCtaTitle" : "bookCtaTitle"}")}</h2><p className="mt-4 max-w-xl text-[var(--muted)]">{getValue(data,"ctaText")}</p></div><button type="button" onClick={() => goTo("booking")} className="t-pulse bg-[var(--p)] px-8 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data,"ctaButton")}</button></Reveal>`;
    case "aboutHero":
      return `<Reveal><div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"aboutHeroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"aboutStoryText")}</p></div><img src={getValue(data,"aboutImage")} alt="" className="t-ken min-h-[360px] w-full object-cover" /></div></Reveal>`;
    case "story":
      return `${titleBlock("aboutStoryTitle", "aboutStoryText")}<div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><Reveal><img src={getValue(data,"sectionImage")} alt="" className="t-ken h-full min-h-[420px] w-full object-cover" /></Reveal><div className="space-y-5">{["הקמנו מקום שמקשיב קודם כל לאדם שמולנו, לפני בחירת צבע, חומר או פרוטוקול.","כל טיפול מתועד בכרטיס לקוחה, עם העדפות, תגובות עור והמלצות המשך ברורות.","הצוות נפגש בכל שבוע לסקירת תוצאות, שיפור תהליכים ובדיקת חומרי עבודה חדשים."].map((text, i) => (<Reveal key={text} delayMs={i*80} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-6"><span className="text-sm font-bold text-[var(--p)]">פרק {i+1}</span><p className="mt-3 leading-8 text-[var(--muted)]">{text}</p></Reveal>))}</div></div>`;
    case "spaceTour":
      return `${titleBlock("spaceTourTitle", "spaceTourText")}<div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Reveal><img src={getValue(data,"galleryImage1")} alt="" className="t-ken h-full min-h-[460px] w-full object-cover" /></Reveal><div className="grid gap-4">{[[getValue(data,"galleryImage2"),"קבלת פנים","עמדת ייעוץ שקטה עם תאורה רכה וכיבוד קטן."],[getValue(data,"galleryImage3"),"חדר טיפול","מיטה מחוממת, סטריליות מלאה ומוזיקה מותאמת."],[getValue(data,"galleryImage4"),"פינת סיום","מראה גדולה, מוצרי המשך והנחיות כתובות."]].map(([src,title,text], i) => (<Reveal key={title} delayMs={i*80} className="t-hover grid grid-cols-[110px_1fr] gap-4 bg-[var(--surface)]/70 p-4"><img src={src} alt="" className="h-28 w-full object-cover" /><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div></Reveal>))}</div></div>`;
    case "values":
      return `${titleBlock("valuesTitle", "valuesText")}<div className="mt-10 grid gap-4 md:grid-cols-3">{[["01","דיוק","לא מתחילות טיפול לפני התאמת ציפיות ותיעוד מלא."],["02","היגיינה","כלים מחוטאים, עמדות נקיות וחומרים מאושרים בלבד."],["03","רוגע","לוח תורים מרווח כדי שלא תרגישו חלק מפס ייצור."],["04","שקיפות","מחיר, משך ותוצאה צפויה מוסברים מראש."],["05","למידה","הכשרות קבועות והתנסות בטכניקות חדשות."],["06","אחריות","מעקב אחרי הטיפול והמלצות המשך אמיתיות."]].map(([n,title,text], i) => (<Reveal key={n} delayMs={i*60} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><span className="text-xs font-bold text-[var(--p)]">{n}</span><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></Reveal>))}</div>`;
    case "specialistsDeep":
      return `${titleBlock("specialistsTitle", "specialistsText")}<div className="mt-10 space-y-5">{${serviceItems()}.map(([title, text, minutes], i) => (<Reveal key={title} delayMs={i*90} className="t-hover grid gap-5 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[180px_1fr_auto]"><img src={[getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"aboutImage")][i]} alt="" className="h-44 w-full object-cover" /><div><p className="text-sm text-[var(--p)]">ביו מקצועי · {minutes}</p><h3 className="mt-1 text-2xl font-bold">{title}</h3><p className="mt-3 leading-7 text-[var(--muted)]">{text} ההתמחות כוללת אבחון, עבודה עדינה וליווי אחרי הטיפול.</p></div><div className="self-center text-center"><div className="t-display text-4xl text-[var(--p)]">{i+4}</div><p className="text-xs text-[var(--muted)]">שנות ניסיון</p></div></Reveal>))}</div>`;
    case "certifications":
      return `${titleBlock("certsTitle", "certsText")}<div className="mt-10 grid gap-4 md:grid-cols-4">{[["ISO","נהלי חיטוי"],["PRO","הכשרות מוצר"],["CARE","בטיחות לקוחה"],["LAB","בדיקת חומרים"]].map(([code,title], i) => (<Reveal key={code} delayMs={i*70} className="t-hover border border-[var(--p)]/30 bg-[var(--surface)]/70 p-6 text-center"><div className="t-display text-4xl text-[var(--p)]">{code}</div><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">תעודה, רענון ויישום בפועל בצוות.</p></Reveal>))}</div>`;
    case "timeline":
      return `${titleBlock("timelineTitle", "aboutStoryText")}<div className="mt-10 space-y-0 border-r border-[var(--p)]/40 pr-6">{[["2018","פתיחת החדר הראשון וקבלת לקוחות קבועות."],["2020","הוספת מערכת תורים ותיעוד דיגיטלי."],["2023","הרחבת הצוות והכשרות מתקדמות."],["2026","חלל חדש עם אזורי טיפול, המתנה ואבחון."]].map(([year,text], i) => (<Reveal key={year} delayMs={i*80} className="relative pb-8"><span className="absolute -right-[31px] top-1 h-3 w-3 rounded-full bg-[var(--p)]" /><div className="grid gap-3 md:grid-cols-[120px_1fr]"><strong className="t-display text-3xl text-[var(--p)]">{year}</strong><p className="leading-7 text-[var(--muted)]">{text}</p></div></Reveal>))}</div>`;
    case "pressQuotes":
      return `${titleBlock("pressTitle", "pressText")}<div className="mt-10 grid gap-5 md:grid-cols-3">{${reviewItems()}.map(([text, name, role], i) => (<Reveal key={name} delayMs={i*80} className="t-hover bg-[var(--surface)]/70 p-6"><p className="text-xs font-bold tracking-[0.28em] text-[var(--p)]">BEAUTY NOTE {i+1}</p><p className="mt-4 text-lg leading-8">{text}</p><p className="mt-5 text-sm text-[var(--muted)]">{name} · {role}</p></Reveal>))}</div>`;
    case "servicesHero":
      return `<Reveal><div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p><h1 className="t-display t-anim mt-4 text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"servicesHeroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"servicesIntroText")}</p></div><img src={getValue(data,"sectionImage")} alt="" className="t-ken min-h-[340px] w-full object-cover" /></div></Reveal>`;
    case "catalog":
      return `${titleBlock("catalogTitle", "catalogText")}<div className="mt-10 grid gap-5 md:grid-cols-2">{${serviceItems(true)}.map(([title, text, minutes, n], i) => (<Reveal key={title} delayMs={i*70} className="t-hover grid gap-4 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[90px_1fr]"><div className="t-display text-4xl text-[var(--p)]">{n}</div><div><h3 className="text-2xl font-bold">{title}</h3><p className="mt-2 leading-7 text-[var(--muted)]">{text}</p><p className="mt-3 text-sm font-bold text-[var(--p)]">משך משוער: {minutes}</p></div></Reveal>))}</div>`;
    case "featuredTreatment":
      return `${titleBlock("featuredTitle", "featuredTreatmentText")}<div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><Reveal><img src={getValue(data,"galleryImage2")} alt="" className="t-ken h-full min-h-[460px] w-full object-cover" /></Reveal><Reveal delayMs={100} className="bg-[var(--surface)]/75 p-7"><h3 className="t-display text-4xl text-[var(--p)]">{getValue(data,"itemOneTitle")}</h3><p className="mt-4 leading-8 text-[var(--muted)]">{getValue(data,"featuredTreatmentText")}</p><ul className="mt-6 space-y-3 text-sm">{["אבחון לפני התחלה","עבודה בשכבות", "סיום עם המלצות בית"].map((item) => (<li key={item} className="border-b border-[var(--p)]/20 pb-3">{item}</li>))}</ul><button type="button" onClick={() => goTo("booking")} className="mt-7 bg-[var(--p)] px-7 py-3 text-sm font-bold text-[var(--dark)]">קביעת טיפול דגל</button></Reveal></div>`;
    case "durationGuide":
      return `${titleBlock("durationTitle", "durationText")}<div className="mt-10 overflow-hidden border border-[var(--p)]/30">{${serviceItems(true)}.map(([title, text, minutes], i) => (<Reveal key={title} delayMs={i*60} className="grid gap-3 border-b border-[var(--p)]/20 bg-[var(--surface)]/70 p-5 last:border-b-0 md:grid-cols-[1fr_140px_1.4fr]"><strong>{title}</strong><span className="text-[var(--p)]">{minutes}</span><span className="text-sm text-[var(--muted)]">{text}</span></Reveal>))}</div>`;
    case "addons":
      return `${titleBlock("addonsTitle", "addonsText")}<div className="mt-10 flex flex-wrap gap-3">{["מסכת הרגעה","עיסוי קרקפת","אמפולת זוהר","תיקון מהיר","ייעוץ ביתי","צילום תוצאה"].map((item, i) => (<Reveal key={item} delayMs={i*45} className="t-hover rounded-full border border-[var(--p)]/35 bg-[var(--surface)]/70 px-5 py-3 text-sm font-bold">+ {item}</Reveal>))}</div><p className="mt-6 max-w-2xl text-[var(--muted)]">{getValue(data,"addonsText")}</p>`;
    case "beforeAfter":
      return `${titleBlock("beforeAfterTitle", "beforeAfterText")}<div className="mt-10 grid gap-5 lg:grid-cols-2"><Reveal className="relative overflow-hidden"><img src={getValue(data,"galleryImage1")} alt="" className="t-ken h-[420px] w-full object-cover opacity-75" /><span className="absolute right-4 top-4 bg-[var(--dark)] px-4 py-2 text-sm text-white">לפני</span></Reveal><Reveal delayMs={100} className="relative overflow-hidden"><img src={getValue(data,"galleryImage3")} alt="" className="t-ken h-[420px] w-full object-cover" /><span className="absolute right-4 top-4 bg-[var(--p)] px-4 py-2 text-sm font-bold text-[var(--dark)]">אחרי</span></Reveal></div>`;
    case "priceTable":
      return `${titleBlock("priceTitle", "priceText")}<div className="mt-10 grid gap-4">{${packageItems()}.map(([title, price, text], i) => (<Reveal key={title} delayMs={i*70} className="t-hover grid items-center gap-4 border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5 md:grid-cols-[1fr_120px_1fr_auto]"><h3 className="text-xl font-bold">{title}</h3><strong className="t-display text-3xl text-[var(--p)]">{price}</strong><p className="text-sm text-[var(--muted)]">{text}</p><button type="button" onClick={() => goTo("booking")} className="border border-[var(--p)] px-4 py-2 text-sm text-[var(--p)]">בחירה</button></Reveal>))}</div>`;
    case "serviceFaq":
    case "bookingFaq":
      return `${titleBlock(role === "serviceFaq" ? "serviceFaqTitle" : "bookingFaqTitle", role === "serviceFaq" ? "servicesIntroText" : "policyText")}<div className="mt-10 space-y-3">{${faqItems()}.map(([q, a], i) => (<Reveal key={q} delayMs={i*70}><details className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><summary className="cursor-pointer text-lg font-bold">{q}</summary><p className="mt-3 leading-7 text-[var(--muted)]">{a}</p></details></Reveal>))}</div>`;
    case "bookingHero":
      return `<Reveal><h1 className="t-display t-anim text-5xl leading-tight text-[var(--p)] md:text-7xl">{getValue(data,"bookingHeroTitle")}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{getValue(data,"ctaText")}</p></Reveal>`;
    case "calendar":
      return `<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"calendarTitle")}</h2><p className="mt-4 text-[var(--muted)]">בחרו יום ושעה פנויה. הלוח כאן לשמירת תור מהירה מתוך התבנית.</p></Reveal><Reveal delayMs={100} className="t-glow bg-[var(--surface)]/80 p-5"><BookingCalendarPanel PLACEHOLDER_CAL_PROPS /></Reveal></div>`;
    case "servicePicker":
      return `${titleBlock("servicePickerTitle", "catalogText")}<div className="mt-8 grid gap-3 md:grid-cols-3">{${serviceItems()}.map(([title, text, minutes], i) => (<Reveal key={title} delayMs={i*70} className="t-hover cursor-pointer border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><p className="text-sm font-bold text-[var(--p)]">{minutes}</p><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></Reveal>))}</div>`;
    case "specialistPicker":
      return `${titleBlock("specialistTitle", "specialistsText")}<div className="mt-8 grid gap-4 md:grid-cols-3">{["מאיה","רוני","תמר"].map((name, i) => (<Reveal key={name} delayMs={i*70} className="t-hover bg-[var(--surface)]/70 p-5 text-center"><img src={[getValue(data,"galleryImage2"),getValue(data,"galleryImage3"),getValue(data,"aboutImage")][i]} alt="" className="mx-auto h-28 w-28 rounded-full object-cover" /><h3 className="mt-4 font-bold">{name}</h3><p className="mt-1 text-sm text-[var(--muted)]">מומחית טיפול {i+1}</p></Reveal>))}</div>`;
    case "hoursPanel":
      return `${titleBlock("hoursTitle", "policyText")}<Reveal className="mt-8 grid gap-4 md:grid-cols-3">{[["א-ה","09:00-20:00"],["ו","09:00-14:00"],["מענה","עד שעה לאישור"]].map(([d,h]) => (<div key={d} className="border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><p className="text-sm text-[var(--muted)]">{d}</p><strong className="text-2xl text-[var(--p)]">{h}</strong></div>))}</Reveal>`;
    case "policies":
      return `${titleBlock("policiesTitle", "policyText")}<div className="mt-8 grid gap-4 md:grid-cols-3">{["ביטול עד 24 שעות ללא חיוב","איחור מעל 15 דקות עלול לקצר טיפול","רגישות או מצב רפואי יש לעדכן מראש"].map((item, i) => (<Reveal key={item} delayMs={i*70} className="t-hover border border-[var(--p)]/25 bg-[var(--surface)]/70 p-5"><span className="text-sm font-bold text-[var(--p)]">0{i+1}</span><p className="mt-3 leading-7 text-[var(--muted)]">{item}</p></Reveal>))}</div>`;
    case "confirmationForm":
      return `<Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"confirmTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"contactText")}</p></div><form className="grid gap-3 bg-[var(--surface)]/70 p-6" onSubmit={(e)=>e.preventDefault()}><input className="border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="שם מלא" /><input className="border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="טלפון" /><textarea className="min-h-28 border border-[var(--p)]/25 bg-transparent px-4 py-3 text-right outline-none" placeholder="הערות" /><button type="button" className="bg-[var(--p)] py-3.5 text-sm font-bold text-[var(--dark)]">{getValue(data,"contactButton")}</button></form></Reveal>`;
    case "locationMap":
      return `<div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><Reveal><h2 className="t-display text-4xl text-[var(--p)]">{getValue(data,"locationTitle")}</h2><p className="mt-4 text-[var(--muted)]">{getValue(data,"address")}</p><p className="mt-2 text-sm">{getValue(data,"phone")} · {getValue(data,"hours")}</p></Reveal><Reveal delayMs={100} className="relative overflow-hidden"><img src={getValue(data,"mapImage")} alt="" className="t-ken aspect-video w-full object-cover opacity-80" /><span className="absolute inset-0 grid place-items-center bg-[var(--dark)]/35 text-sm font-bold text-white">מפה · {getValue(data,"address")}</span></Reveal></div>`;
    default:
      return titleBlock("ctaTitle", "ctaText");
  }
}

function buildFooter(styleName, styleIndex) {
  const labels = STYLE_LABELS[styleName];
  const variants = [
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-noir border-t border-[var(--p)]/25 px-5 py-12 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between"><span className="t-display text-2xl text-[var(--p)]">{getValue(data,"brandName")}</span><span className="text-sm text-[var(--muted)]">{getValue(data,"phone")} · {getValue(data,"email")}</span><span className="text-xs text-[var(--muted)]">© {new Date().getFullYear()}</span></div></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-bubble bg-[var(--p)] px-5 py-10 text-center text-white"><p className="t-display text-3xl font-bold">{getValue(data,"brandName")}</p><p className="mt-2 text-sm opacity-90">{getValue(data,"address")}</p></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-atelier px-5 py-14 text-center lg:px-8"><p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p><p className="mt-3 text-xs tracking-[0.3em] text-[var(--muted)]">{getValue(data,"email")}</p></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-editorial grid gap-4 border-t border-[var(--p)]/20 px-5 py-10 md:grid-cols-3 lg:px-8"><span className="t-display text-xl font-bold">{getValue(data,"brandName")}</span><span className="text-sm text-[var(--muted)]">{getValue(data,"hours")}</span><span className="text-sm text-[var(--muted)] md:text-left">{getValue(data,"address")}</span></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-nocturne border-t border-[var(--p)]/30 px-5 py-12 lg:px-8"><div className="mx-auto max-w-3xl text-center"><p className="t-display tracking-[0.35em] text-[var(--a)]">{getValue(data,"brandName")}</p><p className="mt-4 text-sm text-[var(--muted)]">{getValue(data,"phone")}</p></div></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-clinic bg-[var(--surface)] px-5 py-10 lg:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><span className="font-bold">{getValue(data,"brandName")}</span><span className="text-sm text-[var(--muted)]">{getValue(data,"email")} · {getValue(data,"phone")}</span></div></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-brutal border-t-4 border-[var(--p)] px-5 py-8 lg:px-8"><p className="t-display text-2xl font-black uppercase">{getValue(data,"brandName")}</p><p className="mt-2 text-sm">{getValue(data,"address")}</p></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-neon bg-[var(--dark)] px-5 py-12 lg:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><span className="t-display text-xl font-black text-[var(--p)]">{getValue(data,"brandName")}</span><span className="text-xs text-[var(--muted)]">${labels.marker} · {getValue(data,"ctaTitle")}</span></div></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-pearl px-5 py-12 text-center lg:px-8"><p className="t-display text-4xl text-[var(--p)]">{getValue(data,"brandName")}</p><p className="mt-3 text-sm text-[var(--muted)]">{getValue(data,"phone")} · {getValue(data,"email")}</p></footer>`,
    `<footer data-template-section-type="footer" data-section-kind="footer" className="beauty-${styleName}-footer-sculpt border-t border-[var(--p)]/30 px-5 py-10 lg:px-8"><div className="mx-auto flex max-w-7xl items-center gap-4"><span className="bg-[var(--p)] px-3 py-2 font-black text-[var(--dark)]">{getValue(data,"logoText")}</span><span className="font-bold">{getValue(data,"brandName")}</span><span className="mr-auto text-sm text-[var(--muted)]">{getValue(data,"email")}</span></div></footer>`,
  ];
  return variants[styleIndex];
}

function buildStyleLayouts(styleName) {
  const styleIndex = Math.max(0, STYLE_ORDER.indexOf(styleName));
  const layouts = {
    header: buildHeader(styleName, styleIndex),
    hero: buildHero(styleName, styleIndex),
    footer: buildFooter(styleName, styleIndex),
  };
  for (const role of CONTENT_ROLE_ORDER) {
    if (role === "hero" || role === "footer") continue;
    let body = bodyForRole(role);
    if (role === "calendar") {
      const calendarProps = ["", "pill", "", "", "compact", "", "bold", "neon", "pill compact", "bold compact"][styleIndex];
      body = body.replace("PLACEHOLDER_CAL_PROPS", calendarProps);
    }
    layouts[role] = framedSection(role, styleName, styleIndex, body);
  }
  return layouts;
}

const LAYOUTS = Object.fromEntries(STYLE_ORDER.map((styleName) => [styleName, buildStyleLayouts(styleName)]));

function styleLayouts(style) { return LAYOUTS[style] || LAYOUTS.noirGold; }

function pages(t) {
  const P = pascal(t.id);
  const L = styleLayouts(t.style);

  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { ${t.id}DefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { ${t.id}EditorCss } from "./editorCss";
import { Reveal } from "../shared/Reveal";

export const ${t.id}Pages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "booking", label: "תורים", slug: "/booking" },
];

const allowedPages = ${t.id}Pages.map((p) => p.id);

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

function BookingCalendarPanel({ pill, compact, bold, neon }: { pill?: boolean; compact?: boolean; bold?: boolean; neon?: boolean }) {
  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState("10:30");
  const weekDays = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const times = ["09:00", "10:00", "10:30", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
  const cells = Array.from({ length: 35 }, (_, i) => (i < 31 ? i + 1 : null));
  const dayPills = [10, 11, 12, 13, 14, 15, 16];
  const cellCls = bold ? "border-2 border-[var(--dark)]" : neon ? "border border-[var(--p)]/50" : "border border-[var(--p)]/20";
  const activeCls = "bg-[var(--p)] text-[var(--dark)]";
  return (
    <div className="mt-6" dir="rtl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold">יולי 2026</p>
        <div className="flex gap-2 overflow-x-auto">
          {dayPills.map((d) => (
            <button key={d} type="button" onClick={() => setSelectedDay(d)}
              className={"shrink-0 px-3 py-1.5 text-sm font-bold transition " + (pill ? "rounded-full " : "") + (selectedDay === d ? activeCls : cellCls)}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className={"grid grid-cols-7 gap-1 text-center text-xs " + (compact ? "mx-auto max-w-sm" : "")}>
        {weekDays.map((w) => (
          <div key={w} className="py-2 font-bold text-[var(--muted)]">{w}</div>
        ))}
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            disabled={d == null}
            onClick={() => d != null && setSelectedDay(d)}
            className={"aspect-square text-sm transition " + (d == null ? "opacity-0" : cellCls) + " " + (d === selectedDay ? activeCls + " t-pulse" : "hover:border-[var(--p)]")}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <p className="mb-3 text-sm font-bold">שעות פנויות · יום {selectedDay}</p>
        <div className="flex flex-wrap gap-2">
          {times.map((tm) => (
            <button key={tm} type="button" onClick={() => setSelectedTime(tm)}
              className={"px-3 py-2 text-sm font-semibold transition " + (pill ? "rounded-full " : "") + (selectedTime === tm ? activeCls + " t-glow" : cellCls)}>
              {tm}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">נבחר: {selectedDay}/7 · {selectedTime}</p>
      </div>
    </div>
  );
}

function Header({ data, currentPage, goTo }: { data: Record<string, any>; currentPage: string; goTo: (id: string) => void }) {
  return (
    ${L.header}
  );
}

function HomePage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      ${L.hero}
      ${L.servicesPreview}
      ${L.ritual}
      ${L.gallery}
      ${L.team}
      ${L.testimonials}
      ${L.packages}
      ${L.whyUs}
      ${L.bookingTeaser}
      ${L.footer}
    </>
  );
}

function AboutPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      ${L.aboutHero}
      ${L.story}
      ${L.spaceTour}
      ${L.values}
      ${L.specialistsDeep}
      ${L.certifications}
      ${L.timeline}
      ${L.pressQuotes}
      ${L.aboutCta}
      ${L.footer}
    </>
  );
}

function ServicesPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      ${L.servicesHero}
      ${L.catalog}
      ${L.featuredTreatment}
      ${L.durationGuide}
      ${L.addons}
      ${L.beforeAfter}
      ${L.priceTable}
      ${L.serviceFaq}
      ${L.bookCta}
      ${L.footer}
    </>
  );
}

function BookingPage({ data, goTo }: { data: Record<string, any>; goTo: (id: string) => void }) {
  return (
    <>
      ${L.bookingHero}
      ${L.calendar}
      ${L.servicePicker}
      ${L.specialistPicker}
      ${L.hoursPanel}
      ${L.policies}
      ${L.confirmationForm}
      ${L.locationMap}
      ${L.bookingFaq}
      ${L.footer}
    </>
  );
}

export default function ${P}Pages(props: ${P}PagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...${t.id}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage, goTo } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages, fallbackPage: "home" },
  );

  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage data={mergedData} goTo={goTo} />,
    about: <AboutPage data={mergedData} goTo={goTo} />,
    services: <ServicesPage data={mergedData} goTo={goTo} />,
    booking: <BookingPage data={mergedData} goTo={goTo} />,
  };

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${t.id}-preview" : "${t.id}"} className="min-h-screen w-full overflow-x-hidden" style={{ background: "${t.palette.background}", color: "${t.palette.text}" }}>
      <style dangerouslySetInnerHTML={{ __html: ${t.id}EditorCss }} />
      <Header data={mergedData} currentPage={currentPage} goTo={goTo} />
      <VisualPageStack
        activePageId={currentPage}
        pages={Object.entries(pageContent).map(([id, content]) => ({ id, content }))}
      />
    </div>
  );
}
`;
}


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

const indexPath = path.join(ROOT, "index.ts");
let index = fs.readFileSync(indexPath, "utf8");
const importLines = TEMPLATES.map((t) => `import { ${t.id}Template } from "./${t.id}/meta";`).join("\n");
const arrayLines = TEMPLATES.map((t) => `  ${t.id}Template,`).join("\n");

if (!index.includes("velvetineTemplate")) {
  if (index.includes('import { streetbiteTemplate } from "./streetbite/meta";')) {
    index = index.replace(
      'import { streetbiteTemplate } from "./streetbite/meta";',
      'import { streetbiteTemplate } from "./streetbite/meta";\n' + importLines,
    );
  } else {
    index = index.replace(
      'import { jewelisTemplate } from "./jewelis/meta";',
      'import { jewelisTemplate } from "./jewelis/meta";\n' + importLines,
    );
  }

  if (index.includes("  streetbiteTemplate,\n];")) {
    index = index.replace("  streetbiteTemplate,\n];", "  streetbiteTemplate,\n" + arrayLines + "\n];");
  } else if (index.includes("  streetbiteTemplate,")) {
    index = index.replace("  streetbiteTemplate,", "  streetbiteTemplate,\n" + arrayLines);
  } else {
    index = index.replace("  jewelisTemplate,", "  jewelisTemplate,\n" + arrayLines);
  }
  fs.writeFileSync(indexPath, index, "utf8");
  console.log("✓ index.ts updated");
} else {
  console.log("index.ts already wired");
}

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

if (!reg.includes('from "./velvetine/pages"')) {
  if (reg.includes('import { streetbiteDefaultData } from "./streetbite/defaultData";')) {
    reg = reg.replace(
      'import { streetbiteDefaultData } from "./streetbite/defaultData";',
      'import { streetbiteDefaultData } from "./streetbite/defaultData";\n\n' + regImports,
    );
  } else {
    reg = reg.replace(
      'import { jewelisDefaultData } from "./jewelis/defaultData";',
      'import { jewelisDefaultData } from "./jewelis/defaultData";\n\n' + regImports,
    );
  }

  const closeMarker = "editorCss: streetbiteEditorCss,\n  }),\n};";
  if (reg.includes(closeMarker)) {
    reg = reg.replace(closeMarker, `editorCss: streetbiteEditorCss,\n  }),\n\n${regEntries}\n};`);
  } else {
    reg = reg.replace("\n};\n\nexport function getStudioTemplateRenderer", `\n\n${regEntries}\n};\n\nexport function getStudioTemplateRenderer`);
  }

  fs.writeFileSync(regPath, reg, "utf8");
  console.log("✓ templateRendererRegistry.ts updated");
} else {
  console.log("templateRendererRegistry.ts already wired");
}

console.log("Done. Generated", TEMPLATES.length, "beauty templates.");
