import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "מבוא",
    body: [
      "מדיניות פרטיות זו מסבירה כיצד Bizuply אוספת, משתמשת, שומרת ומגנה על מידע אישי ועסקי.",
      "השימוש בפלטפורמה מהווה הסכמה למדיניות זו.",
    ],
  },
  {
    title: "איזה מידע נאסף",
    body: [
      "פרטי חשבון: שם, אימייל, טלפון, שם עסק.",
      "מידע תפעולי: לידים, לקוחות, פגישות, הודעות ותוכן שאתם מעלים למערכת.",
      "מידע טכני בסיסי לצורכי אבטחה ושיפור השירות (למשל יומני גישה).",
    ],
  },
  {
    title: "למה אנחנו משתמשים במידע",
    body: [
      "כדי לספק את השירותים: CRM, תורים, אתר, אוטומציות ושיתופי פעולה.",
      "כדי לתמוך בכם, לשלוח עדכוני שירות חשובים ולשפר את המוצר.",
      "כדי לעמוד בדרישות חוק ולמנוע שימוש לרעה.",
    ],
  },
  {
    title: "שיתוף מידע",
    body: [
      "איננו מוכרים את המידע האישי שלכם.",
      "ייתכן שיתוף עם ספקי תשתית ותשלומים הנדרשים להפעלת השירות, בכפוף להתחייבויות סודיות.",
      "חיבורים חיצוניים (למשל Meta) פועלים רק כשאתם מחברים אותם במפורש.",
    ],
  },
  {
    title: "שמירת מידע ואבטחה",
    body: [
      "המידע נשמר כל עוד נדרש למתן השירות או לפי דרישות חוק.",
      "אנו נוקטים באמצעי אבטחה מקובלים בתעשייה להגנה על המידע.",
    ],
  },
  {
    title: "זכויותיכם",
    body: [
      "ניתן לבקש עיקב, תיקון או מחיקה של מידע אישי, בכפוף למגבלות חוקיות ותפעוליות.",
      "לפניות בנושא פרטיות: support@bizuply.com.",
    ],
  },
  {
    title: "עוגיות",
    body: [
      "האתר עשוי להשתמש בעוגיות לצורכי התחברות, העדפות ושיפור חוויית השימוש.",
      "ניתן לנהל עוגיות דרך הגדרות הדפדפן.",
    ],
  },
  {
    title: "עדכונים",
    body: [
      "ייתכנו עדכונים למדיניות זו. תאריך העדכון יופיע בראש העמוד.",
    ],
  },
];

function PrivacyPolicy() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_40%,#eef3ff_76%,#ffffff_100%)] text-slate-800"
      dir="rtl"
    >
      <Helmet>
        <title>מדיניות פרטיות | Bizuply</title>
        <meta
          name="description"
          content="מדיניות הפרטיות של Bizuply — איסוף מידע, שימוש, אבטחה וזכויות משתמשים."
        />
        <link rel="canonical" href="https://bizuply.com/privacy-policy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />

      <section className="relative mx-auto max-w-4xl px-5 pb-10 pt-20 text-center sm:px-8 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          מרכז פרטיות
        </div>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-800 sm:text-5xl">
          מדיניות פרטיות
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
          איך אנחנו אוספים, משתמשים ומגנים על המידע שלכם ב־Bizuply.
        </p>
        <p className="mt-6 text-sm font-black text-slate-500">
          עודכן לאחרונה: 14 באוקטובר 2025
        </p>
      </section>

      <section className="relative mx-auto max-w-3xl space-y-5 px-5 pb-24 text-center sm:px-8">
        {SECTIONS.map((section) => (
          <article
            key={section.title}
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
          צור קשר בנושא פרטיות
        </Link>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
