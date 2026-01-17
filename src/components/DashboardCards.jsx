import React, { useEffect } from "react";
import "./dashboard.cards.css";
import {
  ViewsIcon,
  ReviewsIcon,
  AppointmentsIcon,
} from "./DashboardIcons";

const DashboardCards = React.memo(({ stats = {} }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("DashboardCards received stats:", stats);
    }
  }, [stats]);

  const cards = [
    {
      label: "Profile Views",
      value: stats.views_count ?? 0,
      Icon: ViewsIcon,
      bgColor: "#f0ebff",
      iconColor: "#5b4fd6",
    },
    {
      label: "Reviews",
      value: stats.reviews_count ?? 0,
      Icon: ReviewsIcon,
      bgColor: "#fff7d6",
      iconColor: "#d97706",
    },
    {
      label: "Appointments",
      value: stats.appointments_count ?? 0,
      Icon: AppointmentsIcon,
      bgColor: "#f9f0f7",
      iconColor: "#9333ea",
    },
  ];

  return (
    <div
      className="dashboard-cards-container"
      role="list"
      dir="ltr"
      aria-label="Dashboard Key Metrics"
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="dashboard-card"
          style={{ backgroundColor: card.bgColor }}
          role="listitem"
          aria-label={`${card.label}: ${card.value}`}
        >
          <div
            className="card-icon"
            aria-hidden="true"
            style={{ color: card.iconColor }}
          >
            <card.Icon />
          </div>

          <div className="card-title">{card.label}</div>
          <div className="card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
});

export default DashboardCards;
