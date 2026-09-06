import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "whatIs",
  "whereAutomations",
  "readyOrFree",
  "allBusinesses",
  "notInList",
  "available247",
  "maximize",
];

export default function BizUplyAdvisorFAQ() {
  return <HelpFaqArticle ns="helpFaqs.advisor" keys={FAQ_KEYS} />;
}
