"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/utils/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** 한 번에 보여줄 페이지 번호 개수 */
  windowSize?: number;
  disabled?: boolean;
  className?: string;
};

/** 현재 페이지가 가운데 오도록 페이지 번호 구간을 계산한다. */
export function getPageWindow(page: number, totalPages: number, windowSize: number): number[] {
  const size = Math.max(1, Math.min(windowSize, totalPages));
  const half = Math.floor(size / 2);
  const start = Math.min(Math.max(1, page - half), Math.max(1, totalPages - size + 1));
  return Array.from({ length: size }, (_, i) => start + i);
}

const buttonBase =
  "inline-flex size-10 items-center justify-center rounded border border-primary text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function Pagination({
  page,
  totalPages,
  onChange,
  windowSize = 5,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(1, page), totalPages);
  const pages = getPageWindow(current, totalPages, windowSize);
  const go = (target: number) => {
    if (disabled || target < 1 || target > totalPages || target === current) return;
    onChange(target);
  };

  return (
    <nav aria-label="페이지 이동" className={cn("flex justify-center", className)}>
      <ul className="flex items-center gap-2">
        <li>
          <button
            type="button"
            aria-label="이전 페이지"
            onClick={() => go(current - 1)}
            disabled={disabled || current === 1}
            className={cn(buttonBase, "text-primary hover:bg-primary/10 disabled:cursor-default disabled:hover:bg-transparent")}
          >
            <ChevronLeftIcon className="size-4" strokeWidth={2} />
          </button>
        </li>
        {pages.map((p) => {
          const active = p === current;
          return (
            <li key={p}>
              <button
                type="button"
                aria-label={`${p}페이지`}
                aria-current={active ? "page" : undefined}
                onClick={() => go(p)}
                disabled={disabled && !active}
                className={cn(
                  buttonBase,
                  active ? "bg-primary text-white" : "text-primary hover:bg-primary/10",
                )}
              >
                {p}
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            aria-label="다음 페이지"
            onClick={() => go(current + 1)}
            disabled={disabled || current === totalPages}
            className={cn(buttonBase, "text-primary hover:bg-primary/10 disabled:cursor-default disabled:hover:bg-transparent")}
          >
            <ChevronRightIcon className="size-4" strokeWidth={2} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
