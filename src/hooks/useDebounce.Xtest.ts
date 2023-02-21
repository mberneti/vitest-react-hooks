import {
  act,
  renderHook,
  RenderHookResult,
} from '@testing-library/react-hooks';
import { DependencyList } from 'react';
import { useDebounceFn as useDebounce } from './useDebounce';
// import useDebounce from './useDebounceV2';
import { vi as jest } from 'vitest';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(useDebounce).toBeDefined();
  });

  it('should return two functions', () => {
    const hook = renderHook(() => useDebounce(() => {}, 5));

    expect(hook.result.current.length).toBe(2);
    expect(typeof hook.result.current[0]).toBe('function');
    expect(typeof hook.result.current[1]).toBe('function');
  });

  function getHook(
    ms: number = 5
  ): [
    jest.SpyInstance,
    RenderHookResult<
      { delay: number; deps: DependencyList },
      ReturnType<typeof useDebounce>
    >
  ] {
    const spy = jest.fn();
    return [
      spy,
      renderHook(({ delay = 5 }) => useDebounce(spy, delay), {
        initialProps: {
          delay: ms,
        },
      }),
    ];
  }

  it('should call passed function after given amount of time', () => {
    const [spy] = getHook();

    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // it('should cancel function call on unmount', () => {
  //   const [spy, hook] = getHook();

  //   expect(spy).not.toHaveBeenCalled();
  //   hook.unmount();
  //   jest.advanceTimersByTime(5);
  //   expect(spy).not.toHaveBeenCalled();
  // });

  it('first function should return actual state of debounce', () => {
    let [, hook] = getHook();
    let [isReady] = hook.result.current;

    expect(isReady()).toBe(false);
    hook.unmount();
    expect(isReady()).toBe(null);

    [, hook] = getHook();
    [isReady] = hook.result.current;
    jest.advanceTimersByTime(5);
    expect(isReady()).toBe(true);
  });

  // it('second function should cancel debounce', () => {
  //   const [spy, hook] = getHook();
  //   const [isReady, cancel] = hook.result.current;

  //   expect(spy).not.toHaveBeenCalled();
  //   expect(isReady()).toBe(false);

  //   act(() => {
  //     cancel();
  //   });
  //   jest.advanceTimersByTime(5);

  //   expect(spy).not.toHaveBeenCalled();
  //   expect(isReady()).toBe(null);
  // });

  // it('should reset timeout on delay change', () => {
  //   const [spy, hook] = getHook(50);

  //   expect(spy).not.toHaveBeenCalled();
  //   hook.rerender({ delay: 5, deps: [] });

  //   jest.advanceTimersByTime(5);
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });
});
