import type { TFunction } from "i18next";
import type { MarketingFaq, MarketingStat } from "../product-marketing";

export function getCollaborationsHeroStats(t: TFunction): MarketingStat[] {
  return [
    { value: 4, label: t("collabPage.heroStats.tabs") },
    { value: 1, label: t("collabPage.heroStats.marketplace") },
    { value: 3, label: t("collabPage.heroStats.statuses") },
    { value: 24, suffix: "/7", label: t("collabPage.heroStats.chat") },
  ];
}

export type FlowStep = {
  title: string;
  text: string;
  tags: string[];
};

export function getCollaborationsSteps(t: TFunction): FlowStep[] {
  return [
    {
      title: t("collabPage.steps.step1.title"),
      text: t("collabPage.steps.step1.text"),
      tags: [
        t("collabPage.steps.step1.tag1"),
        t("collabPage.steps.step1.tag2"),
        t("collabPage.steps.step1.tag3"),
      ],
    },
    {
      title: t("collabPage.steps.step2.title"),
      text: t("collabPage.steps.step2.text"),
      tags: [
        t("collabPage.steps.step2.tag1"),
        t("collabPage.steps.step2.tag2"),
        t("collabPage.steps.step2.tag3"),
      ],
    },
    {
      title: t("collabPage.steps.step3.title"),
      text: t("collabPage.steps.step3.text"),
      tags: [
        t("collabPage.steps.step3.tag1"),
        t("collabPage.steps.step3.tag2"),
        t("collabPage.steps.step3.tag3"),
      ],
    },
    {
      title: t("collabPage.steps.step4.title"),
      text: t("collabPage.steps.step4.text"),
      tags: [
        t("collabPage.steps.step4.tag1"),
        t("collabPage.steps.step4.tag2"),
        t("collabPage.steps.step4.tag3"),
      ],
    },
  ];
}

export type CollaborationModule = {
  accent: string;
  title: string;
  text: string;
  tags: string[];
};

export function getCollaborationsModules(t: TFunction): CollaborationModule[] {
  return [
    {
      accent: "#7c3aed",
      title: t("collabPage.modules.card1.title"),
      text: t("collabPage.modules.card1.text"),
      tags: [
        t("collabPage.modules.card1.tag1"),
        t("collabPage.modules.card1.tag2"),
        t("collabPage.modules.card1.tag3"),
      ],
    },
    {
      accent: "#2563eb",
      title: t("collabPage.modules.card2.title"),
      text: t("collabPage.modules.card2.text"),
      tags: [
        t("collabPage.modules.card2.tag1"),
        t("collabPage.modules.card2.tag2"),
        t("collabPage.modules.card2.tag3"),
      ],
    },
    {
      accent: "#0891b2",
      title: t("collabPage.modules.card3.title"),
      text: t("collabPage.modules.card3.text"),
      tags: [
        t("collabPage.modules.card3.tag1"),
        t("collabPage.modules.card3.tag2"),
        t("collabPage.modules.card3.tag3"),
      ],
    },
    {
      accent: "#059669",
      title: t("collabPage.modules.card4.title"),
      text: t("collabPage.modules.card4.text"),
      tags: [
        t("collabPage.modules.card4.tag1"),
        t("collabPage.modules.card4.tag2"),
        t("collabPage.modules.card4.tag3"),
      ],
    },
    {
      accent: "#e11d8c",
      title: t("collabPage.modules.card5.title"),
      text: t("collabPage.modules.card5.text"),
      tags: [
        t("collabPage.modules.card5.tag1"),
        t("collabPage.modules.card5.tag2"),
        t("collabPage.modules.card5.tag3"),
      ],
    },
    {
      accent: "#f59e0b",
      title: t("collabPage.modules.card6.title"),
      text: t("collabPage.modules.card6.text"),
      tags: [
        t("collabPage.modules.card6.tag1"),
        t("collabPage.modules.card6.tag2"),
        t("collabPage.modules.card6.tag3"),
      ],
    },
  ];
}

export function getCollaborationsRail(t: TFunction): string[] {
  return [
    t("collabPage.rail.profile"),
    t("collabPage.rail.findPartner"),
    t("collabPage.rail.messages"),
    t("collabPage.rail.market"),
    t("collabPage.rail.proposals"),
  ];
}

export function getCollaborationsFaq(t: TFunction): MarketingFaq[] {
  return [
    { q: t("collabPage.faq.q1"), a: t("collabPage.faq.a1") },
    { q: t("collabPage.faq.q2"), a: t("collabPage.faq.a2") },
    { q: t("collabPage.faq.q3"), a: t("collabPage.faq.a3") },
    { q: t("collabPage.faq.q4"), a: t("collabPage.faq.a4") },
    { q: t("collabPage.faq.q5"), a: t("collabPage.faq.a5") },
    { q: t("collabPage.faq.q6"), a: t("collabPage.faq.a6") },
  ];
}
