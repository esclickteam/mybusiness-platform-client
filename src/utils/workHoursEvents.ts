export const WORK_HOURS_UPDATED_EVENT = "bizuply:work-hours-updated";

export function dispatchWorkHoursUpdated(
  businessId: string,
  schedule: Record<string, unknown>
) {
  window.dispatchEvent(
    new CustomEvent(WORK_HOURS_UPDATED_EVENT, {
      detail: { businessId, schedule },
    })
  );
}
