import React, { useState } from "react";

const technicalSupportFAQs = [
  {
    question: "❓ How can I get technical help?",
    answer: (
      <>
        <p>For quick and effective technical assistance, we recommend the following steps:</p>
        <ul>
          <li>
            <b>Read the guides and FAQs in the Help Center:</b> In the site’s Help Center you’ll find detailed guides and FAQs covering a wide range of topics and common errors. Reading them may help you solve the issue on your own without contacting support.
          </li>
          <li>
            <b>Use our support bot:</b> You can consult with the site’s support bot, which can help diagnose and resolve routine issues quickly and easily.
          </li>
          <li>
            <b>Try to resolve the issue yourself:</b> Most common system issues can be solved by simple steps like refreshing the page, clearing the browser cache, resetting your password, and so on.
          </li>
          <li>
            <b>Contact the support team if needed:</b><br />
            If after reading the guides and using the bot the issue still exists, you can contact our support team.<br />
            <b>Email:</b> support@BizUply.co.il<br />
            <b>Phone:</b> Relevant phone number<br />
            When contacting us, include a detailed description of the issue, screenshots, and system details (browser, device, time of event) so we can assist quickly.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How do I reset my password?",
    answer: (
      <>
        <p>To reset your password and regain access to your account, follow these steps:</p>
        <ol>
          <li>Go to the system’s login page.</li>
          <li>Click the “Forgot password” link (usually under the login fields).</li>
          <li>Enter the email address associated with your account in the appropriate field.</li>
          <li>Click the submit/continue button.</li>
          <li>Check your inbox (including spam) for an email containing a password reset link.</li>
          <li>Click the link in the email to go to the password reset page.</li>
          <li>Enter a new password and complete verification if required (e.g., enter the password twice).</li>
          <li>Save the new password by clicking “Reset Password” or “Confirm”.</li>
          <li>Try logging in with your new password on the login page.</li>
        </ol>
        <p><b>If you didn’t receive the email:</b></p>
        <ul>
          <li>Make sure the email address you entered is correct.</li>
          <li>Check the spam folder.</li>
          <li>Wait a few minutes and try requesting a reset again.</li>
          <li>If the issue persists, contact technical support for help.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How do I configure notifications?",
    answer: (
      <>
        <p>In our system, notifications are enabled and sent automatically for important events such as new messages, collaborations, appointment scheduling, and more. Notifications appear under the bell icon at the top-right corner of the screen, so you can always see them in real time.</p>
        <p><b>No manual configuration is required to enable/disable notifications in the system</b>, as the system manages notification delivery automatically and uniformly for all users.</p>
        <p>Regarding push notifications on mobile devices or browsers:</p>
        <ul>
          <li>If your device or browser supports it, you may be asked to allow push notifications when using the site.</li>
          <li>You can allow or decline these notifications through your browser or operating system settings, outside of our system.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ Why don’t I see new updates in the system?",
    answer: (
      <>
        <p>If you don’t see new updates in the system, follow these steps:</p>
        <ul>
          <li><b>Check your internet connection:</b> Ensure your device is connected and the connection is stable and strong. An unstable connection may prevent new content from loading.</li>
          <li><b>Refresh the browser page:</b> Use the refresh button (F5 on Windows or Cmd + R on Mac) to reload the page and try to display the latest updates.</li>
          <li><b>Clear the browser cache:</b> Sometimes the browser shows a stored version of the page without the latest updates. Clearing the cache allows fresh content to load. Instructions for Chrome cache clearing were provided earlier.</li>
          <li><b>Make sure your system is up to date:</b> In some setups, using old apps or versions may prevent new content from showing properly. If you use a mobile app, ensure it’s updated in the app store. In a browser-based system this is less relevant, but it’s important to use an up-to-date browser.</li>
          <li><b>Try another browser or device:</b> Sometimes the problem is local to a specific browser or device. Check if updates appear in another browser or device.</li>
          <li><b>If the issue persists:</b> Make sure there are no network restrictions or firewalls preventing content updates. Contact support with a description of the issue, device type, browser, and the date/time you encountered the problem.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How do I clear cache and cookies in the browser?",
    answer: (
      <>
        <p>Clearing your browser’s cache and cookies can help resolve loading issues, errors, and display problems. Below are instructions for several browsers, focusing on Google Chrome:</p>
        <ol>
          <li>Open the browser and click the three vertical dots at the top-right corner (menu).</li>
          <li>From the menu, choose Settings.</li>
          <li>On the left, click Privacy and security.</li>
          <li>Select Clear browsing data.</li>
          <li>In the window that opens, choose the time range: All time, to delete all data.</li>
          <li>Select the options:<br />- Cookies and other site data<br />- Cached images and files</li>
          <li>Click the Clear data button.</li>
          <li>Close and reopen the browser.</li>
        </ol>
        <p>A similar process exists for other popular browsers such as Firefox, Edge, and Safari:</p>
        <ul>
          <li>Find the option to clear browsing data within Settings or Privacy.</li>
          <li>Select to remove Cookies and Cache.</li>
          <li>Choose an appropriate time range (All time is recommended).</li>
          <li>Confirm the action and restart the browser.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ What should I do if the site is slow or lagging?",
    answer: (
      <>
        <p>When the site is slow or lagging, follow these steps to identify and fix the issue:</p>
        <ul>
          <li><b>Check your internet connection:</b> Ensure it’s stable and fast. Try opening other websites to see if they load quickly. If there are connection issues, restart your router or modem.</li>
          <li><b>Close background apps and processes:</b> Many programs can use bandwidth or system resources. Close unused apps—especially those downloading files, streaming, or performing automatic updates.</li>
          <li><b>Clear the browser cache:</b> A heavy cache can cause slow loading or outdated pages. Follow the cache-clearing instructions provided earlier, then close and reopen the browser.</li>
          <li><b>Try a different browser:</b> The issue might be related to your current browser. Check if the site runs faster in another browser (e.g., Firefox, Edge, Safari).</li>
          <li><b>Check for system or browser updates:</b> Updates can improve performance and resolve issues.</li>
          <li><b>If the issue persists:</b> Contact technical support and include key details: device type, browser, internet speed, times when the issue occurs, and a detailed description.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How can I tell if the problem is on my side or in the system?",
    answer: (
      <>
        <p>When you encounter a problem, it’s important to determine whether it’s caused by the system itself or by your device/network. To diagnose, do the following:</p>
        <ul>
          <li>Try accessing the system from a different device: open it on a different computer, phone, or tablet. If the problem persists elsewhere, it’s likely system-related.</li>
          <li>Try a different internet network: for example, if you’re on home Wi-Fi, try cellular data or another public network (like a café or office). If the issue only appears on one network, it may be your connection or network settings.</li>
          <li>Clear cache and browser data on the affected device: cached files may cause loading or functionality issues.</li>
          <li>Check security settings and extensions: ensure no ad blockers, firewalls, or security apps are blocking parts of the site. Temporarily disable browser extensions to rule them out.</li>
          <li>If, after all checks, the issue still exists: it may be a system issue. Contact support and list the tests you performed, including devices and networks used.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ Does the system support old browsers?",
    answer: (
      <>
        <p>Support for new technologies: modern browsers support technologies that improve loading speed, security, and complex site rendering.</p>
        <p>Performance and stability: older browsers may suffer from performance issues, slow loading, or crashes. Using updated versions ensures a smooth and stable user experience.</p>
        <p>Security: older browsers don’t receive important security patches and may be vulnerable.</p>
        <p>Errors and glitches: using old browsers can cause display errors, inactive elements, functional issues, or even failures to load pages/components.</p>
        <p>What to do if you have an old browser? Update it to the latest version via the vendor’s site. If you can’t update (e.g., on legacy systems), try a different browser supported by the system. If needed, contact support for recommendations.</p>
      </>
    ),
  },
  {
    question: "❓ What should I do in case of account security issues?",
    answer: (
      <>
        <p>If you suspect your account was compromised or your password leaked, act quickly and decisively to protect your data and account:</p>
        <ul>
          <li>Change your password immediately: go to account settings or the security page. Choose “Change password” and enter a new, strong, unique password (at least 8 characters with upper/lowercase letters, numbers, and special characters).</li>
          <li>Check for suspicious changes: review account activity history (if available). Ensure no unauthorized changes to personal details, email addresses, or permissions.</li>
          <li>Review connected devices: if possible, check which devices/locations are connected. If you see unknown connections, disconnect them and re-manage access permissions.</li>
          <li>Use unique passwords: don’t reuse the same password across multiple sites/services. Consider a password manager.</li>
          <li>If you can’t change the password or access your account: contact technical support ASAP for help regaining control.</li>
          <li>Keep devices clean: ensure no malware is present. Run antivirus scans and update your security software.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How do I recover my account if I forgot my login details?",
    answer: (
      <>
        <p>If you forgot your login details, follow these steps:</p>
        <ul>
          <li>Try resetting your password: click “Forgot password” on the login page. Enter the email associated with your account. Open the email you receive and use the link to reset your password.</li>
          <li>If you also forgot your username or email: look for previous emails from the system that may show your username. Contact support with identifying details (full name, phone, etc.) for assistance.</li>
          <li>If you can’t reset the password or recover details: contact technical support with as many details as possible, and we’ll help restore access.</li>
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
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>Technical Support — FAQ</h1>
      {technicalSupportFAQs.map(({ question, answer }, idx) => (
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
