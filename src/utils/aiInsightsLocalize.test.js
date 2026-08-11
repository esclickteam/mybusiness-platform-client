import { describe, expect, it } from "vitest";
import { localizeInsight } from "./aiInsightsLocalize";

describe("localizeInsight", () => {
  it("interpolates siteName for missing_seo", () => {
    const t = (key, opts = {}) => {
      if (key.endsWith(".description")) {
        return `לאתר "${opts.name}" חסרות הגדרות SEO`;
      }
      return opts.defaultValue || key;
    };

    const result = localizeInsight(
      {
        id: "missing_seo",
        title: "השלימו הגדרות SEO",
        description: 'לאתר "Server Name" חסרות הגדרות SEO',
        meta: { siteName: "Launch Gate Site" },
      },
      t
    );

    expect(result.description).toContain("Launch Gate Site");
    expect(result.description).not.toContain('""');
  });

  it("keeps server description when siteName is absent", () => {
    const t = (key, opts = {}) => {
      if (key.endsWith(".description")) {
        return `לאתר "${opts.name ?? ""}" חסרות`;
      }
      return opts.defaultValue || key;
    };

    const result = localizeInsight(
      {
        id: "missing_seo",
        title: "השלימו הגדרות SEO",
        description: 'לאתר "Launch Gate Site" חסרות הגדרות SEO',
        meta: {},
      },
      t
    );

    expect(result.description).toBe(
      'לאתר "Launch Gate Site" חסרות הגדרות SEO'
    );
  });
});
