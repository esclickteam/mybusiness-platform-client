import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

export type VelmoraPageSection = {
  id: string;
  type:
    | "header"
    | "hero"
    | "collections"
    | "products"
    | "lookbook"
    | "about"
    | "features"
    | "faq"
    | "contact"
    | "footer";
  title: string;
};

export const velmoraPages = [
  {
    id: "home",
    name: "עמוד בית",
    slug: "/",
    sections: [
      "header",
      "hero",
      "collections",
      "products",
      "lookbook",
      "about",
      "features",
      "faq",
      "contact",
      "footer",
    ],
  },
  {
    id: "shop",
    name: "חנות",
    slug: "/shop",
    sections: ["header", "collections", "products", "features", "footer"],
  },
  {
    id: "lookbook",
    name: "לוקבוק",
    slug: "/lookbook",
    sections: ["header", "lookbook", "about", "footer"],
  },
  {
    id: "about",
    name: "אודות",
    slug: "/about",
    sections: ["header", "about", "features", "faq", "footer"],
  },
  {
    id: "contact",
    name: "יצירת קשר",
    slug: "/contact",
    sections: ["header", "contact", "footer"],
  },
];

export const velmoraSections: VelmoraPageSection[] = [
  { id: "header", type: "header", title: "Header" },
  { id: "hero", type: "hero", title: "Hero" },
  { id: "collections", type: "collections", title: "Collections" },
  { id: "products", type: "products", title: "Products" },
  { id: "lookbook", type: "lookbook", title: "Lookbook" },
  { id: "about", type: "about", title: "About" },
  { id: "features", type: "features", title: "Features" },
  { id: "faq", type: "faq", title: "FAQ" },
  { id: "contact", type: "contact", title: "Contact" },
  { id: "footer", type: "footer", title: "Footer" },
];

function Header() {
  return (
    <header dir="rtl" className="sticky top-0 z-50 border-b border-[#e7dfd2] bg-[#fbf7ef]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f241b] text-[#f7ead5]">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-black tracking-[-0.04em] text-[#2f241b]">
              Velmora
            </p>
            <p className="text-xs font-semibold text-[#8b735f]">
              בוטיק אופנה ולייףסטייל
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-bold text-[#6d5a49] lg:flex">
          <a href="#collections" className="hover:text-[#2f241b]">קולקציות</a>
          <a href="#products" className="hover:text-[#2f241b]">פריטים</a>
          <a href="#lookbook" className="hover:text-[#2f241b]">לוקבוק</a>
          <a href="#about" className="hover:text-[#2f241b]">אודות</a>
          <a href="#contact" className="hover:text-[#2f241b]">יצירת קשר</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#products"
            className="hidden rounded-full bg-[#2f241b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4b3828] md:inline-flex"
          >
            לקולקציה החדשה
          </a>

          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7dfd2] bg-white text-[#2f241b] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#fbf7ef]">
      <div className="pointer-events-none absolute left-[-120px] top-12 h-80 w-80 rounded-full bg-[#c9a46d]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-120px] h-96 w-96 rounded-full bg-[#526243]/20 blur-3xl" />

      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e7dfd2] bg-white px-4 py-2 text-sm font-black text-[#6d5a49] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#9a6f3b]" />
            קולקציה חדשה · חורף / אביב
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#2f241b] md:text-7xl">
            אופנה נקייה, מדויקת ויוקרתית ליום־יום שלך.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6d5a49]">
            תבנית בוטיק יוקרתית לחנות בגדים, מותג לייףסטייל או סטודיו עיצוב.
            עם קולקציות, מוצרים, לוקבוק, סיפור מותג וטופס יצירת קשר.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f241b] px-7 py-4 text-sm font-black text-white transition hover:bg-[#4b3828]"
            >
              צפייה בפריטים
              <ArrowLeft className="h-4 w-4" />
            </a>

            <a
              href="#lookbook"
              className="inline-flex items-center justify-center rounded-full border border-[#d8cab9] bg-white px-7 py-4 text-sm font-black text-[#2f241b] transition hover:bg-[#f7ead5]"
            >
              לוקבוק השראה
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-4 pt-10">
            <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
                alt="אופנה בוטיק"
                className="h-64 w-full rounded-[1.5rem] object-cover"
              />
            </div>

            <div className="rounded-[2rem] border border-[#e7dfd2] bg-white p-5 shadow-sm">
              <p className="text-sm font-black text-[#2f241b]">משלוח מהיר</p>
              <p className="mt-2 text-sm leading-6 text-[#6d5a49]">
                חווית רכישה נקייה, ברורה ומוכנה לחנות אונליין.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.6rem] bg-white p-3 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
              alt="דוגמנית עם פריטי אופנה"
              className="h-[560px] w-full rounded-[2.1rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  const collections = [
    {
      title: "Essential",
      text: "פריטים נקיים ליום־יום",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Evening",
      text: "לוקים מוקפדים לערב",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Studio",
      text: "פריטי סטודיו במהדורה מוגבלת",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section id="collections" dir="rtl" className="bg-white px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">
              Collections
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
              קולקציות שמרגישות כמו מותג.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-[#6d5a49]">
            אזורים ברורים להצגת קטגוריות, קולקציות, מבצעים וסגנונות שונים.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <article
              key={collection.title}
              className="group overflow-hidden rounded-[2.2rem] bg-[#fbf7ef] shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-2xl font-black text-[#2f241b]">
                    {collection.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#6d5a49]">
                    {collection.text}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f241b] text-white">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products() {
  const products = [
    {
      name: "שמלת ליאן",
      price: "₪289",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "בלייזר נובה",
      price: "₪420",
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "חולצת אור",
      price: "₪169",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "תיק מילה",
      price: "₪240",
      image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section id="products" dir="rtl" className="bg-[#fbf7ef] px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">
              Shop
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
              פריטים נבחרים.
            </h2>
          </div>

          <a
            href="#contact"
            className="hidden rounded-full border border-[#d8cab9] bg-white px-5 py-3 text-sm font-black text-[#2f241b] transition hover:bg-[#f7ead5] md:inline-flex"
          >
            לכל הפריטים
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="group">
              <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full rounded-[1.5rem] object-cover transition duration-700 group-hover:scale-105"
                />

                <button className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#2f241b] shadow-sm backdrop-blur transition hover:bg-[#2f241b] hover:text-white">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#2f241b]">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#6d5a49]">
                    פריט חדש בקולקציה
                  </p>
                </div>

                <p className="text-lg font-black text-[#2f241b]">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Lookbook() {
  return (
    <section id="lookbook" dir="rtl" className="bg-[#2f241b] px-5 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d7b27a]">
            Lookbook
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-6xl">
            תצוגה ויזואלית שמוכרת סגנון, לא רק מוצר.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            אזור לוקבוק עם תמונות גדולות, תחושת מותג, השראה ללקוחות והכוונה
            לקנייה או השארת פרטים.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80"
            alt="לוקבוק"
            className="h-96 rounded-[2rem] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
            alt="לוקבוק אופנה"
            className="mt-16 h-96 rounded-[2rem] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" dir="rtl" className="bg-white px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="overflow-hidden rounded-[2.6rem]">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
            alt="סטודיו אופנה"
            className="h-[560px] w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">
            About
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
            אתר שמספר את הסיפור של המותג ומוביל לרכישה.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#6d5a49]">
            Velmora מתאימה לחנויות בגדים, סטודיו לעיצוב, מותגי לייףסטייל,
            תכשיטים, אקססוריז וגם נותני שירות שרוצים נראות יוקרתית ונקייה.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "עמוד בית עם תחושת מותג חזקה",
              "קולקציות, מוצרים ולוקבוק מוכנים להצגה",
              "עיצוב עברי מלא, רספונסיבי ונקי",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#526243]" />
                <span className="font-bold text-[#2f241b]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    ["משלוחים", "הצגה ברורה של אפשרויות משלוח והחזרות"],
    ["קולקציות", "חלוקה לפריטים, קטגוריות ומבצעים"],
    ["אמון", "המלצות, שאלות נפוצות וסיפור מותג"],
  ];

  return (
    <section dir="rtl" className="bg-[#fbf7ef] px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {items.map(([title, text]) => (
          <div key={title} className="rounded-[2rem] border border-[#e7dfd2] bg-white p-7">
            <BadgeCheck className="h-7 w-7 text-[#526243]" />
            <h3 className="mt-5 text-2xl font-black text-[#2f241b]">
              {title}
            </h3>
            <p className="mt-3 leading-7 text-[#6d5a49]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    ["האם אפשר להפוך את זה לחנות אמיתית?", "כן. המבנה מתאים לחנות עם מוצרים, קולקציות ודפי פריט."],
    ["אפשר להשתמש בזה גם לנותני שירות?", "כן. אפשר להחליף מוצרים לשירותים, לוקבוק לפרויקטים וטופס רכישה לטופס ליד."],
    ["האם הכל בעברית?", "כן. כל הטקסטים והכיוון מותאמים לעברית ול־RTL."],
  ];

  return (
    <section dir="rtl" className="bg-white px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">
            FAQ
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
            שאלות נפוצות.
          </h2>
        </div>

        <div className="mt-10 grid gap-4">
          {faqs.map(([q, a]) => (
            <div key={q} className="rounded-[1.5rem] border border-[#e7dfd2] bg-[#fbf7ef] p-6">
              <h3 className="text-lg font-black text-[#2f241b]">{q}</h3>
              <p className="mt-2 leading-7 text-[#6d5a49]">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const contactItems: Array<{ icon: React.ElementType; text: string }> = [
    { icon: Phone, text: "03-555-9821" },
    { icon: Mail, text: "hello@velmora.co.il" },
    { icon: MapPin, text: "רחוב הבוטיק 18, תל אביב" },
  ];

  return (
    <section id="contact" dir="rtl" className="bg-[#fbf7ef] px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">
            Contact
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
            רוצה להתאים את התבנית לעסק שלך?
          </h2>

          <div className="mt-10 grid gap-4">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2f241b]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-[#6d5a49]">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <form className="rounded-[2rem] bg-white p-7 shadow-sm">
          <input
            placeholder="שם מלא"
            className="h-14 w-full rounded-2xl border border-[#e7dfd2] px-4 text-sm font-bold outline-none focus:border-[#2f241b]"
          />

          <input
            placeholder="טלפון"
            className="mt-4 h-14 w-full rounded-2xl border border-[#e7dfd2] px-4 text-sm font-bold outline-none focus:border-[#2f241b]"
          />

          <textarea
            placeholder="מה תרצו לבנות?"
            rows={6}
            className="mt-4 w-full resize-none rounded-2xl border border-[#e7dfd2] p-4 text-sm font-bold outline-none focus:border-[#2f241b]"
          />

          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f241b] px-6 py-4 text-sm font-black text-white transition hover:bg-[#4b3828]"
          >
            שליחת פנייה
            <ArrowLeft className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer dir="rtl" className="bg-[#2f241b] px-5 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-lg font-black">Velmora</p>
          <p className="mt-1 text-sm text-white/55">
            תבנית בוטיק יוקרתית לחנות בגדים, לייףסטייל ונותני שירות.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#d7b27a]">
          {[1, 2, 3, 4, 5].map((item) => (
            <Star key={item} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>
    </footer>
  );
}

export function VelmoraPages() {
  return (
    <div className="min-h-screen bg-white text-[#2f241b]">
      <Header />
      <Hero />
      <Collections />
      <Products />
      <Lookbook />
      <About />
      <Features />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

export default VelmoraPages;