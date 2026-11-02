import assert from "node:assert/strict";
import {
  buildHomeSessionRedirectResponse,
  fetchHomeSessionRedirectUrl,
  hasRefreshSessionCookie,
  isMarketingHomePath,
  sanitizeEdgeRedirect,
} from "./homeSessionRedirect.mjs";

assert.equal(isMarketingHomePath("/"), true);
assert.equal(isMarketingHomePath("/he"), true);
assert.equal(isMarketingHomePath("/es"), true);
assert.equal(isMarketingHomePath("/pt-br"), true);
assert.equal(isMarketingHomePath("/ar"), true);
assert.equal(isMarketingHomePath("/pricing"), false);
assert.equal(isMarketingHomePath("/admin/dashboard"), false);

assert.equal(hasRefreshSessionCookie("a=1; refreshToken=abc; b=2"), true);
assert.equal(hasRefreshSessionCookie("bizuply_session=1"), false);

assert.equal(sanitizeEdgeRedirect("/admin/dashboard"), "/admin/dashboard");
assert.equal(
  sanitizeEdgeRedirect("/business/x/dashboard/saas"),
  "/business/x/dashboard/saas",
);
assert.equal(sanitizeEdgeRedirect("/"), null);
assert.equal(sanitizeEdgeRedirect("/he"), null);
assert.equal(sanitizeEdgeRedirect("//evil.com"), null);
assert.equal(sanitizeEdgeRedirect("https://evil.com/x"), null);
assert.equal(sanitizeEdgeRedirect("/login"), null);

{
  const req = new Request("https://bizuply.com/");
  const res = buildHomeSessionRedirectResponse(req, "/admin/dashboard");
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), "https://bizuply.com/admin/dashboard");
  assert.match(res.headers.get("cache-control") || "", /no-store/);
  assert.equal(buildHomeSessionRedirectResponse(req, "/"), null);
}

{
  let called = false;
  const redirect = await fetchHomeSessionRedirectUrl({
    request: new Request("https://bizuply.com/", {
      headers: { cookie: "bizuply_lang=he" },
    }),
    host: "bizuply.com",
    fetchImpl: async () => {
      called = true;
      return new Response("{}", { status: 200 });
    },
  });
  assert.equal(redirect, null);
  assert.equal(called, false, "guest must not call API");
}

{
  const redirect = await fetchHomeSessionRedirectUrl({
    request: new Request("https://bizuply.com/", {
      headers: { cookie: "refreshToken=live" },
    }),
    host: "bizuply.com",
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          ok: true,
          redirectUrl: "/business/abc/dashboard",
        }),
        { status: 200 },
      ),
  });
  assert.equal(redirect, "/business/abc/dashboard");
}

{
  const redirect = await fetchHomeSessionRedirectUrl({
    request: new Request("https://bizuply.com/", {
      headers: { cookie: "refreshToken=dead" },
    }),
    host: "bizuply.com",
    fetchImpl: async () => new Response("{}", { status: 401 }),
  });
  assert.equal(redirect, null);
}

{
  const redirect = await fetchHomeSessionRedirectUrl({
    request: new Request("https://bizuply.com/", {
      headers: { cookie: "refreshToken=slow" },
    }),
    host: "bizuply.com",
    timeoutMs: 20,
    fetchImpl: async (_url, init) =>
      new Promise((resolve, reject) => {
        const signal = init && init.signal;
        if (signal) {
          signal.addEventListener("abort", () =>
            reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
          );
        }
      }),
  });
  assert.equal(redirect, null, "timeout must fall back to home");
}

console.log("homeSessionRedirect.test.mjs: ok");
