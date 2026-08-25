import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  CreditCard,
  Shield,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import PartnerCatalogPicker from "../../components/partner/PartnerCatalogPicker";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  createPartnerClient,
  createPartnerDeal,
  fetchPartnerCatalog,
  fetchPartnerClient,
  fetchPartnerMe,
  fetchPartnerPricebook,
  partnerApiError,
  updatePartnerClient,
} from "../../lib/partnerApi";
import { computeDealPreview, isCommissionSku, publicPackageLabel, billingLabel } from "../../lib/partnerDealMath";
import { formatIls, formatPct } from "../../lib/partnerMoney";
import { absoluteCustomerUrl } from "../../lib/partnerBranding";
import type {
  ManagementMode,
  PartnerPriceLine,
  PartnerWizardCatalog,
} from "../../types/partner";

const STEPS = [
  { id: 1, label: "פרטי לקוח", icon: Store },
  { id: 2, label: "חבילה ראשית", icon: Sparkles },
  { id: 3, label: "שירותים ותוספות", icon: Sparkles },
  { id: 4, label: "תמחור ללקוח", icon: Wallet },
  { id: 5, label: "סיכום עסקה", icon: CreditCard },
];

const MODE_COPY: Record<ManagementMode, { title: string; text: string }> = {
  partner: {
    title: "הפרטנר מנהל",
    text: "אתם מנהלים את העסק עבור הלקוח. הלקוח יכול לקבל גישה לפי הצורך.",
  },
  customer: {
    title: "הלקוח מנהל",
    text: "הלקוח הוא האדמין הראשי. עדיין תוכלו להיכנס לניהול ולבצע פעולות.",
  },
  shared: {
    title: "ניהול משותף",
    text: "גם אתם וגם הלקוח יכולים לנהל את העסק. מומלץ כברירת מחדל.",
  },
};

export default function PartnerClientWizard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const existingClientId = params.get("clientId") || "";
  const [step, setStep] = useState(existingClientId ? 2 : 1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PartnerPriceLine[]>([]);
  const [wizard, setWizard] = useState<PartnerWizardCatalog>({ packages: [], categories: [] });
  const [partnerShareRate, setPartnerShareRate] = useState(0.75);
  const [clientId, setClientId] = useState(existingClientId);
  const [clientStatus, setClientStatus] = useState("");
  const [ownedSkus, setOwnedSkus] = useState<string[]>([]);
  const [contact, setContact] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [packageDisplayName, setPackageDisplayName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [lineNames, setLineNames] = useState<Record<string, string>>({});
  const [logoUrl, setLogoUrl] = useState("");
  const [managementMode, setManagementMode] = useState<ManagementMode>("shared");
  const [createdDeal, setCreatedDeal] = useState<{ id: string; number: string; publicUrl: string } | null>(
    null
  );

  useEffect(() => {
    Promise.all([
      fetchPartnerCatalog(),
      fetchPartnerPricebook().catch(() => [] as PartnerPriceLine[]),
    ])
      .then(([data, pricebook]) => {
        const bySku = new Map((pricebook || []).map((row) => [row.sku, row]));
        setItems(
          (data.items || []).map((item) => {
            const row = bySku.get(item.sku);
            return row ? { ...item, ...row } : item;
          })
        );
        setWizard(data.wizard || { packages: [], categories: [] });
        setPartnerShareRate(Number(data.partnerShareRate) || 0.75);
      })
      .catch(() => setError("לא ניתן לטעון קטלוג"));
    fetchPartnerMe()
      .then((data) => {
        const branding = data.branding || {};
        setLogoUrl(String(branding.logoUrl || ""));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!existingClientId) return;
    fetchPartnerClient(existingClientId)
      .then((data) => {
        const client = data.client;
        setClientId(client._id);
        setClientStatus(String(client.status || ""));
        const owned = (client.selectedSkus || [])
          .map((line) => String(line.sku || "").trim())
          .filter(Boolean);
        setOwnedSkus(owned);
        setContact({
          businessName: client.contact.businessName || "",
          contactName: client.contact.contactName || "",
          email: client.contact.email || "",
          phone: client.contact.phone || "",
          notes: client.contact.notes || "",
        });
        setManagementMode(client.managementMode || "shared");
      })
      .catch((err) => setError(partnerApiError(err, "לא ניתן לטעון לקוח")));
  }, [existingClientId]);

  const preview = useMemo(
    () => computeDealPreview(items, selectedSkus, partnerShareRate),
    [items, selectedSkus, partnerShareRate]
  );
  const bizuplyShareRate = Math.max(0, 1 - Number(partnerShareRate || 0));
  const defaultPackageName = publicPackageLabel(
    preview.primary?.displayNameHe || preview.primary?.nameHe || "",
    "רישיון שימוש במערכת"
  );

  useEffect(() => {
    setLineNames((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const sku of selectedSkus) {
        if (next[sku]) continue;
        const item = items.find((row) => row.sku === sku);
        next[sku] = publicPackageLabel(
          item?.displayNameHe || item?.nameHe,
          item?.nameHe || sku
        );
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [selectedSkus, items]);

  useEffect(() => {
    if (packageDisplayName || !defaultPackageName) return;
    setPackageDisplayName(defaultPackageName);
  }, [defaultPackageName, packageDisplayName]);

  async function createDraft() {
    if (!contact.businessName.trim() || !contact.contactName.trim() || !contact.email.trim()) {
      setError("יש למלא שם עסק, איש קשר ואימייל");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = await createPartnerClient({
        contact,
        lines: [],
        managementMode,
      });
      setClientId(data.client._id);
      setStep(2);
    } catch (err: unknown) {
      setError(partnerApiError(err, "שגיאה ביצירת לקוח"));
    } finally {
      setSaving(false);
    }
  }

  function dealLines() {
    return selectedSkus
      .filter((sku) => !ownedSkus.includes(sku))
      .map((sku) => ({
        sku,
        displayNameHe: lineNames[sku],
      }));
  }

  async function persistQuote() {
    if (!clientId || ownedSkus.length) return;
    await updatePartnerClient(clientId, { lines: dealLines(), managementMode });
  }

  async function createDeal() {
    if (!clientId) return;
    const newLines = dealLines();
    if (!newLines.length) {
      setError("יש לבחור חבילה או שירות");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const quoteLocked =
        ["active", "provisioning"].includes(clientStatus) ||
        ownedSkus.length > 0 ||
        Boolean(existingClientId && !clientStatus);
      if (!quoteLocked) {
        await persistQuote();
      }
      const data = await createPartnerDeal(clientId, {
        lines: newLines,
        packageDisplayName,
        packageDescription,
        logoUrl,
        kind: ownedSkus.length ? "amendment" : "initial",
      });
      setCreatedDeal({
        id: data.deal._id,
        number: data.deal.dealNumber,
        publicUrl: data.publicUrl,
      });
    } catch (err: unknown) {
      setError(partnerApiError(err, "שגיאה ביצירת עסקה"));
    } finally {
      setSaving(false);
    }
  }

  const shareUrl = createdDeal ? absoluteCustomerUrl(createdDeal.publicUrl) : "";

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <PartnerPageHeader
        eyebrow={existingClientId ? "עסקה נוספת" : "לקוח חדש"}
        title={existingClientId ? "הוספת שירותים לעסקה חדשה" : "אשף יצירת לקוח"}
        subtitle={
          existingClientId
            ? "בחרו רק תוספות חדשות. חבילות שכבר פעילות אצל הלקוח נשארות נעולות ולא נגבות שוב."
            : "חבילה, תוספות, מחיר ללקוח, ואז קישור לסיכום עסקה. הלקוח משלם לכם, ואתם משלמים ל-Bizuply."
        }
      />

      <ol className="grid gap-2 sm:grid-cols-5">
        {STEPS.map((item) => {
          const Icon = item.icon;
          const active = step === item.id;
          const done = step > item.id;
          return (
            <li
              key={item.id}
              className={[
                "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-black",
                active
                  ? "border-violet-300 bg-violet-50 text-violet-800 shadow-sm"
                  : done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-400",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-7 w-7 place-items-center rounded-xl",
                  active ? "bg-violet-600 text-white" : done ? "bg-emerald-600 text-white" : "bg-slate-100",
                ].join(" ")}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </span>
              {item.label}
            </li>
          );
        })}
      </ol>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black">פרטי העסק ואיש הקשר</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["businessName", "שם העסק"],
              ["contactName", "איש קשר"],
              ["email", "אימייל"],
              ["phone", "טלפון"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm font-black text-slate-600">
                {label}
                <input
                  value={contact[key as keyof typeof contact]}
                  onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-violet-400 focus:bg-white"
                />
              </label>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(MODE_COPY) as ManagementMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setManagementMode(mode)}
                className={[
                  "rounded-3xl border p-4 text-right",
                  managementMode === mode ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-slate-50",
                ].join(" ")}
              >
                <Shield className="mb-2 h-4 w-4 text-violet-600" />
                <p className="font-black">{MODE_COPY[mode].title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{MODE_COPY[mode].text}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={createDraft}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {saving ? "שומר..." : "המשך לבחירת חבילה"}
          </button>
        </section>
      ) : null}

      {step === 2 || step === 3 ? (
        <PartnerCatalogPicker
          items={items}
          wizard={wizard}
          selectedSkus={selectedSkus}
          lockedSkus={ownedSkus}
          onChange={setSelectedSkus}
          partnerShareRate={partnerShareRate}
          onContinue={() => setStep(step === 2 ? 3 : 4)}
          continueLabel={step === 2 ? "המשך לתוספות" : "המשך לתמחור ללקוח"}
          mode={step === 2 ? "packages" : "addons"}
        />
      ) : null}

      {step === 4 ? (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black">תמחור ללקוח</h3>
          <p className="text-sm font-bold text-slate-500">
            המחיר נבנה רק מהמוצרים שנבחרו: מחיר Bizuply + העמלה החד-פעמית והחודשית שהוגדרו לכל מוצר במחירון. Bizuply מקבלת {formatPct(bizuplyShareRate)} מכל עמלה לפי חבילת הפרטנר, ואתם מקבלים {formatPct(partnerShareRate)}.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Metric label="עלות השירותים שלך מ-Bizuply" value={formatIls(preview.totals.wholesale)} />
            <Metric label="העמלה שלך (חד-פעמי + חודשי)" value={formatIls(preview.totals.partnerCommission)} />
            <Metric label="מחיר חד-פעמי ללקוח" value={formatIls(preview.totals.oneTime)} />
            <Metric label="מחיר כל חודש ללקוח" value={formatIls(preview.totals.monthly)} />
            <Metric label="לתשלום עכשיו ללקוח" value={formatIls(preview.totals.customerNow)} />
            <Metric label="חלק Bizuply" value={formatIls(preview.totals.bizuplyShare)} />
            <Metric label="הסכום לתשלום ל-Bizuply" value={formatIls(preview.totals.partnerPaysBizuply)} />
          </div>
          <details className="rounded-2xl border border-slate-200 p-4">
            <summary className="cursor-pointer font-black">פירוט התמחור</summary>
            <div className="mt-3 space-y-2 text-sm font-bold text-slate-600">
              {preview.lines.map((line) => (
                <div key={line.sku} className="flex justify-between gap-3">
                  <span>{line.displayNameHe || line.nameHe}</span>
                  <span>
                    {isCommissionSku(line.sku)
                      ? formatIls(line.customerFinalPrice)
                      : `${formatIls(line.partnerWholesalePrice)} → ${formatIls(line.customerFinalPrice)}`}
                  </span>
                </div>
              ))}
            </div>
          </details>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setStep(3)} className="rounded-2xl border px-4 py-2 font-black">
              חזרה
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="rounded-2xl bg-slate-900 px-4 py-2 font-black text-white"
            >
              המשך לתצוגה מקדימה
            </button>
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black">תצוגה מקדימה ללקוח</h3>
          <p className="text-sm font-bold text-slate-500">
            כך הלקוח יראה את המוצרים ואת הסכום הסופי בלבד. פירוט המחירים נשאר אצלך בעמוד העסקה.
          </p>
          <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="mb-4 h-14 w-14 rounded-2xl bg-white object-cover" />
            ) : null}
            <label className="block">
              <span className="text-xs font-black text-slate-400">שם הרישיון / החבילה בהצעה ללקוח</span>
              <input
                value={packageDisplayName}
                onChange={(e) => setPackageDisplayName(e.target.value)}
                placeholder={defaultPackageName || "שם החבילה"}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-2xl font-black outline-none focus:border-violet-400"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-black text-slate-400">תיאור הרישיון ללקוח</span>
              <textarea
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="רישיון שימוש במערכת ניהול עסק מלאה"
                rows={2}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 font-bold outline-none focus:border-violet-400"
              />
            </label>
            <div className="mt-4 space-y-2">
              {preview.lines.filter((line) => !isCommissionSku(line.sku)).map((line) => (
                <label key={line.sku} className="block">
                  <span className="text-[11px] font-black text-slate-400">שם השירות ללקוח</span>
                  <input
                    value={lineNames[line.sku] || ""}
                    onChange={(e) => setLineNames((prev) => ({ ...prev, [line.sku]: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black outline-none focus:border-violet-400"
                  />
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-violet-700">פירוט מוצרים</p>
            <div className="mt-2 space-y-2">
              {preview.lines.filter((line) => !isCommissionSku(line.sku)).map((line) => (
                <div key={line.sku} className="rounded-2xl border border-slate-100 bg-white px-3 py-2">
                  <p className="font-black">{lineNames[line.sku] || publicPackageLabel(line.displayNameHe || line.nameHe, line.nameHe)}</p>
                  <p className="text-xs font-bold text-slate-400">{billingLabel(line.billing)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-black">מחיר חד-פעמי {formatIls(preview.totals.oneTime)}</p>
            <p className="text-sm font-black">מחיר כל חודש {formatIls(preview.totals.monthly)}</p>
            {preview.totals.annual ? (
              <p className="text-sm font-black">שנתי {formatIls(preview.totals.annual)}</p>
            ) : null}
            <p className="mt-3 text-xl font-black">לתשלום עכשיו {formatIls(preview.totals.customerNow)}</p>
          </div>
          {createdDeal ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="font-black text-emerald-800">עסקה {createdDeal.number} נוצרה</p>
              <p className="mt-2 break-all text-sm font-bold">
                {shareUrl}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-black text-white"
                >
                  העתקת קישור ללקוח
                </button>
                <Link
                  to={`/partner/dashboard/deals/${createdDeal.id}`}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
                >
                  מעבר לתשלום ל-Bizuply
                </Link>
                <Link
                  to={`/partner/dashboard/crm/${clientId}`}
                  className="rounded-2xl border px-4 py-2 text-sm font-black"
                >
                  תיק הלקוח
                </Link>
                <Link
                  to="/partner/dashboard/withdrawals"
                  className="rounded-2xl border px-4 py-2 text-sm font-black"
                >
                  משיכת עמלה
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setStep(4)} className="rounded-2xl border px-4 py-2 font-black">
                חזרה
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={createDeal}
                className="rounded-2xl bg-violet-700 px-4 py-2 font-black text-white disabled:opacity-60"
              >
                {saving ? "יוצר עסקה..." : "יצירת Deal וקישור ללקוח"}
              </button>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
