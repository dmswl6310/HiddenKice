-- 교재(textbooks) 테이블
-- 할인율은 저장하지 않고 정가(price)와 판매가(sale_price)로 계산한다. (데이터 불일치 방지)

create type public.textbook_category as enum ('pass', 'single');

create table public.textbooks (
  id            bigint generated always as identity primary key,
  title         text not null check (char_length(btrim(title)) between 1 and 200),
  category      public.textbook_category not null,
  price         integer not null check (price >= 0),
  sale_price    integer not null check (sale_price >= 0 and sale_price <= price),
  thumbnail_url text,
  is_published  boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.textbooks is '스토어에 노출되는 교재 상품';
comment on column public.textbooks.price is '정가(원)';
comment on column public.textbooks.sale_price is '판매가(원). 할인이 없으면 정가와 같다.';
comment on column public.textbooks.sort_order is '노출 순서(오름차순)';

-- 목록 조회: 노출 여부 + 카테고리 필터 + 정렬
create index textbooks_list_idx
  on public.textbooks (is_published, category, sort_order, id desc);

-- 제목 부분 검색(ILIKE '%keyword%')용 trigram 인덱스
create extension if not exists pg_trgm with schema extensions;
create index textbooks_title_trgm_idx
  on public.textbooks using gin (title extensions.gin_trgm_ops);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger textbooks_set_updated_at
  before update on public.textbooks
  for each row execute function public.set_updated_at();

-- RLS: 브라우저(anon key)에서는 노출 중인 교재 조회만 허용한다.
alter table public.textbooks enable row level security;

-- 신규 Supabase 프로젝트는 public 스키마 테이블에 기본 권한을 주지 않으므로 조회 권한을 명시한다.
grant select on table public.textbooks to anon, authenticated;
-- 프로젝트 기본 권한으로 쓰기 권한이 부여돼 있을 수 있어 명시적으로 회수한다. (RLS 와 이중 방어)
revoke insert, update, delete, truncate on table public.textbooks from anon, authenticated;

create policy "Published textbooks are viewable by everyone"
  on public.textbooks
  for select
  to anon, authenticated
  using (is_published = true);
