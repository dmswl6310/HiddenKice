import { describe, expect, it } from "vitest";
import { TEXTBOOK_KEYWORD_MAX_LENGTH } from "./constants";
import {
  buildTextbookQueryString,
  normalizeKeyword,
  parseCategory,
  parsePage,
  parseTextbookFilter,
} from "./search-params";

describe("normalizeKeyword", () => {
  it("앞뒤 공백을 제거하고 연속 공백을 하나로 합친다", () => {
    expect(normalizeKeyword("  수학   올인원 ")).toBe("수학 올인원");
  });

  it("null/undefined는 빈 문자열이 된다", () => {
    expect(normalizeKeyword(null)).toBe("");
    expect(normalizeKeyword(undefined)).toBe("");
  });

  it("최대 길이를 넘으면 자른다", () => {
    expect(normalizeKeyword("가".repeat(100))).toHaveLength(TEXTBOOK_KEYWORD_MAX_LENGTH);
  });
});

describe("parseCategory", () => {
  it("허용된 값만 통과시키고 나머지는 all로 보정한다", () => {
    expect(parseCategory("pass")).toBe("pass");
    expect(parseCategory("single")).toBe("single");
    expect(parseCategory("bogus")).toBe("all");
    expect(parseCategory(null)).toBe("all");
  });
});

describe("parsePage", () => {
  it("양의 정수만 허용하고 나머지는 1로 보정한다", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("1.5")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("99999999999999999999")).toBe(1);
    expect(parsePage(null)).toBe(1);
  });
});

describe("parseTextbookFilter", () => {
  it("URL 값을 목록 상태로 변환한다", () => {
    const params = new URLSearchParams("q=%20국어%20&category=pass&page=2");
    expect(parseTextbookFilter(params)).toEqual({ keyword: "국어", category: "pass", page: 2 });
  });
});

describe("buildTextbookQueryString", () => {
  it("기본값은 URL에서 생략한다", () => {
    expect(
      buildTextbookQueryString(new URLSearchParams(), { keyword: "", category: "all", page: 1 }),
    ).toBe("");
  });

  it("검색어/구분/페이지를 쿼리스트링으로 만든다", () => {
    const query = buildTextbookQueryString(new URLSearchParams(), {
      keyword: "수학",
      category: "single",
      page: 2,
    });
    expect(new URLSearchParams(query)).toEqual(
      new URLSearchParams({ q: "수학", category: "single", page: "2" }),
    );
  });

  it("목록과 관계없는 기존 파라미터는 유지한다", () => {
    const query = buildTextbookQueryString(new URLSearchParams("utm_source=mail&page=3"), {
      keyword: "",
      category: "all",
      page: 1,
    });
    expect(query).toBe("?utm_source=mail");
  });
});
