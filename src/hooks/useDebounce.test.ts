import { act, renderHook } from "@testing-library/react-hooks";
import { vi as jest } from "vitest";
import { sleep } from "../utils/test-utils";
import { useDebounceFn } from "./useDebounce";
import { useDebounceFnV2 } from "./useDebounceV2";

const getHookActionWith20Delay = () => {};

export const debounceShouldCalledOnce = (
  useDebounceHook: Function,
  title: string
) => {
  describe(title, () => {
    it("should called once", async () => {
      const callback = jest.fn((value) => void 1);

      const debounceDelay = 10;
      const shortStepDelay = 5;

      const {
        result: {
          current: [action],
        },
      } = renderHook(() => useDebounceHook(callback, debounceDelay));

      action(1);
      await sleep(shortStepDelay);
      action(2);
      await sleep(shortStepDelay);
      action(3);
      await sleep(shortStepDelay);
      action(4);
      await sleep(shortStepDelay);
      action(5);
      await sleep(shortStepDelay);
      action(6);
      await sleep(shortStepDelay);
      action(7);
      // wait to reach the debounce delay
      await sleep(21);
      console.log(callback.calls);
      expect(callback).toBeCalledTimes(1);
      expect(callback).toHaveBeenNthCalledWith(1, 7);
    });
  });
};

// (0):A1 (5):A2 (10):A3 (15):A4 (20):A5 (25):A6 (30):A7 (40)
//     🛑     🛑      🛑      🛑      🛑      🛑       \__✅

debounceShouldCalledOnce(useDebounceFn, "useDebounceFn"); // [A1, A3, A5, A7];
debounceShouldCalledOnce(useDebounceFnV2, "useDebounceFnV2"); // [A7];
