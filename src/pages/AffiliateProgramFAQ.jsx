import React, { useState } from "react";

const faqs = [
  {
    question: "What is the BizUply Affiliate Program and how does it work?",
    answer: `The BizUply Affiliate Program is a lucrative business opportunity that enables you to earn additional income easily and efficiently—without managing the full sales process or running complex marketing efforts. By receiving a personal referral link, you can direct potential customers to the business, and once they sign up and make a purchase in the system—you receive a commission on every completed transaction.

Why join the affiliate program?
- Passive income and expanded earnings—no inventory management or direct service required.
- Transparent, accurate system—real-time tracking of referrals, sign-ups, and purchases.
- Simplicity and convenience—easily share your link across multiple channels.
- Broaden your business network and reach new markets.
- Flexibility in pacing and marketing channels.`,
  },
  {
    question: "How do I get and share my personal affiliate link?",
    answer: `You’ll find your unique referral link in your personal dashboard.
Copy it easily using the copy button.
Share it via social networks, email, your website, conversations, webinars, and more.
Be consistent and use the dashboard to track your results.`,
  },
  {
    question: "What are the commission terms and how are they calculated?",
    answer: `- Variable commission rate (3%–7%) depending on the package or agreement.
- Additional cash bonuses based on a minimum number of monthly transactions.
- A 14-day review period for completed, valid transactions.
- Monthly payout with full transparency in the dashboard.
- Cancellation/refund policies apply to commissions accordingly.`,
  },
  {
    question: "How can I track referrals, transactions, and commissions?",
    answer: `- A dashboard with real-time data on:
  - Total number of referrals.
  - Status and amount of completed transactions.
  - Commission and bonus totals.
  - Payout status.
  - Time-range filters for analysis and monitoring.`,
  },
  {
    question: "What packages exist and what are the commitment terms?",
    answer: `- Monthly, quarterly, and annual packages.
- Commission rates: 3% (monthly), 5% (quarterly), 7% (annual).
- One-time cash bonuses based on transaction thresholds.
- Choose according to your needs and desired level of commitment.`,
  },
  {
    question: "How do I upload receipts and manage payments in the program?",
    answer: `- Upload receipts in the dashboard via the dedicated button.
- Receipts are stored for tracking and approval.
- The payments team reviews receipts and verifies accuracy.
- Without a valid receipt, commission payout may be delayed.
- Be sure to comply with tax authority requirements.`,
  },
  {
    question: "What should I do if I have tracking or payment issues?",
    answer: `- Make sure your personal link is correct and up to date.
- Check payout status and the 14-day reversal period.
- Collect detailed information for support (dates, amounts, referral source).
- Contact support with all details for professional assistance.`,
  },
  {
    question: "How can I increase my affiliate income?",
    answer: `- Choose focused, effective marketing channels.
- Share your link on social networks and in newsletters.
- Create professional content (articles, guides, videos).
- Partner with collaborators and influencers.
- Track and analyze campaign performance and keep optimizing.`,
  },
  {
    question: "What if my personal link doesn’t work or doesn’t redirect correctly?",
    answer: `- Verify the link is complete and correct (copied from the dashboard).
- Check for browser blocks (firewall, ad-blockers).
- Clear cache and cookies.
- Try another browser or device.
- Confirm the purchase was actually made through your link.
- Monitor referrals in the system.
- If needed, contact support with full details.`,
  },
  {
    question: "What should I do when program pages don’t load or load slowly?",
    answer: `- Hard refresh the browser (Ctrl+F5 / Cmd+Shift+R).
- Clear cache and cookies.
- Check your internet connection.
- Close background apps that may slow performance.
- Try a different browser or device.
- Check for maintenance or known issues.
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
        direction: "ltr",
        textAlign: "left",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        BizUply Affiliate Program – FAQs
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
              textAlign: "left",
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
                color: "#f06292",        // pink-red
                marginRight: 10,         // spacing between ? and text (LTR)
                paddingLeft: 2,
                fontWeight: "bold",
                fontSize: 24,
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              ?
            </span>
            <span style={{ flexGrow: 1, textAlign: "left" }}>{faq.question}</span>
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
                textAlign: "left",
                direction: "ltr",
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
