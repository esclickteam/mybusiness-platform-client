import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

type BusinessOwner = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
};

type AdminBusiness = {
  _id: string;
  businessName?: string;
  category?: string;
  phone?: string;
  email?: string;
  city?: string;
  logo?: string;
  websiteUrl?: string;
  createdAt?: string;
  owner?: BusinessOwner | null;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function AdminBusinesses() {
  const navigate = useNavigate();
  const { user, loginWithToken } = useAuth() as {
    user: { role?: string } | null;
    loginWithToken: (
      userFromServer: unknown,
      accessToken: string,
      options?: { skipRedirect?: boolean }
    ) => void;
  };

  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enteringId, setEnteringId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadBusinesses() {
      setLoading(true);
      setError("");

      try {
        const { data } = await API.get("/admin/businesses");
        if (cancelled) return;
        setBusinesses(Array.isArray(data?.businesses) ? data.businesses : []);
      } catch (err) {
        console.error("Failed to load admin businesses:", err);
        if (!cancelled) {
          setError("לא ניתן לטעון את רשימת העסקים");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBusinesses();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return businesses;

    return businesses.filter((biz) => {
      const haystack = [
        biz.businessName,
        biz.category,
        biz.email,
        biz.phone,
        biz.city,
        biz.owner?.name,
        biz.owner?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [businesses, search]);

  async function handleEnterBusiness(business: AdminBusiness) {
    const label = business.businessName || "העסק";
    if (!window.confirm(`להיכנס לעסק "${label}" עם הרשאות מלאות?`)) return;

    setEnteringId(business._id);
    setError("");

    try {
      const { data } = await API.post("/admin/impersonate-business", {
        businessId: business._id,
      });

      loginWithToken(data.user, data.token, { skipRedirect: true });

      const businessId = data?.user?.businessId || business._id;
      navigate(`/business/${businessId}/dashboard`, { replace: true });
    } catch (err: any) {
      console.error("Enter business failed:", err);
      setError(
        err?.response?.data?.error || "לא ניתן להיכנס לעסק זה כרגע"
      );
    } finally {
      setEnteringId(null);
    }
  }

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f6f2fb] px-4 py-7 text-right text-slate-950 md:px-8"
      >
        <section className="mx-auto max-w-[1480px]">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-purple-950 md:text-4xl">
                עסקים במערכת
              </h1>
              <p className="mt-2 text-sm font-bold text-purple-950/55">
                כניסה לכל עסק עם הרשאות מלאות לביצוע כל הפעולות.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש לפי שם עסק, בעלים, אימייל..."
                className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none ring-purple-300 placeholder:text-slate-400 focus:ring-2 sm:w-80"
              />
              <span className="rounded-2xl bg-purple-100 px-4 py-3 text-center text-sm font-black text-purple-900">
                {filtered.length} עסקים
              </span>
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
                לא נמצאו עסקים
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-right">
                  <thead className="bg-purple-50 text-xs font-black text-purple-900/70">
                    <tr>
                      <th className="px-4 py-4">עסק</th>
                      <th className="px-4 py-4">קטגוריה</th>
                      <th className="px-4 py-4">בעלים</th>
                      <th className="px-4 py-4">טלפון</th>
                      <th className="px-4 py-4">עיר</th>
                      <th className="px-4 py-4">נוצר</th>
                      <th className="px-4 py-4">פעולה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((biz) => (
                      <tr
                        key={biz._id}
                        className="border-t border-purple-100 text-sm font-bold text-slate-800"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-start gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple-100 text-lg">
                              {biz.logo ? (
                                <img
                                  src={biz.logo}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                "🏢"
                              )}
                            </div>
                            <div>
                              <div className="font-black text-purple-950">
                                {biz.businessName || "ללא שם"}
                              </div>
                              <div className="text-xs text-slate-400">
                                {biz.email || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">{biz.category || "—"}</td>
                        <td className="px-4 py-4">
                          <div>{biz.owner?.name || "—"}</div>
                          <div className="text-xs font-bold text-slate-400">
                            {biz.owner?.email || ""}
                          </div>
                        </td>
                        <td className="px-4 py-4" dir="ltr">
                          {biz.phone || biz.owner?.phone || "—"}
                        </td>
                        <td className="px-4 py-4">{biz.city || "—"}</td>
                        <td className="px-4 py-4">
                          {formatDate(biz.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            disabled={enteringId === biz._id}
                            onClick={() => handleEnterBusiness(biz)}
                            className="rounded-2xl bg-gradient-to-l from-purple-700 to-fuchsia-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                          >
                            {enteringId === biz._id
                              ? "נכנס..."
                              : "כניסה לעסק"}
                          </button>
                        </td>
                      </tr>
                    ))}
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

export default AdminBusinesses;
