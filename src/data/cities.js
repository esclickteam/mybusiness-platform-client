// src/data/cities.js
// Fetch a deduplicated, A–Z sorted list of U.S. cities for an American audience.

export async function fetchCities() {
  try {
    const response = await fetch(
      "https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&refine.country=United+States&rows=10000"
    );

    if (!response.ok) {
      throw new Error("Failed to load data from the cities API");
    }

    const data = await response.json();

    // Extract city names from the dataset (field: `name`)
    const rawCities =
      (data?.records || []).map((r) => r?.fields?.name).filter(Boolean);

    // Deduplicate case-insensitively, then sort A–Z for U.S. audience
    const seen = new Set();
    const cities = [];
    for (const name of rawCities) {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        cities.push(name);
      }
    }

    // Sort alphabetically (A–Z), case-insensitive, English locale
    cities.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

    return cities;
  } catch (error) {
    console.error("Error loading U.S. cities:", error);
    return [];
  }
}

export default fetchCities;
