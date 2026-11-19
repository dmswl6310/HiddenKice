import { TEXTBOOK_CATEGORIES, type Textbook, type TextbookCategory, type TextbookRow } from "./types";

function isTextbookCategory(value: unknown): value is TextbookCategory {
  return typeof value === "string" && (TEXTBOOK_CATEGORIES as readonly string[]).includes(value);
}

function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/**
 * DB row 를 화면 모델로 변환한다.
 * 필수 값이 잘못된 row 는 화면을 깨뜨리지 않도록 null 을 반환해 목록에서 제외한다.
 */
export function toTextbook(row: TextbookRow): Textbook | null {
  if (!row || typeof row.id !== "number") return null;
  if (!isTextbookCategory(row.category)) return null;
  if (!isValidPrice(row.price)) return null;

  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (!title) return null;

  // 판매가가 비정상이면 정가로 판매하는 것으로 간주한다.
  const salePrice =
    isValidPrice(row.sale_price) && row.sale_price <= row.price ? row.sale_price : row.price;

  const thumbnailUrl =
    typeof row.thumbnail_url === "string" && row.thumbnail_url.trim() ? row.thumbnail_url.trim() : null;

  return { id: row.id, title, category: row.category, price: row.price, salePrice, thumbnailUrl };
}
