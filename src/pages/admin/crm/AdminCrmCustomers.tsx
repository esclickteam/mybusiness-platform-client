import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import API from "../../../api";
import adminCrmApi from "../../../api/adminCrmApi";
import {
  Badge,
  HEALTH_LABELS,
  LIFECYCLE_LABELS,
  SOURCE_LABELS,
  STAGE_LABELS,
  formatIsraelDate,
  lifecycleTone,
  stageTone,
  statusTone,
} from "./adminCrmLabels";
import AdminDataTable, { type AdminTableColumn } from "../shell/AdminDataTable";
import AdminRowMenu from "../shell/AdminRowMenu";
import { AdminEllipsis, AdminIdentity, AdminMoney, AdminPhone } from "../shell/adminCells";
import { CrmCard, PrimaryButton, SecondaryButton, DangerButton } from "./AdminCrmUi";
import { AdminModal } from "./AdminModal";
import MetaLeadAdsIntegration from "../../business/dashboardPages/crmpages/MetaLeadAdsIntegration";
import AdNetworkPickerModal, {
  type AdNetworkId,
} from "../../business/dashboardPages/crmpages/AdNetworkPickerModal";

type Row = {
  adminCustomerId: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  lifecycle?: string;
  salesStage?: string;
  assignedAdminName?: string;
  leadSource?: string;
  leadSourceLabel?: string;
  metaLead?: {
    formName?: string;
    formId?: string;
    pageName?: string;
  };
  currentPackageLabel?: string;
  mrr?: number;
  addons?: string[];
  subscriptionStatus?: string;
  lastActivityAt?: string;
  nextFollowUpAt?: string;
  createdAt?: string;
  health?: string;
};

const ALL_COLUMNS = [
  { key: "companyName", label: "לקוח / עסק" },
  { key: "contactName", label: "איש קשר" },
  { key: "phone", label: "טלפון" },
  { key: "email", label: "אימייל" },
  { key: "lifecycle", label: "מעגל חיים" },
  { key: "salesStage", label: "סטטוס מכירה" },
  { key: "assignedAdminName", label: "אדמין אחראי" },
  { key: "leadSource", label: "מקור" },
  { key: "currentPackageLabel", label: "חבילה" },
  { key: "mrr", label: "MRR" },
  { key: "addons", label: "תוספים" },
  { key: "subscriptionStatus", label: "מנוי" },
  { key: "lastActivityAt", label: "פעילות אחרונה" },
  { key: "nextFollowUpAt", label: "מעקב הבא" },
  { key: "createdAt", label: "נוצר" },
] as const;

export default function AdminCrmCustomers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [lifecycle, setLifecycle] = useState("");
  const [salesStage, setSalesStage] = useState("");
  const [assigned, setAssigned] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [leadSource, setLeadSource] = useState("");
  const [pack, setPack] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [health, setHealth] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [selected, setSelected] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem("biz-admin-table:crm-leads:columns") || "null");
      const allowed = new Set(ALL_COLUMNS.map((column) => column.key));
      if (Array.isArray(stored) && stored.every((key) => allowed.has(key)) && stored.length) {
        return stored as string[];
      }
    } catch {
      /* display preference only */
    }
    return ALL_COLUMNS.map((column) => column.key);
  });
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    companyName: "",
    phone: "",
    email: "",
    leadSource: "manual",
  });
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [banner, setBanner] = useState("");
  const [canExport, setCanExport] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAdNetworkPicker, setShowAdNetworkPicker] = useState(false);

  const showMetaSetup =
    searchParams.get("metaSetup") === "1" ||
    searchParams.get("meta_connected") === "1" ||
    Boolean(searchParams.get("meta_error"));

  function closeCreateModal() {
    setShowCreate(false);
    if (searchParams.get("create") === "1") {
      const next = new URLSearchParams(searchParams);
      next.delete("create");
      const search = next.toString();
      navigate(
        { pathname: location.pathname, search: search ? `?${search}` : "" },
        { replace: true }
      );
    }
  }

  useEffect(() => {
    if (searchParams.get("create") !== "1") return;
    setShowCreate(true);
    const next = new URLSearchParams(searchParams);
    next.delete("create");
    const search = next.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true }
    );
  }, [searchParams, location.pathname, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    try {
      window.localStorage.setItem("biz-admin-table:crm-leads:columns", JSON.stringify(columns));
    } catch {
      /* display preference only */
    }
  }, [columns]);

  const query = useMemo(
    () => ({
      q: debounced,
      page,
      limit: 25,
      lifecycle,
      salesStage,
      assignedAdminId: assigned,
      leadSource,
      package: pack,
      subscriptionStatus: subStatus,
      health,
      sort,
    }),
    [debounced, page, lifecycle, salesStage, assigned, leadSource, pack, subStatus, health, sort]
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.customers(query);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הלקוחות נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [query]);

  useEffect(() => {
    adminCrmApi.filters().then(({ data }) => setSavedFilters(data.filters || [])).catch(() => {});
    adminCrmApi.meta().then(({ data }) => {
      setCanExport(Boolean(data?.permissions?.export));
      setCanDelete(Boolean(data?.permissions?.delete));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const state = location.state as { deletedLeadToast?: boolean } | null;
    if (state?.deletedLeadToast) {
      setBanner("הליד נמחק לצמיתות");
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const onLeadsUpdated = () => {
      load();
    };
    window.addEventListener("bizuply:leads-updated", onLeadsUpdated);
    return () => window.removeEventListener("bizuply:leads-updated", onLeadsUpdated);
  }, [query]);

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setBanner("");
    try {
      await adminCrmApi.createCustomer(form);
      closeCreateModal();
      setForm({ contactName: "", companyName: "", phone: "", email: "", leadSource: "manual" });
      setBanner("הרשומה נשמרה");
      load();
    } catch (err: any) {
      setBanner(err?.response?.data?.error || "יצירה נכשלה");
    } finally {
      setCreating(false);
    }
  }

  async function saveCurrentFilter() {
    const name = window.prompt("שם הסינון השמור");
    if (!name) return;
    await adminCrmApi.saveFilter({ name, filters: query });
    const { data } = await adminCrmApi.filters();
    setSavedFilters(data.filters || []);
  }

  async function confirmPermanentDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminCrmApi.deleteCustomer(deleteTarget.adminCustomerId);
      setItems((prev) => prev.filter((row) => row.adminCustomerId !== deleteTarget.adminCustomerId));
      setTotal((prev) => Math.max(0, prev - 1));
      setBanner("הליד נמחק לצמיתות");
      setDeleteTarget(null);
    } catch (err: any) {
      setBanner(err?.response?.data?.error || "מחיקת הליד נכשלה");
    } finally {
      setDeleteLoading(false);
    }
  }

  function rowCanDelete(row: Row) {
    return canDelete && row.lifecycle === "lead" && !row.currentPackageLabel && !row.subscriptionStatus;
  }

  async function bulkAssign() {
    if (!selected.length) return;
    await adminCrmApi.bulk({ action: "assign", ids: selected, assignedAdminId: assigned || null });
    setSelected([]);
    load();
  }

  async function exportCsv() {
    const { data } = await API.get(adminCrmApi.exportUrl(query), { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admin-crm-customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function cell(row: Row, key: string) {
    if (key === "lifecycle") {
      return <Badge tone={lifecycleTone(row.lifecycle)}>{LIFECYCLE_LABELS[row.lifecycle || ""] || row.lifecycle}</Badge>;
    }
    if (key === "salesStage") {
      return <Badge tone={stageTone(row.salesStage)}>{STAGE_LABELS[row.salesStage || ""] || row.salesStage}</Badge>;
    }
    if (key === "leadSource") {
      const source = row.leadSourceLabel || SOURCE_LABELS[row.leadSource || ""] || row.leadSource || "—";
      const formName = row.metaLead?.formName;
      return (
        <span>
          {source}
          {formName ? (
            <span className="mt-1 block text-[11px] font-black text-[#7C4DFF]">טופס ליד · {formName}</span>
          ) : null}
        </span>
      );
    }
    if (key === "subscriptionStatus") {
      return <Badge tone={statusTone(row.subscriptionStatus)}>{row.subscriptionStatus || "—"}</Badge>;
    }
    if (key === "companyName") {
      return (
        <AdminIdentity
          name={row.companyName || row.contactName || "ללא שם"}
          subtitle={row.email}
        />
      );
    }
    if (key === "mrr") return <AdminMoney amount={row.mrr || null} currency="ILS" />;
    if (key === "addons") return <AdminEllipsis>{(row.addons || []).join(", ")}</AdminEllipsis>;
    if (key === "lastActivityAt" || key === "nextFollowUpAt" || key === "createdAt") {
      return formatIsraelDate((row as any)[key], key !== "createdAt");
    }
    if (key === "phone") {
      return (
        <AdminPhone
          phone={row.phone}
          name={row.contactName || row.companyName}
          source="admin-crm"
          refId={row.adminCustomerId}
        />
      );
    }
    if (key === "email") {
      return <AdminEllipsis dir="ltr" muted>{row.email}</AdminEllipsis>;
    }
    return <AdminEllipsis>{(row as any)[key]}</AdminEllipsis>;
  }

  function closeMetaSetup() {
    const next = new URLSearchParams(searchParams);
    next.delete("metaSetup");
    next.delete("meta_connected");
    next.delete("meta_error");
    const search = next.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true }
    );
    load();
  }

  function handleMetaLeadsSynced(summary: {
    created?: number;
    skippedExisting?: number;
    failed?: number;
  }) {
    const created = Number(summary?.created || 0);
    const duplicate = Number(summary?.skippedExisting || 0);
    const failed = Number(summary?.failed || 0);
    setBanner(
      failed > 0
        ? `הסנכרון הושלם — נוספו ${created} לידים, ${duplicate} כבר היו קיימים. נכשלו ${failed}.`
        : `הסנכרון הושלם — נוספו ${created} לידים, ${duplicate} כבר היו קיימים.`
    );
    load();
  }

  function openMetaSetup() {
    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    navigate(
      { pathname: location.pathname, search: `?${next.toString()}` },
      { replace: false }
    );
  }

  function handleAdNetworkSelect(network: AdNetworkId) {
    setShowAdNetworkPicker(false);
    if (network === "meta") openMetaSetup();
    if (network === "google") setBanner("חיבור Google Ads יגיע בקרוב");
  }

  if (showMetaSetup) {
    return (
      <MetaLeadAdsIntegration
        destination="admin_crm"
        onBack={closeMetaSetup}
        onLeadsSynced={handleMetaLeadsSynced}
      />
    );
  }

  const secondaryKeys = new Set(["email", "addons", "lastActivityAt", "assignedAdminName"]);
  const leadColumns: AdminTableColumn<Row>[] = ALL_COLUMNS.filter((col) => columns.includes(col.key)).map((col) => ({
    key: col.key,
    header: col.label,
    sortable: true,
    numeric: col.key === "mrr",
    secondary: secondaryKeys.has(col.key),
    render: (row: Row) => cell(row, col.key),
  }));

  return (
    <div className="space-y-4">
      {banner ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-bold text-emerald-800">
          {banner}
        </div>
      ) : null}
      <CrmCard>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="חיפוש שם, עסק, טלפון, אימייל, מזהה..."
            className="biz-input"
          />
          <select value={assigned} onChange={(e) => { setAssigned(e.target.value); setPage(1); }} className="biz-input biz-input-auto">
            <option value="">כל הלקוחות</option>
            <option value="me">משויך אלי</option>
            <option value="unassigned">לא משויך</option>
          </select>
          <select value={lifecycle} onChange={(e) => { setLifecycle(e.target.value); setPage(1); }} className="biz-input biz-input-auto">
            <option value="">כל מעגלי החיים</option>
            {Object.entries(LIFECYCLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={salesStage} onChange={(e) => { setSalesStage(e.target.value); setPage(1); }} className="biz-input biz-input-auto">
            <option value="">כל שלבי המכירה</option>
            {Object.entries(STAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <PrimaryButton onClick={() => setShowCreate(true)}>לקוח חדש</PrimaryButton>
          <SecondaryButton onClick={() => setShowAdNetworkPicker(true)}>חיבור לרשת פרסום</SecondaryButton>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => setShowAdvanced((v) => !v)}>סינון מתקדם</SecondaryButton>
          <SecondaryButton onClick={saveCurrentFilter}>שמירת סינון</SecondaryButton>
          {canExport ? <SecondaryButton onClick={exportCsv}>ייצוא CSV</SecondaryButton> : null}
          {savedFilters.map((filter) => (
            <button
              key={filter._id}
              type="button"
              className="rounded-full border border-purple-200 px-3 py-1 text-xs font-black text-[#7C4DFF]"
              onClick={() => {
                const f = filter.filters || {};
                setQ(f.q || "");
                setLifecycle(f.lifecycle || "");
                setSalesStage(f.salesStage || "");
                setAssigned(f.assignedAdminId || "");
              }}
            >
              {filter.name}
            </button>
          ))}
        </div>
        {showAdvanced ? (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select value={leadSource} onChange={(e) => setLeadSource(e.target.value)} className="biz-input">
              <option value="">כל המקורות</option>
              {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={pack} onChange={(e) => setPack(e.target.value)} className="biz-input">
              <option value="">כל החבילות</option>
              <option value="monthly">חודשי</option>
              <option value="yearly">שנתי</option>
              <option value="website_only">אתר בלבד</option>
              <option value="crm_only">CRM בלבד</option>
            </select>
            <select value={subStatus} onChange={(e) => setSubStatus(e.target.value)} className="biz-input">
              <option value="">סטטוס מנוי</option>
              <option value="active">פעיל</option>
              <option value="pending">ממתין</option>
              <option value="past_due">בפיגור</option>
              <option value="canceled">בוטל</option>
            </select>
            <select value={health} onChange={(e) => setHealth(e.target.value)} className="biz-input">
              <option value="">בריאות</option>
              {Object.entries(HEALTH_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
          עמודות:
          {ALL_COLUMNS.map((col) => (
            <label key={col.key} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={columns.includes(col.key)}
                onChange={() =>
                  setColumns((prev) =>
                    prev.includes(col.key) ? prev.filter((k) => k !== col.key) : [...prev, col.key]
                  )
                }
              />
              {col.label}
            </label>
          ))}
        </div>
      </CrmCard>

      <AdminDataTable
        tableId="admin-crm-leads"
        rows={items}
        columns={leadColumns}
        rowKey={(row) => row.adminCustomerId}
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="אין לקוחות להצגה"
        emptyAction={<PrimaryButton onClick={() => setShowCreate(true)}>יצירת לקוח</PrimaryButton>}
        clientPagination={false}
        page={page}
        onPageChange={setPage}
        pageSize={25}
        pageSizeOptions={[]}
        total={total}
        sortKey={sort}
        onSort={(key) => {
          setSort(key);
          setPage(1);
        }}
        selectable
        selectedKeys={selected}
        onSelectedKeysChange={setSelected}
        onToggleAll={(checked) =>
          setSelected(checked ? items.map((item) => item.adminCustomerId) : [])
        }
        bulkBar={
          <>
            <SecondaryButton onClick={bulkAssign}>שייך נבחרים</SecondaryButton>
            <span className="biz-table-count">{selected.length} נבחרו</span>
          </>
        }
        countLabel={`${total} רשומות`}
        onRowClick={(row) => navigate(`/admin/crm/customers/${row.adminCustomerId}`)}
        mobileTitle={(row) => row.companyName || row.contactName || "ללא שם"}
        mobileMeta={(row) => [row.contactName, row.phone].filter(Boolean).join(" · ")}
        rowActions={
          canDelete
            ? (row) =>
                rowCanDelete(row) ? (
                  <AdminRowMenu
                    items={[
                      {
                        label: "מחיקת ליד",
                        danger: true,
                        onClick: () => setDeleteTarget(row),
                      },
                    ]}
                  />
                ) : null
            : undefined
        }
      />

      {showCreate ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form onSubmit={createCustomer} className="w-full max-w-lg space-y-3 rounded-[28px] bg-white p-5 text-right">
            <h2 className="text-xl font-black">לקוח CRM חדש</h2>
            <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="שם איש קשר" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
            <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="שם עסק" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="טלפון" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <input className="min-h-11 w-full rounded-2xl border px-3" placeholder="אימייל" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="flex gap-2">
              <PrimaryButton disabled={creating} type="submit">{creating ? "שומר..." : "שמירה"}</PrimaryButton>
              <SecondaryButton type="button" onClick={closeCreateModal}>ביטול</SecondaryButton>
            </div>
          </form>
        </div>
      ) : null}

      {deleteTarget ? (
        <AdminModal
          open
          onClose={() => !deleteLoading && setDeleteTarget(null)}
          title="למחוק את הליד לצמיתות?"
          subtitle="הפעולה תמחק את הליד ואת נתוני ה-Admin CRM המשויכים אליו ולא ניתן יהיה לשחזר אותם."
          size="sm"
          footer={
            <div className="flex flex-wrap gap-2">
              <SecondaryButton compact disabled={deleteLoading} onClick={() => setDeleteTarget(null)}>
                ביטול
              </SecondaryButton>
              <DangerButton compact disabled={deleteLoading} onClick={confirmPermanentDelete}>
                {deleteLoading ? "מוחק..." : "מחיקה לצמיתות"}
              </DangerButton>
            </div>
          }
        >
          <p className="text-sm font-bold text-slate-600">
            {deleteTarget.contactName || deleteTarget.companyName || "ליד"} · {deleteTarget.phone || deleteTarget.email}
          </p>
        </AdminModal>
      ) : null}

      <AdNetworkPickerModal
        open={showAdNetworkPicker}
        onClose={() => setShowAdNetworkPicker(false)}
        onSelect={handleAdNetworkSelect}
      />
    </div>
  );
}
