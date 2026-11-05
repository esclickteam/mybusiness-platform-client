import { describe, expect, it } from "vitest";
import { canShowMeasurementActions } from "./runActionVisibility";
import {
  WORK_LABELS,
  findingKindHe,
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

  it("translates finding kinds to Hebrew", () => {
    expect(findingKindHe("competitor_visible_brand_missing")).toBe(
      "מתחרים הופיעו והמותג לא"
    );
    expect(findingKindHe("unknown_code")).toBe("ממצא");
  });
});
