import React from "react";
import HelpFaqArticle from "./HelpFaqArticle";

const FAQ_KEYS = [
  "whatAre",
  "whereManage",
  "whichTools",
  "dataSecurity",
  "permissions",
  "changeImpact",
  "somethingWrong",
  "autoUpdates",
];

export default function SystemSettings() {
  return <HelpFaqArticle ns="settings.system" keys={FAQ_KEYS} subtitleKey="subtitle" />;
}
