create table if not exists detective_scores (
  id         serial primary key,
  alias      text not null,
  score      integer not null,
  time_left  integer not null,
  clues      integer not null,
  solved     boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists detective_scores_score_idx on detective_scores (score desc, created_at asc);
