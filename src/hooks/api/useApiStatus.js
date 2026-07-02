import { useSyncExternalStore } from 'react';
import { fetchApiStatus } from '../../services/api';
import { formatErrorMessage } from '../../utils/errors';

let storeState = {
  data: null,
  error: null,
  loading: false,
  refreshing: false,
};

let listeners = new Set();
let inflight = null;

function getStoreSnapshot() {
  return storeState;
}

function setStoreState(patch) {
  storeState = { ...storeState, ...patch };
  listeners.forEach((listener) => listener());
}

async function load({ isRefresh = false } = {}) {
  if (isRefresh && storeState.data) {
    setStoreState({ refreshing: true });
  } else {
    setStoreState({ loading: true, error: null, refreshing: false });
  }

  try {
    if (!inflight) {
      inflight = fetchApiStatus();
    }
    const data = await inflight;
    setStoreState({ data, error: null, loading: false, refreshing: false });
  } catch (err) {
    if (!storeState.data) {
      setStoreState({
        error: formatErrorMessage(err, '無法載入 API 狀態'),
        loading: false,
        refreshing: false,
      });
    } else {
      setStoreState({ refreshing: false });
    }
  } finally {
    inflight = null;
  }
}

function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1 && !storeState.data && !inflight && !storeState.loading) {
    load();
  }
  return () => {
    listeners.delete(listener);
  };
}

export function refreshApiStatus() {
  if (inflight) return inflight;
  return load({ isRefresh: Boolean(storeState.data) });
}

export function useApiStatusStore() {
  return useSyncExternalStore(subscribe, getStoreSnapshot, getStoreSnapshot);
}

export function useApiStatus() {
  const { data } = useApiStatusStore();
  const statusByApi = {};
  for (const api of data?.apis ?? []) {
    statusByApi[api.id] = api.overall;
  }
  return statusByApi;
}
