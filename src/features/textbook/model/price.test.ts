import { describe, expect, it } from "vitest";
import { getDiscountRate } from "./price";

describe("getDiscountRate", () => {
  it("정가와 판매가로 할인율을 반올림해 계산한다", () => {
    expect(getDiscountRate(68000, 64800)).toBe(5);
    expect(getDiscountRate(10000, 6650)).toBe(34);
  });

  it("할인이 없거나 판매가가 정가 이상이면 0을 반환한다", () => {
    expect(getDiscountRate(40000, 40000)).toBe(0);
    expect(getDiscountRate(40000, 50000)).toBe(0);
  });

  it("비정상 값이면 0을 반환한다", () => {
    expect(getDiscountRate(0, 0)).toBe(0);
    expect(getDiscountRate(-1000, 500)).toBe(0);
    expect(getDiscountRate(Number.NaN, 100)).toBe(0);
    expect(getDiscountRate(Number.POSITIVE_INFINITY, 100)).toBe(0);
  });

  it("무료(판매가 0)는 100%로 계산한다", () => {
    expect(getDiscountRate(40000, 0)).toBe(100);
  });
});
