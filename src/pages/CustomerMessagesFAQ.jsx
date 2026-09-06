import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "viewMessages",
  "sendNew",
  "notSent",
  "readReceipt",
  "historical",
  "notUpdating",
  "sendFiles",
  "mistaken",
  "listNotLoad",
  "multiple",
];

export default function CustomerMessagesFAQ() {
  return <HelpFaqArticle ns="helpFaqs.customerMessages" keys={FAQ_KEYS} />;
}
