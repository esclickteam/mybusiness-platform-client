import { describe, expect, it } from "vitest";
import {
  EMPTY_LEAD_LIST_STATE,
  loadLeadListState,
  saveLeadListState,
  storageKey,
} from "./leadListState";

describe("lead list state persistence", () => {
  it("restores search and filters for the same business", () => {
    const businessId = "biz-1";
    saveLeadListState(businessId, {
      ...EMPTY_LEAD_LIST_STATE,
      q: "dana",
      status: "contacted",
      assignedTo: "unassigned",
      viewMode: "kanban",
    });
    const loaded = loadLeadListState(businessId);
    expect(loaded.q).toBe("dana");
    expect(loaded.status).toBe("contacted");
    expect(loaded.assignedTo).toBe("unassigned");
    expect(loaded.viewMode).toBe("kanban");
    expect(storageKey(businessId)).toContain("biz-1");
  });
});
