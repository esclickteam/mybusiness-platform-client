import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ban,
  Check,
  Search,
  Store,
  Trash2,
  UserRoundSearch,
  Users,
} from "lucide-react";

import API from "../../api";
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
  customer: "לקוח",
  worker: "עובד",
};

const STATUS_LABELS = {
  active: "פעיל",
  blocked: "חסום",
};

function roleLabel(role) {
  return ROLE_LABELS[role] || role || "—";
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status || "פעיל";
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
    <div
      className="min-h-screen bg-[#F8F9FA]"
      style={{ fontFamily: '"Heebo", "Assistant", "Rubik", sans-serif' }}
    >
      <AdminHeader />

      <main dir="rtl" className="px-4 py-7 text-right text-slate-800 md:px-8">
        <section className="mx-auto max-w-[1480px]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-[#7C4DFF]/10 px-4 py-2.5 text-sm font-black text-[#7C4DFF] transition hover:bg-[#7C4DFF]/15"
              >
                חזרה לדשבורד
              </button>

              <h1 className="flex items-center justify-start gap-3 text-3xl font-black text-slate-900 md:text-4xl">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/25">
                  <Users className="h-5 w-5" />
                </span>
                ניהול משתמשים
              </h1>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                חיפוש, סינון, חסימה וכניסה למשתמשים במערכת.
              </p>
            </div>

            <span className="rounded-2xl bg-violet-100 px-4 py-3 text-center text-sm font-black text-[#7C4DFF]">
              {filtered.length} משתמשים
            </span>
          </div>

          <div className="mb-5 space-y-3 rounded-[24px] border border-slate-100 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש לפי טלפון / שם / שם משתמש / אימייל"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm font-bold text-slate-900 outline-none ring-[#7C4DFF]/30 placeholder:text-slate-400 focus:bg-white focus:ring-2"
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-black text-slate-500">
                סינון לפי סוג משתמש (role)
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "הכל"],
                  ["customer", "לקוחות"],
                  ["business", "עסקים"],
                  ["affiliate", "שותפים"],
                  ["worker", "עובדים"],
                  ["manager", "מנהלים"],
                  ["admin", "מנהלי מערכת"],
                ].map(([value, label]) => {
                  const active = filter === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={`rounded-full px-3.5 py-2 text-xs font-black transition ${
                        active
                          ? "bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/25"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-[#7C4DFF]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <BizuplyLoader size="xl" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm font-bold text-slate-500">
                לא נמצאו משתמשים
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-right">
                  <thead className="bg-violet-50 text-xs font-black text-[#5B21B6]">
                    <tr>
                      <th className="px-4 py-4">שם</th>
                      <th className="px-4 py-4">שם משתמש</th>
                      <th className="px-4 py-4">אימייל</th>
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

                      return (
                        <tr
                          key={rowUser._id}
                          className="border-t border-slate-100 text-sm font-bold text-slate-800"
                        >
                          <td className="px-4 py-4 font-black text-slate-900">
                            {rowUser.name || "—"}
                          </td>
                          <td className="px-4 py-4">{rowUser.username || "—"}</td>
                          <td className="px-4 py-4" dir="ltr">
                            {rowUser.email || "—"}
                          </td>
                          <td className="px-4 py-4" dir="ltr">
                            {rowUser.phone || "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-[#7C4DFF]">
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
                            <div className="flex flex-row items-center justify-start gap-2">
                              <button
                                type="button"
                                disabled={isBusy}
                                title={
                                  status === "active"
                                    ? "חסימת משתמש"
                                    : "הפעלת משתמש"
                                }
                                onClick={() =>
                                  handleStatusToggle(rowUser._id, status)
                                }
                                className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200 bg-violet-50 text-[#7C4DFF] transition hover:bg-violet-100 disabled:opacity-50"
                              >
                                {status === "active" ? (
                                  <Ban className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>

                              <button
                                type="button"
                                disabled={isBusy}
                                title="מחיקת משתמש"
                                onClick={() => handleDelete(rowUser._id)}
                                className="grid h-10 w-10 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              {rowUser.role !== "admin" ? (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  title="כניסה כמשתמש"
                                  onClick={() => handleImpersonate(rowUser)}
                                  className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200 bg-violet-100 text-[#5B21B6] transition hover:bg-violet-200 disabled:opacity-50"
                                >
                                  <UserRoundSearch className="h-4 w-4" />
                                </button>
                              ) : null}

                              {rowUser.role === "business" &&
                              rowUser.businessId ? (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  title="כניסה לעסק כאדמין"
                                  onClick={() => handleEnterAsAdmin(rowUser)}
                                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                  <Store className="h-4 w-4" />
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
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminUsers;
