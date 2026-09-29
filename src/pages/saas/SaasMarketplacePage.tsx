import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { fetchMarketplace } from "../../saas/api";
import {
  buildWhatsappLink,
  MixedText,
  SaasFooter,
  SaasHeader,
  SaasSeo,
  StickyActions,
  useSaasLocale,
  WhatsAppDock,
} from "../../saas/chrome";
import { filterProducts, MARKETPLACE_CATEGORIES, type SaasModelId, type SaasProduct } from "../../saas/logic";
import { DemoTheater, FaqList, LeadDialog, messageFor, type LeadSeed } from "../../saas/sections";
import {
  GlobeSection,
  HeroStage,
  LaunchPicker,
  ProductRow,
  StorySection,
  TrustStrip,
  WhySection,
} from "../../saas/stage";
import "../../saas/saas.css";

export default function SaasMarketplacePage() {
  const { t, dir, htmlLang } = useSaasLocale();
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const [products, setProducts] = useState<SaasProduct[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lead, setLead] = useState<LeadSeed | null>(null);
  const [demo, setDemo] = useState<SaasProduct | null>(null);

  useEffect(() => {
    let active = true;
    fetchMarketplace()
      .then((data) => {
        if (!active) return;
        setProducts(data.products || []);
        setWhatsapp(data.settings?.whatsappE164 || "");
        setError("");
      })
      .catch(() => {
        if (active) setError(t("saasMarket.platforms.error"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    if (reduce || paused || products.length < 2) return;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % products.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, products.length, reduce]);

  const visible = useMemo(() => filterProducts(products, category), [products, category]);
  const hero = products[heroIndex] || products[0];
  const wa = buildWhatsappLink(whatsapp, messageFor(t, hero?.name || "Bizuply", "partner"));

  function setCategory(next: string) {
    const query = new URLSearchParams(params);
    if (!next || next === "all") query.delete("category");
    else query.set("category", next);
    setParams(query, { replace: true });
  }

  function openLead(seed: Partial<LeadSeed> & { ctaSource: string }) {
    const model = (seed.model || "partner") as SaasModelId;
    setLead({
      slug: seed.slug || hero?.slug || products[0]?.slug || "",
      model,
      ctaSource: seed.ctaSource,
      country: seed.country,
    });
  }

  return (
    <div className="saas-market min-h-screen pb-24 lg:pb-0" dir={dir} lang={htmlLang}>
      <SaasSeo title={t("saasMarket.seoTitle")} description={t("saasMarket.seoDescription")} />
      <SaasHeader tone="dark" onTalk={() => openLead({ ctaSource: "talk_to_us" })} />
      <main>
        <section
          id="top"
          className="saas-hero"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="saas-hero-grid">
            <div className="saas-hero-copy">
              <p className="saas-kicker saas-kicker-light">{t("saasMarket.hero.eyebrow")}</p>
              <h1>
                <MixedText value={t("saasMarket.hero.title")} />
              </h1>
              <p className="saas-hero-sub">
                <MixedText value={t("saasMarket.hero.subtitle")} />
              </p>
              <div className="saas-hero-actions">
                <a className="saas-btn" href="#platforms">
                  {t("saasMarket.hero.viewPlatforms")}
                </a>
                <button type="button" className="saas-btn saas-btn-ghost saas-btn-demo" onClick={() => hero && setDemo(hero)}>
                  {t("saasMarket.hero.watchDemo")}
                </button>
                <a className="saas-btn saas-btn-ghost" href="#models">
                  {t("saasMarket.hero.exploreModels")}
                </a>
              </div>
            </div>
            <HeroStage products={products} index={hero ? products.indexOf(hero) : 0} onSelect={setHeroIndex} />
          </div>
        </section>

        <TrustStrip />
        <StorySection />
        <WhySection />

        <section id="platforms" className="saas-band saas-tone-mist">
          <div className="saas-wrap">
            <motion.div {...sectionRise(reduce)}>
            <p className="saas-kicker">{t("saasMarket.platforms.eyebrow")}</p>
            <h2 className="saas-title">
              <MixedText value={t("saasMarket.platforms.title")} />
            </h2>
            <p className="saas-lead">{t("saasMarket.platforms.subtitle")}</p>
            <div className="saas-filters">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                {t("saasMarket.platforms.all")}
              </FilterChip>
              {MARKETPLACE_CATEGORIES.map((item) => (
                <FilterChip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
                  {t(`saasMarket.categories.${item.id}`, { defaultValue: item.label })}
                </FilterChip>
              ))}
            </div>
            </motion.div>
            {error ? <p className="saas-status">{error}</p> : null}
            {loading ? <p className="saas-status">{t("saasMarket.platforms.loading")}</p> : null}
            {!loading && !error && visible.length === 0 ? <p className="saas-status">{t("saasMarket.platforms.empty")}</p> : null}
            <div className="saas-catalog">
              {visible.map((product, index) => (
                <ProductRow key={product.slug} product={product} flipped={index % 2 === 1} index={index} onDemo={setDemo} />
              ))}
            </div>
          </div>
        </section>

        <LaunchPicker onApply={(model, cta) => openLead({ model, ctaSource: cta, slug: hero?.slug })} />
        <GlobeSection products={products} initialSlug={hero?.slug} onRequest={(seed) => setLead(seed)} />
        <FaqList wide />

        <section id="close" className="saas-final">
          <motion.div className="saas-wrap" {...sectionRise(reduce)}>
            <h2>
              <MixedText value={t("saasMarket.closing.title")} />
            </h2>
            <p>
              <MixedText value={t("saasMarket.closing.subtitle")} />
            </p>
            <div className="saas-hero-actions">
              <a className="saas-btn" href="#platforms">
                {t("saasMarket.hero.viewPlatforms")}
              </a>
              <button type="button" className="saas-btn saas-btn-ghost" onClick={() => openLead({ ctaSource: "talk_to_us" })}>
                {t("saasMarket.closing.talk")}
              </button>
              {wa ? (
                <a className="saas-btn saas-btn-wa" href={wa} target="_blank" rel="noreferrer">
                  {t("saasMarket.closing.whatsapp")}
                </a>
              ) : (
                <button type="button" className="saas-btn saas-btn-wa" onClick={() => openLead({ ctaSource: "whatsapp" })}>
                  {t("saasMarket.closing.whatsapp")}
                </button>
              )}
            </div>
          </motion.div>
        </section>

      </main>
      <SectionRail />
      <SaasFooter tone="dark" />
      <WhatsAppDock href={wa} />
      <StickyActions
        items={[
          { label: t("saasMarket.sticky.platforms"), href: "#platforms" },
          { label: t("saasMarket.sticky.models"), href: "#models" },
          { label: t("saasMarket.sticky.demo"), onClick: () => hero && setDemo(hero) },
          { label: t("saasMarket.sticky.talk"), onClick: () => openLead({ ctaSource: "talk_to_us" }) },
        ]}
      />
      <LeadDialog seed={lead} products={products} onClose={() => setLead(null)} />
      <DemoTheater product={demo} onClose={() => setDemo(null)} />
    </div>
  );
}

function sectionRise(reduce: boolean | null) {
  if (reduce || typeof IntersectionObserver === "undefined") return {};
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };
}

const RAIL_IDS = ["top", "what-is-saas", "why", "platforms", "models", "exclusive", "faq", "close"] as const;

function SectionRail() {
  const { t } = useSaasLocale();
  const labels: Record<(typeof RAIL_IDS)[number], string> = {
    top: t("saasMarket.hero.eyebrow"),
    "what-is-saas": t("saasMarket.nav.saas"),
    why: t("saasMarket.why.eyebrow"),
    platforms: t("saasMarket.nav.platforms"),
    models: t("saasMarket.nav.models"),
    exclusive: t("saasMarket.nav.exclusive"),
    faq: t("saasMarket.nav.faq"),
    close: t("saasMarket.nav.talk"),
  };
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = RAIL_IDS.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="saas-rail" aria-label={t("saasMarket.nav.progress")}>
      {RAIL_IDS.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className={active === id ? "is-on" : ""}
          aria-label={labels[id]}
          aria-current={active === id ? "true" : undefined}
        >
          <span />
        </a>
      ))}
    </nav>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className={`saas-filter ${active ? "is-on" : ""}`}>
      {children}
    </button>
  );
}
