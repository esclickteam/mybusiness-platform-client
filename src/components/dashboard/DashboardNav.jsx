import React, { useEffect, useMemo, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";

const SECTION_IDS = [
  "cardsRef",
  "insightsRef",
  "nextActionsRef",
  "chartsRef",
  "appointmentsRef",
  "weeklySummaryRef",
];

const LABELS = {
  cardsRef: "כרטיסים",
  insightsRef: "תובנות",
  nextActionsRef: "המלצות",
  chartsRef: "גרפים",
  appointmentsRef: "פגישות",
  weeklySummaryRef: "סיכום שבועי",
};

const DashboardNav = ({ refs = {} }) => {
  const { user } = useContext(AuthContext); // ← businessId מתוך הקונטקסט
  const [activeSection, setActiveSection] = useState(null);

  // ממפה רק סקשנים קיימים בפועל (עם ref.current תקף)
  const entries = useMemo(() => {
    return SECTION_IDS
      .map((id) => [id, refs[id]])
      .filter(([, r]) => r && r.current);
  }, [refs]);

  // Highlight סקשן פעיל באמצעות IntersectionObserver (יעיל מ-scroll)
  useEffect(() => {
    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (ioEntries) => {
        // בוחרים את הסקשן הנראה ביותר (highest intersectionRatio)
        const visible = ioEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
          // מעדכנים גם את ה-hash (לא שובר back/forward)
          if (window.history?.replaceState) {
            window.history.replaceState(null, "", `#${visible.target.id}`);
          }
        }
      },
      {
        // כשה-30% העליונים של המסך חוצים את האזור — נחשב כ"פעיל"
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.15, 0.3, 0.6, 1],
      }
    );

    // מוסיפים id לאלמנטים (אם חסר) כדי לאפשר hash + תצפית
    entries.forEach(([id, r]) => {
      if (r.current && !r.current.id) r.current.id = id;
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [entries]);

  // גלילה חלקה לסקשן
  const scrollTo = useCallback((refName, e) => {
    if (e) e.preventDefault();
    const el = refs[refName]?.current;
    if (!el) return;
    // ודא שיש id בשביל hash/deeplink
    if (!el.id) el.id = refName;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // מעדכן hash ללא קפיצה (לשיתוף קישור ישיר)
    if (window.history?.replaceState) {
      window.history.replaceState(null, "", `#${el.id}`);
    }
  }, [refs]);

  // פתיחת הפרופיל הציבורי עם src=owner
  const openPublicProfile = useCallback(() => {
    const businessId = user?.businessId;
    if (!businessId) return;
    window.open(`/profile/${businessId}?src=owner`, "_blank", "noopener,noreferrer");
  }, [user]);

  // Deeplink: אם יש hash תחלתי, גלול אליו בעדינות לאחר mount
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    if (!hash) return;
    // נוודא שהסקשן קיים ורק אז נגלול (timeout קצר עד שה־refs מאוכלסים)
    const t = setTimeout(() => {
      if (refs[hash]?.current) {
        scrollTo(hash);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [refs, scrollTo]);

  // בניית מערך כפתורים לפי סקשנים הקיימים בפועל
  const buttons = useMemo(() => {
    return SECTION_IDS
      .filter((id) => refs[id]) // מציג רק קיים
      .map((id) => ({ id, label: LABELS[id] || id }));
  }, [refs]);

  const showPublicBtn = Boolean(user?.businessId);

  return (
    <nav className="dashboard-nav" aria-label="ניווט לקטעי הדשבורד" dir="rtl">
      {/* כפתורי ניווט פנימיים */}
      {buttons.map(({ id, label }) => (
        <button
          key={id}
          onClick={(e) => scrollTo(id, e)}
          className={`nav-chip${activeSection === id ? " active" : ""}`}
          data-active={activeSection === id ? "true" : "false"}
          aria-current={activeSection === id ? "true" : "false"}
          type="button"
        >
          {label}
        </button>
      ))}

      {/* כפתור פרופיל ציבורי */}
      {showPublicBtn && (
        <button
          onClick={openPublicProfile}
          className="public-profile-btn"
          type="button"
          title="צפייה בפרופיל הציבורי (נפתח בלשונית חדשה)"
        >
          👁️ צפייה בפרופיל
        </button>
      )}
    </nav>
  );
};

export default DashboardNav;
