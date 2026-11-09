/** Hebrew labels for Owner Review blockers + fitness evidence (display only). */

export const BLOCKER_LABELS_HE: Record<string, string> = {
  expansion_marketing_copy_not_owner_approved: "נוסח השיווק טרם אושר על ידי הבעלים",
  owner_attestation_missing: "חסרה הצהרת בעלים ידנית",
  message_not_owner_approved_to_send: "ההודעה טרם אושרה לשליחה עתידית",
  compliance_allowed_false: "בסיס חוקי לפנייה עדיין לא מאושר",
  sendApprovalStatus_not_approved: "אין אישור שליחה חי (שלב נפרד)",
  firstbase_vendor_permission_missing: "חסר אישור ספק Firstbase לכתובת הדואר",
  postal_address_missing_from_draft: "כתובת דואר חסרה בטיוטה",
  unsubscribe_missing_from_draft: "מנגנון הסרה (UNSUBSCRIBE) חסר בטיוטה",
  outreach_suppressed: "המועמד מסומן כחסום לפנייה",
  "GLOBAL_PARTNERS_PRODUCTION_SEND_ENABLED=0": "שליחה חיה כבויה בסביבת Production",
  "GLOBAL_PARTNERS_OUTREACH_DRY_RUN=1": "מצב בדיקה פנימית פעיל (DRY_RUN) — אין שליחה למועמד",
  pilot_mailbox_named_unverified_deliverability_unproven:
    "תיבת המייל אינה מאומתת ידנית (אספקה לא הוכחה)",
  named_mailbox_not_proven_personal: "התיבה אינה מוכחת כתיבה אישית של איש הקשר",
  mailbox_not_manual_verified: "התיבה לא אומתה ידנית",
  "compliance:owner_attestation_required": "נדרשת הצהרת בעלים לפני אישור",
};

export function blockerLabelHe(code: string): string {
  if (BLOCKER_LABELS_HE[code]) return BLOCKER_LABELS_HE[code];
  if (code.startsWith("GLOBAL_PARTNERS_")) {
    return `חסימת מערכת: ${code}`;
  }
  if (code.startsWith("compliance:")) {
    return `חסם ציות: ${code.replace(/^compliance:/, "")}`;
  }
  return code;
}

export type EvidenceItem = {
  id: string;
  labelHe: string;
  state: "verified" | "not_verified" | "owner_decision";
  detailHe?: string;
};

/** Technical facts vs Owner decisions — never framed as legal approval. */
export function buildAttestationEvidence(review: any): {
  verified: EvidenceItem[];
  notVerified: EvidenceItem[];
  ownerDecision: EvidenceItem[];
} {
  const f = review?.fitness || {};
  const recipient = review?.recipient || {};
  const verified: EvidenceItem[] = [];
  const notVerified: EvidenceItem[] = [];
  const ownerDecision: EvidenceItem[] = [];

  if (f.emailPubliclyPublished) {
    verified.push({
      id: "email_published",
      labelHe: "כתובת מייל עסקית פורסמה באתר החברה",
      state: "verified",
      detailHe:
        "פרסום באתר אינו מוכיח בעלות אישית על התיבה ואינו הסכמה לשיווק כשלעצמו.",
    });
  } else {
    notVerified.push({
      id: "email_published",
      labelHe: "לא אומת פרסום ציבורי של כתובת המייל",
      state: "not_verified",
    });
  }

  if (f.unsubscribeInDraft) {
    verified.push({
      id: "unsub",
      labelHe: "מנגנון הסרה (UNSUBSCRIBE) מופיע בטיוטה",
      state: "verified",
    });
  } else {
    notVerified.push({
      id: "unsub",
      labelHe: "מנגנון הסרה חסר בטיוטה",
      state: "not_verified",
    });
  }

  if (f.postalInDraft) {
    verified.push({
      id: "postal",
      labelHe: "כתובת דואר פיזית מופיעה בטיוטה",
      state: "verified",
    });
  } else {
    notVerified.push({
      id: "postal",
      labelHe: "כתובת דואר חסרה בטיוטה",
      state: "not_verified",
    });
  }

  if (f.firstbaseVendorPermission) {
    verified.push({
      id: "firstbase",
      labelHe: "אישור ספק Firstbase לשימוש בכתובת Mailroom בכותרת תחתונה מסחרית",
      state: "verified",
      detailHe: "אישור ספק בלבד — אינו חוות דעת משפטית ואינו הצהרת בעלים.",
    });
  } else {
    notVerified.push({
      id: "firstbase",
      labelHe: "אין אישור ספק Firstbase רשום",
      state: "not_verified",
    });
  }

  if (f.senderIdentity) {
    verified.push({
      id: "sender",
      labelHe: "זהות שולח רשמית מוגדרת בטיוטה",
      state: "verified",
      detailHe: String(f.senderIdentity),
    });
  }

  if (f.personLinkedToMailbox) {
    verified.push({
      id: "person_link",
      labelHe: "הוכח קישור אדם↔תיבת מייל",
      state: "verified",
    });
  } else {
    notVerified.push({
      id: "person_link",
      labelHe: "לא הוכח שזו תיבה אישית מאומתת של איש הקשר",
      state: "not_verified",
      detailHe:
        "כתובת עסקית שפורסמה באתר אינה בהכרח תיבה אישית של אדם ספציפי.",
    });
  }

  if (f.manualVerified) {
    verified.push({
      id: "manual_mailbox",
      labelHe: "תיבת המייל אומתה ידנית",
      state: "verified",
    });
  } else {
    notVerified.push({
      id: "manual_mailbox",
      labelHe: "תיבת המייל לא אומתה ידנית (אספקה לא הוכחה)",
      state: "not_verified",
      detailHe: [recipient.emailClass, f.deliverability].filter(Boolean).join(" · "),
    });
  }

  ownerDecision.push({
    id: "lawful_basis",
    labelHe: "החלטת בעלים: האם יש בסיס חוקי מספיק לפנייה למועמד זה",
    state: "owner_decision",
    detailHe:
      "בדיקות טכניות לעיל אינן אישור משפטי. הצהרת הבעלים היא החלטה אנושית נפרדת.",
  });
  ownerDecision.push({
    id: "recipient_ok",
    labelHe: "החלטת בעלים: האם הנמען והנוסח מתאימים לשליחה עתידית",
    state: "owner_decision",
  });
  if (!review?.marketingCopyApproved && review?.needsCopyApproval) {
    ownerDecision.push({
      id: "copy_first",
      labelHe: "נדרש קודם אישור נוסח שיווקי נפרד",
      state: "owner_decision",
    });
  }

  return { verified, notVerified, ownerDecision };
}

export function gateStepStatusHe(done: boolean, pendingLabel: string): string {
  return done ? "הושלם" : pendingLabel;
}
