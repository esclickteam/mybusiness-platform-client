export type CycloraPageId = "home";

export type CycloraMediaValue =
  | string
  | {
      url?: string;
      src?: string;
      secureUrl?: string;
      secure_url?: string;
      originalUrl?: string;
      type?: "image" | "video" | string;
    };

export type CycloraNavItem = {
  label: string;
  href: string;
};

export type CycloraStrategy = {
  eyebrow: string;
  title: string;
  description: string;
  metric?: string;
};

export type CycloraCase = {
  eyebrow: string;
  title: string;
  category: string;
  year: string;
  image: CycloraMediaValue;
};

export type CycloraTestimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: CycloraMediaValue;
  badge: string;
};

export type CycloraPlan = {
  name: string;
  tag: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  button: string;
  featured?: boolean;
};

export type CycloraFaq = {
  question: string;
  answer: string;
};

export type CycloraData = {
  brand: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
  };
  nav: CycloraNavItem[];
  hero: {
    marquee: string;
    title: string;
    accent: string;
    description: string;
    microcopy: string;
    primaryButton: string;
    secondaryButton: string;
    scrollLabel: string;
    orbitMedia: CycloraMediaValue[];
  };
  strategyProof: {
    text: string;
  };
  strategyHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  strategies: CycloraStrategy[];
  workHeading: {
    eyebrow: string;
    title: string;
    accent: string;
    proofLabel: string;
    proofMeta: string;
  };
  cases: CycloraCase[];
  testimonialHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  testimonials: CycloraTestimonial[];
  pricingHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  plans: CycloraPlan[];
  faqHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  faq: CycloraFaq[];
  cta: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    button: string;
    orbitMedia: CycloraMediaValue[];
  };
  footer: {
    description: string;
    copyright: string;
    links: CycloraNavItem[];
  };
};

export const cycloraPages = [
  {
    id: "home" as CycloraPageId,
    name: "Home",
    slug: "/",
  },
];

const CYRCLO_CDN = "https://cdn.prod.website-files.com/6995302bd78651f6cf0f7066";
const CYRCLO_CASE_CDN = "https://cdn.prod.website-files.com/6995302bd78651f6cf0f7074";

const heroOrbitMedia = [
  `${CYRCLO_CDN}/699d8f5aadcca299c9f13956_image-11.jpg`,
  `${CYRCLO_CDN}/699d8f5a79b39fe03c4a934b_image-07.jpg`,
  `${CYRCLO_CDN}/699d8f5aa277dfdf0f8daed9_image-09.jpg`,
  `${CYRCLO_CDN}/699d8f5a6521ff21d826e4e7_image-02.jpg`,
  `${CYRCLO_CDN}/699d8f5a8d0457bed65ee550_image-10.jpg`,
  `${CYRCLO_CDN}/699d8f5a38a034f4ca02d316_image-01.jpg`,
  `${CYRCLO_CDN}/699d8f5a6574e13fe539a5df_image-06.jpg`,
  `${CYRCLO_CDN}/699d8f5a2614c7892cfac580_image-04.jpg`,
  `${CYRCLO_CDN}/699d8f5a47f0c3fb63aa03eb_image-12.jpg`,
  `${CYRCLO_CDN}/699d8f5a4266f8803498b612_image-08.jpg`,
  `${CYRCLO_CDN}/699d8fddafdd1725142a0b0c_image-05.jpg`,
  `${CYRCLO_CDN}/699d8f5a730cd5081b6f54d6_image-03.jpg`,
];

const ctaOrbitMedia = [
  `${CYRCLO_CDN}/699ee9349bce008bef9bf3f0_image-30.jpg`,
  `${CYRCLO_CDN}/699d92539247266fc53da155_image-14.jpg`,
  `${CYRCLO_CDN}/699ee93437395c9f7f2e5224_image-31.jpg`,
  `${CYRCLO_CDN}/699d92536ac8a708ae138784_image-16.jpg`,
  `${CYRCLO_CDN}/699d92530baa0f117065307f_image-18.jpg`,
  `${CYRCLO_CDN}/699ee9348fbea4c5b28506ca_image-28.jpg`,
  `${CYRCLO_CDN}/699d92532058916cbce65147_image-15.jpg`,
  `${CYRCLO_CDN}/699d92536e4ac4b8bc9fa801_image-19.jpg`,
  `${CYRCLO_CDN}/699d9253860608aaa7dee36a_image-17.jpg`,
  `${CYRCLO_CDN}/699ee934340c72d508f36aa9_image-32.jpg`,
];

const strategyProofAvatars = [
  `${CYRCLO_CDN}/69a03bb8c26bf706fbc6647e_client-01.jpg`,
  `${CYRCLO_CDN}/69a03bb8c26bf706fbc66478_client-03.jpg`,
  `${CYRCLO_CDN}/69a03bb8c26bf706fbc66472_client-02.jpg`,
  `${CYRCLO_CDN}/69a03bb8c26bf706fbc66484_client-04.jpg`,
];

export const cycloraDefaultData: CycloraData = {
  brand: {
    name: "Cyrclo",
    tagline:
      "Elevate your marketing with intelligent analytics, AI-driven strategies, and results that scale.",
    email: "hello@cyrclo.studio",
    phone: "+1 (555) 019-9000",
  },

  nav: [
    { label: "Home", href: "#top" },
    { label: "About", href: "#strategy" },
    { label: "Case Studies", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    marquee: "Marketing,",
    title:
      "An AI-powered marketing experience designed to streamline your strategy, automate workflows, and turn data into real growth.",
    accent: "Reimagined",
    description: "",
    microcopy:
      "✦ Built for the new era of digital marketing, this AI-driven template helps you plan smarter campaigns, personalize every interaction, and optimize performance with real-time insights — so you can focus on scaling what truly matters.",
    primaryButton: "Get Started",
    secondaryButton: "Our Story",
    scrollLabel: "Keep Scrolling",
    orbitMedia: heroOrbitMedia,
  },

  strategyProof: {
    text: "✦ Loved by teams focused on growth.",
  },

  strategyHeading: {
    eyebrow: "Our Solutions",
    title: "Strategies That",
    accent: "Scale",
  },

  strategies: [
    {
      eyebrow: "Workflow Optimization",
      title: "Automation",
      description:
        "Streamline repetitive tasks and launch smarter campaigns with AI-powered automation.",
    },
    {
      eyebrow: "Predictive Insights",
      title: "Analytics",
      description:
        "Turn complex data into clear actions with real-time performance intelligence.",
      metric: "200+ clients trust us • 4.9/5",
    },
    {
      eyebrow: "Growth Planning",
      title: "Strategy",
      description:
        "Build data-backed marketing roadmaps designed for scalable success.",
    },
    {
      eyebrow: "Smart Targeting",
      title: "Advertising",
      description:
        "Optimize ad spend using AI-driven audience segmentation and performance tracking.",
    },
  ],

  workHeading: {
    eyebrow: "Case Studies",
    title: "Growth",
    accent: "In Action",
    proofLabel: "Proven Results©",
    proofMeta: "(2023/26)",
  },

  cases: [
    {
      eyebrow: "Spark · Analytics",
      title: "SparkAnalytics",
      category: "Analytics",
      year: "2026",
      image: `${CYRCLO_CASE_CDN}/69a05303ef8f7ce2a7eb1ff2_case-study-01.jpg`,
    },
    {
      eyebrow: "Vibe · Strategy",
      title: "VibeStrategy",
      category: "Strategy",
      year: "2025",
      image: `${CYRCLO_CASE_CDN}/69a0530cbb9fc4499e5eb5d0_case-study-02.jpg`,
    },
    {
      eyebrow: "Echo · Automation",
      title: "EchoAutomation",
      category: "Automation",
      year: "2024",
      image: `${CYRCLO_CASE_CDN}/69a0531772c9f309e199af6c_case-study-03.jpg`,
    },
    {
      eyebrow: "Lumos · Advertising",
      title: "LumosAdvertising",
      category: "Advertising",
      year: "2023",
      image: `${CYRCLO_CASE_CDN}/69a05334e19527e912ea368a_case-study-04.jpg`,
    },
  ],

  testimonialHeading: {
    eyebrow: "Trusted by Leaders",
    title: "What Our Clients",
    accent: "Say",
  },

  testimonials: [
    {
      quote:
        "Their AI-driven strategy completely transformed our acquisition process. We scaled faster in three months than we did in the entire previous year.",
      name: "Daniel Carter",
      role: "Marketing Director",
      avatar: `${CYRCLO_CDN}/69a1b0a4804b6364e7f2ec92_client-01.jpg`,
      badge: "Impressive",
    },
    {
      quote:
        "From strategy to execution, everything was data-backed and results-focused. The impact was immediate, measurable, and scalable.",
      name: "Sophia Mitchell",
      role: "Growth Manager",
      avatar: `${CYRCLO_CDN}/69a1b0a4a4d06e73717a5944_client-02.jpg`,
      badge: "Unmatched",
    },
    {
      quote:
        "They don't just run campaigns — they build intelligent systems that continuously optimize and improve.",
      name: "Ethan Walker",
      role: "Strategy Director",
      avatar: `${CYRCLO_CDN}/69a1b0a4d2a65f7fa0d82eba_client-03.jpg`,
      badge: "Brilliant",
    },
    {
      quote:
        "A truly forward-thinking team. Their predictive analytics gave us clarity and confidence in every decision.",
      name: "Isabella Reed",
      role: "Chief Marketing Officer",
      avatar: `${CYRCLO_CDN}/69a1b0a42cc5e51d187e2467_client-04.jpg`,
      badge: "Exceptional",
    },
    {
      quote:
        "The level of insight they implemented helped us reduce costs while increasing performance across every campaign.",
      name: "Olivia Bennett",
      role: "Brand Strategist",
      avatar: `${CYRCLO_CDN}/69a1b0a4c50805d5d4474b25_client-05.jpg`,
      badge: "I loved it",
    },
    {
      quote:
        "Our conversion rates increased significantly after implementing their AI-powered personalization approach.",
      name: "Ryan Thompson",
      role: "Head of Digital",
      avatar: `${CYRCLO_CDN}/69a1b0a48cdfca3819046d93_client-06.jpg`,
      badge: "Incredible",
    },
  ],

  pricingHeading: {
    eyebrow: "Invest in Growth",
    title: "Plans Built to",
    accent: "Scale",
  },

  plans: [
    {
      name: "Growth",
      tag: "Scalable",
      price: "$1,500",
      suffix: "/Month",
      description:
        "A powerful plan designed for growing brands ready to accelerate performance with AI-driven marketing strategies.",
      features: [
        "Strategy development and campaign planning",
        "Automation workflows for lead nurturing",
        "Analytics dashboard with real-time insights",
        "Advertising management across key platforms",
        "Optimization continuous A/B testing",
        "Reporting monthly performance breakdown",
      ],
      button: "Get Started",
    },
    {
      name: "Performance",
      tag: "Advanced",
      price: "$3,500",
      suffix: "/month",
      description:
        "An advanced solution for ambitious brands seeking predictive insights, smarter execution, and measurable growth.",
      features: [
        "Predictive AI-powered audience targeting",
        "Personalization dynamic content experiences",
        "Conversion funnel performance optimization",
        "Scaling multi-channel campaign expansion",
        "SEO advanced search intelligence",
        "Support priority strategic consulting",
      ],
      button: "Get Started",
      featured: true,
    },
  ],

  faqHeading: {
    eyebrow: "FAQ",
    title: "Answered",
    accent: "Questions",
  },

  faq: [
    {
      question: "What makes your marketing approach different?",
      answer:
        "We combine AI-driven insights with human strategy to create campaigns that are data-backed, scalable, and performance-focused.",
    },
    {
      question: "How does AI improve campaign performance?",
      answer:
        "AI analyzes user behavior, predicts trends, and continuously optimizes campaigns to maximize conversions and reduce wasted spend.",
    },
    {
      question: "Can your services scale as our business grows?",
      answer:
        "Absolutely. Our AI-powered systems are built to adapt, optimize, and scale alongside your evolving business needs.",
    },
    {
      question: "Do you work with startups or only established brands?",
      answer:
        "We work with both. Our strategies are tailored to each growth stage, from emerging startups to enterprise-level organizations.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Most clients begin seeing measurable improvements within the first 30 to 60 days, depending on goals and market conditions.",
    },
    {
      question: "Do you provide performance reports?",
      answer:
        "Yes, we deliver detailed monthly reports with actionable insights, performance metrics, and strategic recommendations.",
    },
  ],

  cta: {
    eyebrow: "Start Now",
    title: "Let's Drive",
    accent: "Growth",
    description:
      "Accelerate your growth with AI-powered marketing strategies designed to deliver measurable and scalable results.",
    button: "Get Started",
    orbitMedia: ctaOrbitMedia,
  },

  footer: {
    description: "AI-powered marketing for scalable growth.",
    copyright: "© 2026 Cyrclo. All rights reserved.",
    links: [
      { label: "Home", href: "#top" },
      { label: "About", href: "#strategy" },
      { label: "Case Studies", href: "#work" },
      { label: "Services", href: "#strategy" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },
};

export const cycloraStrategyProofAvatars = strategyProofAvatars;
