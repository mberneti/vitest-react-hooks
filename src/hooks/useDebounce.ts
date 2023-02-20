import { useState, useEffect, useRef } from 'react';
// This hook allows you to debounce any fast changing value
export function useDebounce<T>(value: T, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface UseDebounceFn {
  callback: (data: any) => void;
  delay?: number;
}

export function useDebounceFn({ callback, delay = 200 }: UseDebounceFn) {
  const timeOutRef = useRef<string | number | NodeJS.Timer>();
  const pendingRef = useRef(false);

  const reset = () => {
    pendingRef.current = false;
    clearTimeout(timeOutRef.current);
  };

  const action = (data: any) => {
    if (pendingRef.current) return;
    timeOutRef.current = setTimeout(() => {
      pendingRef.current = false;
    }, delay);
    pendingRef.current = true;
    callback(data);
  };

  return {
    action,
    reset,
  };
}
