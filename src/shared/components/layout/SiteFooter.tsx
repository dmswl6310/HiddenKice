import Link from "next/link";
import { companyInfo, footerLinks } from "@/shared/config/site";
import { Container } from "./Container";

export function SiteFooter() {
  return (
    <footer className="mt-16 pb-12 pt-8 text-[13px] leading-[1.6] md:text-sm text-gray-400">
      <Container className="xl:px-0">
        <nav aria-label="하단 메뉴">
          <ul className="flex flex-wrap items-center text-gray-500">
            {footerLinks.map((link, index) => (
              <li key={link.href} className="flex items-center">
                {index > 0 && (
                  <span aria-hidden="true" className="mx-3">
                    |
                  </span>
                )}
                <Link href={link.href} className="hover:text-gray-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="mt-3 not-italic">
          <p>
            {companyInfo.name} | 대표: {companyInfo.ceo} | 사업자등록번호: {companyInfo.businessNumber} (
            <a
              href={companyInfo.businessInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-700"
            >
              사업자정보확인
            </a>
            )
          </p>
          <p>
            주소: {companyInfo.address} | 통신판매업신고: {companyInfo.mailOrderNumber} | 이메일:{" "}
            <a href={`mailto:${companyInfo.email}`} className="hover:text-gray-700">
              {companyInfo.email}
            </a>
          </p>
        </address>

        <p className="mt-3">
          Copyright © {companyInfo.copyrightYear} {companyInfo.brandName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
