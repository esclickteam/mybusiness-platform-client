/** Client-side Owner review gate (mirrors server buildOwnerReviewGate). */

const FIRSTBASE_LINES = [
  "BizUply LLC",
  "1007 N Orange St, 4th Floor, Suite #4889",
  "Wilmington, DE 19801, USA",
];

export const OWNER_GATE_LABELS_HE: Record<string, string> = {
  awaiting_copy_approval: "ממתין לאישור נוסח",
  awaiting_owner_attestation: "ממתין להצהרת בעלים",
  blocked: "חסום",
  ready_to_send: "מוכן לשליחה",
};

export function buildOwnerReviewFallback(candidate: any, draft: any = null) {
  const pf = candidate?.partnerFit || {};
  const vars = draft?.variables || {};
  const emailChannels = (candidate?.contactChannels || []).filter(
    (ch: any) => ch.type === "email"
  );
  const primaryEmail = String(
    draft?.toEmail || candidate?.businessEmail || emailChannels[0]?.value || ""
  )
    .trim()
    .toLowerCase();
  const emailChannel =
    emailChannels.find(
      (ch: any) => String(ch.value || "").trim().toLowerCase() === primaryEmail
    ) ||
    emailChannels[0] ||
    null;

  const marketingCopyApproved = Boolean(
    pf.marketingCopyApproved || vars.marketingCopyApproved
  );
  const needsCopyApproval =
    Boolean(pf.awaitingOwnerCopyApproval) ||
    Boolean(pf.usOutreachCohort) ||
    Boolean(vars.usOutreachCohort) ||
    (!marketingCopyApproved &&
      (pf.shortlistTag === "owner-review-top10-2026-11-07" ||
        pf.discoveryBatch === "discovery-expansion-2026-11-07"));

  const ownerAttestationRecorded = Boolean(
    vars.ownerAttestationRecorded ||
      (draft?.ownerApprovedAt && draft?.compliance?.allowed) ||
      pf.ownerAttestationRecorded
  );

  const firstbase =
    pf.firstbaseMailroomPermission ||
    vars.firstbaseMailroomPermission ||
    vars.postalAddressProposed?.firstbasePermission ||
    null;
  const firstbaseApproved = Boolean(
    pf.firstbaseMailroomPermissionApproved ||
      vars.firstbaseMailroomPermissionApproved ||
      firstbase?.approved ||
      vars.postalAddressProposed?.commercialFooterApproved
  );
  const postalLines =
    (Array.isArray(vars.postalAddressProposed?.lines) &&
      vars.postalAddressProposed.lines.length &&
      vars.postalAddressProposed.lines) ||
    FIRSTBASE_LINES;

  const fitness = {
    emailPubliclyPublished: Boolean(
      pf.canSpam?.emailPubliclyPublished ?? emailChannel?.sourceUrl
    ),
    personLinkedToMailbox: Boolean(pf.canSpam?.personLinkedToMailbox),
    unsubscribeInDraft: Boolean(
      pf.canSpam?.unsubscribeInDraft ??
        vars.unsubscribePresent ??
        vars.canSpamChecklist?.unsubscribePresent ??
        /unsubscribe/i.test(String(draft?.bodyHtml || draft?.bodyText || ""))
    ),
    postalInDraft: Boolean(
      pf.canSpam?.postalInDraft ??
        vars.canSpamChecklist?.physicalPostalAddressInFooter ??
        /1007 N Orange/i.test(String(draft?.bodyHtml || draft?.bodyText || ""))
    ),
    postalFormatOk: Boolean(
      pf.canSpam?.postalFormatOk ??
        vars.canSpamChecklist?.physicalPostalAddressFormatOk ??
        true
    ),
    firstbaseVendorPermission: firstbaseApproved,
    subjectNonDeceptive: pf.canSpam?.subjectNonDeceptive !== false,
    senderIdentity:
      vars.officialSenderEmail ||
      pf.canSpam?.senderIdentity ||
      "partners@bizuply.com",
    mailboxClass: emailChannel?.emailClass || null,
    deliverability: emailChannel?.deliverability || "unproven",
    manualVerified: emailChannel?.deliverability === "manual_verified",
  };

  const remainingBlockers: string[] = [];
  if (needsCopyApproval && !marketingCopyApproved) {
    remainingBlockers.push("expansion_marketing_copy_not_owner_approved");
  }
  if (!ownerAttestationRecorded) remainingBlockers.push("owner_attestation_missing");
  if (!(draft?.compliance?.allowed && draft?.status === "approved")) {
    remainingBlockers.push("message_not_owner_approved_to_send");
  }
  if (!firstbaseApproved) remainingBlockers.push("firstbase_vendor_permission_missing");
  if (!fitness.postalInDraft) remainingBlockers.push("postal_address_missing_from_draft");
  if (!fitness.unsubscribeInDraft) remainingBlockers.push("unsubscribe_missing_from_draft");
  if (candidate?.outreachSuppressed) remainingBlockers.push("outreach_suppressed");
  remainingBlockers.push("GLOBAL_PARTNERS_PRODUCTION_SEND_ENABLED=0");
  remainingBlockers.push("GLOBAL_PARTNERS_OUTREACH_DRY_RUN=1");
  if (Array.isArray(pf.blockers)) {
    for (const b of pf.blockers) {
      if (b && !remainingBlockers.includes(b)) remainingBlockers.push(b);
    }
  }

  let gateKey = "blocked";
  if (needsCopyApproval && !marketingCopyApproved) {
    gateKey = "awaiting_copy_approval";
  } else if (!ownerAttestationRecorded || draft?.status !== "approved") {
    gateKey = "awaiting_owner_attestation";
  } else if (
    draft?.status === "approved" &&
    draft?.compliance?.allowed &&
    marketingCopyApproved
  ) {
    gateKey = "ready_to_send";
  }

  return {
    gateKey,
    gateLabelHe: OWNER_GATE_LABELS_HE[gateKey] || gateKey,
    needsCopyApproval,
    marketingCopyApproved,
    ownerAttestationRecorded,
    remainingBlockers,
    fitness,
    recipient: {
      toName: draft?.toName || "",
      toEmail: primaryEmail || "",
      emailSource: emailChannel?.sourceUrl || candidate?.website || "",
      emailMethod: emailChannel?.method || "",
      emailClass: emailChannel?.emailClass || "",
      recipientNote: vars.recipientNote || pf.contactVerification?.notes || "",
    },
    draft: draft
      ? {
          id: String(draft._id),
          status: draft.status,
          subject: draft.subject || "",
          bodyHtml: draft.bodyHtml || "",
          bodyText: draft.bodyText || "",
        }
      : null,
    firstbaseAddress: {
      lines: postalLines,
      source: "Firstbase Mailroom",
      commercialFooterApproved: firstbaseApproved,
      commercialFooterApprovedMeaning: "firstbase_vendor_permission_only",
      agentName: firstbase?.agentName || "Alex Murage",
      approvedAt: firstbase?.approvedAt || "2026-11-09",
      note:
        "אישור ספק Firstbase לשימוש בכתובת Mailroom בכותרת תחתונה מסחרית B2B בלבד — אינו אישור משפטי, אינו הצהרת בעלים, ואינו הרשאת שליחה.",
    },
    killSwitches: {
      productionSendEnabled: false,
      dryRun: true,
      send: 0,
    },
  };
}
