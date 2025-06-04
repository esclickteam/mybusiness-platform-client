import React from "react";
import DashboardCards from "./DashboardCards";
import useDashboardSocket from "../hooks/useDashboardSocket";  // הוק לניהול Socket.IO

export default function DashboardLive({ businessId }) {
  // הנחה שקיים token דרך ה-hook useAuth או שניתן להעביר כפרופס
  // כאן אציין שימוש דמיוני ב-token, התאמה לפי הצורך:
  // לדוגמה:
  // const { user } = useAuth();
  // const token = user?.token;
  // אם אין, אפשר להעביר token כפרופס או לאפס

  const token = null; // עדכן לפי ההקשר שלך

  const stats = useDashboardSocket({ token, businessId });

  // אם תרצה, אפשר להוסיף כאן בדיקה שסטטיסטיקות לא ריקות לפני הצגה
  // למשל: if (!stats) return <div>Loading...</div>;

  return <DashboardCards stats={stats || {
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    appointments_count: 0,
    open_leads_count: 0,
  }} />;
}
