import Link from "next/link";
import type { ReactNode } from "react";

type IconBadgeButtonProps = {
  href: string;
  label: string;
  icon: ReactNode;
  count?: number;
};

const MAX_BADGE_COUNT = 99;

export function IconBadgeButton({ href, label, icon, count = 0 }: IconBadgeButtonProps) {
  const hasBadge = count > 0;
  const badgeText = count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);

  return (
    <Link
      href={href}
      aria-label={hasBadge ? `${label} ${count}개` : label}
      className="relative inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-50 hover:text-primary"
    >
      {icon}
      {hasBadge && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 right-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-[3px] text-[9px] font-semibold leading-none text-white"
        >
          {badgeText}
        </span>
      )}
    </Link>
  );
}
