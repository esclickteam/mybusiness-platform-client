export type LeadViewMode = "table" | "compact" | "kanban";

export type LeadListState = {
  q: string;
  status: string;
  stage: string;
  source: string;
  campaign: string;
  formId: string;
  assignedTo: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
  dir: "asc" | "desc";
  viewMode: LeadViewMode;
  page: number;
  visibleColumns: string[];
  columnOrder: string[];
  columnWidths: Record<string, number>;
  scrollTop: number;
};

export const DEFAULT_COLUMNS = [
  "name",
  "phone",
  "email",
  "status",
  "source",
  "campaign",
  "form",
  "assignedToName",
  "createdAt",
  "updatedAt",
];

export const EMPTY_LEAD_LIST_STATE: LeadListState = {
  q: "",
  status: "all",
  stage: "all",
  source: "all",
  campaign: "",
  formId: "",
  assignedTo: "all",
  dateFrom: "",
  dateTo: "",
  sort: "createdAt",
  dir: "desc",
  viewMode: "table",
  page: 1,
  visibleColumns: DEFAULT_COLUMNS,
  columnOrder: DEFAULT_COLUMNS,
  columnWidths: {},
  scrollTop: 0,
};

export function storageKey(businessId?: string) {
  return `bizuply_crm_lead_list_${businessId || "default"}`;
}

export function loadLeadListState(businessId?: string): LeadListState {
  try {
    const raw = sessionStorage.getItem(storageKey(businessId));
    if (!raw) return { ...EMPTY_LEAD_LIST_STATE };
    const parsed = JSON.parse(raw) as Partial<LeadListState>;
    return {
      ...EMPTY_LEAD_LIST_STATE,
      ...parsed,
      visibleColumns: parsed.visibleColumns?.length
        ? parsed.visibleColumns
        : DEFAULT_COLUMNS,
      columnOrder: parsed.columnOrder?.length ? parsed.columnOrder : DEFAULT_COLUMNS,
    };
  } catch {
    return { ...EMPTY_LEAD_LIST_STATE };
  }
}

export function saveLeadListState(businessId: string | undefined, state: LeadListState) {
  try {
    sessionStorage.setItem(storageKey(businessId), JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
