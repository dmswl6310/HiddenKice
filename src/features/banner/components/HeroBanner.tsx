"use client";

import type { TransitionEvent } from "react";
import { heroSlides } from "../model/slides";
import type { BannerSlide } from "../model/types";
import { useCarousel } from "../hooks/useCarousel";
import { useSwipe } from "../hooks/useSwipe";
import { HeroSlide } from "./HeroSlide";

type HeroBannerProps = {
  slides?: BannerSlide[];
};

export function HeroBanner({ slides = heroSlides }: HeroBannerProps) {
  const carousel = useCarousel({ length: slides.length });
  const { index, position, loop, animate, transitionMs, move, settle, pause, resume } = carousel;
  const swipe = useSwipe({ onStart: settle, onEnd: move });

  if (slides.length === 0) return null;

  // 무한 루프용 트랙: [마지막 복제, ...슬라이드, 첫번째 복제]
  const track = loop ? [slides[slides.length - 1], ...slides, slides[0]] : slides;

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === "transform") settle();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="메인 배너"
      className="relative h-[360px] touch-pan-y select-none overflow-hidden bg-[linear-gradient(90deg,#0a0a0b_0%,#121214_45%,#1a191b_100%)] md:h-[490px]"
      {...(loop ? swipe.handlers : {})}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") move(1);
        if (event.key === "ArrowLeft") move(-1);
      }}
    >
      <div
        className="flex h-full will-change-transform"
        style={{
          transform: `translate3d(calc(${-position * 100}% + ${swipe.offset}px), 0, 0)`,
          transition:
            animate && !swipe.dragging
              ? `transform ${transitionMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
              : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {track.map((slide, trackIndex) => {
          const isClone = loop && (trackIndex === 0 || trackIndex === track.length - 1);
          const slideIndex = loop ? trackIndex - 1 : trackIndex;
          const active = !isClone && slideIndex === index;
          return (
            <div
              key={isClone ? `${slide.id}-clone-${trackIndex}` : slide.id}
              role={isClone ? undefined : "group"}
              aria-roledescription={isClone ? undefined : "slide"}
              aria-label={isClone ? undefined : `${slideIndex + 1} / ${slides.length}`}
              aria-hidden={!active}
              inert={!active}
              className="relative h-full w-full shrink-0 overflow-hidden"
            >
              <HeroSlide slide={slide} isFirst={!isClone && slideIndex === 0} />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[30px] mx-auto max-w-[1440px] px-5 md:px-10">
        <p
          aria-live="polite"
          className="ml-auto w-fit rounded-full bg-black/45 px-[13px] py-[6px] text-xs font-medium leading-none text-white"
        >
          <span className="sr-only">현재 슬라이드 </span>
          {index + 1}/{slides.length}
        </p>
      </div>
    </section>
  );
}
