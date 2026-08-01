import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import AdminDialButton from "../../components/AdminDialButton";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { setAdminActiveBusinessId } from "../../utils/adminTenant";
import AdminHeader from "./AdminsHeader";

const ROLE_LABELS = {
  all: "הכל",
  admin: "מנהל מערכת",
  manager: "מנהל",
  business: "עסק",
  affiliate: "שותף",
  marketer: "משווק קמפיינים",
  customer: "לקוח",
  worker: "עובד",
};

const STATUS_LABELS = {
  active: "פעיל",
  blocked: "חסום",
};

const ROLE_FILTERS = [
  ["all", "הכל"],
  ["customer", "לקוחות"],
  ["business", "עסקים"],
  ["affiliate", "שותפים"],
  ["marketer", "משווקים"],
  ["worker", "עובדים"],
  ["manager", "מנהלים"],
  ["admin", "מנהלי מערכת"],
];

function roleLabel(role) {
  return ROLE_LABELS[role] || role || "—";
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status || "פעיל";
}

function actionButtonClass(extra = "") {
  return [
    "inline-flex min-h-11 items-center justify-center",
    "rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100",
    "border border-violet-200/80 px-3.5 py-2.5 text-xs font-black text-black",
    "shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5",
    "disabled:cursor-wait disabled:opacity-60",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

function AdminUsers() {
  const { user, loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/admin/users");
        if (cancelled) return;
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading users:", err);
        if (!cancelled) {
          setError("לא ניתן לטעון את רשימת המשתמשים");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((u) => {
      const matchSearch =
        !term ||
        u.phone?.includes(search.trim()) ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.name?.toLowerCase().includes(term);

      const matchRole = filter === "all" || u.role === filter;
      return matchSearch && matchRole;
    });
  }, [users, search, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("פעולה בלתי הפיכה\nלמחוק את המשתמש?")) return;

    setBusyId(id);
    setError("");

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "שגיאה במחיקת המשתמש");
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setBusyId(id);
    setError("");

    try {
      await API.put(`/admin/users/${id}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      setError(err.response?.data?.error || "שגיאה בעדכון סטטוס המשתמש");
    } finally {
      setBusyId(null);
    }
  };

  const handleEnterAsAdmin = (targetUser) => {
    const businessId = targetUser.businessId?._id || targetUser.businessId;
    if (!businessId) {
      setError("למשתמש זה אין עסק משויך");
      return;
    }

    setAdminActiveBusinessId(businessId);
    navigate(`/business/${businessId}/dashboard`);
  };

  const handleImpersonate = async (targetUser) => {
    if (!window.confirm(`להיכנס כ־${targetUser.name || "המשתמש"}?`)) return;

    setBusyId(targetUser._id);
    setError("");

    try {
      const res = await API.post("/admin/impersonate", {
        userId: targetUser._id,
      });

      loginWithToken(res.data.user, res.data.token, {
        skipRedirect: true,
      });

      if (res.data.user.role === "business" && res.data.user.businessId) {
        navigate(`/business/${res.data.user.businessId}/dashboard`, {
          replace: true,
        });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Impersonation error:", err);
      setError("לא ניתן להיכנס כמשתמש");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f2fb] px-3 py-5 text-right text-slate-800 sm:px-4 sm:py-7 md:px-8"
      >
        <section className="mx-auto max-w-[1480px]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-purple-950 sm:text-3xl md:text-4xl">
                משתמשים במערכת
              </h1>
              <p className="mt-2 text-sm font-bold text-purple-950/55">
                חיפוש, סינון, חסימה וכניסה למשתמשים במערכת.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/admin/create-user")}
                className="rounded-2xl bg-[#7C4DFF] px-4 py-3 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0]"
              >
                יצירת משתמש
              </button>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש לפי שם, אימייל, טלפון..."
                className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none ring-purple-300 placeholder:text-slate-400 focus:ring-2 sm:w-80"
              />
              <span className="rounded-2xl bg-purple-100 px-4 py-3 text-center text-sm font-black text-purple-900">
                {filtered.length} משתמשים
              </span>
            </div>
          </div>

          <div className="mb-5 rounded-[28px] border border-purple-200 bg-white p-4 shadow-xl shadow-purple-950/8">
            <p className="mb-2 text-xs font-black text-purple-900/60">
              סינון לפי סוג משתמש
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLE_FILTERS.map(([value, label]) => {
                const active = filter === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-2xl px-3.5 py-2 text-xs font-black transition ${
                      active
                        ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-black shadow-lg shadow-purple-700/20"
                        : "border border-purple-100 bg-purple-50/60 text-purple-900/70 hover:bg-purple-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

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
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm font-bold text-slate-500">
                לא נמצאו משתמשים
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="space-y-3 p-3 md:hidden">
                  {filtered.map((rowUser) => {
                    const status = rowUser.status || "active";
                    const isBusy = busyId === rowUser._id;
                    const initials = String(rowUser.name || "מ")
                      .trim()
                      .charAt(0)
                      .toUpperCase();

                    return (
                      <article
                        key={`m-${rowUser._id}`}
                        className="rounded-[24px] border border-purple-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-100 text-sm font-black text-purple-900">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-black text-purple-950">
                              {rowUser.name || "ללא שם"}
                            </h3>
                            <p
                              className="truncate text-xs font-bold text-slate-400"
                              dir="ltr"
                            >
                              {rowUser.email || "—"}
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-slate-500">
                              {rowUser.username || "—"}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-black text-purple-900">
                                {roleLabel(rowUser.role)}
                              </span>
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${
                                  status === "blocked"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {statusLabel(status)}
                              </span>
                            </div>
                          </div>
                          {rowUser.phone ? (
                            <AdminDialButton
                              phone={rowUser.phone}
                              name={rowUser.name || rowUser.username}
                              source="user"
                              refId={rowUser._id}
                            />
                          ) : null}
                        </div>

                        {rowUser.phone ? (
                          <p
                            className="mt-3 text-sm font-bold text-slate-600"
                            dir="ltr"
                          >
                            {rowUser.phone}
                          </p>
                        ) : null}

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              handleStatusToggle(rowUser._id, status)
                            }
                            className={actionButtonClass()}
                          >
                            {status === "active" ? "חסימה" : "הפעלה"}
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(rowUser._id)}
                            className={actionButtonClass(
                              "border-rose-200 from-rose-50 via-rose-50 to-orange-50"
                            )}
                          >
                            מחיקה
                          </button>

                          {rowUser.role !== "admin" ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleImpersonate(rowUser)}
                              className={actionButtonClass("col-span-2")}
                            >
                              כניסה כמשתמש
                            </button>
                          ) : null}

                          {rowUser.role === "business" &&
                          rowUser.businessId ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleEnterAsAdmin(rowUser)}
                              className={actionButtonClass("col-span-2")}
                            >
                              כניסה לעסק
                            </button>
                          ) : null}
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
                        <th className="px-4 py-4">משתמש</th>
                        <th className="px-4 py-4">שם משתמש</th>
                        <th className="px-4 py-4">טלפון</th>
                        <th className="px-4 py-4">תפקיד</th>
                        <th className="px-4 py-4">סטטוס</th>
                        <th className="px-4 py-4">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((rowUser) => {
                        const status = rowUser.status || "active";
                        const isBusy = busyId === rowUser._id;
                        const initials = String(rowUser.name || "מ")
                          .trim()
                          .charAt(0)
                          .toUpperCase();

                        return (
                          <tr
                            key={rowUser._id}
                            className="border-t border-purple-100 text-sm font-bold text-slate-800"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-start gap-3">
                                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-purple-100 text-sm font-black text-purple-900">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-black text-purple-950">
                                    {rowUser.name || "ללא שם"}
                                  </div>
                                  <div
                                    className="text-xs text-slate-400"
                                    dir="ltr"
                                  >
                                    {rowUser.email || "—"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {rowUser.username || "—"}
                            </td>
                            <td className="px-4 py-4">
                              {rowUser.phone ? (
                                <div className="flex items-center justify-start gap-2">
                                  <span
                                    dir="ltr"
                                    className="text-sm font-bold text-slate-700"
                                  >
                                    {rowUser.phone}
                                  </span>
                                  <AdminDialButton
                                    phone={rowUser.phone}
                                    name={rowUser.name || rowUser.username}
                                    source="user"
                                    refId={rowUser._id}
                                  />
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-900">
                                {roleLabel(rowUser.role)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                                  status === "blocked"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {statusLabel(status)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap items-center justify-start gap-2">
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() =>
                                    handleStatusToggle(rowUser._id, status)
                                  }
                                  className={actionButtonClass()}
                                >
                                  {status === "active" ? "חסימה" : "הפעלה"}
                                </button>

                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleDelete(rowUser._id)}
                                  className={actionButtonClass(
                                    "border-rose-200 from-rose-50 via-rose-50 to-orange-50"
                                  )}
                                >
                                  מחיקה
                                </button>

                                {rowUser.role !== "admin" ? (
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => handleImpersonate(rowUser)}
                                    className={actionButtonClass()}
                                  >
                                    כניסה כמשתמש
                                  </button>
                                ) : null}

                                {rowUser.role === "business" &&
                                rowUser.businessId ? (
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => handleEnterAsAdmin(rowUser)}
                                    className={actionButtonClass()}
                                  >
                                    כניסה לעסק
                                  </button>
                                ) : null}
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
    </>
  );
}

export default AdminUsers;
