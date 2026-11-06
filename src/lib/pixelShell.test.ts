import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

function pixelScript(html: string): string {
  const marker = "Meta Pixel";
  const at = html.indexOf(marker);
  const start = html.indexOf("<script>", at);
  const end = html.indexOf("</script>", start);
  return html.slice(start + "<script>".length, end);
}

function runPixel(script: string, initialCookie: string, publicSite = false) {
  const inserted: string[] = [];
  const listeners: Array<(event: { detail?: string }) => void> = [];
  let jar = initialCookie;
  const document = {
    get cookie() {
      return jar;
    },
    set cookie(value: string) {
      const pair = value.split(";")[0];
      const name = pair.split("=")[0].trim();
      const parts = jar.split("; ").filter((part) => part && !part.startsWith(`${name}=`));
      if (!/Max-Age=0/i.test(value) && pair.includes("=") && pair.split("=")[1]) parts.push(pair.trim());
      jar = parts.join("; ");
    },
    createElement() {
      return { async: false, src: "" };
    },
    getElementsByTagName() {
      return [{ parentNode: { insertBefore(node: { src?: string }) { if (node.src) inserted.push(node.src); } } }];
    },
  };
  const window = {
    __BIZUPLY_PUBLIC_SITE__: publicSite,
    requestIdleCallback(fn: () => void) {
      fn();
    },
    addEventListener(_type: string, fn: (event: { detail?: string }) => void) {
      listeners.push(fn);
    },
    location: { hostname: "bizuply.com" },
  };
  const sandbox = window as typeof window & {
    document: typeof document;
    location: { hostname: string };
    decodeURIComponent: typeof decodeURIComponent;
    requestIdleCallback: (fn: () => void) => void;
  };
  sandbox.window = window;
  sandbox.document = document;
  sandbox.location = window.location;
  sandbox.decodeURIComponent = decodeURIComponent;
  sandbox.requestIdleCallback = (fn) => fn();
  vm.runInNewContext(script, sandbox);
  return {
    inserted,
    get cookie() {
      return jar;
    },
    choose(detail: "all" | "essential") {
      document.cookie = `bizuply_tracking=${detail}; Path=/; Max-Age=15552000; SameSite=Lax`;
      for (const listener of listeners) listener({ detail });
    },
  };
}

const root = resolve(process.cwd());
const shells = ["index.html", "marketing.html"].map((name) => ({
  name,
  script: pixelScript(readFileSync(resolve(root, name), "utf8")),
}));

describe("pixel shells", () => {
  it("uses the same measurement gate on the homepage and on the other pages", () => {
    expect(shells[0].script.replace(/\s+/g, " ").trim()).toBe(shells[1].script.replace(/\s+/g, " ").trim());
  });

  for (const shell of shells) {
    it(`${shell.name} does not load the pixel before measurement is allowed`, () => {
      expect(runPixel(shell.script, "").inserted).toEqual([]);
      expect(runPixel(shell.script, "bizuply_tracking=essential").inserted).toEqual([]);
      expect(runPixel(shell.script, "bizuply_lang=he").inserted).toEqual([]);
    });

    it(`${shell.name} loads the pixel only after an explicit all choice, including a later visit`, () => {
      const first = runPixel(shell.script, "");
      first.choose("all");
      expect(first.inserted).toEqual(["https://connect.facebook.net/en_US/fbevents.js"]);
      const returned = runPixel(shell.script, "bizuply_tracking=all");
      expect(returned.inserted).toEqual(["https://connect.facebook.net/en_US/fbevents.js"]);
    });

    it(`${shell.name} stops a new load when the visitor refuses`, () => {
      const page = runPixel(shell.script, "bizuply_tracking=all; _fbp=1");
      expect(page.inserted).toHaveLength(1);
      const before = page.inserted.length;
      page.choose("essential");
      expect(page.inserted).toHaveLength(before);
      expect(page.cookie.includes("_fbp=")).toBe(false);
    });

    it(`${shell.name} does not load the pixel on a published customer site`, () => {
      expect(runPixel(shell.script, "bizuply_tracking=all", true).inserted).toEqual([]);
    });
  }
});
