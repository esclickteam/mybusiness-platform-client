import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { marketingPublicUrl, withMarketingLocale } from "../../lib/localePath.mjs";
import { FEATURES } from "./featuresCopy.mjs";
import "./featuresExperience.css";

function shot(language, name) {
  const folder = language === "he" || language === "ar" ? "he" : "en";
  return `/demo-media/home/screens/${folder}-desktop-${name}.webp`;
}

function site(language, name) {
  const folder = language === "he" || language === "ar" ? "he" : "en";
  return `/demo-media/home/sites/${name}-${folder}-desk.webp`;
}

export default function FeaturesExperience({ language }: { language: string }) {
  const copy = FEATURES[language] || FEATURES.en;
  const href = (path: string) => withMarketingLocale(path, language);
  const dir = language === "he" || language === "ar" ? "rtl" : "ltr";
  const [auto, setAuto] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      frame = 0;
      const node = document.getElementById("automations");
      if (!node || reduce) {
        setAuto(copy.autoSteps.length - 1);
        return;
      }
      const vh = window.innerHeight || 800;
      const top = node.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh * 0.72 - top) / (vh * 0.9)));
      const next = Math.min(copy.autoSteps.length - 1, Math.floor(p * copy.autoSteps.length));
      setAuto((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [copy.autoSteps.length]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map(([q, a]: [string, string]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <article className="ft" lang={language} dir={dir}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={marketingPublicUrl("/features", language)} />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <meta property="og:url" content={marketingPublicUrl("/features", language)} />
        <meta property="og:image" content="https://bizuply.com/brand/logo.png" />
        {[["en", "en"], ["he", "he"], ["es", "es"], ["pt-BR", "pt-BR"], ["ar", "ar"], ["x-default", "en"]].map(([lang, loc]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={marketingPublicUrl("/features", loc)} />
        ))}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <header className="ft-hero">
        <div className="ft-wrap ft-split">
          <div>
            <h1>{copy.h1}</h1>
            <p>{copy.sub}</p>
            <p>{copy.hero}</p>
            <div className="ft-actions">
              <Link className="ft-btn" to={href("/register")}>{copy.start}</Link>
              <a className="ft-btn ghost" href="#map">{copy.explore}</a>
            </div>
          </div>
          <div className="ft-shots">
            <figure><img src={shot(language, "crm-list")} alt={copy.altCrm} width="1440" height="900" /></figure>
            <figure><img src={shot(language, "whatsapp")} alt={copy.altWa} width="1440" height="900" /></figure>
            <figure><img src={shot(language, "campaigns")} alt={copy.altCamp} width="1440" height="900" /></figure>
          </div>
        </div>
      </header>

      <section id="map" className="ft-band ft-mint">
        <div className="ft-wrap">
          <h2>{copy.mapTitle}</h2>
          <p>{copy.mapBody}</p>
          <ul className="ft-nav">
            {copy.nav.map(([id, label]: [string, string]) => (
              <li key={id}><a href={`#${id}`}>{label}</a></li>
            ))}
          </ul>
        </div>
      </section>

      {copy.groups.map((group) => (
        <section id={group.id} key={group.id} className={`ft-band ${group.tone || ""}`}>
          <div className="ft-wrap ft-split">
            <div>
              <h2>{group.title}</h2>
              <p>{group.body}</p>
              <div className="ft-cards">
                {group.items.map(([title, text]: [string, string]) => (
                  <article key={title}><h3>{title}</h3><p>{text}</p></article>
                ))}
              </div>
              {group.link ? <p><Link to={href(group.link[0])}>{group.link[1]}</Link></p> : null}
            </div>
            <figure>
              <img src={group.site ? site(language, group.site) : shot(language, group.shot || "dashboard")} alt="" width="1440" height="900" loading="lazy" />
            </figure>
          </div>
        </section>
      ))}

      <section id="automations" className="ft-band ft-soft">
        <div className="ft-wrap">
          <h2>{copy.autoTitle}</h2>
          <p>{copy.autoBody}</p>
          <ol className="ft-flow">
            {copy.autoSteps.map(([title, text]: [string, string], index: number) => (
              <li key={title} className={index === auto ? "is-on" : ""}><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
          <p><Link to={href("/automations")}>{copy.autoLink}</Link></p>
        </div>
      </section>

      <section id="services" className="ft-band ft-services">
        <div className="ft-wrap">
          <h2>{copy.svcTitle}</h2>
          <p>{copy.svcBody}</p>
          <div className="ft-cards">
            {copy.services.map(([title, text, path]: [string, string, string]) => (
              <article key={path}><h3>{title}</h3><p>{text}</p><Link to={href(path)}>{copy.open}</Link></article>
            ))}
          </div>
          <div className="ft-note" style={{ marginTop: 16 }}>
            <h3>{copy.guideTitle}</h3>
            <p>{copy.guideBody}</p>
            <Link to={href("/contact")}>{copy.guideLink}</Link>
          </div>
        </div>
      </section>

      <section id="channels" className="ft-band">
        <div className="ft-wrap">
          <h2>{copy.intTitle}</h2>
          <p>{copy.intBody}</p>
          <div className="ft-cards">
            {copy.integrations.map(([name, text, path]: [string, string, string]) => (
              <article key={name}><h3>{name}</h3><p>{text}</p>{path.startsWith("http") ? <a href={path} rel="noopener noreferrer">{name}</a> : <Link to={href(path)}>{copy.open}</Link>}</article>
            ))}
          </div>
        </div>
      </section>

      <section id="fit" className="ft-band ft-pink">
        <div className="ft-wrap">
          <h2>{copy.fitTitle}</h2>
          <div className="ft-fits">
            {copy.fits.map(([name, text, path]: [string, string, string]) => (
              <Link key={path} to={href(path)}><h3>{name}</h3><p>{text}</p></Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="ft-band">
        <div className="ft-wrap ft-faq">
          <h2>{copy.faqTitle}</h2>
          {copy.faq.map(([q, a]: [string, string]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>

      <section className="ft-end">
        <div className="ft-wrap">
          <h2>{copy.end}</h2>
          <p>{copy.endBody}</p>
          <div className="ft-actions">
            <Link className="ft-btn" to={href("/register")}>{copy.start}</Link>
            <Link className="ft-btn line" to={href("/platform")}>{copy.platform}</Link>
            <Link className="ft-btn line" to={href("/contact")}>{copy.guideLink}</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
