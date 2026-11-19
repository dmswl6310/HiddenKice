import { TEXTBOOK_KEYWORD_MAX_LENGTH } from "./constants";
import { TEXTBOOK_CATEGORIES, type TextbookCategoryFilter } from "./types";

/** URL query 키. 목록 상태(검색어/카테고리/페이지)를 URL 에 보관해 새로고침·공유·뒤로가기를 지원한다. */
export const TEXTBOOK_QUERY_KEYS = {
  keyword: "q",
  category: "category",
  page: "page",
} as const;

export type TextbookFilterState = {
  keyword: string;
  category: TextbookCategoryFilter;
  page: number;
};

type ReadableParams = { get(name: string): string | null };

export function normalizeKeyword(value: string | null | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ").slice(0, TEXTBOOK_KEYWORD_MAX_LENGTH);
}

export function parseCategory(value: string | null): TextbookCategoryFilter {
  return value && (TEXTBOOK_CATEGORIES as readonly string[]).includes(value)
    ? (value as TextbookCategoryFilter)
    : "all";
}

export function parsePage(value: string | null): number {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

export function parseTextbookFilter(params: ReadableParams): TextbookFilterState {
  return {
    keyword: normalizeKeyword(params.get(TEXTBOOK_QUERY_KEYS.keyword)),
    category: parseCategory(params.get(TEXTBOOK_QUERY_KEYS.category)),
    page: parsePage(params.get(TEXTBOOK_QUERY_KEYS.page)),
  };
}

/** 기본값(전체, 1페이지, 빈 검색어)은 URL 에서 생략한다. */
export function buildTextbookQueryString(
  current: URLSearchParams,
  state: TextbookFilterState,
): string {
  const params = new URLSearchParams(current);
  const set = (key: string, value: string | null) =>
    value ? params.set(key, value) : params.delete(key);

  set(TEXTBOOK_QUERY_KEYS.keyword, state.keyword || null);
  set(TEXTBOOK_QUERY_KEYS.category, state.category === "all" ? null : state.category);
  set(TEXTBOOK_QUERY_KEYS.page, state.page > 1 ? String(state.page) : null);

  const query = params.toString();
  return query ? `?${query}` : "";
}
