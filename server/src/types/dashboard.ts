export interface DashboardData {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  metrics: Metric[];
}

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
}