"use client";

import { useEffect } from "react";
import { Container } from "@/shared/components/layout/Container";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // 운영에서는 Sentry 같은 에러 수집 도구로 보내는 지점
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900">일시적인 오류가 발생했습니다.</h1>
      <p className="mt-2 text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 inline-flex h-11 items-center rounded bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-strong"
      >
        다시 시도
      </button>
    </Container>
  );
}
