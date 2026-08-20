import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicPartnerDeal } from "../../lib/partnerApi";
import { billingLabel } from "../../lib/partnerDealMath";
import { formatIls } from "../../lib/partnerMoney";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

type PublicSummary = {
  dealNumber?: string;
  dealDate?: string;
  business?: { name?: string; contactName?: string; phone?: string; email?: string };
  partner?: { name?: string; logo?: string; phone?: string; email?: string };
  package?: {
    name?: string;
    description?: string;
    billing?: string;
    amount?: number;
    includes?: string[];
  };
  addons?: Array<{ name?: string; description?: string; billing?: string; customerFinalPrice?: number }>;
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

  if (!summary && !error) return <BizuplyLoader fullScreen label="טוען סיכום עסקה..." />;
  if (!summary) {
    return (
      <div dir="rtl" className="mx-auto max-w-3xl p-8 text-center font-black text-rose-700">
        {error}
      </div>
    );
  }

  const pay = summary.payment || {};
  const date = summary.dealDate ? new Date(summary.dealDate).toLocaleDateString("he-IL") : "";

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f4ff] px-4 py-10" style={{ fontFamily: '"Assistant","Rubik",sans-serif' }}>
      <article className="mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_24px_80px_rgba(76,29,149,0.12)]">
        <header className="bg-gradient-to-l from-[#4C1D95] to-[#7C4DFF] px-8 py-8 text-white">
          <div className="flex items-center gap-4">
            {summary.partner?.logo ? (
              <img src={summary.partner.logo} alt="" className="h-14 w-14 rounded-2xl bg-white object-cover" />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-lg font-black">
                {(summary.partner?.name || "P").slice(0, 1)}
              </div>
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">החבילה שלך</p>
              <h1 className="text-2xl font-black">{summary.partner?.name || "פרטנר"}</h1>
              <p className="text-sm font-bold text-white/80">
                {[summary.partner?.phone, summary.partner?.email].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        </header>

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
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">החבילה שלך</p>
            <h2 className="mt-1 text-3xl font-black">{summary.package?.name}</h2>
            {summary.package?.description ? (
              <p className="mt-2 font-bold text-slate-500">{summary.package.description}</p>
            ) : null}
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

          {summary.addons?.length ? (
            <section>
              <h3 className="font-black">תוספות שבחרת</h3>
              <div className="mt-3 space-y-2">
                {summary.addons.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                  >
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="text-xs font-bold text-slate-400">{billingLabel(item.billing)}</p>
                    </div>
                    <p className="font-black">{formatIls(item.customerFinalPrice)}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[28px] bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-black">תשלום</h3>
            <div className="mt-4 space-y-2 font-black">
              <Row label="חד-פעמי" value={formatIls(pay.oneTime)} />
              <Row label="חודשי" value={`${formatIls(pay.monthly)} / חודש`} />
              {pay.annual ? <Row label="שנתי" value={`${formatIls(pay.annual)} / שנה`} /> : null}
              <Row label="סה״כ לתשלום כעת" value={formatIls(pay.dueNow)} large />
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
          </section>
        </div>
      </article>
    </div>
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
