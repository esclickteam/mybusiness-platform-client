import { useEffect, useMemo, useState } from "react";
import { dishesForCategory } from "./tableflowGuestLayout";
import "./tableflowGuest.css";

type Dish = {
  id?: string;
  name?: string;
  nameHe?: string;
  nameEn?: string;
  description?: string;
  descriptionHe?: string;
  descriptionEn?: string;
  price?: number;
  image?: string;
  available?: boolean;
  categoryId?: string;
};

type Category = { id?: string; name?: string; nameHe?: string; nameEn?: string };

type GuestContent = {
  branding?: Record<string, string>;
  business?: {
    restaurantName?: string;
    details?: string;
    categories?: Category[];
    dishes?: Dish[];
    hours?: { day?: string; open?: string; close?: string }[];
  };
};

function text(row: { name?: string; nameHe?: string; nameEn?: string } | undefined, lang: "he" | "en") {
  if (!row) return "";
  if (lang === "he") return row.nameHe || row.name || row.nameEn || "";
  return row.nameEn || row.name || row.nameHe || "";
}

export default function TableflowGuest({
  content,
  language = "he",
}: {
  content: GuestContent;
  language?: string;
}) {
  const initial = language === "en" ? "en" : "he";
  const [lang, setLang] = useState<"he" | "en">(initial);
  const [view, setView] = useState<"menu" | "order" | "service">("menu");
  const [order, setOrder] = useState<Dish[]>([]);
  const dir = lang === "he" ? "rtl" : "ltr";
  const branding = content.branding || {};
  const business = content.business || {};
  const categories = business.categories || [];
  const dishes = business.dishes || [];
  const title = branding.businessName || business.restaurantName || "";
  const groups = useMemo(() => {
    const known = categories.length ? categories : [{ id: "all", name: lang === "he" ? "תפריט" : "Menu" }];
    return known.map((category) => ({
      category,
      dishes: dishesForCategory(dishes, category.id),
    }));
  }, [categories, dishes, lang]);
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    if (!groups.some((group) => (group.category.id || "") === activeId)) {
      setActiveId(groups[0]?.category.id || "");
    }
  }, [groups, activeId]);
  const visible = groups.filter((group) => (group.category.id || "") === activeId);
  const shown = visible.length ? visible : groups.slice(0, 1);

  return (
    <div className="tf-guest" dir={dir} lang={lang} style={{ ["--tf-bg" as string]: branding.background || "#f6f1e8" }}>
      <div className="tf-shell">
        <aside className="tf-hero">
          {branding.heroImage ? <img src={branding.heroImage} alt="" /> : null}
          <div className="tf-hero-copy">
            <strong>TableFlow</strong>
            <h2>{title}</h2>
            <p>{branding.tagline || business.details || ""}</p>
          </div>
        </aside>
        <section className="tf-menu">
          <header className="tf-menu-head" style={{ background: branding.primaryColor || "#9A431C" }}>
            <div className="tf-dish-line">
              <div>
                <p>TableFlow</p>
                <h1>{title}</h1>
              </div>
              <div className="tf-lang" role="group" aria-label="Language">
                <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
                <button type="button" aria-pressed={lang === "he"} onClick={() => setLang("he")}>עב</button>
              </div>
            </div>
          </header>
          <nav className="tf-cats" aria-label={lang === "he" ? "קטגוריות" : "Categories"}>
            {groups.map((group) => {
              const id = group.category.id || "";
              return (
                <button key={id || text(group.category, lang)} type="button" aria-pressed={id === activeId} onClick={() => setActiveId(id)}>
                  {text(group.category, lang)}
                </button>
              );
            })}
          </nav>
          {view === "menu" ? <main>
            {shown.map((group) => (
              <section key={group.category.id || text(group.category, lang)} className="tf-section">
                <h2>{text(group.category, lang)}</h2>
                {group.dishes.map((dish, index) => (
                  <button key={dish.id || index} type="button" className="tf-dish" disabled={dish.available === false} onClick={() => setOrder((prev) => [...prev, dish])}>
                    {dish.image ? <img src={dish.image} alt="" /> : <span />}
                    <span className="tf-dish-copy">
                      <span className="tf-dish-line">
                        <span className="tf-dish-name">{text(dish, lang)}</span>
                        <span className="tf-price">{Number(dish.price || 0).toFixed(2)}</span>
                      </span>
                      <span>{lang === "he" ? dish.descriptionHe || dish.description : dish.descriptionEn || dish.description}</span>
                    </span>
                  </button>
                ))}
              </section>
            ))}
          </main> : null}
          {view === "order" ? (
            <div className="tf-panel">
              <h2>{lang === "he" ? "הרשימה בדף זה" : "List on this page"}</h2>
              {order.length === 0 ? <p>{lang === "he" ? "עדיין לא נבחרו מנות." : "No dishes selected yet."}</p> : null}
              {order.map((dish, index) => (
                <p key={`${dish.id || dish.name || "dish"}-${index}`}>{text(dish, lang)} · {Number(dish.price || 0).toFixed(2)}</p>
              ))}
              <p>
                {lang === "he" ? "סה״כ" : "Total"} {order.reduce((sum, dish) => sum + Number(dish.price || 0), 0).toFixed(2)}
              </p>
            </div>
          ) : null}
          {view === "service" ? (
            <div className="tf-panel">
              <h2>{lang === "he" ? "שירות" : "Service"}</h2>
              <p>{business.details || branding.tagline || ""}</p>
              {(business.hours || []).map((row, index) => (
                <p key={index}>{[row.day, row.open, row.close].filter(Boolean).join(" · ")}</p>
              ))}
            </div>
          ) : null}
          <nav className="tf-orderbar" aria-label={lang === "he" ? "הזמנה" : "Order"}>
            <button type="button" aria-pressed={view === "menu"} onClick={() => setView("menu")}>{lang === "he" ? "תפריט" : "Menu"}</button>
            <button type="button" aria-pressed={view === "order"} onClick={() => setView("order")}>{lang === "he" ? "ההזמנה" : "Your order"}</button>
            <button type="button" aria-pressed={view === "service"} onClick={() => setView("service")}>{lang === "he" ? "שירות" : "Service"}</button>
          </nav>
        </section>
      </div>
    </div>
  );
}
