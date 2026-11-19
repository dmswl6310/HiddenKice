import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils/cn";

/** 디자인 기준 1280px 에서 250px 카드 4열 */
export function TextbookGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-[clamp(32px,7.3%,93px)] lg:gap-y-10",
        className,
      )}
    >
      {children}
    </ul>
  );
}
