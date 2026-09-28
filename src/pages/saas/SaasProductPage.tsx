import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchSaasOrderStatus, fetchSaasProduct } from "../../saas/api";
import SaasScreenMock from "../../saas/SaasScreenMock";
import { demoTarget, formatIls, formatUsd, type SaasProduct } from "../../saas/logic";
import {
  BuildVsBuy,
  BusinessModel,
  CheckoutModal,
  GhostButton,
  IncludedSection,
  OwnershipSection,
  PrimaryButton,
  RequestInfoModal,
  SaasFooter,
  SaasHeader,
  SaasSeo,
  WhatsAppButton,
} from "../../saas/SaasWidgets";
import "../../saas/saas.css";

export default function SaasProductPage() {
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadedSlug, setLoadedSlug] = useState("");
  if (loadedSlug !== slug) {
    setLoadedSlug(slug);
    setProduct(null);
    setWhatsapp("");
    setError("");
    setLoading(true);
  }
  const [active, setActive] = useState(0);
  const [leadOpen, setLeadOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState("");

  useEffect(() => {
    let activeRequest = true;
    fetchSaasProduct(slug)
      .then((data) => {
        if (!activeRequest) return;
        setProduct(data.product);
        setWhatsapp(data.settings?.whatsappE164 || "");
        setError("");
        setActive(0);
      })
      .catch(() => {
        if (activeRequest) {
          setProduct(null);
          setError("This platform is not available.");
        }
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, [slug]);

  useEffect(() => {
    const token = params.get("order");
    if (params.get("checkout") !== "success" || !token) return;
    let cancelled = false;
    fetchSaasOrderStatus(token)
      .then((data) => {
        if (cancelled) return;
        setCheckoutNote(
          data.order?.status === "paid"
            ? "Payment received. We will email the next steps for your platform."
            : "You are back from checkout. We will confirm the payment by email."
        );
      })
      .catch(() => {
        if (!cancelled) {
          setCheckoutNote("You are back from checkout. We will confirm the payment by email.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const screens = product?.screenshots?.length
    ? product.screenshots
    : [{ key: "dashboard", label: "Dashboard", imageUrl: "" }];
  const screen = screens[Math.min(active, screens.length - 1)];
  const demo = useMemo(() => (product ? demoTarget(product) : null), [product]);

  return (
    <div className="saas-market min-h-screen pb-28 md:pb-0" dir="ltr" lang="en">
      <SaasSeo
        title={product?.seoTitle || "Ready-to-Launch SaaS Platform | Bizuply"}
        description={
          product?.seoDescription ||
          "Launch your own SaaS with a fully developed, white-label, multi-tenant platform. Source code included."
        }
      />
      <SaasHeader actionHref="/saas" actionLabel="All platforms" />
      <main>
        {checkoutNote ? (
          <p className="mx-auto mt-4 max-w-6xl rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 sm:px-6">
            {checkoutNote}
          </p>
        ) : null}
        {loading ? <p className="px-6 py-16 text-sm font-semibold text-slate-500">Loading platform…</p> : null}
        {error ? (
          <div className="px-6 py-16">
            <p className="font-semibold text-slate-700">{error}</p>
            <Link to="/saas" className="mt-4 inline-flex font-bold text-[#5B4DFF]">
              Back to platforms
            </Link>
          </div>
        ) : null}
        {product ? (
          <>
            <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D4AFF]">{product.categoryLabel}</p>
                <h1 className="mt-3 text-5xl font-black tracking-tight">{product.name}</h1>
                <p className="mt-3 text-2xl font-semibold text-slate-800">{product.headline}</p>
                <p className="mt-3 text-lg text-slate-600">{product.subtitle}</p>
                <p className="mt-6 text-4xl font-black">{formatUsd(product.priceUsd)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Estimated custom development: {product.estimatedDevCostLabel}
                </p>
                {product.quotes?.full ? (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Checkout is charged in ILS ({formatIls(product.quotes.full.amountIls)} full,{" "}
                    {formatIls(product.quotes.deposit.amountIls)} for a 50% deposit).
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <PrimaryButton onClick={() => product.purchasable && setBuyOpen(true)}>
                    {product.purchasable ? "Buy Now" : product.status === "sold_out" ? "Sold Out" : "Coming Soon"}
                  </PrimaryButton>
                  {demo?.external ? (
                    <GhostButton href={demo.href}>Live Demo</GhostButton>
                  ) : (
                    <GhostButton href="#gallery">Live Demo</GhostButton>
                  )}
                  <GhostButton onClick={() => setLeadOpen(true)}>Request Information</GhostButton>
                  <WhatsAppButton e164={whatsapp} message={product.whatsappMessage} />
                </div>
              </div>
              <SaasScreenMock
                screen={screens[0]}
                accent={product.accent}
                accentSecondary={product.accentSecondary}
                productName={product.name}
              />
            </section>

            <section className="mx-auto max-w-3xl px-4 sm:px-6">
              {product.fullDescription.split(/\n+/).map((paragraph) => (
                <p key={paragraph} className="mb-4 text-base leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}
              {product.features.length ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section id="gallery" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
              <h2 className="text-3xl font-black">Product gallery</h2>
              <div className="mt-6 overflow-hidden rounded-[28px] border border-white bg-white shadow-sm">
                <div className="relative min-h-[280px] bg-slate-50">
                  <SaasScreenMock
                    framed={false}
                    screen={screen}
                    accent={product.accent}
                    accentSecondary={product.accentSecondary}
                    productName={product.name}
                  />
                  <div className="absolute inset-x-0 bottom-3 flex justify-between px-3">
                    <button
                      type="button"
                      className="rounded-full bg-white/90 px-3 py-2 text-sm font-bold shadow"
                      onClick={() => setActive((value) => (value - 1 + screens.length) % screens.length)}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-white/90 px-3 py-2 text-sm font-bold shadow"
                      onClick={() => setActive((value) => (value + 1) % screens.length)}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto p-3">
                  {screens.map((item, index) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActive(index)}
                      className={`min-w-[120px] rounded-2xl border px-3 py-3 text-left text-[11px] font-bold ${
                        index === active
                          ? "border-[#7C4DFF] bg-[#f5f3ff] text-[#5B4DFF]"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <span
                        className="mb-2 block h-1.5 w-8 rounded-full"
                        style={{ background: product.accent }}
                      />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <IncludedSection items={product.included} />
            <BuildVsBuy />
            <BusinessModel />
            <OwnershipSection />

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="min-h-11 w-full rounded-full bg-[#5B4DFF] text-sm font-bold text-white"
                  onClick={() => product.purchasable && setBuyOpen(true)}
                  disabled={!product.purchasable}
                >
                  Buy Now
                </button>
                <a
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-bold"
                  href={demo?.external ? demo.href : "#gallery"}
                  {...(demo?.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  Live Demo
                </a>
                <WhatsAppButton className="w-full" e164={whatsapp} message={product.whatsappMessage} />
                <button
                  type="button"
                  className="min-h-11 w-full rounded-full border border-slate-200 text-sm font-bold"
                  onClick={() => setLeadOpen(true)}
                >
                  Request Information
                </button>
              </div>
            </div>

            {leadOpen ? (
              <RequestInfoModal product={product} open onClose={() => setLeadOpen(false)} />
            ) : null}
            {buyOpen ? (
              <CheckoutModal product={product} open onClose={() => setBuyOpen(false)} />
            ) : null}
          </>
        ) : null}
      </main>
      <SaasFooter />
    </div>
  );
}
