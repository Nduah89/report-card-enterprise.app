begin;

-- Validate the existing next-term reopening date invariant.
alter table public.terms
  validate constraint term_reopening_after_end_chk;

-- Authorization helpers are not anonymous/public RPCs.
revoke execute on function public.can_manage_headteachers() from public;
revoke execute on function public.can_manage_headteachers() from anon;
grant execute on function public.can_manage_headteachers() to authenticated, service_role;

-- Keep the unique constraint-backed index and remove only the duplicate manual index.
drop index if exists public.report_card_templates_storage_path_uidx;

commit;
