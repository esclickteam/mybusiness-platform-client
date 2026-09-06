import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "notLoading",
  "server500",
  "cannotLogin",
  "filesNotLoading",
  "autoLogout",
  "reportBugs",
  "accountBlocked",
  "blankScreen",
  "timeout",
];

export default function TroubleshootingSupport() {
  return <HelpFaqArticle ns="helpFaqs.troubleshooting" keys={FAQ_KEYS} />;
}
