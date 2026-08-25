import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicStorefront } from "../../lib/partnerApi";
import { formatPublicCustomerPrice } from "../../lib/partnerMoney";

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function PartnerStorefront() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetchPublicStorefront(slug)
      .then(setData)
      .catch((err) => setError(err.response?.data?.error || "העמוד לא נמצא"));
  }, [slug]);

  if (error) {
    return (
      <div dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-black">{error}</h1>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white px-4 py-10">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
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
              קטלוג ציבורי להצגת מוצרים ושירותים. רכישה מתבצעת מול הפרטנר.
            </p>
            <a
              href={`/p/${slug}/plans`}
              className="mt-3 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
            >
              לעמוד החבילות
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-4xl gap-4 px-4 py-8">
        {(data.products || []).map((product: any) => (
          <article key={product.sku} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black">{product.nameHe || product.name}</h2>
            <p className="text-sm text-slate-600">{product.description}</p>
            <p className="mt-3 text-2xl font-black">{formatPublicCustomerPrice(product)}</p>
            {product.retailComparisonPrice ? (
              <p className="text-xs text-slate-500">
                מחיר מחירון להשוואה: {ils(product.retailComparisonPrice)}
              </p>
            ) : null}
          </article>
        ))}
      </main>
      {!data.hideBizuplyBranding ? (
        <footer className="py-6 text-center text-xs font-bold text-slate-400">
          Powered by Bizuply
        </footer>
      ) : null}
    </div>
  );
}
