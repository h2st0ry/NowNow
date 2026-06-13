import {useCallback, useEffect, useState} from 'react';

import {
  checkHealthKitAvailability,
  getHealthKitAuthorizationState,
  fetchHealthKitSnapshot,
  healthKitSupported,
  requestHealthKitAuthorization,
  type HealthAvailability,
  type HealthAuthorizationState,
  type HealthSnapshot,
} from '../../../services/healthKit';

type HealthStatus = 'idle' | 'checking' | 'ready' | 'unavailable' | 'error';

export function useHealthKit() {
  const [status, setStatus] = useState<HealthStatus>('idle');
  const [availability, setAvailability] = useState<HealthAvailability>({
    available: false,
    reason: null,
  });
  const [authorizationState, setAuthorizationState] =
    useState<HealthAuthorizationState>('notDetermined');
  const [snapshot, setSnapshot] = useState<HealthSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async () => {
    setStatus('checking');
    setError(null);

    try {
      const result = await checkHealthKitAvailability();
      setAvailability(result);
      setStatus(result.available ? 'ready' : 'unavailable');
      return result;
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'HealthKit 확인에 실패했습니다.';
      setError(message);
      setStatus('error');
      return {
        available: false,
        reason: message,
      };
    }
  }, []);

  const refresh = useCallback(async () => {
    setError(null);

    try {
      const result = await fetchHealthKitSnapshot();
      setSnapshot(result);
      setStatus('ready');
      return result;
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'HealthKit 데이터를 불러오지 못했습니다.';
      setError(message);
      setStatus('error');
      return null;
    }
  }, []);

  const authorize = useCallback(async () => {
    setError(null);

    try {
      const result = await requestHealthKitAuthorization();
      if (result.authorized) {
        setAuthorizationState('authorized');
        await refresh();
      }
      return result.authorized;
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'HealthKit 권한 요청에 실패했습니다.';
      setError(message);
      setStatus('error');
      return false;
    }
  }, [refresh]);

  useEffect(() => {
    if (healthKitSupported) {
      const load = async () => {
        const result = await checkAvailability();
        if (result.available) {
          const auth = await getHealthKitAuthorizationState();
          setAuthorizationState(auth.state);
        }
      };

      load();
    } else {
      setStatus('unavailable');
      setAuthorizationState('unavailable');
      setAvailability({
        available: false,
        reason: '이 기기 또는 빌드에서는 HealthKit을 사용할 수 없습니다.',
      });
    }
  }, [checkAvailability]);

  return {
    authorize,
    availability,
    error,
    authorizationState,
    refresh,
    snapshot,
    status,
    supported: healthKitSupported,
  };
}
