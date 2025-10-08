```javascript
import React, { useState } from "react";

const faqs = [
  {
    question: "What is the Esclic affiliate program and how does it work?",
    answer: `The Esclic affiliate program is a rewarding business opportunity that allows you to earn additional income in a simple and efficient way, without the need for full management of the sales process or complex marketing efforts. By receiving a personal referral link, you can refer potential customers to the business, and once they register and make a purchase in the system — you will receive a financial commission for every completed transaction.

Why should you join the affiliate program?
- Passive income and revenue expansion — without the need to manage inventory or direct service.
- A transparent and accurate system — real-time tracking of referrals, registrations, and purchases.
- Simplicity and convenience — easy sharing of the link across various channels.
- Expanding your business network and exposure to new markets.
- Flexibility in managing the pace and marketing channels.`,
  },
  {
    question: "How to receive and share my personal link in the affiliate program?",
    answer: `In your personal dashboard, you will find a unique referral link.
Easily copy it using the copy button.
Share it across channels like social networks, email, website, calls, webinars, and more.
Maintain consistency in sharing and use the dashboard to track results.`,
  },
  {
    question: "What are the commission terms and how are they calculated?",
    answer: `- Variable commission percentage (3%-7%) based on the type of package or agreement.
- Additional financial bonuses based on a minimum number of transactions per month.
- A 14-day verification period for completed transactions that remain valid.
- Monthly payment with full transparency in the dashboard.
- Cancellation and refund policies apply to commissions accordingly.`,
  },
  {
    question: "How to track referrals, transactions, and commissions?",
    answer: `- A dashboard with real-time data on:
  - Total number of referrals.
  - Status and amount of completed transactions.
  - Amount of commissions and bonuses.
  - Payment status.
  - Filters by time periods for analysis and tracking.`,
  },
  {
    question: "What packages are available and what are the commitment terms?",
    answer: `- Monthly, quarterly, and annual packages.
- Commission percentages: 3% (monthly), 5% (quarterly), 7% (annual).
- One-time financial bonuses based on transaction thresholds.
- Choice tailored to the partner's needs and level of commitment.`,
  },
  {
    question: "How to upload receipts and manage payment in the program?",
    answer: `- Upload receipts in the dashboard via a dedicated button.
- Save the receipt in the system for tracking and approval.
- The payments team verifies the receipts and ensures their validity.
- Without a valid receipt, commission payments will be delayed.
- It is important to track and maintain compliance with tax authorities.`,
  },
  {
    question: "What to do in case of issues with tracking or payment?",
    answer: `- Ensure that your personal link is correct and updated.
- Check payment status and cancellation period (14 days).
- Gather detailed information for support (dates, amounts, source of referral).
- Contact support with all details for professional assistance.`,
  },
  {
    question: "How to increase income from the affiliate program?",
    answer: `- Choose targeted and effective marketing channels.
- Distribute the link on social networks and through newsletters.
- Create professional content (articles, guides, videos).
- Collaborate with partners and influencers.
- Track and analyze campaign performance and practice optimization.`,
  },
  {
    question: "What to do if the personal link does not work or does not redirect correctly?",
    answer: `- Check that the link is complete and correct (copy from the dashboard).
- Check for browser blocks (firewall, ad blockers).
- Clear cache and cookies.
- Try opening in a different browser or device.
- Ensure that the business actually made a purchase through your link.
- Track referrals in the system.
- If necessary, contact support with complete details.`,
  },
  {
    question: "What to do when the program pages do not load or load slowly?",
    answer: `- Refresh the browser with Ctrl+F5 / Cmd+Shift+R.
- Clear cache and cookies.
- Check internet connection.
- Close background applications that are heavy.
- Try a different browser or device.
- Check for maintenance messages or system issues.
- Contact support if necessary.`,
  },
];

export default function AffiliateProgramFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        textAlign: "right",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Esclic Affiliate Program - Frequently Asked Questions
      </h1>
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "1rem 0",
            overflowWrap: "break-word",
          }}
        >
          <button
            onClick={() => toggleIndex(idx)}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            id={`faq-question-${idx}`}
            style={{
              width: "100%",
              background: "rgba(85, 107, 47, 0.5)",
              border: "none",
              textAlign: "right",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "0.5rem 0",
              outline: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 6,
            }}
          >
            <span
              style={{
                userSelect: "none",
                color: "#f06292",        // Pink-Red
                marginLeft: 10,          // Space between the question mark and text
                paddingRight: 2,
                fontWeight: "bold",
                fontSize: 24,
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              ?
            </span>
            <span style={{ flexGrow: 1, textAlign: "right" }}>{faq.question}</span>
            <span style={{ fontSize: 24, lineHeight: 1 }}>
              {openIndex === idx ? "−" : "+"}
            </span>
          </button>
          {openIndex === idx && (
            <div
              id={`faq-answer-${idx}`}
              role="region"
              aria-labelledby={`faq-question-${idx}`}
              style={{
                marginTop: 8,
                whiteSpace: "pre-wrap",
                color: "#444",
                lineHeight: 1.6,
                textAlign: "right",
                direction: "rtl",
              }}
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```