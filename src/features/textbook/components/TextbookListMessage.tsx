import type { ReactNode } from "react";

type TextbookListMessageProps = {
  title: string;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  role?: "status" | "alert";
};

/** 빈 목록 / 에러 등 목록 영역의 안내 메시지 */
export function TextbookListMessage({ title, description, action, role = "status" }: TextbookListMessageProps) {
  return (
    <div role={role} className="flex min-h-[320px] flex-col items-center justify-center rounded border border-dashed border-gray-200 px-5 py-16 text-center">
      <p className="text-base font-semibold text-gray-900">{title}</p>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex h-10 items-center rounded border border-primary px-5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
