export type MetricType = 'heartRate' | 'bloodPressure';
export type ReportPeriod = 'day' | 'week' | 'month';

export interface HrvPoint {
  time: string;
  hrv: number;
  stress: number;
  note?: string;
}

export interface ActivityPoint {
  time: string;
  steps: number;
}

export interface StressCause {
  cause: string;
  count: number;
  percentage: number;
}

export interface BloodPressureInsight {
  name: string;
  valueLabel: string;
  percentage: number;
  color: string;
}
