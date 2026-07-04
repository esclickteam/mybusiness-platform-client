import React from "react";

const heroImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85";

const destinations = [
  {
    title: "סנטוריני",
    subtitle: "יוון",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85",
    tag: "רומנטי",
  },
  {
    title: "באלי",
    subtitle: "אינדונזיה",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    tag: "טרופי",
  },
  {
    title: "האלפים",
    subtitle: "שוויץ",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85",
    tag: "יוקרה",
  },
  {
    title: "מרקש",
    subtitle: "מרוקו",
    image:
      "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=900&q=85",
    tag: "תרבות",
  },
];

const packages = [
  {
    title: "חופשה זוגית חלומית",
    location: "יוון / איטליה / צרפת",
    price: "החל מ־₪3,490",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    items: ["מלונות בוטיק", "מסלול מותאם אישית", "ליווי לפני הטיסה"],
  },
  {
    title: "טיול משפחתי מאורגן",
    location: "אירופה הקלאסית",
    price: "החל מ־₪5,900",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85",
    items: ["אטרקציות לילדים", "טיסות ומלונות", "תכנון מלא"],
  },
  {
    title: "מסע אקזוטי",
    location: "תאילנד / וייטנאם / באלי",
    price: "החל מ־₪6,700",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=85",
    items: ["חופים פרטיים", "חוויות מקומיות", "העברות ונציגות"],
  },
];

const steps = [
  {
    number: "01",
    title: "שיחת התאמה",
    text: "מבינים את התקציב, הסגנון, היעד והחוויה שתרצו לקבל.",
  },
  {
    number: "02",
    title: "בניית מסלול",
    text: "יוצרים לכם תכנון חכם עם מלונות, טיסות, יעדים והמלצות.",
  },
  {
    number: "03",
    title: "סגירה וליווי",
    text: "מקבלים את כל הפרטים במקום אחד עם ליווי עד החזרה לארץ.",
  },
];

const testimonials = [
  {
    name: "נועה ועמית",
    text: "הכול היה מתוקתק, רגוע ומדויק. הרגשנו שמישהו באמת תכנן לנו את החופשה כאילו זו החופשה שלו.",
  },
  {
    name: "משפחת לוי",
    text: "פעם ראשונה שלא היינו צריכים לרדוף אחרי מלונות, טיסות ואטרקציות. הכול היה במקום אחד.",
  },
];

export default function WantravelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="wantravel"
      className="min-h-screen overflow-hidden bg-[#f7f1e7] text-[#1f2a24]"
      style={{ fontFamily: "Assistant, Heebo, system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes wanFadeUp {
          from { opacity: 0; transform: translateY(34px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes wanFadeScale {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes wanFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }

        @keyframes wanMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }

        .wan-reveal {
          opacity: 0;
          animation: wanFadeUp .95s cubic-bezier(.2,.8,.2,1) forwards;
        }

        .wan-scale {
          opacity: 0;
          animation: wanFadeScale 1.2s cubic-bezier(.2,.8,.2,1) forwards;
        }

        .wan-float {
          animation: wanFloat 7s ease-in-out infinite;
        }

        .wan-marquee {
          animation: wanMarquee 26s linear infinite;
        }

        .wan-soft-shadow {
          box-shadow: 0 24px 80px rgba(35, 45, 35, .14);
        }
      `}</style>

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/40 bg-[#fdf8ef]/80 px-4 py-3 shadow-[0_16px_50px_rgba(31,42,36,0.12)] backdrop-blur-2xl md:px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18392f] text-sm font-black text-[#f7d99b]">
              W
            </span>
            <span className="text-xl font-black tracking-tight text-[#18392f]">
              Wantravel
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-bold text-[#2f4038]/80 lg:flex">
            <a className="transition hover:text-[#b6772f]" href="#destinations">
              יעדים
            </a>
            <a className="transition hover:text-[#b6772f]" href="#packages">
              חבילות
            </a>
            <a className="transition hover:text-[#b6772f]" href="#process">
              איך זה עובד
            </a>
            <a className="transition hover:text-[#b6772f]" href="#reviews">
              המלצות
            </a>
          </nav>

          <a
            href="#booking"
            className="rounded-full bg-[#18392f] px-5 py-3 text-sm font-black text-white shadow-[0_14px_40px_rgba(24,57,47,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b6772f]"
          >
            תכנון חופשה
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[940px] overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pt-32 lg:min-h-[980px]">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="נוף חופשה יוקרתי"
              className="wan-scale h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-[#f7f1e7]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(247,217,155,.36),transparent_28%),radial-gradient(circle_at_78%_30%,rgba(255,255,255,.2),transparent_25%)]" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl items-end gap-10 pt-20 lg:grid-cols-[1.06fr_.94fr] lg:pt-28">
            <div className="wan-reveal max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/20 px-4 py-2 text-sm font-black text-white backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[#f7d99b]" />
                חופשות בוטיק בהתאמה אישית
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white md:text-7xl lg:text-[6.4rem]">
                חופשה שמרגישה כאילו נתפרה רק בשבילך
              </h1>

              <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/86 md:text-xl">
                תכנון נסיעות יוקרתי, חכם ומדויק — מטיסות ומלונות ועד מסלולים,
                חוויות, אטרקציות וליווי אישי.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#booking"
                  className="group inline-flex items-center justify-center rounded-full bg-[#f7d99b] px-7 py-4 text-base font-black text-[#18392f] shadow-[0_18px_60px_rgba(247,217,155,.24)] transition duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  בואו נבנה מסלול
                  <span className="mr-3 transition duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                </a>
                <a
                  href="#destinations"
                  className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/15 px-7 py-4 text-base font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#18392f]"
                >
                  לראות יעדים
                </a>
              </div>
            </div>

            <div className="wan-reveal relative hidden min-h-[570px] lg:block [animation-delay:.18s]">
              <div className="wan-float absolute left-0 top-12 w-[330px] overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/18 p-3 backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=700&q=85"
                  alt="חופשה באיטליה"
                  className="h-[420px] w-full rounded-[2rem] object-cover"
                />
              </div>

              <div className="absolute bottom-0 right-0 w-[320px] rounded-[2.2rem] border border-white/35 bg-[#fff8ea]/92 p-6 shadow-[0_24px_80px_rgba(16,31,24,0.22)] backdrop-blur-xl">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#b6772f]">
                  תכנון אישי
                </p>
                <h3 className="mt-3 text-3xl font-black leading-tight text-[#18392f]">
                  נסיעות שמתחילות ברעיון ומסתיימות בחוויה בלתי נשכחת
                </h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-[#516158]">
                  חבילות נבחרות, יעדים טרנדיים, שירות אישי ונראות יוקרתית שמתאימה
                  לסוכנות נסיעות מודרנית.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-20 max-w-7xl overflow-hidden rounded-full border border-white/30 bg-white/10 px-6 py-4 backdrop-blur-xl">
            <div className="wan-marquee flex min-w-max items-center gap-14 text-sm font-black tracking-[0.28em] text-white/90">
              <span>חופשות פרימיום</span>
              <span>•</span>
              <span>ירח דבש</span>
              <span>•</span>
              <span>טיולים משפחתיים</span>
              <span>•</span>
              <span>יעדים אקזוטיים</span>
              <span>•</span>
              <span>מסלולים מותאמים אישית</span>
              <span>•</span>
              <span>שירות אישי</span>
              <span>•</span>
              <span>חופשות פרימיום</span>
              <span>•</span>
              <span>ירח דבש</span>
              <span>•</span>
              <span>טיולים משפחתיים</span>
              <span>•</span>
              <span>יעדים אקזוטיים</span>
              <span>•</span>
              <span>מסלולים מותאמים אישית</span>
              <span>•</span>
              <span>שירות אישי</span>
            </div>
          </div>
        </section>

        <section
          id="destinations"
          className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28"
        >
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b6772f]">
                יעדים נבחרים
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-[#18392f] md:text-5xl">
                מקומות שמתחילים בתמונה
                <br />
                ומסתיימים בזיכרון
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-8 text-[#546259]">
              מבחר יעדים אהובים במיוחד עם התאמה לזוגות, משפחות, חופשות יוקרה,
              נופש רגוע או חוויה מלאה באקשן.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {destinations.map((item, index) => (
              <article
                key={item.title}
                className="wan-reveal group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_55px_rgba(28,43,35,0.08)] transition duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="relative h-[360px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-white/85 px-4 py-2 text-xs font-black text-[#18392f] backdrop-blur-lg">
                    {item.tag}
                  </span>
                  <div className="absolute bottom-0 right-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-black">{item.title}</h3>
                    <p className="mt-1 text-sm font-bold text-white/80">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="packages"
          className="bg-[#18392f] px-4 py-20 text-white md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f7d99b]">
                  חבילות מומלצות
                </p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
                  תכנון חכם.
                  <br />
                  חוויה מלאה.
                </h2>
              </div>
              <p className="max-w-xl text-base font-semibold leading-8 text-white/75">
                חבילות לדוגמה שממחישות את איכות השירות, רמת התכנון והנראות
                המקצועית של סוכנות הנסיעות שלך.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              {packages.map((item, index) => (
                <article
                  key={item.title}
                  className="wan-reveal overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-[0_22px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="h-[270px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black">{item.title}</h3>
                        <p className="mt-2 text-sm font-bold text-white/70">
                          {item.location}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f7d99b] px-4 py-2 text-sm font-black text-[#18392f]">
                        {item.price}
                      </span>
                    </div>

                    <ul className="mt-6 space-y-3 text-sm font-semibold text-white/82">
                      {item.items.map((line) => (
                        <li key={line} className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#f7d99b]" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#booking"
                      className="mt-8 inline-flex rounded-full border border-white/18 px-5 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#18392f]"
                    >
                      לפרטים נוספים
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="process"
          className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28"
        >
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b6772f]">
                איך זה עובד
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-[#18392f] md:text-5xl">
                תהליך פשוט
                <br />
                שנראה ומרגיש פרימיום
              </h2>
              <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-[#57655c]">
                המטרה היא לתת לעסק שלך תבנית יוקרתית ומקצועית, שנראית מעולה
                ומובילה לפניות, השארת פרטים ותכנון חופשה.
              </p>
            </div>

            <div className="grid gap-5">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className="wan-reveal rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(29,43,35,0.08)]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <span className="text-4xl font-black tracking-[-0.05em] text-[#b6772f]">
                      {step.number}
                    </span>
                    <div className="max-w-xl">
                      <h3 className="text-2xl font-black text-[#18392f]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base font-semibold leading-8 text-[#5a685f]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="reviews"
          className="bg-[#fdf8ef] px-4 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b6772f]">
                המלצות
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-[#18392f] md:text-5xl">
                לקוחות אוהבים חוויות
                <br />
                שמרגישות מדויקות
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((item, index) => (
                <article
                  key={item.name}
                  className="wan-reveal rounded-[2rem] bg-white p-8 shadow-[0_18px_55px_rgba(28,43,35,0.08)]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="mb-4 flex gap-1 text-[#b6772f]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-lg font-semibold leading-8 text-[#48554d]">
                    {item.text}
                  </p>
                  <p className="mt-6 text-base font-black text-[#18392f]">
                    {item.name}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="booking"
          className="px-4 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2.5rem] bg-[#18392f] p-6 text-white shadow-[0_28px_90px_rgba(24,57,47,0.28)] md:p-10 lg:grid-cols-[1fr_.95fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f7d99b]">
                מתחילים מכאן
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
                בואו נתכנן
                <br />
                את החופשה הבאה שלכם
              </h2>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/78">
                אזור השארת פרטים שמתאים להמרה — עם מקום לשם, טלפון, יעד מבוקש
                והודעה חופשית.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
                  <p className="text-sm font-bold text-white/70">מענה אישי</p>
                  <p className="mt-2 text-xl font-black">ליווי לפני, במהלך ואחרי</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5">
                  <p className="text-sm font-bold text-white/70">התאמה מלאה</p>
                  <p className="mt-2 text-xl font-black">לפי תקציב, סגנון ויעד</p>
                </div>
              </div>
            </div>

            <form className="rounded-[2rem] bg-white p-6 text-[#18392f] shadow-[0_18px_50px_rgba(0,0,0,0.12)] md:p-7">
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-black">שם מלא</label>
                  <input
                    type="text"
                    placeholder="השם שלך"
                    className="w-full rounded-2xl border border-[#d9ddd7] bg-[#fbfbf9] px-4 py-3 outline-none transition focus:border-[#b6772f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black">טלפון</label>
                  <input
                    type="tel"
                    placeholder="050-0000000"
                    className="w-full rounded-2xl border border-[#d9ddd7] bg-[#fbfbf9] px-4 py-3 outline-none transition focus:border-[#b6772f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black">יעד מבוקש</label>
                  <input
                    type="text"
                    placeholder="למשל: יוון / איטליה / באלי"
                    className="w-full rounded-2xl border border-[#d9ddd7] bg-[#fbfbf9] px-4 py-3 outline-none transition focus:border-[#b6772f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black">הודעה</label>
                  <textarea
                    rows={5}
                    placeholder="ספרו בקצרה מה אתם מחפשים"
                    className="w-full resize-none rounded-2xl border border-[#d9ddd7] bg-[#fbfbf9] px-4 py-3 outline-none transition focus:border-[#b6772f]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[#18392f] px-6 py-4 text-base font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-[#b6772f]"
                >
                  שליחת פנייה
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e9e0d3] px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-black text-[#18392f]">Wantravel</p>
            <p className="mt-1 text-sm font-semibold text-[#68756d]">
              תבנית תיירות יוקרתית לביזאפלי
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-bold text-[#4d5a52]">
            <a href="#top" className="transition hover:text-[#b6772f]">
              בית
            </a>
            <a href="#destinations" className="transition hover:text-[#b6772f]">
              יעדים
            </a>
            <a href="#packages" className="transition hover:text-[#b6772f]">
              חבילות
            </a>
            <a href="#booking" className="transition hover:text-[#b6772f]">
              יצירת קשר
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}