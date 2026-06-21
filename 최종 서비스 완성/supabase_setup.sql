-- ============================================================
--  아기사자 대시보드 - Supabase 설정 SQL
-- ============================================================

-- 1) 테이블 생성 -------------------------------------------------
create table if not exists public.lions (
  id                bigint generated always as identity primary key,
  name              text    not null,
  part              text    not null default 'FRONTEND',
  part_key          text,
  track             text,
  quote             text,
  intro             text,
  full_introduction text,
  contact           jsonb   default '{}'::jsonb,
  skills            text[]  default '{}',
  determination     text,
  image             text,
  is_me             boolean not null default false,
  created_at        timestamptz not null default now()
);

-- 2) RLS(행 수준 보안) + 정책 ----------------------------------
--    수업용 데모이므로 익명(anon) 사용자에게 읽기/추가/삭제를 허용합니다.
--    실제 서비스라면 로그인 사용자만 쓰도록 정책을 좁혀야 합니다.
alter table public.lions enable row level security;

drop policy if exists "lions public read"   on public.lions;
drop policy if exists "lions public insert" on public.lions;
drop policy if exists "lions public delete" on public.lions;

create policy "lions public read"   on public.lions for select using (true);
create policy "lions public insert" on public.lions for insert with check (true);
create policy "lions public delete" on public.lions for delete using (true);

-- 3) 초기 명단 시드 -------------------------------------------
--    (이미 한 번 실행했다면 중복 추가를 막기 위해 아래 줄의 주석을 풀어 비우세요)
-- truncate table public.lions restart identity;

insert into public.lions
  (name, part, part_key, track, quote, intro, contact, skills, determination, image, is_me)
values
  ('이지은','FRONTEND','React','HUFSLION',
   '매사에 노력하고자 하는 아기사자 이지은입니다',
   '저는 스스로가 정한 길을 부끄럽게 하지 않기 위해 멋쟁사자처럼에 가입했습니다. 제 각오가 흐려지지 않도록 열심히 하겠습니다',
   '{"email":"inginging@lion.com","github":"https://github.com/inginging","phone":"010-1111-2222"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '시간이 얼마가 걸리든, 저다운 멋쟁이 사자가 되겠습니다', null, true),

  ('홍길동','FRONTEND','React',null,
   '멋진 디자인을 많이 만들고픈 아기사자 홍길동입니다',
   '평소에 다양한 어플리케이션을 사용하면서 개발 환경을 연구해왔습니다. 더 시용성 있는 개발 환경을 구축해 나가겠습니다.',
   '{"email":"lionhong@example.com","github":"https://github.com/hong","phone":"010-2222-3333"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '열심히 노력하겠습니다.', null, false),

  ('김경식','FRONTEND','React',null,
   '컴포넌트 단위 설계에 흥미를 느껴 지원한 아기사자 김경식입니다',
   '이번에 HTML과 CSS를 처음 배우게 되었습니다. 부족한만큼 열심히 공부하고 노력해서 실력을 향상시키겠습니다.',
   '{"email":"lionkim@example.com","github":"https://github.com/kim","phone":"010-3333-4444"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '부족한만큼 열심히 하겠습니다!', null, false),

  ('박철수','FRONTEND','React',null,
   '데이터 흐름을 명확히 하는 개발을 지향하는 아기사자 박철수입니다',
   '외부 활동으로 백엔드의 경험을 쌓아왔습니다. 이번에는 프론트엔드에 지원하여 더 다양한 관점을 가지고 개발할 수 있도록 노력하고자 합니다. 잘 부탁드립니다.',
   '{"email":"lionpark@example.com","github":"https://github.com/park","phone":"010-4444-5555"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '뒤처지지 않게 노력하겠습니다.', null, false),

  ('신미나','BACKEND','Node.js',null,
   '안정적인 서버를 구축하고자 하는 아기사자 신미나입니다',
   '대외활동을 통해 기초적인 백엔드 지식을 쌓았습니다. 스스로 실전 경험이 부족하다고 판단하여 지원하게 되었습니다. 열심히 하겠습니다.',
   '{"email":"lionshin@example.com","github":"https://github.com/shin","phone":"010-5555-6666"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '자신있게 임하겠습니다.', null, false),

  ('구현민','BACKEND','Node.js',null,
   '사용자 관점에서 개발하고자 하는 아기사자 구현민입니다',
   '저는 한 번도 개발에 대해 전문적으로 배워본 적이 없습니다. 하지만 누구보다 개발에 관심이 있고, 열정이 있습니다. 열심히하겠습니다.',
   '{"email":"liongoo@example.com","github":"https://github.com/goo","phone":"010-6666-7777"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '열정만은 뒤쳐지지 않습니다. 잘 부탁드립니다.', null, false),

  ('김지우','BACKEND','Node.js',null,
   '실용성 있는 개발을 목표로 하는 아기사자 김지우입니다',
   '저는 어렸을 때부터 누군가의 도움이 되었을 때 큰 뿌듯함을 느꼈습니다. 그래서 개발을 통해 누군가에게 도움이 되고 싶다는 생각이 들어 지원하게 되었습니다.',
   '{"email":"lionwoo@example.com","github":"https://github.com/woo","phone":"010-7777-8888"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '꿈을 위해 노력하겠습니다.', null, false),

  ('황영미','BACKEND','Node.js',null,
   '더 쉽게 사용할 수 있는 웹 서비스를 개발하는 아기사자 황영미입니다',
   '저는 사람을 가르치는 것에 흥미가 있습니다. 또 평소에 재미를 느끼고 꾸준히 공부해왔던 개발과 이 꿈을 합쳐 사람들에게 개발과 관련된 내용들을 가르치고 싶어졌습니다. 더 많은 지식을 더 쉽게 명확하게 가르치기 위해 이곳에 왔습니다.',
   '{"email":"hwang@example.com","github":"https://github.com/hwang","phone":"010-8888-9999"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '개발을 더 많은 사람들에게 전달하겠습니다.', null, false),

  ('고승미','DESIGN',null,null,
   '보기 좋은 디자인을 위해 노력하는 아기사자 고승미입니다',
   '저는 어렸을 때부터 꾸준히 디자인을 공부해왔습니다. 더 다양한 디자인을 통해 사람들에게 긍정적인 영향을 주고 싶다는 생각이 들어 지원하게 되었습니다. 열심히 하겠습니다.',
   '{"email":"mimi@example.com","github":"https://github.com/mimi","phone":"010-1234-5678"}',
   '{"HTML/CSS(in process)","JAVASCRIPT","C++"}',
   '여러분의 결과물에 멋진 디자인을 더하겠습니다.', null, false);

-- 확인용
select id, name, part, is_me from public.lions order by id;
