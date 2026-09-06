import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "whatShows",
  "viewAppointments",
  "notUpdating",
  "calendar",
  "clientsChart",
  "smartTips",
  "wrongData",
  "summary",
  "notRealtime",
  "improve",
];

export default function DashboardFAQ() {
  return <HelpFaqArticle ns="helpFaqs.dashboard" keys={FAQ_KEYS} />;
}
