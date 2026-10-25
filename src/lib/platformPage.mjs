/**
 * Platform page copy, first-paint HTML, and structured data.
 * Prices match the published pricing catalog. Claims stay inside shipped product behavior.
 */

import { platformLocaleEs, platformLocaleHe } from "./platformLocales.mjs";
import { platformLocaleAr, platformLocalePt } from "./platformLocalesMore.mjs";

const PREFIX = { en: "", he: "/he", es: "/es", "pt-BR": "/pt-br", ar: "/ar" };
const META = {
  en: { lang: "en", dir: "ltr" },
  he: { lang: "he", dir: "rtl" },
  es: { lang: "es", dir: "ltr" },
  "pt-BR": { lang: "pt-BR", dir: "ltr" },
  ar: { lang: "ar", dir: "rtl" },
};

export const PLATFORM_MEDIA = {
  crm: { film: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg" },
  whatsapp: { film: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg" },
  campaigns: { film: "/demo-media/home/campaigns.mp4", poster: "/demo-media/home/campaigns.jpg" },
  websites: { film: "/demo-media/home/websites.mp4", poster: "/demo-media/home/websites.jpg" },
  automations: { film: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg" },
  appointments: { film: "/demo-media/home/appointments.mp4", poster: "/demo-media/home/appointments.jpg" },
};

export const TILE_MEDIA = {
  leads: { still: "/demo-media/crm/leads-list.png", film: "crm" },
  customer: { still: "/demo-media/crm/lead-file.png", film: "crm" },
  tasks: { still: "/demo-media/crm/lead-task.png", film: "crm" },
  conversations: { still: "/demo-media/whatsapp/still-3.jpg", film: "whatsapp" },
  calendar: { still: "/demo-media/appointments/still-8.jpg", film: "appointments" },
  activity: { still: "/demo-media/meta/lead-source.png", film: "campaigns" },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function hrefFor(locale, path) {
  return `${PREFIX[locale] || ""}${path}`;
}

function sectionsFor(page) {
  return [
    [page.flow.title, [page.flow.lead, ...page.flow.steps.map((step) => `${step.title}. ${step.body}`)]],
    [page.workspace.title, [page.workspace.lead, ...page.workspace.tiles.map((tile) => tile.title)]],
    [page.products.title, [page.products.lead, ...page.products.items.map((item) => `${item.title}. ${item.body}`)]],
    [page.adapt.title, [page.adapt.lead, ...page.adapt.options.map((item) => `${item.title}. ${item.body}`)]],
    [page.definition.title, page.definition.paragraphs],
    [page.workflows.title, [page.workflows.lead, ...page.workflows.items.map((item) => `${item.title}. ${item.body}`)]],
    [page.benefits.title, page.benefits.items.map((item) => `${item.title}. ${item.body}`)],
    [page.audiences.title, [page.audiences.lead, ...page.audiences.items.map((item) => `${item.title}. ${item.body}`)]],
  ];
}

export function platformActivity(locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  const page = LOCALES[language] || LOCALES.en;
  return {
    ...page,
    layout: "showcase",
    media: "workspace",
    path: "/platform",
    paragraphs: [page.lede],
    sections: sectionsFor(page),
    steps: page.flow.steps.map((step) => `${step.title}. ${step.body}`),
    updated: "2026-10-25",
  };
}

export function platformJsonLd(page, canonical, language, urlFor) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Bizuply",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: canonical,
      inLanguage: language,
      description: page.description,
      offers: [
        { "@type": "Offer", name: "CRM", price: "49", priceCurrency: "USD", description: "CRM only, billed monthly." },
        { "@type": "Offer", name: "Bizuply Business", price: "99", priceCurrency: "USD", description: "Monthly business plan. The website is not included." },
        { "@type": "Offer", name: "Bizuply Business yearly", price: "990", priceCurrency: "USD", description: "Yearly business plan. The website is not included." },
        { "@type": "Offer", name: "WhatsApp Business API", price: "29", priceCurrency: "USD", description: "Per connected number each month. Meta messaging fees are separate." },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.products.title,
      itemListElement: page.products.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: urlFor(item.href),
      })),
    },
  ];
}

function figure(src, alt) {
  return `<figure class="pf-media"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="1200" height="750"></figure>`;
}

export function renderPlatformPrerender(page, locale) {
  const meta = META[locale] || META.en;
  const link = (path) => escapeHtml(hrefFor(locale, path));
  const steps = page.flow.steps.map((step, index) => (
    `<li class="pf-step"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body)}</p></li>`
  )).join("");
  const tiles = page.workspace.tiles.map((tile) => (
    `<figure class="pf-tile"><img src="${escapeHtml(TILE_MEDIA[tile.key].still)}" alt="${escapeHtml(tile.alt)}" width="640" height="400"><figcaption>${escapeHtml(tile.title)}</figcaption></figure>`
  )).join("");
  const products = page.products.items.map((item, index) => (
    `<article class="${index % 2 ? "pf-split pf-split--flip" : "pf-split"}"><div class="pf-copy"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><a href="${link(item.href)}">${escapeHtml(item.cta)}</a></div>${figure(PLATFORM_MEDIA[item.key].poster, item.alt)}</article>`
  )).join("");
  const options = page.adapt.options.map((item) => (
    `<article class="pf-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`
  )).join("");
  const workflows = page.workflows.items.map((item, index) => (
    `<article class="${index % 2 ? "pf-split pf-split--flip" : "pf-split"}"><div class="pf-copy"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></div>${figure(PLATFORM_MEDIA[item.key].poster, item.alt)}</article>`
  )).join("");
  const benefits = page.benefits.items.map((item) => (
    `<article class="pf-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`
  )).join("");
  const audiences = page.audiences.items.map((item) => (
    `<article class="pf-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`
  )).join("");
  const faqs = page.faq.map(([question, answer]) => (
    `<details><summary><h3>${escapeHtml(question)}</h3></summary><p>${escapeHtml(answer)}</p></details>`
  )).join("");
  const links = page.links.map(([path, label]) => `<li><a href="${link(path)}">${escapeHtml(label)}</a></li>`).join("");
  const definition = page.definition.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const inner = `<main class="pf" lang="${meta.lang}" dir="${meta.dir}"><section class="pf-hero"><div class="pf-hero__glow" aria-hidden="true"></div><div class="pf-wrap pf-hero__grid"><div><h1 class="pf-hero__title">${escapeHtml(page.h1)}</h1><p class="pf-hero__lead">${escapeHtml(page.lede)}</p><div class="pf-actions"><a class="pf-btn pf-btn--ghost" href="#connected">${escapeHtml(page.explore)}</a><a class="pf-btn pf-btn--primary" href="${link("/register")}">${escapeHtml(page.start)}</a></div></div><div class="pf-stage"><img class="pf-stage__main" src="/demo-media/home/crm.jpg" alt="${escapeHtml(page.stageMain)}" width="1200" height="750" fetchpriority="high" decoding="async"><img class="pf-stage__float pf-stage__float--a" src="/demo-media/whatsapp/still-3.jpg" alt="${escapeHtml(page.stageChat)}" width="640" height="400"><img class="pf-stage__float pf-stage__float--b" src="/demo-media/appointments/still-8.jpg" alt="${escapeHtml(page.stageCalendar)}" width="640" height="400"><img class="pf-stage__float pf-stage__float--c" src="/demo-media/home/campaigns.jpg" alt="${escapeHtml(page.stageCampaigns)}" width="640" height="400"></div></div></section><section class="pf-section pf-light" id="connected"><div class="pf-wrap"><h2>${escapeHtml(page.flow.title)}</h2><p class="pf-lead">${escapeHtml(page.flow.lead)}</p><div class="pf-flow-wrap"><span class="pf-flow__rail" aria-hidden="true"></span><ol class="pf-flow">${steps}</ol></div></div></section><section class="pf-section pf-dark"><div class="pf-wrap"><h2>${escapeHtml(page.workspace.title)}</h2><p class="pf-lead">${escapeHtml(page.workspace.lead)}</p><div class="pf-tiles">${tiles}</div></div></section><section class="pf-section pf-white"><div class="pf-wrap"><h2>${escapeHtml(page.products.title)}</h2><p class="pf-lead">${escapeHtml(page.products.lead)}</p>${products}</div></section><section class="pf-section pf-dark"><div class="pf-wrap"><h2>${escapeHtml(page.adapt.title)}</h2><p class="pf-lead">${escapeHtml(page.adapt.lead)}</p><div class="pf-options">${options}</div><div class="pf-actions"><a class="pf-btn pf-btn--primary" href="${link("/pricing")}">${escapeHtml(page.plans)}</a></div></div></section><section class="pf-section pf-light"><div class="pf-wrap"><h2>${escapeHtml(page.definition.title)}</h2><div class="pf-prose pf-lead">${definition}</div></div></section><section class="pf-section pf-white"><div class="pf-wrap"><h2>${escapeHtml(page.workflows.title)}</h2><p class="pf-lead">${escapeHtml(page.workflows.lead)}</p>${workflows}</div></section><section class="pf-section pf-light"><div class="pf-wrap"><h2>${escapeHtml(page.benefits.title)}</h2><div class="pf-options">${benefits}</div></div></section><section class="pf-section pf-dark"><div class="pf-wrap"><h2>${escapeHtml(page.audiences.title)}</h2><p class="pf-lead">${escapeHtml(page.audiences.lead)}</p><div class="pf-options">${audiences}</div></div></section><section class="pf-section pf-white"><div class="pf-wrap pf-faq"><h2>${escapeHtml(page.faqTitle)}</h2>${faqs}<h2>${escapeHtml(page.related)}</h2><ul class="pf-links">${links}</ul></div></section></main>`;
  return { lang: meta.lang, dir: meta.dir, inner };
}

const en = {
  title: "All-in-One Business Management Platform | Bizuply",
  description: "Manage leads, customers, WhatsApp conversations, marketing campaigns, appointments and automations in one connected business platform. Explore Bizuply.",
  crumb: "Platform",
  h1: "One platform. A more connected business.",
  lede: "Bring your customers, conversations, marketing, appointments and daily workflows together in Bizuply. Manage the work that moves your business forward from one connected workspace.",
  explore: "Explore the Platform",
  start: "Get Started",
  plans: "Explore Plans & Services",
  faqTitle: "Questions about the Bizuply platform",
  related: "Explore each part of the platform",
  pause: "Pause video",
  play: "Play video",
  stageMain: "Bizuply lead list on the business dashboard",
  stageChat: "A customer WhatsApp conversation inside Bizuply",
  stageCalendar: "The Bizuply appointment calendar",
  stageCampaigns: "A Meta campaign reviewed inside Bizuply",
  flow: {
    title: "Every connection creates a better workflow",
    lead: "A new inquiry is only the beginning. Bizuply helps you organize the customer journey, connect daily activities and keep important information moving between the tools your business uses.",
    steps: [
      { title: "Capture", body: "Collect leads from connected advertising channels and website forms, with their source and contact details organized in your CRM." },
      { title: "Connect", body: "Keep customer information, conversations and notes accessible as your team builds the relationship." },
      { title: "Take Action", body: "Schedule appointments, create tasks and build supported workflows around the next step." },
      { title: "Keep Growing", body: "Review business activity, manage ongoing opportunities and expand the tools you use as your business evolves." },
    ],
  },
  workspace: {
    title: "Your business, organized around the work that matters",
    lead: "Move between leads, customer records, conversations, tasks and appointments without losing the context behind each interaction. Bizuply brings essential business activities into a workspace designed for everyday use.",
    tiles: [
      { key: "leads", title: "Lead list", alt: "A Bizuply lead list with source and status" },
      { key: "customer", title: "Customer record", alt: "A Bizuply customer record with contact details and notes" },
      { key: "tasks", title: "Tasks", alt: "A follow-up task on a Bizuply lead" },
      { key: "conversations", title: "Conversations", alt: "A WhatsApp conversation managed in Bizuply" },
      { key: "calendar", title: "Calendar", alt: "Appointments on the Bizuply calendar" },
      { key: "activity", title: "Business activity", alt: "Lead source details from a connected campaign" },
    ],
  },
  products: {
    title: "Powerful tools. One connected experience.",
    lead: "Choose the tools your business needs and bring them together in a workspace that supports your customers, operations and marketing.",
    items: [
      { key: "crm", href: "/crm", cta: "Explore CRM", title: "CRM & Customer Management", body: "Keep leads and customers organized with contact details, pipeline stages, notes, tasks and the information your team needs for the next interaction.", alt: "A lead is opened, its status changes, a note is added, and a follow-up task is created" },
      { key: "whatsapp", href: "/whatsapp-api", cta: "Explore WhatsApp Business", title: "WhatsApp Business", body: "Manage customer conversations through your connected WhatsApp Business account and bring communication closer to your daily customer workflows.", alt: "Moving between WhatsApp conversations and a message template in Bizuply" },
      { key: "campaigns", href: "/meta-campaigns", cta: "Explore campaign management", title: "Marketing Campaigns", body: "Work with supported Meta campaign management tools, review advertising performance and connect incoming leads with your customer management process.", alt: "A Meta campaign is opened and its budget and results are reviewed in Bizuply" },
      { key: "websites", href: "/website-builder", cta: "Explore the website builder", title: "Website Builder", body: "Create and customize your online presence with visual editing tools, ready-made templates and supported forms that connect with your CRM.", alt: "A website headline is edited and previewed in the Bizuply website studio" },
      { key: "automations", href: "/automations", cta: "Explore automations", title: "Business Automations", body: "Build workflows around supported triggers and actions to simplify repetitive tasks and keep follow-ups moving.", alt: "A lead status change runs an automation and creates a follow-up task" },
      { key: "appointments", href: "/appointments", cta: "Explore appointments", title: "Appointments & Scheduling", body: "Manage services, availability and bookings from a calendar designed around your business schedule.", alt: "An appointment is created and then moved to a new time on the Bizuply calendar" },
    ],
  },
  adapt: {
    title: "A platform that adapts to your business",
    lead: "No two businesses operate in exactly the same way. Start with the capabilities that matter to your daily work and expand your setup as your needs change.",
    options: [
      { title: "Run It Yourself", body: "Manage your CRM, marketing, communication and daily operations directly from your Bizuply account." },
      { title: "Build Your Digital Presence", body: "Create a website with the visual editor or choose a professional setup service to help bring your online presence to life." },
      { title: "Get Expert Setup & Support", body: "Let Bizuply help configure selected services, websites and workflows according to your business needs." },
    ],
  },
  definition: {
    title: "What is an all-in-one business management platform?",
    paragraphs: [
      "An all-in-one business management platform brings essential business tools into a connected workspace. Instead of managing customer information, marketing activity, conversations and daily tasks across separate systems, businesses can organize these processes around shared information and workflows.",
      "Bizuply combines customer relationship management, supported marketing integrations, WhatsApp Business communication, appointment scheduling, website creation and business automations. Businesses can choose the capabilities they need and manage their daily activities from a connected environment.",
    ],
  },
  workflows: {
    title: "How does Bizuply connect your business workflows?",
    lead: "The value of a connected platform becomes clearer when everyday actions work together. A new inquiry can become a CRM record, a customer conversation can lead to an appointment, and a change in lead status can trigger a supported follow-up workflow.",
    items: [
      { key: "campaigns", title: "From marketing lead to customer follow-up", body: "A potential customer submits a connected Meta lead form. The inquiry enters Bizuply CRM with its available contact details and source. Your team can review the lead, update its status, add notes and create the next task. Supported automations can help move repetitive follow-up steps forward.", alt: "Campaign activity and the lead it sends into the CRM" },
      { key: "whatsapp", title: "From customer conversation to appointment", body: "A customer contacts your business through a connected WhatsApp Business account. Your team can manage the conversation, review relevant customer information and schedule an appointment using the business calendar.", alt: "A WhatsApp conversation inside Bizuply beside the customer record" },
      { key: "websites", title: "From website visitor to organized opportunity", body: "A visitor completes a supported form on your business website. The inquiry can become a lead in the CRM, allowing your team to continue the conversation and manage the next steps.", alt: "A website form that can create a lead in Bizuply CRM" },
    ],
  },
  benefits: {
    title: "Why use a connected business management platform?",
    items: [
      { title: "Better visibility across customer activity", body: "Open one lead and see the contact details, the source, the status and the next task together. A new Meta lead does not have to be copied into a separate sheet before someone can follow up." },
      { title: "More consistent business processes", body: "When a lead reaches a chosen status, a supported automation can create the follow-up task. The same kind of next step can happen for the next inquiry without relying on memory." },
      { title: "Easier collaboration", body: "People working in the same Bizuply account can read the notes, the task and the conversation history on the customer record, so the next person does not start from a blank page." },
      { title: "Flexibility as your business grows", body: "Start with CRM on its own. Add the business plan when you need appointments and automations, and add a website or a WhatsApp number when that work becomes part of the day." },
    ],
  },
  audiences: {
    title: "Who can benefit from Bizuply?",
    lead: "Bizuply is designed for businesses that want to organize customer relationships, marketing activity and daily operations in one place. Different teams can use the platform according to their services, workflows and business goals.",
    items: [
      { title: "Small Businesses", body: "A small team can keep a new inquiry, a note about what the person asked, and a dated follow-up task on one lead instead of splitting that work across a spreadsheet and an inbox." },
      { title: "Service-Based Businesses", body: "A service business can set its hours and services, then book the next appointment on the same calendar the team uses to see the day." },
      { title: "Marketing Agencies", body: "A marketing team can connect the business Meta ad account, review supported campaign activity, and follow the incoming lead in the CRM with its source. Meta still bills the ad spend." },
      { title: "Consultants & Professionals", body: "A consultant can log what was discussed, create the next task, and place the next meeting on the calendar without leaving the client record." },
      { title: "Growing Teams", body: "As more than one person handles customers, the shared record, assigned tasks and conversation history give the next teammate the context for what already happened." },
      { title: "Appointment-Based Businesses", body: "A studio or clinic can publish a booking page, offer open times from its real availability, and see the booked appointment on the business calendar. A confirmation email goes to the client and the business." },
    ],
  },
  faq: [
    ["What is an all-in-one business management platform?", "An all-in-one business management platform brings everyday business tools into one workspace so customer information, conversations and follow-up are not split across unrelated systems. Bizuply combines CRM, supported Meta campaign tools, WhatsApp Business, appointment scheduling, a website builder and automations. A business can start with CRM only and add other products as the work requires them. It is not an accounting suite, a point of sale or an inventory system."],
    ["How does Bizuply connect CRM and marketing tools?", "After a business connects its own Meta ad account, supported campaign workflows can be reviewed in Bizuply, including activity, budgets and performance. Meta bills the ad spend. A lead from a connected Meta form can enter the CRM with the available contact details and its source. A form on a Bizuply website can create a lead the same way. The team then updates the status, adds a note and creates the next task on that record."],
    ["Can Bizuply capture leads from Meta advertising?", "Yes. Bizuply is a Meta Tech Provider, and the app passed Meta App Review for Lead Ads. The business connects its own Facebook page and approves the permissions. Leads from the connected forms can then arrive in the CRM with their source. This does not replace Meta Ads Manager, and it does not include the media budget."],
    ["Can I manage customer conversations through WhatsApp Business?", "Yes. Bizuply connects a WhatsApp Business account so the team can manage conversations and approved message templates from the same workspace as the customer record. The Bizuply service is $29 per month for each connected number. Meta charges for messages separately, based on usage and message category."],
    ["Does Bizuply include customer and lead management?", "Yes. The CRM keeps leads and customers with contact details, notes, tasks and a timeline. A lead can be New, Contacted, Interested, Converted, Lost or Old lead, and a status change is recorded on the timeline. A team can mark a lead as contacted, write what was requested, and open a dated task. Overdue tasks appear in the notification center."],
    ["Can I manage appointments and customer bookings?", "Yes, on the business plan. You set business hours and a service catalog with duration and price. Bizuply calculates open times in 15-minute steps. The team can save an appointment with a service, price, payment status and a note. A customer booking page offers those open times, and a confirmation email is sent to the client and the business when a time is booked."],
    ["How do business automations work in Bizuply?", "Automations are part of the business plan. A workflow uses a supported trigger and a supported action. In the product, a lead status change to Contacted can create a CRM task, and the run history can show that the run succeeded. If you want Bizuply to build the workflow, automation setup starts at $99 for one simple automation. The pricing page lists the setup options."],
    ["Can I connect website forms to the CRM?", "Yes. A form published with the website builder can save the inquiry as a lead and keep the website as its source. The website builder is not included in the business plan price. It is sold as its own website package or add-on. An expert website build is $399 once for a site of up to five pages on an existing template, including a lead form and a CRM connection."],
    ["Is Bizuply suitable for small businesses?", "Yes, for small businesses that want customer records, conversations, supported marketing activity and daily follow-up in one workspace. A small team can track a new inquiry and the next task without a separate CRM project. Bizuply is not the right fit for a business whose main need is invoicing, stock control or a point of sale."],
    ["Can multiple team members work in Bizuply?", "Yes. More than one person can work in a Bizuply business account, using the same customer records, tasks and conversation history. The business plan includes the option to add human agents. What each person can open depends on the access set up for the account. Confirm the current team options on the pricing page before you start."],
    ["Can I choose individual Bizuply products?", "Yes. CRM only is $49 per month. The business plan is $99 per month or $990 per year and includes CRM, appointments, collaborations and automations. The website is not included in that plan and is added separately. WhatsApp Business API is $29 per month for each connected number, plus Meta messaging fees. Setup services are separate one-time purchases."],
    ["Does Bizuply provide professional setup services?", "Yes, for selected published services. An expert website build is $399 once. Automation setup starts at $99 for one simple automation. CRM migration starts at $249 for a basic move of clients, leads and statuses. These services do not change the software subscription. The pricing page shows what each one includes before you buy."],
  ],
  links: [
    ["/crm", "CRM and customer records"],
    ["/whatsapp-api", "WhatsApp Business conversations"],
    ["/meta-campaigns", "Meta campaign management"],
    ["/automations", "Business automations"],
    ["/website-builder", "Website builder"],
    ["/appointments", "Appointments and scheduling"],
    ["/pricing", "Plans and setup services"],
  ],
};

const LOCALES = {
  en,
  he: platformLocaleHe,
  es: platformLocaleEs,
  "pt-BR": platformLocalePt,
  ar: platformLocaleAr,
};

export const PLATFORM_LOCALES = LOCALES;
