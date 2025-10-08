import React from "react";
import "../styles/accessibility-style.css";

export default function Accessibility() {
  return (
    <main className="accessibility-page">
      <h1>Accessibility Statement</h1>

      <p>
        Bizuply is committed to ensuring digital accessibility for people with
        disabilities. We are constantly working to improve the user experience
        for everyone and to apply the relevant accessibility standards in line
        with the Americans with Disabilities Act (ADA).
      </p>

      <h2>Our Commitment</h2>
      <p>
        We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA to provide an inclusive and user-friendly digital experience
        for all visitors.
      </p>

      <h2>Accessibility Features</h2>
      <ul>
        <li>Keyboard navigation support.</li>
        <li>Readable text with adjustable contrast and sizing.</li>
        <li>Alternative text for images and icons.</li>
        <li>Consistent structure and clear labels for forms and buttons.</li>
      </ul>

      <h2>Limitations</h2>
      <p>
        While we strive to make all content fully accessible, some third-party
        integrations or media may not yet meet full ADA/WCAG requirements. We
        are actively working on solutions and improvements.
      </p>

      <h2>Feedback & Contact</h2>
      <p>
        If you encounter any barriers while using Bizuply or need assistance,
        please contact us:
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:support@bizuply.com">support@bizuply.com</a>
        </li>
      </ul>

      <h2>Last Updated</h2>
      <p>
        This statement was last updated on{" "}
        <time dateTime="2025-09-29">September 29, 2025</time>.
      </p>
    </main>
  );
}
