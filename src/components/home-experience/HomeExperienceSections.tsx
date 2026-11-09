import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { useOpenFilm, type Film } from "./film";
import {
  AppointmentsBand,
  ConnectedFlow,
  CrmStory,
  GrowthBand,
  HeroDecor,
  OrbitBand,
  PhoneStory,
  useCinematic,
} from "./HomeCinematic";

function useCopy() {
  const { i18n, t } = useTranslation();
  const he = i18n.language.startsWith("he");
  const text = (hebrew: string, english: string) => (he ? hebrew : english);
  const cine = useCinematic(i18n.language);
  return { text, he, t, cine, language: i18n.language, dir: getTextDirection(i18n.language) };
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const apply = () => setNarrow(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return narrow;
}

function useReduced() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function lerpStops(progress: number, points: number[], values: number[]) {
  if (progress <= points[0]) return values[0];
  for (let index = 1; index < points.length; index += 1) {
    if (progress <= points[index]) {
      const span = points[index] - points[index - 1] || 1;
      const local = (progress - points[index - 1]) / span;
      return values[index - 1] + (values[index] - values[index - 1]) * local;
    }
  }
  return values[values.length - 1];
}

function band(progress: number, fadeIn: number, full: number, fadeOut: number, gone: number) {
  if (progress <= fadeIn || progress >= gone) return 0;
  if (progress < full) return (progress - fadeIn) / (full - fadeIn || 1);
  if (progress > fadeOut) return 1 - (progress - fadeOut) / (gone - fadeOut || 1);
  return 1;
}

function useScrollSpan(
  ref: { current: HTMLElement | null },
  apply: (progress: number) => void,
  mode: "pin" | "pass" = "pin",
) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const reduced = useReduced();
  useEffect(() => {
    if (reduced) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = mode === "pin"
        ? (node.offsetHeight - view <= 1 ? 0 : clamp01(-rect.top / (node.offsetHeight - view)))
        : clamp01((view - rect.top) / (node.offsetHeight + view));
      applyRef.current(progress);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const options: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", request, options);
    document.addEventListener("scroll", request, options);
    document.body.addEventListener("scroll", request, options);
    window.addEventListener("resize", request);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      document.removeEventListener("scroll", request);
      document.body.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [mode, reduced, ref]);
}

function clipFile(folder: string, name: string, language: string) {
  const code = language.toLowerCase().startsWith("pt")
    ? "pt-br"
    : language.toLowerCase().startsWith("he")
      ? "he"
      : language.toLowerCase().startsWith("es")
        ? "es"
        : language.toLowerCase().startsWith("ar")
          ? "ar"
          : "en";
  return `/demo-media/${folder}/${name}-${code}.mp4`;
}

function localeClip(src: string, language: string) {
  if (language.toLowerCase().startsWith("he")) return null;
  const folder = src.includes("/whatsapp/")
    ? "whatsapp"
    : src.includes("campaign")
      ? "campaigns"
      : src.includes("website")
        ? "websites"
        : src.includes("automation")
          ? "automations"
          : src.includes("appointment")
            ? "appointments"
            : src.includes("crm")
              ? "crm"
              : "";
  if (!folder) return null;
  const product = folder === "crm" || folder === "whatsapp" || folder === "automations" || folder === "campaigns" || folder === "websites";
  if (!product) return { src: `${clipFile(folder, folder, language)}#t=0.1`, poster: src };
  return {
    src: `/demo-media/${folder}/${folder}-en-product.mp4`,
    poster: `/demo-media/${folder}/poster-product.jpg`,
  };
}

function LocaleShot({
  src,
  language,
  className,
  alt,
  width,
  height,
  loading,
  decoding,
  fetchPriority,
  forceStill = false,
}: {
  src: string;
  language: string;
  className?: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  /** Keep the SSR still — avoids img→posterless-video remount flash on first paint. */
  forceStill?: boolean;
}) {
  const video = forceStill ? null : localeClip(src, language);
  if (!video) {
    if (!forceStill && !language.toLowerCase().startsWith("he") && src.startsWith("/demo-media/")) {
      return (
        <div className={className ? `${className} hx-locale-pending` : "hx-locale-pending"} role="img" aria-label={alt}>
          {alt}
        </div>
      );
    }
    return (
      <img
        className={className}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    );
  }
  return (
    <video
      className={className}
      src={video.src}
      poster={video.poster}
      muted
      playsInline
      preload="none"
      aria-label={alt}
      width={width}
      height={height}
    />
  );
}

function Words({ text, hot = -1, delay = 0 }: { text: string; hot?: number; delay?: number }) {
  const words = text.split(" ");
  const reduced = useReduced();
  // First paint must show the full headline. Enable motion only after that frame.
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    if (reduced) {
      setMotionReady(false);
      return undefined;
    }
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setMotionReady(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [reduced, text]);

  return (
    <span className="hx-line">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={index === hot ? "hx-word is-hot" : "hx-word"}>
            <span
              className={motionReady ? "hx-word__in" : undefined}
              style={motionReady ? { animationDelay: `${delay + index * 75}ms` } : undefined}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

function Cta({ to, children, tone = "solid" }: { to: string; children: string; tone?: "solid" | "line" | "ink" }) {
  const className = `hx-btn text-inherit${tone === "line" ? " hx-btn-line" : ""}${tone === "ink" ? " hx-btn-ink" : ""}`;
  const inner = (
    <>
      <span>{children}</span>
      <i aria-hidden="true" />
    </>
  );
  if (to.startsWith("#")) {
    return <a className={className} href={to}>{inner}</a>;
  }
  return <Link className={className} to={to}>{inner}</Link>;
}

function DemoButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="hx-demo" onClick={onClick}>
      <i aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

function AppointmentsSection() {
  const { language, cine } = useCopy();
  return (
    <AppointmentsBand
      copy={cine}
      shot={(
        <LocaleShot
          language={language}
          src="/demo-media/home/appointments.jpg"
          alt={cine.apptTitle}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      )}
    />
  );
}

function OrbitSection() {
  const { cine } = useCopy();
  return <OrbitBand copy={cine} />;
}

function GrowthSection() {
  const { cine } = useCopy();
  return <GrowthBand copy={cine} />;
}

export default function HomeExperienceSections() {
  const { text } = useCopy();
  return (
    <>
      <a className="hx-skip" href="#story">{text("דילוג לתוכן", "Skip to content")}</a>
      <main>
      <Hero />
      <Why />
      <ProductShowcase />
      <SplitStory />
      <CrmDepth />
      <WhatsApp />
      <Campaigns />
      <AppointmentsSection />
      <Websites />
      <Automations />
      <ReadySystems />
      <Connect />
      <Films />
      <Audiences />
      <OrbitSection />
      <GrowthSection />
      <Faq />
      <Close />
      </main>
    </>
  );
}

function Hero() {
  const { text, language, cine } = useCopy();
  const reduced = useReduced();
  const hero = cine.hero;
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    const node = ref.current;
    if (!node) return;
    // Keep a product layer always opaque so the purple frame never flashes empty.
    const s2 = band(progress, 0.3, 0.44, 0.6, 0.74);
    const s3 = progress < 0.6 ? 0 : Math.min(1, (progress - 0.6) / 0.14);
    const s1Fade = progress < 0.3 ? 1 : progress < 0.44 ? 1 - (progress - 0.3) / 0.14 : 0;
    const s1 = Math.max(s1Fade, 1 - Math.max(s2, s3));
    node.style.setProperty("--hp", progress.toFixed(3));
    node.style.setProperty("--s1", s1.toFixed(3));
    node.style.setProperty("--s2", s2.toFixed(3));
    node.style.setProperty("--s3", s3.toFixed(3));
  });
  const lineOne = hero.lineOne;
  const lineTwo = hero.lineTwo;
  const hot = Math.max(0, lineTwo.trim().split(/\s+/).length - 1);

  return (
    <section className="hx-hero" ref={ref} aria-labelledby="hx-hero-title">
      <div className="hx-hero-pin">
        <div className="hx-hero-atmosphere" aria-hidden="true">
          <div className="hx-hero-glow hx-hero-glow-a" />
          <div className="hx-hero-glow hx-hero-glow-b" />
          <div className="hx-hero-glow hx-hero-glow-c" />
          <div className="hx-hero-mesh" />
          <div className="hx-hero-beam" />
        </div>
        <div className="hx-geo hx-geo-a" aria-hidden="true" />
        <div className="hx-geo hx-geo-b" aria-hidden="true" />
        <div className="hx-geo hx-geo-c" aria-hidden="true" />
        <div className="hx-hero-copy">
          <p className="hx-hero-brand">BizUply</p>
          <h1 className="hx-display" id="hx-hero-title">
            <Words text={lineOne} />
            <Words text={lineTwo} hot={hot} delay={280} />
          </h1>
          <p className="hx-lead">{hero.lead1}</p>
          <div className="hx-actions">
            <Cta to="/register">{hero.start}</Cta>
            <Cta to="#products" tone="line">{hero.see}</Cta>
          </div>
        </div>
        <div className="hx-hero-stage">
          <div className="hx-hero-frame">
            <div className="hx-hero-chrome" aria-hidden="true">
              <span /><span /><span />
            </div>
            <LocaleShot
              className="hx-hero-shot hx-hero-shot-1 hx-crop-leads"
              language={language}
              src="/demo-media/home/crm.jpg"
              alt={hero.stageAlt}
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
              forceStill
            />
            <LocaleShot
              className="hx-hero-shot hx-hero-shot-2 hx-crop-chat"
              language={language}
              src="/demo-media/whatsapp/still-3.jpg"
              alt={text("שיחת WhatsApp של Northwind Studio בתוך BizUply", "A Northwind Studio WhatsApp conversation inside BizUply")}
              width={1600}
              height={1000}
              decoding="async"
              forceStill
            />
            <LocaleShot
              className="hx-hero-shot hx-hero-shot-3 hx-crop-campaigns"
              language={language}
              src="/demo-media/campaigns/still-chart.jpg"
              alt={text("מסך ניהול קמפיינים של Meta ב-BizUply", "Meta campaign management inside BizUply")}
              width={1600}
              height={1000}
              decoding="async"
              forceStill
            />
            <div className="hx-hero-shine" aria-hidden="true" />
          </div>
          <div className="hx-hero-float hx-hero-float-a" aria-hidden="true">
            <LocaleShot
              language={language}
              src="/demo-media/crm/lead-file.png"
              alt=""
              width={900}
              height={560}
              decoding="async"
              fetchPriority="low"
              className="hx-crop-record"
              forceStill
            />
          </div>
          <div className="hx-hero-float hx-hero-float-b" aria-hidden="true">
            <LocaleShot
              language={language}
              src="/demo-media/whatsapp/still-3.jpg"
              alt=""
              width={900}
              height={560}
              decoding="async"
              fetchPriority="low"
              className="hx-crop-chat"
              forceStill
            />
          </div>
        </div>
        <HeroDecor copy={cine} reduced={reduced} />
      </div>
      <div className="hx-wave" aria-hidden="true" />
    </section>
  );
}

function Why() {
  const { cine } = useCopy();
  return (
    <section className="hx-why" id="hx-connect" aria-labelledby="hx-why-title">
      <div className="hx-why-wrap">
        <p className="hx-eyebrow">{cine.connectEyebrow}</p>
        <h2 id="hx-why-title">{cine.connectTitle}</h2>
        <div className="hx-why-copy">
          <p>{cine.connectBody}</p>
        </div>
        <ConnectedFlow copy={cine} />
      </div>
    </section>
  );
}

function ProductShowcase() {
  const { text, dir, language, cine } = useCopy();
  const stageRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const reduced = useReduced();
  const narrow = useNarrow();
  const products = [
    {
      key: "scan",
      title: text("סריקת אתר חכמה AI", "AI website scan"),
      body: text("בדיקה אוטומטית של פרטיות, אבטחה, נגישות ומסמכים ציבוריים. מתחילים בסיכום חינמי.", "An automatic check of privacy, security, accessibility, and public documents. Start with a free summary."),
      img: "/demo-media/scan/card.svg",
      crop: "hx-crop-studio",
      tab: text("סריקה", "Scan"),
      href: "/website-scan",
      film: "scan" as const,
      caption: text("המחשה בלבד. אין כאן נתונים של אתר אמיתי.", "Illustration only. This is not data from a real site."),
    },
    {
      key: "crm",
      title: "CRM",
      body: text("רשימת לידים, כרטיס לקוח ומשימת המשך — במסך אחד.", "Lead list, customer record, and follow-up task — on one stage."),
      img: "/demo-media/crm/leads-list.png",
      crop: "hx-crop-leads",
      tab: text("CRM", "CRM"),
      href: "/crm",
      film: "crm" as const,
      caption: text("סיור מוצר: לידים → כרטיס לקוח → משימה.", "Product walkthrough: leads → customer record → task."),
    },
    {
      key: "whatsapp",
      title: "WhatsApp",
      body: text("תיבת שיחות עסקית שממשיכה את אותו לקוח מה־CRM.", "A business inbox that continues the same customer from the CRM."),
      img: "/demo-media/whatsapp/still-3.jpg",
      crop: "hx-crop-chat",
      tab: "WhatsApp",
      href: "/whatsapp-api",
      film: "whatsapp" as const,
      caption: text("סיור מוצר: תיבת שיחות עסקית.", "Product walkthrough: business inbox."),
    },
    {
      key: "campaigns",
      title: text("קמפיינים", "Campaigns"),
      body: text("קמפיין Meta עם נתוני ביצוע — והטיפול בליד ממשיך במערכת.", "A Meta campaign with performance data — then lead follow-up continues in the system."),
      img: "/demo-media/campaigns/still-chart.jpg",
      crop: "hx-crop-campaigns",
      tab: text("קמפיינים", "Campaigns"),
      href: "/meta-campaigns",
      film: "campaigns" as const,
      caption: text("סיור מוצר: ביצועי קמפיין וטיפול בליד.", "Product walkthrough: campaign performance and lead follow-up."),
    },
    {
      key: "websites",
      title: text("Website Studio", "Website Studio"),
      body: text("עריכת אתר — והשינוי נראה מיד בתצוגה.", "Site editing — and the change shows up in preview."),
      img: "/demo-media/home/websites.jpg",
      crop: "hx-crop-studio",
      tab: text("אתרים", "Sites"),
      href: "/website-builder",
      film: "websites" as const,
      caption: text("סיור מוצר: רשימת אתרים → עורך → תצוגה.", "Product walkthrough: site list → editor → preview."),
    },
    {
      key: "automations",
      title: text("אוטומציות", "Automations"),
      body: text("פנייה נכנסת → רשומה → פעולה להמשך — בלי לעבוד ידנית בכל שלב.", "An enquiry arrives → a record → a next action — without doing every step by hand."),
      img: "/demo-media/home/automations.jpg",
      crop: "hx-crop-auto",
      tab: text("אוטומציות", "Automations"),
      href: "/automations",
      film: "automations" as const,
      caption: text("סיור מוצר: מאירוע עסקי לפעולה מוגדרת.", "Product walkthrough: from a business event to a defined action."),
    },
  ] as const;
  const open = useOpenFilm();

  useEffect(() => {
    const stage = stageRef.current;
    const view = railRef.current;
    const rail = view?.querySelector<HTMLElement>(".hx-show-rail");
    if (!stage || !view || !rail) return undefined;
    const measure = () => {
      if (narrow || reduced) {
        stage.style.height = "";
        return;
      }
      const travel = Math.max(0, rail.scrollWidth - view.clientWidth);
      const pin = stage.querySelector<HTMLElement>(".hx-show-pin");
      const pinHeight = pin?.getBoundingClientRect().height || window.innerHeight;
      stage.style.height = `${Math.ceil(pinHeight + travel)}px`;
    };
    measure();
    rail.querySelectorAll("img, video").forEach((media) => {
      if (media instanceof HTMLImageElement && !media.complete) {
        media.addEventListener("load", measure, { once: true });
      }
    });
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [narrow, reduced]);

  useEffect(() => {
    const view = railRef.current;
    if (!view || !(narrow || reduced)) return undefined;
    const update = () => {
      const slides = [...view.querySelectorAll(".hx-show-slide")];
      const origin = view.getBoundingClientRect().left + view.clientWidth * 0.2;
      let nearest = 0;
      let best = Number.POSITIVE_INFINITY;
      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - origin);
        if (distance < best) {
          best = distance;
          nearest = index;
        }
      });
      setActive((current) => (current === nearest ? current : nearest));
    };
    update();
    view.addEventListener("scroll", update, { passive: true });
    return () => view.removeEventListener("scroll", update);
  }, [narrow, reduced]);

  useScrollSpan(stageRef, (progress) => {
    const view = railRef.current;
    const rail = view?.querySelector<HTMLElement>(".hx-show-rail");
    const stage = stageRef.current;
    if (!view || !rail || !stage || narrow || reduced) return;
    const travel = Math.max(0, rail.scrollWidth - view.clientWidth);
    view.scrollLeft = progress * travel;
    const slides = [...view.querySelectorAll(".hx-show-slide")];
    const origin = view.getBoundingClientRect().left + view.clientWidth * 0.18;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - origin);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActive((current) => (current === nearest ? current : nearest));
    stage.style.setProperty("--show-p", progress.toFixed(3));
    stage.style.setProperty("--show-i", String(nearest));
  });

  const current = products[active] || products[0];

  return (
    <section className="hx-showcase" id="products" ref={stageRef} aria-labelledby="hx-show-title">
      <div className="hx-show-pin">
        <div className="hx-show-head">
          <h2 id="hx-show-title">{cine.toolsTitle}</h2>
          <p className="hx-show-live" aria-live="polite">
            <strong>{current.title}</strong>
            <span>{cine.toolsLead}</span>
          </p>
          <div className="hx-actions hx-show-actions">
            <Cta to={current.href} tone="ink">{current.title}</Cta>
            {current.key === "scan" ? null : (
              <DemoButton
                label={cine.hero.watch}
                onClick={() => open(filmOf(current.film, current.film, "", current.title, current.caption, language, text))}
              />
            )}
          </div>
        </div>
        <div className="hx-show-viewport" ref={railRef}>
          <div className="hx-show-rail" dir="ltr">
            {products.map((product, index) => (
              <figure
                className={`hx-show-slide${index === active ? " is-on" : ""}`}
                key={product.key}
                data-product={product.key}
              >
                <div className="hx-show-frame">
                  <LocaleShot
                    language={language}
                    src={product.img}
                    alt={product.title}
                    width={1600}
                    height={1000}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={product.crop}
                    forceStill
                  />
                  <div className="hx-show-veil" aria-hidden="true" />
                </div>
                <figcaption dir={dir}>
                  <strong>{product.title}</strong>
                  <span>{product.body}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="hx-show-nav">
          <p className="hx-show-scroll-hint" aria-hidden="true">
            {text("בחרו מוצר", "Choose a product")}
          </p>
          <div className="hx-show-dots" role="tablist" aria-label={text("מוצרים", "Products")}>
            {products.map((product, index) => (
              <button
                key={product.key}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={index === active ? "is-on" : undefined}
                onClick={() => {
                  const slide = railRef.current?.querySelectorAll(".hx-show-slide")[index];
                  if (narrow || reduced) {
                    slide?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
                  } else {
                    const view = railRef.current;
                    if (!view || !slide) return;
                    const left = (slide as HTMLElement).offsetLeft - 24;
                    view.scrollLeft = left;
                    setActive(index);
                  }
                }}
              >
                {product.tab || product.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Beat = { title: string; body: string; img: string; alt: string };

function useStory(): Beat[] {
  const { text } = useCopy();
  return [
    {
      title: text("כל הלידים. במסך אחד.", "Every lead. One screen."),
      body: text(
        "רשימת הלידים של Northwind Studio, כפי שהיא נראית ב-CRM.",
        "The Northwind Studio lead list, as it appears in the CRM.",
      ),
      img: "/demo-media/home/crm.jpg",
      alt: text("רשימת לידים של Northwind Studio", "Northwind Studio lead list"),
    },
    {
      title: text("פותחים את הליד.", "Open the lead."),
      body: text(
        "תיק הלקוח נפתח מאותה רשימה: סטטוס, מקור, והצעד הבא.",
        "The customer file opens from that list: status, source, and the next step.",
      ),
      img: "/demo-media/crm/lead-file.png",
      alt: text("תיק ליד פתוח ב-CRM של BizUply", "An open lead file in the BizUply CRM"),
    },
    {
      title: text("ממשיכים ב-WhatsApp.", "Continue on WhatsApp."),
      body: text(
        "השיחה עם אותו לקוח נשארת בתוך סביבת העבודה.",
        "The conversation with that customer stays inside the workspace.",
      ),
      img: "/demo-media/whatsapp/still-3.jpg",
      alt: text("תיבת WhatsApp של Northwind Studio בתוך BizUply", "Northwind Studio WhatsApp inbox inside BizUply"),
    },
  ];
}

function SplitStory() {
  const narrow = useNarrow();
  const reduced = useReduced();
  if (narrow || reduced) return <SplitStack />;
  return <SplitPinned />;
}

function SplitPinned() {
  const { text, language } = useCopy();
  const beats = useStory();
  const open = useOpenFilm();
  const ref = useRef<HTMLElement | null>(null);
  const seam = useRef<SVGLineElement | null>(null);
  const film = useRef(0);
  useScrollSpan(ref, (progress) => {
    const node = ref.current;
    if (!node) return;
    const merge = lerpStops(progress, [0.8, 1], [0, 1]);
    film.current = progress < 0.62 ? 0 : 1;
    const vars = {
      "--cut-top": lerpStops(progress, [0, 0.28, 0.55, 0.78, 1], [50, 56, 38, 54, 46]),
      "--cut-bot": lerpStops(progress, [0, 0.28, 0.55, 0.78, 1], [36, 46, 56, 32, 46]),
      "--o1": band(progress, -1, 0, 0.3, 0.46),
      "--o2": band(progress, 0.32, 0.46, 0.6, 0.74),
      "--o3": progress < 0.6 ? 0 : progress < 0.74 ? (progress - 0.6) / 0.14 : 1,
      "--e1": lerpStops(progress, [0, 0.16], [-8, 0]),
      "--e2": (1 - clamp01((progress - 0.32) / 0.14)) * -8,
      "--e3": (1 - clamp01((progress - 0.6) / 0.14)) * -8,
      "--shift": lerpStops(progress, [0, 0.72, 1], [0, 1, 8]),
      "--is": lerpStops(progress, [0, 0.22, 0.48, 0.7, 1], [0.94, 1.06, 1, 1.1, 1.02]),
      "--vig": lerpStops(progress, [0, 0.16, 0.36, 0.5, 0.66, 0.82, 1], [0.1, 0.88, 0.72, 0.78, 0.28, 0.08, 0]),
      "--hole-x": lerpStops(progress, [0, 0.45, 0.75], [42, 50, 62]),
      "--hole-y": lerpStops(progress, [0, 0.45, 0.75], [62, 42, 50]),
      "--t1": band(progress, -1, 0, 0.22, 0.34) * (1 - merge),
      "--t2": band(progress, 0.34, 0.46, 0.58, 0.7) * (1 - merge),
      "--t3": band(progress, 0.64, 0.76, 0.84, 0.92) * (1 - merge),
      "--merge": merge,
      "--wa-bg": lerpStops(progress, [0.55, 0.74, 0.9, 1], [0, 1, 0.7, 0.15]),
    };
    for (const [key, value] of Object.entries(vars)) {
      node.style.setProperty(key, value.toFixed(3));
    }
    seam.current?.setAttribute("x1", vars["--cut-top"].toFixed(2));
    seam.current?.setAttribute("x2", vars["--cut-bot"].toFixed(2));
  });

  const openFilm = () => {
    const whatsapp = film.current === 1;
    open(whatsapp ? filmOf("whatsapp", "whatsapp", "/demo-media/whatsapp/poster.jpg", text("WhatsApp", "WhatsApp"), text("הקלטת תיבת ההודעות מתוך סביבת הדמו.", "A recording of the inbox from the demo workspace."), language, text) : filmOf("crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("הקלטת מסך של עבודת הלידים מתוך סביבת הדמו.", "A screen recording of the lead workspace from the demo."), language, text));
  };

  return (
    <section className="hx-split" id="story" ref={ref} aria-labelledby="hx-story-title">
      <div className="hx-split-pin">
        <div className="hx-wash" aria-hidden="true" />
        <div className="hx-light" aria-hidden="true">
          <div className="hx-light-cool" />
        </div>
        <svg className="hx-seam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line ref={seam} x1="50" y1="0" x2="36" y2="100" />
        </svg>
        <div className="hx-shots">
          {beats.map((beat, index) => (
            <div className={`hx-shot hx-shot-${index + 1}`} key={beat.img}>
              <LocaleShot language={language} src={beat.img} alt={beat.alt} width={1600} height={1000} decoding="async" />
            </div>
          ))}
          <div className="hx-vig" aria-hidden="true" />
        </div>
        <div className="hx-split-copy">
          <h2 className="hx-sr" id="hx-story-title">
            {text("מהליד ועד השיחה ב-WhatsApp", "From the lead to the WhatsApp conversation")}
          </h2>
          <p className="hx-sr">
            {text(
              "גוללים דרך רשימת הלידים, פתיחת תיק הלקוח, והמשך השיחה ב-WhatsApp — על אותו לקוח.",
              "Scroll through the lead list, the open customer file, and the WhatsApp conversation for the same customer.",
            )}
          </p>
          <div className="hx-beats" aria-hidden="true">
            {beats.map((beat, index) => (
              <p className={`hx-beat hx-beat-${index + 1}`} key={beat.title}>
                <strong>{beat.title}</strong>
                <span>{beat.body}</span>
              </p>
            ))}
          </div>
          <div className="hx-split-links">
            <Cta to="/crm" tone="line">{text("ל־CRM", "CRM")}</Cta>
            <DemoButton label={text("לצפות בהדגמה", "Watch the demo")} onClick={openFilm} />
          </div>
        </div>
        <p className="hx-merge" aria-hidden="true">{text("אותו לקוח. כל הדרך.", "Same customer. The whole way.")}</p>
      </div>
    </section>
  );
}

function SplitStack() {
  const { text, language } = useCopy();
  const beats = useStory();
  const open = useOpenFilm();
  const crops = ["hx-crop-leads", "hx-crop-record", "hx-crop-chat"];
  return (
    <section className="hx-split" id="story" aria-labelledby="hx-story-title">
      <h2 className="hx-sr" id="hx-story-title">
        {text("מהליד ועד השיחה ב-WhatsApp", "From the lead to the WhatsApp conversation")}
      </h2>
      <div className="hx-stack">
        {beats.map((beat, index) => (
          <article key={beat.title}>
            <h3>{beat.title}</h3>
            <p>{beat.body}</p>
            <LocaleShot
              language={language}
              src={beat.img}
              alt={beat.alt}
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className={crops[index]}
              forceStill
            />
          </article>
        ))}
      </div>
      <div className="hx-actions hx-stack-actions">
        <Cta to="/crm" tone="ink">{text("ל־CRM", "CRM")}</Cta>
        <DemoButton
          label={text("לצפות בהדגמה", "Watch the demo")}
          onClick={() => open(filmOf("crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("לידים, כרטיס לקוח ומשימת המשך מתוך סביבת הדמו.", "Leads, customer record, and follow-up task from the demo workspace."), language, text))}
        />
      </div>
    </section>
  );
}

function CrmDepth() {
  const { text, language, cine } = useCopy();
  const open = useOpenFilm();
  const points = [
    [text("ניהול לידים", "Lead management"), text("ריכוז פניות נכנסות ומעקב אחר הסטטוס של כל ליד.", "Incoming enquiries in one list, with a status for each lead.")],
    [text("כרטיס לקוח", "Customer record"), text("מידע ופרטים רלוונטיים שמאפשרים להמשיך את הטיפול בצורה מסודרת.", "The details the team needs in order to continue the work in an orderly way.")],
    [text("משימות ומעקב", "Tasks and follow-up"), text("תכנון פעולות המשך והבנה מה עדיין דורש טיפול.", "A place to plan the next action and see what still needs attention.")],
    [text("סינון וארגון", "Search and filters"), text("חיפוש, סינון וסידור מידע כדי להגיע במהירות לרשומות הרלוונטיות.", "Search, filter, and sort so the relevant records are easy to reach.")],
    [text("עבודת צוות", "Shared work"), text("סביבת עבודה משותפת שמסייעת לעקוב אחר אחריות והמשך טיפול, בהתאם להרשאות וליכולות הפעילות.", "A shared workspace for responsibility and follow-up, within the permissions and features that are active.")],
  ] as const;
  const shots = [
    ["/demo-media/crm/leads-list.png", text("פתיחת רשימת הלידים", "Open the lead list")],
    ["/demo-media/crm/lead-file.png", text("כניסה לכרטיס ליד", "Open a lead record")],
    ["/demo-media/crm/lead-task.png", text("יצירת משימת המשך", "Create a follow-up task")],
  ] as const;
  return (
    <section className="hx-depth" aria-labelledby="hx-crm-title">
      <div className="hx-depth-wrap">
        <div>
          <h2 id="hx-crm-title">{cine.crmTitle}</h2>
          <p className="hx-prose">{cine.crmLead}</p>
          <p className="hx-prose">
            {text(
              "עם ה־CRM של BizUply אפשר לרכז מידע על לידים ולקוחות, לעקוב אחר סטטוסים, לתעד את המשך הטיפול ולנהל משימות מתוך סביבת עבודה מרכזית. כך קל יותר להבין מי פנה, מה הוא ביקש, מי מטפל בו ומה צריך לקרות בהמשך.",
              "With BizUply CRM, a business can keep lead and customer information together, follow statuses, record what happens next, and manage tasks from one workspace. It is easier to see who got in touch, what they asked for, who is handling it, and what should happen next.",
            )}
          </p>
          <div className="hx-actions">
            <Cta to="/crm" tone="ink">{text("לגלות את מערכת ה־CRM", "Explore BizUply CRM")}</Cta>
            <DemoButton
              label={text("לצפות בהדגמה", "Watch the demo")}
              onClick={() => open(filmOf("crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("לידים → כרטיס לקוח → משימת המשך.", "Leads → customer record → follow-up task."), language, text))}
            />
          </div>
        </div>
        <div className="hx-crm-stage">
          <LocaleShot language={language} src={shots[0][0]} alt={shots[0][1]} width={1200} height={750} loading="lazy" decoding="async" />
          <div className="hx-crm-float">
            <LocaleShot language={language} src={shots[1][0]} alt={shots[1][1]} width={1200} height={750} loading="lazy" decoding="async" />
          </div>
          <div className="hx-crm-task">
            <LocaleShot language={language} src={shots[2][0]} alt={shots[2][1]} width={1200} height={750} loading="lazy" decoding="async" />
          </div>
          <p className="hx-crm-toast">{text("ליד חדש התקבל", "A new lead arrived")}</p>
          <CrmStory copy={cine} />
        </div>
        <ul className="hx-points">
          {points.map(([title, body]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function filmOf(
  folder: string,
  name: string,
  _poster: string,
  title: string,
  caption: string,
  _language: string,
  text: (hebrew: string, english: string) => string,
): Film {
  return {
    src: `/demo-media/${folder}/${name}-en-product.mp4`,
    poster: `/demo-media/${folder}/poster-product.jpg`,
    title,
    caption,
    tag: text("סיור מוצר באנגלית", "English product walkthrough"),
  };
}

function WhatsApp() {
  const { text, language, cine } = useCopy();
  const open = useOpenFilm();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--q1", clamp01((progress - 0.12) / 0.18).toFixed(3));
    node.style.setProperty("--q2", clamp01((progress - 0.32) / 0.18).toFixed(3));
    node.style.setProperty("--q3", clamp01((progress - 0.52) / 0.18).toFixed(3));
    node.style.setProperty("--wa-mask", lerpStops(progress, [0, 0.6], [46, 0]).toFixed(3));
  });
  const quotes = [
    [text("אמה וילסון", "Emma Wilson"), text("יום חמישי ב-10:00 נרשם ביומן.", "Thursday at 10:00 is booked, and added to the calendar.")],
    [text("סופיה מיטשל", "Sophia Mitchell"), text("בוקר יום חמישי מתאים. האם 10:00 נוח?", "Thursday morning works. Does 10:00 suit you?")],
    [text("אוליביה בנט", "Olivia Bennett"), text("ההצעה מוכנה לבדיקה.", "The proposal is ready whenever you want to review it.")],
  ];
  return (
    <section className="hx-chapter hx-wa" ref={ref} aria-labelledby="hx-wa-title">
      <div className="hx-chapter-pin">
        <div className="hx-wa-grid">
          <div>
            <h2 id="hx-wa-title">{cine.waTitle}</h2>
            <p className="hx-prose">{cine.waLead}</p>
            <p className="hx-prose">
              {text(
                "BizUply מאפשרת לעסקים לעבוד עם WhatsApp Business API ולשלב תקשורת לקוחות בתהליכים העסקיים שלהם. אפשר לנהל שיחות, לעבוד עם תבניות הודעה מאושרות ולחבר פעולות לתהליכים נוספים במערכת, בהתאם לתנאי השימוש ולהרשאות של Meta.",
                "BizUply lets a business work with the WhatsApp Business API and bring customer communication into its processes. Teams can manage conversations, use approved message templates, and connect actions to other workflows, within Meta’s terms and the permissions on the account.",
              )}
            </p>
            <ul className="hx-quotes">
              {quotes.map(([name, line]) => (
                <li className="hx-quote" key={name}>
                  {line}
                  <small>{name}</small>
                </li>
              ))}
            </ul>
            <ul className="hx-points hx-points-on-dark">
              <li>
                <h3>{text("תיבת שיחות עסקית", "A business inbox")}</h3>
                <p>{text("ניהול תקשורת לקוחות בסביבה המיועדת לעבודה עסקית.", "Customer conversations in a workspace meant for the business.")}</p>
              </li>
              <li>
                <h3>{text("תבניות הודעה", "Message templates")}</h3>
                <p>{text("שימוש בתבניות המאושרות על ידי Meta כאשר נדרשת פתיחת שיחה מחוץ לחלון השירות.", "Meta-approved templates when a conversation has to start outside the service window.")}</p>
              </li>
              <li>
                <h3>{text("חיבור לניהול לקוחות", "Connected to the customer record")}</h3>
                <p>{text("במקום ששיחה תישאר פעולה מנותקת, היא יכולה להפוך לחלק מתהליך העבודה של העסק.", "A conversation can stay part of the work, instead of a separate action.")}</p>
              </li>
            </ul>
            <div className="hx-actions">
              <Cta to="/whatsapp-api" tone="line">{text("להכיר את WhatsApp Business API", "Explore WhatsApp Business API")}</Cta>
              <DemoButton
                label={text("לראות איך זה עובד", "See how it works")}
                onClick={() => open(filmOf("whatsapp", "whatsapp", "/demo-media/whatsapp/poster.jpg", "WhatsApp", text("הקלטת תיבת ההודעות מתוך סביבת הדמו.", "A recording of the inbox from the demo workspace."), language, text))}
              />
            </div>
          </div>
          <div className="hx-wa-frame">
            <PhoneStory copy={cine} />
            <LocaleShot
              language={language}
              src="/demo-media/whatsapp/still-3.jpg"
              alt={text("שיחת WhatsApp של Northwind Studio בתוך BizUply", "A Northwind Studio WhatsApp conversation inside BizUply")}
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Campaigns() {
  const { text, language } = useCopy();
  const open = useOpenFilm();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--zoom", progress.toFixed(3));
  });
  const points = [
    [text("ניהול קמפיינים", "Campaign management"), text("עבודה עם קמפיינים של Facebook ו־Instagram מתוך המערכת, בהתאם לחשבון ולהרשאות המחוברות.", "Work with Facebook and Instagram campaigns from the workspace, according to the connected account and its permissions.")],
    [text("מעקב אחר פעילות", "Activity you can review"), text("צפייה במידע ובביצועים הזמינים דרך החיבור לחשבון המודעות.", "Review the information and performance available through the connected ads account.")],
    [text("חיבור לידים", "Leads stay in the workflow"), text("העברת פניות רלוונטיות להמשך טיפול בסביבת העבודה.", "Relevant enquiries can continue into the workspace for follow-up.")],
  ] as const;
  return (
    <section className="hx-chapter hx-camp" ref={ref} aria-labelledby="hx-camp-title">
      <div className="hx-chapter-pin">
        <div className="hx-camp-grid">
          <div className="hx-camp-copy">
            <h2 id="hx-camp-title">{text("הקמפיין מביא את הליד. עכשיו מתחילה העבודה החשובה.", "The campaign brings the lead. Then the important work begins.")}</h2>
            <p className="hx-prose">
              {text(
                "קמפיין ממומן לא מסתיים ברגע שמישהו לוחץ על מודעה או משאיר פרטים. הערך האמיתי מתחיל כאשר העסק יודע מה לעשות עם הפנייה. BizUply משלבת יכולות לניהול קמפיינים של Meta עם סביבת עבודה לניהול לידים, כדי לעזור לעסקים לחבר בין הפעילות השיווקית לבין הטיפול בלקוחות.",
                "A paid campaign does not end when someone clicks an ad or leaves their details. The useful part starts when the business knows what to do with that enquiry. BizUply connects Meta campaign tools with a lead workspace, so marketing activity and customer follow-up can stay related.",
              )}
            </p>
            <ul className="hx-points">
              {points.map(([title, body]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ul>
            <p className="hx-prose">
              {text(
                "לא מספיק לדעת כמה אנשים נחשפו למודעה. חשוב להבין מה קורה עם האנשים שבחרו לפנות לעסק.",
                "Reach is only part of the story. What matters next is what happens with the people who chose to get in touch.",
              )}
            </p>
            <div className="hx-actions">
              <Cta to="/meta-campaigns" tone="ink">{text("לגלות את ניהול הקמפיינים", "Explore campaign management")}</Cta>
              <DemoButton
                label={text("לצפות בהדגמה", "Watch the demo")}
                onClick={() => open(filmOf("campaigns", "campaigns", "/demo-media/campaigns/poster.jpg", text("קמפיינים", "Campaigns"), text("סיור מוצר של מסך הקמפיינים עם נתוני דמו.", "Product walkthrough of the campaigns screen with demo data."), language, text))}
              />
            </div>
          </div>
          <div className="hx-camp-visual">
            <div className="hx-camp-frame">
              <LocaleShot
                language={language}
                src="/demo-media/campaigns/still-chart.jpg"
                alt={text("מסך ניהול קמפיינים של Meta ב-BizUply עם נתוני ביצוע", "Meta campaign management inside BizUply with performance data")}
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Websites() {
  const { text, language, cine } = useCopy();
  const open = useOpenFilm();
  const ref = useRef<HTMLElement | null>(null);
  const bucket = useRef(0);
  const [step, setStep] = useState(0);
  const stages = [
    ["/demo-media/websites/my-sites.jpg", text("בחירת סוג האתר", "Choose the kind of site"), text("מתחילים מרשימת האתרים ובוחרים את סוג הנוכחות שמתאים לעסק.", "Start from the site list and choose the kind of presence the business needs.")],
    ["/demo-media/home/websites.jpg", text("עריכת התוכן והעיצוב", "Edit the content and the layout"), text("עורך Website Studio על עמוד אמיתי מתוך סביבת הדמו.", "The Website Studio editor on a real page from the demo workspace.")],
    ["/demo-media/websites/still-8.jpg", text("התאמת צבעים ומיתוג", "Adjust colors and branding"), text("שינוי המראה כך שהעמוד יתאים למותג, בלי לצאת מהעורך.", "Adjust the look so the page fits the brand, without leaving the editor.")],
    ["/demo-media/websites/still-14.jpg", text("תצוגה למחשב ולמובייל", "Preview on desktop and mobile"), text("בודקים את אותו עמוד בתצוגה, לפני שממשיכים לתוצאה.", "Review the same page in preview before moving on to the result.")],
    ["/demo-media/websites/poster.jpg", text("התוצאה הסופית", "The finished view"), text("התצוגה שאליה מגיעים אחרי העריכה. אתר טוב צריך להיות ברור, מהיר ונוח לשימוש.", "The view after editing. A good site should be clear, fast, and comfortable to use.")],
  ] as const;
  useScrollSpan(ref, (progress) => {
    const next = Math.min(stages.length - 1, Math.floor(clamp01(progress) * stages.length));
    if (next === bucket.current) return;
    bucket.current = next;
    setStep(next);
  });
  return (
    <section className="hx-chapter hx-sites" ref={ref} aria-labelledby="hx-sites-title">
      <div className="hx-chapter-pin hx-sites-pin">
        <div className="hx-sites-head">
          <div>
            <h2 id="hx-sites-title">{cine.sitesTitle}</h2>
          </div>
          <p>{cine.sitesLead}</p>
        </div>
        <div className="hx-sites-layout">
          <ol className="hx-site-steps">
            {stages.map((stage, index) => (
              <li key={stage[1]}>
                <button
                  type="button"
                  className={index === step ? "is-on" : undefined}
                  aria-current={index === step ? "step" : undefined}
                  onClick={() => {
                    bucket.current = index;
                    setStep(index);
                  }}
                >
                  <span>
                    <strong>{stage[1]}</strong>
                    <small>{stage[2]}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="hx-sites-visual">
            {stages.map((stage, index) => (
              <LocaleShot
                key={stage[0]}
                className={index === step ? "is-on" : undefined}
                language={language}
                src={stage[0]}
                alt={stage[1]}
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
        <div className="hx-actions hx-sites-actions">
          <Cta to="/website-builder" tone="ink">{text("לבניית אתרים", "Website builder")}</Cta>
          <DemoButton
            label={text("לצפות בהדגמת Website Studio", "Watch the Website Studio demo")}
            onClick={() => open(filmOf("websites", "websites", "/demo-media/websites/poster.jpg", text("אתרים", "Websites"), text("הקלטת מסך של בונה האתרים.", "A screen recording of the website builder."), language, text))}
          />
        </div>
      </div>
    </section>
  );
}

function Automations() {
  const { text, language } = useCopy();
  const ref = useRef<HTMLElement | null>(null);
  const litRef = useRef(0);
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(0);
  const steps = [
    {
      img: "/demo-media/forms/form.png",
      alt: text("טופס באתר שממנו פנייה יכולה להיכנס", "A website form an enquiry can come from"),
      title: text("לקוח פונה", "A customer gets in touch"),
      body: text("לקוח משאיר פרטים בטופס באתר או בדף נחיתה.", "A customer leaves details on a website form or a landing page."),
    },
    {
      img: "/demo-media/crm/leads-list.png",
      alt: text("רשימת הלידים שאליה הפנייה נכנסת", "The lead list the enquiry enters"),
      title: text("הפנייה נכנסת למערכת", "The enquiry enters the system"),
      body: text("נוצרת רשומה שמאפשרת להמשיך את הטיפול.", "A record is created so the follow-up can continue."),
    },
    {
      img: "/demo-media/crm/lead-task.png",
      alt: text("משימת המשך על כרטיס ליד", "A follow-up task on a lead record"),
      title: text("נוצרת פעולה להמשך", "A next action is created"),
      body: text("אפשר להגדיר משימה או פעולה בהתאם לתהליך העסקי.", "A task or action can be defined for the business process."),
    },
    {
      img: "/demo-media/whatsapp/still-3.jpg",
      alt: text("שיחת WhatsApp בסביבת העבודה", "A WhatsApp conversation in the workspace"),
      title: text("הלקוח מקבל מענה", "The customer can receive a reply"),
      body: text(
        "כאשר מוגדרת אוטומציית הודעות תקינה וקיימות ההרשאות הנדרשות, אפשר לשלוח הודעה מתאימה.",
        "When a valid message automation is set up and the required permissions exist, a suitable message can be sent.",
      ),
    },
    {
      img: "/demo-media/home/automations.jpg",
      alt: text("רשימת האוטומציות של Northwind Studio", "The Northwind Studio automation list"),
      title: text("ממשיכים לעקוב", "The team keeps following up"),
      body: text("הצוות יכול לראות את מצב הטיפול ולבצע את הפעולה הבאה.", "The team can see the status of the work and take the next action."),
    },
  ];
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--draw", progress.toFixed(3));
    const next = Math.min(steps.length - 1, Math.max(0, Math.ceil(progress * steps.length) - 1));
    if (next === litRef.current) return;
    litRef.current = next;
    setLit(next);
    setActive(next);
  }, "pass");
  const shown = steps[active];
  return (
    <section className="hx-auto" ref={ref} aria-labelledby="hx-auto-title">
      <div className="hx-auto-top">
        <div className="hx-auto-wrap">
          <h2 id="hx-auto-title">{text("פחות פעולות שחוזרות על עצמן. יותר זמן לנהל את העסק.", "Fewer repeated actions. More time to run the business.")}</h2>
          <p className="hx-prose">
            {text(
              "לא כל פעולה בעסק צריכה להתבצע ידנית. כאשר לקוח משאיר פרטים, כאשר נוצר ליד חדש או כאשר מגיע הזמן להמשיך טיפול — אפשר להגדיר תהליכים שעוזרים לצוות לעבוד בצורה מסודרת יותר. האוטומציות של BizUply מחברות בין אירועים לפעולות מוגדרות, בהתאם ליכולות ולחיבורים הפעילים בחשבון.",
              "Not every action in a business has to be done by hand. When a customer leaves details, a new lead arrives, or it is time to follow up, a defined process can help the team work in a more orderly way. BizUply automations connect events to defined actions, within the features and connections that are active on the account.",
            )}
          </p>
          <ol className="hx-chain">
            {steps.map((step, index) => (
              <li key={step.title}>
                <button
                  type="button"
                  className={`hx-node${index <= lit ? " is-on" : ""}${index === active ? " is-active" : ""}`}
                  aria-expanded={index === active}
                  onClick={() => setActive(index)}
                >
                  <span>{step.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="hx-auto-detail">
        <div className="hx-auto-wrap hx-auto-detail-grid">
          <div>
            <h3>{shown.title}</h3>
            <p>{shown.body}</p>
            <p>
              {text(
                "אוטומציה טובה לא מחליפה את הקשר האישי עם הלקוח. היא עוזרת לפנות זמן לקשר הזה.",
                "A good automation does not replace a personal conversation. It frees time for that conversation.",
              )}
            </p>
            <div className="hx-actions">
              <Cta to="/automations" tone="ink">{text("לגלות את האוטומציות", "Explore automations")}</Cta>
            </div>
          </div>
          <div className="hx-step">
            <LocaleShot language={language} src={shown.img} alt={shown.alt} width={1600} height={1000} decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReadySystems() {
  const { text, dir, language } = useCopy();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const reduced = useReduced();
  useEffect(() => {
    const stage = stageRef.current;
    const view = railRef.current;
    const rail = view?.querySelector<HTMLElement>(".hx-rail");
    if (!stage || !view || !rail) return undefined;
    const measure = () => {
      const narrow = window.matchMedia("(max-width: 900px)").matches;
      if (narrow || reduced) {
        stage.style.height = "";
        stage.style.setProperty("--rail-x", "0px");
        return;
      }
      const travel = Math.max(0, rail.scrollWidth - view.clientWidth);
      const pin = stage.querySelector<HTMLElement>(".hx-saas-pin");
      const pinHeight = pin?.getBoundingClientRect().height || window.innerHeight;
      stage.style.height = `${Math.ceil(pinHeight + travel)}px`;
    };
    measure();
    rail.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduced]);
  useEffect(() => {
    const node = railRef.current;
    if (!node) return undefined;
    const update = () => {
      const slides = [...node.querySelectorAll(".hx-slide")];
      const origin = node.getBoundingClientRect().left;
      let nearest = 0;
      let best = Number.POSITIVE_INFINITY;
      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - origin);
        if (distance < best) {
          best = distance;
          nearest = index;
        }
      });
      setSlideIndex((current) => (current === nearest ? current : nearest));
    };
    update();
    node.addEventListener("scroll", update, { passive: true });
    return () => node.removeEventListener("scroll", update);
  }, []);
  useScrollSpan(stageRef, (progress) => {
    const view = railRef.current;
    const rail = view?.querySelector<HTMLElement>(".hx-rail");
    const stage = stageRef.current;
    if (!view || !rail || !stage) return;
    const travel = Math.max(0, rail.scrollWidth - view.clientWidth);
    view.scrollLeft = progress * travel;
    const slides = [...view.querySelectorAll(".hx-slide")];
    const origin = view.getBoundingClientRect().left;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - origin);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setSlideIndex((current) => (current === nearest ? current : nearest));
  });
  const slides = [
    ["/template-screenshots/studiora.webp", text("סטודיו", "Studio"), "hx-crop-studio"],
    ["/template-screenshots/vitalcare.webp", text("קליניקה", "Clinic"), "hx-crop-leads"],
    ["/template-screenshots/wantravel.webp", text("תיירות", "Travel"), "hx-crop-campaigns"],
    ["/demo-media/home/appointments.jpg", text("יומן פגישות", "Appointments"), "hx-crop-record"],
    ["/template-screenshots/summitops.webp", text("שירותים", "Services"), "hx-crop-auto"],
    ["/template-screenshots/serenova.webp", text("אירוח", "Hospitality"), "hx-crop-chat"],
    ["/template-screenshots/soleora.webp", text("מותג", "Brand"), "hx-crop-studio"],
  ] as const;
  return (
    <section className="hx-chapter hx-saas" aria-labelledby="hx-saas-title">
      <div className="hx-saas-head">
          <h2 id="hx-saas-title">{text("רוצים להקים עסק דיגיטלי? לא תמיד חייבים להתחיל מאפס.", "Want to launch a digital business? You do not always have to start from a blank page.")}</h2>
          <p className="hx-prose">
            {text(
              "BizUply מפתחת מערכות SaaS מוכנות לעסקים וליזמים. בקטלוג רואים מה זמין, מה בהכנה, ומה אפשר להתאים.",
              "BizUply builds ready SaaS systems for businesses and founders. The catalog shows what is available, what is in preparation, and what can be adapted.",
            )}
          </p>
          <ul className="hx-saas-links">
            {[
              ["/saas/beautyflow", "BeautyFlow", text("יופי וטיפוח", "Beauty and care")],
              ["/saas/global-properties", "Global Properties", text("נדל״ן", "Real estate")],
              ["/saas/dinevo", "Dinevo", text("מסעדנות", "Restaurants")],
              ["/saas/tableflow", "TableFlow", text("אירוח ומסעדות", "Hospitality and restaurants")],
              ["/saas/cliny", "Cliny", text("מרפאות ושירותים", "Clinics and services")],
            ].map(([to, name, note]) => (
              <li key={to}>
                <Link to={to}><strong>{name}</strong><span>{note}</span></Link>
              </li>
            ))}
          </ul>
          <div className="hx-actions">
            <Cta to="/saas" tone="ink">{text("לגלות את מערכות ה־SaaS", "Explore the SaaS systems")}</Cta>
            <Cta to="/contact">{text("לדבר איתנו על המערכת שלכם", "Talk with us about your system")}</Cta>
          </div>
      </div>
      <div className="hx-saas-stage" ref={stageRef}>
        <div className="hx-saas-pin">
        <div className="hx-rail-viewport" ref={railRef}>
          <div className="hx-rail" dir="ltr">
            {slides.map(([src, label, crop]) => (
              <figure className="hx-slide" key={src}>
                <div className="hx-slide-frame">
                  <LocaleShot language={language} src={src} alt={label} width={1200} height={800} loading="eager" decoding="async" className={crop} forceStill />
                </div>
                <figcaption dir={dir}>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
          <div className="hx-rail-dots">
            {slides.map(([, label], index) => (
              <button
                key={label}
                type="button"
                className={index === slideIndex ? "is-on" : undefined}
                aria-label={label}
                aria-current={index === slideIndex ? "true" : undefined}
                onClick={() => {
                  const slide = railRef.current?.querySelectorAll(".hx-slide")[index];
                  slide?.scrollIntoView({ inline: "start", block: "nearest", behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewFilm({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduced = useReduced();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void node.play().catch(() => {});
      else node.pause();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, src]);
  return <video ref={ref} src={src} poster={poster} muted playsInline loop preload="none" />;
}

function Films() {
  const { text, language } = useCopy();
  const open = useOpenFilm();
  const films = [
    ["crm", "crm", "CRM", text("לידים → כרטיס → משימה", "Leads → record → task"), text("סיור מוצר: רשימת לידים, כרטיס לקוח ומשימת המשך.", "Product walkthrough: lead list, customer record, and follow-up task.")],
    ["whatsapp", "whatsapp", "WhatsApp", "WhatsApp", text("סיור מוצר: תיבת שיחות עסקית.", "Product walkthrough: business inbox.")],
    ["campaigns", "campaigns", text("קמפיינים", "Campaigns"), text("קמפיינים", "Campaigns"), text("סיור מוצר: ביצועי קמפיין Meta וטיפול בליד.", "Product walkthrough: Meta campaign performance and lead follow-up.")],
    ["websites", "websites", text("אתרים", "Websites"), text("Website Studio", "Website Studio"), text("סיור מוצר: רשימת אתרים, עורך ותצוגה.", "Product walkthrough: site list, editor, and preview.")],
    ["automations", "automations", text("אוטומציות", "Automations"), text("אוטומציות", "Automations"), text("סיור מוצר: מאירוע עסקי לפעולה מוגדרת.", "Product walkthrough: from a business event to a defined action.")],
  ] as const;
  return (
    <section className="hx-films" aria-labelledby="hx-films-title">
      <div className="hx-films-head">
        <h2 id="hx-films-title">{text("המערכת בתנועה.", "The product, in motion.")}</h2>
      </div>
      <div className="hx-film-layout">
        <button
          type="button"
          className="hx-film-lead text-inherit"
          onClick={() => open(filmOf(films[0][0], films[0][1], "", films[0][2], films[0][4], language, text))}
        >
          <PreviewFilm src={`/demo-media/${films[0][0]}/${films[0][0]}-en-product.mp4`} poster={`/demo-media/${films[0][0]}/poster-product.jpg`} />
          <span>{films[0][3]}</span>
        </button>
        <div className="hx-film-side">
          {films.slice(1).map((film) => (
            <button
              type="button"
              className="text-inherit"
              key={film[0]}
              onClick={() => open(filmOf(film[0], film[1], "", film[2], film[4], language, text))}
            >
              <img src={`/demo-media/${film[0]}/poster-product.jpg`} alt="" width={800} height={500} loading="lazy" decoding="async" />
              <span>{film[3]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Connect() {
  const { text } = useCopy();
  const points = [
    [text("מהפנייה הראשונה", "From the first enquiry"), text("קמפיינים, אתרים וטפסים שמסייעים ליצור נקודת קשר עם לקוחות פוטנציאליים.", "Campaigns, websites, and forms that give potential customers a way to get in touch.")],
    [text("דרך תהליך המכירה", "Through the sales process"), text("ניהול לידים, מעקב, משימות ותקשורת עם לקוחות.", "Lead management, follow-up, tasks, and customer communication.")],
    [text("ועד להמשך הקשר", "And into the ongoing relationship"), text("כלים שמסייעים לעסק לשמור על סדר בתקשורת ובתהליכי העבודה.", "Tools that help the business keep communication and daily work in order.")],
  ] as const;
  return (
    <section className="hx-connect" aria-labelledby="hx-connect-title">
      <div className="hx-depth-wrap">
        <h2 id="hx-connect-title">{text("מערכת אחת. פחות מעברים. יותר שליטה.", "One system. Fewer handoffs. More control.")}</h2>
        <p className="hx-prose">
          {text(
            "לקוח רואה קמפיין, נכנס לאתר ומשאיר פרטים. הפנייה מגיעה ל־CRM, הצוות יכול לראות אותה ולהתחיל לטפל בה, והתקשורת עם הלקוח יכולה להמשיך בערוצים המחוברים לעסק. במקום לעבוד עם מידע מפוזר, אפשר לנהל את הפעילות מתוך סביבה מרכזית.",
            "A customer sees a campaign, opens the website, and leaves details. The enquiry reaches the CRM, the team can see it and start working on it, and the conversation can continue on the channels connected to the business. The work stays in one environment instead of being scattered.",
          )}
        </p>
        <ul className="hx-points">
          {points.map(([title, body]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
        <p className="hx-prose">{text("BizUply מחברת בין הכלים שהעסק צריך כדי לעבוד בצורה מסודרת יותר.", "BizUply connects the tools a business needs in order to work in a more orderly way.")}</p>
      </div>
    </section>
  );
}

function Audiences() {
  const { text } = useCopy();
  const rows = [
    ["/solutions/service-businesses", text("עסקים קטנים", "Small businesses"), text("שרוצים לרכז לידים, לקוחות ומשימות בסביבה פשוטה יותר לניהול.", "Teams that want leads, customers, and tasks in a simpler place to manage.")],
    ["/solutions", text("עסקים צומחים", "Growing businesses"), text("שצריכים תהליכי עבודה מסודרים ושיתוף פעולה בין אנשי צוות.", "Businesses that need orderly processes and a way for the team to work together.")],
    ["/solutions/service-businesses", text("נותני שירותים", "Service providers"), text("שרוצים לנהל פניות, תקשורת לקוחות ותהליכי המשך.", "People who want to manage enquiries, customer communication, and follow-up.")],
    ["/solutions/agencies", text("סוכנויות שיווק", "Marketing agencies"), text("שמחפשות לחבר בין פעילות קמפיינים לבין ניהול הפניות.", "Teams that want campaign activity and enquiry handling to stay connected.")],
    ["/saas", text("יזמים", "Founders"), text("שמעוניינים לבדוק אפשרויות להקמת מוצר תוכנה או מערכת SaaS.", "People exploring a software product or a SaaS system of their own.")],
  ] as const;
  const industries = [
    ["/solutions/clinics", text("קליניקות", "Clinics")],
    ["/solutions/beauty", text("מכוני יופי", "Beauty")],
    ["/solutions/real-estate", text("נדל״ן", "Real estate")],
    ["/solutions/restaurants", text("מסעדות", "Restaurants")],
    ["/solutions/lead-based", text("עסקים מבוססי לידים", "Lead-based businesses")],
  ] as const;
  return (
    <section className="hx-who" aria-labelledby="hx-who-title">
      <div className="hx-who-wrap">
        <h2 id="hx-who-title">{text("הכלים הנכונים לעסק שלך, בשלב שבו הוא נמצא.", "The right tools for the stage your business is in.")}</h2>
        <ul className="hx-points">
          {rows.map(([to, title, body]) => (
            <li key={title}>
              <h3><Link to={to}>{title}</Link></h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
        <ul className="hx-aud">
          {industries.map(([to, label]) => (
            <li key={to}>
              <Link to={to}>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const { text, cine } = useCopy();
  const items = cine.faq;
  return (
    <section className="hx-faq" aria-labelledby="hx-faq-title">
      <div className="hx-faq-split">
        <div className="hx-faq-intro">
          <h2 id="hx-faq-title">{cine.faqTitle}</h2>
          <div className="hx-actions">
            <Cta to="/faq">{text("לכל השאלות", "All questions")}</Cta>
            <Cta to="/pricing" tone="line">{text("למחירים", "Pricing")}</Cta>
          </div>
        </div>
        <div className="hx-faq-list">
          {items.map(([question, answer]) => (
            <details key={question}>
              <summary>
                <h3>{question}</h3>
              </summary>
              <div>
                <p>{answer}</p>
              </div>
            </details>
          ))}
          <nav className="hx-faq-links" aria-label={text("עמודים קשורים", "Related pages")}>
            <Link to="/website-scan">{text("סריקת אתר", "Website scan")}</Link>
            <Link to="/crm">CRM</Link>
            <Link to="/whatsapp-api">WhatsApp</Link>
            <Link to="/automations">{text("אוטומציות", "Automations")}</Link>
            <Link to="/meta-campaigns">{text("קמפיינים", "Campaigns")}</Link>
            <Link to="/website-builder">{text("בניית אתרים", "Website builder")}</Link>
            <Link to="/pricing">{text("מחירים", "Pricing")}</Link>
            <Link to="/guides">{text("מדריכים", "Guides")}</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

function Close() {
  const { text, language, cine } = useCopy();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--join", progress.toFixed(3));
  }, "pass");
  const products = ["CRM", "WhatsApp", text("קמפיינים", "Campaigns"), text("אתרים", "Websites")];
  return (
    <section className="hx-close" ref={ref} aria-labelledby="hx-close-title">
      <div className="hx-close-a">
        <h2 id="hx-close-title">{cine.endTitle}</h2>
        <p className="hx-prose">{cine.endLead}</p>
        <ul className="hx-orbit" aria-hidden="true">
          {products.map((name) => <li key={name}>{name}</li>)}
        </ul>
      </div>
      <div className="hx-close-b">
        <h3>{text("שלוש סיבות להתחיל", "Three reasons to start")}</h3>
        <ol className="hx-reasons">
          <li>{text("מערכת אחת במקום כלים מפוזרים.", "One system instead of scattered tools.")}</li>
          <li>{text("מהפנייה הראשונה ועד המשך הטיפול.", "From the first enquiry through the follow-up.")}</li>
          <li>{text("מתחילים במסלול שמתאים לשלב של העסק.", "Start with the plan that fits the stage of the business.")}</li>
        </ol>
        <LocaleShot
          language={language}
          src="/demo-media/home/crm.jpg"
          alt={text("רשימת לידים בתוך BizUply", "A lead list inside BizUply")}
          width={960}
          height={600}
          loading="lazy"
          decoding="async"
        />
        <div className="hx-actions">
          <Cta to="/register" tone="ink">{cine.endPrimary}</Cta>
          <Cta to="#products">{cine.endSecondary}</Cta>
          <Cta to="/contact">{text("דברו איתנו", "Talk with us")}</Cta>
        </div>
      </div>
    </section>
  );
}
