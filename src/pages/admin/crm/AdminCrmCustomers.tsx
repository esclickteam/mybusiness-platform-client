import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDialButton from "../../../components/AdminDialButton";
import API from "../../../api";
import adminCrmApi from "../../../api/adminCrmApi";
import {
  Badge,
  HEALTH_LABELS,
  LIFECYCLE_LABELS,
  SOURCE_LABELS,
  STAGE_LABELS,
  formatIsraelDate,
  healthTone,
  lifecycleTone,
  stageTone,
  statusTone,
} from "./adminCrmLabels";
import { CrmCard, EmptyState, ErrorState, LoadingState, PrimaryButton, SecondaryButton } from "./AdminCrmUi";

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
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
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
  const [columns, setColumns] = useState<string[]>(ALL_COLUMNS.map((c) => c.key));
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

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

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
      setPages(data.pages || 1);
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
    adminCrmApi.meta().then(({ data }) => setCanExport(Boolean(data?.permissions?.export))).catch(() => {});
  }, []);

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setBanner("");
    try {
      await adminCrmApi.createCustomer(form);
      setShowCreate(false);
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
    if (key === "leadSource") return SOURCE_LABELS[row.leadSource || ""] || row.leadSource || "—";
    if (key === "subscriptionStatus") {
      return <Badge tone={statusTone(row.subscriptionStatus)}>{row.subscriptionStatus || "—"}</Badge>;
    }
    if (key === "mrr") return row.mrr ? `₪${row.mrr}` : "—";
    if (key === "addons") return (row.addons || []).join(", ") || "—";
    if (key === "lastActivityAt" || key === "nextFollowUpAt" || key === "createdAt") {
      return formatIsraelDate((row as any)[key], key !== "createdAt");
    }
    if (key === "phone") {
      return (
        <span className="inline-flex items-center gap-2" dir="ltr">
          {row.phone || "—"}
          <AdminDialButton phone={row.phone} name={row.contactName} source="admin-crm" refId={row.adminCustomerId} />
        </span>
      );
    }
    return (row as any)[key] || "—";
  }

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
            className="min-h-11 flex-1 rounded-2xl border border-purple-200 px-4 text-sm font-bold"
          />
          <select value={assigned} onChange={(e) => { setAssigned(e.target.value); setPage(1); }} className="min-h-11 rounded-2xl border border-purple-200 px-3 text-sm font-bold">
            <option value="">כל הלקוחות</option>
            <option value="me">משויך אלי</option>
            <option value="unassigned">לא משויך</option>
          </select>
          <select value={lifecycle} onChange={(e) => { setLifecycle(e.target.value); setPage(1); }} className="min-h-11 rounded-2xl border border-purple-200 px-3 text-sm font-bold">
            <option value="">כל מעגלי החיים</option>
            {Object.entries(LIFECYCLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={salesStage} onChange={(e) => { setSalesStage(e.target.value); setPage(1); }} className="min-h-11 rounded-2xl border border-purple-200 px-3 text-sm font-bold">
            <option value="">כל שלבי המכירה</option>
            {Object.entries(STAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <PrimaryButton onClick={() => setShowCreate(true)}>לקוח חדש</PrimaryButton>
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
            <select value={leadSource} onChange={(e) => setLeadSource(e.target.value)} className="min-h-11 rounded-2xl border px-3 text-sm font-bold">
              <option value="">כל המקורות</option>
              {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={pack} onChange={(e) => setPack(e.target.value)} className="min-h-11 rounded-2xl border px-3 text-sm font-bold">
              <option value="">כל החבילות</option>
              <option value="monthly">חודשי</option>
              <option value="yearly">שנתי</option>
              <option value="website_only">אתר בלבד</option>
              <option value="crm_only">CRM בלבד</option>
            </select>
            <select value={subStatus} onChange={(e) => setSubStatus(e.target.value)} className="min-h-11 rounded-2xl border px-3 text-sm font-bold">
              <option value="">סטטוס מנוי</option>
              <option value="active">פעיל</option>
              <option value="pending">ממתין</option>
              <option value="past_due">בפיגור</option>
              <option value="canceled">בוטל</option>
            </select>
            <select value={health} onChange={(e) => setHealth(e.target.value)} className="min-h-11 rounded-2xl border px-3 text-sm font-bold">
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

      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState title="אין לקוחות להצגה" action={<PrimaryButton onClick={() => setShowCreate(true)}>יצירת לקוח</PrimaryButton>} />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {items.map((row) => (
              <button
                key={row.adminCustomerId}
                type="button"
                onClick={() => navigate(`/admin/crm/customers/${row.adminCustomerId}`)}
                className="w-full rounded-[24px] border border-purple-100 bg-white p-4 text-right shadow-sm"
              >
                <div className="font-black text-purple-950">{row.companyName || row.contactName || "ללא שם"}</div>
                <div className="mt-1 text-sm font-bold text-slate-500">{row.contactName} · {row.phone}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone={lifecycleTone(row.lifecycle)}>{LIFECYCLE_LABELS[row.lifecycle || ""]}</Badge>
                  <Badge tone={stageTone(row.salesStage)}>{STAGE_LABELS[row.salesStage || ""]}</Badge>
                  {row.health ? <Badge tone={healthTone(row.health)}>{HEALTH_LABELS[row.health]}</Badge> : null}
                </div>
              </button>
            ))}
          </div>
          <CrmCard className="hidden overflow-x-auto md:block">
            {selected.length ? (
              <div className="mb-3 flex gap-2">
                <SecondaryButton onClick={bulkAssign}>שייך נבחרים</SecondaryButton>
                <span className="self-center text-sm font-bold text-slate-500">{selected.length} נבחרו</span>
              </div>
            ) : null}
            <table className="w-full min-w-[1100px] text-right text-sm">
              <thead>
                <tr className="border-b border-purple-100 text-xs font-black text-slate-500">
                  <th className="p-2"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? items.map((i) => i.adminCustomerId) : [])} /></th>
                  {ALL_COLUMNS.filter((c) => columns.includes(c.key)).map((col) => (
                    <th key={col.key} className="cursor-pointer p-2" onClick={() => setSort(col.key)}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row.adminCustomerId}
                    className="cursor-pointer border-b border-slate-100 hover:bg-[#faf7ff]"
                    onClick={() => navigate(`/admin/crm/customers/${row.adminCustomerId}`)}
                  >
                    <td className="p-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(row.adminCustomerId)}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked
                              ? [...prev, row.adminCustomerId]
                              : prev.filter((id) => id !== row.adminCustomerId)
                          )
                        }
                      />
                    </td>
                    {ALL_COLUMNS.filter((c) => columns.includes(c.key)).map((col) => (
                      <td key={col.key} className="p-2 align-top font-bold text-slate-700">
                        {cell(row, col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CrmCard>
          <div className="flex items-center justify-between text-sm font-bold text-slate-500">
            <span>{total} רשומות</span>
            <div className="flex gap-2">
              <SecondaryButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>הקודם</SecondaryButton>
              <span className="self-center">{page} / {pages}</span>
              <SecondaryButton disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>הבא</SecondaryButton>
            </div>
          </div>
        </>
      )}

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
              <SecondaryButton type="button" onClick={() => setShowCreate(false)}>ביטול</SecondaryButton>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
