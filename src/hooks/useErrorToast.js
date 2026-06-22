import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

/** Shows a toast whenever `error` becomes truthy. */
export function useErrorToast(error) {
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);
}
