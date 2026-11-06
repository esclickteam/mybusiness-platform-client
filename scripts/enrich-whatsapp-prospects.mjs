#!/usr/bin/env node
/**
 * Enrich the 200-row prospect list with company LinkedIn, public contact paths,
 * a role to approach, and a personalized English message. Does not send mail.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = JSON.parse(readFileSync(path.join(root, "docs/whatsapp-api-sales/prospects.json"), "utf8"));

/** LinkedIn company slugs keyed by hostname (no www). Not person profiles. */
const SLUG = {
  "make.com": "make-",
  "n8n.io": "n8n",
  "zapier.com": "zapier",
  "makeitfuture.com": "makeitfuture",
  "genbia.com": "genbia",
  "samifysolutions.com": "samify-solutions",
  "octo360.agency": "octo360",
  "mo.agency": "mo-agency",
  "latenode.com": "latenode",
  "pabbly.com": "pabbly",
  "integrately.com": "integrately",
  "albato.com": "albato",
  "konnectzit.com": "konnectzit",
  "syncspider.com": "syncspider",
  "skyvia.com": "skyvia",
  "workato.com": "workato",
  "tray.ai": "tray-ai",
  "boeisto.com": "boeisto",
  "hike.digital": "hike-digital",
  "joinpavilion.com": "pavilion",
  "automationaide.com": "automation-aide",
  "processdriven.co": "processdriven",
  "unito.io": "unito",
  "bardeen.ai": "bardeen",
  "relay.app": "relay-app",
  "activepieces.com": "activepieces",
  "windmill.dev": "windmill",
  "budibase.com": "budibase",
  "appsmith.com": "appsmith",
  "retool.com": "retool",
  "gadget.dev": "gadget",
  "stackerhq.com": "stacker",
  "softr.io": "softr",
  "fillout.com": "fillout",
  "tally.so": "tally-so",
  "typeform.com": "typeform",
  "jotform.com": "jotform",
  "landbot.io": "landbot",
  "manychat.com": "manychat",
  "respond.io": "respond-io",
  "trengo.com": "trengo",
  "richpanel.com": "richpanel",
  "gorgias.com": "gorgias",
  "zendesk.com": "zendesk",
  "freshworks.com": "freshworks",
  "helpscout.com": "help-scout",
  "crisp.chat": "crisp",
  "tidio.com": "tidio",
  "livechat.com": "livechat",
  "chatwoot.com": "chatwoot",
  "360dialog.com": "360dialog",
  "bird.com": "bird",
  "twilio.com": "twilio",
  "vonage.com": "vonage",
  "infobip.com": "infobip",
  "gupshup.io": "gupshup",
  "wati.io": "watiglobal",
  "aisensy.com": "aisensy",
  "interakt.ai": "heyinterakt",
  "gallabox.com": "gallabox",
  "doubletick.io": "doubletick",
  "timelines.ai": "timelinesai",
  "wazzup24.com": "wazzup",
  "chatfuel.com": "chatfuel",
  "turn.io": "turn-io",
  "clickatell.com": "clickatell",
  "africastalking.com": "africa-s-talking",
  "routemobile.com": "route-mobile",
  "kaleyra.com": "kaleyra",
  "sinch.com": "sinch",
  "hubspot.com": "hubspot",
  "salesforce.com": "salesforce",
  "pipedrive.com": "pipedrive",
  "zoho.com": "zoho",
  "monday.com": "mondaydotcom",
  "close.com": "close.io",
  "copper.com": "copper",
  "attio.com": "attio",
  "folk.app": "folk-app",
  "lemlist.com": "lemlist",
  "instantly.ai": "instantly-ai",
  "apollo.io": "apolloio",
  "outreach.io": "outreach",
  "salesloft.com": "salesloft",
  "gong.io": "gong-io",
  "zoominfo.com": "zoominfo",
  "capsulecrm.com": "capsule",
  "lessannoyingcrm.com": "less-annoying-crm",
  "teamgate.com": "teamgate",
  "nutshell.com": "nutshell",
  "keap.com": "keap",
  "activecampaign.com": "activecampaign",
  "klaviyo.com": "klaviyo",
  "omnisend.com": "omnisend",
  "yotpo.com": "yotpo",
  "smile.io": "smile-io",
  "rechargepayments.com": "recharge-payments",
  "stay.ai": "stay-ai",
  "skio.com": "skio",
  "gett.com": "gett",
  "fiverr.com": "fiverr",
  "wix.com": "wix-com",
  "elementor.com": "elementor",
  "papayaglobal.com": "papaya-global",
  "payoneer.com": "payoneer",
  "deel.com": "deel",
  "remote.com": "remotecom",
  "meliopayments.com": "melio",
  "pagaya.com": "pagaya",
  "hippo.com": "hippo-insurance",
  "lemonade.com": "lemonade-insurance",
  "nextinsurance.com": "next-insurance",
  "policybazaar.com": "policybazaar",
  "acko.com": "acko",
  "razorpay.com": "razorpay",
  "paytm.com": "paytm",
  "phonepe.com": "phonepe",
  "mercadolibre.com": "mercado-libre",
  "nubank.com.br": "nubank",
  "ifood.com.br": "ifood",
  "rappi.com": "rappi",
  "pedidosya.com": "pedidosya",
  "glovoapp.com": "glovo",
  "wolt.com": "wolt",
  "doordash.com": "doordash",
  "uber.com": "uber",
  "booking.com": "booking.com",
  "partner.booking.com": "booking.com",
  "airbnb.com": "airbnb",
  "expediapartnercentral.com": "expedia",
  "hostelworld.com": "hostelworld",
  "getyourguide.com": "getyourguide",
  "viator.com": "viator",
  "klook.com": "klook",
  "traveloka.com": "traveloka",
  "makemytrip.com": "makemytrip",
  "cleartrip.com": "cleartrip",
  "elal.com": "el-al",
  "issta.co.il": "issta",
  "lametayel.co.il": "lametayel",
  "arkia.co.il": "arkia",
  "isrotel.co.il": "isrotel",
  "fattal-hotels.com": "fattal-hotels",
  "danhotels.com": "dan-hotels-israel",
  "malam-team.com": "malamteam",
  "matrix.co.il": "matrix-it",
  "one1.co.il": "one1",
  "hilan.co.il": "hilan",
  "digitalent.co.il": "digitalent",
  "web3.co.il": "web3",
  "kozmedia.com": "kozmedia",
  "runa.co.il": "runa",
  "convert.co.il": "convert",
  "avela.co.il": "avela",
  "bizzabo.com": "bizzabo",
  "melingo.co.il": "melingo",
  "anyword.com": "anyword",
  "similarweb.com": "similarweb",
  "walkme.com": "walkme",
  "appsflyer.com": "appsflyer",
  "unity.com": "unity",
  "moonactive.com": "moon-active",
  "playtika.com": "playtika",
  "outbrain.com": "outbrain",
  "taboola.com": "taboola",
  "riskified.com": "riskified",
  "forter.com": "forter",
  "global-e.com": "global-e",
  "vaynermedia.com": "vaynermedia",
  "omd.com": "omd",
  "groupm.com": "groupm",
  "publicissapient.com": "publicis-sapient",
  "accenture.com": "accenture",
  "deloittedigital.com": "deloitte-digital",
  "pwc.com": "pwc",
  "kpmg.com": "kpmg",
  "capgemini.com": "capgemini",
  "thoughtworks.com": "thoughtworks",
  "epam.com": "epam-systems",
  "globant.com": "globant",
  "endava.com": "endava",
  "nagarro.com": "nagarro",
  "cognizant.com": "cognizant",
  "tcs.com": "tata-consultancy-services",
  "infosys.com": "infosys",
  "wipro.com": "wipro",
  "hcltech.com": "hcltech",
  "persistent.com": "persistent-systems",
  "razorfish.com": "razorfish",
  "rga.com": "r-ga",
  "akqa.com": "akqa",
  "hugeinc.com": "huge",
  "frog.co": "frog-design",
  "ideo.com": "ideo",
  "brainstation.io": "brainstation",
  "generalassemb.ly": "general-assembly",
  "ustwo.com": "ustwo",
};

/** Public business contacts only. No personal registry emails. */
const PUBLIC_CONTACT = {
  "make.com": { email: "support@make.com", contactUrl: "https://www.make.com/en/contact", emailStatus: "public_support" },
  "n8n.io": { email: "hello@n8n.io", contactUrl: "https://n8n.io/contact/", emailStatus: "public_on_site" },
  "zapier.com": { contactUrl: "https://zapier.com/l/contact", emailStatus: "contact_form_only" },
  "makeitfuture.com": {
    email: "contact@makeitfuture.com",
    contactUrl: "https://www.makeitfuture.com/contact",
    phone: "+44 1992 932808 / +40 733 090 090",
    emailStatus: "public_on_site",
  },
  "genbia.com": { contactUrl: "https://genbia.com/contact", emailStatus: "contact_form_only" },
  "mo.agency": { contactUrl: "https://www.mo.agency/contact", emailStatus: "contact_form_only" },
  "twilio.com": { contactUrl: "https://www.twilio.com/en-us/help/sales", emailStatus: "sales_form" },
  "hubspot.com": { contactUrl: "https://www.hubspot.com/company/contact", emailStatus: "contact_form_only" },
  "pipedrive.com": { contactUrl: "https://www.pipedrive.com/en/contact", emailStatus: "contact_form_only" },
  "wati.io": { email: "hello@wati.io", contactUrl: "https://www.wati.io/en/contact-us/", emailStatus: "public_on_site" },
  "gallabox.com": { email: "team@gallabox.com", contactUrl: "https://gallabox.com/contact", emailStatus: "public_on_site" },
  "interakt.ai": { email: "hello@interakt.ai", contactUrl: "https://www.interakt.ai/contact", emailStatus: "public_on_site" },
  "danhotels.com": { email: "incoming@danhotels.com", contactUrl: "https://www.danhotels.com/ContactUs", emailStatus: "public_on_site" },
  "super-pharm.co.il": { email: "customers@super-pharm.co.il", contactUrl: "https://www.super-pharm.co.il", emailStatus: "public_on_site" },
  "gupshup.io": { contactUrl: "https://www.gupshup.io/contact-us", emailStatus: "contact_form_only" },
  "bird.com": { contactUrl: "https://bird.com/contact", emailStatus: "contact_form_only" },
  "infobip.com": { contactUrl: "https://www.infobip.com/contact", emailStatus: "contact_form_only" },
  "klaviyo.com": { contactUrl: "https://www.klaviyo.com/contact-sales", emailStatus: "sales_form" },
  "gorgias.com": { contactUrl: "https://www.gorgias.com/contact-us", emailStatus: "contact_form_only" },
  "zendesk.com": { contactUrl: "https://www.zendesk.com/contact/", emailStatus: "sales_form" },
  "elementor.com": { contactUrl: "https://elementor.com/contact/", emailStatus: "contact_form_only" },
  "wix.com": { contactUrl: "https://www.wix.com/partners", emailStatus: "partner_program" },
  "issta.co.il": { contactUrl: "https://www.issta.co.il/contact", emailStatus: "contact_form_only" },
  "landbot.io": { email: "hello@landbot.io", contactUrl: "https://landbot.io/contact", emailStatus: "public_on_site" },
  "manychat.com": { contactUrl: "https://manychat.com/contact", emailStatus: "contact_form_only" },
  "respond.io": { contactUrl: "https://respond.io/contact/", emailStatus: "contact_form_only" },
  "trengo.com": { contactUrl: "https://trengo.com/contact", emailStatus: "contact_form_only" },
  "crisp.chat": { email: "hello@crisp.chat", contactUrl: "https://crisp.chat/en/contact/", emailStatus: "public_on_site" },
  "chatwoot.com": { email: "hello@chatwoot.com", contactUrl: "https://www.chatwoot.com/contact-us", emailStatus: "public_on_site" },
  "helpscout.com": { contactUrl: "https://www.helpscout.com/contact/", emailStatus: "contact_form_only" },
  "360dialog.com": { contactUrl: "https://www.360dialog.com/contact", emailStatus: "contact_form_only" },
  "aisensy.com": { email: "hello@aisensy.com", contactUrl: "https://aisensy.com/contact-us", emailStatus: "public_on_site" },
  "retool.com": { contactUrl: "https://retool.com/contact", emailStatus: "contact_form_only" },
  "appsmith.com": { contactUrl: "https://www.appsmith.com/contact", emailStatus: "contact_form_only" },
  "fattal-hotels.com": { contactUrl: "https://www.fattal-hotels.com/contact-us/", emailStatus: "contact_form_only" },
  "isrotel.co.il": { contactUrl: "https://www.isrotel.co.il/contact/", emailStatus: "contact_form_only" },
  "elal.com": { contactUrl: "https://www.elal.com/en/contact-us", emailStatus: "contact_form_only" },
  "sinch.com": { contactUrl: "https://www.sinch.com/contact-us/", emailStatus: "sales_form" },
  "vonage.com": { contactUrl: "https://www.vonage.com/contact-us/", emailStatus: "sales_form" },
  "salesforce.com": { contactUrl: "https://www.salesforce.com/form/contact/contactme/", emailStatus: "sales_form" },
  "deel.com": { contactUrl: "https://www.deel.com/contact/", emailStatus: "contact_form_only" },
  "remote.com": { contactUrl: "https://remote.com/contact", emailStatus: "contact_form_only" },
  "tidio.com": { contactUrl: "https://www.tidio.com/contact/", emailStatus: "contact_form_only" },
  "livechat.com": { contactUrl: "https://www.livechat.com/contact/", emailStatus: "contact_form_only" },
  "clickatell.com": { contactUrl: "https://www.clickatell.com/contact-us/", emailStatus: "contact_form_only" },
  "turn.io": { email: "hello@turn.io", contactUrl: "https://www.turn.io/contact", emailStatus: "public_on_site" },
  "chatfuel.com": { contactUrl: "https://chatfuel.com/contact", emailStatus: "contact_form_only" },
  "typeform.com": { contactUrl: "https://www.typeform.com/help/contact/", emailStatus: "contact_form_only" },
  "jotform.com": { contactUrl: "https://www.jotform.com/contact/", emailStatus: "contact_form_only" },
  "accenture.com": { contactUrl: "https://www.accenture.com/us-en/about/contact-us", emailStatus: "contact_form_only" },
  "epam.com": { contactUrl: "https://www.epam.com/about/who-we-are/contact", emailStatus: "contact_form_only" },
};

/** Named people from company team/about/press pages. Person LinkedIn only when the URL was already public. */
const PEOPLE = {
  "zapier.com": [
    { name: "Wade Foster", title: "Co-founder & CEO", roleType: "agency_owner", linkedin: null, source: "https://zapier.com" },
  ],
  "n8n.io": [
    {
      name: "Jan Oberhauser",
      title: "Founder & CEO",
      roleType: "agency_owner",
      linkedin: "https://www.linkedin.com/in/janoberhauser",
      source: "https://n8n.io/press/",
    },
  ],
  "makeitfuture.com": [
    {
      name: "Tiberiu Socaci",
      title: "CEO & Co-founder",
      roleType: "agency_owner",
      linkedin: null,
      source: "https://www.makeitfuture.com/team",
    },
    {
      name: "Jean-Luc Goutagny",
      title: "Business Development Director",
      roleType: "business_development",
      linkedin: null,
      source: "https://www.makeitfuture.com/team",
    },
    {
      name: "Paul Hamill",
      title: "UK Business Development",
      roleType: "business_development",
      linkedin: null,
      source: "https://www.makeitfuture.com/team",
    },
  ],
  "gallabox.com": [
    {
      name: "Karthik Jagannathan",
      title: "CEO & Co-founder",
      roleType: "agency_owner",
      linkedin: null,
      source: "https://gallabox.com/about",
    },
    {
      name: "Yogesh Narayanan",
      title: "CTO & Co-founder",
      roleType: "agency_owner",
      linkedin: null,
      source: "https://gallabox.com/about",
    },
  ],
  "wati.io": [
    { name: "Bianca Ho", title: "Co-founder", roleType: "agency_owner", linkedin: null, source: "https://www.peakxv.com/companies/wati" },
    { name: "Ken Yeung", title: "Co-founder", roleType: "agency_owner", linkedin: null, source: "https://www.peakxv.com/companies/wati" },
  ],
  "aisensy.com": [
    {
      name: "Gautam Rajesh Shelley",
      title: "Founder & CEO",
      roleType: "agency_owner",
      linkedin: "https://www.linkedin.com/in/gautam-rajesh-shelley",
      source: "https://www.linkedin.com/in/gautam-rajesh-shelley",
    },
  ],
  "interakt.ai": [
    {
      name: "Ahshad Jussawala",
      title: "CEO (Jio Haptik / Interakt)",
      roleType: "sales_lead",
      linkedin: "https://www.linkedin.com/in/ahshad-jussawalla",
      source: "https://www.linkedin.com/in/ahshad-jussawalla",
    },
  ],
  "landbot.io": [
    { name: "Jiaqi Pan", title: "Co-founder & CEO", roleType: "agency_owner", linkedin: null, source: "https://landbot.io/author/jiaqi-pan" },
    { name: "Cris Villar", title: "Co-founder & VP Customer Success", roleType: "sales_lead", linkedin: null, source: "https://landbot.io/ungated-conversations/ai-development-co-founder-cris-villar" },
  ],
  "manychat.com": [
    { name: "Mike Yan", title: "Co-founder & CEO", roleType: "agency_owner", linkedin: null, source: "https://manychat.com/about" },
    { name: "Antony Gorin", title: "Co-founder & Chief Architect", roleType: "agency_owner", linkedin: null, source: "https://manychat.com/about" },
  ],
  "respond.io": [
    { name: "Gerardo Salandra", title: "Co-founder & CEO", roleType: "agency_owner", linkedin: null, source: "https://respond.io/about" },
    { name: "Iaroslav Kudritskiy", title: "Co-founder & COO", roleType: "business_development", linkedin: null, source: "https://respond.io/about" },
  ],
  "crisp.chat": [
    { name: "Baptiste Jamin", title: "Co-founder & CEO", roleType: "agency_owner", linkedin: null, source: "https://crisp.chat" },
  ],
  "chatwoot.com": [
    { name: "Pranav Raj", title: "Co-founder & CEO", roleType: "agency_owner", linkedin: null, source: "https://www.ycombinator.com/companies/chatwoot" },
    { name: "Sojan Jose", title: "Co-founder & CTO", roleType: "agency_owner", linkedin: null, source: "https://www.ycombinator.com/companies/chatwoot" },
  ],
};

const ROLE = {
  automation_agency: "Founder / Head of Delivery",
  whatsapp_implementer: "WhatsApp / Messaging lead",
  sales_team: "VP Sales or Head of Revenue Operations",
  high_volume_inbox: "Head of Customer Experience or Contact Center",
};

function hostOf(website) {
  return new URL(website).hostname.replace(/^www\./, "");
}

function linkedinCompany(website, company) {
  const host = hostOf(website);
  if (SLUG[host]) return `https://www.linkedin.com/company/${SLUG[host]}/`;
  return {
    url: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company)}`,
    note: `No verified company slug; search by name. Host hint: ${host}`,
  };
}

function subject(row) {
  if (row.segment === "automation_agency") return `${row.company}: WhatsApp Cloud API for the systems you already ship`;
  if (row.segment === "whatsapp_implementer") return `${row.company}: $29/number Cloud API workspaces for client WABAs`;
  if (row.segment === "sales_team") return `${row.company}: a shared WhatsApp number for the sales team`;
  return `${row.company}: stop losing WhatsApp in a personal chat`;
}

function primaryPerson(host) {
  const list = (PEOPLE[host] || []).filter((p) => p.name);
  return list[0] || null;
}

function message(row, person) {
  const role = ROLE[row.segment];
  const greeting = person ? person.name.split(" ")[0] : role.split(" / ")[0].split(" or ")[0];
  return `Hi ${greeting},

I am writing to ${row.company} because ${row.why}

Bizuply WhatsApp API uses Meta Embedded Signup. The Bizuply subscription is $29 per month per connected number. Meta messaging fees are billed by Meta, separately, to the WhatsApp Business Account. There is no trial.

What $29 covers: one number, REST API, signed status webhooks, templates, inbox, dashboard. Customer replies stay in the Bizuply inbox (not on the webhook yet). Each extra number is another $29 workspace. There is no agency console or combined multi-number view yet.

Guides: https://whatsapp.bizuply.com/guides
Pricing (Meta calculator, billed separately): https://whatsapp.bizuply.com/pricing
Start: https://whatsapp.bizuply.com/get-started

If this is not the right desk, I would appreciate a pointer to ${person ? `${person.title} or ${role}` : role}.

Ido, Bizuply
support@bizuply.com`;
}

const rows = src.rows.map((row) => {
  const host = hostOf(row.website);
  const li = linkedinCompany(row.website, row.company);
  const pub = PUBLIC_CONTACT[host] || {
    email: null,
    contactUrl: row.website,
    emailStatus: "company_site_only",
  };
  const people = (PEOPLE[host] || []).filter((p) => p.name);
  const person = primaryPerson(host);
  const linkedinCompanyUrl = typeof li === "string" ? li : li.url;
  const linkedinNote = typeof li === "string" ? "Company page slug from public brand mapping." : li.note;
  return {
    ...row,
    targetRole: person ? person.title : ROLE[row.segment],
    namedContacts: people,
    linkedinCompany: linkedinCompanyUrl,
    linkedinPerson: person?.linkedin || null,
    linkedinPersonStatus: person?.linkedin
      ? "public_profile_url_from_press_or_linkedin_company_page"
      : people.length
        ? "name_from_company_team_page — person URL not claimed without a public link"
        : "not_claimed — no personal profile scraped",
    email: pub.email || null,
    emailStatus: pub.emailStatus,
    contactUrl: pub.contactUrl || row.website,
    phone: pub.phone || null,
    outreachSubject: subject(row),
    outreachMessage: message(row, person),
    verification: {
      website: "public_homepage",
      linkedin: typeof li === "string" ? "company_slug_mapped" : "company_search_only",
      email: pub.email ? "published_on_or_widely_listed" : "use_contact_page",
      person: people.length ? "named_on_company_or_press_page" : "role_only",
      mailed: false,
    },
    linkedinNote,
    doNotSendUntilApproved: true,
  };
});

const out = {
  generatedAt: new Date().toISOString(),
  count: rows.length,
  priceUsdPerNumber: 29,
  doNotMailUntilApproved: true,
  contactHonesty:
    "Company LinkedIn URLs are mapped where the slug is known. Named people are taken from company team/about/press pages. Person LinkedIn URLs are included only when that URL was already public. Emails are included only when publicly listed. No message was sent.",
  rows,
};
const dir = path.join(root, "docs/whatsapp-api-sales");
writeFileSync(path.join(dir, "prospects-enriched.json"), JSON.stringify(out, null, 2));
const header = "id,company,website,country,segment,targetRole,namedContacts,email,emailStatus,linkedinCompany,linkedinPerson,contactUrl,phone,outreachSubject\n";
const csv =
  header +
  rows
    .map((r) =>
      [
        r.id,
        r.company,
        r.website,
        r.country,
        r.segment,
        r.targetRole,
        JSON.stringify((r.namedContacts || []).map((p) => `${p.name} (${p.title})`).join("; ")),
        r.email || "",
        r.emailStatus,
        r.linkedinCompany,
        r.linkedinPerson || "",
        r.contactUrl,
        r.phone || "",
        JSON.stringify(r.outreachSubject),
      ].join(",")
    )
    .join("\n");
writeFileSync(path.join(dir, "prospects-enriched.csv"), csv);
const mapped = rows.filter((r) => r.verification.linkedin === "company_slug_mapped").length;
const emailed = rows.filter((r) => r.email).length;
const phoned = rows.filter((r) => r.phone).length;
const named = rows.filter((r) => (r.namedContacts || []).length).length;
const personLi = rows.filter((r) => r.linkedinPerson).length;
const bySeg = Object.fromEntries(["automation_agency", "whatsapp_implementer", "sales_team", "high_volume_inbox"].map((s) => [s, rows.filter((r) => r.segment === s).length]));
console.log(JSON.stringify({ count: rows.length, linkedinCompanyMapped: mapped, publicEmails: emailed, publicPhones: phoned, rowsWithNamedPeople: named, publicPersonLinkedin: personLi, bySegment: bySeg }, null, 2));
