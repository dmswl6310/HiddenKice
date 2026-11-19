"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildTextbookQueryString,
  normalizeKeyword,
  parseTextbookFilter,
  type TextbookFilterState,
} from "../model/search-params";
import type { TextbookCategoryFilter } from "../model/types";

type NavigateOptions = { history?: "push" | "replace" };

/** 교재 목록의 필터 상태를 URL query 와 동기화한다. */
export function useTextbookFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo(() => parseTextbookFilter(searchParams), [searchParams]);

  const navigate = useCallback(
    (next: TextbookFilterState, { history = "push" }: NavigateOptions = {}) => {
      const href = `${pathname}${buildTextbookQueryString(new URLSearchParams(searchParams), next)}`;
      if (history === "replace") router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setKeyword = useCallback(
    (keyword: string) => {
      const normalized = normalizeKeyword(keyword);
      if (normalized === filter.keyword) return;
      // 타이핑마다 히스토리가 쌓이지 않도록 replace 한다.
      navigate({ ...filter, keyword: normalized, page: 1 }, { history: "replace" });
    },
    [filter, navigate],
  );

  const setCategory = useCallback(
    (category: TextbookCategoryFilter) => {
      if (category === filter.category) return;
      navigate({ ...filter, category, page: 1 });
    },
    [filter, navigate],
  );

  const setPage = useCallback(
    (page: number, options?: NavigateOptions) => {
      if (page === filter.page || page < 1) return;
      navigate({ ...filter, page }, options);
    },
    [filter, navigate],
  );

  const reset = useCallback(() => {
    navigate({ keyword: "", category: "all", page: 1 });
  }, [navigate]);

  return { filter, setKeyword, setCategory, setPage, reset };
}
