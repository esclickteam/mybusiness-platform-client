import React, { useMemo, useState } from "react";

export type AdionPageId = "home" | "about" | "project" | "blog" | "contact";

export type AdionPagesProps = {
  initialPage?: AdionPageId;
  mode?: "preview" | "editor" | "public";
};

type NavItem = {
  id: AdionPageId;
  label: string;
  number: string;
};

type ProjectItem = {
  type: string;
  title: string;
  date: string;
  image: string;
};

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

type BlogPost = {
  title: string;
  author: string;
  date: string;
  image: string;
};

const navItems: NavItem[] = [
  { id: "home", label: "בית", number: "01" },
  { id: "about", label: "אודות", number: "02" },
  { id: "project", label: "פרויקטים", number: "03" },
  { id: "blog", label: "בלוג", number: "04" },
  { id: "contact", label: "צור קשר", number: "05" },
];

const heroImages = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
];

const projects: ProjectItem[] = [
  {
    type: "מיתוג",
    title: "Loyee — עיצוב מותג",
    date: "11 ספט׳, 2026",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    type: "מובייל",
    title: "Ausi — עיצוב אפליקציה",
    date: "09 אוג׳, 2026",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    type: "פרינט",
    title: "Gio — קמפיין בילבורד",
    date: "27 פבר׳, 2026",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    type: "מוצר",
    title: "Fiona — מיתוג מוצר",
    date: "09 ינו׳, 2026",
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80",
  },
];

const team: TeamMember[] = [
  {
    name: "דניאל כהן",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "נועה לוי",
    role: "Designer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "אור ברק",
    role: "Manager",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "מאיה גל",
    role: "Marketing",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  },
];

const blogPosts: BlogPost[] = [
  {
    title: "איך לבנות מותג דיגיטלי שנראה יקר יותר",
    author: "Maria Saprova",
    date: "16 פבר׳, 2026",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "האסטרטגיה מאחורי אתר שממיר לקוחות",
    author: "Faruk Hustle",
    date: "27 פבר׳, 2026",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "איך להוביל עסק בעידן של אוטומציות ו־AI",
    author: "Michael Brown",
    date: "15 מרץ, 2026",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#301b12]/15 bg-white/70 px-4 py-2 text-sm font-black text-[#301b12] shadow-sm">
      <span className="h-2 w-2 rounded-full bg-[#ff9fbc]" />
      {children}
    </div>
  );
}

function ArrowIcon() {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#301b12] text-[#fff7ef] transition-transform duration-300 group-hover:-translate-x-1">
      ↙
    </span>
  );
}

function Header({
  activePage,
  onNavigate,
}: {
  activePage: AdionPageId;
  onNavigate: (page: AdionPageId) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#301b12]/10 bg-[#fff8f0]/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-center gap-3"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#301b12] text-2xl font-black text-white shadow-[0_12px_30px_rgba(48,27,18,0.25)]">
            a
          </span>

          <span className="text-2xl font-black tracking-[-0.08em] text-[#301b12]">
            adion
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cx(
                "group rounded-full px-5 py-3 text-sm font-black transition-all duration-300",
                activePage === item.id
                  ? "bg-[#301b12] text-white"
                  : "text-[#301b12]/70 hover:bg-[#301b12]/8 hover:text-[#301b12]"
              )}
            >
              <span className="ml-2 text-xs opacity-50">({item.number})</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a className="text-sm font-black text-[#301b12]/65 hover:text-[#301b12]" href="#">
            FB /
          </a>
          <a className="text-sm font-black text-[#301b12]/65 hover:text-[#301b12]" href="#">
            Dr /
          </a>
          <a className="text-sm font-black text-[#301b12]/65 hover:text-[#301b12]" href="#">
            LI
          </a>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("contact")}
          className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white shadow-[0_16px_40px_rgba(48,27,18,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          התחלה
        </button>
      </div>
    </header>
  );
}

function Hero({ onNavigate }: { onNavigate: (page: AdionPageId) => void }) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-10 lg:px-8 lg:pb-24">
      <div className="pointer-events-none absolute left-[6%] top-16 h-40 w-40 rounded-full bg-[#ffc6d8] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[10%] h-56 w-56 rounded-full bg-[#c9b5ff] blur-3xl" />

      <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#301b12]/15 bg-white/70 px-4 py-2 text-sm font-black text-[#301b12]">
              [ California, USA ]
            </span>
            <span className="rounded-full bg-[#ffe3a8] px-4 py-2 text-sm font-black text-[#301b12]">
              Branding
            </span>
            <span className="rounded-full bg-[#e7d8ff] px-4 py-2 text-sm font-black text-[#301b12]">
              Motion
            </span>
          </div>

          <h1 className="max-w-5xl text-[24vw] font-black leading-[0.72] tracking-[-0.13em] text-[#301b12] sm:text-[18vw] lg:text-[12vw]">
            adion
          </h1>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1fr] lg:items-end">
            <p className="max-w-xl text-2xl font-black leading-tight tracking-[-0.04em] text-[#301b12] md:text-4xl">
              בונים, מנהלים ומגדילים מותגים דיגיטליים שנראים אחרת.
            </p>

            <div className="flex flex-col gap-4 rounded-[2rem] border border-[#301b12]/10 bg-white/75 p-5 shadow-[0_24px_70px_rgba(48,27,18,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-7 text-[#301b12]/68">
                סטודיו מודרני לעיצוב, UX, פיתוח ומיתוג — עם תנועה, צבע,
                טיפוגרפיה גדולה וחוויית משתמש מרשימה.
              </p>

              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white"
              >
                דברו איתנו
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[560px]">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={cx(
                "absolute overflow-hidden rounded-[2.4rem] border-[8px] border-[#fff8f0] bg-white shadow-[0_30px_90px_rgba(48,27,18,0.18)] transition-transform duration-500 hover:z-20 hover:rotate-0 hover:scale-105",
                index === 0 && "left-4 top-6 h-56 w-44 rotate-[-10deg]",
                index === 1 && "right-8 top-0 h-64 w-52 rotate-[8deg]",
                index === 2 && "left-20 top-52 h-72 w-56 rotate-[12deg]",
                index === 3 && "right-0 top-64 h-64 w-48 rotate-[-8deg]",
                index === 4 && "left-0 bottom-0 h-52 w-72 rotate-[4deg]"
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
          ))}

          <div className="absolute bottom-6 right-10 grid h-28 w-28 place-items-center rounded-full bg-[#301b12] text-center text-sm font-black leading-tight text-white shadow-[0_20px_50px_rgba(48,27,18,0.28)]">
            1.2k+
            <br />
            Projects
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    ["01", "UI/UX", "חוויות משתמש מדויקות עם מיקרו־אינטראקציות."],
    ["02", "Web Design", "אתרים מרהיבים שמרגישים כמו מותג פרימיום."],
    ["03", "Development", "פיתוח מהיר, נקי ורספונסיבי לכל מסך."],
    ["04", "SEO & Marketing", "צמיחה אורגנית וקמפיינים שמביאים תוצאות."],
  ];

  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>Services</SectionKicker>
            <h2 className="max-w-3xl text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
              Built by us, flown by them.
            </h2>
          </div>

          <p className="max-w-md text-lg leading-8 text-[#301b12]/65">
            שפה ויזואלית צבעונית, כרטיסים גדולים, מספרים, אייקונים ותנועה עדינה
            כמו בתבניות סטודיו מודרניות.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map(([number, title, text]) => (
            <article
              key={title}
              className="group min-h-[280px] rounded-[2.5rem] border border-[#301b12]/10 bg-white/75 p-6 shadow-[0_22px_70px_rgba(48,27,18,0.08)] transition-all duration-300 hover:-translate-y-2 hover:bg-[#301b12] hover:text-white"
            >
              <div className="mb-16 flex items-center justify-between">
                <span className="text-sm font-black opacity-60">[{number}]</span>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ffe3a8] text-2xl text-[#301b12] transition-transform duration-300 group-hover:rotate-12">
                  ✦
                </span>
              </div>

              <h3 className="mb-4 text-3xl font-black tracking-[-0.05em]">
                {title}
              </h3>

              <p className="leading-7 opacity-70">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ onNavigate }: { onNavigate: (page: AdionPageId) => void }) {
  return (
    <section className="overflow-hidden px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1480px] gap-8 rounded-[3rem] bg-[#301b12] p-6 text-white md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] bg-[#f7b6ca]">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="h-full w-full object-cover opacity-90"
          />

          <div className="absolute bottom-6 right-6 rounded-[2rem] bg-white/90 p-5 text-[#301b12] shadow-2xl">
            <p className="text-6xl font-black tracking-[-0.08em]">07</p>
            <p className="font-black">שנות ניסיון</p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10 py-2">
          <div>
            <SectionKicker>About</SectionKicker>

            <h2 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
              אנחנו מחדשים פתרונות דיגיטליים שעוזרים למותגים להתחבר, לצמוח
              ולהוביל.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["4.9", "דירוג ממוצע"],
              ["1.2k", "פרויקטים"],
              ["99%", "לקוחות מרוצים"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-[2rem] border border-white/15 bg-white/10 p-5"
              >
                <p className="text-5xl font-black tracking-[-0.07em]">{number}</p>
                <p className="mt-2 text-sm text-white/65">{label}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate("about")}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-[#301b12]"
          >
            עוד עלינו
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const bars = [
    ["Design", "92%"],
    ["Development", "58%"],
    ["Marketing", "83%"],
    ["Branding", "87%"],
  ];

  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionKicker>Why Us</SectionKicker>
          <h2 className="text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
            Why adion right for business
          </h2>
        </div>

        <div className="rounded-[3rem] border border-[#301b12]/10 bg-white/70 p-6 shadow-[0_25px_80px_rgba(48,27,18,0.08)] md:p-10">
          <div className="space-y-6">
            {bars.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm font-black text-[#301b12]">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-[#301b12]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#301b12] via-[#ff9ebc] to-[#ffe3a8]"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] bg-[#fff1c6] p-6">
              <p className="text-6xl font-black tracking-[-0.08em] text-[#301b12]">
                73k
              </p>
              <p className="mt-2 font-black text-[#301b12]/70">משימות שבוצעו</p>
            </div>

            <div className="rounded-[2rem] bg-[#eadcff] p-6">
              <p className="text-6xl font-black tracking-[-0.08em] text-[#301b12]">
                120
              </p>
              <p className="mt-2 font-black text-[#301b12]/70">מומחים</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionKicker>Projects</SectionKicker>
            <h2 className="text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
              We build great products
            </h2>
          </div>

          <button className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#301b12]/15 bg-white/80 px-6 py-4 text-sm font-black text-[#301b12]">
            כל הפרויקטים
            <ArrowIcon />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={cx(
                "group overflow-hidden rounded-[2.7rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_24px_80px_rgba(48,27,18,0.08)]",
                index % 2 === 1 && "md:translate-y-12"
              )}
            >
              <div className="h-[360px] overflow-hidden rounded-[2.2rem] bg-[#eadcff]">
                <img
                  src={project.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="flex items-end justify-between gap-4 p-4">
                <div>
                  <p className="mb-2 text-sm font-black text-[#301b12]/45">
                    {project.type}
                  </p>

                  <h3 className="text-2xl font-black tracking-[-0.05em] text-[#301b12]">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#301b12]/55">{project.date}</p>
                </div>

                <ArrowIcon />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    ["Great!", "הצוות סיפק תוצאה מדויקת, יוקרתית ומאוד מקצועית.", "גיא היגואן"],
    ["Excellent!", "שותף אמיתי לעיצוב שמחבר בין מותג, עסק ותוצאה.", "רומי לוי"],
    ["Amazing Work!", "האתר החדש שינה לנו את כל חוויית המכירה.", "דקסר מילן"],
  ];

  return (
    <section className="overflow-hidden bg-[#f4e9ff] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <SectionKicker>Testimonials</SectionKicker>

        <h2 className="mb-10 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
          Don’t take our word for it
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map(([title, quote, name]) => (
            <article
              key={name}
              className="rounded-[2.5rem] bg-white/80 p-7 shadow-[0_24px_70px_rgba(48,27,18,0.08)]"
            >
              <p className="mb-6 text-3xl font-black tracking-[-0.05em] text-[#301b12]">
                {title}
              </p>

              <p className="min-h-[96px] text-xl font-black leading-8 text-[#301b12]/75">
                “{quote}”
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-[#301b12]">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
                    alt=""
                    className="h-full w-full object-cover grayscale"
                  />
                </div>

                <div>
                  <p className="font-black text-[#301b12]">{name}</p>
                  <p className="text-sm font-bold text-[#301b12]/50">CEO</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-full border border-[#301b12]/10 bg-white/55 px-6 py-5">
          <div className="flex min-w-max gap-10 text-3xl font-black tracking-[-0.06em] text-[#301b12]/70">
            {["LOGO", "NOVA", "PIXEL", "FLOW", "BRAND", "MOTION", "ADION"].map(
              (logo) => (
                <span key={logo}>{logo}</span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <SectionKicker>Team</SectionKicker>

        <h2 className="mb-10 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
          Small team, massive impact
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.name}
              className="group rounded-[2.5rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_22px_70px_rgba(48,27,18,0.08)]"
            >
              <div className="h-80 overflow-hidden rounded-[2rem] bg-[#ffe3a8]">
                <img
                  src={member.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-4">
                <div className="mb-4 flex gap-2 text-xs font-black text-[#301b12]/55">
                  <span>FB</span>
                  <span>/</span>
                  <span>IN</span>
                  <span>/</span>
                  <span>X</span>
                </div>

                <h3 className="text-2xl font-black tracking-[-0.05em] text-[#301b12]">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-bold text-[#301b12]/55">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Personal",
      price: "$7",
      desc: "מתאים לעסק קטן או אדם אחד",
      features: ["Web Design", "Front-End Coding", "Mobile App"],
      accent: "bg-[#fff1c6]",
    },
    {
      name: "Team",
      price: "$49",
      desc: "מתאים לצוותים ועסקים בצמיחה",
      features: ["Web Design", "Front-End Coding", "Mobile App", "AI Pilot"],
      accent: "bg-[#301b12] text-white",
    },
    {
      name: "Business",
      price: "$88",
      desc: "פתרון מתקדם למותגים גדולים",
      features: ["Brand Strategy", "Development", "Marketing", "Automation"],
      accent: "bg-[#eadcff]",
    },
  ];

  return (
    <section className="bg-[#fff1c6] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>Pricing</SectionKicker>

            <h2 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
              Find the best option, choose yours
            </h2>
          </div>

          <div className="inline-flex w-fit rounded-full bg-white p-2 shadow-sm">
            <button className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white">
              Monthly
            </button>
            <button className="rounded-full px-5 py-3 text-sm font-black text-[#301b12]">
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cx(
                "rounded-[2.7rem] p-7 shadow-[0_24px_70px_rgba(48,27,18,0.10)]",
                plan.accent
              )}
            >
              <p className="text-7xl font-black tracking-[-0.09em]">
                {plan.price}
              </p>

              <p className="mt-2 text-sm font-black opacity-60">Save ~ 20%</p>

              <h3 className="mt-8 text-3xl font-black tracking-[-0.05em]">
                {plan.name}
              </h3>

              <p className="mt-2 leading-7 opacity-70">{plan.desc}</p>

              <button className="mt-8 w-full rounded-full bg-white px-5 py-4 text-sm font-black text-[#301b12] shadow-sm">
                Start Free Trial
              </button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-bold">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/50 text-xs">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ["01", "Discussion", "פגישת היכרות ראשונית לפרויקט הבא שלך", "Timeline — 1 day"],
    ["02", "Approach", "עיצוב חוויה מדויקת, ברורה ומרשימה", "Timeline — 3 days"],
    ["03", "Development", "פיתוח, השקה וצמיחה קדימה", "Timeline — Depend on Project"],
  ];

  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <SectionKicker>Process</SectionKicker>

        <h2 className="mb-10 max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
          Take a tour of our work process
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map(([number, title, text, timeline]) => (
            <article
              key={number}
              className="relative min-h-[330px] overflow-hidden rounded-[2.7rem] border border-[#301b12]/10 bg-white/75 p-7 shadow-[0_24px_70px_rgba(48,27,18,0.08)]"
            >
              <div className="absolute left-6 top-6 text-8xl font-black tracking-[-0.1em] text-[#301b12]/10">
                {number}
              </div>

              <div className="relative z-10">
                <span className="mb-12 grid h-16 w-16 place-items-center rounded-2xl bg-[#ffe3a8] text-3xl">
                  ✺
                </span>

                <p className="text-sm font-black text-[#301b12]/45">{title}</p>

                <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] text-[#301b12]">
                  {text}
                </h3>

                <p className="mt-8 rounded-full bg-[#301b12]/8 px-4 py-3 text-sm font-black text-[#301b12]/70">
                  {timeline}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    [
      "יש לכם ניסיון חינם?",
      "כן. אפשר להציע ללקוחות תקופת ניסיון או שיחת אפיון לפני התחייבות.",
    ],
    [
      "איך נקבע המחיר?",
      "המחיר משתנה לפי כמות עמודים, רמת עיצוב, פיתוח, אוטומציות ותוכן.",
    ],
    [
      "אפשר לבנות אתר מלא?",
      "כן. התבנית מתאימה לאתר תדמית, סטודיו, סוכנות דיגיטל, שירותים ופורטפוליו.",
    ],
    [
      "אפשר לשנות חבילה?",
      "כן. אפשר להציג שדרוג, הורדה או התאמה אישית לפי צורך העסק.",
    ],
  ];

  return (
    <section className="bg-[#f8e6ef] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionKicker>Faq's</SectionKicker>

          <h2 className="text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
            Ask away, we're here to help
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map(([question, answer], index) => (
            <article
              key={question}
              className="overflow-hidden rounded-[2rem] bg-white/80 shadow-[0_16px_50px_rgba(48,27,18,0.07)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="flex w-full items-center justify-between gap-4 p-6 text-right text-xl font-black text-[#301b12]"
              >
                {question}
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#301b12] text-white">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 leading-8 text-[#301b12]/65">
                  {answer}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ onNavigate }: { onNavigate: (page: AdionPageId) => void }) {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <SectionKicker>Our Blog</SectionKicker>

            <h2 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.08em] text-[#301b12] lg:text-8xl">
              Modern tips for digital growth
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("blog")}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white"
          >
            כל המאמרים
            <ArrowIcon />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-[2.7rem] border border-[#301b12]/10 bg-white/75 p-4 shadow-[0_24px_70px_rgba(48,27,18,0.08)]"
            >
              <div className="h-64 overflow-hidden rounded-[2.1rem]">
                <img
                  src={post.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-4">
                <div className="mb-4 flex items-center justify-between text-xs font-black text-[#301b12]/45">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-2xl font-black leading-tight tracking-[-0.05em] text-[#301b12]">
                  {post.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta({ onNavigate }: { onNavigate: (page: AdionPageId) => void }) {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1480px] overflow-hidden rounded-[3rem] bg-[#301b12] p-8 text-white md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <h2 className="text-6xl font-black leading-[0.9] tracking-[-0.08em] md:text-8xl">
            Let’s work together or talk — we’re happy to help!
          </h2>

          <div>
            <p className="mb-6 leading-8 text-white/65">
              מוכן להפוך את העסק שלך למותג דיגיטלי מרשים? השאר פרטים ונחזור אליך
              עם אפיון ראשוני.
            </p>

            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-[#301b12]"
            >
              Let's Talk
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: AdionPageId) => void }) {
  return (
    <footer className="border-t border-[#301b12]/10 px-5 py-10 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_1fr_1fr]">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#301b12] text-2xl font-black text-white">
              a
            </span>
            <span className="text-3xl font-black tracking-[-0.08em] text-[#301b12]">
              adion
            </span>
          </button>

          <p className="mt-5 max-w-sm leading-8 text-[#301b12]/60">
            210 Wallet Street, California, Main HQ, USA
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="w-fit text-sm font-black text-[#301b12]/65 hover:text-[#301b12]"
            >
              ({item.number}) {item.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="rounded-[2rem] bg-white/70 p-4 shadow-sm"
        >
          <label className="mb-3 block text-sm font-black text-[#301b12]">
            Join our newsletter
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="האימייל שלך"
              className="min-w-0 flex-1 rounded-full border border-[#301b12]/10 bg-white px-4 py-3 text-sm text-[#301b12] outline-none focus:border-[#301b12]"
            />

            <button className="rounded-full bg-[#301b12] px-5 py-3 text-sm font-black text-white">
              שלח
            </button>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1480px] flex-col justify-between gap-4 border-t border-[#301b12]/10 pt-6 text-sm font-bold text-[#301b12]/45 md:flex-row">
        <p>@2026 Adion inc. All Right Reserved</p>
        <div className="flex gap-4">
          <span>FB</span>
          <span>TW</span>
          <span>LI</span>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: AdionPageId) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <Services />
      <AboutSection onNavigate={onNavigate} />
      <WhyUs />
      <ProjectsSection />
      <Testimonials />
      <TeamSection />
      <Pricing />
      <ProcessSection />
      <FaqSection />
      <BlogSection onNavigate={onNavigate} />
      <ContactCta onNavigate={onNavigate} />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1480px]">
          <SectionKicker>About Adion</SectionKicker>

          <h1 className="max-w-6xl text-7xl font-black leading-[0.86] tracking-[-0.09em] text-[#301b12] lg:text-9xl">
            Digital studio with sharp strategy and bold creative direction
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-[#301b12]/65">
            אנחנו משלבים אסטרטגיה, עיצוב ופיתוח כדי ליצור אתרים ומותגים
            שמרגישים חיים, יוקרתיים ומדויקים.
          </p>
        </div>
      </section>

      <AboutSection onNavigate={() => undefined} />
      <WhyUs />
      <TeamSection />
      <ContactCta onNavigate={() => undefined} />
    </>
  );
}

function ProjectPage() {
  return (
    <>
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1480px]">
          <SectionKicker>Projects</SectionKicker>

          <h1 className="max-w-6xl text-7xl font-black leading-[0.86] tracking-[-0.09em] text-[#301b12] lg:text-9xl">
            Selected works built for brands that want to grow
          </h1>
        </div>
      </section>

      <ProjectsSection />
      <Testimonials />
      <ContactCta onNavigate={() => undefined} />
    </>
  );
}

function BlogPage() {
  return (
    <>
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1480px]">
          <SectionKicker>Blog</SectionKicker>

          <h1 className="max-w-6xl text-7xl font-black leading-[0.86] tracking-[-0.09em] text-[#301b12] lg:text-9xl">
            Ideas, trends and strategy for digital brands
          </h1>
        </div>
      </section>

      <BlogSection onNavigate={() => undefined} />
      <FaqSection />
    </>
  );
}

function ContactPage() {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionKicker>Contact</SectionKicker>

          <h1 className="text-7xl font-black leading-[0.86] tracking-[-0.09em] text-[#301b12] lg:text-9xl">
            Let’s build something great
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-9 text-[#301b12]/65">
            השאר פרטים ונחזור אליך לתיאום שיחת אפיון.
          </p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="rounded-[3rem] border border-[#301b12]/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(48,27,18,0.08)] md:p-10"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="שם מלא"
              className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm text-[#301b12] outline-none focus:border-[#301b12]"
            />

            <input
              placeholder="טלפון"
              className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm text-[#301b12] outline-none focus:border-[#301b12]"
            />

            <input
              placeholder="אימייל"
              className="rounded-full border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm text-[#301b12] outline-none focus:border-[#301b12] md:col-span-2"
            />

            <textarea
              placeholder="ספרו לנו על הפרויקט"
              rows={7}
              className="resize-none rounded-[2rem] border border-[#301b12]/10 bg-[#fff8f0] px-5 py-4 text-sm text-[#301b12] outline-none focus:border-[#301b12] md:col-span-2"
            />
          </div>

          <button className="mt-5 w-full rounded-full bg-[#301b12] px-6 py-4 text-sm font-black text-white">
            שליחת הודעה
          </button>
        </form>
      </div>
    </section>
  );
}

export default function AdionPages({
  initialPage = "home",
}: AdionPagesProps) {
  const [activePage, setActivePage] = useState<AdionPageId>(initialPage);

  const pageContent = useMemo(() => {
    if (activePage === "about") return <AboutPage />;
    if (activePage === "project") return <ProjectPage />;
    if (activePage === "blog") return <BlogPage />;
    if (activePage === "contact") return <ContactPage />;

    return <HomePage onNavigate={setActivePage} />;
  }, [activePage]);

  return (
    <div
      dir="rtl"
      data-template-id="adion"
      className="min-h-screen w-full overflow-x-hidden bg-[#fff8f0] text-[#301b12]"
    >
      <Header activePage={activePage} onNavigate={setActivePage} />
      <main>{pageContent}</main>
      <Footer onNavigate={setActivePage} />
    </div>
  );
}

export const adionPages = [
  {
    id: "home",
    label: "בית",
    title: "Home",
    Component: () => <AdionPages initialPage="home" />,
  },
  {
    id: "about",
    label: "אודות",
    title: "About",
    Component: () => <AdionPages initialPage="about" />,
  },
  {
    id: "project",
    label: "פרויקטים",
    title: "Project",
    Component: () => <AdionPages initialPage="project" />,
  },
  {
    id: "blog",
    label: "בלוג",
    title: "Blog",
    Component: () => <AdionPages initialPage="blog" />,
  },
  {
    id: "contact",
    label: "צור קשר",
    title: "Contact",
    Component: () => <AdionPages initialPage="contact" />,
  },
] as const;