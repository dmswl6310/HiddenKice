"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

type UseCarouselOptions = {
  length: number;
  intervalMs?: number;
  transitionMs?: number;
};

type TrackState = {
  /** 트랙 위치. 무한 루프를 위해 앞뒤에 복제 슬라이드를 둔다: [마지막 복제, 1..n, 첫번째 복제] */
  position: number;
  animate: boolean;
};

/**
 * 무한 루프 슬라이드 트랙의 위치와 자동 재생을 관리한다.
 * - 마지막 → 첫 슬라이드로 넘어갈 때 복제 슬라이드까지 애니메이션한 뒤, 애니메이션 없이 실제 위치로 순간 이동한다.
 * - hover / focus 중, 탭이 백그라운드일 때, 동작 줄이기 설정 시 자동 재생을 멈춘다.
 */
export function useCarousel({ length, intervalMs = 5000, transitionMs = 600 }: UseCarouselOptions) {
  const loop = length > 1;
  const reducedMotion = usePrefersReducedMotion();
  const [{ position, animate }, setTrack] = useState<TrackState>({
    position: loop ? 1 : 0,
    animate: false,
  });
  const [paused, setPaused] = useState(false);

  const isClone = loop && (position === 0 || position === length + 1);
  const index = loop ? (((position - 1) % length) + length) % length : 0;

  /** 복제 슬라이드에 도달했으면 같은 모습의 실제 슬라이드 위치로 순간 이동한다. */
  const settle = useCallback(() => {
    setTrack((track) => {
      if (!loop) return track;
      if (track.position === 0) return { position: length, animate: false };
      if (track.position === length + 1) return { position: 1, animate: false };
      return track;
    });
  }, [loop, length]);

  /** delta만큼 이동한다. 0이면 현재 위치로 되돌아가는 애니메이션(드래그 취소)만 한다. */
  const move = useCallback(
    (delta: -1 | 0 | 1) => {
      if (!loop) return;
      setTrack((track) => {
        // 복제 슬라이드로 이동 중일 때는 정리될 때까지 추가 이동을 받지 않는다.
        if (track.position === 0 || track.position === length + 1) return track;
        const target = track.position + delta;
        // 동작 줄이기 설정이면 애니메이션 없이 바로 실제 위치로 이동한다.
        if (reducedMotion) {
          return { position: ((((target - 1) % length) + length) % length) + 1, animate: false };
        }
        return { position: target, animate: true };
      });
    },
    [loop, length, reducedMotion],
  );

  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);

  // 복제 슬라이드 정리는 transitionend에서 하지만, 이벤트를 놓쳐도 정리되도록 타이머로 한 번 더 보장한다.
  useEffect(() => {
    if (!isClone) return;
    const timer = window.setTimeout(settle, transitionMs + 50);
    return () => window.clearTimeout(timer);
  }, [isClone, settle, transitionMs]);

  // index가 바뀌면(드래그 등 수동 전환 포함) 자동 재생 타이머를 처음부터 다시 시작한다.
  useEffect(() => {
    if (!loop || paused || reducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") next();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [loop, paused, reducedMotion, intervalMs, next, index]);

  return {
    index,
    position,
    loop,
    animate: animate && !reducedMotion,
    transitionMs,
    next,
    prev,
    move,
    settle,
    pause: useCallback(() => setPaused(true), []),
    resume: useCallback(() => setPaused(false), []),
  };
}
