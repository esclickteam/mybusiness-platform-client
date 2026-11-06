/** Run actions stay hidden unless the server says this admin may run them. */
export function canShowMeasurementActions(
  status: { canRun?: boolean } | null | undefined
) {
  return status?.canRun === true;
}
