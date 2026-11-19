"use client";

import { cn } from "@/shared/lib/utils/cn";
import { TEXTBOOK_CATEGORY_FILTERS } from "../model/constants";
import type { TextbookCategoryFilter as CategoryFilterValue } from "../model/types";

type TextbookCategoryFilterProps = {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

export function TextbookCategoryFilter({ value, onChange }: TextbookCategoryFilterProps) {
  return (
    <ul aria-label="교재 구분" className="flex shrink-0 items-center text-base">
      {TEXTBOOK_CATEGORY_FILTERS.map((option, index) => {
        const active = option.value === value;
        return (
          <li key={option.value} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="mx-3 text-sm text-gray-500">
                |
              </span>
            )}
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active ? "font-semibold text-gray-900" : "text-gray-500 hover:text-gray-700",
              )}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
