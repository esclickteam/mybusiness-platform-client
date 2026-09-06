import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Search, Sparkles, ExternalLink } from "lucide-react";
import {
  AI_TEMPLATE_LABELS,
  listAiAutomationResults,
  type AiAutomationResult,
} from "../../../../api/aiAutomationResultsApi";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

const FILTERS = [
  { key: "all", labelKey: "automations.common.all", fallback: "All" },
  { key: "leads", labelKey: "automations.aiResults.filterLeads", fallback: "Leads" },
  { key: "drafts", labelKey: "automations.aiResults.filterDrafts", fallback: "Drafts" },
  { key: "digests", labelKey: "automations.aiResults.filterDigests", fallback: "Digests" },
  { key: "tasks", labelKey: "automations.aiResults.filterTasks", fallback: "Tasks" },
] as const;

function formatWhen(value: string | undefined, locale: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function categoryLabel(
  cat: string | undefined,
  t: (key: string, defaultValue?: string) => string
) {
  switch (cat) {
    case "leads":
      return t("automations.aiResults.filterLeads", "Leads");
    case "drafts":
      return t("automations.aiResults.filterDrafts", "Drafts");
    case "digests":
      return t("automations.aiResults.filterDigests", "Digests");
    case "tasks":
      return t("automations.aiResults.filterTasks", "Tasks");
    default:
      return cat || "";
  }
}

export default function AutomationsAiResultsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const q = searchParams.get("q") || "";
  const resultId = searchParams.get("resultId") || "";
  const [localQ, setLocalQ] = useState(q);

  const query = useQuery({
    queryKey: ["automations", "ai-results", businessId, filter, q],
    enabled: Boolean(businessId),
    queryFn: () =>
      listAiAutomationResults(String(businessId), {
        filter,
        q,
        limit: 50,
      }),
  });

  const selected = useMemo(() => {
    const items = query.data?.items || [];
    if (!resultId) return null;
    return items.find((row) => String(row._id) === String(resultId)) || null;
  }, [query.data?.items, resultId]);

  const openResult = (row: AiAutomationResult) => {
    if (row.targetUrl) {
      navigate(row.targetUrl);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.set("resultId", row._id);
    setSearchParams(next);
  };

  if (!businessId) {
    return <div className="auto-page">{t("automations.common.loading")}</div>;
  }

  return (
    <div className="auto-page ai-results-page" dir={getTextDirection(i18n.language)}>
      <header className="ai-results-header">
        <div>
          <h1>
            <Sparkles size={20} /> {t("automations.layout.aiResults")}
          </h1>
          <p>
            {t(
              "automations.aiResults.subtitle",
              "AI automation result history for the business — kept even after notifications are deleted."
            )}
          </p>
        </div>
        <button
          type="button"
          className="auto-btn ghost"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          {query.isFetching ? <Loader2 className="spin" size={16} /> : <RefreshCw size={16} />}
          {t("automations.runs.refresh")}
        </button>
      </header>

      <div className="ai-results-toolbar">
        <div className="ai-results-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={filter === f.key ? "active" : ""}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                if (f.key === "all") next.delete("filter");
                else next.set("filter", f.key);
                setSearchParams(next);
              }}
            >
              {t(f.labelKey, f.fallback)}
            </button>
          ))}
        </div>
        <form
          className="ai-results-search"
          onSubmit={(e) => {
            e.preventDefault();
            const next = new URLSearchParams(searchParams);
            if (localQ.trim()) next.set("q", localQ.trim());
            else next.delete("q");
            setSearchParams(next);
          }}
        >
          <Search size={16} />
          <input
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder={t(
              "automations.aiResults.searchPlaceholder",
              "Search by lead, template, or text"
            )}
          />
        </form>
      </div>

      {query.isLoading ? (
        <div className="ai-results-empty">
          <Loader2 className="spin" size={20} />{" "}
          {t("automations.aiResults.loading", "Loading results...")}
        </div>
      ) : !(query.data?.items || []).length ? (
        <div className="ai-results-empty">
          {t("automations.aiResults.empty", "No AI results to show yet.")}
        </div>
      ) : (
        <div className="ai-results-list">
          {(query.data?.items || []).map((row) => (
            <article key={row._id} className="ai-results-row">
              <div className="ai-results-row-main">
                <div className="ai-results-row-title">
                  <strong>{AI_TEMPLATE_LABELS[row.templateKey] || row.title}</strong>
                  <span>{categoryLabel(row.resultCategory, t)}</span>
                  <span className={`status ${row.status}`}>
                    {row.status === "completed"
                      ? t("automations.aiResults.completed", "Completed")
                      : row.status}
                  </span>
                </div>
                <div className="ai-results-row-meta">
                  <span>{formatWhen(row.generatedAt || row.createdAt, i18n.language)}</span>
                  {row.leadName ? (
                    <span>
                      {t("automations.aiResults.lead", {
                        name: row.leadName,
                        defaultValue: "Lead: {{name}}",
                      })}
                    </span>
                  ) : null}
                  {row.taskId ? (
                    <span>{t("automations.aiResults.linkedTask", "Linked task")}</span>
                  ) : null}
                </div>
                <p className="ai-results-preview">{row.preview || row.summary || ""}</p>
              </div>
              <button type="button" className="auto-btn primary" onClick={() => openResult(row)}>
                {t("automations.runs.open")} <ExternalLink size={14} />
              </button>
            </article>
          ))}
        </div>
      )}

      {selected ? (
        <aside className="ai-results-drawer">
          <header>
            <h2>{AI_TEMPLATE_LABELS[selected.templateKey] || selected.title}</h2>
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete("resultId");
                setSearchParams(next);
              }}
            >
              {t("automations.common.close")}
            </button>
          </header>
          <p className="ai-results-drawer-meta">
            {formatWhen(selected.generatedAt || selected.createdAt, i18n.language)}
          </p>
          <pre className="ai-results-drawer-body">{selected.summary || selected.preview || ""}</pre>
          {selected.targetUrl ? (
            <button type="button" className="auto-btn primary" onClick={() => navigate(selected.targetUrl!)}>
              {t("automations.aiResults.openTarget", "Open target")}
            </button>
          ) : null}
        </aside>
      ) : null}

      <style>{`
        .ai-results-page { padding: 20px 24px 40px; }
        .ai-results-header { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:18px; }
        .ai-results-header h1 { display:flex; align-items:center; gap:8px; margin:0 0 6px; font-size:1.35rem; }
        .ai-results-header p { margin:0; color:#5b6472; }
        .ai-results-toolbar { display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; margin-bottom:16px; }
        .ai-results-filters { display:flex; flex-wrap:wrap; gap:8px; }
        .ai-results-filters button { border:1px solid #d7dde7; background:#fff; border-radius:999px; padding:6px 12px; cursor:pointer; }
        .ai-results-filters button.active { background:#111827; color:#fff; border-color:#111827; }
        .ai-results-search { display:flex; align-items:center; gap:8px; border:1px solid #d7dde7; border-radius:10px; padding:8px 12px; min-width:min(360px,100%); background:#fff; }
        .ai-results-search input { border:0; outline:none; width:100%; background:transparent; }
        .ai-results-list { display:flex; flex-direction:column; gap:10px; }
        .ai-results-row { display:flex; justify-content:space-between; gap:16px; align-items:center; border:1px solid #e5e9f0; border-radius:12px; padding:14px 16px; background:#fff; }
        .ai-results-row-title { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:4px; }
        .ai-results-row-title span { font-size:12px; color:#667085; background:#f3f5f8; border-radius:999px; padding:2px 8px; }
        .ai-results-row-title .status.completed { background:#ecfdf3; color:#027a48; }
        .ai-results-row-meta { display:flex; flex-wrap:wrap; gap:10px; color:#667085; font-size:12px; margin-bottom:6px; }
        .ai-results-preview { margin:0; color:#344054; white-space:pre-wrap; max-height:4.5em; overflow:hidden; }
        .ai-results-empty { padding:40px 12px; text-align:center; color:#667085; }
        .ai-results-drawer { position:fixed; inset-inline-end:0; top:0; bottom:0; width:min(420px,100%); background:#fff; border-inline-start:1px solid #e5e9f0; padding:20px; box-shadow:-8px 0 24px rgba(16,24,40,.08); z-index:40; overflow:auto; }
        .ai-results-drawer header { display:flex; justify-content:space-between; gap:12px; align-items:center; }
        .ai-results-drawer-body { white-space:pre-wrap; background:#f8fafc; border-radius:10px; padding:12px; border:1px solid #eef2f6; font-family:inherit; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 720px) {
          .ai-results-row { flex-direction:column; align-items:stretch; }
        }
      `}</style>
    </div>
  );
}
