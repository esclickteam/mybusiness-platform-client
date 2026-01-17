import React, { useState, useEffect, useMemo } from "react";
import ClientServiceCard from "../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientServiceCard";
import "./ServicesSelector.css";

export default function ServicesSelector({
  services = [],
  categories,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(
    () => localStorage.getItem("lastService") || null
  );

  /* ======================================================
     💾 שמירת שירות אחרון
  ====================================================== */
  useEffect(() => {
    if (selectedId) {
      localStorage.setItem("lastService", selectedId);
    }
  }, [selectedId]);

  /* ======================================================
     ⏱️ פורמט משך
  ====================================================== */
  const formatDuration = (minutes = 0) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} min`;
    return `${h}h ${m}m`;
  };

  /* ======================================================
     🔍 פילטור שירותים
  ====================================================== */
  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();

    return services.filter((s) => {
      const matchesCategory =
        activeCategory === "all" || s.category === activeCategory;

      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [services, search, activeCategory]);

  /* ======================================================
     🧭 טאבים (All + קטגוריות)
  ====================================================== */
  const tabs = useMemo(() => {
    if (Array.isArray(categories)) return ["all", ...categories];
    if (categories && typeof categories === "object") {
      return ["all", ...Object.keys(categories)];
    }
    return ["all"];
  }, [categories]);

  /* ======================================================
     🖱️ בחירת שירות
  ====================================================== */
  const handleSelect = (service) => {
    const id = service._id || service.id;
    setSelectedId(id);
    onSelect?.(service);
  };

  return (
    <section className="services-selector" aria-label="Select service">
      {/* ======================
          🧭 קטגוריות
      ====================== */}
      <div className="cat-tabs" role="tablist" aria-label="Service categories">
        {tabs.map((catKey) => (
          <button
            key={catKey}
            role="tab"
            aria-selected={activeCategory === catKey}
            className={activeCategory === catKey ? "active" : ""}
            onClick={() => setActiveCategory(catKey)}
          >
            {catKey === "all" ? "All" : catKey}
          </button>
        ))}
      </div>

      {/* ======================
          🔍 חיפוש
      ====================== */}
      <input
        type="search"
        className="services-search"
        placeholder="Search service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search service"
      />

      {/* ======================
          🧩 כרטיסים
      ====================== */}
      <div className="services-grid">
        {filteredServices.length === 0 && (
          <p className="no-results">No services found</p>
        )}

        {filteredServices.map((service) => {
          const id = service._id || service.id;
          const isSelected = id === selectedId;

          return (
            <div
              key={id}
              className={`service-card-wrapper ${
                isSelected ? "selected" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => handleSelect(service)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(service);
                }
              }}
            >
              <ClientServiceCard
                service={service}
                formatDuration={formatDuration}
              />

              {isSelected && (
                <div className="service-selected-badge">✓ Selected</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
