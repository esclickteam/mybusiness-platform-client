import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicPartnerDeal } from "../../lib/partnerApi";
import { billingLabel, publicPackageLabel, publicProductCopy } from "../../lib/partnerDealMath";
import { formatIls } from "../../lib/partnerMoney";
import PublicPartnerShell from "../../components/partner/PublicPartnerShell";
import {
  partnerDisplayName,
  partnerFacingName,
  type PublicPartnerBranding,
} from "../../lib/partnerBranding";

type PublicProduct = {
  name?: string;
  description?: string;
  billing?: string;
};

type PublicSummary = {
  dealNumber?: string;
  dealDate?: string;
  branding?: PublicPartnerBranding;
  business?: { name?: string; contactName?: string; phone?: string; email?: string; logo?: string };
  partner?: { name?: string; logo?: string; phone?: string; email?: string };
  package?: {
    name?: string;
    description?: string;
    billing?: string;
    includes?: string[];
  };
  addons?: PublicProduct[];
  included?: PublicProduct[];
  payment?: {
    oneTime?: number;
    monthly?: number;
    annual?: number;
    dueNow?: number;
    renewalMonthly?: number;
    renewalAnnual?: number;
  };
};

export default function PartnerPublicDeal() {
  const { dealId } = useParams();
  const [summary, setSummary] = useState<PublicSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dealId) return;
    fetchPublicPartnerDeal(dealId)
      .then((data) => setSummary(data as PublicSummary))
      .catch(() => setError("העסקה לא נמצאה"));
  }, [dealId]);

  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const brandName =
    partnerFacingName(summary?.branding, host) ||
    partnerDisplayName(summary?.branding) ||
    summary?.partner?.name ||
    "";

  if (!summary && !error) {
    return (
      <PublicPartnerShell title="סיכום עסקה" noIndex>
        <p className="font-bold text-slate-500">טוען סיכום עסקה...</p>
      </PublicPartnerShell>
    );
  }
  if (!summary) {
    return (
      <PublicPartnerShell title="סיכום עסקה" noIndex>
        <p className="font-black text-rose-700">{error}</p>
      </PublicPartnerShell>
    );
  }

  const pay = summary.payment || {};
  const date = summary.dealDate ? new Date(summary.dealDate).toLocaleDateString("he-IL") : "";
  const heading = brandName || "נותן השירות";
  const products: PublicProduct[] = [
    summary.package
      ? {
          name: summary.package.name,
          description: summary.package.description,
          billing: summary.package.billing,
        }
      : null,
    ...(summary.addons || []),
  ].filter(Boolean) as PublicProduct[];

  return (
    <PublicPartnerShell branding={summary.branding} title={heading} noIndex>
      <article className="overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        {summary.partner?.phone || summary.partner?.email ? (
          <p className="px-8 pt-6 text-sm font-bold text-slate-500">
            {[summary.partner?.phone, summary.partner?.email].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        <div className="space-y-8 px-8 py-8">
          <section className="grid gap-3 sm:grid-cols-2">
            <Info label="שם העסק" value={summary.business?.name} />
            <Info label="איש קשר" value={summary.business?.contactName} />
            <Info label="טלפון" value={summary.business?.phone} />
            <Info label="אימייל" value={summary.business?.email} />
            <Info label="מספר עסקה" value={summary.dealNumber} />
            <Info label="תאריך" value={date} />
          </section>

          <section>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">פירוט מוצרים</p>
            <h2 className="mt-1 text-3xl font-black">{publicPackageLabel(summary.package?.name)}</h2>
            {publicProductCopy(summary.package?.description) ? (
              <p className="mt-2 font-bold text-slate-500">{publicProductCopy(summary.package?.description)}</p>
            ) : null}
            <div className="mt-4 space-y-2">
              {products.map((item) => (
                <div
                  key={`${item.name}-${item.billing}`}
                  className="rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <p className="font-black">{publicPackageLabel(item.name)}</p>
                  {publicProductCopy(item.description) ? (
                    <p className="text-sm font-bold text-slate-500">{publicProductCopy(item.description)}</p>
                  ) : null}
                  <p className="text-xs font-bold text-slate-400">{billingLabel(item.billing)}</p>
                </div>
              ))}
            </div>
            {summary.package?.includes?.length ? (
              <>
                <h3 className="mt-5 font-black">מה כלול בחבילה</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {summary.package.includes.map((item) => (
                    <div key={item} className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-black text-violet-900">
                      {item}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </section>

          <section className="rounded-[28px] bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-black">סיכום ההצעה</h3>
            <p className="mt-1 text-sm font-bold text-white/60">
              מחיר אחיד לרישיון ולשירותים — הסכום הסופי כולל את כל הרכיבים.
            </p>
            <div className="mt-4 space-y-2 font-black">
              <Row label="מחיר חד-פעמי" value={formatIls(pay.oneTime)} />
              {pay.monthly ? (
                <Row label="מחיר כל חודש" value={`${formatIls(pay.monthly)} / חודש`} />
              ) : null}
              {pay.annual ? <Row label="שנתי" value={`${formatIls(pay.annual)} / שנה`} /> : null}
              <Row label="סה״כ ההצעה" value={formatIls(pay.dueNow)} large />
            </div>
            {pay.renewalMonthly ? (
              <p className="mt-4 text-sm font-bold text-white/70">
                מתחדש ב-{formatIls(pay.renewalMonthly)} לחודש
              </p>
            ) : pay.renewalAnnual ? (
              <p className="mt-4 text-sm font-bold text-white/70">
                מתחדש ב-{formatIls(pay.renewalAnnual)} לשנה
              </p>
            ) : null}
            <p className="mt-5 text-sm font-bold leading-6 text-white/75">
              התשלום והפעלת השירות מתבצעים מול {brandName || "נותן השירות"} שלך. עמוד זה מציג את סיכום המוצרים והשירותים שנבחרו עבורך.
            </p>
          </section>
        </div>
      </article>
    </PublicPartnerShell>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="font-black text-slate-900">{value || "—"}</p>
    </div>
  );
}

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/70">{label}</span>
      <span className={large ? "text-2xl" : ""}>{value}</span>
    </div>
  );
}
