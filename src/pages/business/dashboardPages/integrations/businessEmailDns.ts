import i18n from "../../../../i18n/i18n";

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
            i18n.t("leftover.emailDns.recordType", "{{index}}. Type: {{type}}", {
              index: index + 1,
              type: record.type || "TXT",
            }),
            i18n.t("leftover.emailDns.recordHost", "Name / Host: {{name}}", {
              name: record.name || "",
            }),
            i18n.t("leftover.emailDns.recordValue", "Value: {{value}}", {
              value: record.value || "",
            }),
          ];
      if (record.priority) {
        lines.push(
          labels
            ? labels.recordPriority.replace("{{priority}}", record.priority)
            : i18n.t("leftover.emailDns.recordPriority", "Priority: {{priority}}", {
                priority: record.priority,
              })
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
    i18n.t("leftover.emailDns.title", "Bizuply sender verification instructions"),
    "",
    i18n.t("leftover.emailDns.domain", "Domain: {{domain}}", { domain }),
    i18n.t("leftover.emailDns.email", "Sender address: {{email}}", { email }),
    i18n.t("leftover.emailDns.name", "Sender name: {{name}}", { name }),
    "",
    i18n.t("leftover.emailDns.addDns", "Add the following DNS records at your domain provider:"),
    "",
    recordBlocks ||
      i18n.t(
        "leftover.emailDns.noRecords",
        "No records are available right now. Try refreshing the verification screen."
      ),
    "",
    i18n.t(
      "leftover.emailDns.after",
      'After adding the records, the business owner can click "Check verification" in Bizuply.'
    ),
  ].join("\n");
}
