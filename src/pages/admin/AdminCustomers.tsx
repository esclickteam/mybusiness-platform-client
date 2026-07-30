import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Plus,
  Search,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import AdminHeader from "./AdminsHeader";

type CustomerOwner = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
  hasPaid?: boolean;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
  trialEndsAt?: string | null;
  planLabel?: string;
  statusLabel?: string;
};

type AdminCustomer = {
  _id: string;
  businessName?: string;
  category?: string;
  phone?: string;
  email?: string;
  city?: string;
  logo?: string;
  createdAt?: string;
  owner?: CustomerOwner | null;
};

type Summary = {
  total: number;
  paid: number;
  trial: number;
  pending: number;
};

type CreateForm = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  password: string;
  plan: "monthly" | "yearly";
};

const EMPTY_FORM: CreateForm = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  category: "general",
  password: "",
  plan: "monthly",
};

const PACKAGES = [
  {
    id: "monthly" as const,
    name: "חבילה חודשית",
    price: "₪149",
    period: "לחודש",
    note: "גמישות מלאה, ביטול בכל עת",
  },
  {
    id: "yearly" as const,
    name: "חבילה שנתית",
    price: "₪1,490",
    period: "לשנה",
    note: "חיסכון משמעותי לשנה מלאה",
  },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function statusTone(status?: string, hasPaid?: boolean) {
  if (hasPaid || status === "active") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (status === "past_due" || status === "canceled") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function planTone(plan?: string) {
  if (plan === "yearly") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (plan === "monthly" || plan === "earlybird") {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }
  if (plan === "trial") return "bg-violet-50 text-violet-700 border-violet-200";
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function AdminCustomers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth() as { user: { role?: string } | null };

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    paid: 0,
    trial: 0,
    pending: 0,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [checkoutUserId, setCheckoutUserId] = useState<string | null>(null);
  const [payPlanByUser, setPayPlanByUser] = useState<
    Record<string, "monthly" | "yearly">
  >({});

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (!checkout) return;

    if (checkout === "success") {
      setBanner("התשלום הושלם בהצלחה. המנוי יעודכן ברגע ש־Stripe יאשר.");
    } else if (checkout === "cancel") {
      setBanner("התשלום בוטל. אפשר לנסות שוב בכל רגע.");
    }

    const next = new URLSearchParams(searchParams);
    next.delete("checkout");
    next.delete("userId");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await API.get("/admin/customers", {
        params: debouncedSearch ? { q: debouncedSearch } : undefined,
      });
      setCustomers(Array.isArray(data?.customers) ? data.customers : []);
      setSummary({
        total: Number(data?.summary?.total || 0),
        paid: Number(data?.summary?.paid || 0),
        trial: Number(data?.summary?.trial || 0),
        pending: Number(data?.summary?.pending || 0),
      });
    } catch (err) {
      console.error("Failed to load admin customers:", err);
      setError("לא ניתן לטעון את רשימת הלקוחות");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCountLabel = useMemo(() => {
    if (debouncedSearch) return `${customers.length} תוצאות`;
    return `${summary.total} לקוחות`;
  }, [customers.length, debouncedSearch, summary.total]);

  function updateForm<K extends keyof CreateForm>(key: K, value: CreateForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setBanner("");

    try {
      const { data } = await API.post("/admin/customers", {
        ...form,
        startCheckout: true,
      });

      const checkoutUrl = data?.checkout?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setBanner(
        data?.warning ||
          "הלקוח נוצר בהצלחה. לא התקבל קישור תשלום — אפשר לשלוח לתשלום מהרשימה."
      );
      setShowCreate(false);
      setForm(EMPTY_FORM);
      await loadCustomers();
    } catch (err: any) {
      console.error("Create customer failed:", err);
      setError(err?.response?.data?.error || "לא ניתן ליצור לקוח חדש");
    } finally {
      setCreating(false);
    }
  }

  async function handleCheckout(customer: AdminCustomer) {
    const userId = customer.owner?._id;
    if (!userId) {
      setError("לעסק זה אין בעלים מקושר — לא ניתן לפתוח תשלום");
      return;
    }

    const plan = payPlanByUser[userId] || "monthly";
    setCheckoutUserId(userId);
    setError("");
    setBanner("");

    try {
      const { data } = await API.post(`/admin/customers/${userId}/checkout`, {
        plan,
      });

      const checkoutUrl = data?.checkout?.url;
      if (!checkoutUrl) {
        setError("לא התקבל קישור תשלום מ־Stripe");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Checkout failed:", err);
      setError(err?.response?.data?.error || "לא ניתן לפתוח תשלום Stripe");
    } finally {
      setCheckoutUserId(null);
    }
  }

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f2fb] px-4 py-7 text-right text-slate-800 md:px-8"
        style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
      >
        <section className="mx-auto max-w-[1480px]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-purple-950 md:text-4xl">
                ניהול לקוחות
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-bold text-purple-950/55">
                חיפוש ברשימת העסקים במערכת, יצירת לקוח חדש, בחירת חבילה ותשלום
                מאובטח ב־Stripe.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חיפוש לפי שם עסק, בעלים, אימייל, טלפון..."
                  className="w-full rounded-2xl border border-purple-200 bg-white py-3 pe-4 ps-10 text-sm font-bold text-slate-900 outline-none ring-purple-300 placeholder:text-slate-400 focus:ring-2 sm:w-96"
                />
              </div>
              <span className="rounded-2xl bg-purple-100 px-4 py-3 text-center text-sm font-black text-purple-900">
                {filteredCountLabel}
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(true);
                  setError("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/25 transition hover:-translate-y-0.5 hover:bg-[#6B3FE0]"
              >
                <Plus className="h-4 w-4" />
                לקוח חדש
              </button>
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "סה״כ עסקים",
                value: summary.total,
                icon: <Building2 className="h-4 w-4" />,
                tone: "bg-white text-slate-900",
              },
              {
                label: "משלמים",
                value: summary.paid,
                icon: <CheckCircle2 className="h-4 w-4" />,
                tone: "bg-emerald-50 text-emerald-800",
              },
              {
                label: "בניסיון",
                value: summary.trial,
                icon: <Sparkles className="h-4 w-4" />,
                tone: "bg-violet-50 text-violet-800",
              },
              {
                label: "ממתינים לתשלום",
                value: summary.pending,
                icon: <CreditCard className="h-4 w-4" />,
                tone: "bg-amber-50 text-amber-800",
              },
            ].map((card) => (
              <div
                key={card.label}
                className={`rounded-[22px] border border-purple-100 p-4 shadow-sm ${card.tone}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold opacity-70">{card.label}</p>
                    <strong className="mt-1 block text-2xl font-black">
                      {loading ? "…" : card.value}
                    </strong>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 shadow-sm">
                    {card.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {banner ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {banner}
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-purple-200 bg-white shadow-xl shadow-purple-950/8">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <BizuplyLoader size="xl" />
              </div>
            ) : customers.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <UserPlus className="mx-auto h-10 w-10 text-purple-300" />
                <p className="mt-4 text-sm font-bold text-slate-500">
                  לא נמצאו לקוחות ברשימת העסקים
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#7C4DFF] px-4 py-2.5 text-sm font-black text-white"
                >
                  <Plus className="h-4 w-4" />
                  יצירת לקוח ראשון
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-right">
                  <thead className="bg-purple-50 text-xs font-black text-purple-900/70">
                    <tr>
                      <th className="px-4 py-4">עסק / לקוח</th>
                      <th className="px-4 py-4">בעלים</th>
                      <th className="px-4 py-4">טלפון</th>
                      <th className="px-4 py-4">חבילה</th>
                      <th className="px-4 py-4">סטטוס</th>
                      <th className="px-4 py-4">תוקף</th>
                      <th className="px-4 py-4">תשלום</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      const ownerId = customer.owner?._id || "";
                      const selectedPlan =
                        payPlanByUser[ownerId] ||
                        (customer.owner?.subscriptionPlan === "yearly"
                          ? "yearly"
                          : "monthly");

                      return (
                        <tr
                          key={customer._id}
                          className="border-t border-purple-100 text-sm font-bold text-slate-800"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-start gap-3">
                              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple-100 text-lg">
                                {customer.logo ? (
                                  <img
                                    src={customer.logo}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  "🏢"
                                )}
                              </div>
                              <div>
                                <div className="font-black text-purple-950">
                                  {customer.businessName || "ללא שם"}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {customer.email || "—"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>{customer.owner?.name || "—"}</div>
                            <div className="text-xs font-bold text-slate-400">
                              {customer.owner?.email || ""}
                            </div>
                          </td>
                          <td className="px-4 py-4" dir="ltr">
                            {customer.phone || "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${planTone(
                                customer.owner?.subscriptionPlan
                              )}`}
                            >
                              {customer.owner?.planLabel ||
                                customer.owner?.subscriptionPlan ||
                                "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusTone(
                                customer.owner?.subscriptionStatus,
                                customer.owner?.hasPaid
                              )}`}
                            >
                              {customer.owner?.statusLabel ||
                                customer.owner?.subscriptionStatus ||
                                "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-500">
                            {formatDate(
                              customer.owner?.subscriptionEnd ||
                                customer.owner?.trialEndsAt
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex min-w-[220px] flex-col gap-2">
                              <select
                                value={selectedPlan}
                                disabled={!ownerId || checkoutUserId === ownerId}
                                onChange={(e) =>
                                  setPayPlanByUser((prev) => ({
                                    ...prev,
                                    [ownerId]: e.target.value as
                                      | "monthly"
                                      | "yearly",
                                  }))
                                }
                                className="rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-300"
                              >
                                <option value="monthly">חודשי · ₪149</option>
                                <option value="yearly">שנתי · ₪1,490</option>
                              </select>
                              <button
                                type="button"
                                disabled={!ownerId || checkoutUserId === ownerId}
                                onClick={() => handleCheckout(customer)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-3 py-2.5 text-xs font-black text-black shadow-lg shadow-purple-700/15 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                              >
                                <CreditCard className="h-3.5 w-3.5" />
                                {checkoutUserId === ownerId
                                  ? "פותח Stripe..."
                                  : customer.owner?.hasPaid
                                    ? "שדרוג / חידוש"
                                    : "תשלום ב־Stripe"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {showCreate ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
          <div
            dir="rtl"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-purple-100 bg-white p-5 shadow-2xl md:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-purple-950">
                  יצירת לקוח חדש
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  מילוי פרטים, בחירת חבילה, ואז מעבר לתשלום מאובטח ב־Stripe.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !creating && setShowCreate(false)}
                className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  שם בעלים
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  אימייל
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                    dir="ltr"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  טלפון
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                    dir="ltr"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  סיסמה להתחברות
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                    dir="ltr"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700 sm:col-span-2">
                  שם העסק
                  <input
                    required
                    value={form.businessName}
                    onChange={(e) => updateForm("businessName", e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700 sm:col-span-2">
                  קטגוריה
                  <input
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="למשל: beauty, fitness, consulting"
                  />
                </label>
              </div>

              <div>
                <p className="mb-3 text-sm font-black text-slate-800">
                  בחירת חבילה
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PACKAGES.map((pkg) => {
                    const active = form.plan === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => updateForm("plan", pkg.id)}
                        className={`rounded-[22px] border p-4 text-right transition ${
                          active
                            ? "border-[#7C4DFF] bg-violet-50 shadow-md shadow-violet-200/50"
                            : "border-slate-200 bg-white hover:border-violet-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <strong className="block text-base font-black text-slate-900">
                              {pkg.name}
                            </strong>
                            <p className="mt-1 text-xs font-bold text-slate-500">
                              {pkg.note}
                            </p>
                          </div>
                          <span
                            className={`mt-1 h-4 w-4 rounded-full border-2 ${
                              active
                                ? "border-[#7C4DFF] bg-[#7C4DFF]"
                                : "border-slate-300 bg-white"
                            }`}
                          />
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-2xl font-black text-purple-950">
                            {pkg.price}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {pkg.period}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-6 text-sky-800">
                לאחר יצירת הלקוח תועברו אוטומטית ל־Stripe להשלמת התשלום עבור
                החבילה שנבחרה. בסיום התשלום תחזרו לדשבורד הלקוחות.
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-start">
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/25 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                >
                  <CreditCard className="h-4 w-4" />
                  {creating ? "יוצר ומעביר לתשלום..." : "צור לקוח ועבור לתשלום"}
                </button>
                <button
                  type="button"
                  disabled={creating}
                  onClick={() => setShowCreate(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-600"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AdminCustomers;
