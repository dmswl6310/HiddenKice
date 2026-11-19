import { describe, expect, it, vi } from "vitest";

vi.mock("@/shared/lib/supabase/client", () => ({ getSupabaseBrowserClient: vi.fn() }));

const { escapeLikePattern } = await import("./textbook.api");

describe("escapeLikePattern", () => {
  it("ILIKE 와일드카드(%, _)와 escape 문자(\\)를 일반 문자로 바꾼다", () => {
    expect(escapeLikePattern("100%")).toBe("100\\%");
    expect(escapeLikePattern("a_b")).toBe("a\\_b");
    expect(escapeLikePattern("a\\b")).toBe("a\\\\b");
  });

  it("일반 검색어는 그대로 둔다", () => {
    expect(escapeLikePattern("수학 올인원")).toBe("수학 올인원");
  });
});
