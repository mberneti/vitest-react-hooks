import { renderHook } from '@testing-library/react-hooks';
import { useWindowScroll } from '.';
import { fireEvent, waitFor } from '@testing-library/react';

const MOCK_DELAY_TIME = 20;

describe('useWindowScroll', () => {
  it('onScroll function is being called on scroll', async () => {
    const mockFunction = jest.fn();

    renderHook(() => useWindowScroll({ onScroll: mockFunction }));

    fireEvent.scroll(window, { target: { scrollY: 300 } });

    expect(mockFunction).toBeCalled();
  });

  it('onScroll function is being called after delay', async () => {
    const mockFunction = jest.fn();

    renderHook(() => useWindowScroll({ onScroll: mockFunction, delay: MOCK_DELAY_TIME }));

    fireEvent.scroll(window, { target: { scrollY: 300 } });

    await waitFor(
      () => {
        expect(mockFunction).toBeCalled();
      },
      { timeout: MOCK_DELAY_TIME }
    );
  });

  it('hook gets called once per scroll', async () => {
    const mockFunction = jest.fn().mockImplementation((scrollNumber: number) => {
      return scrollNumber;
    });

    renderHook(() => useWindowScroll({ onScroll: mockFunction }));
    // initial scroll positioning
    fireEvent.scroll(window, { target: { scrollY: 10 } });

    // scroll to new position
    fireEvent.scroll(window, { target: { scrollY: 15 } });

    expect(mockFunction).toBeCalledTimes(1);
  });

  it('onScroll gets called with correct argument', async () => {
    jest.useFakeTimers();

    const lastScrollY = 10;
    const currentScrollY = 15;

    const mockFunction = jest.fn((value) => value);

    renderHook(() => useWindowScroll({ onScroll: mockFunction, delay: 1 }));

    // initial scroll positioning
    fireEvent.scroll(window, { target: { scrollY: lastScrollY } });

    jest.advanceTimersByTime(10);

    // // scroll to new position
    fireEvent.scroll(window, { target: { scrollY: currentScrollY } });

    const scrollChanges = currentScrollY - lastScrollY;

    expect(mockFunction).toBeCalledWith(scrollChanges);

    jest.useRealTimers();
  });

  it('hook gets called twice on scroll change', async () => {
    const mockFunction = jest.fn().mockImplementation((scrollNumber: number) => {
      return scrollNumber;
    });

    renderHook(() => useWindowScroll({ onScroll: mockFunction }));
    // initial scroll positioning
    fireEvent.scroll(window, { target: { scrollY: 2 } });

    mockFunction(window.scrollY);

    expect(mockFunction).toBeCalledTimes(2);
  });

  it('hook output should be undefined', () => {
    const mockFunction = jest.fn();

    const { result } = renderHook(() => useWindowScroll({ onScroll: mockFunction }));

    fireEvent.scroll(window, { target: { scrollY: 2 } });

    expect(result.current).toBe(undefined);
  });
});
