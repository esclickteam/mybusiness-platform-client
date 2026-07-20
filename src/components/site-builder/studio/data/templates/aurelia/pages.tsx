import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { aureliaDefaultData } from "./defaultData";

export const aureliaPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "menu", label: "התפריט", slug: "/menu" },
  { id: "about", label: "הסיפור", slug: "/about" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "contact", label: "הזמנת שולחן", slug: "/contact" },
];

type AureliaPagesProps = {
  initialPage?: string;
  page?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (aureliaDefaultData as Record<string, any>)[key] ?? "";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "menu") return getValue(data, "navMenu");
  if (type === "about") return getValue(data, "navAbout");
  if (type === "gallery") return getValue(data, "navGallery");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("mx-auto max-w-3xl", center ? "text-center" : "text-right")}>
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/30 bg-[#c9a24b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a24b]">
        {eyebrow}
      </p>
      <h2 className="font-serif text-4xl font-semibold leading-[1.08] text-[#f5eee1] md:text-6xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-5 text-lg leading-8 text-[#cdbfa6]">{text}</p>
      ) : null}
    </div>
  );
}

function Header({
  data,
  currentPage,
  setCurrentPage,
  openBooking,
}: {
  data: Record<string, any>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openBooking: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    ["home", getValue(data, "navHome")],
    ["menu", getValue(data, "navMenu")],
    ["about", getValue(data, "navAbout")],
    ["gallery", getValue(data, "navGallery")],
    ["contact", getValue(data, "navContact")],
  ];

  function handleNavigate(id: string) {
    setCurrentPage(id);
    setMobileOpen(false);
  }

  return (
    <header
      data-visual-flow-lock="true"
      data-template-section-type="header"
      data-section-kind="header"
      className="sticky top-0 z-50 border-b border-[#c9a24b]/12 bg-[#14100d]/88 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a24b]/40 bg-[#1d1712] font-serif text-lg font-semibold text-[#c9a24b] transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>
          <span className="font-serif text-xl font-semibold tracking-wide text-[#f5eee1]">
            {getValue(data, "brandName")}
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-[#c9a24b]/15 bg-[#1a1510]/70 p-1 lg:flex">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                currentPage === id
                  ? "bg-[#c9a24b] text-[#14100d]"
                  : "text-[#cdbfa6] hover:text-[#f5eee1]",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openBooking}
            className="hidden rounded-full bg-[#c9a24b] px-5 py-3 text-sm font-semibold text-[#14100d] shadow-lg shadow-[#c9a24b]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8b45f] sm:inline-flex"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a24b]/25 bg-[#1a1510] text-[#c9a24b] lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#c9a24b]/12 bg-[#14100d]/97 px-5 pb-5 lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-[#c9a24b]/12 bg-[#1a1510] p-2">
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={cx(
                  "rounded-2xl px-4 py-3 text-right text-sm font-semibold transition",
                  currentPage === id
                    ? "bg-[#c9a24b] text-[#14100d]"
                    : "text-[#cdbfa6] hover:bg-[#221a12]",
                )}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="rounded-2xl bg-[#c9a24b] px-4 py-3 text-sm font-semibold text-[#14100d]"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function BookingModal({
  data,
  open,
  onClose,
}: {
  data: Record<string, any>;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[38px] border border-[#c9a24b]/25 bg-[#181310] shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-[#c9a24b]/15 text-xl font-semibold text-[#c9a24b] transition hover:scale-105"
        >
          ×
        </button>

        <div className="relative z-10 grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className="bg-cover bg-center p-8 lg:p-10"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,16,13,0.35), rgba(20,16,13,0.9)), url(" +
                getValue(data, "heroImage") +
                ")",
            }}
          >
            <p className="inline-flex rounded-full bg-[#c9a24b]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a24b]">
              הזמנת שולחן
            </p>
            <h3 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] text-[#f5eee1] md:text-5xl">
              נשמור לכם ערב מושלם.
            </h3>
            <p className="mt-5 text-base leading-7 text-[#e6dcc8]">
              {getValue(data, "hours")}
            </p>
            <div className="mt-8 grid gap-3">
              {["אישור מיידי בטלפון", "התאמת יינות לפי המנות", "אפשרות לערב שף פרטי"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#c9a24b]/15 bg-black/20 px-4 py-3 text-sm font-semibold text-[#e6dcc8]"
                  >
                    ✦ {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <form className="p-6 lg:p-10">
            <div className="grid gap-4">
              <input
                className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
                placeholder="שם מלא"
              />
              <input
                className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
                placeholder="טלפון"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
                  placeholder="תאריך"
                />
                <input
                  className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
                  placeholder="שעה"
                />
              </div>
              <select className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition focus:border-[#c9a24b]">
                <option>מספר סועדים</option>
                <option>2 סועדים</option>
                <option>3-4 סועדים</option>
                <option>5-6 סועדים</option>
                <option>7+ / אירוע</option>
              </select>
              <textarea
                className="min-h-24 rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
                placeholder="בקשות מיוחדות"
              />
              <button
                type="button"
                className="rounded-full bg-[#c9a24b] px-7 py-4 text-base font-semibold text-[#14100d] shadow-lg shadow-[#c9a24b]/20 transition hover:-translate-y-0.5 hover:bg-[#d8b45f]"
              >
                {getValue(data, "contactButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Hero({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];

  return (
    <section className="relative isolate overflow-hidden px-5 pb-24 pt-14 lg:px-8 lg:pb-32 lg:pt-20">
      <div className="absolute left-[6%] top-16 -z-10 h-72 w-72 rounded-full bg-[#c9a24b]/12 blur-3xl" />
      <div className="absolute right-[8%] top-[46%] -z-10 h-80 w-80 rounded-full bg-[#7a3b1d]/18 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/30 bg-[#c9a24b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a24b]">
            {getValue(data, "heroEyebrow")}
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-[#f5eee1] md:text-7xl lg:text-[5.4rem]">
            {getValue(data, "heroTitle")}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#cdbfa6] md:text-xl">
            {getValue(data, "heroSubtitle")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="rounded-full bg-[#c9a24b] px-7 py-4 text-base font-semibold text-[#14100d] shadow-2xl shadow-[#c9a24b]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8b45f]"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
            <button
              type="button"
              onClick={() => goTo("menu")}
              className="rounded-full border border-[#c9a24b]/30 px-7 py-4 text-base font-semibold text-[#f5eee1] transition duration-300 hover:-translate-y-0.5 hover:bg-[#c9a24b]/10"
            >
              {getValue(data, "heroSecondaryButton")}
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([num, label]) => (
              <div
                key={label}
                className="group rounded-3xl border border-[#c9a24b]/15 bg-[#1a1510]/70 p-4 text-center transition duration-500 hover:-translate-y-2 hover:border-[#c9a24b]/40"
              >
                <div className="font-serif text-3xl font-semibold text-[#c9a24b]">{num}</div>
                <div className="mt-1 text-xs font-semibold text-[#a2957c]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[560px]">
          <div className="group absolute inset-0 overflow-hidden rounded-[46px] border border-[#c9a24b]/20 bg-[#1a1510] p-3 shadow-2xl shadow-black/40">
            <img
              src={getValue(data, "heroImage")}
              alt=""
              className="h-full min-h-[540px] w-full rounded-[36px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[36px] bg-gradient-to-t from-[#14100d]/70 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 right-8 max-w-[280px] rounded-[30px] border border-[#c9a24b]/25 bg-[#181310]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <p className="font-serif text-lg font-semibold text-[#f5eee1]">
              {getValue(data, "heroCardTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#cdbfa6]">
              {getValue(data, "heroCardText")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ data }: { data: Record<string, any> }) {
  const points = [
    ["חומרי גלם", "עונתיים, מקומיים וטריים בכל בוקר"],
    ["מטבח פתוח", "שקיפות מלאה מהאש ועד הצלחת"],
    ["אירוח חם", "שירות אישי שמרגיש כמו בבית"],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionTitle
            eyebrow={getValue(data, "aboutEyebrow")}
            title={getValue(data, "aboutTitle")}
            text={getValue(data, "aboutText")}
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {points.map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-[#c9a24b]/15 bg-[#1a1510]/70 p-5 transition duration-500 hover:-translate-y-2 hover:border-[#c9a24b]/40"
              >
                <p className="font-serif text-lg font-semibold text-[#c9a24b]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#cdbfa6]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-5 -top-5 h-full w-full rounded-[44px] border border-[#c9a24b]/15" />
          <div className="group relative overflow-hidden rounded-[44px] border border-[#c9a24b]/20 bg-[#1a1510] p-3 shadow-2xl shadow-black/40">
            <img
              src={getValue(data, "aboutImage")}
              alt=""
              className="h-[540px] w-full rounded-[34px] object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[34px] bg-gradient-to-t from-[#14100d]/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({
  data,
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const dishes = [
    [getValue(data, "dishOneName"), getValue(data, "dishOnePrice"), getValue(data, "dishOneText")],
    [getValue(data, "dishTwoName"), getValue(data, "dishTwoPrice"), getValue(data, "dishTwoText")],
    [getValue(data, "dishThreeName"), getValue(data, "dishThreePrice"), getValue(data, "dishThreeText")],
    [getValue(data, "dishFourName"), getValue(data, "dishFourPrice"), getValue(data, "dishFourText")],
    [getValue(data, "dishFiveName"), getValue(data, "dishFivePrice"), getValue(data, "dishFiveText")],
    [getValue(data, "dishSixName"), getValue(data, "dishSixPrice"), getValue(data, "dishSixText")],
  ];

  return (
    <section className="relative overflow-hidden px-5 py-24 lg:px-8 lg:py-32">
      <div className="absolute right-[10%] top-16 -z-10 h-64 w-64 rounded-full bg-[#c9a24b]/10 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "menuEyebrow")}
          title={getValue(data, "menuTitle")}
        />

        <div className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {dishes.map(([name, price, text], index) => (
            <div
              key={name + index}
              className="group flex flex-col gap-2 border-b border-dashed border-[#c9a24b]/20 pb-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl font-semibold text-[#f5eee1] transition duration-300 group-hover:text-[#c9a24b]">
                  {name}
                </h3>
                <span className="shrink-0 font-serif text-2xl font-semibold text-[#c9a24b]">
                  {price}
                </span>
              </div>
              <p className="text-sm leading-6 text-[#cdbfa6]">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={openBooking}
            className="rounded-full bg-[#c9a24b] px-8 py-4 text-base font-semibold text-[#14100d] shadow-lg shadow-[#c9a24b]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8b45f]"
          >
            {getValue(data, "heroPrimaryButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ data }: { data: Record<string, any> }) {
  const items = [
    ["01", getValue(data, "experienceOneTitle"), getValue(data, "experienceOneText")],
    ["02", getValue(data, "experienceTwoTitle"), getValue(data, "experienceTwoText")],
    ["03", getValue(data, "experienceThreeTitle"), getValue(data, "experienceThreeText")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl rounded-[46px] border border-[#c9a24b]/15 bg-[#1a1510]/60 p-8 lg:p-12">
        <SectionTitle
          center
          eyebrow={getValue(data, "experienceEyebrow")}
          title={getValue(data, "experienceTitle")}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([num, title, text]) => (
            <div
              key={num}
              className="group rounded-[32px] border border-[#c9a24b]/15 bg-[#14100d]/70 p-7 transition duration-500 hover:-translate-y-2 hover:border-[#c9a24b]/40"
            >
              <span className="font-serif text-5xl font-semibold text-[#c9a24b]/70 transition duration-500 group-hover:text-[#c9a24b]">
                {num}
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#f5eee1]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#cdbfa6]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: Record<string, any> }) {
  const items = [
    { src: getValue(data, "galleryImageOne"), cls: "lg:col-span-2 lg:row-span-2", h: "h-[420px] lg:h-full" },
    { src: getValue(data, "galleryImageTwo"), cls: "", h: "h-[280px]" },
    { src: getValue(data, "galleryImageThree"), cls: "", h: "h-[280px]" },
    { src: getValue(data, "galleryImageFour"), cls: "lg:col-span-2", h: "h-[300px]" },
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          center
          eyebrow={getValue(data, "galleryEyebrow")}
          title={getValue(data, "galleryTitle")}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-4 lg:grid-rows-[280px_280px_300px]">
          {items.map((item, index) => (
            <div
              key={item.src + index}
              className={cx(
                "group overflow-hidden rounded-[34px] border border-[#c9a24b]/15 bg-[#1a1510] p-2.5 transition duration-500 hover:-translate-y-2",
                item.cls,
              )}
            >
              <div className="relative h-full overflow-hidden rounded-[26px]">
                <img
                  src={item.src}
                  alt=""
                  className={cx(
                    "w-full rounded-[26px] object-cover transition duration-700 group-hover:scale-105",
                    item.h,
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100d]/60 via-transparent to-transparent opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle center eyebrow={getValue(data, "reviewsEyebrow")} title={getValue(data, "reviewsTitle")} />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role], index) => (
            <article
              key={name + index}
              className="group rounded-[34px] border border-[#c9a24b]/15 bg-[#1a1510]/70 p-8 transition duration-500 hover:-translate-y-2 hover:border-[#c9a24b]/40"
            >
              <div className="mb-5 text-[#c9a24b]">★★★★★</div>
              <p className="text-lg leading-8 text-[#e6dcc8]">“{text}”</p>
              <div className="mt-7 border-t border-[#c9a24b]/12 pt-5">
                <p className="font-serif text-lg font-semibold text-[#f5eee1]">{name}</p>
                <p className="mt-1 text-sm text-[#a2957c]">{role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  openBooking,
}: {
  data: Record<string, any>;
  openBooking: () => void;
}) {
  const info = [
    ["טלפון", getValue(data, "phone")],
    ["אימייל", getValue(data, "email")],
    ["כתובת", getValue(data, "address")],
    ["שעות", getValue(data, "hours")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[50px] border border-[#c9a24b]/20 bg-[#1a1510] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-[#c9a24b]/10 blur-2xl" />
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-[#c9a24b]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a24b]">
              {getValue(data, "contactEyebrow")}
            </p>
            <h2 className="font-serif text-4xl font-semibold leading-[1.08] text-[#f5eee1] md:text-6xl">
              {getValue(data, "contactTitle")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#cdbfa6]">{getValue(data, "contactText")}</p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {info.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-[#c9a24b]/12 bg-[#14100d]/60 px-4 py-4 transition duration-300 hover:border-[#c9a24b]/35"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a2957c]">{label}</div>
                  <div className="mt-1 text-base font-semibold text-[#f5eee1]">{value}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openBooking}
              className="mt-8 rounded-full bg-[#c9a24b] px-7 py-4 text-sm font-semibold text-[#14100d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8b45f]"
            >
              {getValue(data, "heroPrimaryButton")}
            </button>
          </div>
        </div>

        <form className="m-4 rounded-[42px] border border-[#c9a24b]/12 bg-[#14100d] p-5 lg:m-6 lg:p-7">
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
              placeholder="טלפון"
            />
            <input
              className="rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
              placeholder="מספר סועדים"
            />
            <textarea
              className="min-h-32 rounded-2xl border border-[#c9a24b]/20 bg-[#221a12] px-5 py-4 text-right text-[#f5eee1] outline-none transition placeholder:text-[#9c8f77] focus:border-[#c9a24b]"
              placeholder="בקשות מיוחדות"
            />
            <button
              type="button"
              className="rounded-full bg-[#c9a24b] px-7 py-4 text-base font-semibold text-[#14100d] shadow-lg shadow-[#c9a24b]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8b45f]"
            >
              {getValue(data, "contactButton")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function CtaFooter({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[50px] border border-[#c9a24b]/15 bg-[#1a1510]/60 p-8 lg:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#c9a24b]/25 bg-[#c9a24b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a24b]">
              Aurelia
            </p>
            <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] text-[#f5eee1] md:text-6xl">
              {getValue(data, "ctaTitle")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#cdbfa6]">
              {getValue(data, "ctaText")}
            </p>
          </div>

          <div className="rounded-[36px] border border-[#c9a24b]/20 bg-[#14100d] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a2957c]">
              מוכנים לערב?
            </div>
            <div className="mt-3 font-serif text-2xl font-semibold text-[#f5eee1]">
              שולחן מחכה לכם.
            </div>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={openBooking}
                className="rounded-full bg-[#c9a24b] px-8 py-4 text-base font-semibold text-[#14100d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d8b45f]"
              >
                {getValue(data, "ctaButton")}
              </button>
              <button
                type="button"
                onClick={() => goTo("menu")}
                className="rounded-full border border-[#c9a24b]/25 px-8 py-4 text-base font-semibold text-[#f5eee1] transition duration-300 hover:bg-[#c9a24b]/10"
              >
                {getValue(data, "heroSecondaryButton")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#c9a24b]/10 pt-8 text-sm text-[#a2957c] md:flex-row">
        <p>
          © {new Date().getFullYear()} {getValue(data, "brandName")}
        </p>
        <p>תבנית Aurelia · Bizuply Studio</p>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} openBooking={openBooking} />
      <AboutSection data={data} />
      <MenuSection data={data} openBooking={openBooking} />
      <ExperienceSection data={data} />
      <GallerySection data={data} />
      <ReviewsSection data={data} />
      <ContactSection data={data} openBooking={openBooking} />
      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
  openBooking,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
  openBooking: () => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    menu: (
      <>
        <MenuSection data={data} openBooking={openBooking} />
        <ExperienceSection data={data} />
      </>
    ),
    about: (
      <>
        <AboutSection data={data} />
        <ExperienceSection data={data} />
        <ReviewsSection data={data} />
      </>
    ),
    gallery: <GallerySection data={data} />,
    contact: <ContactSection data={data} openBooking={openBooking} />,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-[12%] top-10 -z-10 h-56 w-56 rounded-full bg-[#c9a24b]/12 blur-3xl" />
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#c9a24b]/25 bg-[#c9a24b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a24b]">
            {getValue(data, "brandName")}
          </p>
          <h1 className="mx-auto max-w-4xl font-serif text-5xl font-semibold leading-[1.04] text-[#f5eee1] md:text-7xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <CtaFooter data={data} goTo={goTo} openBooking={openBooking} />
    </>
  );
}

export default function AureliaPages({
  initialPage = "home",
  page,
  mode = "preview",
  data,
}: AureliaPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...aureliaDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const [currentPage, setCurrentPage] = useState(page || initialPage || "home");
  const [bookingOpen, setBookingOpen] = useState(false);

  function goTo(nextPage: string) {
    setCurrentPage(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "aurelia-preview" : "aurelia"}
      className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_14%_6%,rgba(201,162,75,0.14),transparent_30%),radial-gradient(circle_at_86%_22%,rgba(122,59,29,0.16),transparent_32%),linear-gradient(180deg,#14100d_0%,#181310_50%,#12100c_100%)] font-sans text-[#f5eee1]"
      style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' }}
    >
      <Header
        data={mergedData}
        currentPage={currentPage}
        setCurrentPage={goTo}
        openBooking={() => setBookingOpen(true)}
      />

      <VisualPageStack
        activePageId={currentPage}
        pages={[
          {
            id: "home",
            content: (
              <HomePage
                data={mergedData}
                goTo={goTo}
                openBooking={() => setBookingOpen(true)}
              />
            ),
          },
          ...aureliaPages
            .filter((item) => item.id !== "home")
            .map((item) => ({
              id: item.id,
              content: (
                <SimplePage
                  data={mergedData}
                  type={item.id}
                  goTo={goTo}
                  openBooking={() => setBookingOpen(true)}
                />
              ),
            })),
        ]}
      />

      <BookingModal
        data={mergedData}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
