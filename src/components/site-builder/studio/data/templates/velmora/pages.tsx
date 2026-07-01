import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Heart,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

export type VelmoraPageId =
  | "home"
  | "about"
  | "shop"
  | "clients"
  | "projects"
  | "custom"
  | "contact"
  | "product";

export type VelmoraPageSection = {
  id: string;
  type:
    | "header"
    | "hero"
    | "about"
    | "shop"
    | "clients"
    | "projects"
    | "custom"
    | "contact"
    | "product"
    | "footer";
  title: string;
};

type VelmoraPageProps = {
  onPageChange: (page: VelmoraPageId) => void;
};

type VelmoraHeaderProps = {
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
};

type CatalogProduct = {
  id: string;
  ref: string;
  name: string;
  category: string;
  price: string;
  image: string;
  dark?: boolean;
};

type ProjectCard = {
  title: string;
  category: string;
  date: string;
  text: string;
  image: string;
};

export const velmoraPages = [
  {
    id: "home",
    name: "Home",
    slug: "/",
    sections: ["header", "hero", "about", "shop", "projects", "footer"],
  },
  {
    id: "about",
    name: "About",
    slug: "/about",
    sections: ["header", "about", "clients", "footer"],
  },
  {
    id: "shop",
    name: "Shop",
    slug: "/shop",
    sections: ["header", "shop", "product", "footer"],
  },
  {
    id: "clients",
    name: "Clients",
    slug: "/clients",
    sections: ["header", "clients", "footer"],
  },
  {
    id: "projects",
    name: "Projects",
    slug: "/projects",
    sections: ["header", "projects", "footer"],
  },
  {
    id: "custom",
    name: "Custom",
    slug: "/custom",
    sections: ["header", "custom", "contact", "footer"],
  },
  {
    id: "contact",
    name: "Contact",
    slug: "/contact",
    sections: ["header", "contact", "footer"],
  },
  {
    id: "product",
    name: "Product",
    slug: "/product",
    sections: ["header", "product", "footer"],
  },
];

export const velmoraSections: VelmoraPageSection[] = [
  { id: "header", type: "header", title: "Header" },
  { id: "hero", type: "hero", title: "Hero" },
  { id: "about", type: "about", title: "About" },
  { id: "shop", type: "shop", title: "Shop" },
  { id: "clients", type: "clients", title: "Clients" },
  { id: "projects", type: "projects", title: "Projects" },
  { id: "custom", type: "custom", title: "Custom" },
  { id: "contact", type: "contact", title: "Contact" },
  { id: "product", type: "product", title: "Product" },
  { id: "footer", type: "footer", title: "Footer" },
];

const navLeft: Array<{ id: VelmoraPageId; top: string; bottom: string }> = [
  { id: "about", top: "ABOUT", bottom: "ABOUT" },
  { id: "shop", top: "SHOP", bottom: "PLANS" },
  { id: "clients", top: "CLIENTS", bottom: "SERVICES" },
];

const navRight: Array<{ id: VelmoraPageId; top: string; bottom: string }> = [
  { id: "projects", top: "PROJECTS", bottom: "PROJECTS" },
  { id: "custom", top: "CUSTOM", bottom: "CLIENTS" },
  { id: "contact", top: "CONTACT", bottom: "CONTACT" },
];

const footerNav: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "shop", label: "SHOP" },
  { id: "clients", label: "CLIENTS" },
  { id: "projects", label: "PROJECTS" },
  { id: "custom", label: "CUSTOM" },
  { id: "contact", label: "CONTACT" },
];

const catalogProducts: CatalogProduct[] = [
  {
    id: "linen-coat",
    ref: "Ref. VLM-248901",
    name: "Linen Sculpt Coat",
    category: "Outerwear",
    price: "₪520",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "soft-dress",
    ref: "Ref. VLM-248902",
    name: "Soft Column Dress",
    category: "Dresses",
    price: "₪340",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "atelier-shirt",
    ref: "Ref. VLM-248903",
    name: "Atelier White Shirt",
    category: "Shirts",
    price: "₪190",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "black-set",
    ref: "Ref. VLM-248904",
    name: "Black Studio Set",
    category: "Sets",
    price: "₪460",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=90",
    dark: true,
  },
  {
    id: "resort-bag",
    ref: "Ref. VLM-248905",
    name: "Resort Leather Bag",
    category: "Accessories",
    price: "₪260",
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "cream-look",
    ref: "Ref. VLM-248906",
    name: "Cream Editorial Look",
    category: "Editorial",
    price: "₪390",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "tailored-vest",
    ref: "Ref. VLM-248907",
    name: "Tailored Minimal Vest",
    category: "Tailoring",
    price: "₪230",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=90",
  },
  {
    id: "green-knit",
    ref: "Ref. VLM-248908",
    name: "Olive Knit Piece",
    category: "Knitwear",
    price: "₪210",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=90",
    dark: true,
  },
];

const projects: ProjectCard[] = [
  {
    title: "The Urban Capsule",
    category: "Fashion direction",
    date: "June 17, 2026",
    text: "A clean capsule wardrobe built around soft tailoring, calm colors and everyday elegance.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "Studio Morning",
    category: "Editorial campaign",
    date: "June 17, 2026",
    text: "A visual story for a boutique collection, combining neutral fabrics with strong silhouettes.",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=90",
  },
  {
    title: "Private Styling",
    category: "Client service",
    date: "June 17, 2026",
    text: "A personal styling experience for clients who want a full wardrobe that feels effortless.",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=90",
  },
];

function Header({ activePage, onPageChange }: VelmoraHeaderProps) {
  function NavButton({
    id,
    top,
    bottom,
  }: {
    id: VelmoraPageId;
    top: string;
    bottom: string;
  }) {
    const active = activePage === id;

    return (
      <button
        type="button"
        onClick={() => onPageChange(id)}
        className={[
          "group flex flex-col items-center leading-none transition",
          active ? "text-black" : "text-neutral-500 hover:text-black",
        ].join(" ")}
      >
        <span className="text-[13px] font-black uppercase tracking-[-0.03em]">
          {top}
        </span>
        <span className="mt-1 text-[13px] font-black uppercase tracking-[-0.03em]">
          {bottom}
        </span>
        <span
          className={[
            "mt-2 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full",
            active ? "w-full" : "",
          ].join(" ")}
        />
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f1e8]/95 backdrop-blur-xl">
      <div className="mx-auto grid h-[92px] max-w-[1720px] grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8">
        <nav className="hidden items-center justify-start gap-9 xl:flex">
          {navLeft.map((item) => (
            <NavButton key={item.id} {...item} />
          ))}
        </nav>

        <div className="flex items-center justify-start gap-3 xl:hidden">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-black"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onPageChange("home")}
          className="relative flex h-[70px] w-[170px] items-center justify-center overflow-hidden rounded-full border border-black bg-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]"
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.26),transparent_48%)]" />
          <span className="relative text-center text-[28px] font-black lowercase leading-none tracking-[-0.08em]">
            velmora
          </span>
        </button>

        <nav className="hidden items-center justify-end gap-9 xl:flex">
          {navRight.map((item) => (
            <NavButton key={item.id} {...item} />
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 xl:hidden">
          <button
            type="button"
            onClick={() => onPageChange("shop")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function TextButton({
  children,
  onClick,
  dark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-[12px] font-black uppercase tracking-[-0.02em] transition duration-300",
        dark
          ? "bg-black text-white hover:bg-neutral-800"
          : "border border-black/15 bg-white text-black hover:border-black hover:bg-black hover:text-white",
      ].join(" ")}
    >
      {children}
      <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
    </button>
  );
}

function ProductTile({
  product,
  onClick,
  size = "normal",
}: {
  product: CatalogProduct;
  onClick: () => void;
  size?: "small" | "normal" | "wide";
}) {
  const heightClass =
    size === "small" ? "h-[230px]" : size === "wide" ? "h-[430px]" : "h-[330px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex flex-col overflow-hidden rounded-[2px] border border-black/10 bg-white text-left transition duration-500 hover:-translate-y-2 hover:border-black hover:shadow-[0_30px_80px_rgba(0,0,0,0.18)]",
        product.dark ? "bg-black text-white" : "",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex items-center justify-center overflow-hidden",
          product.dark ? "bg-black" : "bg-[#eee9df]",
          heightClass,
        ].join(" ")}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/20" />

        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg backdrop-blur transition duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 p-4">
        <div>
          <p
            className={[
              "text-[12px] font-black uppercase tracking-[-0.03em]",
              product.dark ? "text-white/60" : "text-neutral-500",
            ].join(" ")}
          >
            {product.ref}
          </p>
          <h3 className="mt-2 text-[16px] font-black uppercase tracking-[-0.04em]">
            {product.name}
          </h3>
        </div>

        <p className="text-[14px] font-black">{product.price}</p>
      </div>
    </button>
  );
}

function Hero({ onPageChange }: VelmoraPageProps) {
  return (
    <section className="overflow-hidden bg-[#f5f1e8]">
      <div className="mx-auto max-w-[1720px] px-5 pb-20 pt-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.2fr_0.72fr]">
          <div className="flex flex-col justify-between gap-6 pt-6">
            <div>
              <p className="text-[15px] font-black uppercase tracking-[-0.05em] text-neutral-700">
                Fashion Design & Curated Clothing
              </p>

              <h1 className="mt-5 max-w-[430px] text-[70px] font-black lowercase leading-[0.75] tracking-[-0.105em] text-black md:text-[96px] lg:text-[118px]">
                velmora atelier
              </h1>

              <p className="mt-7 max-w-[420px] text-[17px] font-medium leading-7 text-neutral-600">
                A refined clothing catalog for modern boutiques, combining
                quiet silhouettes, editorial product cards and a clean shopping
                experience.
              </p>

              <div className="mt-8">
                <TextButton dark onClick={() => onPageChange("shop")}>
                  SEE COLLECTION
                </TextButton>
              </div>
            </div>

            <ProductTile
              product={catalogProducts[0]}
              size="small"
              onClick={() => onPageChange("product")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {catalogProducts.slice(1, 7).map((product, index) => (
              <div
                key={product.id}
                className={[
                  index === 0 ? "md:pt-20" : "",
                  index === 1 ? "md:pt-4" : "",
                  index === 2 ? "md:pt-28" : "",
                  index === 3 ? "md:pt-12" : "",
                  index === 4 ? "md:-mt-10" : "",
                  index === 5 ? "md:mt-12" : "",
                ].join(" ")}
              >
                <ProductTile
                  product={product}
                  size={index % 2 === 0 ? "normal" : "small"}
                  onClick={() => onPageChange("product")}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-6 pt-10">
            <ProductTile
              product={catalogProducts[7]}
              size="normal"
              onClick={() => onPageChange("product")}
            />

            <div className="border-y border-black/15 py-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-neutral-500">
                  Cart
                </p>
                <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-black">
                  0
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-neutral-500">
                  Studio
                </p>
                <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-black">
                  TLV
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-neutral-500">
                  Drop
                </p>
                <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-black">
                  28A324
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onPageChange("custom")}
              className="group flex items-center justify-between border border-black bg-black px-5 py-5 text-left text-white transition hover:bg-white hover:text-black"
            >
              <span>
                <span className="block text-[13px] font-black uppercase tracking-[-0.04em]">
                  Custom styling
                </span>
                <span className="mt-1 block text-[12px] font-medium text-current/60">
                  Create a full wardrobe plan.
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ onPageChange }: VelmoraPageProps) {
  return (
    <section className="border-y border-black/10 bg-white">
      <div className="mx-auto grid max-w-[1720px] gap-8 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-[15px] font-black uppercase tracking-[-0.05em] text-neutral-500">
            About Velmora
          </p>
          <h2 className="mt-4 max-w-[540px] text-[58px] font-black lowercase leading-[0.82] tracking-[-0.09em] text-black md:text-[86px]">
            timeless style, made to belong
          </h2>
        </div>

        <div>
          <p className="max-w-[760px] text-[24px] font-medium leading-[1.25] tracking-[-0.045em] text-black md:text-[34px]">
            Velmora creates clothing that balances quiet elegance with everyday
            comfort, bringing refined pieces into a modern wardrobe.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Premium fabrics", "Soft, selected materials with clean finishing."],
              ["02", "Editorial catalog", "Product cards that feel like a premium magazine."],
              ["03", "Modern shopping", "Shop, product page, custom styling and contact."],
            ].map(([num, title, text]) => (
              <div key={num} className="border border-black/10 bg-[#f5f1e8] p-6">
                <p className="text-[12px] font-black uppercase text-neutral-500">
                  {num}
                </p>
                <h3 className="mt-6 text-[22px] font-black lowercase tracking-[-0.06em]">
                  {title}
                </h3>
                <p className="mt-3 text-[14px] font-medium leading-6 text-neutral-600">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <TextButton onClick={() => onPageChange("about")}>
              ABOUT THE ATELIER
            </TextButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopSection({ onPageChange }: VelmoraPageProps) {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="mx-auto max-w-[1720px] px-5 py-24 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[15px] font-black uppercase tracking-[-0.05em] text-neutral-500">
              Shop Pieces
            </p>
            <h2 className="mt-4 text-[70px] font-black lowercase leading-[0.82] tracking-[-0.09em] text-black md:text-[108px]">
              collection
            </h2>
          </div>

          <TextButton onClick={() => onPageChange("shop")}>
            VIEW ALL ITEMS
          </TextButton>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalogProducts.slice(0, 4).map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              onClick={() => onPageChange("product")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightSection() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto grid max-w-[1720px] gap-8 px-5 py-24 lg:grid-cols-[1fr_1fr_1fr] lg:px-8">
        {[
          ["Élan", "Defined by soft sophistication, Velmora pieces blend refined materials and clean silhouettes."],
          ["Vogue", "Inspired by the language of fashion, our collection combines timeless elegance with contemporary form."],
          ["Atelier", "Rooted in craft and fit, each piece is created to bring balance, comfort and lasting beauty."],
        ].map(([title, text]) => (
          <article key={title} className="border border-white/15 p-8">
            <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-white/40">
              insights from
            </p>
            <h3 className="mt-4 text-[54px] font-black lowercase leading-none tracking-[-0.08em]">
              {title}
            </h3>
            <p className="mt-8 text-[17px] font-medium leading-7 text-white/65">
              {text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ onPageChange }: VelmoraPageProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1720px] px-5 py-24 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[15px] font-black uppercase tracking-[-0.05em] text-neutral-500">
              Projects
            </p>
            <h2 className="mt-4 text-[62px] font-black uppercase leading-[0.86] tracking-[-0.08em] text-black md:text-[96px]">
              fashion design projects
            </h2>
          </div>

          <TextButton onClick={() => onPageChange("projects")}>
            ALL PROJECTS
          </TextButton>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project.title}
              type="button"
              onClick={() => onPageChange("projects")}
              className="group border border-black/10 bg-[#f5f1e8] text-left transition duration-500 hover:-translate-y-2 hover:border-black hover:shadow-[0_30px_90px_rgba(0,0,0,0.14)]"
            >
              <div className="overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-[330px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-4 text-[12px] font-black uppercase tracking-[-0.03em] text-neutral-500">
                  <span>{project.date}</span>
                  <span>{project.category}</span>
                </div>

                <h3 className="mt-6 text-[32px] font-black leading-[0.95] tracking-[-0.07em] text-black">
                  {project.title}
                </h3>

                <p className="mt-5 text-[15px] font-medium leading-6 text-neutral-600">
                  {project.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ onPageChange }: VelmoraPageProps) {
  return (
    <main>
      <Hero onPageChange={onPageChange} />
      <AboutSection onPageChange={onPageChange} />
      <ShopSection onPageChange={onPageChange} />
      <InsightSection />
      <ProjectsSection onPageChange={onPageChange} />
      <NewsletterSection />
    </main>
  );
}

function AboutPage({ onPageChange }: VelmoraPageProps) {
  return (
    <main className="bg-[#f5f1e8]">
      <InnerHero
        label="About"
        title="our story"
        text="Velmora was founded with a simple belief: clothing should be more than seasonal — it should create a clear, personal and lasting wardrobe."
        onButtonClick={() => onPageChange("shop")}
        buttonText="SEE COLLECTION"
      />

      <section className="mx-auto grid max-w-[1720px] gap-5 px-5 pb-24 lg:grid-cols-2 lg:px-8">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=90"
          alt="Velmora studio"
          className="h-[620px] w-full object-cover"
        />
        <div className="flex flex-col justify-between bg-white p-8">
          <p className="text-[30px] font-medium leading-[1.18] tracking-[-0.055em]">
            From first sketch to final fitting, every garment reflects our
            commitment to form, comfort and quiet confidence.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              "Exceptional fabrics with a soft hand feel.",
              "Clean silhouettes for daily wear and special moments.",
              "A full catalog structure for online shopping.",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 border-t border-black/10 pt-4">
                <BadgeCheck className="h-5 w-5" />
                <span className="text-[15px] font-black uppercase tracking-[-0.03em]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InsightSection />
    </main>
  );
}

function ShopPage({ onPageChange }: VelmoraPageProps) {
  return (
    <main className="bg-[#f5f1e8]">
      <InnerHero
        label="Shop"
        title="shop collection"
        text="Browse selected clothing pieces, editorial looks and accessories built for a refined wardrobe."
        onButtonClick={() => onPageChange("custom")}
        buttonText="CUSTOM STYLING"
      />

      <section className="mx-auto max-w-[1720px] px-5 pb-24 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-3">
          {["ALL", "DRESSES", "OUTERWEAR", "SHIRTS", "SETS", "ACCESSORIES"].map(
            (item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-black/15 bg-white px-5 py-3 text-[12px] font-black uppercase tracking-[-0.03em] transition hover:bg-black hover:text-white"
              >
                {item}
              </button>
            )
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalogProducts.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              onClick={() => onPageChange("product")}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductPage({ onPageChange }: VelmoraPageProps) {
  const product = catalogProducts[1];

  return (
    <main className="bg-[#f5f1e8]">
      <section className="mx-auto grid max-w-[1720px] gap-5 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <img
            src={product.image}
            alt={product.name}
            className="h-[760px] w-full object-cover"
          />

          <div className="grid gap-5">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=90"
              alt="Product detail"
              className="h-[370px] w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=90"
              alt="Product detail"
              className="h-[370px] w-full object-cover"
            />
          </div>
        </div>

        <div className="sticky top-[110px] h-fit bg-white p-8">
          <p className="text-[12px] font-black uppercase tracking-[-0.03em] text-neutral-500">
            {product.ref}
          </p>

          <h1 className="mt-5 text-[72px] font-black lowercase leading-[0.8] tracking-[-0.1em] text-black md:text-[102px]">
            {product.name}
          </h1>

          <p className="mt-8 text-[28px] font-black">{product.price}</p>

          <p className="mt-6 text-[17px] font-medium leading-7 text-neutral-600">
            A refined fashion piece with clean proportions, soft movement and
            an editorial silhouette. This product page includes gallery, sizes,
            quantity and checkout action.
          </p>

          <div className="mt-8">
            <p className="text-[12px] font-black uppercase tracking-[-0.03em]">
              Size
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {["XS", "S", "M", "L"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white text-[12px] font-black transition hover:bg-black hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              className="flex h-13 w-13 items-center justify-center rounded-full border border-black/15 bg-white p-4"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="flex h-13 min-w-16 items-center justify-center rounded-full border border-black/15 bg-white px-5 text-[13px] font-black">
              1
            </div>

            <button
              type="button"
              className="flex h-13 w-13 items-center justify-center rounded-full border border-black/15 bg-white p-4"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-[12px] font-black uppercase tracking-[-0.03em] text-white transition hover:bg-neutral-800"
          >
            Add to cart
            <ShoppingBag className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange("shop")}
            className="mt-3 flex h-14 w-full items-center justify-center rounded-full border border-black/15 bg-white text-[12px] font-black uppercase tracking-[-0.03em] transition hover:bg-black hover:text-white"
          >
            Back to shop
          </button>
        </div>
      </section>
    </main>
  );
}

function ClientsPage() {
  return (
    <main className="bg-[#f5f1e8]">
      <InnerHero
        label="Clients Services"
        title="private clients"
        text="A styling and wardrobe service for clients who want pieces selected with care, balance and long-term use in mind."
        buttonText="REQUEST STYLING"
      />

      <section className="mx-auto grid max-w-[1720px] gap-5 px-5 pb-24 lg:grid-cols-3 lg:px-8">
        {[
          ["01", "Personal wardrobe", "A curated selection built around your lifestyle."],
          ["02", "Event styling", "Looks prepared for shoots, evenings and business events."],
          ["03", "Boutique service", "A full client experience from discovery to fitting."],
        ].map(([num, title, text]) => (
          <article key={num} className="bg-white p-8">
            <p className="text-[12px] font-black uppercase text-neutral-500">
              {num}
            </p>
            <h2 className="mt-10 text-[44px] font-black lowercase leading-[0.9] tracking-[-0.08em]">
              {title}
            </h2>
            <p className="mt-6 text-[16px] font-medium leading-7 text-neutral-600">
              {text}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}

function ProjectsPage({ onPageChange }: VelmoraPageProps) {
  return (
    <main>
      <InnerHero
        label="Projects"
        title="editorial projects"
        text="Campaigns, lookbooks and private wardrobe projects shaped with quiet design and precise styling."
        onButtonClick={() => onPageChange("custom")}
        buttonText="CUSTOM PROJECT"
      />

      <ProjectsSection onPageChange={onPageChange} />
    </main>
  );
}

function CustomPage({ onPageChange }: VelmoraPageProps) {
  return (
    <main className="bg-black text-white">
      <section className="mx-auto grid max-w-[1720px] gap-8 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-[15px] font-black uppercase tracking-[-0.05em] text-white/50">
            Custom clients
          </p>
          <h1 className="mt-5 text-[72px] font-black lowercase leading-[0.78] tracking-[-0.1em] md:text-[118px]">
            custom pieces and styling
          </h1>

          <p className="mt-8 max-w-[540px] text-[19px] font-medium leading-8 text-white/65">
            We create your dream wardrobe plan. Fill out the form and tell us
            exactly what you need.
          </p>

          <button
            type="button"
            onClick={() => onPageChange("contact")}
            className="mt-10 inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 text-[12px] font-black uppercase text-black"
          >
            Take me there
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=90"
            alt="Custom styling"
            className="h-[540px] w-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=90"
            alt="Atelier"
            className="mt-20 h-[540px] w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="bg-[#f5f1e8]">
      <InnerHero
        label="Contact"
        title="contact velmora"
        text="Tell us what you want to build, buy or style. This contact page is ready for boutique stores, fashion studios and premium service providers."
        buttonText="SEND MESSAGE"
      />

      <section className="mx-auto grid max-w-[1720px] gap-8 px-5 pb-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="bg-white p-8">
          {[
            { icon: Phone, text: "+972 3 555 9821" },
            { icon: Mail, text: "hello@velmora.co.il" },
            { icon: MapPin, text: "18 Boutique Street, Tel Aviv" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.text} className="flex items-center gap-4 border-b border-black/10 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[15px] font-black uppercase tracking-[-0.03em]">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <form className="bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="First name"
              className="h-14 border border-black/15 px-4 text-[13px] font-black uppercase outline-none focus:border-black"
            />
            <input
              placeholder="Last name"
              className="h-14 border border-black/15 px-4 text-[13px] font-black uppercase outline-none focus:border-black"
            />
          </div>

          <input
            placeholder="Email address"
            className="mt-4 h-14 w-full border border-black/15 px-4 text-[13px] font-black uppercase outline-none focus:border-black"
          />

          <textarea
            rows={8}
            placeholder="Message"
            className="mt-4 w-full resize-none border border-black/15 p-4 text-[13px] font-black uppercase outline-none focus:border-black"
          />

          <button
            type="button"
            className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-black text-[12px] font-black uppercase tracking-[-0.03em] text-white"
          >
            Submit
            <ArrowLeft className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  );
}

function InnerHero({
  label,
  title,
  text,
  buttonText,
  onButtonClick,
}: {
  label: string;
  title: string;
  text: string;
  buttonText: string;
  onButtonClick?: () => void;
}) {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="mx-auto max-w-[1720px] px-5 py-20 lg:px-8">
        <p className="text-[15px] font-black uppercase tracking-[-0.05em] text-neutral-500">
          {label}
        </p>

        <div className="mt-5 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <h1 className="text-[74px] font-black lowercase leading-[0.78] tracking-[-0.105em] text-black md:text-[124px]">
            {title}
          </h1>

          <div>
            <p className="max-w-[520px] text-[20px] font-medium leading-8 text-neutral-600">
              {text}
            </p>

            <div className="mt-8">
              <TextButton dark onClick={onButtonClick}>
                {buttonText}
              </TextButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="border-y border-black/10 bg-[#f5f1e8]">
      <div className="mx-auto grid max-w-[1720px] gap-8 px-5 py-20 lg:grid-cols-[1fr_1fr] lg:px-8">
        <h2 className="text-[58px] font-black lowercase leading-[0.82] tracking-[-0.09em] text-black md:text-[92px]">
          discover the latest news
        </h2>

        <div>
          <div className="flex border border-black bg-white">
            <input
              placeholder="Email Address"
              className="h-16 min-w-0 flex-1 px-5 text-[13px] font-black uppercase outline-none"
            />
            <button
              type="button"
              className="h-16 bg-black px-8 text-[12px] font-black uppercase text-white"
            >
              Submit
            </button>
          </div>

          <p className="mt-4 text-[12px] font-medium leading-6 text-neutral-500">
            By clicking submit you agree to receive marketing emails and
            notifications.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer({ onPageChange }: VelmoraPageProps) {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1720px] px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr_0.8fr]">
          <div>
            <button
              type="button"
              onClick={() => onPageChange("home")}
              className="text-[54px] font-black lowercase leading-none tracking-[-0.1em]"
            >
              velmora
            </button>
            <p className="mt-4 max-w-[360px] text-[14px] font-medium leading-6 text-white/55">
              A Luc-inspired fashion catalog template for premium clothing,
              styling services and boutique ecommerce.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {footerNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onPageChange(item.id)}
                className="border border-white/15 px-4 py-4 text-left text-[12px] font-black uppercase tracking-[-0.03em] text-white/70 transition hover:bg-white hover:text-black"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-start justify-start gap-2 lg:justify-end">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} className="h-4 w-4 fill-current text-white" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function CurrentPage({
  activePage,
  onPageChange,
}: {
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  if (activePage === "about") {
    return <AboutPage onPageChange={onPageChange} />;
  }

  if (activePage === "shop") {
    return <ShopPage onPageChange={onPageChange} />;
  }

  if (activePage === "clients") {
    return <ClientsPage />;
  }

  if (activePage === "projects") {
    return <ProjectsPage onPageChange={onPageChange} />;
  }

  if (activePage === "custom") {
    return <CustomPage onPageChange={onPageChange} />;
  }

  if (activePage === "contact") {
    return <ContactPage />;
  }

  if (activePage === "product") {
    return <ProductPage onPageChange={onPageChange} />;
  }

  return <HomePage onPageChange={onPageChange} />;
}

export function VelmoraPages() {
  const [activePage, setActivePage] = React.useState<VelmoraPageId>("home");

  function handlePageChange(page: VelmoraPageId) {
    setActivePage(page);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] font-sans text-black">
      <Header activePage={activePage} onPageChange={handlePageChange} />
      <CurrentPage activePage={activePage} onPageChange={handlePageChange} />
      <Footer onPageChange={handlePageChange} />
    </div>
  );
}

export default VelmoraPages;