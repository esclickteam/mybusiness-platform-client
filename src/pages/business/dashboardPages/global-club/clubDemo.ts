import type { ClubPost, ClubProfile } from "./clubApi";

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 3600000).toISOString();
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString();
}

const AVATAR = (seed: string) =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e4d7ff,d1c4ff,c7b8ff`;

export type DemoMember = ClubProfile & {
  nameKey: string;
  businessKey: string;
  bioKey: string;
};

export const DEMO_STATS = {
  activeMembers: 1248,
  discussionsThisWeek: 82,
  newOpportunities: 37,
  openPolls: 12,
  countriesRepresented: 41,
  openCollaborations: 18,
};

export const DEMO_MEMBER_META: DemoMember[] = [
  {
    userId: "demo-sarah",
    nameKey: "club.demo.members.sarah.name",
    businessKey: "club.demo.members.sarah.business",
    bioKey: "club.demo.members.sarah.bio",
    fullName: "",
    businessName: "",
    country: "Israel",
    businessCategory: "Creative",
    industry: "Creative",
    photoUrl: AVATAR("SarahCohen"),
    description: "",
  },
  {
    userId: "demo-marco",
    nameKey: "club.demo.members.marco.name",
    businessKey: "club.demo.members.marco.business",
    bioKey: "club.demo.members.marco.bio",
    fullName: "",
    businessName: "",
    country: "Italy",
    businessCategory: "Consulting",
    industry: "Consulting",
    photoUrl: AVATAR("MarcoRossi"),
    description: "",
  },
  {
    userId: "demo-dana",
    nameKey: "club.demo.members.dana.name",
    businessKey: "club.demo.members.dana.business",
    bioKey: "club.demo.members.dana.bio",
    fullName: "",
    businessName: "",
    country: "Israel",
    businessCategory: "Marketing",
    industry: "Marketing",
    photoUrl: AVATAR("DanaLevy"),
    description: "",
  },
  {
    userId: "demo-ahmed",
    nameKey: "club.demo.members.ahmed.name",
    businessKey: "club.demo.members.ahmed.business",
    bioKey: "club.demo.members.ahmed.bio",
    fullName: "",
    businessName: "",
    country: "United Arab Emirates",
    businessCategory: "Logistics",
    industry: "Logistics",
    photoUrl: AVATAR("AhmedMansoori"),
    description: "",
  },
  {
    userId: "demo-maria",
    nameKey: "club.demo.members.maria.name",
    businessKey: "club.demo.members.maria.business",
    bioKey: "club.demo.members.maria.bio",
    fullName: "",
    businessName: "",
    country: "Spain",
    businessCategory: "Creative",
    industry: "Creative",
    photoUrl: AVATAR("MariaGonzalez"),
    description: "",
  },
  {
    userId: "demo-david",
    nameKey: "club.demo.members.david.name",
    businessKey: "club.demo.members.david.business",
    bioKey: "club.demo.members.david.bio",
    fullName: "",
    businessName: "",
    country: "South Korea",
    businessCategory: "Software",
    industry: "Software",
    photoUrl: AVATAR("DavidKim"),
    description: "",
  },
];

export function localizeDemoMember(member: DemoMember, t: (key: string) => string): ClubProfile {
  return {
    ...member,
    fullName: t(member.nameKey),
    businessName: t(member.businessKey),
    description: t(member.bioKey),
  };
}

export function demoPosts(t: (key: string) => string): ClubPost[] {
  const members = DEMO_MEMBER_META.map((member) => localizeDemoMember(member, t));
  return [
    {
      _id: "demo-post-sarah",
      postType: "collaboration",
      text: t("club.demo.posts.sarah"),
      likeCount: 42,
      commentCount: 28,
      createdAt: hoursAgo(3),
      likedByMe: false,
      savedByMe: false,
      author: members[0],
      comments: [],
    },
    {
      _id: "demo-post-marco",
      postType: "opportunity",
      text: t("club.demo.posts.marco"),
      likeCount: 45,
      commentCount: 12,
      createdAt: hoursAgo(6),
      likedByMe: false,
      savedByMe: false,
      author: members[1],
      comments: [],
    },
    {
      _id: "demo-post-dana",
      postType: "question",
      text: t("club.demo.posts.dana"),
      likeCount: 31,
      commentCount: 9,
      createdAt: hoursAgo(0.2),
      likedByMe: false,
      savedByMe: false,
      author: members[2],
      comments: [],
    },
  ];
}

export function demoOpportunities(t: (key: string) => string) {
  const members = DEMO_MEMBER_META.map((member) => localizeDemoMember(member, t));
  return [
    {
      _id: "demo-opp-canada",
      title: t("club.demo.opportunities.canada.title"),
      description: t("club.demo.opportunities.canada.text"),
      country: "Canada",
      industry: "Retail",
      opportunityType: "expansion",
      createdAt: hoursAgo(20),
      author: members[0],
    },
    {
      _id: "demo-opp-us",
      title: t("club.demo.opportunities.us.title"),
      description: t("club.demo.opportunities.us.text"),
      country: "United States",
      industry: "Marketing",
      opportunityType: "partnership",
      createdAt: hoursAgo(28),
      author: members[5],
    },
    {
      _id: "demo-opp-bulgaria",
      title: t("club.demo.opportunities.bulgaria.title"),
      description: t("club.demo.opportunities.bulgaria.text"),
      country: "Bulgaria",
      industry: "Logistics",
      opportunityType: "collaboration",
      createdAt: hoursAgo(40),
      author: members[3],
    },
  ];
}

export const DEMO_TODAY = {
  titleKey: "club.demo.today.title",
  questionKey: "club.demo.today.question",
  votes: 242,
  options: [
    { id: "a", labelKey: "club.demo.today.a" },
    { id: "b", labelKey: "club.demo.today.b" },
    { id: "c", labelKey: "club.demo.today.c" },
    { id: "d", labelKey: "club.demo.today.d" },
  ],
};

export const DEMO_EVENTS = [
  {
    id: "demo-event-scale",
    day: 22,
    monthKey: "club.demo.events.may",
    titleKey: "club.demo.events.scale.title",
    timeKey: "club.demo.events.scale.time",
    textKey: "club.demo.events.scale.text",
    startsAt: daysFromNow(12),
  },
  {
    id: "demo-event-ai",
    day: 5,
    monthKey: "club.demo.events.june",
    titleKey: "club.demo.events.ai.title",
    timeKey: "club.demo.events.ai.time",
    textKey: "club.demo.events.ai.text",
    startsAt: daysFromNow(26),
  },
];

export function isDemoId(id?: string) {
  return String(id || "").startsWith("demo-");
}

export function mergeLive<T extends { _id?: string; userId?: string }>(live: T[], demo: T[], min = 3): T[] {
  if (live.length >= min) return live;
  const seen = new Set(live.map((item) => String(item._id || item.userId)));
  const extra = demo.filter((item) => !seen.has(String(item._id || item.userId)));
  return [...live, ...extra].slice(0, Math.max(min, live.length));
}
