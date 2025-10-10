import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CityAutocomplete.css";

export default function CityAutocomplete({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
          {
            params: { namePrefix: query, countryIds: "US", limit: 8 },
            headers: {
              "X-RapidAPI-Key": "d0112c16afmshe99b193ae48bfc5p13a073jsn33f52c5bfa5f", // ✅ המפתח שלך
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        setSuggestions(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching US cities:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="city-autocomplete">
      <input
        type="text"
        value={query}
        placeholder="City (United States only)"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />

      {open && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => {
                setQuery(city.city);
                onChange(city.city);
                setOpen(false);
              }}
            >
              {city.city}, {city.region}
            </li>
          ))}
        </ul>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}
