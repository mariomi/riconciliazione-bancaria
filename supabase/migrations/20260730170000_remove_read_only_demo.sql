-- Remove the retired shared demo environment.
-- A normal Free account is now the only product trial path.
do $rollback_demo$
declare
  v_demo_id uuid;
  v_demo_count integer;
begin
  -- Never delete an ordinary account that happens to use the former address.
  if exists (
    select 1
    from auth.users
    where lower(email) = 'demo@mach.bank'
      and not coalesce((raw_app_meta_data ->> 'is_demo')::boolean, false)
  ) then
    raise exception 'Rollback demo aborted: demo email exists without trusted is_demo marker';
  end if;

  select count(*)
    into v_demo_count
  from auth.users
  where lower(email) = 'demo@mach.bank'
    and coalesce((raw_app_meta_data ->> 'is_demo')::boolean, false);

  if v_demo_count > 1 then
    raise exception 'Rollback demo aborted: % matching auth users', v_demo_count;
  end if;

  select id
    into v_demo_id
  from auth.users
  where lower(email) = 'demo@mach.bank'
    and coalesce((raw_app_meta_data ->> 'is_demo')::boolean, false);

  if v_demo_id is not null then
    -- Auth-user deletion does not remove Storage objects. Abort instead of
    -- orphaning anything if demo-owned objects unexpectedly exist.
    if exists (
      select 1
      from storage.objects
      where owner = v_demo_id or owner_id = v_demo_id::text
    ) or exists (
      select 1
      from storage.s3_multipart_uploads
      where owner_id = v_demo_id::text
    ) or exists (
      select 1
      from storage.s3_multipart_uploads_parts
      where owner_id = v_demo_id::text
    ) then
      raise exception 'Rollback demo aborted: remove demo-owned Storage objects through Storage API first';
    end if;

    delete from public.team_members
    where owner_id = v_demo_id or member_user_id = v_demo_id;

    delete from public.analyses
    where user_id = v_demo_id;

    delete from public.profiles
    where id = v_demo_id;

    delete from auth.users
    where id = v_demo_id
      and lower(email) = 'demo@mach.bank'
      and coalesce((raw_app_meta_data ->> 'is_demo')::boolean, false);

    if not found then
      raise exception 'Rollback demo aborted: guarded auth user delete matched no row';
    end if;
  end if;
end
$rollback_demo$;

drop trigger if exists protect_demo_auth_credentials on auth.users;
drop function if exists public.protect_demo_auth_credentials();

drop policy if exists profiles_block_demo_insert on public.profiles;
drop policy if exists profiles_block_demo_update on public.profiles;
drop policy if exists profiles_block_demo_delete on public.profiles;
drop policy if exists analyses_block_demo_insert on public.analyses;
drop policy if exists analyses_block_demo_update on public.analyses;
drop policy if exists analyses_block_demo_delete on public.analyses;
drop policy if exists team_members_block_demo_insert on public.team_members;
drop policy if exists team_members_block_demo_update on public.team_members;
drop policy if exists team_members_block_demo_delete on public.team_members;

create or replace function public.cleanup_old_analyses()
returns integer
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  deleted_count integer;
  user_plan text;
  cutoff timestamptz;
begin
  select plan into user_plan
  from public.profiles
  where id = auth.uid();

  user_plan := coalesce(user_plan, 'free');

  case user_plan
    when 'pro' then cutoff := now() - interval '4 months';
    when 'pro_plus' then cutoff := now() - interval '12 months';
    when 'business' then cutoff := now() - interval '24 months';
    else cutoff := now() - interval '1 month';
  end case;

  delete from public.analyses
  where user_id = auth.uid()
    and is_starred = false
    and created_at < cutoff;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$function$;

revoke all on function public.cleanup_old_analyses() from public;
revoke all on function public.cleanup_old_analyses() from anon;
grant execute on function public.cleanup_old_analyses() to authenticated;
