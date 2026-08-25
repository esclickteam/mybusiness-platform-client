import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPublicPartnerBranding,
  fetchPublicStorefront,
} from "../../lib/partnerApi";
import { formatPublicCustomerPrice } from "../../lib/partnerMoney";
import { publicPackageLabel, publicProductCopy } from "../../lib/partnerDealMath";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import { type PublicPartnerBranding } from "../../lib/partnerBranding";

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

function plansHref(slug: string | undefined, data: any) {
  const hostPlans = String(data?.urls?.plansUrl || "").trim();
  try {
    if (hostPlans && typeof window !== "undefined") {
      const url = new URL(hostPlans);
      if (url.hostname === window.location.hostname) {
        return `${url.pathname}${url.search}` || "/plans";
      }
    }
  } catch {
    /* fall through to catalog path */
  }
  return `/p/${slug}/plans`;
}

export default function PartnerStorefront() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [branding, setBranding] = useState<PublicPartnerBranding | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const hostBrand = await fetchPublicPartnerBranding({
        slug,
        host: typeof window !== "undefined" ? window.location.host : "",
      }).catch(() => null);
      if (cancelled) return;
      if (hostBrand) setBranding(hostBrand);
      try {
        const page = await fetchPublicStorefront(slug);
        if (cancelled) return;
        setData(page);
        setBranding(page?.branding || hostBrand);
        setError("");
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.error || "העמוד לא נמצא");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <PublicPartnerShell branding={branding} title="קטלוג">
        <div className="text-center">
          <h1 className="text-2xl font-black">{error}</h1>
        </div>
      </PublicPartnerShell>
    );
  }
  if (!data) {
    return (
      <PublicPartnerShell branding={branding} title="קטלוג">
        <p className="font-bold text-slate-500">טוען קטלוג...</p>
      </PublicPartnerShell>
    );
  }

  return (
    <PublicPartnerShell branding={data.branding || branding} title={data.name || "קטלוג"}>
      <header className="rounded-[32px] bg-white px-6 py-10 shadow-sm">
        <div className="flex items-center gap-4">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt={data.name} className="h-16 w-16 rounded-2xl object-cover" />
          ) : null}
          <div>
            <h1 className="text-3xl font-black">{data.name}</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold text-slate-600">{data.description}</p>
            <p className="mt-2 text-sm">
              {data.contact?.phone} {data.contact?.email} {data.contact?.whatsapp}
            </p>
            <p className="mt-3 text-xs font-bold text-slate-500">
              קטלוג ציבורי להצגת מוצרים ושירותים. רכישה מתבצעת בעמוד החבילות.
            </p>
            <a
              href={plansHref(slug, data)}
              className="mt-3 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
            >
              לעמוד החבילות
            </a>
          </div>
        </div>
      </header>
      <div className="mt-8 grid gap-4">
        {(data.products || []).map((product: any) => (
          <article key={product.sku} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">{publicPackageLabel(product.nameHe || product.name)}</h2>
            <p className="text-sm text-slate-600">{publicProductCopy(product.description)}</p>
            <p className="mt-3 text-2xl font-black">{formatPublicCustomerPrice(product)}</p>
            {product.retailComparisonPrice ? (
              <p className="text-xs text-slate-500">
                מחיר מחירון להשוואה: {ils(product.retailComparisonPrice)}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </PublicPartnerShell>
  );
}
