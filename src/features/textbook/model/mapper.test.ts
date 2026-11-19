import { describe, expect, it } from "vitest";
import { toTextbook } from "./mapper";
import type { TextbookRow } from "./types";

const row = (overrides: Partial<TextbookRow> = {}): TextbookRow =>
  ({
    id: 1,
    title: "2026 Hidden Kice 시즌7 수학 I",
    category: "single",
    price: 40000,
    sale_price: 40000,
    thumbnail_url: "/images/textbooks/hidden-kice-s7-single.png",
    ...overrides,
  }) as TextbookRow;

describe("toTextbook", () => {
  it("DB row를 화면 모델로 변환한다", () => {
    expect(toTextbook(row())).toEqual({
      id: 1,
      title: "2026 Hidden Kice 시즌7 수학 I",
      category: "single",
      price: 40000,
      salePrice: 40000,
      thumbnailUrl: "/images/textbooks/hidden-kice-s7-single.png",
    });
  });

  it("필수 값이 잘못된 row는 null을 반환해 목록에서 제외한다", () => {
    expect(toTextbook(row({ title: "   " }))).toBeNull();
    expect(toTextbook(row({ category: "unknown" as never }))).toBeNull();
    expect(toTextbook(row({ price: -1 }))).toBeNull();
  });

  it("판매가가 비정상이면 정가로 판매하는 것으로 간주한다", () => {
    expect(toTextbook(row({ sale_price: 50000 }))?.salePrice).toBe(40000);
    expect(toTextbook(row({ sale_price: null as never }))?.salePrice).toBe(40000);
  });

  it("썸네일이 비어 있으면 null로 둔다(대체 UI 표시)", () => {
    expect(toTextbook(row({ thumbnail_url: "  " }))?.thumbnailUrl).toBeNull();
  });
});
