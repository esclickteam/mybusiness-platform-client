import React, { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  fetchPublicPartnerBranding,
  fetchPublicPartnerPlans,
  partnerApiError,
  startPublicPartnerCheckout,
} from "../../lib/partnerApi";
import { formatPublicCustomerPrice } from "../../lib/partnerMoney";
import { billingLabel } from "../../lib/partnerDealMath";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import { isPartnerWhiteLabelHostname } from "../../lib/partnerHost.mjs";
import type { PublicPartnerBranding } from "../../lib/partnerBranding";

export default function PartnerPublicPlans() {
  const { slug: slugParam } = useParams();
  const [params] = useSearchParams();
  const [slug, setSlug] = useState(slugParam || "");
  const [page, setPage] = useState<any>(null);
  const [branding, setBranding] = useState<PublicPartnerBranding | null>(null);
  const [fallbackToPricing, setFallbackToPricing] = useState(false);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState("");
  const [sku, setSku] = useState("");
  const [contact, setContact] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let nextSlug = slugParam || "";
        if (!nextSlug) {
          const hostBranding = await fetchPublicPartnerBranding({ host: window.location.host });
          nextSlug = hostBranding?.slug || "";
          if (!cancelled) setBranding(hostBranding);
        }
        if (!nextSlug) {
          if (!cancelled) {
            if (!slugParam && !isPartnerWhiteLabelHostname(window.location.hostname)) {
              setFallbackToPricing(true);
            } else setError("עמוד החבילות לא נמצא");
          }
          return;
        }
        if (!cancelled) setSlug(nextSlug);
        const [sales, brand] = await Promise.all([
          fetchPublicPartnerPlans(nextSlug),
          fetchPublicPartnerBranding({ slug: nextSlug, host: window.location.host }),
        ]);
        if (cancelled) return;
        setPage(sales);
        setBranding(brand || sales.partner);
      } catch (err: unknown) {
        if (!cancelled) {
          if (!slugParam && !isPartnerWhiteLabelHostname(window.location.hostname)) {
            setFallbackToPricing(true);
          } else setError(partnerApiError(err, "עמוד החבילות לא נמצא"));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slugParam]);

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !sku) return;
    setBuying(sku);
    setError("");
    try {
      const data = await startPublicPartnerCheckout(slug, { sku, ...contact });
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן לפתוח תשלום"));
      setBuying("");
    }
  }

  if (fallbackToPricing) {
    return <Navigate to="/pricing" replace />;
  }

  const products = page?.products || [];
  const selected = products.find((item: any) => item.sku === sku);

  return (
    <PublicPartnerShell
      branding={branding}
      title={page?.partner?.name ? `${page.partner.name} — חבילות` : "חבילות"}
    >
      <h1 className="text-3xl font-black">{page?.partner?.name || "חבילות"}</h1>
      <p className="mt-2 text-sm font-bold text-slate-500">
        בחרו חבילה והשלימו רכישה. המחיר המוצג הוא המחיר הסופי ללקוח.
      </p>
      {params.get("canceled") === "1" ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          התשלום בוטל. אפשר לבחור חבילה שוב.
        </p>
      ) : null}
      {error ? <p className="mt-4 font-black text-rose-700">{error}</p> : null}

      <div className="mt-6 grid gap-4">
        {products.map((product: any) => (
          <article
            key={product.sku}
            className={`rounded-3xl border bg-white p-5 shadow-sm ${
              sku === product.sku ? "border-violet-500" : "border-slate-100"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{product.nameHe}</h2>
                {product.descriptionHe ? (
                  <p className="mt-1 text-sm font-bold text-slate-500">{product.descriptionHe}</p>
                ) : null}
                <p className="mt-2 text-xs font-bold text-slate-400">{billingLabel(product.billing)}</p>
                {product.humanService ? (
                  <p className="mt-2 text-xs font-black text-amber-700">
                    שירות אנושי – אינו מפעיל מודול אוטומטית.
                  </p>
                ) : null}
              </div>
              <p className="text-2xl font-black">
                {formatPublicCustomerPrice(product)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSku(product.sku)}
              className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
            >
              {sku === product.sku ? "נבחר" : "בחירת חבילה"}
            </button>
          </article>
        ))}
        {!products.length && page ? (
          <p className="font-bold text-slate-400">אין חבילות להצגה כרגע.</p>
        ) : null}
      </div>

      {selected ? (
        <form onSubmit={buy} className="mt-8 space-y-3 rounded-3xl border border-violet-100 bg-white p-5">
          <h3 className="text-lg font-black">פרטי לקוח לרכישת {selected.nameHe}</h3>
          <p className="text-sm font-bold text-slate-500">לתשלום: {formatPublicCustomerPrice(selected)}</p>
          <input
            required
            placeholder="שם מלא"
            className="w-full rounded-2xl border px-4 py-3 text-sm font-bold"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
          />
          <input
            placeholder="שם העסק"
            className="w-full rounded-2xl border px-4 py-3 text-sm font-bold"
            value={contact.businessName}
            onChange={(e) => setContact({ ...contact, businessName: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="אימייל"
            className="w-full rounded-2xl border px-4 py-3 text-sm font-bold"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
          <input
            placeholder="טלפון"
            className="w-full rounded-2xl border px-4 py-3 text-sm font-bold"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
          <button
            type="submit"
            disabled={Boolean(buying)}
            className="w-full rounded-2xl bg-[#6D28D9] py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {buying ? "פותח תשלום..." : "המשך לתשלום"}
          </button>
        </form>
      ) : null}
    </PublicPartnerShell>
  );
}
