export const nadlanistDefaultData = {
  templateId: "nadlanist",
  name: "Nadlanist",
  title: "Nadlanist",

  brand: {
    name: "Nadlanist",
    logo: "ND",
    tagline: "Real Estate Advisor",
  },

  navigation: [
    { id: "home", label: "Home", page: "home", href: "/" },
    { id: "about", label: "About", page: "about", href: "/about" },
    {
      id: "properties",
      label: "Properties",
      page: "properties",
      href: "/properties",
    },
    { id: "services", label: "Services", page: "services", href: "/services" },
    { id: "blog", label: "Blog", page: "blog", href: "/blog" },
    { id: "contact", label: "Contact", page: "contact", href: "/contact" },
  ],

  marquee: [
    "Luxury Homes",
    "Private Viewings",
    "Buyer Advisory",
    "Seller Strategy",
    "No Public Prices",
    "Market Guidance",
  ],

  images: {
    hero:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    heroAlt:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    portrait:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=85",
    office:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
  },

  hero: {
    chips: ["Luxury", "Urban", "Private", "Advisor", "Homes", "Strategy"],
    title: "Real Estate Done Personally",
    subtitle:
      "A premium real estate advisor experience for buyers, sellers and property owners who want clarity, discretion and a strong negotiation strategy.",
    primaryButton: "View Properties",
    secondaryButton: "Book Consultation",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    imageTitle: "Private real estate advisory",
    badge: "Trusted Advisor",
    statNumber: "120+",
    statLabel: "Clients Guided",
    floatingLabel: "Book Tour",
  },

  partners: {
    eyebrow: "Trusted Network",
    items: [
      "Architects",
      "Lawyers",
      "Mortgage",
      "Designers",
      "Appraisers",
      "Investors",
    ],
  },

  manifesto: {
    title: "Sharp advice for people making big property decisions.",
    text:
      "Nadlanist is built for a modern real estate agent who wants a premium website without showing house prices. The focus is trust, lifestyle, property quality, process and personal guidance.",
    button: "About Me",
  },

  servicesSection: {
    eyebrow: "Services",
    title: "Everything before the deal feels simple.",
    text:
      "Guidance for selling, buying, relocating and understanding the market without pressure.",
  },

  services: [
    {
      title: "Seller Strategy",
      text:
        "Positioning, presentation, buyer qualification and a smart negotiation process from first meeting to closing.",
      image:
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Buyer Advisory",
      text:
        "Personal search, area analysis, property shortlisting and private viewing coordination.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "Property Marketing",
      text:
        "Editorial photography direction, listing copy, campaign flow and premium buyer communication.",
      image:
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  propertiesSection: {
    eyebrow: "Properties",
    title: "Selected homes, without public prices.",
    text:
      "Show curated properties by lifestyle, location and features while keeping pricing private.",
    button: "All Properties",
  },

  properties: [
    {
      title: "Modern Villa",
      location: "Coastal District",
      tag: "Private Viewing",
      image:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=85",
      details: ["5 Bedrooms", "Pool", "Private Garden"],
    },
    {
      title: "Penthouse Residence",
      location: "City Center",
      tag: "Exclusive",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
      details: ["Open View", "Large Balcony", "Designer Interior"],
    },
    {
      title: "Family Home",
      location: "Quiet Neighborhood",
      tag: "For Families",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
      details: ["4 Bedrooms", "Parking", "Near Schools"],
    },
    {
      title: "Garden Apartment",
      location: "Green Quarter",
      tag: "Lifestyle",
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
      details: ["Garden", "Renovated", "Bright Layout"],
    },
  ],

  reviewsSection: {
    eyebrow: "Reviews",
    title: "Clients choose calm, clear guidance.",
    text: "Trust-based testimonials for buyers, sellers and property owners.",
  },

  reviews: [
    {
      quote:
        "The process felt calm, precise and personal. We understood every step before making decisions.",
      name: "Maya Cohen",
      role: "Seller",
      rating: "5/5",
    },
    {
      quote:
        "The property search was focused and realistic. Every viewing was relevant and well prepared.",
      name: "Daniel Levi",
      role: "Buyer",
      rating: "4.9/5",
    },
    {
      quote:
        "Professional, discreet and sharp in negotiation. Exactly what we needed.",
      name: "Noa Amir",
      role: "Property Owner",
      rating: "5/5",
    },
  ],

  processSection: {
    eyebrow: "Process",
    title: "A clear route from first call to decision.",
    text: "A simple process that builds confidence before any commitment.",
  },

  process: [
    {
      step: "01",
      title: "Intro Call",
      text: "Understand your goals, timeline, area and non-negotiables.",
    },
    {
      step: "02",
      title: "Strategy",
      text: "Build a selling or buying plan with clear priorities.",
    },
    {
      step: "03",
      title: "Private Viewings",
      text: "Coordinate relevant properties and qualified opportunities.",
    },
    {
      step: "04",
      title: "Negotiation",
      text: "Support every decision until agreement and closing.",
    },
  ],

  faqSection: {
    eyebrow: "FAQ",
    title: "Questions before we start?",
    text:
      "Answers for people who want a professional real estate process without public pricing.",
    button: "Contact Me",
  },

  faq: [
    {
      q: "Why are prices not shown?",
      a:
        "This template is designed for agents who prefer private pricing, qualified leads and personal consultation before sharing sensitive property details.",
    },
    {
      q: "Can properties still be displayed?",
      a:
        "Yes. Each property can show photos, location, features, lifestyle tags and a private viewing call to action.",
    },
    {
      q: "Is this good for buyers and sellers?",
      a:
        "Yes. The structure supports seller representation, buyer advisory and property marketing.",
    },
    {
      q: "Can I replace all images and texts?",
      a:
        "Yes. The content is connected to defaultData so the editor can receive updated data from your system.",
    },
  ],

  cta: {
    title: "Let’s Find The Right Property Move",
    button: "Book Consultation",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  },

  about: {
    eyebrow: "About",
    title: "Real estate advisory with calm confidence.",
    text:
      "Nadlanist is for an agent who works personally with every client. The design uses bold editorial typography, cinematic images and premium motion to create trust before the first call.",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=85",
    stats: [
      ["120+", "Clients Guided"],
      ["4.9", "Average Rating"],
      ["10Y", "Market Experience"],
    ],
  },

  blog: {
    eyebrow: "Blog",
    title: "Market notes and property guidance.",
    text: "Editorial cards for neighborhood guides, seller tips and buyer education.",
    posts: [
      {
        title: "How to prepare a home before private viewings",
        image:
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85",
        date: "June 12, 2026",
      },
      {
        title: "What buyers should check before making an offer",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
        date: "May 28, 2026",
      },
      {
        title: "Why private pricing can create better leads",
        image:
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85",
        date: "April 18, 2026",
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Start with a private consultation.",
    text:
      "Tell us if you are buying, selling or exploring. We will guide you through the next step.",
    button: "Send Message",
  },

  footer: {
    text: "Premium real estate guidance with strategy, discretion and personal attention.",
    backToTop: "Back to top",
  },
};

export type NadlanistDefaultData = typeof nadlanistDefaultData;

export default nadlanistDefaultData;