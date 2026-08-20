import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { TASK_STATUS_LABELS, formatIsraelDate, statusTone, Badge } from "./adminCrmLabels";
import { EmptyState, ErrorState, LoadingState, SecondaryButton } from "./AdminCrmUi";

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
            className={`min-h-11 rounded-2xl px-4 text-sm font-black ${view === key ? "bg-[#7C4DFF] text-white" : "bg-white border border-purple-100 text-slate-600"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {loading ? (
        <LoadingState />
      ) : tasks.length === 0 ? (
        <EmptyState title="אין משימות בתצוגה זו" />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <article key={task._id} className="rounded-[24px] border border-purple-100 bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-purple-950">{task.title}</h3>
                  <p className="text-sm font-bold text-slate-500">
                    {task.customer?.companyName || task.customer?.contactName || "ללא לקוח"} · יעד {formatIsraelDate(task.dueAt, true)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge tone={statusTone(task.status === "done" ? "active" : "pending")}>
                    {TASK_STATUS_LABELS[task.status] || task.status}
                  </Badge>
                  {task.adminCustomerId ? (
                    <SecondaryButton onClick={() => navigate(`/admin/crm/customers/${task.adminCustomerId}`)}>
                      ללקוח
                    </SecondaryButton>
                  ) : null}
                  {task.status !== "done" ? (
                    <SecondaryButton onClick={() => complete(task._id)}>סימון כהושלם</SecondaryButton>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
