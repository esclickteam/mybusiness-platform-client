import { useEffect, useState } from "react";
import { geoIntelCopy } from "./geoIntelCopy";
import { canShowMeasurementActions } from "./runActionVisibility";
import ImprovementWorkList from "./ImprovementWorkList";
import "./geoIntel.css";

type PreviewPlan = {
  name: string;
  slug: string;
  sampleSize: number;
  taskCount: number;
  disclaimerHe?: string;
  tasks: any[];
};

/**
 * Local preview of the work board. Data is loaded from a read-only export.
 * This route is not registered unless VITE_GEO_WORK_PREVIEW=1.
 */
export default function GeoWorkPreviewPage() {
  const copy = geoIntelCopy();
  const [plans, setPlans] = useState<PreviewPlan[]>([]);
  const [brandIndex, setBrandIndex] = useState(0);
  const [canRun, setCanRun] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    const url = import.meta.env.VITE_GEO_WORK_PREVIEW_URL || "/geo-work-preview.json";
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("קובץ התצוגה לא נמצא");
        const data = await res.json();
        if (!cancelled) setPlans(data.plans || []);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "טעינת התצוגה נכשלה");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const plan = plans[brandIndex];
  useEffect(() => {
    setTasks(plan?.tasks || []);
  }, [plan]);

  const status = {
    canRun,
    trialSmoke: { buttonVisible: true, inProgress: false },
    perplexity: { billingApproved: true },
  };
  const showRun = canShowMeasurementActions(status);

  return (
    <div className="geo-intel-root" dir="rtl" lang="he">
      <div className="geo-intel-shell">
        <aside className="geo-intel-side" aria-label="ניווט">
          <div className="geo-intel-brand">
            <div>
              <strong>{copy.title}</strong>
              <div className="geo-side-sub">תצוגה מקומית · בלי מדידה חדשה</div>
            </div>
          </div>
        </aside>
        <main className="geo-intel-main">
          <header className="geo-intel-topbar">
            <div className="geo-intel-title">
              <h1>{copy.navImprovementPlan}</h1>
              <p>{copy.improvementPlanHint}</p>
            </div>
            <div className="geo-intel-switcher" aria-label="מותג">
              {plans.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  className={index === brandIndex ? "active" : ""}
                  onClick={() => setBrandIndex(index)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </header>
          <div className="geo-intel-actions">
            <button type="button" className="geo-btn geo-btn-ghost" onClick={() => setCanRun((v) => !v)}>
              {canRun ? "תצוגת הרשאת הרצה" : "תצוגת חשבון בלי הרשאת הרצה"}
            </button>
            {showRun && status.trialSmoke.buttonVisible && status.perplexity.billingApproved ? (
              <button type="button" className="geo-btn geo-btn-primary">
                {copy.trialSmoke}
              </button>
            ) : null}
          </div>
          {error ? <p className="geo-error">{error}</p> : null}
          {plan ? (
            <section className="geo-plan" dir="rtl" lang="he">
              <p className="geo-plan-disclaimer">{plan.disclaimerHe}</p>
              <p className="geo-muted">
                {plan.sampleSize} מדידות שמורות · {plan.taskCount} משימות עבודה
              </p>
              {showRun ? (
                <div className="geo-intel-actions">
                  <button type="button" className="geo-btn geo-btn-primary">{copy.manualSave}</button>
                  <button type="button" className="geo-btn geo-btn-ghost">{copy.importCsv}</button>
                </div>
              ) : (
                <p className="geo-plan-approval">
                  הזנה ידנית, מדידת ניסיון וייבוא מ־Search Console מוצגים רק לחשבון עם הרשאת הרצה.
                </p>
              )}
              <ImprovementWorkList
                brandName={plan.name}
                tasks={tasks}
                onUpdate={async (taskKey, statusValue, noteHe) => {
                  setTasks((prev) =>
                    prev.map((task) =>
                      task.taskKey === taskKey
                        ? { ...task, status: statusValue, noteHe, statusUpdatedAt: new Date().toISOString() }
                        : task
                    )
                  );
                }}
              />
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
