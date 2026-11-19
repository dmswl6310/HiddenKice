import { QueryClient } from "@tanstack/react-query";
import { SupabaseConfigError } from "@/shared/lib/supabase/client";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        // 네트워크 오류 등 일시적 실패만 1회 재시도하고, 설정 오류는 재시도해도 같으므로 바로 실패시킨다.
        retry: (failureCount, error) => !(error instanceof SupabaseConfigError) && failureCount < 1,
      },
    },
  });
}
