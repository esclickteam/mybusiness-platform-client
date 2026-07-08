import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import {
  EARLY_ACCESS_EVENT_NAME,
  EarlyAccessRegistration,
  EarlyAccessStatus,
  deleteEarlyAccessRegistration,
  getEarlyAccessRegistrations,
  updateEarlyAccessRegistration,
} from "./earlyAccessStorage";

type StatusFilter = "all" | EarlyAccessStatus;

const statusLabels: Record<EarlyAccessStatus, string> = {
  new: "חדש",
  contacted: "טופל",
  closed: "נסגר",
};

function formatDate(value: string) {
  if (!value) return "לא צוין";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "לא צוין";

  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeWhatsappPhone(phone: string) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;

  return digits;
}

function StatusBadge({ status }: { status: EarlyAccessStatus }) {
  const className =
    status === "new"
      ? "bg-amber-100 text-amber-800 ring-amber-200"
      : status === "contacted"
        ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
        : "bg-purple-100 text-purple-800 ring-purple-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function AdminEarlyAccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<EarlyAccessRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  function loadRegistrations() {
    setRegistrations(getEarlyAccessRegistrations());
  }

  useEffect(() => {
    loadRegistrations();

    window.addEventListener("storage", loadRegistrations);
    window.addEventListener(EARLY_ACCESS_EVENT_NAME, loadRegistrations);

    return () => {
      window.removeEventListener("storage", loadRegistrations);
      window.removeEventListener(EARLY_ACCESS_EVENT_NAME, loadRegistrations);
    };
  }, []);

  const filteredRegistrations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const values = [
        item.fullName,
        item.phone,
        item.businessName,
        item.interest,
        item.source,
        statusLabels[item.status],
        ...Object.values(item.fields || {}),
      ];

      const matchesSearch = !term
        ? true
        : values.some((value) =>
            String(value || "").toLowerCase().includes(term)
          );

      return matchesStatus && matchesSearch;
    });
  }, [registrations, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    const today = new Date();

    const todayCount = registrations.filter((item) => {
      const createdAt = new Date(item.createdAt);

      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      total: registrations.length,
      today: todayCount,
      newCount: registrations.filter((item) => item.status === "new").length,
      contacted: registrations.filter((item) => item.status === "contacted").length,
    };
  }, [registrations]);

  function handleStatusChange(id: string, status: EarlyAccessStatus) {
    updateEarlyAccessRegistration(id, { status });
    loadRegistrations();
  }

  function handleDelete(id: string) {
    const approved = window.confirm("למחוק את ההרשמה מהרשימה?");

    if (!approved) return;

    deleteEarlyAccessRegistration(id);
    loadRegistrations();
  }

  function exportCsv() {
    const headers = [
      "שם מלא",
      "טלפון / וואטסאפ",
      "שם העסק",
      "מה הכי מעניין אותך",
      "סטטוס",
      "מקור",
      "תאריך הרשמה",
    ];

    const rows = filteredRegistrations.map((item) => [
      item.fullName,
      item.phone,
      item.businessName,
      item.interest,
      statusLabels[item.status],
      item.source,
      formatDate(item.createdAt),
    ]);

    const safeValue = (value: string) => {
      return `"${String(value || "").replace(/"/g, '""')}"`;
    };

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) => row.map((cell) => safeValue(String(cell))).join(","))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "bizuply-early-access.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f2fb] px-4 py-7 text-right text-slate-950 md:px-8"
      >
        <section className="mx-auto max-w-[1480px]">
          <div className="rounded-[34px] border border-purple-200 bg-gradient-to-l from-purple-950 via-purple-900 to-fuchsia-800 p-6 text-white shadow-2xl shadow-purple-950/20 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="mb-4 rounded-full bg-white/12 px-4 py-2 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/18"
                >
                  ← חזרה לדשבורד
                </button>

                <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                  הרשמות מוקדמות
                </h1>

                <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-white/70 md:text-lg">
                  כאן מוצגים בדיוק הפרטים שהגולשים מילאו בטופס ההצטרפות:
                  שם מלא, טלפון, שם העסק ומה הכי מעניין אותם.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
                <button
                  type="button"
                  onClick={loadRegistrations}
                  className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-purple-950 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-purple-50"
                >
                  רענון רשימה
                </button>

                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={!filteredRegistrations.length}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ייצוא CSV
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-[26px] border border-purple-200 bg-white p-5 shadow-lg">
              <span className="text-sm font-black text-purple-950/55">
                סה״כ נרשמים
              </span>
              <strong className="mt-2 block text-4xl font-black text-purple-950">
                {summary.total}
              </strong>
            </div>

            <div className="rounded-[26px] border border-purple-200 bg-white p-5 shadow-lg">
              <span className="text-sm font-black text-purple-950/55">
                נרשמו היום
              </span>
              <strong className="mt-2 block text-4xl font-black text-purple-950">
                {summary.today}
              </strong>
            </div>

            <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5 shadow-lg">
              <span className="text-sm font-black text-amber-950/60">
                חדשים לטיפול
              </span>
              <strong className="mt-2 block text-4xl font-black text-amber-700">
                {summary.newCount}
              </strong>
            </div>

            <div className="rounded-[26px] border border-emerald-200 bg-emerald-50 p-5 shadow-lg">
              <span className="text-sm font-black text-emerald-950/60">
                כבר טופלו
              </span>
              <strong className="mt-2 block text-4xl font-black text-emerald-700">
                {summary.contacted}
              </strong>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-purple-200 bg-white p-4 shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50/40 px-4">
                <span>🔎</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="חיפוש לפי שם, טלפון, עסק או תחום עניין"
                  className="h-14 w-full bg-transparent text-right text-sm font-bold text-purple-950 outline-none placeholder:text-purple-950/35"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {[
                  { value: "all", label: "הכל" },
                  { value: "new", label: "חדשים" },
                  { value: "contacted", label: "טופלו" },
                  { value: "closed", label: "נסגרו" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value as StatusFilter)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition ${
                      statusFilter === item.value
                        ? "bg-purple-700 text-white shadow-lg shadow-purple-700/20"
                        : "bg-white text-purple-900 ring-1 ring-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[30px] border border-purple-200 bg-white shadow-2xl shadow-purple-950/10">
            {filteredRegistrations.length === 0 ? (
              <div className="grid min-h-[280px] place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-purple-50 text-3xl">
                    ✨
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-purple-950">
                    אין הרשמות להצגה
                  </h3>

                  <p className="mt-2 max-w-md text-sm font-bold leading-7 text-purple-950/55">
                    ברגע שמישהו ימלא את הטופס, הפרטים שלו יופיעו כאן בטבלה.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table dir="rtl" className="w-full min-w-[1120px] border-collapse text-right">
                  <thead>
                    <tr className="bg-purple-950 text-white">
                      <th className="px-5 py-4 text-right text-sm font-black">
                        שם מלא
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-black">
                        טלפון / וואטסאפ
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-black">
                        שם העסק
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-black">
                        מה הכי מעניין אותך
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-black">
                        תאריך הרשמה
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-black">
                        סטטוס
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-black">
                        פעולות
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRegistrations.map((item) => {
                      const whatsappPhone = normalizeWhatsappPhone(item.phone);

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-purple-100 transition hover:bg-purple-50"
                        >
                          <td className="px-5 py-4 text-right">
                            <strong className="block text-sm font-black text-purple-950">
                              {item.fullName || "לא צוין"}
                            </strong>
                          </td>

                          <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                            {item.phone || "לא צוין"}
                          </td>

                          <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                            {item.businessName || "לא צוין"}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="inline-flex rounded-full bg-purple-50 px-3 py-1.5 text-xs font-black text-purple-800 ring-1 ring-purple-200">
                              {item.interest || "לא צוין"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right text-sm font-bold text-slate-500">
                            {formatDate(item.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <StatusBadge status={item.status} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex flex-wrap justify-start gap-2">
                              {whatsappPhone ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.open(
                                      `https://wa.me/${whatsappPhone}`,
                                      "_blank",
                                      "noopener,noreferrer"
                                    )
                                  }
                                  className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200"
                                >
                                  וואטסאפ
                                </button>
                              ) : null}

                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(item.id, "contacted")
                                }
                                className="rounded-full bg-purple-50 px-3 py-2 text-xs font-black text-purple-700 ring-1 ring-purple-200"
                              >
                                סמן כטופל
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "closed")}
                                className="rounded-full bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200"
                              >
                                סגור
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="rounded-full bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 ring-1 ring-rose-200"
                              >
                                מחיקה
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
    </>
  );
}

export default AdminEarlyAccess;