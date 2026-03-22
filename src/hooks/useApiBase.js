import { useState, useCallback } from 'react';
import { getApiBase, setApiBase } from '../services/api';

export function useApiBase() {
  const [apiBase, setApiBaseState] = useState(getApiBase);

  const handleApiChange = useCallback((apiId) => {
    setApiBase(apiId);
    setApiBaseState(apiId);
  }, []);

  return [apiBase, handleApiChange];
}
