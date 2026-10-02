import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Code2,
  KeyRound,
  LayoutDashboard,
  Menu,
  Minus,
  Network,
  Phone,
  Plug,
  Server,
  ShieldCheck,
  Terminal,
  Webhook,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import {
  WHATSAPP_CANONICAL_URL,
  WHATSAPP_SEO_DESCRIPTION,
  WHATSAPP_SEO_KEYWORDS,
  WHATSAPP_SEO_TITLE,
  isBizuplyWhatsAppHost,
} from "../../lib/whatsappHost.mjs";
import { LANGUAGE_META } from "../../i18n/languages";
import { coerceSupportedLanguage, getTextDirection } from "../../i18n/localeUtils";
import { changeAppLanguage } from "../../i18n/persistLanguage";
import MetaCostCalculator from "../business/dashboardPages/whatsapp/MetaCostCalculator";
import "./whatsappApiLanding.css";

const DOCS_URL = "https://api.bizuply.com/api/v1/whatsapp/docs";
const SIGN_IN_URL = "https://bizuply.com/login";

const NAV = [
  ["Product", "#product"],
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["Calculator", "#calculator"],
  ["Developers", "#developers"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
] as const;

const NAV_I18N: Record<string, Array<(typeof NAV)[number]>> = {
  he: [
    ["מוצר", "#product"],
    ["יכולות", "#features"],
    ["מחירים", "#pricing"],
    ["מחשבון", "#calculator"],
    ["מפתחים", "#developers"],
    ["שאלות", "#faq"],
    ["יצירת קשר", "#contact"],
  ],
  es: [
    ["Producto", "#product"],
    ["Funciones", "#features"],
    ["Precios", "#pricing"],
    ["Calculadora", "#calculator"],
    ["Desarrolladores", "#developers"],
    ["Preguntas", "#faq"],
    ["Contacto", "#contact"],
  ],
  "pt-BR": [
    ["Produto", "#product"],
    ["Recursos", "#features"],
    ["Preços", "#pricing"],
    ["Calculadora", "#calculator"],
    ["Desenvolvedores", "#developers"],
    ["Perguntas", "#faq"],
    ["Contato", "#contact"],
  ],
  ar: [
    ["المنتج", "#product"],
    ["المزايا", "#features"],
    ["الأسعار", "#pricing"],
    ["الحاسبة", "#calculator"],
    ["المطورون", "#developers"],
    ["الأسئلة", "#faq"],
    ["تواصل", "#contact"],
  ],
};

const HERO_I18N: Record<string, { kicker: string; title: string; accent: string; lead: string; start: string; demo: string }> = {
  he: {
    kicker: "WhatsApp Cloud API רשמי",
    title: "גישה רשמית ל-WhatsApp API",
    accent: "מהירה, ישירה, ובנויה לצמיחה.",
    lead: "חברו את העסק או את הלקוחות ל-WhatsApp Cloud API הרשמי, עם קליטה מהירה, ניהול תבניות, webhooks וחוויית מפתחים עדכנית.",
    start: "התחילו ב-29$ לחודש",
    demo: "קביעת הדגמה",
  },
  es: {
    kicker: "WhatsApp Cloud API oficial",
    title: "Acceso oficial a la API de WhatsApp",
    accent: "rápido, directo y listo para crecer.",
    lead: "Conecte su negocio o el de sus clientes a la API oficial de WhatsApp Cloud, con alta rápida, plantillas, webhooks y una experiencia lista para desarrolladores.",
    start: "Empezar por 29 USD/mes",
    demo: "Reservar una demo",
  },
  "pt-BR": {
    kicker: "WhatsApp Cloud API oficial",
    title: "Acesso oficial à API do WhatsApp",
    accent: "rápido, direto e feito para crescer.",
    lead: "Conecte sua empresa ou seus clientes à API oficial do WhatsApp Cloud, com entrada rápida, modelos, webhooks e uma experiência pronta para desenvolvedores.",
    start: "Começar por US$ 29/mês",
    demo: "Agendar uma demo",
  },
  ar: {
    kicker: "WhatsApp Cloud API الرسمي",
    title: "وصول رسمي إلى واجهة WhatsApp",
    accent: "سريع ومباشر ومبني للنمو.",
    lead: "اربط نشاطك أو عملاءك بواجهة WhatsApp Cloud الرسمية، مع إعداد سريع وإدارة قوالب وwebhooks وتجربة جاهزة للمطورين.",
    start: "ابدأ مقابل 29 دولارًا شهريًا",
    demo: "احجز عرضًا",
  },
};

const START_I18N: Record<string, string> = {
  he: "התחילו עכשיו",
  es: "Empezar",
  "pt-BR": "Começar",
  ar: "ابدأ الآن",
};

type IconType = React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
type Intent = "starter" | "demo" | "growth";

const INTENT_LABEL: Record<Intent, string> = {
  starter: "Get started — Starter, $29/mo",
  demo: "Book a demo",
  growth: "Growth plan — talk to sales",
};

const SUGGESTED: Record<Intent, string> = {
  starter: "I want to start the $29/month WhatsApp API connection.",
  demo: "I would like to book a demo of the WhatsApp API platform.",
  growth: "We need the Growth plan for more than one WhatsApp API connection.",
};

const TRUST = [
  "Official Meta-powered onboarding",
  "Fast Embedded Signup flow",
  "Webhooks & API access",
  "Transparent pricing",
  "No provider-side bottlenecks",
];

const WHY: Array<{ title: string; text: string; icon: IconType }> = [
  {
    title: "Faster onboarding",
    icon: Zap,
    text: "Open Embedded Signup and connect a number without a traditional BSP queue sitting between you and Meta.",
  },
  {
    title: "Official connection",
    icon: ShieldCheck,
    text: "WhatsApp Cloud API connectivity through Meta-powered onboarding. Bizuply is the product layer, not a second approval desk.",
  },
  {
    title: "Developer-ready",
    icon: Code2,
    text: "API access, webhooks, and a structure you can integrate into products, CRMs, and automations.",
  },
  {
    title: "Transparent pricing",
    icon: BadgeDollarSign,
    text: "$29 a month for one connection. Meta conversation and message fees stay separate and follow Meta pricing.",
  },
  {
    title: "Built for agencies",
    icon: Building2,
    text: "Onboard client businesses and manage WhatsApp connections without a patchwork of older provider portals.",
  },
  {
    title: "Modern infrastructure",
    icon: Server,
    text: "A current dashboard, template tools, and event flow for teams that ship messaging into real products.",
  },
];

const STEPS = [
  ["01", "Connect your Meta business account", "Start from the Meta business you already manage, or create one during signup."],
  ["02", "Complete Embedded Signup", "Finish Meta’s Embedded Signup inside the Bizuply flow, including any checks Meta presents."],
  ["03", "Connect your WhatsApp number", "Attach the number you want to use for the official WhatsApp Cloud API."],
  ["04", "Start sending via dashboard or API", "Send from the dashboard or from your own integration once the connection is active."],
] as const;

type FeatureKind = "api" | "signup" | "hooks" | "code" | "templates" | "status" | "dashboard" | "number" | "speed" | "agency";

const FEATURES: Array<{ title: string; text: string; icon: IconType; span: "wide" | "half" | "third"; kind: FeatureKind }> = [
  {
    title: "Official WhatsApp Cloud API access",
    text: "Send on WhatsApp’s official Cloud API. Bizuply connects the account; Meta remains the messaging network.",
    icon: Network,
    span: "wide",
    kind: "api",
  },
  {
    title: "Embedded Signup",
    text: "A direct Meta onboarding path, without an extra provider review step in front of it.",
    icon: ShieldCheck,
    span: "third",
    kind: "signup",
  },
  {
    title: "Webhooks",
    text: "Receive sent, delivered, and read events as they happen and route them into your systems.",
    icon: Webhook,
    span: "half",
    kind: "hooks",
  },
  {
    title: "API access",
    text: "Bearer-authenticated template sends, with idempotency keys for safe retries.",
    icon: Terminal,
    span: "half",
    kind: "code",
  },
  {
    title: "Template management",
    text: "Create and track message templates from the dashboard instead of a disconnected spreadsheet.",
    icon: LayoutDashboard,
    span: "third",
    kind: "templates",
  },
  {
    title: "Messaging status tracking",
    text: "Follow acceptance and delivery state so operators and automations see the same outcome.",
    icon: Activity,
    span: "third",
    kind: "status",
  },
  {
    title: "Dashboard",
    text: "A working surface for the connection, templates, and recent activity.",
    icon: LayoutDashboard,
    span: "third",
    kind: "dashboard",
  },
  {
    title: "Number onboarding",
    text: "Connect a WhatsApp number through the official flow, including numbers you already control when Meta allows it.",
    icon: Phone,
    span: "third",
    kind: "number",
  },
  {
    title: "Fast setup",
    text: "Get started quickly with direct onboarding. No unnecessary provider-side delays.",
    icon: Clock,
    span: "third",
    kind: "speed",
  },
  {
    title: "Agency-ready workflow",
    text: "Bring more than one client through the same connection model and keep each account separate.",
    icon: Workflow,
    span: "third",
    kind: "agency",
  },
];

const DEV_POINTS = [
  "Clean API access",
  "Webhooks for real-time events",
  "Fast onboarding for customer accounts",
  "Clear documentation-ready product structure",
  "Built for integrations and automation",
];

const AUDIENCES: Array<{ title: string; text: string; icon: IconType }> = [
  {
    title: "Agencies",
    icon: Building2,
    text: "Onboard multiple clients and manage WhatsApp connections without a separate portal for every account.",
  },
  {
    title: "SaaS platforms",
    icon: Server,
    text: "Use Bizuply as a scalable backend for client messaging instead of rebuilding Cloud API onboarding yourself.",
  },
  {
    title: "CRM platforms",
    icon: Plug,
    text: "Attach official WhatsApp sending and status events next to the customer record your users already work in.",
  },
  {
    title: "Automation teams",
    icon: Workflow,
    text: "Trigger templates from the tools you already run and take delivery events back through webhooks.",
  },
];

const COMPARE = [
  ["Modern onboarding", "Embedded Signup, direct to Meta", "Extra provider portals and handoffs"],
  ["Pricing transparency", "$29/mo published. Meta fees called out separately", "Platform cost often mixed into conversation markups"],
  ["Developer experience", "API, webhooks, and published docs", "Integration work routed through tickets"],
  ["Setup speed", "No unnecessary provider-side queue", "Another review layer before Meta"],
  ["Agency readiness", "Built for more than one client connection", "Single-account tools stretched across clients"],
  ["Product UX", "Current dashboard and event visibility", "Older BSP consoles"],
] as const;

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is this an official WhatsApp API connection?",
    a: "Yes. Bizuply connects your business to the official WhatsApp Cloud API. Onboarding is Meta-powered, and messaging runs on WhatsApp’s official API.",
  },
  {
    q: "Is Meta approval required?",
    a: "Meta controls access to the WhatsApp Cloud API. Bizuply does not add a separate provider approval queue. Meta may still review the account, the display name, or the messaging use case before you can send at full capacity.",
  },
  {
    q: "Do I need business verification?",
    a: "Business verification may be required by Meta depending on the customer account and use case. Embedded Signup takes you through Meta’s own steps, including verification when Meta asks for it.",
  },
  {
    q: "How fast can I get started?",
    a: "You can open Embedded Signup and connect a number without waiting on a traditional provider handoff. The time to send messages still depends on Meta’s checks for that account.",
  },
  {
    q: "Is Meta pricing included?",
    a: "No. The $29/month Starter plan is the Bizuply platform fee for one connection, including official onboarding, the dashboard, API access, webhooks, and template management. Meta conversation and message fees are billed separately according to Meta pricing.",
  },
  {
    q: "Can agencies onboard clients?",
    a: "Yes. Agencies can bring client businesses through the same official onboarding flow and manage those WhatsApp connections from Bizuply. Multi-client volume is handled on the Growth plan.",
  },
  {
    q: "Do you provide API and webhooks?",
    a: "Yes. You get API access for sending template messages and webhooks for real-time status events such as sent, delivered, and read. Documentation is published for integrators.",
  },
  {
    q: "Can I use my existing number?",
    a: "Often, yes. Embedded Signup supports connecting a number you already control, including migration paths that Meta offers. Whether a specific number can move depends on its current WhatsApp registration and Meta’s requirements.",
  },
];

const STARTER_INCLUDES = [
  "1 WhatsApp API connection",
  "Official onboarding",
  "API and webhooks",
  "Template management",
  "Dashboard access",
];

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: SUGGESTED.starter,
};

function FeatureVisual({ kind }: { kind: FeatureKind }) {
  if (kind === "api") {
    return (
      <svg className="wa-flow" viewBox="0 0 520 72" aria-hidden="true">
        <path className="flow" d="M70 36h120M250 36h120" fill="none" stroke="#5ef2b2" strokeWidth="1.5" />
        <rect x="8" y="14" width="70" height="44" rx="10" fill="none" stroke="#7ae7ff" />
        <rect x="176" y="14" width="86" height="44" rx="10" fill="rgba(94,242,178,0.08)" stroke="#5ef2b2" />
        <rect x="356" y="14" width="86" height="44" rx="10" fill="none" stroke="#5b8cff" />
        <text x="43" y="40" textAnchor="middle" fill="#d5e4f8" fontSize="11">Meta</text>
        <text x="219" y="40" textAnchor="middle" fill="#5ef2b2" fontSize="11">Bizuply</text>
        <text x="399" y="40" textAnchor="middle" fill="#d5e4f8" fontSize="11">Your app</text>
      </svg>
    );
  }
  if (kind === "signup") {
    return (
      <div className="wa-meter" aria-hidden="true">
        <div><span>01 Meta business</span><b><i style={{ width: "100%" }} /></b></div>
        <div><span>02 Embedded Signup</span><b><i style={{ width: "72%" }} /></b></div>
        <div><span>03 Number</span><b><i style={{ width: "38%" }} /></b></div>
      </div>
    );
  }
  if (kind === "hooks") {
    return (
      <div aria-hidden="true">
        <div className="wa-log-row"><span>message.sent</span><em>accepted</em></div>
        <div className="wa-log-row"><span>message.delivered</span><em>delivered</em></div>
        <div className="wa-log-row"><span>message.read</span><em>read</em></div>
      </div>
    );
  }
  if (kind === "code") {
    return (
      <pre aria-hidden="true">{`POST /messages/template
Authorization: Bearer $KEY
{ "template": "order_update" }`}</pre>
    );
  }
  if (kind === "templates") {
    return (
      <div className="wa-mini" aria-hidden="true">
        <span>EXAMPLE</span>
        <strong>order_update</strong>
        <p>English · Utility · Approved</p>
      </div>
    );
  }
  if (kind === "status") {
    return (
      <div className="wa-meter" aria-hidden="true">
        <div><span>Sent</span><b><i style={{ width: "92%" }} /></b></div>
        <div><span>Delivered</span><b><i style={{ width: "80%" }} /></b></div>
        <div><span>Read</span><b><i style={{ width: "54%" }} /></b></div>
      </div>
    );
  }
  if (kind === "dashboard") {
    return (
      <div className="wa-mini-grid" aria-hidden="true">
        <div className="wa-mini"><span>Connection</span><strong>Live</strong></div>
        <div className="wa-mini"><span>Templates</span><strong>12</strong></div>
      </div>
    );
  }
  if (kind === "number") {
    return (
      <div className="wa-mini" aria-hidden="true">
        <span>EXAMPLE NUMBER</span>
        <strong>+1 555 010 0198</strong>
        <p>Display name ready for Meta review</p>
      </div>
    );
  }
  if (kind === "speed") {
    return (
      <div className="wa-log-row" aria-hidden="true">
        <span>Provider queue</span>
        <em>not in the path</em>
      </div>
    );
  }
  return (
    <div className="wa-log-row" aria-hidden="true">
      <span>client.northwind</span>
      <em>connected</em>
    </div>
  );
}

function HeroStage() {
  return (
    <div className="wa-stage">
      <svg className="wa-mesh" viewBox="0 0 640 560" aria-hidden="true">
        <g fill="none" stroke="rgba(122,231,255,0.35)" strokeWidth="1">
          <path d="M40 80h180l70 70h250" />
          <path d="M80 480h160l90-120h220" />
          <path className="flow" d="M120 200C220 200 240 120 360 120" stroke="#5ef2b2" />
          <path className="flow" d="M90 340C220 340 250 420 420 400" stroke="#5b8cff" />
        </g>
        <g fill="#061018" stroke="#5ef2b2">
          <circle cx="120" cy="200" r="5" />
          <circle cx="360" cy="120" r="5" />
          <circle cx="420" cy="400" r="5" />
        </g>
      </svg>

      <article className="wa-glass wa-msg">
        <div className="wa-panel-top">
          <span>Message preview</span>
          <span className="wa-pill"><i className="wa-live" /> Example</span>
        </div>
        <strong>Northwind</strong>
        <p>Avery, order 1042 is confirmed and on the way.</p>
        <div className="wa-status-row"><span>template · order_update</span><em>delivered</em></div>
      </article>

      <article className="wa-glass wa-console">
        <div className="wa-panel-top">
          <span className="wa-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>api.bizuply.com</span>
          <span className="wa-pill">Cloud API</span>
        </div>
        <dl className="wa-route">
          <dt>POST</dt>
          <dd>/api/v1/whatsapp/messages/template</dd>
          <dt>Auth</dt>
          <dd>Bearer $BIZUPLY_API_KEY</dd>
        </dl>
        <pre className="wa-code">{`{
  "to": "+15550100198",
  "template": "order_update",
  "language": "en",
  "variables": ["Avery", "1042"]
}`}</pre>
      </article>

      <article className="wa-glass wa-hook">
        <div className="wa-panel-top">
          <span>Webhook</span>
          <span className="wa-pill">200</span>
        </div>
        <strong>whatsapp.message.delivered</strong>
        <p>messageId bizmsg_example · status delivered</p>
        <div className="wa-status-row"><span>example event</span><em>signed</em></div>
      </article>
    </div>
  );
}

export default function WhatsAppApiLanding() {
  const { i18n, t } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.language);
  const dir = getTextDirection(lang);
  const nav = NAV_I18N[lang] || NAV;
  const hero = HERO_I18N[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [intent, setIntent] = useState<Intent>("starter");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    document.body.style.background = "#061018";
    document.documentElement.style.background = "#061018";

    if (isBizuplyWhatsAppHost(window.location.hostname)) {
      const { pathname, hash } = window.location;
      if (pathname !== "/") {
        window.history.replaceState(null, "", `/${hash || ""}`);
      }
    }

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".wa-reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function update(name: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function applyIntent(next: Intent, scroll: boolean) {
    setIntent(next);
    setSent(false);
    setForm((prev) => {
      const currentIsSuggestion = (Object.values(SUGGESTED) as string[]).includes(prev.message);
      if (!currentIsSuggestion && prev.message.trim()) return prev;
      return { ...prev, message: SUGGESTED[next] };
    });
    if (!scroll) return;
    setMenuOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const name = form.name.trim();
    const email = form.email.trim();
    const company = form.company.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    if (!name || !email || !company || !message) {
      setError("Name, work email, company, and message are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid work email.");
      return;
    }
    const issueDescription = [
      "WhatsApp API inquiry",
      `Intent: ${INTENT_LABEL[intent]}`,
      `Company: ${company}`,
      "",
      message,
      "",
      "Source: https://whatsapp.bizuply.com",
    ].join("\n");

    setSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name,
          email,
          phone,
          issueDescription,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to send");
      }
      setSent(true);
      setForm({ ...EMPTY_FORM, message: SUGGESTED[intent] });
    } catch {
      setError("We could not send that right now. Email support@bizuply.com and include the plan you want.");
    } finally {
      setSubmitting(false);
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bizuply WhatsApp API",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: WHATSAPP_CANONICAL_URL,
    description: WHATSAPP_SEO_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      description: "Starter plan for one WhatsApp API connection. Meta conversation fees are billed separately.",
    },
    provider: {
      "@type": "Organization",
      name: "Bizuply LLC",
      url: "https://bizuply.com",
    },
  };

  return (
    <div className="wa-page" dir={dir} lang={lang}>
      <Helmet>
        <html lang={lang} dir={dir} />
        <title>{WHATSAPP_SEO_TITLE}</title>
        <meta name="description" content={WHATSAPP_SEO_DESCRIPTION} />
        <meta name="keywords" content={WHATSAPP_SEO_KEYWORDS} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={WHATSAPP_CANONICAL_URL} />
        <meta property="og:title" content={WHATSAPP_SEO_TITLE} />
        <meta property="og:description" content={WHATSAPP_SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={WHATSAPP_CANONICAL_URL} />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={WHATSAPP_SEO_TITLE} />
        <meta name="twitter:description" content={WHATSAPP_SEO_DESCRIPTION} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Helmet>

      <div className="wa-grid" aria-hidden="true" />
      <div className="wa-orb wa-orb-a" aria-hidden="true" />
      <div className="wa-orb wa-orb-b" aria-hidden="true" />

      <header className="wa-nav">
        <a className="wa-brand" href="#top">
          <img src="/favicon-v2.png" alt="" width="36" height="36" />
          <span className="wa-brand-copy">
            <strong>Bizuply</strong>
            <span>WhatsApp API</span>
          </span>
        </a>
        <nav className={menuOpen ? "wa-nav-links is-open" : "wa-nav-links"} aria-label="Page">
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <button type="button" className="wa-btn wa-btn-primary wa-btn-nav" onClick={() => applyIntent("starter", true)}>
            {START_I18N[lang] || "Start now"}
          </button>
        </nav>
        <label className="wa-lang">
          <span className="wa-sr">{t("common.changeLanguage")}</span>
          <select
            value={lang}
            aria-label={t("common.changeLanguage")}
            onChange={(event) => {
              void changeAppLanguage(event.target.value);
            }}
          >
            {LANGUAGE_META.map((item) => (
              <option key={item.code} value={item.code}>
                {item.nativeLabel}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="wa-btn wa-btn-primary wa-btn-nav wa-desktop-cta" onClick={() => applyIntent("starter", true)}>
          {START_I18N[lang] || "Start now"}
        </button>
        <button
          type="button"
          className="wa-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <main id="top">
        <section className="wa-wrap wa-hero">
          <div>
            <p className="wa-kicker"><i /> {hero?.kicker || "Official WhatsApp Cloud API"}</p>
            <h1>
              {hero ? (
                <>
                  {hero.title} — <span className="wa-grad">{hero.accent}</span>
                </>
              ) : (
                <>
                  Official WhatsApp API access — <span className="wa-grad">fast, direct, and built for growth.</span>
                </>
              )}
            </h1>
            <p className="wa-lead">
              {hero?.lead ||
                "Connect your business or clients to the official WhatsApp Cloud API with fast onboarding, template management, webhooks, and a modern developer-ready experience."}
            </p>
            <div className="wa-hero-actions">
              <button type="button" className="wa-btn wa-btn-primary" onClick={() => applyIntent("starter", true)}>
                {hero?.start || "Get started for $29/mo"} <ArrowRight size={16} />
              </button>
              <button type="button" className="wa-btn wa-btn-ghost" onClick={() => applyIntent("demo", true)}>
                {hero?.demo || "Book a demo"}
              </button>
            </div>
            <ul className="wa-trust">
              {TRUST.map((item) => (
                <li key={item}><Check size={14} /> {item}</li>
              ))}
            </ul>
          </div>
          <HeroStage />
        </section>

        <section className="wa-section" id="product">
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">Why Bizuply</p>
            <h2>Built for teams who want WhatsApp API without friction.</h2>
            <p className="wa-section-lead">
              A modern connection platform for developers, agencies, SaaS owners, and operators who need official WhatsApp API access without an older BSP workflow in the way.
            </p>
            <div className="wa-position">
              <span>Official Meta-powered onboarding</span>
              <span>Fast setup with Embedded Signup</span>
              <span>No third-party bottlenecks</span>
              <span>Get started quickly with direct onboarding</span>
            </div>
            <div className="wa-why">
              {WHY.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="wa-card">
                    <div className="wa-icon"><Icon size={18} /></div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="wa-section" id="how" style={{ paddingTop: 0 }}>
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">How it works</p>
            <h2>Four steps from Meta account to live messages.</h2>
            <ol className="wa-steps">
              {STEPS.map(([index, title, text]) => (
                <li key={index} className="wa-step">
                  <span className="wa-step-index">{index}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <p className="wa-note">
              Business verification may be required by Meta depending on the account and use case. Bizuply does not replace those Meta checks.
            </p>
          </div>
        </section>

        <section className="wa-section" id="features">
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">Platform</p>
            <h2>The connection layer, exposed.</h2>
            <p className="wa-section-lead">
              Everything required to run official WhatsApp messaging: onboarding, templates, delivery events, and an API your product can call.
            </p>
            <div className="wa-bento">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className={`wa-feature is-${feature.span}`}>
                    <div className="wa-icon"><Icon size={18} /></div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                    <div className="wa-viz wa-code">
                      <FeatureVisual kind={feature.kind} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="wa-section" id="developers">
          <div className="wa-wrap">
            <div className="wa-dev wa-reveal">
              <div className="wa-dev-copy">
                <p className="wa-eyebrow">Developers</p>
                <h2>Built for developers.</h2>
                <p>
                  Ship WhatsApp into your product with a small, explicit surface: authenticate, send a template, and subscribe to status events.
                </p>
                <ul>
                  {DEV_POINTS.map((point) => (
                    <li key={point}><KeyRound size={16} /> {point}</li>
                  ))}
                </ul>
                <div className="wa-dev-actions">
                  <a className="wa-btn wa-btn-primary" href={DOCS_URL} target="_blank" rel="noreferrer">
                    Read the API docs <ArrowRight size={16} />
                  </a>
                  <button type="button" className="wa-btn wa-btn-ghost" onClick={() => applyIntent("demo", true)}>
                    Book a demo
                  </button>
                </div>
              </div>
              <div className="wa-glass wa-terminal">
                <div className="wa-term-bar">
                  <span className="wa-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span>example.ts</span>
                </div>
                <pre>{`const res = await fetch(
  "https://api.bizuply.com/api/v1/whatsapp/messages/template",
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
      "Idempotency-Key": "order-1042",
    },
    body: JSON.stringify({
      to: "+15550100198",
      template: "order_update",
      language: "en",
      variables: ["Avery", "1042"],
    }),
  },
);`}</pre>
              </div>
            </div>
          </div>
        </section>

        <section className="wa-section" id="audiences">
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">Who it’s for</p>
            <h2>Perfect for agencies, SaaS platforms, and automation teams.</h2>
            <p className="wa-section-lead">
              Onboard each business through the official flow, then run WhatsApp as infrastructure behind client work or your own product.
            </p>
            <div className="wa-audience">
              {AUDIENCES.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <div className="wa-icon"><Icon size={18} /></div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="wa-section" id="pricing">
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">Pricing</p>
            <h2>One published price. Room to grow.</h2>
            <p className="wa-section-lead">
              Start with a single official connection. Move to Growth when you are connecting clients at volume.
            </p>
            <div className="wa-pricing">
              <article className="wa-plan is-main">
                <div className="wa-plan-label">Starter</div>
                <div className="wa-price"><strong>$29</strong><span>/ month</span></div>
                <p>For one WhatsApp API connection and the tools around it.</p>
                <ul>
                  {STARTER_INCLUDES.map((item) => (
                    <li key={item}><Check size={16} /> {item}</li>
                  ))}
                </ul>
                <button type="button" className="wa-btn wa-btn-primary" onClick={() => applyIntent("starter", true)}>
                  Get started for $29/mo
                </button>
              </article>
              <article className="wa-plan">
                <div className="wa-plan-label">Growth</div>
                <div className="wa-price"><strong>Custom</strong></div>
                <p>For agencies, SaaS platforms, and larger teams that need more than one connection.</p>
                <ul>
                  <li><Check size={16} /> Multiple client connections</li>
                  <li><Check size={16} /> The same API, webhooks, and templates</li>
                  <li><Check size={16} /> A setup scoped with sales</li>
                </ul>
                <button type="button" className="wa-btn wa-btn-ghost" onClick={() => applyIntent("growth", true)}>
                  Contact sales
                </button>
              </article>
            </div>
            <p className="wa-fine">
              Meta conversation and message fees are billed separately according to Meta pricing.
            </p>
          </div>
        </section>

        <section className="wa-section" id="calculator">
          <div className="wa-wrap wa-reveal">
            <MetaCostCalculator variant="public" />
          </div>
        </section>

        <section className="wa-section" id="compare" style={{ paddingTop: 0 }}>
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">Why choose Bizuply</p>
            <h2>A leaner path than older BSP workflows.</h2>
            <p className="wa-section-lead">
              Traditional providers added their own portals, queues, and pricing layers. Bizuply keeps the platform modern and the Meta relationship direct.
            </p>
            <div className="wa-compare" role="table" aria-label="Bizuply compared with older BSP workflows">
              <div className="wa-compare-row" role="row">
                <div role="columnheader"> </div>
                <div role="columnheader">Bizuply</div>
                <div role="columnheader">Older BSP workflows</div>
              </div>
              {COMPARE.map(([label, ours, theirs]) => (
                <div className="wa-compare-row" role="row" key={label}>
                  <div role="rowheader">{label}</div>
                  <div role="cell">
                    <span className="wa-cell-label">Bizuply</span>
                    {ours}
                  </div>
                  <div role="cell">
                    <span className="wa-cell-label">Older BSP workflows</span>
                    {theirs}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wa-section" id="faq">
          <div className="wa-wrap wa-reveal">
            <p className="wa-eyebrow">FAQ</p>
            <h2>Straight answers before you connect.</h2>
            <div className="wa-faq">
              {FAQS.map((item, index) => {
                const open = openFaq === index;
                return (
                  <article key={item.q} className="wa-faq-item">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenFaq(open ? null : index)}
                      >
                        {item.q}
                        {open ? <Minus size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </h3>
                    {open ? <p>{item.a}</p> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="wa-section" id="contact">
          <div className="wa-wrap">
            <div className="wa-final wa-reveal">
              <div className="wa-final-grid">
                <div>
                  <p className="wa-eyebrow">Start</p>
                  <h2>Start with official WhatsApp API today.</h2>
                  <p>
                    Launch faster with a cleaner, more modern WhatsApp API experience. Tell us which plan you want and we will reply with onboarding access.
                  </p>
                  <div className="wa-final-actions">
                    <button type="button" className="wa-btn wa-btn-primary" onClick={() => applyIntent("starter", true)}>
                      Get started
                    </button>
                    <button type="button" className="wa-btn wa-btn-ghost" onClick={() => applyIntent("growth", true)}>
                      Talk to sales
                    </button>
                  </div>
                </div>
                <div>
                  {sent ? (
                    <div className="wa-success" role="status">
                      <h3>Request received.</h3>
                      <p>
                        We will reply at the email you provided to continue onboarding. For anything urgent, write to support@bizuply.com.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} noValidate>
                      <p className="wa-form-intro">
                        Starter is $29/month for one connection. Meta fees are not included. Already on Bizuply? <a href={SIGN_IN_URL}>Sign in</a>.
                      </p>
                      <div className="wa-form">
                        <div className="wa-field">
                          <label htmlFor="wa-name">Name</label>
                          <input id="wa-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={(event) => update("name", event.target.value)} />
                        </div>
                        <div className="wa-field">
                          <label htmlFor="wa-email">Work email</label>
                          <input id="wa-email" name="email" type="email" autoComplete="email" required maxLength={200} value={form.email} onChange={(event) => update("email", event.target.value)} />
                        </div>
                        <div className="wa-field">
                          <label htmlFor="wa-company">Company</label>
                          <input id="wa-company" name="company" autoComplete="organization" required maxLength={160} value={form.company} onChange={(event) => update("company", event.target.value)} />
                        </div>
                        <div className="wa-field">
                          <label htmlFor="wa-phone">Phone <span className="wa-quiet">(optional)</span></label>
                          <input id="wa-phone" name="phone" autoComplete="tel" maxLength={40} value={form.phone} onChange={(event) => update("phone", event.target.value)} />
                        </div>
                        <div className="wa-field full">
                          <label htmlFor="wa-intent">Request</label>
                          <select
                            id="wa-intent"
                            name="intent"
                            value={intent}
                            onChange={(event) => applyIntent(event.target.value as Intent, false)}
                          >
                            {(Object.keys(INTENT_LABEL) as Intent[]).map((key) => (
                              <option key={key} value={key}>{INTENT_LABEL[key]}</option>
                            ))}
                          </select>
                        </div>
                        <div className="wa-field full">
                          <label htmlFor="wa-message">Message</label>
                          <textarea id="wa-message" name="message" required maxLength={2000} value={form.message} onChange={(event) => update("message", event.target.value)} />
                        </div>
                        {error ? <p className="wa-error" role="alert">{error}</p> : null}
                        <div className="wa-form-actions">
                          <button type="submit" className="wa-btn wa-btn-primary" disabled={submitting}>
                            {submitting ? "Sending..." : "Send request"}
                          </button>
                          <span className="wa-quiet">Or email support@bizuply.com</span>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="wa-footer">
        <div className="wa-wrap wa-footer-grid">
          <div>
            <h2>Bizuply WhatsApp API</h2>
            <p>
              Official WhatsApp Cloud API connectivity by Bizuply LLC. Built for developers, agencies, and businesses that want a direct onboarding path.
            </p>
          </div>
          <ul>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#calculator">{nav.find((item) => item[1] === "#calculator")?.[0] || "Calculator"}</a></li>
            <li><a href="#developers">Developers</a></li>
            <li><a href={DOCS_URL}>API docs</a></li>
            <li><a href="https://bizuply.com">bizuply.com</a></li>
            <li><a href="https://bizuply.com/privacy">Privacy</a></li>
            <li><a href="https://bizuply.com/terms">Terms</a></li>
            <li><a href="mailto:support@bizuply.com">support@bizuply.com</a></li>
          </ul>
        </div>
        <div className="wa-wrap wa-footer-base">© {new Date().getFullYear()} Bizuply LLC. All rights reserved.</div>
      </footer>
    </div>
  );
}
