import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api";
import AdminDataTable, { type AdminTableColumn } from "../shell/AdminDataTable";
import AdminPageHeader from "../shell/AdminPageHeader";
import { SAAS_SYSTEMS, SALE_STATUS, type SaasSystem } from "./saasSystems";

type Tenant = { templateSlug?: string; status?: string };

type Row = SaasSystem & { businesses: number | null; active: number | null };

export default function AdminSaasSystems() {
  const [counts, setCounts] = useState<Record<string, { businesses: number; active: number }> | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    API.get("/admin/saas-tenants")
      .then(({ data }) => {
        const next: Record<string, { businesses: number; active: number }> = {};
        for (const tenant of (data.tenants || []) as Tenant[]) {
          const slug = String(tenant.templateSlug || "");
          if (!next[slug]) next[slug] = { businesses: 0, active: 0 };
          next[slug].businesses += 1;
          if (tenant.status === "active") next[slug].active += 1;
        }
        setCounts(next);
      })
      .catch(() => setError("מספר העסקים לא נטען. שאר פרטי המערכת מוצגים בלי מספר."));
  }, []);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = SAAS_SYSTEMS.filter((system) => {
      const haystack = `${system.name} ${system.slug} ${system.host}`.toLowerCase();
      return !term || haystack.includes(term);
    }).map((system) => ({
      ...system,
      businesses: counts ? counts[system.slug]?.businesses || 0 : null,
      active: counts ? counts[system.slug]?.active || 0 : null,
    }));
    const factor = sortDir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      if (sortKey === "businesses") return ((a.active || 0) - (b.active || 0)) * factor;
      return a.name.localeCompare(b.name, "he") * factor;
    });
  }, [counts, query, sortDir, sortKey]);

  const columns: AdminTableColumn<Row>[] = [
    {
      key: "name",
      header: "מערכת",
      sortable: true,
      render: (row) => (
        <span className="biz-system-name">
          <i aria-hidden="true">{row.name.slice(0, 1)}</i>
          <strong>{row.name}</strong>
        </span>
      ),
    },
    {
      key: "host",
      header: "דומיין",
      render: (row) => (
        <a href={`https://${row.host}`} target="_blank" rel="noreferrer">
          {row.host}
        </a>
      ),
    },
    {
      key: "sale",
      header: "מכירה",
      render: () => <span className="biz-status is-ok"><i />{SALE_STATUS}</span>,
    },
    {
      key: "businesses",
      header: "עסקים",
      numeric: true,
      sortable: true,
      render: (row) => (row.businesses === null ? "לא נטען" : String(row.active)),
    },
    {
      key: "backup",
      header: "גיבוי וסיכון",
      secondary: true,
      render: (row) => row.backup,
    },
  ];

  return (
    <div dir="rtl">
      <AdminPageHeader
        title="עשר המערכות"
        description="Delivera לא מוצגת כאן ואינה זמינה למכירה או להקמה."
      />
      {error ? <p className="biz-table-error">{error}</p> : null}
      <AdminDataTable
        tableId="admin-saas-systems"
        rows={rows}
        columns={columns}
        rowKey={(row) => row.slug}
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="חיפוש מערכת"
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key) => {
          setSortDir((current) => (sortKey === key && current === "asc" ? "desc" : "asc"));
          setSortKey(key);
        }}
        emptyTitle="אין מערכת תואמת"
        mobileTitle={(row) => row.name}
        mobileMeta={(row) => row.host}
        rowActions={(row) => (
          <span className="biz-btn-row">
            <Link className="biz-btn" to={`/admin/saas-tenants?system=${row.slug}`}>
              ניהול
            </Link>
            <a className="biz-btn biz-btn-secondary" href={`https://${row.host}`} target="_blank" rel="noreferrer">
              פתיחה
            </a>
          </span>
        )}
      />
    </div>
  );
}
