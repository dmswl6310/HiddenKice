"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { CloseIcon, SearchIcon } from "@/shared/components/icons";
import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import {
  TEXTBOOK_KEYWORD_MAX_LENGTH,
  TEXTBOOK_SEARCH_DEBOUNCE_MS,
} from "../model/constants";

type TextbookSearchInputProps = {
  /** URL 에 반영된 검색어 */
  keyword: string;
  onSearch: (keyword: string) => void;
};

export function TextbookSearchInput({ keyword, onSearch }: TextbookSearchInputProps) {
  const inputId = useId();
  const [value, setValue] = useState(keyword);
  const [syncedKeyword, setSyncedKeyword] = useState(keyword);
  const { debounced: debouncedSearch, cancel } = useDebouncedCallback(
    onSearch,
    TEXTBOOK_SEARCH_DEBOUNCE_MS,
  );

  // 뒤로가기 등으로 URL 검색어가 바뀌면 입력값도 맞춘다. (렌더 중 상태 보정 패턴)
  if (keyword !== syncedKeyword) {
    setSyncedKeyword(keyword);
    if (value.trim() !== keyword) setValue(keyword);
  }

  const submitNow = (next: string) => {
    cancel();
    onSearch(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter 는 조합 확정용이므로 무시한다.
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter") {
      event.preventDefault();
      submitNow(value);
    }
    if (event.key === "Escape" && value) {
      event.preventDefault();
      setValue("");
      submitNow("");
    }
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submitNow(value);
      }}
      className="group relative flex h-10 w-full items-center rounded border border-gray-300 bg-white transition-colors focus-within:border-primary sm:w-[250px]"
    >
      <label htmlFor={inputId} className="sr-only">
        교재 검색
      </label>
      <SearchIcon className="pointer-events-none ml-2 size-5 shrink-0 text-gray-500" />
      <input
        id={inputId}
        type="search"
        value={value}
        maxLength={TEXTBOOK_KEYWORD_MAX_LENGTH}
        placeholder="검색"
        autoComplete="off"
        enterKeyHint="search"
        onChange={(event) => {
          setValue(event.target.value);
          debouncedSearch(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        className="h-full min-w-0 flex-1 bg-transparent px-1.5 text-base text-gray-900 outline-none placeholder:text-gray-500"
      />
      {value && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => {
            setValue("");
            submitNow("");
          }}
          className="mr-2 inline-flex size-6 items-center justify-center rounded-full text-gray-700 hover:bg-gray-50"
        >
          <CloseIcon className="size-3.5" strokeWidth={2} />
        </button>
      )}
    </form>
  );
}
