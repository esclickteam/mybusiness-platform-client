import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import AdminDialButton from "../../components/AdminDialButton";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import AdminPager, { paginateRows } from "./shell/AdminPager";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";

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
  const [sortKey, setSortKey] = useState<"businessName" | "createdAt">("businessName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

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

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const av = String(a[sortKey] || "").toLowerCase();
      const bv = String(b[sortKey] || "").toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const table = paginateRows(sorted, page, 20);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, sortDir]);

  async function handleEnterBusiness(business: AdminBusiness) {
    const label = business.businessName || "העסק";
    if (
      !window.confirm(
        `להיכנס לעסק "${label}" עם הרשאות החבילה של העסק?`
      )
    )
      return;

    setEnteringId(business._id);
    setError("");

    try {
      const { data } = await API.post("/admin/impersonate-business", {
        businessId: business._id,
      });

      loginWithToken(data.user, data.token, { skipRedirect: true });

      const businessId = data?.user?.businessId || business._id;
      navigate(
        getDefaultDashboardPath(businessId, data?.user?.enabledModules),
        { replace: true }
      );
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
        className="min-h-screen bg-[#f6f2fb] px-3 py-5 text-right text-slate-800 sm:px-4 sm:py-7 md:px-8"
      >
        <section className="mx-auto max-w-[1480px]">
          <AdminPageHeader
            title="עסקים"
            description="כניסה לכל עסק לפי הרשאות החבילה שלו."
          />

          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם עסק, בעלים או אימייל"
              className="biz-input sm:max-w-sm"
            />
            <span className="text-xs font-semibold text-[#667085]">
              {filtered.length} עסקים
            </span>
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
              <>
                {/* Mobile cards */}
                <div className="space-y-3 p-3 md:hidden">
                  {table.rows.map((biz) => {
                    const phone = biz.phone || biz.owner?.phone;

                    return (
                      <article
                        key={`m-${biz._id}`}
                        className="rounded-[24px] border border-purple-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-purple-100 text-lg">
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
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-black text-purple-950">
                              {biz.businessName || "ללא שם"}
                            </h3>
                            <p className="truncate text-xs font-bold text-slate-400">
                              {biz.owner?.name || "—"} · {biz.email || "—"}
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-500">
                              {biz.category || "—"}
                              {biz.city ? ` · ${biz.city}` : ""}
                            </p>
                          </div>
                          {phone ? (
                            <AdminDialButton
                              phone={phone}
                              name={biz.businessName || biz.owner?.name}
                              source="business"
                              refId={biz._id}
                            />
                          ) : null}
                        </div>

                        {phone ? (
                          <p
                            className="mt-3 text-sm font-bold text-slate-600"
                            dir="ltr"
                          >
                            {phone}
                          </p>
                        ) : null}

                        <button
                          type="button"
                          disabled={enteringId === biz._id}
                          onClick={() => handleEnterBusiness(biz)}
                          className="biz-btn biz-btn-secondary mt-3 w-full"
                        >
                          {enteringId === biz._id ? "נכנס..." : "כניסה לעסק"}
                        </button>
                      </article>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-right">
                    <thead className="bg-purple-50 text-xs font-black text-purple-900/70">
                      <tr>
                        <th className="px-4 py-4">
                          <button type="button" onClick={() => {
                            if (sortKey === "businessName") setSortDir((d) => d === "asc" ? "desc" : "asc");
                            else { setSortKey("businessName"); setSortDir("asc"); }
                          }}>
                            עסק
                          </button>
                        </th>
                        <th className="px-4 py-4">קטגוריה</th>
                        <th className="px-4 py-4">בעלים</th>
                        <th className="px-4 py-4">טלפון</th>
                        <th className="px-4 py-4">עיר</th>
                        <th className="px-4 py-4">
                          <button type="button" onClick={() => {
                            if (sortKey === "createdAt") setSortDir((d) => d === "asc" ? "desc" : "asc");
                            else { setSortKey("createdAt"); setSortDir("desc"); }
                          }}>
                            נוצר
                          </button>
                        </th>
                        <th className="px-4 py-4">פעולה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((biz) => (
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
                          <td className="px-4 py-4">
                            {biz.phone || biz.owner?.phone ? (
                              <div className="flex items-center justify-start gap-2">
                                <span
                                  dir="ltr"
                                  className="text-sm font-bold text-slate-700"
                                >
                                  {biz.phone || biz.owner?.phone}
                                </span>
                                <AdminDialButton
                                  phone={biz.phone || biz.owner?.phone}
                                  name={biz.businessName || biz.owner?.name}
                                  source="business"
                                  refId={biz._id}
                                />
                              </div>
                            ) : (
                              "—"
                            )}
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
                              className="biz-btn biz-btn-secondary"
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
              </>
            )}
            {!loading && filtered.length > 0 ? (
              <AdminPager
                page={table.page}
                pageCount={table.pageCount}
                from={table.from}
                to={table.to}
                total={table.total}
                onPage={setPage}
              />
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminBusinesses;
