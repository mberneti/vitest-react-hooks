import { useDebounceFn } from 'ahooks';

export function useDebounceFnV2(callback: (data?: any) => void, delay = 200) {
  const { run, cancel } = useDebounceFn(callback, {
    wait: delay,
  });

  return [run, cancel];
}
