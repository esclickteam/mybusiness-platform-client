import React from "react";

const Insights = ({ stats }) => {
  if (!stats) return null;

  const goal = 20;
  const currentOrders = stats?.orders_count || 0;
  const lastWeekOrders = stats?.orders_last_week || 0;
  const orderDiff = currentOrders - lastWeekOrders;
  const orderPercent =
    lastWeekOrders > 0 ? Math.round((orderDiff / lastWeekOrders) * 100) : currentOrders > 0 ? 100 : 0;

  const viewsThisWeek = stats?.views_count || 0;
  const viewsLastWeek = stats?.views_last_week || 0;
  const viewsDiff = viewsThisWeek - viewsLastWeek;
  const viewsPercent =
    viewsLastWeek > 0 ? Math.round((viewsDiff / viewsLastWeek) * 100) : viewsThisWeek > 0 ? 100 : 0;

  const upcoming = stats?.upcoming_appointments || 0;
  const progressPercent = goal > 0 ? Math.round((currentOrders / goal) * 100) : 0;

  const changeColor = (diff) => {
    if (diff === 0) return "gray";
    return diff > 0 ? "green" : "red";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "1.1rem" }}>
      <div title="שינוי בצפיות לעומת שבוע שעבר" style={{ color: changeColor(viewsDiff) }}>
        📈 שינוי בצפיות:{" "}
        {viewsDiff === 0
          ? "אין שינוי"
          : viewsDiff > 0
          ? `עלייה של ${viewsPercent}%`
          : `ירידה של ${Math.abs(viewsPercent)}%`}
      </div>

      <div title="שינוי בהזמנות לעומת שבוע שעבר" style={{ color: changeColor(orderDiff) }}>
        📦 שינוי בהזמנות:{" "}
        {orderDiff === 0
          ? "אין שינוי"
          : orderDiff > 0
          ? `עלייה של ${orderPercent}%`
          : `ירידה של ${Math.abs(orderPercent)}%`}
      </div>

      <div>
        🎯 התקדמות ליעד: {currentOrders}/{goal} הזמנות ({progressPercent}%)
      </div>

      <div>
        📆 {upcoming > 0 ? `יש ${upcoming} פגישות מתוכננות` : "אין פגישות מתוכננות השבוע"}
      </div>
    </div>
  );
};

export default Insights;
