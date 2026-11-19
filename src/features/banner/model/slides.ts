import type { BannerSlide } from "./types";

const hiddenKiceSeason7: Omit<BannerSlide, "id"> = {
  eyebrow: "HIDDEN KICE",
  title: "히든카이스",
  subtitle: "모두가 푸는 건 이유가 있습니다",
  description: "상위권이 선택한 문제집, 결과로 증명된 실전 대비서",
  features: [
    { icon: "target", title: "실전 적중", description: "출제 경향을 꿰뚫는 문제" },
    { icon: "levelChart", title: "난이도별 구성", description: "단계별로 완성하는 실력" },
    { icon: "trophy", title: "검증된 결과", description: "합격생이 증명한 선택" },
  ],
  cta: { label: "히든카이스 시리즈 보기", href: "#textbooks" },
  image: {
    src: "/images/banner/hero-books.png",
    alt: "히든카이스 2026 시즌7 교재 3종",
    width: 800,
    height: 491,
  },
};

/**
 * 메인 배너 슬라이드 목록.
 * 배너가 운영 데이터가 되면 이 배열을 CMS/Supabase 조회 결과로 교체하면 된다.
 */
export const heroSlides: BannerSlide[] = Array.from({ length: 5 }, (_, index) => ({
  id: `hidden-kice-s7-${index + 1}`,
  ...hiddenKiceSeason7,
}));
