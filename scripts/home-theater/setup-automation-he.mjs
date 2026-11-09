import { api } from "./api.mjs";
const nodes = [
  { id: "trigger_1", type: "trigger", position: { x: 40, y: 160 }, data: { label: "שינוי סטטוס ליד", triggerKey: "lead_status_changed", toStatus: "interested" } },
  { id: "a_tag", type: "action", position: { x: 360, y: 160 }, data: { label: "הוספת תגית", actionKey: "add_tag", tag: "מוכנה להצעת מחיר" } },
  { id: "a_note", type: "action", position: { x: 680, y: 160 }, data: { label: "הערה בכרטיס הלקוח", actionKey: "create_crm_note", text: "אוטומציה: {{lead.name}} סומנה כמתעניינת — נוסף תיוג להמשך טיפול." } },
];
const edges = [
  { id: "e1", source: "trigger_1", target: "a_tag" },
  { id: "e2", source: "a_tag", target: "a_note" },
];
const created = await api("POST", "/automations", {
  name: "[דמו] ליד מתעניין — תיוג והערה",
  description: "כשליד עובר לסטטוס מתעניין: מוסיפים תגית ורושמים הערה בכרטיס הלקוח.",
  nodes, edges, useStarter: false,
});
console.log("create", created.status, created.json?.workflow?._id, created.json?.error);
const id = created.json?.workflow?._id;
if (id) {
  const v = await api("POST", `/automations/${id}/validate`, {});
  console.log("validate", v.status, JSON.stringify(v.json).slice(0, 800));
  const p = await api("POST", `/automations/${id}/publish`, {});
  console.log("publish", p.status, JSON.stringify(p.json).slice(0, 800));
}
