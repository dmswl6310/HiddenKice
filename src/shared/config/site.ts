export const siteConfig = {
  name: "히든카이스",
  title: "HIDDEN KICE | 히든카이스 스토어",
  description: "상위권이 선택한 문제집, 결과로 증명된 실전 대비서 히든카이스",
  url: "https://hidden-kice-shop.vercel.app",
  ogImage: "/images/banner/hero-books.png",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNavItems: readonly NavItem[] = [
  { label: "스토어", href: "/" },
  { label: "AI OMR WORK", href: "/omr" },
  { label: "챌린지", href: "/challenge" },
  { label: "히든카이스 소개", href: "/about" },
];

export const footerLinks: readonly NavItem[] = [
  { label: "회사소개", href: "/about" },
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
];

export const companyInfo = {
  name: "(주)히든카이스",
  brandName: "히든카이스",
  ceo: "안영호",
  businessNumber: "735-87-02522",
  businessInfoUrl: "https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7358702522",
  address: "경기도 고양시 일산서구 일현로 97-11, 56F",
  mailOrderNumber: "제 2024-고양일산서-1209",
  email: "Hidden_kice@naver.com",
  copyrightYear: 2026,
} as const;
