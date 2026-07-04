import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import { chanelEditorCss } from "./chanelEditorCss";

export const chanelImages = {
  hero:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=90",
  facial:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90",
  massage:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=90",
  relaxation:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=90",
  oils:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=90",
  treatment:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=90",
  studio:
    "https://images.unsplash.com/photo-1607008829749-c0f284a4981f?auto=format&fit=crop&w=1200&q=90",
  candles:
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=90",
};


export const chanelServices = [
  {
    title: "Deep Massage",
    price: "$49",
    time: "60 min",
    text: "Targets muscle tension, improves blood flow and restores balance.",
    image: chanelImages.hero,
  },
  {
    title: "Radiance Facial",
    price: "$79",
    time: "70 min",
    text: "Deeply cleanses, nourishes skin and restores a soft natural glow.",
    image: chanelImages.facial,
  },
  {
    title: "Aroma Massage",
    price: "$69",
    time: "65 min",
    text: "Natural oils calm the mind, relax the body and improve wellness.",
    image: chanelImages.massage,
  },
  {
    title: "Relaxation Therapy",
    price: "$59",
    time: "55 min",
    text: "Relieves stress, relaxes body and mind and restores inner peace.",
    image: chanelImages.relaxation,
  },
  {
    title: "Body Scrub",
    price: "$89",
    time: "75 min",
    text: "Smooth body treatment with soft exfoliation and nourishing care.",
    image: chanelImages.oils,
  },
  {
    title: "Beauty Ritual",
    price: "$99",
    time: "90 min",
    text: "A complete luxury ritual for glow, calm and deep relaxation.",
    image: chanelImages.treatment,
  },
];

export const chanelGallery = [
  chanelImages.hero,
  chanelImages.facial,
  chanelImages.massage,
  chanelImages.relaxation,
  chanelImages.oils,
  chanelImages.treatment,
  chanelImages.studio,
  chanelImages.candles,
];

export const chanelTestimonials = [
  {
    name: "Amelia",
    text: "The most relaxing spa experience. Beautiful space, calm atmosphere and perfect care.",
  },
  {
    name: "Sophia",
    text: "Everything felt premium, clean and peaceful. I left glowing and completely relaxed.",
  },
  {
    name: "Mia",
    text: "The treatment was amazing and the design of the place feels like a luxury retreat.",
  },
];

export const chanelFaq = [
  {
    question: "What services do you offer?",
    answer:
      "We offer massage, facials, body therapies, skincare treatments and wellness experiences.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "You can book through the contact form, online booking or by contacting the spa directly.",
  },
  {
    question: "Do you use natural products?",
    answer:
      "Yes. Our treatments use high-quality products designed for a calm and safe spa experience.",
  },
  {
    question: "What should I expect during my first visit?",
    answer:
      "Our team will welcome you, understand your preferences and guide you through the treatment.",
  },
];

function navHtml() {
  return `
<header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-50 border-b border-[#2b1b15]/10 bg-[#fbf4ee]/90 px-5 py-5 backdrop-blur-2xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-5">
    <a data-gjs-type="text" data-editable-link="true" href="#home" class="font-serif text-3xl font-black tracking-[-0.08em] text-[#2b1b15]">
      Chanel Spa
    </a>

    <nav class="hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.14em] text-[#2b1b15]/55 lg:flex">
      <a data-editable-link="true" href="#home">Home</a>
      <a data-editable-link="true" href="#services">Services</a>
      <a data-editable-link="true" href="#gallery">Gallery</a>
      <a data-editable-link="true" href="#prices">Pricing</a>
      <a data-editable-link="true" href="#booking">Booking</a>
      <a data-editable-link="true" href="#contact">Contact</a>
    </nav>

    <a data-editable-link="true" href="#booking" class="rounded-full bg-[#2b1b15] px-7 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(43,27,21,.16)]">
      Book Now
    </a>
  </div>
</header>
`;
}

function footerHtml() {
  return `
<footer data-section-kind="footer" data-section-title="Footer" class="bg-[#2b1b15] px-6 py-14 text-white">
  <div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
    <div>
      <p data-gjs-type="text" class="font-serif text-5xl font-black tracking-[-0.08em]">Chanel Spa</p>
      <p data-gjs-type="text" class="mt-4 max-w-md text-sm leading-7 text-white/60">
        Luxury spa and wellness template with calming visuals, elegant sections and booking flow.
      </p>
    </div>

    <div>
      <p data-gjs-type="text" class="font-black">Menu</p>
      <div class="mt-4 grid gap-3 text-sm text-white/60">
        <a data-editable-link="true" href="#services">Services</a>
        <a data-editable-link="true" href="#gallery">Gallery</a>
        <a data-editable-link="true" href="#prices">Pricing</a>
        <a data-editable-link="true" href="#booking">Booking</a>
      </div>
    </div>

    <div>
      <p data-gjs-type="text" class="font-black">Contact</p>
      <div class="mt-4 grid gap-3 text-sm text-white/60">
        <p data-gjs-type="text">+1 234 567 890</p>
        <p data-gjs-type="text">hello@chanelspa.com</p>
        <p data-gjs-type="text">Monday - Friday, 09:00-19:00</p>
      </div>
    </div>
  </div>
</footer>
`;
}

function servicesCardsHtml() {
  return chanelServices
    .map(
      (service) => `
<article data-section-kind="service-card" data-section-title="${service.title}" class="chanel-card chanel-shine overflow-hidden rounded-[34px] border border-[#2b1b15]/10 bg-white shadow-[0_22px_70px_rgba(43,27,21,.08)]">
  <div class="overflow-hidden bg-[#ead9cf]">
    <img data-gjs-type="image" src="${service.image}" alt="${service.title}" class="chanel-image-hover h-[300px] w-full object-cover" />
  </div>
  <div class="p-7">
    <div class="flex items-start justify-between gap-4">
      <h3 data-gjs-type="text" class="font-serif text-3xl font-black tracking-[-0.06em] text-[#2b1b15]">${service.title}</h3>
      <div class="shrink-0 rounded-full bg-[#fbf4ee] px-4 py-2 text-sm font-black text-[#7b5f52]">${service.price}</div>
    </div>
    <p data-gjs-type="text" class="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#2b1b15]/40">${service.time}</p>
    <p data-gjs-type="text" class="mt-4 text-sm leading-7 text-[#2b1b15]/60">${service.text}</p>
  </div>
</article>`,
    )
    .join("\n");
}

function galleryHtml() {
  return chanelGallery
    .map(
      (image, index) => `
<div data-section-kind="gallery-image" data-section-title="Gallery ${index + 1}" class="chanel-card chanel-shine overflow-hidden rounded-[34px] bg-[#ead9cf] ${
        index % 3 === 0 ? "md:row-span-2" : ""
      }">
  <img data-gjs-type="image" src="${image}" alt="Chanel gallery ${
        index + 1
      }" class="chanel-image-hover h-full min-h-[260px] w-full object-cover" />
</div>`,
    )
    .join("\n");
}

function testimonialsHtml() {
  return chanelTestimonials
    .map(
      (item) => `
<article class="chanel-card chanel-shine rounded-[34px] border border-[#2b1b15]/10 bg-white p-8 shadow-[0_24px_60px_rgba(43,27,21,.07)]">
  <p data-gjs-type="text" class="font-serif text-6xl leading-none text-[#c8977a]">“</p>
  <p data-gjs-type="text" class="mt-4 text-lg leading-8 text-[#2b1b15]/70">${item.text}</p>
  <p data-gjs-type="text" class="mt-6 font-black text-[#2b1b15]">${item.name}</p>
</article>`,
    )
    .join("\n");
}

function faqHtml() {
  return chanelFaq
    .map(
      (item) => `
<article class="chanel-card rounded-[30px] border border-[#2b1b15]/10 bg-white p-7 shadow-[0_18px_55px_rgba(43,27,21,.06)]">
  <p data-gjs-type="text" class="font-serif text-2xl font-black tracking-[-0.05em] text-[#2b1b15]">${item.question}</p>
  <p data-gjs-type="text" class="mt-4 text-sm leading-7 text-[#2b1b15]/60">${item.answer}</p>
</article>`,
    )
    .join("\n");
}

function pricesHtml() {
  return chanelServices
    .map(
      (item, index) => `
<article class="chanel-card group relative overflow-hidden rounded-[34px] border border-[#2b1b15]/10 bg-white p-7 shadow-[0_24px_75px_rgba(43,27,21,.07)]">
  <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c8977a]/25 blur-2xl transition group-hover:scale-125"></div>

  <div class="relative z-10">
    <div class="flex items-start justify-between gap-4">
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fbf4ee] text-sm font-black text-[#7b5f52]">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <div class="rounded-full bg-[#2b1b15] px-5 py-2 text-lg font-black text-white shadow-[0_14px_35px_rgba(43,27,21,.16)]">
        ${item.price}
      </div>
    </div>

    <h3 data-gjs-type="text" class="mt-7 font-serif text-3xl font-black tracking-[-0.06em] text-[#2b1b15]">
      ${item.title}
    </h3>

    <p data-gjs-type="text" class="mt-3 text-sm font-black uppercase tracking-[0.12em] text-[#7b5f52]">
      ${item.time}
    </p>

    <p data-gjs-type="text" class="mt-5 text-sm leading-7 text-[#2b1b15]/58">
      ${item.text}
    </p>

    <a data-editable-link="true" href="#booking" class="mt-7 inline-flex rounded-full border border-[#2b1b15]/12 bg-[#fbf4ee] px-6 py-3 text-sm font-black text-[#2b1b15] transition hover:bg-[#2b1b15] hover:text-white">
      Choose Treatment
    </a>
  </div>
</article>`,
    )
    .join("\n");
}

function marqueeHtml() {
  return `
<section data-section-kind="marquee" data-section-title="Services Ticker" class="overflow-hidden border-y border-[#2b1b15]/10 bg-white/60 py-5">
  <div class="chanel-marquee-track flex w-max items-center gap-8">
    ${[
      "Deep Massage",
      "Facial Care",
      "Aromatherapy",
      "Body Scrub",
      "Relaxation",
      "Beauty Ritual",
      "Wellness",
      "Natural Glow",
      "Deep Massage",
      "Facial Care",
      "Aromatherapy",
      "Body Scrub",
      "Relaxation",
      "Beauty Ritual",
      "Wellness",
      "Natural Glow",
    ]
      .map(
        (item) => `
      <div class="flex items-center gap-8">
        <span data-gjs-type="text" class="font-serif text-4xl font-black tracking-[-0.06em] text-[#2b1b15] md:text-6xl">${item}</span>
        <span class="h-3 w-3 rounded-full bg-[#c8977a]"></span>
      </div>
    `,
      )
      .join("")}
  </div>
</section>
`;
}

function pageShell(content: string) {
  return `
<div data-studio-page="true" data-bizuply-site="true" data-template-id="chanel" id="home" class="min-h-screen bg-[#fbf4ee] text-[#2b1b15]">
  ${navHtml()}
  ${content}
  ${footerHtml()}
</div>`;
}

export function createChanelHomeHtml() {
  return pageShell(`
<section data-section-kind="hero" data-section-title="Hero" class="relative overflow-hidden bg-[#fbf4ee] px-5 pb-24 pt-20 lg:pb-28 lg:pt-24">
  <div class="pointer-events-none absolute left-[-160px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#c8977a]/35 blur-3xl chanel-pulse"></div>
  <div class="pointer-events-none absolute bottom-[-180px] right-[-140px] h-[440px] w-[440px] rounded-full bg-[#2b1b15]/10 blur-3xl chanel-pulse"></div>

  <div class="mx-auto max-w-7xl">
    <div class="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
      <div class="text-center lg:text-left">
        <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.36em] text-[#7b5f52]">
          Beauty • Wellness • Relaxation
        </p>

        <h1 data-gjs-type="text" class="chanel-serif mx-auto mt-6 max-w-4xl text-[64px] font-black leading-[0.86] tracking-[-0.085em] text-[#2b1b15] md:text-[104px] lg:mx-0">
          Rejuvenate Your Body and Mind.
        </h1>

        <p data-gjs-type="text" class="mx-auto mt-8 max-w-xl text-lg leading-9 text-[#2b1b15]/60 lg:mx-0">
          Indulge in calming spa therapies that refresh your body, relax your mind and restore your natural glow.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
          <a data-editable-link="true" href="#booking" class="rounded-full bg-[#2b1b15] px-9 py-4 text-sm font-black text-white shadow-[0_20px_45px_rgba(43,27,21,.22)]">
            Book Your Slot
          </a>

          <a data-editable-link="true" href="#gallery" class="rounded-full border border-[#2b1b15]/12 bg-white px-9 py-4 text-sm font-black text-[#2b1b15] shadow-[0_14px_35px_rgba(43,27,21,.06)]">
            View Gallery
          </a>
        </div>
      </div>

      <div>
        <div class="relative mx-auto max-w-[560px]">
          <div class="absolute -left-8 top-10 z-20 hidden rounded-full bg-[#2b1b15] px-6 py-4 text-sm font-black text-white shadow-[0_22px_60px_rgba(43,27,21,.24)] md:block">
            Spa • Facial • Massage
          </div>

          <div class="absolute -right-8 bottom-14 z-20 hidden rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-[0_24px_70px_rgba(43,27,21,.16)] backdrop-blur-2xl md:block">
            <p data-gjs-type="text" class="text-[10px] font-black uppercase tracking-[0.22em] text-[#7b5f52]">Next available</p>
            <p data-gjs-type="text" class="mt-2 text-2xl font-black tracking-[-0.04em] text-[#2b1b15]">Today 18:30</p>
          </div>

          <div class="chanel-card chanel-shine overflow-hidden rounded-[46px] border-10 border-white bg-[#ead9cf] shadow-[0_35px_100px_rgba(43,27,21,.18)]">
            <img data-gjs-type="image" src="${chanelImages.hero}" alt="Chanel spa" class="chanel-image-hover h-[650px] w-full object-cover" />
          </div>

          <div class="absolute -bottom-10 left-16 hidden w-[210px] overflow-hidden rounded-[34px] border-8 border-white bg-[#ead9cf] shadow-[0_26px_80px_rgba(43,27,21,.18)] lg:block">
            <img data-gjs-type="image" src="${chanelImages.facial}" alt="Facial care" class="chanel-image-hover h-[220px] w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${marqueeHtml()}

<section id="services" data-section-kind="services" data-section-title="Services" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-8 lg:grid-cols-[.72fr_1fr] lg:items-end">
      <div>
        <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
          Our Services
        </p>
        <h2 data-gjs-type="text" class="chanel-serif mt-4 text-5xl font-black leading-[.9] tracking-[-0.06em] text-[#2b1b15] md:text-7xl">
          Relaxing wellness therapy session.
        </h2>
      </div>
      <p data-gjs-type="text" class="max-w-2xl text-lg leading-8 text-[#2b1b15]/60">
        Premium spa treatments, massage, facial care and wellness therapy designed for a calm luxury experience.
      </p>
    </div>

    <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${servicesCardsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="about" data-section-title="About" class="bg-[#fbf4ee] px-5 py-24">
  <div class="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.95fr_1.05fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
        About Us
      </p>
      <h2 data-gjs-type="text" class="chanel-serif mt-5 text-5xl font-black leading-[.92] tracking-[-0.06em] text-[#2b1b15] md:text-7xl">
        Your journey to inner peace begins here.
      </h2>
      <p data-gjs-type="text" class="mt-7 text-lg leading-9 text-[#2b1b15]/60">
        Relax and unwind with soothing spa treatments designed to refresh your body, calm your mind and restore balance and beauty from within.
      </p>

      <div class="mt-9 grid gap-4 md:grid-cols-2">
        <div class="chanel-card rounded-[30px] border border-[#2b1b15]/10 bg-white p-7 shadow-[0_20px_65px_rgba(43,27,21,.06)]">
          <p data-gjs-type="text" class="text-xl font-black text-[#2b1b15]">Premium Care</p>
          <p data-gjs-type="text" class="mt-3 text-sm leading-7 text-[#2b1b15]/60">Detailed treatments in a calm and clean environment.</p>
        </div>

        <div class="chanel-card rounded-[30px] border border-[#2b1b15]/10 bg-white p-7 shadow-[0_20px_65px_rgba(43,27,21,.06)]">
          <p data-gjs-type="text" class="text-xl font-black text-[#2b1b15]">Natural Glow</p>
          <p data-gjs-type="text" class="mt-3 text-sm leading-7 text-[#2b1b15]/60">Beauty rituals designed for relaxation, softness and glow.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <div class="chanel-card overflow-hidden rounded-[38px] bg-[#ead9cf] shadow-[0_26px_80px_rgba(43,27,21,.12)]">
        <img data-gjs-type="image" src="${chanelImages.relaxation}" alt="Spa room" class="chanel-image-hover h-[520px] w-full object-cover" />
      </div>
      <div class="chanel-card mt-14 overflow-hidden rounded-[38px] bg-[#ead9cf] shadow-[0_26px_80px_rgba(43,27,21,.12)]">
        <img data-gjs-type="image" src="${chanelImages.oils}" alt="Spa oils" class="chanel-image-hover h-[520px] w-full object-cover" />
      </div>
    </div>
  </div>
</section>

<section id="gallery" data-section-kind="gallery" data-section-title="Gallery" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
          Gallery
        </p>
        <h2 data-gjs-type="text" class="chanel-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2b1b15] md:text-7xl">
          Spa moments.
        </h2>
      </div>
      <p data-gjs-type="text" class="max-w-md text-sm leading-7 text-[#2b1b15]/60">
        Calm spaces, relaxing treatments, soft textures and premium spa visuals.
      </p>
    </div>

    <div class="mt-12 grid auto-rows-[280px] gap-5 md:grid-cols-4">
      ${galleryHtml()}
    </div>
  </div>
</section>

<section id="prices" data-section-kind="prices" data-section-title="Prices" class="bg-[#fffaf7] px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mx-auto max-w-3xl text-center">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
        Pricing
      </p>
      <h2 data-gjs-type="text" class="chanel-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2b1b15] md:text-7xl">
        Chanel pricing plans.
      </h2>
      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#2b1b15]/60">
        Choose the treatment that fits your body, your mood and your wellness routine.
      </p>
    </div>

    <div class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      ${pricesHtml()}
    </div>
  </div>
</section>

<section data-section-kind="testimonials" data-section-title="Testimonials" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-3xl">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
        Testimonials
      </p>
      <h2 data-gjs-type="text" class="chanel-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2b1b15] md:text-7xl">
        Success validated by clients.
      </h2>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      ${testimonialsHtml()}
    </div>
  </div>
</section>

<section data-section-kind="faq" data-section-title="FAQ" class="bg-[#fbf4ee] px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
        FAQ
      </p>
      <h2 data-gjs-type="text" class="chanel-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2b1b15] md:text-7xl">
        Frequently asked questions.
      </h2>
    </div>
    <div class="grid gap-4">
      ${faqHtml()}
    </div>
  </div>
</section>

<section id="booking" data-section-kind="booking" data-section-title="Booking" class="bg-[#2b1b15] px-5 py-24 text-white">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
    <div>
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#c8977a]">
        Booking
      </p>
      <h2 data-gjs-type="text" class="chanel-serif mt-5 text-5xl font-black leading-[.95] tracking-[-0.06em] md:text-7xl">
        Book your next wellness treatment.
      </h2>
      <p data-gjs-type="text" class="mt-7 text-lg leading-9 text-white/60">
        Replace this form later with the real BizUply booking calendar and available hours.
      </p>
    </div>

    <form class="chanel-card rounded-[38px] border border-white/10 bg-white p-7 text-[#2b1b15] shadow-[0_25px_80px_rgba(0,0,0,.22)]">
      <div class="grid gap-4 md:grid-cols-2">
        <input placeholder="Full Name" class="rounded-2xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="Phone" class="rounded-2xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="Preferred Date" class="rounded-2xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="Preferred Time" class="rounded-2xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />
      </div>

      <select class="mt-4 w-full rounded-2xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none">
        <option>Choose Treatment</option>
        <option>Deep Massage</option>
        <option>Radiance Facial</option>
        <option>Aroma Massage</option>
        <option>Relaxation Therapy</option>
        <option>Body Scrub</option>
      </select>

      <textarea placeholder="Message / special request" class="mt-4 min-h-[150px] w-full rounded-2xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none"></textarea>

      <button type="button" class="mt-5 w-full rounded-full bg-[#2b1b15] px-8 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(43,27,21,.18)]">
        Send Request
      </button>
    </form>
  </div>
</section>

<section id="contact" data-section-kind="contact" data-section-title="Contact" class="bg-[#fbf4ee] px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.8fr]">
    <form class="chanel-card rounded-[40px] bg-white p-10 shadow-[0_25px_80px_rgba(43,27,21,.08)]">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">
        Contact
      </p>

      <h2 data-gjs-type="text" class="chanel-serif mt-4 text-5xl font-black tracking-[-0.06em] text-[#2b1b15]">
        Get in touch today.
      </h2>

      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#2b1b15]/60">
        Send a message about treatment, availability, skincare or spa packages.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <input placeholder="Full Name" class="rounded-3xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />
        <input placeholder="Phone" class="rounded-3xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />
      </div>

      <input placeholder="Email" class="mt-4 w-full rounded-3xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none" />

      <textarea placeholder="Write your message here" class="mt-4 min-h-[170px] w-full rounded-3xl border border-[#2b1b15]/10 bg-[#fbf4ee] px-5 py-4 text-sm font-bold outline-none"></textarea>

      <button type="button" class="mt-5 w-full rounded-full bg-[#2b1b15] px-8 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(43,27,21,.18)]">
        Send Message
      </button>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div class="rounded-3xl bg-[#fbf4ee] p-5">
          <p data-gjs-type="text" class="text-sm font-black">Phone</p>
          <p data-gjs-type="text" class="mt-1 text-[#2b1b15]/55">+1 234 567 890</p>
        </div>
        <div class="rounded-3xl bg-[#fbf4ee] p-5">
          <p data-gjs-type="text" class="text-sm font-black">Email</p>
          <p data-gjs-type="text" class="mt-1 text-[#2b1b15]/55">hello@chanelspa.com</p>
        </div>
      </div>
    </form>

    <img data-gjs-type="image" src="${chanelImages.studio}" alt="Chanel spa studio" class="chanel-image-hover h-full min-h-[620px] rounded-[40px] object-cover shadow-[0_25px_80px_rgba(43,27,21,.12)]" />
  </div>
</section>
`);
}

export function createChanelSimplePageHtml(
  title: string,
  eyebrow: string,
  text: string,
  section: string,
) {
  return pageShell(`
<section data-section-kind="${section}" data-section-title="${title}" class="px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1fr]">
    <aside class="h-fit rounded-[38px] border border-[#2b1b15]/10 bg-white p-8 shadow-[0_25px_70px_rgba(43,27,21,.08)]">
      <p data-gjs-type="text" class="text-xs font-black uppercase tracking-[0.32em] text-[#7b5f52]">${eyebrow}</p>
      <h1 data-gjs-type="text" class="chanel-serif mt-5 text-6xl font-black leading-[.95] tracking-[-0.07em] text-[#2b1b15]">
        ${title}
      </h1>
      <p data-gjs-type="text" class="mt-6 text-lg leading-8 text-[#2b1b15]/60">
        ${text}
      </p>
    </aside>

    <main class="rounded-[38px] border border-[#2b1b15]/10 bg-white p-8 shadow-[0_25px_70px_rgba(43,27,21,.08)]">
      <div class="grid gap-6 md:grid-cols-2">
        ${servicesCardsHtml()}
      </div>
    </main>
  </div>
</section>
`);
}

export const chanelEditorPages = [
  {
    id: "home",
    slug: "/",
    title: "Home",
    type: "home",
    isHome: true,
    html: createChanelHomeHtml(),
    css: chanelEditorCss,
  },
  {
    id: "about",
    slug: "/about",
    title: "About",
    type: "about",
    html: createChanelSimplePageHtml(
      "About Chanel Spa",
      "About",
      "A calm premium spa experience with treatments, beauty rituals and wellness care.",
      "about",
    ),
    css: chanelEditorCss,
  },
  {
    id: "services",
    slug: "/services",
    title: "Services",
    type: "services",
    html: createChanelSimplePageHtml(
      "Our Services",
      "Services",
      "Massage, facial care, aromatherapy, relaxation therapy and beauty rituals.",
      "services",
    ),
    css: chanelEditorCss,
  },
  {
    id: "gallery",
    slug: "/gallery",
    title: "Gallery",
    type: "gallery",
    html: createChanelSimplePageHtml(
      "Spa Gallery",
      "Gallery",
      "Calm spaces, treatments, natural products and wellness moments.",
      "gallery",
    ),
    css: chanelEditorCss,
  },
  {
    id: "prices",
    slug: "/prices",
    title: "Pricing",
    type: "pricing",
    html: createChanelSimplePageHtml(
      "Pricing Plans",
      "Pricing",
      "Clear prices for every treatment with premium spa presentation.",
      "prices",
    ),
    css: chanelEditorCss,
  },
  {
    id: "booking",
    slug: "/booking",
    title: "Booking",
    type: "booking",
    html: createChanelSimplePageHtml(
      "Book Appointment",
      "Booking",
      "Choose treatment, preferred date and send a booking request.",
      "booking",
    ),
    css: chanelEditorCss,
  },
  {
    id: "contact",
    slug: "/contact",
    title: "Contact",
    type: "contact",
    html: createChanelSimplePageHtml(
      "Contact",
      "Contact",
      "Questions, availability, treatments and spa packages.",
      "contact",
    ),
    css: chanelEditorCss,
  },
];

export const chanelSeed = {
  id: "chanel",
  key: "chanel",
  rendererKey: "chanel",
  renderMode: "registry",
  editorMode: "renderer",

  name: "Chanel",
  category: "beauty",
  description:
    "תבנית ספא/ביוטי יוקרתית עם Hero גדול, תנועה, טיקר שירותים, שירותים, צוות, מחירון, FAQ וטופס.",
  image: chanelImages.hero,
  thumbnail: chanelImages.hero,

  heroTitle: "Rejuvenate Your Body and Mind",
  heroSubtitle:
    "Luxury spa, massage, facial care and wellness treatments in a calm premium atmosphere.",
  businessName: "Chanel Spa",

  colors: {
    primary: "#2B1B15",
    secondary: "#7B5F52",
    accent: "#C8977A",
    background: "#FBF4EE",
    surface: "#FFFFFF",
    text: "#2B1B15",
    muted: "#8D756B",
    dark: "#1B100C",
  },

  editor: {
    slug: "chanel",
    activePageId: "home",
    css: chanelEditorCss,
    pages: chanelEditorPages.map((page) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      type: page.type,
      isHome: Boolean(page.isHome),
      html: page.html,
      css: page.css || chanelEditorCss,
    })),
  },

  pages: chanelEditorPages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    type: page.type,
    isHome: Boolean(page.isHome),
    html: page.html,
    css: page.css || chanelEditorCss,
  })),

  blocks: [
    {
      id: "chanel-header",
      type: "header",
      variant: "chanel-luxury",
      title: "Header",
      html: navHtml(),
    },
    {
      id: "chanel-hero",
      type: "hero",
      variant: "chanel-hero",
      title: "Hero",
      html: createChanelHomeHtml(),
    },
    {
      id: "chanel-footer",
      type: "footer",
      variant: "chanel-footer",
      title: "Footer",
      html: footerHtml(),
    },
  ],

  css: chanelEditorCss,
} as unknown as ReadyWebsiteTemplateSeed;