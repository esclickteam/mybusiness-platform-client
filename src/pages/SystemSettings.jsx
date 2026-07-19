import React, { useState } from "react";
import "./faq.css";
import HelpArticleLayout from "./HelpArticleLayout";

const faqs = [
  {
    question: "מהן הגדרות המערכת ב-BizUply?",
    answer:
      "הגדרות המערכת מאפשרות לנהל את התצורה המרכזית של פלטפורמת BizUply, כולל העדפות, הרשאות וכלים פנימיים שמשפיעים על אופן הפעלת העסק.",
  },
  {
    question: "איפה מנהלים את העדפות העסק והחשבון?",
    answer:
      "ניתן לנהל את פרטי פרופיל העסק, פרטי קשר, הגדרות נראות והעדפות כלליות ישירות מלוח הבקרה. השינויים מיושמים בזמן אמת בכל הפלטפורמה.",
  },
  {
    question: "אילו כלים נחשבים חלק ממערכת BizUply?",
    answer:
      "BizUply כוללת בונה אתרים עסקי, לוח בקרה וניתוחים, CRM, שיתופי פעולה עסקיים, יועץ AI וכלי תצורת מערכת פנימיים.",
  },
  {
    question: "איך BizUply מטפלת באבטחת מידע ופרטיות?",
    answer:
      "BizUply בנויה עם שיטות אבטחה חזקות, כולל בקרת גישה, טיפול מאובטח בנתונים והגנות ברמת המערכת להגנה על מידע העסק.",
  },
  {
    question: "האם ניתן לשלוט בהרשאות ובגישה בתוך המערכת?",
    answer:
      "כן. BizUply מאפשרת גישה מבוקרת לתכונות המערכת על בסיס החשבון והתצורה העסקית. הרשאות נוספות עשויות להיות תלויות בתוכנית שלכם.",
  },
  {
    question: "איך שינויי מערכת משפיעים על לוח הבקרה והכלים?",
    answer:
      "עדכוני מערכת משתקפים מיד בלוח הבקרה, ב-CRM, בבונה האתרים, ביועץ AI ובכלי שיתופי הפעולה כדי להבטיח עקביות.",
  },
  {
    question: "מה לעשות אם משהו לא עובד כצפוי?",
    answer:
      "נסו לרענן את הדף ולבדוק את החיבור. אם הבעיה נמשכת, עברו למקטע «פתרון תקלות ושגיאות» או פנו לתמיכה טכנית.",
  },
  {
    question: "האם תכונות המערכת מתעדכנות אוטומטית?",
    answer:
      "כן. BizUply מפרסמת שיפורים ועדכוני מערכת באופן שוטף ואוטומטי כדי להבטיח יציבות, ביצועים ויכולות חדשות.",
  },
];

export default function SystemSettings() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <HelpArticleLayout>
      {/* Header */}
      <h1 className="faq-title">הגדרות מערכת BizUply</h1>

      <p className="faq-subtitle">
        למדו איך מערכת BizUply עובדת ואיך לנהל את הגדרות הפלטפורמה
        ביעילות.
      </p>

      {/* FAQ List */}
      <div className="faq-list">
        {faqs.map((faq, idx) => {
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
    </HelpArticleLayout>
  );
}
