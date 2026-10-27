import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  coerceSupportedLanguage,
  getHtmlLang,
  getTextDirection,
} from "../i18n/localeUtils";
import {
  AudienceArt,
  CommitmentMark,
  DifferenceIcon,
  HeroComposition,
  PeopleConstellation,
  PrincipleIcon,
  StepMark,
  WorkspaceComposition,
} from "../components/about/AboutVisuals";
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

const PRINCIPLES = [
  ["clarity", "principle1Title", "principle1Text"],
  ["connection", "principle2Title", "principle2Text"],
  ["practicality", "principle3Title", "principle3Text"],
];

const JOURNEY = ["journey1", "journey2", "journey3", "journey4", "journey5"];

const STEPS = [
  ["step1Title", "step1Text"],
  ["step2Title", "step2Text"],
  ["step3Title", "step3Text"],
  ["step4Title", "step4Text"],
];

const AUDIENCES = [1, 2, 3, 4];

const DIFFERENCES = [
  ["tools", "diff1Title", "diff1Text"],
  ["start", "diff2Title", "diff2Text"],
  ["flow", "diff3Title", "diff3Text"],
  ["services", "diff4Title", "diff4Text"],
];

const FAQS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function pageUrl(code) {
  return marketingPublicUrl(PAGE_PATH, code);
}

function AboutLink({ to, className, children, external = false }) {
  if (external) {
    return (
      <a className={className} href={to}>
        {children}
      </a>
    );
  }
  if (String(to).startsWith("#")) {
    return (
      <a className={className} href={to}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.resolvedLanguage || i18n.language);
  const dir = getTextDirection(lang);
  const htmlLang = getHtmlLang(lang);
  const canonical = pageUrl(lang);
  const activeOg = LOCALES.find((item) => item.code === lang)?.og || "en_US";

  const related = [
    { href: "/", label: t("about.linkHome") },
    { href: "/features", label: t("about.linkPlatform") },
    { href: "/crm", label: t("about.linkCrm") },
    { href: "/website-builder", label: t("about.linkWebsite") },
    { href: "/appointments", label: t("about.linkAppointments") },
    { href: "/automations", label: t("about.linkAutomations") },
    { href: "https://whatsapp.bizuply.com", label: t("about.linkWhatsapp"), external: true },
    { href: "/pricing", label: t("about.linkPricing") },
    { href: "/contact", label: t("about.linkContact") },
  ];

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

      <section className="about-band about-band--navy about-hero">
        <div className="about-wrap about-hero-grid">
          <div className="about-hero-copy">
            <nav className="about-crumb" aria-label={t("about.crumbAria")}>
              <Link to="/">{t("about.linkHome")}</Link>
              <span aria-hidden="true">/</span>
              <span>{t("about.crumbAbout")}</span>
            </nav>
            <p className="about-kicker">{t("about.badge")}</p>
            <h1>{t("about.heroTitle")}</h1>
            <p className="about-lead">{t("about.heroLead")}</p>
            <p className="about-support">{t("about.heroSupport")}</p>
            <div className="about-actions">
              <AboutLink className="about-btn about-btn--light" to="/features">
                {t("about.ctaExplorePlatform")}
              </AboutLink>
              <AboutLink className="about-btn about-btn--ghost" to="#who">
                {t("about.ctaGetToKnow")}
              </AboutLink>
            </div>
          </div>
          <HeroComposition label={t("about.heroVisualAlt")} />
        </div>
      </section>

      <section className="about-band about-band--white" id="who">
        <div className="about-wrap about-split">
          <div className="about-split__title">
            <h2>{t("about.whoTitle")}</h2>
          </div>
          <div className="about-split__copy about-prose">
            <p>{t("about.whoP1")}</p>
            <p>{t("about.whoP2")}</p>
            <p>{t("about.whoP3")}</p>
          </div>
          <div className="about-split__visual">
            <WorkspaceComposition label={t("about.whoVisualAlt")} />
          </div>
        </div>
      </section>

      <section className="about-band about-band--mist">
        <div className="about-wrap">
          <h2 className="about-section-title">{t("about.missionTitle")}</h2>
          <div className="about-prose about-prose--narrow">
            <p>{t("about.missionP1")}</p>
            <p>{t("about.missionP2")}</p>
            <p>{t("about.missionP3")}</p>
          </div>
          <ul className="about-principles">
            {PRINCIPLES.map(([icon, titleKey, textKey]) => (
              <li key={titleKey}>
                <PrincipleIcon name={icon} />
                <h3>{t(`about.${titleKey}`)}</h3>
                <p>{t(`about.${textKey}`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-band about-band--navy">
        <div className="about-wrap about-why">
          <div className="about-prose">
            <h2>{t("about.whyTitle")}</h2>
            <p>{t("about.whyP1")}</p>
            <p>{t("about.whyP2")}</p>
            <p>{t("about.whyP3")}</p>
          </div>
          <ol className="about-journey" aria-label={t("about.journeyAria")}>
            {JOURNEY.map((key, index) => (
              <li key={key} style={{ "--step": index }}>
                <span>{t(`about.${key}`)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-band about-band--white">
        <div className="about-wrap">
          <h2 className="about-section-title">{t("about.approachTitle")}</h2>
          <p className="about-intro">{t("about.approachIntro")}</p>
          <ol className="about-steps">
            {STEPS.map(([titleKey, textKey], index) => (
              <li key={titleKey} className="about-step">
                <span className="about-step-index">{String(index + 1).padStart(2, "0")}</span>
                <StepMark index={index} />
                <h3>{t(`about.${titleKey}`)}</h3>
                <p>{t(`about.${textKey}`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-band about-band--cloud">
        <div className="about-wrap">
          <h2 className="about-section-title">{t("about.audiencesTitle")}</h2>
          <p className="about-intro">{t("about.audiencesIntro")}</p>
          <ul className="about-audiences">
            {AUDIENCES.map((n) => (
              <li key={n}>
                <AudienceArt index={n - 1} label={t(`about.audience${n}Alt`)} />
                <h3>{t(`about.audience${n}Title`)}</h3>
                <p>{t(`about.audience${n}Text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-band about-band--navy">
        <div className="about-wrap about-people">
          <div className="about-prose">
            <h2>{t("about.peopleTitle")}</h2>
            <p>{t("about.peopleP1")}</p>
            <p>{t("about.peopleP2")}</p>
          </div>
          <PeopleConstellation label={t("about.peopleVisualAlt")} />
        </div>
      </section>

      <section className="about-band about-band--white">
        <div className="about-wrap">
          <h2 className="about-section-title">{t("about.differentTitle")}</h2>
          <p className="about-intro">{t("about.differentIntro")}</p>
          <ul className="about-diffs">
            {DIFFERENCES.map(([icon, titleKey, textKey]) => (
              <li key={titleKey}>
                <DifferenceIcon name={icon} />
                <h3>{t(`about.${titleKey}`)}</h3>
                <p>{t(`about.${textKey}`)}</p>
              </li>
            ))}
          </ul>
          <div className="about-actions">
            <AboutLink className="about-btn about-btn--navy" to="/solutions">
              {t("about.ctaSolutions")}
            </AboutLink>
          </div>
        </div>
      </section>

      <section className="about-band about-band--mist">
        <div className="about-wrap about-commitment">
          <div>
            <div className="about-rule" aria-hidden="true" />
            <h2>{t("about.commitmentTitle")}</h2>
            <div className="about-prose">
              <p>{t("about.commitmentP1")}</p>
              <p>{t("about.commitmentP2")}</p>
            </div>
            <nav className="about-related" aria-label={t("about.relatedAria")}>
              {related.map((item) => (
                <AboutLink
                  key={item.href}
                  to={item.href}
                  external={item.external}
                  className="about-related__link"
                >
                  {item.label}
                </AboutLink>
              ))}
            </nav>
          </div>
          <CommitmentMark label={t("about.commitmentVisualAlt")} />
        </div>
      </section>

      <section className="about-band about-band--cloud" id="faq">
        <div className="about-wrap about-faq-wrap">
          <h2 className="about-section-title">{t("about.faqTitle")}</h2>
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

      <section className="about-band about-final">
        <div className="about-wrap about-final-inner">
          <h2>{t("about.finalTitle")}</h2>
          <p>{t("about.finalText")}</p>
          <div className="about-actions">
            <AboutLink className="about-btn about-btn--light" to="/features">
              {t("about.ctaExplore")}
            </AboutLink>
            <AboutLink className="about-btn about-btn--lilac" to="/register">
              {t("about.ctaStart")}
            </AboutLink>
            <AboutLink className="about-btn about-btn--ghost" to="/contact">
              {t("about.ctaContact")}
            </AboutLink>
          </div>
        </div>
      </section>
    </div>
  );
}
