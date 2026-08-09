import type { TFunction } from "i18next";
import type { MarketingFaq, MarketingStat } from "../product-marketing";

export function getAutomationsHeroStats(t: TFunction): MarketingStat[] {
  return [
    { value: 4, label: t("automationsPage.stats.processTypesLabel") },
    { value: 1, label: t("automationsPage.stats.leadPipelineLabel") },
    {
      value: 15,
      suffix: t("automationsPage.stats.schedulingSuffix"),
      label: t("automationsPage.stats.schedulingLabel"),
    },
    {
      value: 24,
      suffix: t("automationsPage.stats.monitoringSuffix"),
      label: t("automationsPage.stats.monitoringLabel"),
    },
  ];
}

export type FlowStep = {
  title: string;
  text: string;
  tags: string[];
};

export function getAutomationsSteps(t: TFunction): FlowStep[] {
  return [
    {
      title: t("automationsPage.steps.step1.title"),
      text: t("automationsPage.steps.step1.text"),
      tags: [
        t("automationsPage.steps.step1.tag1"),
        t("automationsPage.steps.step1.tag2"),
        t("automationsPage.steps.step1.tag3"),
      ],
    },
    {
      title: t("automationsPage.steps.step2.title"),
      text: t("automationsPage.steps.step2.text"),
      tags: [
        t("automationsPage.steps.step2.tag1"),
        t("automationsPage.steps.step2.tag2"),
        t("automationsPage.steps.step2.tag3"),
      ],
    },
    {
      title: t("automationsPage.steps.step3.title"),
      text: t("automationsPage.steps.step3.text"),
      tags: [
        t("automationsPage.steps.step3.tag1"),
        t("automationsPage.steps.step3.tag2"),
        t("automationsPage.steps.step3.tag3"),
      ],
    },
    {
      title: t("automationsPage.steps.step4.title"),
      text: t("automationsPage.steps.step4.text"),
      tags: [
        t("automationsPage.steps.step4.tag1"),
        t("automationsPage.steps.step4.tag2"),
        t("automationsPage.steps.step4.tag3"),
      ],
    },
  ];
}

export function getAutomationsModules(t: TFunction) {
  return [
    {
      accent: "#7c3aed",
      title: t("automationsPage.modules.module1.title"),
      text: t("automationsPage.modules.module1.text"),
      tags: [
        t("automationsPage.modules.module1.tag1"),
        t("automationsPage.modules.module1.tag2"),
        t("automationsPage.modules.module1.tag3"),
      ],
    },
    {
      accent: "#2563eb",
      title: t("automationsPage.modules.module2.title"),
      text: t("automationsPage.modules.module2.text"),
      tags: [
        t("automationsPage.modules.module2.tag1"),
        t("automationsPage.modules.module2.tag2"),
      ],
    },
    {
      accent: "#0891b2",
      title: t("automationsPage.modules.module3.title"),
      text: t("automationsPage.modules.module3.text"),
      tags: [
        t("automationsPage.modules.module3.tag1"),
        t("automationsPage.modules.module3.tag2"),
      ],
    },
    {
      accent: "#059669",
      title: t("automationsPage.modules.module4.title"),
      text: t("automationsPage.modules.module4.text"),
      tags: [
        t("automationsPage.modules.module4.tag1"),
        t("automationsPage.modules.module4.tag2"),
        t("automationsPage.modules.module4.tag3"),
      ],
    },
    {
      accent: "#e11d8c",
      title: t("automationsPage.modules.module5.title"),
      text: t("automationsPage.modules.module5.text"),
      tags: [
        t("automationsPage.modules.module5.tag1"),
        t("automationsPage.modules.module5.tag2"),
      ],
    },
    {
      accent: "#f59e0b",
      title: t("automationsPage.modules.module6.title"),
      text: t("automationsPage.modules.module6.text"),
      tags: [
        t("automationsPage.modules.module6.tag1"),
        t("automationsPage.modules.module6.tag2"),
      ],
    },
  ];
}

export function getAutomationRecipes(t: TFunction) {
  return [
    {
      title: t("automationsPage.recipes.recipe1.title"),
      text: t("automationsPage.recipes.recipe1.text"),
      trigger: t("automationsPage.recipes.recipe1.trigger"),
      action: t("automationsPage.recipes.recipe1.action"),
    },
    {
      title: t("automationsPage.recipes.recipe2.title"),
      text: t("automationsPage.recipes.recipe2.text"),
      trigger: t("automationsPage.recipes.recipe2.trigger"),
      action: t("automationsPage.recipes.recipe2.action"),
    },
    {
      title: t("automationsPage.recipes.recipe3.title"),
      text: t("automationsPage.recipes.recipe3.text"),
      trigger: t("automationsPage.recipes.recipe3.trigger"),
      action: t("automationsPage.recipes.recipe3.action"),
    },
  ];
}

export function getAutomationsRail(t: TFunction): string[] {
  return [
    t("automationsPage.rail.item1"),
    t("automationsPage.rail.item2"),
    t("automationsPage.rail.item3"),
    t("automationsPage.rail.item4"),
  ];
}

export function getAutomationsFaq(t: TFunction): MarketingFaq[] {
  return [
    {
      q: t("automationsPage.faq.faq1.q"),
      a: t("automationsPage.faq.faq1.a"),
    },
    {
      q: t("automationsPage.faq.faq2.q"),
      a: t("automationsPage.faq.faq2.a"),
    },
    {
      q: t("automationsPage.faq.faq3.q"),
      a: t("automationsPage.faq.faq3.a"),
    },
    {
      q: t("automationsPage.faq.faq4.q"),
      a: t("automationsPage.faq.faq4.a"),
    },
    {
      q: t("automationsPage.faq.faq5.q"),
      a: t("automationsPage.faq.faq5.a"),
    },
    {
      q: t("automationsPage.faq.faq6.q"),
      a: t("automationsPage.faq.faq6.a"),
    },
  ];
}
