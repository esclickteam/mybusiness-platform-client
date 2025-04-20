import React from "react";
import { Link } from "react-router-dom"; // הסרת Navigate כדי שהדף יהיה ציבורי
import "../../styles/Business.css";

function BusinessJoin() {
  return (
    <div className="business-join-container">
      {/* כותרת מרכזית */}
      <div className="header-section">
        <h1 className="title">הצטרפו לפלטפורמת העסקים המובילה!</h1>
        <p className="subtitle">
          בעלי עסקים בכל התחומים כבר הבינו - כדי להגדיל את ההכנסות ולשפר את החשיפה, צריך להיות במקום הנכון!  
          הפלטפורמה שלנו מאפשרת לך לקבל פניות מלקוחות פוטנציאליים, לנהל הזמנות ולבנות נוכחות דיגיטלית מתקדמת.
        </p>
      </div>

      {/* כרטיסיות מידע */}
      <div className="info-section">
        <div className="info-box purple">
          <h2>למה כדאי להצטרף?</h2>
          <ul>
            <li>✔️ קבלת פניות מלקוחות אמיתיים</li>
            <li>✔️ ניהול חכם של העסק, כולל הזמנות ותיאומי שירות</li>
            <li>✔️ מערכת צ'אט אונליין לקשר מהיר עם לקוחות</li>
            <li>✔️ אפשרות להקים חנות אינטרנטית ושירותים דיגיטליים</li>
            <li>✔️ חשיפה גבוהה באינטרנט וקידום העסק</li>
          </ul>
        </div>

        <div className="info-box white">
          <h2>שיתופי פעולה והזדמנויות עסקיות</h2>
          <ul>
            <li>✔️ התחברו לעסקים משלימים בתחום שלכם</li>
            <li>✔️ קבלו הפניות ישירות מעסקים אחרים</li>
            <li>✔️ שתפו פעולה בפרויקטים משותפים</li>
            <li>✔️ הגדילו את רשת הקשרים שלכם</li>
          </ul>
        </div>

        <div className="info-box purple">
          <h2>למי זה מתאים?</h2>
          <ul>
            <li>✔️ לכל בעל עסק שרוצה לגדול ולהתפתח</li>
            <li>✔️ למי שמעוניין בחשיפה מקסימלית ללקוחות</li>
            <li>✔️ לעסקים המחפשים לקוחות אונליין</li>
            <li>✔️ לאנשי מקצוע שרוצים לקבל יותר פניות</li>
          </ul>
        </div>

        <div className="info-box white">
          <h2>איך זה עובד?</h2>
          <ul>
            <li>✔️ נרשמים ופותחים עמוד עסקי</li>
            <li>✔️ בוחרים את החבילה המתאימה לעסק</li>
            <li>✔️ מתחילים לקבל פניות ולנהל הזמנות</li>
            <li>✔️ נהנים מצ'אט אונליין, קידום ושיתופי פעולה</li>
          </ul>
        </div>
      </div>

      {/* כפתור הצטרפות מודגש */}
      <div className="cta-section">
        <h2>התחילו עכשיו וקבלו יותר לקוחות!</h2>
        <p>כל מה שאתם צריכים זה להירשם, לבחור חבילה וליהנות מחשיפה רחבה.</p>
        <Link to="/plans">
          <button className="join-button"> הצטרפו עכשיו</button>
        </Link>
      </div>

      {/* תחתית העמוד */}
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

export default BusinessJoin;