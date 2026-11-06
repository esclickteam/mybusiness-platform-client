import React, { useCallback, useEffect, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import {
  directionLabel,
  messageStatusLabel,
  outreachWorkflowLabel,
  statusLabel,
  trackLabel,
  TRACK_LABELS,
  STATUS_LABELS,
} from "./copy";

type Props = {
  onError: (msg: string) => void;
  onMessage: (msg: string) => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
  openCandidateId?: string | null;
  onOpenCandidateHandled?: () => void;
};

export default function OutreachCenter({
  onError,
  onMessage,
  busy,
  setBusy,
  openCandidateId = null,
  onOpenCandidateHandled,
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [templates, setTemplates] = useState<any[]>([]);
  const [inbox, setInbox] = useState<any>(null);
  const [country, setCountry] = useState("");
  const [track, setTrack] = useState("");
  const [status, setStatus] = useState("");
  const [scope, setScope] = useState<"area" | "ready" | "contact" | "all">("area");
  const [active, setActive] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [draftSubject, setDraftSubject] = useState("");
  const [draftHtml, setDraftHtml] = useState("");
  const [locale, setLocale] = useState("he");
  const [chosenTrack, setChosenTrack] = useState("business_partner");
  const [attest, setAttest] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [interest, setInterest] = useState("");

  const load = useCallback(async () => {
    const params: Record<string, string> = { limit: "100", scope };
    if (country) params.countryCode = country;
    if (track) params.track = track;
    if (status) params.status = status;
    const data = await gpGet("/outreach/center", params);
    setItems(data.items || []);
    setTotal(data.total || 0);
    setTemplates(data.templates || []);
    setInbox(data.inbox || null);
  }, [country, track, status, scope]);

  useEffect(() => {
    void load().catch((e) => onError(e?.message || "טעינת מרכז הפניות נכשלה"));
  }, [load, onError]);

  async function openThread(id: string) {
    setBusy(true);
    try {
      const data = await gpGet(`/outreach/candidates/${id}/thread`);
      setActive(data.candidate);
      setThread(data);
      setChosenTrack(data.candidate?.recommendedTrack || "business_partner");
      setAttest(false);
      const editable = [...(data.messages || [])]
        .reverse()
        .find(
          (m: any) =>
            m.direction === "outbound" &&
            ["draft", "previewed", "approved", "failed"].includes(m.status)
        );
      if (editable) {
        setPreview({ message: editable });
        setDraftSubject(editable.subject || "");
        setDraftHtml(editable.bodyHtml || "");
      } else {
        setPreview(null);
        setDraftSubject("");
        setDraftHtml("");
      }
    } catch (e: any) {
      onError(e?.message || "טעינת פרטי הפנייה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!openCandidateId) return;
    void openThread(openCandidateId).finally(() => onOpenCandidateHandled?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCandidateId]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  async function doPreview() {
    if (!active?._id) return;
    setBusy(true);
    try {
      const data = await gpPost("/outreach/preview", {
        candidateId: active._id,
        track: chosenTrack,
        locale,
        toEmail: active.businessEmail || undefined,
      });
      setPreview(data);
      setDraftSubject(data.message?.subject || "");
      setDraftHtml(data.message?.bodyHtml || "");
      onMessage("טיוטת פנייה מוכנה לעריכה. שליחה חיה חסומה — ניתן לאשר ולשמור בדיקה פנימית בלבד.");
    } catch (e: any) {
      onError(e?.message || "יצירת טיוטת הפנייה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft() {
    if (!preview?.message?._id) return;
    setBusy(true);
    try {
      const data = await gpPatch(`/outreach/${preview.message._id}/draft`, {
        subject: draftSubject,
        bodyHtml: draftHtml,
      });
      setPreview((p: any) => ({ ...p, message: data.message }));
      onMessage("הטיוטה נשמרה.");
      if (active?._id) await openThread(active._id);
    } catch (e: any) {
      onError(e?.message || "שמירת הטיוטה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function doApprove() {
    if (!preview?.message?._id) return;
    if (!attest) {
      onError("יש לאשר שיש בסיס חוקי לפני אישור הפנייה.");
      return;
    }
    setBusy(true);
    try {
      await gpPatch(`/outreach/${preview.message._id}/draft`, {
        subject: draftSubject,
        bodyHtml: draftHtml,
      });
      const data = await gpPost(`/outreach/${preview.message._id}/approve`, {
        complianceAttestation: true,
      });
      setPreview((p: any) => ({ ...p, message: data.message }));
      onMessage("הפנייה אושרה. שליחה למועמדים עדיין חסומה עד אישור נפרד.");
      if (active?._id) await openThread(active._id);
    } catch (e: any) {
      onError(e?.message || "אישור הפנייה נכשל");
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
        `נשמרה בדיקה פנימית בלבד (ללא מייל למועמד). משימות מעקב: ${data.followUps?.length || 0}`
      );
      await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "שמירת הבדיקה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(next: string) {
    if (!active?._id) return;
    setBusy(true);
    try {
      await gpPatch(`/outreach/candidates/${active._id}/status`, { status: next });
      onMessage(`הסטטוס עודכן ל־${statusLabel(next)}`);
      await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "עדכון הסטטוס נכשל");
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
      onMessage("התגובה נרשמה ידנית.");
      await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "שמירת התגובה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="gp-panel">
        <h2>מרכז פניות</h2>
        <p className="gp-muted">
          מרכז הפניות מציג רק מועמדים שאושרו במפורש לתהליך גיוס ({total}). הכנת טיוטה ואישורה
          אינם הרשאה לשליחה חיה — השליחה נשארת חסומה עד אישור נפרד.
        </p>
        {inbox ? (
          <p className="gp-muted">
            תיבת תגובות:{" "}
            {inbox.connected ? "מחוברת לקליטת תשובות" : "לא מחוברת כרגע — ניתן לרשום תגובות ידנית"}
          </p>
        ) : null}

        <div className="gp-filters">
          <select value={scope} onChange={(e) => setScope(e.target.value as any)}>
            <option value="area">מאושרים למרכז פניות</option>
            <option value="contact">מאושרים עם פרטי קשר</option>
            <option value="ready">מאושרים ומוכנים לשליחה</option>
          </select>
          <input
            placeholder="קוד מדינה (למשל IL)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <select value={track} onChange={(e) => setTrack(e.target.value)}>
            <option value="">כל המסלולים</option>
            {Object.keys(TRACK_LABELS).map((t) => (
              <option key={t} value={t}>
                {trackLabel(t)}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">כל הסטטוסים</option>
            {Object.keys(STATUS_LABELS).map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
          <button type="button" className="gp-btn" disabled={busy} onClick={() => void load()}>
            רענון
          </button>
        </div>

        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                <th>חברה</th>
                <th>מסלול מומלץ</th>
                <th>פרטי קשר</th>
                <th>סטטוס גיוס</th>
                <th>סטטוס פנייה</th>
                <th>פנייה אחרונה</th>
                <th>מעקב</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    אין מועמדים במרכז הפניות. יש לאשר מועמדים ממאגר המועמדים לפני שיופיעו כאן.
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c._id}>
                    <td>
                      {c.companyName}
                      <div className="gp-muted">{c.countryCode || "—"}</div>
                    </td>
                    <td>{trackLabel(c.recommendedTrack)}</td>
                    <td>
                      {[
                        c.businessEmail ? "אימייל" : null,
                        c.businessPhone ? "טלפון" : null,
                        c.contactFormUrl ? "טופס" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "אין"}
                      <div className="gp-muted">{c.businessEmail || ""}</div>
                    </td>
                    <td>{statusLabel(c.recruitmentStatus)}</td>
                    <td>
                      {outreachWorkflowLabel(
                        c.outreachWorkflowStatus || "awaiting_prep"
                      )}
                    </td>
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
        <div
          className="gp-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`פנייה ל־${active.companyName}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div className="gp-drawer">
            <div className="gp-drawer-head">
              <div>
                <h2>ניהול פנייה · {active.companyName}</h2>
                <p className="gp-muted" style={{ margin: "6px 0 0" }}>
                  {active.countryCode || "—"} · {statusLabel(active.recruitmentStatus)} ·{" "}
                  {active.businessEmail || "ללא אימייל"}
                </p>
              </div>
              <button type="button" className="gp-btn gp-btn--ghost" onClick={() => setActive(null)}>
                סגור
              </button>
            </div>

            <div className="gp-section">
              <h3>פרטי חברה ואיש קשר</h3>
              <dl className="gp-dl">
                <dt>חברה</dt>
                <dd>{active.companyName}</dd>
                <dt>אתר</dt>
                <dd>
                  {active.website ? (
                    <a href={active.website} target="_blank" rel="noreferrer">
                      {active.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
                <dt>אימייל</dt>
                <dd>{active.businessEmail || "—"}</dd>
                <dt>טלפון</dt>
                <dd>{active.businessPhone || "—"}</dd>
                <dt>מסלול מומלץ</dt>
                <dd>{trackLabel(chosenTrack)}</dd>
              </dl>
            </div>

            <div className="gp-section">
              <h3>הכנת פנייה</h3>
              {!active.businessEmail ? (
                <p className="gp-muted">
                  אין אימייל למועמד זה. ניתן לעדכן פרטי קשר בפרופיל, לרשום תגובה ידנית, או לעדכן
                  סטטוס — אך לא ניתן להכין טיוטת מייל לפני שיש כתובת.
                </p>
              ) : null}
              <div className="gp-form">
                <label>
                  מסלול לתבנית
                  <select value={chosenTrack} onChange={(e) => setChosenTrack(e.target.value)}>
                    {(templates.length
                      ? templates.map((t) => t.track)
                      : Object.keys(TRACK_LABELS)
                    ).map((t) => (
                      <option key={t} value={t}>
                        {trackLabel(t)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  שפת הטיוטה
                  <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                    <option value="he">עברית</option>
                    <option value="en">אנגלית</option>
                  </select>
                </label>
                <label>
                  סטטוס גיוס
                  <select
                    value={active.recruitmentStatus}
                    onChange={(e) => void updateStatus(e.target.value)}
                  >
                    {Object.keys(STATUS_LABELS).map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="gp-actions">
                <button
                  type="button"
                  className="gp-btn"
                  disabled={busy || !active.businessEmail}
                  onClick={() => void doPreview()}
                >
                  {preview ? "רענון טיוטה מתבנית" : "הכנת פנייה חדשה"}
                </button>
              </div>

              {preview?.message ? (
                <div className="gp-preview-box">
                  <label>
                    נושא
                    <input
                      value={draftSubject}
                      onChange={(e) => setDraftSubject(e.target.value)}
                      style={{ width: "100%", marginTop: 6 }}
                    />
                  </label>
                  <label style={{ display: "block", marginTop: 10 }}>
                    גוף ההודעה (לעריכה)
                    <textarea
                      rows={10}
                      value={draftHtml}
                      onChange={(e) => setDraftHtml(e.target.value)}
                      style={{ width: "100%", marginTop: 6 }}
                    />
                  </label>
                  <p className="gp-muted" style={{ marginTop: 8 }}>
                    תצוגה מקדימה:
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: draftHtml }} />
                  <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                    <input
                      type="checkbox"
                      checked={attest}
                      onChange={(e) => setAttest(e.target.checked)}
                    />
                    אני מאשר/ת שיש בסיס חוקי לפנייה. פרסום אימייל באתר אינו הסכמה כשלעצמו.
                  </label>
                  <div className="gp-actions">
                    <button
                      type="button"
                      className="gp-btn"
                      disabled={busy || preview.message.status === "sent"}
                      onClick={() => void saveDraft()}
                    >
                      שמור טיוטה
                    </button>
                    <button
                      type="button"
                      className="gp-btn"
                      disabled={busy || preview.message.status === "sent"}
                      onClick={() => void doApprove()}
                    >
                      אישור פנייה
                    </button>
                    <button
                      type="button"
                      className="gp-btn gp-btn--ghost"
                      disabled={busy || preview.message.status !== "approved"}
                      onClick={() => void doSendDryRun()}
                    >
                      שמירת בדיקה פנימית (ללא שליחה למועמד)
                    </button>
                  </div>
                </div>
              ) : (
                <p className="gp-muted" style={{ marginTop: 10 }}>
                  אם אין פנייה קיימת — לחצו על «הכנת פנייה חדשה» כדי ליצור טיוטה.
                </p>
              )}
            </div>

            <div className="gp-section">
              <h3>היסטוריית הודעות ותשובות</h3>
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
                          <td>{directionLabel(m.direction)}</td>
                          <td>
                            {messageStatusLabel(m.status)}
                            {m.dryRun ? " · בדיקה פנימית" : ""}
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

            <div className="gp-section">
              <h3>משימות מעקב</h3>
              {(thread?.followUps || []).length === 0 ? (
                <p className="gp-muted">אין משימות מעקב.</p>
              ) : (
                <ul>
                  {(thread?.followUps || []).map((t: any) => (
                    <li key={t._id}>
                      {t.title} · {t.status} ·{" "}
                      {t.dueAt ? new Date(t.dueAt).toLocaleDateString("he-IL") : "—"}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="gp-section">
              <h3>רישום תגובה ידנית</h3>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="הדביקו כאן תגובה שהתקבלה מחוץ למערכת"
                style={{ width: "100%" }}
              />
              <label style={{ display: "block", marginTop: 8 }}>
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
                <button
                  type="button"
                  className="gp-btn"
                  disabled={busy || !replyText.trim()}
                  onClick={() => void saveManualReply()}
                >
                  שמור תגובה
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
