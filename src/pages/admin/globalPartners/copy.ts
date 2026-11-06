export const STATUS_LABELS: Record<string, string> = {
  discovered: "אותר",
  pending_review: "ממתין לבדיקה",
  approved_for_outreach: "אושר לפנייה",
  outreach_sent: "נשלחה פנייה",
  response_received: "התקבלה תגובה",
  interested: "מתעניין",
  negotiation: "משא ומתן",
  proposal_sent: "נשלחה הצעה",
  agreement_signed: "נחתם הסכם",
  active_partner: "שותף פעיל",
  rejected: "לא רלוונטי / נדחה",
};

export const TRACK_LABELS: Record<string, string> = {
  affiliate: "Affiliate",
  business_partner: "Business Partner",
  reseller: "Reseller",
  white_label: "White Label",
  exclusive_territory: "בלעדיות טריטוריאלית",
  referral_strategic: "הפניה / אסטרטגי",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] || status || "—";
}
