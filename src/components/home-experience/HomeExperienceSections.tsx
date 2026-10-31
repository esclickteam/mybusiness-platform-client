import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
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
  return (
    <span className="hx-line">
      {text.split(" ").map((word, index) => (
        <span className={index === hot ? "hx-word is-hot" : "hx-word"} key={`${word}-${index}`}>
          <span style={{ animationDelay: `${delay + index * 75}ms` }}>{word}</span>
        </span>
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

function Play({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="hx-play text-inherit" aria-label={label} onClick={onClick}>
      <i aria-hidden="true" />
    </button>
  );
}

export default function HomeExperienceSections() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SplitStory />
        <WhatsApp />
        <Campaigns />
        <Websites />
        <Automations />
        <ReadySystems />
        <Films />
        <Audiences />
        <Faq />
        <Close />
      </main>
    </>
  );
}

function Nav() {
  const { text } = useCopy();
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (!open) return undefined;
    firstLink.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    ["#story", text("הסיפור", "The story")],
    ["#products", text("המוצרים", "Products")],
    ["/pricing", text("מחירים", "Pricing")],
  ] as const;

  return (
    <header className="hx-nav">
      <a className="hx-skip" href="#story">{text("דילוג לתוכן", "Skip to content")}</a>
      <Link className="hx-brand" to="/" aria-label="Bizuply">
        <img src="/logo-mark.svg" alt="" width="148" height="40" decoding="async" fetchPriority="low" />
      </Link>
      <nav className="hx-nav-links" aria-label={text("ניווט ראשי", "Primary")}>
        {links.map(([to, label]) => (
          to.startsWith("#")
            ? <a key={to} href={to}>{label}</a>
            : <Link key={to} to={to}>{label}</Link>
        ))}
      </nav>
      <div className="hx-nav-end">
        <LanguageSwitcher />
        <Link className="hx-login" to="/login">{text("כניסה", "Log in")}</Link>
        <Cta to="/register">{text("התחילו בחינם", "Start free")}</Cta>
        <button
          type="button"
          className="hx-menu-btn text-inherit"
          aria-expanded={open}
          aria-controls="hx-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? text("סגירה", "Close") : text("תפריט", "Menu")}
        </button>
      </div>
      {open ? (
        <div className="hx-menu" id="hx-menu">
          {links.map(([to, label], index) => (
            to.startsWith("#")
              ? <a key={to} href={to} ref={index === 0 ? firstLink : undefined} onClick={() => setOpen(false)}>{label}</a>
              : <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>{text("כניסה", "Log in")}</Link>
          <Link to="/register" onClick={() => setOpen(false)}>{text("התחילו בחינם", "Start free")}</Link>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const { text } = useCopy();
  const ref = useRef<HTMLElement | null>(null);
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--hp", progress.toFixed(3));
  });
  const lineOne = text("כל מה שהעסק צריך.", "Everything your business needs.");
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
              "לידים, שיחות WhatsApp, קמפיינים של Meta, אתרים ואוטומציות — במערכת אחת לעסק.",
              "Leads, WhatsApp conversations, Meta campaigns, websites, and automations — in one system for the business.",
            )}
          </p>
          <div className="hx-actions">
            <Cta to="/register">{text("התחילו בחינם", "Start free")}</Cta>
            <Cta to="#story" tone="line">{text("לראות את המערכת", "See the system")}</Cta>
          </div>
        </div>
        <div className="hx-hero-frame">
          <img
            src="/demo-media/home/crm.jpg"
            alt={text("רשימת הלידים של Northwind Studio בתוך Bizuply", "Northwind Studio lead list inside Bizuply")}
            width="1600"
            height="1000"
            fetchPriority="high"
            decoding="async"
          />
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
            <Cta to="/crm" tone="line">{text("ל-CRM", "Open CRM")}</Cta>
            <Play label={text("הפעלת ההקלטה", "Play the recording")} onClick={openFilm} />
          </div>
        </div>
        <p className="hx-merge" aria-hidden="true">{text("אותו לקוח. כל הדרך.", "Same customer. The whole way.")}</p>
      </div>
    </section>
  );
}

function SplitStack() {
  const { text } = useCopy();
  const beats = useStory();
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
            <h2 id="hx-wa-title">{text("השיחה נשארת על הלקוח.", "The conversation stays on the customer.")}</h2>
            <p className="hx-prose">
              {text(
                "WhatsApp Business מחובר לסביבת העבודה. רואים את התיבה, את סטטוס החיבור, ואת אותו לקוח מה-CRM.",
                "WhatsApp Business is connected to the workspace. The inbox, the connection status, and the same CRM customer stay together.",
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
            <div className="hx-actions">
              <Cta to="/whatsapp-api" tone="line">{text("ל-WhatsApp API", "WhatsApp API")}</Cta>
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
            <div className="hx-float-play">
              <Play
                label={text("הפעלת הקלטת WhatsApp", "Play the WhatsApp recording")}
                onClick={() => open(filmOf("whatsapp", "whatsapp", "/demo-media/whatsapp/poster.jpg", "WhatsApp", text("הקלטת תיבת ההודעות מתוך סביבת הדמו.", "A recording of the inbox from the demo workspace."), language, text))}
              />
            </div>
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
  return (
    <section className="hx-chapter hx-camp" ref={ref} aria-labelledby="hx-camp-title">
      <div className="hx-chapter-pin">
        <div className="hx-camp-grid">
          <p className="hx-vert" aria-hidden="true">Meta</p>
          <div>
            <p className="hx-kicker">03</p>
            <h2 id="hx-camp-title">{text("הקמפיין נשאר ליד הליד.", "The campaign stays next to the lead.")}</h2>
            <p className="hx-prose">
              {text(
                "מסך ניהול הקמפיינים של Meta בתוך Bizuply. מכאן בודקים פעילות ופותחים קמפיין חדש, והלידים שנכנסים ממשיכים ל-CRM.",
                "Meta campaign management inside Bizuply. Review activity, start a campaign, and keep the leads that arrive in the CRM.",
              )}
            </p>
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
            <div className="hx-actions">
              <Cta to="/meta-campaigns" tone="ink">{text("לקמפיינים", "Campaigns")}</Cta>
              <Play
                label={text("הפעלת הקלטת הקמפיינים", "Play the campaigns recording")}
                onClick={() => open(filmOf("campaigns", "campaigns", "/demo-media/campaigns/poster.jpg", text("קמפיינים", "Campaigns"), text("הקלטת מסך קצרה של מסך הקמפיינים.", "A short screen recording of the campaigns screen."), language, text))}
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
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--wipe", String(Math.round(lerpStops(progress, [0.1, 0.85], [100, 0]))));
  });
  return (
    <section className="hx-chapter hx-sites" ref={ref} aria-labelledby="hx-sites-title">
      <div className="hx-chapter-pin hx-sites-pin">
        <div className="hx-sites-head">
          <div>
            <p className="hx-kicker">04</p>
            <h2 id="hx-sites-title">{text("מהעורך אל התצוגה.", "From the editor to the preview.")}</h2>
          </div>
          <p>
            {text(
              "שני רגעים אמיתיים מבונה האתרים: עריכת עמוד, ואז תצוגה של אתר הדמו.",
              "Two real moments from the website builder: editing a page, then previewing a demo site.",
            )}
          </p>
        </div>
        <div className="hx-sites-stage">
          <div className="hx-sites-layer">
            <img src="/demo-media/home/websites.jpg" alt={text("עורך האתר של Bizuply בעמוד של Northwind Studio", "The Bizuply website editor on a Northwind Studio page")} width="1600" height="1000" loading="lazy" decoding="async" />
            <p className="hx-tag">{text("עריכה", "Editor")}</p>
          </div>
          <div className="hx-sites-layer hx-sites-top">
            <img src="/demo-media/websites/still-14.jpg" alt={text("תצוגה של אתר דמו בתוך בונה האתרים", "A demo site preview inside the website builder")} width="1600" height="1000" loading="lazy" decoding="async" />
            <p className="hx-tag">{text("תצוגה", "Preview")}</p>
          </div>
        </div>
        <div className="hx-actions" style={{ width: "min(1240px, 100%)", margin: "1rem auto 0" }}>
          <Cta to="/website-builder" tone="ink">{text("לבניית אתרים", "Website builder")}</Cta>
          <Play
            label={text("הפעלת הקלטת האתר", "Play the website recording")}
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
  useScrollSpan(ref, (progress) => {
    ref.current?.style.setProperty("--draw", progress.toFixed(3));
  }, "pass");
  const steps = [
    {
      img: "/demo-media/home/crm.jpg",
      alt: text("רשימת לידים שאליה אוטומציה יכולה להגיב", "The lead list an automation can respond to"),
      kicker: "01",
      title: text("שינוי סטטוס של ליד", "A lead status changes"),
      body: text(
        "ברשימת האוטומציות של הדמו, הטריגר שמופיע הוא שינוי סטטוס של ליד.",
        "In the demo automation list, the trigger on screen is a lead status change.",
      ),
    },
    {
      img: "/demo-media/whatsapp/still-3.jpg",
      alt: text("שיחת WhatsApp שאפשר לחבר להמשך טיפול", "A WhatsApp conversation that can continue the follow-up"),
      kicker: "02",
      title: text("ההמשך יכול להיות הודעה", "The next step can be a message"),
      body: text(
        "אותה סביבה כוללת את תיבת WhatsApp, כך שהשיחה והליד לא מתפצלים בין כלים.",
        "The same workspace includes the WhatsApp inbox, so the conversation and the lead are not split across tools.",
      ),
    },
    {
      img: "/demo-media/home/automations.jpg",
      alt: text("רשימת האוטומציות של Northwind Studio", "The Northwind Studio automation list"),
      kicker: "03",
      title: text("התהליך נשאר ברשימה", "The process stays on the list"),
      body: text(
        "רואים אוטומציות כמו קבלת לקוח חדש ותזכורת לפגישה, ואת הסטטוס שלהן.",
        "Automations such as a new-client welcome and an appointment reminder stay visible, with their status.",
      ),
    },
  ];
  return (
    <section className="hx-auto" ref={ref} aria-labelledby="hx-auto-title">
      <svg className="hx-spine" viewBox="0 0 20 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 0 V100" pathLength="1" />
      </svg>
      <div className="hx-auto-wrap">
        <p className="hx-kicker">05</p>
        <h2 id="hx-auto-title">{text("קו אחד בין הפעולות.", "One line between the actions.")}</h2>
        <p className="hx-prose">
          {text(
            "אוטומציה ב-Bizuply מגיבה לאירוע עסקי וממשיכה את הטיפול. אלה המסכים האמיתיים, מחוברים כסיפור אחד.",
            "An automation in Bizuply responds to a business event and continues the work. These are the real screens, connected as one story.",
          )}
        </p>
      </div>
      <ol className="hx-steps hx-auto-wrap">
        {steps.map((step) => (
          <li key={step.kicker}>
            <div>
              <p className="hx-kicker">{step.kicker}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <div className="hx-step">
              <img src={step.img} alt={step.alt} width="1600" height="1000" loading="lazy" decoding="async" />
            </div>
          </li>
        ))}
      </ol>
      <div className="hx-actions hx-auto-wrap">
        <Cta to="/automations" tone="line">{text("לאוטומציות", "Automations")}</Cta>
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
          <h2 id="hx-saas-title">{text("מערכות מוכנות, בתנועה.", "Ready systems, in motion.")}</h2>
          <p className="hx-prose">
            {text(
              "תבניות אמיתיות מתוך Bizuply, ויומן הפגישות של סביבת הדמו. גוללים והשורה זזה.",
              "Real templates from Bizuply, plus the demo appointment calendar. Scroll and the row moves.",
            )}
          </p>
          <Cta to="/saas" tone="ink">{text("למערכות המוכנות", "Ready systems")}</Cta>
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

function Audiences() {
  const { text } = useCopy();
  const rows = [
    ["/solutions/clinics", text("קליניקות", "Clinics")],
    ["/solutions/beauty", text("מכוני יופי", "Beauty")],
    ["/solutions/real-estate", text("נדל״ן", "Real estate")],
    ["/solutions/restaurants", text("מסעדות", "Restaurants")],
    ["/solutions/service-businesses", text("נותני שירות", "Service businesses")],
    ["/solutions/agencies", text("סוכנויות", "Agencies")],
    ["/solutions/lead-based", text("עסקים מבוססי לידים", "Lead-based businesses")],
  ] as const;
  return (
    <section className="hx-who" aria-labelledby="hx-who-title">
      <div className="hx-who-wrap">
        <p className="hx-kicker">{text("למי זה מתאים", "Who it is for")}</p>
        <h2 id="hx-who-title">{text("לעסקים שעובדים עם לקוחות.", "For businesses that work with customers.")}</h2>
        <p className="hx-prose">
          {text(
            "Bizuply מיועדת לעסקים קטנים, נותני שירות וצוותים שרוצים לנהל לידים, שיחות ועבודה יומיומית במקום אחד.",
            "Bizuply is for small businesses, service providers, and teams that want leads, conversations, and daily work in one place.",
          )}
        </p>
        <ul className="hx-aud">
          {rows.map(([to, label]) => (
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
  const { t } = useCopy();
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <section className="hx-faq" aria-labelledby="hx-faq-title">
      <div className="hx-faq-wrap">
        <h2 id="hx-faq-title">{t("home.faqTitle")}</h2>
        <p className="hx-prose">{t("home.faqLead")}</p>
        {items.map((item) => (
          <details key={item}>
            <summary>
              <h3>{t(`home.faq${item}q`)}</h3>
            </summary>
            <p>{t(`home.faq${item}a`)}</p>
          </details>
        ))}
        <div className="hx-actions">
          <Cta to="/faq" tone="ink">{t("home.faqTitle")}</Cta>
        </div>
      </div>
    </section>
  );
}

function Close() {
  const { text } = useCopy();
  return (
    <section className="hx-close" aria-labelledby="hx-close-title">
      <div className="hx-close-a">
        <p className="hx-kicker">Bizuply</p>
        <h2 id="hx-close-title">{text("מערכת אחת. כל העסק.", "One platform. The whole business.")}</h2>
      </div>
      <div className="hx-close-b">
        <p className="hx-prose">
          {text(
            "אפשר להתחיל לבד, או לבקש ליווי בהקמת האתר והאוטומציות. המחירים והמסלולים נמצאים בעמוד המחירים.",
            "Start on your own, or ask for help setting up the website and automations. Plans and prices are on the pricing page.",
          )}
        </p>
        <Cta to="/register" tone="ink">{text("התחילו בחינם", "Start free")}</Cta>
        <div className="hx-actions">
          <Link to="/pricing">{text("למחירים", "See pricing")}</Link>
        </div>
      </div>
    </section>
  );
}
