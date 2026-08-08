import { describe, expect, it } from "vitest";
import {
  buildExecutionSteps,
  formatDurationMs,
  getExecutionDurationMs,
  getExecutionStatusLabel,
  getExecutionStatusTone,
  getNodeStatusLabel,
  getStepsSummary,
  matchesDateRangeFilter,
  matchesExecutionStatusFilter,
  redactSensitiveData,
  summarizeJson,
} from "./runsUiHelpers";

describe("runsUiHelpers", () => {
  it("maps execution status labels and tones", () => {
    expect(getExecutionStatusLabel("completed")).toBe("?????");
    expect(getExecutionStatusTone("failed")).toBe("failed");
    expect(getExecutionStatusTone("running")).toBe("running");
    expect(getExecutionStatusTone("cancelled")).toBe("cancelled");
    expect(getNodeStatusLabel("pending")).toBe("Not executed");
  });

  it("formats duration and computes execution duration", () => {
    expect(formatDurationMs(1800)).toBe("1.8s");
    expect(formatDurationMs(90)).toBe("90ms");
    const ms = getExecutionDurationMs({
      startedAt: "2026-08-08T16:00:00.000Z",
      completedAt: "2026-08-08T16:00:01.800Z",
      status: "completed",
    });
    expect(ms).toBe(1800);
  });

  it("summarizes steps and filters status/date", () => {
    expect(
      getStepsSummary({
        nodes: [
          { nodeId: "a", status: "completed" },
          { nodeId: "b", status: "failed" },
          { nodeId: "c", status: "pending" },
        ],
      })
    ).toBe("2/3");
    expect(matchesExecutionStatusFilter("waiting", "running")).toBe(true);
    expect(matchesExecutionStatusFilter("completed", "failed")).toBe(false);
    const now = Date.parse("2026-08-08T20:00:00.000Z");
    expect(
      matchesDateRangeFilter("2026-08-08T10:00:00.000Z", "24h", now)
    ).toBe(true);
    expect(
      matchesDateRangeFilter("2026-07-01T10:00:00.000Z", "7d", now)
    ).toBe(false);
  });

  it("redacts secrets from nested payloads", () => {
    const redacted = redactSensitiveData({
      to: "a@b.com",
      password: "hunter2",
      headers: { Authorization: "Bearer abc.def" },
      nested: { api_key: "xyz", ok: true },
      note: "Bearer abc.def.ghi",
    }) as Record<string, unknown>;

    expect(redacted.password).toBe("[REDACTED]");
    expect((redacted.headers as Record<string, unknown>).Authorization).toBe(
      "[REDACTED]"
    );
    expect((redacted.nested as Record<string, unknown>).api_key).toBe(
      "[REDACTED]"
    );
    expect((redacted.nested as Record<string, unknown>).ok).toBe(true);
    expect(redacted.note).toBe("[REDACTED]");
    expect(summarizeJson({ token: "secret", x: 1 })).toContain("[REDACTED]");
    expect(summarizeJson({ token: "secret", x: 1 })).not.toContain("secret");
  });

  it("builds step views including not-executed workflow nodes", () => {
    const steps = buildExecutionSteps(
      {
        nodes: [
          {
            nodeId: "A",
            label: "Trigger",
            status: "completed",
            startedAt: "2026-08-08T16:00:00.000Z",
          },
          {
            nodeId: "B",
            label: "Send",
            status: "failed",
            error: "boom",
          },
        ],
      },
      [
        { id: "A", label: "Trigger", type: "trigger" },
        { id: "B", label: "Send", type: "action" },
        { id: "C", label: "Delay", type: "delay" },
      ]
    );
    expect(steps).toHaveLength(3);
    expect(steps[0].status).toBe("completed");
    expect(steps[1].status).toBe("failed");
    expect(steps[2].status).toBe("pending");
    expect(getNodeStatusLabel(steps[2].status)).toBe("Not executed");
  });
});
