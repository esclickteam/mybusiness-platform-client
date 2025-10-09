import React, { useState, useEffect, useMemo } from "react";
import ClientServiceCard from "../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientServiceCard";
import "./ServicesSelector.css";

export default function ServicesSelector({ services, categories, onSelect }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(
    localStorage.getItem("lastService") || null
  );

  // Save selection to localStorage
  useEffect(() => {
    if (selectedId) {
      localStorage.setItem("lastService", selectedId);
    }
  }, [selectedId]);

  // Format duration function
  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  // Filter by search and category
  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = activeCategory === "all" || s.category === activeCategory;
      const matchesSearch = s.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, search, activeCategory]);

  // "All" tab + other categories
  const tabs = ["all", ...(Array.isArray(categories) ? categories : Object.keys(categories || {}))];

  return (
    <div className="services-selector">
      {/* Categories */}
      <div className="cat-tabs" role="tablist">
        {tabs.map((catKey) => {
          const label = catKey === "all" ? "All" : catKey;
          return (
            <button
              key={catKey}
              role="tab"
              className={activeCategory === catKey ? "active" : ""}
              onClick={() => setActiveCategory(catKey)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Search typeahead */}
      <input
        type="search"
        className="services-search"
        placeholder="Search service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Service search"
      />

      {/* Cards grid */}
      <div className="services-grid">
        {filtered.length > 0 ? (
          filtered.map((service) => {
            const id = service._id || service.id;
            return (
              <div
                key={id}
                className="service-card-wrapper"
              >
                <ClientServiceCard
                  service={service}
                  formatDuration={formatDuration}
                  onSelect={(srv) => {
                    setSelectedId(id);
                    onSelect(srv);
                  }}
                />
              </div>
            );
          })
        ) : (
          <p className="no-results">No services found</p>
        )}
      </div>
    </div>
  );
}
