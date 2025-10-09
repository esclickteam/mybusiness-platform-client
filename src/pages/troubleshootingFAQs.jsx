import React, { useState } from "react";

const troubleshootingFAQs = [
  {
    question: "❓ The system isn't loading—what should I do?",
    answer: (
      <>
        <p>When the system doesn't load, follow these steps in order:</p>
        <ol>
          <li>
            <b>Check your internet connection:</b> Make sure your computer or device is connected to the internet and the signal is stable. Try opening another website to confirm connectivity.
          </li>
          <li>
            <b>Refresh the browser page:</b> Click the refresh button in your browser or press <code>F5</code> (Windows) or <code>Cmd + R</code> (Mac) to reload the page.
          </li>
          <li>
            <b>Clear the browser cache:</b> Sometimes an old or corrupted version of the page is stored in cache and the site doesn't load properly.<br />
            <i>In Chrome:</i> Open the menu (three dots at the top-right) {'>'} Settings {'>'} Privacy & Security {'>'} Clear browsing data.<br />
            Check "Cached images and files" and "Cookies".<br />
            Click "Clear data".<br />
            Then close and reopen the browser.
          </li>
          <li>
            <b>Log out and log back in:</b> Try signing out by clicking "Log out" or "Sign out". Wait 2–3 minutes and then sign in again.
          </li>
          <li>
            <b>Try another browser or device:</b> Sometimes the issue is specific to your current browser or device. Try opening the system in another browser (Firefox, Edge, Safari) or on a different device.
          </li>
          <li>
            <b>Temporarily disable ad-blocker or security extensions:</b> Browser extensions can block parts of the site. Disable them and check again.
          </li>
        </ol>
        <p>If the problem persists, contact technical support with a description of the issue, screenshots if possible, and your browser and operating system details.</p>
      </>
    ),
  },
  {
    question: "❓ I got a 500 server error—what should I do?",
    answer: (
      <>
        <p>A 500 error is an internal server error, meaning there’s a system issue preventing your request from completing. Try these steps:</p>
        <ol>
          <li>Refresh the page (F5 or Cmd + R).</li>
          <li>Clear browser cache and cookies (see instructions in the Help Center).</li>
          <li>Try again after a few minutes (might be a temporary server issue).</li>
          <li>Check using a different browser or device.</li>
          <li>Temporarily disable content-blocking extensions.</li>
        </ol>
        <p>If the error persists, contact support with a full description of what you did, screenshots, browser/OS details, and the time the error occurred.</p>
      </>
    ),
  },
  {
    question: "❓ I can’t log into my account—what can I do?",
    answer: (
      <>
        <p>If you can’t log in, follow these steps:</p>
        <ol>
          <li>Make sure you’re entering the correct username and password (watch for uppercase/lowercase and keyboard language).</li>
          <li>Try resetting your password via the “Forgot password” link on the login screen.</li>
          <li>Check your inbox (including spam) for the reset email.</li>
          <li>If you don’t receive the email, double-check the address and try again later.</li>
          <li>If you forgot your username, look for previous emails from the system or contact support with identifying details.</li>
          <li>If the account is locked, wait ~15 minutes and try again or contact support.</li>
          <li>Try logging in from another browser or in private/incognito mode.</li>
        </ol>
        <p>If none of the steps help, contact support with the issue details and your account information.</p>
      </>
    ),
  },
  {
    question: "❓ Files aren’t loading or displaying—what should I do?",
    answer: (
      <>
        <p>If uploaded files don’t load or display properly, do the following:</p>
        <ol>
          <li>Check that the file is in a supported format (JPG, PNG, PDF, MP4, etc.).</li>
          <li>Ensure the file is below the allowed size limit (e.g., up to 10MB).</li>
          <li>Verify the file isn’t corrupted by opening it on your computer.</li>
          <li>Refresh the page and try again.</li>
          <li>Try uploading the file again.</li>
          <li>Ensure a stable internet connection.</li>
          <li>Try another browser or private browsing mode.</li>
          <li>If there’s a specific error message, note or screenshot it.</li>
          <li>Contact support with file details, browser, and device info.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ The system logs me out by itself—what should I do?",
    answer: (
      <>
        <p>If the system logs out unexpectedly, try these steps:</p>
        <ol>
          <li>Check your internet connection—make sure it’s stable and strong.</li>
          <li>Close background apps and processes that may consume bandwidth.</li>
          <li>Check power-saving or sleep settings on your computer or mobile device.</li>
          <li>Clear browser cache and data.</li>
          <li>Try logging in from another browser or device.</li>
          <li>Check for updates to your OS or browser.</li>
          <li>If using a VPN or proxy, try disabling it temporarily.</li>
          <li>If the issue persists, note the times and conditions and contact support with full details.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ How do I report bugs in the system?",
    answer: (
      <>
        <p>To report bugs effectively:</p>
        <ol>
          <li>Document the problem clearly, including the action that caused it.</li>
          <li>Attach a screenshot of the error or issue.</li>
          <li>Gather technical info: device type, OS, browser and its version.</li>
          <li>Specify the exact time the issue occurred.</li>
          <li>Send the information to support@BizUply.co.il or open a ticket in the system.</li>
          <li>Write a clear subject and describe whether the issue is recurring or how to reproduce it.</li>
          <li>Wait for support to respond with guidance or fixes.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ My account was blocked without reason—what should I do?",
    answer: (
      <>
        <p>If your account was blocked and you don’t know why, follow these steps:</p>
        <ol>
          <li>Confirm the account is indeed blocked by attempting to log in.</li>
          <li>Check your emails (including spam) for block notifications.</li>
          <li>Contact support with account details, when you tried to sign in, and the message you received.</li>
          <li>Briefly describe any unusual actions before the block.</li>
          <li>Wait for a response with a fix or further instructions.</li>
          <li>To avoid blocks: use a strong password, avoid using public devices without logging out, avoid unusual/abusive behavior.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ I received an unknown error message—what should I do?",
    answer: (
      <>
        <p>When an unknown error appears, take these steps:</p>
        <ol>
          <li>Refresh the page (F5 or Cmd + R).</li>
          <li>Clear cache and cookies (Chrome cleaning instructions above).</li>
          <li>Try logging in from another browser or device.</li>
          <li>Write down the error message and take a screenshot.</li>
          <li>Contact support with precise details: action performed, error content, browser, OS, time of issue.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ I see blank pages or a white screen—how do I fix it?",
    answer: (
      <>
        <p>For blank pages or a white screen:</p>
        <ol>
          <li>Ensure a stable internet connection.</li>
          <li>Clear cache and cookies.</li>
          <li>Temporarily disable extensions (ad blockers, script blockers).</li>
          <li>Try private/incognito mode.</li>
          <li>Try another browser or device.</li>
          <li>Contact support with a full description and screenshots.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ Timeout error—the site isn’t responding or disconnects. What now?",
    answer: (
      <>
        <p>A Timeout occurs when the server doesn’t respond quickly enough. To resolve:</p>
        <ol>
          <li>Check for a stable, fast internet connection.</li>
          <li>Close apps consuming heavy bandwidth.</li>
          <li>Refresh the page and try again.</li>
          <li>Try at a different time if the server is busy.</li>
          <li>Try another browser or device.</li>
          <li>If it keeps happening, note the times and contact support with full details.</li>
        </ol>
      </>
    ),
  },
  // You can add more questions as needed
];

export default function TroubleshootingSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        textAlign: "right",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>
        Troubleshooting & Errors – FAQ
      </h1>
      {troubleshootingFAQs.map(({ question, answer }, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <button
            onClick={() => toggleIndex(idx)}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            style={{
              width: "100%",
              background: "#f5f5f5",
              color: "#3a0ca3",
              padding: "15px 20px",
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "right",
              cursor: "pointer",
              border: "none",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>{question}</span>
            <span style={{ fontSize: 24, lineHeight: 1 }}>{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div
              id={`faq-answer-${idx}`}
              aria-labelledby={`faq-question-${idx}`}
              style={{
                padding: 20,
                background: "#fafafa",
                whiteSpace: "pre-wrap",
                fontSize: 16,
                color: "#444",
              }}
            >
              {answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
