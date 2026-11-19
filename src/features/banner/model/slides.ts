import type { BannerFeature, BannerSlide } from "./types";

const BANNER_IMAGE = { width: 800, height: 491 } as const;

const brandFeatures: BannerFeature[] = [
  { icon: "target", title: "실전 적중", description: "출제 경향을 꿰뚫는 문제" },
  { icon: "levelChart", title: "난이도별 구성", description: "단계별로 완성하는 실력" },
  { icon: "trophy", title: "검증된 결과", description: "합격생이 증명한 선택" },
];

/**
 * 메인 배너 슬라이드 목록.
 * 배너가 운영 데이터가 되면 이 배열을 CMS/Supabase 조회 결과로 교체하면 된다.
 */
export const heroSlides: BannerSlide[] = [
  {
    id: "brand",
    accent: "#fa622f",
    eyebrow: "HIDDEN KICE",
    title: "히든카이스",
    subtitle: "모두가 푸는 건 이유가 있습니다",
    description: "상위권이 선택한 문제집, 결과로 증명된 실전 대비서",
    features: brandFeatures,
    cta: { label: "히든카이스 시리즈 보기", href: "#textbooks" },
    image: { src: "/images/banner/hero-books.png", alt: "히든카이스 2026 시즌7 교재 3종", ...BANNER_IMAGE },
  },
  {
    id: "math-pass",
    accent: "#4a8dff",
    eyebrow: "SEASON 7 MATH",
    title: "수학 올인원 패스",
    subtitle: "개념부터 실전까지 한 번에",
    description: "수학 I, 수학 II, 선택과목을 하나의 패스로 끝내는 시즌7 구성",
    features: [
      { icon: "target", title: "전 범위 수록", description: "공통과 선택과목 모두" },
      { icon: "levelChart", title: "3단계 난이도", description: "기본, 실전, 킬러 순서" },
      { icon: "trophy", title: "상위권 추천", description: "1등급이 고른 패스" },
    ],
    cta: { label: "패스 교재 보기", href: "/?category=pass#textbooks" },
    image: { src: "/images/banner/hero-books-blue.png", alt: "히든카이스 수학 패스 교재", ...BANNER_IMAGE },
  },
  {
    id: "korean",
    accent: "#9b6bff",
    eyebrow: "SEASON 7 KOREAN",
    title: "국어 패스",
    subtitle: "읽는 힘이 점수가 됩니다",
    description: "문학, 독서, 언어와 매체를 실전 시간에 맞춰 훈련하는 모의고사",
    features: [
      { icon: "target", title: "실전 시간 훈련", description: "80분 실전 세트 구성" },
      { icon: "levelChart", title: "영역별 분석", description: "약한 영역을 한눈에" },
      { icon: "trophy", title: "검증된 지문", description: "출제 경향 반영" },
    ],
    cta: { label: "국어 교재 보기", href: "/?q=%EA%B5%AD%EC%96%B4#textbooks" },
    image: { src: "/images/banner/hero-books-purple.png", alt: "히든카이스 국어 교재", ...BANNER_IMAGE },
  },
  {
    id: "single",
    accent: "#2fd06b",
    eyebrow: "SINGLE EDITION",
    title: "과목별 단품",
    subtitle: "필요한 과목만 골라서",
    description: "약한 과목만 집중해서 보완하는 단품 교재",
    features: [
      { icon: "target", title: "과목별 선택", description: "필요한 만큼만 구매" },
      { icon: "levelChart", title: "단원별 구성", description: "취약 단원 집중 공략" },
      { icon: "trophy", title: "가벼운 시작", description: "부담 없는 한 권" },
    ],
    cta: { label: "단품 교재 보기", href: "/?category=single#textbooks" },
    image: { src: "/images/banner/hero-books-green.png", alt: "히든카이스 단품 교재", ...BANNER_IMAGE },
  },
  {
    id: "launch-event",
    accent: "#ff4f8b",
    eyebrow: "LAUNCH EVENT",
    title: "시즌7 출시 기념",
    subtitle: "패스 교재 5% 할인",
    description: "2026 Hidden Kice 시즌7 패스 전 상품 할인 중",
    features: brandFeatures,
    cta: { label: "할인 교재 보기", href: "/?category=pass#textbooks" },
    image: { src: "/images/banner/hero-books-pink.png", alt: "히든카이스 시즌7 패스 교재", ...BANNER_IMAGE },
  },
];
