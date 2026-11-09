import { SCAN_LOCALES } from "./websiteScanLocales.mjs";

const updated = "2026-11-09";

const heFaq = [
  ["מהי סריקת אתר חכמה?", "סריקת אתר חכמה היא תהליך אוטומטי שבודק מאפיינים ותכנים שניתן לגשת אליהם באתר, ומרכז ממצאים בתחומים כגון אבטחה, פרטיות, נגישות ומסמכים ציבוריים. Bizuply Compliance AI מוסיפה ניתוח של חלק מהתוצאות כדי להציג הסברים והמלצות בשפה ברורה."],
  ["האם אפשר לבדוק אתר בחינם?", "כן. ניתן להתחיל סריקה ללא תשלום ולקבל דוח ראשוני עם ציון כללי, היקף הבדיקות ומספר הממצאים. הדוח המלא, הכולל פירוט והמלצות, מוצע בנפרד."],
  ["האם צריך לתת גישה לניהול האתר?", "לא. הסריקה מבוססת על מידע ורכיבים שהמערכת יכולה לגשת אליהם מבחוץ. אין צורך למסור סיסמת ניהול או להתקין תוסף באתר."],
  ["האם הסריקה בודקת עמידה בחוקי פרטיות?", "הסריקה יכולה לזהות סימנים טכניים ותוכן ציבורי הקשורים לפרטיות, אך אינה יכולה לקבוע לבדה עמידה מלאה בכל דין. חובות משפטיות תלויות בין היתר במדינה, בפעילות העסק, במידע שנאסף ובנסיבות שאינן תמיד גלויות באתר."],
  ["האם בדיקת נגישות אוטומטית מספיקה?", "לא. בדיקות אוטומטיות יכולות לזהות חלק מבעיות הנגישות, אך אינן מכסות את כל הדרישות והתרחישים. הדוח מציג את הממצאים שניתן לבסס ואת מגבלות הבדיקה."],
  ["האם המערכת מבצעת בדיקת חדירה?", "לא. מדובר בסריקה אוטומטית של מאפיינים נגישים מבחוץ, ולא בבדיקת חדירה יזומה או בביקורת אבטחה מקיפה."],
  ["כמה זמן נמשכת הסריקה?", "משך הסריקה משתנה בהתאם לגודל האתר, לזמינות העמודים, למספר הבקשות ולבדיקות שניתן לבצע. המערכת מציגה את התקדמות הבדיקה."],
  ["מה ההבדל בין הדוח החינמי לדוח המלא?", "הדוח החינמי מציג סיכום כללי. הדוח המלא מוסיף פירוט ממצאים, ראיות, מיקומים באתר, הסברים והמלצות תיקון, לצד PDF להורדה."],
  ["האם ניתן לבצע סריקה חוזרת?", "כן, בהתאם למסלול ולמכסות הרלוונטיות. התוכנית השנתית כוללת סריקה אחת בכל חודש למשך תקופת המנוי ששולמה."],
  ["האם המנוי השנתי מחויב מדי חודש?", "לא. התשלום הוא 300 דולר מראש עבור שנה. המחיר של 25 דולר לחודש מוצג כשווי חודשי בלבד. המנוי מתחדש אוטומטית מדי שנה אלא אם החידוש בוטל."],
  ["מה קורה אם מבטלים את החידוש?", "ביטול החידוש מונע את החיוב השנתי הבא, אך אינו מפסיק את הסריקות שכבר שולמו. השירות ממשיך עד סוף התקופה השנתית הפעילה."],
  ["האם ניתן להוריד את הדוח?", "הדוח המפורט כולל אפשרות להורדת PDF בהתאם לזכאות הרכישה או המנוי."],
];

export const WEBSITE_SCAN = {
  he: {
    updated,
    title: "סריקת אתר חכמה AI | פרטיות, אבטחה ונגישות | Bizuply",
    description: "בדקו את האתר שלכם בחינם עם Bizuply Compliance AI. סריקה חכמה לפרטיות, עוגיות, אבטחה, נגישות ומסמכים. דוח ראשוני חינם ודוח מפורט עם המלצות.",
    crumb: "סריקת אתר",
    h1: "סריקת אתר חכמה עם AI — גלו מה כדאי לבדוק ולתקן באתר שלכם",
    lede: "האתר שלכם יכול להיראות מצוין ועדיין להכיל בעיות שלא רואים במבט ראשון. Bizuply Compliance AI מבצעת בדיקות אוטומטיות של פרטיות ועוגיות, הגדרות אבטחה, נגישות ומסמכים ציבוריים — ומרכזת את התוצאות בדוח ברור עם ממצאים והמלצות מעשיות.",
    note: "מתחילים בסריקה ראשונית בחינם. רוצים להבין מה בדיוק נמצא, באיזה עמוד ואיך מטפלים? הדוח המלא מציג את פירוט הממצאים, הראיות וההמלצות.",
    aside: "בדיקה אוטומטית של מידע ורכיבים נגישים באתר. ללא התקנת תוכנה.",
    primary: "סרקו את האתר בחינם",
    watch: "צפו בסריקה לדוגמה",
    videoTitle: "סריקת אתר לדוגמה ב־Bizuply Compliance AI",
    transcript: "ההדגמה מציגה הזנת שם וכתובת example.com, התקדמות בין פרטיות, אבטחה, נגישות ומסמכים, דוח ראשוני עם ציון 82, ואחר כך דוח מלא לדוגמה עם ראיה, המלצה ומקור. הנתונים פיקטיביים. לא מתבצעת סריקה אמיתית.",
    sections: [
      { heading: "האתר עובד. אבל האם אתם יודעים מה קורה מאחורי הקלעים?", paragraphs: ["כשבונים אתר, רוב תשומת הלב מופנית לעיצוב, למהירות ולחוויית המשתמש. אבל יש עוד שכבה שמשפיעה על האופן שבו האתר פועל: הגדרות אבטחה, רכיבי מעקב, מסמכי פרטיות, נגישות ומידע שמוצג למבקרים.", "חלק מהבעיות אינן בולטות לעין. למשל, אתר יכול להשתמש בחיבור HTTPS ועדיין להחסיר כותרות אבטחה מסוימות. עמוד יכול להיראות קריא לבעל האתר, אבל להכיל ניגודיות צבעים נמוכה או רכיבים שקשה להפעיל באמצעות מקלדת.", "גם מסמכים ציבוריים דורשים תשומת לב: האם אפשר להגיע למדיניות הפרטיות? האם יש הסבר ברור על שימוש בעוגיות? האם תנאי השימוש זמינים למבקרים?", "סריקת אתר חכמה מאפשרת לקבל תמונת מצב ראשונית ומסודרת, במקום לבדוק כל נושא בנפרד."] },
      { heading: "ארבעה תחומים שכדאי להכיר באתר שלכם", paragraphs: [], subsections: [
        { heading: "פרטיות ועוגיות", paragraphs: ["האם האתר מפעיל רכיבי מעקב? האם קיימת מדיניות פרטיות נגישה? האם מנגנון בחירת העוגיות מוצג ופועל בהתאם למה שניתן לבדוק באופן אוטומטי?", "המערכת בוחנת סימנים טכניים ותוכן ציבורי הקשורים לפרטיות ולעוגיות, ומציגה ממצאים כאשר קיימות ראיות מתאימות."] },
        { heading: "אבטחת אתר", paragraphs: ["חיבור מאובטח הוא רק חלק מהתמונה. כותרות HTTP מסוימות מסייעות לדפדפן לאכוף הגנות נוספות.", "הסריקה בודקת מאפייני אבטחה שניתן לזהות מבחוץ, כגון HTTPS וכותרות אבטחה רלוונטיות, ומצביעה על הגדרות שכדאי לבחון."] },
        { heading: "נגישות האתר", paragraphs: ["האם מבנה העמודים ברור? האם ניתן לזהות בעיות אוטומטיות ברכיבים ובתוכן? האם קיימות בעיות ניגודיות שניתן למדוד?", "המערכת משתמשת בבדיקות אוטומטיות לזיהוי חלק מבעיות הנגישות. חשוב לדעת שלא כל היבטי הנגישות ניתנים להכרעה אוטומטית."] },
        { heading: "מסמכים ותנאים", paragraphs: ["מדיניות פרטיות, תנאי שימוש, הצהרת נגישות ומסמכים נוספים עשויים להיות חלק חשוב מחוויית השימוש באתר.", "הסריקה מאתרת מסמכים ציבוריים שניתן לגשת אליהם, בוחנת את התוכן הזמין ומציגה נושאים שאותרו או שלא ניתן היה לזהות במסמכים שנבדקו. אין להסיק אוטומטית שהיעדר ניסוח מסוים מהווה הפרת חוק."] },
      ] },
      { heading: "כך נראית סריקת אתר בפועל", paragraphs: ["לא צריך להבין בקוד או בהגדרות שרת כדי להתחיל. מזינים שם מלא וכתובת אתר, והמערכת מתחילה לבדוק את המידע והרכיבים שהיא יכולה לגשת אליהם.", "בסרטון אפשר לראות את שלבי הסריקה, את הדוח הראשוני ואת ההבדל בין הסיכום החינמי לדוח המפורט."] },
      { heading: "מה מקבלים בסריקת האתר החינמית?", paragraphs: ["הדוח הראשוני מיועד למי שרוצה להבין מה מצבה הכללי של הבדיקה לפני שמחליטים אם להעמיק.", "לאחר הסריקה מוצגים ציון כללי, היקף הבדיקות שהוכרעו ומספר הממצאים לפי מצבם.", "הסיכום עוזר להבין האם נמצאו נושאים שדורשים תשומת לב, אך אינו חושף את פירוט הממצאים, הראיות או הוראות התיקון."] },
      { heading: "דוח אתר מפורט: לא רק מה נמצא, אלא גם מה עושים עכשיו", paragraphs: ["ציון כללי יכול לעזור להבין את תמונת המצב, אבל כדי לשפר אתר צריך לדעת מה עומד מאחורי המספר.", "הדוח המלא של Bizuply Compliance AI מרכז את הממצאים לפי תחומים, מציג את הראיות שנאספו ואת מיקום הבעיה כאשר ניתן לזהות אותו, ומציע פעולות תיקון מעשיות.", "במקום להסתפק בהודעה כללית שיש בעיה, אפשר להבין מה נמצא, מדוע הנושא חשוב ואיך ניתן לבדוק את התיקון."], subsections: [{ heading: "מה כולל הדוח המלא?", paragraphs: ["סיכום מנהלים ותמונת מצב. ממצאים לפי קטגוריה וחומרה. פירוט הבעיה והמשמעות שלה. כתובות עמודים ורכיבים כאשר זוהו. ראיות שנאספו. המלצות תיקון. מקורות מקצועיים כאשר הם קיימים ומתאימים. סדר עדיפויות. מגבלות הבדיקה. קובץ PDF להורדה."] }] },
      { heading: "איך הופכים ממצא טכני לפעולה ברורה?", paragraphs: ["נניח שבבדיקה לדוגמה נמצא שהשרת אינו מחזיר כותרת אבטחה מסוימת. במקום להציג רק את שם הכותרת, הדוח יכול להסביר מה תפקידה, היכן היא חסרה, מה מומלץ להגדיר ואיך לבדוק לאחר מכן שהשינוי נקלט."] },
      { heading: "למי כדאי לבצע סריקת אתר?", paragraphs: ["בין אם מדובר באתר תדמית קטן ובין אם באתר עסקי מורכב יותר, כדאי להבין אילו מאפיינים גלויים שלו ניתן לבדוק באופן אוטומטי."], subsections: [
        { heading: "בעלי עסקים ואתרי תדמית", paragraphs: ["כדי לקבל תמונת מצב על הגדרות האתר והמסמכים הזמינים למבקרים."] },
        { heading: "חנויות אונליין", paragraphs: ["כדי לבדוק מאפיינים טכניים ותכנים ציבוריים הקשורים לפרטיות, אבטחה ונגישות."] },
        { heading: "בוני אתרים וסוכנויות דיגיטל", paragraphs: ["כדי לקבל רשימת ממצאים מסודרת לפני מסירת אתר או כחלק מתחזוקה שוטפת."] },
        { heading: "חברות שמנהלות אתר פעיל", paragraphs: ["כדי לעקוב אחר שינויים בממצאים לאורך זמן ולזהות נושאים חדשים שדורשים טיפול."] },
      ] },
      { heading: "האתר משתנה. גם תוצאות הבדיקה יכולות להשתנות.", paragraphs: ["אתרים אינם נשארים קבועים. מעדכנים תוספים, מוסיפים טפסים, מחליפים רכיבי מעקב, משנים עיצוב ומפרסמים עמודים חדשים. שינוי קטן עשוי להשפיע על הגדרות אבטחה, התנהגות רכיבים או נגישות.", "לכן, לצד סריקה חד־פעמית, קיימת גם תוכנית שנתית הכוללת סריקה אחת בכל חודש. כל דוח מציג את מצב האתר במועד הבדיקה, והאזור האישי מאפשר לעקוב אחר התוצאות לאורך זמן. אין כאן ניטור רציף או בדיקות בזמן אמת."] },
      { heading: "מתחילים בחינם. בוחרים כמה עמוק לבדוק.", paragraphs: ["הסריקה הראשונית חינמית ומציגה תמונת מצב. הדוח המלא עולה 35 דולר פעם אחת. התוכנית השנתית עולה 300 דולר לשנה, שווה ערך ל־25 דולר לחודש בחיוב שנתי מראש, וכוללת סריקה אחת בכל חודש. החידוש אוטומטי מדי שנה, אלא אם מבטלים אותו. ביטול החידוש אינו מבטל את הסריקות שכבר שולמו. הרכישה אינה פתוחה כרגע ולא מתבצע חיוב."] },
      { heading: "כדאי לדעת מה קורה באתר שלכם — לפני שמגלים בעיה בדרך הקשה", paragraphs: ["לא חייבים להתחיל בפרויקט גדול כדי להבין מה כדאי לשפר. סריקה ראשונית יכולה לעזור לזהות נושאים שדורשים תשומת לב, והדוח המפורט הופך את הממצאים לרשימת פעולות ברורה.", "בלי התקנה. בלי גישה לניהול האתר. מתחילים בכתובת האתר."] },
    ],
    faqTitle: "שאלות שכדאי לשאול לפני שבודקים אתר",
    faq: heFaq,
    shots: ["שלב ראשון — מזינים כתובת אתר", "שלב שני — מקבלים תמונת מצב", "שלב שלישי — מבינים מה צריך לתקן"],
    shotAlt: ["טופס הסריקה עם השם ישראל ישראלי והכתובת example.com", "דוח ראשוני לדוגמה עם ציון 82 והיקף בדיקות 94 אחוז", "דוח מפורט לדוגמה עם ממצא, ראיה והמלצה"],
    freeCaption: "הדוח החינמי מציג תמונת מצב כללית. פירוט הממצאים וההמלצות זמין בדוח המלא.",
    freeCta: "קבלו דוח ראשוני בחינם",
    scanCta: "סרקו את האתר",
    closeCta: "התחילו סריקת אתר בחינם",
    exampleFlag: "דוגמה פיקטיבית להמחשת מבנה הדוח. אינה מתארת ממצא באתר אמיתי.",
    demoFlag: "נתונים להמחשה בלבד",
  },
  en: {
    updated,
    title: "AI website scan | Privacy, security and accessibility | Bizuply",
    description: "Scan your website free with Bizuply Compliance AI. An automatic check of privacy, cookies, security, accessibility and public documents, with a free summary and a detailed report.",
    crumb: "Website scan",
    h1: "An AI website scan that shows what to check and what to fix",
    lede: "A site can look polished and still hide issues that are easy to miss. Bizuply Compliance AI runs automatic checks of privacy and cookies, security settings, accessibility and public documents, then gathers the results in a clear report.",
    note: "Start with a free summary. The full report adds the findings, the evidence and practical recommendations.",
    aside: "An automatic check of information and components the scan can reach. Nothing to install.",
    primary: "Scan your site free",
    watch: "Watch a sample scan",
    videoTitle: "A sample website scan in Bizuply Compliance AI",
    transcript: "The demo types a name and example.com, moves through privacy, security, accessibility and documents, shows a free summary with a score of 82, then a sample full report with evidence, a recommendation and a source. The data is fictional. No live scan runs.",
    sections: [
      { heading: "The site works. Do you know what is happening behind it?", paragraphs: ["Design, speed and usability get most of the attention. Another layer still shapes how the site behaves: security headers, measurement components, privacy documents, accessibility and the information visitors can reach.", "Some issues are quiet. A site can use HTTPS and still omit a security header. A page can look readable to its owner and still fail a measurable contrast check or hide a control from the keyboard.", "Public documents matter too. Can a visitor open the privacy policy, see a clear cookie explanation, and reach the terms?", "A website scan gives one first picture instead of checking each topic by hand."] },
      { heading: "Four areas worth knowing on your site", paragraphs: [], subsections: [
        { heading: "Privacy and cookies", paragraphs: ["The scan looks for measurement components, a reachable privacy policy, and a cookie choice that can be observed automatically. It reports a finding only when the evidence supports it."] },
        { heading: "Site security", paragraphs: ["HTTPS is only part of the picture. The scan checks security properties that are visible from outside, including relevant response headers, and points to settings worth reviewing."] },
        { heading: "Accessibility", paragraphs: ["Automatic checks can find some problems in structure, components and contrast. They do not decide every accessibility requirement."] },
        { heading: "Documents and terms", paragraphs: ["The scan looks for public policies and terms it can open, reads the available text, and says what it found or could not identify. Missing wording is not, by itself, a legal breach."] },
      ] },
      { heading: "What a website scan looks like", paragraphs: ["You do not need to read server configuration to start. Enter a full name and a website address. The scan checks the information and components it can reach.", "The recording shows the scan stages, the free summary, and how that summary differs from the detailed report."] },
      { heading: "What the free scan includes", paragraphs: ["The first report is for someone who wants the overall picture before going deeper.", "It shows a score, how much of the check was decided, and how many items passed, need attention, are missing, or could not be decided.", "It does not reveal finding names, evidence, page addresses or fix instructions."] },
      { heading: "A detailed report: not only what was found, but what to do next", paragraphs: ["A score is a snapshot. Improving a site means seeing the evidence behind the number.", "The full Bizuply Compliance AI report groups findings, shows the evidence and the location when one was identified, and suggests practical fixes."], subsections: [{ heading: "What the full report includes", paragraphs: ["An overview, findings by category and severity, what the issue means, page addresses when identified, evidence, practical recommendations, a professional source when one fits, a priority order, the limits of the check, and a PDF."] }] },
      { heading: "How a technical finding becomes a clear action", paragraphs: ["Suppose a sample check finds that a response did not include a security header. The report can explain the header's role, where it was missing, what to configure, and how to confirm the change afterwards."] },
      { heading: "Who a website scan is for", paragraphs: ["A small brochure site and a larger business site can both use an automatic look at what is publicly visible."], subsections: [
        { heading: "Business owners", paragraphs: ["For a picture of the site settings and the documents visitors can open."] },
        { heading: "Online stores", paragraphs: ["For technical signals and public content related to privacy, security and accessibility."] },
        { heading: "Agencies and site builders", paragraphs: ["For an ordered list of findings before handing a site over, or as part of ongoing care."] },
        { heading: "Teams with a live site", paragraphs: ["For a monthly scan that shows what changed, not a promise of continuous monitoring."] },
      ] },
      { heading: "The site changes. The check can change with it.", paragraphs: ["Plugins, forms, measurement tools, design and new pages all move. A small change can affect headers, components or accessibility.", "Beside a one-time scan, the annual plan includes one scan each month. Each report describes the site at that time. This is a monthly scan, not real-time monitoring."] },
      { heading: "Start free. Choose how deep to go.", paragraphs: ["The first scan is free. A full report is $35 once. The annual plan is $300 a year, shown as $25 a month and billed yearly in advance, with one scan each month. It renews each year unless renewal is cancelled. Cancelling renewal keeps the scans already paid for. Purchase is not open and nothing is charged."] },
      { heading: "See what the site is doing before a problem finds you", paragraphs: ["A first scan can show what deserves attention. The detailed report turns those findings into a list of actions.", "Nothing to install. No admin access. Start with the website address."] },
    ],
    faqTitle: "Questions worth asking before you scan a site",
    faq: [
      ["What is an AI website scan?", "It is an automatic check of what a scan can reach on a public site, gathered into findings on security, privacy, accessibility and public documents. Bizuply Compliance AI adds explanations and recommendations in plain language."],
      ["Can I scan a site for free?", "Yes. The free result is a score, the share of checks that were decided, and the counts. The detailed report is separate."],
      ["Do you need admin access?", "No. The scan uses what it can reach from outside. There is no admin password and nothing to install."],
      ["Does the scan prove privacy-law compliance?", "It can see technical signals and public text. It cannot decide full compliance with every law. Legal duties depend on the country, the business, the data, and facts that are not always on the site."],
      ["Is an automatic accessibility check enough?", "No. It can find some issues and it states its limits. It does not cover every requirement or scenario."],
      ["Is this a penetration test?", "No. It is an outside scan of reachable properties, not an intrusion test and not a full security audit."],
      ["How long does a scan take?", "It depends on the site, the pages that respond, and the checks that can run. The screen shows the progress."],
      ["What is the difference between the free and full report?", "The free report is a summary. The full report adds findings, evidence, locations, explanations, recommendations and a PDF."],
      ["Can I scan again?", "Yes, within the plan and the relevant limits. The annual plan includes one scan each month of the paid term."],
      ["Is the annual plan billed every month?", "No. You pay $300 up front for the year. $25 a month is the monthly equivalent. It renews yearly unless you cancel renewal."],
      ["What happens if renewal is cancelled?", "The next yearly charge is stopped. Scans already paid for continue until the paid year ends."],
      ["Can I download the report?", "The detailed report includes a PDF when the purchase or the subscription entitles you to it."],
    ],
    shots: ["Step one — enter a website address", "Step two — see the summary", "Step three — see what to fix"],
    shotAlt: ["The scan form with the sample name and example.com", "A sample free summary with a score of 82 and 94 percent of checks decided", "A sample detailed report with a finding, evidence and a recommendation"],
    freeCaption: "The free report is an overview. Finding details and recommendations are in the full report.",
    freeCta: "Get a free first report",
    scanCta: "Scan the site",
    closeCta: "Start a free website scan",
    exampleFlag: "A fictional example of the report structure. It does not describe a real website.",
    demoFlag: "Illustration data only",
  },
};

function short(locale, title, description, h1, lede, sections, faq, rest) {
  return { updated, title, description, h1, lede, sections, faq, ...rest, crumb: rest.crumb };
}

WEBSITE_SCAN.es = short("es",
  "Escaneo de sitio con IA | Privacidad, seguridad y accesibilidad | Bizuply",
  "Escanee su sitio gratis con Bizuply Compliance AI. Revisión automática de privacidad, cookies, seguridad, accesibilidad y documentos públicos.",
  "Un escaneo con IA que muestra qué revisar y qué corregir en su sitio",
  "Un sitio puede verse bien y aun así ocultar problemas. Bizuply Compliance AI revisa de forma automática privacidad, cookies, seguridad, accesibilidad y documentos públicos.",
  WEBSITE_SCAN.en.sections.map((section) => ({ ...section, heading: section.heading })),
  WEBSITE_SCAN.en.faq,
  { crumb: "Escaneo", note: "Empiece con un resumen gratis. El informe completo añade hallazgos, pruebas y recomendaciones.", aside: "Revisión automática de lo que el escaneo puede alcanzar. Sin instalar nada.", primary: "Escanear gratis", watch: "Ver un escaneo de ejemplo", videoTitle: "Escaneo de ejemplo en Bizuply Compliance AI", transcript: WEBSITE_SCAN.en.transcript, faqTitle: "Preguntas antes de escanear un sitio", shots: ["Paso uno — indicar la dirección", "Paso dos — ver el resumen", "Paso tres — ver qué corregir"], shotAlt: WEBSITE_SCAN.en.shotAlt, freeCaption: "El informe gratis es una visión general. El detalle y las recomendaciones están en el informe completo.", freeCta: "Obtener el resumen gratis", scanCta: "Escanear el sitio", closeCta: "Empezar un escaneo gratis", exampleFlag: "Ejemplo ficticio de la estructura del informe. No describe un sitio real.", demoFlag: "Datos de ilustración" });

WEBSITE_SCAN["pt-BR"] = short("pt-BR",
  "Varredura de site com IA | Privacidade, segurança e acessibilidade | Bizuply",
  "Verifique seu site grátis com a Bizuply Compliance AI. Checagem automática de privacidade, cookies, segurança, acessibilidade e documentos públicos.",
  "Uma varredura com IA que mostra o que conferir e o que corrigir no site",
  "Um site pode parecer ótimo e ainda esconder problemas. A Bizuply Compliance AI verifica privacidade, cookies, segurança, acessibilidade e documentos públicos.",
  WEBSITE_SCAN.en.sections,
  WEBSITE_SCAN.en.faq,
  { crumb: "Varredura", note: "Comece com um resumo grátis. O relatório completo acrescenta achados, evidências e recomendações.", aside: "Verificação automática do que a varredura alcança. Sem instalar nada.", primary: "Verificar grátis", watch: "Ver uma varredura de exemplo", videoTitle: "Varredura de exemplo na Bizuply Compliance AI", transcript: WEBSITE_SCAN.en.transcript, faqTitle: "Perguntas antes de verificar um site", shots: ["Passo um — informar o endereço", "Passo dois — ver o resumo", "Passo três — ver o que corrigir"], shotAlt: WEBSITE_SCAN.en.shotAlt, freeCaption: "O relatório grátis é uma visão geral. O detalhe e as recomendações ficam no relatório completo.", freeCta: "Receber o resumo grátis", scanCta: "Verificar o site", closeCta: "Começar uma varredura grátis", exampleFlag: "Exemplo fictício da estrutura do relatório. Não descreve um site real.", demoFlag: "Dados de ilustração" });

WEBSITE_SCAN.ar = short("ar",
  "فحص الموقع بالذكاء الاصطناعي | الخصوصية والأمن والإتاحة | Bizuply",
  "افحصوا موقعكم مجانًا مع Bizuply Compliance AI. فحص تلقائي للخصوصية وملفات تعريف الارتباط والأمن والإتاحة والمستندات العلنية.",
  "فحص ذكي يبيّن ما يجدر مراجعته وإصلاحه في موقعكم",
  "قد يبدو الموقع متقنًا ويخفي مشكلات لا تُرى من النظرة الأولى. تفحص Bizuply Compliance AI الخصوصية وملفات تعريف الارتباط وإعدادات الأمن والإتاحة والمستندات العلنية.",
  WEBSITE_SCAN.en.sections,
  WEBSITE_SCAN.en.faq,
  { crumb: "فحص الموقع", note: "ابدأوا بملخص مجاني. التقرير الكامل يضيف النتائج والأدلة والتوصيات.", aside: "فحص تلقائي لما يمكن الوصول إليه. بلا تثبيت.", primary: "افحصوا الموقع مجانًا", watch: "شاهدوا فحصًا للعرض", videoTitle: "فحص تجريبي في Bizuply Compliance AI", transcript: "يعرض الفيديو إدخال اسم وعنوان example.com، ثم التقدم بين الخصوصية والأمن والإتاحة والمستندات، وملخصًا بدرجة 82، ثم تقريرًا مفصلًا للعرض. البيانات وهمية ولا تُنفَّذ عملية فحص حقيقية.", faqTitle: "أسئلة قبل فحص الموقع", shots: ["الخطوة الأولى — إدخال العنوان", "الخطوة الثانية — رؤية الملخص", "الخطوة الثالثة — فهم ما يُصلح"], shotAlt: ["نموذج الفحص مع example.com", "ملخص مجاني للعرض بدرجة 82", "تقرير مفصل للعرض مع دليل وتوصية"], freeCaption: "التقرير المجاني يعرض صورة عامة. تفاصيل النتائج والتوصيات في التقرير الكامل.", freeCta: "احصلوا على ملخص مجاني", scanCta: "افحصوا الموقع", closeCta: "ابدأوا فحصًا مجانيًا", exampleFlag: "مثال وهمي لبنية التقرير. لا يصف موقعًا حقيقيًا.", demoFlag: "بيانات للتوضيح فقط" });

for (const locale of ["es", "pt-BR", "ar"]) {
  WEBSITE_SCAN[locale].sections = SCAN_LOCALES[locale].sections;
  WEBSITE_SCAN[locale].faq = SCAN_LOCALES[locale].faq;
}
WEBSITE_SCAN.es.transcript = "La demostración escribe un nombre y example.com, avanza por privacidad, seguridad, accesibilidad y documentos, muestra un resumen con 82 puntos y luego un informe completo de ejemplo. Los datos son ficticios. No hay un escaneo real.";
WEBSITE_SCAN["pt-BR"].transcript = "A demonstração escreve um nome e example.com, passa por privacidade, segurança, acessibilidade e documentos, mostra um resumo com nota 82 e depois um relatório completo de exemplo. Os dados são fictícios. Nenhuma varredura real é executada.";
WEBSITE_SCAN.es.shotAlt = ["Formulario de escaneo con example.com", "Resumen gratis de ejemplo con puntuación 82", "Informe detallado de ejemplo con prueba y recomendación"];
WEBSITE_SCAN["pt-BR"].shotAlt = ["Formulário de varredura com example.com", "Resumo grátis de exemplo com nota 82", "Relatório detalhado de exemplo com evidência e recomendação"];
