import React from "react";
import DashboardCards from "./DashboardCards";
// במקום useDashboardSocket – נייבא את ה־hook מתוך הקונטקסט
import { useDashboardStats } from "../context/DashboardSocketContext";

export default function DashboardLive() {
  // בהנחה שה־Provider ממילא כבר הוזן במקום גבוה יותר
  // ואין צורך לקבל token או להקים socket כאן
  const stats = useDashboardStats();

  // אם stats עדיין לא הגיע (null/undefined), אפשר להציג ערכים ברירת-מחדל
  const safeStats = stats || {
    views_count: 0,
    requests_count: 0,
    orders_count: 0,
    reviews_count: 0,
    messages_count: 0,
    appointments_count: 0,
    open_leads_count: 0,
  };

  return <DashboardCards stats={safeStats} />;
}
