const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;
const MANAGED_ID_RE = /^[A-Z0-9]+_MANAGED$/;

export function isHumanContactLabel(value?: string | null) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (OBJECT_ID_RE.test(text)) return false;
  if (MANAGED_ID_RE.test(text)) return false;
  if (/^customer:/i.test(text)) return false;
  if (/^\d{8,}$/.test(text)) return false;
  if (text === "ללא שם" || /^unknown$/i.test(text)) return false;
  return true;
}

export type ConversationIdentity = {
  saved: boolean;
  title: string;
  person: string;
  phone: string;
  profileName: string;
};

export function conversationIdentity(row: {
  contactSaved?: boolean;
  companyName?: string | null;
  contactPersonName?: string | null;
  whatsappProfileName?: string | null;
  name?: string | null;
  phone?: string | null;
}): ConversationIdentity {
  const phone = String(row.phone || "").trim();
  const company = isHumanContactLabel(row.companyName) ? String(row.companyName).trim() : "";
  const person = isHumanContactLabel(row.contactPersonName)
    ? String(row.contactPersonName).trim()
    : "";
  const profile = isHumanContactLabel(row.whatsappProfileName)
    ? String(row.whatsappProfileName).trim()
    : isHumanContactLabel(row.name)
      ? String(row.name).trim()
      : "";

  if (row.contactSaved && (company || person)) {
    return {
      saved: true,
      title: company || person,
      person: company ? person : "",
      phone,
      profileName: profile,
    };
  }

  return {
    saved: false,
    title: profile || phone,
    person: "",
    phone: profile ? phone : "",
    profileName: profile,
  };
}
