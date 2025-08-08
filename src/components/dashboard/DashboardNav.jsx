import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext"; // גישה ל-businessId

const DashboardNav = ({ refs }) => {
  const { user } = useContext(AuthContext);          // ← businessId מתוך הקונטקסט
  const [activeSection, setActiveSection] = useState(null);

  /* highlight סקשן פעיל בעת גלילה */
  useEffect(() => {
    const handleScroll = () => {
      const entries = Object.entries(refs);
      for (const [key, ref] of entries) {
        const rect = ref?.current?.getBoundingClientRect?.();
        if (rect && rect.top >= 0 && rect.top <= 200) {
          setActiveSection(key);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () =>   window.removeEventListener("scroll", handleScroll);
  }, [refs]);

  /* גלילה חלקה לסקשן */
  const scrollTo = (refName, e) => {
    e.preventDefault();
    refs[refName]?.current?.scrollIntoView({  behavior: "smooth", block: "start" });
  };

  /* פתיחת הפרופיל הציבורי עם src=owner */
  const openPublicProfile = () => {
    if (!user?.businessId) return;
    window.open(`/profile/${user.businessId}?src=owner`, "_blank", "noopener,noreferrer");
  };

  const buttons = [
    { id: "cardsRef",        label: "כרטיסים" },
    { id: "insightsRef",     label: "תובנות" },
    { id: "nextActionsRef",  label: "המלצות" },
    { id: "chartsRef",       label: "גרפים"   },
    { id: "appointmentsRef", label: "פגישות"  },
    { id: "weeklySummaryRef",label: "סיכום שבועי" },
  ];

  return (
    <div className="dashboard-nav">
      {/* כפתורי ניווט פנימיים */}
      {buttons.map(({ id, label }) => (
        <button
          key={id}
          onClick={(e) => scrollTo(id, e)}
          className={activeSection === id ?  "active" : ""}
        >
          {label}
        </button>
      ))}

      {/* כפתור פרופיל ציבורי */}
      <button onClick={openPublicProfile}  className="public-profile-btn">
        👁️ צפייה בפרופיל
      </button>
    </div>
  );
};

export default DashboardNav;
