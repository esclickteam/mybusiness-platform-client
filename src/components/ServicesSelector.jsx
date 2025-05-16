// src/components/ServicesSelector.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import ServiceCard from "./ServiceCard"; // גרסה שלך של ClientServiceCard, מותאמת ל־card
import "./ServicesSelector.css";

export default function ServicesSelector({ services, categories, onSelect }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(
    localStorage.getItem("lastService") || null
  );
  const containerRef = useRef(null);

  // שמירת הבחירה בלוקאל־סטורג'
  useEffect(() => {
    if (selectedId) localStorage.setItem("lastService", selectedId);
  }, [selectedId]);

  // סינון לפי חיפוש וקטגוריה
  const filtered = useMemo(() => {
    return services
      .filter(s =>
        (activeCategory === "all" || s.category === activeCategory) &&
        s.name.toLowerCase().includes(search.trim().toLowerCase())
      );
  }, [services, search, activeCategory]);

  // ניהול ניווט מקלדת
  const cards = useRef([]);
  useEffect(() => {
    cards.current = cards.current.slice(0, filtered.length);
  }, [filtered]);

  const handleKeyDown = e => {
    const idx = cards.current.findIndex(c => c === document.activeElement);
    if (e.key === "ArrowRight" && idx < cards.current.length - 1) {
      cards.current[idx + 1].focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      cards.current[idx - 1].focus();
    }
  };

  return (
    <div className="services-selector">
      {/* סינון לפי קטגוריות */}
      <div className="cat-tabs" role="tablist">
        <button
          role="tab"
          className={activeCategory === "all" ? "active" : ""}
          onClick={() => setActiveCategory("all")}
        >הכל</button>
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            className={activeCategory === cat ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {/* חיפוש typeahead */}
      <input
        type="search"
        className="services-search"
        placeholder="חפש שירות..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="חיפוש שירות"
      />

      {/* גריד כרטיסיות */}
      <div
        className="services-grid"
        onKeyDown={handleKeyDown}
        ref={containerRef}
      >
        {filtered.map((s, i) => (
          <ServiceCard
            key={s.id}
            ref={el => (cards.current[i] = el)}
            service={s}
            isSelected={s.id === selectedId}
            onClick={() => {
              setSelectedId(s.id);
              onSelect(s);
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="no-results">לא נמצאו שירותים</p>
        )}
      </div>
    </div>
  );
}
