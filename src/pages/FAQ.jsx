import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "מה זה Bizuply?",
    a: "Bizuply היא פלטפורמה אחת לניהול העסק — CRM ולידים, פגישות, בניית אתר וחנות, אוטומציות, שיתופי פעולה וכלי AI — הכל בסביבת עבודה מחוברת.",
  },
  {
    q: "איך מתחילים?",
    a: "לוחצים על ״הירשמו עכשיו״, יוצרים חשבון עסקי, ומתחילים לנהל לקוחות, פגישות ושיתופי פעולה מתוך דשבורד אחד.",
  },
  {
    q: "איך עובדת בניית אתר וחנות?",
    a: "בוחרים תבנית מוכנה, עורכים בעיורך הוויזואלי, מפרסמים — וכל פנייה מהטפסים באתר נכנסת ישר לצינור הלידים ב־CRM.",
  },
  {
    q: "מה עושות האוטומציות?",
    a: "אוטומציות מריצות תזכורות, פולואפים והתראות חכמות ברקע — כדי שפחות לידים ייפלו בין הכיסאות.",
  },
  {
    q: "מה אפשר לנהל ב־CRM?",
    a: "לידים ולקוחות, משימות ומעקבים, הערות והיסטוריה, שלבי צנרת, פגישות עם מחיר וסטטוס תשלום — הכל במקום אחד.",
  },
  {
    q: "איך Bizuply עוזרת להשיג יותר לקוחות?",
    a: "עמוד העסק והאתר לוכדים פניות, ה־CRM שומר על מעקב מהיר, והאוטומציות מוודאות שחוזרים ללידים בזמן — מה שמגדיל המרות.",
  },
  {
    q: "האם המידע שלי מאובטח?",
    a: "כן. Bizuply משתמשת בהצפנה ובפרקטיקות אבטחה מקובלות בתעשייה כדי לשמור על הנתונים שלכם.",
  },
  {
    q: "איפה מקבלים תמיכה?",
    a: "אפשר לפנות אלינו בכל עת דרך עמוד צור קשר — והצוות חוזר במהירות עם מענה ברור.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] text-slate-800"
      dir="rtl"
    >
      <Helmet>
        <title>שאלות נפוצות | Bizuply</title>
        <meta
          name="description"
          content="תשובות לשאלות נפוצות על Bizuply — הרשמה, CRM, בניית אתר, אוטומציות, אבטחה ותמיכה."
        />
        <link rel="canonical" href="https://bizuply.com/faq" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-36 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />

      <section className="relative mx-auto max-w-4xl px-5 pb-10 pt-20 text-center sm:px-8 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          מרכז העזרה של Bizuply
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
          שאלות נפוצות
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
          כל מה שחשוב לדעת לפני שמתחילים — הרשמה, CRM, אתר, אוטומציות ותמיכה.
        </p>
      </section>

      <section className="relative mx-auto max-w-3xl space-y-3 px-5 pb-16 sm:px-8">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <article
              key={item.q}
              className={`overflow-hidden rounded-[1.5rem] border text-center transition ${
                isOpen
                  ? "border-indigo-200 bg-white shadow-[0_18px_50px_rgba(79,70,229,0.12)]"
                  : "border-slate-100 bg-white/85 hover:border-indigo-100"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center gap-4 px-5 py-5 text-center sm:px-7"
                aria-expanded={isOpen}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black ${
                    isOpen
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-base font-black leading-7 text-slate-800 sm:text-lg">
                  {item.q}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl font-black ${
                    isOpen
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-50 text-indigo-700"
                  }`}
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-slate-100 px-5 pb-6 pt-4 sm:px-7">
                  <p className="mx-auto max-w-2xl text-base font-semibold leading-8 text-slate-600">
                    {item.a}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="relative mx-auto max-w-3xl px-5 pb-24 text-center sm:px-8">
        <div className="rounded-[2rem] border border-indigo-100 bg-white/85 px-6 py-10 shadow-[0_24px_70px_rgba(79,70,229,0.12)] backdrop-blur sm:px-10">
          <p className="text-sm font-black text-indigo-700">עדיין יש שאלה?</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
            בואו נדבר על העסק שלכם
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            נעבור יחד על מה שנכנס למערכת, מה רץ לבד, ומה כדאי להתחיל ממנו.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 sm:w-auto"
            >
              הירשמו עכשיו
            </Link>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-indigo-100 bg-white px-7 py-3.5 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 sm:w-auto"
            >
              צור קשר
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FAQ;
