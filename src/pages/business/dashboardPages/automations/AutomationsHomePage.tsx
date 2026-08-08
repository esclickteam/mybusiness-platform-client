import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Plus, Search, Workflow } from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  deleteAutomationWorkflow,
  duplicateAutomationWorkflow,
  isAutomationsReadOnly,
  listAutomationWorkflows,
  getAutomationStats,
  pauseAutomationWorkflow,
  resumeAutomationWorkflow,
  type AutomationStats,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import AutomationsWorkflowList from "./AutomationsWorkflowList";
import {
  matchesStatusFilter,
  readAutomationErrorMessage,
  sortWorkflows,
  type WorkflowSortKey,
  type WorkflowStatusFilter,
} from "./automationUiHelpers";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

const STATUS_FILTERS: Array<{ value: WorkflowStatusFilter; label: string }> = [
  { value: "all", label: "הכל" },
  { value: "active", label: "פעילות" },
  { value: "draft", label: "טיוטות" },
  { value: "paused", label: "מושהות" },
  { value: "failed", label: "שגיאות" },
];

const SORT_OPTIONS: Array<{ value: WorkflowSortKey; label: string }> = [
  { value: "updated", label: "עודכן לאחרונה" },
  { value: "created", label: "נוצר לאחרונה" },
  { value: "name", label: "שם" },
];

export default function AutomationsHomePage() {
  const navigate = useNavigate();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatusFilter>("all");
  const [sort, setSort] = useState<WorkflowSortKey>("updated");

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [list, statsResult] = await Promise.all([
        listAutomationWorkflows(businessId),
        getAutomationStats(businessId),
      ]);
      setWorkflows(list);
      setStats(statsResult || null);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה בטעינת האוטומציות"));
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleWorkflows = useMemo(() => {
    const filtered = workflows.filter((workflow) => {
      const haystack =
        `${workflow.name} ${workflow.description || ""}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesQuery && matchesStatusFilter(workflow, statusFilter);
    });
    return sortWorkflows(filtered, sort);
  }, [query, sort, statusFilter, workflows]);

  const handleCreate = async () => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setCreating(true);
    try {
      const created = await createAutomationWorkflow(businessId, {
        useStarter: true,
        name: "אוטומציה חדשה",
      });
      toast.success("האוטומציה מוכנה לעריכה על הבד");
      navigate(created._id);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (workflow: AutomationWorkflow) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    try {
      const copy = await duplicateAutomationWorkflow(businessId, workflow._id);
      toast.success("האוטומציה שוכפלה");
      navigate(copy._id);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה בשכפול"));
    }
  };

  const handleToggleLifecycle = async (workflow: AutomationWorkflow) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    try {
      const status = workflow.status || (workflow.enabled ? "active" : "draft");
      const saved =
        status === "active"
          ? await pauseAutomationWorkflow(businessId, workflow._id)
          : await resumeAutomationWorkflow(businessId, workflow._id);
      setWorkflows((prev) =>
        prev.map((item) => (item._id === saved._id ? saved : item))
      );
      toast.success("סטטוס האוטומציה עודכן");
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(error, "לא ניתן לעדכן את האוטומציה")
      );
    }
  };

  const openHistory = (workflow: AutomationWorkflow) => {
    navigate(`runs?workflow=${encodeURIComponent(workflow._id)}`);
  };

  const handleDelete = async (workflow: AutomationWorkflow) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    const name = String(workflow.name || "האוטומציה").trim() || "האוטומציה";
    const statusHint =
      workflow.status === "active"
        ? "האוטומציה פעילה ותיפסק מיד. "
        : workflow.status === "paused"
          ? "האוטומציה מושהית. "
          : "";
    if (
      !window.confirm(
        `${statusHint}למחוק לצמיתות את "${name}"? הפעולה כוללת גם את היסטוריית ההרצות ולא ניתן לשחזר.`
      )
    ) {
      return;
    }
    try {
      await deleteAutomationWorkflow(businessId, workflow._id);
      setWorkflows((prev) => prev.filter((item) => item._id !== workflow._id));
      toast.success("האוטומציה נמחקה");
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה במחיקה"));
    }
  };

  const showEmpty =
    !loading &&
    workflows.length === 0 &&
    !query.trim() &&
    statusFilter === "all";

  return (
    <div className="ax-home">
      <header className="ax-home__header">
        <div className="min-w-0">
          <h1 className="ax-home__title">אוטומציות</h1>
          <p className="ax-home__subtitle">
            בנה ונהל תהליכים אוטומטיים לעסק
          </p>
        </div>
        <div className="ax-home__actions">
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={() => void handleCreate()}
            disabled={!businessId || creating || readOnly}
            title={writeBlockedTitle}
          >
            {creating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}
            אוטומציה חדשה
          </button>
          <Link to="templates" className="ax-btn ax-btn--secondary">
            תבניות
          </Link>
        </div>
      </header>

      {stats ? (
        <div className="ax-kpi-row">
          <div className="ax-kpi">
            <strong>{stats.total}</strong>
            <span>סה״כ אוטומציות</span>
          </div>
          <div className="ax-kpi">
            <strong>{stats.active}</strong>
            <span>פעילות</span>
          </div>
          <div className="ax-kpi">
            <strong>{stats.runsLast30Days}</strong>
            <span>הרצות ב־30 יום</span>
          </div>
          <div className="ax-kpi">
            <strong>{stats.failedLast30Days}</strong>
            <span>נכשלו</span>
          </div>
        </div>
      ) : null}

      <div className="ax-toolbar">
        <label className="ax-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חיפוש אוטומציה"
          />
        </label>
        <div className="ax-filters">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`ax-chip${
                statusFilter === item.value ? " ax-chip--active" : ""
              }`}
              onClick={() => setStatusFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="ax-sort">
          <span>מיון</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as WorkflowSortKey)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען אוטומציות...
        </div>
      ) : showEmpty ? (
        <div className="ax-empty ax-empty--card">
          <Workflow className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <strong>עדיין אין אוטומציות</strong>
          <p>צור את האוטומציה הראשונה שלך וחסוך פעולות ידניות.</p>
          <div className="ax-empty__actions">
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => void handleCreate()}
              disabled={!businessId || creating || readOnly}
              title={writeBlockedTitle}
            >
              <Plus size={15} />
              אוטומציה חדשה
            </button>
            <Link to="templates" className="ax-btn ax-btn--secondary">
              עיון בתבניות
            </Link>
          </div>
        </div>
      ) : visibleWorkflows.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>לא נמצאו אוטומציות</strong>
          <p>נסו לשנות את החיפוש או הסינון.</p>
        </div>
      ) : (
        <AutomationsWorkflowList
          workflows={visibleWorkflows}
          readOnly={readOnly}
          writeBlockedTitle={writeBlockedTitle}
          onDuplicate={(workflow) => void handleDuplicate(workflow)}
          onToggleLifecycle={(workflow) => void handleToggleLifecycle(workflow)}
          onHistory={(workflow) => openHistory(workflow)}
          onDelete={(workflow) => void handleDelete(workflow)}
        />
      )}
    </div>
  );
}
