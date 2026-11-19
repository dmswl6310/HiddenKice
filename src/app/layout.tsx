import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/shared/config/site";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { Providers } from "./providers";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  // 메신저/메일에 링크를 공유했을 때 보이는 미리보기
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 800, height: 491, alt: "히든카이스 교재" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
