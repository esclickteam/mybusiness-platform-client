import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import AdminDataTable, { type AdminTableColumn } from "./shell/AdminDataTable";
import AdminPageHeader from "./shell/AdminPageHeader";
import { AdminDateText, AdminEllipsis, AdminIdentity, AdminPhone } from "./shell/adminCells";
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
  const [category, setCategory] = useState("");
  const [sortKey, setSortKey] = useState<"businessName" | "createdAt">("businessName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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

  const categories = useMemo(() => {
    return Array.from(
      new Set(businesses.map((biz) => biz.category).filter((value): value is string => Boolean(value)))
    ).sort((a, b) => a.localeCompare(b, "he"));
  }, [businesses]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return businesses.filter((biz) => {
      if (category && biz.category !== category) return false;
      if (!term) return true;
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
  }, [businesses, search, category]);

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

  function toggleSort(key: "businessName" | "createdAt") {
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  }

  const columns: AdminTableColumn<AdminBusiness>[] = [
    {
      key: "businessName",
      header: "עסק",
      sortable: true,
      render: (biz) => (
        <AdminIdentity
          name={biz.businessName || "ללא שם"}
          subtitle={biz.email}
          image={biz.logo}
        />
      ),
    },
    {
      key: "category",
      header: "קטגוריה",
      secondary: true,
      render: (biz) => <AdminEllipsis>{biz.category}</AdminEllipsis>,
    },
    {
      key: "owner",
      header: "בעלים",
      render: (biz) => (
        <span className="biz-identity-copy">
          <strong title={biz.owner?.name || ""}>{biz.owner?.name || "—"}</strong>
          {biz.owner?.email ? (
            <small dir="ltr" title={biz.owner.email}>
              {biz.owner.email}
            </small>
          ) : null}
        </span>
      ),
    },
    {
      key: "phone",
      header: "טלפון",
      render: (biz) => (
        <AdminPhone
          phone={biz.phone || biz.owner?.phone}
          name={biz.businessName || biz.owner?.name}
          source="business"
          refId={biz._id}
        />
      ),
    },
    {
      key: "city",
      header: "עיר",
      secondary: true,
      render: (biz) => <AdminEllipsis>{biz.city}</AdminEllipsis>,
    },
    {
      key: "createdAt",
      header: "נוצר",
      sortable: true,
      numeric: true,
      render: (biz) => <AdminDateText value={biz.createdAt} />,
    },
  ];

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

          <AdminDataTable
            tableId="admin-businesses"
            rows={sorted}
            columns={columns}
            rowKey={(biz) => biz._id}
            loading={loading}
            error={error}
            emptyTitle="לא נמצאו עסקים"
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="חיפוש לפי שם עסק, בעלים או אימייל"
            resetKey={`${search}|${category}|${sortKey}|${sortDir}`}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={(key) => toggleSort(key as "businessName" | "createdAt")}
            countLabel={`${filtered.length} עסקים`}
            filters={
              <select
                className="biz-input biz-input-auto"
                aria-label="סינון לפי קטגוריה"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">כל הקטגוריות</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            }
            mobileTitle={(biz) => biz.businessName || "ללא שם"}
            mobileMeta={(biz) =>
              [biz.owner?.name, biz.category, biz.city].filter(Boolean).join(" · ") || "—"
            }
            rowActions={(biz) => (
              <button
                type="button"
                disabled={enteringId === biz._id}
                onClick={() => handleEnterBusiness(biz)}
                className="biz-btn biz-btn-secondary biz-btn-row"
              >
                {enteringId === biz._id ? "נכנס..." : "כניסה לעסק"}
              </button>
            )}
          />
        </section>
      </main>
    </>
  );
}

export default AdminBusinesses;
