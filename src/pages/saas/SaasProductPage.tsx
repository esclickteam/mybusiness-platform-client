import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSaasProduct } from "../../saas/api";
import {
  buildWhatsappLink,
  GhostButton,
  PrimaryButton,
  SaasFooter,
  SaasHeader,
  SaasSeo,
  StickyActions,
  useSaasLocale,
  WhatsAppDock,
} from "../../saas/chrome";
import { demoTarget, type SaasModelId, type SaasProduct } from "../../saas/logic";
import SaasScreenMock from "../../saas/SaasScreenMock";
import {
  CountryCheck,
  DemoTheater,
  FaqList,
  IncludedGrid,
  LeadDialog,
  messageFor,
  ModelBoard,
  screenLabel,
  useStory,
  type LeadSeed,
} from "../../saas/sections";
import "../../saas/saas.css";

export default function SaasProductPage() {
  const { slug = "" } = useParams();
  const { t, dir, htmlLang } = useSaasLocale();
  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadedSlug, setLoadedSlug] = useState("");
  const [active, setActive] = useState(0);
  const [lead, setLead] = useState<LeadSeed | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  if (loadedSlug !== slug) {
    setLoadedSlug(slug);
    setProduct(null);
    setWhatsapp("");
    setError("");
    setLoading(true);
    setActive(0);
    setDemoOpen(false);
  }

  useEffect(() => {
    let activeRequest = true;
    fetchSaasProduct(slug)
      .then((data) => {
        if (!activeRequest) return;
        setProduct(data.product);
        setWhatsapp(data.settings?.whatsappE164 || "");
        setError("");
      })
      .catch(() => {
        if (activeRequest) {
          setProduct(null);
          setError(t("saasMarket.product.missing"));
        }
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, [slug, t]);

  const story = useStory(
    product || {
      id: "",
      name: "",
      slug,
      category: "",
      categoryLabel: "",
      headline: "",
      subtitle: "",
      shortDescription: "",
      fullDescription: "",
      priceUsd: 0,
      estimatedDevCostLabel: "",
      accent: "#5B4DFF",
      accentSecondary: "#38BDF8",
      screenshots: [],
      features: [],
      included: [],
      demoUrl: "",
      status: "",
      badge: "",
      seoTitle: "",
      seoDescription: "",
      whatsappBlurb: "",
      whatsappMessage: "",
      purchasable: false,
    }
  );

  const screens = product?.screenshots?.length ? product.screenshots : [];
  const current = screens[Math.min(active, Math.max(screens.length - 1, 0))];
  const live = product ? demoTarget(product) : { href: "#gallery", external: false };
  const wa = buildWhatsappLink(whatsapp, messageFor(t, product?.name || "Bizuply", "partner"));

  function openLead(partial: Partial<LeadSeed> & { ctaSource: string }) {
    setLead({
      slug,
      model: (partial.model || "partner") as SaasModelId,
      ctaSource: partial.ctaSource,
      country: partial.country,
    });
  }

  return (
    <div className="saas-market min-h-screen pb-24 lg:pb-0" dir={dir} lang={htmlLang}>
      <SaasSeo
        title={product ? story.seoTitle : t("saasMarket.seoTitle")}
        description={product ? story.seoDescription : t("saasMarket.seoDescription")}
      />
      <SaasHeader onTalk={() => openLead({ ctaSource: "talk_to_us" })} />
      <main>
        {loading ? <p className="px-6 py-16 text-sm font-bold text-slate-500">{t("saasMarket.platforms.loading")}</p> : null}
        {error ? <p className="px-6 py-16 text-sm font-bold text-rose-600">{error}</p> : null}
        {product ? (
          <>
            <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
              <div>
                <Link to="/saas" className="text-sm font-black text-[#6d4aff]">
                  {t("saasMarket.product.back")}
                </Link>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">
                  {t(`saasMarket.categories.${product.category}`, { defaultValue: product.categoryLabel })}
                </p>
                <h1 className="saas-hero-title mt-3 text-4xl font-black tracking-tight sm:text-6xl">{product.name}</h1>
                <p className="mt-3 text-xl font-black text-slate-800">{story.headline}</p>
                <p className="mt-4 max-w-xl text-base font-medium leading-8 text-slate-600">{story.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {live.external ? (
                    <a href={live.href} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#24124d] px-5 py-3 text-sm font-black text-white">
                      {t("saasMarket.product.demo")}
                    </a>
                  ) : (
                    <PrimaryButton onClick={() => setDemoOpen(true)}>{t("saasMarket.product.preview")}</PrimaryButton>
                  )}
                  <GhostButton href="#models">{t("saasMarket.product.explore")}</GhostButton>
                  <GhostButton onClick={() => openLead({ ctaSource: "talk_to_us" })}>{t("saasMarket.product.talk")}</GhostButton>
                </div>
              </div>
              <SaasScreenMock
                caption={t("saasMarket.previewCaption")}
                screen={{ key: "dashboard", label: product.name, imageUrl: product.mainImageUrl }}
                accent={product.accent}
                accentSecondary={product.accentSecondary}
                productName={product.name}
              />
            </section>

            <section id="gallery" className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
              <h2 className="text-3xl font-black">{t("saasMarket.galleryTitle")}</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">{t("saasMarket.gallerySubtitle")}</p>
              {current ? (
                <div className="mt-6 overflow-hidden rounded-[28px]">
                  <SaasScreenMock
                    caption={t("saasMarket.previewCaption")}
                    screen={{ ...current, label: screenLabel(current.key, current.label, t) }}
                    accent={product.accent}
                    accentSecondary={product.accentSecondary}
                    productName={product.name}
                  />
                </div>
              ) : null}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {screens.map((screen, index) => (
                  <button
                    key={`${screen.key}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`shrink-0 rounded-2xl px-3 py-3 text-xs font-black ${index === active ? "bg-[#24124d] text-white" : "bg-white text-slate-700"}`}
                  >
                    {screenLabel(screen.key, screen.label, t)}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <PrimaryButton onClick={() => setDemoOpen(true)}>{t("saasMarket.product.preview")}</PrimaryButton>
                {live.external ? (
                  <a href={live.href} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black">
                    {t("saasMarket.product.demo")}
                  </a>
                ) : null}
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
              <h2 className="text-3xl font-black">{t("saasMarket.featuresTitle")}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {story.features.map((feature) => (
                  <article key={feature} className="saas-glass rounded-[24px] p-4 text-sm font-bold">
                    {feature}
                  </article>
                ))}
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
              <h2 className="text-3xl font-black">{t("saasMarket.useCasesTitle")}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {story.useCases.map((item) => (
                  <article key={item} className="rounded-[24px] bg-[#160b33] p-5 text-sm font-black text-white">
                    {item}
                  </article>
                ))}
              </div>
            </section>

            {story.why ? (
              <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.opportunityEyebrow")}</p>
                <h2 className="mt-3 text-3xl font-black">{t("saasMarket.opportunityTitle")}</h2>
                <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-slate-600">{story.why}</p>
                {story.full.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </section>
            ) : null}

            <ModelBoard onApply={(model, cta) => openLead({ model, ctaSource: cta })} />
            <IncludedGrid />
            <CountryCheck products={[product]} initialSlug={product.slug} onRequest={(seed) => setLead(seed)} />
            <FaqList />
            <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
              <div className="rounded-[36px] bg-[#160b33] px-6 py-10 text-white">
                <h2 className="text-3xl font-black">{t("saasMarket.closing.title")}</h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/80">{t("saasMarket.closing.subtitle")}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={() => openLead({ ctaSource: "request_information" })} className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">
                    {t("saasMarket.closing.talk")}
                  </button>
                  <button type="button" onClick={() => openLead({ ctaSource: "book_call" })} className="rounded-full border border-white/30 px-5 py-3 text-sm font-black">
                    {t("saasMarket.closing.book")}
                  </button>
                  {wa ? (
                    <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#128C7E] px-5 py-3 text-sm font-black">
                      {t("saasMarket.closing.whatsapp")}
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>
      <SaasFooter />
      <WhatsAppDock href={wa} />
      {product ? (
        <StickyActions
          items={[
            { label: t("saasMarket.sticky.demo"), onClick: () => (live.external ? window.open(live.href, "_blank", "noopener") : setDemoOpen(true)) },
            { label: t("saasMarket.sticky.models"), href: "#models" },
            { label: t("saasMarket.whatsapp.button"), href: wa || undefined, onClick: wa ? undefined : () => openLead({ ctaSource: "talk_to_us" }) },
            { label: t("saasMarket.sticky.talk"), onClick: () => openLead({ ctaSource: "talk_to_us" }) },
          ]}
        />
      ) : null}
      <LeadDialog seed={lead} products={product ? [product] : []} onClose={() => setLead(null)} />
      <DemoTheater product={demoOpen ? product : null} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
