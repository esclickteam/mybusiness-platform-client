import React, { useState, useEffect } from "react";
import ALL_CATEGORIES from "../data/categories";

export default function CategoryAutocomplete({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // סינון חכם – תוצאות שמכילות את הטקסט שהוזן
    const filtered = ALL_CATEGORIES.filter(cat =>
      cat.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // מקסימום 10 תוצאות
    setSuggestions(filtered);
  }, [query]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="Select or search category"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid #e3e6ed",
          fontSize: "1rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          direction: "ltr",
          textAlign: "left",
        }}
      />

      {open && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "4px",
            zIndex: 20,
            listStyle: "none",
            maxHeight: "180px",
            overflowY: "auto",
            padding: 0,
          }}
        >
          {suggestions.map((cat, i) => (
            <li
              key={i}
              onClick={() => {
                setQuery(cat);
                onChange(cat);
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #f2f2f2",
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
