import type {
  ActivityPoint,
  BloodPressureInsight,
  HrvPoint,
  StressCause,
} from '../types';

export const vitalData = [
  { time: '00:00', heartRate: 64, bloodPressure: 112 },
  { time: '03:00', heartRate: 58, bloodPressure: 108 },
  { time: '06:00', heartRate: 62, bloodPressure: 110 },
  { time: '09:00', heartRate: 78, bloodPressure: 122 },
  { time: '12:00', heartRate: 82, bloodPressure: 126 },
  { time: '15:00', heartRate: 88, bloodPressure: 132 },
  { time: '18:00', heartRate: 74, bloodPressure: 120 },
  { time: '21:00', heartRate: 68, bloodPressure: 116 },
  { time: '23:00', heartRate: 61, bloodPressure: 110 },
];

export const todayHRVData: HrvPoint[] = [
  { time: '00:00', hrv: 65, stress: 45 },
  { time: '03:00', hrv: 75, stress: 35 },
  { time: '06:00', hrv: 70, stress: 40 },
  { time: '09:00', hrv: 55, stress: 65 },
  { time: '12:00', hrv: 50, stress: 70 },
  { time: '14:00', hrv: 45, stress: 85, note: '프로젝트 회의' },
  { time: '15:00', hrv: 48, stress: 82 },
  { time: '18:00', hrv: 60, stress: 55 },
  { time: '21:00', hrv: 70, stress: 40 },
  { time: '23:00', hrv: 75, stress: 35 },
];

export const activityData: ActivityPoint[] = [
  { time: '06:00', steps: 120 },
  { time: '09:00', steps: 450 },
  { time: '12:00', steps: 850 },
  { time: '14:00', steps: 1100 },
  { time: '15:00', steps: 1250 },
  { time: '18:00', steps: 1800 },
  { time: '21:00', steps: 2100 },
  { time: '23:00', steps: 2350 },
];

export const weeklyStressData: StressCause[] = [
  { cause: '오후 활동 후 상승', count: 4, percentage: 40 },
  { cause: '점심 이후 회복 지연', count: 3, percentage: 30 },
  { cause: '아침 안정 구간', count: 2, percentage: 20 },
  { cause: '저녁 정상화', count: 1, percentage: 10 },
];

export const monthlyStressData: StressCause[] = [
  { cause: '오후 활동 후 상승', count: 15, percentage: 45 },
  { cause: '점심 이후 회복 지연', count: 10, percentage: 30 },
  { cause: '아침 안정 구간', count: 5, percentage: 15 },
  { cause: '저녁 정상화', count: 2, percentage: 6 },
  { cause: '야간 저심박', count: 1, percentage: 4 },
];

export const bloodPressureInsightData: BloodPressureInsight[] = [
  {
    name: '아침 안정 구간',
    valueLabel: '108-112mmHg',
    percentage: 52,
    color: '#91B6A4',
  },
  {
    name: '오후 최고 구간',
    valueLabel: '126-132mmHg',
    percentage: 78,
    color: '#E8A5B8',
  },
  {
    name: '저녁 회복 구간',
    valueLabel: '116-120mmHg',
    percentage: 64,
    color: '#A7C7E7',
  },
];

export const causeColors = [
  '#E8A5B8',
  '#E9B872',
  '#C9DEBF',
  '#8BA6A9',
  '#B8A7D9',
];
