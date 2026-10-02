import { describe, expect, it } from "vitest";
import { buildPerformanceFixture } from "./performanceFixture";
import { separatedTotals, templateMatches, toCsv } from "./performanceModel";

describe("WhatsApp performance view model", () => {
  it("does not add webhook counts onto Meta totals", () => {
    const view = buildPerformanceFixture();
    const totals = separatedTotals(view);
    expect(totals.metaSent).toBe(view.meta.messaging.sent);
    expect(totals.webhookFailed).toBe(view.local.failed);
    expect(totals.metaSent).not.toBe((view.meta.messaging.sent || 0) + (view.local.sent || 0));
    expect(view.sourcesMixed).toBe(false);
    expect(view.meta.messaging.readAvailable).toBe(false);
  });

  it("filters templates by name and category without dropping click availability", () => {
    const view = buildPerformanceFixture();
    const rows = view.meta.templates.rows;
    expect(templateMatches(rows[0], "appoint", "UTILITY")).toBe(true);
    expect(templateMatches(rows[1], "appoint", "MARKETING")).toBe(false);
    expect(rows[2].clicks.available).toBe(false);
    expect(rows[1].clicks.total).toBe(4);
  });

  it("exports csv with separate meta and webhook columns", () => {
    const csv = toCsv(
      ["metaSent", "webhookFailed"],
      [[10, 2]]
    );
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"metaSent","webhookFailed"');
    expect(csv).toContain('"10","2"');
  });
});
