/** Localized CRM lead guide bodies (no ui). Product claims match Northwind demo 2026-10-29. */

export const en = {
  title: "CRM and lead management for businesses – the complete guide | Bizuply",
  description:
    "What is CRM and how do you manage leads well? Full guide to customer management, sales funnel, follow-up, automation, metrics, with examples and tutorial videos.",
  h1: "CRM and lead management for businesses: the complete guide to customers and sales",
  dek: "How do you turn inquiries from your website, WhatsApp, and campaigns into an orderly sales process? Learn the principles, metrics, and tools to manage every lead, track customers, and know the next step.",
  hero: {
    alt: "Lead list in Bizuply CRM with statuses and inquiry sources from demo data",
    title: "Workspace for managing inquiries",
    caption:
      "Screenshot from the Northwind Creative Studio demo account. Names, example.com addresses, and 555 numbers are fictional.",
  },
  sections: [
    {
      id: "what-is-crm",
      heading: "What is CRM?",
      paragraphs: [
        "A customer leaves details on your website. Another sends a WhatsApp message. A third comes back about a quote you sent a week ago. They are all interested in your business, but without one place that holds treatment status it is hard to know who was answered, who is waiting for a quote, and who you need to call back today.",
        "CRM stands for Customer Relationship Management. The term describes an approach to managing the relationship between the business and its customers, and usually also the software that supports the process.",
        "A CRM system is software that centralizes information about leads and customers, records interactions, and helps you manage treatment and sales stages in one place.",
        "Suppose the owner of a services firm gets a call requesting a quote. On the card you can save name and contact details, note the service, log the conversation, and leave a task to follow up. When the customer calls again, the card picks up where the last conversation stopped. The information does not have to live in one person’s memory.",
        "A CRM system can combine contacts, leads, statuses, tasks, appointments, documents, call logs, reports, and automations. Exact capabilities depend on the product and plan. Later in this guide we note what exists in Bizuply and what appeared in screenshots, without adding screens that were not shown.",
      ],
      callout:
        "A contact list mainly answers how to reach someone. CRM is also meant to answer why they reached out, what was already explained, who handled it, deal status, what to do now, and whether the inquiry ended in a purchase.",
      shots: [
        {
          file: "leads-workspace.webp",
          alt: "Bizuply lead table with name, phone, email, status, and source columns",
          title: "What a central workspace for inquiries looks like",
          caption:
            "You can search, filter, export, and open a card. This screen has no separate “Add lead” button. A new inquiry in the demo was created from a website form.",
        },
      ],
      films: [
        {
          id: "film-intro",
          file: "crm-intro.mp4",
          poster: "crm-intro-poster.jpg",
          title: "What lead management looks like in Bizuply",
          caption:
            "A short tour of the workspace where you see inquiries, check treatment status, and open each lead’s details.",
          transcript:
            "Sign in to the demo account, open the leads area, scan the list, filter by status, open a lead card, and return to the list.",
        },
      ],
    },
    {
      id: "lead-vs-customer",
      heading: "What is a lead, and how is it different from a customer?",
      paragraphs: [
        "A lead is a person or business that showed interest in a product or service. They may come from a form, a quote request, campaign details, signing up for information, or a direct inquiry.",
        "A customer is someone who already bought a product or service, according to the business definition your organization uses. That word can differ between a clinic, a services firm, and a store, so define it before you measure conversion.",
        "Dana Israeli fills out a form on the site and asks for details about building a website for her business. At this stage Dana is a lead. A rep calls her back, hears what she needs, and sends a quote. Dana is still a lead, but at a more advanced stage. If she approves the quote and completes the purchase, she becomes a customer. After that comes delivery, support, renewal, or an upsell, as needed.",
      ],
      subsections: [
        {
          id: "lead-temperature",
          heading: "Hot lead, cold lead, and poor fit",
          paragraphs: [
            "Not every lead is equally ready to buy. A hot lead might already know what they need, asked for a quote, and want to start soon. A cold lead might have just discovered the business or asked for general information and is not planning a purchase yet. A poor-fit inquiry does not match the service, budget, or target audience.",
            "Do not infer interest level from the source alone. Read the request and what was said on the call.",
          ],
        },
      ],
    },
    {
      id: "why-lost",
      heading: "Why do businesses lose leads?",
      paragraphs: [
        "Sometimes a lead does not become a customer for reasons outside the business’s control. The customer changes their mind, postpones the purchase, or chooses another provider. Some opportunities are lost because of lack of order.",
        "A new inquiry arrives while the team is busy and nobody owns the callback. One rep knows the customer, but the conversation stays with them and the next person does not know what was agreed. A quote goes out with no follow-up date and no record of the next step. Some inquiries sit on the site, some in WhatsApp, some in campaigns, others in a spreadsheet. The business knows how much it spent on ads but not what happened to the inquiries.",
        "Professional lead management does not guarantee every inquiry becomes a customer. It helps ensure inquiries get consistent treatment and that you can understand process outcomes.",
      ],
      widget: "compare",
      model: {
        scenes: [
          {
            title: "The inquiry stays in messages",
            body: "A customer sends a request during a busy hour. The message stays in a private chat, with no owner and no follow-up date. When someone else opens the inbox the next day, it is unclear whether anyone replied.",
          },
          {
            title: "The inquiry enters a process",
            body: "The same request is logged, gets a status, is assigned to someone, and gets a next action. Nobody promises a purchase. It is clear who is handling it and what is missing.",
            ordered: true,
          },
        ],
      },
    },
    {
      id: "journey",
      heading: "A lead’s journey — from first inquiry to decision",
      paragraphs: [
        "We follow a business that offers digital marketing services. Yoav Mizrahi sees an ad, visits the site, and submits a form. At each stage you can see where the inquiry stands and what is still needed. The same workflow should hold when several people handle inquiries.",
      ],
      widget: "journey",
      model: {
        label: "Stages of a lead’s journey",
        exampleLabel: "In Yoav’s example:",
        steps: [
          {
            title: "Inquiry received",
            body: "A record is created with contact details, requested service, and source when available.",
            example:
              "Yoav submits a form after an ad. Source and request are saved with the record.",
          },
          {
            title: "Contact made",
            body: "Someone from the team reaches out and records that the conversation happened.",
            example: "A rep calls Yoav and updates the status to Contacted.",
          },
          {
            title: "Needs clarified",
            body: "Goals, timelines, and estimated budget are checked, with notes someone else can understand.",
            example:
              "Yoav wants campaign support. The note describes the need, not just the phone number.",
          },
          {
            title: "Next action",
            body: "Define what should happen now—call, information, or quote—and use a due date field when there is one.",
            example: "A task is opened to send Yoav a call summary.",
          },
          {
            title: "Outcome",
            body: "Status is updated according to what actually happened: continue, purchase, or close.",
            example:
              "If Yoav moves forward, the record advances. If not, close it instead of leaving it open without reason.",
          },
        ],
      },
      films: [
        {
          id: "film-journey",
          file: "crm-journey.mp4",
          poster: "crm-journey-poster.jpg",
          title: "From first inquiry to closed treatment — full demo",
          caption:
            "Yoav Mizrahi is a demo lead created from the website form. The video opens the card, adds a note, updates status, and adds a task.",
          transcript:
            "Find Yoav Mizrahi in the list, open the card, read the details, write a note about the need, change status, add a follow-up task, and show the state in the list.",
        },
      ],
    },
    {
      id: "build-process",
      heading: "How do you build a sound lead management process?",
      paragraphs: [
        "A good process is one the team can keep updated. A few clear stages beat dozens of fields nobody fills in.",
      ],
      subsections: [
        {
          id: "sources",
          heading: "1. Define inquiry sources",
          paragraphs: [
            "List where inquiries come from: website, WhatsApp, forms, campaigns, phone calls, referrals, and social. You do not have to connect all of them on day one. Start with two or three channels so fewer inquiries stay outside the process.",
          ],
        },
        {
          id: "fields",
          heading: "2. Define what matters for each lead",
          paragraphs: [
            "For most businesses it is enough to start with name, contact method, requested service, source, date received, status, owner, and next action. Collect only what the business goal requires and manage data according to privacy rules that apply to you.",
          ],
        },
        {
          id: "stages",
          heading: "3. Create clear treatment stages",
          paragraphs: [
            "An overly complex process is hard to update. On the Bizuply lead card the status menu includes New, Contacted, In progress, Interested, Quote, Negotiation, Converted, Lost, and Old lead. On the board viewed in columns the labels appeared as New, Contacted, Interested, Converted, Lost, and Old. The team should know when to move between stages, not only what the button is called.",
          ],
        },
        {
          id: "owner",
          heading: "4. Assign an owner for every inquiry",
          paragraphs: [
            "When several people see the same list, you need to know who handles what. The card and table include a rep field. Clear ownership avoids everyone assuming someone else will call the customer back.",
          ],
        },
        {
          id: "next",
          heading: "5. Set a next action",
          paragraphs: [
            "Status “Interested” does not say what to do tomorrow. Prefer a focused task, for example “Call on Monday and check if the customer reviewed the quote.” The card has a tasks tab with text and a date-time field.",
          ],
        },
        {
          id: "review",
          heading: "6. Review the process regularly",
          paragraphs: [
            "Once a week, look at new leads not yet handled, who is waiting for a callback, how many quotes are open, and why inquiries stalled. That surfaces problems before they become habit.",
          ],
        },
      ],
    },
    {
      id: "card",
      heading: "What does a professional lead card look like?",
      paragraphs: [
        "A good card lets you grasp inquiry status quickly. For example: Dana Israeli, requested service website build, source website form, status Interested, summary about a branding site with a contact form, next action send quote, owner sales rep. These details are fictional.",
        "Value is not in field count but in having important information available and current. On the demo card you see name, phone, email, status, source, and tabs for details, source, form answers, notes, tasks, meetings, documents, quotes, and payments. Not every tab is filled for every lead.",
      ],
      shots: [
        {
          file: "lead-card.webp",
          alt: "Noa Levi’s lead card in Bizuply with New status and website source",
          title: "Demo lead card",
          caption:
            "Noa Levi arrived from the website form. The email is example.com and the phone is a 555 number for illustration.",
        },
      ],
    },
    {
      id: "small-business",
      heading: "CRM for a small business — is it really necessary?",
      paragraphs: [
        "A small business does not necessarily need dozens of screens. A solo operator with few inquiries can start with simple tracking. When every inquiry needs a call, quote, reminder, or extra step, CRM helps you stay organized even without a large sales team.",
        "A clinic owner can track service inquiries; a consulting firm owner can log quote requests. The right system is the one you actually use. Do not buy a complex solution just for features you will not use today.",
      ],
    },
    {
      id: "excel",
      heading: "CRM versus Excel — what fits the business?",
      paragraphs: [
        "Excel and similar spreadsheets suit organizing data and basic tracking. CRM focuses on the customer relationship process. In a sheet you can list name, phone, and status. As inquiries, tasks, and people grow, you also need history, ownership, reminders, and work by more than one person.",
        "CRM does not necessarily replace every spreadsheet use. A sheet can still support analysis. Sheets can also cover some needs with columns, filters, and add-ins. The difference is that CRM is built around card, status, and next action.",
      ],
      table: {
        columns: ["Topic", "Spreadsheet", "CRM"],
        rows: [
          ["Contacts", "Flexible table of names and phones", "Card with contact details and status"],
          ["Activity history", "Possible with extra columns or sheets", "Notes and status changes on the card"],
          ["Status tracking", "Column and list", "Status menu and board view"],
          ["Tasks", "Date in a column, not always with reminders", "Task with text and due field on the lead"],
          ["Teamwork", "Depends on file sharing and discipline", "Same list and rep field"],
          ["Integrations", "Possible with external tools", "Depends on plan, permissions, and configured connections"],
          ["Reports", "Very flexible if you build them", "Reports screen exists; in the demo reviewed, data did not load"],
          ["Complexity and upkeep", "Simple at first, breaks as the file grows", "Needs update habit, returns one consistent process"],
        ],
        note: "The table describes a difference in approach, not a ranking. A tidy sheet can be enough at small scale.",
      },
    },
    {
      id: "metrics",
      heading: "How do you measure success in lead management?",
      paragraphs: [
        "Good measurement helps you understand not only how many inquiries arrived but what happened to them. The metrics below are professional concepts. Do not present them all as built-in reports if the system does not calculate them.",
        "On Bizuply’s reports screen there are headings for lead count, new leads, leads in progress, closed leads, conversion rate, deal amount, recorded revenue, meetings, open tasks, and active customers. In the demo environment filmed for this guide the reports request returned that the route was unavailable, so this guide does not show a screenshot of that screen and you should not infer numbers from it.",
      ],
      subsections: [
        {
          id: "metric-volume",
          heading: "Lead volume",
          paragraphs: [
            "Number of inquiries received in a given period. This is a counter, not a quality measure.",
          ],
        },
        {
          id: "metric-speed",
          heading: "Response time",
          paragraphs: [
            "Time from inquiry received until the first response the business defined for measurement. The metric is useful even without a ready-made report if you record inquiry time and response time.",
          ],
        },
        {
          id: "metric-handled",
          heading: "Handling rate",
          paragraphs: [
            "Share of leads that received treatment out of all leads received. A lead still in New status that nobody touched stays outside this count.",
          ],
        },
        {
          id: "metric-conversion",
          heading: "Conversion rate",
          paragraphs: [
            "Share of leads that became customers according to your definition. Formula: new customers divided by number of leads, times 100. If you review 80 leads and 8 close as customers, the rate is 10 percent.",
          ],
        },
        {
          id: "metric-cpl",
          heading: "Cost per lead",
          paragraphs: [
            "Ad budget divided by the number of leads attributed to it. This is a marketing calculation. It does not appear as a computed field on the reports screen that was checked.",
          ],
        },
        {
          id: "metric-cac",
          heading: "Customer acquisition cost",
          paragraphs: [
            "Total expenses you chose to include in acquisition, divided by customers acquired. Define what counts: media only, or also sales time and tools. This was not verified here as a working built-in report.",
          ],
        },
        {
          id: "metric-revenue",
          heading: "Revenue by source",
          paragraphs: [
            "How much revenue came from customers of each source when documentation links source to deal. Without that link, the figure is guesswork.",
          ],
        },
      ],
      widget: "calculator",
      model: {
        intro:
          "The calculator applies the conversion formula: customers divided by leads, times 100. It does not read data from Bizuply.",
        leads: "Number of leads",
        customers: "Number of customers won",
        result: "Conversion rate",
        invalid:
          "Enter valid numbers. Empty values, text, or negative numbers are not used in the calculation.",
        zero: "Cannot divide when the number of leads is zero.",
        note:
          "If customers exceed leads, check that you are using the same group and time period.",
      },
    },
    {
      id: "cheap-lead",
      heading: "Numeric example — why a cheap lead is not always worth it",
      band: true,
      paragraphs: [
        "A business runs two campaigns. In the first, 2,000 shekels were spent and 100 leads arrived. Cost per lead: 20 shekels. In the second, 2,000 shekels were spent and 50 leads arrived. Cost per lead: 40 shekels.",
        "At first glance the first campaign looks more successful. If two customers came from it and ten from the second, ad cost per new customer is 1,000 shekels in the first and 200 in the second. Numbers are illustrative only.",
        "The example shows why you should tie advertising to lead outcomes, not stop at inquiry count.",
      ],
    },
    {
      id: "channels",
      heading: "How do CRM, WhatsApp, and campaigns relate?",
      paragraphs: [
        "These are tools with different roles. A campaign can bring an inquiry. WhatsApp can be the conversation channel. CRM centralizes information and follow-up.",
        "With suitable connections, an inquiry from a marketing channel can be logged and enter treatment without manual copy from everywhere. Connection depends on permissions, settings, plan, and product capabilities. The demo showed leads whose source was website, meta_lead_ads, google_ads, and other values such as manual. Source appearing in the list does not replace connection and approvals required in a live account.",
      ],
      links: [
        { href: "/meta-campaigns", label: "Meta campaigns" },
        { href: "/whatsapp-api", label: "WhatsApp in the platform" },
        { href: "/automations", label: "Automations" },
      ],
    },
    {
      id: "automation",
      heading: "How do automations improve lead management?",
      paragraphs: [
        "Automation is an action that runs when a predefined event or condition occurs. For example: a new inquiry arrives from a form, a lead record is created, and if the process is configured and supported, a task or notification is created.",
        "The benefit is not only saving clicks. Automation can help the workflow stay consistent across people. Do not automate every interaction. When the customer needs explanation, a tailored quote, or exception handling, human response matters.",
        "Automated messaging requires permissions, consents, and channel rules. Test new automation on trial records before it touches real inquiries.",
      ],
    },
    {
      id: "mistakes",
      heading: "Seven common lead management mistakes",
      subsections: [
        {
          id: "m1",
          heading: "1. No clear owner for treatment",
          paragraphs: ["Without clear ownership, an inquiry may get no response."],
        },
        {
          id: "m2",
          heading: "2. Recording only contact details",
          paragraphs: ["Name and phone do not say what was requested or promised."],
        },
        {
          id: "m3",
          heading: "3. Leaving leads without a next action",
          paragraphs: ["Updated status does not replace a task or due date."],
        },
        {
          id: "m4",
          heading: "4. Building an overly complex process",
          paragraphs: ["Too many stages and fields make the team stop updating."],
        },
        {
          id: "m5",
          heading: "5. Ignoring duplicates",
          paragraphs: ["Duplicate cards split history. The leads screen also has a duplicates action."],
        },
        {
          id: "m6",
          heading: "6. Judging campaigns only by cost per lead",
          paragraphs: ["Cost per lead is not enough to understand quality or value."],
        },
        {
          id: "m7",
          heading: "7. Turning on automations without testing",
          paragraphs: ["A faulty process can set wrong status or run unnecessary actions."],
        },
      ],
    },
    {
      id: "choose",
      heading: "How do you choose a CRM for your business?",
      paragraphs: [
        "Before choosing, answer a few questions: where inquiries come from, how many people will work in the system, whether you need tasks or automations, which connections matter, whether you can export data, what is included in the price, how permissions are managed, and whether the team understands the screens.",
        "Do not choose only by feature count. A system that fits the workday, that staff understand, and with predictable cost may suit better than a broad platform whose options mostly sit unused.",
      ],
    },
    {
      id: "practice",
      heading: "Practical guide — getting started with leads in Bizuply",
      paragraphs: [
        "The steps below describe what was done in the Northwind Creative Studio demo account on 29 October 2026. It is a showcase account with fictional data, not real customers.",
      ],
      steps: [
        "Sign in to the workspace and open the leads area. You see the list, detail columns, and search, filters, and board view.",
        "This screen has no “New lead” form. A sample inquiry named Noa Levi was created when the demo site form was submitted, with an example.com email. You then find her via search. The screen also shows “Import leads”; this guide does not show import as a completed step.",
        "Open the card and see what you can read: contact details, status, source, and additional tabs.",
        "On the notes and activity tab save a note, for example that Noa wants a website and asked about design and a contact form.",
        "Change status from the menu on the card. The change is also logged in notes.",
        "On the tasks tab write the next action, for example “Call Noa back about the quote,” and you can set a due date. After saving, the task appears as text in the card’s task list.",
        "Return to the list, search by name, filter by status, and open board view to see cards in columns.",
        "Finally update status to reflect the outcome. The menu also includes Converted and Lost. A lead left open with no next action makes it hard to see what still needs work.",
      ],
      shots: [
        {
          file: "lead-arrived.webp",
          alt: "Searching for Noa Levi in the lead list",
          title: "Finding the new inquiry",
          caption: "Noa Levi after the demo site form created the record.",
        },
        {
          file: "lead-note.webp",
          alt: "Conversation note saved on Noa Levi’s card",
          title: "Logging the conversation on the card",
          caption: "The note is saved with the demo user name and date.",
        },
        {
          file: "lead-status.webp",
          alt: "Noa Levi’s status changed to Contacted and logged in history",
          title: "Status change after save",
          caption: "The card menu is where status was updated.",
        },
        {
          file: "lead-task.webp",
          alt: "Task to call Noa back about the quote on the tasks tab",
          title: "Task for follow-up",
          caption: "You can enter text and a due date. The list shows the task wording.",
        },
        {
          file: "leads-filters.webp",
          alt: "Filter panel above the lead list",
          title: "Filtering the list",
          caption: "Filters include status, stage, source, rep, and date range.",
        },
        {
          file: "leads-kanban.webp",
          alt: "Board view of leads in columns by status",
          title: "Board view by status",
          caption: "Columns seen on screen were New, Contacted, Interested, Converted, Lost, and Old.",
        },
      ],
      films: [
        {
          id: "film-create",
          file: "crm-create.mp4",
          poster: "crm-create-poster.jpg",
          title: "From new lead to an organized card",
          caption: "See how to find an inquiry that arrived from the site and start reading its treatment.",
          transcript: "Search for Noa Levi, open the card, and show inquiry source and form answers.",
        },
        {
          id: "film-note",
          file: "crm-note.mp4",
          poster: "crm-note-poster.jpg",
          title: "How do you keep treatment continuity?",
          caption: "A short update on the lead card shows what was done and inquiry status.",
          transcript: "Open a demo lead, write a conversation note, save, and change status.",
        },
        {
          id: "film-task",
          file: "crm-task.mp4",
          poster: "crm-task-poster.jpg",
          title: "What is next? Tracking inquiries",
          caption: "Add a task and due date from the lead card.",
          transcript: "On the tasks tab write the next action, set a due date, and save.",
        },
        {
          id: "film-views",
          file: "crm-views.mp4",
          poster: "crm-views-poster.jpg",
          title: "Quickly find inquiries that need attention",
          caption: "Search, filter by status, and switch to board view.",
          transcript: "Search for a lead, filter by status, open board view, and return to the list.",
        },
      ],
    },
    {
      id: "seven-days",
      heading: "Seven-day plan to roll out CRM",
      paragraphs: [
        "The goal is not to turn on every option in one day. The goal is a process you can repeat.",
      ],
      subsections: [
        {
          id: "d1",
          heading: "Day one — mapping",
          paragraphs: ["Identify every place inquiries are received."],
        },
        {
          id: "d2",
          heading: "Day two — organizing data",
          paragraphs: ["Centralize existing leads and check duplicates."],
        },
        {
          id: "d3",
          heading: "Day three — defining the process",
          paragraphs: ["Choose statuses and explain to the team what each means."],
        },
        {
          id: "d4",
          heading: "Day four — ownership",
          paragraphs: ["Decide who handles each inquiry and when to hand off."],
        },
        {
          id: "d5",
          heading: "Day five — follow-up",
          paragraphs: ["Define how you log actions and what the next action is."],
        },
        {
          id: "d6",
          heading: "Day six — practice",
          paragraphs: ["Practice on fictional leads, not live customers."],
        },
        {
          id: "d7",
          heading: "Day seven — improve",
          paragraphs: ["Review what was clear and what to fix before expanding use."],
        },
      ],
    },
    {
      id: "bizuply",
      heading: "How Bizuply helps with leads and customers",
      paragraphs: [
        "Bizuply combines customer and lead management with business communication, campaigns, automations, and website building. In CRM you can centralize inquiries and update treatment status, as shown on the card, list, and board view.",
        "Additional connections depend on plan and settings. Before choosing a plan, check which capabilities and connections are included and what must be approved.",
        "The product page describes the system and how to get started. This guide explains the workflow.",
      ],
      links: [{ href: "/crm", label: "Bizuply CRM" }],
    },
    {
      id: "close",
      heading: "In summary — good customer management starts with a clear process",
      paragraphs: [
        "CRM is not just a place to store contacts. It helps you see who reached out, what they asked for, what was already done, and what is needed next.",
        "With a clear process, updated data, and consistent follow-up, inquiries are easier to manage and you can learn from results. Start with a simple base and expand after the team actually uses it.",
      ],
      links: [{ href: "/crm", label: "Explore Bizuply CRM" }],
    },
  ],
  faq: [
    ["What is CRM in one sentence?", "CRM is customer relationship management software that centralizes lead and customer information and helps you track treatment."],
    ["What is a lead in sales?", "A lead is a person or business that showed interest in a product or service and may become a customer."],
    ["What is the difference between CRM and lead management?", "Lead management focuses on prospects and moving them through the sales process. CRM covers a broader relationship, including data, communications, and processes with existing customers."],
    ["Is CRM suitable for solo operators?", "Yes. Solo operators can log inquiries, save contacts, and track tasks if the system fits their scale."],
    ["Is CRM suitable for a small business?", "Yes, when the system fits scale, needs, and budget. An oversized system nobody uses is not an advantage."],
    ["Can CRM replace Excel?", "For managing the relationship process it may fit better than a sheet. Excel can still be used for analysis and tables."],
    ["Do you need technical experience to use CRM?", "Not necessarily. Complexity depends on the system; choose screens the team can learn."],
    ["How do leads get into CRM?", "In Bizuply an inquiry can arrive from a website form and from supported connections such as Meta Lead Ads or Google Ads, depending on settings. The leads screen also has import. There is no separate manual create button."],
    ["Can CRM connect to WhatsApp?", "Some systems support WhatsApp API connection. How connection works varies by product, plan, and permissions."],
    ["What is a sales funnel?", "A sales funnel describes how prospects move from first interest through purchase or closed treatment."],
    ["What is a Pipeline in CRM?", "A Pipeline is a view of process stages where inquiries or opportunities sit, so you can see how they move."],
    ["What is Kanban in lead management?", "Kanban is a view where items appear as cards in columns, for example by status. In Bizuply this is board view."],
    ["What is lead conversion rate?", "The ratio of leads that became customers to the number of leads reviewed in the same period or group."],
    ["What is lead response time?", "Time from when the inquiry was received until the first response defined for measurement."],
    ["How do you know which campaign a lead came from?", "When there is a reliable connection and source attribution, you can store channel or campaign on the record. Without attribution you cannot tell from the name alone."],
    ["Does CRM automatically increase sales?", "No. It can help organize and improve the process. Outcomes also depend on offer, inquiry quality, and team handling."],
    ["Can several staff use CRM?", "Many systems support multiple users and permissions. Check what your plan includes. The lead card has a rep field."],
    ["Is CRM useful for customer service too?", "Yes. You can keep contact history and handle existing customer inquiries, not only new prospects."],
    ["Can you automate based on lead status?", "In some systems you can trigger actions from status change or another event. Support depends on product and plan."],
    ["Should CRM be updated every day?", "Update actions and statuses close to when you handle them so information stays useful."],
    ["Can you move data from another system?", "Some systems offer import or connection. Before migrating, check format, duplicates, permissions, and integrity. Bizuply’s leads screen has an import button."],
    ["How much does CRM cost?", "Price varies by vendor, plan, users, and capabilities. Also check connection and add-on costs. Bizuply plan details are on the product page and pricing, not in this guide."],
    ["What should you check before buying CRM?", "Process fit, usability, connections, security and permissions, export, support, and total cost."],
    ["What do you do with old leads?", "Check whether there is a business and legal basis to re-engage, and record the outcome. Do not send marketing outreach without proper basis. Bizuply also has an Old lead area."],
    ["Does every lead need a quote?", "Not necessarily. Sometimes you should clarify need first and confirm the service fits."],
    ["What is the difference between CRM and automation?", "CRM manages customer-related information and processes. Automation runs predefined actions when conditions or events occur."],
  ],
};

export const es = {
  "title": "CRM y gestión de leads para empresas – la guía completa | Bizuply",
  "description": "¿Qué es un CRM y cómo gestionar leads? Guía de clientes, embudo, seguimiento, automatización y métricas, con ejemplos y vídeos.",
  "h1": "CRM y gestión de leads para empresas: la guía completa de clientes y ventas",
  "dek": "¿Cómo convertir consultas del sitio, WhatsApp y campañas en un proceso de venta ordenado? Principios, métricas y herramientas para gestionar cada lead y saber el siguiente paso.",
  "hero": {
    "alt": "Lista de clientes potenciales en Bizuply CRM con estados y fuentes de consulta a partir de datos de demostración",
    "title": "Espacio de trabajo para gestionar consultas",
    "caption": "Captura de pantalla de la cuenta de demostración de Northwind Creative Studio. Los nombres, las direcciones de example.com y los números 555 son ficticios."
  },
  "sections": [
    {
      "id": "what-is-crm",
      "heading": "¿Qué es CRM?",
      "paragraphs": [
        "Un cliente deja detalles en su sitio web. Otro envía un mensaje de WhatsApp. Un tercero responde sobre una cotización que enviaste hace una semana. Todos están interesados ​​en su negocio, pero sin un lugar que tenga el estado del tratamiento, es difícil saber quién recibió respuesta, quién está esperando una cotización y a quién debe volver a llamar hoy.",
        "CRM significa Gestión de relaciones con el cliente. El término describe un enfoque para gestionar la relación entre la empresa y sus clientes y, normalmente, también el software que respalda el proceso.",
        "Un sistema CRM es un software que centraliza información sobre clientes potenciales y clientes, registra las interacciones y le ayuda a gestionar las etapas de tratamiento y ventas en un solo lugar.",
        "Supongamos que el propietario de una empresa de servicios recibe una llamada solicitando una cotización. En la tarjeta puede guardar el nombre y los datos de contacto, anotar el servicio, registrar la conversación y dejar una tarea para realizar un seguimiento. Cuando el cliente vuelve a llamar, la tarjeta continúa donde se detuvo la última conversación. La información no tiene por qué vivir en la memoria de una sola persona.",
        "Un sistema CRM puede combinar contactos, clientes potenciales, estados, tareas, citas, documentos, registros de llamadas, informes y automatizaciones. Las capacidades exactas dependen del producto y del plan. Más adelante en esta guía observamos lo que existe en Bizuply y lo que apareció en capturas de pantalla, sin agregar pantallas que no se mostraron."
      ],
      "callout": "Una lista de contactos responde principalmente a cómo comunicarse con alguien. CRM también pretende responder por qué se comunicaron, qué ya se explicó, quién lo manejó, el estado del trato, qué hacer ahora y si la consulta terminó en una compra.",
      "shots": [
        {
          "file": "leads-workspace.webp",
          "alt": "Tabla de clientes potenciales de Bizuply con columnas de nombre, teléfono, correo electrónico, estado y fuente",
          "title": "Cómo es un espacio de trabajo central para consultas",
          "caption": "Puede buscar, filtrar, exportar y abrir una tarjeta. Esta pantalla no tiene un botón separado para \"Agregar cliente potencial\". Se creó una nueva consulta en la demostración a partir de un formulario de sitio web."
        }
      ],
      "films": [
        {
          "id": "film-intro",
          "file": "crm-intro.mp4",
          "poster": "crm-intro-poster.jpg",
          "title": "Cómo se ve la gestión de leads en Bizuply",
          "caption": "Un breve recorrido por el espacio de trabajo donde verá consultas, verificará el estado del tratamiento y abrirá los detalles de cada cliente potencial.",
          "transcript": "Inicie sesión en la cuenta de demostración, abra el área de clientes potenciales, escanee la lista, filtre por estado, abra una tarjeta de clientes potenciales y regrese a la lista."
        }
      ]
    },
    {
      "id": "lead-vs-customer",
      "heading": "¿Qué es un cliente potencial y en qué se diferencia de un cliente?",
      "paragraphs": [
        "Un cliente potencial es una persona o empresa que mostró interés en un producto o servicio. Pueden provenir de un formulario, una solicitud de cotización, detalles de una campaña, registro para obtener información o una consulta directa.",
        "Un cliente es alguien que ya compró un producto o servicio, según la definición empresarial que utiliza su organización. Esa palabra puede diferir entre una clínica, una empresa de servicios y una tienda, así que defínala antes de medir la conversión.",
        "Dana Israeli rellena un formulario en el sitio y pide información sobre una web para su negocio. En esa etapa Dana es un lead. Un representante la llama, escucha lo que necesita y envía una propuesta. Dana sigue siendo un lead, pero en una etapa más avanzada. Si aprueba la propuesta y completa la compra, pasa a ser cliente. Después empieza la entrega, el soporte, la renovación o una oferta adicional, según el caso."
      ],
      "subsections": [
        {
          "id": "lead-temperature",
          "heading": "Lead caliente, lead frío y lead que no encaja",
          "paragraphs": [
            "No todos los leads están igual de listos para comprar. Un lead caliente puede ser alguien que ya sabe lo que necesita, pidió una propuesta y quiere empezar pronto. Un lead frío puede ser alguien que conoció el negocio o pidió información general y todavía no planea comprar. Un lead que no encaja es una consulta que no coincide con el servicio, el presupuesto o el público.",
            "No infiera el nivel de interés solo a partir de la fuente. Lea la solicitud y lo que se dijo en la llamada."
          ]
        }
      ]
    },
    {
      "id": "why-lost",
      "heading": "¿Por qué las empresas pierden clientes potenciales?",
      "paragraphs": [
        "A veces, un cliente potencial no se convierte en cliente por motivos que escapan al control de la empresa. El cliente cambia de opinión, pospone la compra o elige otro proveedor. Algunas oportunidades se pierden por falta de orden.",
        "Llega una nueva consulta mientras el equipo está ocupado y nadie es propietario de la devolución de llamada. Un representante conoce al cliente, pero la conversación continúa con él y la siguiente persona no sabe lo que se acordó. Se envía una cotización sin fecha de seguimiento y sin registro del siguiente paso. Algunas consultas se encuentran en el sitio, otras en WhatsApp, algunas en campañas, otras en una hoja de cálculo. La empresa sabe cuánto gastó en anuncios, pero no qué pasó con las consultas.",
        "La gestión profesional de clientes potenciales no garantiza que cada consulta se convierta en cliente. Ayuda a garantizar que las consultas reciban un tratamiento coherente y que usted pueda comprender los resultados del proceso."
      ],
      "widget": "compare",
      "model": {
        "scenes": [
          {
            "title": "La consulta se queda en mensajes.",
            "body": "Un cliente envía una solicitud durante una hora punta. El mensaje queda en un chat privado, sin dueño y sin fecha de seguimiento. Cuando alguien más abre la bandeja de entrada al día siguiente, no está claro si alguien respondió."
          },
          {
            "title": "La consulta entra en proceso.",
            "body": "La misma solicitud se registra, obtiene un estado, se asigna a alguien y recibe la siguiente acción. Nadie promete una compra. Está claro quién se ocupa de ello y qué falta.",
            "ordered": true
          }
        ]
      }
    },
    {
      "id": "journey",
      "heading": "El viaje de un cliente potencial: desde la primera consulta hasta la decisión",
      "paragraphs": [
        "Seguimos una empresa que ofrece servicios de marketing digital. Yoav Mizrahi ve un anuncio, visita el sitio y envía un formulario. En cada etapa se puede ver dónde se encuentra la investigación y qué es lo que aún se necesita. El mismo flujo de trabajo debe mantenerse cuando varias personas atienden consultas."
      ],
      "widget": "journey",
      "model": {
        "label": "Etapas del viaje de un cliente potencial",
        "exampleLabel": "En el ejemplo de Yoav:",
        "steps": [
          {
            "title": "Consulta recibida",
            "body": "Se crea un registro con los datos de contacto, el servicio solicitado y la fuente cuando esté disponible.",
            "example": "Yoav envía un formulario después de un anuncio. La fuente y la solicitud se guardan con el registro."
          },
          {
            "title": "Contacto realizado",
            "body": "Alguien del equipo se acerca y registra que ocurrió la conversación.",
            "example": "Un representante llama a Yoav y actualiza el estado a Contactado."
          },
          {
            "title": "Necesidades aclaradas",
            "body": "Se verifican los objetivos, los cronogramas y el presupuesto estimado, con notas que otra persona puede entender.",
            "example": "Yoav quiere apoyo de campaña. La nota describe la necesidad, no sólo el número de teléfono."
          },
          {
            "title": "Siguiente acción",
            "body": "Defina lo que debería suceder ahora (llamada, información o cotización) y use un campo de fecha de vencimiento cuando lo haya.",
            "example": "Se abre una tarea para enviarle a Yoav un resumen de la llamada."
          },
          {
            "title": "Resultado",
            "body": "El estado se actualiza según lo que realmente sucedió: continuar, comprar o cerrar.",
            "example": "Si Yoav avanza, el récord avanza. Si no, ciérrala en lugar de dejarla abierta sin motivo."
          }
        ]
      },
      "films": [
        {
          "id": "film-journey",
          "file": "crm-journey.mp4",
          "poster": "crm-journey-poster.jpg",
          "title": "Desde la primera consulta hasta el tratamiento cerrado: demostración completa",
          "caption": "Yoav Mizrahi es un cliente potencial de demostración creado a partir del formulario del sitio web. El vídeo abre la tarjeta, agrega una nota, actualiza el estado y agrega una tarea.",
          "transcript": "Busque a Yoav Mizrahi en la lista, abra la tarjeta, lea los detalles, escriba una nota sobre la necesidad, cambie el estado, agregue una tarea de seguimiento y muestre el estado en la lista."
        }
      ]
    },
    {
      "id": "build-process",
      "heading": "¿Cómo se construye un proceso sólido de gestión de clientes potenciales?",
      "paragraphs": [
        "Un buen proceso es aquel que el equipo puede mantener actualizado. Unas pocas etapas claras superan decenas de campos que nadie llena."
      ],
      "subsections": [
        {
          "id": "sources",
          "heading": "1. Definir fuentes de consulta",
          "paragraphs": [
            "Lista de dónde provienen las consultas: sitio web, WhatsApp, formularios, campañas, llamadas telefónicas, referidos y redes sociales. No es necesario que los conecte todos el primer día. Comience con dos o tres canales para que queden menos consultas fuera del proceso."
          ]
        },
        {
          "id": "fields",
          "heading": "2. Defina lo que importa para cada cliente potencial",
          "paragraphs": [
            "Para la mayoría de las empresas, basta con comenzar con el nombre, el método de contacto, el servicio solicitado, la fuente, la fecha de recepción, el estado, el propietario y la siguiente acción. Recopile solo lo que requiere el objetivo comercial y administre los datos de acuerdo con las reglas de privacidad que se aplican a usted."
          ]
        },
        {
          "id": "stages",
          "heading": "3. Cree etapas de tratamiento claras",
          "paragraphs": [
            "Un proceso demasiado complejo es difícil de actualizar. En la tarjeta de cliente potencial de Bizuply, el menú de estado incluye Nuevo, Contactado, En curso, Interesado, Cotización, Negociación, Convertido, Perdido y Antiguo cliente potencial. En el tablero visto en columnas, las etiquetas aparecían como Nuevo, Contactado, Interesado, Convertido, Perdido y Antiguo. El equipo debe saber cuándo moverse entre etapas, no sólo cómo se llama el botón."
          ]
        },
        {
          "id": "owner",
          "heading": "4. Asigna un propietario para cada consulta.",
          "paragraphs": [
            "Cuando varias personas ven la misma lista, es necesario saber quién maneja qué. La tarjeta y la tabla incluyen un campo de representación. La propiedad clara evita que todos asuman que alguien más devolverá la llamada al cliente."
          ]
        },
        {
          "id": "next",
          "heading": "5. Establecer una siguiente acción",
          "paragraphs": [
            "El estado \"Interesado\" no dice qué hacer mañana. Prefiera una tarea enfocada, por ejemplo \"Llame el lunes y verifique si el cliente revisó la cotización\". La tarjeta tiene una pestaña de tareas con texto y un campo de fecha y hora."
          ]
        },
        {
          "id": "review",
          "heading": "6. Revisa el proceso periódicamente.",
          "paragraphs": [
            "Una vez a la semana, observe los nuevos clientes potenciales que aún no se han manejado, quién está esperando una devolución de llamada, cuántas cotizaciones están abiertas y por qué las consultas se estancaron. Eso saca a la luz los problemas antes de que se conviertan en un hábito."
          ]
        }
      ]
    },
    {
      "id": "card",
      "heading": "¿Cómo es una ficha de lead profesional?",
      "paragraphs": [
        "Una buena tarjeta le permite conocer rápidamente el estado de la consulta. Por ejemplo: Dana Israelí, creación del sitio web de servicio solicitado, formulario del sitio web de origen, estado Interesado, resumen sobre un sitio de marca con un formulario de contacto, siguiente acción: enviar cotización, representante de ventas del propietario. Estos detalles son ficticios.",
        "El valor no está en el recuento de campos sino en tener información importante disponible y actualizada. En la tarjeta de demostración verá nombre, teléfono, correo electrónico, estado, fuente y pestañas para detalles, fuente, respuestas de formularios, notas, tareas, reuniones, documentos, cotizaciones y pagos. No todas las pestañas se completan para cada cliente potencial."
      ],
      "shots": [
        {
          "file": "lead-card.webp",
          "alt": "Tarjeta principal de Noa Levi en Bizuply con nuevo estado y fuente del sitio web",
          "title": "Tarjeta principal de demostración",
          "caption": "Noa Levi llegó desde el formulario del sitio web. El correo electrónico es example.com y el teléfono es un número 555 a modo de ilustración."
        }
      ]
    },
    {
      "id": "small-business",
      "heading": "CRM para una pequeña empresa: ¿es realmente necesario?",
      "paragraphs": [
        "Una pequeña empresa no necesita necesariamente decenas de pantallas. Un operador solitario con pocas consultas puede comenzar con un seguimiento simple. Cuando cada consulta necesita una llamada, una cotización, un recordatorio o un paso adicional, CRM lo ayuda a mantenerse organizado incluso sin un gran equipo de ventas.",
        "El propietario de una clínica puede realizar un seguimiento de las consultas sobre servicios; El propietario de una empresa de consultoría puede registrar solicitudes de cotización. El sistema correcto es el que realmente utiliza. No compre una solución compleja sólo para funciones que no utilizará hoy."
      ]
    },
    {
      "id": "excel",
      "heading": "CRM versus Excel: ¿qué se adapta al negocio?",
      "paragraphs": [
        "Excel y hojas de cálculo similares son adecuadas para organizar datos y realizar un seguimiento básico. CRM se centra en el proceso de relación con el cliente. En una hoja puede enumerar el nombre, el teléfono y el estado. A medida que aumentan las consultas, las tareas y las personas, también necesita historial, propiedad, recordatorios y trabajo de más de una persona.",
        "CRM no necesariamente reemplaza todos los usos de hojas de cálculo. Una hoja aún puede respaldar el análisis. Las hojas también pueden cubrir algunas necesidades con columnas, filtros y complementos. La diferencia es que CRM se basa en la tarjeta, el estado y la siguiente acción."
      ],
      "table": {
        "columns": [
          "Tema",
          "Hoja de cálculo",
          "CRM"
        ],
        "rows": [
          [
            "Contactos",
            "Tabla flexible de nombres y teléfonos.",
            "Tarjeta con datos de contacto y estado."
          ],
          [
            "Historial de actividad",
            "Posible con columnas u hojas adicionales",
            "Notas y cambios de estado en la tarjeta."
          ],
          [
            "Seguimiento de estado",
            "Columna y lista",
            "Menú de estado y vista del tablero"
          ],
          [
            "Tareas",
            "Fecha en una columna, no siempre con recordatorios",
            "Tarea con texto y campo de vencimiento al principio"
          ],
          [
            "Trabajo en equipo",
            "Depende del intercambio de archivos y la disciplina.",
            "Misma lista y campo de representante"
          ],
          [
            "Integraciones",
            "Posible con herramientas externas",
            "Depende del plan, los permisos y las conexiones configuradas."
          ],
          [
            "Informes",
            "Muy flexible si los construyes.",
            "La pantalla de informes existe; en la demostración revisada, los datos no se cargaron"
          ],
          [
            "Complejidad y mantenimiento",
            "Simple al principio, se rompe a medida que el archivo crece.",
            "Necesita actualizar el hábito, devuelve un proceso consistente"
          ]
        ],
        "note": "La tabla describe una diferencia de enfoque, no una clasificación. Una hoja ordenada puede ser suficiente a pequeña escala."
      }
    },
    {
      "id": "metrics",
      "heading": "¿Cómo se mide el éxito en la gestión de leads?",
      "paragraphs": [
        "Una buena medición le ayuda a comprender no sólo cuántas consultas llegaron sino qué pasó con ellas. Las métricas siguientes son conceptos profesionales. No los presente todos como informes integrados si el sistema no los calcula.",
        "En la pantalla de informes de Bizuply hay encabezados para el recuento de clientes potenciales, nuevos clientes potenciales, clientes potenciales en curso, clientes potenciales cerrados, tasa de conversión, monto del acuerdo, ingresos registrados, reuniones, tareas abiertas y clientes activos. En el entorno de demostración filmado para esta guía, la solicitud de informes devolvió que la ruta no estaba disponible, por lo que esta guía no muestra una captura de pantalla de esa pantalla y no debe inferir números de ella."
      ],
      "subsections": [
        {
          "id": "metric-volume",
          "heading": "Volumen de clientes potenciales",
          "paragraphs": [
            "Número de consultas recibidas en un período determinado. Esto es un contador, no una medida de calidad."
          ]
        },
        {
          "id": "metric-speed",
          "heading": "Tiempo de respuesta",
          "paragraphs": [
            "Tiempo desde la recepción de la consulta hasta la primera respuesta que la empresa definió para su medición. La métrica es útil incluso sin un informe preparado si registra el tiempo de consulta y el tiempo de respuesta."
          ]
        },
        {
          "id": "metric-handled",
          "heading": "Tasa de atención",
          "paragraphs": [
            "Proporción de clientes potenciales que recibieron tratamiento de todos los clientes potenciales recibidos. Una ventaja que aún se encuentra en estado Nuevo y que nadie tocó queda fuera de este recuento."
          ]
        },
        {
          "id": "metric-conversion",
          "heading": "Tasa de conversión",
          "paragraphs": [
            "Proporción de clientes potenciales que se convirtieron en clientes según su definición. Fórmula: nuevos clientes divididos por la cantidad de clientes potenciales, multiplicado por 100. Si revisa 80 clientes potenciales y 8 cierran como clientes, la tasa es del 10 por ciento."
          ]
        },
        {
          "id": "metric-cpl",
          "heading": "Costo por cliente potencial",
          "paragraphs": [
            "Presupuesto publicitario dividido por el número de clientes potenciales que se le atribuyen. Este es un cálculo de marketing. No aparece como un campo calculado en la pantalla de informes que se verificó."
          ]
        },
        {
          "id": "metric-cac",
          "heading": "Costo de adquisición de clientes",
          "paragraphs": [
            "Gastos totales que eligió incluir en la adquisición, divididos por los clientes adquiridos. Define qué cuenta: solo medios o también tiempo y herramientas de venta. Esto no se verificó aquí como un informe integrado funcional."
          ]
        },
        {
          "id": "metric-revenue",
          "heading": "Ingresos por fuente",
          "paragraphs": [
            "Cuántos ingresos provienen de los clientes de cada fuente cuando la documentación vincula la fuente con el trato. Sin ese vínculo, la cifra es una conjetura."
          ]
        }
      ],
      "widget": "calculator",
      "model": {
        "intro": "La calculadora aplica la fórmula de conversión: clientes divididos por leads, multiplicado por 100. No lee datos de Bizuply.",
        "leads": "Número de clientes potenciales",
        "customers": "Número de clientes ganados",
        "result": "Tasa de conversión",
        "invalid": "Introduzca números válidos. En el cálculo no se utilizan valores vacíos, texto o números negativos.",
        "zero": "No se puede dividir cuando el número de clientes potenciales es cero.",
        "note": "Si los clientes superan los clientes potenciales, verifique que esté utilizando el mismo grupo y período de tiempo."
      }
    },
    {
      "id": "cheap-lead",
      "heading": "Ejemplo numérico: por qué no siempre vale la pena obtener una oportunidad de venta barata",
      "band": true,
      "paragraphs": [
        "Un negocio pone en marcha dos campañas. En la primera se invierten 2.000 shéqueles y llegan 100 leads. Coste por lead: 20 shéqueles. En la segunda se invierten 2.000 shéqueles y llegan 50 leads. Coste por lead: 40 shéqueles.",
        "A primera vista, la primera campaña parece más exitosa. Si de él proceden dos clientes y del segundo diez, el coste publicitario por nuevo cliente será de 1.000 shéquels en el primero y de 200 en el segundo. Los números son sólo ilustrativos.",
        "El ejemplo muestra por qué se debe vincular la publicidad a los resultados de los clientes potenciales, y no limitarse al recuento de consultas."
      ]
    },
    {
      "id": "channels",
      "heading": "¿Cómo se relacionan CRM, WhatsApp y las campañas?",
      "paragraphs": [
        "Estas son herramientas con diferentes roles. Una campaña puede generar una consulta. WhatsApp puede ser el canal de conversación. CRM centraliza la información y el seguimiento.",
        "Con las conexiones adecuadas, se puede registrar una consulta de un canal de marketing y entrar en tratamiento sin necesidad de realizar copias manuales desde cualquier lugar. La conexión depende de los permisos, la configuración, el plan y las capacidades del producto. La demostración mostró clientes potenciales cuya fuente era el sitio web, meta_lead_ads, google_ads y otros valores como manual. La fuente que aparece en la lista no reemplaza la conexión y las aprobaciones requeridas en una cuenta real."
      ],
      "links": [
        {
          "href": "/meta-campaigns",
          "label": "Metacampañas"
        },
        {
          "href": "/whatsapp-api",
          "label": "WhatsApp en la plataforma"
        },
        {
          "href": "/automations",
          "label": "Automatizaciones"
        }
      ]
    },
    {
      "id": "automation",
      "heading": "¿Cómo mejoran las automatizaciones la gestión de clientes potenciales?",
      "paragraphs": [
        "La automatización es una acción que se ejecuta cuando ocurre un evento o condición predefinida. Por ejemplo: llega una nueva consulta desde un formulario, se crea un registro de cliente potencial y, si el proceso está configurado y soportado, se crea una tarea o notificación.",
        "El beneficio no es sólo ahorrar clics. La automatización puede ayudar a que el flujo de trabajo se mantenga coherente entre las personas. No automatice todas las interacciones. Cuando el cliente necesita una explicación, un presupuesto personalizado o un manejo de excepciones, la respuesta humana es importante.",
        "La mensajería automatizada requiere permisos, consentimientos y reglas de canal. Pruebe la nueva automatización en registros de prueba antes de que afecte a consultas reales."
      ]
    },
    {
      "id": "mistakes",
      "heading": "Siete errores comunes en la gestión de leads",
      "subsections": [
        {
          "id": "m1",
          "heading": "1. No hay un dueño claro para el tratamiento",
          "paragraphs": [
            "Sin una propiedad clara, es posible que una consulta no obtenga respuesta."
          ]
        },
        {
          "id": "m2",
          "heading": "2. Registrar únicamente los datos de contacto",
          "paragraphs": [
            "Nombre y teléfono no dicen lo solicitado o prometido."
          ]
        },
        {
          "id": "m3",
          "heading": "3. Dejar clientes potenciales sin una siguiente acción",
          "paragraphs": [
            "El estado actualizado no reemplaza una tarea o fecha de vencimiento."
          ]
        },
        {
          "id": "m4",
          "heading": "4. Construir un proceso demasiado complejo",
          "paragraphs": [
            "Demasiadas etapas y campos hacen que el equipo deje de actualizarse."
          ]
        },
        {
          "id": "m5",
          "heading": "5. Ignorar duplicados",
          "paragraphs": [
            "Las cartas duplicadas dividen la historia. La pantalla de clientes potenciales también tiene una acción de duplicados."
          ]
        },
        {
          "id": "m6",
          "heading": "6. Juzgar las campañas únicamente por el costo por cliente potencial",
          "paragraphs": [
            "El costo por cliente potencial no es suficiente para comprender la calidad o el valor."
          ]
        },
        {
          "id": "m7",
          "heading": "7. Activar automatizaciones sin realizar pruebas",
          "paragraphs": [
            "Un proceso defectuoso puede establecer un estado incorrecto o ejecutar acciones innecesarias."
          ]
        }
      ]
    },
    {
      "id": "choose",
      "heading": "¿Cómo eliges un CRM para tu negocio?",
      "paragraphs": [
        "Antes de elegir, responda algunas preguntas: de dónde vienen las consultas, cuántas personas trabajarán en el sistema, si necesita tareas o automatizaciones, qué conexiones importan, si puede exportar datos, qué está incluido en el precio, cómo se gestionan los permisos y si el equipo entiende las pantallas.",
        "No elija sólo por el número de funciones. Un sistema que se adapte a la jornada laboral, que el personal entienda y con un costo predecible puede ser mejor que una plataforma amplia cuyas opciones en su mayoría no se utilizan."
      ]
    },
    {
      "id": "practice",
      "heading": "Guía práctica: cómo empezar con los clientes potenciales en Bizuply",
      "paragraphs": [
        "Los pasos siguientes describen lo que se hizo en la cuenta de demostración de Northwind Creative Studio el 29 de octubre de 2026. Es una cuenta modelo con datos ficticios, no de clientes reales."
      ],
      "steps": [
        "Inicie sesión en el espacio de trabajo y abra el área de clientes potenciales. Verá la lista, las columnas de detalles y la vista de búsqueda, filtros y tablero.",
        "Esta pantalla no tiene el formulario \"Nuevo cliente potencial\". Se creó una consulta de muestra llamada Noa Levi cuando se envió el formulario del sitio de demostración, con un correo electrónico de ejemplo.com. Luego la encontrarás mediante la búsqueda. La pantalla también muestra \"Importar clientes potenciales\"; Esta guía no muestra la importación como un paso completado.",
        "Abra la tarjeta y vea lo que puede leer: detalles de contacto, estado, fuente y pestañas adicionales.",
        "En la pestaña de notas y actividad, guarde una nota, por ejemplo, que Noa quiere un sitio web y preguntó sobre el diseño y un formulario de contacto.",
        "Cambia el estado desde el menú de la tarjeta. El cambio también se registra en notas.",
        "En la pestaña de tareas, escriba la siguiente acción, por ejemplo, \"Llame a Noa para solicitar la cotización\", y podrá establecer una fecha de vencimiento. Después de guardar, la tarea aparece como texto en la lista de tareas de la tarjeta.",
        "Regrese a la lista, busque por nombre, filtre por estado y abra la vista del tablero para ver tarjetas en columnas.",
        "Finalmente actualice el estado para reflejar el resultado. El menú también incluye Converted y Lost. Una pista que queda abierta sin ninguna acción siguiente hace que sea difícil ver qué es lo que aún necesita trabajo."
      ],
      "shots": [
        {
          "file": "lead-arrived.webp",
          "alt": "Buscando a Noa Levi en la lista de líderes",
          "title": "Encontrar la nueva consulta",
          "caption": "Noa Levi después del formulario del sitio de demostración creó el registro."
        },
        {
          "file": "lead-note.webp",
          "alt": "Nota de conversación guardada en la tarjeta de Noa Levi",
          "title": "Registrar la conversación en la tarjeta",
          "caption": "La nota se guarda con el nombre de usuario de demostración y la fecha."
        },
        {
          "file": "lead-status.webp",
          "alt": "El estado de Noa Levi cambió a Contactado y registrado en el historial",
          "title": "Cambio de estado después de guardar",
          "caption": "El menú de la tarjeta es donde se actualizó el estado."
        },
        {
          "file": "lead-task.webp",
          "alt": "Tarea para devolverle la llamada a Noa sobre la cotización en la pestaña de tareas",
          "title": "Tarea de seguimiento",
          "caption": "Puede ingresar texto y una fecha de vencimiento. La lista muestra la redacción de la tarea."
        },
        {
          "file": "leads-filters.webp",
          "alt": "Panel de filtro encima de la lista de clientes potenciales",
          "title": "Filtrando la lista",
          "caption": "Los filtros incluyen estado, etapa, fuente, representante y rango de fechas."
        },
        {
          "file": "leads-kanban.webp",
          "alt": "Vista de tablero de clientes potenciales en columnas por estado",
          "title": "Vista del tablero por estado",
          "caption": "Las columnas que se veían en la pantalla eran Nuevo, Contactado, Interesado, Convertido, Perdido y Antiguo."
        }
      ],
      "films": [
        {
          "id": "film-create",
          "file": "crm-create.mp4",
          "poster": "crm-create-poster.jpg",
          "title": "De un nuevo cliente potencial a una tarjeta organizada",
          "caption": "Vea cómo encontrar una consulta que llegó desde el sitio y comience a leer su tratamiento.",
          "transcript": "Busque a Noa Levi, abra la tarjeta y muestre la fuente de la consulta y las respuestas del formulario."
        },
        {
          "id": "film-note",
          "file": "crm-note.mp4",
          "poster": "crm-note-poster.jpg",
          "title": "¿Cómo se mantiene la continuidad del tratamiento?",
          "caption": "Una breve actualización en la tarjeta principal muestra lo que se hizo y el estado de la consulta.",
          "transcript": "Abra un cliente potencial de demostración, escriba una nota de conversación, guarde y cambie el estado."
        },
        {
          "id": "film-task",
          "file": "crm-task.mp4",
          "poster": "crm-task-poster.jpg",
          "title": "¿Qué sigue? Consultas de seguimiento",
          "caption": "Agregue una tarea y una fecha de vencimiento desde la tarjeta principal.",
          "transcript": "En la pestaña de tareas, escriba la siguiente acción, establezca una fecha de vencimiento y guárdela."
        },
        {
          "id": "film-views",
          "file": "crm-views.mp4",
          "poster": "crm-views-poster.jpg",
          "title": "Encuentre rápidamente consultas que necesiten atención",
          "caption": "Busque, filtre por estado y cambie a la vista del tablero.",
          "transcript": "Busque un cliente potencial, filtre por estado, abra la vista del tablero y regrese a la lista."
        }
      ]
    },
    {
      "id": "seven-days",
      "heading": "Plan de siete días para implementar CRM",
      "paragraphs": [
        "El objetivo no es activar todas las opciones en un día. El objetivo es un proceso que puedes repetir."
      ],
      "subsections": [
        {
          "id": "d1",
          "heading": "Día uno: mapeo",
          "paragraphs": [
            "Identifique cada lugar donde se reciben las consultas."
          ]
        },
        {
          "id": "d2",
          "heading": "Día dos: organización de datos",
          "paragraphs": [
            "Centralice los clientes potenciales existentes y compruebe los duplicados."
          ]
        },
        {
          "id": "d3",
          "heading": "Día tres: definir el proceso",
          "paragraphs": [
            "Elija estados y explique al equipo qué significa cada uno."
          ]
        },
        {
          "id": "d4",
          "heading": "Día cuatro: propiedad",
          "paragraphs": [
            "Decida quién maneja cada consulta y cuándo entregarla."
          ]
        },
        {
          "id": "d5",
          "heading": "Día cinco: seguimiento",
          "paragraphs": [
            "Defina cómo registra las acciones y cuál es la siguiente acción."
          ]
        },
        {
          "id": "d6",
          "heading": "Día seis: práctica",
          "paragraphs": [
            "Practique con clientes potenciales ficticios, no con clientes reales."
          ]
        },
        {
          "id": "d7",
          "heading": "Día siete: mejorar",
          "paragraphs": [
            "Revise lo que quedó claro y qué corregir antes de ampliar su uso."
          ]
        }
      ]
    },
    {
      "id": "bizuply",
      "heading": "Cómo Bizuply ayuda con los clientes potenciales y los clientes",
      "paragraphs": [
        "Bizuply combina la gestión de clientes y clientes potenciales con comunicación empresarial, campañas, automatizaciones y creación de sitios web. En CRM puedes centralizar consultas y actualizar el estado del tratamiento, como se muestra en la vista de tarjeta, lista y tablero.",
        "Las conexiones adicionales dependen del plan y la configuración. Antes de elegir un plan, verifica qué capacidades y conexiones están incluidas y cuáles deben ser aprobadas.",
        "La página del producto describe el sistema y cómo empezar. Esta guía explica el flujo de trabajo."
      ],
      "links": [
        {
          "href": "/crm",
          "label": "CRM Bizuply"
        }
      ]
    },
    {
      "id": "close",
      "heading": "En resumen: una buena gestión de clientes comienza con un proceso claro",
      "paragraphs": [
        "CRM no es sólo un lugar para almacenar contactos. Le ayuda a ver quién se acercó, qué pidieron, qué ya se hizo y qué se necesita a continuación.",
        "Con un proceso claro, datos actualizados y un seguimiento constante, las consultas son más fáciles de gestionar y se puede aprender de los resultados. Comience con una base simple y amplíela después de que el equipo realmente la use."
      ],
      "links": [
        {
          "href": "/crm",
          "label": "Explora Bizuply CRM"
        }
      ]
    }
  ],
  "faq": [
    [
      "¿Qué es CRM en una frase?",
      "CRM es un software de gestión de relaciones con los clientes que centraliza la información de los clientes potenciales y le ayuda a realizar un seguimiento del tratamiento."
    ],
    [
      "¿Qué es un liderazgo en ventas?",
      "Un cliente potencial es una persona o empresa que mostró interés en un producto o servicio y puede convertirse en cliente."
    ],
    [
      "¿Cuál es la diferencia entre CRM y gestión de leads?",
      "La gestión de clientes potenciales se centra en los clientes potenciales y en moverlos a través del proceso de ventas. CRM cubre una relación más amplia, que incluye datos, comunicaciones y procesos con clientes existentes."
    ],
    [
      "¿CRM es adecuado para operadores individuales?",
      "Sí. Los operadores individuales pueden registrar consultas, guardar contactos y realizar un seguimiento de las tareas si el sistema se ajusta a su escala."
    ],
    [
      "¿Es CRM adecuado para una pequeña empresa?",
      "Sí, cuando el sistema se ajusta a la escala, las necesidades y el presupuesto. Un sistema de gran tamaño que nadie utiliza no es una ventaja."
    ],
    [
      "¿Puede CRM reemplazar a Excel?",
      "Para gestionar el proceso de relación puede ser mejor que una sábana. Excel todavía se puede utilizar para análisis y tablas."
    ],
    [
      "¿Necesita experiencia técnica para utilizar CRM?",
      "No necesariamente. La complejidad depende del sistema; Elija pantallas que el equipo pueda aprender."
    ],
    [
      "¿Cómo llegan los clientes potenciales al CRM?",
      "En Bizuply, una consulta puede llegar desde un formulario de sitio web y desde conexiones compatibles, como Meta Lead Ads o Google Ads, según la configuración. La pantalla de leads también tiene importación. No hay un botón de creación manual independiente."
    ],
    [
      "¿Se puede conectar CRM a WhatsApp?",
      "Algunos sistemas admiten la conexión API de WhatsApp. El funcionamiento de la conexión varía según el producto, el plan y los permisos."
    ],
    [
      "¿Qué es un embudo de ventas?",
      "Un embudo de ventas describe cómo los prospectos pasan del primer interés a la compra o al trato cerrado."
    ],
    [
      "¿Qué es un Pipeline en CRM?",
      "Un Pipeline es una vista de las etapas del proceso donde se encuentran las consultas u oportunidades, para que pueda ver cómo avanzan."
    ],
    [
      "¿Qué es Kanban en la gestión de leads?",
      "Kanban es una vista donde los elementos aparecen como tarjetas en columnas, por ejemplo por estado. En Bizuply esta es la vista de tablero."
    ],
    [
      "¿Qué es la tasa de conversión de clientes potenciales?",
      "La proporción de clientes potenciales que se convirtieron en clientes con respecto al número de clientes potenciales revisados en el mismo período o grupo."
    ],
    [
      "¿Qué es el tiempo de respuesta del cliente potencial?",
      "Tiempo desde que se recibió la consulta hasta la primera respuesta definida para medición."
    ],
    [
      "¿Cómo saber de qué campaña provino un cliente potencial?",
      "Cuando existe una conexión confiable y una atribución de fuente, puede almacenar el canal o la campaña en el registro. Sin atribución no se puede saber solo por el nombre."
    ],
    [
      "¿CRM aumenta automáticamente las ventas?",
      "No. Puede ayudar a organizar y mejorar el proceso. Los resultados también dependen de la oferta, la calidad de las consultas y el manejo del equipo."
    ],
    [
      "¿Pueden varios empleados utilizar CRM?",
      "Muchos sistemas admiten múltiples usuarios y permisos. Consulta lo que incluye tu plan. La carta principal tiene un campo de repetición."
    ],
    [
      "¿CRM también es útil para el servicio de atención al cliente?",
      "Sí. Puede mantener el historial de contactos y manejar las consultas de los clientes existentes, no solo los nuevos prospectos."
    ],
    [
      "¿Se puede automatizar en función del estado del cliente potencial?",
      "En algunos sistemas, puede desencadenar acciones a partir de un cambio de estado u otro evento. El soporte depende del producto y el plan."
    ],
    [
      "¿Debería actualizarse el CRM todos los días?",
      "Actualice las acciones y los estados cerca del momento en que los maneja para que la información siga siendo útil."
    ],
    [
      "¿Puedes mover datos de otro sistema?",
      "Algunos sistemas ofrecen importación o conexión. Antes de migrar, verifique el formato, los duplicados, los permisos y la integridad. La pantalla de leads de Bizuply tiene un botón de importación."
    ],
    [
      "¿Cuánto cuesta el CRM?",
      "El precio varía según el proveedor, el plan, los usuarios y las capacidades. Consulte también los costos de conexión y complementos. Los detalles del plan Bizuply se encuentran en la página del producto y en los precios, no en esta guía."
    ],
    [
      "¿Qué debes comprobar antes de comprar CRM?",
      "Ajuste del proceso, usabilidad, conexiones, seguridad y permisos, exportación, soporte y costo total."
    ],
    [
      "¿Qué haces con los clientes potenciales viejos?",
      "Verifique si existe una base comercial y legal para volver a comprometerse y registre el resultado. No envíe campañas de marketing sin una base adecuada. Bizuply también tiene un área de leads antiguos."
    ],
    [
      "¿Cada cliente potencial necesita una cotización?",
      "No necesariamente. A veces, primero debe aclarar la necesidad y confirmar que el servicio es adecuado."
    ],
    [
      "¿Cuál es la diferencia entre CRM y automatización?",
      "CRM gestiona la información y los procesos relacionados con el cliente. La automatización ejecuta acciones predefinidas cuando ocurren condiciones o eventos."
    ]
  ]
};


export const ptBR = {
  "title": "CRM e gestão de leads para empresas – o guia completo | Bizuply",
  "description": "O que é CRM e como gerir leads? Guia de clientes, funil, follow-up, automação e métricas, com exemplos e vídeos.",
  "h1": "CRM e gestão de leads para empresas: o guia completo de clientes e vendas",
  "dek": "Como transformar consultas do site, WhatsApp e campanhas em um processo de vendas organizado? Princípios, métricas e ferramentas para gerir cada lead e saber o próximo passo.",
  "hero": {
    "alt": "Lista de leads no Bizuply CRM com status e fontes de consulta de dados de demonstração",
    "title": "Espaço de trabalho para gerenciar consultas",
    "caption": "Captura de tela da conta de demonstração do Northwind Creative Studio. Nomes, endereços example.com e números 555 são fictícios."
  },
  "sections": [
    {
      "id": "what-is-crm",
      "heading": "O que é CRM?",
      "paragraphs": [
        "Um cliente deixa detalhes em seu site. Outro envia uma mensagem pelo WhatsApp. Um terceiro volta sobre uma cotação que você enviou há uma semana. Todos estão interessados ​​no seu negócio, mas sem um local com status de tratamento fica difícil saber quem foi atendido, quem está aguardando um orçamento e para quem você precisa ligar hoje.",
        "CRM significa Gestão de Relacionamento com o Cliente. O termo descreve uma abordagem para gerenciar o relacionamento entre a empresa e seus clientes e, geralmente, também o software que dá suporte ao processo.",
        "Um sistema CRM é um software que centraliza informações sobre leads e clientes, registra interações e ajuda a gerenciar as etapas de tratamento e vendas em um só lugar.",
        "Suponha que o proprietário de uma empresa de serviços receba uma ligação solicitando um orçamento. No cartão você pode salvar nome e dados de contato, anotar o serviço, registrar a conversa e deixar uma tarefa para acompanhamento. Quando o cliente ligar novamente, o cartão continua onde a última conversa parou. A informação não precisa viver na memória de uma pessoa.",
        "Um sistema CRM pode combinar contatos, leads, status, tarefas, compromissos, documentos, registros de chamadas, relatórios e automações. Os recursos exatos dependem do produto e do plano. Posteriormente neste guia observamos o que existe no Bizuply e o que apareceu nas capturas de tela, sem adicionar telas que não foram mostradas."
      ],
      "callout": "Uma lista de contatos responde principalmente como entrar em contato com alguém. O CRM também serve para responder por que eles entraram em contato, o que já foi explicado, quem administrou o negócio, o status do negócio, o que fazer agora e se a consulta terminou em compra.",
      "shots": [
        {
          "file": "leads-workspace.webp",
          "alt": "Tabela de leads do Bizuply com colunas de nome, telefone, e-mail, status e origem",
          "title": "Qual é a aparência de um espaço de trabalho central para consultas",
          "caption": "Você pode pesquisar, filtrar, exportar e abrir um cartão. Esta tela não possui um botão separado “Adicionar lead”. Uma nova consulta na demonstração foi criada a partir de um formulário do site."
        }
      ],
      "films": [
        {
          "id": "film-intro",
          "file": "crm-intro.mp4",
          "poster": "crm-intro-poster.jpg",
          "title": "Como é o gerenciamento de leads no Bizuply",
          "caption": "Um breve tour pelo espaço de trabalho onde você vê consultas, verifica o status do tratamento e abre os detalhes de cada lead.",
          "transcript": "Faça login na conta demo, abra a área de leads, verifique a lista, filtre por status, abra um cartão de lead e retorne à lista."
        }
      ]
    },
    {
      "id": "lead-vs-customer",
      "heading": "O que é um lead e como ele difere de um cliente?",
      "paragraphs": [
        "Lead é uma pessoa ou empresa que demonstrou interesse em um produto ou serviço. Eles podem vir de um formulário, uma solicitação de orçamento, detalhes de uma campanha, inscrição para obter informações ou uma consulta direta.",
        "Cliente é alguém que já comprou um produto ou serviço, de acordo com a definição de negócio utilizada pela sua organização. Essa palavra pode diferir entre uma clínica, uma empresa de serviços e uma loja, portanto defina-a antes de medir a conversão.",
        "Dana Israel preenche um formulário no site e pede detalhes sobre como construir um site para sua empresa. Nesta fase, Dana é a líder. Um representante liga de volta, ouve o que ela precisa e envia um orçamento. Dana ainda lidera, mas em estágio mais avançado. Se ela aprovar o orçamento e finalizar a compra, ela se torna cliente. Depois disso, vem a entrega, o suporte, a renovação ou o upsell, conforme necessário."
      ],
      "subsections": [
        {
          "id": "lead-temperature",
          "heading": "Lead quente, lead frio e lead que não se encaixa",
          "paragraphs": [
            "Nem todo lead está igualmente pronto para comprar. Um lead quente pode ser alguém que já sabe o que precisa, pediu uma proposta e quer começar em breve. Um lead frio pode ser alguém que acabou de conhecer a empresa ou pediu uma informação geral e ainda não planeja comprar. Um lead que não se encaixa é uma consulta que não combina com o serviço, o orçamento ou o público.",
            "Não infira o nível de interesse apenas pela fonte. Leia a solicitação e o que foi dito na ligação."
          ]
        }
      ]
    },
    {
      "id": "why-lost",
      "heading": "Por que as empresas perdem leads?",
      "paragraphs": [
        "Às vezes, um lead não se torna um cliente por motivos fora do controle da empresa. O cliente muda de ideia, adia a compra ou escolhe outro fornecedor. Algumas oportunidades são perdidas por falta de ordem.",
        "Uma nova consulta chega enquanto a equipe está ocupada e ninguém possui o retorno de chamada. Um representante conhece o cliente, mas a conversa permanece com ele e a próxima pessoa não sabe o que foi combinado. Uma cotação sai sem data de acompanhamento e sem registro da próxima etapa. Algumas consultas ficam no site, algumas no WhatsApp, algumas em campanhas, outras em planilha. A empresa sabe quanto gastou em anúncios, mas não o que aconteceu com as consultas.",
        "O gerenciamento profissional de leads não garante que cada consulta se torne um cliente. Isso ajuda a garantir que as consultas recebam tratamento consistente e que você possa compreender os resultados do processo."
      ],
      "widget": "compare",
      "model": {
        "scenes": [
          {
            "title": "A consulta permanece em mensagens",
            "body": "Um cliente envia uma solicitação durante um horário de pico. A mensagem fica em um chat privado, sem dono e sem data de acompanhamento. Quando outra pessoa abre a caixa de entrada no dia seguinte, não está claro se alguém respondeu."
          },
          {
            "title": "A consulta entra em um processo",
            "body": "A mesma solicitação é registrada, recebe um status, é atribuída a alguém e recebe a próxima ação. Ninguém promete uma compra. Está claro quem está cuidando disso e o que está faltando.",
            "ordered": true
          }
        ]
      }
    },
    {
      "id": "journey",
      "heading": "A jornada de um lead – da primeira consulta à decisão",
      "paragraphs": [
        "Seguimos uma empresa que oferece serviços de marketing digital. Yoav Mizrahi vê um anúncio, visita o site e envia um formulário. Em cada etapa você pode ver onde está a investigação e o que ainda é necessário. O mesmo fluxo de trabalho deve ser mantido quando várias pessoas tratam de consultas."
      ],
      "widget": "journey",
      "model": {
        "label": "Etapas da jornada de um lead",
        "exampleLabel": "No exemplo de Yoav:",
        "steps": [
          {
            "title": "Consulta recebida",
            "body": "Um registro é criado com detalhes de contato, serviço solicitado e fonte, quando disponível.",
            "example": "Yoav envia um formulário após um anúncio. A origem e a solicitação são salvas com o registro."
          },
          {
            "title": "Contato realizado",
            "body": "Alguém da equipe entra em contato e registra que a conversa aconteceu.",
            "example": "Um representante liga para Yoav e atualiza o status para Contatado."
          },
          {
            "title": "Necessidades esclarecidas",
            "body": "Metas, cronogramas e orçamento estimado são verificados, com notas que outra pessoa pode entender.",
            "example": "Yoav quer apoio à campanha. A nota descreve a necessidade, não apenas o número de telefone."
          },
          {
            "title": "Próxima ação",
            "body": "Defina o que deve acontecer agora – ligação, informação ou orçamento – e use um campo de data de vencimento quando houver.",
            "example": "Uma tarefa é aberta para enviar ao Yoav um resumo da chamada."
          },
          {
            "title": "Resultado",
            "body": "O status é atualizado de acordo com o que realmente aconteceu: continuar, comprar ou fechar.",
            "example": "Se Yoav avançar, o recorde avança. Caso contrário, feche-o em vez de deixá-lo aberto sem motivo."
          }
        ]
      },
      "films": [
        {
          "id": "film-journey",
          "file": "crm-journey.mp4",
          "poster": "crm-journey-poster.jpg",
          "title": "Da primeira consulta ao tratamento fechado — demonstração completa",
          "caption": "Yoav Mizrahi é um líder de demonstração criado a partir do formulário do site. O vídeo abre o cartão, adiciona uma nota, atualiza o status e adiciona uma tarefa.",
          "transcript": "Encontre Yoav Mizrahi na lista, abra o cartão, leia os detalhes, escreva uma nota sobre a necessidade, altere o status, adicione uma tarefa de acompanhamento e mostre o estado na lista."
        }
      ]
    },
    {
      "id": "build-process",
      "heading": "Como você constrói um processo sólido de gerenciamento de leads?",
      "paragraphs": [
        "Um bom processo é aquele que a equipe consegue manter atualizado. Algumas etapas claras superam dezenas de campos que ninguém preenche."
      ],
      "subsections": [
        {
          "id": "sources",
          "heading": "1. Defina fontes de consulta",
          "paragraphs": [
            "Liste de onde vêm as consultas: site, WhatsApp, formulários, campanhas, ligações, referências e redes sociais. Você não precisa conectar todos eles no primeiro dia. Comece com dois ou três canais para que menos consultas fiquem fora do processo."
          ]
        },
        {
          "id": "fields",
          "heading": "2. Defina o que é importante para cada lead",
          "paragraphs": [
            "Para a maioria das empresas, basta começar com nome, método de contato, serviço solicitado, origem, data de recebimento, status, proprietário e próxima ação. Colete apenas o que o objetivo do negócio exige e gerencie os dados de acordo com as regras de privacidade que se aplicam a você."
          ]
        },
        {
          "id": "stages",
          "heading": "3. Crie etapas de tratamento claras",
          "paragraphs": [
            "Um processo excessivamente complexo é difícil de atualizar. No cartão de lead Bizuply, o menu de status inclui Lead novo, contatado, em andamento, interessado, cotação, negociação, convertido, perdido e antigo. No quadro visualizado em colunas, os rótulos apareciam como Novo, Contatado, Interessado, Convertido, Perdido e Antigo. A equipe deve saber quando se mover entre as fases, e não apenas como o botão é chamado."
          ]
        },
        {
          "id": "owner",
          "heading": "4. Atribua um proprietário para cada consulta",
          "paragraphs": [
            "Quando várias pessoas veem a mesma lista, você precisa saber quem cuida do quê. O cartão e a tabela incluem um campo de representação. A propriedade clara evita que todos presumam que outra pessoa ligará de volta para o cliente."
          ]
        },
        {
          "id": "next",
          "heading": "5. Defina uma próxima ação",
          "paragraphs": [
            "O status “Interessado” não diz o que fazer amanhã. Prefira uma tarefa focada, por exemplo “Ligue na segunda-feira e verifique se o cliente revisou o orçamento”. O cartão possui uma guia de tarefas com texto e um campo de data e hora."
          ]
        },
        {
          "id": "review",
          "heading": "6. Revise o processo regularmente",
          "paragraphs": [
            "Uma vez por semana, observe os novos leads ainda não atendidos, quem está aguardando um retorno de chamada, quantas cotações estão abertas e por que as consultas pararam. Isso traz à tona os problemas antes que se tornem um hábito."
          ]
        }
      ]
    },
    {
      "id": "card",
      "heading": "Qual é a aparência de um cartão de lead profissional?",
      "paragraphs": [
        "Um bom cartão permite que você entenda o status da consulta rapidamente. Por exemplo: Dana Israelita, construção de site de serviço solicitado, formulário do site de origem, status Interessado, resumo sobre um site de marca com formulário de contato, próxima ação enviar cotação, representante de vendas do proprietário. Esses detalhes são fictícios.",
        "O valor não está na contagem de campos, mas em ter informações importantes disponíveis e atualizadas. No cartão de demonstração você vê nome, telefone, e-mail, status, fonte e guias para detalhes, fonte, respostas de formulário, notas, tarefas, reuniões, documentos, cotações e pagamentos. Nem todas as guias são preenchidas para todos os leads."
      ],
      "shots": [
        {
          "file": "lead-card.webp",
          "alt": "Cartão principal de Noa Levi no Bizuply com novo status e fonte do site",
          "title": "Cartão de demonstração",
          "caption": "Noa Levi chegou do formulário do site. O e-mail é example.com e o telefone é um número 555 para ilustração."
        }
      ]
    },
    {
      "id": "small-business",
      "heading": "CRM para pequenas empresas – é realmente necessário?",
      "paragraphs": [
        "Uma pequena empresa não precisa necessariamente de dezenas de telas. Um operador individual com poucas dúvidas pode começar com um rastreamento simples. Quando cada consulta precisa de uma ligação, orçamento, lembrete ou etapa extra, o CRM ajuda você a se manter organizado mesmo sem uma grande equipe de vendas.",
        "O proprietário de uma clínica pode rastrear consultas de serviço; o proprietário de uma empresa de consultoria pode registrar solicitações de cotação. O sistema certo é aquele que você realmente usa. Não compre uma solução complexa apenas por recursos que você não usará hoje."
      ]
    },
    {
      "id": "excel",
      "heading": "CRM versus Excel — o que se adapta ao negócio?",
      "paragraphs": [
        "Excel e planilhas semelhantes são adequadas para organização de dados e rastreamento básico. O CRM se concentra no processo de relacionamento com o cliente. Em uma planilha você pode listar nome, telefone e status. À medida que as consultas, as tarefas e as pessoas crescem, você também precisa de histórico, propriedade, lembretes e trabalho de mais de uma pessoa.",
        "O CRM não substitui necessariamente todo uso de planilhas. Uma planilha ainda pode dar suporte à análise. As planilhas também podem atender a algumas necessidades com colunas, filtros e suplementos. A diferença é que o CRM é construído em torno de cartão, status e próxima ação."
      ],
      "table": {
        "columns": [
          "Tópico",
          "Planilha",
          "CRM"
        ],
        "rows": [
          [
            "Contatos",
            "Tabela flexível de nomes e telefones",
            "Cartão com detalhes de contato e status"
          ],
          [
            "Histórico de atividades",
            "Possível com colunas ou folhas extras",
            "Notas e alterações de status no cartão"
          ],
          [
            "Rastreamento de status",
            "Coluna e lista",
            "Menu de status e visualização do quadro"
          ],
          [
            "Tarefas",
            "Data em coluna, nem sempre com lembretes",
            "Tarefa com texto e campo devido no lead"
          ],
          [
            "Trabalho em equipe",
            "Depende do compartilhamento de arquivos e da disciplina",
            "Mesma lista e campo de representante"
          ],
          [
            "Integrações",
            "Possível com ferramentas externas",
            "Depende do plano, das permissões e das conexões configuradas"
          ],
          [
            "Relatórios",
            "Muito flexível se você construí-los",
            "Existe tela de relatórios; na demonstração revisada, os dados não foram carregados"
          ],
          [
            "Complexidade e manutenção",
            "Simples no começo, quebra conforme o arquivo cresce",
            "Precisa de hábito de atualização, retorna um processo consistente"
          ]
        ],
        "note": "A tabela descreve uma diferença de abordagem, não uma classificação. Uma folha arrumada pode ser suficiente em pequena escala."
      }
    },
    {
      "id": "metrics",
      "heading": "Como você mede o sucesso no gerenciamento de leads?",
      "paragraphs": [
        "Uma boa medição ajuda você a entender não apenas quantas consultas chegaram, mas também o que aconteceu com elas. As métricas abaixo são conceitos profissionais. Não apresente todos eles como relatórios integrados se o sistema não os calcular.",
        "Na tela de relatórios do Bizuply há títulos para contagem de leads, novos leads, leads em andamento, leads fechados, taxa de conversão, valor do negócio, receita registrada, reuniões, tarefas abertas e clientes ativos. No ambiente de demonstração filmado para este guia a solicitação de relatórios retornou que a rota estava indisponível, portanto este guia não mostra uma captura de tela dessa tela e você não deve inferir números dela."
      ],
      "subsections": [
        {
          "id": "metric-volume",
          "heading": "Volume de leads",
          "paragraphs": [
            "Número de consultas recebidas em um determinado período. Este é um contador, não uma medida de qualidade."
          ]
        },
        {
          "id": "metric-speed",
          "heading": "Tempo de resposta",
          "paragraphs": [
            "Tempo desde a consulta recebida até a primeira resposta que a empresa definiu para medição. A métrica é útil mesmo sem um relatório pronto, se você registrar o tempo de consulta e o tempo de resposta."
          ]
        },
        {
          "id": "metric-handled",
          "heading": "Taxa de manuseio",
          "paragraphs": [
            "Parcela de leads que receberam tratamento entre todos os leads recebidos. Um lead ainda no status Novo e que ninguém tocou fica fora desta contagem."
          ]
        },
        {
          "id": "metric-conversion",
          "heading": "Taxa de conversão",
          "paragraphs": [
            "Parcela de leads que se tornaram clientes de acordo com sua definição. Fórmula: novos clientes divididos pelo número de leads, vezes 100. Se você analisar 80 leads e 8 fecharem como clientes, a taxa será de 10%."
          ]
        },
        {
          "id": "metric-cpl",
          "heading": "Custo por lead",
          "paragraphs": [
            "Orçamento publicitário dividido pelo número de leads atribuídos a ele. Este é um cálculo de marketing. Não aparece como campo computado na tela de relatórios que foi verificado."
          ]
        },
        {
          "id": "metric-cac",
          "heading": "Custo de aquisição de clientes",
          "paragraphs": [
            "Despesas totais que você optou por incluir na aquisição, divididas pelos clientes adquiridos. Defina o que conta: apenas mídia ou também tempo e ferramentas de vendas. Isso não foi verificado aqui como um relatório integrado funcional."
          ]
        },
        {
          "id": "metric-revenue",
          "heading": "Receita por fonte",
          "paragraphs": [
            "Quanta receita veio dos clientes de cada fonte quando a documentação vincula a fonte ao negócio. Sem esse link, o número é uma adivinhação."
          ]
        }
      ],
      "widget": "calculator",
      "model": {
        "intro": "A calculadora aplica a fórmula de conversão: clientes divididos por leads, vezes 100. Ela não lê dados do Bizuply.",
        "leads": "Número de leads",
        "customers": "Quantidade de clientes conquistados",
        "result": "Taxa de conversão",
        "invalid": "Insira números válidos. Valores vazios, texto ou números negativos não são usados ​​no cálculo.",
        "zero": "Não é possível dividir quando o número de derivações é zero.",
        "note": "Se os clientes excederem os leads, verifique se você está usando o mesmo grupo e período de tempo."
      }
    },
    {
      "id": "cheap-lead",
      "heading": "Exemplo numérico – por que um lead barato nem sempre vale a pena",
      "band": true,
      "paragraphs": [
        "Uma empresa executa duas campanhas. No primeiro, foram gastos 2.000 shekels e chegaram 100 leads. Custo por lead: 20 shekels. No segundo, foram gastos 2.000 shekels e chegaram 50 leads. Custo por lead: 40 shekels.",
        "À primeira vista, a primeira campanha parece mais bem-sucedida. Se dois clientes vierem dele e dez do segundo, o custo do anúncio por novo cliente será de 1.000 shekels no primeiro e de 200 no segundo. Os números são apenas ilustrativos.",
        "O exemplo mostra por que você deve vincular a publicidade aos resultados do lead, e não parar na contagem de consultas."
      ]
    },
    {
      "id": "channels",
      "heading": "Como o CRM, o WhatsApp e as campanhas se relacionam?",
      "paragraphs": [
        "São ferramentas com funções diferentes. Uma campanha pode trazer um inquérito. O WhatsApp pode ser o canal de conversa. O CRM centraliza informações e acompanhamento.",
        "Com conexões adequadas, uma consulta de um canal de marketing pode ser registrada e entrar em tratamento sem cópia manual de qualquer lugar. A conexão depende de permissões, configurações, plano e recursos do produto. A demonstração mostrou leads cuja origem era website, meta_lead_ads, google_ads e outros valores, como manual. A fonte que aparece na lista não substitui a conexão e as aprovações exigidas em uma conta real."
      ],
      "links": [
        {
          "href": "/meta-campaigns",
          "label": "Metacampanhas"
        },
        {
          "href": "/whatsapp-api",
          "label": "WhatsApp na plataforma"
        },
        {
          "href": "/automations",
          "label": "Automações"
        }
      ]
    },
    {
      "id": "automation",
      "heading": "Como as automações melhoram o gerenciamento de leads?",
      "paragraphs": [
        "Automação é uma ação executada quando ocorre um evento ou condição predefinida. Por exemplo: chega uma nova consulta de um formulário, é criado um registro de lead e, se o processo estiver configurado e suportado, é criada uma tarefa ou notificação.",
        "O benefício não é apenas economizar cliques. A automação pode ajudar o fluxo de trabalho a permanecer consistente entre as pessoas. Não automatize todas as interações. Quando o cliente precisa de explicação, um orçamento personalizado ou tratamento de exceções, a resposta humana é importante.",
        "As mensagens automatizadas requerem permissões, consentimentos e regras de canal. Teste a nova automação em registros de teste antes que ela atinja questões reais."
      ]
    },
    {
      "id": "mistakes",
      "heading": "Sete erros comuns de gerenciamento de leads",
      "subsections": [
        {
          "id": "m1",
          "heading": "1. Nenhum proprietário claro para tratamento",
          "paragraphs": [
            "Sem uma propriedade clara, um inquérito pode não obter resposta."
          ]
        },
        {
          "id": "m2",
          "heading": "2. Registrando apenas detalhes de contato",
          "paragraphs": [
            "Nome e telefone não dizem o que foi solicitado ou prometido."
          ]
        },
        {
          "id": "m3",
          "heading": "3. Deixar leads sem próxima ação",
          "paragraphs": [
            "O status atualizado não substitui uma tarefa ou data de vencimento."
          ]
        },
        {
          "id": "m4",
          "heading": "4. Construindo um processo excessivamente complexo",
          "paragraphs": [
            "Muitas etapas e campos fazem com que a equipe pare de atualizar."
          ]
        },
        {
          "id": "m5",
          "heading": "5. Ignorando duplicatas",
          "paragraphs": [
            "Cartões duplicados dividem o histórico. A tela de leads também possui ação de duplicatas."
          ]
        },
        {
          "id": "m6",
          "heading": "6. Julgar campanhas apenas pelo custo por lead",
          "paragraphs": [
            "O custo por lead não é suficiente para compreender a qualidade ou o valor."
          ]
        },
        {
          "id": "m7",
          "heading": "7. Ativando automações sem testes",
          "paragraphs": [
            "Um processo defeituoso pode definir um status errado ou executar ações desnecessárias."
          ]
        }
      ]
    },
    {
      "id": "choose",
      "heading": "Como você escolhe um CRM para o seu negócio?",
      "paragraphs": [
        "Antes de escolher, responda algumas perguntas: de onde vêm as consultas, quantas pessoas trabalharão no sistema, se você precisa de tarefas ou automações, quais conexões importam, se é possível exportar dados, o que está incluso no preço, como as permissões são gerenciadas e se a equipe entende as telas.",
        "Não escolha apenas pela contagem de recursos. Um sistema que se adapta ao dia de trabalho, que a equipe entende e com custos previsíveis pode ser mais adequado do que uma plataforma ampla cujas opções geralmente permanecem sem uso."
      ]
    },
    {
      "id": "practice",
      "heading": "Guia prático — primeiros passos com leads no Bizuply",
      "paragraphs": [
        "As etapas abaixo descrevem o que foi feito na conta de demonstração do Northwind Creative Studio em 29 de outubro de 2026. É uma conta de demonstração com dados fictícios, não de clientes reais."
      ],
      "steps": [
        "Faça login no espaço de trabalho e abra a área de leads. Você vê a lista, as colunas de detalhes, a pesquisa, os filtros e a visualização do quadro.",
        "Esta tela não possui o formulário “Novo lead”. Um exemplo de consulta chamada Noa Levi foi criado quando o formulário do site de demonstração foi enviado, com um e-mail example.com. Você então a encontra por meio de pesquisa. A tela também mostra “Importar leads”; este guia não mostra a importação como uma etapa concluída.",
        "Abra o cartão e veja o que você pode ler: detalhes de contato, status, fonte e guias adicionais.",
        "Na guia notas e atividades, salve uma nota, por exemplo, que Noa quer um site e perguntou sobre design e um formulário de contato.",
        "Altere o status no menu do cartão. A alteração também é registrada em notas.",
        "Na guia de tarefas, escreva a próxima ação, por exemplo “Ligue para Noa sobre o orçamento” e você pode definir uma data de vencimento. Após salvar, a tarefa aparece como texto na lista de tarefas do cartão.",
        "Volte à lista, pesquise por nome, filtre por status e abra a visualização do quadro para ver os cartões nas colunas.",
        "Por fim, atualize o status para refletir o resultado. O menu também inclui Convertido e Perdido. Uma pista deixada em aberto sem nenhuma próxima ação torna difícil ver o que ainda precisa ser melhorado."
      ],
      "shots": [
        {
          "file": "lead-arrived.webp",
          "alt": "Procurando por Noa Levi na lista de líderes",
          "title": "Encontrando o novo inquérito",
          "caption": "Noa Levi após o formulário do site de demonstração criou o registro."
        },
        {
          "file": "lead-note.webp",
          "alt": "Nota de conversa salva no cartão de Noa Levi",
          "title": "Registrando a conversa no cartão",
          "caption": "A nota é salva com o nome de usuário de demonstração e a data."
        },
        {
          "file": "lead-status.webp",
          "alt": "O status de Noa Levi mudou para Contatado e registrado no histórico",
          "title": "Mudança de status após salvar",
          "caption": "O menu do cartão é onde o status foi atualizado."
        },
        {
          "file": "lead-task.webp",
          "alt": "Tarefa para ligar de volta para Noa sobre a cotação na guia de tarefas",
          "title": "Tarefa para acompanhamento",
          "caption": "Você pode inserir texto e uma data de vencimento. A lista mostra o texto da tarefa."
        },
        {
          "file": "leads-filters.webp",
          "alt": "Painel de filtro acima da lista de leads",
          "title": "Filtrando a lista",
          "caption": "Os filtros incluem status, estágio, origem, representante e intervalo de datas."
        },
        {
          "file": "leads-kanban.webp",
          "alt": "Visualização de quadro de leads em colunas por status",
          "title": "Visualização do quadro por status",
          "caption": "As colunas vistas na tela eram Novo, Contatado, Interessado, Convertido, Perdido e Antigo."
        }
      ],
      "films": [
        {
          "id": "film-create",
          "file": "crm-create.mp4",
          "poster": "crm-create-poster.jpg",
          "title": "Do novo lead a um cartão organizado",
          "caption": "Veja como encontrar uma consulta que chegou do site e comece a ler seu tratamento.",
          "transcript": "Procure por Noa Levi, abra o cartão e mostre a fonte da consulta e as respostas do formulário."
        },
        {
          "id": "film-note",
          "file": "crm-note.mp4",
          "poster": "crm-note-poster.jpg",
          "title": "Como você mantém a continuidade do tratamento?",
          "caption": "Uma breve atualização no cartão principal mostra o que foi feito e o status da consulta.",
          "transcript": "Abra um lead de demonstração, escreva uma nota de conversa, salve e altere o status."
        },
        {
          "id": "film-task",
          "file": "crm-task.mp4",
          "poster": "crm-task-poster.jpg",
          "title": "O que vem a seguir? Consultas de rastreamento",
          "caption": "Adicione uma tarefa e uma data de vencimento do cartão principal.",
          "transcript": "Na guia tarefas, escreva a próxima ação, defina uma data de vencimento e salve."
        },
        {
          "id": "film-views",
          "file": "crm-views.mp4",
          "poster": "crm-views-poster.jpg",
          "title": "Encontre rapidamente consultas que precisam de atenção",
          "caption": "Pesquise, filtre por status e mude para a visualização do quadro.",
          "transcript": "Pesquise um lead, filtre por status, abra a visualização do quadro e retorne à lista."
        }
      ]
    },
    {
      "id": "seven-days",
      "heading": "Plano de sete dias para implementar o CRM",
      "paragraphs": [
        "O objetivo não é ativar todas as opções em um dia. O objetivo é um processo que você pode repetir."
      ],
      "subsections": [
        {
          "id": "d1",
          "heading": "Primeiro dia - mapeamento",
          "paragraphs": [
            "Identifique todos os locais onde as consultas são recebidas."
          ]
        },
        {
          "id": "d2",
          "heading": "Segundo dia - organizando dados",
          "paragraphs": [
            "Centralize leads existentes e verifique duplicatas."
          ]
        },
        {
          "id": "d3",
          "heading": "Terceiro dia – definindo o processo",
          "paragraphs": [
            "Escolha os status e explique à equipe o que cada um significa."
          ]
        },
        {
          "id": "d4",
          "heading": "Dia quatro – propriedade",
          "paragraphs": [
            "Decida quem trata de cada consulta e quando entregar."
          ]
        },
        {
          "id": "d5",
          "heading": "Dia cinco – acompanhamento",
          "paragraphs": [
            "Defina como você registra ações e qual será a próxima ação."
          ]
        },
        {
          "id": "d6",
          "heading": "Dia seis – prática",
          "paragraphs": [
            "Pratique com leads fictícios, não com clientes reais."
          ]
        },
        {
          "id": "d7",
          "heading": "Sétimo dia – melhorar",
          "paragraphs": [
            "Revise o que ficou claro e o que corrigir antes de expandir o uso."
          ]
        }
      ]
    },
    {
      "id": "bizuply",
      "heading": "Como o Bizuply ajuda com leads e clientes",
      "paragraphs": [
        "Bizuply combina gerenciamento de clientes e leads com comunicação empresarial, campanhas, automações e construção de sites. No CRM você pode centralizar consultas e atualizar o status do tratamento, conforme mostrado no cartão, lista e visualização do quadro.",
        "Conexões adicionais dependem do plano e das configurações. Antes de escolher um plano, verifique quais capacidades e conexões estão incluídas e o que deve ser aprovado.",
        "A página do produto descreve o sistema e como começar. Este guia explica o fluxo de trabalho."
      ],
      "links": [
        {
          "href": "/crm",
          "label": "CRM Bizuply"
        }
      ]
    },
    {
      "id": "close",
      "heading": "Em resumo – uma boa gestão de clientes começa com um processo claro",
      "paragraphs": [
        "CRM não é apenas um lugar para armazenar contatos. Ajuda você a ver quem entrou em contato, o que pediu, o que já foi feito e o que é necessário a seguir.",
        "Com um processo claro, dados atualizados e acompanhamento consistente, as consultas são mais fáceis de gerenciar e você pode aprender com os resultados. Comece com uma base simples e expanda depois que a equipe realmente a utilizar."
      ],
      "links": [
        {
          "href": "/crm",
          "label": "Explore o Bizuply CRM"
        }
      ]
    }
  ],
  "faq": [
    [
      "O que é CRM em uma frase?",
      "CRM é um software de gerenciamento de relacionamento com o cliente que centraliza informações de leads e clientes e ajuda a rastrear o tratamento."
    ],
    [
      "O que é um lead em vendas?",
      "Lead é uma pessoa ou empresa que demonstrou interesse em um produto ou serviço e pode se tornar um cliente."
    ],
    [
      "Qual é a diferença entre CRM e gerenciamento de leads?",
      "O gerenciamento de leads se concentra nos clientes potenciais e em movê-los através do processo de vendas. O CRM cobre um relacionamento mais amplo, incluindo dados, comunicações e processos com clientes existentes."
    ],
    [
      "O CRM é adequado para operadores individuais?",
      "Sim. Os operadores individuais podem registrar consultas, salvar contatos e rastrear tarefas se o sistema se adequar à sua escala."
    ],
    [
      "O CRM é adequado para pequenas empresas?",
      "Sim, quando o sistema se ajusta à escala, às necessidades e ao orçamento. Um sistema superdimensionado que ninguém usa não é uma vantagem."
    ],
    [
      "O CRM pode substituir o Excel?",
      "Para gerenciar o processo de relacionamento pode servir melhor que uma planilha. O Excel ainda pode ser usado para análises e tabelas."
    ],
    [
      "Você precisa de experiência técnica para usar o CRM?",
      "Não necessariamente. A complexidade depende do sistema; escolha telas que a equipe possa aprender."
    ],
    [
      "Como os leads entram no CRM?",
      "No Bizuply, uma consulta pode chegar de um formulário de site e de conexões suportadas, como Meta Lead Ads ou Google Ads, dependendo das configurações. A tela de leads também possui importação. Não há botão de criação manual separado."
    ],
    [
      "O CRM pode se conectar ao WhatsApp?",
      "Alguns sistemas suportam conexão API do WhatsApp. O funcionamento da conexão varia de acordo com o produto, o plano e as permissões."
    ],
    [
      "O que é um funil de vendas?",
      "Um funil de vendas descreve como os clientes em potencial passam do primeiro interesse até a compra ou tratamento fechado."
    ],
    [
      "O que é um pipeline no CRM?",
      "Um Pipeline é uma visão dos estágios do processo onde estão as consultas ou oportunidades, para que você possa ver como elas se movem."
    ],
    [
      "O que é Kanban no gerenciamento de leads?",
      "Kanban é uma visualização onde os itens aparecem como cartões em colunas, por exemplo, por status. No Bizuply, esta é a visualização do quadro."
    ],
    [
      "O que é taxa de conversão de leads?",
      "A proporção de leads que se tornaram clientes em relação ao número de leads revisados no mesmo período ou grupo."
    ],
    [
      "Qual é o tempo de resposta do lead?",
      "Tempo desde o recebimento da consulta até a primeira resposta definida para medição."
    ],
    [
      "Como saber de qual campanha veio um lead?",
      "Quando há uma conexão confiável e atribuição de fonte, você pode armazenar o canal ou a campanha no registro. Sem atribuição você não pode dizer apenas pelo nome."
    ],
    [
      "O CRM aumenta as vendas automaticamente?",
      "Não. Pode ajudar a organizar e melhorar o processo. Os resultados também dependem da oferta, da qualidade da consulta e do manejo da equipe."
    ],
    [
      "Vários funcionários podem usar o CRM?",
      "Muitos sistemas oferecem suporte a vários usuários e permissões. Verifique o que seu plano inclui. O cartão principal possui um campo rep."
    ],
    [
      "O CRM também é útil para atendimento ao cliente?",
      "Sim. Você pode manter o histórico de contato e lidar com dúvidas de clientes existentes, não apenas de novos clientes potenciais."
    ],
    [
      "Você pode automatizar com base no status do lead?",
      "Em alguns sistemas você pode acionar ações a partir de mudança de status ou outro evento. O suporte depende do produto e do plano."
    ],
    [
      "O CRM deve ser atualizado todos os dias?",
      "Atualize ações e status próximo ao momento em que você os trata, para que as informações permaneçam úteis."
    ],
    [
      "Você pode mover dados de outro sistema?",
      "Alguns sistemas oferecem importação ou conexão. Antes de migrar, verifique o formato, duplicatas, permissões e integridade. A tela de leads do Bizuply possui um botão de importação."
    ],
    [
      "Quanto custa o CRM?",
      "O preço varia de acordo com fornecedor, plano, usuários e recursos. Verifique também os custos de conexão e complementos. Os detalhes do plano Bizuply estão na página do produto e nos preços, não neste guia."
    ],
    [
      "O que você deve verificar antes de comprar um CRM?",
      "Ajuste de processo, usabilidade, conexões, segurança e permissões, exportação, suporte e custo total."
    ],
    [
      "O que você faz com leads antigos?",
      "Verifique se existe uma base comercial e jurídica para voltar a envolver-se e registe o resultado. Não envie divulgação de marketing sem uma base adequada. Bizuply também possui uma área de lead antiga."
    ],
    [
      "Todo lead precisa de uma cotação?",
      "Não necessariamente. Às vezes, você deve primeiro esclarecer a necessidade e confirmar se o serviço é adequado."
    ],
    [
      "Qual é a diferença entre CRM e automação?",
      "O CRM gerencia informações e processos relacionados ao cliente. A automação executa ações predefinidas quando ocorrem condições ou eventos."
    ]
  ]
};


export const ar = {
  "title": "CRM وإدارة العملاء المحتملين للأعمال – الدليل الكامل | Bizuply",
  "description": "ما هو CRM وكيف تُدار العملاء المحتملون؟ دليل شامل للعملاء ومسار المبيعات والمتابعة والأتمتة والمقاييس، مع أمثلة وفيديو.",
  "h1": "CRM وإدارة العملاء المحتملين للأعمال: الدليل الكامل للعملاء والمبيعات",
  "dek": "كيف تحوّل الاستفسارات من الموقع وWhatsApp والحملات إلى عملية مبيعات منظمة؟ مبادئ ومقاييس وأدوات لإدارة كل عميل محتمل ومتابعته ومعرفة الخطوة التالية.",
  "hero": {
    "alt": "قائمة العملاء المتوقعين في Bizuply CRM مع الحالات ومصادر الاستفسار من البيانات التجريبية",
    "title": "مساحة عمل لإدارة الاستفسارات",
    "caption": "لقطة شاشة من الحساب التجريبي لـ Northwind Creative Studio. الأسماء وعناوين example.com و555 رقمًا خيالية."
  },
  "sections": [
    {
      "id": "what-is-crm",
      "heading": "ما هو إدارة علاقات العملاء؟",
      "paragraphs": [
        "يترك العميل التفاصيل على موقع الويب الخاص بك. وآخر يرسل رسالة واتساب. يعود ثالث حول اقتباس أرسلته قبل أسبوع. إنهم جميعًا مهتمون بعملك، ولكن بدون مكان واحد يحمل حالة العلاج، فمن الصعب معرفة من تم الرد عليه، ومن ينتظر عرض الأسعار، ومن تحتاج إلى معاودة الاتصال به اليوم.",
        "CRM يعني إدارة علاقات العملاء. يصف المصطلح أسلوبًا لإدارة العلاقة بين الشركة وعملائها، وعادةً أيضًا البرنامج الذي يدعم العملية.",
        "نظام إدارة علاقات العملاء (CRM) هو برنامج يقوم بتجميع المعلومات حول العملاء المتوقعين والعملاء، ويسجل التفاعلات، ويساعدك على إدارة مراحل العلاج والمبيعات في مكان واحد.",
        "لنفترض أن مالك شركة خدمات يتلقى مكالمة هاتفية يطلب عرض أسعار. يمكنك على البطاقة حفظ الاسم وتفاصيل الاتصال، وتدوين الخدمة، وتسجيل المحادثة، وترك مهمة للمتابعة. عندما يتصل العميل مرة أخرى، تلتقط البطاقة المكان الذي توقفت فيه المحادثة الأخيرة. ليس من الضروري أن تعيش المعلومات في ذاكرة شخص واحد.",
        "يمكن لنظام CRM الجمع بين جهات الاتصال والعملاء المتوقعين والحالات والمهام والمواعيد والمستندات وسجلات المكالمات والتقارير والأتمتة. تعتمد القدرات الدقيقة على المنتج والخطة. لاحقًا في هذا الدليل نلاحظ ما هو موجود في Bizuply وما ظهر في لقطات الشاشة، دون إضافة شاشات لم تظهر."
      ],
      "callout": "تجيب قائمة جهات الاتصال بشكل أساسي على كيفية الوصول إلى شخص ما. يهدف نظام إدارة علاقات العملاء (CRM) أيضًا إلى الإجابة عن سبب تواصلهم، وما تم شرحه بالفعل، ومن تعامل معه، وحالة الصفقة، وما يجب فعله الآن، وما إذا كان الاستفسار قد انتهى بعملية شراء.",
      "shots": [
        {
          "file": "leads-workspace.webp",
          "alt": "جدول Bizuply الرصاص مع أعمدة الاسم والهاتف والبريد الإلكتروني والحالة والمصدر",
          "title": "كيف تبدو مساحة العمل المركزية للاستفسارات",
          "caption": "يمكنك البحث عن البطاقة وتصفيتها وتصديرها وفتحها. لا تحتوي هذه الشاشة على زر \"إضافة عميل محتمل\" منفصل. تم إنشاء استعلام جديد في العرض التوضيحي من نموذج موقع ويب."
        }
      ],
      "films": [
        {
          "id": "film-intro",
          "file": "crm-intro.mp4",
          "poster": "crm-intro-poster.jpg",
          "title": "كيف تبدو إدارة العملاء المحتملين في Bizuply",
          "caption": "جولة قصيرة في مساحة العمل حيث ترى الاستفسارات وتتحقق من حالة العلاج وتفتح تفاصيل كل عميل محتمل.",
          "transcript": "قم بتسجيل الدخول إلى الحساب التجريبي، وافتح منطقة العملاء المتوقعين، وافحص القائمة، وقم بالتصفية حسب الحالة، وافتح بطاقة العميل المتوقع، ثم عد إلى القائمة."
        }
      ]
    },
    {
      "id": "lead-vs-customer",
      "heading": "ما هو العميل المحتمل وكيف يختلف عن العميل؟",
      "paragraphs": [
        "العميل المحتمل هو شخص أو شركة أبدت اهتمامًا بمنتج أو خدمة. وقد تأتي من نموذج، أو طلب عرض أسعار، أو تفاصيل الحملة، أو الاشتراك للحصول على معلومات، أو استفسار مباشر.",
        "العميل هو الشخص الذي اشترى بالفعل منتجًا أو خدمة، وفقًا لتعريف الأعمال الذي تستخدمه مؤسستك. يمكن أن تختلف هذه الكلمة بين عيادة وشركة خدمات ومتجر، لذا حددها قبل قياس التحويل.",
        "تملأ دانا إسرائيلي نموذجًا على الموقع وتطلب تفاصيل حول إنشاء موقع ويب لشركتها. في هذه المرحلة، تعتبر دانا رائدة. يقوم أحد المندوبين بمعاودة الاتصال بها، وسماع ما تحتاج إليه، ثم إرسال عرض أسعار. لا تزال دانا في المقدمة، ولكن في مرحلة أكثر تقدمًا. إذا وافقت على عرض الأسعار وأكملت عملية الشراء، فإنها تصبح عميلاً. بعد ذلك يأتي التسليم أو الدعم أو التجديد أو الترقية حسب الحاجة."
      ],
      "subsections": [
        {
          "id": "lead-temperature",
          "heading": "الرصاص الساخن والرصاص البارد واللياقة الضعيفة",
          "paragraphs": [
            "ليس كل عميل محتمل جاهزًا للشراء بنفس القدر. قد يعرف العميل المحتمل بالفعل ما يحتاج إليه، ويطلب عرض أسعار، ويريد البدء قريبًا. ربما يكون العميل المحتمل قد اكتشف العمل للتو أو طلب معلومات عامة ولا يخطط للشراء بعد. استفسار غير مناسب لا يتناسب مع الخدمة أو الميزانية أو الجمهور المستهدف.",
            "لا تستنتج مستوى الفائدة من المصدر وحده. اقرأ الطلب وما قيل في المكالمة."
          ]
        }
      ]
    },
    {
      "id": "why-lost",
      "heading": "لماذا تفقد الشركات العملاء المحتملين؟",
      "paragraphs": [
        "في بعض الأحيان، لا يصبح العميل المحتمل عميلاً لأسباب خارجة عن سيطرة الشركة. يغير العميل رأيه، أو يؤجل عملية الشراء، أو يختار مزودًا آخر. تضيع بعض الفرص بسبب عدم النظام.",
        "يصل استفسار جديد بينما يكون الفريق مشغولاً ولا أحد يملك رد الاتصال. يعرف أحد المندوبين العميل، لكن المحادثة تبقى معه ولا يعرف الشخص التالي ما تم الاتفاق عليه. يخرج عرض الأسعار بدون تاريخ متابعة ولا سجل للخطوة التالية. توجد بعض الاستفسارات على الموقع، وبعضها في WhatsApp، وبعضها في الحملات، والبعض الآخر في جدول بيانات. تعرف الشركة المبلغ الذي أنفقته على الإعلانات، لكنها لا تعرف ما حدث للاستفسارات.",
        "لا تضمن إدارة العملاء المحتملين أن كل استفسار يصبح عميلاً. فهو يساعد على ضمان حصول الاستفسارات على معالجة متسقة وأنه يمكنك فهم نتائج العملية."
      ],
      "widget": "compare",
      "model": {
        "scenes": [
          {
            "title": "يبقى الاستفسار في الرسائل",
            "body": "يرسل العميل طلبًا خلال ساعة مزدحمة. تبقى الرسالة في محادثة خاصة، بدون مالك ولا تاريخ للمتابعة. عندما يفتح شخص آخر البريد الوارد في اليوم التالي، فمن غير الواضح ما إذا كان أي شخص قد رد."
          },
          {
            "title": "التحقيق يدخل في عملية",
            "body": "يتم تسجيل الطلب نفسه، والحصول على الحالة، وتخصيصه لشخص ما، والحصول على الإجراء التالي. لا أحد يعد بالشراء. ومن الواضح من الذي يتعامل معها وما هو مفقود.",
            "ordered": true
          }
        ]
      }
    },
    {
      "id": "journey",
      "heading": "رحلة العميل المحتمل - من الاستفسار الأول إلى القرار",
      "paragraphs": [
        "نحن نتابع الأعمال التي تقدم خدمات التسويق الرقمي. يرى يوآف مزراحي إعلانًا، ويزور الموقع، ويقدم نموذجًا. وفي كل مرحلة، يمكنك أن ترى أين وصل الاستفسار وما الذي لا يزال مطلوبًا. يجب أن يستمر سير العمل نفسه عندما يتعامل عدة أشخاص مع الاستفسارات."
      ],
      "widget": "journey",
      "model": {
        "label": "مراحل رحلة الرصاص",
        "exampleLabel": "في مثال يوآف:",
        "steps": [
          {
            "title": "تم استلام الاستفسار",
            "body": "يتم إنشاء سجل يتضمن تفاصيل الاتصال والخدمة المطلوبة والمصدر عند توفره.",
            "example": "يقدم Yoav نموذجًا بعد الإعلان. يتم حفظ المصدر والطلب في السجل."
          },
          {
            "title": "تم الاتصال",
            "body": "يتواصل أحد أعضاء الفريق ويسجل حدوث المحادثة.",
            "example": "يتصل أحد الممثلين بـ Yoav ويقوم بتحديث الحالة إلى تم الاتصال به."
          },
          {
            "title": "تم توضيح الاحتياجات",
            "body": "يتم التحقق من الأهداف والجداول الزمنية والميزانية المقدرة، مع ملاحظات يمكن لشخص آخر فهمها.",
            "example": "يوآف يريد دعم الحملة. المذكرة تصف الحاجة، وليس رقم الهاتف فقط."
          },
          {
            "title": "الإجراء التالي",
            "body": "حدد ما يجب أن يحدث الآن - الاتصال أو المعلومات أو عرض الأسعار - واستخدم حقل تاريخ الاستحقاق عندما يكون هناك حقل.",
            "example": "يتم فتح مهمة لإرسال ملخص المكالمة إلى Yoav."
          },
          {
            "title": "النتيجة",
            "body": "يتم تحديث الحالة وفقًا لما حدث بالفعل: متابعة أو شراء أو إغلاق.",
            "example": "إذا تحرك يوآف للأمام، فإن السجل يتقدم. إذا لم يكن الأمر كذلك، قم بإغلاقه بدلاً من تركه مفتوحاً دون سبب."
          }
        ]
      },
      "films": [
        {
          "id": "film-journey",
          "file": "crm-journey.mp4",
          "poster": "crm-journey-poster.jpg",
          "title": "من الاستفسار الأول إلى العلاج المغلق – العرض التوضيحي الكامل",
          "caption": "يوآف مزراحي هو قائد تجريبي تم إنشاؤه من نموذج الموقع. يفتح الفيديو البطاقة ويضيف ملاحظة ويحدث الحالة ويضيف مهمة.",
          "transcript": "ابحث عن يوآف مزراحي في القائمة، افتح البطاقة، اقرأ التفاصيل، اكتب ملاحظة حول الحاجة، غيّر الحالة، أضف مهمة متابعة، وأظهر الحالة في القائمة."
        }
      ]
    },
    {
      "id": "build-process",
      "heading": "كيف يمكنك بناء عملية إدارة الرصاص السليمة؟",
      "paragraphs": [
        "العملية الجيدة هي تلك التي يمكن للفريق أن يبقيها على اطلاع دائم. بضع مراحل واضحة تغلبت على عشرات الحقول التي لم يملأها أحد."
      ],
      "subsections": [
        {
          "id": "sources",
          "heading": "1. تحديد مصادر الاستفسار",
          "paragraphs": [
            "قم بإدراج مصدر الاستفسارات: موقع الويب، وWhatsApp، والنماذج، والحملات، والمكالمات الهاتفية، والإحالات، ووسائل التواصل الاجتماعي. ليس عليك ربطهم جميعًا في اليوم الأول. ابدأ بقناتين أو ثلاث قنوات بحيث يبقى عدد أقل من الاستفسارات خارج العملية."
          ]
        },
        {
          "id": "fields",
          "heading": "2. حدد ما يهم كل عميل متوقع",
          "paragraphs": [
            "بالنسبة لمعظم الشركات، يكفي البدء بالاسم وطريقة الاتصال والخدمة المطلوبة والمصدر وتاريخ الاستلام والحالة والمالك والإجراء التالي. اجمع فقط ما يتطلبه هدف العمل وقم بإدارة البيانات وفقًا لقواعد الخصوصية التي تنطبق عليك."
          ]
        },
        {
          "id": "stages",
          "heading": "3. إنشاء مراحل علاجية واضحة",
          "paragraphs": [
            "من الصعب تحديث عملية معقدة للغاية. في بطاقة العميل المتوقع Bizuply، تتضمن قائمة الحالة العميل المحتمل الجديد، والذي تم الاتصال به، وقيد التقدم، والمهتم، وعرض الأسعار، والتفاوض، والمحول، والمفقود، والعميل المحتمل القديم. على اللوحة التي تم عرضها في الأعمدة، ظهرت التسميات على أنها جديد، وتم الاتصال به، ومهتم، ومحول، ومفقود، وقديم. يجب أن يعرف الفريق متى ينتقل بين المراحل، وليس فقط ما يسمى الزر."
          ]
        },
        {
          "id": "owner",
          "heading": "4. تعيين مالك لكل استفسار",
          "paragraphs": [
            "عندما يرى العديد من الأشخاص نفس القائمة، فأنت بحاجة إلى معرفة من يتولى ماذا. تتضمن البطاقة والجدول حقل مندوب. الملكية الواضحة تتجنب افتراض الجميع أن شخصًا آخر سيتصل بالعميل مرة أخرى."
          ]
        },
        {
          "id": "next",
          "heading": "5. قم بتعيين الإجراء التالي",
          "paragraphs": [
            "الحالة \"مهتم\" لا تقول ما يجب فعله غدًا. قم بتفضيل مهمة مركزة، على سبيل المثال \"اتصل يوم الاثنين وتحقق مما إذا كان العميل قد قام بمراجعة عرض الأسعار\". تحتوي البطاقة على علامة تبويب المهام التي تحتوي على نص وحقل التاريخ والوقت."
          ]
        },
        {
          "id": "review",
          "heading": "6. قم بمراجعة العملية بانتظام",
          "paragraphs": [
            "مرة واحدة في الأسبوع، قم بإلقاء نظرة على العملاء المحتملين الجدد الذين لم يتم التعامل معهم بعد، ومن ينتظر رد الاتصال، وعدد عروض الأسعار المفتوحة، وسبب توقف الاستفسارات. وهذا يبرز المشاكل قبل أن تصبح عادة."
          ]
        }
      ]
    },
    {
      "id": "card",
      "heading": "كيف تبدو بطاقة الرصاص المهنية؟",
      "paragraphs": [
        "تتيح لك البطاقة الجيدة فهم حالة الاستفسار بسرعة. على سبيل المثال: Dana Israel، إنشاء موقع الخدمة المطلوبة، نموذج موقع الويب المصدر، الحالة مهتم، ملخص حول موقع علامة تجارية مع نموذج اتصال، الإجراء التالي إرسال عرض الأسعار، مندوب مبيعات المالك. هذه التفاصيل خيالية",
        "القيمة ليست في عدد الحقول ولكن في وجود معلومات مهمة متاحة وحديثة. في البطاقة التجريبية، ترى الاسم والهاتف والبريد الإلكتروني والحالة والمصدر وعلامات التبويب للحصول على التفاصيل والمصدر وإجابات النماذج والملاحظات والمهام والاجتماعات والمستندات وعروض الأسعار والمدفوعات. لا يتم ملء كل علامة تبويب لكل عميل متوقع."
      ],
      "shots": [
        {
          "file": "lead-card.webp",
          "alt": "بطاقة نوعا ليفي الرائدة في Bizuply مع الحالة الجديدة ومصدر موقع الويب",
          "title": "بطاقة الرصاص التجريبية",
          "caption": "وصلت نوا ليفي من نموذج الموقع. البريد الإلكتروني هو example.com والهاتف رقم 555 للتوضيح."
        }
      ]
    },
    {
      "id": "small-business",
      "heading": "إدارة علاقات العملاء (CRM) للشركات الصغيرة – هل هي ضرورية حقًا؟",
      "paragraphs": [
        "لا تحتاج الشركات الصغيرة بالضرورة إلى عشرات الشاشات. يمكن للمشغل المنفرد الذي لديه القليل من الاستفسارات أن يبدأ بتتبع بسيط. عندما يحتاج كل استفسار إلى مكالمة أو عرض أسعار أو تذكير أو خطوة إضافية، يساعدك نظام إدارة علاقات العملاء (CRM) على البقاء منظمًا حتى بدون وجود فريق مبيعات كبير.",
        "يستطيع مالك العيادة متابعة استفسارات الخدمة؛ يمكن لمالك الشركة الاستشارية تسجيل طلبات عروض الأسعار. النظام الصحيح هو الذي تستخدمه بالفعل. لا تشتري حلاً معقدًا فقط من أجل الميزات التي لن تستخدمها اليوم."
      ]
    },
    {
      "id": "excel",
      "heading": "CRM مقابل Excel – ما الذي يناسب العمل؟",
      "paragraphs": [
        "يتناسب برنامج Excel وجداول البيانات المشابهة مع تنظيم البيانات والتتبع الأساسي. يركز CRM على عملية العلاقة مع العملاء. في ورقة يمكنك إدراج الاسم والهاتف والحالة. مع نمو الاستفسارات والمهام والأشخاص، تحتاج أيضًا إلى التاريخ والملكية والتذكيرات والعمل من قبل أكثر من شخص واحد.",
        "لا يحل CRM بالضرورة محل كل استخدام لجداول البيانات. لا يزال بإمكان الورقة دعم التحليل. يمكن للجداول أيضًا تغطية بعض الاحتياجات باستخدام الأعمدة والمرشحات والوظائف الإضافية. الفرق هو أن إدارة علاقات العملاء (CRM) مبنية على البطاقة والحالة والإجراء التالي."
      ],
      "table": {
        "columns": [
          "الموضوع",
          "جدول البيانات",
          "إدارة علاقات العملاء"
        ],
        "rows": [
          [
            "اتصالات",
            "جدول مرن للأسماء والهواتف",
            "بطاقة مع تفاصيل الاتصال والحالة"
          ],
          [
            "سجل النشاط",
            "ممكن مع أعمدة أو أوراق إضافية",
            "الملاحظات وتغييرات الحالة على البطاقة"
          ],
          [
            "تتبع الحالة",
            "العمود والقائمة",
            "قائمة الحالة وعرض اللوحة"
          ],
          [
            "المهام",
            "التاريخ في عمود، وليس دائمًا مع التذكيرات",
            "مهمة تحتوي على نص وحقل مستحق في العميل المتوقع"
          ],
          [
            "العمل الجماعي",
            "يعتمد على تبادل الملفات والانضباط",
            "نفس القائمة وحقل مندوب"
          ],
          [
            "التكامل",
            "ممكن مع أدوات خارجية",
            "يعتمد على الخطة والأذونات والاتصالات التي تم تكوينها"
          ],
          [
            "التقارير",
            "مرنة جدًا إذا قمت ببنائها",
            "شاشة التقارير موجودة في العرض التوضيحي الذي تمت مراجعته، لم يتم تحميل البيانات"
          ],
          [
            "التعقيد والصيانة",
            "بسيطة في البداية، تنكسر مع نمو الملف",
            "يحتاج إلى تحديث العادة، ويعيد عملية واحدة متسقة"
          ]
        ],
        "note": "يصف الجدول الفرق في النهج، وليس الترتيب. يمكن أن تكون الملاءة المرتبة كافية على نطاق صغير."
      }
    },
    {
      "id": "metrics",
      "heading": "كيف تقيس النجاح في إدارة العملاء المحتملين؟",
      "paragraphs": [
        "يساعدك القياس الجيد على فهم ليس فقط عدد الاستفسارات التي وصلت، بل أيضًا ما حدث لها. المقاييس أدناه هي المفاهيم المهنية. لا تقم بتقديمها جميعًا كتقارير مضمنة إذا لم يحسبها النظام.",
        "توجد في شاشة تقارير Bizuply عناوين لعدد العملاء المتوقعين، والعملاء المتوقعين الجدد، والعملاء المتوقعين قيد التقدم، والعملاء المتوقعين المغلقين، ومعدل التحويل، ومبلغ الصفقة، والإيرادات المسجلة، والاجتماعات، والمهام المفتوحة، والعملاء النشطين. في البيئة التجريبية التي تم تصويرها لهذا الدليل، عاد طلب التقارير بأن المسار غير متاح، لذلك لا يعرض هذا الدليل لقطة شاشة لتلك الشاشة ويجب ألا تستنتج منها أرقامًا."
      ],
      "subsections": [
        {
          "id": "metric-volume",
          "heading": "حجم الرصاص",
          "paragraphs": [
            "عدد الاستفسارات الواردة في فترة معينة. وهذا عداد وليس مقياس جودة."
          ]
        },
        {
          "id": "metric-speed",
          "heading": "وقت الاستجابة",
          "paragraphs": [
            "الوقت منذ تلقي الاستفسار حتى الرد الأول الذي حددته الشركة للقياس. يكون المقياس مفيدًا حتى بدون وجود تقرير جاهز إذا قمت بتسجيل وقت الاستفسار ووقت الاستجابة."
          ]
        },
        {
          "id": "metric-handled",
          "heading": "معدل التعامل",
          "paragraphs": [
            "نسبة العملاء المتوقعين الذين تلقوا العلاج من بين جميع العملاء المحتملين الذين تم تلقيهم. العميل المتوقع الذي لا يزال في الحالة الجديدة ولم يلمسه أحد يبقى خارج هذا العدد."
          ]
        },
        {
          "id": "metric-conversion",
          "heading": "معدل التحويل",
          "paragraphs": [
            "حصة العملاء المتوقعين الذين أصبحوا عملاء وفقًا لتعريفك. الصيغة: العملاء الجدد مقسومين على عدد العملاء المتوقعين، مضروبين في 100. إذا قمت بمراجعة 80 عميلاً محتملاً و8 عملاء قريبين، يكون المعدل 10 بالمائة."
          ]
        },
        {
          "id": "metric-cpl",
          "heading": "التكلفة لكل عميل محتمل",
          "paragraphs": [
            "ميزانية الإعلان مقسومة على عدد العملاء المتوقعين المنسوبين إليها. هذا هو حساب التسويق. ولا يظهر كحقل محسوب على شاشة التقارير التي تم فحصها."
          ]
        },
        {
          "id": "metric-cac",
          "heading": "تكلفة اكتساب العملاء",
          "paragraphs": [
            "إجمالي النفقات التي اخترت تضمينها في عملية الاستحواذ، مقسومًا على العملاء المكتسبين. حدد ما يهم: الوسائط فقط، أو أيضًا وقت المبيعات والأدوات. لم يتم التحقق من ذلك هنا كتقرير مدمج عامل."
          ]
        },
        {
          "id": "metric-revenue",
          "heading": "الإيرادات حسب المصدر",
          "paragraphs": [
            "ما مقدار الإيرادات التي تأتي من عملاء كل مصدر عندما تربط الوثائق المصدر بالتعامل. وبدون هذا الرابط، فإن هذا الرقم هو تخمين."
          ]
        }
      ],
      "widget": "calculator",
      "model": {
        "intro": "تطبق الآلة الحاسبة صيغة التحويل: العملاء مقسومون على العملاء المحتملين، مضروبًا في 100. ولا تقرأ البيانات من Bizuply.",
        "leads": "عدد الخيوط",
        "customers": "عدد العملاء الذين فازوا",
        "result": "معدل التحويل",
        "invalid": "أدخل أرقامًا صالحة. لا يتم استخدام القيم الفارغة أو النصوص أو الأرقام السالبة في الحساب.",
        "zero": "لا يمكن القسمة عندما يكون عدد الخيوط صفراً.",
        "note": "إذا تجاوز العملاء العملاء المحتملين، فتأكد من أنك تستخدم نفس المجموعة والفترة الزمنية."
      }
    },
    {
      "id": "cheap-lead",
      "heading": "مثال رقمي - لماذا لا يستحق العميل المحتمل الرخيص دائمًا كل هذا العناء",
      "band": true,
      "paragraphs": [
        "يدير النشاط التجاري حملتين. في البداية، تم إنفاق 2000 شيكل ووصل 100 عميل محتمل. تكلفة الرصاص الواحد: 20 شيكل. وفي الثانية، تم إنفاق 2000 شيكل ووصل 50 عميلاً. تكلفة الرصاص الواحد: 40 شيكل.",
        "للوهلة الأولى تبدو الحملة الأولى أكثر نجاحا. فإذا جاء منه عميلان وعشرة من الثاني، تكون تكلفة الإعلان لكل عميل جديد 1000 شيكل في الأول و200 في الثاني. الأرقام توضيحية فقط.",
        "يوضح المثال لماذا يجب عليك ربط الإعلان بالنتائج الرائدة، وليس التوقف عند عدد الاستفسارات."
      ]
    },
    {
      "id": "channels",
      "heading": "كيف ترتبط CRM وWhatsApp والحملات؟",
      "paragraphs": [
        "هذه أدوات ذات أدوار مختلفة. يمكن للحملة أن تجلب استفسارًا. يمكن أن يكون WhatsApp قناة المحادثة. يقوم نظام CRM بمركزية المعلومات والمتابعة.",
        "ومن خلال الاتصالات المناسبة، يمكن تسجيل استفسار من قناة تسويقية وإدخال العلاج بدون نسخة يدوية من كل مكان. يعتمد الاتصال على الأذونات والإعدادات والخطة وقدرات المنتج. أظهر العرض التوضيحي العملاء المحتملين الذين كان مصدرهم موقع الويب، وmeta_lead_ads، وgoogle_ads، وقيم أخرى مثل الدليل. المصدر الذي يظهر في القائمة لا يحل محل الاتصال والموافقات المطلوبة في الحساب الحقيقي."
      ],
      "links": [
        {
          "href": "/meta-campaigns",
          "label": "الحملات التعريفية"
        },
        {
          "href": "/whatsapp-api",
          "label": "الواتساب في المنصة"
        },
        {
          "href": "/automations",
          "label": "الأتمتة"
        }
      ]
    },
    {
      "id": "automation",
      "heading": "كيف تعمل الأتمتة على تحسين إدارة العملاء المتوقعين؟",
      "paragraphs": [
        "الأتمتة هي إجراء يتم تنفيذه عند حدوث حدث أو شرط محدد مسبقًا. على سبيل المثال: يصل استعلام جديد من نموذج، ويتم إنشاء سجل عميل متوقع، وإذا تم تكوين العملية ودعمها، فسيتم إنشاء مهمة أو إعلام.",
        "الفائدة ليست فقط في توفير النقرات. يمكن أن تساعد الأتمتة في الحفاظ على اتساق سير العمل بين الأشخاص. لا تقم بأتمتة كل التفاعل. عندما يحتاج العميل إلى شرح، أو عرض أسعار مخصص، أو معالجة الاستثناءات، فإن الاستجابة البشرية مهمة.",
        "تتطلب المراسلة التلقائية أذونات وموافقات وقواعد القناة. اختبر الأتمتة الجديدة على سجلات المحاكمة قبل أن تمس الاستفسارات الحقيقية."
      ]
    },
    {
      "id": "mistakes",
      "heading": "سبعة أخطاء شائعة في إدارة العملاء المحتملين",
      "subsections": [
        {
          "id": "m1",
          "heading": "1. لا يوجد مالك واضح للعلاج",
          "paragraphs": [
            "وبدون ملكية واضحة، قد لا يحصل الاستفسار على أي رد."
          ]
        },
        {
          "id": "m2",
          "heading": "2. تسجيل تفاصيل الاتصال فقط",
          "paragraphs": [
            "الاسم والهاتف لا يوضحان ما تم طلبه أو الوعد به."
          ]
        },
        {
          "id": "m3",
          "heading": "3. ترك العملاء المتوقعين دون اتخاذ الإجراء التالي",
          "paragraphs": [
            "لا تحل الحالة المحدثة محل المهمة أو تاريخ الاستحقاق."
          ]
        },
        {
          "id": "m4",
          "heading": "4. بناء عملية معقدة للغاية",
          "paragraphs": [
            "كثرة المراحل والمجالات تجعل الفريق يتوقف عن التحديث."
          ]
        },
        {
          "id": "m5",
          "heading": "5. تجاهل التكرارات",
          "paragraphs": [
            "بطاقات مكررة تقسيم التاريخ. تحتوي شاشة العملاء المتوقعين أيضًا على إجراء مكرر."
          ]
        },
        {
          "id": "m6",
          "heading": "6. الحكم على الحملات فقط من خلال التكلفة لكل عميل محتمل",
          "paragraphs": [
            "التكلفة لكل عميل محتمل ليست كافية لفهم الجودة أو القيمة."
          ]
        },
        {
          "id": "m7",
          "heading": "7. تشغيل الأتمتة دون اختبار",
          "paragraphs": [
            "يمكن أن تؤدي العملية الخاطئة إلى تعيين حالة خاطئة أو تشغيل إجراءات غير ضرورية."
          ]
        }
      ]
    },
    {
      "id": "choose",
      "heading": "كيف تختار نظام إدارة علاقات العملاء (CRM) لشركتك؟",
      "paragraphs": [
        "قبل الاختيار، أجب عن بعض الأسئلة: من أين تأتي الاستفسارات، وعدد الأشخاص الذين سيعملون في النظام، وما إذا كنت بحاجة إلى مهام أو عمليات أتمتة، وما هي الاتصالات المهمة، وما إذا كان يمكنك تصدير البيانات، وما هو مدرج في السعر، وكيف تتم إدارة الأذونات، وما إذا كان الفريق يفهم الشاشات.",
        "لا تختار فقط من خلال عدد الميزات. إن النظام الذي يناسب يوم العمل، والذي يفهمه الموظفون، وبتكلفة يمكن التنبؤ بها، قد يكون أكثر ملاءمة من النظام الأساسي الواسع الذي تظل خياراته غير مستخدمة في الغالب."
      ]
    },
    {
      "id": "practice",
      "heading": "دليل عملي - البدء مع العملاء المحتملين في Bizuply",
      "paragraphs": [
        "توضح الخطوات أدناه ما تم إجراؤه في الحساب التجريبي لـ Northwind Creative Studio في 29 أكتوبر 2026. وهو حساب عرض يحتوي على بيانات خيالية، وليس عملاء حقيقيين."
      ],
      "steps": [
        "قم بتسجيل الدخول إلى مساحة العمل وافتح منطقة العملاء المتوقعين. ترى القائمة وأعمدة التفاصيل والبحث والمرشحات وعرض اللوحة.",
        "لا تحتوي هذه الشاشة على نموذج \"عميل محتمل جديد\". تم إنشاء نموذج استعلام باسم نوعا ليفي عند إرسال نموذج الموقع التجريبي، باستخدام بريد إلكتروني على example.com. ثم تجدها عبر البحث. تعرض الشاشة أيضًا \"استيراد العملاء المتوقعين\"؛ لا يُظهر هذا الدليل الاستيراد كخطوة مكتملة.",
        "افتح البطاقة وشاهد ما يمكنك قراءته: تفاصيل الاتصال والحالة والمصدر وعلامات التبويب الإضافية.",
        "في علامة تبويب الملاحظات والنشاط، احفظ ملاحظة، على سبيل المثال أن Noa تريد موقع ويب وتسأل عن التصميم ونموذج الاتصال.",
        "تغيير الحالة من القائمة الموجودة على البطاقة. يتم تسجيل التغيير أيضًا في الملاحظات.",
        "في علامة تبويب المهام، اكتب الإجراء التالي، على سبيل المثال \"اتصل بـ Noa بشأن عرض الأسعار\"، ويمكنك تحديد تاريخ الاستحقاق. بعد الحفظ، تظهر المهمة كنص في قائمة مهام البطاقة.",
        "ارجع إلى القائمة، وابحث حسب الاسم، وقم بالتصفية حسب الحالة، وافتح عرض اللوحة لرؤية البطاقات في الأعمدة.",
        "أخيرًا قم بتحديث الحالة لتعكس النتيجة. تتضمن القائمة أيضًا المحولة والمفقودة. إن ترك العميل المحتمل مفتوحًا دون أي إجراء تالٍ يجعل من الصعب رؤية ما لا يزال بحاجة إلى العمل."
      ],
      "shots": [
        {
          "file": "lead-arrived.webp",
          "alt": "البحث عن نوعا ليفي في القائمة الرئيسية",
          "title": "العثور على التحقيق الجديد",
          "caption": "قامت نوعا ليفي بعد نموذج الموقع التجريبي بإنشاء السجل."
        },
        {
          "file": "lead-note.webp",
          "alt": "ملاحظة المحادثة محفوظة على بطاقة نوعا ليفي",
          "title": "تسجيل المحادثة على البطاقة",
          "caption": "يتم حفظ الملاحظة باسم المستخدم التجريبي والتاريخ."
        },
        {
          "file": "lead-status.webp",
          "alt": "تغيرت حالة نوعا ليفي إلى تم الاتصال بها وتسجيل الدخول في السجل",
          "title": "تغير الحالة بعد الحفظ",
          "caption": "قائمة البطاقة هي المكان الذي تم فيه تحديث الحالة."
        },
        {
          "file": "lead-task.webp",
          "alt": "مهمة إعادة الاتصال بـ Noa بشأن عرض الأسعار الموجود في علامة تبويب المهام",
          "title": "مهمة للمتابعة",
          "caption": "يمكنك إدخال النص وتاريخ الاستحقاق. تعرض القائمة صياغة المهمة."
        },
        {
          "file": "leads-filters.webp",
          "alt": "لوحة التصفية أعلى قائمة العملاء المتوقعين",
          "title": "تصفية القائمة",
          "caption": "تتضمن عوامل التصفية الحالة والمرحلة والمصدر والممثل ونطاق التاريخ."
        },
        {
          "file": "leads-kanban.webp",
          "alt": "عرض اللوحة للعملاء المتوقعين في الأعمدة حسب الحالة",
          "title": "عرض اللوحة حسب الحالة",
          "caption": "كانت الأعمدة التي تظهر على الشاشة جديدة، وتم الاتصال بها، ومهتمة، وتم تحويلها، ومفقودة، وقديمة."
        }
      ],
      "films": [
        {
          "id": "film-create",
          "file": "crm-create.mp4",
          "poster": "crm-create-poster.jpg",
          "title": "من الرصاص الجديد إلى البطاقة المنظمة",
          "caption": "تعرف على كيفية العثور على استفسار وصل من الموقع وابدأ بقراءة معالجته.",
          "transcript": "ابحث عن نوعا ليفي، وافتح البطاقة، وأظهر مصدر الاستفسار وإجابات النموذج."
        },
        {
          "id": "film-note",
          "file": "crm-note.mp4",
          "poster": "crm-note-poster.jpg",
          "title": "كيف تحافظ على استمرارية العلاج؟",
          "caption": "تحديث قصير على بطاقة العميل المتوقع يوضح ما تم فعله وحالة الاستفسار.",
          "transcript": "افتح عميلاً متوقعًا تجريبيًا، واكتب ملاحظة محادثة، واحفظ الحالة وقم بتغييرها."
        },
        {
          "id": "film-task",
          "file": "crm-task.mp4",
          "poster": "crm-task-poster.jpg",
          "title": "ما هو التالي؟ تتبع الاستفسارات",
          "caption": "أضف مهمة وتاريخ استحقاق من بطاقة العميل المتوقع.",
          "transcript": "في علامة تبويب المهام، اكتب الإجراء التالي، وحدد موعدًا نهائيًا، ثم احفظه."
        },
        {
          "id": "film-views",
          "file": "crm-views.mp4",
          "poster": "crm-views-poster.jpg",
          "title": "العثور بسرعة على الاستفسارات التي تحتاج إلى الاهتمام",
          "caption": "البحث والتصفية حسب الحالة والتبديل إلى عرض اللوحة.",
          "transcript": "ابحث عن عميل محتمل، وقم بالتصفية حسب الحالة، وافتح عرض اللوحة، ثم ارجع إلى القائمة."
        }
      ]
    },
    {
      "id": "seven-days",
      "heading": "خطة لمدة سبعة أيام لطرح CRM",
      "paragraphs": [
        "الهدف ليس تشغيل كل خيار في يوم واحد. الهدف هو عملية يمكنك تكرارها."
      ],
      "subsections": [
        {
          "id": "d1",
          "heading": "اليوم الأول – رسم الخرائط",
          "paragraphs": [
            "تحديد كل مكان يتم تلقي الاستفسارات فيه."
          ]
        },
        {
          "id": "d2",
          "heading": "اليوم الثاني – تنظيم البيانات",
          "paragraphs": [
            "مركزية العملاء المتوقعين الحاليين والتحقق من التكرارات."
          ]
        },
        {
          "id": "d3",
          "heading": "اليوم الثالث - تحديد العملية",
          "paragraphs": [
            "اختر الحالات واشرح للفريق معنى كل حالة."
          ]
        },
        {
          "id": "d4",
          "heading": "اليوم الرابع – الملكية",
          "paragraphs": [
            "قرر من سيتولى كل استفسار ومتى يتم تسليمه."
          ]
        },
        {
          "id": "d5",
          "heading": "اليوم الخامس – المتابعة",
          "paragraphs": [
            "حدد كيفية تسجيل الإجراءات وما هو الإجراء التالي."
          ]
        },
        {
          "id": "d6",
          "heading": "اليوم السادس – التدريب",
          "paragraphs": [
            "تدرب على العملاء المتوقعين الخياليين، وليس العملاء المباشرين."
          ]
        },
        {
          "id": "d7",
          "heading": "اليوم السابع – التحسن",
          "paragraphs": [
            "قم بمراجعة ما كان واضحًا وما يجب إصلاحه قبل توسيع الاستخدام."
          ]
        }
      ]
    },
    {
      "id": "bizuply",
      "heading": "كيف يساعد Bizuply مع العملاء المتوقعين والعملاء",
      "paragraphs": [
        "يجمع Bizuply بين إدارة العملاء وإدارة العملاء المحتملين مع الاتصالات التجارية والحملات والأتمتة وبناء مواقع الويب. في CRM، يمكنك مركزية الاستفسارات وتحديث حالة العلاج، كما هو موضح في عرض البطاقة والقائمة واللوحة.",
        "تعتمد الاتصالات الإضافية على الخطة والإعدادات. قبل اختيار الخطة، تحقق من الإمكانيات والاتصالات المضمنة وما يجب الموافقة عليه.",
        "تصف صفحة المنتج النظام وكيفية البدء. يشرح هذا الدليل سير العمل."
      ],
      "links": [
        {
          "href": "/crm",
          "label": "بيزوبلي لإدارة علاقات العملاء"
        }
      ]
    },
    {
      "id": "close",
      "heading": "باختصار - الإدارة الجيدة للعملاء تبدأ بعملية واضحة",
      "paragraphs": [
        "CRM ليس مجرد مكان لتخزين جهات الاتصال. يساعدك ذلك على معرفة من الذي تواصل معك، وما الذي طلبه، وما تم إنجازه بالفعل، وما هو مطلوب بعد ذلك.",
        "من خلال عملية واضحة وبيانات محدثة ومتابعة متسقة، تصبح إدارة الاستفسارات أسهل ويمكنك التعلم من النتائج. ابدأ بقاعدة بسيطة وتوسع بعد أن يستخدمها الفريق فعليًا."
      ],
      "links": [
        {
          "href": "/crm",
          "label": "اكتشف Bizuply CRM"
        }
      ]
    }
  ],
  "faq": [
    [
      "ما هو CRM في جملة واحدة؟",
      "CRM هو برنامج لإدارة علاقات العملاء يقوم بتجميع معلومات العملاء المحتملين والعملاء ويساعدك على تتبع العلاج."
    ],
    [
      "ما هو الرصاص في المبيعات؟",
      "العميل المحتمل هو شخص أو شركة أبدت اهتمامًا بمنتج أو خدمة ويمكن أن تصبح عميلاً."
    ],
    [
      "ما الفرق بين CRM وإدارة العملاء المحتملين؟",
      "تركز إدارة الرصاص على العملاء المحتملين ونقلهم خلال عملية البيع. يغطي CRM علاقة أوسع، بما في ذلك البيانات والاتصالات والعمليات مع العملاء الحاليين."
    ],
    [
      "هل CRM مناسب للمشغلين المنفردين؟",
      "نعم. يمكن للمشغلين المنفردين تسجيل الاستفسارات وحفظ جهات الاتصال وتتبع المهام إذا كان النظام يناسب حجمهم."
    ],
    [
      "هل نظام إدارة علاقات العملاء (CRM) مناسب للشركات الصغيرة؟",
      "نعم، عندما يتناسب النظام مع الحجم والاحتياجات والميزانية. إن النظام الكبير الحجم الذي لا يستخدمه أحد ليس ميزة."
    ],
    [
      "هل يمكن لإدارة علاقات العملاء (CRM) أن تحل محل برنامج Excel؟",
      "لإدارة عملية العلاقة قد يكون مناسبًا بشكل أفضل من الورقة. لا يزال من الممكن استخدام Excel للتحليل والجداول."
    ],
    [
      "هل تحتاج إلى خبرة تقنية لاستخدام CRM؟",
      "ليس بالضرورة. التعقيد يعتمد على النظام. اختر الشاشات التي يمكن للفريق تعلمها."
    ],
    [
      "كيف يمكن الوصول إلى العملاء المحتملين في نظام إدارة علاقات العملاء (CRM)؟",
      "في Bizuply، يمكن أن يصل الاستفسار من نموذج موقع ويب ومن الاتصالات المدعومة مثل Meta Lead Ads أو إعلانات Google، اعتمادًا على الإعدادات. تحتوي شاشة العملاء المتوقعين أيضًا على استيراد. لا يوجد زر إنشاء يدوي منفصل."
    ],
    [
      "هل يمكن لـ CRM الاتصال بـ WhatsApp؟",
      "تدعم بعض الأنظمة اتصال WhatsApp API. تختلف كيفية عمل الاتصال حسب المنتج والخطة والأذونات."
    ],
    [
      "ما هو قمع المبيعات؟",
      "يصف مسار تحويل المبيعات كيفية انتقال العملاء المحتملين من الاهتمام الأول إلى الشراء أو المعاملة المغلقة."
    ],
    [
      "ما هو خط الأنابيب في CRM؟",
      "المسار عبارة عن طريقة عرض لمراحل العملية التي توجد بها الاستفسارات أو الفرص، حتى تتمكن من رؤية كيفية تحركها."
    ],
    [
      "ما هو كانبان في إدارة العملاء المتوقعين؟",
      "كانبان هو طريقة عرض حيث تظهر العناصر كبطاقات في أعمدة، على سبيل المثال حسب الحالة. في Bizuply هذا هو عرض اللوحة."
    ],
    [
      "ما هو معدل تحويل الرصاص؟",
      "نسبة العملاء المتوقعين الذين أصبحوا عملاء إلى عدد العملاء المتوقعين الذين تمت مراجعتهم في نفس الفترة أو المجموعة."
    ],
    [
      "ما هو وقت الاستجابة الرصاص؟",
      "الوقت من تاريخ استلام الاستفسار حتى الاستجابة الأولى المحددة للقياس."
    ],
    [
      "كيف يمكنك معرفة الحملة التي جاء منها العميل المحتمل؟",
      "عندما يكون هناك اتصال موثوق به وإسناد المصدر، يمكنك تخزين القناة أو الحملة في السجل. بدون الإسناد لا يمكنك معرفة الاسم وحده."
    ],
    [
      "هل يؤدي نظام إدارة علاقات العملاء (CRM) إلى زيادة المبيعات تلقائيًا؟",
      "لا، يمكن أن يساعد في تنظيم العملية وتحسينها. تعتمد النتائج أيضًا على العرض وجودة الاستفسار والتعامل مع الفريق."
    ],
    [
      "هل يمكن للعديد من الموظفين استخدام إدارة علاقات العملاء (CRM)؟",
      "تدعم العديد من الأنظمة العديد من المستخدمين والأذونات. تحقق مما تتضمنه خطتك. تحتوي البطاقة الرئيسية على حقل مندوب."
    ],
    [
      "هل CRM مفيد لخدمة العملاء أيضًا؟",
      "نعم. يمكنك الاحتفاظ بسجل جهات الاتصال والتعامل مع استفسارات العملاء الحاليين، وليس فقط العملاء المحتملين الجدد."
    ],
    [
      "هل يمكنك الأتمتة بناءً على حالة العميل المتوقع؟",
      "في بعض الأنظمة، يمكنك تشغيل الإجراءات من تغيير الحالة أو من حدث آخر. يعتمد الدعم على المنتج والخطة."
    ],
    [
      "هل يجب تحديث CRM كل يوم؟",
      "قم بتحديث الإجراءات والحالات في وقت قريب من التعامل معها حتى تظل المعلومات مفيدة."
    ],
    [
      "هل يمكنك نقل البيانات من نظام آخر؟",
      "توفر بعض الأنظمة الاستيراد أو الاتصال. قبل الترحيل، تحقق من التنسيق والتكرارات والأذونات والتكامل. تحتوي شاشة العملاء المحتملين في Bizuply على زر استيراد."
    ],
    [
      "كم تكلفة إدارة علاقات العملاء (CRM)؟",
      "يختلف السعر حسب البائع والخطة والمستخدمين والقدرات. تحقق أيضًا من تكاليف الاتصال والوظائف الإضافية. تفاصيل خطة Bizuply موجودة في صفحة المنتج والأسعار، وليس في هذا الدليل."
    ],
    [
      "ما الذي يجب عليك التحقق منه قبل شراء CRM؟",
      "ملاءمة العملية وسهولة الاستخدام والاتصالات والأمان والأذونات والتصدير والدعم والتكلفة الإجمالية."
    ],
    [
      "ماذا تفعل مع الخيوط القديمة؟",
      "تحقق مما إذا كان هناك أساس تجاري وقانوني لإعادة المشاركة، وقم بتسجيل النتيجة. لا ترسل التوعية التسويقية دون أساس سليم. يوجد في Bizuply أيضًا منطقة الرصاص القديمة."
    ],
    [
      "هل يحتاج كل عميل محتمل إلى عرض أسعار؟",
      "ليس بالضرورة. في بعض الأحيان يجب عليك توضيح الحاجة أولاً والتأكد من ملاءمة الخدمة."
    ],
    [
      "ما الفرق بين إدارة علاقات العملاء (CRM) والأتمتة؟",
      "يدير CRM المعلومات والعمليات المتعلقة بالعملاء. تقوم الأتمتة بتشغيل إجراءات محددة مسبقًا عند حدوث ظروف أو أحداث."
    ]
  ]
};
