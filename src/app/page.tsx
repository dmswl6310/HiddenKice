import { Suspense } from "react";
import { HeroBanner } from "@/features/banner";
import { TextbookSection, TextbookSectionFallback } from "@/features/textbook";

export default function StorePage() {
  return (
    <>
      <HeroBanner />
      {/* 목록은 URL query(검색/필터/페이지)를 읽는 클라이언트 영역이므로 Suspense 로 감싼다. */}
      <Suspense fallback={<TextbookSectionFallback />}>
        <TextbookSection />
      </Suspense>
    </>
  );
}
