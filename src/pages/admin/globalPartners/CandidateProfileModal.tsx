import React, { useEffect, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import {
  auditLabel,
  channelLabel,
  channelStatusLabel,
  directionLabel,
  messageStatusLabel,
  statusLabel,
  trackLabel,
  STATUS_LABELS,
  TRACK_LABELS,
} from "./copy";

type Props = {
  candidateId: string;
  statuses?: string[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  onClose: () => void;
  onError: (msg: string) => void;
  onMessage: (msg: string) => void;
  onOpenOutreach: (candidateId: string) => void;
  onChanged: () => void;
};

export default function CandidateProfileModal({
  candidateId,
  statuses = [],
  busy,
  setBusy,
  onClose,
  onError,
  onMessage,
  onOpenOutreach,
  onChanged,
}: Props) {
  const [candidate, setCandidate] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [edit, setEdit] = useState({
    companyName: "",
    countryCode: "",
    city: "",
    website: "",
    vertical: "",
    businessEmail: "",
    businessPhone: "",
    contactFormUrl: "",
    notes: "",
    recruitmentStatus: "discovered",
  });

  async function load() {
    setBusy(true);
    try {
      const data = await gpGet(`/candidates/${candidateId}/activity`);
      setCandidate(data.candidate);
      setAudits(data.audits || []);
      setMessages(data.messages || []);
      setFollowUps(data.followUps || []);
      const c = data.candidate || {};
      setEdit({
        companyName: c.companyName || "",
        countryCode: c.countryCode || "",
        city: c.city || "",
        website: c.website || "",
        vertical: c.vertical || "",
        businessEmail: c.businessEmail || "",
        businessPhone: c.businessPhone || "",
        contactFormUrl: c.contactFormUrl || "",
        notes: c.notes || "",
        recruitmentStatus: c.recruitmentStatus || "discovered",
      });
    } catch (e: any) {
      onError(e?.message || "טעינת פרופיל המועמד נכשלה");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function save() {
    setBusy(true);
    try {
      const data = await gpPatch(`/candidates/${candidateId}`, { ...edit });
      setCandidate(data.candidate);
      onMessage("הפרופיל נשמר בהצלחה.");
      onChanged();
      await load();
    } catch (e: any) {
      onError(e?.message || "שמירת הפרופיל נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function rescore() {
    setBusy(true);
    try {
      const data = await gpPost(`/candidates/${candidateId}/rescore`);
      setCandidate(data.candidate);
      onMessage("הציון חושב מחדש לפי כללי ההתאמה.");
      onChanged();
    } catch (e: any) {
      onError(e?.message || "חישוב הציון נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function enrich() {
    setBusy(true);
    try {
      const data = await gpPost(`/candidates/${candidateId}/enrich`, {
        force: true,
        inline: true,
      });
      if (data.enrich?.ok === false) {
        onMessage(`העשרה לא הושלמה: ${data.enrich.reason || "לא ידוע"}`);
      } else {
        onMessage("העשרת פרטי קשר מהאתר הושלמה.");
      }
      await load();
      onChanged();
    } catch (e: any) {
      onError(e?.message || "העשרת פרטי קשר נכשלה");
    } finally {
      setBusy(false);
    }
  }

  if (!candidate) {
    return (
      <div className="gp-overlay" role="dialog" aria-modal="true" aria-label="פרופיל מועמד">
        <div className="gp-drawer">
          <p className="gp-muted">טוען פרופיל…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="gp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`פרופיל ${candidate.companyName}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="gp-drawer">
        <div className="gp-drawer-head">
          <div>
            <h2>{candidate.companyName}</h2>
            <p className="gp-muted" style={{ margin: "6px 0 0" }}>
              {[candidate.countryName || candidate.countryCode, candidate.city, candidate.vertical]
                .filter(Boolean)
                .join(" · ") || "ללא מיקום/תחום"}
              {" · "}
              סטטוס: {statusLabel(candidate.recruitmentStatus)}
            </p>
          </div>
          <button type="button" className="gp-btn gp-btn--ghost" onClick={onClose}>
            סגור
          </button>
        </div>

        <div className="gp-grid">
          <div className="gp-kpi">
            <div className="gp-kpi-label">ציון התאמה</div>
            <div className="gp-kpi-value">{candidate.partnerFitScore ?? "—"}</div>
          </div>
          <div className="gp-kpi">
            <div className="gp-kpi-label">ציון מסלולים</div>
            <div className="gp-kpi-value">{candidate.matchScore ?? "—"}</div>
          </div>
          <div className="gp-kpi">
            <div className="gp-kpi-label">ערוץ קשר</div>
            <div className="gp-kpi-value">{candidate.hasContactChannel ? "קיים" : "חסר"}</div>
          </div>
          <div className="gp-kpi">
            <div className="gp-kpi-label">מוכן לפנייה</div>
            <div className="gp-kpi-value">{candidate.outreachReady ? "כן" : "לא"}</div>
          </div>
        </div>

        <div className="gp-section">
          <h3>פרטי חברה</h3>
          <dl className="gp-dl">
            <dt>אתר</dt>
            <dd>
              {candidate.website ? (
                <a href={candidate.website} target="_blank" rel="noreferrer">
                  {candidate.website}
                </a>
              ) : (
                "—"
              )}
            </dd>
            <dt>מדינה</dt>
            <dd>{candidate.countryName || candidate.countryCode || "—"}</dd>
            <dt>עיר</dt>
            <dd>{candidate.city || "—"}</dd>
            <dt>תחום</dt>
            <dd>{candidate.vertical || "—"}</dd>
            <dt>מקורות</dt>
            <dd>
              {(candidate.sources || []).map((s: any) => s.source).join(", ") || "—"}
            </dd>
          </dl>
        </div>

        <div className="gp-section">
          <h3>עריכת פרופיל</h3>
          <div className="gp-form">
            <label>
              שם חברה
              <input
                value={edit.companyName}
                onChange={(e) => setEdit((p) => ({ ...p, companyName: e.target.value }))}
              />
            </label>
            <label>
              קוד מדינה
              <input
                value={edit.countryCode}
                onChange={(e) => setEdit((p) => ({ ...p, countryCode: e.target.value }))}
              />
            </label>
            <label>
              עיר
              <input
                value={edit.city}
                onChange={(e) => setEdit((p) => ({ ...p, city: e.target.value }))}
              />
            </label>
            <label>
              תחום
              <input
                value={edit.vertical}
                onChange={(e) => setEdit((p) => ({ ...p, vertical: e.target.value }))}
              />
            </label>
            <label>
              אתר
              <input
                value={edit.website}
                onChange={(e) => setEdit((p) => ({ ...p, website: e.target.value }))}
              />
            </label>
            <label>
              סטטוס גיוס
              <select
                value={edit.recruitmentStatus}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, recruitmentStatus: e.target.value }))
                }
              >
                {(statuses.length ? statuses : Object.keys(STATUS_LABELS)).map((s: string) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              אימייל עסקי
              <input
                value={edit.businessEmail}
                onChange={(e) => setEdit((p) => ({ ...p, businessEmail: e.target.value }))}
              />
            </label>
            <label>
              טלפון עסקי
              <input
                value={edit.businessPhone}
                onChange={(e) => setEdit((p) => ({ ...p, businessPhone: e.target.value }))}
              />
            </label>
            <label>
              כתובת טופס קשר
              <input
                value={edit.contactFormUrl}
                onChange={(e) => setEdit((p) => ({ ...p, contactFormUrl: e.target.value }))}
              />
            </label>
            <label>
              הערות פנימיות
              <textarea
                value={edit.notes}
                onChange={(e) => setEdit((p) => ({ ...p, notes: e.target.value }))}
                rows={4}
              />
            </label>
          </div>
          <div className="gp-actions">
            <button type="button" className="gp-btn" disabled={busy} onClick={() => void save()}>
              שמור שינויים
            </button>
            <button type="button" className="gp-btn" disabled={busy} onClick={() => void rescore()}>
              חשב ציון מחדש
            </button>
            <button type="button" className="gp-btn" disabled={busy} onClick={() => void enrich()}>
              חלץ פרטי קשר מהאתר
            </button>
            <button
              type="button"
              className="gp-btn gp-btn--ghost"
              onClick={() => onOpenOutreach(candidateId)}
            >
              פתח ניהול פנייה
            </button>
          </div>
        </div>

        <div className="gp-section">
          <h3>פרטי קשר</h3>
          {(candidate.contactChannels || []).length === 0 ? (
            <p className="gp-muted">
              אין עדיין פרטי קשר מחולצים. ניתן להוסיף ידנית למעלה או להריץ חילוץ מהאתר.
            </p>
          ) : (
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>סוג</th>
                    <th>ערך</th>
                    <th>סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {(candidate.contactChannels || []).map((ch: any, idx: number) => (
                    <tr key={`${ch.type}-${idx}`}>
                      <td>{channelLabel(ch.type)}</td>
                      <td>{ch.value}</td>
                      <td>{channelStatusLabel(ch.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="gp-section">
          <h3>ציוני מסלולים</h3>
          <div className="gp-grid">
            {Object.keys(TRACK_LABELS).slice(0, 4).map((track) => (
              <div className="gp-kpi" key={track}>
                <div className="gp-kpi-label">{trackLabel(track)}</div>
                <div className="gp-kpi-value">
                  {candidate.scores?.[track]?.score ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gp-section">
          <h3>היסטוריית פניות</h3>
          {(messages || []).length === 0 ? (
            <p className="gp-muted">אין פניות עדיין למועמד זה.</p>
          ) : (
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>כיוון</th>
                    <th>נושא</th>
                    <th>סטטוס</th>
                    <th>תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m: any) => (
                    <tr key={m._id}>
                      <td>{directionLabel(m.direction)}</td>
                      <td>{m.subject || "—"}</td>
                      <td>
                        {messageStatusLabel(m.status)}
                        {m.dryRun ? " · בדיקה פנימית" : ""}
                      </td>
                      <td>
                        {new Date(m.sentAt || m.createdAt).toLocaleString("he-IL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="gp-section">
          <h3>משימות מעקב</h3>
          {(followUps || []).length === 0 ? (
            <p className="gp-muted">אין משימות מעקב.</p>
          ) : (
            <ul>
              {followUps.map((t: any) => (
                <li key={t._id}>
                  {t.title} · {t.status} ·{" "}
                  {t.dueAt ? new Date(t.dueAt).toLocaleDateString("he-IL") : "—"}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="gp-section">
          <h3>יומן פעילות</h3>
          {(audits || []).length === 0 ? (
            <p className="gp-muted">אין רשומות פעילות עדיין.</p>
          ) : (
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>פעולה</th>
                    <th>תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((a: any) => (
                    <tr key={a._id}>
                      <td>{auditLabel(a.action)}</td>
                      <td>{new Date(a.createdAt).toLocaleString("he-IL")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
