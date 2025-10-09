import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";
import { AuthContext } from "../../context/AuthContext";

/* Section references (same order) */
const SECTION_IDS = [
  "cardsRef",
  "insightsRef",
  "nextActionsRef",
  "chartsRef",
  "appointmentsRef",
  "weeklySummaryRef",
];

/* Labels in English */
const LABELS = {
  cardsRef: "Overview",
  insightsRef: "Insights",
  nextActionsRef: "Actions",
  chartsRef: "Charts",
  appointmentsRef: "Appointments",
  weeklySummaryRef: "Weekly Summary",
};

const DashboardNav = ({ refs = {} }) => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(null);

  /* Get list of active refs */
  const entries = useMemo(() => {
    return SECTION_IDS
      .map((id) => [id, refs[id]])
      .filter(([, r]) => r && r.current);
  }, [refs]);

  /* Intersection observer for highlighting active section */
  useEffect(() => {
    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (ioEntries) => {
        const visible = ioEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.15, 0.3, 0.6, 1],
      }
    );

    entries.forEach(([id, r]) => {
      if (r.current && !r.current.id) r.current.id = id;
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [entries]);

  /* Scroll to section smoothly */
  const scrollTo = useCallback(
    (refName, e) => {
      if (e) e.preventDefault();
      const el = refs[refName]?.current;
      if (!el) return;
      if (!el.id) el.id = refName;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [refs]
  );

  /* Filter out missing refs */
  const buttons = useMemo(() => {
    return SECTION_IDS
      .filter((id) => refs[id])
      .map((id) => ({ id, label: LABELS[id] || id }));
  }, [refs]);

  return (
    <nav
      className="dashboard-nav"
      aria-label="Dashboard Section Navigation"
      dir="ltr"
    >
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
    </nav>
  );
};

export default DashboardNav;
