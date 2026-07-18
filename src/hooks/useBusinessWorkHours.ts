import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";

export type WorkSchedule = Record<
  string,
  { start: string; end: string; breaks?: string } | null
>;

export type ScheduleDay = {
  day: number;
  start?: string;
  end?: string;
  closed?: boolean;
};

export function workHoursQueryKey(businessId?: string | null) {
  return ["work-hours", businessId] as const;
}

export function buildScheduleArray(
  businessSchedule: WorkSchedule | null | undefined
): ScheduleDay[] {
  if (!businessSchedule) return [];

  return Object.entries(businessSchedule).map(([day, value]) => {
    if (!value?.start || !value?.end) {
      return { day: Number(day), closed: true };
    }

    return {
      day: Number(day),
      start: value.start,
      end: value.end,
      closed: false,
    };
  });
}

export function getWorkHoursLabel(schedule: WorkSchedule | null | undefined) {
  if (!schedule) return "טוען...";

  const openDays = Object.values(schedule).filter(
    (item) => item?.start && item?.end
  );

  if (openDays.length === 0) return "לא הוגדרו שעות — הגדר כדי לתאם פגישות";

  return `${openDays.length} ימי פעילות`;
}

export function hasOpenWorkDays(schedule: WorkSchedule | null | undefined) {
  if (!schedule) return false;
  return Object.values(schedule).some((item) => item?.start && item?.end);
}

async function fetchWorkHours(businessId: string): Promise<WorkSchedule> {
  const res = await API.get("/appointments/get-work-hours", {
    params: { businessId },
  });

  return (res.data?.schedule || res.data?.workHours || {}) as WorkSchedule;
}

export function useBusinessWorkHours(businessId?: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: workHoursQueryKey(businessId),
    queryFn: () => fetchWorkHours(String(businessId)),
    enabled: Boolean(businessId),
    staleTime: 30_000,
  });

  const schedule = query.data ?? null;
  const scheduleArray = buildScheduleArray(schedule);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: workHoursQueryKey(businessId) });

  const setSchedule = (next: WorkSchedule) => {
    queryClient.setQueryData(workHoursQueryKey(businessId), next);
  };

  return {
    schedule,
    scheduleArray,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    invalidate,
    setSchedule,
    label: getWorkHoursLabel(schedule),
    hasOpenDays: hasOpenWorkDays(schedule),
  };
}
