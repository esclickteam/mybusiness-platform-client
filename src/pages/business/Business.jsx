import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function BusinessJoin() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] text-slate-800"
      dir="rtl"
    >
      <Helmet>
        <title>הצטרפות כעסק | Bizuply — לקוחות, שיתופי פעולה וניהול חכם</title>
        <meta
          name="description"
          content="הצטרפו ל־Bizuply וקבלו פניות מלקוחות, שיתופי פעולה עם עסקים, CRM ויומן תורים — הכל במקום אחד."
        />
        <link rel="canonical" href="https://bizuply.com/business" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[360px] w-[360px] rounded-full bg-cyan-200/35 blur-3xl" />

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-20 text-center sm:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-24 lg:pt-24 lg:text-center">
        <div>
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            פלטפורמת צמיחה לעסקים מודרניים
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
            הצמיחו את העסק עם לקוחות, שיתופי פעולה וניהול חכם
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Bizuply עוזרת לעסקים להתגלות, לקבל פניות, לשתף פעולה עם עסקים אחרים,
            לנהל תורים ולארגן את העבודה היומית — מדשבורד אחד יפה ומחובר.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 sm:w-auto"
            >
              הירשמו עכשיו
              <span className="me-2">←</span>
            </Link>

            <Link
              to="/pricing"
              className="inline-flex w-full items-center justify-center rounded-2xl border-2 border-indigo-300 bg-white px-8 py-4 text-base font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 sm:w-auto"
            >
              צפו במחירים
            </Link>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["CRM", "לקוחות ולידים"],
              ["AI", "עוזר חכם"],
              ["צמיחה", "שיתופי פעולה"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/80 bg-white/75 p-4 text-center shadow-sm backdrop-blur"
              >
                <p className="text-xl font-black text-slate-800">{title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-indigo-200/50 via-white to-cyan-100/70 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-5 text-center shadow-2xl shadow-indigo-100/80">
            <div className="rounded-[1.5rem] bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 p-5 text-slate-800">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="text-start">
                  <p className="text-sm font-bold text-indigo-700">
                    דשבורד Bizuply
                  </p>
                  <h3 className="mt-1 text-2xl font-black">הצמיחה של היום</h3>
                </div>
                <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
                  חי
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 text-center">
                  <p className="text-sm font-bold text-slate-500">פניות חדשות</p>
                  <p className="mt-2 text-4xl font-black">24</p>
                  <p className="mt-1 text-sm font-bold text-emerald-600">
                    +18% השבוע
                  </p>
                </div>
                <div className="rounded-2xl bg-indigo-50 p-4 text-center">
                  <p className="text-sm font-bold text-indigo-800">
                    שיתופי פעולה
                  </p>
                  <p className="mt-2 text-4xl font-black">8</p>
                  <p className="mt-1 text-sm font-bold text-indigo-700">
                    עסקאות פעילות
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl bg-white/50 p-3 text-start">
                {[
                  ["פנייה חדשה מלקוח", "פרויקט בניית אתר"],
                  ["פגישה נקבעה", "מחר ב־11:30"],
                  ["תזכורת AI", "לחזור ל־3 לידים"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-black">{title}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        {text}
                      </p>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-16 text-center sm:px-8 lg:px-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-700">
          למה להצטרף ל־Bizuply
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black tracking-[-0.03em] text-slate-800 sm:text-4xl">
          כל מה שהעסק צריך כדי לגדול חכם יותר
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "מה מקבלים",
              items: [
                "עמוד עסקי מקצועי",
                "יומן וכלי תיאום תורים",
                "CRM ללקוחות ולידים",
                "מחיר חודשי פשוט",
              ],
            },
            {
              title: "יותר שיתופי פעולה",
              items: [
                "חיבור לעסקים משלימים",
                "הפניות ישירות",
                "עבודה משותפת על עסקאות",
                "רשת צמיחה חזקה",
              ],
            },
            {
              title: "3 צעדים פשוטים",
              items: [
                "נרשמים ובוחרים מסלול",
                "בונים את עמוד העסק",
                "מתחילים לקבל פניות",
                "נותנים למערכת לעבוד בשבילכם",
              ],
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-white/80 bg-white/85 p-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
                {card.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-center gap-2 text-base font-bold leading-7 text-slate-600"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-[0.65rem] font-black text-emerald-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-5 pb-24 text-center sm:px-8">
        <div className="rounded-[2rem] border border-indigo-100 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-6 py-12 sm:px-10">
          <p className="text-sm font-black text-indigo-700">מתחילים היום</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
            הצטרפו ל־Bizuply והפכו את העסק למכונת צמיחה
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
            נהלו לקוחות, שיתופי פעולה, תורים, תזכורות וצמיחה חכמה מפלטפורמה אחת.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-9 py-4 text-base font-black text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5"
          >
            הירשמו עכשיו
            <span className="me-2">←</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default BusinessJoin;
