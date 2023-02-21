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

export function useDebounceFn(callback: (data?: any) => void, delay = 200) {
  const timeOutRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingRef = useRef(false);
  const reset = () => {
    pendingRef.current = false;
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
  };

  const action = (data?: unknown) => {
    if (pendingRef.current) return;
    timeOutRef.current = setTimeout(() => {
      pendingRef.current = false;
    }, delay);

    pendingRef.current = true;
    callback(data);
  };

  return [action, reset];
}
