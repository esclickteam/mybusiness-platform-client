import React, { useState } from "react";
import "./faq.css";

const technicalSupportFAQs = [
  {
    question: "How can I get technical help",
    answer: (
      <>
        <p>For quick and effective technical assistance, we recommend:</p>
        <ul>
          <li>
            <b>Help Center & FAQs:</b> Review guides and FAQs that cover common
            issues and solutions.
          </li>
          <li>
            <b>Support bot:</b> Use the built-in support bot for fast diagnosis
            of routine issues.
          </li>
          <li>
            <b>Self-troubleshooting:</b> Refresh the page, clear cache, or reset
            your password.
          </li>
          <li>
            <b>Contact support:</b><br />
            <b>Email:</b> support@bizuply.com<br />
            <b>Phone:</b> Relevant phone number<br />
            Please include screenshots, browser, device, and time of issue.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "How do I reset my password",
    answer: (
      <>
        <p>To reset your password:</p>
        <ol>
          <li>Go to the login page.</li>
          <li>Click <b>“Forgot password”</b>.</li>
          <li>Enter your account email.</li>
          <li>Check your inbox (and spam folder).</li>
          <li>Open the reset link.</li>
          <li>Set a new password and confirm.</li>
        </ol>
        <p>
          If you don’t receive the email, verify the address and try again or
          contact support.
        </p>
      </>
    ),
  },
  {
    question: "How do notifications work in the system",
    answer: (
      <>
        <p>
          Notifications are sent automatically for key events such as new
          messages, collaborations, and appointments.
        </p>
        <p>
          Notifications appear under the bell icon in the top-right corner.
        </p>
        <p>
          <b>No manual configuration is required</b>. Push notifications depend
          on browser or device permissions.
        </p>
      </>
    ),
  },
  {
    question: "Why don’t I see new updates in the system",
    answer: (
      <>
        <ul>
          <li>Check internet connection stability.</li>
          <li>Refresh the page (<code>F5</code> / <code>Cmd + R</code>).</li>
          <li>Clear browser cache.</li>
          <li>Ensure your browser or app is up to date.</li>
          <li>Try another browser or device.</li>
        </ul>
        <p>
          If the issue continues, contact support with device and browser
          details.
        </p>
      </>
    ),
  },
  {
    question: "How do I clear cache and cookies",
    answer: (
      <>
        <p>In Google Chrome:</p>
        <ol>
          <li>Open menu → Settings.</li>
          <li>Go to Privacy & Security.</li>
          <li>Select Clear browsing data.</li>
          <li>Choose <b>All time</b>.</li>
          <li>Select Cookies and Cached files.</li>
          <li>Click Clear data and restart the browser.</li>
        </ol>
        <p>The process is similar in Firefox, Edge, and Safari.</p>
      </>
    ),
  },
  {
    question: "What should I do if the site is slow or lagging",
    answer: (
      <>
        <ul>
          <li>Check internet speed and stability.</li>
          <li>Close background apps.</li>
          <li>Clear browser cache.</li>
          <li>Try another browser.</li>
          <li>Ensure OS and browser are updated.</li>
        </ul>
        <p>
          If performance issues persist, contact support with detailed
          information.
        </p>
      </>
    ),
  },
  {
    question: "How can I tell if the issue is on my side or the system",
    answer: (
      <>
        <ul>
          <li>Try another device.</li>
          <li>Try a different network.</li>
          <li>Clear cache and disable extensions.</li>
          <li>Check firewall or security software.</li>
        </ul>
        <p>
          If the issue appears everywhere, it’s likely system-related. Contact
          support with your findings.
        </p>
      </>
    ),
  },
  {
    question: "Does the system support old browsers",
    answer: (
      <>
        <p>
          The system is optimized for modern browsers to ensure performance,
          security, and stability.
        </p>
        <p>
          Older browsers may cause display errors, slow performance, or missing
          functionality.
        </p>
        <p>
          We strongly recommend updating your browser or switching to a
          supported one.
        </p>
      </>
    ),
  },
  {
    question: "What should I do in case of account security issues",
    answer: (
      <>
        <ul>
          <li>Change your password immediately.</li>
          <li>Review account activity.</li>
          <li>Disconnect unknown devices.</li>
          <li>Use strong, unique passwords.</li>
          <li>Run antivirus checks on your device.</li>
        </ul>
        <p>If you can’t access your account, contact support immediately.</p>
      </>
    ),
  },
  {
    question: "How do I recover my account if I forgot my login details",
    answer: (
      <>
        <ul>
          <li>Use the “Forgot password” option.</li>
          <li>Check old system emails for username clues.</li>
          <li>
            Contact support with identifying details if recovery fails.
          </li>
        </ul>
      </>
    ),
  },
];

export default function TechnicalSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Technical Support – FAQ</h1>

      <div className="faq-list">
        {technicalSupportFAQs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span>{faq.question}</span>
                <span
                  className={`faq-plus ${isOpen ? "open" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className="faq-answer"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
