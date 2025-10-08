// src/data/cities.js

export async function fetchCities() {
  try {
    const response = await fetch(
      "https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&limit=2000"
    );

    if (!response.ok) {
      throw new Error("Error loading data from the API");
    }

    const data = await response.json();

    // Extract only the name of the locality
    const cities = data.result.records.map((r) => r["שם יישוב"]);

    // Filter duplicates + sort alphabetically
    return [...new Set(cities)].sort();
  } catch (error) {
    console.error("Error loading cities:", error);
    return [];
  }
}

export default fetchCities;
