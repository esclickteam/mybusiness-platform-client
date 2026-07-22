"use client";

import React, { useMemo, useState } from "react";

type ClubForm = {
  fullName: string;
  phone: string;
  email: string;
  birthday: string;
  consent: boolean;
};

type Benefit = {
  id: string;
  title: string;
  description: string;
  tag: string;
};

type Coupon = {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
};

const benefits: Benefit[] = [
  {
    id: "b1",
    title: "הנחות קבועות לחברי מועדון",
    description: "לקוחות שנרשמים למועדון מקבלים הטבות מיוחדות לפי החלטת בעל העסק.",
    tag: "VIP",
  },
  {
    id: "b2",
    title: "קופון יום הולדת",
    description: "שליחת הטבה אישית ללקוח בחודש יום ההולדת שלו.",
    tag: "אוטומטי",
  },
  {
    id: "b3",
    title: "מבצעים לפי שירותים",
    description: "אפשר להציע הנחה על טיפול, פגישה, מוצר או חבילה.",
    tag: "שיווק",
  },
];

const coupons: Coupon[] = [
  {
    id: "c1",
    title: "10% הנחה לטיפול ראשון",
    description: "הטבה למצטרפים חדשים למועדון הלקוחות.",
    code: "WELCOME10",
    discount: "10%",
    validUntil: "30.06.2026",
  },
  {
    id: "c2",
    title: "50 ₪ הנחה בקביעת תור",
    description: "מתאים לעידוד לקוחות לקבוע תור דרך האתר.",
    code: "BOOK50",
    discount: "₪50",
    validUntil: "15.07.2026",
  },
];

export default function BusinessMiniSiteClub() {
  const [form, setForm] = useState<ClubForm>({
    fullName: "",
    phone: "",
    email: "",
    birthday: "",
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.fullName.trim().length >= 2 &&
      form.phone.trim().length >= 9 &&
      form.email.includes("@") &&
      form.consent
    );
  }, [form]);

  const updateField = <K extends keyof ClubForm>(key: K, value: ClubForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) return;

    // TODO:
    // כאן בהמשך תחברי לשרת:
    // POST /api/business/:businessId/club-members
    // body: form

    setSubmitted(true);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f4ff] text-slate-800">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#d8c7ff_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#ffe0ec_0%,transparent_30%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 lg:px-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between rounded-3xl border border-white/70 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(91,33,182,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-lg font-black text-white shadow-lg shadow-violet-200">
                B
              </div>

              <div>
                <p className="text-sm font-semibold text-violet-700">Bizuply Mini Site</p>
                <h1 className="text-lg font-black tracking-tight text-slate-800">
                  הדר עשת ביוטי
                </h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
              <a href="#services" className="transition hover:text-violet-700">
                שירותים
              </a>
              <a href="#club" className="transition hover:text-violet-700">
                מועדון לקוחות
              </a>
              <a href="#coupons" className="transition hover:text-violet-700">
                הטבות
              </a>
              <a href="#contact" className="transition hover:text-violet-700">
                יצירת קשר
              </a>
            </nav>

            <a
              href="#club"
              className="rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-violet-800"
            >
              הצטרפות למועדון
            </a>
          </header>

          {/* Hero */}
          <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                אתר עסקי חכם + מועדון לקוחות
              </div>

              <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-800 md:text-6xl">
                הצטרפי למועדון הלקוחות וקבלי הטבות אישיות, קופונים ועדכונים לפני כולם
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                כאן הלקוחות יכולים להירשם למועדון של העסק, לקבל הנחות, קופונים,
                עדכונים על מבצעים ולשמור על קשר ישיר עם בעל העסק — הכל בתוך האתר
                החכם של ביזאפלי.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#club"
                  className="rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-7 py-4 text-center text-base font-black text-white shadow-2xl shadow-violet-200 transition hover:-translate-y-0.5"
                >
                  הצטרפות חינם למועדון
                </a>

                <a
                  href="#coupons"
                  className="rounded-2xl border border-violet-200 bg-white/80 px-7 py-4 text-center text-base font-black text-violet-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  צפייה בהטבות
                </a>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm">
                  <p className="text-2xl font-black text-slate-800">320+</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">חברי מועדון</p>
                </div>

                <div className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm">
                  <p className="text-2xl font-black text-slate-800">12</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">הטבות פעילות</p>
                </div>

                <div className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm">
                  <p className="text-2xl font-black text-slate-800">VIP</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">לקוחות קבועים</p>
                </div>
              </div>
            </div>

            {/* Premium card */}
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-xl">
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet-300/50 via-fuchsia-200/50 to-amber-100/60 blur-2xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_30px_100px_rgba(91,33,182,0.18)] backdrop-blur-xl">
                  <div className="h-72 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#f4dfdf] via-[#fff7f2] to-[#efe7ff]">
                    <div className="flex h-full items-end justify-center">
                      <div className="mb-8 w-[78%] rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-violet-600">כרטיס מועדון</p>
                            <h3 className="text-2xl font-black text-slate-800">
                              הדר עשת ביוטי
                            </h3>
                          </div>

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-700 font-black text-white">
                            VIP
                          </div>
                        </div>

                        <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
                          <p className="text-sm text-white/70">הטבת הצטרפות</p>
                          <p className="mt-1 text-3xl font-black">10% הנחה</p>
                          <p className="mt-2 text-xs text-white/60">
                            למצטרפים חדשים למועדון הלקוחות
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl bg-violet-50 p-4">
                      <p className="text-sm font-bold text-violet-700">הטבה פעילה</p>
                      <p className="mt-1 text-xl font-black text-slate-800">WELCOME10</p>
                    </div>

                    <div className="rounded-3xl bg-fuchsia-50 p-4">
                      <p className="text-sm font-bold text-fuchsia-700">סטטוס לקוח</p>
                      <p className="mt-1 text-xl font-black text-slate-800">חבר מועדון</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Benefits */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black text-violet-700">מה הלקוח מקבל?</p>
            <h2 className="mt-2 text-3xl font-black text-slate-800 md:text-4xl">
              מועדון לקוחות שמייצר חזרה לעסק
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-slate-600">
            המטרה היא לא רק שהלקוח ייכנס לאתר — אלא שהוא יירשם, יחזור, יקבל
            הטבות ויהפוך ללקוח קבוע.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.id}
              className="group rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(91,33,182,0.13)]"
            >
              <div className="mb-5 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                {benefit.tag}
              </div>

              <h3 className="text-xl font-black text-slate-800">{benefit.title}</h3>

              <p className="mt-3 leading-7 text-slate-600">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Club form + coupons */}
      <section
        id="club"
        className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8"
      >
        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_25px_90px_rgba(15,23,42,0.07)] md:p-8">
          <p className="text-sm font-black text-violet-700">הרשמת לקוח</p>

          <h2 className="mt-2 text-3xl font-black text-slate-800">
            הצטרפות למועדון הלקוחות
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            הלקוח משאיר פרטים, נכנס למועדון, ובעל העסק יכול לשלוח לו הנחות,
            עדכונים וקופונים.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-2xl font-black text-emerald-700">
                נרשמת בהצלחה למועדון!
              </p>
              <p className="mt-2 leading-7 text-emerald-800">
                ההטבה שלך נשמרה. בהמשך אפשר לשלוח כאן קופון ב־SMS, וואטסאפ או מייל.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white"
              >
                הרשמת לקוח נוסף
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  שם מלא
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="לדוגמה: מיכל לוי"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    טלפון
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="050-0000000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    אימייל
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="name@email.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  תאריך יום הולדת
                </label>
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(e) => updateField("birthday", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => updateField("consent", e.target.checked)}
                  className="mt-1 h-5 w-5 accent-violet-700"
                />
                <span className="text-sm font-semibold leading-6 text-slate-600">
                  אני מאשר/ת הצטרפות למועדון הלקוחות וקבלת עדכונים, הטבות וקופונים
                  מהעסק.
                </span>
              </label>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 py-4 text-base font-black text-white shadow-2xl shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
              >
                הצטרפות למועדון וקבלת הטבה
              </button>
            </form>
          )}
        </div>

        <div id="coupons" className="rounded-[2rem] border border-white/80 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_25px_90px_rgba(15,23,42,0.18)] md:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-violet-300">הטבות פעילות</p>
              <h2 className="mt-2 text-3xl font-black">קופונים לחברי מועדון</h2>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white">
              {coupons.length} קופונים
            </div>
          </div>

          <div className="space-y-4">
            {coupons.map((coupon) => (
              <article
                key={coupon.id}
                className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
                  <div>
                    <h3 className="text-xl font-black">{coupon.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-black text-violet-700">
                    {coupon.discount}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold text-white/45">קוד קופון</p>
                    <p className="mt-1 text-2xl font-black tracking-wider text-violet-200">
                      {coupon.code}
                    </p>
                  </div>

                  <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/70">
                    בתוקף עד {coupon.validUntil}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 p-5">
            <h3 className="text-lg font-black text-violet-100">
              לבעל העסק בדשבורד
            </h3>
            <p className="mt-2 leading-7 text-white/65">
              בהמשך בעל העסק יוכל ליצור קופון, לבחור אחוז/סכום הנחה, תוקף,
              קהל יעד, ולשלוח אותו לכל חברי המועדון.
            </p>
          </div>
        </div>
      </section>

      {/* Owner dashboard preview */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/80 bg-white p-6 shadow-[0_30px_100px_rgba(91,33,182,0.10)] md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black text-violet-700">איך זה נראה לבעל העסק?</p>
              <h2 className="mt-2 text-3xl font-black text-slate-800">
                ניהול מועדון לקוחות מתוך ביזאפלי
              </h2>
            </div>

            <button className="rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              + יצירת הטבה חדשה
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["חברי מועדון", "320"],
              ["הטבות פעילות", "12"],
              ["קופונים מומשו", "74"],
              ["לקוחות חדשים החודש", "28"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
              >
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-100">
            <div className="grid grid-cols-4 bg-slate-50 px-5 py-4 text-sm font-black text-slate-500">
              <span>שם לקוח</span>
              <span>טלפון</span>
              <span>סטטוס</span>
              <span>הטבה אחרונה</span>
            </div>

            {[
              ["מיכל לוי", "050-1234567", "VIP", "WELCOME10"],
              ["נועה כהן", "052-7778899", "חדש", "BOOK50"],
              ["דנה ישראלי", "054-3332211", "פעיל", "WELCOME10"],
            ].map(([name, phone, status, coupon]) => (
              <div
                key={phone}
                className="grid grid-cols-4 border-t border-slate-100 px-5 py-4 text-sm font-bold text-slate-700"
              >
                <span>{name}</span>
                <span>{phone}</span>
                <span>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                    {status}
                  </span>
                </span>
                <span>{coupon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 p-8 text-center text-white shadow-2xl shadow-violet-200">
          <h2 className="text-3xl font-black">רוצה לקבוע תור?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/80">
            אפשר לשלב כאן קביעת תור, וואטסאפ, טופס ליד או מעבר ישיר לשירותים של העסק.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="rounded-2xl bg-white px-7 py-4 text-base font-black text-violet-700">
              קביעת תור
            </button>

            <button className="rounded-2xl border border-white/40 bg-white/10 px-7 py-4 text-base font-black text-white">
              שליחת הודעה
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}