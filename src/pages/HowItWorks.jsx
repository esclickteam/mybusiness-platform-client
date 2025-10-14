import React from "react";
import { Helmet } from "react-helmet-async"; // ✅ מעודכן לגרסה הנכונה
import "../styles/HowItWorks.css";

function HowItWorks() {
  return (
    <div className="howitworks-container" dir="ltr">
      <Helmet>
        {/* ✅ Basic SEO */}
        <title>How It Works - Bizuply | Platform Guide</title>
        <meta
          name="description"
          content="A simple guide on how Bizuply connects businesses with clients, manages appointments, and improves communication with smart automation tools."
        />
        <meta
          name="keywords"
          content="Bizuply, how it works, business management, scheduling, communication, automation, clients, SaaS"
        />
        <link rel="canonical" href="https://bizuply.com/how-it-works" />

        {/* ✅ Robots */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="How Bizuply Works – Simple Platform Guide" />
        <meta
          property="og:description"
          content="Learn how Bizuply helps businesses manage clients, bookings, and collaborations in one smart system."
        />
        <meta property="og:url" content="https://bizuply.com/how-it-works" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Bizuply Works – Simple Platform Guide" />
        <meta
          name="twitter:description"
          content="Step-by-step guide to Bizuply: managing clients, booking services, and growing your business with smart automation."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      {/* ==========================
          🧭 Page Title & Intro
      ========================== */}
      <h1 className="howitworks-title">How It Works - Bizuply</h1>
      <p className="howitworks-subtitle">
        Learn step by step how our platform works, how it helps you manage your
        business, schedule services, and improve communication between
        businesses and clients.
      </p>

      {/* ==========================
          🪄 Step 1
      ========================== */}
      <div className="howitworks-section">
        <h2>Step 1: Create a Business or Client Profile</h2>
        <h3>For Businesses:</h3>
        <ul>
          <li>
            Click <b>"Join as a Business"</b> and fill out your basic details.
          </li>
          <li>Upload your logo, images, and set your business hours.</li>
          <li>Choose the right plan (free or paid).</li>
          <li>
            <b>Result:</b> You have a professional business page ready to
            welcome clients!
          </li>
        </ul>
        <h3>For Clients:</h3>
        <ul>
          <li>
            Click <b>"Sign Up"</b> and choose "New Client".
          </li>
          <li>Fill in your name, email, and password.</li>
          <li>
            <b>Result:</b> Full access to search businesses, book services, and
            chat directly with providers.
          </li>
        </ul>
      </div>

      {/* ==========================
          🔍 Step 2
      ========================== */}
      <div className="howitworks-section">
        <h2>Step 2: Smart Business & Service Search</h2>
        <ul>
          <li>
            Use the search bar to enter keywords like{" "}
            <b>"Hairdresser in NYC"</b>.
          </li>
          <li>
            The system will show results based on ratings, location, and
            availability.
          </li>
          <li>You can filter by price, reviews, category, and business hours.</li>
          <li>
            <b>Result:</b> Quickly find the exact business you need!
          </li>
        </ul>
      </div>

      {/* ==========================
          📅 Step 3
      ========================== */}
      <div className="howitworks-section">
        <h2>Step 3: Scheduling & Managing Appointments</h2>
        <ul>
          <li>
            Go to a business page and click <b>"Book Now"</b>.
          </li>
          <li>
            View the calendar with available slots and get instant confirmation.
          </li>
          <li>Receive automatic reminders by email.</li>
        </ul>
      </div>

      {/* ==========================
          💬 Step 4
      ========================== */}
      <div className="howitworks-section">
        <h2>Step 4: Direct Communication</h2>
        <h3>Online Chat:</h3>
        <ul>
          <li>
            On every business page, you can click <b>"Send Message"</b>.
          </li>
          <li>
            Ask questions or send requests directly to the business owner and
            get replies within minutes.
          </li>
        </ul>
        <h3>Business-to-Business Collaboration:</h3>
        <ul>
          <li>Businesses can send collaboration requests.</li>
          <li>
            <b>Result:</b> Easily find suppliers, partners, or refer clients to
            one another!
          </li>
        </ul>
      </div>

      {/* ==========================
          📊 Step 5
      ========================== */}
      <div className="howitworks-section">
        <h2>Step 5: Tracking & Managing Your Activity</h2>
        <h3>For Businesses:</h3>
        <ul>
          <li>
            Access the <b>"Dashboard"</b> with data on visits, bookings, and
            client activity.
          </li>
          <li>
            Use the built-in email marketing system to send promotions and
            updates.
          </li>
        </ul>
        <h3>For Clients:</h3>
        <ul>
          <li>View your booking and appointment history easily.</li>
          <li>Receive smart recommendations for businesses and services.</li>
        </ul>
      </div>

      {/* ==========================
          ⭐ Simplicity
      ========================== */}
      <div className="howitworks-section">
        <h2>Why Is It So Simple?</h2>
        <ul>
          <li>User-friendly design: no experience required.</li>
          <li>Automatic reminders and notifications.</li>
          <li>Support at every step of the way.</li>
        </ul>
      </div>
    </div>
  );
}

export default HowItWorks;
