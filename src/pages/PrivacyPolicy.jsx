import React from "react";
import { Helmet } from "react-helmet-async";

function PrivacyPolicy() {
  const sectionBase =
    "scroll-mt-28 rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8";

  const h2Base =
    "mb-5 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl";

  const h3Base =
    "mb-3 mt-7 text-xl font-black tracking-[-0.02em] text-slate-900";

  const pBase = "mb-4 text-base font-medium leading-8 text-slate-600";

  const ulBase =
    "mb-5 ml-5 list-disc space-y-2 text-base font-medium leading-8 text-slate-600";

  const sections = [
    "מבוא",
    "היקף ותחולה",
    "הגדרות",
    "נתונים שאנו אוספים",
    "כיצד אנו משתמשים בנתונים שלכם",
    "שיתוף נתונים",
    "קובצי Cookie",
    "שמירת נתונים",
    "זכויות משתמשים",
    "החזרים ותשלומים",
    "הגבלת אחריות",
    "מיקום נתונים",
    "עדכוני מדיניות",
    "ציות משפטי",
    "כתב ויתור משפטי",
    "הדין החל",
    "יצירת קשר וממונה הגנת מידע",
    "סעיף סופי",
  ];

  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-slate-800">
      <Helmet>
        <title>מדיניות הפרטיות - BizUply</title>
        <meta
          name="description"
          content="קראו את מדיניות הפרטיות של BizUply, לרבות כיצד אנו אוספים, משתמשים, מאחסנים, מגינים ומשתפים נתוני משתמשים ועסקים."
        />
        <link rel="canonical" href="https://bizuply.com/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12%] top-[16%] h-[560px] w-[560px] rounded-full bg-emerald-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[24%] h-[560px] w-[560px] rounded-full bg-white/85 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          מרכז פרטיות
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
          מדיניות הפרטיות
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          מדיניות פרטיות זו מסבירה כיצד BizUply אוספת, מאחסנת, משתמשת ומגינה על
          מידע אישי ועסקי ברחבי הפלטפורמה.
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          עודכן לאחרונה: 14 באוקטובר 2025
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10">
        {/* Sidebar */}
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 text-2xl shadow-lg shadow-slate-900/20">
            🔐
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
            סקירת המדיניות
          </h2>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            ניווט מהיר בין סעיפי פרטיות, נתונים, אבטחה, זכויות משתמשים וסעיפים
            משפטיים.
          </p>

          <nav className="mt-6 max-h-[55vh] space-y-2 overflow-auto pr-1">
            {sections.map((section, index) => (
              <a
                key={section}
                href={`#section-${index + 1}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-800">
                  {index + 1}
                </span>
                {section}
              </a>
            ))}
          </nav>

          <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
            <p className="text-sm font-black text-amber-300">יצירת קשר בנושא פרטיות</p>
            <p className="mt-2 break-all text-sm font-bold text-black/80">
              privacy@bizuply.com
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <section id="section-1" className={sectionBase}>
            <h2 className={h2Base}>1. מבוא</h2>

            <p className={pBase}>
              מדיניות פרטיות זו מסבירה כיצד <strong>BizUply</strong>{" "}
              המופעלת בבעלות פרטית, לפי דיני ארצות הברית, אוספת, מאחסנת,
              משתמשת ומגינה על מידע אישי של משתמשיה ושל לקוחות עסקיים
              “משתמשים”, “עסקים” או “אתם”. בשימוש בפלטפורמת BizUply, אתם
              מסכימים לתנאים המתוארים במסמך זה.
            </p>

            <p className={pBase}>
              BizUply היא פלטפורמת SaaS מבוססת ענן שמשרדיה הראשיים בניו יורק,
              ארה"ב, המיועדת לספק כלים לניהול עסקי, לתקשורת עם לקוחות
              ולאוטומציה מבוססת בינה מלאכותית לעסקים קטנים ובינוניים “SMBs”.
            </p>

            <p className={pBase}>
              מדיניות פרטיות זו חלה על כל המוצרים, השירותים, האתרים
              והאפליקציות שלנו “הפלטפורמה”, ומתארת בפירוט כיצד אנו מעבדים
              נתונים, איזה מידע אנו אוספים ואילו זכויות עומדות לכם ביחס למידע
              שלכם.
            </p>

            <p className={pBase}>
              בגישה לפלטפורמה שלנו או בשימוש בה, אתם מאשרים שקראתם והבנתם את
              מדיניות פרטיות זו. אם אינכם מסכימים, אנא אל תשתמשו ב-BizUply או
              בכל אחד משירותיה.
            </p>
          </section>

          <section id="section-2" className={sectionBase}>
            <h2 className={h2Base}>2. היקף ותחולה</h2>

            <p className={pBase}>
              מדיניות פרטיות זו חלה על כל המשתמשים, לרבות עסקים, עובדים,
              מנהלים, חברות קשורות ומבקרי אתר המקיימים אינטראקציה עם BizUply
              בכל צורה, בין אם באמצעות שולחן עבודה, אפליקציות מובייל, אינטגרציות
              API או תוספים של צד שלישי.
            </p>

            <p className={pBase}>
              היא מסדירה את עיבוד המידע האישי והלא-אישי על ידי BizUply ומסבירה
              את נוהלי הטיפול שלנו בנתונים בהתאם לדין הפדרלי של ארצות הברית,
              לתקנות הפרטיות של מדינת ניו יורק ולתקנים בינלאומיים כגון GDPR
              ו-CCPA לצורכי התייחסות בלבד.
            </p>

            <p className={pBase}>
              מדיניות זו אינה חלה על שירותים, קישורים או אינטגרציות של צד
              שלישי שאינם בבעלות BizUply או אינם מופעלים על ידה. אנו ממליצים
              לכם לעיין במדיניות הפרטיות שלהם לפני התקשרות עמם.
            </p>
          </section>

          <section id="section-3" className={sectionBase}>
            <h2 className={h2Base}>3. הגדרות</h2>

            <p className={pBase}>
              <strong>“BizUply”</strong> – מתייחס לחברת SaaS בבעלות פרטית
              הרשומה ומופעלת לפי דיני ארצות הברית, שמושבה בניו יורק, ארה"ב.
            </p>

            <p className={pBase}>
              <strong>“הפלטפורמה”</strong> – כוללת את כל מוצרי BizUply,
              האתרים, המערכות, השרתים, האפליקציות, ה-APIs, מודולי הבינה
              המלאכותית, לוחות המחוונים של CRM, כלי האוטומציה ותשתית התוכנה
              הקשורה.
            </p>

            <p className={pBase}>
              <strong>“משתמש”</strong> – כל אדם טבעי או משפטי המשתמש בשירותי
              BizUply, לרבות בעלי עסקים, עובדים, לקוחות או מבקרי האתר.
            </p>

            <p className={pBase}>
              <strong>“מידע אישי”</strong> – נתונים המזהים אדם או יכולים לזהות
              אדם באופן סביר, לרבות אך לא רק שם, דוא"ל, מספר טלפון, כתובת, פרטי
              תשלום, נתוני פרופיל עסקי ומזהים דיגיטליים כגון כתובות IP או קובצי
              Cookie.
            </p>

            <p className={pBase}>
              <strong>“צדדים שלישיים”</strong> – ישויות חיצוניות המועסקות על
              ידי BizUply למטרות אירוח, עיבוד תשלומים, אנליטיקה או תקשורת,
              בכפוף להסכמי סודיות והגנת מידע מחייבים.
            </p>
          </section>

          <section id="section-4" className={sectionBase}>
            <h2 className={h2Base}>4. נתונים שאנו אוספים</h2>

            <p className={pBase}>
              BizUply אוספת הן נתונים אישיים והן נתונים לא-אישיים הנדרשים
              לאספקת שירותיה, לשיפורם ולאבטחתם. איסוף נתונים עשוי להתרחש ישירות
              מכם, באופן אוטומטי דרך המכשיר שלכם או מאינטגרציות עסקיות
              מאומתות.
            </p>

            <h3 className={h3Base}>4.1. נתונים אישיים שאתם מספקים</h3>
            <ul className={ulBase}>
              <li>שם מלא, דוא"ל ומספר טלפון</li>
              <li>שם העסק, מספר רישום וכתובת</li>
              <li>מידע תשלום וחיוב</li>
              <li>פרטי התחברות מוצפנים</li>
              <li>תקשורת, ביקורות ומשוב שנשלחו באמצעות הפלטפורמה</li>
            </ul>

            <h3 className={h3Base}>4.2. נתונים הנאספים באופן אוטומטי</h3>
            <ul className={ulBase}>
              <li>כתובת IP ומיקום גיאוגרפי משוער</li>
              <li>סוג מכשיר, גרסת דפדפן ומערכת הפעלה</li>
              <li>פעילות הפעלה, היסטוריית אינטראקציות וחותמות זמן</li>
              <li>קובצי Cookie ופיקסלי מעקב לאנליטיקה וביצועים</li>
            </ul>

            <h3 className={h3Base}>4.3. נתונים עסקיים ואנליטיים</h3>
            <ul className={ulBase}>
              <li>רשומות לקוחות ופגישות</li>
              <li>הודעות עסקיות ויומני צ'אט</li>
              <li>ניתוח בינה מלאכותית של מדדי ביצועים והמלצות</li>
              <li>תובנות מצטברות שנוצרו מנתוני שימוש אנונימיים</li>
            </ul>
          </section>

          <section id="section-5" className={sectionBase}>
            <h2 className={h2Base}>5. כיצד אנו משתמשים בנתונים שלכם</h2>

            <p className={pBase}>
              BizUply משתמשת במידע שנאסף אך ורק למטרות עסקיות לגיטימיות
              הקשורות להפעלת הפלטפורמה שלה ולשיפורה. איננו מוכרים או משכירים
              נתונים אישיים בשום נסיבה.
            </p>

            <ul className={ulBase}>
              <li>כדי לספק ולתחזק את השירותים שלנו ואת חשבונות הלקוחות</li>
              <li>כדי לעבד תשלומים, חשבוניות ומחזורי חיוב</li>
              <li>כדי לשפר את ביצועי המוצר, UX ודיוק הבינה המלאכותית</li>
              <li>כדי לשלוח עדכוני שירות, התראות או הצעות שיווקיות</li>
              <li>כדי להבטיח עמידה בדרישות משפטיות ורגולטוריות</li>
              <li>כדי למנוע הונאה, שימוש לרעה או גישה בלתי מורשית</li>
              <li>כדי לתמוך בשירות לקוחות ובפתרון תקלות טכניות</li>
              <li>כדי לנתח התנהגות משתמשים למטרות סטטיסטיות ואבטחה</li>
            </ul>

            <p className={pBase}>
              כל העיבוד מתבצע לפי פרוטוקולי ניהול נתונים מאובטחים ועומד בתקני
              הפרטיות של ניו יורק ובנהגים בינלאומיים מיטביים.
            </p>
          </section>

          <section id="section-6" className={sectionBase}>
            <h2 className={h2Base}>6. שיתוף נתונים וצדדים שלישיים</h2>

            <p className={pBase}>
              BizUply אינה מוכרת או סוחרת בנתונים אישיים. עם זאת, אנו עשויים
              לשתף מידע מוגבל עם צדדים שלישיים מאומתים רק כאשר הדבר נחוץ להפעלת
              הפלטפורמה, לקיום חובותינו המשפטיות או לאספקת שירותי ליבה לפי תקני
              סודיות ואבטחה מחמירים.
            </p>

            <h3 className={h3Base}>6.1. ספקי שירות מורשים</h3>

            <p className={pBase}>
              אנו עשויים לשתף נתונים עם ספקי שירות צד שלישי שנבחרו בקפידה
              המסייעים לנו ב:
            </p>

            <ul className={ulBase}>
              <li>אירוח ותשתית שרתים, למשל AWS, Google Cloud</li>
              <li>עיבוד תשלומים וחיוב, למשל Stripe, PayPal</li>
              <li>
                תקשורת עם לקוחות והתראות, למשל Twilio, SendGrid
              </li>
              <li>
                אנליטיקה, אבטחה וניטור ביצועים, למשל Cloudflare
              </li>
              <li>מודולי בינה מלאכותית ואוטומציה לאנליטיקה או תחזיות</li>
            </ul>

            <p className={pBase}>
              כל הספקים מחויבים בהסכמי סודיות ורשאים להשתמש במידע רק לצורך
              אספקת שירותים מוסכמים ל-BizUply, בהתאם למדיניות זו ולדין החל.
            </p>

            <h3 className={h3Base}>6.2. דרישות משפטיות</h3>

            <p className={pBase}>
              אנו עשויים לגלות מידע לרשויות אכיפת חוק, סוכנויות ממשלתיות או
              יועצים משפטיים אם הדבר נדרש לצורך עמידה בדינים החלים, בצווי בית
              משפט או כדי להגן על זכויותינו, אבטחתנו או רכושנו, לרבות מניעת
              הונאה ויישוב מחלוקות.
            </p>

            <h3 className={h3Base}>6.3. העברות עסקיות</h3>

            <p className={pBase}>
              במקרה של מיזוג, רכישה, ארגון מחדש או מכירת נכסים, נתונים אישיים
              עשויים להיות מועברים לישות הרוכשת, ובלבד שאותן חובות הגנת מידע
              ימשיכו לחול.
            </p>
          </section>

          <section id="section-7" className={sectionBase}>
            <h2 className={h2Base}>7. קובצי Cookie וטכנולוגיות מעקב</h2>

            <p className={pBase}>
              BizUply משתמשת בקובצי Cookie, פיקסלים וטכנולוגיות מעקב כדי לשפר
              את חוויית המשתמש, לשפר את פונקציונליות המערכת ולנתח נתוני שימוש.
              כלים אלה עוזרים לנו להבין ביצועים, למדוד תנועה ולהבטיח את אבטחת
              הפלטפורמה.
            </p>

            <h3 className={h3Base}>7.1. סוגי קובצי Cookie שבהם נעשה שימוש</h3>

            <ul className={ulBase}>
              <li>קובצי Cookie חיוניים – נדרשים להפעלת המערכת ולהתחברות</li>
              <li>קובצי Cookie פונקציונליים – שומרים העדפות והגדרות משתמש</li>
              <li>קובצי Cookie אנליטיים – מסייעים לנטר דפוסי שימוש וביצועים</li>
              <li>קובצי Cookie לאבטחה – מגינים על חשבונות ומונעים גישה בלתי מורשית</li>
              <li>
                קובצי Cookie שיווקיים – משמשים רק בהסכמה, לניתוח קמפיינים
                פנימי
              </li>
            </ul>

            <h3 className={h3Base}>7.2. ניהול קובצי Cookie</h3>

            <p className={pBase}>
              משתמשים רשאים להשבית קובצי Cookie דרך הגדרות הדפדפן שלהם. עם
              זאת, השבתת קובצי Cookie חיוניים עשויה להשפיע על פונקציונליות או
              על גישה לתכונות מערכת מסוימות.
            </p>

            <p className={pBase}>
              BizUply אינה מגיבה לאותות דפדפן “Do Not Track”. למידע נוסף, צרו
              איתנו קשר בכתובת <strong>support@bizuply.com</strong>.
            </p>
          </section>

          <section id="section-8" className={sectionBase}>
            <h2 className={h2Base}>8. שמירת נתונים ואבטחה</h2>

            <p className={pBase}>
              BizUply שומרת נתונים אישיים ועסקיים רק כל עוד הדבר נחוץ לאספקת
              שירותיה, לקיום חובות משפטיות ולמניעת שימוש לרעה או הונאה. כאשר
              נתונים אינם נדרשים עוד, הם נמחקים באופן מאובטח או עוברים
              אנונימיזציה.
            </p>

            <p className={pBase}>
              אנו משתמשים באמצעי אבטחה מקובלים בתעשייה, לרבות הצפנה, חומות אש,
              זיהוי חדירות, אימות דו-שלבי וגישה מוגבלת כדי להגן על כל הנתונים
              המאוחסנים. עם זאת, אין מערכת מקוונת חסינה לחלוטין מפני פרצות.
              בשימוש ב-BizUply, אתם מאשרים ומקבלים את הסיכונים המובנים בהעברת
              נתונים דרך האינטרנט.
            </p>

            <p className={pBase}>
              במקרה של פרצת מידע, BizUply תודיע למשתמשים המושפעים כפי שנדרש
              לפי דין.
            </p>
          </section>

          <section id="section-9" className={sectionBase}>
            <h2 className={h2Base}>9. זכויות משתמשים</h2>

            <p className={pBase}>
              לפי תקנות פרטיות חלות, לרבות הדין הפדרלי של ארצות הברית ודין ניו
              יורק, למשתמשים עומדות הזכויות הבאות:
            </p>

            <ul className={ulBase}>
              <li>הזכות לגשת לנתונים אישיים המאוחסנים על ידי BizUply</li>
              <li>הזכות לתקן או לעדכן מידע לא מדויק</li>
              <li>הזכות לבקש מחיקה “הזכות להישכח”</li>
              <li>הזכות לקבל עותק של נתונים אישיים “ניידות נתונים”</li>
              <li>הזכות להתנגד לעיבוד או לשימוש שיווקי</li>
            </ul>

            <p className={pBase}>
              יש להגיש בקשות בכתב לכתובת <strong>privacy@bizuply.com</strong>.
              BizUply תאמת את זהות המבקש ותשיב בתוך 30 ימי עסקים, בהתאם לדיני
              ארצות הברית.
            </p>
          </section>

          <section id="section-10" className={sectionBase}>
            <h2 className={h2Base}>10. החזרים, תשלומים וויתור משפטי</h2>

            <p className={pBase}>
              כל התשלומים, המנויים ודמי השירות ששולמו ל-BizUply הם סופיים
              ואינם ניתנים להחזר בשום נסיבה, לרבות אך לא רק סגירת חשבון, אי
              שביעות רצון משתמש, בעיות טכניות, זמן השבתה או השעיית עסק.
            </p>

            <p className={pBase}>
              בשימוש ב-BizUply, המשתמש מסכים ומאשר במפורש כי:
            </p>

            <ul className={ulBase}>
              <li>לא יינתנו החזר, זיכוי או פיצוי מכל סיבה שהיא.</li>
              <li>
                המשתמש מוותר על כל זכות לתבוע נזקים, ליזום הליכים משפטיים או
                לדרוש סעד כספי נגד BizUply, בעליה, עובדיה, שותפיה או חברותיה
                הקשורות.
              </li>
              <li>
                BizUply לא תישא באחריות להפסדים עקיפים, תוצאתיים או מקריים,
                לרבות אובדן רווחים, אובדן נתונים או פגיעה במוניטין.
              </li>
            </ul>

            <p className={pBase}>
              המשתמש מאשר הבנה מלאה כי השימוש בפלטפורמת BizUply נעשה כולו לפי
              שיקול דעתו ועל אחריותו.
            </p>

            <p className={pBase}>
              שום תקשורת בעל פה או בכתב לא תגבר על סעיף זה. סעיף זה הוא סופי
              ומחייב לפי דיני מדינת ניו יורק.
            </p>
          </section>

          <section id="section-11" className={sectionBase}>
            <h2 className={h2Base}>11. הגבלת אחריות</h2>

            <p className={pBase}>
              BizUply מספקת את שירותיה “כמות שהם” ו-“כפי שהם זמינים”. איננו
              נותנים אחריות לגבי פעולה רציפה, דיוק, שלמות או התאמה לכל מטרה.
            </p>

            <p className={pBase}>
              במידה המרבית המותרת לפי דין, BizUply וחברותיה הקשורות מתנערות מכל
              אחריות לכל נזק ישיר, עקיף, מקרי, תוצאתי או עונשי הנובע מהשימוש
              בפלטפורמה או מאי-היכולת להשתמש בה.
            </p>

            <p className={pBase}>
              בכל מקרה, אחריותה הכוללת של BizUply לא תעלה על הסכום ששולם על ידי
              המשתמש בשלושים 30 הימים שקדמו לאירוע שהוליד את התביעה.
            </p>
          </section>

          <section id="section-12" className={sectionBase}>
            <h2 className={h2Base}>
              12. מיקום נתונים והעברות בינלאומיות
            </h2>

            <p className={pBase}>
              כל הנתונים האישיים והעסקיים שנאספים על ידי BizUply מעובדים
              ומאוחסנים אך ורק בארצות הברית של אמריקה, בעיקר בשרתים מאובטחים
              הממוקמים בניו יורק ובתחומי שיפוט אחרים בארצות הברית העומדים
              בתקני הגנת מידע פדרליים.
            </p>

            <p className={pBase}>
              BizUply אינה מעבירה או מאחסנת במכוון נתוני משתמשים מחוץ לארצות
              הברית. במקרה נדיר של עיבוד נתונים באמצעות שירותי צד שלישי הממוקמים
              בחו"ל, העברה כאמור תבוצע רק כאשר הדבר נחוץ להפעלת הפלטפורמה, ותמיד
              לפי סעיפים חוזיים המבטיחים אבטחה, סודיות וטיפול חוקי שווי ערך.
            </p>

            <p className={pBase}>
              בשימוש ב-BizUply, אתם מסכימים לעיבוד הנתונים האישיים שלכם בתוך
              ארצות הברית ומאשרים כי המידע שלכם יהיה כפוף אך ורק לדיני ארצות
              הברית ומדינת ניו יורק.
            </p>
          </section>

          <section id="section-13" className={sectionBase}>
            <h2 className={h2Base}>13. עדכוני מדיניות והודעות</h2>

            <p className={pBase}>
              BizUply שומרת לעצמה את הזכות לשנות, לעדכן או לתקן מדיניות פרטיות
              זו בכל עת, לפי שיקול דעתה הבלעדי. הגרסה האחרונה תפורסם באתר
              הרשמי שלנו בכתובת <strong>www.bizuply.com/privacy</strong>.
            </p>

            <p className={pBase}>
              שינויים מהותיים יימסרו בדוא"ל או באמצעות הודעות בתוך הפלטפורמה
              כאשר הדבר רלוונטי. המשך השימוש בפלטפורמה לאחר עדכונים כאמור מהווה
              הסכמה מלאה למדיניות המתוקנת.
            </p>

            <p className={pBase}>
              המשתמשים אחראים לעיין במדיניות זו מעת לעת כדי להישאר מעודכנים
              לגבי כל שינוי.
            </p>
          </section>

          <section id="section-14" className={sectionBase}>
            <h2 className={h2Base}>14. ציות משפטי ושיתוף פעולה</h2>

            <p className={pBase}>
              BizUply פועלת לפי דיני ארצות הברית ומדינת ניו יורק. החברה תשתף
              פעולה עם רשויות משפטיות, רגולטורים וגופי ציות כפי שנדרש לפי הדין
              החל.
            </p>

            <p className={pBase}>
              אנו עשויים לשמור או לגלות רשומות מסוימות אם הדבר נדרש לפי זימון,
              צו שיפוטי או בקשה ממשלתית, ובלבד שגילוי כאמור עומד בדיני ארצות
              הברית ובדרישות הליך הוגן.
            </p>

            <p className={pBase}>
              BizUply מחויבת למניעת פעילות בלתי חוקית, הונאה, הלבנת הון או
              שימוש לרעה במערכותיה. כל חשד להפרה ידווח לרשויות הרלוונטיות.
            </p>
          </section>

          <section id="section-15" className={sectionBase}>
            <h2 className={h2Base}>15. כתב ויתור משפטי והיעדר אחריות</h2>

            <p className={pBase}>
              המשתמש מאשר במפורש כי השימוש בפלטפורמת BizUply, בשירותים ובחומרים
              הקשורים נעשה כולו על אחריותו. כל התוכן והנתונים מסופקים “כמות
              שהם” ללא אחריות, מפורשת או משתמעת, לרבות אך לא רק התאמה למטרה
              מסוימת, סחירות, דיוק או מהימנות.
            </p>

            <p className={pBase}>
              BizUply, בעליה, חברותיה הקשורות, עובדיה, קבלניה ושותפיה לא יישאו
              באחריות לכל נזק ישיר, עקיף, מיוחד, תוצאתי, עונשי או מקרי הנובע
              מהשימוש בפלטפורמה או מאי-היכולת להשתמש בה.
            </p>

            <p className={pBase}>
              הדבר כולל, ללא הגבלה, אובדן רווחים, נתונים, מוניטין, שיבוש עסקי
              או תביעות של צדדים שלישיים.
            </p>

            <p className={pBase}>
              המשתמש משחרר בזאת ומוותר על כל זכות ליזום הליך משפטי, בוררות או
              תובענה ייצוגית נגד BizUply מכל עילה הקשורה לשימוש בשירות, לעמלות
              או לטיפול בנתונים.
            </p>

            <p className={pBase}>
              ויתור זה חל ברחבי העולם ולצמיתות, והוא מחייב את המשתמש, חברותיו
              הקשורות, ממשיכיו ונציגיו.
            </p>
          </section>

          <section id="section-16" className={sectionBase}>
            <h2 className={h2Base}>16. הדין החל וסמכות שיפוט</h2>

            <p className={pBase}>
              מדיניות פרטיות זו, יחד עם כל מחלוקת הנובעת מכוחה, תהיה כפופה
              באופן בלעדי לדיני מדינת ניו יורק, ארצות הברית, ללא התחשבות
              בעקרונות ברירת דין.
            </p>

            <p className={pBase}>
              כל מחלוקת, תביעה או הליך יובאו באופן בלעדי בפני בתי המשפט
              המוסמכים של העיר ניו יורק, ניו יורק, ארה"ב.
            </p>

            <p className={pBase}>
              משתמשים מסכימים להיכפף לסמכות השיפוט האישית של בתי משפט אלה
              ומוותרים על כל התנגדות למקום השיפוט או לפורום.
            </p>
          </section>

          <section id="section-17" className={sectionBase}>
            <h2 className={h2Base}>
              17. פרטי התקשרות וממונה הגנת מידע
            </h2>

            <p className={pBase}>
              אם יש לכם שאלות, חששות או בקשות בנוגע למדיניות פרטיות זו או
              לנתונים האישיים שלכם, אנא צרו קשר עם:
            </p>

            <div className="mb-5 rounded-3xl border border-slate-100 bg-white/80 p-5 text-base font-medium leading-8 text-slate-600">
              <p>
                <strong>BizUply – משרד הגנת המידע</strong>
              </p>
              <p>
                דוא"ל: <strong>privacy@bizuply.com</strong>
              </p>
              <p>
                תמיכה כללית: <strong>support@bizuply.com</strong>
              </p>
              <p>מטה: New York, NY, United States</p>
            </div>

            <p className={pBase}>
              ממונה הגנת המידע (DPO) שמונה על ידי BizUply אחראי לניטור הציות,
              למענה לפניות משתמשים ולהבטחה שכל נוהלי הטיפול הפנימיים בנתונים
              עומדים בתקני התעשייה והדין.
            </p>
          </section>

          <section id="section-18" className={sectionBase}>
            <h2 className={h2Base}>18. סעיף סופי</h2>

            <p className={pBase}>
              בגישה לפלטפורמת BizUply או בשימוש בה, אתם מאשרים שקראתם, הבנתם
              והסכמתם לכל התנאים המפורטים במדיניות פרטיות זו. אתם מאשרים עוד כי
              מדיניות זו מהווה את ההצהרה המלאה והבלעדית של ההבנה ביניכם לבין
              BizUply בנוגע לפרטיות, ומחליפה כל הסכם או מצג קודם.
            </p>

            <p className={pBase}>
              אם חלק כלשהו ממדיניות זו ייחשב בלתי אכיף, יתר הסעיפים ימשיכו
              לעמוד בתוקף מלא במידה המרבית המותרת לפי דין.
            </p>

            <p className={pBase}>
              השימוש ב-BizUply מסמן הסכמה מפורשת ובלתי חוזרת לכל הסעיפים
              הכלולים במסמך זה.
            </p>

            <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                עודכן לאחרונה
              </p>
              <p className="mt-2 text-xl font-black">14 באוקטובר 2025</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
