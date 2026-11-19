"use client";

import { useRef, useState, type MouseEvent, type PointerEvent } from "react";

type UseSwipeOptions = {
  /** 드래그를 시작할 때 호출된다. */
  onStart?: () => void;
  /** 손을 뗐을 때 이동 방향을 알려준다. -1: 이전, 1: 다음, 0: 제자리 */
  onEnd: (direction: -1 | 0 | 1) => void;
  /** 슬라이드 전환으로 인정할 최소 가로 이동 거리(px) */
  threshold?: number;
};

/**
 * 마우스 드래그와 터치 스와이프를 하나의 Pointer Events 흐름으로 처리한다.
 * - 드래그 중에는 offset(px)을 돌려줘 트랙이 손가락을 따라 움직이게 한다.
 * - 세로 스크롤 의도로 보이면 드래그로 취급하지 않는다(touch-action: pan-y와 함께 사용).
 * - 드래그로 끝난 경우 뒤따르는 click을 막아 CTA 링크가 의도치 않게 열리지 않게 한다.
 */
export function useSwipe({ onStart, onEnd, threshold = 50 }: UseSwipeOptions) {
  const start = useRef<{ x: number; y: number; id: number; horizontal: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const finish = (dx: number) => {
    start.current = null;
    setDragging(false);
    setOffset(0);
    if (Math.abs(dx) >= threshold) onEnd(dx < 0 ? 1 : -1);
    else onEnd(0);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY, id: event.pointerId, horizontal: false };
    suppressClick.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const origin = start.current;
    if (!origin || origin.id !== event.pointerId) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;

    if (!origin.horizontal) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        start.current = null; // 세로 스크롤로 판단
        return;
      }
      origin.horizontal = true;
      // 이동이 시작된 뒤에 캡처해야 단순 클릭의 대상이 링크로 유지된다.
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      onStart?.();
    }
    setOffset(dx);
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const origin = start.current;
    if (!origin || origin.id !== event.pointerId) return;
    if (!origin.horizontal) {
      start.current = null;
      return;
    }
    const dx = event.clientX - origin.x;
    suppressClick.current = Math.abs(dx) > 8;
    finish(dx);
  };

  const onPointerCancel = () => {
    if (start.current?.horizontal) finish(0);
    start.current = null;
  };

  const onClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    offset,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
      // 링크/이미지의 브라우저 기본 드래그(고스트 이미지)를 막는다.
      onDragStart: (event: { preventDefault: () => void }) => event.preventDefault(),
    },
  };
}
