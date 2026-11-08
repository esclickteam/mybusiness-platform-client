import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { useOpenFilm, type Film } from "./film";
import {
  AppointmentsBand,
  ConnectedFlow,
  GrowthBand,
  OrbitBand,
  useCinematic,
} from "./HomeCinematic";
import { HomeAi, HomeJourney, HomeSiteGallery, HomeTrust } from "./HomePremiumBands";
import { HeroProductStage, WhatsAppFlowStage } from "./B2ProductStage";
import { CampaignPulse, CrmCard, InboxPane, LeadBoard, PipelineStrip, WaPhone } from "./ProductMocks";
import { homeText } from "./homeCopy";

function useCopy() {
  const { i18n, t } = useTranslation();
  const he = i18n.language.startsWith("he");
  const text = (hebrew: string, english: string) => homeText(i18n.language, hebrew, english);
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

function useReveal() {
  const reduced = useReduced();
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>(".hx-reveal")];
    if (!nodes.length) return undefined;
    if (reduced) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reduced]);
}

export default function HomeExperienceSections() {
  const { text } = useCopy();
  useReveal();
  return (
    <>
      <a className="hx-skip" href="#hx-connect">{text("דילוג לתוכן", "Skip to content")}</a>
      <main>
      <Hero />
      <Why />
      <ProductShowcase />
      <WhatsApp />
      <HomeSiteGallery />
      <HomeAi />
      <Automations />
      <Campaigns />
      <ReadySystems />
      <HomeTrust />
      <Faq />
      <Close />
      </main>
    </>
  );
}

function Hero() {
  const { text, language, cine } = useCopy();
  const reduced = useReduced();
  const open = useOpenFilm();
  const hero = cine.hero;
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--hp", progress.toFixed(3));
  });
  const lineOne = hero.lineOne;
  const lineTwo = hero.lineTwo;
  const lineThree = hero.lineThree || "";
  const hot = Math.max(0, (lineThree || lineTwo).trim().split(/\s+/).length - 1);

  return (
    <section className="hx-hero hx-hero-b2" ref={ref} aria-labelledby="hx-hero-title">
      <div className="hx-hero-pin">
        <div className="hx-hero-core">
          <div className="hx-hero-copy">
            <p className="hx-hero-brand">BizUply</p>
            <h1 className="hx-display" id="hx-hero-title">
              <Words text={lineOne} />
              <Words text={lineTwo} delay={180} />
              {lineThree ? <Words text={lineThree} hot={hot} delay={360} /> : null}
            </h1>
            <p className="hx-lead">
              {text(
                "ליד נכנס, השיחה ממשיכה ב־WhatsApp, והצעד הבא נוצר אוטומטית — באותה מערכת.",
                "A lead arrives, the conversation continues on WhatsApp, and the next step is created automatically — in one system.",
              )}
            </p>
            <div className="hx-actions">
              <Cta to="/register">{hero.start}</Cta>
              <Cta to="#whatsapp" tone="line">{hero.see}</Cta>
            </div>
            <p className="hx-hero-proof">
              {text("הדגמה עם נתוני דמו · לא נתוני לקוחות אמיתיים", "Demo with sample data · not real customer data")}
            </p>
          </div>
          <div className="hx-hero-stage" aria-label={hero.stageAlt}>
            {/* Keep first-paint asset present for hydration/SEO continuity */}
            <img
              className="hx-hero-shot hx-hero-shot-1"
              src="/demo-media/home/crm.jpg"
              alt=""
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
              hidden
            />
            <HeroProductStage
              text={text}
              label={hero.stageAlt}
              onWatchDemo={() => {
                open({
                  src: `/demo-media/home/walkthrough/process-full.mp4?v=9`,
                  poster: "/demo-media/home/walkthrough/process-full.jpg?v=9",
                  title: text("הדגמת התהליך המרכזי", "Core process demo"),
                  caption: text(
                    "ליד חדש → כרטיס CRM → WhatsApp → אוטומציה → משימת מעקב. הקלטה נקייה מסביבת הדמו.",
                    "New lead → CRM record → WhatsApp → automation → follow-up task. Clean recording from the demo workspace.",
                  ),
                  tag: text("הקלטת מסך · נתוני דמו", "Screen recording · demo data"),
                });
              }}
            />
          </div>
        </div>
        <a className={`hx-scroll-cue${reduced ? " is-still" : ""}`} href="#hx-connect">
          <span>{hero.scroll}</span>
          <i aria-hidden="true" />
        </a>
      </div>
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
      key: "crm",
      title: text("CRM וניהול לקוחות", "CRM and customers"),
      body: text("רשימת לידים, כרטיס לקוח ומשימת המשך — במסך אחד.", "Lead list, customer record, and follow-up task — on one stage."),
      img: "/demo-media/crm/leads-list.png",
      crop: "hx-crop-leads",
      tab: text("CRM", "CRM"),
      href: "/crm",
      film: "crm" as const | null,
      status: text("זמין", "Available"),
      benefits: [
        text("ניהול לידים וסטטוסים", "Lead and status management"),
        text("כרטיס לקוח מרוכז", "A single customer record"),
        text("משימות המשך", "Follow-up tasks"),
      ],
      caption: text("סיור מוצר: לידים → כרטיס לקוח → משימה.", "Product walkthrough: leads → customer record → task."),
    },
    {
      key: "whatsapp",
      title: "WhatsApp Business",
      body: text("תיבת שיחות עסקית שממשיכה את אותו לקוח מה־CRM.", "A business inbox that continues the same customer from the CRM."),
      img: "/demo-media/whatsapp/still-3.jpg",
      crop: "hx-crop-chat",
      tab: "WhatsApp",
      href: "/whatsapp-api",
      film: "whatsapp" as const | null,
      status: text("זמין", "Available"),
      benefits: [
        text("תיבת שיחות עסקית", "Business inbox"),
        text("תבניות מאושרות של Meta", "Meta-approved templates"),
        text("חיבור לכרטיס הלקוח", "Tied to the customer record"),
      ],
      caption: text("סיור מוצר: תיבת שיחות עסקית.", "Product walkthrough: business inbox."),
    },
    {
      key: "automations",
      title: text("אוטומציות", "Automations"),
      body: text("פנייה נכנסת → רשומה → פעולה להמשך — בלי לעבוד ידנית בכל שלב.", "An enquiry arrives → a record → a next action — without doing every step by hand."),
      img: "/demo-media/home/automations.jpg",
      crop: "hx-crop-auto",
      tab: text("אוטומציות", "Automations"),
      href: "/automations",
      film: "automations" as const | null,
      status: text("זמין בתוכנית העסקית", "Available on the business plan"),
      benefits: [
        text("מאירוע לפעולה", "From event to action"),
        text("משימות והודעות", "Tasks and messages"),
        text("שמירה על הקשר ב־CRM", "Context stays in the CRM"),
      ],
      caption: text("סיור מוצר: מאירוע עסקי לפעולה מוגדרת.", "Product walkthrough: from a business event to a defined action."),
    },
    {
      key: "websites",
      title: text("בניית אתרים וחנויות", "Websites and stores"),
      body: text("עריכת אתר — והשינוי נראה מיד בתצוגה.", "Site editing — and the change shows up in preview."),
      img: "/demo-media/home/websites.jpg",
      crop: "hx-crop-studio",
      tab: text("אתרים", "Sites"),
      href: "/website-builder",
      film: "websites" as const | null,
      status: text("זמין", "Available"),
      benefits: [
        text("עורך ויזואלי", "Visual editor"),
        text("תצוגת Desktop ו־Mobile", "Desktop and mobile preview"),
        text("טפסים שמזינים את ה־CRM", "Forms that feed the CRM"),
      ],
      caption: text("סיור מוצר: רשימת אתרים → עורך → תצוגה.", "Product walkthrough: site list → editor → preview."),
    },
    {
      key: "campaigns",
      title: text("קמפיינים ושיווק", "Campaigns and marketing"),
      body: text("קמפיין Meta עם נתוני ביצוע — והטיפול בליד ממשיך במערכת.", "A Meta campaign with performance data — then lead follow-up continues in the system."),
      img: "/demo-media/campaigns/still-chart.jpg",
      crop: "hx-crop-campaigns",
      tab: text("קמפיינים", "Campaigns"),
      href: "/meta-campaigns",
      film: "campaigns" as const | null,
      status: text("זמין עם חשבון Meta מחובר", "Available with a connected Meta account"),
      benefits: [
        text("ניהול קמפיינים", "Campaign management"),
        text("מעקב ביצועים", "Performance review"),
        text("לידים ממשיכים ב־CRM", "Leads continue in the CRM"),
      ],
      caption: text("סיור מוצר: ביצועי קמפיין וטיפול בליד.", "Product walkthrough: campaign performance and lead follow-up."),
    },
    {
      key: "ai",
      title: text("בינה מלאכותית", "Artificial intelligence"),
      body: text(
        "כלי עזר מבוססי AI בתוך Website Studio — רק במקומות שהמוצר כבר תומך בהם.",
        "AI-assisted tools inside Website Studio — only where the shipped product already supports them.",
      ),
      img: "/images/about/shot-editor.webp",
      crop: "hx-crop-studio",
      tab: text("AI", "AI"),
      href: "/website-builder",
      film: null,
      status: text("זמין בתוך Website Studio", "Available inside Website Studio"),
      benefits: [
        text("בלוקים ועוזרים בעורך", "Blocks and assistants in the editor"),
        text("בלי הבטחות ניסיוניות", "No experimental overclaims"),
        text("נציגים אנושיים נשארים נפרדים", "Human agents stay a separate product"),
      ],
      caption: text("יכולות AI בתוך בונה האתרים.", "AI capabilities inside the website builder."),
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
            <span>{current.body}</span>
          </p>
          <p className="hx-show-status">{current.status}</p>
          <ul className="hx-show-benefits">
            {current.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <div className="hx-actions hx-show-actions">
            <Cta to={current.href} tone="ink">{text("לעמוד המוצר", "Product page")}</Cta>
            {current.film ? (
              <DemoButton
                label={cine.hero.watch}
                onClick={() => {
                  const film = current.film;
                  if (!film) return;
                  open(filmOf(film, film, "", current.title, current.caption, language, text));
                }}
              />
            ) : null}
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
                <div className={`hx-show-frame${product.key === "crm" || product.key === "whatsapp" || product.key === "campaigns" ? " is-mock" : ""}`}>
                  {product.key === "crm" ? (
                    <LeadBoard text={text} />
                  ) : product.key === "whatsapp" ? (
                    <div className="hx-show-mock-wa">
                      <WaPhone text={text} />
                      <InboxPane text={text} />
                    </div>
                  ) : product.key === "campaigns" ? (
                    <CampaignPulse text={text} />
                  ) : (
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
                  )}
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
    [text("לידים במקום אחד", "Leads in one place"), text("רואים מי פנה, מאיפה הגיע ומה הסטטוס — בלי לחפש בין כלים.", "See who got in touch, where they came from, and the status — without hunting across tools.")],
    [text("כרטיס לקוח ברור", "A clear customer record"), text("הפרטים שצריך כדי להמשיך טיפול נשארים ברשומה אחת.", "The details needed for follow-up stay on one record.")],
    [text("הצעד הבא מוכן", "The next step is ready"), text("משימת המשך נפתחת ליד אותו לקוח, כדי שהצוות יידע מה לעשות עכשיו.", "A follow-up task sits with the same customer, so the team knows what to do next.")],
  ] as const;
  return (
    <section className="hx-depth hx-reveal" id="crm" aria-labelledby="hx-crm-title">
      <div className="hx-depth-wrap">
        <div>
          <h2 id="hx-crm-title">{cine.crmTitle}</h2>
          <p className="hx-prose">{cine.crmLead}</p>
          <div className="hx-actions">
            <Cta to="/crm" tone="ink">{text("לעמוד ה־CRM", "CRM page")}</Cta>
            <DemoButton
              label={text("לצפות בהדגמה", "Watch the demo")}
              onClick={() => open(filmOf("crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("לידים → כרטיס לקוח → משימת המשך.", "Leads → customer record → follow-up task."), language, text))}
            />
          </div>
        </div>
        <div className="hx-crm-stage hx-crm-stage-focus">
          <div className="hx-crm-live">
            <LeadBoard text={text} />
            <CrmCard text={text} />
            <div className="hx-crm-demo" aria-hidden="true">
              <PreviewFilm src="/demo-media/home/crm.mp4" poster="/demo-media/home/crm.jpg" />
            </div>
          </div>
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
  const [active, setActive] = useState(false);
  useScrollSpan(ref, (progress) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--q1", clamp01((progress - 0.08) / 0.2).toFixed(3));
    node.style.setProperty("--q2", clamp01((progress - 0.28) / 0.2).toFixed(3));
    node.style.setProperty("--q3", clamp01((progress - 0.48) / 0.2).toFixed(3));
    if (progress > 0.2) setActive(true);
  });
  return (
    <section className={`hx-chapter hx-wa hx-wa-b2 hx-reveal${active ? " is-live" : ""}`} id="whatsapp" ref={ref} aria-labelledby="hx-wa-title">
      <div className="hx-chapter-pin">
        <div className="hx-wa-grid">
          <div>
            <p className="hx-eyebrow">{text("WhatsApp Business API", "WhatsApp Business API")}</p>
            <h2 id="hx-wa-title">{cine.waTitle}</h2>
            <p className="hx-prose">{cine.waLead}</p>
            <ul className="hx-points">
              <li>
                <h3>{text("הודעה נכנסת", "Incoming message")}</h3>
                <p>{text("השיחה נפתחת בתיבה העסקית עם טקסט קריא בעברית.", "The chat opens in the business inbox with readable Hebrew text.")}</p>
              </li>
              <li>
                <h3>{text("איש קשר ב־CRM", "CRM contact")}</h3>
                <p>{text("אותה פנייה יוצרת או מעדכנת כרטיס לקוח עם סטטוס.", "The same enquiry creates or updates a customer record with status.")}</p>
              </li>
              <li>
                <h3>{text("אוטומציה להמשך", "Follow-up automation")}</h3>
                <p>{text("תהליך מוגדר במערכת יוצר משימת המשך — בלי להמציא יכולות שלא קיימות.", "A defined system flow creates a follow-up task — only shipped capabilities.")}</p>
              </li>
            </ul>
            <div className="hx-actions">
              <Cta to="/whatsapp-api" tone="ink">{text("לעמוד WhatsApp", "WhatsApp page")}</Cta>
              <DemoButton
                label={text("לראות איך זה עובד", "See how it works")}
                onClick={() =>
                  open({
                    src: "/demo-media/home/walkthrough/hero-03-whatsapp.mp4?v=9",
                    poster: "/demo-media/home/walkthrough/hero-03-whatsapp.jpg?v=9",
                    title: text("תיבת WhatsApp", "WhatsApp inbox"),
                    caption: text(
                      "הקלטת תיבת ההודעות מסביבת הדמו — לחיצות ותנועת עכבר אמיתיות.",
                      "Inbox recording from the demo workspace — real clicks and mouse movement.",
                    ),
                    tag: text("הקלטת מסך · נתוני דמו", "Screen recording · demo data"),
                  })
                }
              />
            </div>
          </div>
          <WhatsAppFlowStage
            text={text}
            onWatchDemo={(step) => {
              const map = {
                message: {
                  src: "/demo-media/home/walkthrough/hero-03-whatsapp.mp4?v=9",
                  poster: "/demo-media/home/walkthrough/hero-03-whatsapp.jpg?v=9",
                },
                crm: {
                  src: "/demo-media/home/walkthrough/hero-02-crm.mp4?v=9",
                  poster: "/demo-media/home/walkthrough/hero-02-crm.jpg?v=9",
                },
                auto: {
                  src: "/demo-media/home/walkthrough/hero-04-automation.mp4?v=9",
                  poster: "/demo-media/home/walkthrough/hero-04-automation.jpg?v=9",
                },
              } as const;
              const film = map[step];
              open({
                src: film.src,
                poster: film.poster,
                title: text("הדגמת WhatsApp", "WhatsApp demo"),
                caption: text(
                  "הקלטת מסך נקייה מסביבת הדמו — הודעה, CRM ואוטומציה.",
                  "Clean screen recording from the demo workspace — message, CRM, and automation.",
                ),
                tag: text("הקלטת מסך · נתוני דמו", "Screen recording · demo data"),
              });
            }}
          />
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
    [text("אחרי הקליק", "After the click"), text("הפנייה נכנסת להמשך טיפול, לא נשארת רק בדוח המודעה.", "The enquiry continues into follow-up — not only in the ad report.")],
    [text("ביצועים במבט אחד", "Performance at a glance"), text("רואים את מה שזמין דרך חשבון המודעות המחובר.", "Review what the connected ads account makes available.")],
    [text("ליד שממשיך ב־CRM", "A lead that continues in CRM"), text("אותה פנייה מקבלת סטטוס וצעד הבא בסביבת העבודה.", "The same enquiry gets a status and a next step in the workspace.")],
  ] as const;
  return (
    <section className="hx-chapter hx-camp" id="campaigns" ref={ref} aria-labelledby="hx-camp-title">
      <div className="hx-chapter-pin">
        <div className="hx-camp-grid">
          <div className="hx-camp-copy">
            <h2 id="hx-camp-title">{text("המודעה הביאה פנייה. עכשיו אפשר לטפל בה.", "The ad brought an enquiry. Now you can handle it.")}</h2>
            <p className="hx-prose">
              {text(
                "קמפיין Meta שווה יותר כשהליד ממשיך לעבודה אמיתית: סטטוס, משימה והמשך טיפול — באותה מערכת.",
                "A Meta campaign is more useful when the lead becomes real work: a status, a task, and follow-up — in the same system.",
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
            <div className="hx-actions">
              <Cta to="/meta-campaigns" tone="ink">{text("לעמוד הקמפיינים", "Campaigns page")}</Cta>
              <DemoButton
                label={text("לצפות בהדגמה", "Watch the demo")}
                onClick={() => open(filmOf("campaigns", "campaigns", "/demo-media/campaigns/poster.jpg", text("קמפיינים", "Campaigns"), text("סיור מוצר של מסך הקמפיינים עם נתוני דמו.", "Product walkthrough of the campaigns screen with demo data."), language, text))}
              />
            </div>
          </div>
          <div className="hx-camp-visual">
            <div className="hx-camp-frame">
              <CampaignPulse text={text} />
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
    <section className="hx-auto" id="automations" ref={ref} aria-labelledby="hx-auto-title">
      <div className="hx-auto-top">
        <div className="hx-auto-wrap">
          <h2 id="hx-auto-title">{text("פחות עבודה ידנית חוזרת. יותר זמן ללקוח.", "Less repeated manual work. More time for the customer.")}</h2>
          <p className="hx-prose">
            {text(
              "כשלקוח משאיר פרטים או נוצר ליד חדש — אפשר להגדיר פעולת המשך אוטומטית, לפי החיבורים וההרשאות הפעילים בחשבון.",
              "When a customer leaves details or a new lead arrives, you can define the next automatic action — within the connections and permissions active on the account.",
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
            <div className="hx-actions">
              <Cta to="/automations" tone="ink">{text("לעמוד האוטומציות", "Automations page")}</Cta>
            </div>
          </div>
          <div className="hx-step">
            <LocaleShot
              language={language}
              src={shown.img}
              alt={shown.alt}
              width={1600}
              height={1000}
              decoding="async"
              className={
                shown.img.includes("leads-list")
                  ? "hx-crop-leads"
                  : shown.img.includes("lead-task")
                    ? "hx-crop-task"
                    : shown.img.includes("whatsapp")
                      ? "hx-crop-chat"
                      : shown.img.includes("automations")
                        ? "hx-crop-auto"
                        : "hx-crop-studio"
              }
            />
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
    ["/template-screenshots/studiora.webp", text("סטודיו", "Studio"), "hx-crop-site-top"],
    ["/template-screenshots/vitalcare.webp", text("קליניקה", "Clinic"), "hx-crop-site-top"],
    ["/template-screenshots/wantravel.webp", text("תיירות", "Travel"), "hx-crop-site-top"],
    ["/demo-media/home/appointments.jpg", text("יומן פגישות", "Appointments"), "hx-crop-record"],
    ["/template-screenshots/summitops.webp", text("שירותים", "Services"), "hx-crop-site-top"],
    ["/template-screenshots/serenova.webp", text("אירוח", "Hospitality"), "hx-crop-site-top"],
    ["/template-screenshots/soleora.webp", text("מותג", "Brand"), "hx-crop-site-top"],
  ] as const;
  return (
    <section className="hx-chapter hx-saas" id="saas" aria-labelledby="hx-saas-title">
      <div className="hx-saas-head">
          <h2 id="hx-saas-title">{text("מערכות מוכנות לענפים — בלי לבנות הכל מאפס.", "Ready systems for real industries — without building everything from scratch.")}</h2>
          <p className="hx-prose">
            {text(
              "בקטלוג רואים מה זמין היום, מה בהכנה, ומה אפשר להתאים לעסק שלכם.",
              "The catalog shows what is available today, what is in preparation, and what can be adapted to your business.",
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
    <section className="hx-faq" id="faq" aria-labelledby="hx-faq-title">
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
            <Link to="/crm">CRM</Link>
            <Link to="/whatsapp-api">WhatsApp</Link>
            <Link to="/automations">{text("אוטומציות", "Automations")}</Link>
            <Link to="/meta-campaigns">{text("קמפיינים", "Campaigns")}</Link>
            <Link to="/website-builder">{text("בניית אתרים", "Website builder")}</Link>
            <Link to="/pricing">{text("מחירים", "Pricing")}</Link>
            <Link to="/guides">{text("בלוג", "Blog")}</Link>
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
