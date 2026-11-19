"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@/shared/components/icons";
import { useSwipe } from "@/shared/hooks/useSwipe";
import { cn } from "@/shared/lib/utils/cn";
import { useAutoSlide } from "../hooks/useAutoSlide";
import { heroSlides } from "../model/slides";
import type { BannerSlide } from "../model/types";
import { HeroSlide } from "./HeroSlide";

const controlButtonClass =
  "inline-flex size-[26px] items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white";

type HeroBannerProps = {
  slides?: BannerSlide[];
};

export function HeroBanner({ slides = heroSlides }: HeroBannerProps) {
  const { index, pause, resume, next, prev, playing, togglePlaying } =
    useAutoSlide({
      length: slides.length,
    });
  const swipeHandlers = useSwipe({ onSwipeLeft: next, onSwipeRight: prev });

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="메인 배너"
      className="relative h-[360px] touch-pan-y select-none overflow-hidden bg-[linear-gradient(90deg,#0a0a0b_0%,#121214_45%,#1a191b_100%)] md:h-[490px]"
      {...(slides.length > 1 ? swipeHandlers : {})}
      onMouseEnter={pause}
      onMouseLeave={resume}
      // 키보드로 들어왔을 때만 멈춘다. 마우스로 버튼을 누른 뒤 포커스가 남아도 자동 재생은 계속된다.
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) pause();
      }}
      onBlur={resume}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") prev();
      }}
    >
      {slides.map((slide, slideIndex) => {
        const active = slideIndex === index;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} / ${slides.length}`}
            aria-hidden={!active}
            inert={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <HeroSlide
              slide={slide}
              isFirst={slideIndex === 0}
              active={active}
            />
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-[30px] mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="pointer-events-auto ml-auto flex w-fit items-center rounded-full bg-black/45 text-xs font-medium leading-none text-white">
          {slides.length > 1 && (
            <button
              type="button"
              aria-label="이전 슬라이드"
              onClick={prev}
              className={controlButtonClass}
            >
              <ChevronLeftIcon className="size-3.5" strokeWidth={2} />
            </button>
          )}
          <p
            aria-live="polite"
            className={cn(
              "tabular-nums",
              slides.length > 1 ? "px-0.5" : "px-[13px] py-[6px]",
            )}
          >
            <span className="sr-only">현재 슬라이드 </span>
            {index + 1}/{slides.length}
          </p>
          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="다음 슬라이드"
                onClick={next}
                className={controlButtonClass}
              >
                <ChevronRightIcon className="size-3.5" strokeWidth={2} />
              </button>
              <span
                aria-hidden="true"
                className="mx-0.5 h-3 w-px bg-white/25"
              />
              <button
                type="button"
                aria-label={playing ? "자동 넘김 정지" : "자동 넘김 재생"}
                onClick={togglePlaying}
                className={cn(controlButtonClass, "mr-1")}
              >
                {playing ? (
                  <PauseIcon className="size-3" strokeWidth={2.4} />
                ) : (
                  <PlayIcon className="size-3" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
