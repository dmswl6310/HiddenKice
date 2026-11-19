"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils/cn";

/** 스토어("/")는 교재 상세(/textbooks) 같은 하위 화면에서도 선택 상태로 표시한다. */
function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  if (href === "/")
    return pathname === "/" || pathname.startsWith("/textbooks");
  return pathname.startsWith(href);
}

type MainNavProps = {
  items: readonly NavItem[];
  /** desktop: 헤더 가운데 / mobile: 헤더 아래 가로 스크롤 */
  variant?: "desktop" | "mobile";
};

/** 현재 경로를 읽어 선택된 메뉴를 표시한다. */
export function MainNav(props: MainNavProps) {
  return <MainNavView {...props} pathname={usePathname()} />;
}

/**
 * 경로를 모를 때(동적 라우트를 미리 렌더링하는 동안 등) 쓰는 대체 메뉴.
 * Suspense fallback 으로 사용해 헤더가 비지 않게 한다.
 */
export function MainNavFallback(props: MainNavProps) {
  return <MainNavView {...props} pathname={null} />;
}

function MainNavView({
  items,
  variant = "desktop",
  pathname,
}: MainNavProps & { pathname: string | null }) {
  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        variant === "desktop"
          ? "hidden lg:ml-[74px] lg:block"
          : "overflow-x-auto px-5 pb-3 [scrollbar-width:none] lg:hidden",
      )}
    >
      <ul
        className={cn(
          "flex items-center",
          variant === "desktop"
            ? "gap-8 whitespace-nowrap"
            : "gap-5 whitespace-nowrap md:gap-8",
        )}
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  variant === "desktop" ? "text-lg" : "text-sm md:text-base",
                  "font-medium tracking-[-0.02em] transition-colors hover:text-primary",
                  active ? "text-primary" : "text-gray-500",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
