import React from "react";
import "./BuildBusinessPage.css";

export default function BuildBusinessPage() {
  return (
    <div className="build-business-page-container" dir="ltr" lang="en">
      {/* =====================================================
          INTRO
      ===================================================== */}
      <h2>Editing Your Business Page: Why It Matters</h2>

      <p>
        Your business page on BizUply is more than a digital profile. It is your
        public storefront. This is where potential customers form their first
        impression, understand your services, and decide whether to contact or
        book with you.
      </p>

      <p>
        A well-structured page builds trust, reduces friction, and increases
        conversions. Each section plays a role in guiding customers toward
        action.
      </p>

      {/* =====================================================
          MAIN TAB
      ===================================================== */}
      <h2>The Main Tab: Core Business Information</h2>

      <h3>Business Name</h3>
      <p>
        Your business name appears in search results, at the top of your page,
        and in customer conversations. It should be clear, professional, and
        descriptive.
      </p>

      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Use your official business or personal brand name.</li>
        <li>Include your primary specialty to improve clarity and search visibility.</li>
      </ul>

      <p><strong>Examples:</strong></p>
      <ul>
        <li>Emily Carter — Natural Skincare</li>
        <li>Michael Johnson — Plumbing & Emergency Services</li>
      </ul>

      <h3>Business Description</h3>
      <p>
        This section explains who you are, what you offer, and why customers
        should choose you. It is one of the most influential parts of your page.
      </p>

      <p><strong>What to include:</strong></p>
      <ul>
        <li>Your primary service or area of expertise</li>
        <li>Years of experience, licenses, or certifications</li>
        <li>Your professional approach or methodology</li>
        <li>What differentiates you from competitors</li>
      </ul>

      <p><strong>Example — Skincare Professional:</strong></p>
      <p>
        I’m Emily Carter, a licensed esthetician specializing in natural facial
        treatments using organic ingredients. With over 12 years of experience,
        I provide personalized care focused on long-term skin health. My studio
        is located in New York and offers a calm, professional environment
        tailored to each client.
      </p>

      <p><strong>Example — Plumbing Professional:</strong></p>
      <p>
        I’m Michael Johnson, a licensed plumber with more than 15 years of
        experience providing residential and emergency plumbing services. I
        focus on fast response, accurate diagnostics, and long-term solutions
        using modern equipment.
      </p>

      {/* =====================================================
          CONTACT & LOCATION
      ===================================================== */}
      <h3>Contact Details</h3>
      <p>
        Accurate contact information allows customers to reach you without
        friction. Double-check phone numbers and email addresses to avoid missed
        opportunities.
      </p>

      <h3>Business Category</h3>
      <p>
        Select the category that best represents your primary service. Even if
        you offer multiple services, focus on the main keyword customers are
        most likely to search for.
      </p>

      <h3>Service Area or City</h3>
      <p>
        Choose the main city or service area where you operate. If you serve
        multiple locations, select the area where most of your work takes
        place.
      </p>

      {/* =====================================================
          GALLERY TAB
      ===================================================== */}
      <h2>Gallery Tab: Visual First Impression</h2>
      <p>
        The gallery allows customers to visually evaluate your work before
        contacting you. High-quality visuals significantly increase trust and
        engagement.
      </p>

      <p><strong>Recommended content:</strong></p>
      <ul>
        <li>Before-and-after results or completed projects</li>
        <li>Your workspace, tools, or studio environment</li>
        <li>Short videos demonstrating your process or professionalism</li>
      </ul>

      <p><strong>Best practices:</strong></p>
      <ul>
        <li>Use high-resolution, well-lit images.</li>
        <li>Quality matters more than quantity.</li>
        <li>Avoid heavy filters to maintain authenticity.</li>
      </ul>

      {/* =====================================================
          REVIEWS TAB
      ===================================================== */}
      <h2>Reviews Tab: Building Trust</h2>
      <p>
        Reviews are submitted only by real customers, ensuring credibility.
        Ratings influence visibility and help new customers make informed
        decisions.
      </p>

      <p><strong>Why reviews matter:</strong></p>
      <ul>
        <li>They build social proof and trust.</li>
        <li>They improve visibility and ranking.</li>
        <li>They reduce hesitation for new customers.</li>
      </ul>

      <p><strong>How to request reviews:</strong></p>
      <p>
        “If you were satisfied with the service, I’d really appreciate it if
        you could leave a short review on my BizUply profile. It helps new
        customers find and trust my work.”
      </p>

      {/* =====================================================
          CALENDAR TAB
      ===================================================== */}
      <h2>Calendar Tab: Online Booking</h2>
      <p>
        The calendar allows customers to book appointments without phone calls
        or back-and-forth messages.
      </p>

      <p><strong>Service setup guidelines:</strong></p>
      <ul>
        <li>Clear service name</li>
        <li>Estimated duration (in minutes)</li>
        <li>Price</li>
        <li>Concise description of what is included</li>
      </ul>

      <p><strong>Example — Skincare Service:</strong></p>
      <ul>
        <li>Service name: Deep Natural Facial</li>
        <li>Duration: 75 minutes</li>
        <li>Price: $290</li>
        <li>
          Description: Deep cleansing treatment using natural products, tailored
          to sensitive skin.
        </li>
      </ul>

      <p><strong>Example — Plumbing Service:</strong></p>
      <ul>
        <li>Service name: Sink Clog Removal</li>
        <li>Duration: 30 minutes</li>
        <li>Price: $250</li>
        <li>
          Description: Professional clog removal using powered tools, including
          a functionality check.
        </li>
      </ul>

      {/* =====================================================
          MESSAGES TAB
      ===================================================== */}
      <h2>Messages Tab: Customer Communication</h2>
      <p>
        Customers can contact you directly from your page. All messages appear
        in the Customer Messages section, and notifications help ensure timely
        responses.
      </p>

      <p><strong>Communication tips:</strong></p>
      <ul>
        <li>Respond promptly to inquiries.</li>
        <li>Use clear, professional language.</li>
        <li>Add recurring questions to your FAQ tab.</li>
      </ul>

      {/* =====================================================
          FAQ TAB
      ===================================================== */}
      <h2>FAQ Tab</h2>
      <p>
        The FAQ section allows you to proactively answer common questions. This
        saves time, reduces repetitive inquiries, and reinforces professionalism.
      </p>

      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Do you accept credit cards?</td>
            <td>Yes. Credit cards and popular payment apps are accepted.</td>
          </tr>
          <tr>
            <td>Is there a warranty on the service?</td>
            <td>Yes. One repair is included, valid for up to 60 days.</td>
          </tr>
          <tr>
            <td>Are weekend appointments available?</td>
            <td>Yes. Weekend bookings are available by prior arrangement.</td>
          </tr>
        </tbody>
      </table>

      {/* =====================================================
          FINAL CHECK
      ===================================================== */}
      <h2>Save and Review</h2>
      <p>
        After completing all sections, click “Save All.” Use the “View Profile”
        option to review how your page appears to customers.
      </p>

      <p>
        Confirm that images load correctly, services are clearly defined, and
        all information is accurate and easy to understand.
      </p>

      <h2>Final Checklist</h2>
      <ul>
        <li>Clear business name with a defined specialty</li>
        <li>Professional description with a clear value proposition</li>
        <li>High-quality, authentic visuals</li>
        <li>Well-defined services with pricing and durations</li>
        <li>Proactive answers to common questions</li>
        <li>Encouragement of customer reviews</li>
      </ul>
    </div>
  );
}
