import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("천 단위 구분 기호와 '원'을 붙인다", () => {
    expect(formatPrice(64800)).toBe("64,800원");
    expect(formatPrice(0)).toBe("0원");
  });
});
