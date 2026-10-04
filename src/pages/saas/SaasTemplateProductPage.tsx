import { useState } from "react";
import { Link } from "react-router-dom";
import {
  buildWhatsappLink,
  MixedText,
  SaasFooter,
  SaasHeader,
  SaasSeo,
  useSaasLocale,
  WhatsAppDock,
} from "../../saas/chrome";
import { isPublicDemoUrl, templateDemoLinks, templateExperienceHref, templateShots, type SaasModelId, type SaasProduct } from "../../saas/logic";
import {
  LeadDialog,
  messageFor,
  ModelBoard,
  TemplateDemoDialog,
  useStory,
  type LeadSeed,
} from "../../saas/sections";
import { AudiencePreview, CardFilm, MobilePreview, PreviewTabs, PromoVideo, ScreenshotGallery } from "../../saas/templateShowcase";
import "../../saas/saas.css";

export default function SaasTemplateProductPage({
  product,
  whatsapp,
}: {
  product: SaasProduct;
  whatsapp: string;
}) {
  const { t, dir, htmlLang, lang } = useSaasLocale();
  const story = useStory(product);
  const showcase = story.showcase;
  const [lead, setLead] = useState<LeadSeed | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const tagline = product.tagline || story.subtitle;
  const wa = buildWhatsappLink(whatsapp, messageFor(t, product.name, "partner"));
  const demoLinks = templateDemoLinks(product, lang);
  const shots = templateShots(product);
  const video = isPublicDemoUrl(product.promoVideoUrl) ? product.promoVideoUrl : "";
  const explore = demoLinks.find((item) => item.id === "explore" && isPublicDemoUrl(item.href));
  const badges = [
    demoLinks.length ? t("saasMarket.platforms.interactiveDemo") : t("saasMarket.platforms.demoPreparing"),
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
              <p className="saas-lead" dir="auto">
                <MixedText value={tagline} />
              </p>
              <div className="saas-row-badges">
                {badges.map((badge) => (
                  <span key={badge}>
                    <MixedText value={badge} />
                  </span>
                ))}
              </div>
              <div className="saas-hero-actions">
                {demoLinks.length ? (
                  <button type="button" className="saas-btn" onClick={() => setDemoOpen(true)}>
                    {t("saasMarket.platforms.watchDemo")}
                  </button>
                ) : (
                  <span className="saas-btn saas-btn-ghost">{t("saasMarket.platforms.demoPreparing")}</span>
                )}
                <a className="saas-btn saas-btn-ghost" href="#models">
                  {t("saasMarket.showcase.partnership")}
                </a>
              </div>
            </div>
            <div className="saas-template-stage">
              {video ? (
                <PromoVideo url={video} poster={product.promoVideoPosterUrl || product.coverImage} title={product.name} />
              ) : shots.length ? (
                <CardFilm product={product} />
              ) : (
                <div className="saas-template-pending">
                  <strong>{product.name}</strong>
                </div>
              )}
              {shots.length ? (
                <div className="saas-hero-thumbs">
                  {shots.slice(0, 6).map((shot) => (
                    <img
                      key={shot.imageUrl}
                      src={shot.imageUrl}
                      alt={t(`saasMarket.screens.${shot.key}`, { defaultValue: shot.label })}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
        <div className="saas-wrap">
          {showcase?.overview ? (
            <section className="saas-showcase-block" id="overview">
              <p className="saas-kicker">{t("saasMarket.showcase.overviewTitle")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase.overviewTitle || t("saasMarket.showcase.overviewTitle")} />
              </h2>
              <p className="saas-lead">
                <MixedText value={showcase.overview} />
              </p>
            </section>
          ) : null}

          {(showcase?.audience?.length || story.useCases.length) ? (
            <section className="saas-showcase-block" id="audience">
              <p className="saas-kicker">{t("saasMarket.showcase.audienceTitle")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase?.audienceTitle || t("saasMarket.useCasesTitle")} />
              </h2>
              <ul className="saas-feature-grid">
                {(showcase?.audience?.length ? showcase.audience : story.useCases).map((item) => (
                  <li key={item}>
                    <MixedText value={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {showcase?.storySteps?.length ? (
            <section className="saas-showcase-block saas-enquiry-story" id="enquiry-story">
              <p className="saas-kicker">{t("saasMarket.showcase.enquiryTitle")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase.storyTitle || t("saasMarket.showcase.enquiryTitle")} />
              </h2>
              {showcase.storySubtitle ? (
                <p className="saas-lead">
                  <MixedText value={showcase.storySubtitle} />
                </p>
              ) : null}
              <ol className="saas-story-steps">
                {showcase.storySteps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <MixedText value={step} />
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <AudiencePreview
            product={product}
            audience="customer"
            title={showcase?.publicPreviewTitle || t("saasMarket.showcase.publicPreviewTitle")}
            body={showcase?.publicPreviewBody}
          />
          <AudiencePreview
            product={product}
            audience="admin"
            title={showcase?.adminPreviewTitle || t("saasMarket.showcase.adminPreviewTitle")}
            body={showcase?.adminPreviewBody}
          />
          <PreviewTabs product={product} />
          <ScreenshotGallery product={product} />
          <MobilePreview product={product} />

          <section className="saas-showcase-block" id="features">
            <h2 className="saas-title">{t("saasMarket.featuresTitle")}</h2>
            <ul className="saas-feature-grid">
              {(story.features.length ? story.features : product.features).map((feature) => (
                <li key={feature}>
                  <MixedText value={feature} />
                </li>
              ))}
            </ul>
            <p className="saas-lead">
              <MixedText value={story.full} />
            </p>
          </section>

          {showcase?.ownerPoints?.length ? (
            <section className="saas-showcase-block" id="owner">
              <p className="saas-kicker">{t("saasMarket.showcase.ownerTitle")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase.ownerTitle || t("saasMarket.showcase.ownerTitle")} />
              </h2>
              {showcase.ownerBody ? (
                <p className="saas-lead">
                  <MixedText value={showcase.ownerBody} />
                </p>
              ) : null}
              <ul className="saas-feature-grid">
                {showcase.ownerPoints.map((item) => (
                  <li key={item}>
                    <MixedText value={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {showcase?.whiteLabelPoints?.length ? (
            <section className="saas-showcase-block" id="white-label">
              <p className="saas-kicker">{t("saasMarket.platforms.whiteLabelBadge")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase.whiteLabelTitle || t("saasMarket.platforms.whiteLabelBadge")} />
              </h2>
              {showcase.whiteLabelBody ? (
                <p className="saas-lead">
                  <MixedText value={showcase.whiteLabelBody} />
                </p>
              ) : null}
              <ul className="saas-feature-grid">
                {showcase.whiteLabelPoints.map((item) => (
                  <li key={item}>
                    <MixedText value={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {showcase?.brandingPoints?.length ? (
            <section className="saas-showcase-block" id="branding">
              <p className="saas-kicker">{t("saasMarket.showcase.brandingTitle")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase.brandingTitle || t("saasMarket.showcase.brandingTitle")} />
              </h2>
              {showcase.brandingBody ? (
                <p className="saas-lead">
                  <MixedText value={showcase.brandingBody} />
                </p>
              ) : null}
              <ul className="saas-feature-grid">
                {showcase.brandingPoints.map((item) => (
                  <li key={item}>
                    <MixedText value={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {showcase?.faq?.length ? (
            <section className="saas-showcase-block" id="product-faq">
              <p className="saas-kicker">{t("saasMarket.showcase.faqTitle")}</p>
              <h2 className="saas-title">
                <MixedText value={showcase.faqTitle || t("saasMarket.showcase.faqTitle")} />
              </h2>
              <div className="saas-product-faq">
                {showcase.faq.map((item) => (
                  <article key={item.q}>
                    <h3>
                      <MixedText value={item.q} />
                    </h3>
                    <p>
                      <MixedText value={item.a} />
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <ModelBoard onApply={(model, cta) => openLead({ model, ctaSource: cta })} />
        <section id="close" className="saas-final">
          <div className="saas-wrap">
            <h2>
              <MixedText value={showcase?.ctaTitle || t("saasMarket.showcase.ctaTitle")} />
            </h2>
            <p>
              <MixedText value={showcase?.ctaBody || t("saasMarket.closing.subtitle")} />
            </p>
            <div className="saas-hero-actions">
              {demoLinks.length ? (
                <button type="button" className="saas-btn" onClick={() => setDemoOpen(true)}>
                  {t("saasMarket.platforms.watchDemo")}
                </button>
              ) : null}
              <button type="button" className="saas-btn saas-btn-ghost" onClick={() => openLead({ ctaSource: "talk_to_us" })}>
                {t("saasMarket.product.talk")}
              </button>
            </div>
          </div>
        </section>
      </main>
      <SaasFooter />
      <div className="saas-sticky-cta">
        {demoLinks.length ? (
          <>
            <button type="button" onClick={() => setDemoOpen(true)}>
              {t("saasMarket.platforms.watchDemo")}
            </button>
            {explore ? (
              <a href={explore.href} target="_blank" rel="noreferrer">
                {t("saasMarket.templateDemo.explore")}
              </a>
            ) : (
              <Link to={templateExperienceHref(product.slug, "full")}>
                {t("saasMarket.templateDemo.explore")}
              </Link>
            )}
          </>
        ) : (
          <span>{t("saasMarket.platforms.demoPreparing")}</span>
        )}
        <a href="#models">{t("saasMarket.showcase.partnership")}</a>
      </div>
      <WhatsAppDock href={wa} />
      <TemplateDemoDialog product={demoOpen ? product : null} onClose={() => setDemoOpen(false)} />
      <LeadDialog seed={lead} products={[product]} onClose={() => setLead(null)} />
    </div>
  );
}
