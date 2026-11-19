"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";

type UseSwipeOptions = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  /** 슬라이드 전환으로 인정할 최소 가로 이동 거리(px) */
  threshold?: number;
};

/**
 * 마우스 드래그와 터치 스와이프를 하나의 Pointer Events 흐름으로 처리한다.
 * - 가로 이동이 세로 이동보다 크고 threshold를 넘을 때만 전환한다.
 * - 드래그로 끝난 경우 뒤따르는 click을 막아 CTA 링크가 의도치 않게 열리지 않게 한다.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    dragged.current = false;
  };

  // 일정 거리 이상 움직이면 포인터를 캡처해, 배너 밖에서 손을 떼도 pointerup을 받는다.
  // (누르자마자 캡처하면 단순 클릭의 대상이 링크가 아니게 되므로 이동 후에 캡처한다.)
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const origin = start.current;
    if (!origin || origin.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (Math.abs(event.clientX - origin.x) > 10) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const origin = start.current;
    start.current = null;
    if (!origin || origin.id !== event.pointerId) return;

    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

    dragged.current = true;
    if (dx < 0) onSwipeLeft();
    else onSwipeRight();
  };

  const onPointerCancel = () => {
    start.current = null;
  };

  const onClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (!dragged.current) return;
    dragged.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
    // 링크/이미지의 브라우저 기본 드래그(고스트 이미지)를 막는다.
    onDragStart: (event: { preventDefault: () => void }) => event.preventDefault(),
  };
}
