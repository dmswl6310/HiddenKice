# HIDDEN KICE 스토어

히든카이스 교재 스토어 메인 화면입니다. 교재 정보는 Supabase 에 저장하고, 브라우저에서 직접 조회(CSR)해 보여줍니다.

- **배포**: https://hidden-kice-shop.vercel.app

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 스타일 | Tailwind CSS v4, Pretendard |
| 데이터 | Supabase (PostgreSQL, RLS), supabase-js |
| 서버 상태 관리 | TanStack Query v5 |
| 테스트 | Vitest (단위), Playwright (E2E) |
| 배포 | Vercel |

## 주요 기능

- **메인 배너**: 5장 자동 전환 슬라이더, 마우스 드래그/터치 스와이프 전환, 슬라이드 버튼으로 해당 필터 목록 이동 (마우스를 올리거나 탭이 비활성일 때, 동작 줄이기 설정 시 정지)
- **교재 목록**: 검색, 구분 필터(전체/패스/단품), 페이지네이션(12개씩)
- **URL 상태 관리**: 검색어/구분/페이지가 URL 에 남아 새로고침, 링크 공유, 뒤로가기 시에도 유지
- **예외 처리**: 로딩 스켈레톤, 조회 실패 시 다시 시도, 검색 결과 없음 안내, 이미지 로드 실패 대체 UI, 잘못된 URL 값 보정
- **반응형**: 모바일 2열 / 태블릿 3열 / 데스크톱 4열, 1024px 미만은 가로 스크롤 메뉴
- **보안**: RLS로 공개 교재만 조회, 공개 키의 쓰기 권한 회수, 기본 보안 응답 헤더 적용

## 폴더 구조

```
src/
├── app/                    # 라우팅. 페이지는 feature 컴포넌트를 조립만 한다
│   ├── layout.tsx
│   ├── page.tsx            # 스토어 메인 = 배너 + 교재 목록
│   └── (coming-soon)/      # 아직 구현하지 않은 메뉴
│
├── features/               # 기능(도메인) 단위 모듈
│   ├── banner/
│   └── textbook/
│       ├── api/            # 데이터 조회 (Supabase)
│       ├── hooks/          # 서버 상태(TanStack Query), URL 상태
│       ├── components/     # UI
│       ├── model/          # 타입, 상수, 변환/계산 로직 (순수 함수)
│       └── index.ts        # 외부에 공개하는 API
│
└── shared/                 # 도메인과 무관한 공통 코드
    ├── components/         # layout, ui, icons
    ├── config/             # 사이트 설정, 환경 변수
    ├── hooks/
    └── lib/                # supabase client, query client, utils

supabase/
├── migrations/             # 테이블, 인덱스, RLS 정책
└── seed.sql                # 더미 데이터

e2e/                        # Playwright E2E (seed.sql 데이터로 Supabase 응답 모킹)
```

- 새 기능은 `features/<기능명>` 을 같은 형태로 추가하면 되고, 기존 코드는 수정하지 않아도 됩니다.
- import 방향은 `app → features → shared` 한 방향으로만 흐릅니다. feature 끼리는 직접 참조하지 않습니다.
- 데이터 출처(`api`), 비즈니스 로직(`model`), 상태(`hooks`), 화면(`components`)을 분리해 백엔드가 바뀌어도 `api` 만 교체하면 됩니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # Supabase URL, publishable key 입력
npm run dev
```

Supabase SQL Editor 에서 `supabase/migrations/*.sql`, `supabase/seed.sql` 순서로 실행하면 테이블과 더미 데이터가 생성됩니다.

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 타입 검사 |
| `npm test` | 단위 테스트 (Vitest) |
| `npm run test:e2e` | E2E 테스트 (Playwright, Supabase 응답은 시드 데이터로 모킹) |
| `npm run db:types` | Supabase 스키마로 DB 타입 재생성 (`SUPABASE_PROJECT_ID` 필요) |

## 브랜치 / 커밋 규칙

- `dev` 에서 작업하고 단위별로 `main` 에 머지, `main` 은 Vercel 로 자동 배포
- 커밋 메시지: `feat`, `fix`, `style`, `docs`, `chore` 타입 + 한국어 요약
