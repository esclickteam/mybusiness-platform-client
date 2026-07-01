import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

export type SpalcioPageSection = {
  id: string;
  type:
    | "header"
    | "hero"
    | "services"
    | "projects"
    | "about"
    | "process"
    | "testimonials"
    | "contact"
    | "footer";
  title: string;
};

export const spalcioPages = [
  {
    id: "home",
    name: "Home",
    slug: "/",
    sections: [
      "header",
      "hero",
      "services",
      "projects",
      "about",
      "process",
      "testimonials",
      "contact",
      "footer",
    ],
  },
  {
    id: "about",
    name: "About",
    slug: "/about",
    sections: ["header", "about", "process", "testimonials", "contact", "footer"],
  },
  {
    id: "services",
    name: "Services",
    slug: "/services",
    sections: ["header", "services", "process", "contact", "footer"],
  },
  {
    id: "projects",
    name: "Projects",
    slug: "/projects",
    sections: ["header", "projects", "testimonials", "contact", "footer"],
  },
  {
    id: "contact",
    name: "Contact",
    slug: "/contact",
    sections: ["header", "contact", "footer"],
  },
];

export const spalcioSections: SpalcioPageSection[] = [
  { id: "header", type: "header", title: "Header" },
  { id: "hero", type: "hero", title: "Hero" },
  { id: "services", type: "services", title: "Services" },
  { id: "projects", type: "projects", title: "Projects" },
  { id: "about", type: "about", title: "About" },
  { id: "process", type: "process", title: "Process" },
  { id: "testimonials", type: "testimonials", title: "Testimonials" },
  { id: "contact", type: "contact", title: "Contact" },
  { id: "footer", type: "footer", title: "Footer" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-400">
              Spalcio
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Business Studio
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#services" className="hover:text-slate-950">
            Services
          </a>
          <a href="#projects" className="hover:text-slate-950">
            Projects
          </a>
          <a href="#about" className="hover:text-slate-950">
            About
          </a>
          <a href="#contact" className="hover:text-slate-950">
            Contact
          </a>
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 md:inline-flex"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f6f3ee]">
      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Built on vision, shaped by purpose
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-7xl">
            Build a business website with clarity and confidence.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            A premium website template for consultants, studios, agencies and
            professional service businesses that want a clean, trusted and modern
            online presence.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50"
            >
              View projects
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-8">
            {[
              ["180+", "Projects"],
              ["12Y", "Experience"],
              ["98%", "Client trust"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                  {value}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-8 h-44 w-44 rounded-full bg-blue-200/60 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-amber-200/70 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-4 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
              alt="Modern business office"
              className="h-[520px] w-full rounded-[2rem] object-cover"
            />

            <div className="absolute bottom-8 left-8 right-8 rounded-[1.7rem] border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur-xl">
              <p className="text-sm font-black text-slate-950">
                Premium business presence
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Clean sections, professional layout, strong call-to-action and
                high-trust visual language.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Business Strategy",
      text: "Shape your offer, messaging and growth direction with a clear strategic foundation.",
    },
    {
      title: "Brand Experience",
      text: "Create a premium digital presence that feels polished, trustworthy and memorable.",
    },
    {
      title: "Client Systems",
      text: "Turn interest into leads with booking, contact forms and structured service pages.",
    },
  ];

  return (
    <section id="services" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
              Services
            </p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
              Everything your business needs to look serious online.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-slate-500">
            Built for businesses that sell trust, expertise and results.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                {index + 1}
              </div>

              <h3 className="mt-8 text-2xl font-black tracking-[-0.03em] text-slate-950">
                {service.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">{service.text}</p>

              <div className="mt-7 inline-flex items-center gap-2 text-sm font-black text-slate-950">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: "Consulting Studio",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Real Estate Advisory",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Creative Agency",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <section id="projects" className="bg-[#f6f3ee] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Selected work
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
            A layout designed to showcase proof, not just words.
          </h2>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-72 w-full object-cover"
              />

              <div className="p-7">
                <h3 className="text-2xl font-black text-slate-950">
                  {project.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Clean structure for presenting services, proof, process and
                  business value.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-[2.5rem]">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80"
            alt="Business meeting"
            className="h-[520px] w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            About
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
            Designed for businesses that need trust from the first visit.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Spalcio gives a service-based business a complete structure:
            headline, positioning, services, proof, process and contact.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "Professional sections for serious service businesses",
              "Strong visual hierarchy for clear selling points",
              "Ready for booking, contact and lead generation",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["01", "Discover", "Understand the business, offer and target audience."],
    ["02", "Structure", "Build clear pages and sections around conversion."],
    ["03", "Launch", "Publish a polished website ready for leads."],
  ];

  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-300">
            Process
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-5xl">
            From idea to polished website in a clean flow.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, text]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
            >
              <p className="text-sm font-black text-blue-300">{number}</p>
              <h3 className="mt-5 text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <BadgeCheck className="h-7 w-7" />
        </div>

        <h2 className="mt-8 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
          “The structure made our business look bigger, clearer and much more
          professional.”
        </h2>

        <p className="mt-6 text-lg font-semibold text-slate-600">
          Daniel Cohen · Studio Founder
        </p>
      </div>
    </section>
  );
}

function Contact() {
  const contactItems: Array<{
    icon: React.ElementType;
    text: string;
  }> = [
    { icon: Phone, text: "+1 555 240 8890" },
    { icon: Mail, text: "hello@spalcio.com" },
    { icon: MapPin, text: "Business District, New York" },
    { icon: Clock3, text: "Mon–Fri, 09:00–18:00" },
  ];

  return (
    <section id="contact" className="bg-[#f6f3ee] px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
            Ready to create a professional business website?
          </h2>

          <div className="mt-10 grid gap-4">
            {contactItems.map((item) => {
              const ContactIcon = item.icon;

              return (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                    <ContactIcon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <form className="rounded-[2rem] bg-white p-7 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="First name"
              className="h-14 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-slate-950"
            />
            <input
              placeholder="Last name"
              className="h-14 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-slate-950"
            />
          </div>

          <input
            placeholder="Email address"
            className="mt-4 h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-slate-950"
          />

          <textarea
            placeholder="Tell us about your project"
            rows={6}
            className="mt-4 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:border-slate-950"
          />

          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            Send message
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-lg font-black">Spalcio</p>
          <p className="mt-1 text-sm text-white/55">
            Premium website template for professional businesses.
          </p>
        </div>

        <p className="text-sm text-white/45">
          © {new Date().getFullYear()} Spalcio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function SpalcioPages() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />
      <Hero />
      <Services />
      <Projects />
      <About />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default SpalcioPages;