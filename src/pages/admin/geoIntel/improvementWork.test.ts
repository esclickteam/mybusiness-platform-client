import { describe, expect, it } from "vitest";
import { geoIntelCopy } from "./geoIntelCopy";
import { canShowMeasurementActions } from "./runActionVisibility";
import {
  WORK_LABELS,
  findingKindHe,
  targetPageLabel,
  workCardFromTask,
  workHasPublicJargon,
} from "./improvementWork";

describe("measurement action visibility", () => {
  it("shows run actions only when the server sets canRun", () => {
    expect(canShowMeasurementActions({ canRun: true })).toBe(true);
    expect(canShowMeasurementActions({ canRun: false })).toBe(false);
    expect(canShowMeasurementActions(null)).toBe(false);
    expect(canShowMeasurementActions({})).toBe(false);
  });
});

describe("improvement work cards", () => {
  it("keeps Hebrew labels free of technical search acronyms", () => {
    for (const label of Object.values(WORK_LABELS)) {
      expect(workHasPublicJargon(label)).toBe(false);
    }
    expect(workHasPublicJargon(geoIntelCopy().navImprovementPlan)).toBe(false);
    expect(workHasPublicJargon(geoIntelCopy().recommendationsTitle)).toBe(false);
  });

  it("uses the measured work card and does not invent a gap reason", () => {
    const card = workCardFromTask(
      {
        promptText: "מה עדיף לניהול אירוע?",
        work: {
          brandName: "Invistimo",
          engine: "perplexity",
          question: "מה עדיף לניהול אירוע?",
          outcomeHe: "המותג לא הופיע בתשובה.",
          gapReasonHe: null,
          targetPath: null,
          targetNoteHe: "לא זוהה עמוד יעד מתוך המדידה.",
          actionHe: "פעולה מוצעת.",
          impactHe: "בינונית",
          confidenceHe: "גבוה",
          priorityScore: 12,
          provenanceHe: "נגזר ממדידה",
          sources: [{ url: "https://example.com/a", title: "מקור", domain: "example.com" }],
          competitors: [],
        },
      },
      "Invistimo"
    );
    expect(card.brandName).toBe("Invistimo");
    expect(card.gapReasonHe).toBeNull();
    expect(card.targetPath).toBeNull();
    expect(card.sources[0].domain).toBe("example.com");
    expect(workHasPublicJargon(card.actionHe)).toBe(false);
  });

  it("does not present a missing page as verified", () => {
    const missing = workCardFromTask({
      work: {
        targetPath: "/crm",
        targetState: "missing",
        targetVerified: false,
        targetNoteHe: "ההצעה /crm לא נמצאה כעמוד באתר הציבורי, ולכן היא לא מוצגת כעמוד מאומת.",
        factHe: "המותג לא הופיע.",
        hypothesisHe: null,
        recommendationHe: "פעולה מוצעת.",
      },
    });
    expect(missing.targetVerified).toBe(false);
    expect(targetPageLabel(missing)).toContain("לא מוצגת כעמוד מאומת");
    expect(missing.factHe).toContain("לא הופיע");
    expect(missing.recommendationHe).toBe("פעולה מוצעת.");
  });

  it("translates finding kinds to Hebrew", () => {
    expect(findingKindHe("competitor_visible_brand_missing")).toBe(
      "מתחרים הופיעו והמותג לא"
    );
    expect(findingKindHe("unknown_code")).toBe("ממצא");
  });
});
