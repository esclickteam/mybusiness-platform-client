const dashboardDemoInsights = [
  {
    id: "followup_needed",
    type: "followup",
    title: "Follow up needed",
    description:
      "You sent messages to clients more than 48 hours ago and they haven’t replied yet.",
    actionLabel: "Send follow-up",
    priority: "high",
    meta: {
      conversations: ["demo-conv-1", "demo-conv-2"],
      stateHash: "demo_followup_2",
    },
  },

  {
    id: "upcoming_appointments",
    type: "schedule",
    title: "Busy week ahead",
    description:
      "You have multiple appointments scheduled in the next few days. Make sure everything is prepared.",
    actionLabel: "View calendar",
    priority: "medium",
  },

  {
    id: "clients_without_appointments",
    type: "revenue",
    title: "Clients haven’t booked yet",
    description:
      "Some clients were added recently but still don’t have an upcoming appointment.",
    actionLabel: "Invite to book",
    priority: "medium",
  },
];

export default dashboardDemoInsights;
