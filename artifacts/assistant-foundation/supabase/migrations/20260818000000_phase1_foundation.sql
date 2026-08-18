-- Phase 1 foundation: profiles, conversations, messages, people, events,
-- reminders, memories, and preferences with per-user isolation.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  timezone text not null default 'UTC',
  preferred_language text not null default 'en',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null check (length(trim(content)) > 0),
  language text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint messages_user_conversation_match unique (id, conversation_id, user_id)
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  relationship text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  person_id uuid references public.people(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz,
  timezone text not null default 'UTC',
  location text,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  source text not null default 'manual' check (source in ('manual', 'ai', 'calendar_sync')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint events_end_after_start check (end_time is null or end_time >= start_time)
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  trigger_time timestamptz not null,
  timezone text not null default 'UTC',
  related_event_id uuid references public.events(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null check (length(trim(memory_type)) > 0),
  content text not null check (length(trim(content)) > 0),
  importance integer not null default 50 check (importance between 0 and 100),
  confidence numeric(5, 4) not null default 0.5 check (confidence between 0 and 1),
  source_message_id uuid references public.messages(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  preference_key text not null check (length(trim(preference_key)) > 0),
  preference_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint preferences_user_key_unique unique (user_id, preference_key)
);

create index if not exists conversations_user_id_idx on public.conversations(user_id);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_user_id_idx on public.messages(user_id);
create index if not exists people_user_id_idx on public.people(user_id);
create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_start_time_idx on public.events(start_time);
create index if not exists reminders_user_id_idx on public.reminders(user_id);
create index if not exists reminders_trigger_time_idx on public.reminders(trigger_time);
create index if not exists memories_user_id_idx on public.memories(user_id);
create index if not exists preferences_user_id_idx on public.preferences(user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute procedure public.set_updated_at();

drop trigger if exists people_set_updated_at on public.people;
create trigger people_set_updated_at
before update on public.people
for each row execute procedure public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute procedure public.set_updated_at();

drop trigger if exists reminders_set_updated_at on public.reminders;
create trigger reminders_set_updated_at
before update on public.reminders
for each row execute procedure public.set_updated_at();

drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at
before update on public.memories
for each row execute procedure public.set_updated_at();

drop trigger if exists preferences_set_updated_at on public.preferences;
create trigger preferences_set_updated_at
before update on public.preferences
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name, timezone)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'name', '')), ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'timezone', ''), 'UTC')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.people enable row level security;
alter table public.events enable row level security;
alter table public.reminders enable row level security;
alter table public.memories enable row level security;
alter table public.preferences enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using ((select auth.uid()) = user_id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check ((select auth.uid()) = user_id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles for delete using ((select auth.uid()) = user_id);

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own" on public.conversations for select using ((select auth.uid()) = user_id);
drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own" on public.conversations for insert with check ((select auth.uid()) = user_id);
drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own" on public.conversations for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_delete_own" on public.conversations for delete using ((select auth.uid()) = user_id);

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages for select using (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  )
);
drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages for insert with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  )
);
drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages for update using (
  (select auth.uid()) = user_id
) with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = (select auth.uid())
  )
);
drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own" on public.messages for delete using ((select auth.uid()) = user_id);

drop policy if exists "people_select_own" on public.people;
create policy "people_select_own" on public.people for select using ((select auth.uid()) = user_id);
drop policy if exists "people_insert_own" on public.people;
create policy "people_insert_own" on public.people for insert with check ((select auth.uid()) = user_id);
drop policy if exists "people_update_own" on public.people;
create policy "people_update_own" on public.people for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "people_delete_own" on public.people;
create policy "people_delete_own" on public.people for delete using ((select auth.uid()) = user_id);

drop policy if exists "events_select_own" on public.events;
create policy "events_select_own" on public.events for select using ((select auth.uid()) = user_id);
drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events for insert with check (
  (select auth.uid()) = user_id
  and (
    person_id is null
    or exists (
      select 1 from public.people p
      where p.id = person_id and p.user_id = (select auth.uid())
    )
  )
);
drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events for update using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id
  and (
    person_id is null
    or exists (
      select 1 from public.people p
      where p.id = person_id and p.user_id = (select auth.uid())
    )
  )
);
drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own" on public.events for delete using ((select auth.uid()) = user_id);

drop policy if exists "reminders_select_own" on public.reminders;
create policy "reminders_select_own" on public.reminders for select using ((select auth.uid()) = user_id);
drop policy if exists "reminders_insert_own" on public.reminders;
create policy "reminders_insert_own" on public.reminders for insert with check (
  (select auth.uid()) = user_id
  and (
    related_event_id is null
    or exists (
      select 1 from public.events e
      where e.id = related_event_id and e.user_id = (select auth.uid())
    )
  )
);
drop policy if exists "reminders_update_own" on public.reminders;
create policy "reminders_update_own" on public.reminders for update using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id
  and (
    related_event_id is null
    or exists (
      select 1 from public.events e
      where e.id = related_event_id and e.user_id = (select auth.uid())
    )
  )
);
drop policy if exists "reminders_delete_own" on public.reminders;
create policy "reminders_delete_own" on public.reminders for delete using ((select auth.uid()) = user_id);

drop policy if exists "memories_select_own" on public.memories;
create policy "memories_select_own" on public.memories for select using ((select auth.uid()) = user_id);
drop policy if exists "memories_insert_own" on public.memories;
create policy "memories_insert_own" on public.memories for insert with check (
  (select auth.uid()) = user_id
  and (
    source_message_id is null
    or exists (
      select 1 from public.messages m
      where m.id = source_message_id and m.user_id = (select auth.uid())
    )
  )
);
drop policy if exists "memories_update_own" on public.memories;
create policy "memories_update_own" on public.memories for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "memories_delete_own" on public.memories;
create policy "memories_delete_own" on public.memories for delete using ((select auth.uid()) = user_id);

drop policy if exists "preferences_select_own" on public.preferences;
create policy "preferences_select_own" on public.preferences for select using ((select auth.uid()) = user_id);
drop policy if exists "preferences_insert_own" on public.preferences;
create policy "preferences_insert_own" on public.preferences for insert with check ((select auth.uid()) = user_id);
drop policy if exists "preferences_update_own" on public.preferences;
create policy "preferences_update_own" on public.preferences for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "preferences_delete_own" on public.preferences;
create policy "preferences_delete_own" on public.preferences for delete using ((select auth.uid()) = user_id);