import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  Package,
  UserPlus,
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

const PAYMENT_MODES = [
  {
    id: "manual_paid",
    label: "שולם ידני",
    hint: "מפעיל מנוי מיד ורושם רכישה",
  },
  {
    id: "none",
    label: "ללא תשלום כרגע",
    hint: "המשתמש נוצר כממתין לתשלום",
  },
];

const EMPTY = {
  name: "",
  email: "",
  password: "",
  phone: "",
  businessName: "",
  category: "general",
  affiliateId: "",
  marketerId: "",
  packageSku: "monthly",
  includeWebsiteAddon: false,
  paymentMode: "manual_paid",
  fullAccess: true,
  notes: "",
};

export default function StaffCreateUser() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [packages, setPackages] = useState([]);
  const [websiteAddon, setWebsiteAddon] = useState(null);
  const [affiliates, setAffiliates] = useState([]);
  const [marketers, setMarketers] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!authLoading && user && user.role !== "worker") {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const loadMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      const { data } = await API.get("/staff/create-meta");
      setPackages(Array.isArray(data?.packages) ? data.packages : []);
      setWebsiteAddon(data?.websiteAddon || null);
      setAffiliates(Array.isArray(data?.affiliates) ? data.affiliates : []);
      setMarketers(Array.isArray(data?.marketers) ? data.marketers : []);
    } catch (err) {
      console.error(err);
      setError("לא ניתן לטעון חבילות / שותפים");
    } finally {
      setLoadingMeta(false);
    }
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const canAddWebsiteAddon =
    form.packageSku !== "website_only" && Boolean(websiteAddon);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        userType: "business",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim() || undefined,
        phone: form.phone.trim(),
        businessName: form.businessName.trim(),
        category: form.category.trim() || "general",
        packageSku: form.packageSku,
        includeWebsiteAddon: Boolean(form.includeWebsiteAddon),
        paymentMode: form.paymentMode,
        notes: form.notes.trim() || undefined,
        fullAccess: Boolean(form.fullAccess),
      };
      if (form.affiliateId) payload.affiliateId = form.affiliateId;
      if (form.marketerId) payload.marketerId = form.marketerId;

      const { data } = await API.post("/staff/users/create", payload);
      setResult(data);
      setForm((prev) => ({
        ...EMPTY,
        packageSku: prev.packageSku,
        paymentMode: prev.paymentMode,
      }));
    } catch (err) {
      setError(err.response?.data?.error || "שגיאה ביצירת בעל עסק");
    } finally {
      setSubmitting(false);
    }
  };

  const packageCards = useMemo(
    () =>
      packages.filter((item) =>
        ["monthly", "yearly", "earlybird", "website_only"].includes(item.sku)
      ),
    [packages]
  );

  if (authLoading || loadingMeta) {
    return <BizuplyLoader fullScreen label="טוען טופס יצירה..." />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f6fb] text-slate-800">
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <UserPlus className="h-6 w-6 text-[#7C4DFF]" />
              יצירת בעל עסק
            </h1>
            <p className="mt-1 text-sm font-bold text-slate-500">
              טופס מקצועי כמו באדמין — חבילה, שיוך לשותף, ותשלום ידני
            </p>
          </div>
          <Link
            to="/staff/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לדשבורד
          </Link>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        {result?.success ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p className="flex items-center gap-2 font-black">
              <CheckCircle2 className="h-4 w-4" />
              {result.message || "בעל העסק נוצר בהצלחה"}
            </p>
            {result.temporaryPassword ? (
              <p className="mt-2 font-bold">
                סיסמה: <code>{result.temporaryPassword}</code>
              </p>
            ) : null}
            {result.user?.email ? (
              <p className="mt-1 font-bold">אימייל: {result.user.email}</p>
            ) : null}
            {result.business?.businessName ? (
              <p className="mt-1 font-bold">
                עסק: {result.business.businessName}
              </p>
            ) : null}
            {result.packageSku ? (
              <p className="mt-1 font-bold">
                חבילה: {result.packageSku}
                {result.includeWebsiteAddon ? " + תוספת אתר" : ""} · תשלום:{" "}
                {result.paymentMode}
              </p>
            ) : null}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"
        >
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black">
              <Building2 className="h-4 w-4 text-[#7C4DFF]" />
              פרטי בעל העסק
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-bold">
                שם מלא *
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              <label className="block text-sm font-bold">
                אימייל *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              <label className="block text-sm font-bold">
                סיסמה (ריק = סיסמה זמנית)
                <input
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  minLength={6}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              <label className="block text-sm font-bold">
                טלפון *
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              <label className="block text-sm font-bold">
                שם העסק *
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              <label className="block text-sm font-bold">
                קטגוריה
                <input
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              <label className="block text-sm font-bold">
                שיוך לשותף
                <select
                  name="affiliateId"
                  value={form.affiliateId}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                >
                  <option value="">ללא שותף</option>
                  {affiliates.map((a) => (
                    <option key={a._id || a.affiliateId} value={a.affiliateId}>
                      {a.name} ({a.affiliateId})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-bold">
                שיוך למשווק
                <select
                  name="marketerId"
                  value={form.marketerId}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                >
                  <option value="">ללא משווק</option>
                  {marketers.map((m) => (
                    <option key={m._id || m.marketerId} value={m.marketerId}>
                      {m.name} ({m.marketerId})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black">
              <Package className="h-4 w-4 text-[#7C4DFF]" />
              חבילה מהקטלוג
            </h2>
            {packageCards.length === 0 ? (
              <p className="text-sm font-bold text-amber-700">
                אין חבילות פעילות בקטלוג
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {packageCards.map((pkg) => (
                  <label
                    key={pkg.sku}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition ${
                      form.packageSku === pkg.sku
                        ? "border-[#7C4DFF] bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="packageSku"
                      value={pkg.sku}
                      checked={form.packageSku === pkg.sku}
                      onChange={onChange}
                      className="me-2"
                    />
                    <span className="font-black">{pkg.nameHe || pkg.sku}</span>
                    <span className="mt-1 block text-xs font-bold text-slate-500">
                      ₪{pkg.amountIls} · {pkg.billing} · {pkg.sku}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {canAddWebsiteAddon ? (
              <label className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold">
                <input
                  type="checkbox"
                  name="includeWebsiteAddon"
                  checked={form.includeWebsiteAddon}
                  onChange={onChange}
                  className="mt-1"
                />
                <span>
                  אפסייל: {websiteAddon.nameHe || "תוספת אתר"} — ₪
                  {websiteAddon.amountIls}
                </span>
              </label>
            ) : null}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black">
              <CreditCard className="h-4 w-4 text-[#7C4DFF]" />
              תשלום
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_MODES.map((mode) => (
                <label
                  key={mode.id}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition ${
                    form.paymentMode === mode.id
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value={mode.id}
                    checked={form.paymentMode === mode.id}
                    onChange={onChange}
                    className="me-2"
                  />
                  <span className="font-black">{mode.label}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">
                    {mode.hint}
                  </span>
                </label>
              ))}
            </div>
            <label className="mt-3 block text-sm font-bold">
              הערות
              <input
                name="notes"
                value={form.notes}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
              />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                name="fullAccess"
                checked={form.fullAccess}
                onChange={onChange}
              />
              גישה מלאה לפלטפורמה
            </label>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#7C4DFF] px-6 py-3 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0] disabled:opacity-60"
            >
              {submitting ? "יוצר..." : "צור בעל עסק"}
            </button>
            <Link
              to="/staff/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600"
            >
              ביטול
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
