import Link from "next/link";
import { Container } from "./Container";

type ComingSoonProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
};

/** 아직 구현되지 않은 메뉴 / 404 에서 공통으로 사용하는 안내 화면 */
export function ComingSoon({
  title = "준비 중인 페이지입니다.",
  eyebrow = "COMING SOON",
  description = "빠른 시일 내에 찾아뵙겠습니다.",
}: ComingSoonProps) {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-strong"
      >
        스토어로 돌아가기
      </Link>
    </Container>
  );
}
