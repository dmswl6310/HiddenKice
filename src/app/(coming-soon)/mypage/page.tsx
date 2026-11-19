import type { Metadata } from "next";
import { ComingSoon } from "@/shared/components/layout/ComingSoon";

export const metadata: Metadata = { title: "마이페이지 | HIDDEN KICE" };

export default function Page() {
  return <ComingSoon title="마이페이지 페이지는 준비 중입니다." />;
}
