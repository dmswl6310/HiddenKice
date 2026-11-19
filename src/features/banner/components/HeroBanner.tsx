"use client";

import { cn } from "@/shared/lib/utils/cn";
import { heroSlides } from "../model/slides";
import type { BannerSlide } from "../model/types";
import { useAutoSlide } from "../hooks/useAutoSlide";
import { HeroSlide } from "./HeroSlide";

type HeroBannerProps = {
  slides?: BannerSlide[];
};

export function HeroBanner({ slides = heroSlides }: HeroBannerProps) {
  const { index, pause, resume, next, prev } = useAutoSlide({ length: slides.length });

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="메인 배너"
      className="relative h-[360px] overflow-hidden bg-[linear-gradient(90deg,#0a0a0b_0%,#121214_45%,#1a191b_100%)] md:h-[490px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
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
            <HeroSlide slide={slide} isFirst={slideIndex === 0} />
          </div>
        );
      })}

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
