import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchPartnerDeal, partnerApiError, startPartnerDealCheckout, updatePartnerDeal } from "../../lib/partnerApi";
import { billingLabel } from "../../lib/partnerDealMath";
import { formatIls } from "../../lib/partnerMoney";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import type { PartnerClient, PartnerDeal } from "../../types/partner";

export default function PartnerDealDetail() {
  const { dealId } = useParams();
  const [params] = useSearchParams();
  const [deal, setDeal] = useState<PartnerDeal | null>(null);
  const [client, setClient] = useState<PartnerClient | null>(null);
  const [stripeItems, setStripeItems] = useState<any[]>([]);
  const [billingSafety, setBillingSafety] = useState<{
    enabled?: boolean;
    mode?: string;
    message?: string;
  } | null>(null);
  const [packageDisplayName, setPackageDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!dealId) return;
    fetchPartnerDeal(dealId)
      .then((data) => {
        setDeal(data.deal);
        setClient(data.client);
        setStripeItems(data.stripeItems || []);
        setBillingSafety(data.billingSafety || null);
        setPackageDisplayName(data.deal.packageDisplayName || "");
      })
      .catch((err) => setError(partnerApiError(err, "לא ניתן לטעון עסקה")));
  }, [dealId]);

  if (!deal && !error) return <BizuplyLoader label="טוען עסקה..." />;
  if (!deal) {
    return <p className="font-black text-rose-700">{error}</p>;
  }

  const totals = deal.totals || ({} as PartnerDeal["totals"]);
  const paidFlag = params.get("paid") === "1";
  const canceled = params.get("canceled") === "1";
  const publicUrl = `${window.location.origin}${deal.publicUrl || `/partner/deals/${deal._id}`}`;

  async function payBizuply() {
    if (!dealId) return;
    setPaying(true);
    setError("");
    try {
      const data = await startPartnerDealCheckout(dealId);
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן לפתוח Stripe Checkout"));
      setPaying(false);
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={`Deal #${deal.dealNumber}`}
        title={client?.contact?.businessName || "סיכום עסקה"}
        subtitle="אתם גובים מהלקוח את מלוא הסכום, ואז משלמים ל-Bizuply דרך Stripe. עמלה חד-פעמית נרשמת בחודש התשלום; עמלה חודשית נגבית ב-Stripe כל עוד המנוי פעיל ומתווספת לעמלות למשיכה."
      />
      {paidFlag ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
          התשלום ל-Bizuply התקבל. העמלות והשירותים יעודכנו אוטומטית.
        </p>
      ) : null}
      {canceled ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">
          התשלום בוטל. העסקה ממתינה לתשלום ל-Bizuply.
        </p>
      ) : null}
      {error ? <p className="font-black text-rose-700">{error}</p> : null}
      {billingSafety && billingSafety.enabled === false ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">
          תשלום ל-Bizuply כבוי בסביבה זו
          {billingSafety.message ? ` — ${billingSafety.message}` : ""}
        </p>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <label className="block">
          <span className="text-xs font-black text-slate-500">שם החבילה בהצעה ובקישור ללקוח</span>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              value={packageDisplayName}
              onChange={(e) => setPackageDisplayName(e.target.value)}
              className="min-w-[220px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-black outline-none focus:border-violet-400 focus:bg-white"
            />
            <button
              type="button"
              disabled={savingName}
              onClick={async () => {
                if (!dealId) return;
                setSavingName(true);
                setError("");
                try {
                  const data = await updatePartnerDeal(dealId, { packageDisplayName });
                  setDeal(data.deal);
                } catch (err: unknown) {
                  setError(partnerApiError(err, "לא ניתן לשמור את שם החבילה"));
                } finally {
                  setSavingName(false);
                }
              }}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
            >
              {savingName ? "שומר..." : "שמירת שם"}
            </button>
          </div>
        </label>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label="סטטוס" value={deal.status} />
        <Stat label="חד-פעמי ללקוח" value={formatIls(totals.oneTime)} />
        <Stat label="חודשי ללקוח" value={formatIls(totals.monthly)} />
        <Stat label="שנתי ללקוח" value={formatIls(totals.annual)} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="font-black">פירוט התמחור (פנימי)</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="עמלה חד-פעמית" value={formatIls(deal.oneTimeCommission ?? deal.additionalMarkup)} />
          <Stat label="עמלה חודשית" value={formatIls(deal.monthlyCommission)} />
          <Stat label="מחיר חד-פעמי ללקוח" value={formatIls(totals.oneTime)} />
          <Stat label="מחיר כל חודש ללקוח" value={formatIls(totals.monthly)} />
          <Stat label="לתשלום עכשיו ללקוח" value={formatIls(totals.customerNow)} />
          <Stat label="העמלה שלך" value={formatIls(totals.partnerCommission)} />
          <Stat label="חלק Bizuply" value={formatIls(totals.bizuplyShare)} />
          <Stat label="לתשלום ל-Bizuply" value={formatIls(totals.partnerPaysBizuply)} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 font-black">פריטים לתשלום ב-Stripe</h3>
        <p className="mb-3 text-sm font-bold text-slate-500">
          פריטים חודשיים, כולל חלק Bizuply מהעמלה החודשית, מתחדשים כל עוד המנוי פעיל. עמלה חד-פעמית נגבית רק בחשבונית הראשונה.
        </p>
        <ul className="space-y-2 text-sm font-bold">
          {stripeItems.map((item) => (
            <li key={item.sku} className="flex justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
              <span>
                {item.nameEn} · {billingLabel(item.billing)}
              </span>
              <span className="font-black">{formatIls(item.amountIls)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(publicUrl)}
          className="rounded-2xl border px-4 py-2 text-sm font-black"
        >
          העתקת קישור ללקוח
        </button>
        <a href={publicUrl} className="rounded-2xl border px-4 py-2 text-sm font-black" target="_blank" rel="noreferrer">
          צפייה בסיכום ללקוח
        </a>
        {deal.status !== "paid" ? (
          <button
            type="button"
            disabled={paying}
            onClick={payBizuply}
            className="rounded-2xl bg-violet-700 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            {paying ? "פותח Stripe..." : "מעבר לתשלום ל-Bizuply"}
          </button>
        ) : (
          <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">שולם ל-Bizuply</p>
        )}
        {client?._id ? (
          <Link to={`/partner/dashboard/crm/${client._id}`} className="rounded-2xl border px-4 py-2 text-sm font-black">
            תיק הלקוח
          </Link>
        ) : null}
        <Link to="/partner/dashboard/withdrawals" className="rounded-2xl border px-4 py-2 text-sm font-black">
          משיכת עמלה
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value || "—"}</p>
    </div>
  );
}
