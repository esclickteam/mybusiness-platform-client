import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "getHelp",
  "resetPassword",
  "notifications",
  "noUpdates",
  "clearCache",
  "slowSite",
  "myProblemOrSystem",
  "oldBrowsers",
  "accountSecurity",
  "recoverAccount",
];

export default function TechnicalSupport() {
  return <HelpFaqArticle ns="helpFaqs.technical" keys={FAQ_KEYS} />;
}
