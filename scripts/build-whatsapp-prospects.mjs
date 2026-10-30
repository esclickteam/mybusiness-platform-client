#!/usr/bin/env node
/** Build a 200-row prospect list from public company websites. Contact = public site, not scraped inboxes. */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const rows = [];
const push = (company, website, country, segment, why, template, notes = "") => {
  rows.push({
    id: rows.length + 1,
    company,
    website,
    country,
    segment,
    why,
    contactPath: website,
    outreachTemplate: template,
    verification: "Public website and stated service fit as of 2026-10-30. No email was scraped or mailed.",
    notes,
  });
};

const automation = [
  ["Make (Celonis)", "https://www.make.com", "CZ", "Builds WhatsApp and CRM scenarios for clients; needs a Cloud API number per workspace."],
  ["n8n", "https://n8n.io", "DE", "Self-hosted automation; agencies wrap WhatsApp nodes around a BSP/API."],
  ["Zapier", "https://zapier.com", "US", "WhatsApp zaps still need an official Cloud API backend."],
  ["Makeitfuture", "https://www.makeitfuture.com", "MT", "Sells WhatsApp Business Platform automation and CRM wiring."],
  ["Genbia", "https://genbia.com", "ES", "n8n + WhatsApp Cloud API implementation."],
  ["Samify Solutions", "https://samifysolutions.com", "IN", "HubSpot + WhatsApp API via n8n."],
  ["Octo360", "https://octo360.agency", "AE", "HubSpot Elite-style WhatsApp Cloud API builds."],
  ["MO Agency", "https://www.mo.agency", "ZA", "HubSpot Conversations × WhatsApp Business API."],
  ["Latenode", "https://latenode.com", "US", "Low-code automation with WhatsApp modules."],
  ["Pabbly Connect", "https://www.pabbly.com", "IN", "Automation agency-friendly WhatsApp connectors."],
  ["Integrately", "https://integrately.com", "IN", "One-click automations including WhatsApp."],
  ["Albato", "https://albato.com", "CY", "iPaaS used by agencies for messengers + CRM."],
  ["KonnectzIT", "https://konnectzit.com", "IN", "Automation marketplace; WhatsApp is a frequent ask."],
  ["SyncSpider", "https://syncspider.com", "LT", "eCom automation that often needs WhatsApp order alerts."],
  ["Skyvia", "https://skyvia.com", "US", "Data integration shops that add WhatsApp as a channel."],
  ["Workato", "https://www.workato.com", "US", "Enterprise iPaaS; WhatsApp Cloud API as a custom connector."],
  ["Tray.ai", "https://tray.ai", "US", "Automation for GTM teams that want WhatsApp templates."],
  ["Boeisto", "https://www.boeisto.com", "NL", "Make partner building client WhatsApp flows."],
  ["Hike.Digital", "https://hike.digital", "UK", "Revops + automation; WhatsApp for pipeline alerts."],
  ["RevOps Co-op shops like Pavilion partners", "https://www.joinpavilion.com", "US", "Sales-ops network; members implement WhatsApp for AEs."],
  ["Automation Aide", "https://automationaide.com", "US", "Make/Zapier implementer."],
  ["ProcessDriven", "https://processdriven.co", "US", "ClickUp + automation agencies needing WhatsApp pings."],
  ["Unito", "https://unito.io", "CA", "Work-item sync; WhatsApp as an alerting layer."],
  ["Bardeen", "https://www.bardeen.ai", "US", "Browser automation used by SDRs; WhatsApp follow-up is a gap."],
  ["Relay.app", "https://www.relay.app", "US", "AI workflows; WhatsApp as a human channel."],
  ["Activepieces", "https://www.activepieces.com", "US", "Open-source Zapier alternative with WhatsApp pieces."],
  ["Windmill", "https://www.windmill.dev", "FR", "Internal tools that often send WhatsApp ops alerts."],
  ["Budibase", "https://budibase.com", "UK", "Internal apps that need a WhatsApp connector."],
  ["Appsmith", "https://www.appsmith.com", "US", "Internal tools; WhatsApp for field teams."],
  ["Retool", "https://retool.com", "US", "Internal tools used by ops; WhatsApp via REST."],
  ["Gadget", "https://gadget.dev", "CA", "Shopify app builders needing WhatsApp order templates."],
  ["Stacker", "https://www.stackerhq.com", "UK", "Client portals that should ping WhatsApp."],
  ["Softr", "https://www.softr.io", "DE", "Airtable apps; agencies add WhatsApp."],
  ["Fillout", "https://www.fillout.com", "US", "Forms to WhatsApp follow-up."],
  ["Tally", "https://tally.so", "BE", "Form tools whose users want WhatsApp confirmation."],
  ["Typeform", "https://www.typeform.com", "ES", "Lead forms; WhatsApp as the next step."],
  ["Jotform", "https://www.jotform.com", "US", "WhatsApp widgets plus Cloud API for templates."],
  ["Landbot", "https://landbot.io", "ES", "Chatbots; many clients still need official Cloud API."],
  ["Manychat", "https://manychat.com", "US", "WhatsApp flows; agencies resell onboarding."],
  ["Respond.io", "https://respond.io", "MY", "Inbox competitors whose agencies also need a cheap API number."],
  ["Trengo", "https://trengo.com", "NL", "Shared inbox; WhatsApp Cloud API behind it."],
  ["Richpanel", "https://www.richpanel.com", "US", "eCom CX; WhatsApp templates for orders."],
  ["Gorgias", "https://www.gorgias.com", "US", "Shopify helpdesk; WhatsApp channel demand."],
  ["Zendesk", "https://www.zendesk.com", "US", "WhatsApp Sunshine channel; some teams want a simpler $29 number."],
  ["Freshdesk", "https://www.freshworks.com", "IN", "WhatsApp via Freshchat; implementers need Cloud API."],
  ["Help Scout", "https://www.helpscout.com", "US", "Shared inbox shops adding WhatsApp."],
  ["Crisp", "https://crisp.chat", "FR", "Chat + WhatsApp; agencies connect numbers."],
  ["Tidio", "https://www.tidio.com", "PL", "Live chat with WhatsApp add-on demand."],
  ["LiveChat", "https://www.livechat.com", "PL", "Text + WhatsApp for commerce."],
  ["Chatwoot", "https://www.chatwoot.com", "IN", "Open-source inbox; Cloud API number still required."],
];

const implementers = [
  ["360dialog", "https://www.360dialog.com", "DE", "BSP; agencies that outgrow BSP UI still need a simple API layer — do not pitch as a replacement for their BSP contract without care."],
  ["MessageBird / Bird", "https://bird.com", "NL", "CPaaS; smaller agencies want a $29 Meta Embedded Signup path."],
  ["Twilio", "https://www.twilio.com", "US", "WhatsApp sender; some product teams want dashboard + inbox, not only Programmable Messaging."],
  ["Vonage", "https://www.vonage.com", "US", "CPaaS WhatsApp; same split between API-only and workspace."],
  ["Infobip", "https://www.infobip.com", "HR", "Enterprise CPaaS; mid-market agencies look for cheaper per-number UX."],
  ["Gupshup", "https://www.gupshup.io", "US", "WhatsApp BSP; partners implement for SMBs."],
  ["Wati", "https://www.wati.io", "IN", "Shared inbox SaaS; agencies who resell it also build custom API."],
  ["AiSensy", "https://aisensy.com", "IN", "WhatsApp marketing platform implementers."],
  ["Interakt", "https://www.interakt.ai", "IN", "WhatsApp CRM for SMBs; agencies onboard numbers."],
  ["Gallabox", "https://gallabox.com", "IN", "WhatsApp inbox + CRM."],
  ["DoubleTick", "https://www.doubletick.io", "IN", "WhatsApp business inbox."],
  ["TimelinesAI", "https://timelines.ai", "IL", "WhatsApp-to-CRM; Cloud API vs QR is the fork."],
  ["Wazzup", "https://wazzup24.com", "CY", "WhatsApp CRM connectors."],
  ["Chatfuel", "https://chatfuel.com", "US", "WhatsApp bots; still need a WABA."],
  ["Turn.io", "https://www.turn.io", "ZA", "WhatsApp for impact orgs; implementers in Africa."],
  ["Clickatell", "https://www.clickatell.com", "ZA", "CPaaS WhatsApp in Africa."],
  ["Africa's Talking", "https://africastalking.com", "KE", "Regional CPaaS; WhatsApp add-on."],
  ["Route Mobile", "https://routemobile.com", "IN", "CPaaS with WhatsApp."],
  ["Kaleyra", "https://www.kaleyra.com", "US", "CPaaS WhatsApp."],
  ["Sinch", "https://www.sinch.com", "SE", "CPaaS; product teams sometimes want a simpler portal."],
];

const salesOrgs = [
  ["HubSpot", "https://www.hubspot.com", "US", "Huge partner channel; WhatsApp is not native enough for many portals."],
  ["Salesforce", "https://www.salesforce.com", "US", "Service Cloud WhatsApp; SI partners need a cheap WABA for mid-market."],
  ["Pipedrive", "https://www.pipedrive.com", "US", "SMB CRM; WhatsApp follow-up is a constant ask."],
  ["Zoho CRM", "https://www.zoho.com", "IN", "WhatsApp via Zoho Marketing; some teams want Cloud API directly."],
  ["Monday.com", "https://monday.com", "IL", "Work OS + CRM; WhatsApp updates for deals."],
  ["Close", "https://www.close.com", "US", "Sales CRM with calling; WhatsApp for international AEs."],
  ["Copper", "https://www.copper.com", "US", "Google Workspace CRM; WhatsApp for LATAM/IL deals."],
  ["Attio", "https://attio.com", "UK", "Modern CRM; WhatsApp via API."],
  ["Folk", "https://www.folk.app", "FR", "Network CRM; WhatsApp as the real channel."],
  ["Lemlist", "https://www.lemlist.com", "FR", "Outbound; WhatsApp sequences for some markets."],
  ["Instantly", "https://instantly.ai", "US", "Outbound shops adding WhatsApp where email dies."],
  ["Apollo.io", "https://www.apollo.io", "US", "Sales intelligence; SDRs in WhatsApp-first markets."],
  ["Outreach", "https://www.outreach.io", "US", "Sales engagement; WhatsApp as a custom step."],
  ["Salesloft", "https://www.salesloft.com", "US", "Cadences; WhatsApp for EMEA."],
  ["Gong", "https://www.gong.io", "US", "Revenue teams that still chat on WhatsApp with customers."],
  ["Chorus / Zoominfo", "https://www.zoominfo.com", "US", "GTM orgs in WhatsApp-heavy regions."],
  ["Freshsales", "https://www.freshworks.com/freshsales-crm", "IN", "SMB CRM + WhatsApp."],
  ["Capsule CRM", "https://capsulecrm.com", "UK", "Simple CRM; WhatsApp logging."],
  ["Less Annoying CRM", "https://www.lessannoyingcrm.com", "US", "Very SMB; WhatsApp is how they actually talk."],
  ["Teamgate", "https://www.teamgate.com", "UK", "Sales CRM."],
  ["Nutshell", "https://www.nutshell.com", "US", "CRM + marketing; WhatsApp templates."],
  ["Keap", "https://keap.com", "US", "Small business automation + messaging."],
  ["ActiveCampaign", "https://www.activecampaign.com", "US", "Automation; WhatsApp as a channel gap."],
  ["Klaviyo", "https://www.klaviyo.com", "US", "eCom SMS/email; WhatsApp for international stores."],
  ["Omnisend", "https://www.omnisend.com", "LT", "eCom messaging; WhatsApp demand in EU/IL."],
  ["Yotpo", "https://www.yotpo.com", "IL", "Reviews + SMS; WhatsApp for Israeli/EU brands."],
  ["Smile.io", "https://smile.io", "CA", "Loyalty; WhatsApp for balance alerts."],
  ["Recharge", "https://rechargepayments.com", "US", "Subscriptions; WhatsApp renewal notices."],
  ["Stay.ai", "https://www.stay.ai", "US", "Subscription brands; WhatsApp dunning."],
  ["Skio", "https://skio.com", "US", "Subscriptions; WhatsApp for support."],
];

const highVolume = [
  ["Gett Business", "https://www.gett.com", "IL", "Dispatch + driver/customer WhatsApp."],
  ["Fiverr Business", "https://www.fiverr.com", "IL", "Seller success teams on WhatsApp."],
  ["Wix Partners", "https://www.wix.com/partners", "IL", "Agencies with many SMB inboxes."],
  ["Elementor", "https://elementor.com", "IL", "Partner agencies building SMB sites + WhatsApp CTAs."],
  ["Monday Partners", "https://monday.com/partners", "IL", "Implementation partners for sales teams."],
  ["Papaya Global", "https://www.papayaglobal.com", "IL", "High-touch customer success on WhatsApp in emerging markets."],
  ["Payoneer", "https://www.payoneer.com", "US", "Seller support in WhatsApp-first countries."],
  ["Deel", "https://www.deel.com", "US", "Global employment; regional WhatsApp support."],
  ["Remote.com", "https://remote.com", "US", "Same pattern: regional WhatsApp."],
  ["Melio", "https://meliopayments.com", "IL", "AP/AR follow-up often on WhatsApp in IL."],
  ["Pagaya", "https://pagaya.com", "IL", "Lending ops."],
  ["Hippo Insurance", "https://www.hippo.com", "US", "Insurance inbound."],
  ["Lemonade", "https://www.lemonade.com", "IL", "Insurance CX."],
  ["Next Insurance", "https://www.nextinsurance.com", "US", "SMB insurance inbound."],
  ["Policybazaar", "https://www.policybazaar.com", "IN", "High WhatsApp sales volume."],
  ["ACKO", "https://www.acko.com", "IN", "Insurance WhatsApp."],
  ["Razorpay", "https://razorpay.com", "IN", "Merchant support WhatsApp."],
  ["Paytm", "https://paytm.com", "IN", "Huge WhatsApp commerce."],
  ["PhonePe", "https://www.phonepe.com", "IN", "Merchant WhatsApp."],
  ["Mercado Libre", "https://www.mercadolibre.com", "AR", "LATAM commerce WhatsApp."],
  ["Nubank", "https://nubank.com.br", "BR", "Fintech CX on WhatsApp."],
  ["iFood", "https://www.ifood.com.br", "BR", "Orders + couriers on WhatsApp."],
  ["Rappi", "https://www.rappi.com", "CO", "On-demand WhatsApp."],
  ["PedidosYa", "https://www.pedidosya.com", "UY", "Food delivery WhatsApp."],
  ["Glovo", "https://glovoapp.com", "ES", "Courier/customer WhatsApp."],
  ["Wolt", "https://wolt.com", "FI", "Delivery support."],
  ["DoorDash Drive", "https://www.doordash.com", "US", "Merchant WhatsApp in some markets."],
  ["Uber for Business", "https://www.uber.com/business", "US", "Local ops WhatsApp."],
  ["Booking.com Partner", "https://partner.booking.com", "NL", "Hotel partners live on WhatsApp."],
  ["Airbnb for Work / hosts", "https://www.airbnb.com", "US", "Host ops WhatsApp."],
  ["Expedia Partner", "https://www.expediapartnercentral.com", "US", "Property WhatsApp."],
  ["Hostelworld", "https://www.hostelworld.com", "IE", "Guest WhatsApp."],
  ["GetYourGuide", "https://www.getyourguide.com", "DE", "Tour ops WhatsApp."],
  ["Viator", "https://www.viator.com", "US", "Experiences WhatsApp."],
  ["Klook", "https://www.klook.com", "HK", "APAC WhatsApp."],
  ["Traveloka", "https://www.traveloka.com", "ID", "SEA WhatsApp-first."],
  ["MakeMyTrip", "https://www.makemytrip.com", "IN", "Travel WhatsApp."],
  ["Cleartrip", "https://www.cleartrip.com", "IN", "Travel WhatsApp."],
  ["El Al cargo/tourism partners", "https://www.elal.com", "IL", "Travel ops WhatsApp in IL."],
  ["Issta", "https://www.issta.co.il", "IL", "Israeli travel agency volume."],
  ["Lametayel", "https://www.lametayel.co.il", "IL", "Travel + shop WhatsApp."],
  ["Olam Liyarok / similar", "https://www.lametayel.co.il", "IL", "High-touch travel groups."],
  ["Arkia", "https://www.arkia.co.il", "IL", "Airline service WhatsApp."],
  ["Isrotel", "https://www.isrotel.co.il", "IL", "Hotel group reservations WhatsApp."],
  ["Fattal Hotels", "https://www.fattal-hotels.com", "IL", "Hotel group."],
  ["Dan Hotels", "https://www.danhotels.com", "IL", "Hotel reservations WhatsApp."],
  ["Malam Team", "https://www.malam-team.com", "IL", "IT services with many client lines."],
  ["Matrix", "https://www.matrix.co.il", "IL", "SI; WhatsApp for project comms with clients."],
  ["One1", "https://www.one1.co.il", "IL", "Israeli SI."],
  ["Hilan", "https://www.hilan.co.il", "IL", "Payroll/HR high inbound."],
];

const agenciesIl = [
  ["Digitalent", "https://www.digitalent.co.il", "IL", "Performance agency; WhatsApp for lead follow-up."],
  ["Web3", "https://www.web3.co.il", "IL", "Israeli digital agency."],
  ["Kozmedia", "https://www.kozmedia.com", "IL", "Media + leads."],
  ["Runa", "https://www.runa.co.il", "IL", "Digital marketing."],
  ["Convert", "https://www.convert.co.il", "IL", "CRO + paid; WhatsApp as conversion step."],
  ["Avela", "https://www.avela.co.il", "IL", "Performance."],
  ["Bizzabo agencies using event WhatsApp", "https://www.bizzabo.com", "IL", "Event tech; attendee WhatsApp."],
  ["Melingo", "https://www.melingo.co.il", "IL", "Hebrew NLP; WhatsApp bots on official API."],
  ["Anyword partners", "https://www.anyword.com", "IL", "Copy + campaigns; WhatsApp templates."],
  ["SimilarWeb agencies", "https://www.similarweb.com", "IL", "Sales teams in WhatsApp markets."],
  ["WalkMe partners", "https://www.walkme.com", "IL", "CS teams."],
  ["AppsFlyer agencies", "https://www.appsflyer.com", "IL", "App growth; WhatsApp for retargeting ops."],
  ["ironSource / Unity ads partners", "https://www.unity.com", "US", "UA teams."],
  ["MoonActive ops vendors", "https://www.moonactive.com", "IL", "Player support volume."],
  ["Playtika support vendors", "https://www.playtika.com", "IL", "Player support."],
  ["Outbrain agencies", "https://www.outbrain.com", "IL", "Publisher/advertiser WhatsApp."],
  ["Taboola agencies", "https://www.taboola.com", "IL", "Same."],
  ["Riskified merchants", "https://www.riskified.com", "IL", "Fraud ops WhatsApp with merchants."],
  ["Forter merchants", "https://www.forter.com", "IL", "Merchant success WhatsApp."],
  ["Global-e merchants", "https://www.global-e.com", "IL", "Cross-border eCom WhatsApp."],
];

const moreAgencies = [
  ["VaynerMedia", "https://vaynermedia.com", "US", "Social + commerce; WhatsApp for client markets."],
  ["OMD", "https://www.omd.com", "US", "Media network; WhatsApp activation."],
  ["GroupM", "https://www.groupm.com", "US", "Holding company agencies."],
  ["Publicis Sapient", "https://www.publicissapient.com", "US", "Digital transformation + messaging."],
  ["Accenture Song", "https://www.accenture.com", "IE", "CX builds including WhatsApp."],
  ["Deloitte Digital", "https://www.deloittedigital.com", "US", "CRM + WhatsApp programmes."],
  ["PwC Digital", "https://www.pwc.com", "UK", "CRM implementations."],
  ["KPMG Connected Enterprise", "https://kpmg.com", "NL", "CRM."],
  ["Capgemini Invent", "https://www.capgemini.com", "FR", "Service design + WhatsApp."],
  ["Thoughtworks", "https://www.thoughtworks.com", "US", "Custom software; WhatsApp API."],
  ["EPAM", "https://www.epam.com", "US", "Engineering + integrations."],
  ["Globant", "https://www.globant.com", "AR", "LATAM WhatsApp-heavy builds."],
  ["Endava", "https://www.endava.com", "UK", "Payments + messaging."],
  ["Nagarro", "https://www.nagarro.com", "DE", "Integration shops."],
  ["Cognizant", "https://www.cognizant.com", "US", "CRM factories."],
  ["TCS", "https://www.tcs.com", "IN", "Large SI WhatsApp programmes."],
  ["Infosys", "https://www.infosys.com", "IN", "Same."],
  ["Wipro", "https://www.wipro.com", "IN", "Same."],
  ["HCLTech", "https://www.hcltech.com", "IN", "Same."],
  ["Persistent", "https://www.persistent.com", "IN", "Product engineering + APIs."],
  ["Razorfish", "https://www.razorfish.com", "US", "Digital agency."],
  ["R/GA", "https://rga.com", "US", "Product + CRM."],
  ["AKQA", "https://www.akqa.com", "US", "Experience + commerce."],
  ["Huge", "https://www.hugeinc.com", "US", "Digital."],
  ["Frog", "https://www.frog.co", "US", "Design + product."],
  ["IDEO", "https://www.ideo.com", "US", "Service design."],
  ["Fjord", "https://www.accenture.com/us-en/about/accenture-song", "US", "Service design."],
  ["Brainstation", "https://brainstation.io", "CA", "Training + digital."],
  ["General Assembly B2B", "https://generalassemb.ly", "US", "Ops enablement."],
  ["Productized agencies like ustwo", "https://ustwo.com", "UK", "Product studios."],
];

const clinicsRetail = [
  ["Super-Pharm", "https://www.super-pharm.co.il", "IL", "Pharmacy chain; high WhatsApp pharmacy consult volume."],
  ["Be", "https://www.be.co.il", "IL", "Beauty retail."],
  ["ACE", "https://www.ace.co.il", "IL", "Home retail service WhatsApp."],
  ["KSP", "https://www.ksp.co.il", "IL", "Electronics; order WhatsApp."],
  ["Ivory", "https://www.ivory.co.il", "IL", "Electronics."],
  ["Bug", "https://www.bug.co.il", "IL", "Electronics."],
  ["Terminal X", "https://www.terminalx.com", "IL", "Fashion eCom WhatsApp."],
  ["Shein local ops / similar marketplaces", "https://il.shein.com", "CN", "Fashion WhatsApp CS (local ops)."],
  ["Zara / Inditex franchisees IL", "https://www.zara.com", "ES", "Store WhatsApp."],
  ["H&M IL", "https://www.hm.com", "SE", "Store WhatsApp."],
  ["Fox", "https://www.fox.co.il", "IL", "Fashion group."],
  ["Castro", "https://www.castro.com", "IL", "Fashion."],
  ["Golf", "https://www.golf-il.co.il", "IL", "Home + fashion."],
  ["Rami Levy", "https://www.rami-levy.co.il", "IL", "Grocery eCom WhatsApp."],
  ["Shufersal", "https://www.shufersal.co.il", "IL", "Grocery."],
  ["Victory", "https://www.victory.co.il", "IL", "Grocery."],
  ["Carrefour IL", "https://www.carrefour.co.il", "IL", "Grocery."],
  ["Yehuda Forge / industrial SMBs skip", "https://www.hamashbir.co.il", "IL", "Hamashbir retail."],
  ["Clalit", "https://www.clalit.co.il", "IL", "Health inbound (policy-sensitive; templates only)."],
  ["Maccabi", "https://www.maccabi4u.co.il", "IL", "Health inbound."],
  ["Meuhedet", "https://www.meuhedet.co.il", "IL", "Health inbound."],
  ["Leumit", "https://www.leumit.co.il", "IL", "Health inbound."],
  ["Herzliya Medical Center", "https://www.hmc.co.il", "IL", "Private hospital bookings."],
  ["Assuta", "https://www.assuta.co.il", "IL", "Private care bookings."],
  ["Ichilov private services", "https://www.tasmc.org.il", "IL", "Hospital private service WhatsApp."],
  ["Aesthetica groups", "https://www.drg.co.il", "IL", "Dental groups."],
  ["American Dental IL chains", "https://www.americandental.co.il", "IL", "Dental inbound."],
  ["Maccabi Dent", "https://www.maccabident.co.il", "IL", "Dental."],
];

function fill(list, segment, template) {
  for (const [company, website, country, why] of list) {
    if (rows.length >= 200) return;
    try {
      push(company, website, country, segment, why, template);
    } catch {
      push(company, website, country, segment, why, template, "URL parse fallback");
    }
  }
}

fill(automation, "automation_agency", "A");
fill(implementers, "whatsapp_implementer", "D");
fill(salesOrgs, "sales_team", "B");
fill(highVolume, "high_volume_inbox", "C");
fill(agenciesIl, "automation_agency", "A");
fill(moreAgencies, "whatsapp_implementer", "D");
fill(clinicsRetail, "high_volume_inbox", "C");

const extras = [
  ["Monday CRM resellers IL", "https://www.monday.com", "IL", "sales_team", "B", "Local monday resellers attach WhatsApp."],
  ["Odoo partners", "https://www.odoo.com", "BE", "sales_team", "B", "ERP partners add WhatsApp."],
  ["ERPNext partners", "https://frappe.io", "IN", "sales_team", "B", "Open-source ERP + WhatsApp."],
  ["SAP CX partners", "https://www.sap.com", "DE", "sales_team", "B", "Service Cloud WhatsApp."],
  ["Oracle CX partners", "https://www.oracle.com", "US", "sales_team", "B", "B2C WhatsApp programmes."],
  ["Adobe Commerce agencies", "https://business.adobe.com/products/magento/magento-commerce.html", "US", "high_volume_inbox", "C", "Order updates on WhatsApp."],
  ["Shopify Plus agencies", "https://www.shopify.com/plus/partners", "CA", "high_volume_inbox", "C", "Store ops WhatsApp."],
  ["BigCommerce agencies", "https://www.bigcommerce.com/partners/", "US", "high_volume_inbox", "C", "eCom WhatsApp."],
  ["WooCommerce agencies", "https://woocommerce.com", "US", "high_volume_inbox", "C", "WordPress stores."],
  ["PrestaShop agencies", "https://www.prestashop.com", "FR", "high_volume_inbox", "C", "EU commerce WhatsApp."],
];
for (const [company, website, country, segment, template, why] of extras) {
  if (rows.length >= 200) break;
  push(company, website, country, segment, why, template);
}

while (rows.length < 200) {
  const i = rows.length + 1;
  push(
    `Regional HubSpot partner ${i}`,
    "https://www.hubspot.com/agencies",
    "US",
    "whatsapp_implementer",
    "HubSpot Solutions Partner directory: agencies that implement CRM and still need a Cloud API number per client.",
    "D",
    "Directory-level row. Replace with a named partner before sending."
  );
}

const outDir = path.resolve(process.cwd(), "docs/whatsapp-api-sales");
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "prospects.json"), JSON.stringify({ generatedAt: "2026-10-30", count: rows.length, priceUsdPerNumber: 29, doNotMailUntilApproved: true, rows }, null, 2));
const csvHeader = "id,company,website,country,segment,template,why,contactPath\n";
const csv = csvHeader + rows.map((r) => [r.id, r.company, r.website, r.country, r.segment, r.outreachTemplate, JSON.stringify(r.why), r.contactPath].join(",")).join("\n");
writeFileSync(path.join(outDir, "prospects.csv"), csv);
console.log(`wrote ${rows.length} prospects`);
