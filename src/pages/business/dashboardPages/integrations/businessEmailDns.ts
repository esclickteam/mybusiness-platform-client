export type DnsRecord = {
  type?: string;
  name?: string;
  value?: string;
  priority?: string;
};

export function senderDisplayName(sender: {
  displayName?: string;
  email?: string;
}) {
  return String(sender.displayName || "")
    .replace(/[<>]/g, "")
    .trim() || String(sender.email || "").trim();
}

export function domainFromEmail(email: string) {
  const value = String(email || "").trim().toLowerCase();
  return value.includes("@") ? value.split("@")[1] : "";
}

export type DomainInstructionLabels = {
  title: string;
  domain: string;
  email: string;
  name: string;
  addDns: string;
  noRecords: string;
  after: string;
  recordType: string;
  recordHost: string;
  recordValue: string;
  recordPriority: string;
};

export function buildDomainManagerInstructions(args: {
  domain: string;
  email: string;
  displayName?: string;
  records: DnsRecord[];
  labels?: DomainInstructionLabels;
}) {
  const domain = String(args.domain || "").trim();
  const email = String(args.email || "").trim();
  const name = senderDisplayName({
    displayName: args.displayName,
    email,
  });
  const labels = args.labels;
  const recordBlocks = (args.records || [])
    .map((record, index) => {
      const lines = labels
        ? [
            labels.recordType
              .replace("{{index}}", String(index + 1))
              .replace("{{type}}", record.type || "TXT"),
            labels.recordHost.replace("{{name}}", record.name || ""),
            labels.recordValue.replace("{{value}}", record.value || ""),
          ]
        : [
            `${index + 1}. סוג: ${record.type || "TXT"}`,
            `שם / Host: ${record.name || ""}`,
            `ערך: ${record.value || ""}`,
          ];
      if (record.priority) {
        lines.push(
          labels
            ? labels.recordPriority.replace("{{priority}}", record.priority)
            : `עדיפות: ${record.priority}`
        );
      }
      return lines.join("\n");
    })
    .join("\n\n");

  if (labels) {
    return [
      labels.title,
      "",
      labels.domain.replace("{{domain}}", domain),
      labels.email.replace("{{email}}", email),
      labels.name.replace("{{name}}", name),
      "",
      labels.addDns,
      "",
      recordBlocks || labels.noRecords,
      "",
      labels.after,
    ].join("\n");
  }

  return [
    "הוראות אימות שולח מייל עבור Bizuply",
    "",
    `דומיין: ${domain}`,
    `כתובת שולח: ${email}`,
    `שם שולח: ${name}`,
    "",
    "יש להוסיף את רשומות ה-DNS הבאות אצל ספק הדומיין:",
    "",
    recordBlocks || "אין רשומות זמינות כרגע. נסו לרענן את מסך האימות.",
    "",
    'אחרי הוספת הרשומות, בעל העסק יוכל ללחוץ על "בדיקת אימות" ב-Bizuply.',
  ].join("\n");
}
