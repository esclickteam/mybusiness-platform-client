import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  coerceSupportedLanguage,
  getHtmlLang,
  getTextDirection,
} from "../../i18n/localeUtils";
import {
  CRM_MEDIA,
  CRM_MEDIA_READY,
  crmAppPath,
  crmPublicUrl,
  getCrmCopy,
} from "../../lib/crmMarketingCopy.mjs";
import "./crmProductPage.css";

const LOCALES = [
  { code: "en", hrefLang: "en", og: "en_US" },
  { code: "he", hrefLang: "he", og: "he_IL" },
  { code: "es", hrefLang: "es", og: "es_ES" },
  { code: "pt-BR", hrefLang: "pt-BR", og: "pt_BR" },
  { code: "ar", hrefLang: "ar", og: "ar_AE" },
];

function DemoVideo({ src, poster, label }) {
  if (!CRM_MEDIA_READY) return null;
  return (
    <figure className="crmx-media">
      <video
        className="crmx-video"
        controls
        muted
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function Shot({ src, mobile, alt, wide = false }) {
  if (!CRM_MEDIA_READY) return null;
  return (
    <figure className={`crmx-shot${wide ? " crmx-shot--wide" : ""}`}>
      <picture>
        {mobile ? <source media="(max-width: 720px)" srcSet={mobile} /> : null}
        <img src={src} alt={alt} width="1600" height="1000" />
      </picture>
    </figure>
  );
}

export default function CrmProductPage() {
  const { i18n } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.resolvedLanguage || i18n.language);
  const copy = getCrmCopy(lang);
  const dir = getTextDirection(lang);
  const htmlLang = getHtmlLang(lang);
  const canonical = crmPublicUrl(lang);
  const og = LOCALES.find((item) => item.code === lang)?.og || "en_US";
  const to = (path) => crmAppPath(lang, path);
  const registerCrm = `${to("/register")}?plan=crm_only`;

  const schema = useMemo(() => {
    const faqs = copy.faq.items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    }));
    const videos = [
      [copy.pipeline.videoAlt, CRM_MEDIA.pipelineVideo, CRM_MEDIA.pipelinePoster],
      [copy.sources.videoAlt, CRM_MEDIA.intakeVideo, CRM_MEDIA.intakePoster],
      [copy.profile.videoAlt, CRM_MEDIA.noteVideo, CRM_MEDIA.notePoster],
      [copy.tasks.videoAlt, CRM_MEDIA.taskVideo, CRM_MEDIA.taskPoster],
    ].map(([name, file, poster]) => ({
      "@type": "VideoObject",
      name,
      description: name,
      thumbnailUrl: `https://bizuply.com${poster}`,
      uploadDate: "2026-10-27",
      contentUrl: `https://bizuply.com${file}`,
      embedUrl: canonical,
    }));
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: copy.title,
          description: copy.description,
          inLanguage: htmlLang,
          isPartOf: { "@type": "WebSite", name: "Bizuply", url: "https://bizuply.com/" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Bizuply", item: "https://bizuply.com/" },
            { "@type": "ListItem", position: 2, name: copy.crumb, item: canonical },
          ],
        },
        {
          "@type": "SoftwareApplication",
          name: "Bizuply CRM",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: canonical,
          description: copy.description,
          offers: [
            { "@type": "Offer", name: "CRM Only", price: "49", priceCurrency: "USD" },
            { "@type": "Offer", name: "Bizuply Business", price: "99", priceCurrency: "USD" },
            { "@type": "Offer", name: "Bizuply Business yearly", price: "990", priceCurrency: "USD" },
          ],
        },
        { "@type": "FAQPage", inLanguage: htmlLang, mainEntity: faqs },
        ...videos,
      ],
    };
  }, [canonical, copy, htmlLang]);

  return (
    <div className="crmx" dir={dir} lang={htmlLang}>
      <Helmet>
        <html lang={htmlLang} dir={dir} />
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:locale" content={og} />
        {LOCALES.filter((item) => item.og !== og).map((item) => (
          <meta key={item.og} property="og:locale:alternate" content={item.og} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={copy.title} />
        <meta name="twitter:description" content={copy.description} />
        {LOCALES.map((item) => (
          <link key={item.hrefLang} rel="alternate" hrefLang={item.hrefLang} href={crmPublicUrl(item.code)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://bizuply.com/crm" />
        <link rel="preload" as="image" href={CRM_MEDIA.hero} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section className="crmx-hero">
        <div className="crmx-wrap crmx-hero__grid">
          <div>
            <p className="crmx-eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.h1}</h1>
            <p className="crmx-lead">{copy.hero.description}</p>
            <div className="crmx-actions">
              <Link className="crmx-btn crmx-btn--light" to={registerCrm}>{copy.hero.primary}</Link>
              <a className="crmx-btn crmx-btn--ghost" href="#crm-pipeline">{copy.hero.secondary}</a>
            </div>
            <ul className="crmx-points">
              {copy.hero.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
          <Shot src={CRM_MEDIA.hero} mobile={CRM_MEDIA.heroMobile} alt={copy.hero.imageAlt} />
        </div>
      </section>

      <section className="crmx-band crmx-band--white">
        <div className="crmx-wrap">
          <h2>{copy.what.h2}</h2>
          <p>{copy.what.p1}</p>
          <p>{copy.what.p2}</p>
          <h3>{copy.what.h3}</h3>
          <p>{copy.what.p3}</p>
          <div className="crmx-cards crmx-cards--4">
            {copy.what.cards.map(([title, text]) => (
              <article key={title} className="crmx-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="crmx-band crmx-band--mist" id="crm-pipeline">
        <div className="crmx-wrap">
          <h2>{copy.pipeline.h2}</h2>
          <p>{copy.pipeline.p}</p>
          <ol className="crmx-stages">
            {copy.pipeline.stages.map(([name, text], index) => (
              <li key={name}>
                <span>{index + 1}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="crmx-journey">
            <strong>{copy.pipeline.journeyLabel}</strong>
            <span>{copy.pipeline.journey}</span>
          </p>
          <DemoVideo src={CRM_MEDIA.pipelineVideo} poster={CRM_MEDIA.pipelinePoster} label={copy.pipeline.videoCaption} />
        </div>
      </section>

      <section className="crmx-band crmx-band--navy">
        <div className="crmx-wrap">
          <h2>{copy.sources.h2}</h2>
          <p>{copy.sources.p}</p>
          <div className="crmx-cards crmx-cards--3">
            {copy.sources.cards.map(([title, text]) => (
              <article key={title} className="crmx-card crmx-card--dark">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="crmx-flow" aria-label={copy.sources.diagramTitle}>
            <p className="crmx-flow__title">{copy.sources.diagramTitle}</p>
            <div className="crmx-flow__sources">
              {(copy.sources.diagramSources || copy.sources.sourceNames || []).map((name) => <span key={name}>{name}</span>)}
            </div>
            <span className="crmx-flow__target">{copy.sources.diagramTarget}</span>
          </div>
          <p>{copy.sources.note}</p>
          <p className="crmx-links">
            {(copy.sources.links || []).map(([label, href], index) => (
              <React.Fragment key={href}>
                {index ? " · " : null}
                {String(href).startsWith("http") ? <a href={href}>{label}</a> : <Link to={to(href)}>{label}</Link>}
              </React.Fragment>
            ))}
            {" · "}
            <Link to={to("/automations")}>{copy.chrome?.automations || "Automations"}</Link>
            {" · "}
            <Link to={to("/appointments")}>{copy.chrome?.appointments || "Appointments"}</Link>
            {" · "}
            <Link to={to("/features")}>Bizuply</Link>
          </p>
          <DemoVideo src={CRM_MEDIA.intakeVideo} poster={CRM_MEDIA.intakePoster} label={copy.sources.videoCaption} />
        </div>
      </section>

      <section className="crmx-band crmx-band--white">
        <div className="crmx-wrap crmx-split">
          <div>
            <h2>{copy.profile.h2}</h2>
            <p>{copy.profile.p}</p>
            <ul className="crmx-list">
              {copy.profile.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>{copy.profile.closing}</p>
          </div>
          <Shot src={CRM_MEDIA.profile} mobile={CRM_MEDIA.profileMobile} alt={copy.profile.imageAlt} wide />
        </div>
        <div className="crmx-wrap">
          <DemoVideo src={CRM_MEDIA.noteVideo} poster={CRM_MEDIA.notePoster} label={copy.profile.videoCaption} />
        </div>
      </section>

      <section className="crmx-band crmx-band--slate">
        <div className="crmx-wrap">
          <h2>{copy.tasks.h2}</h2>
          <p>{copy.tasks.p}</p>
          <div className="crmx-cards crmx-cards--3">
            {copy.tasks.cards.map(([title, text]) => (
              <article key={title} className="crmx-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <DemoVideo src={CRM_MEDIA.taskVideo} poster={CRM_MEDIA.taskPoster} label={copy.tasks.videoCaption} />
        </div>
      </section>

      <section className="crmx-band crmx-band--white">
        <div className="crmx-wrap">
          <h2>{copy.appointments.h2}</h2>
          <p>{copy.appointments.p}</p>
          <div className="crmx-cards crmx-cards--3">
            {copy.appointments.cards.map(([title, text]) => (
              <article key={title} className="crmx-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="crmx-note">{copy.appointments.planNote}</p>
          <p><Link className="crmx-textlink" to={to("/appointments")}>{copy.appointments.link}</Link></p>
          <Shot src={CRM_MEDIA.appointments} alt={copy.appointments.imageAlt} wide />
        </div>
      </section>

      <section className="crmx-band crmx-band--navy">
        <div className="crmx-wrap">
          <h2>{copy.dashboard.h2}</h2>
          <p>{copy.dashboard.p}</p>
          <div className="crmx-cards crmx-cards--4">
            {copy.dashboard.cards.map(([title, text]) => (
              <article key={title} className="crmx-card crmx-card--dark">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <Shot src={CRM_MEDIA.dashboard} mobile={CRM_MEDIA.dashboardMobile} alt={copy.dashboard.imageAlt} wide />
        </div>
      </section>

      <section className="crmx-band crmx-band--white">
        <div className="crmx-wrap">
          <h2>{copy.audiences.h2}</h2>
          <div className="crmx-cards crmx-cards--4">
            {copy.audiences.cards.map(([title, text, example]) => (
              <article key={title} className="crmx-card">
                <h3>{title}</h3>
                <p>{text}</p>
                <p className="crmx-example">{example}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="crmx-band crmx-band--mist">
        <div className="crmx-wrap">
          <h2>{copy.sheet.h2}</h2>
          <p>{copy.sheet.p}</p>
          <div className="crmx-table-wrap">
            <table className="crmx-table">
              <caption className="crmx-sr">{copy.sheet.h2}</caption>
              <thead>
                <tr>
                  {(copy.sheet.headers || copy.sheet.columns || []).map((header) => <th key={header} scope="col">{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {copy.sheet.rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td data-label={(copy.sheet.headers || copy.sheet.columns)[1]}>{row[1]}</td>
                    <td data-label={(copy.sheet.headers || copy.sheet.columns)[2]}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="crmx-band crmx-band--white" id="crm-pricing">
        <div className="crmx-wrap">
          <h2>{copy.pricing.h2}</h2>
          <div className="crmx-plans">
            <article className="crmx-plan">
              <h3>{copy.pricing.crmName}</h3>
              <p className="crmx-price"><strong>{copy.pricing.crmPrice}</strong> <span>{copy.pricing.crmPeriod}</span></p>
              <p>{copy.pricing.crmText}</p>
              <ul>
                {copy.pricing.crmFeatures.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <p className="crmx-excludes">{copy.pricing.crmExcludes}</p>
              <Link className="crmx-btn crmx-btn--navy" to={registerCrm}>{copy.pricing.crmCta}</Link>
            </article>
            <article className="crmx-plan crmx-plan--featured">
              <h3>{copy.pricing.businessName}</h3>
              <p className="crmx-price"><strong>{copy.pricing.businessPrice}</strong> <span>{copy.pricing.businessPeriod}</span></p>
              <p className="crmx-price-alt">{copy.pricing.businessAlt}</p>
              <p>{copy.pricing.businessText}</p>
              <ul>
                {copy.pricing.businessFeatures.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <Link className="crmx-btn crmx-btn--navy" to={to("/pricing")}>{copy.pricing.businessCta}</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="crmx-band crmx-band--mist" id="crm-faq">
        <div className="crmx-wrap crmx-faq">
          <h2>{copy.faq.h2}</h2>
          {copy.faq.items.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="crmx-final">
        <div className="crmx-wrap">
          <h2>{copy.final.h2}</h2>
          <p>{copy.final.p}</p>
          <div className="crmx-actions">
            <Link className="crmx-btn crmx-btn--light" to={registerCrm}>{copy.final.primary}</Link>
            <Link className="crmx-btn crmx-btn--ghost" to={to("/features")}>{copy.final.secondary}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
