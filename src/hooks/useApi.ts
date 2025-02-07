import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<void>;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T | null; error: any }>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: apiError } = await apiFunction(...args);

      if (apiError) {
        throw new Error(apiError.message);
      }

      setData(data);
      options.onSuccess?.(data as T);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, options]);

  return { data, error, isLoading, execute };
}

// Common API functions
export const api = {
  events: {
    list: () => supabase.from('events').select('*').eq('status', 'published'),
    get: (id: string) => supabase.from('events').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('events').insert(data),
    update: (id: string, data: any) => supabase.from('events').update(data).eq('id', id),
    delete: (id: string) => supabase.from('events').delete().eq('id', id)
  },
  tickets: {
    list: () => supabase.from('tickets').select('*'),
    purchase: (data: any) => supabase.from('purchases').insert(data),
    transfer: (data: any) => supabase.from('ticket_transfers').insert(data)
  },
  profiles: {
    get: (id: string) => supabase.from('profiles').select('*').eq('id', id).single(),
    update: (id: string, data: any) => supabase.from('profiles').update(data).eq('id', id)
  }
}; 