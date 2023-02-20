import { useThrottleFn } from 'ahooks';

export function useThrottleFnV2(callback: (data?: any) => void, delay = 200) {
  const { run, cancel } = useThrottleFn(callback, {
    wait: delay,
  });
  return [run, cancel];
}
