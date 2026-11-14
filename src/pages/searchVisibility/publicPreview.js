import API from "../../api";

export async function runPublicPreview(url, onUpdate) {
  const started = await API.post("/search-visibility/preview", { url }, { timeout: 15000 });
  const id = started.data?.id;
  const token = started.data?.token;
  if (!id || !token) throw new Error("הסריקה לא התחילה");
  for (let attempt = 0; attempt < 45; attempt += 1) {
    const response = await API.get(`/search-visibility/preview/${id}`, {
      timeout: 10000,
      headers: { "X-Preview-Token": token },
    });
    const row = response.data || {};
    onUpdate?.(row);
    if (row.status === "completed") return row;
    if (row.status === "failed") throw new Error(row.error || "הסריקה לא הושלמה");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("הסריקה נמשכת יותר מהצפוי. נסו שוב בעוד רגע.");
}
