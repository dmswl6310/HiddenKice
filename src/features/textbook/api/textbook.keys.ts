import type { TextbookListParams } from "../model/types";

/** TanStack Query key factory. 무효화(invalidate) 범위를 계층적으로 관리한다. */
export const textbookKeys = {
  all: ["textbooks"] as const,
  lists: () => [...textbookKeys.all, "list"] as const,
  list: (params: TextbookListParams) => [...textbookKeys.lists(), params] as const,
};
