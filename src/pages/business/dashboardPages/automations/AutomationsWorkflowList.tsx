import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  Copy,
  History,
  MoreHorizontal,
  Pause,
  PencilLine,
  Play,
  Trash2,
} from "lucide-react";
import type { AutomationWorkflow } from "../../../../api/automationWorkflowApi";
import {
  formatRelativeTime,
  getLastResultLabel,
  getStatusLabel,
  getTriggerLabel,
  getWorkflowStatus,
} from "./automationUiHelpers";

type Props = {
  workflows: AutomationWorkflow[];
  readOnly: boolean;
  writeBlockedTitle?: string;
  onDuplicate: (workflow: AutomationWorkflow) => void;
  onToggleLifecycle: (workflow: AutomationWorkflow) => void;
  onHistory: (workflow: AutomationWorkflow) => void;
  onDelete: (workflow: AutomationWorkflow) => void;
};

function RowActionsMenu({
  workflow,
  readOnly,
  writeBlockedTitle,
  onEdit,
  onDuplicate,
  onToggleLifecycle,
  onHistory,
  onDelete,
}: {
  workflow: AutomationWorkflow;
  readOnly: boolean;
  writeBlockedTitle?: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleLifecycle: () => void;
  onHistory: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const status = getWorkflowStatus(workflow);
  const canToggle = status === "active" || status === "paused";

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="ax-menu" ref={rootRef}>
      <button
        type="button"
        className="ax-menu__trigger"
        aria-label={t("automations.list.actionsAria", "Actions")}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open ? (
        <div className="ax-menu__panel" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <PencilLine size={14} />
            {t("automations.list.edit", "Edit")}
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={readOnly}
            title={writeBlockedTitle}
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
          >
            <Copy size={14} />
            {t("automations.list.duplicate", "Duplicate")}
          </button>
          {canToggle ? (
            <button
              type="button"
              role="menuitem"
              disabled={readOnly}
              title={writeBlockedTitle}
              onClick={() => {
                setOpen(false);
                onToggleLifecycle();
              }}
            >
              {status === "active" ? <Pause size={14} /> : <Play size={14} />}
              {status === "active"
                ? t("automations.toolbar.pause")
                : t("automations.toolbar.resume")}
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onHistory();
            }}
          >
            <History size={14} />
            {t("automations.layout.runs")}
          </button>
          <button
            type="button"
            role="menuitem"
            className="ax-menu__danger"
            disabled={readOnly}
            title={writeBlockedTitle}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 size={14} />
            {t("automations.list.delete", "Delete")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function AutomationsWorkflowList({
  workflows,
  readOnly,
  writeBlockedTitle,
  onDuplicate,
  onToggleLifecycle,
  onHistory,
  onDelete,
}: Props) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="ax-table-wrap">
        <table className="ax-table">
          <thead>
            <tr>
              <th>{t("automations.list.name", "Automation name")}</th>
              <th>{t("automations.runs.trigger")}</th>
              <th>{t("automations.runs.status")}</th>
              <th>{t("automations.list.lastRun", "Last run")}</th>
              <th>{t("automations.list.lastResult", "Last result")}</th>
              <th className="ax-table__actions-col">
                {t("automations.runs.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => {
              const status = getWorkflowStatus(workflow);
              const result = getLastResultLabel(workflow.lastExecution, t);
              const lastRunAt =
                workflow.lastExecution?.startedAt ||
                workflow.lastExecution?.completedAt ||
                workflow.lastRunAt;

              return (
                <tr
                  key={workflow._id}
                  className="ax-table__row"
                  onClick={() => navigate(workflow._id)}
                >
                  <td>
                    <Link
                      to={workflow._id}
                      className="ax-table__name"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {workflow.name ||
                        t("automations.list.unnamed", "Untitled automation")}
                    </Link>
                  </td>
                  <td className="ax-table__muted">{getTriggerLabel(workflow)}</td>
                  <td>
                    <span className={`ax-badge ax-badge--${status}`}>
                      {getStatusLabel(
                        status === "failed" ? "failed" : status,
                        t
                      )}
                    </span>
                  </td>
                  <td className="ax-table__muted">
                    {formatRelativeTime(lastRunAt, i18n.language)}
                  </td>
                  <td>
                    <span className={`ax-result ax-result--${result.tone}`}>
                      {result.tone === "success" ? "✓ " : ""}
                      {result.tone === "failed" ? "✕ " : ""}
                      {result.label}
                    </span>
                  </td>
                  <td
                    className="ax-table__actions-col"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <RowActionsMenu
                      workflow={workflow}
                      readOnly={readOnly}
                      writeBlockedTitle={writeBlockedTitle}
                      onEdit={() => navigate(workflow._id)}
                      onDuplicate={() => onDuplicate(workflow)}
                      onToggleLifecycle={() => onToggleLifecycle(workflow)}
                      onHistory={() => onHistory(workflow)}
                      onDelete={() => onDelete(workflow)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ax-mobile-list">
        {workflows.map((workflow) => {
          const status = getWorkflowStatus(workflow);
          const result = getLastResultLabel(workflow.lastExecution, t);
          const lastRunAt =
            workflow.lastExecution?.startedAt ||
            workflow.lastExecution?.completedAt ||
            workflow.lastRunAt;

          return (
            <article
              key={workflow._id}
              className="ax-mobile-card"
              onClick={() => navigate(workflow._id)}
            >
              <div className="ax-mobile-card__top">
                <div className="min-w-0">
                  <h3 className="ax-mobile-card__name">
                    {workflow.name ||
                      t("automations.list.unnamed", "Untitled automation")}
                  </h3>
                  <p className="ax-mobile-card__meta">
                    {getTriggerLabel(workflow)}
                  </p>
                </div>
                <div onClick={(event) => event.stopPropagation()}>
                  <RowActionsMenu
                    workflow={workflow}
                    readOnly={readOnly}
                    writeBlockedTitle={writeBlockedTitle}
                    onEdit={() => navigate(workflow._id)}
                    onDuplicate={() => onDuplicate(workflow)}
                    onToggleLifecycle={() => onToggleLifecycle(workflow)}
                    onHistory={() => onHistory(workflow)}
                    onDelete={() => onDelete(workflow)}
                  />
                </div>
              </div>
              <div className="ax-mobile-card__bottom">
                <span className={`ax-badge ax-badge--${status}`}>
                  {getStatusLabel(status, t)}
                </span>
                <span className="ax-mobile-card__meta">
                  {formatRelativeTime(lastRunAt, i18n.language)}
                </span>
                <span className={`ax-result ax-result--${result.tone}`}>
                  {result.label}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
