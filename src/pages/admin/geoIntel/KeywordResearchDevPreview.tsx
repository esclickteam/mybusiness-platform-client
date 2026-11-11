import React, { useEffect, useState } from "react";
import KeywordResearchPanel from "./KeywordResearchPanel";
import "./geoIntel.css";

const NAV = [
  "הזדמנויות בחיפוש",
  "SEO + GEO",
  "דוח חודשי",
  "מחקר מילות מפתח",
];

/** Local preview of the keyword screen. Not used in production. */
export default function KeywordResearchDevPreview() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    fetch("/keyword-preview.json")
      .then((response) => {
        if (!response.ok) throw new Error("אין קובץ תצוגה");
        return response.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="geo-intel-root geo-intel-standalone" dir="rtl" lang="he">
      <div className="geo-intel-shell">
        <aside className="geo-intel-side" aria-label="ניווט">
          <div className="geo-intel-brand">GEO Intelligence</div>
          <div className="geo-intel-nav-scroll">
            {NAV.map((label) => (
              <button
                key={label}
                type="button"
                className={`geo-intel-nav-btn${label === "מחקר מילות מפתח" ? " active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>
        <main className="geo-intel-main">
          <div className="geo-intel-topbar">
            <div className="geo-intel-title">
              <h1>מחקר מילות מפתח</h1>
              <p>Invistimo · invistimo.com</p>
            </div>
          </div>
          <KeywordResearchPanel
            brands={[{ _id: "invistimo", slug: "invistimo", name: "Invistimo" }]}
            brandId="invistimo"
            onBrand={() => undefined}
            data={data}
            loading={!data && !error}
            error={error}
            canRefresh={false}
            refreshing={false}
            onRefresh={() => undefined}
          />
        </main>
      </div>
    </div>
  );
}
