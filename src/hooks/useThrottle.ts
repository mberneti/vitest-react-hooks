import { useRef } from 'react';

export function useThrottleFn<T>(callback: (data?: T) => void, delay: number) {
  const timeOutRef = useRef<NodeJS.Timer>();
  const pendingRef = useRef(false);
  const hasEndRef = useRef(false);

  const reset = () => {
    pendingRef.current = false;
    hasEndRef.current = false;
    clearTimeout(timeOutRef.current);
  };

  const action = (data: T) => {
    clearTimeout(timeOutRef.current);
    timeOutRef.current = setTimeout(() => {
      if (hasEndRef.current) callback(data);
      pendingRef.current = false;
      hasEndRef.current = false;
    }, delay);

    if (pendingRef.current) {
      hasEndRef.current = true;
      return;
    }

    pendingRef.current = true;
    callback(data);
  };

  return [action, reset];
}
