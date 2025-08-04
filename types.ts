
export interface PeriodProgress {
    current: number;
    target: number;
    unit: string;
}

export interface DailyTarget {
    target: number;
    unit: string;
}

export interface SalesMetric {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export interface SalesRep {
  rank: number;
  name: string;
  points: number;
  awardCount?: number;
}

export interface DashboardData {
    periodProgress: PeriodProgress;
    dailyTarget: DailyTarget;
    individualMetrics: SalesMetric[];
    monthlySalesRanking: SalesRep[];
    dailySalesRanking: SalesRep[];
}
