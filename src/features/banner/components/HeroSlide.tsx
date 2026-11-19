import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/utils/cn";
import type { BannerSlide } from "../model/types";
import { BannerFeatureIcon } from "./BannerFeatureIcon";

type HeroSlideProps = {
  slide: BannerSlide;
  isFirst: boolean;
  /** 현재 보이는 슬라이드인지. 전환될 때 문구/이미지 등장 효과에 사용한다. */
  active: boolean;
};

export function HeroSlide({ slide, isFirst, active }: HeroSlideProps) {
  return (
    <div
      className="relative mx-auto h-full max-w-[1440px]"
      style={{ "--slide-accent": slide.accent } as CSSProperties}
    >
      <Image
        src={slide.image.src}
        alt={slide.image.alt}
        width={slide.image.width}
        height={slide.image.height}
        preload={isFirst}
        sizes="(min-width: 768px) 800px, 100vw"
        className={cn(
          "pointer-events-none absolute right-0 top-0 h-full w-auto max-w-none origin-right select-none object-cover opacity-40 [mask-image:linear-gradient(to_right,transparent,black_18%)] xl:opacity-100",
          "transition-transform duration-[1600ms] ease-out motion-reduce:transform-none motion-reduce:transition-none",
          active ? "scale-100" : "scale-105",
        )}
      />

      <div
        className={cn(
          "relative flex h-full flex-col justify-center px-5 md:block md:px-10 md:pt-[78px] xl:pl-[90px]",
          "transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none",
          active ? "translate-y-0 opacity-100 delay-200" : "translate-y-5 opacity-0",
        )}
      >
        <p className="flex items-center gap-2 text-sm font-medium tracking-[0.25em] text-(--slide-accent) md:text-lg">
          {slide.eyebrow}
          <span aria-hidden="true" className="inline-block h-px w-3.5 bg-(--slide-accent)" />
        </p>
        <h2 className="mt-3 text-[34px] font-bold leading-[1.2] tracking-[-0.03em] text-white md:mt-[14px] md:text-[60px]">
          {slide.title}
        </h2>
        <p className="mt-1 text-2xl font-light leading-[1.3] tracking-[-0.02em] text-white md:mt-0 md:text-[43px] md:leading-[1.2]">
          {slide.subtitle}
        </p>
        <p className="mt-3 text-sm text-[#c8c9cc] md:mt-[6px] md:text-lg">{slide.description}</p>

        <ul className="mt-6 hidden items-center sm:flex md:mt-[32px]">
          {slide.features.map((feature, index) => (
            <li key={feature.title} className="flex items-center">
              {index > 0 && <span aria-hidden="true" className="mx-5 h-[30px] w-px bg-white/25" />}
              <BannerFeatureIcon name={feature.icon} className="size-8 shrink-0 text-(--slide-accent)" />
              <div className="ml-3">
                <p className="text-sm font-bold leading-[1.3] text-(--slide-accent)">{feature.title}</p>
                <p className="mt-0.5 text-xs leading-[1.3] text-white/85">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          draggable={false}
          href={slide.cta.href}
          className="mt-8 inline-flex h-[42px] w-full max-w-[216px] items-center justify-between rounded border border-(--slide-accent) px-[26px] text-[13px] font-semibold text-(--slide-accent) transition-colors hover:bg-(--slide-accent) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--slide-accent) md:mt-[30px]"
        >
          {slide.cta.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}
