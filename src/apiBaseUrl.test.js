import { describe, expect, it } from "vitest";
import {
  PRODUCTION_API,
  RAILWAY_STAGING_API,
  isVercelPreviewHost,
  resolveApiBaseUrl,
} from "./apiBaseUrl";

describe("resolveApiBaseUrl", () => {
  it("sends Vercel Preview hosts to Railway staging even when env is production", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "mybusiness-platform-client-7wmpgvjpb-esclicks-projects.vercel.app",
      })
    ).toBe(RAILWAY_STAGING_API);
  });

  it("uses the same-origin /api proxy on production hosts so the session cookie is sent", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "www.bizuply.com",
      })
    ).toBe("/api");
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "bizuply.co.il",
      })
    ).toBe("/api");
  });

  it("does not treat unrelated vercel.app hosts as this project's preview", () => {
    expect(isVercelPreviewHost("some-other-app.vercel.app")).toBe(false);
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "some-other-app.vercel.app",
      })
    ).toBe(PRODUCTION_API);
  });

  it("uses /api in local development when env is empty", () => {
    expect(resolveApiBaseUrl({ envApiUrl: "", mode: "development", hostname: "localhost" })).toBe(
      "/api"
    );
  });
});
