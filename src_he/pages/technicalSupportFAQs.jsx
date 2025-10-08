import React, { useState } from "react";

const technicalSupportFAQs = [
  {
    question: "❓ How to get technical assistance?",
    answer: (
      <>
        <p>To receive technical assistance quickly and efficiently, it is recommended to follow these steps:</p>
        <ul>
          <li>
            <b>Read the guides and FAQs in the help center:</b> In the help center on the website, you will find detailed guides and FAQs covering a variety of topics and common errors. Reading them may help you resolve the issue independently without needing to contact support.
          </li>
          <li>
            <b>Use our support bot:</b> You can consult the support bot on the website that can help you diagnose and resolve routine issues quickly and easily.
          </li>
          <li>
            <b>Try to resolve the issue independently:</b> Most common faults and errors in the system can be resolved simply by performing straightforward steps such as refreshing the page, clearing the browser cache, resetting the password, etc.
          </li>
          <li>
            <b>Contact the support team if necessary:</b><br />
            If after reading the guides and using the bot the issue still exists, you can contact our support team.<br />
            <b>Email address:</b> support@esclick.co.il<br />
            <b>Phone:</b> Relevant phone number<br />
            When contacting, it is recommended to include a detailed description of the problem, screenshots, and system details (browser, device, time of the event) so we can assist quickly.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How to reset my password?",
    answer: (
      <>
        <p>To reset your password and regain access to your account, follow these steps:</p>
        <ol>
          <li>Go to the system's login page.</li>
          <li>Click on the "Forgot Password" link usually found below the login fields.</li>
          <li>Enter the email address associated with your account in the appropriate field.</li>
          <li>Click the submit or continue button.</li>
          <li>Check your inbox (including the spam folder) for an email with a password reset link.</li>
          <li>Click the link in the email to go to the password reset page.</li>
          <li>Enter a new password and confirm if required (for example: entering the password twice).</li>
          <li>Save the new password by clicking the "Reset Password" or "Confirm" button.</li>
          <li>Try logging in with the new password on the login page.</li>
        </ol>
        <p><b>If you did not receive the email:</b></p>
        <ul>
          <li>Ensure that the email address you entered is correct.</li>
          <li>Check the spam folder.</li>
          <li>Wait a few minutes and try requesting a password reset again.</li>
          <li>If the problem persists, contact technical support for assistance.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How to set up notifications?",
    answer: (
      <>
        <p>In our system, all notifications are activated and sent automatically for important events such as new messages, collaborations, appointment scheduling, and more. Notifications appear in the bell button at the top corner of the screen, so you can always see them in real-time.</p>
        <p><b>No manual settings are required or turning notifications on/off in the system</b>, as the system manages the sending of notifications automatically and uniformly for all users.</p>
        <p>Regarding push notifications on mobile devices or browsers:</p>
        <ul>
          <li>If your device or browser supports it, you may be prompted to approve receiving push notifications while using the site.</li>
          <li>You can approve or decline receiving these notifications through your browser or device operating system settings, outside of our system.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ Why am I not seeing new updates in the system?",
    answer: (
      <>
        <p>If you are not seeing new updates in the system, it is recommended to follow these steps:</p>
        <ul>
          <li><b>Check your internet connection:</b> Ensure that your device is connected to the internet and that the connection is stable and strong. An unstable connection may prevent new content from loading.</li>
          <li><b>Refresh the page in the browser:</b> Use the refresh button (F5 on Windows or Cmd + R on Mac) to reload the page and try to display the latest updates.</li>
          <li><b>Clear the browser cache:</b> Sometimes the browser displays a saved version of the page, without the latest updates. Clearing the cache will allow for a fresh load of the content. Instructions for clearing the cache in Chrome are found in previous answers.</li>
          <li><b>Ensure your system is updated to the latest version:</b> In some systems, if older applications or versions are used, new content may not display properly. If you are using a mobile app, ensure it is updated in the app store. In a browser-based system, this is less relevant, but it is important to ensure you are using an updated browser.</li>
          <li><b>Try logging in from another browser or device:</b> Sometimes the issue is local to a specific browser or device. Check if the updates appear in another browser or on a different device.</li>
          <li><b>If the problem persists:</b> Ensure there are no network restrictions or firewalls preventing content updates. Contact support with a description of the problem, device type, browser, and the date and time you encountered the issue.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How to clear cache and cookies in the browser?",
    answer: (
      <>
        <p>Clearing the cache and cookies in the browser can help resolve loading issues, errors, and display problems on pages. Here are instructions for clearing in various browsers, with an emphasis on Google Chrome:</p>
        <ol>
          <li>Open the browser and click on the three vertical dots in the upper right corner of the window (menu).</li>
          <li>In the opened menu, select Settings.</li>
          <li>On the left side, click on Privacy and security.</li>
          <li>Select Clear browsing data.</li>
          <li>In the window that opens, select the time range: All time, to delete all data.</li>
          <li>Check the options:<br />- Cookies and other site data<br />- Cached images and files</li>
          <li>Click the Clear data button.</li>
          <li>Close the browser and reopen it.</li>
        </ol>
        <p>A similar process exists in other popular browsers like Firefox, Edge, and Safari:</p>
        <ul>
          <li>Look in the settings or privacy menu for the option to clear browsing data.</li>
          <li>Select to delete cookies and cache.</li>
          <li>Select an appropriate time range (recommended: all time).</li>
          <li>Confirm the action and close/reopen the browser.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ What to do if the site is slow or lagging?",
    answer: (
      <>
        <p>When the site is lagging or running slowly, it is advisable to take the following steps to identify and resolve the issue:</p>
        <ul>
          <li><b>Check your internet connection:</b> Ensure the connection is stable and fast. Try opening other websites and check if they load quickly. If there are connection issues, disconnect and reconnect the router or modem.</li>
          <li><b>Close background applications and processes:</b> Many programs can use bandwidth or computer resources. Close unused programs, especially those downloading files, streaming, or performing automatic updates.</li>
          <li><b>Clear the browser cache:</b> A full cache can cause slow loading or loading of old versions of pages. Follow the previously provided instructions for clearing the cache, and close and reopen the browser.</li>
          <li><b>Try using a different browser:</b> The issue may be related to the browser you are using. Check if the site works faster in another browser (e.g., Firefox, Edge, or Safari).</li>
          <li><b>Check for updates to the system or browser:</b> Browser or system updates can improve performance and address issues.</li>
          <li><b>If the problem persists:</b> Contact technical support and provide important details: device type, browser, internet speed, times when the issue occurs, and a detailed description.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How to check if the problem is on our end or the system?",
    answer: (
      <>
        <p>When you encounter a problem in the system, it is important to check whether it is due to a technical issue in the system itself or a problem with your device or network. To make this diagnosis, follow these steps:</p>
        <ul>
          <li>Try accessing the system from another device: Open the system on a different computer, phone, or tablet than the one you usually use. If the problem continues to appear on another device, it is likely related to the system.</li>
          <li>Try accessing the system from a different internet network: For example, if you are connected through your home network, try connecting through a cellular network or another public network (like a café or office network). If the problem appears only on one network, the issue may be with your internet connection or network settings.</li>
          <li>Clear cache and browser: On the device where the problem occurs, clear the browser cache and cookies, as saved files may cause loading or functionality issues.</li>
          <li>Check security settings and plugins: Ensure there are no ad blockers, firewalls, or security software blocking parts of the site. Temporarily disable plugins in the browser to ensure they are not causing the issue.</li>
          <li>If after all the steps the problem still exists: The fault may be in the system. Contact support and mention all the checks you performed, including the devices and networks you tried.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ Does the system support old browsers?",
    answer: (
      <>
        <p>Support for new technologies: Modern browsers support new technologies that improve loading speed, security, and complex display capabilities of the site.</p>
        <p>Performance and stability: Old browsers may encounter performance issues, slow loading, or crashes. Using updated versions ensures a smooth and stable user experience.</p>
        <p>Security: Old browsers do not receive important security updates and may be exposed to vulnerabilities and risks.</p>
        <p>Errors and bugs: Using old browsers may cause display errors, inactive elements, functional errors, and even failures in loading pages or components.</p>
        <p>What to do if you have an old browser? It is recommended to update the browser to the latest version through the manufacturer's website. If you cannot update (for example, on old systems), try using another browser that is supported by the system. If necessary, contact support for recommendations.</p>
      </>
    ),
  },
  {
    question: "❓ How to act in case of account security issues?",
    answer: (
      <>
        <p>If you suspect that your user account has been hacked or that the password has leaked, it is important to act quickly and specifically to maintain the security of your information and account:</p>
        <ul>
          <li>Change the password immediately: Log into the account settings or security page in the system. Choose the option to change the password and enter a new, strong, and unique password. A good password includes at least 8 characters, a mix of uppercase and lowercase letters, numbers, and special characters.</li>
          <li>Check for suspicious changes in the account: Check the activity history in the system (if available). Ensure there are no changes to personal details, email addresses, or unauthorized permissions.</li>
          <li>Check connected devices: If possible, check which devices or locations are connected to the account. If you identify unknown connections, disconnect them and manage access permissions again.</li>
          <li>Ensure you keep unique passwords: Do not use the same password across multiple sites or services. Consider using a password manager for secure password management.</li>
          <li>If you cannot change the password or access the account: Contact technical support as soon as possible for help in recovering and regaining control of the account.</li>
          <li>Ensure to clean your computer and devices: Make sure there are no malware on the devices you are using. Run antivirus scans and update your security software.</li>
        </ul>
      </>
    ),
  },
  {
    question: "❓ How to recover an account if I forgot the login details?",
    answer: (
      <>
        <p>If you forgot your account login details, follow these steps:</p>
        <ul>
          <li>Try resetting the password: Click on the "Forgot Password" link on the login page. Enter the email address associated with the account. Open the email you received and activate the password reset link.</li>
          <li>If you also forgot the username or email address: Look for previous emails from the system that may help identify the username. Contact support with identifying details (full name, phone, etc.) for assistance.</li>
          <li>If you cannot reset the password or recover the details: Contact technical support with as many details as possible, and we will help you regain access to the account.</li>
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
      <h1 style={{ marginBottom: 30, textAlign: "center" }}>Technical Support - FAQs</h1>
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
