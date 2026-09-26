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
  GitBranch,
  Layers,
  Menu,
  Music,
  Plane,
  Plug,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Ticket,
  Users,
  UtensilsCrossed,
  Webhook,
  Workflow,
  X,
} from "lucide-react";
import {
  TRAVEL_SEO_DESCRIPTION,
  TRAVEL_SEO_TITLE,
} from "../../lib/travelHost.mjs";
import "./travelLanding.css";

const INQUIRY_LABEL = "API & Partnership Inquiries";
const EXPLORE_LABEL = "Explore the Platform";
const PARTNER_LABEL = "Become a Partner";

const PARTNERSHIP_TYPES = [
  "API Provider",
  "Distribution Partner",
  "Affiliate",
  "Reseller",
  "White Label",
  "Other",
] as const;

const NAV = [
  ["Platform", "#platform"],
  ["Solutions", "#solutions"],
  ["Partners", "#partners"],
  ["Technology", "#technology"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

const SERVICES: Array<{ title: string; icon: IconType; text: string }> = [
  {
    title: "Flights",
    icon: Plane,
    text: "Air search and booking, designed to connect with flight API partners.",
  },
  {
    title: "Hotels",
    icon: Building2,
    text: "Stay availability and reservations, designed to connect with hotel partners.",
  },
  {
    title: "Car Rentals",
    icon: Car,
    text: "Vehicle rental flows, designed to connect with mobility API partners.",
  },
  {
    title: "Tours & Activities",
    icon: Compass,
    text: "Experience inventory, designed to connect with activity partners.",
  },
  {
    title: "Sports & Football Tickets",
    icon: Ticket,
    text: "Match and sports ticketing, designed to connect with ticket partners.",
  },
  {
    title: "Concerts & Events",
    icon: Music,
    text: "Live event inventory, designed to connect with event partners.",
  },
  {
    title: "Restaurants",
    icon: UtensilsCrossed,
    text: "Dining reservations, designed to connect with restaurant partners.",
  },
  {
    title: "Travel Insurance",
    icon: Shield,
    text: "Policy options, designed to connect with insurance partners.",
  },
  {
    title: "eSIM",
    icon: Smartphone,
    text: "Connectivity plans, designed to connect with eSIM partners.",
  },
  {
    title: "Airport Transfers",
    icon: Bus,
    text: "Ground arrival services, designed to connect with transfer partners.",
  },
];

const FEATURES: Array<{ title: string; icon: IconType; text: string }> = [
  { title: "Real-Time Search", icon: Search, text: "Query many travel categories from one search surface." },
  { title: "Live Availability", icon: Radio, text: "Surface current inventory as partners expose it." },
  { title: "Dynamic Pricing", icon: BadgeDollarSign, text: "Present partner pricing inside one comparison view." },
  { title: "Booking & Reservations", icon: CalendarCheck, text: "Carry a traveler from selection into a reservation." },
  { title: "Cancellations & Changes", icon: RefreshCw, text: "Support post-booking changes through partner rules." },
  { title: "Order Management", icon: ClipboardList, text: "Keep every reservation in one order record." },
  { title: "Customer Profiles", icon: Users, text: "Hold traveler and account details across bookings." },
  { title: "Supplier Integrations", icon: Plug, text: "Connect each category through a partner API." },
  { title: "Webhooks & APIs", icon: Webhook, text: "Exchange booking events with partner systems." },
  { title: "B2B & B2C Workflows", icon: Workflow, text: "Serve travel businesses and their customers." },
  { title: "White-Label Ready", icon: Layers, text: "Shape the same platform for a partner brand." },
];

const STEPS = [
  ["01", "Search", "Look across flights, stays, cars, events, and more from one place."],
  ["02", "Compare", "Review availability and pricing side by side."],
  ["03", "Book", "Create the reservation through the partner flow."],
  ["04", "Manage", "Track, change, or cancel the order afterward."],
] as const;

const TECH: Array<{ title: string; icon: IconType; text: string; viz: React.ReactNode }> = [
  {
    title: "Multi-provider architecture",
    icon: GitBranch,
    text: "Each travel category can connect to its own provider without changing the traveler experience.",
    viz: (
      <svg viewBox="0 0 220 74" aria-hidden="true">
        <path d="M20 18h50M20 37h50M20 56h50M70 18c30 0 30 19 60 19M70 37h60M70 56c30 0 30-19 60-19" fill="none" stroke="#0f766e" strokeWidth="2" />
        <circle cx="150" cy="37" r="10" fill="#5eead4" />
      </svg>
    ),
  },
  {
    title: "Secure API integrations",
    icon: ShieldCheck,
    text: "Partner credentials and booking calls stay on a controlled integration path.",
    viz: (
      <svg viewBox="0 0 220 74" aria-hidden="true">
        <rect x="78" y="14" width="64" height="46" rx="10" fill="none" stroke="#0f766e" strokeWidth="2" />
        <path d="M96 36h28M110 28v16" stroke="#0f766e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Webhook infrastructure",
    icon: Webhook,
    text: "Booking, change, and cancellation events can move back to partner systems.",
    viz: (
      <svg viewBox="0 0 220 74" aria-hidden="true">
        <circle cx="40" cy="37" r="8" fill="#0f766e" />
        <circle cx="110" cy="20" r="8" fill="#5eead4" />
        <circle cx="110" cy="54" r="8" fill="#5eead4" />
        <circle cx="180" cy="37" r="8" fill="#0f766e" />
        <path d="M48 37h54M118 24l54 10M118 50l54-10" stroke="#0f766e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Scalable booking workflows",
    icon: Workflow,
    text: "Search, reserve, and manage steps share one order path as volume grows.",
    viz: (
      <svg viewBox="0 0 220 74" aria-hidden="true">
        <rect x="16" y="24" width="40" height="26" rx="8" fill="#d8f6f2" />
        <rect x="90" y="24" width="40" height="26" rx="8" fill="#d8f6f2" />
        <rect x="164" y="24" width="40" height="26" rx="8" fill="#0f766e" />
        <path d="M56 37h34M130 37h34" stroke="#0f766e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Partner-ready backend",
    icon: Server,
    text: "The platform is being built so suppliers can offer sandbox and production access.",
    viz: (
      <svg viewBox="0 0 220 74" aria-hidden="true">
        <rect x="60" y="10" width="100" height="16" rx="5" fill="#0f766e" />
        <rect x="60" y="30" width="100" height="16" rx="5" fill="#5eead4" />
        <rect x="60" y="50" width="100" height="16" rx="5" fill="#d8f6f2" />
      </svg>
    ),
  },
  {
    title: "Future-ready provider switching",
    icon: RefreshCw,
    text: "A category can move between providers while the product surface stays the same.",
    viz: (
      <svg viewBox="0 0 220 74" aria-hidden="true">
        <path d="M70 24h80M150 24l-12-8M150 24l-12 8M150 50H70M70 50l12-8M70 50l12 8" fill="none" stroke="#0f766e" strokeWidth="2" />
      </svg>
    ),
  },
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

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function WorldMap() {
  return (
    <svg className="tl-map" viewBox="0 0 1200 680" aria-hidden="true">
      <defs>
        <pattern id="tl-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="rgba(255,255,255,0.16)" />
        </pattern>
      </defs>
      <rect width="1200" height="680" fill="url(#tl-dots)" />
      <ellipse cx="430" cy="300" rx="250" ry="150" fill="none" stroke="rgba(255,255,255,0.08)" />
      <ellipse cx="820" cy="340" rx="210" ry="120" fill="none" stroke="rgba(255,255,255,0.08)" />
      <path className="tl-flight" d="M180 420C320 180 520 160 690 250" />
      <path className="tl-flight" d="M260 220C480 80 760 140 980 300" />
      <path className="tl-flight" d="M520 460C700 360 860 390 1080 300" />
      <circle className="tl-node" cx="180" cy="420" r="4" />
      <circle className="tl-node" cx="690" cy="250" r="4" />
      <circle className="tl-node" cx="260" cy="220" r="4" />
      <circle className="tl-node" cx="980" cy="300" r="4" />
      <circle className="tl-node" cx="1080" cy="300" r="4" />
    </svg>
  );
}

function SearchPreview() {
  return (
    <div className="tl-panel tl-search">
      <p className="tl-panel-label">Interface preview · Search</p>
      <div className="tl-route">
        <span>NYC</span>
        <span>→</span>
        <span>LON</span>
        <span>12 Oct</span>
      </div>
      <div className="tl-search-row">
        <strong>08:40</strong>
        <span>Nonstop</span>
        <em>$640</em>
      </div>
      <div className="tl-search-row is-hot">
        <strong>11:15</strong>
        <span>1 stop</span>
        <em>$512</em>
      </div>
      <div className="tl-search-row">
        <strong>18:05</strong>
        <span>Nonstop</span>
        <em>$705</em>
      </div>
    </div>
  );
}

export default function TravelLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
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

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".tl-reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
      setError("Enter a valid business email.");
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
    <div className="travel-landing" dir="ltr" lang="en">
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
      </Helmet>

      <header className="tl-nav">
        <a className="tl-brand" href="#top">
          <img src="/bizuply%20logo.webp" alt="Bizuply" />
          <span>TRAVEL</span>
        </a>
        <nav className={menuOpen ? "tl-nav-links is-open" : "tl-nav-links"}>
          {NAV.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <button
            type="button"
            className="tl-btn tl-btn-solid tl-mobile-cta"
            onClick={() => {
              setMenuOpen(false);
              scrollTo("contact");
            }}
          >
            {INQUIRY_LABEL}
          </button>
        </nav>
        <button type="button" className="tl-btn tl-btn-solid tl-desktop-cta" onClick={() => scrollTo("contact")}>
          {INQUIRY_LABEL}
        </button>
        <button
          type="button"
          className="tl-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <main id="top">
        <section className="tl-hero">
          <WorldMap />
          <div className="tl-hero-grid">
            <div>
              <p className="tl-kicker">
                <i />
                Currently expanding our global API partner network
              </p>
              <h1>One Platform. Every Travel Experience.</h1>
              <p className="tl-lead">
                Bizuply Travel is building a unified travel technology platform connecting flights, stays, cars, activities, events, restaurants, insurance, eSIM and transfers through one powerful ecosystem.
              </p>
              <div className="tl-hero-actions">
                <button type="button" className="tl-btn tl-btn-light" onClick={() => scrollTo("platform")}>
                  {EXPLORE_LABEL}
                </button>
                <button type="button" className="tl-btn tl-btn-ghost" onClick={() => scrollTo("contact")}>
                  {INQUIRY_LABEL}
                </button>
              </div>
            </div>
            <div className="tl-stage">
              <SearchPreview />
              <div className="tl-float-row">
                <div className="tl-panel tl-book">
                  <p className="tl-panel-label">Booking preview</p>
                  <div className="tl-book-row">
                    <span>Stay · 3 nights</span>
                    <em>Hold</em>
                  </div>
                  <div className="tl-book-row">
                    <span>Airport transfer</span>
                    <em>Queued</em>
                  </div>
                </div>
                <div className="tl-panel tl-nodes">
                  <p className="tl-panel-label">Integration layer</p>
                  <ul>
                    <li>Air <b>API</b></li>
                    <li>Stay <b>API</b></li>
                    <li>Events <b>API</b></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="tl-section tl-reveal">
          <p className="tl-eyebrow">Platform</p>
          <h2>One Unified Travel Ecosystem</h2>
          <p className="tl-intro">
            Ten travel categories, planned as connections to API providers and commercial partners. The product surface stays one platform.
          </p>
          <div className="tl-services">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="tl-service">
                  <div className="tl-icon">
                    <Icon strokeWidth={1.75} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="solutions" className="tl-section tl-reveal" style={{ paddingTop: 0 }}>
          <p className="tl-eyebrow">Solutions</p>
          <h2>Built for Travel Businesses</h2>
          <p className="tl-intro">
            Capabilities the platform is being built to support for agencies, operators, and their customers.
          </p>
          <div className="tl-bento">
            <div className="tl-console">
              <div className="tl-console-top">
                <span>Dashboard preview</span>
                <span>Bizuply Travel</span>
              </div>
              <div className="tl-console-grid">
                <div className="tl-mini">
                  <strong>Orders today</strong>
                  <div className="tl-bar"><span style={{ width: "72%" }} /></div>
                  <div className="tl-bar"><span style={{ width: "48%" }} /></div>
                  <div className="tl-bar"><span style={{ width: "63%" }} /></div>
                </div>
                <div className="tl-mini">
                  <strong>Categories</strong>
                  <p>Flights, stays, ground, events, and protection in one workspace.</p>
                </div>
              </div>
            </div>
            <div className="tl-features">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="tl-feature">
                    <div className="tl-icon">
                      <Icon strokeWidth={1.75} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div id="how-it-works" style={{ marginTop: 72 }}>
            <p className="tl-eyebrow">How it works</p>
            <h2>Search, compare, book, manage</h2>
            <div className="tl-flow">
              {STEPS.map(([num, title, text], index) => (
                <React.Fragment key={title}>
                  <article className="tl-step-card">
                    <div className="tl-step-no">{num}</div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                  {index < STEPS.length - 1 ? <div className="tl-arrow" aria-hidden="true">→</div> : null}
                </React.Fragment>
              ))}
            </div>
            <p className="tl-note">
              Powered by multiple travel, ticketing and service providers through a unified integration layer.
            </p>
          </div>
        </section>

        <section id="partners" className="tl-band">
          <div className="tl-band-inner tl-reveal">
            <div>
              <p className="tl-eyebrow">Built for API Partnerships</p>
              <h2>Supplier and distribution access</h2>
              <p>
                We are actively expanding our supplier and distribution network.
              </p>
              <p>
                Bizuply Travel is currently onboarding API, distribution, affiliate, reseller and white-label partners across travel, mobility, events and leisure.
              </p>
              <div style={{ marginTop: 24 }}>
                <button type="button" className="tl-btn tl-btn-light" onClick={() => scrollTo("contact")}>
                  {PARTNER_LABEL}
                </button>
              </div>
            </div>
            <div className="tl-layer" aria-hidden="true">
              <div className="tl-layer-row">
                <div className="tl-chip">Air</div>
                <div className="tl-chip">Stay</div>
                <div className="tl-chip">Ground</div>
                <div className="tl-chip">Events</div>
              </div>
              <div className="tl-layer-row">
                <div className="tl-chip">Activities</div>
                <div className="tl-chip">Insurance</div>
                <div className="tl-chip">eSIM</div>
              </div>
              <div className="tl-hub">Unified integration layer</div>
              <div className="tl-hub">Bizuply Travel</div>
            </div>
          </div>
        </section>

        <section id="technology" className="tl-section tl-reveal">
          <p className="tl-eyebrow">Technology</p>
          <h2>Infrastructure for travel products</h2>
          <p className="tl-intro">
            A partner-ready architecture for search, booking, and order events. Provider connections are added as commercial access is granted.
          </p>
          <div className="tl-tech-grid">
            {TECH.map((item) => (
              <article key={item.title} className="tl-tech-card">
                <div className="tl-viz">{item.viz}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="tl-section tl-reveal" style={{ paddingTop: 0 }}>
          <div className="tl-split">
            <div className="tl-contact-copy" id="contact-intro">
              <p className="tl-eyebrow">Company</p>
              <h2>Bizuply LLC</h2>
              <p>
                Bizuply Travel is a product initiative by Bizuply LLC, a U.S.-based SaaS technology company building digital infrastructure for businesses.
              </p>
              <div className="tl-company" style={{ marginTop: 22 }}>
                <dl>
                  <div>
                    <dt>Company</dt>
                    <dd>Bizuply LLC</dd>
                  </div>
                  <div>
                    <dt>Main Website</dt>
                    <dd><a href="https://bizuply.com">bizuply.com</a></dd>
                  </div>
                  <div>
                    <dt>Travel Platform</dt>
                    <dd><a href="https://travel.bizuply.com">travel.bizuply.com</a></dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd><a href="mailto:support@bizuply.com">support@bizuply.com</a></dd>
                  </div>
                </dl>
              </div>
            </div>

            <div id="contact">
              <p className="tl-eyebrow">Contact</p>
              <h2 style={{ marginBottom: 16 }}>Talk with our team</h2>
              <div className="tl-form">
                {sent ? (
                  <div className="tl-success" role="status">
                    <h3>Inquiry sent</h3>
                    <p>
                      Thank you. Your partnership inquiry was sent to support@bizuply.com. We will reply to the business email you provided.
                    </p>
                    <button type="button" className="tl-btn tl-btn-solid" style={{ marginTop: 16 }} onClick={() => setSent(false)}>
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate>
                    <div className="tl-fields">
                      <div className="tl-field">
                        <label htmlFor="travel-name">Name</label>
                        <input id="travel-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={(event) => update("name", event.target.value)} />
                      </div>
                      <div className="tl-field">
                        <label htmlFor="travel-company">Company</label>
                        <input id="travel-company" name="company" autoComplete="organization" required maxLength={160} value={form.company} onChange={(event) => update("company", event.target.value)} />
                      </div>
                      <div className="tl-field">
                        <label htmlFor="travel-email">Business Email</label>
                        <input id="travel-email" name="email" type="email" autoComplete="email" required maxLength={200} value={form.email} onChange={(event) => update("email", event.target.value)} />
                      </div>
                      <div className="tl-field">
                        <label htmlFor="travel-partnership-type">Partnership Type</label>
                        <select id="travel-partnership-type" name="partnershipType" required value={form.partnershipType} onChange={(event) => update("partnershipType", event.target.value)}>
                          <option value="">Select partnership type</option>
                          {PARTNERSHIP_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="tl-field full">
                        <label htmlFor="travel-message">Message</label>
                        <textarea id="travel-message" name="message" required rows={5} maxLength={4000} value={form.message} onChange={(event) => update("message", event.target.value)} />
                      </div>
                    </div>
                    {error ? <p className="tl-error" role="alert">{error}</p> : null}
                    <button type="submit" className="tl-btn tl-btn-solid" disabled={submitting}>
                      {submitting ? "Sending..." : "Send inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="tl-footer">
        <div className="tl-footer-grid">
          <div>
            <h2>Bizuply Travel</h2>
            <p>
              Travel technology infrastructure by Bizuply LLC. A unified platform in development for flights, stays, mobility, events, and related services.
            </p>
          </div>
          <div>
            <h3>Platform</h3>
            <ul>
              <li><a href="#platform">Ecosystem</a></li>
              <li><a href="#solutions">Solutions</a></li>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#technology">Technology</a></li>
            </ul>
          </div>
          <div>
            <h3>Partners</h3>
            <ul>
              <li><a href="#partners">API partnerships</a></li>
              <li><a href="#contact">Become a partner</a></li>
              <li><a href="mailto:support@bizuply.com">support@bizuply.com</a></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><a href="#about">About Bizuply LLC</a></li>
              <li><a href="https://bizuply.com">bizuply.com</a></li>
              <li><a href="https://travel.bizuply.com">travel.bizuply.com</a></li>
            </ul>
          </div>
        </div>
        <div className="tl-footer-base">© Bizuply LLC. All rights reserved.</div>
      </footer>
    </div>
  );
}
