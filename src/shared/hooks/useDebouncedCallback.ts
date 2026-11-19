"use client";

import { useCallback, useEffect, useRef } from "react";

/** 마지막 호출 후 delay 동안 추가 호출이 없을 때 실행한다. cancel/flush 를 함께 제공한다. */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  useEffect(() => cancel, [cancel]);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timerRef.current = window.setTimeout(() => {
        timerRef.current = undefined;
        callbackRef.current(...args);
      }, delay);
    },
    [cancel, delay],
  );

  return { debounced, cancel };
}
