import React, { useCallback, useEffect, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import {
  directionLabel,
  messageStatusLabel,
  outreachWorkflowLabel,
  ownerGateLabel,
  statusLabel,
  trackLabel,
  TRACK_LABELS,
  STATUS_LABELS,
} from "./copy";
import { buildOwnerReviewFallback } from "./ownerReviewGate";
import {
  blockerLabelHe,
  buildAttestationEvidence,
  gateStepStatusHe,
} from "./ownerReviewLabels";

type Props = {
  onError: (msg: string) => void;
  onMessage: (msg: string) => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
  openCandidateId?: string | null;
  onOpenCandidateHandled?: () => void;
};

function gateClass(key?: string) {
  if (key === "ready_to_send") return "gp-gate gp-gate--ready";
  if (key === "awaiting_copy_approval") return "gp-gate gp-gate--copy";
  if (key === "awaiting_owner_attestation") return "gp-gate gp-gate--attest";
  return "gp-gate gp-gate--blocked";
}

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
  const [ownerReview, setOwnerReview] = useState<any>(null);
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
    const raw = data.items || [];
    // Enrich list rows when Production API predates ownerReview fields.
    const enriched = raw.map((c: any) => {
      if (c.ownerReview?.gateKey) return c;
      const draftStub = c.latestDraft
        ? {
            _id: c.latestDraft.id,
            status: c.latestDraft.status,
            subject: c.latestDraft.subject,
            toEmail: c.latestDraft.toEmail,
            toName: c.latestDraft.toName,
            bodyHtml: "",
            variables: {
              marketingCopyApproved: c.partnerFit?.marketingCopyApproved,
              ownerAttestationRecorded: c.partnerFit?.ownerAttestationRecorded,
              usOutreachCohort: c.partnerFit?.usOutreachCohort,
              firstbaseMailroomPermissionApproved:
                c.partnerFit?.firstbaseMailroomPermissionApproved,
              firstbaseMailroomPermission: c.partnerFit?.firstbaseMailroomPermission,
            },
            compliance: { allowed: false },
          }
        : null;
      const ownerReview = buildOwnerReviewFallback(c, draftStub);
      return {
        ...c,
        ownerReview,
        ownerGateStatus: ownerReview.gateKey,
        ownerGateLabelHe: ownerReview.gateLabelHe,
      };
    });
    setItems(enriched);
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
      const review =
        data.ownerReview ||
        data.candidate?.ownerReview ||
        buildOwnerReviewFallback(data.candidate, editable || null);
      setOwnerReview(review);
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
      if (active?._id) await openThread(active._id);
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

  async function doApproveCopy() {
    if (!preview?.message?._id) return;
    setBusy(true);
    try {
      await gpPatch(`/outreach/${preview.message._id}/draft`, {
        subject: draftSubject,
        bodyHtml: draftHtml,
      });
      const data = await gpPost(`/outreach/${preview.message._id}/approve-copy`, {
        approved: true,
        note: "Owner approved marketing wording only. Does NOT authorize live send or attestation.",
      });
      setPreview((p: any) => ({ ...p, message: data.message }));
      setOwnerReview(data.ownerReview || null);
      onMessage("נוסח השיווק אושר. עדיין נדרשת הצהרת בעלים ידנית — אין שליחה.");
      if (active?._id) await openThread(active._id);
      await load();
    } catch (e: any) {
      onError(e?.message || "אישור הנוסח נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function doApprove() {
    if (!preview?.message?._id) return;
    if (ownerReview?.needsCopyApproval && !ownerReview?.marketingCopyApproved) {
      onError("יש לאשר את נוסח השיווק לפני הצהרת הבעלים.");
      return;
    }
    if (!attest) {
      onError("יש לאשר את הצהרת הבעלים הידנית לפני אישור הפנייה.");
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
      onMessage("הפנייה אושרה לאחר הצהרה ידנית. שליחה למועמדים עדיין חסומה עד אישור נפרד.");
      if (active?._id) await openThread(active._id);
      await load();
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

  const review = ownerReview;

  return (
    <div>
      <div className="gp-panel">
        <h2>מרכז פניות</h2>
        <p className="gp-muted">
          מרכז הפניות מציג רק מועמדים שאושרו במפורש לתהליך גיוס ({total}). לחצו «בדיקה ואישור»
          לסקירת נוסח מלאה. הכנת טיוטה ואישורה אינם הרשאה לשליחה חיה.
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
                <th className="gp-desktop-only">מסלול מומלץ</th>
                <th className="gp-desktop-only">פרטי קשר</th>
                <th className="gp-desktop-only">סטטוס אישור</th>
                <th className="gp-desktop-only">סטטוס פנייה</th>
                <th className="gp-desktop-only">פנייה אחרונה</th>
                <th className="gp-desktop-only">מעקב</th>
                <th className="gp-desktop-only">פעולה</th>
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
                      <div className="gp-mobile-only gp-mobile-row-meta">
                        <span className={gateClass(c.ownerGateStatus || c.ownerReview?.gateKey)}>
                          {c.ownerGateLabelHe ||
                            ownerGateLabel(c.ownerGateStatus || c.ownerReview?.gateKey) ||
                            "—"}
                        </span>
                        <div className="gp-muted gp-ltr" dir="ltr">
                          {c.businessEmail || ""}
                        </div>
                        <button
                          type="button"
                          className="gp-btn gp-btn--review"
                          onClick={() => void openThread(c._id)}
                        >
                          בדיקה ואישור
                        </button>
                      </div>
                    </td>
                    <td className="gp-desktop-only">{trackLabel(c.recommendedTrack)}</td>
                    <td className="gp-desktop-only">
                      {[
                        c.businessEmail ? "אימייל" : null,
                        c.businessPhone ? "טלפון" : null,
                        c.contactFormUrl ? "טופס" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "אין"}
                      <div className="gp-muted gp-ltr" dir="ltr">
                        {c.businessEmail || ""}
                      </div>
                    </td>
                    <td className="gp-desktop-only">
                      <span className={gateClass(c.ownerGateStatus || c.ownerReview?.gateKey)}>
                        {c.ownerGateLabelHe ||
                          ownerGateLabel(c.ownerGateStatus || c.ownerReview?.gateKey) ||
                          "—"}
                      </span>
                    </td>
                    <td className="gp-desktop-only">
                      {outreachWorkflowLabel(
                        c.outreachWorkflowStatus || "awaiting_prep"
                      )}
                    </td>
                    <td className="gp-desktop-only">
                      {c.lastOutreach?.at
                        ? new Date(c.lastOutreach.at).toLocaleString("he-IL")
                        : "—"}
                    </td>
                    <td className="gp-desktop-only">
                      {c.nextFollowUpAt
                        ? new Date(c.nextFollowUpAt).toLocaleDateString("he-IL")
                        : "—"}
                    </td>
                    <td className="gp-desktop-only">
                      <button
                        type="button"
                        className="gp-btn gp-btn--review"
                        onClick={() => void openThread(c._id)}
                      >
                        בדיקה ואישור
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
          aria-label={`בדיקה ואישור · ${active.companyName}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div className="gp-drawer">
            <div className="gp-drawer-head">
              <div>
                <h2>בדיקה ואישור · {active.companyName}</h2>
                <p className="gp-muted" style={{ margin: "6px 0 0" }}>
                  {active.countryCode || "—"} · {statusLabel(active.recruitmentStatus)} ·{" "}
                  <span className="gp-ltr" dir="ltr">
                    {active.businessEmail || "ללא אימייל"}
                  </span>
                </p>
                {review ? (
                  <span className={gateClass(review.gateKey)} style={{ marginTop: 8 }}>
                    {review.gateLabelHe || ownerGateLabel(review.gateKey)}
                  </span>
                ) : null}
              </div>
              <button type="button" className="gp-btn gp-btn--ghost" onClick={() => setActive(null)}>
                סגור
              </button>
            </div>

            {review ? (
              <div className="gp-section gp-section--review">
                <h3>מסך בדיקת בעלים</h3>
                {(() => {
                  const evidence = buildAttestationEvidence(review);
                  const messageApproved =
                    preview?.message?.status === "approved" ||
                    Boolean(review.ownerAttestationRecorded && preview?.message?.compliance?.allowed);
                  return (
                    <>
                <dl className="gp-dl">
                  <dt>נמען</dt>
                  <dd>
                    {review.recipient?.toName || "—"}
                    <div className="gp-muted gp-ltr" dir="ltr">
                      {review.recipient?.toEmail || "—"}
                    </div>
                    <p className="gp-note">
                      כתובת מייל עסקית שפורסמה באתר אינה בהכרח כתובת אישית מאומתת של איש הקשר.
                    </p>
                  </dd>
                  <dt>מקור כתובת המייל</dt>
                  <dd>
                    {review.recipient?.emailSource ? (
                      <a
                        className="gp-ltr"
                        dir="ltr"
                        href={review.recipient.emailSource}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {review.recipient.emailSource}
                      </a>
                    ) : (
                      "—"
                    )}
                    <div className="gp-muted">
                      {[review.recipient?.emailMethod, review.recipient?.emailClass]
                        .filter(Boolean)
                        .join(" · ") || ""}
                    </div>
                    {review.recipient?.recipientNote ? (
                      <div className="gp-muted" style={{ marginTop: 4 }}>
                        {review.recipient.recipientNote}
                      </div>
                    ) : null}
                  </dd>
                  <dt>כתובת Firstbase מאושרת לספק</dt>
                  <dd>
                    <div className="gp-ltr gp-address" dir="ltr">
                      {(review.firstbaseAddress?.lines || []).map((line: string) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                    <div className="gp-muted" style={{ marginTop: 6 }}>
                      {review.firstbaseAddress?.note}
                    </div>
                    <div className="gp-muted gp-ltr" dir="ltr" style={{ marginTop: 4 }}>
                      vendor={review.firstbaseAddress?.agentName || "—"} ·{" "}
                      {review.firstbaseAddress?.approvedAt || "—"} · commercialFooterApproved=
                      {review.firstbaseAddress?.commercialFooterApproved ? "true" : "false"} (
                      {review.firstbaseAddress?.commercialFooterApprovedMeaning})
                    </div>
                  </dd>
                </dl>

                <h4 className="gp-subhead">סטטוס בדיקות כשירות (טכני בלבד)</h4>
                <p className="gp-note">
                  רשימה זו מתארת ממצאים טכניים. היא אינה אישור משפטי ואינה מחליפה הצהרת בעלים.
                </p>
                <ul className="gp-checklist">
                  <li>
                    מייל עסקי פורסם בציבור:{" "}
                    {review.fitness?.emailPubliclyPublished ? "כן" : "לא / לא ידוע"}
                  </li>
                  <li>
                    קישור אדם↔תיבה אישית הוכח:{" "}
                    {review.fitness?.personLinkedToMailbox ? "כן" : "לא"}
                  </li>
                  <li>
                    כיתוב הסרה בטיוטה:{" "}
                    {review.fitness?.unsubscribeInDraft ? "כן" : "חסר"}
                  </li>
                  <li>
                    כתובת דואר בטיוטה: {review.fitness?.postalInDraft ? "כן" : "חסר"}
                  </li>
                  <li>
                    אישור ספק Firstbase:{" "}
                    {review.fitness?.firstbaseVendorPermission ? "כן" : "לא"}
                  </li>
                  <li>
                    שולח רשמי:{" "}
                    <span className="gp-ltr" dir="ltr">
                      {review.fitness?.senderIdentity || "—"}
                    </span>
                  </li>
                  <li>
                    סיווג תיבה / אספקה:{" "}
                    <span className="gp-ltr" dir="ltr">
                      {[review.fitness?.mailboxClass, review.fitness?.deliverability]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </span>
                    {review.fitness?.manualVerified ? " · אומת ידנית" : " · לא אומת ידנית"}
                  </li>
                </ul>

                <h4 className="gp-subhead">נושא ותוכן מלא</h4>
                <div className="gp-preview-box gp-preview-box--ltr" dir="ltr">
                  <div className="gp-mail-subject">
                    <span className="gp-mail-label">Subject</span>
                    <div>{draftSubject || review.draft?.subject || "—"}</div>
                  </div>
                  <div
                    className="gp-mail-body"
                    dangerouslySetInnerHTML={{
                      __html: draftHtml || review.draft?.bodyHtml || "<p>—</p>",
                    }}
                  />
                  <p className="gp-mail-hint">
                    Full draft including signature and unsubscribe — display only; content not edited
                    here unless you save below.
                  </p>
                </div>

                <div className="gp-gate-steps">
                  <div className="gp-gate-step">
                    <div className="gp-gate-step__head">
                      <h4>1. אישור נוסח</h4>
                      <span
                        className={
                          review.marketingCopyApproved ? "gp-gate gp-gate--ready" : "gp-gate gp-gate--copy"
                        }
                      >
                        {gateStepStatusHe(
                          Boolean(review.marketingCopyApproved),
                          "ממתין לאישור נוסח"
                        )}
                      </span>
                    </div>
                    <p className="gp-muted">
                      {review.needsCopyApproval
                        ? review.marketingCopyApproved
                          ? "נוסח השיווק אושר. שלב זה אינו כולל הצהרת בעלים ואינו מאשר שליחה."
                          : "נדרש אישור נוסח מפורש לפני הצהרת בעלים."
                        : "נוסח זה מסומן כמאושר (טייס / אישור קודם)."}
                    </p>
                    <div className="gp-actions gp-actions--sticky">
                      <button
                        type="button"
                        className="gp-btn"
                        disabled={
                          busy ||
                          !preview?.message?._id ||
                          preview.message.status === "sent" ||
                          Boolean(review.marketingCopyApproved)
                        }
                        onClick={() => void doApproveCopy()}
                      >
                        {review.marketingCopyApproved ? "נוסח אושר" : "אישור נוסח שיווקי"}
                      </button>
                    </div>
                  </div>

                  <div className="gp-gate-step">
                    <div className="gp-gate-step__head">
                      <h4>2. הצהרת בעלים</h4>
                      <span
                        className={
                          review.ownerAttestationRecorded
                            ? "gp-gate gp-gate--ready"
                            : "gp-gate gp-gate--attest"
                        }
                      >
                        {gateStepStatusHe(
                          Boolean(review.ownerAttestationRecorded),
                          "ממתין להצהרת בעלים"
                        )}
                      </span>
                    </div>
                    <p className="gp-note">
                      בדיקות טכניות אינן אישור משפטי. ההצהרה היא החלטה ידנית של הבעלים בלבד.
                    </p>
                    <div className="gp-evidence">
                      <h5>מה אומת בפועל</h5>
                      <ul>
                        {evidence.verified.map((item) => (
                          <li key={item.id}>
                            <strong>{item.labelHe}</strong>
                            {item.detailHe ? (
                              <div className="gp-muted">{item.detailHe}</div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                      <h5>מה עדיין לא אומת</h5>
                      <ul>
                        {evidence.notVerified.length === 0 ? (
                          <li className="gp-muted">אין פריטים פתוחים בקטגוריה זו.</li>
                        ) : (
                          evidence.notVerified.map((item) => (
                            <li key={item.id}>
                              <strong>{item.labelHe}</strong>
                              {item.detailHe ? (
                                <div className="gp-muted">{item.detailHe}</div>
                              ) : null}
                            </li>
                          ))
                        )}
                      </ul>
                      <h5>מה נדרש להחלטת הבעלים</h5>
                      <ul>
                        {evidence.ownerDecision.map((item) => (
                          <li key={item.id}>
                            <strong>{item.labelHe}</strong>
                            {item.detailHe ? (
                              <div className="gp-muted">{item.detailHe}</div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <label className="gp-attest">
                      <input
                        type="checkbox"
                        checked={attest}
                        onChange={(e) => setAttest(e.target.checked)}
                      />
                      <span>
                        אני מאשר/ת ידנית שיש בסיס חוקי לפנייה למועמד זה. פרסום אימייל באתר אינו
                        הסכמה כשלעצמו, ואינו מוכיח תיבה אישית מאומתת. הצהרה זו אינה מאשרת שליחה
                        חיה ואינה משנה את מתגי הבטיחות (SEND=0 / DRY_RUN=1).
                      </span>
                    </label>
                  </div>

                  <div className="gp-gate-step">
                    <div className="gp-gate-step__head">
                      <h4>3. אישור הודעה לשליחה עתידית</h4>
                      <span
                        className={
                          messageApproved ? "gp-gate gp-gate--ready" : "gp-gate gp-gate--blocked"
                        }
                      >
                        {gateStepStatusHe(Boolean(messageApproved), "ממתין לאישור הודעה")}
                      </span>
                    </div>
                    <p className="gp-muted">
                      אישור ההודעה שומר אותה כמאושרת במערכת בלבד. שליחה חיה נשארת חסומה כל עוד
                      SEND=0 ו־DRY_RUN=1.
                    </p>
                    <div className="gp-actions gp-actions--sticky">
                      <button
                        type="button"
                        className="gp-btn gp-btn--review"
                        disabled={
                          busy ||
                          !preview?.message?._id ||
                          preview.message.status === "sent" ||
                          (review.needsCopyApproval && !review.marketingCopyApproved) ||
                          !attest ||
                          Boolean(messageApproved)
                        }
                        onClick={() => void doApprove()}
                      >
                        {messageApproved
                          ? "ההודעה אושרה לשליחה עתידית"
                          : "אישור הודעה לשליחה עתידית"}
                      </button>
                    </div>
                  </div>
                </div>

                <h4 className="gp-subhead">חסימות שנותרו</h4>
                {(review.remainingBlockers || []).length === 0 ? (
                  <p className="gp-muted">אין חסימות רשומות.</p>
                ) : (
                  <ul className="gp-blockers">
                    {(review.remainingBlockers || []).map((b: string) => (
                      <li key={b}>
                        <span>{blockerLabelHe(b)}</span>
                        <code className="gp-blocker-code gp-ltr" dir="ltr">
                          {b}
                        </code>
                      </li>
                    ))}
                  </ul>
                )}
                    </>
                  );
                })()}
              </div>
            ) : null}

            <div className="gp-section">
              <h3>פרטי חברה ואיש קשר</h3>
              <dl className="gp-dl">
                <dt>חברה</dt>
                <dd>{active.companyName}</dd>
                <dt>אתר</dt>
                <dd>
                  {active.website ? (
                    <a
                      className="gp-ltr"
                      dir="ltr"
                      href={active.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {active.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
                <dt>אימייל</dt>
                <dd className="gp-ltr" dir="ltr">
                  {active.businessEmail || "—"}
                </dd>
                <dt>טלפון</dt>
                <dd className="gp-ltr" dir="ltr">
                  {active.businessPhone || "—"}
                </dd>
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
                      className="gp-ltr"
                      dir="ltr"
                      value={draftSubject}
                      onChange={(e) => setDraftSubject(e.target.value)}
                      style={{ width: "100%", marginTop: 6, textAlign: "left" }}
                    />
                  </label>
                  <label style={{ display: "block", marginTop: 10 }}>
                    גוף ההודעה (לעריכה)
                    <textarea
                      className="gp-ltr"
                      dir="ltr"
                      rows={10}
                      value={draftHtml}
                      onChange={(e) => setDraftHtml(e.target.value)}
                      style={{ width: "100%", marginTop: 6, textAlign: "left" }}
                    />
                  </label>
                  <p className="gp-muted" style={{ marginTop: 8 }}>
                    תצוגה מקדימה:
                  </p>
                  <div
                    className="gp-mail-body gp-ltr"
                    dir="ltr"
                    dangerouslySetInnerHTML={{ __html: draftHtml }}
                  />
                  <div className="gp-actions gp-actions--sticky">
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
