// src/components/dashboard/Insights.js
import React from "react";

const Insights = ({ stats }) => {
  if (!stats) return null;

  const goal = 20;
  const currentOrders = stats?.orders_count || 0;
  const lastWeekOrders = stats?.orders_last_week || 0;
  const orderDiff = currentOrders - lastWeekOrders;
  const orderPercent = lastWeekOrders
    ? Math.round((orderDiff / lastWeekOrders) * 100)
    : 100;

  const viewsThisWeek = stats?.views_count || 0;
  const viewsLastWeek = stats?.views_last_week || 0;
  const viewsDiff = viewsThisWeek - viewsLastWeek;
  const viewsPercent = viewsLastWeek
    ? Math.round((viewsDiff / viewsLastWeek) * 100)
    : 100;

  const upcoming = stats?.upcoming_appointments || 0;

  return (
    <div className="insights-container">
      <div className="insight">
        📈 שינוי בצפיות:{" "}
        {viewsDiff >= 0
          ? `עלייה של ${viewsPercent}%`
          : `ירידה של ${Math.abs(viewsPercent)}%`}
      </div>

      <div className="insight">
        📦 שינוי בהזמנות:{" "}
        {orderDiff >= 0
          ? `עלייה של ${orderPercent}%`
          : `ירידה של ${Math.abs(orderPercent)}%`}
      </div>

      <div className="insight">
        🎯 התקדמות ליעד: {currentOrders}/{goal} הזמנות (
        {Math.round((currentOrders / goal) * 100)}%)
      </div>

      <div className="insight">
        📆 {upcoming > 0
          ? `יש ${upcoming} פגישות מתוכננות`
          : "אין פגישות מתוכננות השבוע"}
      </div>
    </div>
  );
};

export default Insights;
