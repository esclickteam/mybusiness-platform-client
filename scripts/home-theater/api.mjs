import fs from "node:fs";
const d = JSON.parse(fs.readFileSync((process.env.CAPTURE_DIR || "/tmp/home-theater") + "/auth.json", "utf8"));
const token = d.origins[0].localStorage.find((x) => x.name === "token").value;
export const API = "https://server-staging-15bb.up.railway.app/api";
export const BIZ = "6ab62f565ba1a92f3046b5ad";
export async function api(method, path, body) {
  const r = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-business-id": BIZ, Origin: "https://mybusiness-platform-client-staging.vercel.app" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = text.slice(0, 500); }
  return { status: r.status, json };
}
if (process.argv[2]) {
  const res = await api(process.argv[2], process.argv[3], process.argv[4] ? JSON.parse(process.argv[4]) : undefined);
  console.log(res.status, JSON.stringify(res.json, null, 1).slice(0, Number(process.env.MAX || 4000)));
}
