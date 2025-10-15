import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaMobileAlt,
  FaRobot,
  FaLock,
  FaUserAlt,
  FaDollarSign,
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="esd-page">
      <Helmet>
        <title>Bizuply — Everything Your Business Needs. In One Place.</title>
        <meta
          name="description"
          content="Manage clients, schedule appointments, automate with AI, collaborate and grow — all in one smart business platform."
        />
        <meta
          name="keywords"
          content="Bizuply, business platform, CRM, scheduling, AI automation, client management, collaborations, SaaS for SMBs"
        />
        <link rel="canonical" href="https://bizuply.com/" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Bizuply — Everything Your Business Needs. In One Place."
        />
        <meta
          property="og:description"
          content="The all-in-one business platform for managing clients, bookings, AI automations and growth — all in one place."
        />
        <meta property="og:url" content="https://bizuply.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Bizuply — Everything Your Business Needs. In One Place."
        />
        <meta
          name="twitter:description"
          content="Grow smarter with Bizuply: manage clients, automate tasks, and collaborate — all in one platform."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="esd-hero" aria-labelledby="hero-title">
        <div className="esd-hero__bg" />
        <div className="esd-hero__inner">
          <h1 id="hero-title" className="esd-hero__title">
            Everything Your Business Needs. <br />
            <span>In One Place.</span>
          </h1>

          <p className="esd-hero__subtitle">
            Manage clients, schedule appointments, automate with AI, and grow
            smarter — all with Bizuply.
          </p>

          <div
            className="esd-hero__cta"
            role="group"
            aria-label="Primary actions"
          >
            <Link to="/get-started" className="esd-btn esd-btn--primary">
              Get Started
            </Link>
            <Link to="/how-it-works" className="esd-btn esd-btn--ghost">
              See How It Works
            </Link>
          </div>

          <p className="esd-hero__trust">
            ✓ 14-day free trial • ✓ No credit card • ✓ Mobile-friendly
          </p>
        </div>
      </section>

      {/* ===== VALUE ===== */}
      <section className="esd-value" aria-labelledby="value-title">
        <div className="esd-card esd-value__card">
          <h2 id="value-title" className="esd-section-title">
            More Than a Platform — <span>Your True Business Partner.</span>
          </h2>
          <p className="esd-section-text">
            Bizuply is built to empower small businesses to operate like the big
            ones. From smart scheduling and client management, to AI that
            delivers insights and acts as your personal advisor — and even
            collaborations with other businesses — everything works seamlessly
            together in one powerful system.
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="esd-how" aria-labelledby="how-title">
        <h2 id="how-title" className="esd-section-title">
          How it works
        </h2>
        <ol className="esd-steps">
          <li>
            <span>1</span>
            <div>
              <h5>Create your account</h5>
              <p>It takes a minute to get started.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <h5>Set up once</h5>
              <p>Services, hours, branding and your business page.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <h5>Start booking & chatting</h5>
              <p>Clients schedule and talk to you in one place.</p>
            </div>
          </li>
          <li>
            <span>4</span>
            <div>
              <h5>Grow with insights</h5>
              <p>AI suggestions and automations improve results.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* ===== BLOCKS ===== */}
      <section className="esd-blocks" aria-labelledby="blocks-title">
        <h2 id="blocks-title" className="esd-section-title">
          Run your business without the busywork
        </h2>

        {/* ✅ עודכן לתצוגת שתי כרטיסיות בשורה */}
        <div className="esd-value__grid">
          <article className="esd-value__item">
            <h3>Bookings that just work</h3>
            <p>
              Smart scheduling, reminders, cancellations and rescheduling — all
              automated so you don’t have to chase.
            </p>
            <Link to="/features/appointments" className="esd-link">
              Learn more
            </Link>
          </article>

          <article className="esd-value__item">
            <h3>Conversations in one place</h3>
            <p>
              Central inbox for all client messages, quick replies and
              automation. Know what’s next at a glance.
            </p>
            <Link to="/features/messages" className="esd-link">
              Learn more
            </Link>
          </article>

          <article className="esd-value__item">
            <h3>Lightweight CRM</h3>
            <p>
              Client cards, history, tags and tasks. Import/Export and
              segmentation for campaigns when you need it.
            </p>
            <Link to="/features/crm" className="esd-link">
              Learn more
            </Link>
          </article>

          <article className="esd-value__item">
            <h3>AI that actually helps</h3>
            <p>
              Actionable suggestions, follow-ups, and automations that save
              hours every week — no learning curve.
            </p>
            <Link to="/features/ai" className="esd-link">
              Learn more
            </Link>
          </article>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section
        id="services"
        className="esd-services"
        aria-labelledby="services-title"
      >
        <h2 id="services-title" className="esd-section-title">
          Our services
        </h2>

        {/* ✅ גם כאן שתי כרטיסיות בשורה */}
        <div className="esd-services__grid">
          <article className="esd-service">
            <span className="esd-service__badge">Core</span>
            <h4>Appointments</h4>
            <p>
              Online calendar, smart reminders, updates and cancellation links.
              Seamless rescheduling.
            </p>
            <Link to="/features/appointments" className="esd-link">
              Details
            </Link>
          </article>

          <article className="esd-service">
            <span className="esd-service__badge">Core</span>
            <h4>Messages</h4>
            <p>
              All chats in one place with templates, quick replies and
              automations. Never miss a thread.
            </p>
            <Link to="/features/messages" className="esd-link">
              Details
            </Link>
          </article>

          <article className="esd-service">
            <span className="esd-service__badge">Plus</span>
            <h4>CRM</h4>
            <p>
              Clients, history, tagging and tasks. Import/export CSV and simple
              segmentation.
            </p>
            <Link to="/features/crm" className="esd-link">
              Details
            </Link>
          </article>

          <article className="esd-service">
            <span className="esd-service__badge">Pro</span>
            <h4>Insights & AI</h4>
            <p>
              Weekly performance dashboard and AI advisor with actionable next
              steps.
            </p>
            <Link to="/features/insights" className="esd-link">
              Details
            </Link>
          </article>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section id="why" className="esd-why" aria-labelledby="why-title">
        <h2 id="why-title" className="esd-section-title">
          Why choose Bizuply
        </h2>

        <ul className="esd-why__grid">
          <li className="esd-why__item">
            <div className="esd-why__icon">
              <FaBolt />
            </div>
            <div>
              <h5>Fast to start</h5>
              <p>Be up and running in minutes — not weeks.</p>
            </div>
          </li>
          <li className="esd-why__item">
            <div className="esd-why__icon">
              <FaMobileAlt />
            </div>
            <div>
              <h5>Mobile-first</h5>
              <p>Looks great on every device, everywhere.</p>
            </div>
          </li>
          <li className="esd-why__item">
            <div className="esd-why__icon">
              <FaRobot />
            </div>
            <div>
              <h5>Built-in AI</h5>
              <p>Real insights and suggestions that move the needle.</p>
            </div>
          </li>
          <li className="esd-why__item">
            <div className="esd-why__icon">
              <FaLock />
            </div>
            <div>
              <h5>Secure</h5>
              <p>Encrypted data and standards you can trust.</p>
            </div>
          </li>
          <li className="esd-why__item">
            <div className="esd-why__icon">
              <FaUserAlt />
            </div>
            <div>
              <h5>Human support</h5>
              <p>Help center, guides and real chat support.</p>
            </div>
          </li>
          <li className="esd-why__item">
            <div className="esd-why__icon">
              <FaDollarSign />
            </div>
            <div>
              <h5>Fair pricing</h5>
              <p>Start free, pay only when you grow.</p>
            </div>
          </li>
        </ul>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="esd-faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="esd-section-title">
          Frequently asked questions
        </h2>
        <div className="esd-faq__list">
          <details>
            <summary>Is there a free trial?</summary>
            <p>Yes — 14 days, no credit card required.</p>
          </details>
          <details>
            <summary>Does it work on mobile?</summary>
            <p>Absolutely. Bizuply is fully responsive.</p>
          </details>
          <details>
            <summary>How do I get started?</summary>
            <p>
              Create your account and follow the short onboarding — you’ll be
              ready in minutes.
            </p>
          </details>
          <details>
            <summary>Can I import my clients?</summary>
            <p>Yes. CSV import/export is built-in.</p>
          </details>
          <details>
            <summary>Do you offer support?</summary>
            <p>Help center, guides and live chat support are available.</p>
          </details>
          <details>
            <summary>How about security?</summary>
            <p>
              We use encryption and industry-standard practices to keep your
              data safe.
            </p>
          </details>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="esd-cta" aria-labelledby="cta-title">
        <div className="esd-cta__inner">
          <h2 id="cta-title">Ready to grow smarter?</h2>
          <Link
            to="/get-started"
            className="esd-btn esd-btn--primary esd-btn--lg"
          >
            Start Today
          </Link>
        </div>
      </section>
    </main>
  );
}
