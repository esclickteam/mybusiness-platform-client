import React, { useState } from "react";
import "./faq.css";
import HelpArticleLayout from "./HelpArticleLayout";

const troubleshootingFAQs = [
  {
    question: "המערכת לא נטענת — מה לעשות",
    answer: (
      <>
        <p>כשהמערכת לא נטענת, בצעו את הצעדים הבאים לפי הסדר:</p>
        <ol>
          <li>
            <b>בדקו את חיבור האינטרנט:</b> ודאו שהמכשיר מחובר
            והאות יציב. נסו לפתוח אתר אחר.
          </li>
          <li>
            <b>רעננו את הדף:</b> לחצו <code>F5</code> (Windows) או{" "}
            <code>Cmd + R</code> (Mac).
          </li>
          <li>
            <b>נקו מטמון דפדפן:</b>
            Chrome: הגדרות → פרטיות ואבטחה → ניקוי נתוני גלישה.
            סמנו «תמונות וקבצים במטמון» ו«עוגיות», ואז נקו.
          </li>
          <li>
            <b>התנתקו והתחברו מחדש:</b> המתינו 2–3 דקות לפני
            ההתחברות מחדש.
          </li>
          <li>
            <b>נסו דפדפן או מכשיר אחר:</b> Firefox, Edge, Safari
            או מכשיר שונה.
          </li>
          <li>
            <b>השביתו תוספים:</b> השביתו זמנית חוסמי פרסומות
            או תוספי אבטחה.
          </li>
        </ol>
        <p>
          אם הבעיה נמשכת, פנו לתמיכה עם צילומי מסך ופרטי
          דפדפן/מערכת הפעלה.
        </p>
      </>
    ),
  },
  {
    question: "קיבלתי שגיאת שרת 500 — מה לעשות",
    answer: (
      <>
        <p>שגיאת 500 מציינת בעיה בצד השרת. נסו את הדברים הבאים:</p>
        <ol>
          <li>רעננו את הדף.</li>
          <li>נקו מטמון ועוגיות.</li>
          <li>המתינו מספר דקות ונסו שוב.</li>
          <li>בדקו מדפדפן או מכשיר אחר.</li>
          <li>השביתו תוספים שחוסמים תוכן.</li>
        </ol>
        <p>
          אם השגיאה נמשכת, פנו לתמיכה עם צילומי מסך, שעת
          ההופעה ופרטי דפדפן/מערכת הפעלה.
        </p>
      </>
    ),
  },
  {
    question: "אני לא מצליח להתחבר לחשבון — מה אפשר לעשות",
    answer: (
      <>
        <p>אם לא ניתן להתחבר, נסו את הדברים הבאים:</p>
        <ol>
          <li>ודאו שם משתמש/סיסמה ושפת מקלדת.</li>
          <li>השתמשו באפשרות «שכחתי סיסמה».</li>
          <li>בדקו תיקיית ספאם לדוא"ל איפוס.</li>
          <li>המתינו 15 דקות אם החשבון ננעל זמנית.</li>
          <li>נסו מצב incognito או דפדפן אחר.</li>
        </ol>
        <p>אם ההתחברות עדיין נכשלת, פנו לתמיכה עם פרטי החשבון.</p>
      </>
    ),
  },
  {
    question: "קבצים לא נטענים או לא מוצגים — מה לעשות",
    answer: (
      <>
        <p>אם קבצים לא נטענים:</p>
        <ol>
          <li>ודאו פורמט נתמך (JPG, PNG, PDF, MP4).</li>
          <li>ודאו שהקובץ בגודל המותר.</li>
          <li>בדקו שהקובץ לא פגום.</li>
          <li>רעננו את הדף ונסו שוב.</li>
          <li>נסו דפדפן אחר או מצב פרטי.</li>
          <li>פנו לתמיכה עם פרטי השגיאה.</li>
        </ol>
      </>
    ),
  },
  {
    question: "המערכת מנתקת אותי אוטומטית — מה לעשות",
    answer: (
      <>
        <p>ניתוקים לא צפויים עלולים לנבוע מ:</p>
        <ol>
          <li>חיבור אינטרנט לא יציב.</li>
          <li>סכסוכים במטמון דפדפן או בתוספים.</li>
          <li>הגדרות חיסכון באנרגיה או שינה.</li>
          <li>הפרעה מ-VPN או proxy.</li>
        </ol>
        <p>
          נסו דפדפן/מכשיר אחר ופנו לתמיכה אם זה נמשך.
        </p>
      </>
    ),
  },
  {
    question: "איך מדווחים על באגים במערכת",
    answer: (
      <>
        <p>לדיווח יעיל על באגים:</p>
        <ol>
          <li>תארו את הפעולה שגרמה לבעיה.</li>
          <li>צרפו צילומי מסך.</li>
          <li>כללו מכשיר, מערכת הפעלה, דפדפן וגרסה.</li>
          <li>ציינו תאריך ושעה.</li>
          <li>
            שלחו פרטים ל-<b>support@bizuply.com</b> או פתחו
            פניית תמיכה.
          </li>
        </ol>
      </>
    ),
  },
  {
    question: "החשבון שלי נחסם ללא סיבה — מה לעשות",
    answer: (
      <>
        <p>אם החשבון נחסם:</p>
        <ol>
          <li>אשרו את החסימה בניסיון התחברות.</li>
          <li>בדקו דוא"ל (כולל ספאם).</li>
          <li>פנו לתמיכה עם פרטי החשבון.</li>
          <li>תארו פעולות אחרונות לפני החסימה.</li>
        </ol>
      </>
    ),
  },
  {
    question: "אני רואה דף ריק או מסך לבן — איך מתקנים",
    answer: (
      <>
        <p>לפתרון מסכים ריקים:</p>
        <ol>
          <li>בדקו חיבור אינטרנט.</li>
          <li>נקו מטמון ועוגיות.</li>
          <li>השביתו תוספים זמנית.</li>
          <li>נסו מצב incognito.</li>
          <li>נסו דפדפן או מכשיר אחר.</li>
        </ol>
      </>
    ),
  },
  {
    question: "שגיאת timeout — האתר מתנתק או לא מגיב",
    answer: (
      <>
        <p>timeout בדרך כלל מציין חיבור איטי או מופרע.</p>
        <ol>
          <li>בדקו מהירות ויציבות אינטרנט.</li>
          <li>סגרו אפליקציות שצורכות רוחב רב.</li>
          <li>רעננו ונסו שוב.</li>
          <li>נסו שוב מאוחר יותר אם השרתים עמוסים.</li>
          <li>פנו לתמיכה אם זה חוזר על עצמו.</li>
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
    <HelpArticleLayout>
      <h1 className="faq-title">פתרון תקלות ושגיאות – שאלות נפוצות</h1>

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
    </HelpArticleLayout>
  );
}
