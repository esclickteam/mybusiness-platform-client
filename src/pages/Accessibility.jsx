import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Accessibility() {
  const sectionBase =
    "rounded-[2rem] border border-white/80 bg-white/85 p-6 text-center shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8";

  const h2Base =
    "mb-4 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl";

  const pBase = "mx-auto max-w-3xl text-base font-medium leading-8 text-slate-600";

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] text-slate-800"
      dir="rtl"
    >
      <Helmet>
        <title>הצהרת נגישות | Bizuply</title>
        <meta
          name="description"
          content="הצהרת הנגישות של Bizuply — מחויבות לנגישות דיגיטלית, תקני WCAG ואפשרויות תמיכה."
        />
        <link rel="canonical" href="https://bizuply.com/accessibility" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />

      <section className="relative mx-auto max-w-4xl px-5 pb-10 pt-20 text-center sm:px-8 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          מרכז הנגישות
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
          הצהרת נגישות
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
          Bizuply מחויבת ליצור חוויית שימוש דיגיטלית כוללת, נגישה ונוחה לכולם.
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          עודכן לאחרונה: 29 בספטמבר 2025
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl space-y-6 px-5 pb-24 sm:px-8">
        <section className={sectionBase}>
          <h2 className={h2Base}>המחויבות שלנו</h2>
          <p className={pBase}>
            Bizuply פועלת להנגשת השירותים הדיגיטליים לאנשים עם מוגבלויות. אנו
            משפרים כל הזמן את חוויית השימוש ומיישמים תקני נגישות מקובלים.
          </p>
          <p className={`${pBase} mt-4`}>
            אנו שואפים לעמוד בהנחיות WCAG 2.1 ברמת AA — כדי לספק חוויה ברורה
            ונגישה לכל המבקרים.
          </p>
        </section>

        <section className={sectionBase}>
          <h2 className={h2Base}>תכונות נגישות</h2>
          <ul className="mx-auto mt-5 max-w-xl space-y-3 text-base font-medium leading-8 text-slate-600">
            {[
              "תמיכה בניווט באמצעות מקלדת",
              "טקסט קריא עם ניגודיות וגדלים ברורים",
              "טקסט חלופי לתמונות ואייקונים",
              "מבנה עקבי ותוויות ברורות לטפסים ולכפתורים",
            ].map((item) => (
              <li key={item} className="flex items-center justify-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={sectionBase}>
          <h2 className={h2Base}>מגבלות ידועות</h2>
          <p className={pBase}>
            למרות המאמץ להנגיש את כל התכנים, ייתכן שאינטגרציות צד שלישי או מדיה
            מסוימת עדיין לא עומדות במלוא הדרישות. אנו ממשיכים לשפר ולתקן.
          </p>
        </section>

        <section className={sectionBase}>
          <h2 className={h2Base}>משוב ויצירת קשר</h2>
          <p className={pBase}>
            נתקלתם בחסם נגישות או צריכים עזרה? פנו אלינו — המשוב שלכם עוזר לנו
            לשפר את הפלטפורמה.
          </p>
          <p className="mt-4 text-lg font-black text-slate-800" dir="ltr">
            support@bizuply.com
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
          >
            מעבר לטופס צור קשר
          </Link>
        </section>
      </section>
    </main>
  );
}
