import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardNav = ({ refs }) => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();

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

    // ניווט לפי id הכפתור
    switch (refName) {
      case "cardsRef":
        navigate("/business/dashboard/cards");
        break;
      case "insightsRef":
        navigate("/business/dashboard/insights");
        break;
      case "chartsRef":
        navigate("/business/dashboard/charts");
        break;
      case "appointmentsRef":
        navigate("/business/dashboard/appointments");
        break;
      case "nextActionsRef":
        navigate("/business/dashboard/next-actions");
        break;
      default:
        const targetRef = refs[refName];
        if (targetRef?.current) {
          targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        break;
    }
  };

  const buttons = [
    { id: "cardsRef", label: "כרטיסים" },
    { id: "insightsRef", label: "תובנות" },
    { id: "chartsRef", label: "גרפים" },
    { id: "appointmentsRef", label: "פגישות" },
    { id: "nextActionsRef", label: "המלצות" },
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
