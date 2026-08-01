import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function BusinessJoin() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-slate-800"
      dir="rtl"
    >
      <Helmet>
        <title>
          הצטרפות לעסקים - לידים, שיתופי פעולה וניהול חכם | Bizuply
        </title>
        <meta
          name="description"
          content="הצטרפו ל־Bizuply וקבלו לידים, בניית אתר, חיבור Meta, שיתופי פעולה ו־CRM ותורים — הכל במקום אחד לצמיחת העסק."
        />
        <link rel="canonical" href="https://bizuply.com/join" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8%] top-[20%] h-[520px] w-[520px] rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[25%] h-[480px] w-[480px] rounded-full bg-white/80 blur-3xl" />

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-bold text-amber-800 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            פלטפורמת צמיחה לעסקים מודרניים
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
            צמחו עם לידים, אתר, שיתופי פעולה וניהול חכם.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
            Bizuply עוזרת לעסקים לקבל פניות, לבנות אתר, לחבר Lead Ads מ־Meta
            (אפליקציה שעברה App Review), לשתף פעולה עם עסקים אחרים ולנהל תורים
            ועבודה יומיומית מדשבורד אחד.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/pricing"
              className="group inline-flex items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-8 py-4 text-base font-black text-slate-800 shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50"
            >
              הירשמו עכשיו
              <span className="me-2 transition group-hover:-translate-x-1">
                ←
              </span>
            </Link>

            <Link
              to="/businesses"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/75 px-8 py-4 text-base font-black text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              גלו עסקים
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["CRM", "לידים ולקוחות"],
              ["Meta", "Lead Ads מאושר"],
              ["אתר", "תבניות וטפסים"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xl font-black text-slate-800">{title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-amber-200/70 via-white to-emerald-100/80 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/80 p-5 shadow-2xl shadow-slate-900/12 backdrop-blur-xl">
            <div className="rounded-[2rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 p-5 text-slate-800">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    דשבורד Bizuply
                  </p>
                  <h3 className="mt-1 text-2xl font-black">הצמיחה היום</h3>
                </div>

                <div className="rounded-2xl bg-white/40 px-4 py-2 text-sm font-black">
                  חי
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-5 text-slate-800">
                  <p className="text-sm font-bold text-slate-500">פניות חדשות</p>
                  <p className="mt-3 text-4xl font-black">24</p>
                  <p className="mt-2 text-sm font-bold text-emerald-600">
                    +18% השבוע
                  </p>
                </div>

                <div className="rounded-3xl bg-amber-100 p-5 text-slate-800">
                  <p className="text-sm font-bold text-amber-800">
                    שיתופי פעולה
                  </p>
                  <p className="mt-3 text-4xl font-black">8</p>
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    עסקאות פעילות
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-3xl bg-white/40 p-4">
                {[
                  ["פנייה חדשה מהאתר", "פרויקט עיצוב אתר"],
                  ["תור נקבע", "מחר ב־11:30"],
                  ["ליד מ־Meta", "טופס Lead Ads"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-black">{title}</p>
                      <p className="text-xs font-semibold text-slate-600">
                        {text}
                      </p>
                    </div>
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-700">
            למה להצטרף ל־Bizuply
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-800 sm:text-5xl">
            כל מה שהעסק צריך כדי לצמוח חכם יותר
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: "🚀",
              title: "מה תקבלו",
              items: [
                "אתר עסקי מתבנית מוכנה",
                "יומן ותיאום תורים",
                "CRM ללידים ולקוחות",
                "חיבור Meta Lead Ads מאושר",
              ],
            },
            {
              icon: "🤝",
              title: "יותר שיתופי פעולה",
              items: [
                "התחברות לעסקים משלימים",
                "הפניות ישירות",
                "שיתוף פעולה על פרויקטים ועסקאות",
                "בניית רשת צמיחה חזקה",
              ],
            },
            {
              icon: "✨",
              title: "3 צעדים פשוטים",
              items: [
                "נרשמים ובוחרים מסלול",
                "בונים עמוד עסקי ואתר",
                "מתחילים לקבל פניות",
                "נותנים למערכת לעבוד בשבילכם",
              ],
            },
          ].map((card) => (
            <article
              key={card.title}
              className="group rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-xl shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-2xl text-slate-800 shadow-lg shadow-slate-900/20 transition group-hover:scale-105">
                {card.icon}
              </div>

              <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
                {card.title}
              </h3>

              <ul className="mt-6 space-y-4">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base font-bold leading-7 text-slate-600"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
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

      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2.5rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-6 py-14 text-center text-slate-800 shadow-2xl shadow-slate-900/20 sm:px-10 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-800">
              מתחילים לצמוח היום
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-800 sm:text-5xl">
              הצטרפו ל־Bizuply והפכו את העסק למכונת צמיחה.
            </h2>

            <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
              נהלו לידים, אתר, שיתופי פעולה, תורים ותזכורות — מפלטפורמה אחת
              חזקה.
            </p>

            <div className="mt-8">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-9 py-4 text-base font-black text-slate-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-amber-100"
              >
                הירשמו עכשיו
                <span className="me-2">←</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BusinessJoin;
