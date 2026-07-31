export type WizardMainStep = 1 | 2 | 3;

export type WizardSubStepDef = {
  id: string;
  titleKey: string;
  hintKey: string;
};

export type WizardMainStepDef = {
  main: WizardMainStep;
  titleKey: string;
  subtitleKey: string;
  subs: WizardSubStepDef[];
};

export type WizardFlatStep = {
  main: WizardMainStep;
  subIndex: number;
  id: string;
};

export type WizardPosition = {
  flatIndex: number;
  total: number;
  percent: number;
};

const MAIN1_SUBS: WizardSubStepDef[] = [
  {
    id: "objective",
    titleKey: "metaCampaigns.wizard.sub.objective.title",
    hintKey: "metaCampaigns.wizard.sub.objective.hint",
  },
  {
    id: "details",
    titleKey: "metaCampaigns.wizard.sub.details.title",
    hintKey: "metaCampaigns.wizard.sub.details.hint",
  },
  {
    id: "budget",
    titleKey: "metaCampaigns.wizard.sub.budget.title",
    hintKey: "metaCampaigns.wizard.sub.budget.hint",
  },
  {
    id: "schedule",
    titleKey: "metaCampaigns.wizard.sub.schedule.title",
    hintKey: "metaCampaigns.wizard.sub.schedule.hint",
  },
  {
    id: "review-campaign",
    titleKey: "metaCampaigns.wizard.sub.reviewCampaign.title",
    hintKey: "metaCampaigns.wizard.sub.reviewCampaign.hint",
  },
];

const MAIN2_SUBS: WizardSubStepDef[] = [
  {
    id: "audience-mode",
    titleKey: "metaCampaigns.wizard.sub.audienceMode.title",
    hintKey: "metaCampaigns.wizard.sub.audienceMode.hint",
  },
  {
    id: "locations",
    titleKey: "metaCampaigns.wizard.sub.locations.title",
    hintKey: "metaCampaigns.wizard.sub.locations.hint",
  },
  {
    id: "demographics",
    titleKey: "metaCampaigns.wizard.sub.demographics.title",
    hintKey: "metaCampaigns.wizard.sub.demographics.hint",
  },
  {
    id: "interests",
    titleKey: "metaCampaigns.wizard.sub.interests.title",
    hintKey: "metaCampaigns.wizard.sub.interests.hint",
  },
  {
    id: "placements",
    titleKey: "metaCampaigns.wizard.sub.placements.title",
    hintKey: "metaCampaigns.wizard.sub.placements.hint",
  },
  {
    id: "saved-audiences",
    titleKey: "metaCampaigns.wizard.sub.savedAudiences.title",
    hintKey: "metaCampaigns.wizard.sub.savedAudiences.hint",
  },
];

const MAIN3_LEADS_SUBS: WizardSubStepDef[] = [
  {
    id: "identity",
    titleKey: "metaCampaigns.wizard.sub.identity.title",
    hintKey: "metaCampaigns.wizard.sub.identity.hint",
  },
  {
    id: "lead-form-select",
    titleKey: "metaCampaigns.wizard.sub.leadFormSelect.title",
    hintKey: "metaCampaigns.wizard.sub.leadFormSelect.hint",
  },
  {
    id: "lead-form-setup",
    titleKey: "metaCampaigns.wizard.sub.leadFormSetup.title",
    hintKey: "metaCampaigns.wizard.sub.leadFormSetup.hint",
  },
  {
    id: "lead-form-intro",
    titleKey: "metaCampaigns.wizard.sub.leadFormIntro.title",
    hintKey: "metaCampaigns.wizard.sub.leadFormIntro.hint",
  },
  {
    id: "lead-form-questions",
    titleKey: "metaCampaigns.wizard.sub.leadFormQuestions.title",
    hintKey: "metaCampaigns.wizard.sub.leadFormQuestions.hint",
  },
  {
    id: "lead-form-privacy",
    titleKey: "metaCampaigns.wizard.sub.leadFormPrivacy.title",
    hintKey: "metaCampaigns.wizard.sub.leadFormPrivacy.hint",
  },
  {
    id: "creative-media",
    titleKey: "metaCampaigns.wizard.sub.creativeMedia.title",
    hintKey: "metaCampaigns.wizard.sub.creativeMedia.hint",
  },
  {
    id: "creative-crop",
    titleKey: "metaCampaigns.wizard.sub.creativeCrop.title",
    hintKey: "metaCampaigns.wizard.sub.creativeCrop.hint",
  },
  {
    id: "creative-text",
    titleKey: "metaCampaigns.wizard.sub.creativeText.title",
    hintKey: "metaCampaigns.wizard.sub.creativeText.hint",
  },
  {
    id: "preview-publish",
    titleKey: "metaCampaigns.wizard.sub.previewPublish.title",
    hintKey: "metaCampaigns.wizard.sub.previewPublish.hint",
  },
];

const MAIN3_NON_LEADS_SUBS: WizardSubStepDef[] = [
  {
    id: "identity",
    titleKey: "metaCampaigns.wizard.sub.identity.title",
    hintKey: "metaCampaigns.wizard.sub.identity.hint",
  },
  {
    id: "creative-media",
    titleKey: "metaCampaigns.wizard.sub.creativeMedia.title",
    hintKey: "metaCampaigns.wizard.sub.creativeMedia.hint",
  },
  {
    id: "creative-crop",
    titleKey: "metaCampaigns.wizard.sub.creativeCrop.title",
    hintKey: "metaCampaigns.wizard.sub.creativeCrop.hint",
  },
  {
    id: "creative-text",
    titleKey: "metaCampaigns.wizard.sub.creativeText.title",
    hintKey: "metaCampaigns.wizard.sub.creativeText.hint",
  },
  {
    id: "preview-publish",
    titleKey: "metaCampaigns.wizard.sub.previewPublish.title",
    hintKey: "metaCampaigns.wizard.sub.previewPublish.hint",
  },
];

export function getWizardDefinition(isLeads: boolean): WizardMainStepDef[] {
  return [
    {
      main: 1,
      titleKey: "metaCampaigns.wizard.main.campaign.title",
      subtitleKey: "metaCampaigns.wizard.main.campaign.subtitle",
      subs: MAIN1_SUBS,
    },
    {
      main: 2,
      titleKey: "metaCampaigns.wizard.main.audience.title",
      subtitleKey: "metaCampaigns.wizard.main.audience.subtitle",
      subs: MAIN2_SUBS,
    },
    {
      main: 3,
      titleKey: "metaCampaigns.wizard.main.ad.title",
      subtitleKey: "metaCampaigns.wizard.main.ad.subtitle",
      subs: isLeads ? MAIN3_LEADS_SUBS : MAIN3_NON_LEADS_SUBS,
    },
  ];
}

export function flattenWizardSteps(isLeads: boolean): WizardFlatStep[] {
  const steps: WizardFlatStep[] = [];
  for (const mainDef of getWizardDefinition(isLeads)) {
    mainDef.subs.forEach((sub, subIndex) => {
      steps.push({ main: mainDef.main, subIndex, id: sub.id });
    });
  }
  return steps;
}

export function findWizardIndex(
  main: WizardMainStep,
  subIndex: number,
  isLeads: boolean
): number {
  return flattenWizardSteps(isLeads).findIndex(
    (step) => step.main === main && step.subIndex === subIndex
  );
}

export function getWizardPosition(
  main: WizardMainStep,
  subIndex: number,
  isLeads: boolean
): WizardPosition {
  const flat = flattenWizardSteps(isLeads);
  const flatIndex = findWizardIndex(main, subIndex, isLeads);
  const total = flat.length;
  const safeIndex = flatIndex >= 0 ? flatIndex : 0;
  const percent = total > 1 ? Math.round((safeIndex / (total - 1)) * 100) : 100;
  return { flatIndex: safeIndex, total, percent };
}
