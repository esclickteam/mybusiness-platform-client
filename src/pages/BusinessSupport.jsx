import React, { useState } from "react";
import "../styles/business-support.css"; // הוספת קובץ ה-CSS לעיצוב הדף

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: '',
    issueDescription: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('הפנייה נשלחה בהצלחה');
  };

  return (
    <div className="support-page">
      <h1>תמיכה לעסקים</h1>

      <section>
        <h2>שאלות נפוצות</h2>
        <p>בכדי לחסוך לך זמן ולספק לך תשובות מיידיות, הנה רשימה של שאלות נפוצות:</p>
        <ul>
          <li><strong>איך מעדכנים את פרופיל העסק?</strong> - עבור לדף "הגדרות פרופיל" בתוך הלוח הבקרה שלך, שם תוכל לעדכן את המידע שלך כגון שם העסק, תיאור, תמונה ועוד.</li>
          <li><strong>איך אני מוסיף עובד לעסק שלי?</strong> - גש לדף "ניהול עובדים" ויתאפשר לך להוסיף עובדים חדשים למערכת. כל עובד יכול להירשם ולהתחיל לעבוד מיד.</li>
          <li><strong>מה לעשות אם אני נתקל בבעיה טכנית?</strong> - אם נתקלת בבעיה טכנית, אתה יכול לפתוח פנייה דרך טופס יצירת הקשר או ליצור קשר ישירות עם צוות התמיכה שלנו.</li>
          <li><strong>איך אני עובר בין חבילות השירות?</strong> - בתפריט ה"הגדרות", תוכל לעדכן את החבילה שלך. קיימת אפשרות לשדרג או להוריד את חבילת השירות בהתאם לצרכים שלך.</li>
        </ul>
      </section>

      <section>
        <h2>צור קשר עם צוות התמיכה</h2>
        <p>נשמח לעזור לך. אנא פנה אלינו דרך טופס יצירת קשר למטה, או בטלפון.</p>
        <form onSubmit={handleSubmit}>
          <label>שמך:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label>תיאור הבעיה:</label>
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleInputChange}
            required
          />

          <button type="submit">שלח פנייה</button>
        </form>
      </section>

      <section>
        <h2>מדריכים וסרטונים</h2>
        <p>תמצא כאן מדריכים וסרטונים שיכולים לעזור לך לנהל את העסק בצורה טובה יותר:</p>
        <ul>
          <li><a href="/guides/update-profile">איך לעדכן את פרופיל העסק</a></li>
          <li><a href="/guides/manage-schedule">איך לנהל את לוח הזמנים של העסק</a></li>
          <li><a href="/guides/manage-customers">איך לנהל את הלקוחות שלך</a></li>
          <li><a href="/guides/understand-reports">איך להבין את הדוחות העסקיים</a></li>
        </ul>
      </section>

      <section>
        <h2>מידע טכני</h2>
        <p>אם אתה נתקל בבעיות טכניות, הנה כמה פתרונות אפשריים:</p>
        <ul>
          <li><strong>הבעיה: לא מצליח להתחבר לחשבון העסק</strong> - יש לוודא שהפרטי ההזדהות נכונים, אם הבעיה נמשכת יש לאפס את הסיסמה דרך דף "שכחת סיסמה".</li>
          <li><strong>הבעיה: התמונות לא נטענות בפרופיל העסק</strong> - אם אתה נתקל בבעיה בהעלאת תמונות, יש לוודא שהתמונות עומדות בדרישות הגודל והפורמט.</li>
          <li><strong>הבעיה: לא מצליח לשלוח הודעות ללקוחות</strong> - במידה ואתה נתקל בבעיות שליחת הודעות, בדוק את חיבור האינטרנט שלך ואת הגדרות ההודעות במערכת.</li>
        </ul>
      </section>

      <section>
        <h2>עדכונים ותחזוקה</h2>
        <p>נעדכן אותך כאן על כל שדרוגים ותחזוקה שמתבצעים על מנת לשפר את חוויית השימוש שלך.</p>
        <ul>
          <li>עדכון חדש בגרסת המערכת: אפשרות להוסיף מספר עובדים בבת אחת</li>
          <li>תחזוקה מתבצעת ביום ראשון, 30 למאי, כל המערכת תהיה לא זמינה למשך שעה.</li>
        </ul>
      </section>
    </div>
  );
}
