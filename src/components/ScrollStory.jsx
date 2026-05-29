// ScrollStory.jsx

const features = [
  {
    label: "OVERVIEW",
    title: "Everything you need. In one dashboard.",
    description:
      "See performance, activity, reviews, appointments and insights — all connected in one beautiful workspace.",
    image: "/images/dashboard-preview-v3.png",
    alt: "Business dashboard preview",
    badge: "Live overview",
    align: "center",
  },
  {
    label: "PLATFORM",
    title: "Your business page",
    description:
      "Create a clean, professional page that represents your brand, showcases your services and helps clients connect faster.",
    image: "/images/business-page-v4.png",
    alt: "Business page preview",
    badge: "Professional profile",
    align: "left",
  },
  {
    label: "WORK TOGETHER",
    title: "Collaborations",
    description:
      "Work with partners and other businesses — messages, proposals, agreements and shared activity in one place.",
    image: "/images/collaborations-v11.png",
    alt: "Collaborations preview",
    badge: "Partner workspace",
    align: "right",
  },
  {
    label: "ORGANIZE",
    title: "Smart CRM",
    description:
      "Manage clients, conversations, appointments and history — with every detail organized automatically.",
    image: "/images/crm-preview-v2.png",
    alt: "CRM preview",
    badge: "Client intelligence",
    align: "left",
  },
  {
    label: "GROW SMART",
    title: "AI that works for you",
    description:
      "Get smart recommendations, automated follow-ups and insights that help you decide what to do next — faster and better.",
    image: "/images/ai-preview.png",
    alt: "AI assistant preview",
    badge: "AI assistant",
    align: "right",
  },
];

function FeatureVisual({ feature }) {
  return (
    <div className="relative">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/45 via-violet-200/35 to-cyan-200/40 blur-2xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_24px_80px_rgba(79,70,229,0.16)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
            </div>

            <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-black text-indigo-700">
              {feature.badge}
            </span>
          </div>

          <div className="relative bg-gradient-to-br from-white to-indigo-50/60 p-4">
            <img
              src={feature.image}
              alt={feature.alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-[1.2rem] object-cover shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureText({ feature, index }) {
  return (
    <div className="relative">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-100/70 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
        {feature.label}
      </div>

      <h3 className="max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl">
        {feature.title}
      </h3>

      <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
        {feature.description}
      </p>

      <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
        {[
          "Beautiful workflow",
          "Real-time updates",
          "Easy to manage",
          "Built to grow",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs text-white">
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>

      <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-200">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
          {index + 1}
        </span>
        Explore this feature
        <span>→</span>
      </div>
    </div>
  );
}

export default function ScrollStory() {
  const [intro, ...steps] = features;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] py-24 text-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute right-[-180px] top-[520px] h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute left-[-180px] top-[900px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-20 top-24 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {intro.label}
          </div>

          <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
            Everything you need.
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              In one dashboard.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            See your business performance at a glance — activity, reviews,
            appointments and insights, all connected in one premium workspace.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <FeatureVisual feature={intro} />
        </div>

        {/* Feature steps */}
        <div className="mt-28 space-y-28">
          {steps.map((feature, index) => {
            const imageFirst = feature.align === "left";

            return (
              <div
                key={feature.title}
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <div className={imageFirst ? "lg:order-1" : "lg:order-2"}>
                  <FeatureVisual feature={feature} />
                </div>

                <div
                  className={`${
                    imageFirst ? "lg:order-2" : "lg:order-1"
                  } ${
                    imageFirst
                      ? "lg:pl-4"
                      : "lg:pr-4"
                  }`}
                >
                  <FeatureText feature={feature} index={index + 1} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-28 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-[0_24px_80px_rgba(79,70,229,0.24)]">
          <div className="rounded-[2rem] bg-white/10 px-8 py-10 text-center backdrop-blur-xl sm:px-12">
            <h3 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              One platform. Every business workflow.
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-indigo-50">
              Manage your business page, clients, CRM, collaborations and AI
              tools from one beautiful workspace.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-black text-indigo-700 shadow-xl shadow-indigo-900/20 transition hover:-translate-y-0.5"
              >
                Start Free
              </a>

              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}