-- Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers (lower(email));

create index if not exists newsletter_subscribers_active_idx
  on public.newsletter_subscribers (subscribed_at desc)
  where unsubscribed_at is null;

alter table public.newsletter_subscribers enable row level security;

-- No public access. Only service-role (server) reads/writes.
revoke all on public.newsletter_subscribers from anon, authenticated;
