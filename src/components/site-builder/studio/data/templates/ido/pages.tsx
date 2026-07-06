import React, { useEffect, useMemo, useState } from "react";

export type IdoPageId =
  | "home"
  | "services"
  | "about"
  | "gallery"
  | "booking"
  | "contact";

export const idoPages: Array<{
  id: IdoPageId;
  label: string;
  path: string;
}> = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "about", label: "About", path: "/about" },
  { id: "gallery", label: "Gallery", path: "/gallery" },
  { id: "booking", label: "Booking", path: "/booking" },
  { id: "contact", label: "Contact", path: "/contact" },
];

type IdoPagesProps = {
  initialPage?: IdoPageId;
  mode?: "preview" | "editor" | "site";
};

const services = [
  {
    name: "טיפול פנים Signature",
    tag: "Skin Ritual",
    price: "₪340",
    duration: "75 דק׳",
    text: "טיפול עומק לעור נקי, חיוני וזוהר עם התאמה אישית לפי מצב העור.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=90",
  },
  {
    name: "עיצוב גבות פרימיום",
    tag: "Brows",
    price: "₪120",
    duration: "35 דק׳",
    text: "עיצוב מדויק לפי מבנה הפנים, עם גימור טבעי ונקי.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
  },
  {
    name: "טיפול Glow Renewal",
    tag: "Anti Aging",
    price: "₪430",
    duration: "90 דק׳",
    text: "טיפול מתקדם למראה עור אחיד, מתוח ורענן יותר.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1400&q=90",
];

function useReveal() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-ido-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.idoReveal;
          if (!id || !entry.isIntersecting) return;

          setVisible((current) => ({
            ...current,
            [id]: true,
          }));

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return visible;
}

function revealClass(isVisible: boolean, delay = "") {
  return [
    "transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
    delay,
    isVisible
      ? "translate-y-0 opacity-100 blur-none"
      : "translate-y-12 opacity-0 blur-md",
  ].join(" ");
}

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8" dir="rtl">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#08110f]/75 px-4 py-3 text-white shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#c9f4dc] text-sm font-black text-[#07100e]">
            IDO
          </span>
          <span className="hidden text-sm font-bold tracking-[0.24em] text-white/90 sm:block">
            BEAUTY HOUSE
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/65 md:flex">
          <a href="#services" className="transition hover:text-[#c9f4dc]">
            טיפולים
          </a>
          <a href="#about" className="transition hover:text-[#c9f4dc]">
            הסטודיו
          </a>
          <a href="#gallery" className="transition hover:text-[#c9f4dc]">
            גלריה
          </a>
          <a href="#booking" className="transition hover:text-[#c9f4dc]">
            תור
          </a>
        </nav>

        <a
          href="#booking"
          className="rounded-full bg-[#c9f4dc] px-5 py-3 text-sm font-black text-[#07100e] transition duration-500 hover:-translate-y-0.5 hover:bg-white"
        >
          קביעת תור
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
  id="home"
  className="relative min-h-[100dvh] overflow-hidden bg-[#07100e] pt-28 text-white"
  dir="rtl"
>
      <div className="pointer-events-none absolute left-[-12rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#c9f4dc]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#d8b98f]/20 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl grid-cols-1 gap-10 px-4 pb-10 md:grid-cols-[0.86fr_1.14fr] md:px-8">
        <div className="flex flex-col justify-end pb-8 md:pb-16">
          <div
            className={[
              "mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/72 backdrop-blur-xl",
              "transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              open ? "translate-y-0 opacity-100 blur-none" : "translate-y-8 opacity-0 blur-md",
            ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-[#c9f4dc]" />
            קליניקת יופי · תיאום תורים · חוויית פרימיום
          </div>

          <h1
            className={[
              "max-w-5xl text-6xl font-semibold leading-[0.88] tracking-[-0.08em] md:text-8xl lg:text-9xl",
              "transition-all delay-100 duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              open ? "translate-y-0 opacity-100 blur-none" : "translate-y-10 opacity-0 blur-md",
            ].join(" ")}
          >
            סטודיו יופי
            <br />
            שמרגיש יוקרתי
            <br />
            מהקליק הראשון.
          </h1>

          <p
            className={[
              "mt-7 max-w-xl text-lg leading-8 text-white/65",
              "transition-all delay-200 duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              open ? "translate-y-0 opacity-100 blur-none" : "translate-y-10 opacity-0 blur-md",
            ].join(" ")}
          >
            תבנית IDO לקוסמטיקה ותיאום תורים. מסך פתיחה דרמטי, תמונה שנפתחת לצדדים,
            טיפולים, גלריה וטופס תור שמתאים לחיבור למערכת שלך.
          </p>

          <div
            className={[
              "mt-10 grid grid-cols-3 gap-3",
              "transition-all delay-300 duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              open ? "translate-y-0 opacity-100 blur-none" : "translate-y-10 opacity-0 blur-md",
            ].join(" ")}
          >
            {[
              ["4.9", "דירוג"],
              ["3K+", "לקוחות"],
              ["15", "טיפולים"],
            ].map(([num, label]) => (
              <div
                key={label}
                className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
              >
                <div className="text-3xl font-semibold tracking-[-0.05em] text-[#c9f4dc]">
                  {num}
                </div>
                <div className="mt-1 text-sm text-white/55">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-end">
          <div
            className={[
              "absolute left-0 top-16 z-20 hidden rounded-[2rem] border border-white/10 bg-[#07100e]/70 p-5 text-white shadow-2xl backdrop-blur-2xl md:block",
              "transition-all delay-700 duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            ].join(" ")}
          >
            <div className="text-xs font-black tracking-[0.2em] text-[#c9f4dc]">
              NEXT SLOT
            </div>
            <div className="mt-2 text-2xl font-semibold">היום · 18:20</div>
            <div className="mt-1 text-sm text-white/55">Glow Renewal</div>
          </div>

          <div className="relative h-[64vh] min-h-[520px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_45px_130px_rgba(0,0,0,0.45)] md:h-[78vh] md:rounded-[3rem]">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1900&q=95"
              alt="IDO beauty studio"
              className={[
                "h-full w-full object-cover transition-all delay-200 duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                open ? "scale-100 blur-none" : "scale-110 blur-sm",
              ].join(" ")}
            />

            <div
              className={[
                "absolute inset-y-0 left-0 w-1/2 bg-[#07100e] transition-transform duration-[1250ms] ease-[cubic-bezier(0.83,0,0.17,1)]",
                open ? "-translate-x-full" : "translate-x-0",
              ].join(" ")}
            />

            <div
              className={[
                "absolute inset-y-0 right-0 w-1/2 bg-[#07100e] transition-transform duration-[1250ms] ease-[cubic-bezier(0.83,0,0.17,1)]",
                open ? "translate-x-full" : "translate-x-0",
              ].join(" ")}
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 md:p-8">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <div className="text-sm text-white/55">Signature treatment</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    Facial Glow Ritual
                  </div>
                </div>
                <a
                  href="#booking"
                  className="rounded-full bg-[#c9f4dc] px-5 py-3 text-sm font-black text-[#07100e] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  להזמנה
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  small,
  title,
  id,
  visible,
}: {
  small: string;
  title: string;
  id: string;
  visible: Record<string, boolean>;
}) {
  return (
    <div data-ido-reveal={id} className={revealClass(visible[id])}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-12 bg-[#c9f4dc]" />
        <span className="text-sm font-black tracking-[0.24em] text-[#c9f4dc]">{small}</span>
      </div>
      <h2 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white md:text-7xl">
        {title}
      </h2>
    </div>
  );
}

function Services({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section id="services" className="bg-[#07100e] px-4 py-24 md:px-8 md:py-32" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          small="SERVICES"
          title="טיפולים שמוצגים כמו מותג פרימיום, לא כמו רשימת מחירים."
          id="services-title"
          visible={visible}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.name}
              data-ido-reveal={`service-${index}`}
              className={[
                revealClass(
                  visible[`service-${index}`],
                  index === 1 ? "delay-100" : index === 2 ? "delay-200" : ""
                ),
                "group overflow-hidden rounded-[2.1rem] border border-white/10 bg-white/[0.055] text-white shadow-[0_25px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl",
                "transition duration-700 hover:-translate-y-2 hover:border-[#c9f4dc]/45 hover:bg-white/[0.08]",
              ].join(" ")}
            >
              <div className="h-80 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover opacity-90 transition duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:opacity-100"
                />
              </div>

              <div className="p-7">
                <div className="mb-5 flex items-center justify-between text-sm">
                  <span className="text-[#c9f4dc]">{service.tag}</span>
                  <span className="text-white/55">{service.duration}</span>
                </div>

                <h3 className="text-3xl font-semibold tracking-[-0.04em]">{service.name}</h3>
                <p className="mt-4 leading-7 text-white/62">{service.text}</p>

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-[#c9f4dc]">{service.price}</span>
                  <a
                    href="#booking"
                    className="rounded-full border border-white/15 px-5 py-3 text-sm font-black transition hover:border-[#c9f4dc] hover:bg-[#c9f4dc] hover:text-[#07100e]"
                  >
                    בחירה
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section id="about" className="bg-[#ecf3ea] px-4 py-24 text-[#07100e] md:px-8 md:py-32" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1fr]">
        <div
          data-ido-reveal="about-image"
          className={[
            revealClass(visible["about-image"]),
            "overflow-hidden rounded-[3rem] bg-[#07100e] shadow-[0_35px_110px_rgba(7,16,14,0.18)]",
          ].join(" ")}
        >
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=90"
            alt="IDO studio"
            className="h-[620px] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div data-ido-reveal="about-text" className={revealClass(visible["about-text"], "delay-100")}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-12 bg-[#07100e]" />
              <span className="text-sm font-black tracking-[0.24em] text-[#07100e]/70">
                ABOUT
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] md:text-7xl">
              סטודיו ששם את התחושה של הלקוחה לפני הכול.
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#07100e]/65">
              IDO נבנתה לקליניקות שרוצות להיראות מדויק, נקי ויוקרתי. כל אזור בתבנית
              מיועד להוביל את הלקוחה לקביעת תור בצורה טבעית.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                ["01", "אבחון אישי"],
                ["02", "טיפול מדויק"],
                ["03", "תוצאה טבעית"],
                ["04", "תיאום מהיר"],
              ].map(([num, text]) => (
                <div key={num} className="rounded-[1.6rem] border border-[#07100e]/10 bg-white/55 p-5">
                  <div className="text-sm font-black text-[#07100e]/45">{num}</div>
                  <div className="mt-2 text-xl font-semibold">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section id="gallery" className="bg-[#07100e] px-4 py-24 md:px-8 md:py-32" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          small="GALLERY"
          title="גלריה גדולה, דרמטית ונקייה — בדיוק לעסקי יופי."
          id="gallery-title"
          visible={visible}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {gallery.map((image, index) => (
            <div
              key={image}
              data-ido-reveal={`gallery-${index}`}
              className={[
                revealClass(visible[`gallery-${index}`], index % 2 ? "delay-100" : ""),
                "group overflow-hidden rounded-[2rem] border border-white/10 bg-black",
                index === 0 || index === 3 ? "md:translate-y-12" : "",
              ].join(" ")}
            >
              <img
                src={image}
                alt={`IDO gallery ${index + 1}`}
                className="h-[430px] w-full object-cover opacity-90 transition duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section id="booking" className="bg-[#ecf3ea] px-4 py-24 text-[#07100e] md:px-8 md:py-32" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.9fr]">
        <div data-ido-reveal="booking-copy" className={revealClass(visible["booking-copy"])}>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-12 bg-[#07100e]" />
            <span className="text-sm font-black tracking-[0.24em] text-[#07100e]/70">
              BOOKING
            </span>
          </div>

          <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.065em] md:text-8xl">
            קביעת תור
            <br />
            בלי עומס.
            <br />
            בלי בלאגן.
          </h2>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#07100e]/65">
            אזור שמוכן לחיבור ליומן, CRM, WhatsApp או כל מערכת תיאום תורים שתוסיף בהמשך.
          </p>
        </div>

        <form
          data-ido-reveal="booking-form"
          className={[
            revealClass(visible["booking-form"], "delay-100"),
            "rounded-[2.6rem] border border-[#07100e]/10 bg-white p-6 shadow-[0_35px_110px_rgba(7,16,14,0.15)] md:p-8",
          ].join(" ")}
        >
          <div className="grid gap-4">
            <input className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]" placeholder="שם מלא" />
            <input className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]" placeholder="טלפון" />
            <select className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]">
              <option>בחירת טיפול</option>
              <option>טיפול פנים Signature</option>
              <option>עיצוב גבות פרימיום</option>
              <option>Glow Renewal</option>
            </select>
            <input className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]" placeholder="יום ושעה מועדפים" />
            <textarea className="min-h-32 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 py-4 outline-none transition focus:border-[#07100e]" placeholder="הערה קצרה" />
          </div>

          <button
            type="button"
            className="mt-5 h-14 w-full rounded-full bg-[#07100e] text-sm font-black text-white transition duration-500 hover:-translate-y-0.5 hover:bg-[#17342d]"
          >
            שליחת בקשה לתור
          </button>
        </form>
      </div>
    </section>
  );
}

function Faq({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section className="bg-[#07100e] px-4 py-24 text-white md:px-8 md:py-32" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          small="FAQ"
          title="שאלות שהלקוחה רוצה לדעת לפני שהיא קובעת."
          id="faq-title"
          visible={visible}
        />

        <div className="mt-12 space-y-4">
          {[
            ["אפשר לערוך את כל הטקסטים והתמונות?", "כן. זה בנוי כתבנית רגילה לעורך שלך עם תמונות, טקסטים וכפתורים."],
            ["זה מותאם לנייד?", "כן. המבנה רספונסיבי עם Tailwind בלבד."],
            ["אפשר לחבר ליומן אמיתי?", "כן. הטופס מוכן עיצובית לחיבור למערכת תורים בהמשך."],
          ].map(([q, a], index) => (
            <div
              key={q}
              data-ido-reveal={`faq-${index}`}
              className={[
                revealClass(visible[`faq-${index}`]),
                "rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl",
              ].join(" ")}
            >
              <h3 className="text-xl font-semibold">{q}</h3>
              <p className="mt-3 leading-7 text-white/62">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function IdoPages({ initialPage = "home", mode = "preview" }: IdoPagesProps) {
  const visible = useReveal();
  const page = useMemo(() => initialPage || "home", [initialPage]);

  return (
    <main
  dir="rtl"
  data-template-id="ido"
  data-template-page={page}
  data-template-mode={mode}
  className="min-h-[100dvh] overflow-x-hidden overflow-y-visible bg-[#07100e] font-sans"
>
      <Header />
      <Hero />
      <Services visible={visible} />
      <About visible={visible} />
      <Gallery visible={visible} />
      <Booking visible={visible} />
      <Faq visible={visible} />

      <footer className="bg-[#ecf3ea] px-4 py-10 text-[#07100e] md:px-8" dir="rtl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[#07100e]/10 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <div className="font-black tracking-[0.22em]">IDO BEAUTY HOUSE</div>
          <div className="text-[#07100e]/60">תבנית יוקרתית לקוסמטיקה ותיאום תורים</div>
        </div>
      </footer>
    </main>
  );
}