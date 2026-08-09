import type { MarketingFaq, MarketingStat } from "../product-marketing";

type TFunc = (key: string) => string;

export function getAgentsHeroStats(t: TFunc): MarketingStat[] {
  return [
    { value: 1, label: t("agentsPage.heroStats.crm") },
    { value: 3, label: t("agentsPage.heroStats.layers") },
    { value: 100, suffix: "%", label: t("agentsPage.heroStats.docs") },
    { value: 1, label: t("agentsPage.heroStats.pipeline") },
  ];
}

export type FlowStep = {
  title: string;
  text: string;
  tags: string[];
};

export function getAgentsSteps(t: TFunc): FlowStep[] {
  return [
    {
      title: t("agentsPage.steps.define.title"),
      text: t("agentsPage.steps.define.text"),
      tags: [
        t("agentsPage.steps.define.tags.0"),
        t("agentsPage.steps.define.tags.1"),
        t("agentsPage.steps.define.tags.2"),
      ],
    },
    {
      title: t("agentsPage.steps.connect.title"),
      text: t("agentsPage.steps.connect.text"),
      tags: [
        t("agentsPage.steps.connect.tags.0"),
        t("agentsPage.steps.connect.tags.1"),
        t("agentsPage.steps.connect.tags.2"),
      ],
    },
    {
      title: t("agentsPage.steps.handle.title"),
      text: t("agentsPage.steps.handle.text"),
      tags: [
        t("agentsPage.steps.handle.tags.0"),
        t("agentsPage.steps.handle.tags.1"),
        t("agentsPage.steps.handle.tags.2"),
      ],
    },
    {
      title: t("agentsPage.steps.measure.title"),
      text: t("agentsPage.steps.measure.text"),
      tags: [
        t("agentsPage.steps.measure.tags.0"),
        t("agentsPage.steps.measure.tags.1"),
        t("agentsPage.steps.measure.tags.2"),
      ],
    },
  ];
}

export type AgentModule = {
  accent: string;
  title: string;
  text: string;
  tags: string[];
};

export function getAgentsModules(t: TFunc): AgentModule[] {
  return [
    {
      accent: "#7c3aed",
      title: t("agentsPage.modules.leads.title"),
      text: t("agentsPage.modules.leads.text"),
      tags: [
        t("agentsPage.modules.leads.tags.0"),
        t("agentsPage.modules.leads.tags.1"),
        t("agentsPage.modules.leads.tags.2"),
      ],
    },
    {
      accent: "#2563eb",
      title: t("agentsPage.modules.meetings.title"),
      text: t("agentsPage.modules.meetings.text"),
      tags: [
        t("agentsPage.modules.meetings.tags.0"),
        t("agentsPage.modules.meetings.tags.1"),
        t("agentsPage.modules.meetings.tags.2"),
      ],
    },
    {
      accent: "#0891b2",
      title: t("agentsPage.modules.details.title"),
      text: t("agentsPage.modules.details.text"),
      tags: [
        t("agentsPage.modules.details.tags.0"),
        t("agentsPage.modules.details.tags.1"),
        t("agentsPage.modules.details.tags.2"),
      ],
    },
    {
      accent: "#059669",
      title: t("agentsPage.modules.transparency.title"),
      text: t("agentsPage.modules.transparency.text"),
      tags: [
        t("agentsPage.modules.transparency.tags.0"),
        t("agentsPage.modules.transparency.tags.1"),
        t("agentsPage.modules.transparency.tags.2"),
      ],
    },
    {
      accent: "#e11d8c",
      title: t("agentsPage.modules.partnerships.title"),
      text: t("agentsPage.modules.partnerships.text"),
      tags: [
        t("agentsPage.modules.partnerships.tags.0"),
        t("agentsPage.modules.partnerships.tags.1"),
        t("agentsPage.modules.partnerships.tags.2"),
      ],
    },
    {
      accent: "#f59e0b",
      title: t("agentsPage.modules.boost.title"),
      text: t("agentsPage.modules.boost.text"),
      tags: [
        t("agentsPage.modules.boost.tags.0"),
        t("agentsPage.modules.boost.tags.1"),
        t("agentsPage.modules.boost.tags.2"),
      ],
    },
  ];
}

export type AgentService = {
  title: string;
  text: string;
  tags: string[];
};

export function getAgentsServices(t: TFunc): AgentService[] {
  return [
    {
      title: t("agentsPage.services.qualify.title"),
      text: t("agentsPage.services.qualify.text"),
      tags: [
        t("agentsPage.services.qualify.tags.0"),
        t("agentsPage.services.qualify.tags.1"),
        t("agentsPage.services.qualify.tags.2"),
      ],
    },
    {
      title: t("agentsPage.services.followup.title"),
      text: t("agentsPage.services.followup.text"),
      tags: [
        t("agentsPage.services.followup.tags.0"),
        t("agentsPage.services.followup.tags.1"),
        t("agentsPage.services.followup.tags.2"),
      ],
    },
    {
      title: t("agentsPage.services.partnerships.title"),
      text: t("agentsPage.services.partnerships.text"),
      tags: [
        t("agentsPage.services.partnerships.tags.0"),
        t("agentsPage.services.partnerships.tags.1"),
        t("agentsPage.services.partnerships.tags.2"),
      ],
    },
  ];
}

export function getAgentsRail(t: TFunc): string[] {
  return [
    t("agentsPage.rail.items.0"),
    t("agentsPage.rail.items.1"),
    t("agentsPage.rail.items.2"),
    t("agentsPage.rail.items.3"),
  ];
}

export function getAgentsFaq(t: TFunc): MarketingFaq[] {
  return [
    {
      q: t("agentsPage.faq.items.0.q"),
      a: t("agentsPage.faq.items.0.a"),
    },
    {
      q: t("agentsPage.faq.items.1.q"),
      a: t("agentsPage.faq.items.1.a"),
    },
    {
      q: t("agentsPage.faq.items.2.q"),
      a: t("agentsPage.faq.items.2.a"),
    },
    {
      q: t("agentsPage.faq.items.3.q"),
      a: t("agentsPage.faq.items.3.a"),
    },
    {
      q: t("agentsPage.faq.items.4.q"),
      a: t("agentsPage.faq.items.4.a"),
    },
    {
      q: t("agentsPage.faq.items.5.q"),
      a: t("agentsPage.faq.items.5.a"),
    },
  ];
}
