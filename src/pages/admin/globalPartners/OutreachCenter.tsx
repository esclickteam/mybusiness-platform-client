import React, { useCallback, useEffect, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import { statusLabel, TRACK_LABELS } from "./copy";

type Props = {
  onError: (msg: string) => void;
  onMessage: (msg: string) => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
};

export default function OutreachCenter({ onError, onMessage, busy, setBusy }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [templates, setTemplates] = useState<any[]>([]);
  const [inbox, setInbox] = useState<any>(null);
  const [country, setCountry] = useState("");
  const [track, setTrack] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [active, setActive] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [locale, setLocale] = useState("en");
  const [chosenTrack, setChosenTrack] = useState("business_partner");
  const [attest, setAttest] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [interest, setInterest] = useState("");

  const load = useCallback(async () => {
    const params: Record<string, string> = { limit: "50" };
    if (country) params.countryCode = country;
    if (track) params.track = track;
    if (status) params.status = status;
    if (channel === "email") params.hasEmail = "1";
    if (channel === "phone") params.hasPhone = "1";
    if (channel === "form") params.hasForm = "1";
    const data = await gpGet("/outreach/center", params);
    setItems(data.items || []);
    setTotal(data.total || 0);
    setTemplates(data.templates || []);
    setInbox(data.inbox || null);
  }, [country, track, status, channel]);

  useEffect(() => {
    void load().catch((e) => onError(e?.message || "טעינת מרכז פניות נכשלה"));
  }, [load, onError]);

  async function openThread(id: string) {
    setBusy(true);
    try {
      const data = await gpGet(`/outreach/candidates/${id}/thread`);
      setActive(data.candidate);
      setThread(data);
      setChosenTrack(data.candidate?.recommendedTrack || "business_partner");
      setPreview(null);
      setAttest(false);
    } catch (e: any) {
      onError(e?.message || "טעינת שרשור נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function doPreview() {
    if (!active?._id) return;
    setBusy(true);
    try {
      const data = await gpPost("/outreach/preview", {
        candidateId: active._id,
        track: chosenTrack,
        locale,
        toEmail: active.businessEmail,
      });
      setPreview(data);
      onMessage("תצוגה מקדימה מוכנה — נדרש אישור Owner לפני שליחה.");
    } catch (e: any) {
      onError(e?.message || "יצירת תצוגה מקדימה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function doApprove() {
    if (!preview?.message?._id) return;
    if (!attest) {
      onError("יש לאשר בסיס חוקי לפני אישור שליחה.");
      return;
    }
    setBusy(true);
    try {
      const data = await gpPost(`/outreach/${preview.message._id}/approve`, {
        complianceAttestation: true,
      });
      setPreview((p: any) => ({ ...p, message: data.message }));
      onMessage("הפנייה אושרה על ידי Owner.");
    } catch (e: any) {
      onError(e?.message || "אישור נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function doSendDryRun() {
    if (!preview?.message?._id) return;
    setBusy(true);
    try {
      const data = await gpPost(`/outreach/${preview.message._id}/send`, {
        dryRun: true,
        liveSend: false,
      });
      onMessage(
        data.dryRun
          ? `שליחת בדיקה (dry-run) נשמרה · נוצרו ${data.followUps?.length || 0} תזכורות`
          : "נשלח"
      );
      await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "שליחה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(next: string) {
    if (!active?._id) return;
    setBusy(true);
    try {
      await gpPatch(`/outreach/candidates/${active._id}/status`, { status: next });
      onMessage(`סטטוס עודכן ל־${statusLabel(next)}`);
      await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "עדכון סטטוס נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function suppressEmail() {
    if (!active?.businessEmail) return;
    setBusy(true);
    try {
      await gpPost("/outreach/suppress", {
        email: active.businessEmail,
        reason: "unsubscribe",
        candidateId: active._id,
      });
      onMessage("הנמען נוסף לרשימת הסרה.");
      await load();
    } catch (e: any) {
      onError(e?.message || "חסימה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function saveManualReply() {
    if (!active?._id || !replyText.trim()) return;
    setBusy(true);
    try {
      await gpPost("/outreach/replies/manual", {
        candidateId: active._id,
        bodyText: replyText,
        interestLabel: interest || undefined,
        fromEmail: active.businessEmail,
      });
      setReplyText("");
      onMessage("תגובה נרשמה ידנית (אין Inbox אוטומטי מחובר).");
      await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "שמירת תגובה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <div className="gp-panel">
        <h2>מרכז פניות</h2>
        <p className="gp-muted">
          ניהול גיוס ל־{total} מועמדים עם ערוץ קשר. שליחה רק לאחר תצוגה מקדימה + אישור Owner.
          שליחה חיה למועמדים דורשת אישור מפורש נוסף — ברירת המחדל היא dry-run.
        </p>
        {inbox ? (
          <p className="gp-muted">
            תיבת תגובות:{" "}
            {inbox.connected
              ? `מחוברת (${inbox.mode})`
              : "לא מחוברת — לא מדומה כמחוברת"}{" "}
            — {inbox.note}
            {Array.isArray(inbox.blockers) && inbox.blockers.length ? (
              <>
                <br />
                חסמים: {inbox.blockers.join(", ")}
              </>
            ) : null}
          </p>
        ) : null}

        <div className="gp-form" style={{ marginTop: 12 }}>
          <label>
            מדינה
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="IL" />
          </label>
          <label>
            מסלול
            <select value={track} onChange={(e) => setTrack(e.target.value)}>
              <option value="">הכל</option>
              {Object.entries(TRACK_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            סטטוס גיוס
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">הכל</option>
              {Object.keys(TRACK_LABELS).length
                ? [
                    "discovered",
                    "pending_review",
                    "approved_for_outreach",
                    "outreach_sent",
                    "response_received",
                    "interested",
                    "negotiation",
                    "proposal_sent",
                    "agreement_signed",
                    "active_partner",
                    "rejected",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))
                : null}
            </select>
          </label>
          <label>
            ערוץ קשר
            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="">הכל</option>
              <option value="email">אימייל</option>
              <option value="phone">טלפון</option>
              <option value="form">טופס</option>
            </select>
          </label>
        </div>
        <div className="gp-actions">
          <button type="button" className="gp-btn" disabled={busy} onClick={() => void load()}>
            סנן
          </button>
          <span className="gp-muted">נבחרו {selectedIds.length}</span>
        </div>

        <div className="gp-table-wrap" style={{ marginTop: 14 }}>
          <table className="gp-table">
            <thead>
              <tr>
                <th></th>
                <th>חברה / מדינה</th>
                <th>מסלול מומלץ</th>
                <th>קשר</th>
                <th>מקור</th>
                <th>סטטוס</th>
                <th>פנייה אחרונה</th>
                <th>פולואו־אפ</th>
                <th>אחראי</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10}>אין מועמדים מוכנים לפנייה לפי הסינון.</td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c._id)}
                        onChange={() => toggleSelect(c._id)}
                      />
                    </td>
                    <td>
                      {c.companyName}
                      <div className="gp-muted">{c.countryCode || "—"}</div>
                    </td>
                    <td>{TRACK_LABELS[c.recommendedTrack] || c.recommendedTrack}</td>
                    <td>
                      {[
                        c.businessEmail ? "מייל" : null,
                        c.businessPhone ? "טל׳" : null,
                        c.contactFormUrl ? "טופס" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                      <div className="gp-muted">{c.businessEmail || ""}</div>
                    </td>
                    <td className="gp-muted">
                      {c.contactSource ? (
                        <a href={c.contactSource} target="_blank" rel="noreferrer">
                          מקור
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{statusLabel(c.recruitmentStatus)}</td>
                    <td>
                      {c.lastOutreach?.at
                        ? new Date(c.lastOutreach.at).toLocaleString("he-IL")
                        : "—"}
                    </td>
                    <td>
                      {c.nextFollowUpAt
                        ? new Date(c.nextFollowUpAt).toLocaleDateString("he-IL")
                        : "—"}
                    </td>
                    <td className="gp-muted">{c.assigneeUserId || "—"}</td>
                    <td>
                      <button
                        type="button"
                        className="gp-btn gp-btn--ghost"
                        onClick={() => void openThread(c._id)}
                      >
                        פנייה
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {active ? (
        <div className="gp-panel">
          <h2>
            {active.companyName}{" "}
            <span className="gp-muted">· {active.countryCode || ""}</span>
          </h2>
          <p className="gp-muted">
            מסלול מומלץ: {TRACK_LABELS[chosenTrack] || chosenTrack} · סטטוס:{" "}
            {statusLabel(active.recruitmentStatus)}
          </p>

          <div className="gp-form">
            <label>
              מסלול לתבנית
              <select value={chosenTrack} onChange={(e) => setChosenTrack(e.target.value)}>
                {(templates.length
                  ? templates.map((t) => t.track)
                  : Object.keys(TRACK_LABELS)
                ).map((t) => (
                  <option key={t} value={t}>
                    {TRACK_LABELS[t] || t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              שפה
              <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                <option value="en">English</option>
                <option value="he">עברית</option>
              </select>
            </label>
            <label>
              סטטוס גיוס
              <select
                value={active.recruitmentStatus}
                onChange={(e) => void updateStatus(e.target.value)}
              >
                {[
                  "discovered",
                  "pending_review",
                  "approved_for_outreach",
                  "outreach_sent",
                  "response_received",
                  "interested",
                  "negotiation",
                  "proposal_sent",
                  "agreement_signed",
                  "active_partner",
                  "rejected",
                ].map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="gp-actions">
            <button type="button" className="gp-btn" disabled={busy || !active.businessEmail} onClick={() => void doPreview()}>
              תצוגה מקדימה מתבנית
            </button>
            <button type="button" className="gp-btn gp-btn--ghost" disabled={busy} onClick={() => void suppressEmail()}>
              הסרה / חסימה
            </button>
            <button type="button" className="gp-btn gp-btn--ghost" onClick={() => setActive(null)}>
              סגור
            </button>
          </div>

          {preview?.message ? (
            <div style={{ marginTop: 16 }}>
              <h3>תצוגה מקדימה</h3>
              <p>
                <strong>אל:</strong> {preview.message.toEmail}
              </p>
              <p>
                <strong>נושא:</strong> {preview.message.subject}
              </p>
              <div
                className="gp-panel"
                style={{ background: "#fafafa" }}
                dangerouslySetInnerHTML={{ __html: preview.message.bodyHtml }}
              />
              <p className="gp-muted">{preview.compliance?.notes}</p>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={attest}
                  onChange={(e) => setAttest(e.target.checked)}
                />
                אני (Owner) מאשר/ת שיש בסיס חוקי לפנייה — פרסום אימייל באתר אינו הסכמה כשלעצמו
              </label>
              <div className="gp-actions">
                <button
                  type="button"
                  className="gp-btn"
                  disabled={busy || preview.message.status === "sent"}
                  onClick={() => void doApprove()}
                >
                  אישור Owner
                </button>
                <button
                  type="button"
                  className="gp-btn"
                  disabled={busy || preview.message.status !== "approved"}
                  onClick={() => void doSendDryRun()}
                >
                  שליחת dry-run (ללא מייל חי למועמד)
                </button>
              </div>
              {preview.alreadySentToday ? (
                <p className="gp-muted">כבר קיימת שליחה עם אותו מפתח יומי — מניעת כפילות פעילה.</p>
              ) : null}
            </div>
          ) : null}

          <div style={{ marginTop: 20 }}>
            <h3>היסטוריית פניות / שרשור</h3>
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>כיוון</th>
                    <th>סטטוס</th>
                    <th>נושא</th>
                    <th>תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {(thread?.messages || []).length === 0 ? (
                    <tr>
                      <td colSpan={4}>אין הודעות עדיין.</td>
                    </tr>
                  ) : (
                    (thread?.messages || []).map((m: any) => (
                      <tr key={m._id}>
                        <td>{m.direction}</td>
                        <td>
                          {m.status}
                          {m.dryRun ? " · dry-run" : ""}
                        </td>
                        <td>{m.subject}</td>
                        <td>
                          {new Date(m.sentAt || m.createdAt).toLocaleString("he-IL")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>תזכורות פולואו־אפ</h3>
            <ul>
              {(thread?.followUps || []).map((t: any) => (
                <li key={t._id}>
                  {t.title} · {t.status} · {new Date(t.dueAt).toLocaleDateString("he-IL")}
                  {t.cancelReason ? ` · ${t.cancelReason}` : ""}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>רישום תגובה ידנית</h3>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="הדביקו תוכן תגובה שהתקבלה מחוץ למערכת"
              style={{ width: "100%" }}
            />
            <label>
              סיווג
              <select value={interest} onChange={(e) => setInterest(e.target.value)}>
                <option value="">ללא</option>
                <option value="interested">מתעניין</option>
                <option value="not_interested">לא מעוניין</option>
                <option value="unsubscribe">הסרה</option>
                <option value="other">אחר</option>
              </select>
            </label>
            <div className="gp-actions">
              <button type="button" className="gp-btn" disabled={busy} onClick={() => void saveManualReply()}>
                שמור תגובה
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
