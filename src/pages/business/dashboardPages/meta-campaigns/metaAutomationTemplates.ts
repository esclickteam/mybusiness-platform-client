export type AutomationTemplateId =
  | "ALERT_HIGH_CPL"
  | "PAUSE_LOW_CTR"
  | "SCALE_BELOW_CPL"
  | "ALERT_FREQUENCY";

export const AUTOMATION_TEMPLATES: Array<{
  id: AutomationTemplateId;
  nameKey: string;
  payload: {
    name: string;
    scope: string;
    metric: string;
    operator: string;
    threshold: string;
    window: string;
    action: string;
    mode: string;
    minImpressions: string;
    minResults: string;
  };
}> = [
  {
    id: "ALERT_HIGH_CPL",
    nameKey: "metaCampaigns.ux.templateCplHigh",
    payload: {
      name: "Alert when CPL is too high",
      scope: "CAMPAIGN",
      metric: "costPerResult",
      operator: "GT",
      threshold: "25",
      window: "LAST_7D",
      action: "NOTIFY",
      mode: "RECOMMEND",
      minImpressions: "200",
      minResults: "3",
    },
  },
  {
    id: "PAUSE_LOW_CTR",
    nameKey: "metaCampaigns.ux.templateCtrDrop",
    payload: {
      name: "Pause ad if CTR drops",
      scope: "AD",
      metric: "ctr",
      operator: "LT",
      threshold: "0.8",
      window: "LAST_3D",
      action: "PAUSE_AD",
      mode: "RECOMMEND",
      minImpressions: "500",
      minResults: "0",
    },
  },
  {
    id: "SCALE_BELOW_CPL",
    nameKey: "metaCampaigns.ux.templateScale",
    payload: {
      name: "Suggest scaling when CPL is below target",
      scope: "CAMPAIGN",
      metric: "costPerResult",
      operator: "LT",
      threshold: "25",
      window: "LAST_7D",
      action: "CREATE_RECOMMENDATION",
      mode: "RECOMMEND",
      minImpressions: "200",
      minResults: "5",
    },
  },
  {
    id: "ALERT_FREQUENCY",
    nameKey: "metaCampaigns.ux.templateFrequency",
    payload: {
      name: "Alert when frequency is too high",
      scope: "AD",
      metric: "frequency",
      operator: "GT",
      threshold: "3",
      window: "LAST_7D",
      action: "NOTIFY",
      mode: "RECOMMEND",
      minImpressions: "1000",
      minResults: "0",
    },
  },
];
