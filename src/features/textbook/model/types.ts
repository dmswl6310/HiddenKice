import { Constants, type Tables } from "@/shared/lib/supabase/database.types";

/** DB enum(textbook_category)에서 가져와, 스키마가 바뀌면 타입 검사에서 바로 드러나게 한다. */
export const TEXTBOOK_CATEGORIES = Constants.public.Enums.textbook_category;

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

/** 목록 조회에서 가져오는 textbooks 컬럼 (Supabase 생성 타입 기반, snake_case) */
export type TextbookRow = Pick<
  Tables<"textbooks">,
  "id" | "title" | "category" | "price" | "sale_price" | "thumbnail_url"
>;

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
