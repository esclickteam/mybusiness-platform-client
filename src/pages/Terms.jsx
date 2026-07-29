import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SECTIONS = [
  {
    id: "general",
    title: "כללי",
    body: [
      "ברוכים הבאים ל־Bizuply. השימוש באתר, באפליקציה, בפלטפורמה ובשירותים שלנו כפוף לתנאים אלה.",
      "המשך שימוש בשירות מהווה הסכמה לתנאים. אם אינכם מסכימים — יש להפסיק את השימוש.",
    ],
  },
  {
    id: "services",
    title: "השירותים",
    body: [
      "Bizuply מספקת כלים לניהול עסק: עמוד עסקי, CRM ולידים, תורים, בניית אתר וחנות, אוטומציות, שיתופי פעולה וכלי AI.",
      "חלק מהיכולות תלויות במסלול המנוי ובחיבורים חיצוניים (למשל Meta או תשלומים).",
    ],
  },
  {
    id: "registration",
    title: "הרשמה ושימוש",
    body: [
      "עליכם למסור פרטים מדויקים ולשמור על סודיות פרטי הגישה.",
      "אסור להשתמש בפלטפורמה לפעילות בלתי חוקית, להטעיה, לפגיעה באחרים או לניסיון לפרוץ למערכות.",
    ],
  },
  {
    id: "payments",
    title: "תשלומים",
    body: [
      "מסלולי המנוי והמחירים מוצגים בעמוד המחירים ובעת הרכישה.",
      "חיובים מתבצעים לפי המסלול שנבחר. ביטול מנוי נעשה לפי התנאים המוצגים במועד הרכישה.",
    ],
  },
  {
    id: "content",
    title: "תוכן משתמשים",
    body: [
      "התוכן שאתם מעלים (טקסטים, תמונות, נתוני לקוחות וכו׳) נשאר באחריותכם.",
      "אתם מעניקים ל־Bizuply רישיון תפעולי להציג ולעבד את התוכן לצורך מתן השירות.",
    ],
  },
  {
    id: "ip",
    title: "קניין רוחני",
    body: [
      "המותג, העיצוב, הקוד והמערכת של Bizuply שייכים לנו או לבעלי הרישיון שלנו.",
      "אין להעתיק, לשכפל או להפיץ חלקים מהפלטפורמה בלי אישור בכתב.",
    ],
  },
  {
    id: "liability",
    title: "הגבלת אחריות",
    body: [
      "השירות ניתן כפי שהוא (As Is). אנו פועלים לשמירה על זמינות ואבטחה, אך איננו מתחייבים להיעדר תקלות מוחלט.",
      "במידה המותרת בחוק, האחריות מוגבלת לסכומים ששולמו עבור השירות בתקופה הרלוונטית.",
    ],
  },
  {
    id: "law",
    title: "דין חל וסמכות שיפוט",
    body: [
      "על תנאים אלה יחולו דיני מדינת ישראל, וסמכות השיפוט תהיה בבתי המשפט המוסמכים בישראל — אלא אם חוק מחייב אחרת.",
    ],
  },
  {
    id: "contact",
    title: "יצירת קשר",
    body: [
      "לשאלות בנוגע לתנאים: support@bizuply.com או דרך עמוד צור קשר.",
    ],
  },
];

function Terms() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] text-slate-800"
      dir="rtl"
    >
      <Helmet>
        <title>תנאי שימוש | Bizuply</title>
        <meta
          name="description"
          content="תנאי השימוש של Bizuply — שימוש בפלטפורמה, תשלומים, תוכן משתמשים, אחריות ויצירת קשר."
        />
        <link rel="canonical" href="https://bizuply.com/terms" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />

      <section className="relative mx-auto max-w-4xl px-5 pb-10 pt-20 text-center sm:px-8 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          מרכז משפטי
        </div>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-800 sm:text-5xl">
          תנאי שימוש
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
          אנא קראו בעיון לפני השימוש באתר, באפליקציה ובשירותי Bizuply.
        </p>
        <p className="mt-6 text-sm font-black text-slate-500">
          עודכן לאחרונה: 14 באוקטובר 2025
        </p>
      </section>

      <section className="relative mx-auto max-w-3xl space-y-5 px-5 pb-24 text-center sm:px-8">
        {SECTIONS.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:p-8"
          >
            <h2 className="text-2xl font-black text-slate-800">{section.title}</h2>
            {section.body.map((p) => (
              <p
                key={p}
                className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600"
              >
                {p}
              </p>
            ))}
          </article>
        ))}

        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
        >
          צור קשר
        </Link>
      </section>
    </main>
  );
}

export default Terms;
