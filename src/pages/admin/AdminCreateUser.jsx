import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  CreditCard,
  Package,
  UserPlus,
  Users,
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import AdminHeader from "./AdminsHeader";

const USER_TYPES = [
  { id: "business", label: "עסק / לקוח SaaS", needsPackage: true },
  { id: "affiliate", label: "שותף (Affiliate)", needsPackage: false },
  { id: "marketer", label: "משווק קמפיינים", needsPackage: false },
  { id: "customer", label: "לקוח קצה", needsPackage: false },
  { id: "worker", label: "עובד", needsPackage: false },
  { id: "manager", label: "מנהל", needsPackage: false },
  { id: "admin", label: "מנהל מערכת", needsPackage: false },
];

const PAYMENT_MODES = [
  {
    id: "manual_paid",
    label: "שולם ידני",
    hint: "מפעיל מנוי מיד ורושם רכישה בקטלוג",
  },
  {
    id: "stripe",
    label: "תשלום ב-Stripe",
    hint: "פותח Checkout לפי מחיר מהקטלוג",
  },
  {
    id: "none",
    label: "ללא תשלום כרגע",
    hint: "המשתמש נוצר כממתין לתשלום",
  },
];

const MODULE_OPTIONS = [
  { id: "crm", label: "CRM / לידים" },
  { id: "meta-campaigns", label: "ניהול קמפיינים מטא" },
  { id: "whatsapp", label: "וואטסאפ" },
  { id: "social-schedule", label: "תזמון פוסטים" },
  { id: "collab", label: "שיתופי פעולה" },
  { id: "website", label: "בניית אתרים" },
  { id: "build", label: "עמוד עסקי" },
  { id: "BizUply", label: "היועץ העסקי" },
  { id: "billing", label: "חיוב ומנוי" },
  { id: "dashboard", label: "דשבורד" },
];

const EMPTY = {
  userType: "business",
  name: "",
  email: "",
  password: "",
  phone: "",
  username: "",
  businessName: "",
  category: "general",
  affiliateId: "",
  marketerId: "",
  publicId: "",
  commissionRate: "20",
  packageSku: "monthly",
  includeWebsiteAddon: false,
  paymentMode: "manual_paid",
  fullAccess: true,
  enabledModules: ["crm", "meta-campaigns"],
  notes: "",
};

export default function AdminCreateUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(EMPTY);
  const [catalog, setCatalog] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [marketers, setMarketers] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      setResult({
        success: true,
        message: "התשלום ב-Stripe הושלם / נפתח בהצלחה. המשתמש עודכן.",
      });
    } else if (checkout === "cancel") {
      setError("תשלום Stripe בוטל — המשתמש כבר נוצר וניתן לשלוח שוב לתשלום מלקוחות.");
    }
  }, [searchParams]);

  const loadMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      const [pricingRes, affiliatesRes, marketersRes] = await Promise.all([
        API.get("/admin/pricing"),
        API.get("/admin/affiliates"),
        API.get("/admin/marketers"),
      ]);
      setCatalog(Array.isArray(pricingRes.data?.items) ? pricingRes.data.items : []);
      setAffiliates(
        Array.isArray(affiliatesRes.data?.affiliates)
          ? affiliatesRes.data.affiliates
          : []
      );
      setMarketers(
        Array.isArray(marketersRes.data?.marketers)
          ? marketersRes.data.marketers
          : []
      );
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

  const packages = useMemo(
    () =>
      catalog.filter(
        (item) =>
          item.active !== false &&
          item.kind === "package" &&
          ["monthly", "yearly", "earlybird", "website_only"].includes(item.sku)
      ),
    [catalog]
  );

  const websiteAddon = useMemo(
    () => catalog.find((item) => item.sku === "website_addon"),
    [catalog]
  );

  const selectedType = USER_TYPES.find((t) => t.id === form.userType);
  const needsPackage = Boolean(selectedType?.needsPackage);
  const canAddWebsiteAddon =
    needsPackage && form.packageSku !== "website_only" && websiteAddon;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleModule = (moduleId) => {
    setForm((prev) => {
      const set = new Set(prev.enabledModules || []);
      if (set.has(moduleId)) set.delete(moduleId);
      else set.add(moduleId);
      return { ...prev, enabledModules: Array.from(set) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        userType: form.userType,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim() || undefined,
        phone: form.phone.trim() || undefined,
        username: form.username.trim() || undefined,
      };

      if (form.userType === "business") {
        payload.businessName = form.businessName.trim();
        payload.category = form.category.trim() || "general";
        payload.packageSku = form.packageSku;
        payload.includeWebsiteAddon = Boolean(form.includeWebsiteAddon);
        payload.paymentMode = form.paymentMode;
        payload.notes = form.notes.trim() || undefined;
        if (form.affiliateId) payload.affiliateId = form.affiliateId;
        if (form.marketerId) {
          payload.marketerId = form.marketerId;
          payload.fullAccess = Boolean(form.fullAccess);
          if (!form.fullAccess) {
            payload.enabledModules = form.enabledModules;
          }
        } else if (!form.fullAccess) {
          payload.fullAccess = false;
          payload.enabledModules = form.enabledModules;
        } else {
          payload.fullAccess = true;
        }
      }

      if (form.userType === "affiliate") {
        payload.affiliateId = form.publicId.trim();
        payload.commissionRate = Number(form.commissionRate) || 20;
      }

      if (form.userType === "marketer") {
        payload.marketerId = form.publicId.trim();
      }

      const { data } = await API.post("/admin/users/create", payload);

      if (data.checkout?.url) {
        window.location.href = data.checkout.url;
        return;
      }

      setResult(data);
      setForm((prev) => ({
        ...EMPTY,
        userType: prev.userType,
        packageSku: prev.packageSku,
        paymentMode: prev.paymentMode,
      }));
    } catch (err) {
      setError(err.response?.data?.error || "שגיאה ביצירת משתמש");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMeta) {
    return <BizuplyLoader fullScreen label="טוען חבילות ושותפים..." />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f6fb] text-slate-800">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <UserPlus className="h-6 w-6 text-[#7C4DFF]" />
              יצירת משתמש
            </h1>
            <p className="mt-1 text-sm font-bold text-slate-500">
              בחירת סוג משתמש, חבילה מהקטלוג (כולל אפסיילים), שיוך לשותף, ותשלום
              ידני או Stripe
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600"
          >
            לרשימת משתמשים
          </button>
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
              {result.message || "המשתמש נוצר בהצלחה"}
            </p>
            {result.temporaryPassword ? (
              <p className="mt-2 font-bold">
                סיסמה: <code>{result.temporaryPassword}</code>
              </p>
            ) : null}
            {result.user?.email ? (
              <p className="mt-1 font-bold">אימייל: {result.user.email}</p>
            ) : null}
            {result.packageSku ? (
              <p className="mt-1 font-bold">
                חבילה: {result.packageSku}
                {result.includeWebsiteAddon ? " + תוספת אתר" : ""} · תשלום:{" "}
                {result.paymentMode}
              </p>
            ) : null}
            {result.warning ? (
              <p className="mt-2 font-bold text-amber-700">{result.warning}</p>
            ) : null}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"
        >
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black">
              <Users className="h-4 w-4" />
              סוג משתמש
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {USER_TYPES.map((type) => (
                <label
                  key={type.id}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-sm font-bold transition ${
                    form.userType === type.id
                      ? "border-[#7C4DFF] bg-violet-50 text-[#5B35D6]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type.id}
                    checked={form.userType === type.id}
                    onChange={onChange}
                    className="me-2"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
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
            {(form.userType === "business" ||
              form.userType === "worker" ||
              form.userType === "manager") && (
              <label className="block text-sm font-bold">
                טלפון {form.userType === "business" ? "*" : ""}
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required={form.userType === "business"}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
            )}
            {["worker", "manager"].includes(form.userType) ? (
              <label className="block text-sm font-bold">
                שם משתמש
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
            ) : null}
          </section>

          {form.userType === "affiliate" || form.userType === "marketer" ? (
            <section className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-bold">
                מזהה ייחודי * ({form.userType === "affiliate" ? "affiliateId" : "marketerId"})
                <input
                  name="publicId"
                  value={form.publicId}
                  onChange={onChange}
                  required
                  pattern="[A-Za-z0-9_-]{3,20}"
                  placeholder="yael123"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
              {form.userType === "affiliate" ? (
                <label className="block text-sm font-bold">
                  עמלת שותף (%)
                  <input
                    name="commissionRate"
                    type="number"
                    min="1"
                    max="100"
                    value={form.commissionRate}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                  />
                </label>
              ) : null}
            </section>
          ) : null}

          {form.userType === "business" ? (
            <>
              <section className="grid gap-4 md:grid-cols-2">
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
                  שיוך לשותף (Affiliate)
                  <select
                    name="affiliateId"
                    value={form.affiliateId}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                  >
                    <option value="">ללא שותף</option>
                    {affiliates.map((a) => (
                      <option key={a._id} value={a.affiliateId}>
                        {a.name} ({a.affiliateId})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-bold">
                  שיוך למשווק קמפיינים
                  <select
                    name="marketerId"
                    value={form.marketerId}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                  >
                    <option value="">ללא משווק</option>
                    {marketers.map((m) => (
                      <option key={m._id} value={m.marketerId}>
                        {m.name} ({m.marketerId})
                      </option>
                    ))}
                  </select>
                </label>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-base font-black">
                  <Package className="h-4 w-4" />
                  חבילה מהקטלוג
                </h2>
                {packages.length === 0 ? (
                  <p className="text-sm font-bold text-amber-700">
                    אין חבילות פעילות — עדכנו ב־/admin/plans
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {packages.map((pkg) => (
                      <label
                        key={pkg.sku}
                        className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition ${
                          form.packageSku === pkg.sku
                            ? "border-[#7C4DFF] bg-violet-50"
                            : "border-slate-200"
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
                        <span className="font-black">
                          {pkg.nameHe || pkg.sku}
                        </span>
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
                      <span className="mt-0.5 block text-xs font-bold text-slate-500">
                        {websiteAddon.descriptionHe || "תוספת חד־פעמית"}
                      </span>
                    </span>
                  </label>
                ) : null}
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-2 text-base font-black">
                  <CreditCard className="h-4 w-4" />
                  תשלום
                </h2>
                <div className="grid gap-2 sm:grid-cols-3">
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
                  הערות (לרכישה ידנית)
                  <input
                    name="notes"
                    value={form.notes}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                  />
                </label>
              </section>

              <section>
                <h2 className="mb-2 text-base font-black">תוכן גישה / מודולים</h2>
                <label className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    name="fullAccess"
                    checked={form.fullAccess}
                    onChange={onChange}
                  />
                  גישה מלאה לפלטפורמה
                </label>
                {!form.fullAccess ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {MODULE_OPTIONS.map((mod) => (
                      <label
                        key={mod.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
                      >
                        <input
                          type="checkbox"
                          checked={form.enabledModules.includes(mod.id)}
                          onChange={() => toggleModule(mod.id)}
                        />
                        {mod.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-500">
                    אם משויך למשווק קמפיינים ותבטלו גישה מלאה — ברירת המחדל היא
                    CRM + קמפיינים.
                  </p>
                )}
              </section>
            </>
          ) : null}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#7C4DFF] px-6 py-3 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0] disabled:opacity-60"
            >
              {submitting
                ? "יוצר..."
                : form.userType === "business" && form.paymentMode === "stripe"
                  ? "צור משתמש ופתח Stripe"
                  : "צור משתמש"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/plans")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600"
            >
              ניהול מחירי חבילות
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
