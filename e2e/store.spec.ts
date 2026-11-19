import { expect, test } from "@playwright/test";
import { mockSupabase, SEED_PUBLISHED_COUNT } from "./mock-supabase";

const PAGE_SIZE = 12;

test.beforeEach(async ({ page }) => {
  await mockSupabase(page);
});

const cards = (page: import("@playwright/test").Page) => page.locator("#textbooks article");

test.describe("교재 목록", () => {
  test("첫 페이지에 교재 12개를 보여준다", async ({ page }) => {
    await page.goto("/");
    await expect(cards(page)).toHaveCount(PAGE_SIZE);
    await expect(page.getByText(`교재 ${SEED_PUBLISHED_COUNT}개`)).toBeAttached();
  });

  test("검색어가 URL 에 남고 결과만 보여준다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox", { name: "교재 검색" }).fill("미적분");
    await expect(page).toHaveURL(/q=%EB%AF%B8%EC%A0%81%EB%B6%84/);
    await expect(cards(page).first()).toBeVisible();
    for (const title of await cards(page).locator("h3").allInnerTexts()) {
      expect(title).toContain("미적분");
    }
  });

  test("결과가 없으면 안내와 전체 보기 버튼을 보여준다", async ({ page }) => {
    await page.goto("/?q=없는교재");
    await expect(page.getByText("'없는교재'에 대한 검색 결과가 없습니다.")).toBeVisible();
    await page.getByRole("button", { name: "전체 교재 보기" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(cards(page)).toHaveCount(PAGE_SIZE);
  });

  test("% 는 와일드카드가 아닌 일반 문자로 검색한다", async ({ page }) => {
    await page.goto("/?q=%25");
    await expect(page.getByText("검색 결과가 없습니다", { exact: false })).toBeVisible();
  });

  test("구분 필터를 적용한다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "패스", exact: true }).click();
    await expect(page).toHaveURL(/category=pass/);
    await expect(cards(page).first()).toBeVisible();
    for (const label of await cards(page).locator("p").first().allInnerTexts()) {
      expect(label).toBe("패스");
    }
    await expect(cards(page).getByText("단품", { exact: true })).toHaveCount(0);
  });

  test("페이지를 이동하고, 없는 페이지는 마지막 페이지로 보정한다", async ({ page }) => {
    await page.goto("/");
    const firstTitle = await cards(page).locator("h3").first().innerText();
    await page.getByRole("button", { name: "2페이지" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(cards(page).locator("h3").first()).not.toHaveText(firstTitle);

    await page.goto("/?page=99");
    const lastPage = Math.ceil(SEED_PUBLISHED_COUNT / PAGE_SIZE);
    await expect(page).toHaveURL(new RegExp(`page=${lastPage}`));
    await expect(cards(page)).toHaveCount(SEED_PUBLISHED_COUNT - PAGE_SIZE * (lastPage - 1));
  });

  test("카드를 누르면 교재 상세(준비 중)로 이동한다", async ({ page }) => {
    await page.goto("/");
    await cards(page).first().getByRole("link").click();
    await expect(page).toHaveURL(/\/textbooks\/\d+$/);
    await expect(page.getByRole("heading", { name: "교재 상세 페이지는 준비 중입니다." })).toBeVisible();
  });
});

test("조회 실패 시 에러 안내와 다시 시도 버튼을 보여준다", async ({ page }) => {
  await page.unrouteAll();
  await mockSupabase(page, { fail: true });
  await page.goto("/");
  await expect(page.getByText("교재 목록을 불러오지 못했습니다.")).toBeVisible();
  await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
});

test.describe("메인 배너", () => {
  const counter = (page: import("@playwright/test").Page) =>
    page.locator("section[aria-roledescription=carousel] [aria-live=polite]");

  test("이전/다음 버튼으로 슬라이드를 넘긴다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "자동 넘김 정지" }).click();
    await page.getByRole("button", { name: "다음 슬라이드" }).click();
    await expect(counter(page)).toContainText("2/5");
    await page.getByRole("button", { name: "이전 슬라이드" }).click();
    await page.getByRole("button", { name: "이전 슬라이드" }).click();
    await expect(counter(page)).toContainText("5/5");
  });

  test("정지하면 자동으로 넘어가지 않는다", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.getByRole("button", { name: "자동 넘김 정지" }).click();
    await page.mouse.move(0, 0);
    await page.clock.fastForward(12_000);
    await expect(counter(page)).toContainText("1/5");
  });
});
