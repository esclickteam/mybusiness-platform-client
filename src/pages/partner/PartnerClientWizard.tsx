import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Shield,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import {
  activatePartnerClient,
  createPartnerClient,
  enterPartnerClient,
  fetchPartnerCatalog,
  submitPartnerClient,
  updatePartnerClient,
} from "../../lib/partnerApi";
import { formatIls, quotePreviewLine } from "../../lib/partnerMoney";
import type { ManagementMode, PartnerPriceLine } from "../../types/partner";
import PartnerMarkupBreakdown from "../../components/partner/PartnerMarkupBreakdown";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { useAuth } from "../../context/AuthContext";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";

const STEPS = [
  { id: 1, label: "יצירה", icon: Store },
  { id: 2, label: "מוצרים והעמלה", icon: Sparkles },
  { id: 3, label: "הרשאות", icon: Shield },
  { id: 4, label: "עלות פרטנר", icon: Wallet },
  { id: 5, label: "תשלום / הפעלה", icon: CreditCard },
  { id: 6, label: "הקמת עסק", icon: Check },
];

const MODE_COPY: Record<
  ManagementMode,
  { title: string; text: string }
> = {
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

const FIELD_META: Array<{
  key: "businessName" | "contactName" | "email" | "phone";
  label: string;
  placeholder: string;
}> = [
  { key: "businessName", label: "שם העסק", placeholder: "לדוגמה: סטודיו נועה" },
  { key: "contactName", label: "איש קשר", placeholder: "שם מלא" },
  { key: "email", label: "אימייל", placeholder: "name@business.co.il" },
  { key: "phone", label: "טלפון", placeholder: "050-0000000" },
];

export default function PartnerClientWizard() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as {
    loginWithToken?: (
      user: unknown,
      token: string,
      options?: { skipRedirect?: boolean }
    ) => void;
  };
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [catalog, setCatalog] = useState<PartnerPriceLine[]>([]);
  const [clientId, setClientId] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [activatedBusinessId, setActivatedBusinessId] = useState("");
  const [entering, setEntering] = useState(false);
  const [contact, setContact] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [managementMode, setManagementMode] = useState<ManagementMode>("shared");

  useEffect(() => {
    fetchPartnerCatalog()
      .then(setCatalog)
      .catch(() => setError("לא ניתן לטעון קטלוג"));
  }, []);

  const lines = useMemo(
    () => Object.entries(selected).map(([sku, markupIls]) => ({ sku, markupIls })),
    [selected]
  );

  const preview = useMemo(() => {
    return lines
      .map((line) => {
        const item = catalog.find((row) => row.sku === line.sku);
        if (!item) return null;
        const quoted = quotePreviewLine({ ...item, markup: line.markupIls });
        return {
          ...item,
          markup: quoted.markup,
          customerFinalPrice: quoted.customerFinalPrice,
          partnerMarkupShare: quoted.partnerMarkupShare,
          bizuplyMarkupShare: quoted.bizuplyMarkupShare,
          partnerShareRate: quoted.partnerShareRate,
          bizuplyShareRate: quoted.bizuplyShareRate,
          partnerCostToBizuply: quoted.partnerCostToBizuply,
        };
      })
      .filter(Boolean) as Array<PartnerPriceLine & { markup: number }>;
  }, [lines, catalog]);

  const partnerCost = preview.reduce(
    (sum, item) => sum + Number(item.partnerCostToBizuply || 0),
    0
  );
  const extraCommission = preview.reduce((sum, item) => sum + Number(item.markup || 0), 0);
  const customerTotal = preview.reduce(
    (sum, item) => sum + Number(item.customerFinalPrice || 0),
    0
  );

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
        lines,
        managementMode,
      });
      setClientId(data.client._id);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה ביצירת לקוח");
    } finally {
      setSaving(false);
    }
  }

  async function finish(activate: boolean) {
    if (!clientId) return;
    setSaving(true);
    setError("");
    try {
      await updatePartnerClient(clientId, { lines, managementMode });
      await submitPartnerClient(clientId);
      if (activate) {
        const data = await activatePartnerClient(clientId);
        setTempPassword(data.temporaryPassword || "");
        setActivatedBusinessId(String(data.businessId || data.client?.businessId || ""));
        setStep(6);
        return;
      }
      navigate(`/partner/dashboard/crm/${clientId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  }

  async function enterActivatedClient() {
    if (!clientId) return;
    setEntering(true);
    setError("");
    try {
      const data = await enterPartnerClient(clientId);
      loginWithToken?.(data.user, data.token, { skipRedirect: true });
      navigate(getDefaultDashboardPath(data.user.businessId, data.user.enabledModules), {
        replace: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "לא ניתן להיכנס לניהול הלקוח");
    } finally {
      setEntering(false);
    }
  }

  return (
    <div className="space-y-6">
      <PartnerPageHeader
        eyebrow="לקוח חדש"
        title="אשף יצירת לקוח"
        subtitle="תיעוד מלא, תמחור שקוף, ואחרי הפעלה — כניסה ישירה לניהול העסק של הלקוח."
      />

      <ol className="grid gap-2 sm:grid-cols-6">
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
        <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div>
            <h3 className="text-lg font-black">פרטי העסק ואיש הקשר</h3>
            <p className="text-sm font-bold text-slate-500">
              זה התיעוד המסחרי של הלקוח אצלכם — לא ה-CRM הפנימי של העסק שלו.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {FIELD_META.map((field) => (
              <label key={field.key} className="block text-sm font-black text-slate-600">
                {field.label}
                <input
                  value={contact[field.key]}
                  onChange={(e) => setContact({ ...contact, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white"
                />
              </label>
            ))}
          </div>
          <label className="block text-sm font-black text-slate-600">
            הערת פתיחה לתיק הלקוח
            <textarea
              value={contact.notes}
              onChange={(e) => setContact({ ...contact, notes: e.target.value })}
              placeholder="רקע, מקור ליד, הסכם בעל פה, מועד שיחה..."
              className="mt-1 min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-violet-400 focus:bg-white"
            />
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={createDraft}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/15 disabled:opacity-60"
          >
            {saving ? "שומר..." : "המשך לבחירת מוצרים ועמלה נוספת"}
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          <div className="rounded-3xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm font-bold text-violet-900">
            עמלה נוספת היא התוספת שאתם גובים מעל מחיר Bizuply עבורך. הלקוח משלם לכם את המחיר הסופי,
            ו-Bizuply מקבלת אחוז קבוע מהעמלה הנוספת לפי המסלול שלכם.
          </div>
          {catalog.map((item) => {
            const checked = Object.prototype.hasOwnProperty.call(selected, item.sku);
            const quoted = checked
              ? quotePreviewLine({ ...item, markup: selected[item.sku] })
              : null;
            return (
              <article
                key={item.sku}
                className={[
                  "rounded-3xl border bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]",
                  checked ? "border-violet-200" : "border-slate-200/80",
                ].join(" ")}
              >
                <label className="flex cursor-pointer items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = { ...selected };
                        if (e.target.checked) next[item.sku] = 0;
                        else delete next[item.sku];
                        setSelected(next);
                      }}
                      className="mt-1 h-4 w-4 accent-violet-700"
                    />
                    <div>
                      <h3 className="font-black text-slate-900">{item.nameHe || item.sku}</h3>
                      <p className="text-xs font-bold text-slate-500">
                        מחיר Bizuply עבורך {formatIls(item.partnerWholesalePrice)} · השוואה קמעונאית{" "}
                        {formatIls(item.retailIls || item.retailPrice)}
                      </p>
                    </div>
                  </div>
                  {checked ? (
                    <label className="block text-xs font-black text-violet-800">
                      עמלה נוספת
                      <input
                        type="number"
                        min={0}
                        value={selected[item.sku]}
                        onChange={(e) =>
                          setSelected({ ...selected, [item.sku]: Number(e.target.value) || 0 })
                        }
                        className="mt-1 w-32 rounded-xl border border-violet-200 bg-violet-50 px-2 py-1.5 text-sm font-black"
                      />
                    </label>
                  ) : null}
                </label>
                {quoted ? (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <PartnerMarkupBreakdown
                      showTitle={false}
                      compact
                      line={{ ...item, ...quoted, markup: quoted.markup }}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black"
            >
              חזרה
            </button>
            <button
              type="button"
              disabled={!lines.length}
              onClick={() => setStep(3)}
              className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white disabled:opacity-40"
            >
              המשך להרשאות
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div>
            <h3 className="text-lg font-black">מצב ניהול</h3>
            <p className="text-sm font-bold text-slate-500">
              לא מחליפים את בעלות העסק. אחרי הפעלה תוכלו להיכנס ישירות לניהול הלקוח ולבצע את כל הפעולות.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(MODE_COPY) as ManagementMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setManagementMode(mode)}
                className={[
                  "rounded-2xl border p-4 text-right transition",
                  managementMode === mode
                    ? "border-violet-400 bg-violet-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300",
                ].join(" ")}
              >
                <p className="font-black text-slate-900">{MODE_COPY[mode].title}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                  {MODE_COPY[mode].text}
                </p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black"
            >
              חזרה
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white"
            >
              המשך לסיכום עלות
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 || step === 5 ? (
        <section className="space-y-4">
          {preview.map((line) => (
            <div
              key={line.sku}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
            >
              <PartnerMarkupBreakdown line={line} />
            </div>
          ))}
          <div className="grid gap-3 rounded-3xl border border-slate-900 bg-slate-900 p-5 text-white md:grid-cols-3">
            <SummaryStat label="עמלה נוספת כוללת" value={formatIls(extraCommission)} />
            <SummaryStat label="הלקוח משלם לכם" value={formatIls(customerTotal)} />
            <SummaryStat label="עלות הפרטנר ל-Bizuply" value={formatIls(partnerCost)} />
          </div>
          <p className="text-sm font-bold leading-6 text-slate-500">
            הלקוח משלם לכם ישירות. Bizuply לא מחזיקה כספים ולא מבצעת payout ב-Phase 1.
            מוצרים בתשלום יופעלו רק אחרי הפעלה. החוב ל-Bizuply הוא הסיטונאות ועוד חלק Bizuply מהעמלה הנוספת.
          </p>
          {step === 4 ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black"
              >
                חזרה
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white"
              >
                המשך לתשלום והפעלה
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black"
              >
                חזרה
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => finish(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black"
              >
                שמור כממתין לתשלום
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => finish(true)}
                className="rounded-2xl bg-violet-700 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-700/20"
              >
                {saving ? "מפעיל..." : "הפעלה ורישום חוב ל-Bizuply"}
              </button>
            </div>
          )}
        </section>
      ) : null}

      {step === 6 ? (
        <section className="space-y-4 rounded-3xl border border-emerald-200 bg-gradient-to-bl from-emerald-50 to-white p-6">
          <h3 className="text-xl font-black text-emerald-950">העסק הוקם והלקוח פעיל</h3>
          <p className="text-sm font-bold text-emerald-800">
            אפשר להיכנס עכשיו לניהול המלא של הלקוח — CRM, אתר, וואטסאפ וכל המודולים שרכש.
          </p>
          {tempPassword ? (
            <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm">
              <p className="font-black text-slate-500">סיסמה זמנית ללקוח</p>
              <p className="mt-1 font-black tracking-wide text-slate-900">{tempPassword}</p>
            </div>
          ) : null}
          {activatedBusinessId ? (
            <p className="text-xs font-bold text-slate-500">מזהה עסק: {activatedBusinessId}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={entering}
              onClick={enterActivatedClient}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white"
            >
              {entering ? "נכנס לניהול..." : "כניסה לניהול הלקוח"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/partner/dashboard/crm/${clientId}`)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black"
            >
              תיעוד מלא של הלקוח
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
