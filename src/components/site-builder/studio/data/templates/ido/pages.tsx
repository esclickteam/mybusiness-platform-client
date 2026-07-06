import React, { useEffect, useMemo, useRef, useState } from "react";

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
  { id: "home", label: "בית", path: "/" },
  { id: "services", label: "שירותים", path: "/services" },
  { id: "about", label: "אודות", path: "/about" },
  { id: "gallery", label: "קייסים", path: "/gallery" },
  { id: "booking", label: "שיחת ייעוץ", path: "/booking" },
  { id: "contact", label: "צור קשר", path: "/contact" },
];

type IdoPagesProps = {
  initialPage?: IdoPageId;
  mode?: "preview" | "editor" | "site";
};

function useReveal() {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ido-reveal]")
    );

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
      { threshold: 0.35 }
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

function AnimatedLetterTitle({
  lines,
  active,
  className,
  step = 38,
  startDelay = 0,
}: {
  lines: string[];
  active: boolean;
  className: string;
  step?: number;
  startDelay?: number;
}) {
  let counter = 0;

  return (
    <h2 className={className}>
      {lines.map((line) => (
        <span key={line} className="block overflow-visible pb-[0.08em]">
          {Array.from(line).map((char, index) => {
            const currentIndex = counter;
            counter += 1;

            if (char === " ") {
              return (
                <span
                  key={`${line}-${index}`}
                  className="inline-block w-[0.24em]"
                >
                  &nbsp;
                </span>
              );
            }

            return (
              <span
                key={`${line}-${index}`}
                className={[
                  "inline-block transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform",
                  active
                    ? "translate-y-0 rotate-0 opacity-100 blur-none"
                    : "translate-y-full rotate-6 opacity-0 blur-md",
                ].join(" ")}
                style={{
                  transitionDelay: `${startDelay + currentIndex * step}ms`,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function Header() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07100e]/75 px-4 py-3 text-white shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <a href="#home" className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-full bg-[#c9f4dc] text-sm font-black"
            style={{ color: "#07100e" }}
          >
            IDO
          </span>

          <span className="hidden text-sm font-bold tracking-[0.24em] text-white/90 sm:block">
            SOCIAL STUDIO
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/65 md:flex">
          <a href="#services" className="transition hover:text-[#c9f4dc]">
            שירותים
          </a>
          <a href="#about" className="transition hover:text-[#c9f4dc]">
            אודות
          </a>
          <a href="#gallery" className="transition hover:text-[#c9f4dc]">
            קייסים
          </a>
          <a href="#booking" className="transition hover:text-[#c9f4dc]">
            ייעוץ
          </a>
        </nav>

        <a
          href="#booking"
          className="rounded-full bg-[#c9f4dc] px-5 py-3 text-sm font-black transition duration-500 hover:-translate-y-0.5 hover:bg-white"
          style={{ color: "#07100e" }}
        >
          קביעת שיחה
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const [open, setOpen] = useState(false);

  const titleLines = ["מומחה סושיאל", "שבונה נוכחות", "שמוכרת בשבילך"];

  const heroImage =
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2400&q=95";

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 260);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] overflow-hidden bg-[#07100e] text-white"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[#07100e]" />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={[
            "absolute inset-0 bg-cover bg-center transition-all duration-[1700ms] ease-[cubic-bezier(0.83,0,0.17,1)] will-change-transform",
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-100",
          ].join(" ")}
          style={{
            backgroundImage: `url(${heroImage})`,
            clipPath: "inset(0 50% 0 0)",
            transitionDelay: "1450ms",
          }}
        />

        <div
          className={[
            "absolute inset-0 bg-cover bg-center transition-all duration-[1700ms] ease-[cubic-bezier(0.83,0,0.17,1)] will-change-transform",
            open ? "translate-x-0 opacity-100" : "translate-x-full opacity-100",
          ].join(" ")}
          style={{
            backgroundImage: `url(${heroImage})`,
            clipPath: "inset(0 0 0 50%)",
            transitionDelay: "1450ms",
          }}
        />

        <div
          className={[
            "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            backgroundImage: `url(${heroImage})`,
            transitionDelay: "3100ms",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[#07100e]/38" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#07100e]/78 via-[#07100e]/18 to-[#07100e]/88" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#07100e]/62 via-transparent to-[#07100e]/62" />

      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

      <div className="relative z-30 mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col items-center justify-center px-4 pb-12 pt-28 md:px-8">
        <div
          className={[
            "mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.09] px-4 py-2 text-xs font-semibold text-white/78 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:text-sm",
            "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
            open
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-6 opacity-0 blur-md",
          ].join(" ")}
          style={{ transitionDelay: "100ms" }}
        >
          <span className="h-2 w-2 rounded-full bg-[#c9f4dc]" />
          אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית
        </div>

        <AnimatedLetterTitle
          lines={titleLines}
          active={open}
          step={44}
          className="pointer-events-none relative z-40 mx-auto max-w-[1450px] overflow-visible pb-4 text-center text-[15.5vw] font-semibold leading-[0.86] tracking-[-0.085em] text-white drop-shadow-[0_30px_90px_rgba(0,0,0,.82)] sm:text-[12vw] md:text-[9vw] lg:text-[7.6vw] xl:text-[7.3rem]"
        />

        <p
          className={[
            "relative z-40 mx-auto mt-5 max-w-2xl text-center text-base leading-8 text-white/76 drop-shadow-[0_16px_42px_rgba(0,0,0,.75)] md:text-lg",
            "transition-all duration-900 ease-[cubic-bezier(0.19,1,0.22,1)]",
            open
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-7 opacity-0 blur-md",
          ].join(" ")}
          style={{ transitionDelay: "2350ms" }}
        >
          בניית מותג דיגיטלי, תוכן שמייצר אמון וקמפיינים שמביאים לידים,
          לקוחות ותוצאות מדידות.
        </p>

        <div
          className={[
            "relative z-40 mt-9 flex flex-wrap items-center justify-center gap-3",
            "transition-all duration-900 ease-[cubic-bezier(0.19,1,0.22,1)]",
            open
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-7 opacity-0 blur-md",
          ].join(" ")}
          style={{ transitionDelay: "2550ms" }}
        >
          <a
            href="#booking"
            className="rounded-full bg-[#c9f4dc] px-7 py-4 text-sm font-black shadow-[0_18px_60px_rgba(201,244,220,.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-white"
            style={{ color: "#07100e" }}
          >
            קביעת שיחת ייעוץ
          </a>

          <a
            href="#services"
            className="rounded-full border border-white/15 bg-white/[0.09] px-7 py-4 text-sm font-black text-white shadow-2xl backdrop-blur-2xl transition duration-500 hover:-translate-y-0.5 hover:border-[#c9f4dc] hover:bg-white/[0.14]"
          >
            צפייה בשירותים
          </a>
        </div>

        <div
          className={[
            "relative z-40 mt-10 grid w-full max-w-xl grid-cols-3 gap-3",
            "transition-all duration-900 ease-[cubic-bezier(0.19,1,0.22,1)]",
            open
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-8 opacity-0 blur-md",
          ].join(" ")}
          style={{ transitionDelay: "2750ms" }}
        >
          {[
            ["7.2M", "חשיפות"],
            ["340%", "צמיחה"],
            ["48+", "מותגים"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-white/10 bg-[#07100e]/45 p-4 text-center shadow-2xl backdrop-blur-2xl"
            >
              <div className="text-2xl font-semibold tracking-[-0.05em] text-[#c9f4dc]">
                {num}
              </div>
              <div className="mt-1 text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#07100e] to-transparent" />
    </section>
  );
}

function Services({ visible }: { visible: Record<string, boolean> }) {
  const showRight = visible["services-right"];
  const showImage = visible["services-image"];
  const showLeft = visible["services-left"];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#aebcc3] px-4 py-20 text-[#111827] md:px-8 md:py-0"
      dir="rtl"
    >
      <div className="mx-auto grid min-h-[760px] max-w-[1800px] grid-cols-1 items-center gap-10 md:grid-cols-[1fr_0.92fr_1fr]">
        <div
          data-ido-reveal="services-right"
          className={[
            "mx-auto max-w-md text-center transition-all ease-[cubic-bezier(0.19,1,0.22,1)] md:text-right",
            showRight
              ? "translate-y-0 opacity-100 blur-none"
              : "-translate-y-40 opacity-0 blur-md",
          ].join(" ")}
          style={{
            transitionDuration: "1900ms",
            transitionDelay: "120ms",
          }}
        >
          <h2 className="text-4xl font-semibold leading-[1.04] tracking-[-0.055em] md:text-5xl">
            אסטרטגיית תוכן שמרגישה כמו מותג, לא כמו עוד פוסט.
          </h2>

          <p className="mt-7 text-lg leading-8 text-[#111827]/75">
            אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל
            מהיכרות ראשונה ועד פנייה אמיתית.
          </p>

          <a
            href="#about"
            className="mt-9 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.12em] text-[#111827]"
          >
            אודות
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#111827] text-white">
              ←
            </span>
          </a>
        </div>

        <div
          data-ido-reveal="services-image"
          className={[
            "relative mx-auto h-[560px] w-full max-w-[560px] overflow-hidden bg-[#07100e] shadow-[0_45px_130px_rgba(7,16,14,0.28)] transition-all ease-[cubic-bezier(0.19,1,0.22,1)] md:h-[760px]",
            showImage
              ? "scale-100 translate-y-0 opacity-100 blur-none"
              : "scale-[0.38] translate-y-20 opacity-0 blur-md",
          ].join(" ")}
          style={{
            transitionDuration: "2400ms",
            transitionDelay: "520ms",
            transformOrigin: "center center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1500&q=90"
            alt="Social media strategist"
            className={[
              "h-full w-full object-cover transition-transform ease-[cubic-bezier(0.19,1,0.22,1)]",
              showImage ? "scale-100" : "scale-125",
            ].join(" ")}
            style={{
              transitionDuration: "2600ms",
              transitionDelay: "520ms",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#07100e]/35 via-transparent to-transparent" />
        </div>

        <div
          data-ido-reveal="services-left"
          className={[
            "mx-auto max-w-md text-center transition-all ease-[cubic-bezier(0.19,1,0.22,1)]",
            showLeft
              ? "translate-y-0 opacity-100 blur-none"
              : "-translate-y-40 opacity-0 blur-md",
          ].join(" ")}
          style={{
            transitionDuration: "2100ms",
            transitionDelay: "820ms",
          }}
        >
          <div className="mx-auto mb-24 hidden h-14 w-14 items-center justify-center md:flex">
            <div className="grid grid-cols-4 gap-[2px]">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-full border border-[#111827]/55"
                />
              ))}
            </div>
          </div>

          <p className="text-sm font-black uppercase leading-7 tracking-[0.12em] text-[#111827]/80">
            ניהול סושיאל, קריאייטיב, קמפיינים, תוכן, דוחות, מסעות לקוח
            ושיפור מתמיד של הביצועים — במקום אחד.
          </p>

          <div className="mt-24 text-xs font-black uppercase tracking-[0.24em] text-[#111827]/60">
            Digital Growth Partner
          </div>
        </div>
      </div>
    </section>
  );
}

function About({ visible }: { visible: Record<string, boolean> }) {
  const titleActive = visible["about-title"];
  const imagesActive = visible["about-images"];

  const aboutImages = [
    {
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1500&q=90",
      title: "תוכן שמייצר אמון",
      text: "פוסטים, קמפיינים ומסרים שנבנים לפי קהל, שלב במסע ומטרה עסקית.",
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1500&q=90",
      title: "דאטה שמוביל החלטות",
      text: "מעקב אחרי ביצועים, שיפור קמפיינים והבנה מה באמת מזיז את המספרים.",
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1500&q=90",
      title: "מערכת שמביאה פניות",
      text: "חיבור בין קריאייטיב, הצעה, תוכן, מודעות ולידים במקום אחד ברור.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#07100e] px-4 py-24 text-white md:px-8 md:py-32"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-16rem] top-[8rem] h-[36rem] w-[36rem] rounded-full bg-[#c9f4dc]/10 blur-3xl" />
        <div className="absolute right-[-14rem] bottom-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#d8b98f]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div
          data-ido-reveal="about-title"
          className="mx-auto max-w-6xl text-center"
        >
          <div
            className={[
              "mx-auto mb-7 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl",
              "transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              titleActive
                ? "translate-y-0 opacity-100 blur-none"
                : "translate-y-8 opacity-0 blur-md",
            ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-[#c9f4dc]" />
            לא רק תוכן — מערכת צמיחה
          </div>

          <AnimatedLetterTitle
            lines={["לא מעלים פוסטים.", "בונים ביקוש.", "מייצרים פניות."]}
            active={titleActive}
            step={34}
            startDelay={160}
            className="mx-auto overflow-visible pb-5 text-center text-[13vw] font-semibold leading-[0.86] tracking-[-0.08em] text-white drop-shadow-[0_26px_90px_rgba(0,0,0,.7)] sm:text-[9vw] md:text-[7vw] lg:text-[5.8rem]"
          />

          <p
            className={[
              "mx-auto mt-5 max-w-2xl text-center text-base leading-8 text-white/62 md:text-lg",
              "transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              titleActive
                ? "translate-y-0 opacity-100 blur-none"
                : "translate-y-8 opacity-0 blur-md",
            ].join(" ")}
            style={{ transitionDelay: "1500ms" }}
          >
            הבלוק הזה מציג את הדרך שבה משווק מקצועי הופך נראות דיגיטלית
            למערכת שמייצרת אמון, תנועה, לידים ומכירות.
          </p>
        </div>

        <div
          data-ido-reveal="about-images"
          className="mt-16 grid gap-5 md:grid-cols-3"
        >
          {aboutImages.map((item, index) => (
            <article
              key={item.title}
              className={[
                "group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_35px_120px_rgba(0,0,0,.32)] backdrop-blur-xl",
                "transition-all ease-[cubic-bezier(0.19,1,0.22,1)]",
                imagesActive
                  ? "translate-y-0 scale-100 opacity-100 blur-none"
                  : "translate-y-14 scale-[0.88] opacity-0 blur-md",
                index === 1 ? "md:translate-y-10" : "",
              ].join(" ")}
              style={{
                transitionDuration: "1800ms",
                transitionDelay: `${index * 220}ms`,
              }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className={[
                    "h-full w-full object-cover transition-transform ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110",
                    imagesActive ? "scale-100" : "scale-125",
                  ].join(" ")}
                  style={{
                    transitionDuration: "2200ms",
                    transitionDelay: `${index * 220}ms`,
                  }}
                />
              </div>

              <div className="p-7">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#c9f4dc]">
                  0{index + 1}
                </div>
                <h3 className="text-3xl font-semibold tracking-[-0.045em]">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-white/58">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const orbitImages = [
    {
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1300&q=90",
      alt: "Marketing meeting",
      className:
        "right-[5%] top-[10%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: 120,
      fromY: 160,
      delay: 2100,
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1300&q=90",
      alt: "Marketing analytics",
      className:
        "left-[5%] top-[12%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: -120,
      fromY: 160,
      delay: 2900,
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1300&q=90",
      alt: "Digital team",
      className:
        "right-[8%] bottom-[9%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: 115,
      fromY: 160,
      delay: 3700,
    },
    {
      src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1300&q=90",
      alt: "Creative workspace",
      className:
        "left-[8%] bottom-[9%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: -115,
      fromY: 160,
      delay: 4500,
    },
  ];

  const rings = [
    { w: 360, h: 360, opacity: 0.32, delay: 0 },
    { w: 560, h: 450, opacity: 0.25, delay: 180 },
    { w: 800, h: 580, opacity: 0.2, delay: 360 },
    { w: 1080, h: 720, opacity: 0.16, delay: 540 },
    { w: 1380, h: 880, opacity: 0.12, delay: 720 },
    { w: 1680, h: 1040, opacity: 0.09, delay: 900 },
  ];

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-[#22292b] px-4 py-24 text-white md:px-8"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,244,220,.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,.03),transparent)]" />

      <div className="pointer-events-none absolute inset-0">
        {rings.map((ring) => (
          <div
            key={`${ring.w}-${ring.h}`}
            className="absolute left-1/2 top-1/2 rounded-full border border-[#7de1ab]/25"
            style={{
              width: ring.w,
              height: ring.h,
              opacity: active ? ring.opacity : 0.12,
              transform: active
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.22)",
              transitionProperty: "transform, opacity",
              transitionDuration: "3400ms",
              transitionDelay: `${ring.delay}ms`,
              transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)",
            }}
          />
        ))}

        <div
          className="absolute left-1/2 top-1/2 h-[620px] w-[1280px] rounded-full border border-[#7de1ab]/12"
          style={{
            opacity: active ? 0.9 : 0.16,
            transform: active
              ? "translate(-50%, -50%) scaleX(1) scaleY(1)"
              : "translate(-50%, -50%) scaleX(0.18) scaleY(0.28)",
            transition:
              "transform 3600ms cubic-bezier(0.19,1,0.22,1), opacity 2200ms ease",
            transitionDelay: "420ms",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[820px] w-[1640px] rounded-full border border-[#7de1ab]/10"
          style={{
            opacity: active ? 0.72 : 0.12,
            transform: active
              ? "translate(-50%, -50%) scaleX(1) scaleY(1)"
              : "translate(-50%, -50%) scaleX(0.14) scaleY(0.22)",
            transition:
              "transform 3900ms cubic-bezier(0.19,1,0.22,1), opacity 2400ms ease",
            transitionDelay: "620ms",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid h-20 w-20 place-items-center rounded-full border border-[#c9f4dc]/25 bg-[#07100e]/40 backdrop-blur-xl"
        style={{
          opacity: active ? 1 : 0.35,
          transform: active
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.55)",
          transition:
            "transform 2600ms cubic-bezier(0.19,1,0.22,1), opacity 1800ms ease",
          transitionDelay: "900ms",
        }}
      >
        <div className="relative h-10 w-10">
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c9f4dc]" />
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c9f4dc]" />
          <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#c9f4dc]" />
          <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#c9f4dc]" />
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute left-1/2 top-[4px] h-[32px] w-px -translate-x-1/2 bg-[#c9f4dc]/60" />
          <span className="absolute left-[4px] top-1/2 h-px w-[32px] -translate-y-1/2 bg-[#c9f4dc]/60" />
        </div>
      </div>

      <div className="relative z-30 mx-auto flex min-h-[calc(100dvh-12rem)] max-w-[1700px] items-center justify-center">
        <div
          className="relative z-40 max-w-4xl rounded-[2.6rem] border border-white/10 bg-[#22292b]/86 px-6 py-8 text-center shadow-[0_35px_120px_rgba(0,0,0,.48)] backdrop-blur-xl md:px-12 md:py-10"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(55px)",
            transition:
              "transform 1700ms cubic-bezier(0.19,1,0.22,1), opacity 1500ms ease",
            transitionDelay: "1500ms",
          }}
        >
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.06em] text-white drop-shadow-[0_22px_70px_rgba(0,0,0,.58)] md:text-7xl">
            מחברים בין קהל, תוכן, דאטה
            <br />
            וקמפיינים
            <br />
            למערכת צמיחה אחת ברורה.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/64 md:text-lg">
            המעגלים מייצגים את מערכת השיווק: חשיפה, מסר, קהל, ליד,
            מכירה ושיפור מתמיד — כל שכבה מתרחבת ומחזקת את הבאה.
          </p>
        </div>

        {orbitImages.map((image) => (
          <div
            key={image.alt}
            className={[
              "absolute z-30 hidden overflow-hidden rounded-[2.4rem] border border-white/10 bg-black shadow-[0_35px_110px_rgba(0,0,0,.42)] md:block",
              image.className,
            ].join(" ")}
            style={{
              opacity: active ? 1 : 0,
              transform: active
                ? "translate3d(0, 0, 0) scale(1)"
                : `translate3d(${image.fromX}px, ${image.fromY}px, 0) scale(0.84)`,
              filter: active ? "blur(0px)" : "blur(10px)",
              transitionProperty: "transform, opacity, filter",
              transitionDuration: "2100ms",
              transitionDelay: `${image.delay}ms`,
              transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)",
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#22292b]/20 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-28 bg-gradient-to-t from-[#22292b] to-transparent" />
    </section>
  );
}

function Booking({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section
      id="booking"
      className="bg-[#ecf3ea] px-4 py-24 text-[#07100e] md:px-8 md:py-32"
      dir="rtl"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.9fr]">
        <div
          data-ido-reveal="booking-copy"
          className={revealClass(visible["booking-copy"])}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-12 bg-[#07100e]" />
            <span className="text-sm font-black tracking-[0.24em] text-[#07100e]/70">
              CONSULTATION
            </span>
          </div>

          <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.065em] md:text-8xl">
            בואו נבנה
            <br />
            תוכנית צמיחה
            <br />
            לעסק שלך.
          </h2>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#07100e]/65">
            אזור שמוכן לחיבור ל־CRM, וואטסאפ, יומן או כל מערכת לידים שתוסיף
            בהמשך.
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
            <input
              className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]"
              placeholder="שם מלא"
            />

            <input
              className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]"
              placeholder="טלפון"
            />

            <select className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]">
              <option>מה מעניין אותך?</option>
              <option>ניהול סושיאל</option>
              <option>קמפיינים ממומנים</option>
              <option>אסטרטגיית תוכן</option>
              <option>מיתוג דיגיטלי</option>
            </select>

            <input
              className="h-14 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]"
              placeholder="תקציב חודשי משוער"
            />

            <textarea
              className="min-h-32 rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 py-4 outline-none transition focus:border-[#07100e]"
              placeholder="ספרו בקצרה על העסק והמטרה"
            />
          </div>

          <button
            type="button"
            className="mt-5 h-14 w-full rounded-full bg-[#07100e] text-sm font-black text-white transition duration-500 hover:-translate-y-0.5 hover:bg-[#17342d]"
          >
            שליחת בקשה לשיחה
          </button>
        </form>
      </div>
    </section>
  );
}

function Faq({ visible }: { visible: Record<string, boolean> }) {
  return (
    <section
      className="bg-[#07100e] px-4 py-24 text-white md:px-8 md:py-32"
      dir="rtl"
    >
      <div className="mx-auto max-w-4xl">
        <div
          data-ido-reveal="faq-title"
          className={revealClass(visible["faq-title"])}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-12 bg-[#c9f4dc]" />
            <span className="text-sm font-black tracking-[0.24em] text-[#c9f4dc]">
              FAQ
            </span>
          </div>

          <h2 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white md:text-7xl">
            שאלות לפני שמתחילים לבנות נוכחות דיגיטלית.
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {[
            [
              "אפשר לערוך את כל הטקסטים והתמונות?",
              "כן. זה בנוי כתבנית רגילה לעורך שלך עם תמונות, טקסטים וכפתורים.",
            ],
            ["זה מותאם לנייד?", "כן. המבנה רספונסיבי עם Tailwind בלבד."],
            [
              "אפשר לחבר לוואטסאפ או CRM?",
              "כן. הטופס מוכן עיצובית לחיבור למערכת לידים בהמשך.",
            ],
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

export default function IdoPages({
  initialPage = "home",
  mode = "preview",
}: IdoPagesProps) {
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
      <Gallery />
      <Booking visible={visible} />
      <Faq visible={visible} />

      <footer
        className="bg-[#ecf3ea] px-4 py-10 text-[#07100e] md:px-8"
        dir="rtl"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[#07100e]/10 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <div className="font-black tracking-[0.22em]">IDO SOCIAL STUDIO</div>

          <div className="text-[#07100e]/60">
            תבנית יוקרתית למשווק, איש סושיאל ואסטרטג דיגיטל
          </div>
        </div>
      </footer>
    </main>
  );
}