import React from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

import {
  spalcioData,
  spalcioPages,
  spalcioSections,
  type SpalcioContactItem,
} from "./spalcioData";

const contactIconMap: Record<SpalcioContactItem["type"], React.ElementType> = {
  phone: Phone,
  email: Mail,
  location: MapPin,
  hours: Clock3,
};

function Header() {
  return (
    <header
      data-section-id="header"
      data-section-title="כותרת עליונה"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <p
              data-editable="true"
              className="spalcio-editable text-sm font-black uppercase tracking-[0.22em] text-slate-400"
            >
              {spalcioData.brand.name}
            </p>
            <p
              data-editable="true"
              className="spalcio-editable text-xs font-semibold text-slate-500"
            >
              {spalcioData.brand.subtitle}
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {spalcioData.navigation.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 md:inline-flex"
        >
          התחלת פרויקט
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      data-section-id="hero"
      data-section-title="אזור פתיחה"
      className="relative overflow-hidden bg-[#f6f3ee]"
    >
      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div
            data-editable="true"
            className="spalcio-editable mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            {spalcioData.hero.badge}
          </div>

          <h1
            data-editable="true"
            className="spalcio-editable max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-7xl"
          >
            {spalcioData.hero.title}
          </h1>

          <p
            data-editable="true"
            className="spalcio-editable mt-7 max-w-xl text-lg leading-8 text-slate-600"
          >
            {spalcioData.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              {spalcioData.hero.primaryButton}
              <ArrowLeft className="h-4 w-4" />
            </a>

            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50"
            >
              {spalcioData.hero.secondaryButton}
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-8">
            {spalcioData.hero.stats.map((stat) => (
              <div key={stat.label}>
                <p
                  data-editable="true"
                  className="spalcio-editable text-3xl font-black tracking-[-0.04em] text-slate-950"
                >
                  {stat.value}
                </p>
                <p
                  data-editable="true"
                  className="spalcio-editable mt-1 text-sm font-semibold text-slate-500"
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-blue-200/60 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-amber-200/70 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-4 shadow-2xl">
            <img
              src={spalcioData.hero.image}
              alt={spalcioData.hero.imageAlt}
              className="spalcio-hero-image h-[520px] w-full rounded-[2rem] object-cover"
            />

            <div className="absolute bottom-8 left-8 right-8 rounded-[1.7rem] border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur-xl">
              <p
                data-editable="true"
                className="spalcio-editable text-sm font-black text-slate-950"
              >
                {spalcioData.hero.floatingTitle}
              </p>
              <p
                data-editable="true"
                className="spalcio-editable mt-2 text-sm leading-6 text-slate-600"
              >
                {spalcioData.hero.floatingText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section
      id="services"
      data-section-id="services"
      data-section-title="שירותים"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p
              data-editable="true"
              className="spalcio-editable text-sm font-black uppercase tracking-[0.25em] text-blue-600"
            >
              {spalcioData.services.eyebrow}
            </p>
            <h2
              data-editable="true"
              className="spalcio-editable mt-3 max-w-2xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl"
            >
              {spalcioData.services.title}
            </h2>
          </div>

          <p
            data-editable="true"
            className="spalcio-editable max-w-md text-base leading-7 text-slate-500"
          >
            {spalcioData.services.text}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {spalcioData.services.items.map((service, index) => (
            <article
              key={service.title}
              className="spalcio-card rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                {index + 1}
              </div>

              <h3
                data-editable="true"
                className="spalcio-editable mt-8 text-2xl font-black tracking-[-0.03em] text-slate-950"
              >
                {service.title}
              </h3>

              <p
                data-editable="true"
                className="spalcio-editable mt-4 leading-7 text-slate-600"
              >
                {service.text}
              </p>

              <div className="mt-7 inline-flex items-center gap-2 text-sm font-black text-slate-950">
                לפרטים נוספים
                <ArrowLeft className="h-4 w-4" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      data-section-id="projects"
      data-section-title="פרויקטים"
      className="bg-[#f6f3ee] px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p
            data-editable="true"
            className="spalcio-editable text-sm font-black uppercase tracking-[0.25em] text-blue-600"
          >
            {spalcioData.projects.eyebrow}
          </p>
          <h2
            data-editable="true"
            className="spalcio-editable mt-3 max-w-2xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl"
          >
            {spalcioData.projects.title}
          </h2>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {spalcioData.projects.items.map((project) => (
            <article
              key={project.title}
              className="spalcio-card overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <img
                src={project.image}
                alt={project.title}
                className="spalcio-project-image h-72 w-full object-cover"
              />

              <div className="p-7">
                <h3
                  data-editable="true"
                  className="spalcio-editable text-2xl font-black text-slate-950"
                >
                  {project.title}
                </h3>

                <p
                  data-editable="true"
                  className="spalcio-editable mt-3 leading-7 text-slate-600"
                >
                  {project.text}
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
    <section
      id="about"
      data-section-id="about"
      data-section-title="אודות"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-[2.5rem]">
          <img
            src={spalcioData.about.image}
            alt={spalcioData.about.imageAlt}
            className="spalcio-about-image h-[520px] w-full object-cover"
          />
        </div>

        <div>
          <p
            data-editable="true"
            className="spalcio-editable text-sm font-black uppercase tracking-[0.25em] text-blue-600"
          >
            {spalcioData.about.eyebrow}
          </p>

          <h2
            data-editable="true"
            className="spalcio-editable mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl"
          >
            {spalcioData.about.title}
          </h2>

          <p
            data-editable="true"
            className="spalcio-editable mt-6 text-lg leading-8 text-slate-600"
          >
            {spalcioData.about.text}
          </p>

          <div className="mt-8 grid gap-4">
            {spalcioData.about.bullets.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span
                  data-editable="true"
                  className="spalcio-editable font-semibold text-slate-700"
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      id="process"
      data-section-id="process"
      data-section-title="תהליך עבודה"
      className="bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p
            data-editable="true"
            className="spalcio-editable text-sm font-black uppercase tracking-[0.25em] text-blue-300"
          >
            {spalcioData.process.eyebrow}
          </p>
          <h2
            data-editable="true"
            className="spalcio-editable mt-3 text-4xl font-black tracking-[-0.05em] md:text-5xl"
          >
            {spalcioData.process.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {spalcioData.process.steps.map((step) => (
            <div
              key={step.number}
              className="spalcio-card rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
            >
              <p
                data-editable="true"
                className="spalcio-editable text-sm font-black text-blue-300"
              >
                {step.number}
              </p>
              <h3
                data-editable="true"
                className="spalcio-editable mt-5 text-2xl font-black"
              >
                {step.title}
              </h3>
              <p
                data-editable="true"
                className="spalcio-editable mt-4 leading-7 text-white/65"
              >
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section
      id="testimonials"
      data-section-id="testimonials"
      data-section-title="המלצות"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <BadgeCheck className="h-7 w-7" />
        </div>

        <h2
          data-editable="true"
          className="spalcio-editable mt-8 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl"
        >
          “{spalcioData.testimonials.quote}”
        </h2>

        <p
          data-editable="true"
          className="spalcio-editable mt-6 text-lg font-semibold text-slate-600"
        >
          {spalcioData.testimonials.name} · {spalcioData.testimonials.role}
        </p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      data-section-id="contact"
      data-section-title="יצירת קשר"
      className="bg-[#f6f3ee] px-6 py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p
            data-editable="true"
            className="spalcio-editable text-sm font-black uppercase tracking-[0.25em] text-blue-600"
          >
            {spalcioData.contact.eyebrow}
          </p>

          <h2
            data-editable="true"
            className="spalcio-editable mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl"
          >
            {spalcioData.contact.title}
          </h2>

          <div className="mt-10 grid gap-4">
            {spalcioData.contact.items.map((item) => {
              const ContactIcon = contactIconMap[item.type];

              return (
                <div key={`${item.type}-${item.text}`} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                    <ContactIcon className="h-5 w-5" />
                  </div>
                  <span
                    data-editable="true"
                    className="spalcio-editable font-semibold text-slate-700"
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <form className="spalcio-form rounded-[2rem] bg-white p-7 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder={spalcioData.contact.form.firstName}
              className="h-14 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-slate-950"
            />
            <input
              placeholder={spalcioData.contact.form.lastName}
              className="h-14 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-slate-950"
            />
          </div>

          <input
            placeholder={spalcioData.contact.form.email}
            className="mt-4 h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-slate-950"
          />

          <textarea
            placeholder={spalcioData.contact.form.message}
            rows={6}
            className="mt-4 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:border-slate-950"
          />

          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800"
          >
            {spalcioData.contact.form.button}
            <ArrowLeft className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      data-section-id="footer"
      data-section-title="פוטר"
      className="bg-slate-950 px-6 py-10 text-white"
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p
            data-editable="true"
            className="spalcio-editable text-lg font-black"
          >
            {spalcioData.brand.name}
          </p>
          <p
            data-editable="true"
            className="spalcio-editable mt-1 text-sm text-white/55"
          >
            {spalcioData.brand.footerText}
          </p>
        </div>

        <p className="text-sm text-white/45">
          © {new Date().getFullYear()} {spalcioData.brand.name}. כל הזכויות
          שמורות.
        </p>
      </div>
    </footer>
  );
}

export function SpalcioPages() {
  return (
    <div
      dir="rtl"
      data-template-id="spalcio"
      className="min-h-screen bg-white text-right text-slate-950"
    >
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

export { spalcioPages, spalcioSections };

export default SpalcioPages;