import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/shared/config/env";
import type { Database } from "./database.types";

export class SupabaseConfigError extends Error {
  constructor() {
    super(
      "Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 를 확인해 주세요.",
    );
    this.name = "SupabaseConfigError";
  }
}

let browserClient: SupabaseClient<Database> | undefined;

/**
 * 브라우저용 Supabase 클라이언트 싱글턴.
 * 환경 변수가 없을 때 import 시점이 아니라 호출 시점에 에러를 던져서,
 * 화면 전체가 깨지지 않고 데이터 영역에서만 에러 UI 를 보여줄 수 있게 한다.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  const { supabaseUrl, supabaseKey } = publicEnv;
  if (!supabaseUrl || !supabaseKey) throw new SupabaseConfigError();

  browserClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return browserClient;
}
