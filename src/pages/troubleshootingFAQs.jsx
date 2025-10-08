```javascript
import React, { useState } from "react";

const troubleshootingFAQs = [
  {
    question: "❓ The system is not loading, what should I do?",
    answer: (
      <>
        <p>When the system is not loading, it is recommended to follow these steps in order:</p>
        <ol>
          <li>
            <b>Check your internet connection:</b> Make sure your computer or device is connected to the internet and that the signal is stable. Try opening another website to ensure there is a connection.
          </li>
          <li>
            <b>Refresh the page in the browser:</b> Click the refresh button in the browser or press <code>F5</code> (Windows) or <code>Cmd + R</code> (Mac) to reload the page.
          </li>
          <li>
            <b>Clear the browser cache:</b> Sometimes, an old or incorrect version of the page is stored in the cache, causing the site not to load properly.<br />
            <i>In Chrome:</i> Open the menu (three dots in the upper right corner) {'>'} Settings {'>'} Privacy and security {'>'} Clear browsing data.<br />
            Check "Cached images and files" and "Cookies".<br />
            Click "Clear data".<br />
            After that, close and reopen the browser.
          </li>
          <li>
            <b>Log out of the system and log back in:</b> Try logging out of your account by clicking "Log out" or "Exit". Wait 2-3 minutes and then log back in.
          </li>
          <li>
            <b>Try a different browser or device:</b> Sometimes the problem is related to a specific browser or device. Try opening the system in another browser (Firefox, Edge, Safari) or on another device.
          </li>
          <li>
            <b>Temporarily disable ad blockers or security plugins:</b> Browser plugins may block parts of the site from loading. Try disabling them and check again.
          </li>
        </ol>
        <p>If the problem persists, contact technical support with a description of the issue, screenshots if possible, and details about the browser and operating system you are using.</p>
      </>
    ),
  },
  {
    question: "❓ I received a 500 error on the server, what should I do?",
    answer: (
      <>
        <p>A 500 error is an internal server error, meaning there is a malfunction in the system preventing your request from being completed. Here are some recommended steps for independent action:</p>
        <ol>
          <li>Refresh the page (F5 or Cmd + R).</li>
          <li>Clear the browser cache and cookies (instructions for clearing are in the help center).</li>
          <li>Try logging in again after a few minutes (there may be a temporary issue with the servers).</li>
          <li>Check in another browser or device.</li>
          <li>Temporarily disable content blockers.</li>
        </ol>
        <p>If the error persists, contact support with a full description of the action you took, screenshots, browser and operating system details, and the time the error occurred.</p>
      </>
    ),
  },
  {
    question: "❓ I can't log into my account. What can I do?",
    answer: (
      <>
        <p>If you are unable to log into your account, follow these steps:</p>
        <ol>
          <li>Make sure you are entering the correct username and password (pay attention to uppercase/lowercase letters and language).</li>
          <li>Try resetting your password using the "Forgot Password" link on the login screen.</li>
          <li>Check your inbox (including spam) for an email to reset your password.</li>
          <li>If you do not receive an email, double-check the email address, and try again after some time.</li>
          <li>If you forgot your username, look for previous emails from the system or contact support with identifying details.</li>
          <li>If the account is locked, wait about 15 minutes and try again or contact support.</li>
          <li>Try logging in from another browser or in private browsing mode.</li>
        </ol>
        <p>If none of the steps helped, contact support with details of the issue and account information.</p>
      </>
    ),
  },
  {
    question: "❓ The files are not loading or displaying, what should I do?",
    answer: (
      <>
        <p>When the files you uploaded are not loading or displaying correctly, take the following actions:</p>
        <ol>
          <li>Check that the file is in a supported format (JPG, PNG, PDF, MP4, etc.).</li>
          <li>Ensure the file is smaller than the allowed limit (for example, up to 10MB).</li>
          <li>Make sure the file is not corrupted by opening it on your computer.</li>
          <li>Refresh the page and try again.</li>
          <li>Try re-uploading the file.</li>
          <li>Ensure a stable internet connection.</li>
          <li>Try in another browser or in private browsing mode.</li>
          <li>If there is a specific error message, write it down or take a screenshot.</li>
          <li>Contact support with file details, browser, and device information.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ The system disconnects by itself, what should I do?",
    answer: (
      <>
        <p>When the system disconnects without warning, it is recommended to follow these steps:</p>
        <ol>
          <li>Check the internet connection – make sure it is stable and strong.</li>
          <li>Close applications and background processes that may consume bandwidth.</li>
          <li>Check power-saving or sleep settings on your computer or mobile device.</li>
          <li>Clear browser cache and data.</li>
          <li>Try logging in from another browser or device.</li>
          <li>Check for updates to the operating system or browser.</li>
          <li>If using a VPN or proxy, try disabling it temporarily.</li>
          <li>If the problem continues, note the times and conditions and contact support with full details.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ How to report bugs in the system?",
    answer: (
      <>
        <p>To report bugs in the system effectively:</p>
        <ol>
          <li>Document the issue clearly, including the action steps that caused it.</li>
          <li>Attach a screenshot of the error or issue.</li>
          <li>Gather technical information: device type, operating system, browser, and its version.</li>
          <li>Specify the exact time of the issue.</li>
          <li>Send the information to the support address: support@esclick.co.il or open a ticket in the system.</li>
          <li>Write a clear title and describe if the issue is recurring or how to reproduce it.</li>
          <li>Wait for a response from support with instructions or fixes.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ My account was blocked without reason, what should I do?",
    answer: (
      <>
        <p>If your account is blocked and you do not know why, follow these steps:</p>
        <ol>
          <li>Ensure the account is indeed blocked by attempting to log in.</li>
          <li>Check emails (including spam) for blocking notifications.</li>
          <li>Contact support with account details, when you tried to log in, and what message you received.</li>
          <li>Briefly describe if you performed any special actions before the block.</li>
          <li>Wait for a response and resolution or further instructions.</li>
          <li>To prevent blocks: keep a strong password, avoid using public devices without logging out, and refrain from unusual activities.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ I received an unidentified error message in the system, what should I do?",
    answer: (
      <>
        <p>When an unidentified error appears, follow these steps:</p>
        <ol>
          <li>Refresh the page (F5 or Cmd + R).</li>
          <li>Clear cache and cookies (instructions for clearing in Chrome are above).</li>
          <li>Try logging in from another browser or device.</li>
          <li>Write down the content of the error message and take a screenshot.</li>
          <li>Contact support with precise details: action taken, message content, browser, operating system, time of the issue.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ The system shows me blank pages or a white screen, how to resolve?",
    answer: (
      <>
        <p>In case of blank pages or a white screen:</p>
        <ol>
          <li>Ensure a stable internet connection.</li>
          <li>Clear cache and cookies.</li>
          <li>Temporarily disable plugins (ad blockers, script blockers).</li>
          <li>Try in private browsing mode (Incognito/Private Mode).</li>
          <li>Try another browser or device.</li>
          <li>Contact support with a full description and screenshots.</li>
        </ol>
      </>
    ),
  },
  {
    question: "❓ I am getting a Timeout error – the site is not responding or disconnecting, what should I do?",
    answer: (
      <>
        <p>A Timeout error occurs when the server does not respond in a reasonable time. To resolve:</p>
        <ol>
          <li>Check for a stable and fast internet connection.</li>
          <li>Close programs or applications that consume a lot of bandwidth.</li>
          <li>Refresh the page and try again.</li>
          <li>Try logging in at a different time if the server is busy.</li>
          <li>Try another browser or device.</li>
          <li>If the problem persists, note the times and contact support with full details.</li>
        </ol>
      </>
    ),
  },
  // Additional questions can be added as needed
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
        Troubleshooting and Errors - Questions and Answers
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
```