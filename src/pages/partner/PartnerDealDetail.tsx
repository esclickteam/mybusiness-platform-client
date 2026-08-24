import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  fetchPartnerDeal,
  partnerApiError,
  startPartnerDealCheckout,
  updatePartnerDeal,
  type PartnerServiceRow,
} from "../../lib/partnerApi";
import { billingLabel, isCommissionSku, publicPackageLabel } from "../../lib/partnerDealMath";
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
  const [serviceRows, setServiceRows] = useState<PartnerServiceRow[]>([]);
  const [billingSafety, setBillingSafety] = useState<{
    enabled?: boolean;
    mode?: string;
    message?: string;
  } | null>(null);
  const [packageDisplayName, setPackageDisplayName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [lineNames, setLineNames] = useState<Record<string, string>>({});
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
        setServiceRows(data.serviceRows || []);
        setBillingSafety(data.billingSafety || null);
        setPackageDisplayName(publicPackageLabel(data.deal.packageDisplayName));
        setPackageDescription(data.deal.packageDescription || "");
        const names: Record<string, string> = {};
        for (const line of data.deal.lines || []) {
          if (isCommissionSku(line.sku)) continue;
          names[line.sku] = publicPackageLabel(line.displayNameHe || line.nameHe, line.nameHe || line.sku);
        }
        setLineNames(names);
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

  async function savePresentation() {
    if (!dealId) return;
    setSavingName(true);
    setError("");
    try {
      const data = await updatePartnerDeal(dealId, {
        packageDisplayName,
        packageDescription,
        lineNames: Object.entries(lineNames).map(([sku, displayNameHe]) => ({ sku, displayNameHe })),
      });
      setDeal(data.deal);
      if (data.serviceRows) setServiceRows(data.serviceRows);
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן לשמור את שם החבילה"));
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={`Deal #${deal.dealNumber}`}
        title={client?.contact?.businessName || "סיכום עסקה"}
        subtitle="הלקוח רואה מחיר אחיד: מחיר פרטנר + עמלה. כאן אתם רואים לכל שירות את מחיר הלקוח, התשלום ל-Bizuply, והעמלה החד-פעמית והחודשית."
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
          <span className="text-xs font-black text-slate-500">שם החבילה / הרישיון בהצעה ללקוח</span>
          <input
            value={packageDisplayName}
            onChange={(e) => setPackageDisplayName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-black outline-none focus:border-violet-400 focus:bg-white"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-black text-slate-500">תיאור הרישיון ללקוח</span>
          <textarea
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold outline-none focus:border-violet-400 focus:bg-white"
          />
        </label>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-black text-slate-500">שמות השירותים בהצעה ללקוח</p>
          {Object.entries(lineNames).map(([sku, name]) => (
            <input
              key={sku}
              value={name}
              onChange={(e) => setLineNames((prev) => ({ ...prev, [sku]: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black outline-none focus:border-violet-400 focus:bg-white"
            />
          ))}
        </div>
        <button
          type="button"
          disabled={savingName}
          onClick={savePresentation}
          className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
        >
          {savingName ? "שומר..." : "שמירת שמות"}
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label="סטטוס" value={deal.status} />
        <Stat label="חד-פעמי ללקוח" value={formatIls(totals.oneTime)} />
        <Stat label="חודשי ללקוח" value={formatIls(totals.monthly)} />
        <Stat label="שנתי ללקוח" value={formatIls(totals.annual)} />
      </section>

      <section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="font-black">פירוט פנימי לעסק</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">
          מחיר ללקוח = מחיר פרטנר + עמלה. העמלה החד-פעמית נגבית בהקמה; העמלה החודשית נגבית כל עוד הלקוח פעיל.
        </p>
        <table className="mt-4 min-w-full text-right text-sm">
          <thead className="text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-2">שירות</th>
              <th className="px-3 py-2">מחיר ללקוח</th>
              <th className="px-3 py-2">תשלום ל-Bizuply</th>
              <th className="px-3 py-2">עמלה חד-פעמית</th>
              <th className="px-3 py-2">עמלה חודשית</th>
            </tr>
          </thead>
          <tbody>
            {serviceRows.map((row) => (
              <tr key={row.sku} className="border-t border-slate-100">
                <td className="px-3 py-3 font-black">
                  {row.name}
                  <span className="mr-2 text-[11px] font-bold text-slate-400">{billingLabel(row.billing)}</span>
                </td>
                <td className="px-3 py-3 font-bold">
                  {formatIls(row.customerPrice)}
                  {row.customerSetup ? (
                    <span className="block text-[11px] text-slate-500">+ {formatIls(row.customerSetup)} הקמה</span>
                  ) : null}
                </td>
                <td className="px-3 py-3 font-bold">
                  {formatIls(row.payBizuply)}
                  {row.payBizuplySetupShare ? (
                    <span className="block text-[11px] text-slate-500">
                      + {formatIls(row.payBizuplySetupShare)} חלק Bizuply בהקמה
                    </span>
                  ) : null}
                  {row.payBizuplyMonthlyShare ? (
                    <span className="block text-[11px] text-slate-500">
                      + {formatIls(row.payBizuplyMonthlyShare)} / חודש חלק Bizuply
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3 font-bold">{row.oneTimeCommission ? formatIls(row.oneTimeCommission) : "—"}</td>
                <td className="px-3 py-3 font-bold">
                  {row.monthlyCommission ? `${formatIls(row.monthlyCommission)} כל עוד פעיל` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <details className="rounded-3xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer font-black">מה שאתם משלמים ל-Bizuply ב-Stripe — לא מה שהלקוח רואה</summary>
        <p className="mb-3 mt-2 text-sm font-bold text-slate-500">
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
      </details>

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
