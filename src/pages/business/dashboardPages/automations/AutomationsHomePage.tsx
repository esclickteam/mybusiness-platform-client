import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { automationQueryKeys } from "./automationsQueryKeys";
import {
  AUTOMATION_BILLING_API_CODES,
  readAutomationBillingErrorCode,
  reactivateAutomationPlan,
} from "../../../../api/automationBillingApi";
import {
  WHATSAPP_BILLING_API_CODES,
  isWhatsAppBillingGateCode,
  readWhatsAppBillingErrorCode,
  reactivateWhatsAppBilling,
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
import WhatsAppUsageCard from "../whatsapp/billing/WhatsAppUsageCard";
import { useWhatsAppBilling } from "../whatsapp/billing/useWhatsAppBilling";
import WhatsAppCheckoutProcessing from "../whatsapp/billing/WhatsAppCheckoutProcessing";
import GuidedDemoSandboxButton from "../../../../guidedDemo/GuidedDemoSandboxButton";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

const STATUS_FILTER_VALUES: WorkflowStatusFilter[] = [
  "all",
  "active",
  "draft",
  "paused",
  "failed",
];

const SORT_VALUES: WorkflowSortKey[] = ["updated", "created", "name"];

export default function AutomationsHomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatusFilter>("all");
  const [sort, setSort] = useState<WorkflowSortKey>("updated");
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<"pick" | "manage">("pick");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [checkoutProcessingOpen, setCheckoutProcessingOpen] = useState(false);
  const [waBillingModalOpen, setWaBillingModalOpen] = useState(false);
  const [waBillingModalMode, setWaBillingModalMode] = useState<"setup" | "manage">(
    "setup"
  );
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
    loading: waBillingLoading,
    error: waBillingError,
    refresh: refreshWaBilling,
    setUsage: setWaBillingUsage,
  } = useWhatsAppBilling(businessId);

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

  const workflowsQuery = useQuery({
    queryKey: businessId
      ? automationQueryKeys.workflows(businessId)
      : ["automations", "workflows", "none"],
    enabled: Boolean(businessId),
    queryFn: async () => {
      if (!businessId) return [] as AutomationWorkflow[];
      return listAutomationWorkflows(businessId);
    },
    staleTime: 10_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const statsQuery = useQuery({
    queryKey: businessId
      ? automationQueryKeys.stats(businessId)
      : ["automations", "stats", "none"],
    enabled: Boolean(businessId),
    queryFn: async () => {
      if (!businessId) return null;
      return (await getAutomationStats(businessId)) || null;
    },
    staleTime: 10_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const workflows = workflowsQuery.data || [];
  const stats = statsQuery.data || null;
  const loading =
    Boolean(businessId) &&
    ((workflowsQuery.isLoading && !workflowsQuery.data) ||
      (statsQuery.isLoading && statsQuery.data === undefined));

  const load = useCallback(async () => {
    if (!businessId) return;
    try {
      await Promise.all([
        queryClient.fetchQuery({
          queryKey: automationQueryKeys.workflows(businessId),
          queryFn: () => listAutomationWorkflows(businessId),
        }),
        queryClient.fetchQuery({
          queryKey: automationQueryKeys.stats(businessId),
          queryFn: () => getAutomationStats(businessId),
        }),
      ]);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, t("automations.toasts.loadError")));
    }
  }, [businessId, queryClient]);

  useEffect(() => {
    if (workflowsQuery.isError) {
      toast.error(
        readAutomationErrorMessage(
          workflowsQuery.error,
          t("automations.toasts.loadError")
        )
      );
    }
  }, [workflowsQuery.isError, workflowsQuery.error]);

  useEffect(() => {
    const flag = searchParams.get("automationBilling");
    const waFlag =
      searchParams.get("waBilling") || searchParams.get("whatsappBilling");
    if (!flag && !waFlag) return;
    if (flag === "processing") {
      setCheckoutProcessingOpen(true);
    } else if (flag === "cancel") {
      toast.info(t("automations.toasts.checkoutCancel"));
    }
    if (waFlag === "processing") {
      setWaCheckoutProcessingOpen(true);
      toast.info(t("automations.toasts.waCheckoutProcessing"));
    } else if (waFlag === "cancel") {
      toast.info(t("automations.toasts.waCheckoutCancel"));
    }
    const next = new URLSearchParams(searchParams);
    next.delete("automationBilling");
    next.delete("waBilling");
    next.delete("whatsappBilling");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const openWaBillingModal = (mode: "setup" | "manage") => {
    setWaBillingModalMode(mode);
    setWaBillingModalOpen(true);
  };

  const handleWaReactivate = async () => {
    if (!businessId) return;
    try {
      await reactivateWhatsAppBilling(businessId);
      toast.success(t("automations.toasts.waReactivated"));
      await refreshWaBilling();
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(error, t("automations.toasts.waReactivateError"))
      );
    }
  };

  const openPlanModal = (mode: "pick" | "manage") => {
    setPlanModalMode(mode);
    setPlanModalOpen(true);
  };

  const handleReactivate = async () => {
    if (!businessId) return;
    try {
      await reactivateAutomationPlan(businessId);
      toast.success(t("automations.toasts.planReactivated"));
      await refreshBilling();
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(error, t("automations.toasts.planReactivateError"))
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
      toast.success(t("automations.toasts.duplicated"));
      navigate(copy._id);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, t("automations.toasts.duplicateError")));
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
      queryClient.setQueryData<AutomationWorkflow[]>(
        automationQueryKeys.workflows(businessId),
        (prev) =>
          (prev || []).map((item) => (item._id === saved._id ? saved : item))
      );
      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.stats(businessId),
        refetchType: "active",
      });
      toast.success(t("automations.toasts.statusUpdated"));
    } catch (error: unknown) {
      const waCode = readWhatsAppBillingErrorCode(error);
      if (isWhatsAppBillingGateCode(waCode)) {
        if (waCode === WHATSAPP_BILLING_API_CODES.SETUP_REQUIRED) {
          toast.error(
            t("automations.toasts.waBillingRequired")
          );
        } else {
          toast.error(
            readAutomationErrorMessage(
              error,
              t("automations.toasts.waBillingBlock")
            )
          );
        }
        openWaBillingModal("setup");
        void refreshWaBilling();
        return;
      }
      const code = readAutomationBillingErrorCode(error);
      if (code === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED) {
        toast.error(t("automations.toasts.planRequired"));
        openPlanModal("pick");
        return;
      }
      if (
        code === AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED ||
        code === AUTOMATION_BILLING_API_CODES.ACTION_QUOTA_EXHAUSTED
      ) {
        // Soft warning — action quota must not block enable/resume of workflows.
        toast.error(
          t("automations.toasts.quotaExhausted")
        );
        openPlanModal("manage");
        return;
      }
      if (code === AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED) {
        toast.error(
          readAutomationErrorMessage(error, t("automations.toasts.updateBlocked"))
        );
        openPlanModal("manage");
        return;
      }
      toast.error(
        readAutomationErrorMessage(error, t("automations.toasts.updateBlocked"))
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
    const name = String(workflow.name || t("automations.home.fallbackName")).trim() || t("automations.home.fallbackName");
    const statusHint =
      workflow.status === "active"
        ? t("automations.home.deleteActiveHint")
        : workflow.status === "paused"
          ? t("automations.home.deletePausedHint")
          : "";
    if (
      !window.confirm(
        `${statusHint}${t("automations.home.deleteConfirm", { name })}`
      )
    ) {
      return;
    }
    try {
      await deleteAutomationWorkflow(businessId, workflow._id);
      queryClient.setQueryData<AutomationWorkflow[]>(
        automationQueryKeys.workflows(businessId),
        (prev) => (prev || []).filter((item) => item._id !== workflow._id)
      );
      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.stats(businessId),
        refetchType: "active",
      });
      toast.success(t("automations.toasts.deleted"));
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, t("automations.toasts.deleteError")));
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
          <h1 className="ax-home__title">{t("automations.home.title")}</h1>
          <p className="ax-home__subtitle">
            {t("automations.home.subtitle")}
          </p>
        </div>
        <div className="ax-home__actions">
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={openCreateModal}
            data-demo-target="automations-new"
            disabled={!businessId || readOnly}
            title={writeBlockedTitle}
          >
            <Plus size={15} />
            {t("automations.home.new")}
          </button>
          <Link to="templates" className="ax-btn ax-btn--secondary">
            {t("automations.home.templates")}
          </Link>
          <GuidedDemoSandboxButton target="automations-demo-trigger">
            {t("automations.home.runDemoTrigger")}
          </GuidedDemoSandboxButton>
        </div>
      </header>

      {stats ? (
        <div className="ax-kpi-row">
          <div className="ax-kpi">
            <strong>{stats.total}</strong>
            <span>{t("automations.home.kpiTotal")}</span>
          </div>
          <div className="ax-kpi">
            <strong>{stats.active}</strong>
            <span>{t("automations.home.kpiActive")}</span>
          </div>
          <div className="ax-kpi">
            <strong>{stats.runsLast30Days}</strong>
            <span>{t("automations.home.kpiRuns")}</span>
          </div>
          <div className="ax-kpi">
            <strong>{stats.failedLast30Days}</strong>
            <span>{t("automations.home.kpiFailed")}</span>
          </div>
        </div>
      ) : null}

      {businessId ? (
        <section className="ax-billing-stack" aria-label={t("automations.home.billingAria")}>
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
          <WhatsAppUsageCard
            businessId={businessId}
            usage={waBillingUsage}
            loading={waBillingLoading}
            error={waBillingError}
            onRetry={() => void refreshWaBilling()}
            onOpenSetup={() => openWaBillingModal("setup")}
            onOpenManage={() => openWaBillingModal("manage")}
            onReactivate={() => void handleWaReactivate()}
          />
        </section>
      ) : null}

      <div className="ax-toolbar">
        <label className="ax-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("automations.home.searchPlaceholder")}
          />
        </label>
        <div className="ax-filters">
          {STATUS_FILTER_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              className={`ax-chip${
                statusFilter === value ? " ax-chip--active" : ""
              }`}
              onClick={() => setStatusFilter(value)}
            >
              {t(
                value === "all"
                  ? "automations.home.filterAll"
                  : value === "active"
                    ? "automations.home.filterActive"
                    : value === "draft"
                      ? "automations.home.filterDraft"
                      : value === "paused"
                        ? "automations.home.filterPaused"
                        : "automations.home.filterFailed"
              )}
            </button>
          ))}
        </div>
        <label className="ax-sort">
          <span>{t("automations.home.sort")}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as WorkflowSortKey)}
          >
            {SORT_VALUES.map((value) => (
              <option key={value} value={value}>
                {t(
                  value === "updated"
                    ? "automations.home.sortUpdated"
                    : value === "created"
                      ? "automations.home.sortCreated"
                      : "automations.home.sortName"
                )}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          {t("automations.home.loading")}
        </div>
      ) : showEmpty ? (
        <div className="ax-empty ax-empty--card">
          <Workflow className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <strong>{t("automations.home.emptyTitle")}</strong>
          <p>{t("automations.home.emptyText")}</p>
          <div className="ax-empty__actions">
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={openCreateModal}
              data-demo-target="automations-new"
              disabled={!businessId || readOnly}
              title={writeBlockedTitle}
            >
              <Plus size={15} />
              {t("automations.home.new")}
            </button>
            <Link to="templates" className="ax-btn ax-btn--secondary">
              {t("automations.home.browseTemplates")}
            </Link>
          </div>
        </div>
      ) : visibleWorkflows.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>{t("automations.home.noneFoundTitle")}</strong>
          <p>{t("automations.home.noneFoundText")}</p>
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
            initialMode={waBillingModalMode}
            returnTo="automations"
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
