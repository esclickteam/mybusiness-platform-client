import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";

export const aelineImages = {
  hero:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=90",
  team:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90",
  dashboard:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=90",
  meeting:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=90",
  abstract:
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=90",
};

export const aelineServices = [
  {
    title: "AI Strategy",
    text: "Plan smarter AI adoption with clear priorities, workflows and business impact.",
    number: "01",
  },
  {
    title: "Automation Systems",
    text: "Replace repetitive manual work with connected, intelligent operations.",
    number: "02",
  },
  {
    title: "Data & Insights",
    text: "Turn raw information into dashboards, decisions and measurable growth.",
    number: "03",
  },
];

export const aelinePlans = [
  {
    name: "Starter",
    price: "$2,500",
    text: "For teams starting their AI transformation.",
    items: ["AI readiness audit", "Workflow mapping", "Basic automation plan"],
  },
  {
    name: "Growth",
    price: "$8,500",
    text: "For companies ready to move faster.",
    items: ["Dedicated consultant", "Automation setup", "Analytics dashboard"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    text: "For larger teams with complex systems.",
    items: ["Full AI roadmap", "Custom integrations", "Premium support"],
  },
];

export const aelinePalette = {
  primary: "#111111",
  secondary: "#3dff88",
  accent: "#3dff88",
  background: "#f4f1e9",
  surface: "#ffffff",
  text: "#111111",
  muted: "#6b6b6b",
  dark: "#000000",
};

export const aelineCss = `
[data-template-id="aeline"],
[data-template-id="aeline"] * {
  box-sizing: border-box;
}

[data-template-id="aeline"] {
  background: #f4f1e9;
  color: #111111;
  font-family: Inter, Arial, sans-serif;
}

[data-template-id="aeline"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="aeline"] button,
[data-template-id="aeline"] a {
  cursor: pointer;
}

[data-template-id="aeline"] .aeline-orb {
  animation: aelineFloat 5.5s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-orb-delay {
  animation: aelineFloat 6.5s ease-in-out infinite;
  animation-delay: 0.8s;
}

[data-template-id="aeline"] .aeline-marquee-track {
  animation: aelineMarquee 34s linear infinite;
}

[data-template-id="aeline"] [data-section-kind] {
  scroll-margin-top: 120px;
}

@keyframes aelineFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-18px) rotate(-1deg);
  }
}

@keyframes aelineMarquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
`;

export const aelineSeed: ReadyWebsiteTemplateSeed = {
  id: "aeline",
  name: "Aeline",
  category: "business",
  niche: "AI Consulting",
  layout: "premium-ai-consulting",
  description:
    "תבנית AI consulting מקצועית לעסקי ייעוץ, אוטומציות, דאטה, SaaS ושירותים טכנולוגיים.",
  heroTitle: "Building the future with AI and strategy",
  heroSubtitle:
    "Help organizations unlock growth, efficiency and better decisions through automation, data systems and intelligent consulting.",
  image: aelineImages.hero,
  palette: aelinePalette,
  blocks: [],
};