import { useDebounceFn } from './useDebounce';
import { act, renderHook } from '@testing-library/react-hooks';
import { vi as jest } from 'vitest';

const reRun = async (callback: Function, count = 1, delay = 20) => {
  callback();
  if (count === 1) {
    return;
  }
  setTimeout(() => reRun(callback, ++count, delay), delay);
};

describe('useDebounceFn', () => {
  const delay = 20;

  test('test output interface', () => {
    const { result } = renderHook(() => useDebounceFn(() => void 1));

    expect(typeof result.current[0]).toBe('function');
    expect(typeof result.current[1]).toBe('function');
  });

  test('callback is being called with proper data', () => {
    const PROPS = { test: 'value' };

    const callback = jest.fn((props) => {
      expect(props).toBe(PROPS);
    });
    const { result } = renderHook(() => useDebounceFn(callback, delay));

    act(() => result.current[0](PROPS));

    expect(callback).toBeCalledTimes(1);
  });

  test('callback is being called once if action get called several times', async () => {
    const callback = jest.fn();

    const {
      result: {
        current: [action],
      },
    } = renderHook(() => useDebounceFn(callback, delay));

    await reRun(action, 5, 19);

    expect(callback).toBeCalledTimes(1);
  });

  test('reset is working', async () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounceFn(callback, delay));

    act(result.current[0]);
    act(result.current[1]);
    act(result.current[0]);

    expect(callback).toBeCalledTimes(2);
  });
});
