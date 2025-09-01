import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../styles/Business.css";

function BusinessJoin() {
  return (
    <div className="business-join-container">
      <Helmet>
        <title>הצטרפות עסקים - שיתופי פעולה, לקוחות וניהול חכם | עסקליק</title>
        <meta
          name="description"
          content="הצטרפו לעסקליק וקבלו פניות מלקוחות אמיתיים, שיתופי פעולה עם עסקים אחרים, וניהול חכם ביומן ו־CRM. כל מה שעסק צריך כדי לגדול במקום אחד."
        />
        <meta
          name="keywords"
          content="הצטרפות עסקים, שיתופי פעולה, פניות מלקוחות, ניהול חכם, CRM, עסקליק"
        />
        <link rel="canonical" href="https://yourdomain.co.il/join" />
      </Helmet>

      {/* כותרת */}
      <div className="header-section">
        <h1 className="title">הצטרפו לפלטפורמת העסקים המובילה!</h1>
        <p className="subtitle">
          בעלי עסקים כבר יודעים – הדרך להגדלת הכנסות וצמיחה אמיתית עוברת
          בשיתופי פעולה, בניהול חכם ובחשיפה ללקוחות חדשים. עסקליק מרכזת את הכל במקום אחד.
        </p>
      </div>

      {/* כרטיסיות */}
      <div className="info-section">
        <div className="info-box purple">
          <h2>למה כדאי להצטרף?</h2>
          <ul>
            <li>עמוד עסקי מקצועי עם יומן חכם ו־CRM לניהול פניות</li>
            <li>מערכת שיתופי פעולה ייחודית להגדלת הכנסות וצמיחה</li>
            <li>כלי AI חכמים לניהול וייעול העסק</li>
            <li>מחיר חודשי קבוע ושקוף, בלי הפתעות</li>
          </ul>
        </div>

        <div className="info-box white">
          <h2>שיתופי פעולה והזדמנויות</h2>
          <ul>
            <li>התחברו לעסקים משלימים בתחום שלכם</li>
            <li>קבלו הפניות ישירות מעסקים אחרים</li>
            <li>שתפו פעולה בפרויקטים חדשים</li>
            <li>בנו רשת קשרים עסקית אמיתית</li>
          </ul>
        </div>

        <div className="info-box purple">
          <h2>למי זה מתאים?</h2>
          <ul>
            <li>לעסקים שרוצים לגדול ולהתפתח</li>
            <li>למי שמעוניין ביותר פניות ושיתופי פעולה</li>
            <li>לעסקים שרוצים חשיפה דיגיטלית רחבה</li>
            <li>לאנשי מקצוע שמחפשים סדר ויעילות</li>
          </ul>
        </div>

        <div className="info-box white">
          <h2>איך זה עובד?</h2>
          <ul>
            <li>נרשמים ובוחרים את החבילה המתאימה</li>
            <li>בונים עמוד עסקי עם צ'אט, יומן וגלריה</li>
            <li>מתחילים לקבל פניות ולבצע שיתופי פעולה</li>
            <li>נהנים מהמערכת החכמה שמקדמת אתכם להצלחה</li>
          </ul>
        </div>
      </div>

      {/* קריאה לפעולה */}
      <div className="cta-section">
        <h2>🚀 התחילו עכשיו – יותר שיתופי פעולה, יותר פניות, פחות בלגן!</h2>
        <p>הצטרפו לעסקליק ותיהנו מכל מה שעסק צריך – במקום אחד.</p>
        <Link to="/register">
          <button className="join-button">✨ 14 יום ניסיון חינם</button>
        </Link>
      </div>

      {/* תחתית */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/about">📖 קצת עלינו</Link></li>
          <li><Link to="/how-it-works">⚙ איך זה עובד</Link></li>
          <li><Link to="/join">✏ הצטרפות עסקים</Link></li>
          <li><Link to="/faq">❓ שאלות נפוצות</Link></li>
          <li><Link to="/terms">📜 תקנון</Link></li>
          <li><Link to="/contact">📞 יצירת קשר</Link></li>
        </ul>
        <p className="copyright">כל הזכויות שמורות © עסקליק</p>
      </footer>
    </div>
  );
}

export default BusinessJoin;
