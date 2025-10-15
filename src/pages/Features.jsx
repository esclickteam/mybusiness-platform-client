import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Features.css";


function Features() {
  return (
    <div className="features-container">
      {/* 🧠 SEO Meta Tags */}
      <Helmet>
        <title>BizUply — All the Tools Your Business Needs in One Place</title>
        <meta
          name="description"
          content="Explore BizUply features — an all-in-one platform combining CRM, chat, scheduling, reviews, collaborations, and AI tools for small businesses."
        />
        <meta
          name="keywords"
          content="BizUply, business platform, CRM, chat, reviews, scheduling, AI assistant, small business tools, SaaS, business management"
        />
        <meta name="author" content="BizUply" />
      </Helmet>

      {/* 🌟 Hero Section */}
      <section className="features-hero">
        <h1 className="features-title">
          All the Tools Your Business Needs — In One Place
        </h1>
        <p className="features-subtitle">
          BizUply brings together everything a small business needs to manage
          clients, appointments, messages, reviews, collaborations, and
          AI-powered insights — all from one smart, intuitive platform.
        </p>
      </section>

      {/* 1️⃣ Business Page */}
      <section className="feature-block">
        <h2 className="feature-title">1. Professional Business Page</h2>
        <p className="feature-text">
          Every business on BizUply gets a dedicated business page that serves
          as a digital business card — complete with all the key information
          clients need.
        </p>
        <ul className="feature-list">
          <li>Business name, category, and description.</li>
          <li>Logo and photo gallery to represent your brand.</li>
          <li>Working hours and contact details.</li>
          <li>Social media links and location.</li>
          <li>List of services with names, duration, and availability.</li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> A clean, professional online presence that
          makes your business easy to find and trust.
        </p>
      </section>

      {/* 2️⃣ CRM */}
      <section className="feature-block">
        <h2 className="feature-title">2. CRM — Client Management</h2>
        <p className="feature-text">
          The BizUply CRM helps you manage all your client relationships in one
          organized space. You can record interactions, track tasks, and manage
          appointments with ease.
        </p>
        <ul className="feature-list">
          <li>
            Create a <strong>client file</strong> for every customer you work
            with.
          </li>
          <li>Add notes about meetings, calls, or service details.</li>
          <li>Document activities and completed work.</li>
          <li>Open <strong>tasks or follow-ups</strong> for ongoing actions.</li>
          <li>Schedule appointments directly from each client file.</li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> All your client data, history, and
          communications — in one well-organized system.
        </p>
      </section>

      {/* 3️⃣ Messaging */}
      <section className="feature-block">
        <h2 className="feature-title">3. Messaging System (Chat)</h2>
        <p className="feature-text">
          BizUply’s built-in messaging system makes it simple for clients to
          reach out directly from your business page. You can read, reply, and
          track all messages from your dashboard.
        </p>
        <ul className="feature-list">
          <li>Clients can send messages straight from your business page.</li>
          <li>All messages appear in your <strong>Messages</strong> panel.</li>
          <li>Read and reply directly inside your dashboard.</li>
          <li>Message history is saved for easy follow-up and reference.</li>
          <li>
            New message alerts appear when you log in, so you stay up to date.
          </li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> Centralized, organized client communication
          — easy to manage and track.
        </p>
      </section>

      {/* 4️⃣ Reviews */}
      <section className="feature-block">
        <h2 className="feature-title">4. Ratings & Reviews</h2>
        <p className="feature-text">
          Build trust and strengthen your reputation with verified client
          reviews and star ratings.
        </p>
        <ul className="feature-list">
          <li>Clients can leave public reviews and rate their experience.</li>
          <li>Reviews appear on your business page and build credibility.</li>
          <li>
            Higher ratings improve your visibility across the BizUply network.
          </li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> Authentic feedback that builds trust and
          helps you grow your reputation.
        </p>
      </section>

      {/* 5️⃣ Appointments */}
      <section className="feature-block">
        <h2 className="feature-title">5. Appointments & Scheduling</h2>
        <p className="feature-text">
          Keep your schedule organized and under control with BizUply’s
          integrated appointment system.
        </p>
        <ul className="feature-list">
          <li>Add new appointments directly from the CRM or dashboard.</li>
          <li>View upcoming meetings, past sessions, and open tasks.</li>
          <li>Add notes or reminders related to each appointment.</li>
          <li>
            Send WhatsApp reminders manually based on date or client preference.
          </li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> A simple, structured way to manage your
          time and appointments effectively.
        </p>
      </section>

      {/* 6️⃣ Collaborations */}
      <section className="feature-block">
        <h2 className="feature-title">6. Business Collaborations</h2>
        <p className="feature-text">
          BizUply helps professionals connect with complementary businesses and
          grow together through partnerships.
        </p>
        <ul className="feature-list">
          <li>Find relevant businesses in related industries or locations.</li>
          <li>Send collaboration requests and start professional connections.</li>
          <li>
            Track partnerships, referrals, and shared projects in your
            dashboard.
          </li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> Expand your professional network and
          discover new growth opportunities.
        </p>
      </section>

      {/* 7️⃣ AI Assistant */}
      <section className="feature-block">
        <h2 className="feature-title">7. Smart AI Assistant</h2>
        <p className="feature-text">
          The built-in AI Assistant helps you manage your business more
          efficiently by offering personalized insights and suggestions.
        </p>
        <ul className="feature-list">
          <li>Suggests message replies and professional responses.</li>
          <li>Recommends next steps like creating tasks or reminders.</li>
          <li>Provides insights about client activity and service performance.</li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> Smarter business management powered by data
          and automation.
        </p>
      </section>

      {/* 8️⃣ Dashboard */}
      <section className="feature-block">
        <h2 className="feature-title">8. Business Dashboard</h2>
        <p className="feature-text">
          Your dashboard is the command center of your business — giving you a
          clear, complete view of everything happening.
        </p>
        <ul className="feature-list">
          <li>See new messages, reviews, appointments, and tasks at a glance.</li>
          <li>View performance stats and recent activity summaries.</li>
          <li>
            Access all key tools: CRM, Calendar, Business Page, Messages, and AI
            insights.
          </li>
        </ul>
        <p className="feature-result">
          ✅ <strong>Result:</strong> Full business control — clean, visual, and
          efficient.
        </p>
      </section>

      {/* ✨ Summary */}
      <section className="feature-summary">
        <h2 className="feature-title">In Summary</h2>
        <p className="feature-text">
          <strong>BizUply</strong> brings together all your essential business
          tools under one smart platform. From client management to AI insights,
          you’ll have everything you need to manage, grow, and improve — all in
          one place.
        </p>
        <div className="feature-cta">
          <Link to="/how-it-works" className="cta-button-outline">
            See How It Works
          </Link>
          <Link to="/join" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Features;
