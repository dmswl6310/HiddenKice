import { describe, expect, it } from "vitest";
import { getPageWindow } from "./Pagination";

describe("getPageWindow", () => {
  it("현재 페이지가 가운데 오도록 구간을 만든다", () => {
    expect(getPageWindow(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
  });

  it("앞/뒤 끝에서는 구간이 범위를 벗어나지 않는다", () => {
    expect(getPageWindow(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageWindow(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
  });

  it("전체 페이지가 구간보다 적으면 전체를 보여준다", () => {
    expect(getPageWindow(2, 3, 5)).toEqual([1, 2, 3]);
  });
});
