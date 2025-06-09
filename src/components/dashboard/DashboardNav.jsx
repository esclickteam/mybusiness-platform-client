import React, { useEffect, useState } from "react";

const DashboardNav = ({ refs }) => {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sectionEntries = Object.entries(refs);
      for (const [key, ref] of sectionEntries) {
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [refs]);

  const handleScrollTo = (refName, e) => {
    e.preventDefault();

    const targetRef = refs[refName];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const buttons = [
    { id: "cardsRef", label: "כרטיסים" },
    { id: "insightsRef", label: "תובנות" },
    { id: "nextActionsRef", label: "המלצות" },
    { id: "chartsRef", label: "גרפים" },
    { id: "appointmentsRef", label: "פגישות" },
    { id: "weeklySummaryRef", label: "סיכום שבועי" },
  ];

  return (
    <div className="dashboard-nav">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={(e) => handleScrollTo(btn.id, e)}
          className={activeSection === btn.id ? "active" : ""}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardNav;
