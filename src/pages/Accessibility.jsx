import React from "react";
import "../styles/accessibility-style.css";  // ודא שהקובץ CSS מיובא כאן

export default function Accessibility() {
  return (
    <main className="accessibility-page" dir="rtl">
      <h1>הצהרת נגישות</h1>

      <p>
        אתר <strong>עסקליק</strong> רואה חשיבות עליונה בהנגשת השירותים
        הדיגיטליים לכלל האוכלוסייה, ובכלל זה אנשים עם מוגבלות.
        אנו פועלים לעמידה בהנחיות WCAG 2.1 ברמה AA.
      </p>

      <h2>פעולות שבוצעו</h2>
      <ul>
        <li>תמיכה מלאה בניווט מקלדת (Tab / Shift-Tab / Enter).</li>
        <li>טקסט חלופי לכל תמונה ואייקון.</li>
        <li>כותרות ברמת Heading ו-ARIA באלמנטים אינטראקטיביים.</li>
        <li>בדיקת ניגודיות צבעים בהתאם לתקן.</li>
      </ul>

      <h2>חריגות ידועות</h2>
      <p>
        חלק מהתכנים המועלים על-ידי משתמשים (לוגואים וסרטוני צד-שלישי)
        עדיין אינם נגישים לחלוטין. אנו משפרים נקודות אלו באופן שוטף.
      </p>

      <h2>יצירת קשר בנושא נגישות</h2>
      <ul>
        <li>רכזת נגישות: דנה כהן</li>
        <li>טלפון: 03-1234567 (א׳-ה׳ 09:00-16:00)</li>
        <li>דוא״ל: <a href="mailto:accessibility@esclick.co.il">accessibility@esclick.co.il</a></li>
      </ul>
      <p>נשיב לפנייה בתוך 3 ימי עבודה.</p>

      <h2>תאריך עדכון</h2>
      <p>הצהרה מעודכנת ל-<time dateTime="2025-04-30">30 באפריל 2025</time>.</p>
    </main>
  );
}
