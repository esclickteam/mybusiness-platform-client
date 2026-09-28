import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMarketplace } from "../../saas/api";
import {
  buildWhatsappLink,
  GhostButton,
  PrimaryButton,
  Reveal,
  SaasFooter,
  SaasHeader,
  SaasSeo,
  StickyActions,
  useSaasLocale,
  WhatsAppDock,
} from "../../saas/chrome";
import { filterProducts, MARKETPLACE_CATEGORIES, type SaasModelId, type SaasProduct } from "../../saas/logic";
import SaasScreenMock from "../../saas/SaasScreenMock";
import {
  CountryCheck,
  DemoTheater,
  FaqList,
  LeadDialog,
  messageFor,
  ModelBoard,
  PlatformCard,
  type LeadSeed,
} from "../../saas/sections";
import "../../saas/saas.css";

export default function SaasMarketplacePage() {
  const { t, dir, htmlLang } = useSaasLocale();
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
    if (paused || products.length < 2) return;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % products.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [paused, products.length]);

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

  const saasPoints = t("saasMarket.saas.points", { returnObjects: true }) as { title: string; text: string }[];
  const monthly = t("saasMarket.monthly.points", { returnObjects: true }) as { title: string; text: string }[];
  const steps = t("saasMarket.how.steps", { returnObjects: true }) as { title: string; text: string }[];
  const trust = t("saasMarket.trust", { returnObjects: true }) as { title: string; text: string }[];
  const chips = t("saasMarket.hero.chips", { returnObjects: true }) as string[];

  return (
    <div className="saas-market min-h-screen pb-24 lg:pb-0" dir={dir} lang={htmlLang}>
      <SaasSeo title={t("saasMarket.seoTitle")} description={t("saasMarket.seoDescription")} />
      <SaasHeader onTalk={() => openLead({ ctaSource: "talk_to_us" })} />
      <main>
        <section
          className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="saas-orb -start-10 top-10 bg-[#c4b5fd]" />
          <span className="saas-orb end-0 top-24 bg-[#93c5fd]" />
          <div className="relative z-[1]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6d4aff]">{t("saasMarket.hero.eyebrow")}</p>
            <h1 className="saas-hero-title mt-4 text-4xl font-black tracking-tight sm:text-6xl sm:leading-[1.02]">
              {t("saasMarket.hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-slate-600">{t("saasMarket.hero.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-white">
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton href="#platforms">{t("saasMarket.hero.viewPlatforms")}</PrimaryButton>
              <GhostButton onClick={() => hero && setDemo(hero)}>{t("saasMarket.hero.watchDemo")}</GhostButton>
              <GhostButton href="#models">{t("saasMarket.hero.exploreModels")}</GhostButton>
            </div>
          </div>
          <div className="relative z-[1]">
            {hero ? (
              <div className="saas-float">
                <SaasScreenMock
                  caption={t("saasMarket.previewCaption")}
                  screen={{ key: "dashboard", label: hero.name, imageUrl: hero.mainImageUrl }}
                  accent={hero.accent}
                  accentSecondary={hero.accentSecondary}
                  productName={hero.name}
                />
              </div>
            ) : null}
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {products.map((product, index) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setHeroIndex(index)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${index === heroIndex ? "bg-[#24124d] text-white" : "bg-white text-slate-700"}`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="what-is-saas" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Reveal>
            <div className="saas-glass rounded-[32px] p-6 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.saas.eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{t("saasMarket.saas.title")}</h2>
              <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-slate-600">{t("saasMarket.saas.body")}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {saasPoints.map((point) => (
                  <article key={point.title} className="rounded-3xl bg-white/80 p-4">
                    <h3 className="font-black">{point.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{point.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.monthly.eyebrow")}</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{t("saasMarket.monthly.title")}</h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">{t("saasMarket.monthly.intro")}</p>
            <ol className="mt-8 grid gap-3 md:grid-cols-3">
              {monthly.map((point, index) => (
                <li key={point.title} className="saas-glass rounded-[28px] p-5">
                  <span className="text-xs font-black text-[#6d4aff]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-black">{point.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{point.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="platforms" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.platforms.eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{t("saasMarket.platforms.title")}</h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600">{t("saasMarket.platforms.subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              {t("saasMarket.platforms.all")}
            </FilterChip>
            {MARKETPLACE_CATEGORIES.map((item) => (
              <FilterChip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
                {t(`saasMarket.categories.${item.id}`, { defaultValue: item.label })}
              </FilterChip>
            ))}
          </div>
          {error ? <p className="mt-6 text-sm font-bold text-rose-600">{error}</p> : null}
          {loading ? <p className="mt-6 text-sm font-bold text-slate-500">{t("saasMarket.platforms.loading")}</p> : null}
          {!loading && !error && visible.length === 0 ? (
            <p className="mt-6 text-sm font-bold text-slate-500">{t("saasMarket.platforms.empty")}</p>
          ) : null}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {visible.map((product) => (
              <PlatformCard
                key={product.slug}
                product={product}
                onDemo={setDemo}
                onModel={(item) => openLead({ slug: item.slug, model: "partner", ctaSource: "explore_models" })}
              />
            ))}
          </div>
        </section>

        <ModelBoard onApply={(model, cta) => openLead({ model, ctaSource: cta, slug: hero?.slug })} />

        <section id="how" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.how.eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{t("saasMarket.how.title")}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="saas-glass rounded-[28px] p-5">
                <span className="text-3xl font-black text-[#c4b5fd]">{index + 1}</span>
                <h3 className="mt-3 font-black">{step.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <CountryCheck
          products={products}
          initialSlug={hero?.slug}
          onRequest={(seed) => setLead(seed)}
        />

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">{t("saasMarket.trustTitle")}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trust.map((item) => (
              <article key={item.title} className="rounded-[28px] bg-white/80 p-5 shadow-sm">
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <FaqList />

        <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="overflow-hidden rounded-[36px] bg-[#160b33] px-6 py-12 text-white sm:px-10">
            <h2 className="text-3xl font-black sm:text-5xl">{t("saasMarket.closing.title")}</h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/80">{t("saasMarket.closing.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => openLead({ ctaSource: "talk_to_us" })} className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">
                {t("saasMarket.closing.talk")}
              </button>
              <button type="button" onClick={() => openLead({ ctaSource: "book_call" })} className="rounded-full border border-white/30 px-5 py-3 text-sm font-black text-white">
                {t("saasMarket.closing.book")}
              </button>
              {wa ? (
                <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#128C7E] px-5 py-3 text-sm font-black text-white">
                  {t("saasMarket.closing.whatsapp")}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SaasFooter />
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-xs font-black ${active ? "bg-[#24124d] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
    >
      {children}
    </button>
  );
}
