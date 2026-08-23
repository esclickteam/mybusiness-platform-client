import type { PartnerClient, PartnerTask } from "../types/partner";

export type PartnerWorkItem = {
  clientId: string;
  clientName: string;
  contactName: string;
  taskId: string;
  title: string;
  dueAt?: string | null;
  done?: boolean;
};

export function flattenPartnerTasks(clients: PartnerClient[] = []): PartnerWorkItem[] {
  const items: PartnerWorkItem[] = [];
  for (const client of clients) {
    for (const task of client.tasks || []) {
      items.push({
        clientId: client._id,
        clientName: client.contact?.businessName || "לקוח",
        contactName: client.contact?.contactName || "",
        taskId: String(task._id || `${client._id}-${task.title}`),
        title: task.title,
        dueAt: task.dueAt || null,
        done: Boolean(task.done),
      });
    }
  }
  return items;
}

export function openPartnerTasks(clients: PartnerClient[] = []): PartnerWorkItem[] {
  return flattenPartnerTasks(clients).filter((item) => !item.done);
}

export function upcomingReminders(
  clients: PartnerClient[] = [],
  limit = 5
): PartnerWorkItem[] {
  return openPartnerTasks(clients)
    .filter((item) => item.dueAt)
    .sort((a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime())
    .slice(0, limit);
}

export function openTaskCount(client: Pick<PartnerClient, "tasks">): number {
  return (client.tasks || []).filter((task: PartnerTask) => !task.done).length;
}

export function nextTaskDue(client: Pick<PartnerClient, "tasks">): string | null {
  const open = (client.tasks || [])
    .filter((task) => !task.done && task.dueAt)
    .sort(
      (a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime()
    );
  return open[0]?.dueAt || null;
}

export function formatPartnerDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPartnerDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function eventTypeLabel(client: PartnerClient): string {
  const sku = client.selectedSkus?.[0];
  return sku?.displayNameHe || sku?.nameHe || sku?.sku || "—";
}
