import React, { useCallback, useEffect, useMemo, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import { PIPELINE_STAGE_ORDER, pipelineStageLabel, statusLabel } from "./copy";

type Props = {
  busy: boolean;
  setBusy: (v: boolean) => void;
  onError: (msg: string) => void;
  onMessage: (msg: string) => void;
  onOpenProfile: (id: string) => void;
  view: "kanban" | "table";
};

export default function PipelineBoard({
  busy,
  setBusy,
  onError,
  onMessage,
  onOpenProfile,
  view,
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [noteById, setNoteById] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await gpGet("/candidates", {
        workArea: "pipeline",
        limit: 200,
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      onError(e?.message || "טעינת צינור הגיוס נכשלה");
    } finally {
      setBusy(false);
    }
  }, [onError, setBusy]);

  useEffect(() => {
    void load();
  }, [load]);

  const byStage = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const stage of PIPELINE_STAGE_ORDER) map[stage] = [];
    for (const c of items) {
      const stage = c.pipelineStage || "expressed_interest";
      if (!map[stage]) map[stage] = [];
      map[stage].push(c);
    }
    return map;
  }, [items]);

  async function moveStage(id: string, stage: string) {
    setBusy(true);
    try {
      await gpPatch(`/workflow/${id}/pipeline-stage`, {
        stage,
        note: noteById[id] || "",
      });
      onMessage(`השלב עודכן ל«${pipelineStageLabel(stage)}»`);
      await load();
    } catch (e: any) {
      onError(e?.message || "עדכון השלב נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function promote(id: string) {
    setBusy(true);
    try {
      await gpPost(`/workflow/${id}/promote-active`, {
        note: noteById[id] || "הצטרפות אושרה ידנית",
      });
      onMessage("המועמד הועבר לשותפים פעילים — ללא יצירת עמלות אוטומטיות.");
      await load();
    } catch (e: any) {
      onError(e?.message || "העברה לשותף פעיל נכשלה");
    } finally {
      setBusy(false);
    }
  }

  if (view === "table") {
    return (
      <div className="gp-panel">
        <div className="gp-panel-head">
          <h2>שותפים בתהליך ({total})</h2>
          <button type="button" className="gp-btn gp-btn--ghost" disabled={busy} onClick={() => void load()}>
            רענון
          </button>
        </div>
        <p className="gp-muted">
          מעבר לשותף פעיל דורש אישור מפורש — לא מתבצע אוטומטית מתשובה חיובית למייל.
        </p>
        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                <th>חברה</th>
                <th>שלב</th>
                <th>סטטוס</th>
                <th>מדינה</th>
                <th>הערה למעבר</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6}>אין שותפים בתהליך כרגע.</td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c._id}>
                    <td>{c.companyName}</td>
                    <td>{pipelineStageLabel(c.pipelineStage)}</td>
                    <td>{statusLabel(c.recruitmentStatus)}</td>
                    <td>{c.countryCode || "—"}</td>
                    <td>
                      <input
                        value={noteById[c._id] || ""}
                        onChange={(e) =>
                          setNoteById((p) => ({ ...p, [c._id]: e.target.value }))
                        }
                        placeholder="הערה"
                      />
                    </td>
                    <td>
                      <div className="gp-row-actions">
                        <button
                          type="button"
                          className="gp-btn gp-btn--ghost"
                          onClick={() => onOpenProfile(c._id)}
                        >
                          פרופיל
                        </button>
                        <select
                          value={c.pipelineStage || "expressed_interest"}
                          disabled={busy}
                          onChange={(e) => void moveStage(c._id, e.target.value)}
                        >
                          {PIPELINE_STAGE_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {pipelineStageLabel(s)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="gp-btn"
                          disabled={busy}
                          onClick={() => void promote(c._id)}
                        >
                          הפוך לשותף פעיל
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="gp-panel">
      <div className="gp-panel-head">
        <h2>צינור גיוס — Kanban ({total})</h2>
        <button type="button" className="gp-btn gp-btn--ghost" disabled={busy} onClick={() => void load()}>
          רענון
        </button>
      </div>
      <div className="gp-kanban">
        {PIPELINE_STAGE_ORDER.map((stage) => (
          <div className="gp-kanban-col" key={stage}>
            <div className="gp-kanban-col-head">
              <strong>{pipelineStageLabel(stage)}</strong>
              <span className="gp-chip">{byStage[stage]?.length || 0}</span>
            </div>
            <div className="gp-kanban-cards">
              {(byStage[stage] || []).length === 0 ? (
                <p className="gp-muted gp-empty">אין פריטים</p>
              ) : (
                (byStage[stage] || []).map((c) => (
                  <div className="gp-kanban-card" key={c._id}>
                    <button
                      type="button"
                      className="gp-linkish"
                      onClick={() => onOpenProfile(c._id)}
                    >
                      {c.companyName}
                    </button>
                    <div className="gp-muted">
                      {c.countryCode || "—"} · ציון {c.partnerFitScore ?? c.matchScore ?? "—"}
                    </div>
                    <select
                      value={stage}
                      disabled={busy}
                      onChange={(e) => void moveStage(c._id, e.target.value)}
                    >
                      {PIPELINE_STAGE_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {pipelineStageLabel(s)}
                        </option>
                      ))}
                    </select>
                    {stage === "onboarding_complete" || stage === "agreement_signed" ? (
                      <button
                        type="button"
                        className="gp-btn"
                        disabled={busy}
                        onClick={() => void promote(c._id)}
                      >
                        לשותף פעיל
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
