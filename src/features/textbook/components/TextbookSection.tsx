"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/shared/components/layout/Container";
import { Pagination } from "@/shared/components/ui/Pagination";
import { SupabaseConfigError } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils/cn";
import { useTextbookFilter } from "../hooks/useTextbookFilter";
import { useTextbooks } from "../hooks/useTextbooks";
import { TEXTBOOK_CATEGORY_LABEL } from "../model/constants";
import type { TextbookFilterState } from "../model/search-params";
import { TextbookCard } from "./TextbookCard";
import { TextbookCategoryFilter } from "./TextbookCategoryFilter";
import { TextbookGrid } from "./TextbookGrid";
import { TextbookGridSkeleton } from "./TextbookGridSkeleton";
import { TextbookListMessage } from "./TextbookListMessage";
import { TextbookSearchInput } from "./TextbookSearchInput";

const SECTION_ID = "textbooks";
/** 첫 줄(4개) 이미지는 LCP 후보이므로 미리 로드한다. */
const PRELOAD_IMAGE_COUNT = 4;

function getEmptyMessage(filter: TextbookFilterState) {
  if (filter.keyword) return `'${filter.keyword}'에 대한 검색 결과가 없습니다.`;
  if (filter.category !== "all") return `${TEXTBOOK_CATEGORY_LABEL[filter.category]} 교재가 아직 없습니다.`;
  return "등록된 교재가 없습니다.";
}

function scrollToSection(element: HTMLElement | null) {
  if (!element) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // 목록 상단이 화면 밖에 있을 때만 이동한다.
  if (element.getBoundingClientRect().top < 0) {
    element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
}

export function TextbookSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { filter, setKeyword, setCategory, setPage, reset } = useTextbookFilter();
  const { data, error, isPending, isError, isPlaceholderData, refetch, totalCount, totalPages } =
    useTextbooks(filter);

  const hasActiveFilter = Boolean(filter.keyword) || filter.category !== "all";
  const isSettled = Boolean(data) && !isPlaceholderData;

  // URL 의 page 가 실제 페이지 수를 넘으면 마지막 페이지로 보정한다. (?page=999 등)
  useEffect(() => {
    if (!isSettled) return;
    if (totalCount === 0 && filter.page > 1) setPage(1, { history: "replace" });
    else if (totalCount > 0 && filter.page > totalPages) setPage(totalPages, { history: "replace" });
  }, [isSettled, totalCount, totalPages, filter.page, setPage]);

  const handlePageChange = (page: number) => {
    setPage(page);
    scrollToSection(sectionRef.current);
  };

  const renderContent = () => {
    if (isError && !data) {
      const isConfigError = error instanceof SupabaseConfigError;
      return (
        <TextbookListMessage
          role="alert"
          title="교재 목록을 불러오지 못했습니다."
          description={
            isConfigError
              ? "서비스 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요."
              : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
          }
          action={isConfigError ? undefined : { label: "다시 시도", onClick: () => void refetch() }}
        />
      );
    }

    if (isPending || !data) return <TextbookGridSkeleton />;

    if (data.items.length === 0) {
      // 범위를 벗어난 페이지는 위 effect 가 보정하는 동안 스켈레톤을 유지한다.
      if (totalCount > 0) return <TextbookGridSkeleton />;
      return (
        <TextbookListMessage
          title={getEmptyMessage(filter)}
          description={hasActiveFilter ? "다른 검색어나 구분으로 다시 찾아보세요." : undefined}
          action={hasActiveFilter ? { label: "전체 교재 보기", onClick: reset } : undefined}
        />
      );
    }

    return (
      <>
        <div
          aria-busy={isPlaceholderData}
          className={cn("transition-opacity", isPlaceholderData && "pointer-events-none opacity-60")}
        >
          <TextbookGrid>
            {data.items.map((textbook, index) => (
              <li key={textbook.id}>
                <TextbookCard textbook={textbook} preloadImage={index < PRELOAD_IMAGE_COUNT} />
              </li>
            ))}
          </TextbookGrid>
        </div>
        <Pagination
          className="mt-[60px]"
          page={filter.page}
          totalPages={totalPages}
          onChange={handlePageChange}
          disabled={isPlaceholderData}
        />
      </>
    );
  };

  return (
    <section
      id={SECTION_ID}
      ref={sectionRef}
      aria-labelledby={`${SECTION_ID}-title`}
      className="scroll-mt-[110px] pt-10 md:scroll-mt-[100px] md:pt-[52px]"
    >
      <Container>
        <h2 id={`${SECTION_ID}-title`} className="sr-only">
          교재 목록
        </h2>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-5">
          <TextbookSearchInput keyword={filter.keyword} onSearch={setKeyword} />
          <TextbookCategoryFilter value={filter.category} onChange={setCategory} />
        </div>

        <p aria-live="polite" className="sr-only">
          {isSettled ? `교재 ${totalCount}개` : ""}
        </p>

        <div className="mt-[37px]">{renderContent()}</div>
      </Container>
    </section>
  );
}
