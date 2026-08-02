import React, { useEffect, useMemo, useRef, useState } from "react";

import { TemplateText } from "../shared/TemplateText";
import {
  templateMediaProps,
  templateSectionProps,
} from "../shared/templateVisualAttrs";
import { idoEditorCss } from "./editorCss";

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
  mode?: "preview" | "editor" | "edit" | "site" | string;
};

function isIdoEditMode(mode?: string) {
  const value = String(mode || "").trim().toLowerCase();
  return value === "edit" || value === "editor";
}

function useReveal(editMode = false) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editMode) {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-ido-reveal]"),
      );
      const all: Record<string, boolean> = {};
      nodes.forEach((node) => {
        const id = node.dataset.idoReveal;
        if (id) all[id] = true;
      });
      setVisible(all);
      return undefined;
    }

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ido-reveal]"),
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
      { threshold: 0.35 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [editMode]);

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

/**
 * Whole-block title (one editable text node). Newlines are preserved via
 * white-space: pre-wrap so Enter in the visual editor creates real lines.
 */
function AnimatedTitle({
  text,
  editId,
  editLabel,
  active,
  className,
  startDelay = 0,
}: {
  text: string;
  editId: string;
  editLabel: string;
  active: boolean;
  className: string;
  startDelay?: number;
}) {
  return (
    <TemplateText
      as="h2"
      editId={editId}
      editLabel={editLabel}
      className={[
        className,
        "transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform whitespace-pre-wrap",
        active
          ? "translate-y-0 opacity-100 blur-none"
          : "translate-y-8 opacity-0 blur-md",
      ].join(" ")}
      style={{ transitionDelay: `${startDelay}ms` }}
    >
      {text}
    </TemplateText>
  );
}

/** Draggable field slot — inputs stay non-interactive in edit mode (canvas CSS). */
function FormFieldSlot({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={["ido-form-field-slot w-full", className].join(" ")}
      data-visual-editable="true"
      data-visual-edit-id={id}
      data-visual-edit-type="box"
      data-visual-edit-label={label}
    >
      {children}
    </div>
  );
}

function Header() {
  return (
    <header
      {...templateSectionProps("header", "Header", "header")}
      data-template-section-type="header"
      className="sticky top-0 z-50 px-4 pt-4 md:px-8"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07100e]/75 px-4 py-3 text-white shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <a href="#home" className="flex items-center gap-3">
          <TemplateText
            as="span"
            editId="header.logo"
            editLabel="לוגו"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#c9f4dc] text-sm font-black"
            style={{ color: "#07100e" }}
          >
            IDO
          </TemplateText>

          <TemplateText
            as="span"
            editId="header.brand"
            editLabel="שם המותג"
            className="hidden text-sm font-bold tracking-[0.24em] text-white/90 sm:block"
          >
            SOCIAL STUDIO
          </TemplateText>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/65 md:flex">
          <a href="#services" className="transition hover:text-[#c9f4dc]">
            <TemplateText as="span" editId="header.nav.services" editLabel="ניווט שירותים">
              שירותים
            </TemplateText>
          </a>
          <a href="#about" className="transition hover:text-[#c9f4dc]">
            <TemplateText as="span" editId="header.nav.about" editLabel="ניווט אודות">
              אודות
            </TemplateText>
          </a>
          <a href="#gallery" className="transition hover:text-[#c9f4dc]">
            <TemplateText as="span" editId="header.nav.gallery" editLabel="ניווט קייסים">
              קייסים
            </TemplateText>
          </a>
          <a href="#booking" className="transition hover:text-[#c9f4dc]">
            <TemplateText as="span" editId="header.nav.booking" editLabel="ניווט ייעוץ">
              ייעוץ
            </TemplateText>
          </a>
        </nav>

        <a
          href="#booking"
          className="rounded-full bg-[#c9f4dc] px-5 py-3 text-sm font-black transition duration-500 hover:-translate-y-0.5 hover:bg-white"
          style={{ color: "#07100e" }}
        >
          <TemplateText as="span" editId="header.cta" editLabel="כפתור קביעת שיחה">
            קביעת שיחה
          </TemplateText>
        </a>
      </div>
    </header>
  );
}

function Hero({ editMode = false }: { editMode?: boolean }) {
  const [open, setOpen] = useState(editMode);

  const heroImage =
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2400&q=95";

  const heroMediaAttrs = {
    ...templateMediaProps("hero.background", "תמונת הירו"),
    "data-visual-background-layer": "true",
    "data-visual-background-src": heroImage,
  };

  useEffect(() => {
    if (editMode) {
      setOpen(true);
      return undefined;
    }

    const timer = window.setTimeout(() => setOpen(true), 260);
    return () => window.clearTimeout(timer);
  }, [editMode]);

  return (
    <section
      id="home"
      {...templateSectionProps("hero", "הירו", "hero")}
      className="relative min-h-[100dvh] overflow-hidden bg-[#07100e] text-white"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[#07100e]" />

      <div className="absolute inset-0 z-0 overflow-hidden">
        {/*
          Same stable media id on all hero layers so replacing the image updates
          every animated layer in place (no overlay of old + new).
        */}
        <div
          {...heroMediaAttrs}
          className={[
            "absolute inset-0 bg-cover bg-center transition-all duration-[1700ms] ease-[cubic-bezier(0.83,0,0.17,1)] will-change-transform",
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-100",
          ].join(" ")}
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "inset(0 50% 0 0)",
            transitionDelay: "1450ms",
          }}
        />

        <div
          {...heroMediaAttrs}
          className={[
            "absolute inset-0 bg-cover bg-center transition-all duration-[1700ms] ease-[cubic-bezier(0.83,0,0.17,1)] will-change-transform",
            open ? "translate-x-0 opacity-100" : "translate-x-full opacity-100",
          ].join(" ")}
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "inset(0 0 0 50%)",
            transitionDelay: "1450ms",
          }}
        />

        <div
          {...heroMediaAttrs}
          className={[
            "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
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
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#c9f4dc]" />
          <TemplateText
            as="span"
            editId="hero.eyebrow"
            editLabel="תג הירו"
            className="whitespace-pre-wrap"
          >
            אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית
          </TemplateText>
        </div>

        <AnimatedTitle
          text={"מומחה סושיאל\nשבונה נוכחות\nשמוכרת בשבילך"}
          editId="hero.title"
          editLabel="כותרת הירו"
          active={open}
          className="relative z-40 mx-auto max-w-[1450px] overflow-visible pb-4 text-center text-[15.5vw] font-semibold leading-[0.86] tracking-[-0.085em] text-white drop-shadow-[0_30px_90px_rgba(0,0,0,.82)] sm:text-[12vw] md:text-[9vw] lg:text-[7.6vw] xl:text-[7.3rem]"
        />

        <TemplateText
          as="p"
          editId="hero.subtitle"
          editLabel="תת-כותרת הירו"
          className={[
            "relative z-40 mx-auto mt-5 max-w-2xl whitespace-pre-wrap text-center text-base leading-8 text-white/76 drop-shadow-[0_16px_42px_rgba(0,0,0,.75)] md:text-lg",
            "transition-all duration-900 ease-[cubic-bezier(0.19,1,0.22,1)]",
            open
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-7 opacity-0 blur-md",
          ].join(" ")}
          style={{ transitionDelay: "2350ms" }}
        >
          בניית מותג דיגיטלי, תוכן שמייצר אמון וקמפיינים שמביאים לידים,
          לקוחות ותוצאות מדידות.
        </TemplateText>

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
            <TemplateText as="span" editId="hero.cta.primary" editLabel="כפתור ייעוץ">
              קביעת שיחת ייעוץ
            </TemplateText>
          </a>

          <a
            href="#services"
            className="rounded-full border border-white/15 bg-white/[0.09] px-7 py-4 text-sm font-black text-white shadow-2xl backdrop-blur-2xl transition duration-500 hover:-translate-y-0.5 hover:border-[#c9f4dc] hover:bg-white/[0.14]"
          >
            <TemplateText as="span" editId="hero.cta.secondary" editLabel="כפתור שירותים">
              צפייה בשירותים
            </TemplateText>
          </a>
        </div>

        <div
          className={[
            "relative z-40 mt-10 grid w-full max-w-xl grid-cols-1 gap-3 md:grid-cols-3",
            "transition-all duration-900 ease-[cubic-bezier(0.19,1,0.22,1)]",
            open
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-8 opacity-0 blur-md",
          ].join(" ")}
          style={{ transitionDelay: "2750ms" }}
        >
          {[
            ["7.2M", "חשיפות", "hero.stat.1"],
            ["340%", "צמיחה", "hero.stat.2"],
            ["48+", "מותגים", "hero.stat.3"],
          ].map(([num, label, id]) => (
            <div
              key={id}
              className="rounded-[1.5rem] border border-white/10 bg-[#07100e]/45 p-4 text-center shadow-2xl backdrop-blur-2xl"
            >
              <TemplateText
                as="div"
                editId={`${id}.value`}
                editLabel={`מספר ${label}`}
                className="text-2xl font-semibold tracking-[-0.05em] text-[#c9f4dc]"
              >
                {num}
              </TemplateText>
              <TemplateText
                as="div"
                editId={`${id}.label`}
                editLabel={`תווית ${label}`}
                className="mt-1 text-xs text-white/60"
              >
                {label}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#07100e] to-transparent" />
    </section>
  );
}

function Services({
  visible,
  editMode = false,
}: {
  visible: Record<string, boolean>;
  editMode?: boolean;
}) {
  const showRight = editMode || visible["services-right"];
  const showImage = editMode || visible["services-image"];
  const showLeft = editMode || visible["services-left"];

  return (
    <section
      id="services"
      {...templateSectionProps("services", "שירותים", "services")}
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
          <TemplateText
            as="h2"
            editId="services.title"
            editLabel="כותרת שירותים"
            className="whitespace-pre-wrap text-4xl font-semibold leading-[1.04] tracking-[-0.055em] md:text-5xl"
          >
            אסטרטגיית תוכן שמרגישה כמו מותג, לא כמו עוד פוסט.
          </TemplateText>

          <TemplateText
            as="p"
            editId="services.body"
            editLabel="תיאור שירותים"
            className="mt-7 whitespace-pre-wrap text-lg leading-8 text-[#111827]/75"
          >
            אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל
            מהיכרות ראשונה ועד פנייה אמיתית.
          </TemplateText>

          <a
            href="#about"
            className="mt-9 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.12em] text-[#111827]"
          >
            <TemplateText as="span" editId="services.cta" editLabel="כפתור אודות">
              אודות
            </TemplateText>
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
            {...templateMediaProps("services.image", "תמונת שירותים")}
            className={[
              "h-full w-full object-cover transition-transform ease-[cubic-bezier(0.19,1,0.22,1)]",
              showImage ? "scale-100" : "scale-125",
            ].join(" ")}
            style={{
              transitionDuration: "2600ms",
              transitionDelay: "520ms",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07100e]/35 via-transparent to-transparent" />
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
            <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 16 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-full border border-[#111827]/55"
                />
              ))}
            </div>
          </div>

          <TemplateText
            as="p"
            editId="services.sideCopy"
            editLabel="טקסט צד שירותים"
            className="whitespace-pre-wrap text-sm font-black uppercase leading-7 tracking-[0.12em] text-[#111827]/80"
          >
            ניהול סושיאל, קריאייטיב, קמפיינים, תוכן, דוחות, מסעות לקוח
            ושיפור מתמיד של הביצועים — במקום אחד.
          </TemplateText>

          <TemplateText
            as="div"
            editId="services.partnerLabel"
            editLabel="Digital Growth Partner"
            className="mt-24 whitespace-pre-wrap text-xs font-black uppercase tracking-[0.24em] text-[#111827]/60"
          >
            Digital Growth Partner
          </TemplateText>
        </div>
      </div>
    </section>
  );
}

function About({
  visible,
  editMode = false,
}: {
  visible: Record<string, boolean>;
  editMode?: boolean;
}) {
  const titleActive = editMode || Boolean(visible["about-title"]);
  const imagesActive = editMode || Boolean(visible["about-images"]);

  const aboutImages = [
    {
      id: "about.card.1",
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1500&q=90",
      title: "תוכן שמייצר אמון",
      text: "פוסטים, קמפיינים ומסרים שנבנים לפי קהל, שלב במסע ומטרה עסקית.",
    },
    {
      id: "about.card.2",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1500&q=90",
      title: "דאטה שמוביל החלטות",
      text: "מעקב אחרי ביצועים, שיפור קמפיינים והבנה מה באמת מזיז את המספרים.",
    },
    {
      id: "about.card.3",
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1500&q=90",
      title: "מערכת שמביאה פניות",
      text: "חיבור בין קריאייטיב, הצעה, תוכן, מודעות ולידים במקום אחד ברור.",
    },
  ];

  return (
    <section
      id="about"
      {...templateSectionProps("about", "אודות", "about")}
      className="relative overflow-hidden bg-[#07100e] px-4 py-24 text-white md:px-8 md:py-32"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-16rem] top-[8rem] h-[36rem] w-[36rem] rounded-full bg-[#c9f4dc]/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-14rem] h-[34rem] w-[34rem] rounded-full bg-[#d8b98f]/10 blur-3xl" />
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
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#c9f4dc]" />
            <TemplateText
              as="span"
              editId="about.eyebrow"
              editLabel="תג אודות"
              className="whitespace-pre-wrap"
            >
              לא רק תוכן — מערכת צמיחה
            </TemplateText>
          </div>

          <AnimatedTitle
            text={"לא מעלים פוסטים.\nבונים ביקוש.\nמייצרים פניות."}
            editId="about.title"
            editLabel="כותרת אודות"
            active={titleActive}
            startDelay={160}
            className="mx-auto overflow-visible pb-5 text-center text-[13vw] font-semibold leading-[0.86] tracking-[-0.08em] text-white drop-shadow-[0_26px_90px_rgba(0,0,0,.7)] sm:text-[9vw] md:text-[7vw] lg:text-[5.8rem]"
          />

          <TemplateText
            as="p"
            editId="about.subtitle"
            editLabel="תיאור אודות"
            className={[
              "mx-auto mt-5 max-w-2xl whitespace-pre-wrap text-center text-base leading-8 text-white/62 md:text-lg",
              "transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
              titleActive
                ? "translate-y-0 opacity-100 blur-none"
                : "translate-y-8 opacity-0 blur-md",
            ].join(" ")}
            style={{ transitionDelay: "1500ms" }}
          >
            הבלוק הזה מציג את הדרך שבה משווק מקצועי הופך נראות דיגיטלית
            למערכת שמייצרת אמון, תנועה, לידים ומכירות.
          </TemplateText>
        </div>

        <div
          data-ido-reveal="about-images"
          className="mt-16 grid gap-5 md:grid-cols-3"
        >
          {aboutImages.map((item, index) => (
            <article
              key={item.id}
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
                  {...templateMediaProps(`${item.id}.image`, `תמונת כרטיס ${index + 1}`)}
                  className={[
                    "h-full w-full object-cover transition-transform ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110",
                    imagesActive ? "scale-100" : "scale-125",
                  ].join(" ")}
                  style={{
                    transitionDuration: "2200ms",
                    transitionDelay: `${index * 220}ms`,
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </div>

              <div className="p-7">
                <TemplateText
                  as="div"
                  editId={`${item.id}.index`}
                  editLabel={`מספר כרטיס ${index + 1}`}
                  className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#c9f4dc]"
                >
                  {`0${index + 1}`}
                </TemplateText>
                <TemplateText
                  as="h3"
                  editId={`${item.id}.title`}
                  editLabel={`כותרת כרטיס ${index + 1}`}
                  className="whitespace-pre-wrap text-3xl font-semibold tracking-[-0.045em]"
                >
                  {item.title}
                </TemplateText>
                <TemplateText
                  as="p"
                  editId={`${item.id}.text`}
                  editLabel={`תיאור כרטיס ${index + 1}`}
                  className="mt-4 whitespace-pre-wrap leading-7 text-white/58"
                >
                  {item.text}
                </TemplateText>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ editMode = false }: { editMode?: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(editMode);

  useEffect(() => {
    if (editMode) {
      setActive(true);
      return undefined;
    }

    const element = sectionRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [editMode]);

  const orbitImages = [
    {
      id: "gallery.orbit.1",
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1300&q=90",
      alt: "Marketing meeting",
      className:
        "right-[5%] top-[10%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: 120,
      fromY: 160,
      delay: 2100,
    },
    {
      id: "gallery.orbit.2",
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1300&q=90",
      alt: "Marketing analytics",
      className:
        "left-[5%] top-[12%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: -120,
      fromY: 160,
      delay: 2900,
    },
    {
      id: "gallery.orbit.3",
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1300&q=90",
      alt: "Digital team",
      className:
        "right-[8%] bottom-[9%] h-[155px] w-[300px] lg:h-[190px] lg:w-[390px] xl:h-[210px] xl:w-[430px]",
      fromX: 115,
      fromY: 160,
      delay: 3700,
    },
    {
      id: "gallery.orbit.4",
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
      {...templateSectionProps("gallery", "גלריה", "gallery")}
      className="relative min-h-[100dvh] overflow-hidden bg-[#22292b] px-4 py-12 text-white md:px-8 md:py-24"
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
          <TemplateText
            as="h2"
            editId="gallery.title"
            editLabel="כותרת גלריה"
            className="whitespace-pre-wrap text-4xl font-semibold leading-[1.08] tracking-[-0.06em] text-white drop-shadow-[0_22px_70px_rgba(0,0,0,.58)] md:text-7xl"
          >
            {"מחברים בין קהל, תוכן, דאטה\nוקמפיינים\nלמערכת צמיחה אחת ברורה."}
          </TemplateText>

          <TemplateText
            as="p"
            editId="gallery.subtitle"
            editLabel="תיאור גלריה"
            className="mx-auto mt-7 max-w-2xl whitespace-pre-wrap text-base leading-8 text-white/64 md:text-lg"
          >
            המעגלים מייצגים את מערכת השיווק: חשיפה, מסר, קהל, ליד,
            מכירה ושיפור מתמיד — כל שכבה מתרחבת ומחזקת את הבאה.
          </TemplateText>
        </div>

        {orbitImages.map((image) => (
          <div
            key={image.id}
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
              {...templateMediaProps(image.id, image.alt)}
              className="h-full w-full object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#22292b]/20 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-28 bg-gradient-to-t from-[#22292b] to-transparent" />
    </section>
  );
}

function Booking({
  visible,
  editMode = false,
}: {
  visible: Record<string, boolean>;
  editMode?: boolean;
}) {
  const copyVisible = editMode || Boolean(visible["booking-copy"]);
  const formVisible = editMode || Boolean(visible["booking-form"]);

  return (
    <section
      id="booking"
      {...templateSectionProps("booking", "שיחת ייעוץ", "contact")}
      data-template-section-type="contact"
      className="bg-[#ecf3ea] px-4 py-24 text-[#07100e] md:px-8 md:py-32"
      dir="rtl"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_0.9fr]">
        <div
          data-ido-reveal="booking-copy"
          className={revealClass(copyVisible)}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-12 bg-[#07100e]" />
            <TemplateText
              as="span"
              editId="booking.eyebrow"
              editLabel="תג ייעוץ"
              className="text-sm font-black tracking-[0.24em] text-[#07100e]/70"
            >
              CONSULTATION
            </TemplateText>
          </div>

          <TemplateText
            as="h2"
            editId="booking.title"
            editLabel="כותרת ייעוץ"
            className="whitespace-pre-wrap text-5xl font-semibold leading-[0.92] tracking-[-0.065em] md:text-8xl"
          >
            {"בואו נבנה\nתוכנית צמיחה\nלעסק שלך."}
          </TemplateText>

          <TemplateText
            as="p"
            editId="booking.subtitle"
            editLabel="תיאור ייעוץ"
            className="mt-7 max-w-xl whitespace-pre-wrap text-lg leading-8 text-[#07100e]/65"
          >
            אזור שמוכן לחיבור ל־CRM, וואטסאפ, יומן או כל מערכת לידים שתוסיף
            בהמשך.
          </TemplateText>
        </div>

        <form
          data-ido-reveal="booking-form"
          data-bizuply-form-id="ido-booking"
          data-bizuply-form-builder="true"
          data-visual-editable="true"
          data-visual-edit-id="booking.formBox"
          data-visual-edit-type="box"
          data-visual-edit-label="טופס יצירת קשר"
          className={[
            revealClass(formVisible, editMode ? "" : "delay-100"),
            "relative overflow-visible rounded-[2.6rem] border border-[#07100e]/10 bg-white p-6 shadow-[0_35px_110px_rgba(7,16,14,0.15)] md:p-8",
          ].join(" ")}
        >
          <div className="ido-form-fields relative flex flex-col gap-4">
            <FormFieldSlot id="booking.form.name" label="שדה שם מלא">
              <input
                className="h-14 w-full rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]"
                placeholder="שם מלא"
              />
            </FormFieldSlot>

            <FormFieldSlot id="booking.form.phone" label="שדה טלפון">
              <input
                className="h-14 w-full rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]"
                placeholder="טלפון"
              />
            </FormFieldSlot>

            <FormFieldSlot id="booking.form.interest" label="שדה בחירת שירות">
              <select className="h-14 w-full rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]">
                <option>מה מעניין אותך?</option>
                <option>ניהול סושיאל</option>
                <option>קמפיינים ממומנים</option>
                <option>אסטרטגיית תוכן</option>
                <option>מיתוג דיגיטלי</option>
              </select>
            </FormFieldSlot>

            <FormFieldSlot id="booking.form.budget" label="שדה תקציב">
              <input
                className="h-14 w-full rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 outline-none transition focus:border-[#07100e]"
                placeholder="תקציב חודשי משוער"
              />
            </FormFieldSlot>

            <FormFieldSlot id="booking.form.message" label="שדה הודעה">
              <textarea
                className="min-h-32 w-full rounded-2xl border border-[#07100e]/10 bg-[#f7fbf5] px-5 py-4 outline-none transition focus:border-[#07100e]"
                placeholder="ספרו בקצרה על העסק והמטרה"
              />
            </FormFieldSlot>

            <FormFieldSlot id="booking.form.submit" label="כפתור שליחה">
              <div
                role="button"
                tabIndex={0}
                className="flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-[#07100e] text-sm font-black text-white transition duration-500 hover:-translate-y-0.5 hover:bg-[#17342d]"
              >
                <TemplateText
                  as="span"
                  editId="booking.form.submitLabel"
                  editLabel="טקסט כפתור שליחה"
                >
                  שליחת בקשה לשיחה
                </TemplateText>
              </div>
            </FormFieldSlot>
          </div>
        </form>
      </div>
    </section>
  );
}

function Faq({
  visible,
  editMode = false,
}: {
  visible: Record<string, boolean>;
  editMode?: boolean;
}) {
  const titleVisible = editMode || Boolean(visible["faq-title"]);

  const items = [
    {
      id: "faq.item.1",
      q: "אפשר לערוך את כל הטקסטים והתמונות?",
      a: "כן. זה בנוי כתבנית רגילה לעורך שלך עם תמונות, טקסטים וכפתורים.",
    },
    {
      id: "faq.item.2",
      q: "זה מותאם לנייד?",
      a: "כן. המבנה רספונסיבי עם Tailwind בלבד.",
    },
    {
      id: "faq.item.3",
      q: "אפשר לחבר לוואטסאפ או CRM?",
      a: "כן. הטופס מוכן עיצובית לחיבור למערכת לידים בהמשך.",
    },
  ];

  return (
    <section
      {...templateSectionProps("faq", "שאלות נפוצות", "faq")}
      data-template-section-type="faq"
      className="bg-[#07100e] px-4 py-24 text-white md:px-8 md:py-32"
      dir="rtl"
    >
      <div className="mx-auto max-w-4xl">
        <div
          data-ido-reveal="faq-title"
          className={revealClass(titleVisible)}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-12 bg-[#c9f4dc]" />
            <TemplateText
              as="span"
              editId="faq.eyebrow"
              editLabel="תג FAQ"
              className="text-sm font-black tracking-[0.24em] text-[#c9f4dc]"
            >
              FAQ
            </TemplateText>
          </div>

          <TemplateText
            as="h2"
            editId="faq.title"
            editLabel="כותרת FAQ"
            className="max-w-5xl whitespace-pre-wrap text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white md:text-7xl"
          >
            שאלות לפני שמתחילים לבנות נוכחות דיגיטלית.
          </TemplateText>
        </div>

        <div className="mt-12 space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              data-ido-reveal={`faq-${index}`}
              className={[
                revealClass(editMode || Boolean(visible[`faq-${index}`])),
                "rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl",
              ].join(" ")}
            >
              <TemplateText
                as="h3"
                editId={`${item.id}.question`}
                editLabel={`שאלת FAQ ${index + 1}`}
                className="whitespace-pre-wrap text-xl font-semibold"
              >
                {item.q}
              </TemplateText>

              <TemplateText
                as="p"
                editId={`${item.id}.answer`}
                editLabel={`תשובת FAQ ${index + 1}`}
                className="mt-3 whitespace-pre-wrap leading-7 text-white/62"
              >
                {item.a}
              </TemplateText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      {...templateSectionProps("footer", "פוטר", "footer")}
      data-template-section-type="footer"
      className="bg-[#ecf3ea] px-4 py-10 text-[#07100e] md:px-8"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-[#07100e]/10 pt-8 text-sm md:flex-row md:items-center md:justify-between">
        <TemplateText
          as="div"
          editId="footer.brand"
          editLabel="שם בפוטר"
          className="whitespace-pre-wrap font-black tracking-[0.22em]"
        >
          IDO SOCIAL STUDIO
        </TemplateText>

        <TemplateText
          as="div"
          editId="footer.tagline"
          editLabel="תיאור בפוטר"
          className="whitespace-pre-wrap text-[#07100e]/60"
        >
          תבנית יוקרתית למשווק, איש סושיאל ואסטרטג דיגיטל
        </TemplateText>
      </div>
    </footer>
  );
}

export default function IdoPages({
  initialPage = "home",
  mode = "preview",
}: IdoPagesProps) {
  const editMode = isIdoEditMode(mode);
  const visible = useReveal(editMode);
  const page = useMemo(() => initialPage || "home", [initialPage]);

  return (
    <main
      dir="rtl"
      data-template-id="ido"
      data-template-page={page}
      data-template-page-id={page}
      data-template-mode={mode}
      className="relative min-h-[100dvh] overflow-x-hidden overflow-y-visible bg-[#07100e] font-sans"
    >
      <style>{idoEditorCss}</style>
      <Header />
      <Hero editMode={editMode} />
      <Services visible={visible} editMode={editMode} />
      <About visible={visible} editMode={editMode} />
      <Gallery editMode={editMode} />
      <Booking visible={visible} editMode={editMode} />
      <Faq visible={visible} editMode={editMode} />

      {/* Host for library/contact sections so form fields can be freely dragged */}
      <div
        data-visual-insert-host="true"
        data-visual-runtime-host="true"
        className="relative min-h-0 overflow-visible"
      />

      <Footer />
    </main>
  );
}
