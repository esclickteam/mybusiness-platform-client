import React, { memo, useEffect, useMemo, useCallback, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext"; // גישה ל-businessId

const HEADER_SELECTOR = ".main-header"; // אם יש לכם סלקטור אחר להדר – עדכנו כאן
const DEFAULT_OFFSET = 80;               // פיקסלים להוריד בגלילה אם אין header

const DashboardNav = memo(({ refs = {} }) => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(null);

  // בונים רשימת כפתורים רק ל-refs שקיימים בפועל
  const buttons = useMemo(() => {
    const all = [
      { id: "cardsRef",         label: "כרטיסים" },
      { id: "insightsRef",      label: "תובנות" },
      { id: "nextActionsRef",   label: "המלצות" },
      { id: "chartsRef",        label: "גרפים" },
      { id: "appointmentsRef",  label: "פגישות" },
      { id: "weeklySummaryRef", label: "סיכום שבועי" },
    ];
    return all.filter(btn => refs?.[btn.id]?.current);
  }, [refs]);

  // מחשב offset לפי גובה ההדר אם קיים
  const getScrollOffset = useCallback(() => {
    const header = document.querySelector(HEADER_SELECTOR);
    return header?.offsetHeight || DEFAULT_OFFSET;
  }, []);

  // גלילה חלקה לסקשן עם קיזוז
  const scrollTo = useCallback((refName, e) => {
    if (e) e.preventDefault();
    const el = refs?.[refName]?.current;
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.history.replaceState(null, "", `#${refName}`);
    window.scrollTo({ top, behavior: "smooth" });
  }, [refs, getScrollOffset]);

  // פותח פרופיל ציבורי
  const openPublicProfile = useCallback(() => {
    const businessId = user?.businessId;
    if (!businessId) return;
    window.open(`/profile/${businessId}?src=owner`, "_blank", "noopener,noreferrer");
  }, [user]);

  // הדגשת סקשן פעיל – IntersectionObserver
  useEffect(() => {
    const entries = Object.entries(refs).filter(([, r]) => r?.current);
    if (!entries.length) return;

    const marginTop = getScrollOffset();
    const observer = new IntersectionObserver(
      (ioEntries) => {
        const visible = ioEntries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const match = entries.find(([, r]) => r.current === visible.target);
          if (match && match[0] !== activeSection) {
            setActiveSection(match[0]);
            window.history.replaceState(null, "", `#${match[0]}`);
          }
        }
      },
      {
        root: null,
        rootMargin: `-${marginTop}px 0px 0px 0px`,
        threshold: [0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    entries.forEach(([, r]) => observer.observe(r.current));
    return () => observer.disconnect();
  }, [refs, getScrollOffset, activeSection]);

  // אם יש hash בטעינה – גלול אליו בעדינות אחרי mount
  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (hash && refs?.[hash]?.current) {
      setTimeout(() => scrollTo(hash), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard-nav">
      {/* כפתורי ניווט פנימיים */}
      {buttons.map(({ id, label }) => (
        <button
          key={id}
          onClick={(e) => scrollTo(id, e)}
          className={activeSection === id ? "active" : ""}
          aria-current={activeSection === id ? "page" : undefined}
        >
          {label}
        </button>
      ))}

      {/* כפתור פרופיל ציבורי */}
      <button
        onClick={openPublicProfile}
        className="public-profile-btn"
        disabled={!user?.businessId}
        title={!user?.businessId ? "אין businessId מחובר" : "צפייה בפרופיל הציבורי"}
      >
        👁️ צפייה בפרופיל
      </button>
    </div>
  );
});

export default DashboardNav;
