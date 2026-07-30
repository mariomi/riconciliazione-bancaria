-- Trigger functions are implementation details and must not be callable through
-- the Data API. cleanup_old_analyses is the only RPC used by the browser.

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

revoke all on function public.link_team_member_on_invite() from public;
revoke all on function public.link_team_member_on_invite() from anon;
revoke all on function public.link_team_member_on_invite() from authenticated;

revoke all on function public.link_team_member_on_signup() from public;
revoke all on function public.link_team_member_on_signup() from anon;
revoke all on function public.link_team_member_on_signup() from authenticated;

revoke all on function public.set_profile_updated_at() from public;
revoke all on function public.set_profile_updated_at() from anon;
revoke all on function public.set_profile_updated_at() from authenticated;
alter function public.set_profile_updated_at() set search_path = '';

revoke all on function public.team_count() from public;
revoke all on function public.team_count() from anon;
grant execute on function public.team_count() to authenticated;

revoke all on function public.cleanup_old_analyses() from public;
revoke all on function public.cleanup_old_analyses() from anon;
grant execute on function public.cleanup_old_analyses() to authenticated;
