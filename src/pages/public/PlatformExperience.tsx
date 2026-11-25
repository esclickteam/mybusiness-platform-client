import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { platformStory } from "../../lib/platformStory.mjs";
import { industryNav } from "../../lib/marketingNav.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import {
  MARKETING_LOCALE_PREFIXES,
  marketingPublicUrl,
  splitMarketingLocale,
  withMarketingLocale,
} from "../../lib/localePath.mjs";
import "./platformExperience.css";

const GUIDE_SLUGS = ["what-is-a-crm", "meta-lead-ads-to-crm", "whatsapp-cloud-api-cost", "follow-up-on-leads"];

const STATUS = {
  he: ["חדש", "נוצר קשר", "מעוניין", "הומר", "אבוד", "ישן"],
  en: ["New", "Contacted", "Interested", "Converted", "Lost", "Old"],
  es: ["Nuevo", "Contactado", "Interesado", "Convertido", "Perdido", "Antiguo"],
  "pt-BR": ["Novo", "Contactado", "Interessado", "Convertido", "Perdido", "Antigo"],
  ar: ["جديد", "تم التواصل", "مهتم", "تم التحويل", "مفقود", "قديم"],
};

const CHANNELS = ["Meta", "Facebook", "Instagram", "WhatsApp", "Google Ads"];

const FAQ_TITLE = {
  he: "שאלות נפוצות על Bizuply",
  en: "Questions about Bizuply",
  es: "Preguntas sobre Bizuply",
  "pt-BR": "Perguntas sobre a Bizuply",
  ar: "أسئلة عن Bizuply",
};

function screen(locale, name) {
  const folder = locale === "he" || locale === "ar" ? "he" : "en";
  return `/demo-media/home/screens/${folder}-desktop-${name}.webp`;
}

function Journey({ title, paragraphs, steps }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const tick = () => {
      frame = 0;
      if (media.matches || window.innerWidth < 900) {
        node.style.setProperty("--j", "1");
        return;
      }
      const box = node.getBoundingClientRect();
      const total = Math.max(node.offsetHeight - window.innerHeight, 1);
      const passed = Math.min(Math.max(-box.top, 0), total);
      node.style.setProperty("--j", String(passed / total));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section className="px-band is-journey" ref={ref} id="journey">
      <div className="px-pin">
        <div className="px-copy">
          <p className="px-index">02</p>
          <h2>{title}</h2>
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <ol className="px-steps">
          {steps.map((step, index) => (
            <li key={step} style={{ "--i": index, "--n": steps.length }}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function PlatformExperience() {
  const language = splitMarketingLocale(typeof window === "undefined" ? "/" : window.location.pathname).locale;
  const story = platformStory(language);
  const dir = getTextDirection(language);
  const canonical = marketingPublicUrl("/platform", language);
  const href = (path) => withMarketingLocale(path, language);
  const statuses = STATUS[language] || STATUS.en;
  const industries = industryNav(language).links || [];
  const guides = GUIDE_SLUGS.map((slug) => ({ slug, guide: getGuide(slug, language) })).filter((item) => item.guide?.h1);
  const shots = {
    0: screen(language, "dashboard"),
    2: screen(language, "crm-list"),
    3: screen(language, "whatsapp"),
    4: screen(language, "automation"),
    5: screen(language, "campaigns"),
    6: "/demo-media/home/appointments.jpg",
    7: "/demo-media/websites/my-sites.jpg",
    8: screen(language, "ai"),
  };
  const faqHeading = FAQ_TITLE[language] || FAQ_TITLE.en;

  useEffect(() => {
    document.title = story.title;
    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attr, key);
        document.head.appendChild(node);
      }
      node.setAttribute("content", content);
    };
    setMeta("name", "description", story.description);
    setMeta("property", "og:title", story.title);
    setMeta("property", "og:description", story.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", "website");
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    const alternates: Array<[string, string]> = [
      ["en", marketingPublicUrl("/platform", "en")],
      ["x-default", marketingPublicUrl("/platform", "en")],
      ...MARKETING_LOCALE_PREFIXES.map((entry) => [entry.htmlLang, marketingPublicUrl("/platform", entry.locale)] as [string, string]),
    ];
    for (const [lang, hrefValue] of alternates) {
      let alt = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!alt) {
        alt = document.createElement("link");
        alt.rel = "alternate";
        alt.hreflang = lang;
        document.head.appendChild(alt);
      }
      alt.href = hrefValue;
    }
    document.documentElement.lang = language === "pt-BR" ? "pt-BR" : language;
    document.documentElement.dir = dir;
  }, [canonical, dir, language, story.description, story.title]);

  return (
    <article className="px" lang={language === "pt-BR" ? "pt-BR" : language} dir={dir}>
      <Helmet>
        <html lang={language === "pt-BR" ? "pt-BR" : language} dir={dir} />
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={story.title} />
        <meta property="og:description" content={story.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <link rel="alternate" hrefLang="en" href={marketingPublicUrl("/platform", "en")} />
        <link rel="alternate" hrefLang="x-default" href={marketingPublicUrl("/platform", "en")} />
        {MARKETING_LOCALE_PREFIXES.map((entry) => (
          <link key={entry.locale} rel="alternate" hrefLang={entry.htmlLang} href={marketingPublicUrl("/platform", entry.locale)} />
        ))}
      </Helmet>

      <header className="px-hero">
        <div className="px-hero__copy">
          <p className="px-kicker">{story.kicker}</p>
          <h1>{story.h1}</h1>
          <div className="px-actions">
            <Link className="px-btn is-yellow" to={href("/register")}>{story.primary}</Link>
            <Link className="px-btn is-ghost" to={href("/contact")}>{story.secondary}</Link>
          </div>
          <p className="px-lede">{story.lede}</p>
        </div>
        <figure className="px-stage">
          <img src={screen(language, "crm-card")} alt="" width="1440" height="900" />
          <ul className="px-float">
            {statuses.slice(0, 3).map((status) => <li key={status}>{status}</li>)}
          </ul>
        </figure>
      </header>

      {story.sections.map(([heading, paragraphs], index) => {
        if (index === 1) {
          return <Journey key={heading} title={heading} paragraphs={paragraphs} steps={story.steps} />;
        }
        const shot = shots[index];
        const tone = index === 3 || index === 17 ? "is-blue" : index === 4 || index === 15 ? "is-ink" : index === 8 || index === 14 ? "is-soft" : "is-paper";
        return (
          <section className={`px-band ${tone}`} key={heading} id={`s${index + 1}`}>
            <div className={shot ? "px-split" : "px-stack"}>
              <div className="px-copy">
                <p className="px-index">{String(index + 1).padStart(2, "0")}</p>
                <h2>{heading}</h2>
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {index === 2 ? (
                  <ul className="px-status">{statuses.map((status) => <li key={status}>{status}</li>)}</ul>
                ) : null}
                {index === 9 ? (
                  <ul className="px-links">
                    {story.links.slice(0, 8).map(([path, label]) => (
                      <li key={path}><Link to={href(path)}>{label}</Link></li>
                    ))}
                  </ul>
                ) : null}
                {index === 10 ? (
                  <ul className="px-links">
                    {industries.map(([path, label]) => (
                      <li key={path}><Link to={href(path)}>{label}</Link></li>
                    ))}
                  </ul>
                ) : null}
                {index === 11 ? (
                  <div className="px-flow" aria-hidden="false">
                    <ul>{CHANNELS.map((name) => <li key={name}>{name}</li>)}</ul>
                    <span className="px-flow__line" />
                    <strong>Bizuply</strong>
                    <span className="px-flow__line" />
                    <ul>
                      <li>CRM</li>
                      <li>WhatsApp</li>
                      <li>{language === "he" ? "משימה" : "Task"}</li>
                    </ul>
                  </div>
                ) : null}
                {index === 13 ? (
                  <div className="px-table-wrap">
                    <table>
                      <thead>
                        <tr>{story.compare.columns.map((column) => <th key={column}>{column}</th>)}</tr>
                      </thead>
                      <tbody>
                        {story.compare.rows.map((row) => (
                          <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {index === 16 ? (
                  <ul className="px-guides">
                    {guides.map(({ slug, guide }) => (
                      <li key={slug}>
                        <Link to={href(`/guides/${slug}`)}>
                          <strong>{guide.h1}</strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {index === 17 ? (
                  <div className="px-actions">
                    <Link className="px-btn is-yellow" to={href("/register")}>{story.primary}</Link>
                    <Link className="px-btn is-ghost" to={href("/contact")}>{story.secondary}</Link>
                    <Link className="px-btn is-line" to={href("/pricing")}>{story.plans}</Link>
                  </div>
                ) : null}
              </div>
              {shot ? (
                <figure className="px-shot">
                  <img src={shot} alt="" width="1440" height="900" loading="lazy" />
                </figure>
              ) : null}
            </div>
          </section>
        );
      })}

      <section className="px-band is-paper" id="faq">
        <div className="px-stack">
          <h2>{faqHeading}</h2>
          <div className="px-faq">
            {story.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <div className="px-answer"><p>{answer}</p></div>
              </details>
            ))}
          </div>
          <ul className="px-links">
            {story.links.slice(8).map(([path, label]) => (
              <li key={path}><Link to={href(path)}>{label}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
