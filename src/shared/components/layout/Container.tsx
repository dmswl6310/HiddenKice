import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils/cn";

/** 디자인 기준 콘텐츠 폭 1280px (1440px 화면에서 좌우 80px 여백) */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5", className)}>{children}</div>;
}
