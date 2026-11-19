import type { TextbookCategory, TextbookCategoryFilter } from "./types";

export const TEXTBOOK_PAGE_SIZE = 12;
export const TEXTBOOK_KEYWORD_MAX_LENGTH = 50;
export const TEXTBOOK_SEARCH_DEBOUNCE_MS = 300;

export const TEXTBOOK_CATEGORY_LABEL: Record<TextbookCategory, string> = {
  pass: "패스",
  single: "단품",
};

export const TEXTBOOK_CATEGORY_FILTERS: ReadonlyArray<{
  value: TextbookCategoryFilter;
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "pass", label: TEXTBOOK_CATEGORY_LABEL.pass },
  { value: "single", label: TEXTBOOK_CATEGORY_LABEL.single },
];
