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
    appId: "2227158505349054",
    configId: "1685850526585700",
  },
};

describe("resolveEmbeddedSignupMetaApp", () => {
  it("keeps Cloud API on the platform Meta app", () => {
    expect(resolveEmbeddedSignupMetaApp(platform, "cloud_api")).toEqual({
      appId: "1737199444319263",
      configId: "platform-config",
    });
  });

  it("uses the Coexistence Test App when the server sent dedicated ids", () => {
    expect(resolveEmbeddedSignupMetaApp(platform, "coexistence")).toEqual({
      appId: "2227158505349054",
      configId: "1685850526585700",
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
