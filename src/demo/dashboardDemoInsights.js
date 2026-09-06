import i18n from "../i18n/i18n";

export function getDashboardDemoInsights() {
  return [
    {
      id: "followup_needed",
      type: "followup",
      title: i18n.t("leftover.insights.followTitle", "Customers need a follow-up"),
      description: i18n.t(
        "leftover.insights.followDesc",
        "You sent messages more than 48 hours ago and still have no reply."
      ),
      actionLabel: i18n.t("leftover.insights.followAction", "Send a follow-up"),
      priority: "high",
      metric: {
        value: 2,
        label: i18n.t("leftover.insights.conversations", "Conversations"),
      },
      meta: {
        conversations: ["demo-conv-1", "demo-conv-2"],
        stateHash: "demo_followup_2",
      },
    },
    {
      id: "untreated_leads",
      type: "leads",
      title: i18n.t("leftover.insights.leadsTitle", "Some leads are still untreated"),
      description: i18n.t(
        "leftover.insights.leadsDesc",
        "New leads are waiting in the CRM — it is worth contacting them soon."
      ),
      actionLabel: i18n.t("leftover.insights.leadsAction", "View leads"),
      priority: "high",
      metric: {
        value: 3,
        label: i18n.t("leftover.insights.newLeads", "New leads"),
      },
      meta: {
        stateHash: "demo_leads_3",
      },
    },
    {
      id: "clients_without_appointments",
      type: "revenue",
      title: i18n.t("leftover.insights.aptTitle", "Customers who have not booked yet"),
      description: i18n.t(
        "leftover.insights.aptDesc",
        "Some recently added customers still have no upcoming appointment."
      ),
      actionLabel: i18n.t("leftover.insights.aptAction", "Invite them to book"),
      priority: "medium",
    },
    {
      id: "no_published_website",
      type: "website",
      title: i18n.t("leftover.insights.siteTitle", "Publish your website"),
      description: i18n.t(
        "leftover.insights.siteDesc",
        "There is still no published website — building one helps get leads and show the business."
      ),
      actionLabel: i18n.t("leftover.insights.siteAction", "Build a website"),
      priority: "medium",
    },
    {
      id: "missing_seo",
      type: "seo",
      title: i18n.t("leftover.insights.seoTitle", "Finish SEO settings"),
      description: i18n.t(
        "leftover.insights.seoDesc",
        'The site "My website" is missing SEO settings — title, description, or a share image.'
      ),
      actionLabel: i18n.t("leftover.insights.seoAction", "Edit SEO"),
      priority: "medium",
      meta: {
        siteId: "demo-site-id",
        stateHash: "demo_missing_seo",
      },
    },
  ];
}

const dashboardDemoInsights = getDashboardDemoInsights();

export default dashboardDemoInsights;
