import type { LandingPageContent } from "./landingData";

export interface DashboardStatsData {
  totalConsultations: number;
  pendingRequests: number;
  activeCases: number;
  availableLawyers: number;
  latestConsultations: any[];
}

interface ClientCache {
  settings: LandingPageContent | null;
  stats: DashboardStatsData | null;
}

export const clientCache: ClientCache = {
  settings: null,
  stats: null,
};
