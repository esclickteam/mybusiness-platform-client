import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  FileText,
  Flag,
  Plus,
  StickyNote,
  Trash2,
  XCircle,
} from "lucide-react";
import API from "@api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

type NoteItem = {
  _id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

type TaskStatus =
  | "todo"
  | "in_progress"
  | "waiting"
  | "completed"
  | "cancelled";

type TaskPriority = "low" | "normal" | "high" | "critical";

type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string | Date;
  status: TaskStatus;
  priority: TaskPriority;
  reminderMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
};

type NewTaskState = {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  priority: TaskPriority;
  reminderMinutes: number;
};

type ClientTasksAndNotesProps = {
  clientId?: string;
  businessId?: string;
};

type LabelConfig = {
  text: string;
  className: string;
};

const emptyTask: NewTaskState = {
  title: "",
  description: "",
  dueDate: "",
  dueTime: "",
  status: "todo",
  priority: "normal",
  reminderMinutes: 30,
};

const statusLabels: Record<TaskStatus, LabelConfig> = {
  todo: {
    text: "To Do",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  in_progress: {
    text: "In Progress",
    className: "bg-violet-50 text-violet-700 border-violet-100",
  },
  waiting: {
    text: "Waiting",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  completed: {
    text: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  cancelled: {
    text: "Cancelled",
    className: "bg-rose-50 text-rose-700 border-rose-100",
  },
};

const priorityLabels: Record<TaskPriority, LabelConfig> = {
  low: {
    text: "Low",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  },
  normal: {
    text: "Normal",
    className: "bg-blue-50 text-blue-700 border-blue-100",
  },
  high: {
    text: "High",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  critical: {
    text: "Critical",
    className: "bg-rose-50 text-rose-700 border-rose-100",
  },
};

export default function ClientTasksAndNotes({
  clientId,
  businessId,
}: ClientTasksAndNotesProps) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState<string | null>(null);

  const [newTask, setNewTask] = useState<NewTaskState>(emptyTask);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savingTask, setSavingTask] = useState(false);

  const timezoneName = useMemo(() => dayjs.tz.guess(), []);

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2500);
  };

  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.status === "completed").length;
  }, [tasks]);

  const openTasks = useMemo(() => {
    return tasks.filter(
      (task) => task.status !== "completed" && task.status !== "cancelled"
    ).length;
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    const now = dayjs();

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      if (task.status === "completed" || task.status === "cancelled") {
        return false;
      }

      return dayjs(task.dueDate).isBefore(now);
    }).length;
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const dateA = a.dueDate ? dayjs(a.dueDate).valueOf() : 0;
      const dateB = b.dueDate ? dayjs(b.dueDate).valueOf() : 0;

      return dateA - dateB;
    });
  }, [tasks]);

  useEffect(() => {
    if (!clientId) return;

    setLoadingNotes(true);

    API.get(`/crm-extras/notes/${clientId}`, {
      params: { businessId },
    })
      .then((res: any) => {
        setNotes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err: unknown) => {
        console.error("Failed loading notes:", err);
        setNotes([]);
      })
      .finally(() => {
        setLoadingNotes(false);
      });
  }, [clientId, businessId]);

  useEffect(() => {
    if (!clientId) return;

    setLoadingTasks(true);

    API.get(`/crm-extras/tasks/${clientId}`, {
      params: { businessId },
    })
      .then((res: any) => {
        setTasks(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err: unknown) => {
        console.error("Failed loading tasks:", err);
        setTasks([]);
      })
      .finally(() => {
        setLoadingTasks(false);
      });
  }, [clientId, businessId]);

  const handleSaveNote = async () => {
    if (!newNote.trim() || !clientId || !businessId || savingNote) return;

    setSavingNote(true);

    try {
      if (editNoteId) {
        const res = await API.patch(`/crm-extras/notes/${editNoteId}`, {
          text: newNote.trim(),
        });

        setNotes((prev) =>
          prev.map((note) => (note._id === editNoteId ? res.data : note))
        );

        setEditNoteId(null);
        showToast("Note updated");
      } else {
        const res = await API.post("/crm-extras/notes", {
          clientId,
          businessId,
          text: newNote.trim(),
        });

        setNotes((prev) => [res.data, ...prev]);
        showToast("Note added");
      }

      setNewNote("");
    } catch (err) {
      console.error("Save note error:", err);
      showToast("Error saving note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleEditNote = (note: NoteItem) => {
    setEditNoteId(note._id);
    setNewNote(note.text || "");
  };

  const handleCancelEditNote = () => {
    setEditNoteId(null);
    setNewNote("");
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await API.delete(`/crm-extras/notes/${noteId}`);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      showToast("Note deleted");
    } catch (err) {
      console.error("Delete note error:", err);
      showToast("Error deleting note");
    }
  };

  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.dueTime) {
      showToast("Please fill title, date and time");
      return;
    }

    if (!clientId || !businessId || savingTask) return;

    const parsed = dayjs(
      `${newTask.dueDate} ${newTask.dueTime}`,
      "YYYY-MM-DD HH:mm",
      true
    );

    if (!parsed.isValid()) {
      showToast("Invalid date or time");
      return;
    }

    const dueAt = parsed.toDate();

    setSavingTask(true);

    try {
      if (editTaskId) {
        const res = await API.patch(`/crm-extras/tasks/${editTaskId}`, {
          title: newTask.title.trim(),
          description: newTask.description.trim(),
          dueDate: dueAt,
          status: newTask.status,
          priority: newTask.priority,
          reminderMinutes: newTask.reminderMinutes,
        });

        setTasks((prev) =>
          prev.map((task) => (task._id === editTaskId ? res.data : task))
        );

        setEditTaskId(null);
        showToast("Task updated");
      } else {
        const res = await API.post("/crm-extras/tasks", {
          clientId,
          businessId,
          title: newTask.title.trim(),
          description: newTask.description.trim(),
          dueDate: dueAt,
          status: newTask.status,
          priority: newTask.priority,
          reminderMinutes: newTask.reminderMinutes,
        });

        setTasks((prev) => [res.data, ...prev]);
        showToast("Task added");
      }

      setNewTask(emptyTask);
      setShowAdvanced(false);
    } catch (err) {
      console.error("Save task error:", err);
      showToast("Error saving task");
    } finally {
      setSavingTask(false);
    }
  };

  const handleEditTask = (task: TaskItem) => {
  const dueDate = task.dueDate
    ? dayjs(task.dueDate).tz(timezoneName)
    : null;

  const hasValidDueDate = Boolean(dueDate?.isValid());

  setEditTaskId(task._id);

  setNewTask({
    title: task.title || "",
    description: task.description || "",
    dueDate: hasValidDueDate ? dueDate!.format("YYYY-MM-DD") : "",
    dueTime: hasValidDueDate ? dueDate!.format("HH:mm") : "",
    status: task.status || "todo",
    priority: task.priority || "normal",
    reminderMinutes: task.reminderMinutes ?? 30,
  });

  setShowAdvanced(true);
};
  const handleCancelEditTask = () => {
    setEditTaskId(null);
    setNewTask(emptyTask);
    setShowAdvanced(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/crm-extras/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      showToast("Task deleted");
    } catch (err) {
      console.error("Delete task error:", err);
      showToast("Error deleting task");
    }
  };

  const isTaskValid =
    Boolean(newTask.title.trim()) &&
    Boolean(newTask.dueDate) &&
    Boolean(newTask.dueTime);

  return (
    <div className="relative space-y-6">
      {toast && (
        <div className="fixed right-6 top-6 z-50 rounded-2xl border border-violet-100 bg-white px-5 py-3 text-sm font-black text-violet-700 shadow-2xl">
          {toast}
        </div>
      )}

      <section className="grid gap-3 md:grid-cols-3">
        <MiniMetric
          label="Notes"
          value={notes.length}
          icon={StickyNote}
          tone="violet"
        />
        <MiniMetric
          label="Open tasks"
          value={openTasks}
          icon={Clock3}
          tone="amber"
        />
        <MiniMetric
          label="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          tone="emerald"
        />
      </section>

      {overdueTasks > 0 && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
          {overdueTasks} overdue task{overdueTasks > 1 ? "s" : ""} need attention.
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                <StickyNote className="h-4 w-4" />
                Notes
              </div>

              <h3 className="mt-3 text-2xl font-black text-slate-950">
                Client notes
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Keep important details, preferences, history and internal notes
                in one place.
              </p>
            </div>
          </div>

          {loadingNotes ? (
            <LoadingBox text="Loading notes..." />
          ) : notes.length === 0 ? (
            <EmptyBox
              icon={FileText}
              title="No notes yet"
              text="Keep important details about this client here."
            />
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  timezoneName={timezoneName}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note._id)}
                />
              ))}
            </div>
          )}

          <div className="mt-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-black text-slate-800">
              {editNoteId ? "Edit note" : "New note"}
            </label>

            <textarea
              placeholder="Write a quick note and press Enter..."
              value={newNote}
              onChange={(event) => setNewNote(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSaveNote();
                }
              }}
              rows={4}
              className="textarea-base"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {editNoteId && (
                <button
                  type="button"
                  onClick={handleCancelEditNote}
                  className="crm-secondary-btn"
                  disabled={savingNote}
                >
                  Cancel edit
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveNote}
                disabled={savingNote || !newNote.trim()}
                className="crm-primary-btn"
              >
                {savingNote
                  ? "Saving..."
                  : editNoteId
                    ? "Update Note"
                    : "Save Note"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Tasks
            </div>

            <h3 className="mt-3 text-2xl font-black text-slate-950">
              Follow-up tasks
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Create callbacks, reminders, preparation tasks and client
              follow-ups.
            </p>
          </div>

          {loadingTasks ? (
            <LoadingBox text="Loading tasks..." />
          ) : sortedTasks.length === 0 ? (
            <EmptyBox
              icon={CheckCircle2}
              title="No tasks yet"
              text="Create tasks to follow up, call back or prepare meetings."
            />
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  timezoneName={timezoneName}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task._id)}
                />
              ))}
            </div>
          )}

          <div className="mt-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950">
                  {editTaskId ? "Edit task" : "New task"}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Title, date and time are required.
                </p>
              </div>

              {editTaskId && (
                <button
                  type="button"
                  onClick={handleCancelEditTask}
                  className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm hover:bg-slate-100"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <div className="grid gap-3">
              <input
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(event) =>
                  setNewTask((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                className="input-base"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(event) =>
                    setNewTask((prev) => ({
                      ...prev,
                      dueDate: event.target.value,
                    }))
                  }
                  className="input-base"
                />

                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(event) =>
                    setNewTask((prev) => ({
                      ...prev,
                      dueTime: event.target.value,
                    }))
                  }
                  className="input-base"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-violet-700 shadow-sm transition hover:bg-violet-50"
              >
                <ChevronDown
                  className={[
                    "h-4 w-4 transition",
                    showAdvanced ? "rotate-180" : "",
                  ].join(" ")}
                />
                {showAdvanced ? "Hide advanced options" : "Advanced options"}
              </button>

              {showAdvanced && (
                <div className="grid gap-3">
                  <textarea
                    placeholder="Additional details"
                    value={newTask.description}
                    onChange={(event) =>
                      setNewTask((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    className="textarea-base"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={newTask.status}
                      onChange={(event) =>
                        setNewTask((prev) => ({
                          ...prev,
                          status: event.target.value as TaskStatus,
                        }))
                      }
                      className="select-base"
                    >
                      {(Object.keys(statusLabels) as TaskStatus[]).map(
                        (key) => (
                          <option key={key} value={key}>
                            {statusLabels[key].text}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      value={newTask.priority}
                      onChange={(event) =>
                        setNewTask((prev) => ({
                          ...prev,
                          priority: event.target.value as TaskPriority,
                        }))
                      }
                      className="select-base"
                    >
                      {(Object.keys(priorityLabels) as TaskPriority[]).map(
                        (key) => (
                          <option key={key} value={key}>
                            {priorityLabels[key].text}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <select
                    value={newTask.reminderMinutes}
                    onChange={(event) =>
                      setNewTask((prev) => ({
                        ...prev,
                        reminderMinutes: Number(event.target.value),
                      }))
                    }
                    className="select-base"
                  >
                    <option value={0}>No reminder</option>
                    <option value={5}>5 minutes before</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveTask}
                disabled={!isTaskValid || savingTask}
                className="crm-primary-btn"
              >
                <Plus className="h-4 w-4" />
                {savingTask
                  ? "Saving..."
                  : editTaskId
                    ? "Update Task"
                    : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NoteCard({
  note,
  timezoneName,
  onEdit,
  onDelete,
}: {
  note: NoteItem;
  timezoneName: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const createdAt = note.createdAt
    ? dayjs(note.createdAt).tz(timezoneName)
    : null;

  return (
    <article className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
      <p className="whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700">
        {note.text}
      </p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold text-slate-400">
          {createdAt?.isValid()
            ? createdAt.format("DD/MM/YYYY HH:mm")
            : "No date"}
        </p>

        <div className="flex gap-2">
          <IconButton title="Edit note" onClick={onEdit} icon={Edit3} />
          <IconButton
            title="Delete note"
            onClick={onDelete}
            icon={Trash2}
            danger
          />
        </div>
      </div>
    </article>
  );
}

function TaskCard({
  task,
  timezoneName,
  onEdit,
  onDelete,
}: {
  task: TaskItem;
  timezoneName: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const dueDate = task.dueDate ? dayjs(task.dueDate).tz(timezoneName) : null;
  const isOverdue =
    dueDate?.isValid() &&
    dueDate.isBefore(dayjs()) &&
    task.status !== "completed" &&
    task.status !== "cancelled";

  const status = statusLabels[task.status] || statusLabels.todo;
  const priority = priorityLabels[task.priority] || priorityLabels.normal;

  return (
    <article
      className={[
        "rounded-[1.5rem] border p-4 transition hover:bg-white hover:shadow-sm",
        isOverdue
          ? "border-rose-100 bg-rose-50/70"
          : "border-slate-100 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="truncate text-base font-black text-slate-950">
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-500">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <IconButton title="Edit task" onClick={onEdit} icon={Edit3} />
          <IconButton
            title="Delete task"
            onClick={onDelete}
            icon={Trash2}
            danger
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <TaskMeta icon={CalendarDays}>
          {dueDate?.isValid() ? dueDate.format("DD/MM/YYYY") : "-"}
        </TaskMeta>

        <TaskMeta icon={Clock3}>
          {dueDate?.isValid() ? dueDate.format("HH:mm") : "-"}
        </TaskMeta>

        <TaskMeta icon={Bell}>
          {task.reminderMinutes && task.reminderMinutes > 0
            ? `${task.reminderMinutes} min before`
            : "No reminder"}
        </TaskMeta>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-black ${status.className}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {status.text}
        </span>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-black ${priority.className}`}
        >
          <Flag className="h-3.5 w-3.5" />
          {priority.text}
        </span>

        {isOverdue && (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs font-black text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            Overdue
          </span>
        )}
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  tone: "violet" | "amber" | "emerald";
}) {
  const styles = {
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function TaskMeta({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-slate-600">
      <Icon className="h-4 w-4 text-violet-500" />
      <span>{children}</span>
    </div>
  );
}

function IconButton({
  title,
  onClick,
  icon: Icon,
  danger,
}: {
  title: string;
  onClick: () => void;
  icon: React.ElementType;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-xl transition",
        danger
          ? "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white"
          : "bg-white text-slate-500 hover:bg-violet-50 hover:text-violet-700",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function EmptyBox({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-violet-200 bg-violet-50/50 px-5 py-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>

      <h4 className="text-lg font-black text-slate-950">{title}</h4>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function LoadingBox({ text }: { text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-10 text-center">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      <p className="text-sm font-bold text-slate-500">{text}</p>
    </div>
  );
}