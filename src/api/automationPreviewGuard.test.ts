import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalReadOnly = import.meta.env.VITE_AUTOMATIONS_READ_ONLY;
const originalVercelEnv = import.meta.env.VITE_VERCEL_ENV;

describe("automationPreviewGuard", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY = originalReadOnly;
    import.meta.env.VITE_VERCEL_ENV = originalVercelEnv;
  });

  it("is off when flags are unset", async () => {
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY = "";
    import.meta.env.VITE_VERCEL_ENV = "";
    const mod = await import("./automationPreviewGuard");
    expect(mod.isAutomationsReadOnly()).toBe(false);
    expect(() => mod.assertAutomationWritesAllowed()).not.toThrow();
  });

  it("blocks when VITE_AUTOMATIONS_READ_ONLY=1", async () => {
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY = "1";
    import.meta.env.VITE_VERCEL_ENV = "";
    const mod = await import("./automationPreviewGuard");
    expect(mod.isAutomationsReadOnly()).toBe(true);
    expect(() => mod.assertAutomationWritesAllowed()).toThrow(
      mod.AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE
    );
  });

  it("blocks when VITE_VERCEL_ENV=preview", async () => {
    import.meta.env.VITE_AUTOMATIONS_READ_ONLY = "";
    import.meta.env.VITE_VERCEL_ENV = "preview";
    const mod = await import("./automationPreviewGuard");
    expect(mod.isAutomationsReadOnly()).toBe(true);
  });
});
