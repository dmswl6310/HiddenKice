"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils/cn";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

type MainNavProps = {
  items: readonly NavItem[];
  /** desktop: 헤더 가운데 / mobile: 헤더 아래 가로 스크롤 */
  variant?: "desktop" | "mobile";
};

export function MainNav({ items, variant = "desktop" }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        variant === "desktop"
          ? "hidden lg:ml-[74px] lg:block"
          : "overflow-x-auto px-5 pb-3 [scrollbar-width:none] lg:hidden",
      )}
    >
      <ul className={cn("flex items-center", variant === "desktop" ? "gap-8 whitespace-nowrap" : "gap-5 whitespace-nowrap md:gap-8")}>
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
