import { describe, expect, it } from "vitest";
import { resolveEmbeddedSignupMetaApp } from "./embeddedSignupMetaApp";

const platform = {
  ready: true,
  appId: "1737199444319263",
  configId: "platform-config",
  graphVersion: "v21.0",
  coexistenceEnabled: true,
  coexistence: {
    enabled: true,
    appId: "1737199444319263",
    configId: "1057504196895353",
  },
};

describe("resolveEmbeddedSignupMetaApp", () => {
  it("keeps Cloud API on the platform Meta app", () => {
    expect(resolveEmbeddedSignupMetaApp(platform, "cloud_api")).toEqual({
      appId: "1737199444319263",
      configId: "platform-config",
    });
  });

  it("uses the approved Tech Provider Coexistence config when the server sent it", () => {
    expect(resolveEmbeddedSignupMetaApp(platform, "coexistence")).toEqual({
      appId: "1737199444319263",
      configId: "1057504196895353",
    });
  });

  it("falls back to the platform app when dedicated ids are absent", () => {
    expect(
      resolveEmbeddedSignupMetaApp(
        {
          ...platform,
          coexistence: { enabled: true },
        },
        "coexistence"
      )
    ).toEqual({
      appId: "1737199444319263",
      configId: "platform-config",
    });
  });
});
