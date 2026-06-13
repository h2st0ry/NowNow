import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface HealthAvailability {
  available: boolean;
  reason: string | null;
}

export type HealthAuthorizationState =
  | 'unavailable'
  | 'notDetermined'
  | 'authorized'
  | 'denied';

export interface HealthNumericSample {
  value: number | null;
  recordedAt: string | null;
}

export interface HealthSleepSnapshot {
  sleepMinutes: number;
  inBedMinutes: number;
  sampleCount: number;
  recordedAt: string | null;
}

export interface HealthSnapshot {
  fetchedAt: string;
  heartRate: HealthNumericSample;
  restingHeartRate: HealthNumericSample;
  oxygenSaturation: HealthNumericSample;
  sleep: HealthSleepSnapshot;
}

export interface Spec extends TurboModule {
  checkAvailability(): Promise<HealthAvailability>;
  getAuthorizationState(): Promise<{state: HealthAuthorizationState}>;
  requestAuthorization(): Promise<{authorized: boolean}>;
  fetchLatestSnapshot(): Promise<HealthSnapshot>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeHealthKitBridge');
