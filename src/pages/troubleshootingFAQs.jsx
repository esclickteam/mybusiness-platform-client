import React, { useState } from "react";
import "./faq.css";

const troubleshootingFAQs = [
  {
    question: "The system isn't loading — what should I do",
    answer: (
      <>
        <p>When the system doesn't load, follow these steps in order:</p>
        <ol>
          <li>
            <b>Check your internet connection:</b> Make sure your device is
            connected and the signal is stable. Try opening another website.
          </li>
          <li>
            <b>Refresh the page:</b> Press <code>F5</code> (Windows) or{" "}
            <code>Cmd + R</code> (Mac).
          </li>
          <li>
            <b>Clear browser cache:</b>  
            Chrome: Settings → Privacy & Security → Clear browsing data.  
            Select “Cached images and files” and “Cookies”, then clear data.
          </li>
          <li>
            <b>Log out and log back in:</b> Wait 2–3 minutes before signing in
            again.
          </li>
          <li>
            <b>Try another browser or device:</b> Firefox, Edge, Safari, or a
            different device.
          </li>
          <li>
            <b>Disable extensions:</b> Temporarily disable ad blockers or
            security extensions.
          </li>
        </ol>
        <p>
          If the issue persists, contact support with screenshots and browser/OS
          details.
        </p>
      </>
    ),
  },
  {
    question: "I received a 500 server error — what should I do",
    answer: (
      <>
        <p>A 500 error indicates a server-side issue. Try the following:</p>
        <ol>
          <li>Refresh the page.</li>
          <li>Clear cache and cookies.</li>
          <li>Wait a few minutes and try again.</li>
          <li>Test from another browser or device.</li>
          <li>Disable content-blocking extensions.</li>
        </ol>
        <p>
          If the error continues, contact support with screenshots, time of
          occurrence, and browser/OS details.
        </p>
      </>
    ),
  },
  {
    question: "I can’t log into my account — what can I do",
    answer: (
      <>
        <p>If you can’t log in, try the following:</p>
        <ol>
          <li>Verify username/password and keyboard language.</li>
          <li>Use the “Forgot password” option.</li>
          <li>Check spam folder for reset email.</li>
          <li>Wait 15 minutes if the account is temporarily locked.</li>
          <li>Try incognito mode or another browser.</li>
        </ol>
        <p>If login still fails, contact support with account details.</p>
      </>
    ),
  },
  {
    question: "Files aren’t loading or displaying — what should I do",
    answer: (
      <>
        <p>If files fail to load:</p>
        <ol>
          <li>Verify supported format (JPG, PNG, PDF, MP4).</li>
          <li>Ensure file size is within limits.</li>
          <li>Check the file is not corrupted.</li>
          <li>Refresh the page and try again.</li>
          <li>Try another browser or private mode.</li>
          <li>Contact support with error details.</li>
        </ol>
      </>
    ),
  },
  {
    question: "The system logs me out automatically — what should I do",
    answer: (
      <>
        <p>Unexpected logouts can occur due to:</p>
        <ol>
          <li>Unstable internet connection.</li>
          <li>Browser cache or extension conflicts.</li>
          <li>Power-saving or sleep settings.</li>
          <li>VPN or proxy interference.</li>
        </ol>
        <p>
          Try another browser/device and contact support if it continues.
        </p>
      </>
    ),
  },
  {
    question: "How do I report bugs in the system",
    answer: (
      <>
        <p>To report bugs efficiently:</p>
        <ol>
          <li>Describe the action that caused the issue.</li>
          <li>Attach screenshots.</li>
          <li>Include device, OS, browser, and version.</li>
          <li>Specify date and time.</li>
          <li>
            Send details to <b>support@bizuply.com</b> or open a support ticket.
          </li>
        </ol>
      </>
    ),
  },
  {
    question: "My account was blocked without reason — what should I do",
    answer: (
      <>
        <p>If your account was blocked:</p>
        <ol>
          <li>Confirm the block by attempting login.</li>
          <li>Check emails (including spam).</li>
          <li>Contact support with account details.</li>
          <li>Describe recent actions before the block.</li>
        </ol>
      </>
    ),
  },
  {
    question: "I see a blank page or white screen — how do I fix it",
    answer: (
      <>
        <p>To resolve blank screens:</p>
        <ol>
          <li>Check internet connection.</li>
          <li>Clear cache and cookies.</li>
          <li>Disable extensions temporarily.</li>
          <li>Try incognito mode.</li>
          <li>Try another browser or device.</li>
        </ol>
      </>
    ),
  },
  {
    question: "Timeout error — the site disconnects or doesn’t respond",
    answer: (
      <>
        <p>A timeout usually indicates a slow or interrupted connection.</p>
        <ol>
          <li>Check internet speed and stability.</li>
          <li>Close bandwidth-heavy apps.</li>
          <li>Refresh and retry.</li>
          <li>Try again later if servers are busy.</li>
          <li>Contact support if it repeats.</li>
        </ol>
      </>
    ),
  },
];

export default function TroubleshootingSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Troubleshooting & Errors – FAQ</h1>

      <div className="faq-list">
        {troubleshootingFAQs.map((faq, idx) => {
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
