export const TEXTBOOK_CATEGORIES = ["pass", "single"] as const;

export type TextbookCategory = (typeof TEXTBOOK_CATEGORIES)[number];

/** 화면에서 사용하는 교재 모델 (camelCase) */
export type Textbook = {
  id: number;
  title: string;
  category: TextbookCategory;
  /** 정가 */
  price: number;
  /** 판매가. 할인이 없으면 정가와 같다. */
  salePrice: number;
  thumbnailUrl: string | null;
};

/** Supabase textbooks 테이블 row (snake_case) */
export type TextbookRow = {
  id: number;
  title: string;
  category: string;
  price: number;
  sale_price: number;
  thumbnail_url: string | null;
};

export type TextbookCategoryFilter = TextbookCategory | "all";

export type TextbookListParams = {
  keyword: string;
  category: TextbookCategoryFilter;
  page: number;
  pageSize: number;
};

export type TextbookListResult = {
  items: Textbook[];
  totalCount: number;
};
