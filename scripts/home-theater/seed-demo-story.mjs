/**
 * Seeds the isolated staging demo business with the homepage story leads.
 * Does not call Meta, does not send WhatsApp or SMS, and does not delete
 * leads that were already in the account.
 *
 * Synthetic records use example.com and demo- lead ids. They are not live
 * Meta deliveries.
 */
const API = "https://server-staging-15bb.up.railway.app/api";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const ORIGIN = "https://mybusiness-platform-client-staging.vercel.app";

const ACCIDENTAL = [
  { id: "6af34fe2673b21a04b13f341", name: "PROBE" },
  { id: "6af35091673b21a04b13f369", name: "שירה מזרחי" },
];

const heForms = [
  ["CRM לעסקים — נובמבר", "בקשת הדגמה אישית"],
  ["ניהול לקוחות ולידים", "קבלת פרטים על המערכת"],
  ["אוטומציות לעסקים", "בקשת ייעוץ"],
  ["WhatsApp לעסקים", "קבלת הצעת מחיר"],
];
const enForms = [
  ["CRM for Growing Businesses", "Book a Personal Demo"],
  ["Lead Management Solutions", "Request Information"],
  ["Business Automation", "Request a Consultation"],
  ["WhatsApp Business Solutions", "Get a Quote"],
];

const hePeople = [
  ["שירה מזרחי", "shira.mizrahi", "new", "אשמח להדגמה אישית של מערכת ניהול הלקוחות."],
  ["נועה לוי", "noa.levy", "contacted", "אשמח לקבל פרטים על ניהול הלידים במערכת."],
  ["אור כהן", "or.cohen", "interested", "נשמח לייעוץ על אוטומציות לעסק."],
  ["מאיה אברהם", "maya.abraham", "quote", "אבקש הצעת מחיר לחיבור WhatsApp."],
  ["ליאור ישראלי", "lior.israeli", "in_progress", "אשמח להדגמה אישית לצוות המכירות."],
  ["רוני ברק", "roni.barak", "negotiation", "נשמח להבין איך מנהלים את הלידים במערכת."],
  ["יעל פרץ", "yael.peretz", "contacted", "אשמח לייעוץ קצר על האוטומציה."],
  ["איתי חדד", "itay.hadad", "interested", "אבקש הצעת מחיר לחשבון WhatsApp עסקי."],
  ["מיכל דהן", "michal.dahan", "quote", "אשמח לפרטים על המערכת לעסק שלי."],
  ["עדי ביטון", "adi.biton", "in_progress", "נשמח להדגמה אישית בשבוע הקרוב."],
  ["הילה גולן", "hila.golan", "new", "אשמח לייעוץ על קליטת לידים."],
  ["תומר אביב", "tomer.aviv", "contacted", "אבקש לקבל פרטים והצעת מחיר."],
];
const enPeople = [
  ["Olivia Parker", "olivia.parker", "new", "I'd like to book a personal demo of the customer management system."],
  ["James Anderson", "james.anderson", "contacted", "Please send information about lead management."],
  ["Sophia Bennett", "sophia.bennett", "interested", "I'd like a consultation on business automation."],
  ["Emma Collins", "emma.collins", "quote", "Please send a quote for WhatsApp Business."],
  ["Daniel Brooks", "daniel.brooks", "in_progress", "I'd like a personal demo for our sales team."],
  ["Emily Thompson", "emily.thompson", "negotiation", "Please share information about managing incoming leads."],
  ["Hannah Reed", "hannah.reed", "contacted", "I'd like a short consultation on automation."],
  ["Michael Turner", "michael.turner", "interested", "Please send a quote for a WhatsApp business account."],
  ["Grace Walker", "grace.walker", "quote", "I'd like information about the system for my company."],
  ["Nathan Price", "nathan.price", "in_progress", "I'd like to book a personal demo this week."],
  ["Chloe Murphy", "chloe.murphy", "new", "I'd like a consultation on capturing new leads."],
  ["Ethan Hughes", "ethan.hughes", "contacted", "Please send information and a quote."],
];

function rowsFor(people, forms, prefix, note, hourOffset) {
  return people.map(([name, slug, status, message], index) => {
    const [campaignName, formName] = forms[index % forms.length];
    const phone = `${prefix}${String(101 + index).padStart(4, "0")}`;
    const createdAt = new Date(Date.UTC(2026, 10, 10, 6 + hourOffset, 0, 0) + index * 7 * 60 * 1000).toISOString();
    return {
      name,
      phone,
      email: `${slug}@example.com`,
      status,
      source: "meta_lead_ads",
      message,
      campaignName,
      formName,
      leadId: `demo-lead-${slug.replace(".", "-")}`,
      createdAt,
      activityNote: note,
    };
  });
}

const hebrew = rowsFor(
  hePeople,
  heForms,
  "+97250555",
  "ליד דמו לסיור במוצר. לא התקבל מ-Meta בפועל.",
  3
);
const english = rowsFor(
  enPeople,
  enForms,
  "+1212555",
  "Demo lead for the product tour. Not delivered by Meta.",
  0
);
const wanted = process.env.SEED_LANG === "he" ? hebrew : process.env.SEED_LANG === "en" ? english : [...english, ...hebrew];

const login = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: ORIGIN },
  body: JSON.stringify({
    email: "customer-free-demo@bizuply.test",
    password: "DemoCustomer#2026",
  }),
});
const session = await login.json();
if (!login.ok || !session.accessToken) {
  console.error("login failed", login.status);
  process.exit(1);
}
if (session.user?.businessId && session.user.businessId !== BIZ && session.businessId && session.businessId !== BIZ) {
  console.error("refusing to write: login is not the isolated demo business");
  process.exit(1);
}
const headers = {
  Authorization: `Bearer ${session.accessToken}`,
  "Content-Type": "application/json",
  "x-business-id": BIZ,
  Origin: ORIGIN,
};

async function getLead(id) {
  const response = await fetch(`${API}/crm/leads/${id}`, { headers });
  const body = await response.json();
  return body.lead || body;
}

async function removeIds(ids) {
  if (!ids.length) return;
  const response = await fetch(`${API}/crm/workspace/leads/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify({ confirm: true, action: "delete", leadIds: ids }),
  });
  const body = await response.json().catch(() => ({}));
  console.log("removed", response.status, body.updated || body.message || body);
}

for (const item of ACCIDENTAL) {
  const lead = await getLead(item.id).catch(() => null);
  if (lead && lead.name === item.name && String(lead.businessId) === BIZ) {
    await removeIds([item.id]);
  }
}

const existing = await fetch(`${API}/crm/leads/my?limit=100&page=1`, { headers });
const existingBody = await existing.json();
const have = new Set((existingBody.leads || []).map((lead) => String(lead.email || "").toLowerCase()));
const pending = wanted.filter((row) => !have.has(row.email));
console.log("pending", pending.length, "already", have.size);

const imported = await fetch(`${API}/crm/workspace/leads/import`, {
  method: "POST",
  headers,
  body: JSON.stringify({ rows: pending }),
});
const importedBody = await imported.json();
console.log("import", imported.status, importedBody.created, importedBody.errors?.length || 0);
if (!imported.ok || !importedBody.leadIds?.length && pending.length) {
  console.error(JSON.stringify(importedBody).slice(0, 500));
  process.exit(1);
}

const created = importedBody.leadIds || [];
const sampleId = created[0];
const sample = sampleId ? await getLead(sampleId) : null;
const campaign = sample?.facebook?.campaignName || sample?.campaignName || "";
const form = sample?.facebook?.formName || sample?.formName || "";
console.log("sample", sample?.name, sample?.source, sample?.provider, campaign, form, sample?.phone);
if (!campaign || !form || sample?.source !== "meta_lead_ads") {
  console.error("staging import did not store campaign, form, and Meta source. Removing this run only.");
  await removeIds(created);
  process.exit(2);
}

const report = [];
for (const id of created) {
  const lead = await getLead(id);
  report.push({
    id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    source: lead.source,
    provider: lead.provider,
    status: lead.status,
    campaign: lead.facebook?.campaignName || "",
    form: lead.facebook?.formName || "",
    leadId: lead.facebook?.leadId || lead.externalLeadId || "",
  });
}
console.log(JSON.stringify(report, null, 2));
