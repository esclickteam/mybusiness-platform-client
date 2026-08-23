import { describe, expect, it } from "vitest";
import {
  QUESTION_STEPS,
  mergeAnswers,
  wantsCrmOrLeads,
  toggleExclusive,
} from "./types";
import { formatPostDemoAnswers } from "./displayUtils";

describe("guided demo matching questionnaire", () => {
  it("has exactly 10 numbered questions", () => {
    expect(QUESTION_STEPS).toHaveLength(10);
    expect([...QUESTION_STEPS]).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  });

  it("shows the excel follow-up only after CRM/leads are selected", () => {
    const empty = mergeAnswers({});
    expect(wantsCrmOrLeads(empty)).toBe(false);
    expect(
      wantsCrmOrLeads(
        mergeAnswers({ relevant: { selections: ["website", "collab"], other: "", note: "" } })
      )
    ).toBe(false);
    expect(
      wantsCrmOrLeads(mergeAnswers({ relevant: { selections: ["crm"], other: "", note: "" } }))
    ).toBe(true);
    expect(
      wantsCrmOrLeads(mergeAnswers({ relevant: { selections: ["leads"], other: "", note: "" } }))
    ).toBe(true);
  });

  it("keeps none exclusive in transfer selections", () => {
    expect(toggleExclusive(["clients"], "none", "none")).toEqual(["none"]);
    expect(toggleExclusive(["none"], "leads", "none")).toEqual(["leads"]);
  });

  it("summarizes the new flow without integration language", () => {
    const rows = formatPostDemoAnswers(
      mergeAnswers({
        relevant: { selections: ["website", "advisor"], other: "", note: "אתר" },
        goals: { selections: ["more_collab"], other: "" },
        currentTool: { answer: "no", detail: "" },
        transfer: { selections: ["none"], other: "", hasFile: "" },
        automation: { selections: ["not_needed"], other: "", detail: "" },
        specialProcess: "תהליך מכירה פנימי",
        services: { selections: ["automation_build"], other: "" },
        blockers: { selections: ["nothing_blocking"], other: "" },
        startTiming: "asap",
        extraNotes: "תודה",
      })
    );
    const text = rows.map((row) => row.label + " " + row.value).join(" ");
    expect(text).toContain("אתר");
    expect(text).not.toContain("אינטגרצ");
    expect(text).not.toContain("חיבור למערכת");
  });
});
