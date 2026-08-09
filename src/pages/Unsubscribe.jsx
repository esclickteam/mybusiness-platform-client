import React, { useMemo } from "react";
import "../styles/Unsubscribe.css";

const TYPE_LABELS = {
  onboarding: "הודעות ההדרכה",
  marketing: "דיוור שיווקי",
  partnerOffers: "הצעות שותפים",
  taskReminders: "תזכורות משימות",
};

/**
 * Legacy landing for ?status=&type= query redirects.
 * Primary flow now serves Hebrew HTML from GET /api/unsubscribe/:token.
 */
export default function Unsubscribe() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const status = params.get("status"); // success / invalid
  const type = params.get("type") || "onboarding";
  const typeLabel = TYPE_LABELS[type] || "הדיוור";
  const homeUrl = "https://bizuply.com";

  const content = (() => {
    switch (status) {
      case "success":
        return (
          <div className="unsub-card fade" dir="rtl" lang="he">
            <h1>הוסרת בהצלחה</h1>
            <p>
              {type === "onboarding"
                ? "הוסרת בהצלחה מרשימת הודעות ההדרכה של Bizuply."
                : `הוסרת בהצלחה מרשימת ${typeLabel} של Bizuply.`}
              <br />
              עדיין תוכלו לקבל הודעות חשובות על החשבון, חיוב ואבטחה.
            </p>
            <a className="unsub-home-btn" href={homeUrl}>
              חזרה ל-Bizuply
            </a>
          </div>
        );

      case "invalid":
        return (
          <div className="unsub-card fade" dir="rtl" lang="he">
            <h1>קישור לא תקין</h1>
            <p>קישור ההסרה אינו תקין או שפג תוקפו.</p>
            <a className="unsub-home-btn" href={homeUrl}>
              חזרה ל-Bizuply
            </a>
          </div>
        );

      default:
        return (
          <div className="unsub-card fade" dir="rtl" lang="he">
            <h1>בקשה לא תקינה</h1>
            <p>חסרים פרמטרים להסרת דיוור.</p>
            <a className="unsub-home-btn" href={homeUrl}>
              חזרה ל-Bizuply
            </a>
          </div>
        );
    }
  })();

  return (
    <div className="unsub-container" dir="rtl" lang="he">
      {content}
    </div>
  );
}
