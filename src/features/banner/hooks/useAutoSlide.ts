"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

type UseAutoSlideOptions = {
  length: number;
  intervalMs?: number;
};

/**
 * 슬라이더 인덱스와 자동 재생을 관리한다.
 * - 마우스 hover / 키보드 focus 중, 탭이 백그라운드일 때, 동작 줄이기 설정 시 자동 재생을 멈춘다.
 */
export function useAutoSlide({ length, intervalMs = 5000 }: UseAutoSlideOptions) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const canSlide = length > 1;

  const goTo = useCallback(
    (next: number) => {
      if (length <= 0) return;
      setIndex(((next % length) + length) % length);
    },
    [length],
  );
  const next = useCallback(() => setIndex((i) => (length > 0 ? (i + 1) % length : 0)), [length]);
  const prev = useCallback(
    () => setIndex((i) => (length > 0 ? (i - 1 + length) % length : 0)),
    [length],
  );

  // index가 바뀌면(스와이프 등 수동 전환 포함) 타이머를 처음부터 다시 시작한다.
  useEffect(() => {
    if (!canSlide || paused || reducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") next();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [canSlide, paused, reducedMotion, intervalMs, next, index]);

  return {
    index: length > 0 ? Math.min(index, length - 1) : 0,
    goTo,
    next,
    prev,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
}
