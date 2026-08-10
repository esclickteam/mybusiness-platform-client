import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Plus, Search, Workflow } from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
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
import {
  AUTOMATION_BILLING_API_CODES,
  readAutomationBillingErrorCode,
  reactivateAutomationPlan,
} from "../../../../api/automationBillingApi";
import {
  WHATSAPP_BILLING_API_CODES,
  isWhatsAppBillingGateCode,
  readWhatsAppBillingErrorCode,
} from "../../../../api/whatsappBillingApi";
import AutomationsWorkflowList from "./AutomationsWorkflowList";
import CreateAutomationModal from "./CreateAutomationModal";
import {
  matchesStatusFilter,
  readAutomationErrorMessage,
  sortWorkflows,
  type WorkflowSortKey,
  type WorkflowStatusFilter,
} from "./automationUiHelpers";
import AutomationUsageCard from "./billing/AutomationUsageCard";
import AutomationPlanModal from "./billing/AutomationPlanModal";
import AutomationCancelConfirmModal from "./billing/AutomationCancelConfirmModal";
import AutomationCheckoutProcessing from "./billing/AutomationCheckoutProcessing";
import { useAutomationBilling } from "./billing/useAutomationBilling";
import WhatsAppBillingSetupModal from "../whatsapp/billing/WhatsAppBillingSetupModal";
import { useWhatsAppBilling } from "../whatsapp/billing/useWhatsAppBilling";
import WhatsAppCheckoutProcessing from "../whatsapp/billing/WhatsAppCheckoutProcessing";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatusFilter>("all");
  const [sort, setSort] = useState<WorkflowSortKey>("updated");
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<"pick" | "manage">("pick");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [checkoutProcessingOpen, setCheckoutProcessingOpen] = useState(false);
  const [waBillingModalOpen, setWaBillingModalOpen] = useState(false);
  const [waCheckoutProcessingOpen, setWaCheckoutProcessingOpen] =
    useState(false);

  const {
    usage: billingUsage,
    loading: billingLoading,
    error: billingError,
    refresh: refreshBilling,
    setUsage: setBillingUsage,
  } = useAutomationBilling(businessId);

  const {
    usage: waBillingUsage,
    refresh: refreshWaBilling,
    setUsage: setWaBillingUsage,
  } = useWhatsAppBilling(businessId);

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

  useEffect(() => {
    const flag = searchParams.get("automationBilling");
    const waFlag =
      searchParams.get("waBilling") || searchParams.get("whatsappBilling");
    if (!flag && !waFlag) return;
    if (flag === "processing") {
      setCheckoutProcessingOpen(true);
    } else if (flag === "cancel") {
      toast.info("התשלום בוטל — ניתן לבחור חבילה מחדש בכל עת.");
    }
    if (waFlag === "processing") {
      setWaCheckoutProcessingOpen(true);
      toast.info("מעדכנים את חיוב WhatsApp...");
    } else if (waFlag === "cancel") {
      toast.info("הגדרת חיוב WhatsApp בוטלה — ניתן להגדיר מחדש בכל עת.");
    }
    const next = new URLSearchParams(searchParams);
    next.delete("automationBilling");
    next.delete("waBilling");
    next.delete("whatsappBilling");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const openPlanModal = (mode: "pick" | "manage") => {
    setPlanModalMode(mode);
    setPlanModalOpen(true);
  };

  const handleReactivate = async () => {
    if (!businessId) return;
    try {
      await reactivateAutomationPlan(businessId);
      toast.success("הביטול בוטל והחבילה תמשיך כרגיל.");
      await refreshBilling();
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(error, "לא הצלחנו להשאיר את החבילה פעילה")
      );
    }
  };

  const visibleWorkflows = useMemo(() => {
    const filtered = workflows.filter((workflow) => {
      const haystack =
        `${workflow.name} ${workflow.description || ""}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesQuery && matchesStatusFilter(workflow, statusFilter);
    });
    return sortWorkflows(filtered, sort);
  }, [query, sort, statusFilter, workflows]);

  const openCreateModal = () => {
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setShowCreateModal(true);
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
      const waCode = readWhatsAppBillingErrorCode(error);
      if (isWhatsAppBillingGateCode(waCode)) {
        if (waCode === WHATSAPP_BILLING_API_CODES.SETUP_REQUIRED) {
          toast.error(
            "נדרש חיוב WhatsApp — האוטומציה כוללת שליחת הודעות WhatsApp בעלות של 0.20 ₪ להודעה. יש להגדיר אמצעי תשלום לפני ההפעלה."
          );
        } else {
          toast.error(
            readAutomationErrorMessage(
              error,
              "לא ניתן לעדכן את האוטומציה עקב חיוב WhatsApp"
            )
          );
        }
        setWaBillingModalOpen(true);
        void refreshWaBilling();
        return;
      }
      const code = readAutomationBillingErrorCode(error);
      if (code === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED) {
        toast.error("כדי להפעיל אוטומציה יש לבחור חבילת פעולות");
        openPlanModal("pick");
        return;
      }
      if (
        code === AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED ||
        code === AUTOMATION_BILLING_API_CODES.ACTION_QUOTA_EXHAUSTED
      ) {
        // Soft warning — action quota must not block enable/resume of workflows.
        toast.error(
          "מכסת הפעולות החודשית נוצלה — פעולות מחויבות ייחסמו עד לשדרוג"
        );
        openPlanModal("manage");
        return;
      }
      if (code === AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED) {
        toast.error(
          readAutomationErrorMessage(error, "לא ניתן לעדכן את האוטומציה")
        );
        openPlanModal("manage");
        return;
      }
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
            onClick={openCreateModal}
            disabled={!businessId || readOnly}
            title={writeBlockedTitle}
          >
            <Plus size={15} />
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

      {businessId ? (
        <AutomationUsageCard
          businessId={businessId}
          usage={billingUsage}
          loading={billingLoading}
          error={billingError}
          onRetry={() => void refreshBilling()}
          onOpenPlans={(reason) =>
            openPlanModal(reason === "manage" ? "manage" : "pick")
          }
          onOpenManage={() => openPlanModal("manage")}
          onReactivate={() => void handleReactivate()}
        />
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
              onClick={openCreateModal}
              disabled={!businessId || readOnly}
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

      <CreateAutomationModal
        open={showCreateModal}
        businessId={businessId}
        readOnly={readOnly}
        onClose={() => setShowCreateModal(false)}
      />

      {businessId ? (
        <>
          <AutomationPlanModal
            open={planModalOpen}
            businessId={businessId}
            usage={billingUsage}
            initialMode={planModalMode}
            onClose={() => setPlanModalOpen(false)}
            onUsageUpdated={async () => { await refreshBilling(); }}
            onOpenCancel={() => {
              setPlanModalOpen(false);
              setCancelModalOpen(true);
            }}
          />
          <AutomationCancelConfirmModal
            open={cancelModalOpen}
            businessId={businessId}
            usage={billingUsage}
            onClose={() => setCancelModalOpen(false)}
            onCancelled={() => {
              setCancelModalOpen(false);
              void refreshBilling();
            }}
          />
          <AutomationCheckoutProcessing
            open={checkoutProcessingOpen}
            businessId={businessId}
            onDone={(usage) => {
              setBillingUsage(usage);
              setCheckoutProcessingOpen(false);
              void refreshBilling();
            }}
            onClose={() => setCheckoutProcessingOpen(false)}
          />
          <WhatsAppBillingSetupModal
            open={waBillingModalOpen}
            businessId={businessId}
            usage={waBillingUsage}
            initialMode="setup"
            onClose={() => setWaBillingModalOpen(false)}
            onUsageUpdated={async () => {
              await refreshWaBilling();
            }}
          />
          <WhatsAppCheckoutProcessing
            open={waCheckoutProcessingOpen}
            businessId={businessId}
            onDone={(usage) => {
              setWaBillingUsage(usage);
              setWaCheckoutProcessingOpen(false);
              void refreshWaBilling();
            }}
            onClose={() => setWaCheckoutProcessingOpen(false)}
          />
        </>
      ) : null}
    </div>
  );
}
