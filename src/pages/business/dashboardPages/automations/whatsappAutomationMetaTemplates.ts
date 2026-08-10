export type WaDefaultMapping = {
  variable: string;
  source: string;
  field: string;
  required?: boolean;
};

export const BLUEPRINT_PREFERRED_META: Record<string, string> = {
  wa_new_lead_welcome: "new_lead_welcome",
  wa_new_lead_owner_alert: "new_lead_received",
  wa_appointment_reminder_1_day: "appointment_reminder",
  wa_appointment_reminder_2_days: "appointment_reminder",
  wa_appointment_reminder_3_days: "appointment_reminder",
  wa_appointment_reminder_2_hours: "appointment_reminder",
  wa_appointment_reminder_1_hour: "appointment_reminder",
  wa_appointment_thanks: "appointment_thanks",
  wa_appointment_review: "appointment_review",
  wa_lead_no_response: "lead_follow_up",
  wa_lead_followup_2: "lead_follow_up_2",
  wa_new_client_welcome: "new_client_welcome",
  wa_inactive_client: "inactive_client",
  wf_lead_multi: "new_lead_welcome",
  wf_lead_wa_email: "new_lead_welcome",
  wf_lead_full_onboarding: "new_lead_welcome",
  wf_lead_no_response_pack: "lead_follow_up",
  wf_new_client_pack: "new_client_welcome",
  wf_appointment_duo: "appointment_reminder",
};

export const WA_DEFAULT_META_MAPPINGS: Record<string, WaDefaultMapping[]> = {
  new_lead_welcome: [{ variable: "1", source: "lead", field: "name" }],
  appointment_reminder: [
    { variable: "1", source: "appointment", field: "clientSnapshot.name" },
    { variable: "2", source: "system", field: "relativeTime" },
    { variable: "3", source: "appointment", field: "time" },
    { variable: "4", source: "appointment", field: "serviceName" },
  ],
  appointment_thanks: [
    { variable: "1", source: "appointment", field: "clientSnapshot.name" },
    { variable: "2", source: "appointment", field: "serviceName" },
  ],
  appointment_review: [
    { variable: "1", source: "appointment", field: "clientSnapshot.name" },
    { variable: "2", source: "appointment", field: "serviceName" },
  ],
  lead_follow_up: [{ variable: "1", source: "lead", field: "name" }],
  lead_follow_up_2: [{ variable: "1", source: "lead", field: "name" }],
  new_client_welcome: [{ variable: "1", source: "contact", field: "fullName" }],
  inactive_client: [{ variable: "1", source: "contact", field: "fullName" }],
  new_lead_received: [
    { variable: "1", source: "lead", field: "name" },
    { variable: "2", source: "lead", field: "phone" },
    { variable: "3", source: "lead", field: "source" },
  ],
};

export const isTestTemplateName = (name: string) =>
  String(name || "").trim().toLowerCase() === "hello_world";

export function formatRelativeTimeHe(hours: number): string {
  if (hours === 1) return "בעוד שעה";
  if (hours === 2) return "בעוד שעתיים";
  if (hours === 24) return "מחר";
  if (hours === 48) return "בעוד יומיים";
  if (hours === 72) return "בעוד 3 ימים";
  return hours < 24
    ? `בעוד ${hours} שעות`
    : `בעוד ${Math.round(hours / 24)} ימים`;
}

export function defaultMappingsForMetaTemplate(name: string) {
  return (WA_DEFAULT_META_MAPPINGS[String(name || "").toLowerCase()] || []).map(
    (mapping) => ({ ...mapping, required: true })
  );
}
