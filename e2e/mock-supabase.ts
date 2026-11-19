import { readFileSync } from "node:fs";
import path from "node:path";
import type { Page, Route } from "@playwright/test";

type Row = {
  id: number;
  title: string;
  category: "pass" | "single";
  price: number;
  sale_price: number;
  thumbnail_url: string | null;
  is_published: boolean;
  sort_order: number;
};

/** supabase/seed.sql 의 더미 데이터를 그대로 읽어, E2E 가 실제와 같은 데이터로 동작하게 한다. */
function loadSeedRows(): Row[] {
  const sql = readFileSync(path.join(__dirname, "../supabase/seed.sql"), "utf8");
  const tuple = /\('((?:[^']|'')*)', '(pass|single)', (\d+), (\d+), '([^']*)', (true|false), (\d+)\)/g;
  return [...sql.matchAll(tuple)].map((m, index) => ({
    id: index + 1,
    title: m[1].replace(/''/g, "'"),
    category: m[2] as Row["category"],
    price: Number(m[3]),
    sale_price: Number(m[4]),
    thumbnail_url: m[5],
    is_published: m[6] === "true",
    sort_order: Number(m[7]),
  }));
}

const SEED_ROWS = loadSeedRows();

/** PostgREST ilike 패턴(%, _, \ escape)을 정규식으로 변환한다. */
function ilikeToRegExp(pattern: string) {
  let source = "";
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === "\\" && i + 1 < pattern.length) source += pattern[++i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    else if (char === "%" || char === "*") source += ".*";
    else if (char === "_") source += ".";
    else source += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${source}$`, "i");
}

function handleTextbooks(route: Route) {
  const request = route.request();
  const url = new URL(request.url());
  let rows = SEED_ROWS.slice();

  for (const [key, value] of url.searchParams) {
    if (["select", "order", "offset", "limit"].includes(key)) continue;
    const [op, ...rest] = value.split(".");
    const operand = rest.join(".");
    if (op === "eq") rows = rows.filter((row) => String(row[key as keyof Row]) === operand);
    if (op === "ilike") {
      const regExp = ilikeToRegExp(operand);
      rows = rows.filter((row) => regExp.test(String(row[key as keyof Row])));
    }
  }
  rows.sort((a, b) => a.sort_order - b.sort_order || b.id - a.id);

  const total = rows.length;
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 1000);
  const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Expose-Headers": "Content-Range" };

  if (offset > 0 && offset >= total) {
    return route.fulfill({
      status: 416,
      headers: { ...headers, "Content-Range": `*/${total}` },
      json: { code: "PGRST103", message: "Requested range not satisfiable" },
    });
  }

  const page = rows.slice(offset, offset + limit);
  return route.fulfill({
    status: 200,
    headers: { ...headers, "Content-Range": `${offset}-${offset + page.length - 1}/${total}` },
    json: request.method() === "HEAD" ? undefined : page,
  });
}

/** 브라우저의 Supabase(PostgREST) 요청을 가로채 시드 데이터로 응답한다. */
export async function mockSupabase(page: Page, { fail = false } = {}) {
  await page.route("**/rest/v1/textbooks**", (route) => {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({
        status: 204,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" },
      });
    }
    if (fail) {
      return route.fulfill({
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        json: { code: "XX000", message: "internal error" },
      });
    }
    return handleTextbooks(route);
  });
}

export const SEED_PUBLISHED_COUNT = SEED_ROWS.filter((row) => row.is_published).length;
