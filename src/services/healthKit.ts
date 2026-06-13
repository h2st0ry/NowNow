import {Platform, TurboModuleRegistry} from 'react-native';

import {
  type HealthAvailability as HealthAvailabilityType,
  type HealthAuthorizationState as HealthAuthorizationStateType,
  type HealthSnapshot as HealthSnapshotType,
  type Spec as HealthKitNativeModule,
} from '../../specs/NativeHealthKitBridge';

export type HealthAvailability = HealthAvailabilityType;
export type HealthAuthorizationState = HealthAuthorizationStateType;
export type HealthSnapshot = HealthSnapshotType;

const nativeModule: HealthKitNativeModule | null =
  Platform.OS === 'ios'
    ? TurboModuleRegistry.get<HealthKitNativeModule>('NativeHealthKitBridge')
    : null;

export const healthKitSupported =
  Platform.OS === 'ios' && Boolean(nativeModule);

export async function checkHealthKitAvailability() {
  if (!healthKitSupported || !nativeModule) {
    return {
      available: false,
      reason: 'iOS HealthKit 브리지가 로드되지 않았습니다.',
    } satisfies HealthAvailability;
  }

  return nativeModule.checkAvailability();
}

export async function getHealthKitAuthorizationState() {
  if (!healthKitSupported || !nativeModule) {
    return {
      state: 'unavailable',
    } satisfies {state: HealthAuthorizationState};
  }

  return nativeModule.getAuthorizationState();
}

export async function requestHealthKitAuthorization() {
  if (!healthKitSupported || !nativeModule) {
    throw new Error('iOS HealthKit 브리지가 로드되지 않았습니다.');
  }

  return nativeModule.requestAuthorization();
}

export async function fetchHealthKitSnapshot() {
  if (!healthKitSupported || !nativeModule) {
    throw new Error('iOS HealthKit 브리지가 로드되지 않았습니다.');
  }

  return nativeModule.fetchLatestSnapshot();
}
