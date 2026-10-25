import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  Columns3,
  Download,
  Filter,
  LayoutGrid,
  LayoutList,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../i18n/localeUtils";
import ExcelJS from "exceljs";
import {
  assignLead,
  bulkUpdateLeads,
  createView,
  deleteView,
  exportLeadsCsv,
  exportLeadsJson,
  fetchAgents,
  fetchDuplicates,
  fetchFunnel,
  fetchViews,
  fetchWorkspaceLeads,
  fetchWorkspaceSettings,
  importLeadRows,
  mergeLeads,
  patchLead,
  type PipelineStage,
  type SavedView,
  type WorkspaceLead,
} from "./crmWorkspaceApi";
import CRMLeadCard from "./CRMLeadCard";
import {
  DEFAULT_COLUMNS,
  EMPTY_LEAD_LIST_STATE,
  loadLeadListState,
  saveLeadListState,
  type LeadListState,
} from "./leadListState";
import { getApiErrorMessage } from "../../../../../utils/apiErrorMessage";

const PAGE_SIZE = 50;

export default function CRMLeadsWorkspace({
  businessId,
  mode = "active",
  onConnectAds,
}: {
  businessId?: string;
  mode?: "active" | "old";
  onConnectAds?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "he";
  const [state, setState] = useState<LeadListState>(() => loadLeadListState(businessId));
  const [leads, setLeads] = useState<WorkspaceLead[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [openLeadId, setOpenLeadId] = useState("");
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [agents, setAgents] = useState<Array<{ _id: string; name: string }>>([]);
  const [views, setViews] = useState<SavedView[]>([]);
  const [funnel, setFunnel] = useState<Array<{ key: string; label: string; count: number; amount: number }>>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [duplicates, setDuplicates] = useState<Array<any>>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("contacted");
  const [bulkAgent, setBulkAgent] = useState("");
  const tableRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const loadingMoreRef = useRef(false);

  const query = useMemo(
    () => ({
      businessId,
      page: state.page,
      limit: PAGE_SIZE,
      q: state.q,
      status: mode === "old" ? "old" : state.status,
      stage: state.stage,
      source: state.source,
      campaign: state.campaign,
      formId: state.formId,
      assignedTo: state.assignedTo === "all" ? undefined : state.assignedTo,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
      sort: state.sort,
      dir: state.dir,
    }),
    [businessId, mode, state]
  );

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const data = await fetchWorkspaceLeads(query);
        setLeads((prev) =>
          query.page && query.page > 1
            ? [...prev, ...(data.leads || [])]
            : data.leads || []
        );
        setTotal(data.total || 0);
        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        setError(getApiErrorMessage(err, t("crm.leads.errors.loadFailed")));
      } finally {
        if (!silent) setLoading(false);
        loadingMoreRef.current = false;
      }
    },
    [query, t]
  );

  useEffect(() => {
    saveLeadListState(businessId, state);
  }, [businessId, state]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void Promise.all([
      fetchWorkspaceSettings(),
      fetchAgents(),
      fetchViews(),
      fetchFunnel(),
    ]).then(([settings, agentRows, viewRows, funnelData]) => {
      setStages(settings.pipelineStages || []);
      setAgents(agentRows);
      setViews(viewRows);
      setFunnel(funnelData.funnel || []);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const leadId = params.get("leadId");
    if (leadId) setOpenLeadId(leadId);
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      if (detail.leadId) setOpenLeadId(String(detail.leadId));
    };
    window.addEventListener("bizuply:open-lead", onOpen as EventListener);
    window.addEventListener("bizuply:leads-updated", () => void load(true));
    return () => {
      window.removeEventListener("bizuply:open-lead", onOpen as EventListener);
      window.removeEventListener("bizuply:leads-updated", () => void load(true));
    };
  }, [load]);

  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollTop = state.scrollTop;
  }, [openLeadId]);

  const updateState = (patch: Partial<LeadListState>) => {
    setState((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  };

  const toggleSort = (column: string) => {
    setState((prev) => ({
      ...prev,
      sort: column,
      dir: prev.sort === column && prev.dir === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const confirmBulk = async (action: string, extra: Record<string, unknown> = {}) => {
    if (!selected.length) return;
    if (!window.confirm(t("crm.workspace.confirmBulk", { count: selected.length }))) return;
    try {
      await bulkUpdateLeads({ confirm: true, action, leadIds: selected, ...extra });
      setSelected([]);
      setNotice(t("crm.workspace.bulkDone"));
      void load(true);
    } catch (err) {
      setError(getApiErrorMessage(err, t("crm.leads.errors.requestFailed")));
    }
  };

  const visibleColumns = state.columnOrder.filter((column) => state.visibleColumns.includes(column));

  const onImport = async (file: File) => {
    const rows: Array<Record<string, string>> = [];
    if (file.name.endsWith(".csv")) {
      const text = await file.text();
      const [headerLine, ...rest] = text.split(/\r?\n/).filter(Boolean);
      const headers = headerLine.split(",").map((item) => item.trim());
      rest.forEach((line) => {
        const cells = line.split(",");
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = cells[index] || "";
        });
        rows.push(row);
      });
    } else {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const sheet = workbook.worksheets[0];
      const headers: string[] = [];
      sheet.getRow(1).eachCell((cell, col) => {
        headers[col] = String(cell.value || "");
      });
      sheet.eachRow((row, index) => {
        if (index === 1) return;
        const item: Record<string, string> = {};
        headers.forEach((header, col) => {
          if (!header) return;
          item[header] = String(row.getCell(col).value || "");
        });
        rows.push(item);
      });
    }
    const result = await importLeadRows(rows);
    setNotice(t("crm.workspace.imported", { count: result.created }));
    void load();
  };

  const onExportExcel = async () => {
    const rows = await exportLeadsJson(query);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("leads");
    if (rows[0]) sheet.addRow(Object.keys(rows[0]));
    rows.forEach((row) => sheet.addRow(Object.values(row)));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  };

  const moveCard = async (leadId: string, stageKey: string) => {
    await patchLead(leadId, { stageKey });
    void load(true);
    const nextFunnel = await fetchFunnel();
    setFunnel(nextFunnel.funnel || []);
  };

  return (
    <div className="space-y-3" dir={getTextDirection(i18n.language)}>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{notice}</div>}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={state.q}
            onChange={(event) => updateState({ q: event.target.value })}
            placeholder={t("crm.workspace.searchPlaceholder")}
            className="h-10 w-full bg-transparent text-sm font-semibold outline-none"
          />
        </div>
        <button type="button" className="icon-btn" onClick={() => setShowFilters((value) => !value)}>
          <Filter className="h-4 w-4" /> {t("crm.common.filter")}
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t("crm.leads.listView")}
          onClick={() => setState((prev) => ({ ...prev, viewMode: "table" }))}
        >
          <LayoutList className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t("crm.workspace.compactView")}
          onClick={() => setState((prev) => ({ ...prev, viewMode: "compact" }))}
        >
          <Columns3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t("crm.leads.boardView")}
          onClick={() => setState((prev) => ({ ...prev, viewMode: "kanban" }))}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button type="button" className="icon-btn" onClick={() => setShowColumns((value) => !value)}>
          {t("crm.workspace.columns")}
        </button>
        <button type="button" className="icon-btn" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => void exportLeadsCsv(query).then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "leads.csv";
            link.click();
          })}
        >
          <Download className="h-4 w-4" /> CSV
        </button>
        <button type="button" className="icon-btn" onClick={() => void onExportExcel()}>
          <Download className="h-4 w-4" /> Excel
        </button>
        <button type="button" className="icon-btn" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" /> {t("crm.leads.importLeads")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onImport(file);
          }}
        />
        {onConnectAds && (
          <button type="button" className="icon-btn" onClick={onConnectAds}>
            {t("crm.leads.connectAdNetwork")}
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-3 lg:grid-cols-6">
          <select className="field" value={state.status} onChange={(event) => updateState({ status: event.target.value })}>
            <option value="all">{t("crm.common.all")}</option>
            {["new", "contacted", "in_progress", "interested", "quote", "negotiation", "converted", "lost"].map((status) => (
              <option key={status} value={status}>{t(`crm.leads.statuses.${status}`, { defaultValue: status })}</option>
            ))}
          </select>
          <select className="field" value={state.stage} onChange={(event) => updateState({ stage: event.target.value })}>
            <option value="all">{t("crm.workspace.allStages")}</option>
            {stages.map((stage) => (
              <option key={stage.key} value={stage.key}>{stage.label}</option>
            ))}
          </select>
          <select className="field" value={state.source} onChange={(event) => updateState({ source: event.target.value })}>
            <option value="all">{t("crm.leads.filters.allSources")}</option>
            <option value="meta">{t("crm.leads.filters.metaOnly")}</option>
            <option value="google">{t("crm.leads.filters.googleOnly")}</option>
            <option value="website">{t("crm.leads.filters.websiteOnly")}</option>
            <option value="other">{t("crm.leads.filters.otherSources")}</option>
          </select>
          <input className="field" placeholder={t("crm.leads.drawer.campaign")} value={state.campaign} onChange={(event) => updateState({ campaign: event.target.value })} />
          <input className="field" placeholder={t("crm.leads.drawer.form")} value={state.formId} onChange={(event) => updateState({ formId: event.target.value })} />
          <select className="field" value={state.assignedTo} onChange={(event) => updateState({ assignedTo: event.target.value })}>
            <option value="all">{t("crm.common.all")}</option>
            <option value="unassigned">{t("crm.leads.unassignedAgent")}</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>{agent.name}</option>
            ))}
          </select>
          <input className="field" type="date" value={state.dateFrom} onChange={(event) => updateState({ dateFrom: event.target.value })} />
          <input className="field" type="date" value={state.dateTo} onChange={(event) => updateState({ dateTo: event.target.value })} />
          <button type="button" className="icon-btn" onClick={() => setState({ ...EMPTY_LEAD_LIST_STATE })}>
            {t("crm.workspace.clearFilters")}
          </button>
        </div>
      )}

      {showColumns && (
        <div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-3">
          {DEFAULT_COLUMNS.map((column) => (
            <label key={column} className="text-xs font-bold">
              <input
                type="checkbox"
                checked={state.visibleColumns.includes(column)}
                onChange={(event) => {
                  setState((prev) => ({
                    ...prev,
                    visibleColumns: event.target.checked
                      ? [...prev.visibleColumns, column]
                      : prev.visibleColumns.filter((item) => item !== column),
                  }));
                }}
              />{" "}
              {t(`crm.workspace.cols.${column}`, { defaultValue: column })}
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field max-w-[180px]"
          placeholder={t("crm.workspace.saveView")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const name = event.currentTarget.value.trim();
              if (!name) return;
              void createView(name, state, false).then((view) => setViews((prev) => [view, ...prev]));
              event.currentTarget.value = "";
            }
          }}
        />
        {views.map((view) => (
          <button
            key={view._id}
            type="button"
            className="icon-btn"
            onClick={() => setState({ ...EMPTY_LEAD_LIST_STATE, ...(view.state as LeadListState) })}
            onDoubleClick={() => void deleteView(view._id).then(() => setViews((prev) => prev.filter((item) => item._id !== view._id)))}
          >
            {view.name}
          </button>
        ))}
        <button
          type="button"
          className="icon-btn"
          onClick={() =>
            void fetchDuplicates().then((data) => {
              setDuplicates(data.groups || []);
              setShowDuplicates(true);
            })
          }
        >
          {t("crm.workspace.duplicates")}
        </button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs font-black">
          <span>{t("crm.workspace.selected", { count: selected.length })}</span>
          <select className="field" value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value)}>
            {["new", "contacted", "in_progress", "interested", "quote", "negotiation", "converted", "lost"].map((status) => (
              <option key={status} value={status}>{t(`crm.leads.statuses.${status}`, { defaultValue: status })}</option>
            ))}
          </select>
          <button type="button" className="icon-btn" onClick={() => void confirmBulk("status", { status: bulkStatus })}>
            {t("crm.workspace.applyStatus")}
          </button>
          <select className="field" value={bulkAgent} onChange={(event) => setBulkAgent(event.target.value)}>
            <option value="">{t("crm.leads.unassignedAgent")}</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>{agent.name}</option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            onClick={() =>
              void confirmBulk("assign", {
                assignedToUserId: bulkAgent,
                assignedToName: agents.find((agent) => agent._id === bulkAgent)?.name || "",
              })
            }
          >
            {t("crm.workspace.applyAgent")}
          </button>
          <button type="button" className="icon-btn" onClick={() => void confirmBulk("archive")}>
            <Archive className="h-4 w-4" /> {t("crm.workspace.archive")}
          </button>
          <button type="button" className="icon-btn text-rose-700" onClick={() => void confirmBulk("delete")}>
            <Trash2 className="h-4 w-4" /> {t("crm.common.delete")}
          </button>
        </div>
      )}

      {state.viewMode === "kanban" ? (
        <div className="grid gap-3 overflow-x-auto md:grid-cols-4 xl:grid-cols-8">
          {(funnel.length ? funnel : stages.map((stage) => ({ ...stage, count: 0, amount: 0 }))).map((column) => (
            <section key={column.key} className="min-w-[180px] rounded-xl border border-slate-200/80 bg-slate-50 p-2">
              <header className="mb-2 text-xs font-black">
                {column.label} · {column.count}
                {column.amount ? ` · ${column.amount}` : ""}
              </header>
              <div
                className="min-h-[120px] space-y-2"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const leadId = event.dataTransfer.getData("text/lead-id");
                  if (leadId) void moveCard(leadId, column.key);
                }}
              >
                {leads
                  .filter((lead) => (lead.stageKey || lead.status) === column.key)
                  .map((lead) => (
                    <article
                      key={lead._id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("text/lead-id", lead._id)}
                      onClick={() => {
                        setState((prev) => ({ ...prev, scrollTop: tableRef.current?.scrollTop || 0 }));
                        setOpenLeadId(lead._id);
                      }}
                      className="crm-kanban-card cursor-pointer text-xs font-bold"
                    >
                      <p className="line-clamp-1">{lead.fullName || lead.name}</p>
                      <p className="text-slate-400" dir="ltr">{lead.phone}</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-400">
                        {lead.assignedToName || t("crm.leads.unassignedAgent")} · {lead.source || "—"}
                      </p>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div
          ref={tableRef}
          className="overflow-auto rounded-2xl border border-slate-200 bg-white"
          onScroll={(event) => {
            const node = event.currentTarget;
            if (
              hasMore &&
              !loading &&
              !loadingMoreRef.current &&
              node.scrollTop + node.clientHeight >= node.scrollHeight - 80
            ) {
              loadingMoreRef.current = true;
              setState((prev) => ({ ...prev, page: prev.page + 1, scrollTop: node.scrollTop }));
            }
          }}
        >
          <table className={`w-full text-right ${state.viewMode === "compact" ? "text-[11px]" : "text-xs"}`}>
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.length > 0 && selected.length === leads.length}
                    onChange={(event) => setSelected(event.target.checked ? leads.map((lead) => lead._id) : [])}
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column}
                    className="cursor-pointer p-2 font-black"
                    style={{ width: state.columnWidths[column] }}
                    onClick={() => toggleSort(column)}
                  >
                    {t(`crm.workspace.cols.${column}`, { defaultValue: column })}
                    {state.sort === column ? (state.dir === "asc" ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && !leads.length ? (
                <tr>
                  <td className="p-4 font-bold text-slate-500" colSpan={visibleColumns.length + 1}>
                    <div className="h-8 animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ) : leads.length ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-2">
                      <input type="checkbox" checked={selected.includes(lead._id)} onChange={() => toggleSelect(lead._id)} />
                    </td>
                    {visibleColumns.map((column) => (
                      <td
                        key={column}
                        className="cursor-pointer p-2 font-semibold"
                        onClick={() => {
                          setState((prev) => ({ ...prev, scrollTop: tableRef.current?.scrollTop || 0 }));
                          setOpenLeadId(lead._id);
                        }}
                      >
                        {renderCell(lead, column, locale, t)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-6 font-bold text-slate-500" colSpan={visibleColumns.length + 1}>
                    {t("crm.leads.emptyTitle")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{t("crm.workspace.showing", { count: leads.length, total })}</span>
        <div className="flex gap-2">
          <button type="button" className="icon-btn" disabled={state.page <= 1} onClick={() => setState((prev) => ({ ...prev, page: prev.page - 1 }))}>
            {t("crm.common.back")}
          </button>
          <span>{state.page}</span>
          <button type="button" className="icon-btn" disabled={!hasMore} onClick={() => setState((prev) => ({ ...prev, page: prev.page + 1 }))}>
            {t("crm.workspace.next")}
          </button>
        </div>
      </div>

      {openLeadId && (
        <CRMLeadCard
          leadId={openLeadId}
          agents={agents}
          onClose={() => setOpenLeadId("")}
          onChanged={() => void load(true)}
        />
      )}

      {showDuplicates && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 p-4">
          <div className="mx-auto max-h-full max-w-3xl overflow-auto rounded-2xl bg-white p-4">
            <div className="mb-3 flex justify-between">
              <h3 className="text-lg font-black">{t("crm.workspace.duplicates")}</h3>
              <button type="button" onClick={() => setShowDuplicates(false)}>{t("crm.common.close")}</button>
            </div>
            {duplicates.map((group, index) => (
              <div key={index} className="mb-3 rounded-xl border p-3 text-sm">
                <p className="font-black">{group.matchType}: {group.key}</p>
                <div className="mt-2 space-y-1">
                  {(group.leads || []).map((lead: WorkspaceLead) => (
                    <p key={lead._id}>{lead.fullName || lead.name} · {lead.phone} · {lead.email}</p>
                  ))}
                </div>
                {(group.leadIds || []).length >= 2 && (
                  <button
                    type="button"
                    className="icon-btn mt-2"
                    onClick={() => {
                      if (!window.confirm(t("crm.workspace.confirmMerge"))) return;
                      void mergeLeads(group.leadIds[0], group.leadIds[1]).then(() => {
                        setNotice(t("crm.workspace.merged"));
                        void load();
                      });
                    }}
                  >
                    {t("crm.workspace.merge")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .icon-btn{display:inline-flex;align-items:center;gap:6px;height:36px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;padding:0 10px;font-size:12px;font-weight:800}
        .field{height:40px;border-radius:12px;border:1px solid #e2e8f0;padding:0 10px;font-size:12px;font-weight:700;background:#fff}
      `}</style>
    </div>
  );
}

function renderCell(lead: WorkspaceLead, column: string, locale: string, t: (key: string, opts?: any) => string) {
  switch (column) {
    case "name":
      return lead.fullName || lead.name || "";
    case "phone":
      return lead.phone ? <span dir="ltr">{lead.phone}</span> : "";
    case "email":
      return lead.email ? <span dir="ltr">{lead.email}</span> : "";
    case "status":
      return t(`crm.leads.statuses.${lead.status || "new"}`, { defaultValue: lead.status });
    case "source":
      return lead.source || "";
    case "campaign":
      return lead.campaignName || lead.campaignId || "";
    case "form":
      return lead.formName || lead.formId || "";
    case "assignedToName":
      return lead.assignedToName || t("crm.leads.unassignedAgent");
    case "createdAt":
      return lead.createdAt ? new Date(lead.createdAt).toLocaleString(locale) : "";
    case "updatedAt":
      return lead.updatedAt ? new Date(lead.updatedAt).toLocaleString(locale) : "";
    default:
      return "";
  }
}
