export type CrmTopicSection = {
  id: "leads" | "clients" | "appointments";
  titleKey: string;
  textKey: string;
  primary: string;
  gallery: Array<{
    src: string;
    frame: "wide" | "phone";
  }>;
  accent: string;
};

export const crmTopicSections: CrmTopicSection[] = [
  {
    id: "leads",
    titleKey: "productPages.crm.sectionLeadsTitle",
    textKey: "productPages.crm.sectionLeadsText",
    primary: "/leads1.jpeg",
    gallery: [
      { src: "/leads2.jpeg", frame: "wide" },
      { src: "/leads3.jpeg", frame: "phone" },
    ],
    accent: "#6d28d9",
  },
  {
    id: "clients",
    titleKey: "productPages.crm.sectionClientsTitle",
    textKey: "productPages.crm.sectionClientsText",
    primary: "/leads4.jpeg",
    gallery: [{ src: "/leads5.jpeg", frame: "wide" }],
    accent: "#2563eb",
  },
  {
    id: "appointments",
    titleKey: "productPages.crm.sectionAppointmentsTitle",
    textKey: "productPages.crm.sectionAppointmentsText",
    primary: "/leads7.jpeg",
    gallery: [{ src: "/leads6.jpeg", frame: "wide" }],
    accent: "#4f46e5",
  },
];
