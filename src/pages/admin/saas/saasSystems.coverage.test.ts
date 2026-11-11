import assert from "node:assert/strict";
import test from "node:test";
import { ownerCoverage } from "./saasSystems.ts";

test("every approved system is listed, and an empty system is not given a fake owner", () => {
  const coverage = ownerCoverage([
    { templateSlug: "cliny", ownerKey: "a@example.com" },
    { templateSlug: "cliny", ownerKey: "a@example.com" },
    { templateSlug: "dinevo", ownerKey: "b@example.com" },
    { templateSlug: "legacy", ownerKey: "c@example.com" },
  ]);
  assert.equal(coverage.systems.length, 10);
  const cliny = coverage.systems.find((system) => system.slug === "cliny");
  const tableflow = coverage.systems.find((system) => system.slug === "tableflow");
  assert.equal(cliny?.businesses, 2);
  assert.equal(cliny?.owners, 1);
  assert.equal(tableflow?.businesses, 0);
  assert.equal(tableflow?.owners, 0);
  assert.match(tableflow?.detail || "", /עדיין לא נקראים/);
  assert.deepEqual(coverage.unknown, [{ slug: "legacy", businesses: 1 }]);
});
