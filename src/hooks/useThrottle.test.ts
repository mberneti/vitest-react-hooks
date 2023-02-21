import { act, renderHook } from "@testing-library/react-hooks";
import { vi as jest } from "vitest";
import { sleep } from "../utils/test-utils";
import { useThrottleFn } from "./useThrottle";
import { useThrottleFnV2 } from "./useThrottleV2";

const getHookActionWith20Delay = () => {};

export const throttleShouldSeveralTimes = (
  useDebounceHook: Function,
  title: string
) => {
  describe(title, () => {
    it("should called several times", async () => {
      const callback = jest.fn((value) => void 1);

      const throttleDelay = 20;
      const shortStepDelay = 10;

      const {
        result: {
          current: [action],
        },
      } = renderHook(() => useDebounceHook(callback, throttleDelay));

      action(1); // ✅ at 0
      await sleep(1); // 1
      action(2); // 🛑 skipped by next action
      await sleep(10); // 11
      action(3); // ✅ at 20
      await sleep(10); // 21
      action(4); // 🛑 skipped by next action
      await sleep(5); // 26
      action(5); // 🛑 skipped by next action
      await sleep(5); // 31
      action(6); // 🛑 skipped by next action
      await sleep(5); // 36
      action(7); // at 40
      await sleep(6); // 40
      action(8); // ✅ at 60

      await sleep(120);

      console.log(callback.calls);

      expect(callback).toHaveBeenNthCalledWith(1, 1);
      expect(callback).toHaveBeenNthCalledWith(2, 3);
      expect(callback).toHaveBeenNthCalledWith(3, 7);
      expect(callback).toHaveBeenNthCalledWith(4, 8);
      expect(callback).toBeCalledTimes(4);
    });

    test("callback is being called once if action get called several times", () => {
      const callback = jest.fn();

      const { result } = renderHook(useDebounceFn, {
        initialProps: { callback, delay },
      });

      for (let i = 0; i < 5; i++) {
        act(result.current.action);
      }

      expect(callback).toBeCalledTimes(1);
    });
  });
};

// (0)               (20)                                 (40)         (60)
// A1 (1):A2 (11):A3 (20) (21):A4 (26):A5 (30):A6 (36):A7 (40) (41):A8 (60)
// ✅     🛑       \__✅       🛑      🛑      🛑       \__✅        \__✅

throttleShouldSeveralTimes(useThrottleFn, "useThrottleFn"); // [A1,A8]
throttleShouldSeveralTimes(useThrottleFnV2, "useThrottleFnV2"); // [A1,A3,A7,A8]
