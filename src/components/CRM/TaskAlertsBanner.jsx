// components/CRM/TaskAlertsBanner.jsx
import React, { useMemo } from "react";

export default function TaskAlertsBanner({ tasks }) {
  const overdueTasks = useMemo(() => {
    const now = new Date();

    return tasks.filter((task) => {
      if (!task.dueDate || !task.dueTime) return false;

      const taskTime = new Date(`${task.dueDate}T${task.dueTime}`);
      return taskTime <= now && task.status !== "completed";
    });
  }, [tasks]);

  if (overdueTasks.length === 0) return null;

  return (
    <div className="overdue-banner">
      <strong>🔔 Attention</strong>
      <div className="overdue-sub">
        You have {overdueTasks.length} overdue task
        {overdueTasks.length > 1 ? "s" : ""}
      </div>

      <ul className="overdue-list">
        {overdueTasks.map((task) => (
          <li key={task._id}>
            {task.title}
            {task.dueTime && ` – ${task.dueTime}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
