import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { HOME_FAQ, HOME_FAQ_TITLE } from "../../lib/homeFaq.mjs";
import { PRICING_PACKAGES } from "../../data/pricingPackagesData";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { homeText } from "./homeCopy";
import ProductTheater, { type TheaterFilm, type TheaterStep } from "./ProductTheater";
import films from "./theaterFilms.json";

const MEDIA = "/demo-media/home";
const FILM_VERSION = "t4";

type FilmKey = keyof typeof films;

function filmFor(key: FilmKey): TheaterFilm {
  const spec = films[key];
  return {
    src: `${MEDIA}/theater/${key}.mp4?v=${FILM_VERSION}`,
    poster: `${MEDIA}/theater/${key}.webp?v=${FILM_VERSION}`,
    width: spec.width,
    height: spec.height,
    duration: spec.duration,
    chapters: spec.chapters,
  };
}

function faqLocale(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return "he";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("ar")) return "ar";
  return "en";
}

function useCopy() {
  const { i18n, t } = useTranslation();
  const language = i18n.language || "en";
  const he = language.startsWith("he");
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const cine = cinematicFor(language);
  return { text, he, t, cine, language, dir: getTextDirection(language) };
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

/** Adds `is-in` to [data-reveal] nodes as they enter the viewport. Content stays visible without JS. */
function useReveal(root: { current: HTMLElement | null }) {
  const reduced = useReduced();
  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const targets = [...node.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach((target) => target.classList.add("is-in"));
      return undefined;
    }
    document.documentElement.classList.add("ht-motion");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) target.classList.add("is-in");
      else observer.observe(target);
    });
    return () => observer.disconnect();
  }, [reduced, root]);
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

function Cta({ to, children, tone = "solid" }: { to: string; children: string; tone?: "solid" | "line" | "light" }) {
  const className = `hx-btn text-inherit${tone === "line" ? " hx-btn-line" : ""}${tone === "light" ? " hx-btn-light" : ""}`;
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

function Waves({ className = "" }: { className?: string }) {
  return (
    <svg className={`ht-waves ${className}`} viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ht-wave-a" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6d28d9" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#4f46e5" stopOpacity="0.4" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="ht-wave-b" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="1" stopColor="#93c5fd" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <g className="ht-wave ht-wave-1">
        <path d="M0 210 C 240 140 420 280 720 214 S 1180 120 1440 190 V320 H0Z" fill="url(#ht-wave-b)" />
        <path d="M1440 210 C 1680 140 1860 280 2160 214 S 2620 120 2880 190 V320 H1440Z" fill="url(#ht-wave-b)" />
      </g>
      <g className="ht-wave ht-wave-2">
        <path d="M0 250 C 260 196 470 300 760 252 S 1210 176 1440 236 V320 H0Z" fill="url(#ht-wave-a)" />
        <path d="M1440 250 C 1700 196 1910 300 2200 252 S 2650 176 2880 236 V320 H1440Z" fill="url(#ht-wave-a)" />
      </g>
      <path className="ht-wave-line" d="M0 176 C 300 120 520 236 820 186 S 1250 110 1440 160" fill="none" />
    </svg>
  );
}

function Shot({
  name,
  alt,
  caption,
  priority = false,
}: {
  name: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}) {
  const { language } = useCopy();
  const lang = language.startsWith("he") ? "he" : "en";
  return (
    <figure className="ht-shot" data-reveal>
      <picture>
        <source media="(max-width: 760px)" srcSet={`${MEDIA}/screens/${lang}-mobile-${name}.webp`} width={900} height={1948} />
        <img
          src={`${MEDIA}/screens/${lang}-desktop-${name}.webp`}
          alt={alt}
          width={2400}
          height={1500}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </picture>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Feature({
  id,
  eyebrow,
  title,
  lead,
  points,
  link,
  shot,
  flip = false,
  note,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  link: [string, string];
  shot: ReactNode;
  flip?: boolean;
  note?: string;
}) {
  return (
    <section className={`ht-feature${flip ? " is-flip" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="ht-wrap ht-feature-grid">
        <div className="ht-feature-copy" data-reveal>
          <p className="ht-eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p className="ht-lead">{lead}</p>
          <ul className="ht-points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {note ? <p className="ht-note">{note}</p> : null}
          <div className="hx-actions">
            <Cta to={link[0]} tone="line">{link[1]}</Cta>
          </div>
        </div>
        <div className="ht-feature-media">{shot}</div>
      </div>
    </section>
  );
}

export default function HomeExperienceSections() {
  const { text } = useCopy();
  const ref = useRef<HTMLDivElement | null>(null);
  const [seek, setSeek] = useState<{ index: number; nonce: number } | null>(null);
  useReveal(ref);
  const watch = (index: number) => {
    document.getElementById("product-theater")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSeek({ index, nonce: Date.now() });
  };
  return (
    <>
      <a className="hx-skip" href="#how">{text("דילוג לתוכן", "Skip to content")}</a>
      <div className="ht-root" ref={ref}>
        <Hero seek={seek} />
        <HowItWorks onWatch={watch} />
        <Crm />
        <WhatsApp />
        <Automations />
        <Campaigns />
        <AiTools />
        <Products />
        <Benefits />
        <Pricing />
        <Faq />
        <Close />
      </div>
    </>
  );
}

const STEP_IDS = ["lead", "crm", "whatsapp", "task", "automation", "done"] as const;

function useSteps(): TheaterStep[] {
  const { cine } = useCopy();
  const labels = (cine.hero.processSteps || []) as [string, string][];
  const copy = (cine.hero.processCopy || []) as [string, string][];
  return STEP_IDS.map((id, index) => ({
    id,
    label: labels[index]?.[1] || id,
    title: copy[index]?.[0] || "",
    body: copy[index]?.[1] || "",
  }));
}

function Hero({ seek }: { seek: { index: number; nonce: number } | null }) {
  const { cine, language } = useCopy();
  const hero = cine.hero;
  const lang = language.startsWith("he") ? "he" : "en";
  const hot = Math.max(0, String(hero.lineTwo).trim().split(/\s+/).length - 1);
  const steps = useSteps();
  return (
    <section className="hx-hero" aria-labelledby="hx-hero-title">
      <div className="hx-geo hx-geo-a" aria-hidden="true" />
      <div className="hx-geo hx-geo-b" aria-hidden="true" />
      <div className="hx-geo hx-geo-c" aria-hidden="true" />
      <Waves className="ht-hero-waves" />
      <div className="hx-hero-pin">
        <div className="hx-hero-copy">
          <p className="hx-hero-kicker">{hero.kicker || "BizUply"}</p>
          <h1 className="hx-display" id="hx-hero-title">
            <Words text={hero.lineOne} />
            <Words text={hero.lineTwo} hot={hot} delay={220} />
          </h1>
          <p className="hx-lead">{hero.lead1}</p>
          <div className="hx-actions">
            <Cta to="/register">{hero.start}</Cta>
            <Cta to="/contact" tone="line">{hero.see}</Cta>
          </div>
          {Array.isArray(hero.trust) && hero.trust.length ? (
            <ul className="hx-hero-trust">
              {hero.trust.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside className="ht-hero-side" aria-label={hero.demoEyebrow}>
          <p className="ht-eyebrow">{hero.demoEyebrow}</p>
          <p className="ht-hero-side-lead">{hero.demoLead}</p>
          <ol className="ht-hero-steps">
            {steps.map((step, index) => (
              <li key={step.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step.label}
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <div className="hx-hero-stage" id="product-theater">
        <div className="hx-hero-stage-inner">
          <ProductTheater
            desktop={filmFor(`${lang}-desktop` as FilmKey)}
            mobile={filmFor(`${lang}-mobile` as FilmKey)}
            steps={steps}
            seekRequest={seek}
            labels={{
              region: hero.processLabel || hero.stageAlt,
              play: hero.play,
              pause: hero.pause,
              prev: hero.prev,
              next: hero.next,
              step: hero.stepOf,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onWatch }: { onWatch: (index: number) => void }) {
  const { text } = useCopy();
  const stages = [
    [text("הפנייה נכנסת", "The enquiry arrives"), text("מטופס באתר, מקמפיין Meta או מחיבור לידים — עם המקור שלה.", "From a site form, a Meta campaign or a lead connection — with its source."), 0],
    [text("מסדרים ב־CRM", "Organize it in the CRM"), text("כרטיס לקוח, סטטוס, הערות והיסטוריה במקום אחד.", "A customer record, status, notes and history in one place."), 1],
    [text("מדברים ב־WhatsApp", "Talk on WhatsApp"), text("ממשיכים את השיחה בערוץ שהלקוחות כבר משתמשים בו.", "Continue the conversation on the channel customers already use."), 2],
    [text("קובעים את הצעד הבא", "Set the next step"), text("משימה או פגישה עם תאריך ושעה, כדי ששום פנייה לא תיפול.", "A task or meeting with a date and time, so no enquiry slips."), 3],
    [text("אוטומציה ממשיכה", "Automation follows up"), text("טריגרים ופעולות שחוסכים עבודה ידנית חוזרת.", "Triggers and actions that save repeated manual work."), 4],
  ] as const;
  return (
    <section className="ht-how" id="how" aria-labelledby="ht-how-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("כך BizUply עובדת", "How BizUply works")}</p>
          <h2 id="ht-how-title">{text("מהליד הראשון ועד המכירה.", "From the first lead to the sale.")}</h2>
          <p className="ht-lead">
            {text(
              "כל שלב בתהליך קורה באותה מערכת, על אותו לקוח. כך הצוות רואה מי פנה, מה נאמר, ומה הצעד הבא.",
              "Every step happens in the same system, on the same customer. The team sees who reached out, what was said, and what comes next.",
            )}
          </p>
        </div>
        <ol className="ht-flow">
          {stages.map(([title, body, chapter], index) => (
            <li key={title} data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
              <span className="ht-flow-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <button type="button" className="ht-link-btn" onClick={() => onWatch(chapter)}>
                {text("לצפות בשלב הזה", "Watch this step")}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Crm() {
  const { text } = useCopy();
  return (
    <Feature
      id="crm"
      eyebrow={text("CRM וניהול לידים", "CRM and lead management")}
      title={text("כל ליד, כל שיחה, כל משימה — בכרטיס אחד.", "Every lead, conversation and task — on one record.")}
      lead={text(
        "רשימת לידים שאפשר לסנן, כרטיס לקוח עם סטטוס, מקור, הערות, משימות ופגישות, והיסטוריית פעילות שנשמרת אוטומטית.",
        "A lead list you can filter, a customer record with status, source, notes, tasks and meetings, and an activity history that saves itself.",
      )}
      points={[
        text("סטטוסים מותאמים לתהליך המכירה", "Statuses that match your sales process"),
        text("מקור הליד נשמר על כל רשומה", "The lead source is kept on every record"),
        text("הערות, תיעוד שיחות ומשימות עם מועד", "Notes, call logs and dated tasks"),
        text("ייבוא וייצוא ל־CSV ו־Excel", "Import and export with CSV and Excel"),
      ]}
      link={["/crm", text("להכיר את ה־CRM", "Explore the CRM")]}
      shot={<Shot name="crm-card" alt={text("כרטיס לקוח בתוך BizUply עם הערות ופעילות", "A customer record in BizUply with notes and activity")} caption={text("מסך אמיתי מחשבון הדמו של BizUply", "A real screen from the BizUply demo account")} />}
    />
  );
}

function WhatsApp() {
  const { text } = useCopy();
  return (
    <Feature
      id="whatsapp"
      flip
      eyebrow="WhatsApp Business API"
      title={text("השיחות עם הלקוחות, מחוברות לעסק.", "Customer conversations, connected to the business.")}
      lead={text(
        "חיבור רשמי ל־WhatsApp Business API דרך Meta: תיבת שיחות משותפת, תבניות הודעה, נתוני ביצועים וחיבור לכרטיס הלקוח.",
        "An official WhatsApp Business API connection through Meta: a shared inbox, message templates, performance data and a link to the customer record.",
      )}
      points={[
        text("תיבת דואר נכנס לכל הצוות", "One inbox for the whole team"),
        text("תבניות הודעה מאושרות לשליחה יזומה", "Approved templates for outbound messages"),
        text("נתוני שליחה, קריאה ותגובה", "Sent, read and reply data"),
      ]}
      note={text(
        "החיבור כפוף לתהליך האישור ולמדיניות של Meta. תשובות חופשיות אפשריות בחלון 24 השעות שאחרי הודעת הלקוח.",
        "The connection follows Meta's approval process and policies. Free-form replies are possible within 24 hours of the customer's last message.",
      )}
      link={["/whatsapp-api", text("להכיר את WhatsApp API", "Explore the WhatsApp API")]}
      shot={<Shot name="whatsapp" alt={text("תיבת WhatsApp בתוך BizUply", "The WhatsApp inbox in BizUply")} caption={text("מסך אמיתי מחשבון הדמו — ההודעה לא נשלחה ללקוח אמיתי", "A real demo-account screen — the message was not sent to a real person")} />}
    />
  );
}

function Automations() {
  const { text } = useCopy();
  return (
    <Feature
      id="automations"
      eyebrow={text("אוטומציות חכמות", "Smart automations")}
      title={text("פחות עבודה ידנית. יותר מעקב עקבי.", "Less manual work. More consistent follow-up.")}
      lead={text(
        "בונים תהליך מטריגר ופעולות בעורך ויזואלי: ליד חדש, שינוי סטטוס או פגישה — ואחריהם תגית, הערה, משימה או הודעה.",
        "Build a flow from a trigger and actions in a visual editor: a new lead, a status change or a meeting — followed by a tag, a note, a task or a message.",
      )}
      points={[
        text("עורך תהליכים ויזואלי עם תבניות", "A visual flow editor with templates"),
        text("הרצת בדיקה שלא שולחת הודעות ולא משנה נתונים", "Test runs that send nothing and change no data"),
        text("היסטוריית הרצות לכל תהליך", "A run history for every flow"),
      ]}
      note={text("הפעלת אוטומציות בחשבון חי דורשת חבילה פעילה.", "Running automations on a live account requires an active plan.")}
      link={["/automations", text("להכיר את האוטומציות", "Explore automations")]}
      shot={<Shot name="automation" alt={text("עורך האוטומציות עם תוצאות הרצת בדיקה", "The automation editor with test-run results")} caption={text("הרצת בדיקה אמיתית בעורך האוטומציות", "A real test run in the automation editor")} />}
    />
  );
}

function Campaigns() {
  const { text } = useCopy();
  return (
    <Feature
      id="campaigns"
      flip
      eyebrow={text("קמפיינים ושיווק", "Campaigns and marketing")}
      title={text("הקמפיין, הלידים והתוצאות — באותו מקום.", "The campaign, the leads and the results — in one place.")}
      lead={text(
        "ניהול קמפיינים של Meta לפייסבוק ולאינסטגרם מתוך BizUply: הוצאה, לידים, עלות לליד וחשיפות, ולידים שנכנסים ישירות ל־CRM.",
        "Manage Meta campaigns for Facebook and Instagram from inside BizUply: spend, leads, cost per lead and reach, with leads going straight into the CRM.",
      )}
      points={[
        text("יצירת קמפיין חדש מתוך המערכת", "Create a new campaign from the platform"),
        text("סקירת ביצועים לפי טווח תאריכים", "Performance overview by date range"),
        text("לידים מטפסי Meta נכנסים ל־CRM", "Meta form leads flow into the CRM"),
      ]}
      note={text("דורש חיבור חשבון מודעות של Meta. הנתונים במסך הם של חשבון הדמו.", "Requires a connected Meta ad account. The figures shown belong to the demo account.")}
      link={["/meta-campaigns", text("להכיר את הקמפיינים", "Explore campaigns")]}
      shot={<Shot name="campaigns" alt={text("סקירת קמפיינים של Meta בתוך BizUply", "Meta campaign overview in BizUply")} caption={text("מסך אמיתי מחשבון הדמו", "A real screen from the demo account")} />}
    />
  );
}

function AiTools() {
  const { text, language } = useCopy();
  const lang = language.startsWith("he") ? "he" : "en";
  const tools = [
    {
      title: text("היועץ העסקי", "Business Advisor"),
      body: text(
        "מנתח את הפעילות בחשבון וממליץ מה כדאי לעשות: אילו לידים דורשים טיפול, נוסחי הודעות מעקב והמלצות לקמפיינים. הוא מייעץ ואינו מבצע פעולות.",
        "Reads the activity in your account and recommends what to do: which leads need attention, follow-up message drafts and campaign suggestions. It advises and does not take actions.",
      ),
      to: "/register",
      cta: text("לנסות בחשבון חינמי", "Try it on a free account"),
      image: `${MEDIA}/screens/${lang}-desktop-ai.webp`,
      mobile: `${MEDIA}/screens/${lang}-mobile-ai.webp`,
      alt: text("היועץ העסקי בתוך BizUply", "The Business Advisor in BizUply"),
    },
    {
      title: text("אוטומציות AI", "AI automations"),
      body: text(
        "תבניות מוכנות שמוסיפות פעולת AI לתהליך: דירוג וסיווג לידים, זיהוי לידים חמים, סיכום ליד לפני שיחה וניסוח הודעות מעקב. בודקים כל תבנית לפני שמפעילים.",
        "Ready templates that add an AI step to a flow: lead scoring and classification, hot-lead detection, a lead summary before a call, and follow-up drafts. Review each template before turning it on.",
      ),
      to: "/automations",
      cta: text("להכיר את האוטומציות", "Explore automations"),
      image: `${MEDIA}/screens/${lang}-desktop-ai-auto.webp`,
      mobile: `${MEDIA}/screens/${lang}-mobile-ai-auto.webp`,
      alt: text("תבניות אוטומציות AI בתוך BizUply", "AI automation templates in BizUply"),
    },
  ];
  return (
    <section className="ht-ai" id="ai" aria-labelledby="ht-ai-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("כלי AI זמינים", "AI tools available today")}</p>
          <h2 id="ht-ai-title">{text("AI שעוזר להחליט, לא רק לדבר.", "AI that helps you decide, not just chat.")}</h2>
          <p className="ht-lead">
            {text(
              "כלים שפעילים היום בפלטפורמה. פעולת AI נספרת כפעולת אוטומציה במסגרת החבילה.",
              "Tools that are live on the platform today. An AI action counts as an automation action in your plan.",
            )}
          </p>
        </div>
        <div className="ht-ai-grid">
          {tools.map((tool) => (
            <article className="ht-card ht-ai-card" key={tool.title} data-reveal>
              <figure className="ht-shot ht-shot-flat">
                <picture>
                  <source media="(max-width: 760px)" srcSet={tool.mobile} width={900} height={1948} />
                  <img src={tool.image} alt={tool.alt} width={2400} height={1500} loading="lazy" decoding="async" />
                </picture>
              </figure>
              <div className="ht-card-body">
                <h3>{tool.title}</h3>
                <p>{tool.body}</p>
                <Link className="ht-link" to={tool.to}>{tool.cta}</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="ht-ai-more" data-reveal>
          <strong>{text("סריקת אתר חכמה", "AI website scan")}</strong>
          <span>
            {text(
              "בדיקה של אתר ציבורי בנושאי פרטיות, אבטחה, נגישות ומסמכים ציבוריים.",
              "A check of a public website for privacy, security, accessibility and public documents.",
            )}
          </span>
          <Link className="ht-link" to="/website-scan">{text("לסרוק אתר", "Scan a website")}</Link>
        </p>
      </div>
    </section>
  );
}

function Products() {
  const { text } = useCopy();
  const saas = [
    ["beautyflow", "BeautyFlow", text("תורים, לקוחות ואתר הזמנות לסלונים ולמכוני יופי, תחת המותג שלכם.", "Appointments, clients and a booking site for salons and beauty studios, under your own brand.")],
    ["global-properties", "Global Properties", text("נכסים, בעלים ופניות במוצר נדל״ן שאפשר למתג לשוק שלכם.", "Listings, owners and enquiries in a property product you can brand for your market.")],
    ["dinevo", "Dinevo", text("תפריט דיגיטלי, הזמנה מהשולחן ב־QR, מטבח וחשבונות למסעדות.", "Digital menus, QR table ordering, kitchen and bills for restaurants.")],
    ["tableflow", "TableFlow", text("הזמנה מהשולחן בסריקת QR, בלי להוריד אפליקציה.", "QR table ordering guests can scan, with no app download.")],
    ["cliny", "Cliny", text("צוותים, אתרים, עבודות וחיוב לחברות ניקיון ושירותי שטח.", "Crews, sites, jobs and billing for cleaning and field-service teams.")],
  ] as const;
  const platform = [
    ["/website-builder", text("בניית אתרים", "Website builder"), text("עורך ויזואלי ותבניות מוכנות, עם טופס לידים שמחובר ל־CRM.", "A visual editor and ready templates, with a lead form connected to the CRM.")],
    ["/appointments", text("תורים ופגישות", "Appointments"), text("יומן, שירותים וזימון תורים מתוך אותה סביבת עבודה.", "A calendar, services and booking inside the same workspace.")],
    ["/collaborations", text("שיתופי פעולה", "Collaborations"), text("רשת עסקית לשיתופי פעולה והפניות בין עסקים.", "A business network for partnerships and referrals.")],
  ] as const;
  const templates = ["studiora", "vitalcare", "wantravel"];
  return (
    <section className="ht-products" id="products" aria-labelledby="ht-products-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("מערכות SaaS ומוצרים", "SaaS systems and products")}</p>
          <h2 id="ht-products-title">{text("מערכות מוכנות שזמינות היום.", "Ready systems you can use today.")}</h2>
          <p className="ht-lead">
            {text(
              "חמש מערכות SaaS פעילות בקטלוג של BizUply, שאפשר לראות בהדגמה ולהשיק תחת מותג משלכם — ולצידן הכלים שבפלטפורמה העסקית.",
              "Five SaaS systems are active in the BizUply catalog. You can open their demos and launch them under your own brand — alongside the tools in the business platform.",
            )}
          </p>
        </div>
        <ul className="ht-saas">
          {saas.map(([slug, name, body], index) => (
            <li key={slug} data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
              <Link to={`/saas/${slug}`} className="ht-saas-card">
                <span className="ht-saas-shot">
                  <img src={`${MEDIA}/saas/${slug}.webp`} alt={`${name} — ${text("מסך הניהול", "Admin dashboard")}`} width={1600} height={1000} loading="lazy" decoding="async" />
                </span>
                <span className="ht-saas-body">
                  <strong>{name}</strong>
                  <span>{body}</span>
                  <em>{text("למערכת ולהדגמה", "View the system and demo")}</em>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="ht-platform">
          <article className="ht-card ht-sites" data-reveal>
            <div className="ht-sites-strip" aria-hidden="true">
              {templates.map((name) => (
                <img key={name} src={`/template-screenshots/${name}.webp`} alt="" width={960} height={1200} loading="lazy" decoding="async" />
              ))}
            </div>
            <div className="ht-card-body">
              <h3>{platform[0][1]}</h3>
              <p>{platform[0][2]}</p>
              <Link className="ht-link" to={platform[0][0]}>{text("לבניית אתר", "Build a website")}</Link>
            </div>
          </article>
          {platform.slice(1).map(([to, title, body]) => (
            <article className="ht-card ht-platform-card" key={to} data-reveal>
              <div className="ht-card-body">
                <h3>{title}</h3>
                <p>{body}</p>
                <Link className="ht-link" to={to}>{text("לפרטים", "Learn more")}</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="hx-actions ht-center">
          <Cta to="/saas">{text("לקטלוג מערכות ה־SaaS", "Browse the SaaS catalog")}</Cta>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const { text } = useCopy();
  const items = [
    [text("מערכת אחת במקום כלים מפוזרים", "One system instead of scattered tools"), text("לידים, שיחות, משימות, אוטומציות וקמפיינים חולקים את אותו כרטיס לקוח.", "Leads, conversations, tasks, automations and campaigns share the same customer record.")],
    [text("עברית ואנגלית מהיסוד", "Hebrew and English from the ground up"), text("ממשק מלא מימין לשמאל ומשמאל לימין, ותמיכה בשפות נוספות.", "A full right-to-left and left-to-right interface, with more languages supported.")],
    [text("עובד גם מהטלפון", "Works from your phone"), text("אותה מערכת בדסקטופ ובמובייל — לענות לליד גם מחוץ למשרד.", "The same system on desktop and mobile, so you can answer a lead away from the office.")],
    [text("חיבורים רשמיים", "Official connections"), text("WhatsApp Business API ו־Meta דרך החיבורים הרשמיים, בהתאם לאישורים.", "WhatsApp Business API and Meta through their official connections, subject to approval.")],
    [text("בודקים לפני שמפעילים", "Test before you go live"), text("הרצת בדיקה לאוטומציות, בלי לשלוח הודעות ובלי לשנות נתונים.", "Test runs for automations that send nothing and change no data.")],
    [text("מתחילים בחינם", "Start for free"), text("פותחים חשבון, בודקים את המערכת, ובוחרים חבילה כשמוכנים.", "Open an account, try the system, and pick a plan when you are ready.")],
  ] as const;
  return (
    <section className="ht-benefits" id="benefits" aria-labelledby="ht-benefits-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("יתרונות מרכזיים", "Key benefits")}</p>
          <h2 id="ht-benefits-title">{text("נבנה לעסקים שרוצים סדר — ולא עוד מערכת.", "Built for businesses that want order, not another tool.")}</h2>
        </div>
        <ul className="ht-benefit-grid">
          {items.map(([title, body], index) => (
            <li key={title} data-reveal style={{ transitionDelay: `${(index % 3) * 70}ms` }}>
              <span className="ht-benefit-mark" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  const { text, t, he, language } = useCopy();
  const money = (value: number) =>
    new Intl.NumberFormat(he ? "he-IL" : language, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const plans = PRICING_PACKAGES.map((pkg) => {
    const tx = (suffix: string, hebrew: string, english: string) =>
      he ? hebrew : t(`pricing.packages.${pkg.type}.${suffix}`, { defaultValue: english });
    return {
      key: pkg.type,
      highlighted: pkg.highlighted,
      name: tx("name", pkg.nameHe, pkg.nameEn),
      badge: tx("badge", pkg.badgeHe, pkg.badgeEn),
      description: tx("description", pkg.descriptionHe, pkg.descriptionEn),
      period: tx("pricePeriod", pkg.pricePeriodHe, pkg.pricePeriodEn),
      price: money(pkg.price),
      features: (he ? pkg.featuresHe : pkg.featuresEn.map((item, index) => t(`pricing.packages.${pkg.type}.features.${index}`, { defaultValue: item }))).slice(0, 5),
    };
  });
  return (
    <section className="ht-pricing" id="pricing" aria-labelledby="ht-pricing-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("מחירים ומסלולים", "Pricing and plans")}</p>
          <h2 id="ht-pricing-title">{text("מסלול ברור לכל שלב של העסק.", "A clear plan for every stage of the business.")}</h2>
          <p className="ht-lead">
            {text(
              "המחירים בדולר ארה״ב. אפשר להתחיל בחשבון חינמי ולבחור מסלול בעמוד המחירים.",
              "Prices are in US dollars. You can start on a free account and choose a plan on the pricing page.",
            )}
          </p>
        </div>
        <ul className="ht-plans">
          {plans.map((plan, index) => (
            <li key={plan.key} className={plan.highlighted ? "is-featured" : undefined} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
              <p className="ht-plan-badge">{plan.badge}</p>
              <h3>{plan.name}</h3>
              <p className="ht-plan-price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </p>
              <p className="ht-plan-desc">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Cta to="/pricing" tone={plan.highlighted ? "solid" : "line"}>{text("לפרטי המסלול", "See plan details")}</Cta>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const { text, language } = useCopy();
  const locale = faqLocale(language);
  const items = (HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en;
  const title = (HOME_FAQ_TITLE as Record<string, string>)[locale] || HOME_FAQ_TITLE.en;
  return (
    <section className="ht-faq" id="faq" aria-labelledby="ht-faq-title">
      <div className="ht-wrap ht-faq-grid">
        <div className="ht-faq-intro" data-reveal>
          <p className="ht-eyebrow">{text("שאלות נפוצות", "FAQ")}</p>
          <h2 id="ht-faq-title">{title}</h2>
          <div className="hx-actions">
            <Cta to="/faq" tone="line">{text("לכל השאלות", "All questions")}</Cta>
          </div>
        </div>
        <div className="ht-faq-list">
          {items.map(([question, answer]) => (
            <details key={question} data-reveal>
              <summary>
                <h3>{question}</h3>
                <i aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Close() {
  const { text } = useCopy();
  return (
    <section className="ht-close" aria-labelledby="ht-close-title">
      <Waves className="ht-close-waves" />
      <div className="ht-wrap ht-close-inner" data-reveal>
        <h2 id="ht-close-title">{text("העסק שלכם מוכן לעבוד חכם יותר.", "Your business is ready to work smarter.")}</h2>
        <p>
          {text(
            "פותחים חשבון חינמי, מחברים את מקורות הלידים, ומתחילים לנהל את הלקוחות מתוך מערכת אחת.",
            "Open a free account, connect your lead sources, and start managing customers from one system.",
          )}
        </p>
        <div className="hx-actions">
          <Cta to="/register" tone="light">{text("התחילו בחינם עכשיו", "Start for free now")}</Cta>
          <Cta to="/contact" tone="line">{text("קבעו הדגמה אישית", "Schedule a personal demo")}</Cta>
        </div>
      </div>
    </section>
  );
}
