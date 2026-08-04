import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();
const put = vi.fn();
const del = vi.fn();
const get = vi.fn();

vi.mock("../api", () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
    put: (...args: unknown[]) => put(...args),
    delete: (...args: unknown[]) => del(...args),
  },
}));

const originalReadOnly = import.meta.env.VITE_AUTOMATIONS_READ_ONLY;
const originalVercelEnv = import.meta.env.VITE_VERCEL_ENV;

describe("automationWorkflowApi preview write guard", () => {
  beforeEach(() => {
    vi.resetModules();
    post.mockReset();
    put.mockReset();
    del.mockReset();
    get.mockReset();
    get.mockResolvedValue({ data: { workflows: [], recipes: [], stats: {} } });
    post.mockResolvedValue({ data: { workflow: { _id: "w1" }, result: {} } });
    put.mockResolvedValue({ data: { workflow: { _id: "w1" } } });
    del.mockResolvedValue({ data: { ok: true } });
  });

  afterEach(() => {
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY = originalReadOnly;
    import.meta.env.VITE_VERCEL_ENV = originalVercelEnv;
  });

  async function loadApi(readOnly: boolean) {
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY = readOnly ? "1" : "";
    import.meta.env.VITE_VERCEL_ENV = "";
    return import("./automationWorkflowApi");
  }

  it("blocks create/update/publish/dry-run/retry when read-only", async () => {
    const api = await loadApi(true);
    await expect(api.createAutomationWorkflow("b1")).rejects.toThrow(
      api.AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE
    );
    await expect(
      api.saveAutomationWorkflow("b1", "w1", { name: "x" })
    ).rejects.toThrow(api.AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
    await expect(api.publishAutomationWorkflow("b1", "w1")).rejects.toThrow(
      api.AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE
    );
    await expect(
      api.dryRunAutomationWorkflow("b1", "w1", { eventType: "manual" })
    ).rejects.toThrow(api.AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
    await expect(api.retryAutomationExecution("b1", "e1")).rejects.toThrow(
      api.AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE
    );
    expect(post).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it("allows writes when flag is off", async () => {
    const api = await loadApi(false);
    await api.createAutomationWorkflow("b1", { name: "n" });
    await api.saveAutomationWorkflow("b1", "w1", { name: "n" });
    await api.publishAutomationWorkflow("b1", "w1");
    await api.dryRunAutomationWorkflow("b1", "w1", {});
    await api.retryAutomationExecution("b1", "e1");
    expect(post).toHaveBeenCalled();
    expect(put).toHaveBeenCalled();
  });

  it("keeps GET helpers available in read-only", async () => {
    const api = await loadApi(true);
    await api.listAutomationWorkflows("b1");
    await api.getAutomationStats("b1");
    await api.listAutomationRecipes("b1");
    expect(get).toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });
});
