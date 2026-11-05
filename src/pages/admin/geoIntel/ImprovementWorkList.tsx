import { useMemo, useState } from "react";
import {
  WORK_LABELS,
  workCardFromTask,
  taskStatusHe,
  type WorkSource,
} from "./improvementWork";

type Props = {
  brandName?: string;
  tasks: any[];
  busy?: boolean;
  onUpdate: (taskKey: string, status: string, noteHe: string) => Promise<void>;
};

function sourceHref(source: WorkSource) {
  const url = String(source.url || "");
  if (!/^https:\/\//i.test(url)) return "";
  return url;
}

function formatWhen(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
}

export default function ImprovementWorkList({
  brandName = "",
  tasks,
  busy = false,
  onUpdate,
}: Props) {
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const visible = useMemo(
    () =>
      (tasks || []).filter((task) =>
        filter === "all" ? true : (task.status || "todo") === filter
      ),
    [tasks, filter]
  );

  return (
    <div className="geo-work">
      <div className="geo-work-filters" role="tablist" aria-label="סינון סטטוס">
        {[
          ["all", "הכל"],
          ["todo", "לביצוע"],
          ["in_progress", "בתהליך"],
          ["done", "הושלם"],
          ["dismissed", "נדחה"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={filter === id ? "active" : ""}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="geo-plan-tasks">
        {visible.map((task) => {
          const card = workCardFromTask(task, brandName);
          const note = notes[task.taskKey] ?? task.noteHe ?? "";
          return (
            <article key={task.taskKey} className="geo-plan-task geo-work-card">
              <header className="geo-plan-task-head">
                <div>
                  <strong>{task.titleHe}</strong>
                  <div className="geo-plan-task-meta">
                    <span data-prov={task.provenance}>{card.provenanceHe}</span>
                    <span>
                      {WORK_LABELS.impact}: {card.impactHe || "—"}
                    </span>
                    <span>
                      {WORK_LABELS.confidence}: {card.confidenceHe || "—"}
                    </span>
                    <span>
                      {WORK_LABELS.priority}: {card.priorityScore}
                    </span>
                  </div>
                </div>
                <label className="geo-work-status">
                  <span>{WORK_LABELS.status}</span>
                  <select
                    className="geo-plan-status"
                    value={task.status || "todo"}
                    disabled={busy}
                    aria-label={WORK_LABELS.status}
                    onChange={(e) => onUpdate(task.taskKey, e.target.value, note)}
                  >
                    <option value="todo">{taskStatusHe("todo")}</option>
                    <option value="in_progress">{taskStatusHe("in_progress")}</option>
                    <option value="done">{taskStatusHe("done")}</option>
                    <option value="dismissed">{taskStatusHe("dismissed")}</option>
                  </select>
                </label>
              </header>
              <dl className="geo-work-fields">
                <div>
                  <dt>{WORK_LABELS.brand}</dt>
                  <dd>{card.brandName || "—"}</dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.engine}</dt>
                  <dd>{card.engine || "—"}</dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.question}</dt>
                  <dd dir="auto">{card.question || WORK_LABELS.noQuestion}</dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.outcome}</dt>
                  <dd>
                    {card.outcomeHe || "—"}
                    {formatWhen(card.checkedAt) ? ` · ${formatWhen(card.checkedAt)}` : ""}
                  </dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.source}</dt>
                  <dd>
                    {card.sources.length ? (
                      <ul>
                        {card.sources.slice(0, 4).map((source, index) => {
                          const href = sourceHref(source);
                          const label = source.title || source.domain || source.url || "מקור";
                          return (
                            <li key={`${task.taskKey}-src-${index}`}>
                              {href ? (
                                <a href={href} target="_blank" rel="noreferrer">
                                  {label}
                                </a>
                              ) : (
                                label
                              )}
                              {source.domain ? ` · ${source.domain}` : ""}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      WORK_LABELS.noSource
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.competitors}</dt>
                  <dd>
                    {card.competitors.length
                      ? card.competitors.join(", ")
                      : WORK_LABELS.noCompetitors}
                  </dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.gap}</dt>
                  <dd>{card.gapReasonHe || WORK_LABELS.noGap}</dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.target}</dt>
                  <dd>
                    {card.targetPath ? <code dir="ltr">{card.targetPath}</code> : null}{" "}
                    {card.targetNoteHe}
                  </dd>
                </div>
                <div>
                  <dt>{WORK_LABELS.action}</dt>
                  <dd>{card.actionHe}</dd>
                </div>
              </dl>
              {card.priorityNoteHe ? (
                <p className="geo-muted">{card.priorityNoteHe}</p>
              ) : null}
              <label className="geo-work-note">
                <span>{WORK_LABELS.tracking}</span>
                <textarea
                  rows={2}
                  value={note}
                  disabled={busy}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [task.taskKey]: e.target.value }))
                  }
                  onBlur={() => {
                    if ((note || "") === (task.noteHe || "")) return;
                    onUpdate(task.taskKey, task.status || "todo", note);
                  }}
                />
                {task.statusUpdatedAt ? (
                  <small>
                    עודכן {formatWhen(task.statusUpdatedAt)}
                  </small>
                ) : null}
              </label>
              {task.siteChangeRequiresApproval ? (
                <p className="geo-plan-approval">
                  שינוי באתר המותג דורש אישור. הוא לא מבוצע מכאן.
                </p>
              ) : null}
            </article>
          );
        })}
        {!visible.length ? (
          <p className="geo-muted">אין משימות בסינון הזה.</p>
        ) : null}
      </div>
    </div>
  );
}
