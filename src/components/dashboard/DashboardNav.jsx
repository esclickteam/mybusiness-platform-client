import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import "./DashboardNav.css";


/* =========================
   Section order
========================= */
const SECTION_IDS = [
  "cardsRef",
  "insightsRef",
  "nextActionsRef",
  "chartsRef",
  "appointmentsRef",
];

/* =========================
   Labels
========================= */
const LABELS = {
  cardsRef: "Overview",
  insightsRef: "Insights",
  nextActionsRef: "Actions",
  chartsRef: "Charts",
  appointmentsRef: "Appointments",
};

const DashboardNav = ({ refs = {} }) => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(null);

  /* =========================
     Only refs that actually exist
  ========================= */
  const entries = useMemo(() => {
    return SECTION_IDS
      .map((id) => [id, refs[id]])
      .filter(([, ref]) => ref?.current);
  }, [refs]);

  /* =========================
     Intersection Observer
     (stable + UX friendly)
  ========================= */
  useEffect(() => {
    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (ioEntries) => {
        const visible = ioEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection((prev) =>
            prev === visible.target.id ? prev : visible.target.id
          );
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    entries.forEach(([id, ref]) => {
      if (!ref.current.id) ref.current.id = id;
      observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [entries]);

  /* =========================
     Scroll handler
  ========================= */
  const scrollTo = useCallback(
    (id, e) => {
      if (e) e.preventDefault();
      const el = refs[id]?.current;
      if (!el) return;

      if (!el.id) el.id = id;

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [refs]
  );

  /* =========================
     Buttons list
  ========================= */
  const buttons = useMemo(() => {
    return SECTION_IDS
      .filter((id) => refs[id]?.current)
      .map((id) => ({
        id,
        label: LABELS[id] || id,
      }));
  }, [refs]);

  /* =========================
     Render
  ========================= */
  return (
    <nav
      className="dashboard-nav"
      aria-label="Dashboard section navigation"
      dir="ltr"
    >
      {buttons.map(({ id, label }) => {
        const isActive = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            className={`nav-chip${isActive ? " active" : ""}`}
            data-active={isActive}
            aria-current={isActive ? "true" : "false"}
            onClick={(e) => scrollTo(id, e)}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
};

export default DashboardNav;
