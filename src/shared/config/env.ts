/**
 * 클라이언트 번들에 노출되는 공개 환경 변수.
 * NEXT_PUBLIC_* 값은 빌드 시점에 인라인되므로 반드시 정적인 형태(process.env.NEXT_PUBLIC_X)로 접근해야 한다.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  // 신규 Supabase 프로젝트의 publishable key 와 기존 anon key 를 모두 지원한다.
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "",
} as const;
