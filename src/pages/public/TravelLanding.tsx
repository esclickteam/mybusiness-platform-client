import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  BadgeDollarSign,
  Building2,
  Bus,
  CalendarCheck,
  Car,
  ClipboardList,
  Compass,
  Layers,
  Mail,
  Plane,
  Plug,
  RotateCcw,
  Search,
  Shield,
  Smartphone,
  Ticket,
  Music,
  Users,
  UtensilsCrossed,
  Workflow,
  Webhook,
} from "lucide-react";
import {
  TRAVEL_SEO_DESCRIPTION,
  TRAVEL_SEO_TITLE,
} from "../../lib/travelHost.mjs";

const CTA_LABEL = "Partnership & API Inquiries";

const PARTNERSHIP_TYPES = [
  "API Provider",
  "Distribution Partner",
  "Affiliate",
  "Reseller",
  "White Label",
  "Other",
] as const;

const SERVICES: Array<{
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}> = [
  {
    title: "Flights",
    icon: Plane,
    text: "Designed to connect with flight API providers and commercial partners for search, availability, and booking.",
  },
  {
    title: "Hotels",
    icon: Building2,
    text: "Designed to connect with hotel API providers and commercial partners for availability, pricing, and reservations.",
  },
  {
    title: "Car Rentals",
    icon: Car,
    text: "Designed to connect with car rental API providers and commercial partners.",
  },
  {
    title: "Tours & Activities",
    icon: Compass,
    text: "Designed to connect with tour and activity API providers and commercial partners.",
  },
  {
    title: "Sports & Football Tickets",
    icon: Ticket,
    text: "Designed to connect with sports and football ticket API providers and commercial partners.",
  },
  {
    title: "Concerts & Events",
    icon: Music,
    text: "Designed to connect with concert and event ticket API providers and commercial partners.",
  },
  {
    title: "Restaurants",
    icon: UtensilsCrossed,
    text: "Designed to connect with restaurant API providers and commercial partners.",
  },
  {
    title: "Travel Insurance",
    icon: Shield,
    text: "Designed to connect with travel insurance API providers and commercial partners.",
  },
  {
    title: "eSIM",
    icon: Smartphone,
    text: "Designed to connect with eSIM API providers and commercial partners.",
  },
  {
    title: "Airport Transfers",
    icon: Bus,
    text: "Designed to connect with airport transfer API providers and commercial partners.",
  },
];

const CAPABILITIES: Array<{
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { title: "Search & Availability", icon: Search },
  { title: "Real-time Pricing", icon: BadgeDollarSign },
  { title: "Booking & Reservations", icon: CalendarCheck },
  { title: "Cancellations", icon: RotateCcw },
  { title: "Order Management", icon: ClipboardList },
  { title: "Customer Management", icon: Users },
  { title: "Supplier Integrations", icon: Plug },
  { title: "API & Webhook Infrastructure", icon: Webhook },
  { title: "B2B & B2C Workflows", icon: Workflow },
  { title: "White-label Capabilities", icon: Layers },
];

type FormState = {
  name: string;
  company: string;
  email: string;
  partnershipType: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  partnershipType: "",
  message: "",
};

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-[#163044]">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#d5e0e8] bg-white px-3.5 py-3 text-base text-[#142433] outline-none transition placeholder:text-[#8aa0b0] focus:border-[#0f6e78] focus:ring-4 focus:ring-[#0f6e78]/15";

export default function TravelLanding() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    document.body?.setAttribute("dir", "ltr");
    const { pathname, hash } = window.location;
    if (pathname !== "/") {
      window.history.replaceState(null, "", `/${hash || ""}`);
    }
  }, []);

  function update(name: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      partnershipType: form.partnershipType.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.company || !payload.email || !payload.partnershipType || !payload.message) {
      setError("Please complete every field.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/support/travel-partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to send");
      }
      setSent(true);
      setForm(EMPTY_FORM);
    } catch {
      setError("We could not send your inquiry right now. Please email support@bizuply.com directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#f4f7fb] text-[#142433]"
      dir="ltr"
      lang="en"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Helmet>
        <html lang="en" dir="ltr" />
        <title>{TRAVEL_SEO_TITLE}</title>
        <meta name="description" content={TRAVEL_SEO_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://travel.bizuply.com/" />
        <meta property="og:title" content={TRAVEL_SEO_TITLE} />
        <meta property="og:description" content={TRAVEL_SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://travel.bizuply.com/" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TRAVEL_SEO_TITLE} />
        <meta name="twitter:description" content={TRAVEL_SEO_DESCRIPTION} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Bizuply LLC",
            url: "https://bizuply.com",
            email: "support@bizuply.com",
            brand: {
              "@type": "Brand",
              name: "Bizuply Travel",
              url: "https://travel.bizuply.com/",
            },
          })}
        </script>
      </Helmet>

      <header className="sticky top-0 z-40 border-b border-[#e4edf3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <img
              src="/bizuply%20logo.webp"
              alt="Bizuply"
              className="h-8 w-auto"
            />
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#0f6e78] sm:text-xs">
              TRAVEL
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#3e5568] lg:flex">
            <a className="hover:text-[#0f6e78]" href="#about">About</a>
            <a className="hover:text-[#0f6e78]" href="#services">Services</a>
            <a className="hover:text-[#0f6e78]" href="#platform">Platform</a>
            <a className="hover:text-[#0f6e78]" href="#partners">Partners</a>
            <a className="hover:text-[#0f6e78]" href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            onClick={scrollToContact}
            className="shrink-0 rounded-full bg-[#0f6e78] px-3 py-2 text-center text-[11px] font-semibold leading-tight text-white transition hover:bg-[#0c5961] sm:px-4 sm:text-sm"
          >
            {CTA_LABEL}
          </button>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[#eef3f6] px-4 py-2 text-sm text-[#3e5568] lg:hidden">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#platform">Platform</a>
          <a href="#partners">Partners</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-[#0e1c2f] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,110,120,0.45),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_36%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#d7f3f5] sm:text-sm">
                Currently expanding our API and distribution partnerships.
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Travel Technology Infrastructure for Modern Travel Businesses
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#d5e2ec] sm:text-lg">
                Bizuply Travel is a travel technology platform being developed by Bizuply LLC to connect travel businesses and customers with flights, hotels, cars, activities, event tickets, restaurants, travel insurance, eSIM and airport transfer services through one unified platform.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0e1c2f] transition hover:bg-[#e7f4f5] sm:text-base"
                >
                  {CTA_LABEL}
                </button>
              </div>
            </div>
            <aside className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9fd4d8]">
                For travel suppliers
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[#e7eef4] sm:text-base">
                <li>
                  <span className="block font-semibold text-white">Who</span>
                  Bizuply LLC, a U.S.-based SaaS technology company.
                </li>
                <li>
                  <span className="block font-semibold text-white">What</span>
                  Bizuply Travel, a unified booking and management platform in development.
                </li>
                <li>
                  <span className="block font-semibold text-white">Why API access</span>
                  To connect travel businesses and customers with supplier search, pricing, booking, and order workflows.
                </li>
                <li>
                  <span className="block font-semibold text-white">Contact</span>
                  <a className="text-[#b7e6e9] underline decoration-white/30 underline-offset-4" href="mailto:support@bizuply.com">
                    support@bizuply.com
                  </a>
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="about" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f6e78]">About</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10263a] sm:text-4xl">
              Built by Bizuply LLC
            </h2>
            <p className="mt-5 text-base leading-7 text-[#3e5568] sm:text-lg">
              Bizuply LLC is a U.S.-based SaaS technology company developing software platforms for businesses. Bizuply Travel is our travel technology initiative focused on creating a unified booking and management experience for travel-related products and services.
            </p>
          </div>
        </section>

        <section id="services" className="scroll-mt-28 border-y border-[#e4edf3] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f6e78]">Travel Services</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10263a] sm:text-4xl">
                One platform for travel products
              </h2>
              <p className="mt-4 text-base leading-7 text-[#3e5568]">
                Each service is a category the platform is being designed to connect through API providers and commercial partners.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="rounded-2xl border border-[#e4edf3] bg-[#f8fbfc] p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f4f5] text-[#0f6e78]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#10263a]">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#3e5568]">{service.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="platform" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f6e78]">Platform Capabilities</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10263a] sm:text-4xl">
              Built for supplier and customer workflows
            </h2>
            <p className="mt-4 text-base leading-7 text-[#3e5568]">
              Bizuply Travel is being built to support these capabilities through supplier and partner APIs.
            </p>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex items-center gap-3 rounded-2xl border border-[#e4edf3] bg-white px-4 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0e1c2f] text-white">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="font-medium text-[#163044]">{item.title}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="partners" className="scroll-mt-28 bg-[#0e1c2f] text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9fd4d8]">
                For API &amp; Distribution Partners
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Partnerships we are seeking
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-[#d5e2ec] sm:text-lg">
                <p>
                  We are currently expanding our supplier and distribution network and are interested in commercial API, affiliate, reseller, white-label and technology partnerships with travel and leisure providers.
                </p>
                <p>
                  We are seeking sandbox and production access for search, availability, pricing, booking, cancellation, order management and related partner APIs.
                </p>
              </div>
            </div>
            <div id="company" className="scroll-mt-28 rounded-3xl bg-white p-6 text-[#142433] sm:p-8">
              <h2 className="text-xl font-semibold text-[#10263a]">Company Details</h2>
              <dl className="mt-5 space-y-4 text-sm sm:text-base">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[#6b8192]">Company</dt>
                  <dd className="mt-1 font-medium">Bizuply LLC</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[#6b8192]">Website</dt>
                  <dd className="mt-1">
                    <a className="font-medium text-[#0f6e78] underline decoration-[#0f6e78]/30 underline-offset-4" href="https://bizuply.com">
                      bizuply.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[#6b8192]">Travel Platform</dt>
                  <dd className="mt-1">
                    <a className="font-medium text-[#0f6e78] underline decoration-[#0f6e78]/30 underline-offset-4" href="https://travel.bizuply.com">
                      travel.bizuply.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[#6b8192]">Email</dt>
                  <dd className="mt-1">
                    <a className="inline-flex items-center gap-2 font-medium text-[#0f6e78] underline decoration-[#0f6e78]/30 underline-offset-4" href="mailto:support@bizuply.com">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      support@bizuply.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f6e78]">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#10263a] sm:text-4xl">
                {CTA_LABEL}
              </h2>
              <p className="mt-4 text-base leading-7 text-[#3e5568]">
                Tell us who you are and which partnership you want to discuss. This form is sent to support@bizuply.com. No account is required.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e4edf3] bg-white p-5 shadow-sm sm:p-7">
              {sent ? (
                <div role="status" className="rounded-2xl bg-[#e7f4f5] px-5 py-6 text-[#0e1c2f]">
                  <h3 className="text-lg font-semibold">Inquiry sent</h3>
                  <p className="mt-2 text-sm leading-6 text-[#24545a]">
                    Thank you. Your partnership inquiry was sent to support@bizuply.com. We will reply to the email address you provided.
                  </p>
                  <button
                    type="button"
                    className="mt-4 text-sm font-semibold text-[#0f6e78] underline underline-offset-4"
                    onClick={() => setSent(false)}
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="travel-name">Name</FieldLabel>
                      <input
                        id="travel-name"
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={120}
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="travel-company">Company</FieldLabel>
                      <input
                        id="travel-company"
                        name="company"
                        autoComplete="organization"
                        required
                        maxLength={160}
                        value={form.company}
                        onChange={(event) => update("company", event.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="travel-email">Email</FieldLabel>
                      <input
                        id="travel-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={200}
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="travel-partnership-type">Partnership Type</FieldLabel>
                      <select
                        id="travel-partnership-type"
                        name="partnershipType"
                        required
                        value={form.partnershipType}
                        onChange={(event) => update("partnershipType", event.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select partnership type</option>
                        {PARTNERSHIP_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <FieldLabel htmlFor="travel-message">Message</FieldLabel>
                    <textarea
                      id="travel-message"
                      name="message"
                      required
                      rows={6}
                      maxLength={4000}
                      value={form.message}
                      onChange={(event) => update("message", event.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {error ? (
                    <p role="alert" className="text-sm font-medium text-[#9f2d2d]">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-[#0f6e78] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c5961] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    {submitting ? "Sending..." : "Send inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e4edf3] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[#5c7386] sm:px-6 lg:px-8">
          <p>© Bizuply LLC. All rights reserved.</p>
          <p>
            <a className="underline decoration-[#5c7386]/40 underline-offset-4" href="mailto:support@bizuply.com">
              support@bizuply.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
