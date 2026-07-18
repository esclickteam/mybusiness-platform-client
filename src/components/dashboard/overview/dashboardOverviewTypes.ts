export type DatePreset = "today" | "week" | "month" | "year" | "custom";

export type PerformanceMetric =
  | "views"
  | "leads"
  | "appointments"
  | "collaborations";

export type ChartResolution = "day" | "week" | "month" | "year" | "auto";

export type SeriesPoint = {
  date: string;
  value: number;
};

export type DashboardOverviewData = {
  range: {
    startDate: string;
    endDate: string;
    comparisonStartDate: string;
    comparisonEndDate: string;
    resolution: ChartResolution;
  };
  customDomainConnected: boolean;
  website: {
    totalViews: number;
    uniqueVisitors: number;
    viewsChange: number;
    uniqueVisitorsChange: number;
    viewsSeries: SeriesPoint[];
    topPages: Array<{
      pageId: string;
      pageSlug: string;
      page: string;
      views: number;
      change: number;
    }>;
    trafficSources: Array<{
      source: string;
      label: string;
      visitors: number;
      change: number;
    }>;
  };
  leads: {
    newCount: number;
    untreatedCount: number;
    change: number;
    series: SeriesPoint[];
    latest: Array<{
      id: string;
      name: string;
      source: string;
      status: string;
      owner: string;
      createdAt: string;
    }>;
  };
  appointments: {
    futureCount: number;
    nextAppointment: {
      id: string;
      title: string;
      clientName: string;
      date: string;
      time: string;
      status: string;
    } | null;
    change: number;
    series: SeriesPoint[];
    upcoming: Array<{
      id: string;
      title: string;
      clientName: string;
      date: string;
      time: string;
      status: string;
    }>;
  };
  collaborations: {
    totalInPeriod: number;
    newInPeriod: number;
    change: number;
    series: SeriesPoint[];
    overview: {
      activeCollaborations: number;
      incomingReferrals: number;
      outgoingReferrals: number;
      pendingRequests: number;
    };
  };
  performance: {
    metric: PerformanceMetric;
    current: SeriesPoint[];
    previous: SeriesPoint[];
  };
};

export type DashboardFilters = {
  preset: DatePreset;
  startDate: string;
  endDate: string;
  compareToPrevious: boolean;
  performanceMetric: PerformanceMetric;
  resolution: ChartResolution;
};
