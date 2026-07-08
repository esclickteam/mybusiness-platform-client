import React from "react";
import { shinoraDefaultData, type ShinoraTemplateData } from "./defaultData";

export const shinoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "pricing", label: "מחירון", slug: "/pricing" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "blog", label: "בלוג", slug: "/blog" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

type PageKey = (typeof shinoraPages)[number]["id"];

type ShinoraPagesProps = {
  data?: ShinoraTemplateData | Record<string, any>;
  page?: PageKey | string;
  pageId?: PageKey | string;
  activePage?: PageKey | string;
  currentPage?: PageKey | string;
  onNavigate?: (pageId: string) => void;
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function getPageKey(props: ShinoraPagesProps): PageKey {
  const raw = String(props.page || props.pageId || props.activePage || props.currentPage || "home")
    .replace(/^\//, "")
    .trim();
  const key = raw === "" ? "home" : raw;
  return shinoraPages.some((page) => page.id === key) ? (key as PageKey) : "home";
}

function navigateTo(pageId: string, onNavigate?: (pageId: string) => void) {
  if (onNavigate) {
    onNavigate(pageId);
    return;
  }

  const target = shinoraPages.find((page) => page.id === pageId);
  if (typeof window !== "undefined" && target) {
    window.history.pushState({}, "", target.slug);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[#c9a283]/45 bg-white/55 px-4 py-2 text-sm font-semibold text-[#8a5a43]">
      <span className="h-2 w-2 rounded-full bg-[#b78563]" />
      {children}
    </div>
  );
}

function Button({ children, variant = "dark", onClick }: { children: React.ReactNode; variant?: "dark" | "light"; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition duration-300",
        variant === "dark"
          ? "bg-[#2d211d] text-white shadow-xl shadow-[#2d211d]/15 hover:bg-[#4a332c]"
          : "border border-[#d7b8a0] bg-white/70 text-[#2d211d] hover:bg-white"
      )}
    >
      <span>{children}</span>
      <span className="mr-2 transition group-hover:-translate-x-1">←</span>
    </button>
  );
}

function Header({ data, onNavigate, pageKey }: { data: any; onNavigate?: (pageId: string) => void; pageKey: PageKey }) {
  const nav = [
    ["home", data.navHome],
    ["about", data.navAbout],
    ["services", data.navServices],
    ["pricing", data.navPricing],
    ["gallery", data.navGallery],
    ["shop", data.navShop],
    ["blog", data.navBlog],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7d3c4]/80 bg-[#fbf4ef]/86 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <button type="button" onClick={() => navigateTo("home", onNavigate)} className="flex items-center gap-3 text-right">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#2d211d] text-lg font-black text-white shadow-lg shadow-[#2d211d]/20">
            {data.logoText}
          </span>
          <span>
            <span className="block text-xl font-black tracking-tight text-[#2d211d]">{data.brandName}</span>
            <span className="block text-xs font-semibold text-[#9b725b]">Beauty Studio</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#e6d3c7] bg-white/55 p-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => navigateTo(String(id), onNavigate)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-bold transition",
                pageKey === id ? "bg-[#2d211d] text-white" : "text-[#6f5145] hover:bg-[#f3e1d5] hover:text-[#2d211d]"
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <Button onClick={() => navigateTo("contact", onNavigate)}>{data.navContact}</Button>
      </div>
    </header>
  );
}

function Hero({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(73,40,30,0.08)_1px,transparent_0)] bg-[length:26px_26px]">
      <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#f3c8aa]/45 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e9d2c1]/70 blur-3xl" />

      <div className="mx-auto grid min-h-[820px] max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
        <div className="relative z-10">
          <SectionLabel>{data.heroEyebrow}</SectionLabel>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] text-[#2d211d] md:text-7xl lg:text-8xl">
            {data.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#75584c] md:text-xl">{data.heroSubtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={() => navigateTo("contact", onNavigate)}>{data.heroPrimaryButton}</Button>
            <Button variant="light" onClick={() => navigateTo("services", onNavigate)}>{data.heroSecondaryButton}</Button>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {data.stats.map((stat: any, index: number) => (
              <div key={stat.label} className="rounded-[28px] border border-[#ead8ca] bg-white/62 p-5 shadow-[0_28px_90px_rgba(66,38,30,0.13)]">
                <div className="text-3xl font-black text-[#2d211d]">{stat.value}</div>
                <div className="mt-1 text-sm font-semibold text-[#8b6654]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[640px]">
          <div className="absolute left-0 top-0 h-[520px] w-[70%] overflow-hidden rounded-[999px] border-[10px] border-white bg-[#ead2c2] shadow-[0_28px_90px_rgba(66,38,30,0.13)] motion-safe:animate-pulse">
            <img src={data.heroImage} alt="סלון יופי" className="h-full w-full object-cover" loading="eager" />
          </div>
          <div className="absolute bottom-8 right-0 h-[390px] w-[55%] overflow-hidden rounded-[44px] border-[10px] border-[#fbf4ef] bg-[#dec2b2] shadow-2xl motion-safe:animate-pulse">
            <img src={data.heroImageTwo} alt="טיפול יופי" className="h-full w-full object-cover" loading="eager" />
          </div>
          <div className="absolute right-8 top-16 grid h-28 w-28 place-items-center rounded-full border border-[#c9a283] bg-white/80 text-center text-xs font-black uppercase tracking-[.18em] text-[#815941] shadow-xl backdrop-blur motion-safe:animate-spin">
            shine<br />studio
          </div>
          <div className="absolute bottom-24 left-8 max-w-[230px] rounded-[32px] border border-white/70 bg-white/80 p-5 text-sm font-semibold leading-7 text-[#60463b] shadow-2xl backdrop-blur">
            אבחון אישי, אווירה רגועה ותוצאה שמרגישה טבעית ומוקפדת.
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStrip() {
  const items = ["SKIN CARE", "HAIR ART", "NAILS", "MAKEUP", "SPA", "BEAUTY BAR", "GLOW", "LUXE"];
  return (
    <div className="overflow-hidden border-y border-[#ead8ca] bg-[#2d211d] py-5 text-white">
      <div className="flex min-w-max flex-wrap justify-center gap-10">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="text-lg font-black tracking-[.22em] text-white/75">{item}</span>
        ))}
      </div>
    </div>
  );
}

function Intro({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-24 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
      <div className="overflow-hidden rounded-[46px] bg-[#e7cbb9] p-4 shadow-[0_28px_90px_rgba(66,38,30,0.13)]">
        <img src={data.gallery[2]} alt="טיפול" className="h-[520px] w-full rounded-[36px] object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <SectionLabel>חוויה אישית</SectionLabel>
        <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-[#2d211d] md:text-6xl">{data.introTitle}</h2>
        <p className="mt-5 text-lg leading-8 text-[#75584c]">{data.introText}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {data.categories.map((category: string) => (
            <span key={category} className="rounded-full border border-[#dbc2af] bg-white/60 px-5 py-3 text-sm font-bold text-[#6f4d40]">{category}</span>
          ))}
        </div>
        <div className="mt-9"><Button onClick={() => navigateTo("about", onNavigate)}>להכיר אותנו</Button></div>
      </div>
    </section>
  );
}

function ServicesPreview({ data, onNavigate, compact = false }: { data: any; onNavigate?: (pageId: string) => void; compact?: boolean }) {
  const services = compact ? data.services.slice(0, 3) : data.services;
  return (
    <section className="bg-[#fffaf6] py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>{data.servicesEyebrow}</SectionLabel>
            <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-[#2d211d] md:text-6xl">{data.servicesTitle}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#75584c]">{data.servicesText}</p>
          </div>
          <Button variant="light" onClick={() => navigateTo("services", onNavigate)}>כל השירותים</Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any, index: number) => (
            <article key={`${service.title}-${index}`} className="transition-all duration-500 hover:-translate-y-2 hover:border-[#ae7c5b]/60 hover:shadow-[0_32px_80px_rgba(72,43,35,0.14)] overflow-hidden rounded-[38px] border border-[#ead8ca] bg-[#fbf4ef] p-3">
              <div className="relative h-72 overflow-hidden rounded-[30px] bg-[#ead2c2]">
                <img src={service.image} alt={service.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" loading="lazy" />
                <div className="absolute right-4 top-4 rounded-full bg-white/85 px-4 py-2 text-sm font-black text-[#694a3d] backdrop-blur">{service.price}</div>
              </div>
              <div className="p-5">
                <div className="text-sm font-bold text-[#b27f60]">{service.category}</div>
                <h3 className="mt-2 text-2xl font-black text-[#2d211d]">{service.title}</h3>
                <p className="mt-3 leading-7 text-[#75584c]">{service.text}</p>
                <button type="button" onClick={() => navigateTo("contact", onNavigate)} className="mt-5 text-sm font-black text-[#2d211d] underline decoration-[#c7a184] underline-offset-8">לקביעת טיפול ←</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Consultation({ data }: { data: any }) {
  return (
    <section className="relative overflow-hidden bg-[#2d211d] py-24 text-white">
      <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#b78563]/30 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[#f0c7ab]/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
        <div className="relative z-10 flex flex-col justify-center">
          <SectionLabel>ייעוץ חינמי</SectionLabel>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">{data.consultationTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-white/72">{data.consultationText}</p>
          <div className="mt-8 rounded-[34px] border border-white/12 bg-white/8 p-6 backdrop-blur">
            <div className="text-sm font-bold text-white/70">לתיאום מהיר</div>
            <div className="mt-2 text-3xl font-black">{data.phone}</div>
          </div>
        </div>

        <form className="relative z-10 rounded-[44px] border border-white/12 bg-white p-5 text-[#2d211d] shadow-2xl md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-bold text-[#795a4c]">שם מלא</span><input className="w-full rounded-full border border-[#ead8ca] bg-[#fbf4ef] px-5 py-4 outline-none focus:border-[#b78563]" placeholder="השם שלך" /></label>
            <label className="block"><span className="mb-2 block text-sm font-bold text-[#795a4c]">טלפון</span><input className="w-full rounded-full border border-[#ead8ca] bg-[#fbf4ef] px-5 py-4 outline-none focus:border-[#b78563]" placeholder="050-0000000" /></label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-bold text-[#795a4c]">איזה טיפול מעניין אותך?</span><select className="w-full rounded-full border border-[#ead8ca] bg-[#fbf4ef] px-5 py-4 outline-none focus:border-[#b78563]"><option>טיפול פנים</option><option>שיער</option><option>ציפורניים</option><option>איפור</option></select></label>
            <label className="block md:col-span-2"><span className="mb-2 block text-sm font-bold text-[#795a4c]">הודעה</span><textarea className="min-h-32 w-full rounded-[28px] border border-[#ead8ca] bg-[#fbf4ef] px-5 py-4 outline-none focus:border-[#b78563]" placeholder="ספרי לנו מה חשוב לך" /></label>
          </div>
          <button type="button" className="mt-5 w-full rounded-full bg-[#2d211d] px-6 py-4 text-sm font-black text-white transition hover:bg-[#4a332c]">שליחת בקשה</button>
        </form>
      </div>
    </section>
  );
}

function WhyChoose({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
      <div className="rounded-[48px] bg-[#fffaf6] p-6 shadow-[0_28px_90px_rgba(66,38,30,0.13)] md:p-10">
        <SectionLabel>הערך שלנו</SectionLabel>
        <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-[#2d211d] md:text-6xl">{data.whyTitle}</h2>
        <p className="mt-5 text-lg leading-8 text-[#75584c]">{data.whyText}</p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {data.stats.map((stat: any) => (
            <div key={stat.label} className="rounded-[30px] border border-[#ead8ca] bg-[#fbf4ef] p-5">
              <div className="text-4xl font-black text-[#2d211d]">{stat.value}</div>
              <div className="mt-1 font-bold text-[#8b6654]">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-8"><Button onClick={() => navigateTo("about", onNavigate)}>עוד על הסטודיו</Button></div>
      </div>

      <div className="overflow-hidden rounded-[48px] bg-[#e7cbb9] p-4 shadow-[0_28px_90px_rgba(66,38,30,0.13)]">
        <div className="relative h-full min-h-[560px] overflow-hidden rounded-[38px]">
          <img src={data.directorImage} alt={data.directorName} className="h-full w-full object-cover" />
          <div className="absolute inset-x-5 bottom-5 rounded-[34px] bg-white/86 p-6 backdrop-blur">
            <div className="text-sm font-black uppercase tracking-[.22em] text-[#b27f60]">{data.directorRole}</div>
            <h3 className="mt-2 text-3xl font-black text-[#2d211d]">{data.directorName}</h3>
            <p className="mt-3 text-lg font-bold leading-8 text-[#60463b]">“{data.directorQuote}”</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: any }) {
  return (
    <section className="bg-[#fffaf6] py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>לקוחות מספרות</SectionLabel>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#2d211d] md:text-6xl">{data.testimonialsTitle}</h2>
          </div>
          <div className="flex gap-2 text-2xl"><span>←</span><span>→</span></div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {data.testimonials.map((item: any) => (
            <article key={item.name} className="transition-all duration-500 hover:-translate-y-2 hover:border-[#ae7c5b]/60 hover:shadow-[0_32px_80px_rgba(72,43,35,0.14)] rounded-[36px] border border-[#ead8ca] bg-[#fbf4ef] p-6">
              <p className="text-lg font-bold leading-8 text-[#4e382f]">“{item.quote}”</p>
              <div className="mt-8 flex items-center gap-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                <div><div className="font-black text-[#2d211d]">{item.name}</div><div className="text-sm font-semibold text-[#8b6654]">{item.role}</div></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionLabel>בלוג</SectionLabel>
          <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#2d211d] md:text-6xl">{data.blogTitle}</h2>
        </div>
        <Button variant="light" onClick={() => navigateTo("blog", onNavigate)}>כל המאמרים</Button>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {data.posts.map((post: any) => (
          <article key={post.title} className="transition-all duration-500 hover:-translate-y-2 hover:border-[#ae7c5b]/60 hover:shadow-[0_32px_80px_rgba(72,43,35,0.14)] overflow-hidden rounded-[36px] border border-[#ead8ca] bg-white/60 p-3">
            <img src={post.image} alt={post.title} className="h-64 w-full rounded-[28px] object-cover" />
            <div className="p-4">
              <div className="text-sm font-bold text-[#b27f60]">{post.date}</div>
              <h3 className="mt-2 text-2xl font-black leading-tight text-[#2d211d]">{post.title}</h3>
              <p className="mt-3 leading-7 text-[#75584c]">{post.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  const footerLinks = ["home", "about", "services", "pricing", "gallery", "shop", "blog", "contact"];
  return (
    <footer className="bg-[#2d211d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-lg font-black text-[#2d211d]">{data.logoText}</span><span className="text-2xl font-black">{data.brandName}</span></div>
          <p className="mt-5 max-w-md leading-8 text-white/72">{data.footerText}</p>
          <div className="mt-6 text-lg font-black">{data.phone}</div>
          <div className="mt-1 text-white/70">{data.address}</div>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-black">עמודים</h4>
          <div className="grid gap-3">
            {footerLinks.slice(0, 4).map((id) => <button key={id} onClick={() => navigateTo(id, onNavigate)} className="text-right text-white/70 transition hover:text-white">{shinoraPages.find((p) => p.id === id)?.label}</button>)}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-black">עוד באתר</h4>
          <div className="grid gap-3">
            {footerLinks.slice(4).map((id) => <button key={id} onClick={() => navigateTo(id, onNavigate)} className="text-right text-white/70 transition hover:text-white">{shinoraPages.find((p) => p.id === id)?.label}</button>)}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/50">© {data.brandName}. כל הזכויות שמורות.</div>
    </footer>
  );
}

function PageHero({ title, text, image }: { title: string; text: string; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(73,40,30,0.08)_1px,transparent_0)] bg-[length:26px_26px]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[1fr_.82fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <SectionLabel>Shinora Studio</SectionLabel>
          <h1 className="mt-6 text-5xl font-black leading-tight tracking-[-0.05em] text-[#2d211d] md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#75584c]">{text}</p>
        </div>
        {image ? <img src={image} alt={title} className="h-[430px] w-full rounded-[46px] object-cover shadow-[0_28px_90px_rgba(66,38,30,0.13)]" /> : null}
      </div>
    </section>
  );
}

function HomePage({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return <><Hero data={data} onNavigate={onNavigate} /><BrandStrip /><Intro data={data} onNavigate={onNavigate} /><ServicesPreview data={data} onNavigate={onNavigate} compact /><Consultation data={data} /><WhyChoose data={data} onNavigate={onNavigate} /><Testimonials data={data} /><BlogPreview data={data} onNavigate={onNavigate} /></>;
}

function AboutPage({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return (
    <>
      <PageHero title="סטודיו בוטיק ליופי רגוע ומדויק" text="אנחנו משלבים מקצועיות, יחס אישי ואסתטיקה נקייה כדי ליצור חוויית טיפוח שנשארת בראש הרבה אחרי הביקור." image={data.heroImageTwo} />
      <WhyChoose data={data} onNavigate={onNavigate} />
      <section className="bg-[#fffaf6] py-24"><div className="mx-auto max-w-7xl px-4 lg:px-8"><SectionLabel>הצוות</SectionLabel><h2 className="mt-6 text-4xl font-black text-[#2d211d] md:text-6xl">המומחיות שלנו</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{data.team.map((member: any) => <article key={member.name} className="transition-all duration-500 hover:-translate-y-2 hover:border-[#ae7c5b]/60 hover:shadow-[0_32px_80px_rgba(72,43,35,0.14)] rounded-[38px] border border-[#ead8ca] bg-[#fbf4ef] p-3"><img src={member.image} alt={member.name} className="h-80 w-full rounded-[30px] object-cover" /><div className="p-5"><h3 className="text-2xl font-black text-[#2d211d]">{member.name}</h3><p className="mt-1 font-bold text-[#9b725b]">{member.role}</p></div></article>)}</div></div></section>
      <Testimonials data={data} />
    </>
  );
}

function ServicesPage({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return <><PageHero title="שירותי יופי שמוכרים תורים" text="עמוד שירותים ברור וממיר עם קטגוריות, מחירים התחלתיים ותמונות גדולות להחלפה בעריכה." image={data.gallery[0]} /><ServicesPreview data={data} onNavigate={onNavigate} /><Consultation data={data} /></>;
}

function PricingPage({ data }: { data: any }) {
  return (
    <>
      <PageHero title="מחירון פשוט וברור" text="חבילות מוצגות בצורה אלגנטית כדי שלקוחות יבינו מהר מה מתאים להן וייצרו קשר." image={data.gallery[3]} />
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8"><div className="grid gap-5 lg:grid-cols-3">{data.pricing.map((plan: any) => <article key={plan.title} className={cx("transition-all duration-500 hover:-translate-y-2 hover:border-[#ae7c5b]/60 hover:shadow-[0_32px_80px_rgba(72,43,35,0.14)] rounded-[40px] border p-8", plan.featured ? "border-[#2d211d] bg-[#2d211d] text-white" : "border-[#ead8ca] bg-white/65 text-[#2d211d]")}><div className="text-lg font-black">{plan.title}</div><div className="mt-5 text-5xl font-black">{plan.price}</div><p className={cx("mt-4 leading-8", plan.featured ? "text-white/72" : "text-[#75584c]")}>{plan.description}</p><ul className="mt-7 grid gap-3">{plan.items.map((item: string) => <li key={item} className="flex items-center gap-3"><span className={cx("grid h-6 w-6 place-items-center rounded-full text-xs", plan.featured ? "bg-white text-[#2d211d]" : "bg-[#2d211d] text-white")}>✓</span><span className="font-bold">{item}</span></li>)}</ul></article>)}</div></section>
    </>
  );
}

function GalleryPage({ data }: { data: any }) {
  return (
    <>
      <PageHero title="גלריית עבודות" text="תמונות גדולות, רכות ויוקרתיות שמאפשרות ללקוחה לדמיין את החוויה לפני שהיא קובעת תור." image={data.gallery[1]} />
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8"><div className="columns-1 gap-5 md:columns-2 lg:columns-3">{data.gallery.map((image: string, index: number) => <img key={`${image}-${index}`} src={image} alt={`גלריה ${index + 1}`} className={cx("mb-5 w-full break-inside-avoid rounded-[38px] object-cover shadow-[0_28px_90px_rgba(66,38,30,0.13)]", index % 3 === 0 ? "h-[480px]" : "h-[340px]")} />)}</div></section>
    </>
  );
}

function ShopPage({ data }: { data: any }) {
  return (
    <>
      <PageHero title="חנות מוצרי טיפוח" text="עמוד חנות קליל למוצרים משלימים: סרומים, קרמים, שמנים ומוצרי פרימיום שממשיכים את החוויה בבית." image={data.products[0]?.image} />
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8"><div className="grid gap-5 md:grid-cols-3">{data.products.map((product: any) => <article key={product.name} className="transition-all duration-500 hover:-translate-y-2 hover:border-[#ae7c5b]/60 hover:shadow-[0_32px_80px_rgba(72,43,35,0.14)] rounded-[38px] border border-[#ead8ca] bg-white/70 p-3"><img src={product.image} alt={product.name} className="h-80 w-full rounded-[30px] object-cover" /><div className="flex items-center justify-between p-5"><div><h3 className="text-2xl font-black text-[#2d211d]">{product.name}</h3><p className="mt-1 text-lg font-black text-[#b27f60]">{product.price}</p></div><button type="button" className="rounded-full bg-[#2d211d] px-5 py-3 text-sm font-black text-white">הוספה</button></div></article>)}</div></section>
    </>
  );
}

function BlogPage({ data, onNavigate }: { data: any; onNavigate?: (pageId: string) => void }) {
  return <><PageHero title="בלוג יופי וטיפוח" text="תוכן שמחזק אמון, מביא תנועה אורגנית ומסביר ללקוחה למה כדאי לקבוע דווקא אצלך." image={data.posts[0]?.image} /><BlogPreview data={data} onNavigate={onNavigate} /></>;
}

function ContactPage({ data }: { data: any }) {
  return <><PageHero title="בואי נקבע את הטיפול הבא" text="עמוד יצירת קשר עם טופס ברור, טלפון, כתובת וקריאה לפעולה חזקה." image={data.gallery[4]} /><Consultation data={data} /></>;
}

export default function ShinoraPages(props: ShinoraPagesProps) {
  const data = { ...shinoraDefaultData, ...(props.data || {}) } as any;
  const pageKey = getPageKey(props);

  const page = {
    home: <HomePage data={data} onNavigate={props.onNavigate} />,
    about: <AboutPage data={data} onNavigate={props.onNavigate} />,
    services: <ServicesPage data={data} onNavigate={props.onNavigate} />,
    pricing: <PricingPage data={data} />,
    gallery: <GalleryPage data={data} />,
    shop: <ShopPage data={data} />,
    blog: <BlogPage data={data} onNavigate={props.onNavigate} />,
    contact: <ContactPage data={data} />,
  }[pageKey];

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#fbf4ef] text-[#2d211d] font-sans">
      <Header data={data} onNavigate={props.onNavigate} pageKey={pageKey} />
      <main>{page}</main>
      <Footer data={data} onNavigate={props.onNavigate} />
    </div>
  );
}
