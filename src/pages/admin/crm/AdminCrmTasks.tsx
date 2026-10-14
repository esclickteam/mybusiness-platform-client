import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { TASK_STATUS_LABELS, formatIsraelDate } from "./adminCrmLabels";
import AdminDataTable from "../shell/AdminDataTable";
import AdminRowMenu from "../shell/AdminRowMenu";
import { AdminBadge, AdminEllipsis } from "../shell/adminCells";

export default function AdminCrmTasks() {
  const navigate = useNavigate();
  const [view, setView] = useState("open");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.tasks({ view });
      setTasks(data.tasks || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת המשימות נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [view]);

  async function complete(id: string) {
    try {
      await adminCrmApi.updateTask(id, { status: "done" });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "עדכון המשימה נכשל");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["open", "פתוחות"],
          ["overdue", "באיחור"],
          ["today", "היום"],
          ["upcoming", "קרובות"],
          ["completed", "הושלמו"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={view === key ? "biz-chip is-active" : "biz-chip"}
          >
            {label}
          </button>
        ))}
      </div>
      <AdminDataTable
        tableId="admin-crm-tasks"
        rows={tasks}
        rowKey={(task) => task._id}
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="אין משימות בתצוגה זו"
        resetKey={view}
        countLabel={`${tasks.length} משימות`}
        mobileTitle={(task) => task.title}
        mobileMeta={(task) => task.customer?.companyName || task.customer?.contactName || "ללא לקוח"}
        columns={[
          { key: "title", header: "משימה", render: (task) => <AdminEllipsis>{task.title}</AdminEllipsis> },
          {
            key: "customer",
            header: "לקוח",
            render: (task) => (
              <AdminEllipsis>{task.customer?.companyName || task.customer?.contactName || "ללא לקוח"}</AdminEllipsis>
            ),
          },
          {
            key: "due",
            header: "יעד",
            numeric: true,
            render: (task) => <span className="biz-nowrap">{formatIsraelDate(task.dueAt, true)}</span>,
          },
          {
            key: "status",
            header: "סטטוס",
            render: (task) => (
              <AdminBadge tone={task.status === "done" ? "success" : "warning"}>
                {TASK_STATUS_LABELS[task.status] || task.status}
              </AdminBadge>
            ),
          },
        ]}
        rowActions={(task) => (
          <div className="biz-row-actions">
            {task.adminCustomerId ? (
              <button
                type="button"
                className="biz-btn biz-btn-secondary biz-btn-row"
                onClick={() => navigate(`/admin/crm/customers/${task.adminCustomerId}`)}
              >
                ללקוח
              </button>
            ) : null}
            {task.status !== "done" ? (
              <AdminRowMenu
                items={[{ label: "סימון כהושלם", onClick: () => complete(task._id) }]}
              />
            ) : null}
          </div>
        )}
      />
    </div>
  );
}
