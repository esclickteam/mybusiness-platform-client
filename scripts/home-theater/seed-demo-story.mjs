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

const existing = await fetch(`${API}/crm/workspace/leads?limit=200&page=1`, { headers });
const existingBody = await existing.json();
const have = new Set(
  (existingBody.leads || [])
    .filter((lead) => lead.testData && (lead.tags || []).includes("homepage-demo"))
    .map((lead) => String(lead.externalLeadId || ""))
);
const pending = wanted.filter((row) => !have.has(row.leadId));
console.log("pending", pending.length, "marked", have.size);

let created = [];
if (pending.length) {
  const imported = await fetch(`${API}/crm/workspace/leads/import`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rows: pending }),
  });
  const importedBody = await imported.json();
  console.log("import", imported.status, "created", importedBody.created, "existing", importedBody.existing || 0, "errors", importedBody.errors?.length || 0);
  if (!imported.ok) {
    console.error(JSON.stringify(importedBody).slice(0, 500));
    process.exit(1);
  }
  created = importedBody.createdLeadIds || importedBody.leadIds || [];
}

const listed = await fetch(`${API}/crm/workspace/leads?limit=200&page=1`, { headers });
const listedBody = await listed.json();
const markedLeads = (listedBody.leads || []).filter((lead) => lead.testData && (lead.tags || []).includes("homepage-demo"));
const byExternal = new Map(markedLeads.map((lead) => [String(lead.externalLeadId || ""), lead]));
const problems = [];
for (const row of wanted) {
  const lead = byExternal.get(row.leadId);
  if (!lead) {
    problems.push(`${row.email} missing`);
    continue;
  }
  const full = await getLead(lead._id);
  const hebrew = /[\u0590-\u05ff]/.test(row.name);
  const phoneOk = hebrew ? String(full.phone || "").startsWith("+972") : String(full.phone || "").startsWith("+1");
  const nameOk = hebrew ? /[\u0590-\u05ff]/.test(full.name) && !/[A-Za-z]/.test(full.name) : /^[A-Za-z .'-]+$/.test(full.name);
  const marked = full.testData === true && Array.isArray(full.tags) && full.tags.includes("homepage-demo") && String(full.externalLeadId || "").startsWith("demo-");
  if (!phoneOk || !nameOk || !marked || full.source !== "meta_lead_ads" || full.facebook?.campaignName !== row.campaignName || full.facebook?.formName !== row.formName || full.status !== row.status) {
    problems.push(`${row.name} phone=${full.phone} source=${full.source} campaign=${full.facebook?.campaignName} form=${full.facebook?.formName} status=${full.status} marked=${marked} nameOk=${nameOk}`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  console.error("removing only the leads created in this run");
  await removeIds(created);
  process.exit(2);
}
console.log("verified", wanted.length, "demo leads");
