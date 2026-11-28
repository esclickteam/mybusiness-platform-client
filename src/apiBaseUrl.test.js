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

  it("keeps an explicit Railway Staging API when baked into the build", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://server-staging-15bb.up.railway.app/api",
        mode: "production",
        hostname: "geo-decision-staging-preview.vercel.app",
      })
    ).toBe(RAILWAY_STAGING_API);
  });

  it("lets only the opted-in PR preview call production", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "mybusiness-platform-client-git-cursor-860463-esclicks-projects.vercel.app",
        allowProductionOnThisPreview: true,
      })
    ).toBe(PRODUCTION_API);
  });

  it("keeps every other preview on Railway staging when the opt-in is off", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "mybusiness-platform-client-git-cursor-860463-esclicks-projects.vercel.app",
        allowProductionOnThisPreview: false,
      })
    ).toBe(RAILWAY_STAGING_API);
  });

  it("keeps the dedicated staging host on Railway even if the opt-in is set", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "mybusiness-platform-client-staging.vercel.app",
        allowProductionOnThisPreview: true,
      })
    ).toBe(RAILWAY_STAGING_API);
  });

  it("does not let the preview opt-in move production or local hosts", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "www.bizuply.com",
        allowProductionOnThisPreview: true,
      })
    ).toBe("/api");
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "localhost",
        allowProductionOnThisPreview: true,
      })
    ).toBe("/api");
  });

  it("forces the dedicated staging client host to Railway Staging", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "mybusiness-platform-client-staging.vercel.app",
      })
    ).toBe(RAILWAY_STAGING_API);
  });

  it("uses same-origin /api on Cloudflare Staging tunnels (proxied to Railway Staging)", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "screens-continuing-thesaurus-farming.trycloudflare.com",
      })
    ).toBe("/api");
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
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "geo.bizuply.com",
      })
    ).toBe("/api");
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "partners.bizuply.com",
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

  
  it("uses same-origin /api on localhost even if Production env is baked", () => {
    expect(
      resolveApiBaseUrl({
        envApiUrl: "https://api.bizuply.com/api",
        mode: "production",
        hostname: "127.0.0.1",
      })
    ).toBe("/api");
  });

it("uses /api in local development when env is empty", () => {
    expect(resolveApiBaseUrl({ envApiUrl: "", mode: "development", hostname: "localhost" })).toBe(
      "/api"
    );
  });
});
