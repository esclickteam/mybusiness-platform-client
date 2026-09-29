import { useState } from "react";
import { Link } from "react-router-dom";
import {
  buildWhatsappLink,
  SaasFooter,
  SaasHeader,
  SaasSeo,
  useSaasLocale,
  WhatsAppDock,
} from "../../saas/chrome";
import { templateExperienceHref, templateShots, type SaasModelId, type SaasProduct } from "../../saas/logic";
import {
  LeadDialog,
  messageFor,
  ModelBoard,
  TemplateDemoDialog,
  useStory,
  type LeadSeed,
} from "../../saas/sections";
import { CardFilm, MobilePreview, PreviewTabs, PromoVideo, ScreenshotGallery } from "../../saas/templateShowcase";
import "../../saas/saas.css";

export default function SaasTemplateProductPage({
  product,
  whatsapp,
}: {
  product: SaasProduct;
  whatsapp: string;
}) {
  const { t, dir, htmlLang } = useSaasLocale();
  const story = useStory(product);
  const [lead, setLead] = useState<LeadSeed | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const tagline = product.tagline || story.subtitle;
  const wa = buildWhatsappLink(whatsapp, messageFor(t, product.name, "partner"));
  const badges = [
    product.interactiveDemoEnabled ? t("saasMarket.platforms.interactiveDemo") : "",
    product.whiteLabel ? t("saasMarket.platforms.whiteLabelBadge") : "",
    product.partnerModel ? t("saasMarket.platforms.partnerBadge") : "",
    product.exclusiveCountry ? t("saasMarket.platforms.countryBadge") : "",
  ].filter(Boolean);

  function openLead(partial: Partial<LeadSeed> & { ctaSource: string }) {
    setLead({
      slug: product.slug,
      model: (partial.model || "partner") as SaasModelId,
      ctaSource: partial.ctaSource,
      country: partial.country,
    });
  }

  return (
    <div className="saas-market saas-template-page min-h-screen pb-24" dir={dir} lang={htmlLang}>
      <SaasSeo title={story.seoTitle} description={story.seoDescription} />
      <SaasHeader onTalk={() => openLead({ ctaSource: "talk_to_us" })} />
      <main>
        <section className="saas-template-hero">
          <div className="saas-wrap saas-template-hero-grid">
            <div>
              <Link to="/saas" className="saas-back">
                {t("saasMarket.product.back")}
              </Link>
              <p className="saas-kicker">
                {t(`saasMarket.categories.${product.category}`, { defaultValue: product.categoryLabel })}
              </p>
              <h1>{product.name}</h1>
              <p className="saas-lead" dir="auto">{tagline}</p>
              <div className="saas-row-badges">
                {badges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
              <div className="saas-hero-actions">
                <button type="button" className="saas-btn" onClick={() => setDemoOpen(true)}>
                  {t("saasMarket.platforms.watchDemo")}
                </button>
                <a className="saas-btn saas-btn-ghost" href="#models">
                  {t("saasMarket.showcase.partnership")}
                </a>
              </div>
            </div>
            <div className="saas-template-stage">
              {product.promoVideoUrl ? (
                <PromoVideo url={product.promoVideoUrl} poster={product.promoVideoPosterUrl || product.coverImage} title={product.name} />
              ) : (
                <CardFilm product={product} />
              )}
              <div className="saas-hero-thumbs">
                {templateShots(product).slice(0, 6).map((shot) => (
                  <img key={shot.imageUrl} src={shot.imageUrl} alt={shot.label} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="saas-wrap">
          <PreviewTabs product={product} />
          <ScreenshotGallery product={product} />
          <MobilePreview product={product} />
          <section className="saas-showcase-block">
            <h2 className="saas-title">{t("saasMarket.featuresTitle")}</h2>
            <ul className="saas-feature-grid">
              {(story.features.length ? story.features : product.features).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <p className="saas-lead">{story.full}</p>
          </section>
        </div>
        <ModelBoard onApply={(model, cta) => openLead({ model, ctaSource: cta })} />
      </main>
      <SaasFooter />
      <div className="saas-sticky-cta">
        <button type="button" onClick={() => setDemoOpen(true)}>
          {t("saasMarket.platforms.watchDemo")}
        </button>
        <Link to={templateExperienceHref(product.slug, "full")}>{t("saasMarket.templateDemo.explore")}</Link>
        <a href="#models">{t("saasMarket.showcase.partnership")}</a>
      </div>
      <WhatsAppDock href={wa} />
      <TemplateDemoDialog product={demoOpen ? product : null} onClose={() => setDemoOpen(false)} />
      <LeadDialog seed={lead} products={[product]} onClose={() => setLead(null)} />
    </div>
  );
}
