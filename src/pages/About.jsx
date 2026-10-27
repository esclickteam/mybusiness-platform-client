import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  coerceSupportedLanguage,
  getHtmlLang,
  getTextDirection,
} from "../i18n/localeUtils";
import { marketingPublicUrl } from "../lib/localePathCore.mjs";
import "../styles/About.css";

const ORIGIN = "https://bizuply.com";
const PAGE_PATH = "/about";
const OG_IMAGE = `${ORIGIN}/images/about/og.png`;
const LOGO = `${ORIGIN}/android-chrome-512x512.png`;

const LOCALES = [
  { code: "en", hrefLang: "en", og: "en_US" },
  { code: "he", hrefLang: "he", og: "he_IL" },
  { code: "es", hrefLang: "es", og: "es_ES" },
  { code: "pt-BR", hrefLang: "pt-BR", og: "pt_BR" },
  { code: "ar", hrefLang: "ar", og: "ar_AE" },
];

const JOURNEY = ["journey1", "journey2", "journey3", "journey4", "journey5"];
const AUDIENCES = [1, 2, 3, 4, 5, 6];
const FAQS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PRODUCTS = [
  ["crm", "/crm"],
  ["whatsapp", "/whatsapp-api"],
  ["marketing", "/meta-campaigns"],
  ["automations", "/automations"],
  ["website", "/website-builder"],
  ["appointments", "/appointments"],
  ["collaborations", "/collaborations"],
  ["agents", "/agents"],
  ["saas", "/saas"],
  ["templates", "/website-builder"],
];

function pageUrl(code) {
  return marketingPublicUrl(PAGE_PATH, code);
}

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.resolvedLanguage || i18n.language);
  const dir = getTextDirection(lang);
  const htmlLang = getHtmlLang(lang);
  const canonical = pageUrl(lang);
  const activeOg = LOCALES.find((item) => item.code === lang)?.og || "en_US";

  const schema = useMemo(() => {
    const orgId = `${ORIGIN}/#organization`;
    const faqs = FAQS.map((n) => ({
      "@type": "Question",
      name: t(`about.faq${n}q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`about.faq${n}a`),
      },
    }));

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": orgId,
          name: "Bizuply",
          legalName: "Bizuply LLC",
          url: ORIGIN,
          logo: LOGO,
          description: t("about.whoP1"),
          sameAs: [
            "https://www.facebook.com/bizuply",
            "https://www.instagram.com/bizuply",
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "support@bizuply.com",
              url: `${ORIGIN}/contact`,
              availableLanguage: ["English", "Hebrew", "Spanish", "Portuguese", "Arabic"],
            },
          ],
        },
        {
          "@type": "WebSite",
          "@id": `${ORIGIN}/#website`,
          url: ORIGIN,
          name: "Bizuply",
          publisher: { "@id": orgId },
          inLanguage: ["en", "he", "es", "pt-BR", "ar"],
        },
        {
          "@type": "AboutPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: t("about.seoTitle"),
          description: t("about.seoDescription"),
          inLanguage: htmlLang,
          isPartOf: { "@id": `${ORIGIN}/#website` },
          about: { "@id": orgId },
          publisher: { "@id": orgId },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: OG_IMAGE,
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: t("about.linkHome"),
              item: ORIGIN,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: t("about.crumbAbout"),
              item: canonical,
            },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${canonical}#faq`,
          url: canonical,
          inLanguage: htmlLang,
          mainEntity: faqs,
        },
      ],
    };
  }, [canonical, htmlLang, t]);

  useEffect(() => {
    document.title = t("about.seoTitle");
    const upsert = (selector, create) => {
      let node = document.head.querySelector(selector);
      if (!node) {
        node = create();
        node.setAttribute("data-about-seo", "true");
        document.head.appendChild(node);
      }
      return node;
    };
    const description = upsert('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      return meta;
    });
    description.setAttribute("content", t("about.seoDescription"));
    const canonicalLink = upsert('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      return link;
    });
    canonicalLink.setAttribute("href", canonical);
    document.querySelectorAll('link[data-about-hreflang="true"]').forEach((node) => node.remove());
    const alternates = [
      ...LOCALES.map((item) => [item.hrefLang, pageUrl(item.code)]),
      ["x-default", `${ORIGIN}${PAGE_PATH}`],
    ];
    alternates.forEach(([hrefLang, href]) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hrefLang;
      link.href = href;
      link.setAttribute("data-about-hreflang", "true");
      document.head.appendChild(link);
    });
    const og = {
      "og:title": t("about.ogTitle"),
      "og:description": t("about.ogDescription"),
      "og:url": canonical,
      "og:type": "website",
      "og:site_name": "Bizuply",
      "og:image": OG_IMAGE,
      "og:image:alt": t("about.ogImageAlt"),
      "og:locale": activeOg,
    };
    const touched = [];
    Object.entries(og).forEach(([property, content]) => {
      const meta = upsert(`meta[property="${property}"]`, () => {
        const node = document.createElement("meta");
        node.setAttribute("property", property);
        return node;
      });
      if (!meta.hasAttribute("data-about-prev")) {
        meta.setAttribute("data-about-prev", meta.getAttribute("content") || "");
      }
      meta.setAttribute("content", content);
      touched.push(meta);
    });
    let ld = document.getElementById("about-page-ld");
    if (!ld) {
      ld = document.createElement("script");
      ld.id = "about-page-ld";
      ld.type = "application/ld+json";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(schema);
    return () => {
      touched.forEach((meta) => {
        if (meta.hasAttribute("data-about-prev")) {
          meta.setAttribute("content", meta.getAttribute("data-about-prev") || "");
          meta.removeAttribute("data-about-prev");
        }
      });
      document.querySelectorAll('link[data-about-hreflang="true"]').forEach((node) => node.remove());
      document.getElementById("about-page-ld")?.remove();
    };
  }, [activeOg, canonical, schema, t]);

  return (
    <div className="about-page" dir={dir} lang={htmlLang}>
      <Helmet>
        <html lang={htmlLang} dir={dir} />
        <title>{t("about.seoTitle")}</title>
        <meta name="description" content={t("about.seoDescription")} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("about.ogTitle")} />
        <meta property="og:description" content={t("about.ogDescription")} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:locale" content={activeOg} />
        {LOCALES.filter((item) => item.og !== activeOg).map((item) => (
          <meta key={item.og} property="og:locale:alternate" content={item.og} />
        ))}
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content={t("about.ogImageAlt")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("about.ogTitle")} />
        <meta name="twitter:description" content={t("about.ogDescription")} />
        <meta name="twitter:image" content={OG_IMAGE} />
        {LOCALES.map((item) => (
          <link
            key={item.hrefLang}
            rel="alternate"
            hrefLang={item.hrefLang}
            href={pageUrl(item.code)}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${ORIGIN}${PAGE_PATH}`} />
        {lang === "ar" ? (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap"
          />
        ) : null}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section className="about-hero">
        <div className="about-hero__glow" aria-hidden="true" />
        <div className="about-wrap about-hero__grid">
          <div className="about-hero__copy">
            <nav className="about-crumb" aria-label={t("about.crumbAria")}>
              <Link to="/">{t("about.linkHome")}</Link>
              <span aria-hidden="true">/</span>
              <span>{t("about.crumbAbout")}</span>
            </nav>
            <p className="about-kicker">{t("about.badge")}</p>
            <h1>{t("about.heroTitle")}</h1>
            <p className="about-lead">{t("about.heroLead")}</p>
            <p className="about-note">{t("about.heroNote")}</p>
            <div className="about-actions">
              <Link className="about-btn about-btn--light" to="/platform">
                {t("about.ctaExplore")}
              </Link>
              <a className="about-btn about-btn--ghost" href="#company">
                {t("about.ctaStory")}
              </a>
            </div>
          </div>
          <div className="about-stage">
            <img
              className="about-shot about-shot--back"
              src="/images/about/shot-campaigns.webp"
              alt={t("about.altCampaigns")}
              width="1600"
              height="900"
            />
            <img
              className="about-shot about-shot--main"
              src="/images/about/shot-whatsapp.webp"
              alt={t("about.altWhatsapp")}
              width="1600"
              height="900"
            />
            <img
              className="about-shot about-shot--front"
              src="/images/about/shot-calendar.webp"
              alt={t("about.altCalendar")}
              width="1600"
              height="900"
            />
          </div>
        </div>
      </section>

      <section className="about-band about-band--white" id="company">
        <div className="about-wrap about-story">
          <div className="about-story__copy">
            <p className="about-kicker about-kicker--ink">{t("about.whoKicker")}</p>
            <h2>{t("about.whoTitle")}</h2>
            <p>{t("about.whoP1")}</p>
            <p>{t("about.whoP2")}</p>
            <p>{t("about.whoP3")}</p>
          </div>
          <figure className="about-story__figure">
            <img
              src="/images/about/shot-editor.webp"
              alt={t("about.altEditor")}
              width="1600"
              height="900"
            />
            <figcaption>{t("about.editorCaption")}</figcaption>
          </figure>
        </div>
      </section>

      <section className="about-band about-band--mist">
        <div className="about-wrap">
          <div className="about-belief">
            <div>
              <h2>{t("about.beliefTitle")}</h2>
              <p>{t("about.beliefP1")}</p>
            </div>
            <p className="about-belief__aside">{t("about.beliefP2")}</p>
          </div>
          <ol className="about-axis" aria-label={t("about.journeyAria")}>
            {JOURNEY.map((key, index) => (
              <li key={key}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{t(`about.${key}`)}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-band about-band--white" id="work">
        <div className="about-wrap">
          <header className="about-center">
            <h2>{t("about.ecosystemTitle")}</h2>
            <p>{t("about.ecosystemLead")}</p>
          </header>
          <ul className="about-ecosystem">
            {PRODUCTS.map(([id, href]) => (
              <li key={id}>
                <Link to={href}>
                  <strong>{t(`about.product.${id}.name`)}</strong>
                  <span>{t(`about.product.${id}.text`)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-band about-band--navy">
        <div className="about-wrap about-split-dark">
          <div>
            <h2>{t("about.differenceTitle")}</h2>
            <p>{t("about.differenceLead")}</p>
          </div>
          <div className="about-contrast">
            <article>
              <h3>{t("about.diffPlatformTitle")}</h3>
              <p>{t("about.diffPlatformText")}</p>
            </article>
            <article>
              <h3>{t("about.diffDedicatedTitle")}</h3>
              <p>{t("about.diffDedicatedText")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-band about-band--cloud" id="offer">
        <div className="about-wrap">
          <h2 className="about-center__title">{t("about.offersTitle")}</h2>
          <div className="about-offers">
            <article className="about-offer about-offer--photo">
              <img
                src="/images/about/shot-automations.webp"
                alt={t("about.altAutomations")}
                width="1600"
                height="900"
              />
              <div>
                <h3>{t("about.offerPlatformTitle")}</h3>
                <p>{t("about.offerPlatformText")}</p>
                <Link to="/platform">{t("about.offerPlatformLink")}</Link>
              </div>
            </article>
            <article className="about-offer about-offer--navy">
              <p className="about-kicker">{t("about.offerSaasKicker")}</p>
              <h3>{t("about.offerSaasTitle")}</h3>
              <p>{t("about.offerSaasText")}</p>
              <Link to="/saas">{t("about.offerSaasLink")}</Link>
            </article>
            <article className="about-offer about-offer--line">
              <p className="about-kicker about-kicker--ink">{t("about.offerServicesKicker")}</p>
              <h3>{t("about.offerServicesTitle")}</h3>
              <p>{t("about.offerServicesText")}</p>
              <Link to="/services">{t("about.offerServicesLink")}</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="about-band about-band--white">
        <div className="about-wrap">
          <div className="about-audience-head">
            <h2>{t("about.audiencesTitle")}</h2>
            <p>{t("about.audiencesIntro")}</p>
          </div>
          <ul className="about-audiences">
            {AUDIENCES.map((n) => (
              <li key={n}>
                <h3>{t(`about.audience${n}Title`)}</h3>
                <p>{t(`about.audience${n}Text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-band about-band--mist">
        <div className="about-wrap about-people">
          <div>
            <h2>{t("about.peopleTitle")}</h2>
            <p>{t("about.peopleP1")}</p>
          </div>
          <div className="about-people__note">
            <p>{t("about.peopleP2")}</p>
            <p>
              <a href="mailto:support@bizuply.com">support@bizuply.com</a>
            </p>
          </div>
        </div>
      </section>

      <section className="about-band about-band--white" id="faq">
        <div className="about-wrap about-faq-wrap">
          <h2>{t("about.faqTitle")}</h2>
          <div className="about-faq">
            {FAQS.map((n) => (
              <details key={n} className="about-faq-item">
                <summary>
                  <h3>{t(`about.faq${n}q`)}</h3>
                </summary>
                <p>{t(`about.faq${n}a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="about-close">
        <div className="about-wrap about-close__inner">
          <h2>{t("about.finalTitle")}</h2>
          <p>{t("about.finalText")}</p>
          <div className="about-actions">
            <Link className="about-btn about-btn--light" to="/platform">
              {t("about.ctaExplore")}
            </Link>
            <Link className="about-btn about-btn--ghost" to="/contact">
              {t("about.ctaContact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
