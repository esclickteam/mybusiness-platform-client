#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../src/components/site-builder/studio/data/templates");

const pages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "courses", label: "קורסים", slug: "/courses" },
  { id: "curriculum", label: "סילבוס", slug: "/curriculum" },
  { id: "instructors", label: "מנחים", slug: "/instructors" },
  { id: "campus", label: "קמפוס", slug: "/campus" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const templates = [
  {
    id: "lectora",
    prefix: "lectora",
    component: "LectoraPages",
    dataName: "lectoraDefaultData",
    cssName: "lectoraEditorCss",
    layout: "cinematic",
    tone: "קולנועי",
    aboutTitle: "אקדמיה אונליין שנראית ומרגישה כמו הפקה",
    aboutText: "Lectora בונה לכל לומד מסע צפייה, תרגול ומשוב. כל שיעור קצר, ערוך ומדויק, וכל פרויקט מקבל במה עד שהוא מוכן לצאת לעולם.",
    aboutEyebrow: "מאחורי הקלעים",
    whyTitle: "למה הלמידה כאן מחזיקה עד הקרדיטים",
    why: [
      ["שיעורים בקצב נכון", "פרקים קצרים עם פתיח, תרגול וסיכום שמחזיקים ריכוז."],
      ["מנטורים חיים", "ביקורת שבועית, הערות על עבודות ומפגשי שאלות בזמן אמת."],
      ["פורטפוליו מצולם", "כל מסלול מסתיים בתוצר שאפשר להציג ללקוח או למעסיק."],
    ],
    methodTitle: "הפקת למידה בארבע סצנות",
    method: [
      ["תסריט אישי", "מגדירים יעד ומסלול צפייה לפי ניסיון וזמן."],
      ["שיעור מוקרן", "צופים, מסמנים נקודות ומורידים חומרים."],
      ["תרגול על הסט", "מבצעים משימה קצרה עם משוב ממוקד."],
      ["פרימיירה", "מציגים פרויקט גמר ומקבלים תיק עבודות."],
    ],
    outcomesTitle: "מה יוצא בסוף המסלול",
    outcomes: [
      ["86%", "מסיימים עם פרויקט פרסום או תיק עבודות פעיל."],
      ["14 ימים", "הזמן הממוצע עד שיפור מדיד בתהליך עבודה."],
      ["4.9/5", "דירוג חווית המנטורינג במפגשים חיים."],
    ],
    insightsTitle: "מגזין הלמידה של Lectora",
    insights: [
      ["איך עורכים שיעור כמו טריילר", "שיטות להפוך ידע מורכב לפרק חד וברור."],
      ["פורטפוליו שמספר סיפור", "איך לבחור פרויקטים שמראים התקדמות ולא רק תוצאה."],
      ["למידה היברידית בלי רעש", "כך משלבים הקלטות, שידורים חיים ותרגול."],
    ],
    ctaBandTitle: "מוכנים לסצנה הראשונה?",
    ctaBandText: "נבחר יחד מסלול, קצב למידה ופרויקט גמר שמתאים לכם.",
    ctaBandButton: "קבעו שיחת פתיחה",
    prices: ["890", "1,290", "1,590"],
    instructors: [["נועה שחר", "בימוי למידה"], ["איתי ברק", "מוצר וצמיחה"], ["מיכל רוזן", "AI ליוצרים"]],
  },
  {
    id: "mentora",
    prefix: "mentora",
    component: "MentoraPages",
    dataName: "mentoraDefaultData",
    cssName: "mentoraEditorCss",
    layout: "circular",
    tone: "אישי",
    aboutTitle: "ליווי מנטורינג שמתחיל באדם ולא בתבנית",
    aboutText: "Mentora מחברת בין יעדים מקצועיים לבין שיחות עומק, משימות שבועיות ומדידה עדינה. המנטור מכיר את הקצב שלכם ונשאר לצדכם עד שהשינוי מורגש.",
    aboutEyebrow: "ליווי אישי",
    whyTitle: "שלוש סיבות שמנטור טוב משנה מסלול",
    why: [
      ["דיוק לפני פעולה", "מתחילים באבחון שמפריד בין רעש להזדמנות."],
      ["שיחה קבועה", "מפגש שבועי שמחזיק אחריות ומפרק חסמים."],
      ["מדדים רכים וקשים", "בודקים ביטחון, ביצוע ותוצאות עסקיות יחד."],
    ],
    methodTitle: "מעגל הליווי",
    method: [
      ["אבחון", "שאלון עומק ושיחת מיקוד ראשונה."],
      ["מפה", "בניית יעדים, הרגלים ומשימות שבועיות."],
      ["ליווי", "שיחה, משוב והכוונה על החלטות בזמן אמת."],
      ["הטמעה", "סיכום התקדמות ותוכנית המשך עצמאית."],
    ],
    outcomesTitle: "שינויים שמדווחים מנטיז",
    outcomes: [
      ["3x", "בהירות גבוהה יותר בהחלטות קריירה."],
      ["12 שבועות", "מסלול ממוצע עד פריצת דרך ראשונה."],
      ["91%", "ממשיכים לעבוד עם מפת יעדים גם אחרי התוכנית."],
    ],
    insightsTitle: "רשימות מהמנטורים",
    insights: [
      ["איך יודעים שהיעד נכון", "שאלות שמגלות אם אתם רודפים אחרי יעד שלכם."],
      ["ניהול אנרגיה למנהלים", "כלים קטנים ליום עמוס החלטות."],
      ["משוב בלי הגנות", "מסגרת שיחה שעוזרת לקבל הערות ולפעול."],
    ],
    ctaBandTitle: "שיחה אחת יכולה לפתוח כיוון חדש",
    ctaBandText: "נכיר את האתגר ונחבר אתכם למנטור המתאים.",
    ctaBandButton: "לתיאום התאמה",
    prices: ["2,400", "3,600", "4,800"],
    instructors: [["רוני טל", "קריירה"], ["אדם לוי", "יזמות"], ["מאיה קדם", "מנהיגות"]],
  },
  {
    id: "polyglota",
    prefix: "polyglota",
    component: "PolyglotaPages",
    dataName: "polyglotaDefaultData",
    cssName: "polyglotaEditorCss",
    layout: "soft",
    tone: "שפות",
    aboutTitle: "בית ספר לשפות שמלמד לדבר לפני שפוחדים לטעות",
    aboutText: "Polyglota משלבת שיעורים חיים, תרגול יומי קצר וקבוצות שיחה רכות. כל מסלול בנוי סביב ביטחון בדיבור, אוצר מילים שימושי והיכרות עם תרבות.",
    aboutEyebrow: "שפה פותחת עולם",
    whyTitle: "למה תלמידים מתחילים לדבר מהר יותר",
    why: [
      ["שיחה מהשיעור הראשון", "כל מפגש כולל משפטים שימושיים ולא רק דקדוק."],
      ["קבוצות קטנות", "עד שמונה תלמידים עם הרבה זמן דיבור לכל אחד."],
      ["תרבות בתוך הלמידה", "מוזיקה, סיפורים ומצבים אמיתיים מהעולם."],
    ],
    methodTitle: "מסע שפה בארבע תחנות",
    method: [
      ["צלילים", "היכרות עם הגייה, קצב וביטויים בסיסיים."],
      ["משפטים", "בניית שיחות קצרות סביב מצבים יומיומיים."],
      ["שיחה", "מפגשי תרגול עם מורה ודוברים נוספים."],
      ["זרימה", "פרויקט מסכם: הצגה, מצגת או שיחה מלאה."],
    ],
    outcomesTitle: "תוצאות שמרגישים בשיחה",
    outcomes: [
      ["28 יום", "עד שיחת היכרות רציפה בשפה החדשה."],
      ["92%", "מדווחים על ביטחון גבוה יותר בדיבור."],
      ["6 רמות", "מסלולים ממתחילים ועד עסקי מתקדם."],
    ],
    insightsTitle: "מחברת השפות",
    insights: [
      ["איך מתרגלים 10 דקות ביום", "שגרה קטנה שמייצרת אוצר מילים אמיתי."],
      ["טעויות שמקדמות דיבור", "למה כדאי לטעות בקול כבר מההתחלה."],
      ["שפה לפני נסיעה", "רשימת משפטים שמצילה כל טיול."],
    ],
    ctaBandTitle: "בחרו שפה ונתחיל במשפט הראשון",
    ctaBandText: "המורים שלנו יתאימו רמה, קבוצה וקצב תרגול.",
    ctaBandButton: "בדיקת רמה קצרה",
    prices: ["690", "990", "1,390"],
    instructors: [["לוסיה מרטין", "ספרדית"], ["דניאל כהן", "אנגלית עסקית"], ["סמר עבד", "ערבית מדוברת"]],
  },
  {
    id: "codehaus",
    prefix: "codehaus",
    component: "CodehausPages",
    dataName: "codehausDefaultData",
    cssName: "codehausEditorCss",
    layout: "terminal",
    tone: "קוד",
    aboutTitle: "בוטקמפ שמלמד לבנות, לדבג ולשלוח לפרודקשן",
    aboutText: "Codehaus מתייחס ללמידה כמו לריפו אמיתי: ספרינטים, קומיטים, ביקורת קוד ופרויקטים עם API, דאטה וענן. המטרה היא לא רק לדעת תחביר אלא לשחרר מוצר.",
    aboutEyebrow: "$ cat about.md",
    whyTitle: "למה הדיפלוי שלכם לא נשאר בתיאוריה",
    why: [
      ["Code review אמיתי", "כל משימה עוברת ביקורת כמו בצוות מוצר."],
      ["Stack מלא", "React, Node, DB, Docker ו-CI באותו מסלול."],
      ["פורטפוליו חי", "יוצאים עם GitHub נקי, דמו וסטורי טכני."],
    ],
    methodTitle: "pipeline הלמידה",
    method: [
      ["init", "סביבת פיתוח, Git והרגלי עבודה."],
      ["build", "פיצ'רים מלאים בפרונט ובבקנד."],
      ["test", "בדיקות, דיבוג, אבטחה וביצועים."],
      ["deploy", "ענן, Docker, CI וראיון טכני."],
    ],
    outcomesTitle: "metrics אחרי release",
    outcomes: [
      ["11", "פרויקטים קטנים ופרויקט גמר אחד."],
      ["87%", "מסיימים עם דמו פעיל ו-README מקצועי."],
      ["24/7", "גישה להקלטות, תרגולים וריפו דוגמאות."],
    ],
    insightsTitle: "dev notes",
    insights: [
      ["איך קוראים stack trace", "שיטת עבודה שמקצרת שעות דיבוג."],
      ["README שמגייס", "מה חייב להופיע בפרויקט תיק עבודות."],
      ["ראיון טכני בלי פאניקה", "תרגול בקול של החלטות ו-tradeoffs."],
    ],
    ctaBandTitle: "ready to push?",
    ctaBandText: "נבדוק התאמה, רקע וזמן פנוי לפני שמתחילים.",
    ctaBandButton: "run apply",
    prices: ["6,500", "8,900", "12,000"],
    instructors: [["@noa", "frontend"], ["@itai", "backend"], ["@michal", "data"]],
  },
  {
    id: "noteline",
    prefix: "noteline",
    component: "NotelinePages",
    dataName: "notelineDefaultData",
    cssName: "notelineEditorCss",
    layout: "paper",
    tone: "מוזיקלי",
    aboutTitle: "בית ספר למוזיקה שבו כל תלמיד מוצא את הקול שלו",
    aboutText: "Noteline מחבר טכניקה, תרגול ובמה. הלמידה נכתבת כמו מחברת תווים: קווים ברורים, חזרות קבועות, הקלטות ומשוב שמפתח סגנון אישי.",
    aboutEyebrow: "מחברת במה",
    whyTitle: "למה התרגול נשמע אחרת",
    why: [
      ["שיעור שמוקלט", "התלמיד מקבל הקלטה, הערות ותוכנית חזרות."],
      ["הרכבים קטנים", "נגינה עם אחרים כבר במהלך המסלול."],
      ["במה אמיתית", "ערבי תלמידים שמלמדים עמידה, הקשבה וביטחון."],
    ],
    methodTitle: "ארבעה תווים להתקדמות",
    method: [
      ["כוונון", "מגדירים כלי, רמה וסגנון מוזיקלי."],
      ["טכניקה", "תרגול יסודות, קצב ושמיעה."],
      ["רפרטואר", "בונים שירים וקטעים שמתאימים לקול שלכם."],
      ["במה", "הקלטה או הופעה קטנה עם משוב."],
    ],
    outcomesTitle: "מה שומעים אחרי כמה שבועות",
    outcomes: [
      ["8 שיעורים", "עד ביצוע ראשון מוקלט."],
      ["3 הרכבים", "אפשרויות נגינה קבוצתיות בכל חודש."],
      ["95%", "מדווחים שהם מתרגלים יותר בזכות תוכנית ברורה."],
    ],
    insightsTitle: "שוליים מהמחברת",
    insights: [
      ["איך בונים שגרת חזרות", "חלוקה של 20 דקות שמייצרת התקדמות."],
      ["להופיע בלי קיפאון", "תרגילי נשימה ותשומת לב לפני במה."],
      ["להקשיב כמו מוזיקאי", "מה לשמוע בשיר לפני שמנגנים אותו."],
    ],
    ctaBandTitle: "התו הבא שלכם מחכה",
    ctaBandText: "נבחר מורה, כלי ומסלול חזרות שמתאים לקצב שלכם.",
    ctaBandButton: "לקביעת אודישן",
    prices: ["420", "760", "1,120"],
    instructors: [["דני בר", "גיטרה"], ["יעל מור", "פיתוח קול"], ["עומר לוי", "הפקה"]],
  },
  {
    id: "kidwise",
    prefix: "kidwise",
    component: "KidwisePages",
    dataName: "kidwiseDefaultData",
    cssName: "kidwiseEditorCss",
    layout: "playful",
    tone: "ילדים",
    aboutTitle: "מרחב למידה לילדים שמרגיש כמו משחק עם משמעות",
    aboutText: "Kidwise בונה חוגים וסדנאות שבהם ילדים חוקרים, יוצרים ומדברים בביטחון. כל פעילות משלבת צבע, תנועה, סקרנות ומורה שרואה את הילד.",
    aboutEyebrow: "לומדים בכיף",
    whyTitle: "למה ילדים חוזרים עם חיוך",
    why: [
      ["למידה דרך עשייה", "ניסוי, יצירה ומשחק במקום הרצאה ארוכה."],
      ["קבוצות קטנות", "מורה שמכיר כל ילד ונותן מקום לביטוי."],
      ["עדכון להורים", "סיכום קצר אחרי כל יחידה עם תמונות והתקדמות."],
    ],
    methodTitle: "הרפתקת הלמידה",
    method: [
      ["מגלים", "פותחים שאלה מסקרנת או אתגר צבעוני."],
      ["מנסים", "עובדים בידיים ומגלים פתרונות."],
      ["יוצרים", "בונים תוצר קטן שמספר מה למדנו."],
      ["משתפים", "מציגים לקבוצה ומקבלים עידוד."],
    ],
    outcomesTitle: "גדילה שרואים בבית",
    outcomes: [
      ["4 גילאים", "מסלולים מותאמים לגילאי גן עד יסודי."],
      ["89%", "הורים מדווחים על יותר ביטחון לדבר בכיתה."],
      ["12 פרויקטים", "תוצרים שילדים לוקחים הביתה בכל סמסטר."],
    ],
    insightsTitle: "פתקים להורים",
    insights: [
      ["איך מעודדים סקרנות", "שאלות קטנות שכדאי לשאול אחרי חוג."],
      ["יצירה בלי בלגן", "רעיונות לפינת חומרי יצירה בבית."],
      ["אנגלית דרך משחק", "משחקי מילים שאפשר לעשות באוטו."],
    ],
    ctaBandTitle: "בואו לגלות מה מדליק את הילד",
    ctaBandText: "שיחת התאמה קצרה להורים לפני בחירת קבוצה.",
    ctaBandButton: "דברו איתנו",
    prices: ["320", "540", "780"],
    instructors: [["תמר גל", "מדעים"], ["יואב כהן", "יצירה"], ["שירה בן", "אנגלית"]],
  },
  {
    id: "craftora",
    prefix: "craftora",
    component: "CraftoraPages",
    dataName: "craftoraDefaultData",
    cssName: "craftoraEditorCss",
    layout: "craft",
    tone: "אטלייה",
    aboutTitle: "אטלייה לסדנאות שבהן חומר, יד ורעיון נפגשים",
    aboutText: "Craftora מזמינה מבוגרים ויוצרים לעבוד עם קרמיקה, צבע, נייר והדפס. הסדנאות קטנות, החומרים איכותיים, והאווירה מאפשרת לטעות, לחזור ולגלות סגנון.",
    aboutEyebrow: "ידיים בחומר",
    whyTitle: "למה היצירה מרגישה אמיתית",
    why: [
      ["חומר איכותי", "כל סדנה כוללת כלים וחומרים מקצועיים."],
      ["הדגמה צמודה", "האמן עובד לידכם ומראה תהליך מלא."],
      ["תוצר שנשאר", "יוצאים עם עבודה מוגמרת או סדרה קטנה."],
    ],
    methodTitle: "ארבע שכבות בסטודיו",
    method: [
      ["השראה", "לוח חומרים, דוגמאות וסקיצות."],
      ["טכניקה", "הדגמה קצרה ותרגול מבוקר."],
      ["עבודה", "זמן סטודיו פתוח עם ליווי."],
      ["גימור", "ליטוש, שריפה, מסגור או צילום."],
    ],
    outcomesTitle: "מה נשאר אחרי הסדנה",
    outcomes: [
      ["6 חומרים", "קרמיקה, צבע, הדפס, בד, נייר ועץ."],
      ["10 משתתפים", "מקסימום בקבוצה לשמירה על שקט וליווי."],
      ["100%", "יוצאים עם תוצר או תוכנית המשך."],
    ],
    insightsTitle: "פתקים מהשולחן",
    insights: [
      ["איך לבחור סדנה ראשונה", "שאלות שיעזרו למצוא חומר שמתאים לכם."],
      ["למה סקיצה משחררת", "דרך להתחיל בלי לפחד מדף לבן."],
      ["טיפול בחומר בבית", "איך לשמור עבודות קרמיקה ונייר."],
    ],
    ctaBandTitle: "בואו ליצור משהו שנשאר על המדף",
    ctaBandText: "נבחר תאריך, חומר וקבוצה לפי ניסיון ורצון.",
    ctaBandButton: "להרשמה לסדנה",
    prices: ["240", "480", "920"],
    instructors: [["תום ארז", "קרמיקה"], ["הילה ניר", "ציור"], ["רעות כהן", "הדפס"]],
  },
  {
    id: "skillforge",
    prefix: "skillforge",
    component: "SkillforgePages",
    dataName: "skillforgeDefaultData",
    cssName: "skillforgeEditorCss",
    layout: "forge",
    tone: "מיומנויות",
    aboutTitle: "סדנת מיומנויות שמחשלת יכולות לעבודה אמיתית",
    aboutText: "Skillforge בנויה כמו בית מלאכה מקצועי: אימון קצר, אתגר ביצוע, משוב ותיקון. כל מסלול מתמקד במיומנות אחת עד שהיא הופכת להרגל עבודה.",
    aboutEyebrow: "מחשלת יכולות",
    whyTitle: "למה המיומנות יוצאת חזקה יותר",
    why: [
      ["תרגול תחת עומס", "סימולציות קצרות שמדמות יום עבודה אמיתי."],
      ["מדידה קשוחה", "ציון ביצוע, זמן, דיוק ושיפור בין סבבים."],
      ["מאמנים מהשטח", "מנחים שמגיעים מתעשייה, ניהול ותפעול."],
    ],
    methodTitle: "תהליך החישול",
    method: [
      ["חימום", "מיפוי רמה, יעד ואזורי חולשה."],
      ["מכה ראשונה", "תרגיל ביצוע קצר עם מגבלת זמן."],
      ["קירור", "משוב, תיקון ושיחה על החלטות."],
      ["חיזוק", "חזרה משופרת עד שהיכולת יציבה."],
    ],
    outcomesTitle: "תוצאות מהסדנה",
    outcomes: [
      ["37%", "שיפור ממוצע במהירות ביצוע."],
      ["9 יחידות", "תרגולי ליבה בכל מסלול."],
      ["3 מאמנים", "עיניים מקצועיות על כל קבוצה."],
    ],
    insightsTitle: "יומן המחשלת",
    insights: [
      ["איך בונים מיומנות", "למה חזרה קצרה עדיפה על מרתון חד פעמי."],
      ["משוב שלא מרכך אמת", "איך לקבל ביקורת ולהפוך אותה לתיקון."],
      ["סימולציה לפני ראיון", "תרגילים שמכינים לרגעי לחץ."],
    ],
    ctaBandTitle: "הכניסו את המיומנות לאש",
    ctaBandText: "נבחר מסלול אימון ויעד ביצוע מדיד.",
    ctaBandButton: "לתיאום אימון",
    prices: ["1,200", "2,400", "4,200"],
    instructors: [["רן פלד", "ניהול"], ["דנה צור", "מכירות"], ["אורי לב", "תפעול"]],
  },
  {
    id: "campusly",
    prefix: "campusly",
    component: "CampuslyPages",
    dataName: "campuslyDefaultData",
    cssName: "campuslyEditorCss",
    layout: "campus",
    tone: "אקדמי",
    aboutTitle: "מרכז למידה אקדמי שמסדר את הסמסטר מהשיעור הראשון",
    aboutText: "Campusly מעניקה לתלמידים וסטודנטים מערכת תמיכה מלאה: אבחון, שיעורים, מרתונים, סימולציות ומעקב ציונים. הכל בנוי כמו קמפוס קטן וברור.",
    aboutEyebrow: "קמפוס למידה",
    whyTitle: "למה הסמסטר נהיה מסודר יותר",
    why: [
      ["תוכנית לפי מבחן", "כל שיעור מחובר לתאריך יעד וסילבוס אמיתי."],
      ["מרצים מנוסים", "מורים שמכירים בחינות, עבודות ודרישות קבלה."],
      ["מעקב ציונים", "דוחות התקדמות קצרים שמראים מה לחזק."],
    ],
    methodTitle: "מסלול קמפוס",
    method: [
      ["אבחון", "בודקים רמה, יעד וציוני עבר."],
      ["מערכת", "בונים לוח שיעורים, מטלות ומרתונים."],
      ["למידה", "שיעורים קטנים עם תרגול בין מפגשים."],
      ["בחינה", "סימולציה, תיקון טעויות ותוכנית שבוע אחרון."],
    ],
    outcomesTitle: "מדדי קמפוס",
    outcomes: [
      ["18 נק׳", "שיפור ממוצע בציון לאחר סמסטר."],
      ["42 קבוצות", "מקצועות ויחידות לימוד פעילות."],
      ["96%", "נוכחות ממוצעת במרתוני בחינה."],
    ],
    insightsTitle: "ספריית הקמפוס",
    insights: [
      ["איך מתכננים שבוע מבחן", "חלוקה בין חזרה, תרגול ושינה."],
      ["טעויות נפוצות במתמטיקה", "שלוש בדיקות לפני שמגישים תשובה."],
      ["למידה בקבוצה קטנה", "מתי היא עדיפה על שיעור פרטי."],
    ],
    ctaBandTitle: "הסמסטר הבא יכול להיות רגוע יותר",
    ctaBandText: "נתאים מקצוע, רמה ולוח מפגשים לפי תאריך הבחינה.",
    ctaBandButton: "לבניית מערכת",
    prices: ["560", "980", "1,640"],
    instructors: [["ד״ר יעל אברהם", "מתמטיקה"], ["פרופ׳ דן לוי", "אנגלית"], ["מיכל כץ", "פסיכומטרי"]],
  },
  {
    id: "masterly",
    prefix: "masterly",
    component: "MasterlyPages",
    dataName: "masterlyDefaultData",
    cssName: "masterlyEditorCss",
    layout: "luxury",
    tone: "פרימיום",
    aboutTitle: "אקדמיית מאסטרקלאס לאנשים שרוצים עומק, במה וסטנדרט",
    aboutText: "Masterly יוצרת חוויית למידה פרטית ומוקפדת: מרצים בכירים, עריכה אישית, מפגשי עומק וקהל קטן. כל מסלול נבנה כמו פרק במגזין יוקרתי.",
    aboutEyebrow: "Private academy",
    whyTitle: "למה זו לא עוד הרצאה",
    why: [
      ["אוצרות תוכן", "כל מפגש נבחר ונערך סביב רעיון מרכזי."],
      ["קבוצה מצומצמת", "מעט משתתפים, הרבה שיחה ומקום למורכבות."],
      ["במה אישית", "מצגת, סיפור או פרויקט שמקבל ליטוש פרימיום."],
    ],
    methodTitle: "ארבעה פרקים למסטרי",
    method: [
      ["Prelude", "שיחת עומק, בחירת נושא והכנת חומרי השראה."],
      ["Study", "מפגשי ליבה עם קריאה, צפייה ודיון."],
      ["Salon", "תרגול מול קהל קטן ומשוב מדויק."],
      ["Signature", "עבודה מסכמת שמזקקת קול אישי."],
    ],
    outcomesTitle: "מדדי איכות",
    outcomes: [
      ["12", "מושבים חיים במסלול מלא."],
      ["1:6", "יחס מרצה-משתתפים במסלולי פרימיום."],
      ["94%", "מסיימים עם תוצר הצגה או הרצאה."],
    ],
    insightsTitle: "העיתון של Masterly",
    insights: [
      ["איך מעמיקים בלי להתפזר", "מסגרת אוצרות למפגש למידה עשיר."],
      ["נוכחות מול קהל קטן", "פרטים קטנים שמשנים הרצאה."],
      ["לכתוב קול מקצועי", "תרגיל עריכה שהופך ידע לטקסט חי."],
    ],
    ctaBandTitle: "הכניסה לסלון הבא פתוחה",
    ctaBandText: "נבדוק התאמה למסלול, זמינות ומטרת למידה אישית.",
    ctaBandButton: "בקשת הזמנה",
    prices: ["3,900", "6,800", "12,000"],
    instructors: [["אלון דרור", "Story"], ["נטע רם", "Stage"], ["יובל שר", "Brand"]],
  },
];

const layoutStyles = {
  cinematic: {
    header: "absolute inset-x-0 top-0 z-50 text-white",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8",
    brand: "t-display text-2xl font-extrabold tracking-tight text-[var(--p)]",
    nav: "hidden gap-5 text-xs font-bold uppercase tracking-[0.18em] text-white/70 lg:flex",
    active: "text-[var(--a)]",
    inactive: "hover:text-white",
    cta: "t-pulse bg-[var(--a)] px-5 py-2.5 text-sm font-bold text-white",
    section: "bg-[var(--dark)] text-white",
    panel: "border border-[var(--p)]/25 bg-[var(--surface)]/90",
    card: "border border-[var(--p)]/25 bg-[var(--dark)]/80 p-6",
    pill: "bg-[var(--a)] text-white",
    img: "opacity-75",
  },
  circular: {
    header: "sticky top-0 z-50 border-b border-[var(--p)]/20 bg-[var(--dark)]/90 text-white backdrop-blur-xl",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8",
    brand: "flex items-center gap-3 text-sm font-semibold tracking-wide",
    nav: "hidden items-center gap-4 text-xs text-[var(--muted)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-white",
    cta: "rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-[var(--dark)]",
    section: "bg-[var(--bg)] text-white",
    panel: "rounded-[2rem] border border-[var(--p)]/25 bg-[var(--surface)]",
    card: "rounded-full border border-[var(--p)]/35 bg-[var(--dark)] p-6 text-center",
    pill: "bg-[var(--p)] text-[var(--dark)]",
    img: "rounded-full",
  },
  soft: {
    header: "sticky top-0 z-50 bg-white/90 text-[var(--dark)] shadow-sm backdrop-blur",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8",
    brand: "t-display text-xl font-bold text-[var(--p)]",
    nav: "hidden items-center gap-5 text-sm font-semibold text-[var(--muted)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-[var(--dark)]",
    cta: "rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white",
    section: "bg-[var(--bg)] text-[var(--dark)]",
    panel: "rounded-[2rem] bg-white shadow-sm",
    card: "rounded-[2rem] bg-white p-6 shadow-sm",
    pill: "bg-[var(--a)] text-white",
    img: "rounded-[2rem]",
  },
  terminal: {
    header: "sticky top-0 z-50 border-b border-[var(--p)]/30 bg-black/90 font-mono text-xs backdrop-blur",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8",
    brand: "font-mono text-[var(--p)]",
    nav: "hidden items-center gap-4 text-[var(--muted)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-white",
    cta: "border border-[var(--p)] px-3 py-1 text-[var(--p)]",
    section: "bg-black font-mono text-white",
    panel: "border border-[var(--p)]/35 bg-[var(--surface)]",
    card: "border border-[var(--p)]/30 bg-black p-5",
    pill: "border border-[var(--p)] text-[var(--p)]",
    img: "grayscale",
  },
  paper: {
    header: "absolute inset-x-0 top-0 z-50 text-white",
    headerInner: "mx-auto flex max-w-7xl items-end justify-between px-5 py-5 lg:px-8",
    brand: "t-display text-xl font-bold text-[var(--a)]",
    nav: "hidden gap-5 text-xs uppercase tracking-[0.22em] text-white/70 lg:flex",
    active: "text-[var(--a)]",
    inactive: "hover:text-white",
    cta: "border border-[var(--a)] px-5 py-2 text-sm text-[var(--a)]",
    section: "bg-[var(--bg)] text-white",
    panel: "border border-[var(--a)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,.04)_0_2px,transparent_2px_36px)]",
    card: "border-b border-[var(--a)]/30 bg-[var(--surface)] p-6",
    pill: "bg-[var(--a)] text-white",
    img: "saturate-75",
  },
  playful: {
    header: "sticky top-0 z-50 bg-[var(--bg)]/90 text-[var(--dark)] backdrop-blur",
    headerInner: "mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8",
    brand: "t-display text-xl font-bold text-[var(--dark)]",
    nav: "hidden items-center gap-3 text-sm font-bold text-[var(--muted)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-[var(--dark)]",
    cta: "rounded-full bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white",
    section: "bg-[var(--bg)] text-[var(--dark)]",
    panel: "rounded-[2.5rem] bg-white shadow-sm",
    card: "rounded-[2rem] bg-white p-6 shadow-sm",
    pill: "rounded-full bg-[var(--a)] text-[var(--dark)]",
    img: "rounded-[2rem]",
  },
  craft: {
    header: "sticky top-0 z-50 border-b border-[var(--p)]/20 bg-[var(--bg)]/95 text-[var(--dark)] backdrop-blur",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8",
    brand: "t-display -rotate-1 border border-[var(--p)]/30 bg-white px-3 py-1 text-xl font-bold text-[var(--dark)]",
    nav: "hidden items-center gap-4 text-sm font-semibold text-[var(--muted)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-[var(--dark)]",
    cta: "bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white",
    section: "bg-[var(--bg)] text-[var(--dark)]",
    panel: "border border-[var(--p)]/25 bg-white shadow-[8px_8px_0_rgba(0,0,0,.08)]",
    card: "border border-[var(--p)]/20 bg-white p-6 shadow-[4px_4px_0_rgba(0,0,0,.06)]",
    pill: "bg-[var(--p)] text-white",
    img: "rotate-1",
  },
  forge: {
    header: "sticky top-0 z-50 border-b border-[var(--a)]/30 bg-[var(--dark)]/95 text-white backdrop-blur",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8",
    brand: "t-display text-xl font-black uppercase tracking-wider text-[var(--a)]",
    nav: "hidden items-center gap-4 text-xs font-black uppercase tracking-widest text-white/55 lg:flex",
    active: "text-[var(--a)]",
    inactive: "hover:text-white",
    cta: "bg-[var(--a)] px-5 py-2.5 text-sm font-black uppercase text-[var(--dark)]",
    section: "bg-[var(--dark)] text-white",
    panel: "border-2 border-[var(--a)]/35 bg-[var(--surface)]",
    card: "border-2 border-[var(--a)]/30 bg-[var(--bg)] p-6",
    pill: "bg-[var(--a)] text-[var(--dark)]",
    img: "contrast-125 grayscale",
  },
  campus: {
    header: "sticky top-0 z-50 border-b border-[var(--p)]/15 bg-white/95 text-[var(--dark)] backdrop-blur",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8",
    brand: "t-display text-lg font-bold text-[var(--dark)]",
    nav: "hidden items-center gap-5 text-sm font-semibold text-[var(--muted)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-[var(--dark)]",
    cta: "bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white",
    section: "bg-[var(--bg)] text-[var(--dark)]",
    panel: "border border-[var(--p)]/20 bg-white",
    card: "border border-[var(--p)]/15 bg-white p-6",
    pill: "bg-[var(--p)] text-white",
    img: "",
  },
  luxury: {
    header: "absolute inset-x-0 top-0 z-50 text-white",
    headerInner: "mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8",
    brand: "t-display text-2xl tracking-[0.22em] text-[var(--p)]",
    nav: "hidden gap-8 text-[10px] uppercase tracking-[0.35em] text-[var(--a)] lg:flex",
    active: "text-[var(--p)]",
    inactive: "hover:text-white",
    cta: "border border-[var(--p)] px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-[var(--p)]",
    section: "bg-black text-white",
    panel: "border border-[var(--p)]/30 bg-[var(--surface)]/70",
    card: "border-b border-[var(--p)]/25 p-6",
    pill: "border border-[var(--p)] text-[var(--p)]",
    img: "opacity-80",
  },
};

/** Shared verified pool — never include dead Unsplash ids (e.g. 1523050854058). */
const galleryImagePool = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
];

const galleryImagesByTemplate = {
  lectora: [0, 1, 4, 8],
  mentora: [5, 6, 9, 10],
  polyglota: [7, 11, 12, 2],
  codehaus: [13, 3, 14, 15],
  noteline: [16, 17, 1, 18],
  kidwise: [10, 8, 5, 12],
  craftora: [15, 4, 19, 6],
  skillforge: [9, 13, 2, 14],
  campusly: [17, 0, 16, 3],
  masterly: [11, 18, 7, 1],
};

function galleryImagesFor(templateId) {
  const indexes = galleryImagesByTemplate[templateId] || [0, 1, 2, 3];
  return indexes.map((i) => galleryImagePool[i % galleryImagePool.length]);
}

function json(value) {
  return JSON.stringify(value);
}

function pageConst(prefix) {
  return `export const ${prefix}Pages = ${JSON.stringify(pages, null, 2).replace(/"([^"]+)":/g, "$1:")};\n\nconst allowedPages = ${prefix}Pages.map((page) => page.id);`;
}

function navLabelFunction() {
  return `const navLabelKeys: Record<string, string> = {
  home: "navHome",
  about: "navAbout",
  courses: "navCourses",
  curriculum: "navCurriculum",
  instructors: "navInstructors",
  campus: "navCampus",
  faq: "navFaq",
  contact: "navContact",
};

type PageProps = { data: Record<string, any>; openModal: () => void; goTo: (pageId: string) => void };

function getNavLabel(data: Record<string, any>, page: { id: string; label: string }) {
  return getValue(data, navLabelKeys[page.id]) || page.label;
}`;
}

function headerCode(c) {
  const s = layoutStyles[c.layout];
  const prefix = c.prefix;
  if (c.layout === "terminal") {
    return `function Header({ data, currentPage, goTo, openModal }: { data: Record<string, any>; currentPage: string; goTo: (pageId: string) => void; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="${s.header}">
      <div className="${s.headerInner}">
        <button type="button" onClick={() => goTo("home")} className="${s.brand}">~/edu/<span className="text-white">{getValue(data,"brandName").toLowerCase()}</span></button>
        <nav className="${s.nav}">
          {${prefix}Pages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "${s.active}" : "${s.inactive}"}>{page.id}</button>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="${s.cta}">apply --now</button>
      </div>
    </header>
  );
}`;
  }
  return `function Header({ data, currentPage, goTo, openModal }: { data: Record<string, any>; currentPage: string; goTo: (pageId: string) => void; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="${s.header}">
      <div className="${s.headerInner}">
        <button type="button" onClick={() => goTo("home")} className="${s.brand}">{getValue(data,"logoText")} · {getValue(data,"brandName")}</button>
        <nav className="${s.nav}">
          {${prefix}Pages.map((page) => (
            <button key={page.id} type="button" onClick={() => goTo(page.id)} className={currentPage === page.id ? "${s.active}" : "${s.inactive}"}>{getNavLabel(data, page)}</button>
          ))}
        </nav>
        <button type="button" onClick={openModal} className="${s.cta}">{getValue(data,"heroPrimaryButton")}</button>
      </div>
    </header>
  );
}`;
}

function helpersCode() {
  return `function reasonItems(data: Record<string, any>) {
  return [
    [getValue(data,"whyOneTitle"), getValue(data,"whyOneText")],
    [getValue(data,"whyTwoTitle"), getValue(data,"whyTwoText")],
    [getValue(data,"whyThreeTitle"), getValue(data,"whyThreeText")],
  ];
}

function methodItems(data: Record<string, any>) {
  return [
    [getValue(data,"methodOneTitle"), getValue(data,"methodOneText")],
    [getValue(data,"methodTwoTitle"), getValue(data,"methodTwoText")],
    [getValue(data,"methodThreeTitle"), getValue(data,"methodThreeText")],
    [getValue(data,"methodFourTitle"), getValue(data,"methodFourText")],
  ];
}

function outcomeItems(data: Record<string, any>) {
  return [
    [getValue(data,"outcomeOneTitle"), getValue(data,"outcomeOneText")],
    [getValue(data,"outcomeTwoTitle"), getValue(data,"outcomeTwoText")],
    [getValue(data,"outcomeThreeTitle"), getValue(data,"outcomeThreeText")],
  ];
}

function insightItems(data: Record<string, any>) {
  return [
    [getValue(data,"insightOneTitle"), getValue(data,"insightOneText")],
    [getValue(data,"insightTwoTitle"), getValue(data,"insightTwoText")],
    [getValue(data,"insightThreeTitle"), getValue(data,"insightThreeText")],
  ];
}

function priceItems(data: Record<string, any>) {
  return [
    [getValue(data,"itemOneTitle"), getValue(data,"itemOneText"), getValue(data,"priceOne")],
    [getValue(data,"itemTwoTitle"), getValue(data,"itemTwoText"), getValue(data,"priceTwo")],
    [getValue(data,"itemThreeTitle"), getValue(data,"itemThreeText"), getValue(data,"priceThree")],
  ];
}

function galleryItems(data: Record<string, any>) {
  const fallback = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85";
  return [getValue(data,"galleryOneImage"), getValue(data,"galleryTwoImage"), getValue(data,"galleryThreeImage"), getValue(data,"galleryFourImage")]
    .map((image) => String(image || "").trim() || fallback);
}`;
}

function sectionSuite(c) {
  const s = layoutStyles[c.layout];
  const pageHeroExtra = c.layout === "terminal" ? `<p className="mt-4 font-mono text-[var(--p)]">$ open /{page.id}</p>` : `<button type="button" onClick={() => goTo("contact")} className="mt-8 inline-flex px-6 py-3 text-sm font-bold ${s.pill}">{getValue(data,"ctaBandButton")}</button>`;
  const whyClass = {
    cinematic: "grid gap-4 md:grid-cols-3",
    circular: "flex flex-wrap justify-center gap-5",
    soft: "mx-auto grid max-w-4xl gap-5 md:grid-cols-3",
    terminal: "mx-auto max-w-4xl space-y-3",
    paper: "mx-auto max-w-4xl divide-y divide-[var(--a)]/20",
    playful: "mx-auto grid max-w-5xl gap-5 md:grid-cols-3",
    craft: "mx-auto grid max-w-5xl gap-6 md:grid-cols-3",
    forge: "mx-auto grid max-w-5xl gap-4 md:grid-cols-3",
    campus: "mx-auto max-w-5xl divide-y divide-[var(--p)]/15 border border-[var(--p)]/15 bg-white",
    luxury: "mx-auto grid max-w-5xl gap-10 md:grid-cols-3",
  }[c.layout];
  const methodClass = {
    cinematic: "relative mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-4",
    circular: "mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-6",
    soft: "mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-4",
    terminal: "mx-auto mt-10 max-w-4xl border-r-2 border-[var(--p)]/40 pr-8",
    paper: "mx-auto mt-12 grid max-w-5xl gap-0 md:grid-cols-4",
    playful: "mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-4",
    craft: "mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-4",
    forge: "mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-4",
    campus: "mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-0 border border-[var(--p)]/15 bg-white md:grid-cols-4",
    luxury: "mx-auto mt-14 max-w-4xl space-y-10",
  }[c.layout];
  const galleryClass = {
    cinematic: "mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4",
    circular: "mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4",
    soft: "mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-[1.2fr_.8fr_1fr]",
    terminal: "mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-4",
    paper: "mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-0 md:grid-cols-4",
    playful: "mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 md:grid-cols-4",
    craft: "mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4",
    forge: "mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4",
    campus: "mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-4",
    luxury: "mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-4",
  }[c.layout];
  return `${helpersCode()}

function PageHero({ data, page, goTo }: PageProps & { page: PageEntry }) {
  return (
    <section data-template-section-type="pageHero" className="relative overflow-hidden px-5 py-28 lg:px-8 ${s.section}">
      <SafeImg src={getValue(data,"heroImage")} alt="" className="absolute inset-0 h-full w-full object-cover ${s.img}" />
      <div className="absolute inset-0 bg-[var(--dark)]/70" />
      <Reveal className="relative z-10 mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display mt-5 text-5xl font-bold md:text-7xl">{getNavLabel(data, page)}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"aboutText")}</p>
        ${pageHeroExtra}
      </Reveal>
    </section>
  );
}

function About({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="about" className="px-5 py-24 lg:px-8 ${s.section}">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <Reveal className="relative min-h-[360px] overflow-hidden ${s.panel}">
          <SafeImg src={getValue(data,"sectionImage")} alt="" className="absolute inset-0 h-full w-full object-cover ${s.img}" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent" />
          <span className="absolute bottom-6 right-6 rounded-full px-4 py-2 text-sm font-bold ${s.pill}">${c.tone}</span>
        </Reveal>
        <Reveal variant="up" className="${s.panel} p-8 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"aboutEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold md:text-5xl">{getValue(data,"aboutTitle")}</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{getValue(data,"aboutText")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function WhyUs({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="why" className="px-5 py-24 lg:px-8 ${s.section}">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"whyEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"whyTitle")}</h2>
      </Reveal>
      <div className="mt-12 ${whyClass}">
        {reasonItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 80} className="t-hover ${s.card}">
            <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${s.pill}">{i + 1}</span>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Method({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="method" className="px-5 py-24 lg:px-8 ${s.section}">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"methodEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"methodTitle")}</h2>
      </Reveal>
      <div className="${methodClass}">
        {methodItems(data).map(([title, text], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover ${s.card}">
            <p className="t-display text-4xl text-[var(--a)]">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gallery({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="gallery" className="px-5 py-24 lg:px-8 ${s.section}">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"galleryEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"galleryTitle")}</h2>
      </Reveal>
      <div className="${galleryClass}">
        {galleryItems(data).map((image, i) => (
          <Reveal key={image} delayMs={i * 80} className="t-hover relative min-h-[260px] overflow-hidden ${s.panel}">
            <SafeImg src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-110 ${s.img}" />
            <span className="absolute bottom-4 right-4 px-3 py-1 text-xs font-bold ${s.pill}">0{i + 1}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="outcomes" className="px-5 py-20 lg:px-8 ${s.section}">
      <div className="mx-auto max-w-6xl ${s.panel} p-8 lg:p-12">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"outcomesEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"outcomesTitle")}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {outcomeItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 90} className="t-hover border-t border-[var(--p)]/25 pt-6">
              <p className="t-display text-4xl font-bold text-[var(--a)]">{title}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="pricing" className="px-5 py-24 lg:px-8 ${s.section}">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"pricingEyebrow")}</p>
        <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"pricingTitle")}</h2>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {priceItems(data).map(([title, text, price], i) => (
          <Reveal key={title} delayMs={i * 90} className="t-hover ${s.card}">
            <p className="text-sm text-[var(--muted)]">{title}</p>
            <p className="t-display mt-4 text-4xl font-bold">₪{price}</p>
            <p className="mt-4 min-h-14 text-sm leading-7 text-[var(--muted)]">{text}</p>
            <button type="button" onClick={() => goTo("contact")} className="mt-8 w-full px-5 py-3 text-sm font-bold ${s.pill}">{getValue(data,"ctaBandButton")}</button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Insights({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="insights" className="px-5 py-24 lg:px-8 ${s.section}">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--a)]">{getValue(data,"insightsEyebrow")}</p>
          <h2 className="t-display mt-4 text-4xl font-bold">{getValue(data,"insightsTitle")}</h2>
          <button type="button" onClick={() => goTo("faq")} className="mt-8 px-5 py-3 text-sm font-bold ${s.pill}">{getValue(data,"navFaq")}</button>
        </Reveal>
        <div className="grid gap-4">
          {insightItems(data).map(([title, text], i) => (
            <Reveal key={title} delayMs={i * 80} className="t-hover ${s.card}">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--a)]">article 0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ data, goTo }: Pick<PageProps, "data" | "goTo">) {
  return (
    <section data-template-section-type="cta" className="px-5 py-20 lg:px-8 ${s.section}">
      <Reveal className="mx-auto max-w-5xl ${s.panel} p-8 text-center lg:p-14">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"ctaBandTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{getValue(data,"ctaBandText")}</p>
        <button type="button" onClick={() => goTo("contact")} className="mt-8 px-8 py-4 text-sm font-bold ${s.pill}">{getValue(data,"ctaBandButton")}</button>
      </Reveal>
    </section>
  );
}`;
}

function pageComposition(prefix) {
  return `const pageSectionOrder: Record<string, string[]> = {
  home: ["Hero", "About", "Courses", "WhyUs", "Curriculum", "Instructors", "Gallery", "Stats", "Testimonials", "Outcomes", "Pricing", "Insights", "Faq", "CTABand", "Contact", "Footer"],
  about: ["PageHero", "About", "WhyUs", "Stats", "Instructors", "Gallery", "Method", "Testimonials", "Outcomes", "CTABand", "Contact", "Footer"],
  courses: ["PageHero", "Courses", "Pricing", "Curriculum", "WhyUs", "Gallery", "Instructors", "Outcomes", "Faq", "CTABand", "Contact", "Footer"],
  curriculum: ["PageHero", "Curriculum", "Method", "Courses", "WhyUs", "Outcomes", "Instructors", "Insights", "Faq", "Contact", "Footer"],
  instructors: ["PageHero", "Instructors", "About", "WhyUs", "Gallery", "Testimonials", "Outcomes", "Method", "CTABand", "Contact", "Footer"],
  campus: ["PageHero", "Gallery", "About", "Stats", "WhyUs", "Instructors", "Insights", "Outcomes", "CTABand", "Contact", "Footer"],
  faq: ["PageHero", "Faq", "Insights", "WhyUs", "Method", "Pricing", "Testimonials", "Courses", "CTABand", "Contact", "Footer"],
  contact: ["PageHero", "Contact", "About", "Faq", "WhyUs", "Instructors", "Gallery", "Outcomes", "CTABand", "Footer"],
};

function renderSection(sectionName: string, page: PageEntry, props: PageProps) {
  switch (sectionName) {
    case "Hero": return <Hero data={props.data} openModal={props.openModal} />;
    case "PageHero": return <PageHero data={props.data} page={page} goTo={props.goTo} openModal={props.openModal} />;
    case "About": return <About data={props.data} />;
    case "Courses": return <Courses data={props.data} openModal={props.openModal} />;
    case "WhyUs": return <WhyUs data={props.data} />;
    case "Curriculum": return <Curriculum data={props.data} />;
    case "Instructors": return <Instructors data={props.data} />;
    case "Gallery": return <Gallery data={props.data} />;
    case "Stats": return <Stats data={props.data} />;
    case "Testimonials": return <Testimonials data={props.data} />;
    case "Outcomes": return <Outcomes data={props.data} />;
    case "Pricing": return <Pricing data={props.data} goTo={props.goTo} />;
    case "Insights": return <Insights data={props.data} goTo={props.goTo} />;
    case "Faq": return <Faq data={props.data} />;
    case "CTABand": return <CTABand data={props.data} goTo={props.goTo} />;
    case "Contact": return <Contact data={props.data} openModal={props.openModal} />;
    case "Footer": return <Footer data={props.data} openModal={props.openModal} />;
    default: return null;
  }
}`;
}

function defaultDataFor(c) {
  const [i1, i2, i3] = c.instructors;
  return {
    navHome: "בית",
    navAbout: "אודות",
    navCourses: "קורסים",
    navCurriculum: "סילבוס",
    navInstructors: "מנחים",
    navCampus: "קמפוס",
    navFaq: "שאלות",
    navContact: "צור קשר",
    aboutEyebrow: c.aboutEyebrow,
    aboutTitle: c.aboutTitle,
    aboutText: c.aboutText,
    whyEyebrow: "למה אנחנו",
    whyTitle: c.whyTitle,
    whyOneTitle: c.why[0][0],
    whyOneText: c.why[0][1],
    whyTwoTitle: c.why[1][0],
    whyTwoText: c.why[1][1],
    whyThreeTitle: c.why[2][0],
    whyThreeText: c.why[2][1],
    methodEyebrow: "השיטה",
    methodTitle: c.methodTitle,
    methodOneTitle: c.method[0][0],
    methodOneText: c.method[0][1],
    methodTwoTitle: c.method[1][0],
    methodTwoText: c.method[1][1],
    methodThreeTitle: c.method[2][0],
    methodThreeText: c.method[2][1],
    methodFourTitle: c.method[3][0],
    methodFourText: c.method[3][1],
    galleryEyebrow: "מהקמפוס",
    galleryTitle: "רגעים מתוך הלמידה",
    galleryOneImage: galleryImagesFor(c.id)[0],
    galleryTwoImage: galleryImagesFor(c.id)[1],
    galleryThreeImage: galleryImagesFor(c.id)[2],
    galleryFourImage: galleryImagesFor(c.id)[3],
    outcomesEyebrow: "תוצאות",
    outcomesTitle: c.outcomesTitle,
    outcomeOneTitle: c.outcomes[0][0],
    outcomeOneText: c.outcomes[0][1],
    outcomeTwoTitle: c.outcomes[1][0],
    outcomeTwoText: c.outcomes[1][1],
    outcomeThreeTitle: c.outcomes[2][0],
    outcomeThreeText: c.outcomes[2][1],
    pricingEyebrow: "מסלולים",
    pricingTitle: "בחרו מסלול לימוד",
    priceOne: c.prices[0],
    priceTwo: c.prices[1],
    priceThree: c.prices[2],
    insightsEyebrow: "תובנות",
    insightsTitle: c.insightsTitle,
    insightOneTitle: c.insights[0][0],
    insightOneText: c.insights[0][1],
    insightTwoTitle: c.insights[1][0],
    insightTwoText: c.insights[1][1],
    insightThreeTitle: c.insights[2][0],
    insightThreeText: c.insights[2][1],
    ctaBandTitle: c.ctaBandTitle,
    ctaBandText: c.ctaBandText,
    ctaBandButton: c.ctaBandButton,
    instructorOneName: i1[0],
    instructorOneRole: i1[1],
    instructorTwoName: i2[0],
    instructorTwoRole: i2[1],
    instructorThreeName: i3[0],
    instructorThreeRole: i3[1],
  };
}

function replaceBetween(text, startNeedle, endNeedle, replacement) {
  const start = text.indexOf(startNeedle);
  const end = text.indexOf(endNeedle, start);
  if (start === -1 || end === -1) throw new Error(`Cannot replace between ${startNeedle} and ${endNeedle}`);
  return text.slice(0, start) + replacement + text.slice(end);
}

function updatePagesFile(c) {
  const file = path.join(ROOT, c.id, "pages.tsx");
  let text = fs.readFileSync(file, "utf8");
  if (!text.includes('from "../shared/SafeImg"')) {
    if (text.includes('from "../shared/Reveal";')) {
      text = text.replace(
        'from "../shared/Reveal";',
        'from "../shared/Reveal";\nimport SafeImg from "../shared/SafeImg";',
      );
    } else {
      text = `import SafeImg from "../shared/SafeImg";\n${text}`;
    }
  }
  text = text.replace(new RegExp(`export const ${c.prefix}Pages = \\[\\{ id: "home", label: "בית", slug: "/" \\}\\];`), pageConst(c.prefix));
  if (!text.includes("type PageEntry =")) {
    text = text.replace(/\n\ntype [A-Za-z]+PagesProps = \{/, `\n\ntype PageEntry = (typeof ${c.prefix}Pages)[number];\n\ntype ${c.component.replace(/Pages$/, "")}PagesProps = {`);
  }
  if (!text.includes("function getNavLabel")) {
    text = text.replace(/\n\nfunction Header/, `\n\n${navLabelFunction()}\n\nfunction Header`);
  }
  text = replaceBetween(text, "function Header", "\n\nfunction Hero", headerCode(c) + "\n\n");
  if (!text.includes("function PageHero")) {
    text = text.replace(/\nfunction Contact\(/, `\n${sectionSuite(c)}\n\nfunction Contact(`);
  }
  if (text.includes("function HomePage")) {
    text = replaceBetween(text, "function HomePage", `\n\nexport default function ${c.component}`, `${pageComposition(c.prefix)}\n\n`);
  }
  text = text.replace("const { currentPage } = useTemplatePageNavigation(", "const { currentPage, goTo } = useTemplatePageNavigation(");
  text = text.replace('{ allowedPages: ["home"], fallbackPage: "home" }', '{ allowedPages, fallbackPage: "home" }');
  text = text.replace(`<Header data={mergedData} openModal={() => setModalOpen(true)} />`, `<Header data={mergedData} currentPage={currentPage} goTo={goTo} openModal={() => setModalOpen(true)} />`);
  text = text.replace(
    /<VisualPageStack\s+activePageId=\{currentPage\}\s+pages=\{\[\{ id: "home", content: <HomePage data=\{mergedData\} openModal=\{\(\) => setModalOpen\(true\)\} \/> \}\]\}\s+\/>/,
    `<VisualPageStack activePageId={currentPage} pages={${c.prefix}Pages.map((page) => ({ id: page.id, content: <>{(pageSectionOrder[page.id] ?? pageSectionOrder.home).map((sectionName, index) => <React.Fragment key={page.id + "-" + sectionName + "-" + index}>{renderSection(sectionName, page, { data: mergedData, openModal: () => setModalOpen(true), goTo })}</React.Fragment>)}</> }))} />`,
  );
  fs.writeFileSync(file, text);
}

function updateDefaultData(c) {
  const file = path.join(ROOT, c.id, "defaultData.ts");
  let text = fs.readFileSync(file, "utf8");
  const data = defaultDataFor(c);
  for (const [key, value] of Object.entries(data)) {
    const line = `  ${key}: ${json(value)},`;
    const keyRegex = new RegExp(`  ${key}: (?:'[^']*'|"[^"]*"|[\\s\\S]*?),\\n`);
    if (keyRegex.test(text)) {
      text = text.replace(keyRegex, `${line}\n`);
    } else {
      text = text.replace(/\n};\s*$/, `\n${line}\n};\n`);
    }
  }
  fs.writeFileSync(file, text);
}

function updateMeta(c) {
  const file = path.join(ROOT, c.id, "meta.ts");
  let text = fs.readFileSync(file, "utf8");
  if (!text.includes('type: "pageHero"')) {
    const prefixMatch = text.match(/variant: "([^"]+)-hero"/);
    const variantPrefix = prefixMatch?.[1] ?? c.layout;
    const newBlocks = [
      "pageHero",
      "about",
      "why",
      "method",
      "gallery",
      "outcomes",
      "pricing",
      "insights",
      "cta",
    ].map((type) => `  { type: "${type}", variant: "${variantPrefix}-${type}", title: "${type}" },`).join("\n");
    text = text.replace(/(  \{ type: "hero"[^\n]+\},\n)/, `$1${newBlocks}\n`);
  }
  fs.writeFileSync(file, text);
}

const metaOnly = process.argv.includes("--meta-only");

for (const template of templates) {
  if (!metaOnly) {
    updatePagesFile(template);
    updateDefaultData(template);
  }
  updateMeta(template);
  console.log(`expanded ${template.id}`);
}
