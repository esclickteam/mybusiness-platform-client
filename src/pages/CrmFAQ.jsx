import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "getLeads",
  "bookAppointment",
  "whatIsCrm",
  "clientProfile",
  "scheduling",
  "editCancel",
  "services",
  "clientList",
  "dataNotUpdating",
  "analyze",
  "crmVsBooking",
  "errors",
];

export default function CrmFAQ() {
  return <HelpFaqArticle ns="helpFaqs.crm" keys={FAQ_KEYS} />;
}
