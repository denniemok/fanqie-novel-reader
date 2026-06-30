import { useSyncExternalStore } from 'react';
import { fetchAnnouncements } from '../services/api';
import { formatErrorMessage } from '../utils/errors';

let storeState = {
  announcements: null,
  error: null,
  loading: false,
  refreshing: false,
};

const listeners = new Set();
let inflight = null;

function getSnapshot() {
  return storeState;
}

function setStoreState(patch) {
  storeState = { ...storeState, ...patch };
  listeners.forEach((listener) => listener());
}

function hasAnnouncements() {
  return storeState.announcements !== null;
}

async function load({ isRefresh = false } = {}) {
  if (isRefresh && hasAnnouncements()) {
    setStoreState({ refreshing: true });
  } else {
    setStoreState({ loading: true, error: null, refreshing: false });
  }

  try {
    if (!inflight) {
      inflight = fetchAnnouncements();
    }
    const items = await inflight;
    setStoreState({
      announcements: Array.isArray(items) ? items : [],
      error: null,
      loading: false,
      refreshing: false,
    });
  } catch (err) {
    if (!hasAnnouncements()) {
      setStoreState({
        error: formatErrorMessage(err, '無法載入公告'),
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
  if (listeners.size === 1 && !hasAnnouncements() && !inflight && !storeState.loading) {
    load();
  }
  return () => listeners.delete(listener);
}

export function refreshAnnouncements() {
  if (inflight) return inflight;
  return load({ isRefresh: hasAnnouncements() });
}

export function useAnnouncements() {
  const { announcements, loading, error } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
  const pinnedNotices = announcements?.filter((item) => item.pin) ?? [];
  return { announcements, pinnedNotices, loading, error };
}
