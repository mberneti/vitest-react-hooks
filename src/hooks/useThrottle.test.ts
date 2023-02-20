import { act, renderHook } from '@testing-library/react-hooks';
import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
