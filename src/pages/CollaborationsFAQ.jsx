import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "whatIs",
  "publish",
  "choosePartner",
  "manageWell",
  "received",
  "sent",
  "expiry",
  "cannotSend",
  "communicate",
  "disputes",
];

export default function CollaborationsFAQ() {
  return <HelpFaqArticle ns="helpFaqs.collaborations" keys={FAQ_KEYS} />;
}
