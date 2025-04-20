import React from "react";
import "../styles/About.css";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">קצת עלינו - Eshet Asakim</h1>
      <p className="about-paragraph">
        ברוכים הבאים ל-Eshet Asakim!<br />
        אנחנו כאן כדי להפוך את החיבור בין עסקים ללקוחות ובין עסקים לעסקים לפשוט, מהיר ומדויק.
        הפלטפורמה שלנו מציעה מגוון כלים חכמים לעסקים שמחפשים לגדול וללקוחות שמחפשים שירותים ומוצרים בצורה קלה ונוחה.
      </p>
      
      <h2 className="about-section-title">החזון שלנו</h2>
      <p className="about-paragraph">
        בעולם שבו הכל דיגיטלי ומהיר, עסקים קטנים ובינוניים מתקשים להתבלט ולמשוך לקוחות חדשים.
        המטרה שלנו היא לתת לכל עסק, בכל גודל, את הכלים המתקדמים ביותר כדי לנהל, לשווק ולהצליח - בלי כאב ראש מיותר.
      </p>

      <h2 className="about-section-title">איך הכל התחיל</h2>
      <p className="about-paragraph">
        הסיפור של Eshet Asakim התחיל מתוך חוויה אישית. גם אנחנו נתקלנו בקושי למצוא עסקים איכותיים ושירותים אמינים במהירות.
        ובתור עסקים התקשינו למצוא את עצמנו, גם עם אתר משלנו ושיווק, ולכן הבנו את הצורך ב"סניף אינטרנטי" נוסף ושיתופי פעולה עם עסקים נוספים בתחום שלנו.
      </p>

      <h2 className="about-section-title">מה אנחנו מציעים לעסקים</h2>
      <ul className="about-list">
        <li>חנות מקוונת: ניהול מוצרים, מחירים ומלאי בצורה פשוטה.</li>
        <li>תיאום תורים/פגישות: מערכת אוטומטית לניהול יומן ותזכורות ללקוחות.</li>
        <li>שירות לקוחות מתקדם: קבלת הודעות ושיחות מלקוחות ישירות מהאתר.</li>
        <li>קידום ממומן ושיווק חכם: כלים לפרסום ממוקד לפי אזור גיאוגרפי ותחומי עניין.</li>
      </ul>

      <h2 className="about-section-title">למה לבחור בנו?</h2>
      <p className="about-paragraph">
        כל הכלים והצרכים: בתור לקוחות – לקנות, לתאם תור, להזמין שירות ולשלוח הודעות בקלות.
        בתור עסקים – למכור, לקבל לקוחות שמזמינים שירותים אוטומטית, לנהל לקוחות ולשווק את העסק בצורה מתקדמת.
      </p>

      <h2 className="about-section-title">המטרה שלנו</h2>
      <p className="about-paragraph">
        להיות הבית הדיגיטלי לכל עסק בישראל. אנחנו רוצים לאפשר לעסקים להתרכז במה שהם טובים בו,
        ולנווט את השיווק, הניהול והחיבור ללקוחות בצורה קלה ונוחה.
      </p>

      {/* תחתית הדף */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/search">📋 חיפוש עסקים</Link></li>
          <li><Link to="/about">📖 קצת עלינו</Link></li>
          <li><Link to="/how-it-works">⚙️ איך זה עובד</Link></li>
          <li><Link to="/join">✏️ הצטרפות עסקים</Link></li>
          <li><Link to="/faq">❓ שאלות נפוצות</Link></li>
          <li><Link to="/terms">📜 תקנון</Link></li>
          <li><Link to="/contact">📞 יצירת קשר</Link></li>
        </ul>
        <p className="copyright">כל הזכויות שמורות © Eshet Asakim</p>
      </footer>
    </div>
  );
}

export default About;
