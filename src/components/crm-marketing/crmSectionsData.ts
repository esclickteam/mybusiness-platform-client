export type CrmTopicSection = {
  id: "leads" | "clients" | "appointments";
  titleKey: string;
  textKey: string;
  primary: string;
  secondary: string[];
  accent: string;
};

export const crmTopicSections: CrmTopicSection[] = [
  {
    id: "leads",
    titleKey: "productPages.crm.sectionLeadsTitle",
    textKey: "productPages.crm.sectionLeadsText",
    primary: "/leads1.jpeg",
    secondary: ["/leads2.jpeg", "/leads3.jpeg"],
    accent: "#6d28d9",
  },
  {
    id: "clients",
    titleKey: "productPages.crm.sectionClientsTitle",
    textKey: "productPages.crm.sectionClientsText",
    primary: "/leads4.jpeg",
    secondary: ["/leads5.jpeg"],
    accent: "#2563eb",
  },
  {
    id: "appointments",
    titleKey: "productPages.crm.sectionAppointmentsTitle",
    textKey: "productPages.crm.sectionAppointmentsText",
    primary: "/leads7.jpeg",
    secondary: ["/leads6.jpeg"],
    accent: "#4f46e5",
  },
];
