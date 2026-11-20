import { describe, expect, it } from "vitest";
import { materializeAiSitePlan, type AiSitePlan } from "./materializeAiSitePlan";

const plan: AiSitePlan = {
  siteName: "AURELIA ESTATES",
  hostTemplateKey: "adion",
  domain: "real-estate",
  palette: {
    primary: "#c4a574",
    secondary: "#8c7355",
    accent: "#e6d3b3",
    background: "#0c0b0a",
    text: "#f6f1e8",
  },
  spec: { motion: "cinematic" },
  pages: [
    {
      id: "home",
      title: "בית",
      slug: "",
      type: "home",
      isHome: true,
      sections: [
        { libraryId: "section-ai-header", content: { title: "AURELIA ESTATES" } },
        {
          libraryId: "section-ai-hero",
          content: {
            eyebrow: "נדל״ן יוקרה · דובאי",
            title: "AURELIA ESTATES",
            copy: "ליווי שקט לרכישת נכסי יוקרה בדובאי.",
            primary: "קבעו פגישה",
            secondary: "לנכסים",
            secondaryHref: "/properties",
            image:
              "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80",
          },
        },
        {
          libraryId: "section-ai-properties",
          content: {
            title: "נכסים נבחרים",
            copy: "שלושה נכסים מתוך האוסף.",
            items: [
              {
                name: "Palm Residence",
                area: "Palm Jumeirah",
                price: "AED 18,500,000",
                beds: "5",
                copy: "וילה על קו המים.",
                image:
                  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
              },
            ],
          },
        },
      ],
    },
    {
      id: "about",
      title: "אודות",
      slug: "about",
      type: "about",
      isHome: false,
      sections: [
        { libraryId: "section-ai-header", content: { title: "AURELIA ESTATES" } },
        {
          libraryId: "section-ai-about",
          content: {
            title: "הבית של AURELIA ESTATES",
            copy: "ליווי אישי לנכסים בדובאי.",
            image:
              "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
          },
        },
      ],
    },
    {
      id: "properties",
      title: "נכסים",
      slug: "properties",
      type: "properties",
      isHome: false,
      sections: [
        { libraryId: "section-ai-header", content: { title: "AURELIA ESTATES" } },
        {
          libraryId: "section-ai-properties",
          content: {
            title: "הנכסים",
            filter: "true",
            items: [
              {
                name: "Palm Residence",
                area: "Palm Jumeirah",
                price: "AED 18,500,000",
                beds: "5",
                copy: "וילה על קו המים.",
                image:
                  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "Marina Gate Penthouse",
                area: "Dubai Marina",
                price: "AED 12,400,000",
                beds: "4",
                copy: "פנטהאוז מול הים.",
                image:
                  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
              },
            ],
          },
        },
      ],
    },
    {
      id: "property",
      title: "Palm Residence",
      slug: "property",
      type: "property",
      isHome: false,
      sections: [
        { libraryId: "section-ai-header", content: { title: "AURELIA ESTATES" } },
        {
          libraryId: "section-ai-property",
          content: {
            name: "Palm Residence",
            title: "Palm Residence",
            area: "Palm Jumeirah",
            price: "AED 18,500,000",
            beds: "5",
            baths: "6",
            size: "620 מ״ר",
            copy: "וילה על קו המים עם בריכה פרטית.",
            image:
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
            highlights: ["בריכה פרטית", "נוף לים"],
            gallery: [
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
            ],
            primary: "קבעו פגישה",
          },
        },
      ],
    },
    {
      id: "contact",
      title: "צור קשר",
      slug: "contact",
      type: "contact",
      isHome: false,
      sections: [
        { libraryId: "section-ai-header", content: { title: "AURELIA ESTATES" } },
        {
          libraryId: "section-ai-contact",
          content: {
            title: "שיחה פרטית",
            copy: "ספרו לנו איזו שכונה מעניינת אתכם.",
            cta: "שלחו פנייה",
            address: "דובאי",
          },
        },
      ],
    },
  ],
};

function pageHtml(page: { data?: Record<string, any> }) {
  const elements = page.data?.__insertedElements || {};
  return Object.values(elements)
    .map((element: any) => String(element?.html || ""))
    .join("\n");
}

describe("AI Studio real-estate materialize", () => {
  it("renders Aurelia as five mobile-safe pages without Adion commerce", () => {
    const site = materializeAiSitePlan(plan);
    expect(site.pages.map((page) => page.id)).toEqual([
      "home",
      "about",
      "properties",
      "property",
      "contact",
    ]);
    expect(site.pages.every((page) => (page as { __aiStudioPage?: boolean }).__aiStudioPage)).toBe(
      true,
    );
    const html = site.pages.map(pageHtml).join("\n");
    expect(html).toContain("AURELIA ESTATES");
    expect(html).toContain("Palm Residence");
    expect(html).toContain("@media (max-width:800px)");
    expect(html).toContain("grid-template-columns:1fr");
    expect(html).toContain("animation-timeline:view()");
    expect(html).toContain('type="radio"');
    expect(html).not.toContain("לרכישה");
    expect(html).not.toContain("שעון");
    expect(html).not.toContain("תכשיט");
  });
});
