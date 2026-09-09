import { describe, expect, it, vi, beforeEach } from "vitest";
import handler from "../../api/geo.js";

function mockRes() {
  const headers = {};
  return {
    headers,
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      headers[String(name).toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("/api/geo country mapping", () => {
  beforeEach(() => {
    vi.stubGlobal("document", undefined);
  });

  it.each([
    ["IL", "he"],
    ["BR", "pt-BR"],
    ["AE", "ar"],
    ["MX", "es"],
    ["US", "en"],
  ])("maps %s to %s", (country, language) => {
    const res = mockRes();
    handler({ headers: { "x-vercel-ip-country": country } }, res);
    expect(res.body).toEqual({
      country,
      language,
      fallback: "en",
    });
    const cookie = res.headers["set-cookie"];
    const blob = Array.isArray(cookie) ? cookie.join(";") : String(cookie || "");
    expect(blob).toContain(`bizuply_geo_lang=${encodeURIComponent(language)}`);
    expect(blob).toContain(`bizuply_geo_country=${country}`);
  });

  it("does not invent a country when geo headers are missing", () => {
    const res = mockRes();
    handler({ headers: {} }, res);
    expect(res.body).toEqual({
      country: null,
      language: null,
      fallback: "en",
    });
    expect(res.headers["set-cookie"]).toBeUndefined();
  });
});
