import React from "react";
import "../styles/FAQ.css";
import { Link } from "react-router-dom";

function FAQ() {
  return (
    <div className="faq-container">
      <h1 className="faq-title">שאלות נפוצות - Eshet Asakim</h1>

      <div className="faq-section">
        <h2> כללי</h2>
        <p><b>מהי הפלטפורמה Eshet Asakim?</b><br />
        Eshet Asakim היא פלטפורמה המחברת בין עסקים ללקוחות בצורה חכמה, מהירה ונוחה. היא מאפשרת חיפוש עסקים, קביעת תורים, רכישות אונליין, יצירת קשר בין עסקים ולקוחות ועוד.</p>

        <p><b>האם השירות כרוך בתשלום?</b><br />
        השימוש הבסיסי בפלטפורמה הוא חינמי, אך לעסקים מוצעות חבילות בתשלום עם כלים מתקדמים לשיווק, ניהול וקידום העסק.</p>
      </div>

      <div className="faq-section">
        <h2> הרשמה והתחברות</h2>
        <p><b>איך נרשמים כעסק?</b><br />
        עסקים יכולים ללחוץ על כפתור "הצטרפות עסקים", למלא פרטים בסיסיים ולהתחיל לקבל לקוחות.</p>

        <p><b>איך נרשמים כלקוחות?</b><br />
        לקוחות יכולים ללחוץ על "התחברות", למלא פרטים בסיסיים ולגשת לכל השירותים בקלות.</p>
      </div>

      <div className="faq-section">
        <h2> חיפוש עסקים ושירותים</h2>
        <p><b>איך מחפשים עסקים?</b><br />
        ניתן להקליד שם עסק, תחום או אזור חיפוש ולקבל תוצאות מדויקות.</p>

        <p><b>האם ניתן לראות חוות דעת על עסקים?</b><br />
        כן! ניתן לקרוא ביקורות ודירוגים מכל לקוחות הפלטפורמה.</p>
      </div>

      <div className="faq-section">
        <h2> קביעת תורים ורכישות</h2>
        <p><b>איך קובעים תור?</b><br />
        נכנסים לעמוד העסק, בוחרים "קבע תור", בוחרים שעה ומקבלים אישור.</p>

        <p><b>איך רוכשים מוצרים?</b><br />
        ניתן לבחור מוצרים, לשלם בצורה מאובטחת ולקבל אישור מיידי.</p>
      </div>

      <div className="faq-section">
        <h2> קידום עסקים ושיווק</h2>
        <p><b>איך אפשר לקדם עסק?</b><br />
        מצטרפים לחבילה מתאימה, ועושים שיתופי פעולה עם עסקים בתחום.</p>

        <p><b>איך יוצרים שיתופי פעולה?</b><br />
        שולחים הודעות לעסקים שמשלימים בתחום שלנו, ומסכמים על שיתוף פעולה כדי לצמוח יחד.</p>
      </div>

      <div className="faq-section">
        <h2> אבטחה ותמיכה</h2>
        <p><b>האם הנתונים שלי מוגנים?</b><br />
        כן! כל הנתונים מוצפנים בהתאם לתקני האבטחה המחמירים ביותר.</p>

        <p><b>איך יוצרים קשר עם תמיכה?</b><br />
        ניתן ללחוץ על "יצירת קשר" ולשלוח פנייה לצוות התמיכה.</p>
      </div>

      <div className="faq-footer">
        <h3>📌 יש לך שאלה נוספת?</h3>
        <p>ניתן ליצור קשר עם צוות התמיכה דרך העמוד <Link to="/contact">"יצירת קשר"</Link>.</p>
      </div>

      {/* תחתית הדף */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/business-search" className="footer-link">📋 חיפוש עסקים</Link></li>
          <li><Link to="/about" className="footer-link">📖 קצת עלינו</Link></li>
          <li><Link to="/how-it-works" className="footer-link">⚙️ איך זה עובד</Link></li>
          <li><Link to="/business-signup" className="footer-link">✏️ הצטרפות עסקים</Link></li>
          <li><Link to="/faq" className="footer-link">❓ שאלות נפוצות</Link></li>
          <li><Link to="/terms" className="footer-link">📜 תקנון</Link></li>
          <li><Link to="/contact" className="footer-link">📞 יצירת קשר</Link></li>
        </ul>
        <p className="copyright">כל הזכויות שמורות © Eshet Asakim</p>
      </footer>
    </div>
  );
}

export default FAQ;
