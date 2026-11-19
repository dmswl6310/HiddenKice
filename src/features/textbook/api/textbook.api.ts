import { getSupabaseBrowserClient } from "@/shared/lib/supabase/client";
import { toTextbook } from "../model/mapper";
import type { Textbook, TextbookListParams, TextbookListResult, TextbookRow } from "../model/types";

const TEXTBOOK_TABLE = "textbooks";
const TEXTBOOK_COLUMNS = "id, title, category, price, sale_price, thumbnail_url";
/** PostgREST: 요청한 range 가 전체 개수를 넘었을 때의 에러 코드 */
const RANGE_NOT_SATISFIABLE = "PGRST103";

export class TextbookApiError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "TextbookApiError";
  }
}

/** ILIKE 패턴의 와일드카드 문자(%, _)와 escape 문자(\)를 일반 문자로 취급하도록 escape 한다. */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function buildListQuery(params: Pick<TextbookListParams, "keyword" | "category">, head = false) {
  let query = getSupabaseBrowserClient()
    .from(TEXTBOOK_TABLE)
    .select(head ? "id" : TEXTBOOK_COLUMNS, { count: "exact", head })
    .eq("is_published", true);

  if (params.category !== "all") query = query.eq("category", params.category);
  if (params.keyword) query = query.ilike("title", `%${escapeLikePattern(params.keyword)}%`);
  return query;
}

async function countTextbooks(
  params: Pick<TextbookListParams, "keyword" | "category">,
  signal?: AbortSignal,
): Promise<number> {
  let query = buildListQuery(params, true);
  if (signal) query = query.abortSignal(signal);
  const { count, error } = await query;
  if (error) throw new TextbookApiError("교재 개수를 불러오지 못했습니다.", { cause: error });
  return count ?? 0;
}

/** 교재 목록을 검색어/카테고리/페이지 조건으로 조회한다. (브라우저에서 호출 = CSR) */
export async function fetchTextbooks(
  params: TextbookListParams,
  signal?: AbortSignal,
): Promise<TextbookListResult> {
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = buildListQuery(params)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: false })
    .range(from, to);
  if (signal) query = query.abortSignal(signal);

  const { data, count, error } = await query;

  if (error) {
    // 존재하지 않는 페이지(?page=999)는 에러 대신 빈 목록 + 전체 개수로 응답해 화면에서 보정한다.
    if (error.code === RANGE_NOT_SATISFIABLE) {
      return { items: [], totalCount: await countTextbooks(params, signal) };
    }
    throw new TextbookApiError("교재 목록을 불러오지 못했습니다.", { cause: error });
  }

  const rows = (data ?? []) as unknown as TextbookRow[];
  const items = rows.map(toTextbook).filter((item): item is Textbook => item !== null);

  return { items, totalCount: count ?? items.length };
}
