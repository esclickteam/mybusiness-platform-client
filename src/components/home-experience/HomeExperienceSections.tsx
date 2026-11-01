import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { useOpenFilm, type Film } from "./film";

function useCopy() {
  const { i18n, t } = useTranslation();
  const he = i18n.language.startsWith("he");
  const text = (hebrew: string, english: string) => (he ? hebrew : english);
  return { text, he, t, language: i18n.language, dir: getTextDirection(i18n.language) };
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

function Words({ text, hot = -1, delay = 0 }: { text: string; hot?: number; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="hx-line">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={index === hot ? "hx-word is-hot" : "hx-word"}>
            <span style={{ animationDelay: `${delay + index * 75}ms` }}>{word}</span>
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

export default function HomeExperienceSections() {
  const { text } = useCopy();
  return (
    <>
      <a className="hx-skip" href="#story">{text("דילוג לתוכן", "Skip to content")}</a>
      <main>
      <Hero />
      <Why />
      <SplitStory />
      <CrmDepth />
      <WhatsApp />
      <Campaigns />
      <Websites />
      <Automations />
      <ReadySystems />
      <Connect />
      <Films />
      <Audiences />
      <Faq />
      <Close />
      </main>
    </>
  );
}

function Hero() {
  const { text } = useCopy();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--hp", progress.toFixed(3));
    node.style.setProperty("--s1", (progress < 0.28 ? 1 : progress < 0.42 ? 1 - (progress - 0.28) / 0.14 : 0).toFixed(3));
    node.style.setProperty("--s2", band(progress, 0.28, 0.42, 0.58, 0.72).toFixed(3));
    node.style.setProperty("--s3", (progress < 0.58 ? 0 : Math.min(1, (progress - 0.58) / 0.14)).toFixed(3));
  });
  const lineOne = text("כל מה שהעסק שלך צריך.", "Everything your business needs.");
  const lineTwo = text("פלטפורמה אחת חזקה.", "One powerful platform.");

  return (
    <section className="hx-hero" ref={ref} aria-labelledby="hx-hero-title">
      <div className="hx-hero-pin">
        <div className="hx-geo hx-geo-a" aria-hidden="true" />
        <div className="hx-geo hx-geo-b" aria-hidden="true" />
        <div className="hx-geo hx-geo-c" aria-hidden="true" />
        <div className="hx-hero-copy">
          <p className="hx-kicker">Bizuply</p>
          <h1 className="hx-display" id="hx-hero-title">
            <Words text={lineOne} />
            <Words text={lineTwo} hot={1} delay={280} />
          </h1>
          <p className="hx-lead">
            {text(
              "מנהלים לידים, מדברים עם לקוחות, יוצרים קמפיינים, בונים אתרים ומחברים תהליכים אוטומטיים — הכול מתוך סביבת עבודה אחת.",
              "Manage leads, talk with customers, run campaigns, build websites, and connect automated processes — from one workspace.",
            )}
          </p>
          <p className="hx-lead">
            {text(
              "Bizuply מרכזת את הכלים שעוזרים לעסקים לנהל את הפעילות השוטפת, לפתח קשרים עם לקוחות וליצור תהליכי עבודה מסודרים, בלי לעבור כל הזמן בין מערכות שונות.",
              "Bizuply brings together the tools that help a business run day-to-day work, stay in touch with customers, and keep processes in order, without jumping between separate systems.",
            )}
          </p>
          <div className="hx-actions">
            <Cta to="/register">{text("התחילו בחינם", "Start free")}</Cta>
            <Cta to="#story" tone="line">{text("לראות את המערכת", "See the system")}</Cta>
          </div>
          <p className="hx-note">
            {text(
              "פחות מערכות נפרדות. יותר סדר, שליטה וזמן להתמקד בלקוחות.",
              "Fewer separate systems. More order, more control, and more time for customers.",
            )}
          </p>
        </div>
        <div className="hx-hero-frame">
          <img
            className="hx-hero-shot hx-hero-shot-1"
            src="/demo-media/home/crm.jpg"
            alt={text("רשימת הלידים של Northwind Studio בתוך Bizuply", "Northwind Studio lead list inside Bizuply")}
            width="1600"
            height="1000"
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="hx-hero-shot hx-hero-shot-2"
            src="/demo-media/whatsapp/still-3.jpg"
            alt={text("שיחת WhatsApp של Northwind Studio בתוך Bizuply", "A Northwind Studio WhatsApp conversation inside Bizuply")}
            width="1600"
            height="1000"
            decoding="async"
          />
          <img
            className="hx-hero-shot hx-hero-shot-3"
            src="/demo-media/home/campaigns.jpg"
            alt={text("מסך ניהול קמפיינים של Meta ב-Bizuply", "Meta campaign management inside Bizuply")}
            width="1600"
            height="1000"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

function Why() {
  const { text } = useCopy();
  const points = [
    {
      title: text("רואים את התמונה המלאה", "See the whole picture"),
      body: text(
        "לידים, לקוחות, שיחות ומשימות — מידע חשוב שנמצא במקום שבו הצוות עובד.",
        "Leads, customers, conversations, and tasks stay in the place where the team already works.",
      ),
    },
    {
      title: text("מתקדמים בלי לאבד פניות", "Move forward without losing enquiries"),
      body: text(
        "מעקב אחר שלבי הטיפול עוזר להבין מה דורש תשומת לב ומה הצעד הבא.",
        "Following each stage makes it clearer what needs attention and what should happen next.",
      ),
    },
    {
      title: text("מחברים בין שיווק למכירות", "Connect marketing with sales"),
      body: text(
        "פניות שמגיעות מהפעילות השיווקית יכולות להפוך לחלק מתהליך העבודה של העסק.",
        "Enquiries that start in marketing can become part of the business’s working process.",
      ),
    },
  ];
  return (
    <section className="hx-why" aria-labelledby="hx-why-title">
      <div className="hx-why-wrap">
        <h2 id="hx-why-title">
          {text(
            "העסק שלך לא צריך עוד מערכת. הוא צריך שהכול יעבוד יחד.",
            "Your business does not need another system. It needs the work to stay together.",
          )}
        </h2>
        <div className="hx-why-copy">
          <p>
            {text(
              "מכירים את המצב שבו פנייה נכנסת מפייסבוק, שיחה מתנהלת ב־WhatsApp, הפרטים נשמרים בגיליון ומשימה נרשמת במקום אחר?",
              "An enquiry arrives from Facebook, the conversation continues on WhatsApp, the details sit in a spreadsheet, and the task is written down somewhere else.",
            )}
          </p>
          <p>
            {text(
              "ככל שהעסק גדל, כך קשה יותר לעקוב אחר כל מה שקורה. Bizuply נועדה לעזור לעסקים לרכז את הפעילות במקום אחד: מהפנייה הראשונה של הלקוח, דרך השיחה והמעקב, ועד המשך הטיפול והפעילות השיווקית.",
              "As the business grows, it gets harder to follow everything that is happening. Bizuply is meant to keep that work in one place: from the first enquiry, through the conversation and the follow-up, to the next step and the marketing around it.",
            )}
          </p>
          <p>
            {text(
              "במקום לנסות לזכור מה קרה עם כל לקוח, אפשר לראות את המידע הרלוונטי ולעבוד בצורה מסודרת יותר.",
              "Instead of trying to remember what happened with each customer, the team can see the relevant information and work in a more orderly way.",
            )}
          </p>
        </div>
        <ul className="hx-points">
          {points.map((point) => (
            <li key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </li>
          ))}
        </ul>
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
      alt: text("תיק ליד פתוח ב-CRM של Bizuply", "An open lead file in the Bizuply CRM"),
    },
    {
      title: text("ממשיכים ב-WhatsApp.", "Continue on WhatsApp."),
      body: text(
        "השיחה עם אותו לקוח נשארת בתוך סביבת העבודה.",
        "The conversation with that customer stays inside the workspace.",
      ),
      img: "/demo-media/whatsapp/still-3.jpg",
      alt: text("תיבת WhatsApp של Northwind Studio בתוך Bizuply", "Northwind Studio WhatsApp inbox inside Bizuply"),
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
        <p className="hx-index" aria-hidden="true">01</p>
        <div className="hx-shots">
          {beats.map((beat, index) => (
            <div className={`hx-shot hx-shot-${index + 1}`} key={beat.img}>
              <img src={beat.img} alt={beat.alt} width="1600" height="1000" decoding="async" />
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
  return (
    <section className="hx-split" id="story" aria-labelledby="hx-story-title">
      <h2 className="hx-sr" id="hx-story-title">
        {text("מהליד ועד השיחה ב-WhatsApp", "From the lead to the WhatsApp conversation")}
      </h2>
      <div className="hx-stack">
        {beats.map((beat) => (
          <article key={beat.title}>
            <h3>{beat.title}</h3>
            <p>{beat.body}</p>
            <img src={beat.img} alt={beat.alt} width="1600" height="1000" loading="lazy" decoding="async" />
          </article>
        ))}
      </div>
      <div className="hx-actions hx-stack-actions">
        <Cta to="/crm" tone="ink">{text("ל־CRM", "CRM")}</Cta>
        <DemoButton
          label={text("לצפות בהדגמה", "Watch the demo")}
          onClick={() => open(filmOf("crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("הקלטת מסך של עבודת הלידים מתוך סביבת הדמו.", "A screen recording of the lead workspace from the demo."), language, text))}
        />
      </div>
    </section>
  );
}

function CrmDepth() {
  const { text, language } = useCopy();
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
          <p className="hx-kicker">CRM</p>
          <h2 id="hx-crm-title">{text("כל ליד במקום הנכון. כל הזדמנות מקבלת תשומת לב.", "Every lead in the right place. Every opportunity gets attention.")}</h2>
          <p className="hx-prose">
            {text(
              "לקוח השאיר פרטים באתר? הגיעה פנייה מקמפיין? מישהו ביקש שיחזרו אליו? מערכת CRM טובה עוזרת להפוך את הפניות האלה לתהליך עבודה ברור.",
              "A customer left details on the website, a campaign enquiry arrived, or someone asked for a call back. A useful CRM turns those enquiries into a clear working process.",
            )}
          </p>
          <p className="hx-prose">
            {text(
              "עם ה־CRM של Bizuply אפשר לרכז מידע על לידים ולקוחות, לעקוב אחר סטטוסים, לתעד את המשך הטיפול ולנהל משימות מתוך סביבת עבודה מרכזית. כך קל יותר להבין מי פנה, מה הוא ביקש, מי מטפל בו ומה צריך לקרות בהמשך.",
              "With Bizuply CRM, a business can keep lead and customer information together, follow statuses, record what happens next, and manage tasks from one workspace. It is easier to see who got in touch, what they asked for, who is handling it, and what should happen next.",
            )}
          </p>
          <div className="hx-actions">
            <Cta to="/crm" tone="ink">{text("לגלות את מערכת ה־CRM", "Explore Bizuply CRM")}</Cta>
            <DemoButton
              label={text("לצפות בהדגמה", "Watch the demo")}
              onClick={() => open(filmOf("crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("הקלטת מסך של עבודת הלידים: רשימה, כרטיס, סטטוס ומשימה.", "A screen recording of the lead workspace: list, record, status, and task."), language, text))}
            />
          </div>
        </div>
        <ol className="hx-shots-row">
          {shots.map(([src, label]) => (
            <li key={src}>
              <img src={src} alt={label} width="1200" height="750" loading="lazy" decoding="async" />
              <span>{label}</span>
            </li>
          ))}
        </ol>
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
  poster: string,
  title: string,
  caption: string,
  language: string,
  text: (hebrew: string, english: string) => string,
): Film {
  return {
    src: clipFile(folder, name, language),
    poster,
    title,
    caption,
    tag: text("הקלטת דמו", "Demo recording"),
  };
}

function WhatsApp() {
  const { text, language } = useCopy();
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
    <section className="hx-chapter hx-wa" id="products" ref={ref} aria-labelledby="hx-wa-title">
      <div className="hx-chapter-pin">
        <div className="hx-wa-grid">
          <div>
            <p className="hx-kicker">02 — WhatsApp</p>
            <h2 id="hx-wa-title">{text("הלקוחות שלך כבר ב־WhatsApp. עכשיו גם העסק יכול לעבוד שם בצורה מסודרת.", "Your customers are already on WhatsApp. The business can work there in a more orderly way.")}</h2>
            <p className="hx-prose">
              {text(
                "WhatsApp הפך לאחד מערוצי התקשורת המרכזיים בין עסקים ללקוחות. כשמספר הפניות גדל, קשה לנהל הכול מתוך שיחות פרטיות ולזכור מה צריך לעשות עם כל לקוח.",
                "WhatsApp has become one of the main channels between businesses and customers. As the number of conversations grows, it is harder to manage everything from private chats and remember what each customer needs.",
              )}
            </p>
            <p className="hx-prose">
              {text(
                "Bizuply מאפשרת לעסקים לעבוד עם WhatsApp Business API ולשלב תקשורת לקוחות בתהליכים העסקיים שלהם. אפשר לנהל שיחות, לעבוד עם תבניות הודעה מאושרות ולחבר פעולות לתהליכים נוספים במערכת, בהתאם לתנאי השימוש ולהרשאות של Meta.",
                "Bizuply lets a business work with the WhatsApp Business API and bring customer communication into its processes. Teams can manage conversations, use approved message templates, and connect actions to other workflows, within Meta’s terms and the permissions on the account.",
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
            <img
              src="/demo-media/whatsapp/still-3.jpg"
              alt={text("שיחת WhatsApp של Northwind Studio בתוך Bizuply", "A Northwind Studio WhatsApp conversation inside Bizuply")}
              width="1600"
              height="1000"
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
            <p className="hx-kicker">03 — Meta</p>
            <h2 id="hx-camp-title">{text("הקמפיין מביא את הליד. עכשיו מתחילה העבודה החשובה.", "The campaign brings the lead. Then the important work begins.")}</h2>
            <p className="hx-prose">
              {text(
                "קמפיין ממומן לא מסתיים ברגע שמישהו לוחץ על מודעה או משאיר פרטים. הערך האמיתי מתחיל כאשר העסק יודע מה לעשות עם הפנייה. Bizuply משלבת יכולות לניהול קמפיינים של Meta עם סביבת עבודה לניהול לידים, כדי לעזור לעסקים לחבר בין הפעילות השיווקית לבין הטיפול בלקוחות.",
                "A paid campaign does not end when someone clicks an ad or leaves their details. The useful part starts when the business knows what to do with that enquiry. Bizuply connects Meta campaign tools with a lead workspace, so marketing activity and customer follow-up can stay related.",
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
                onClick={() => open(filmOf("campaigns", "campaigns", "/demo-media/campaigns/poster.jpg", text("קמפיינים", "Campaigns"), text("הקלטת מסך של מסך הקמפיינים, בלי פרסום קמפיין אמיתי.", "A screen recording of the campaigns screen. No live campaign is published."), language, text))}
              />
            </div>
          </div>
          <div className="hx-camp-visual">
            <div className="hx-camp-frame">
              <img
                src="/demo-media/home/campaigns.jpg"
                alt={text("מסך ניהול קמפיינים של Meta ב-Bizuply", "Meta campaign management inside Bizuply")}
                width="1600"
                height="1000"
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
  const { text, language } = useCopy();
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
            <p className="hx-kicker">04 — Website Studio</p>
            <h2 id="hx-sites-title">{text("הנוכחות הדיגיטלית שלך צריכה לעשות יותר מלהיראות טוב.", "Your digital presence should do more than look good.")}</h2>
          </div>
          <p>
            {text(
              "אתר מקצועי הוא המקום שבו לקוחות פוטנציאליים לומדים להכיר את העסק, מבינים מה הוא מציע ומחליטים אם ליצור קשר. עם כלי בניית האתרים של Bizuply אפשר ליצור נוכחות שמתאימה לסוג העסק ולמטרות שלו: אתר תדמית, דף נחיתה, או עמוד שמאפשר להשאיר פרטים ולתאם מועד.",
              "A professional site is where potential customers learn what the business offers and decide whether to get in touch. Bizuply’s website tools can shape that presence around the business: a brochure site, a landing page, or a page where people leave details and book a time.",
            )}
          </p>
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
                  <b>{String(index + 1).padStart(2, "0")}</b>
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
              <img
                key={stage[0]}
                className={index === step ? "is-on" : undefined}
                src={stage[0]}
                alt={stage[1]}
                width="1600"
                height="1000"
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
  const { text } = useCopy();
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
          <p className="hx-kicker">05</p>
          <h2 id="hx-auto-title">{text("פחות פעולות שחוזרות על עצמן. יותר זמן לנהל את העסק.", "Fewer repeated actions. More time to run the business.")}</h2>
          <p className="hx-prose">
            {text(
              "לא כל פעולה בעסק צריכה להתבצע ידנית. כאשר לקוח משאיר פרטים, כאשר נוצר ליד חדש או כאשר מגיע הזמן להמשיך טיפול — אפשר להגדיר תהליכים שעוזרים לצוות לעבוד בצורה מסודרת יותר. האוטומציות של Bizuply מחברות בין אירועים לפעולות מוגדרות, בהתאם ליכולות ולחיבורים הפעילים בחשבון.",
              "Not every action in a business has to be done by hand. When a customer leaves details, a new lead arrives, or it is time to follow up, a defined process can help the team work in a more orderly way. Bizuply automations connect events to defined actions, within the features and connections that are active on the account.",
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
                  <b>{String(index + 1).padStart(2, "0")}</b>
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
            <img src={shown.img} alt={shown.alt} width="1600" height="1000" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReadySystems() {
  const { text, dir } = useCopy();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    const sign = dir === "rtl" ? 1 : -1;
    ref.current?.style.setProperty("--rail", (progress * 62 * sign).toFixed(3));
  });
  const slides = [
    ["/template-screenshots/studiora.webp", text("סטודיו", "Studio")],
    ["/template-screenshots/vitalcare.webp", text("קליניקה", "Clinic")],
    ["/template-screenshots/wantravel.webp", text("תיירות", "Travel")],
    ["/demo-media/home/appointments.jpg", text("יומן פגישות", "Appointments")],
    ["/template-screenshots/summitops.webp", text("שירותים", "Services")],
    ["/template-screenshots/serenova.webp", text("אירוח", "Hospitality")],
    ["/template-screenshots/soleora.webp", text("מותג", "Brand")],
  ] as const;
  return (
    <section className="hx-chapter hx-saas" ref={ref} aria-labelledby="hx-saas-title">
      <div className="hx-chapter-pin hx-saas-pin">
        <div className="hx-saas-head">
          <p className="hx-kicker">06</p>
          <h2 id="hx-saas-title">{text("רוצים להקים עסק דיגיטלי? לא תמיד חייבים להתחיל מאפס.", "Want to launch a digital business? You do not always have to start from a blank page.")}</h2>
          <p className="hx-prose">
            {text(
              "פיתוח מערכת תוכנה חדשה דורש תכנון, עיצוב, פיתוח, בדיקות ותשתית. Bizuply מפתחת פתרונות SaaS לעסקים וליזמים שרוצים לבחון אפשרות להפעיל מוצר תוכנה משלהם. בקטלוג אפשר לבדוק אילו מערכות זמינות, אילו בהכנה, ומהן אפשרויות ההתאמה.",
              "Building new software takes planning, design, development, testing, and infrastructure. Bizuply develops SaaS products for businesses and founders who want to explore running a software product of their own. The catalog shows which systems are available, which are still in preparation, and what can be adapted.",
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
        <div className="hx-rail-viewport">
          <div className="hx-rail" dir="ltr">
            {slides.map(([src, label]) => (
              <figure className="hx-slide" key={src}>
                <div className="hx-slide-frame">
                  <img src={src} alt={label} width="1200" height="800" loading="lazy" decoding="async" />
                </div>
                <figcaption dir={dir}>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Films() {
  const { text, language } = useCopy();
  const open = useOpenFilm();
  const films = [
    ["crm", "crm", "/demo-media/crm/poster.jpg", "CRM", text("עבודת הלידים", "Lead work"), text("הקלטת מסך של סביבת ה-CRM.", "A screen recording of the CRM workspace.")],
    ["whatsapp", "whatsapp", "/demo-media/whatsapp/poster.jpg", "WhatsApp", "WhatsApp", text("הקלטת מסך של תיבת ההודעות.", "A screen recording of the inbox.")],
    ["campaigns", "campaigns", "/demo-media/campaigns/poster.jpg", text("קמפיינים", "Campaigns"), text("קמפיינים", "Campaigns"), text("הקלטת מסך קצרה של מסך הקמפיינים.", "A short screen recording of the campaigns screen.")],
    ["websites", "websites", "/demo-media/websites/poster.jpg", text("אתרים", "Websites"), text("אתרים", "Websites"), text("הקלטת מסך של בונה האתרים.", "A screen recording of the website builder.")],
    ["automations", "automations", "/demo-media/automations/poster.jpg", text("אוטומציות", "Automations"), text("אוטומציות", "Automations"), text("הקלטת מסך של רשימת האוטומציות.", "A screen recording of the automation list.")],
  ] as const;
  return (
    <section className="hx-films" aria-labelledby="hx-films-title">
      <div className="hx-films-head">
        <p className="hx-kicker">{text("הקלטות", "Recordings")}</p>
        <h2 id="hx-films-title">{text("מתוך סביבת הדמו.", "From the demo workspace.")}</h2>
        <p className="hx-prose">
          {text(
            "ההקלטות צולמו בחשבון הדמו Northwind Studio. הן נטענות רק כשמפעילים אותן.",
            "These recordings were captured in the Northwind Studio demo account. They load only when you play them.",
          )}
        </p>
      </div>
      <div className="hx-film-layout">
        <button
          type="button"
          className="hx-film-lead text-inherit"
          onClick={() => open(filmOf(films[0][0], films[0][1], films[0][2], films[0][3], films[0][5], language, text))}
        >
          <img src={films[0][2]} alt="" width="1600" height="1000" loading="lazy" decoding="async" />
          <span>{text(`הפעלה: ${films[0][4]}`, `Play: ${films[0][4]}`)}</span>
        </button>
        <div className="hx-film-side">
          {films.slice(1).map((film) => (
            <button
              type="button"
              className="text-inherit"
              key={film[0]}
              onClick={() => open(filmOf(film[0], film[1], film[2], film[3], film[5], language, text))}
            >
              <img src={film[2]} alt="" width="800" height="500" loading="lazy" decoding="async" />
              <span>{text(`הפעלה: ${film[4]}`, `Play: ${film[4]}`)}</span>
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
        <p className="hx-prose">{text("Bizuply מחברת בין הכלים שהעסק צריך כדי לעבוד בצורה מסודרת יותר.", "Bizuply connects the tools a business needs in order to work in a more orderly way.")}</p>
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
        <p className="hx-kicker">{text("למי זה מתאים", "Who it is for")}</p>
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
                <small>{text("לפתרון", "View")}</small>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const { text, t } = useCopy();
  const items = [
    [text("מה זה Bizuply?", "What is Bizuply?"), text("Bizuply היא פלטפורמה עסקית המרכזת כלים לניהול לקוחות ולידים, תקשורת WhatsApp עסקית, קמפיינים, בניית אתרים ואוטומציות. המטרה היא לעזור לעסקים לנהל תהליכים מרכזיים מתוך סביבת עבודה אחת.", "Bizuply is a business platform that brings together customer and lead management, business WhatsApp, campaigns, website building, and automations. The aim is to help a business run its main processes from one workspace.")],
    [text("מה ההבדל בין CRM לבין מערכת לניהול לידים?", "What is the difference between a CRM and a lead system?"), text("ניהול לידים מתמקד בפניות ובהזדמנויות מכירה. מערכת CRM רחבה יותר ומאפשרת לנהל מידע על לקוחות, את היסטוריית הטיפול ותהליכים הקשורים לקשר עם הלקוח. ב־Bizuply ניהול הלידים הוא חלק מסביבת ה־CRM.", "Lead management focuses on enquiries and sales opportunities. A CRM is broader: customer information, the history of the work, and the processes around the relationship. In Bizuply, lead management is part of the CRM.")],
    [text("האם אפשר להשתמש רק במערכת CRM?", "Can I use only the CRM?"), text("כן, Bizuply מציעה גם מסלול CRM נפרד. את פרטי המסלול המעודכנים אפשר לבדוק בעמוד המחירים.", "Yes. Bizuply also offers a separate CRM plan. The current plan details are on the pricing page.")],
    [text("האם אפשר לחבר WhatsApp Business API?", "Can I connect the WhatsApp Business API?"), text("Bizuply מציעה פתרון WhatsApp Business API. החיבור והשימוש תלויים בתנאי הזכאות, בהגדרות החשבון ובמדיניות של Meta.", "Bizuply offers a WhatsApp Business API solution. Connection and use depend on eligibility, the account setup, and Meta’s policies.")],
    [text("האם Bizuply מתאימה לעסק קטן?", "Is Bizuply a fit for a small business?"), text("כן. עסקים קטנים יכולים להיעזר בכלים לניהול פניות, לקוחות ומשימות. בחירת המסלול המתאים תלויה בצרכים ובכלים שהעסק מעוניין להפעיל.", "Yes. Small businesses can use the tools for enquiries, customers, and tasks. The right plan depends on the needs and on the tools the business wants to run.")],
    [text("האם אפשר לנהל קמפיינים ממומנים דרך Bizuply?", "Can I manage paid campaigns in Bizuply?"), text("Bizuply כוללת יכולות לניהול קמפיינים של Meta. השימוש תלוי בחיבור חשבון מודעות מתאים ובהרשאות הרלוונטיות.", "Bizuply includes tools for managing Meta campaigns. Use depends on connecting a suitable ads account and on the relevant permissions.")],
    [text("האם אפשר לבנות אתר בלי לדעת לתכנת?", "Can I build a website without knowing how to code?"), text("כלי בניית האתרים של Bizuply מיועדים לפשט את תהליך יצירת האתר ועריכתו. האפשרויות הזמינות תלויות בסוג האתר וביכולות הפעילות במוצר.", "Bizuply’s website tools are meant to simplify creating and editing a site. What is available depends on the kind of site and on the features active in the product.")],
    [text("האם אפשר ליצור אוטומציות עסקיות?", "Can I create business automations?"), text("כן, בהתאם למסלול וליכולות הפעילות. ניתן להגדיר תהליכים המחברים בין אירועים לבין פעולות עסקיות.", "Yes, depending on the plan and the features that are active. You can define processes that connect events to business actions.")],
    [text("האם אפשר לרכוש מערכת SaaS מוכנה?", "Can I buy a ready-made SaaS system?"), text("Bizuply מפתחת ומציעה פתרונות SaaS. בקטלוג אפשר לבדוק אילו מערכות זמינות לרכישה, אילו נמצאות בהכנה ומהן אפשרויות ההתאמה.", "Bizuply develops and offers SaaS products. The catalog shows which systems are available to buy, which are still in preparation, and what can be adapted.")],
    [text("האם חייבים לרכוש את כל הכלים?", "Do I have to buy every tool?"), text("לא בהכרח. קיימים מסלולים ופתרונות שונים. מומלץ לעיין בעמוד המחירים כדי להבין אילו יכולות נכללות בכל הצעה.", "Not necessarily. There are different plans and products. The pricing page shows which capabilities are included in each offer.")],
    [text("האם Bizuply מתאימה לעסקים מחוץ לישראל?", "Does Bizuply work for businesses outside Israel?"), text("Bizuply פונה גם לשוק הבינלאומי. זמינות השירותים, השפות, אפשרויות התשלום והאינטגרציות עשויה להשתנות לפי המדינה והמוצר.", "Bizuply also serves an international market. Service availability, languages, payment options, and integrations can vary by country and product.")],
  ] as const;
  return (
    <section className="hx-faq" aria-labelledby="hx-faq-title">
      <div className="hx-faq-wrap">
        <h2 id="hx-faq-title">{text("שאלות נפוצות", t("home.faqTitle"))}</h2>
        <p className="hx-prose">{text("תשובות קצרות על המערכת, על החיבורים ועל הדרך להתחיל.", t("home.faqLead"))}</p>
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
        <div className="hx-actions">
          <Cta to="/faq" tone="ink">{text("לכל השאלות", "All questions")}</Cta>
          <Cta to="/guides">{text("למדריכים", "Guides")}</Cta>
        </div>
      </div>
    </section>
  );
}

function Close() {
  const { text } = useCopy();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--join", progress.toFixed(3));
  }, "pass");
  const products = ["CRM", "WhatsApp", text("קמפיינים", "Campaigns"), text("אתרים", "Websites")];
  return (
    <section className="hx-close" ref={ref} aria-labelledby="hx-close-title">
      <div className="hx-close-a">
        <p className="hx-kicker">Bizuply</p>
        <h2 id="hx-close-title">{text("העסק שלך יכול לעבוד אחרת.", "Your business can work differently.")}</h2>
        <p className="hx-prose">
          {text(
            "כשהלידים, הלקוחות, התקשורת והפעילות השיווקית מתחברים — קל יותר לראות מה קורה, להבין מה צריך לעשות ולהתקדם.",
            "When leads, customers, communication, and marketing activity stay connected, it is easier to see what is happening, decide what to do, and move forward.",
          )}
        </p>
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
        <img
          src="/demo-media/home/crm.jpg"
          alt={text("רשימת לידים בתוך Bizuply", "A lead list inside Bizuply")}
          width="960"
          height="600"
          loading="lazy"
          decoding="async"
        />
        <div className="hx-actions">
          <Cta to="/register" tone="ink">{text("התחילו בחינם", "Start free")}</Cta>
          <Cta to="/pricing">{text("הכירו את המסלולים", "See the plans")}</Cta>
          <Cta to="/contact">{text("דברו איתנו", "Talk with us")}</Cta>
        </div>
      </div>
    </section>
  );
}
