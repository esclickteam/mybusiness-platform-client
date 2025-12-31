// components/CRM/TaskAlertsBanner.jsx
import React, { useMemo } from "react";
import "./TaskAlertsBanner.css";

export default function TaskAlertsBanner({ tasks = [] }) {
  const { overdueTasks, todayTasks } = useMemo(() => {
    const now = new Date();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const overdue = [];
    const todayList = [];

    tasks.forEach((task) => {
      if (!task.dueDate) return;
      if (task.status === "completed" || task.status === "cancelled") return;

      const time = task.dueTime || "23:59";
      const taskDateTime = new Date(`${task.dueDate}T${time}`);

      if (taskDateTime < now) {
        overdue.push(task);
      } else if (taskDateTime <= today) {
        todayList.push(task);
      }
    });

    return { overdueTasks: overdue, todayTasks: todayList };
  }, [tasks]);

  if (overdueTasks.length === 0 && todayTasks.length === 0) return null;

  return (
    <div className="task-alerts-banner">
      {overdueTasks.length > 0 && (
        <div className="alert-block alert-overdue">
          <strong>🚨 Overdue tasks</strong>
          <div className="alert-sub">
            {overdueTasks.length} task
            {overdueTasks.length > 1 ? "s are" : " is"} overdue
          </div>

          <ul>
            {overdueTasks.map((task) => (
              <li key={task._id}>
                {task.title}
                {task.dueTime && <span> · {task.dueTime}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {todayTasks.length > 0 && (
        <div className="alert-block alert-today">
          <strong>⏰ Due today</strong>
          <div className="alert-sub">
            {todayTasks.length} task
            {todayTasks.length > 1 ? "s" : ""} scheduled for today
          </div>

          <ul>
            {todayTasks.map((task) => (
              <li key={task._id}>
                {task.title}
                {task.dueTime && <span> · {task.dueTime}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
