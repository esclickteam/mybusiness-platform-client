/**
 * Returns the visitor country (Vercel edge header) and preferred UI language.
 * Israel → Hebrew, everywhere else → English.
 */

function languageFromCountry(country) {
  return String(country || "").toUpperCase() === "IL" ? "he" : "en";
}

export default function handler(req, res) {
  const country = String(
    req.headers["x-vercel-ip-country"] ||
      req.headers["cf-ipcountry"] ||
      "",
  )
    .trim()
    .toUpperCase();

  const language = languageFromCountry(country);

  res.setHeader("Cache-Control", "private, max-age=300");
  res.setHeader(
    "Set-Cookie",
    `bizuply_geo_lang=${language}; Path=/; Max-Age=2592000; SameSite=Lax`,
  );
  res.status(200).json({
    country: country || null,
    language,
  });
}
