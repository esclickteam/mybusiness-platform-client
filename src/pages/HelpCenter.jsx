import React from "react";
import "./HelpCenter.css";  // ייבוא קובץ ה-CSS

export default function HelpCenter() {
  return (
    <div className="help-center-container">
      <h1>מרכז העזרה</h1>
      <p>ברוכים הבאים למרכז העזרה! כאן תוכלו למצוא תשובות לשאלות נפוצות ומידע שיסייע לכם להשתמש במערכת בצורה מיטבית.</p>

      <section>
        <h2>שאלות נפוצות</h2>
        <ul>
          <li><strong>איך לערוך את פרופיל העסק שלי?</strong> — עבורו ללשונית "עריכת עמוד עסקי" בתפריט הצד.</li>
          <li><strong>איך ליצור קשר עם לקוחות?</strong> — השתמש בלשונית "הודעות מלקוחות" כדי לשלוח ולקבל הודעות.</li>
          <li><strong>איך לנהל את ה-CRM?</strong> — בקרו בלשונית "מערכת CRM" לניהול הלקוחות והפגישות שלכם.</li>
          {/* הוסף שאלות ותשובות נוספות לפי הצורך */}
        </ul>
      </section>

      <section>
        <h2>צריכים עזרה נוספת?</h2>
        <p>ניתן לפנות אלינו באמצעות האימייל: <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
        <p>או להתקשר למספר הטלפון: <a href="tel:+97212345678">+972-1-2345678</a></p>
      </section>
    </div>
  );
}
