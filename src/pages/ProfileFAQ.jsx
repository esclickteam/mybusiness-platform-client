import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "tabs",
  "changesNotShowing",
  "editDetails",
  "gallery",
  "categoryLocation",
  "accessIssue",
  "videos",
  "services",
  "contactDetails",
  "uploadSave",
];

export default function ProfileFAQ() {
  return <HelpFaqArticle ns="helpFaqs.profile" keys={FAQ_KEYS} />;
}
