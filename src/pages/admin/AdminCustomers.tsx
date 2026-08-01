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
import AdminDialButton from "../../components/AdminDialButton";
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
  startCheckout: boolean;
  includeWebsiteAddon: boolean;
};

type PurchaseLine = {
  sku: string;
  name: string;
  kind: string;
  billing: string;
  amountIls: number;
  quantity: number;
};

type BusinessPurchase = {
  _id: string;
  status: string;
  source: string;
  packageSku: string;
  lineItems?: PurchaseLine[];
  totals?: { packageIls?: number; upsellsIls?: number; totalIls?: number };
  paidAt?: string | null;
  notes?: string;
  markedPaidBy?: { name?: string; email?: string } | null;
};

const EMPTY_FORM: CreateForm = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  category: "general",
  password: "",
  plan: "monthly",
  startCheckout: true,
  includeWebsiteAddon: false,
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
  const [markingUserId, setMarkingUserId] = useState<string | null>(null);
  const [payPlanByUser, setPayPlanByUser] = useState<
    Record<string, "monthly" | "yearly">
  >({});
  const [addonByUser, setAddonByUser] = useState<Record<string, boolean>>({});
  const [purchasesFor, setPurchasesFor] = useState<AdminCustomer | null>(null);
  const [purchases, setPurchases] = useState<BusinessPurchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);

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
        name: form.name,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        category: form.category,
        password: form.password,
        plan: form.plan,
        startCheckout: form.startCheckout,
        includeWebsiteAddon: form.includeWebsiteAddon,
      });

      const checkoutUrl = data?.checkout?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setBanner(
        data?.warning ||
          (form.startCheckout
            ? "הלקוח נוצר בהצלחה. לא התקבל קישור תשלום — אפשר לשלוח לתשלום מהרשימה."
            : "הלקוח נוצר בהצלחה. אפשר לסמן שולם ידנית או לשלוח ל־Stripe.")
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
        includeWebsiteAddon: Boolean(addonByUser[userId]),
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

  async function handleMarkPaid(customer: AdminCustomer) {
    const userId = customer.owner?._id;
    if (!userId) {
      setError("לעסק זה אין בעלים מקושר");
      return;
    }
    const plan = payPlanByUser[userId] || "monthly";
    if (
      !window.confirm(
        `לסמן את ${customer.businessName || "העסק"} כשולם עבור חבילת ${
          plan === "yearly" ? "שנתית" : "חודשית"
        }${addonByUser[userId] ? " + תוספת אתר" : ""}?`
      )
    ) {
      return;
    }

    setMarkingUserId(userId);
    setError("");
    setBanner("");
    try {
      await API.post(`/admin/customers/${userId}/mark-paid`, {
        plan,
        includeWebsiteAddon: Boolean(addonByUser[userId]),
        notes: "סומן כשולם ידנית ממסך ניהול לקוחות",
      });
      setBanner("סומן כשולם — הרכישה נשמרה במערכת עם פירוט מלא.");
      await loadCustomers();
    } catch (err: any) {
      console.error("Mark paid failed:", err);
      setError(err?.response?.data?.error || "לא ניתן לסמן שולם");
    } finally {
      setMarkingUserId(null);
    }
  }

  async function openPurchases(customer: AdminCustomer) {
    const userId = customer.owner?._id;
    if (!userId) {
      setError("לעסק זה אין בעלים מקושר");
      return;
    }
    setPurchasesFor(customer);
    setPurchasesLoading(true);
    setPurchases([]);
    try {
      const { data } = await API.get(`/admin/customers/${userId}/purchases`);
      setPurchases(Array.isArray(data?.purchases) ? data.purchases : []);
    } catch (err) {
      console.error("Load purchases failed:", err);
      setError("לא ניתן לטעון את פירוט הרכישות");
      setPurchasesFor(null);
    } finally {
      setPurchasesLoading(false);
    }
  }

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f2fb] px-3 py-5 text-right text-slate-800 sm:px-4 sm:py-7 md:px-8"
        style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
      >
        <section className="mx-auto max-w-[1480px]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-purple-950 sm:text-3xl md:text-4xl">
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
              <>
                {/* Mobile cards */}
                <div className="space-y-3 p-3 md:hidden">
                  {customers.map((customer) => {
                    const ownerId = customer.owner?._id || "";
                    const selectedPlan =
                      payPlanByUser[ownerId] ||
                      (customer.owner?.subscriptionPlan === "yearly"
                        ? "yearly"
                        : "monthly");

                    return (
                      <article
                        key={`m-${customer._id}`}
                        className="rounded-[24px] border border-purple-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple-100 text-lg">
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
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-black text-purple-950">
                              {customer.businessName || "ללא שם"}
                            </h3>
                            <p className="truncate text-xs font-bold text-slate-400">
                              {customer.owner?.name || "—"} · {customer.email || "—"}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${planTone(
                                  customer.owner?.subscriptionPlan
                                )}`}
                              >
                                {customer.owner?.planLabel ||
                                  customer.owner?.subscriptionPlan ||
                                  "—"}
                              </span>
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${statusTone(
                                  customer.owner?.subscriptionStatus,
                                  customer.owner?.hasPaid
                                )}`}
                              >
                                {customer.owner?.statusLabel ||
                                  customer.owner?.subscriptionStatus ||
                                  "—"}
                              </span>
                            </div>
                          </div>
                          {customer.phone ? (
                            <AdminDialButton
                              phone={customer.phone}
                              name={customer.businessName || customer.owner?.name}
                              source="customer"
                              refId={customer._id}
                            />
                          ) : null}
                        </div>

                        {customer.phone ? (
                          <p className="mt-3 text-sm font-bold text-slate-600" dir="ltr">
                            {customer.phone}
                          </p>
                        ) : null}

                        <div className="mt-3 grid gap-2">
                          <select
                            value={selectedPlan}
                            disabled={
                              !ownerId ||
                              checkoutUserId === ownerId ||
                              markingUserId === ownerId
                            }
                            onChange={(e) =>
                              setPayPlanByUser((prev) => ({
                                ...prev,
                                [ownerId]: e.target.value as "monthly" | "yearly",
                              }))
                            }
                            className="min-h-11 rounded-2xl border border-purple-200 bg-white px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-300"
                          >
                            <option value="monthly">חודשי</option>
                            <option value="yearly">שנתי</option>
                          </select>
                          <label className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-slate-600">
                            <input
                              type="checkbox"
                              checked={Boolean(addonByUser[ownerId])}
                              disabled={!ownerId}
                              onChange={(e) =>
                                setAddonByUser((prev) => ({
                                  ...prev,
                                  [ownerId]: e.target.checked,
                                }))
                              }
                            />
                            + תוספת אתר
                          </label>
                          <button
                            type="button"
                            disabled={!ownerId || checkoutUserId === ownerId}
                            onClick={() => handleCheckout(customer)}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-3 text-xs font-black text-black"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            {checkoutUserId === ownerId
                              ? "פותח Stripe..."
                              : customer.owner?.hasPaid
                                ? "שדרוג / חידוש"
                                : "תשלום ב־Stripe"}
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={!ownerId || markingUserId === ownerId}
                              onClick={() => handleMarkPaid(customer)}
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-800 disabled:opacity-60"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {markingUserId === ownerId ? "מסמן..." : "שולם ידני"}
                            </button>
                            <button
                              type="button"
                              disabled={!ownerId}
                              onClick={() => openPurchases(customer)}
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
                            >
                              רכישות
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
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
                            <td className="px-4 py-4">
                              {customer.phone ? (
                                <div className="flex items-center justify-start gap-2">
                                  <span
                                    dir="ltr"
                                    className="text-sm font-bold text-slate-700"
                                  >
                                    {customer.phone}
                                  </span>
                                  <AdminDialButton
                                    phone={customer.phone}
                                    name={
                                      customer.businessName ||
                                      customer.owner?.name
                                    }
                                    source="customer"
                                    refId={customer._id}
                                  />
                                </div>
                              ) : (
                                "—"
                              )}
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
                              <div className="flex min-w-[240px] flex-col gap-2">
                                <select
                                  value={selectedPlan}
                                  disabled={
                                    !ownerId ||
                                    checkoutUserId === ownerId ||
                                    markingUserId === ownerId
                                  }
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
                                  <option value="monthly">חודשי</option>
                                  <option value="yearly">שנתי</option>
                                </select>
                                <label className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(addonByUser[ownerId])}
                                    disabled={!ownerId}
                                    onChange={(e) =>
                                      setAddonByUser((prev) => ({
                                        ...prev,
                                        [ownerId]: e.target.checked,
                                      }))
                                    }
                                  />
                                  + תוספת אתר
                                </label>
                                <button
                                  type="button"
                                  disabled={
                                    !ownerId || checkoutUserId === ownerId
                                  }
                                  onClick={() => handleCheckout(customer)}
                                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-3 py-2.5 text-xs font-black text-black shadow-lg shadow-purple-700/15 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                                >
                                  <CreditCard className="h-3.5 w-3.5" />
                                  {checkoutUserId === ownerId
                                    ? "פותח Stripe..."
                                    : customer.owner?.hasPaid
                                      ? "שדרוג / חידוש"
                                      : "תשלום ב־Stripe"}
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    !ownerId || markingUserId === ownerId
                                  }
                                  onClick={() => handleMarkPaid(customer)}
                                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-black text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {markingUserId === ownerId
                                    ? "מסמן..."
                                    : "סמן שולם ידני"}
                                </button>
                                <button
                                  type="button"
                                  disabled={!ownerId}
                                  onClick={() => openPurchases(customer)}
                                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                                >
                                  פירוט רכישות
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
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

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.includeWebsiteAddon}
                  onChange={(e) =>
                    updateForm("includeWebsiteAddon", e.target.checked)
                  }
                />
                <span>
                  + תוספת אתר (אפסייל)
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    יתווסף לפירוט הרכישה ול־Stripe כשפותחים תשלום.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.startCheckout}
                  onChange={(e) => updateForm("startCheckout", e.target.checked)}
                />
                <span>
                  עבור מיד ל־Stripe אחרי יצירה
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    אם כבוי — הלקוח נוצר בלי תשלום, ואפשר לסמן שולם ידנית מהרשימה.
                  </span>
                </span>
              </label>

              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-6 text-sky-800">
                יצירת משתמש עסקי נשמרת במערכת. תשלום Stripe או סימון ידני ישמרו
                רכישה מלאה (חבילה + אפסיילים) במונגו.
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-start">
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/25 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                >
                  {form.startCheckout ? (
                    <CreditCard className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {creating
                    ? "יוצר..."
                    : form.startCheckout
                      ? "צור לקוח ועבור לתשלום"
                      : "צור לקוח בלי תשלום"}
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

      {purchasesFor ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
          <div
            dir="rtl"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-purple-100 bg-white p-5 shadow-2xl md:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-purple-950">
                  פירוט רכישות
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {purchasesFor.businessName || "עסק"} · כל חבילה ואפסייל שנשמרו
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPurchasesFor(null)}
                className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {purchasesLoading ? (
              <BizuplyLoader label="טוען רכישות..." />
            ) : purchases.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm font-bold text-slate-500">
                אין רכישות שמורות לעסק הזה עדיין.
              </p>
            ) : (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <article
                    key={purchase._id}
                    className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm font-black text-purple-950">
                        {purchase.packageSku} · {purchase.status}
                      </strong>
                      <span className="text-xs font-bold text-slate-500">
                        {formatDate(purchase.paidAt)} · {purchase.source}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {(purchase.lineItems || []).map((line) => (
                        <li
                          key={`${purchase._id}-${line.sku}`}
                          className="flex items-center justify-between text-sm font-bold text-slate-700"
                        >
                          <span>
                            {line.name}
                            <span className="ms-2 text-[11px] text-slate-400">
                              {line.billing === "one_time"
                                ? "חד־פעמי"
                                : line.billing === "recurring_year"
                                  ? "שנתי מתחדש"
                                  : "חודשי מתחדש"}
                            </span>
                          </span>
                          <span>₪{Number(line.amountIls || 0).toLocaleString("he-IL")}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-purple-100 pt-2 text-sm font-black text-slate-900">
                      סה״כ: ₪
                      {Number(purchase.totals?.totalIls || 0).toLocaleString(
                        "he-IL"
                      )}
                    </div>
                    {purchase.notes ? (
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        {purchase.notes}
                        {purchase.markedPaidBy?.name
                          ? ` · ע״י ${purchase.markedPaidBy.name}`
                          : ""}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AdminCustomers;
