"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* =====================================================
   TYPES
===================================================== */

type SubscriptionPlan = "monthly" | "yearly" | "trial" | string;

type UserLike = {
  _id?: string;
  userId?: string;
  id?: string;
  subscriptionCancelled?: boolean;
  isSubscriptionValid?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionEnd?: string | Date;
  [key: string]: unknown;
};

type Payment = {
  _id?: string;
  id?: string;
  createdAt?: string | Date;
  plan?: string;
  amount?: number;
  status?: string;
  [key: string]: unknown;
};

type MessageType = "success" | "error" | null;

type MessageState = {
  type: MessageType;
  text: string;
};

/* =====================================================
   HELPERS
===================================================== */

function formatDate(value?: string | Date) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatMoney(amount?: number) {
  const safeAmount = typeof amount === "number" ? amount : 0;

  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "USD",
  }).format(safeAmount);
}

function getPaymentStatusClass(status?: string) {
  const normalized = status?.toLowerCase() || "";

  if (normalized === "paid" || normalized === "active") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (normalized.includes("cancelled") || normalized.includes("canceled")) {
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  }

  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

function getPlanLabel(plan?: string) {
  if (plan === "trial") return "ניסיון";
  if (plan === "monthly") return "חודשי";
  if (plan === "yearly") return "שנתי";
  return plan || "—";
}

function getPaymentStatusLabel(status?: string) {
  const normalized = status?.toLowerCase() || "";

  if (normalized === "paid") return "שולם";
  if (normalized === "active") return "פעיל";
  if (normalized === "pending") return "ממתין";
  if (normalized.includes("cancelled") || normalized.includes("canceled")) {
    return "בוטל";
  }

  return status || "ממתין";
}

/* =====================================================
   COMPONENT
===================================================== */

export default function SubscriptionPlanCard() {
  const { user, refreshUser, setUser } = useAuth() as {
    user: UserLike | null;
    refreshUser: (force?: boolean) => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<UserLike | null>>;
  };

  const navigate = useNavigate();

  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [message, setMessage] = useState<MessageState>({
    type: null,
    text: "",
  });

  const rawBase = import.meta.env.VITE_API_URL || "";
  const API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

  const userId = user?._id || user?.userId || user?.id;

  const isCancelled = Boolean(user?.subscriptionCancelled);
  const isActive = Boolean(user?.isSubscriptionValid);
  const plan = user?.subscriptionPlan || "trial";

  const endDate = formatDate(user?.subscriptionEnd);

  const statusText = isActive
    ? isCancelled
      ? "פעיל · חידוש אוטומטי כבוי"
      : "פעיל"
    : "פג תוקף";

  const planName =
    plan === "yearly"
      ? "מסלול שנתי BizUply"
      : plan === "monthly"
        ? "מסלול חודשי BizUply"
        : "מסלול ניסיון";

  const billingType =
    plan === "monthly"
      ? isCancelled
        ? "חיוב חודשי · חידוש אוטומטי כבוי"
        : "חיוב חודשי · חידוש אוטומטי פעיל"
      : plan === "yearly"
        ? "תשלום שנתי חד־פעמי"
        : "גישה לתקופת ניסיון";

  const statusBadgeClass = isActive
    ? isCancelled
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";

  const totalPaid = useMemo(() => {
    return payments.reduce((sum, payment) => {
      const paid =
        payment.status === "paid" || payment.status === "active"
          ? Number(payment.amount || 0)
          : 0;

      return sum + paid;
    }, 0);
  }, [payments]);

  /* =====================================================
     CANCEL AUTO RENEW
  ====================================================== */

  const handleCancel = async () => {
    if (!userId || loadingCancel) return;

    setMessage({ type: null, text: "" });
    setLoadingCancel(true);

    try {
      const res = await fetch(`${API_BASE}/stripe/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Failed to cancel subscription");
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              subscriptionCancelled: true,
            }
          : prev
      );

      await refreshUser(true);

      setMessage({
        type: "success",
        text: "החידוש האוטומטי בוטל. הגישה שלך תישאר פעילה עד סוף תקופת החיוב.",
      });
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "לא הצלחנו לבטל את החידוש. יש לפנות לתמיכה.",
      });
    } finally {
      setLoadingCancel(false);
    }
  };

  /* =====================================================
     RESUME AUTO RENEW
  ====================================================== */

  const handleResume = async () => {
    if (!userId || loadingResume) return;

    setMessage({ type: null, text: "" });
    setLoadingResume(true);

    try {
      const res = await fetch(`${API_BASE}/stripe/resume-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Resume failed");
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              subscriptionCancelled: false,
            }
          : prev
      );

      await refreshUser(true);

      setMessage({
        type: "success",
        text: "החידוש האוטומטי הופעל מחדש בהצלחה.",
      });
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "לא הצלחנו להפעיל מחדש את המנוי. יש לפנות לתמיכה.",
      });
    } finally {
      setLoadingResume(false);
    }
  };

  /* =====================================================
     PAYMENT HISTORY
  ====================================================== */

  useEffect(() => {
    if (!userId) {
      setLoadingPayments(false);
      return;
    }

    let isMounted = true;

    async function fetchPayments() {
      try {
        setLoadingPayments(true);

        const res = await fetch(`${API_BASE}/stripe/payments/user/${userId}`);

        if (!res.ok) {
          throw new Error("Failed loading payments");
        }

        const data = await res.json();

        if (!isMounted) return;

        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setPayments([]);
        }
      } finally {
        if (isMounted) {
          setLoadingPayments(false);
        }
      }
    }

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, [userId, API_BASE]);

  /* =====================================================
     RENDER
  ====================================================== */

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black text-white/80 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  מרכז חיובים
                </div>

                <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                  חיובים ומנוי
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                  נהל את המסלול שלך, סטטוס החיוב, הגדרות החידוש והיסטוריית
                  התשלומים במקום אחד ברור ונוח.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    מסלול נוכחי
                  </p>
                  <p className="mt-1 truncate text-lg font-black">
                    {getPlanLabel(plan)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    סה״כ שולם
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {formatMoney(totalPaid)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* SUBSCRIPTION CARD */}
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50 px-6 py-7 sm:px-8">
              <div className="inline-flex rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
                מנוי
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                המסלול שלך
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                בדוק את המסלול הנוכחי שלך ונהל את העדפות החידוש.
              </p>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  מסלול
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {planName}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    סטטוס
                  </p>

                  <span
                    className={[
                      "mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-black",
                      statusBadgeClass,
                    ].join(" ")}
                  >
                    {statusText}
                  </span>
                </div>

                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {plan === "monthly" ? "החיוב הבא" : "בתוקף עד"}
                  </p>

                  <p className="mt-3 text-lg font-black text-slate-950">
                    {endDate}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  סוג חיוב
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                  {billingType}
                </p>
              </div>

              {message.text && (
                <div
                  className={[
                    "rounded-2xl px-4 py-3 text-sm font-bold leading-6",
                    message.type === "success"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-rose-100 bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  {message.text}
                </div>
              )}

              <div className="pt-2">
                {isActive && plan === "monthly" && !isCancelled && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loadingCancel || !userId}
                    className="flex h-13 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-6 text-sm font-black text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loadingCancel ? "מבטל..." : "כיבוי חידוש אוטומטי"}
                  </button>
                )}

                {isActive && isCancelled && (
                  <button
                    type="button"
                    onClick={handleResume}
                    disabled={loadingResume || !userId}
                    className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loadingResume ? "מפעיל מחדש..." : "הפעלת המנוי מחדש"}
                  </button>
                )}

                {!isActive && (
                  <button
                    type="button"
                    onClick={() => navigate("/pricing")}
                    className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
                  >
                    חידוש / שדרוג מסלול
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* PAYMENT HISTORY */}
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-100 px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black text-slate-600">
                    תשלומים
                  </div>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                    היסטוריית תשלומים
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    צפייה בחיובים האחרונים ובתשלומי המנוי שלך.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    רשומות
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {payments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {loadingPayments ? (
                <div className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    טוען תשלומים...
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    שולף את רשומות החיוב שלך.
                  </p>
                </div>
              ) : payments.length === 0 ? (
                <div className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    💳
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-950">
                    לא נמצאו תשלומים
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    היסטוריית התשלומים שלך תופיע כאן לאחר יצירת תשלום.
                  </p>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}
                  <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-100 md:block">
                    <table className="w-full border-collapse text-right text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-400">
                            תאריך
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-400">
                            מסלול
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-400">
                            סכום
                          </th>
                          <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-400">
                            סטטוס
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white">
                        {payments.map((payment, index) => {
                          const key = payment._id || payment.id || String(index);

                          return (
                            <tr key={key} className="hover:bg-slate-50/70">
                              <td className="px-5 py-4 font-bold text-slate-700">
                                {formatDate(payment.createdAt)}
                              </td>

                              <td className="px-5 py-4 font-black text-slate-950">
                                {getPlanLabel(payment.plan)}
                              </td>

                              <td className="px-5 py-4 font-black text-slate-950">
                                {formatMoney(payment.amount)}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={[
                                    "inline-flex rounded-full px-3 py-1.5 text-xs font-black",
                                    getPaymentStatusClass(payment.status),
                                  ].join(" ")}
                                >
                                  {getPaymentStatusLabel(payment.status)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="space-y-3 md:hidden">
                    {payments.map((payment, index) => {
                      const key = payment._id || payment.id || String(index);

                      return (
                        <div
                          key={key}
                          className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                                מסלול
                              </p>

                              <p className="mt-1 text-base font-black text-slate-950">
                                {getPlanLabel(payment.plan)}
                              </p>
                            </div>

                            <span
                              className={[
                                "inline-flex shrink-0 rounded-full px-3 py-1.5 text-xs font-black",
                                getPaymentStatusClass(payment.status),
                              ].join(" ")}
                            >
                              {getPaymentStatusLabel(payment.status)}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                                תאריך
                              </p>
                              <p className="mt-1 text-sm font-bold text-slate-700">
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                                סכום
                              </p>
                              <p className="mt-1 text-sm font-black text-slate-950">
                                {formatMoney(payment.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* SUPPORT */}
        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-center text-sm font-bold text-slate-500 shadow-sm">
          צריך עזרה?{" "}
          <a
            href="/contact"
            className="font-black text-violet-700 underline-offset-4 hover:underline"
          >
            פנייה לתמיכה
          </a>
        </div>
      </div>
    </main>
  );
}