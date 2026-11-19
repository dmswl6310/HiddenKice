import { TEXTBOOK_PAGE_SIZE } from "../model/constants";
import { TextbookGrid } from "./TextbookGrid";

export function TextbookGridSkeleton({ count = TEXTBOOK_PAGE_SIZE }: { count?: number }) {
  return (
    <div role="status" aria-label="교재 목록을 불러오는 중">
      <TextbookGrid>
        {Array.from({ length: count }, (_, index) => (
          <li key={index} aria-hidden="true" className="animate-pulse">
            <div className="aspect-[250/318] rounded border border-gray-200 bg-gray-50" />
            <div className="mt-3 h-4 w-10 rounded bg-gray-200" />
            <div className="mt-2 h-5 w-3/4 rounded bg-gray-200" />
            <div className="mt-3 h-5 w-1/3 rounded bg-gray-200" />
          </li>
        ))}
      </TextbookGrid>
    </div>
  );
}
