import { useState, useCallback } from 'react';
import { getApiService, setApiService } from '../../services/api';

export function useApiBase() {
  const [apiBase, setApiBaseState] = useState(getApiService);

  const handleApiChange = useCallback((apiId) => {
    setApiService(apiId);
    setApiBaseState(apiId);
  }, []);

  return [apiBase, handleApiChange];
}
