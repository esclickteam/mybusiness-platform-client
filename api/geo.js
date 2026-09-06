/**
 * Returns the visitor country (Vercel / Cloudflare edge headers) and the
 * suggested UI language for first-time visitors.
 *
 * Explicit user language cookies are never overwritten here.
 */

const SPANISH_COUNTRIES = new Set([
  "ES",
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "UY",
  "PY",
  "EC",
  "BO",
  "VE",
  "CR",
  "PA",
  "DO",
  "GT",
  "HN",
  "SV",
  "NI",
  "CU",
  "PR",
  "GQ",
]);

const ARABIC_COUNTRIES = new Set([
  "AE",
  "SA",
  "QA",
  "BH",
  "KW",
  "OM",
  "JO",
  "EG",
  "MA",
  "LB",
  "IQ",
  "DZ",
  "TN",
  "LY",
  "SY",
  "YE",
  "PS",
  "SD",
  "MR",
  "DJ",
  "SO",
  "KM",
]);

function languageFromCountry(country) {
  const code = String(country || "")
    .trim()
    .toUpperCase();
  if (!code || code === "XX" || code === "T1") return null;
  if (code === "IL") return "he";
  if (code === "BR") return "pt-BR";
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (ARABIC_COUNTRIES.has(code)) return "ar";
  return "en";
}

export default function handler(req, res) {
  const country = String(
    req.headers["x-vercel-ip-country"] ||
      req.headers["cf-ipcountry"] ||
      req.headers["x-country-code"] ||
      "",
  )
    .trim()
    .toUpperCase();

  const knownCountry = Boolean(country) && country !== "XX" && country !== "T1";
  const language = knownCountry ? languageFromCountry(country) : null;

  res.setHeader("Cache-Control", "private, no-store");

  if (language) {
    res.setHeader(
      "Set-Cookie",
      `bizuply_geo_lang=${encodeURIComponent(language)}; Path=/; Max-Age=2592000; SameSite=Lax`,
    );
  }

  res.status(200).json({
    country: knownCountry ? country : null,
    language: language || null,
    fallback: "en",
  });
}
