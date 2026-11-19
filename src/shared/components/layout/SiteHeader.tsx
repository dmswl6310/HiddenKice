import Link from "next/link";
import { mainNavItems } from "@/shared/config/site";
import { BellIcon, CartIcon, UserIcon } from "@/shared/components/icons";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { IconBadgeButton } from "./IconBadgeButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-16 items-center gap-6 md:h-[100px]">
        <Link
          href="/"
          className="shrink-0 text-xl font-extrabold tracking-[-0.04em] text-primary md:text-[25px]"
        >
          HIDDEN KICE
        </Link>

        <MainNav items={mainNavItems} variant="desktop" />

        <div className="ml-auto flex shrink-0 items-center gap-3 text-gray-700 md:gap-[19px]">
          <IconBadgeButton href="/cart" label="장바구니" count={1} icon={<CartIcon className="size-[26px]" />} />
          <IconBadgeButton href="/notifications" label="알림" count={1} icon={<BellIcon className="size-[26px]" />} />
          <IconBadgeButton href="/mypage" label="마이페이지" icon={<UserIcon className="size-[26px]" />} />
        </div>
      </Container>
      <MainNav items={mainNavItems} variant="mobile" />
    </header>
  );
}
