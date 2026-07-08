import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import {
  deleteEarlyAccessRegistration,
  EarlyAccessRegistration,
  EarlyAccessStatus,
  getEarlyAccessRegistrations,
  saveEarlyAccessRegistration,
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
      ? "bg-yellow-100 text-yellow-800 ring-yellow-200"
      : status === "contacted"
        ? "bg-green-100 text-green-800 ring-green-200"
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
  const [showAddForm, setShowAddForm] = useState(false);

  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    message: "",
  });

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

    function handleStorageUpdate() {
      loadRegistrations();
    }

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("bizuply:early-access-updated", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("bizuply:early-access-updated", handleStorageUpdate);
    };
  }, []);

  const filteredRegistrations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const matchesSearch = !term
        ? true
        : [
            item.name,
            item.phone,
            item.email,
            item.businessName,
            item.message,
            item.source,
            statusLabels[item.status],
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term));

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

  function handleAddRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.name.trim() && !draft.phone.trim()) {
      alert("צריך למלא לפחות שם או טלפון");
      return;
    }

    saveEarlyAccessRegistration({
      ...draft,
      source: "הוספה ידנית מהאדמין",
      status: "new",
    });

    setDraft({
      name: "",
      phone: "",
      email: "",
      businessName: "",
      message: "",
    });

    setShowAddForm(false);
    loadRegistrations();
  }

  function handleStatusChange(id: string, status: EarlyAccessStatus) {
    updateEarlyAccessRegistration(id, { status });
    loadRegistrations();
  }

  function handleDelete(id: string) {
    const approved = window.confirm("למחוק את הנרשם מהרשימה?");

    if (!approved) return;

    deleteEarlyAccessRegistration(id);
    loadRegistrations();
  }

  function exportCsv() {
    const headers = ["שם", "טלפון", "אימייל", "שם עסק", "סטטוס", "מקור", "הודעה", "תאריך"];

    const rows = filteredRegistrations.map((item) => [
      item.name,
      item.phone,
      item.email,
      item.businessName,
      statusLabels[item.status],
      item.source,
      item.message,
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
        className="min-h-screen bg-[#f8f3ff] bg-[radial-gradient(circle_at_top_right,rgba(216,154,34,0.14),transparent_32%),radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_36%)] px-4 py-6 text-purple-950 md:px-8 md:py-8"
      >
        <section className="mx-auto max-w-[1440px]">
          <div className="rounded-[34px] border border-purple-200/70 bg-white/85 p-6 shadow-2xl shadow-purple-950/10 backdrop-blur md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="mb-4 rounded-full bg-purple-50 px-4 py-2 text-sm font-black text-purple-800 ring-1 ring-purple-200 transition hover:bg-purple-100"
                >
                  ← חזרה לדשבורד
                </button>

                <h1 className="text-4xl font-black tracking-tight text-purple-950 md:text-6xl">
                  הרשמה מוקדמת
                </h1>

                <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-purple-950/60 md:text-lg">
                  כאן תראי את כל מי שנרשם דרך הטופס. כרגע זה עובד בלי שרת:
                  הנתונים נשמרים ב־localStorage של הדפדפן.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                <button
                  type="button"
                  onClick={() => setShowAddForm((prev) => !prev)}
                  className="rounded-2xl bg-gradient-to-l from-purple-700 to-purple-950 px-5 py-4 text-sm font-black text-white shadow-xl shadow-purple-800/25 transition hover:-translate-y-0.5"
                >
                  הוספת נרשם
                </button>

                <button
                  type="button"
                  onClick={loadRegistrations}
                  className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-purple-900 ring-1 ring-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-50"
                >
                  רענון
                </button>

                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={!filteredRegistrations.length}
                  className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-purple-900 ring-1 ring-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ייצוא CSV
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-[26px] border border-purple-200/70 bg-white/85 p-5 shadow-xl shadow-purple-950/5">
              <span className="text-sm font-black text-purple-950/55">סה״כ נרשמים</span>
              <strong className="mt-2 block text-4xl font-black text-purple-950">
                {summary.total}
              </strong>
            </div>

            <div className="rounded-[26px] border border-purple-200/70 bg-white/85 p-5 shadow-xl shadow-purple-950/5">
              <span className="text-sm font-black text-purple-950/55">נרשמו היום</span>
              <strong className="mt-2 block text-4xl font-black text-purple-950">
                {summary.today}
              </strong>
            </div>

            <div className="rounded-[26px] border border-yellow-200 bg-white/85 p-5 shadow-xl shadow-purple-950/5">
              <span className="text-sm font-black text-purple-950/55">חדשים לטיפול</span>
              <strong className="mt-2 block text-4xl font-black text-yellow-700">
                {summary.newCount}
              </strong>
            </div>

            <div className="rounded-[26px] border border-green-200 bg-white/85 p-5 shadow-xl shadow-purple-950/5">
              <span className="text-sm font-black text-purple-950/55">כבר טופלו</span>
              <strong className="mt-2 block text-4xl font-black text-green-700">
                {summary.contacted}
              </strong>
            </div>
          </div>

          {showAddForm ? (
            <form
              onSubmit={handleAddRegistration}
              className="mt-5 rounded-[30px] border border-purple-200/70 bg-white/90 p-5 shadow-2xl shadow-purple-950/10"
            >
              <h2 className="text-xl font-black text-purple-950">הוספת נרשם ידנית</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="שם מלא"
                  className="rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold outline-none transition placeholder:text-purple-950/35 focus:border-purple-500 focus:bg-white"
                />

                <input
                  value={draft.phone}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="טלפון"
                  className="rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold outline-none transition placeholder:text-purple-950/35 focus:border-purple-500 focus:bg-white"
                />

                <input
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="אימייל"
                  className="rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold outline-none transition placeholder:text-purple-950/35 focus:border-purple-500 focus:bg-white"
                />

                <input
                  value={draft.businessName}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      businessName: event.target.value,
                    }))
                  }
                  placeholder="שם עסק"
                  className="rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold outline-none transition placeholder:text-purple-950/35 focus:border-purple-500 focus:bg-white"
                />

                <input
                  value={draft.message}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, message: event.target.value }))
                  }
                  placeholder="הערה"
                  className="rounded-2xl border border-purple-200 bg-purple-50/50 px-4 py-3 text-sm font-bold outline-none transition placeholder:text-purple-950/35 focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-2xl bg-purple-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-purple-700/20 transition hover:bg-purple-800"
                >
                  שמירת נרשם
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-2xl bg-purple-50 px-6 py-3 text-sm font-black text-purple-900 ring-1 ring-purple-200 transition hover:bg-purple-100"
                >
                  ביטול
                </button>
              </div>
            </form>
          ) : null}

          <div className="mt-5 rounded-[30px] border border-purple-200/70 bg-white/80 p-4 shadow-xl shadow-purple-950/5 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-purple-200 bg-white px-4">
                <span>🔎</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="חיפוש לפי שם, טלפון, אימייל, עסק או הודעה"
                  className="h-14 w-full bg-transparent text-sm font-bold text-purple-950 outline-none placeholder:text-purple-950/35"
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

          <div className="mt-5 overflow-hidden rounded-[30px] border border-purple-200/70 bg-white/90 shadow-2xl shadow-purple-950/10">
            {filteredRegistrations.length === 0 ? (
              <div className="grid min-h-[260px] place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-purple-50 text-3xl">
                    ✨
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-purple-950">
                    אין הרשמות להצגה
                  </h3>

                  <p className="mt-2 max-w-md text-sm font-bold leading-7 text-purple-950/55">
                    ברגע שהטופס ישמור הרשמות ל־localStorage, הן יופיעו כאן.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1120px] border-collapse">
                    <thead>
                      <tr className="bg-purple-50 text-right">
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
                          נרשם
                        </th>
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
                          טלפון
                        </th>
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
                          אימייל
                        </th>
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
                          עסק
                        </th>
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
                          סטטוס
                        </th>
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
                          תאריך
                        </th>
                        <th className="px-5 py-4 text-sm font-black text-purple-900">
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
                            className="border-t border-purple-100 transition hover:bg-purple-50/60"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-700 to-purple-950 text-base font-black text-white">
                                  {item.name.charAt(0)}
                                </span>

                                <div>
                                  <strong className="block text-sm font-black text-purple-950">
                                    {item.name}
                                  </strong>

                                  <small className="mt-1 line-clamp-1 block max-w-[280px] text-xs font-bold text-purple-950/50">
                                    {item.message || item.source}
                                  </small>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-purple-950/70">
                              {item.phone || "לא צוין"}
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-purple-950/70">
                              {item.email || "לא צוין"}
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-purple-950/70">
                              {item.businessName || "לא צוין"}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={item.status} />
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-purple-950/60">
                              {formatDate(item.createdAt)}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-2">
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
                                    className="rounded-full bg-green-50 px-3 py-2 text-xs font-black text-green-700 ring-1 ring-green-200"
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
                                  className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700 ring-1 ring-red-200"
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

                <div className="grid gap-3 p-4 lg:hidden">
                  {filteredRegistrations.map((item) => {
                    const whatsappPhone = normalizeWhatsappPhone(item.phone);

                    return (
                      <article
                        key={item.id}
                        className="rounded-[26px] border border-purple-200 bg-white p-4 shadow-lg shadow-purple-950/5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-700 to-purple-950 text-base font-black text-white">
                              {item.name.charAt(0)}
                            </span>

                            <div>
                              <strong className="block text-base font-black text-purple-950">
                                {item.name}
                              </strong>
                              <small className="text-xs font-bold text-purple-950/50">
                                {formatDate(item.createdAt)}
                              </small>
                            </div>
                          </div>

                          <StatusBadge status={item.status} />
                        </div>

                        <div className="mt-4 grid gap-2 text-sm font-bold text-purple-950/70">
                          <p>טלפון: {item.phone || "לא צוין"}</p>
                          <p>אימייל: {item.email || "לא צוין"}</p>
                          <p>עסק: {item.businessName || "לא צוין"}</p>
                          {item.message ? <p>הערה: {item.message}</p> : null}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
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
                              className="rounded-full bg-green-50 px-3 py-2 text-xs font-black text-green-700 ring-1 ring-green-200"
                            >
                              וואטסאפ
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "contacted")}
                            className="rounded-full bg-purple-50 px-3 py-2 text-xs font-black text-purple-700 ring-1 ring-purple-200"
                          >
                            טופל
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
                            className="rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700 ring-1 ring-red-200"
                          >
                            מחיקה
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminEarlyAccess;