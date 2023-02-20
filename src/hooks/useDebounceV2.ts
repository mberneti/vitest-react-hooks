import { useDebounceFn } from 'ahooks';

interface UseDebounceFn {
  callback: (data?: any) => void;
  delay?: number;
}

export function useDebounceFn({ callback, delay = 200 }: UseDebounceFn) {
  const { run, cancel } = useDebounceFn(callback, {
    wait: delay,
  });

  return {
    action: run,
    reset: cancel,
  };
}
