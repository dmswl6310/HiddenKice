"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTextbooks } from "../api/textbook.api";
import { textbookKeys } from "../api/textbook.keys";
import { TEXTBOOK_PAGE_SIZE } from "../model/constants";
import type { TextbookFilterState } from "../model/search-params";
import type { TextbookListParams } from "../model/types";

export function useTextbooks(filter: TextbookFilterState) {
  const params: TextbookListParams = { ...filter, pageSize: TEXTBOOK_PAGE_SIZE };

  const query = useQuery({
    queryKey: textbookKeys.list(params),
    queryFn: ({ signal }) => fetchTextbooks(params, signal),
    // 페이지/필터 전환 시 이전 목록을 유지해 화면이 깜빡이지 않게 한다.
    placeholderData: keepPreviousData,
  });

  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / TEXTBOOK_PAGE_SIZE));

  return { ...query, totalCount, totalPages };
}
