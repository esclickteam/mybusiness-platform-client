import { describe, expect, it } from "vitest";
import en from "./en.json";
import he from "./he.json";
import es from "./es.json";
import pt from "./pt-BR.json";
import ar from "./ar.json";

const packs = [en, he, es, pt, ar];
const ids = ["partner", "dpa", "subprocessors", "transfers", "use", "ai", "subscriptions"];

describe("legal annex", () => {
  it("keeps the same documents and the catalog figures in every language", () => {
    for (const pack of packs) {
      expect(Object.keys(pack.docs)).toEqual(ids);
      const text = JSON.stringify(pack.docs);
      for (const token of ["499", "5,000", "10", "30", "35", "40", "99", "990", "49", "129", "privacy@bizuply.com"]) {
        expect(text).toContain(token);
      }
      expect(text).toContain("Lemon Squeezy");
      expect(text).toContain("Bizuply LLC");
    }
  });
});
