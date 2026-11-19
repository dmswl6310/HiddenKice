import type { Metadata } from "next";
import { ComingSoon } from "@/shared/components/layout/ComingSoon";

export const metadata: Metadata = { title: "챌린지 | HIDDEN KICE" };

export default function Page() {
  return <ComingSoon title="챌린지 페이지는 준비 중입니다." />;
}
