import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/services/request';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction();

      if (response.code === 200) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        onSuccess?.(response.data);
      } else {
        const errorMsg = response.message || 'API request failed';
        setState({
          data: null,
          loading: false,
          error: errorMsg,
        });
        onError?.(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Network error';
      setState({
        data: null,
        loading: false,
        error: errorMsg,
      });
      onError?.(errorMsg);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

export function useMutation<T, P = any>(
  apiFunction: (params: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(params);

      if (response.code === 200) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMsg = response.message || 'API request failed';
        setState({
          data: null,
          loading: false,
          error: errorMsg,
        });
        onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Network error';
      setState({
        data: null,
        loading: false,
        error: errorMsg,
      });
      onError?.(errorMsg);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}