-- Edusentia v7.4.0 r37 Product Ready
-- Keeps internal RCE cron and Vault names as compatibility identifiers.
-- Resolves project URL and cron secret dynamically from Vault when each job runs,
-- instead of embedding the decrypted cron secret into cron.job.command.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if to_regclass('vault.decrypted_secrets') is null then
    raise exception 'Supabase Vault is required';
  end if;

  perform cron.unschedule(jobid)
  from cron.job
  where jobname in (
    'rce-notification-dispatcher',
    'rce-scheduled-backup',
    'rce-backup-verification',
    'rce-storage-maintenance'
  );

  perform cron.schedule('rce-notification-dispatcher','*/5 * * * *',$job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name='rce_project_url') || '/functions/v1/notification-dispatcher',
      headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',(select decrypted_secret from vault.decrypted_secrets where name='rce_cron_secret')),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000
    );
  $job$);

  perform cron.schedule('rce-scheduled-backup','15 2 * * *',$job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name='rce_project_url') || '/functions/v1/scheduled-backup',
      headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',(select decrypted_secret from vault.decrypted_secrets where name='rce_cron_secret')),
      body := '{"action":"create","mode":"scheduled"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $job$);

  perform cron.schedule('rce-backup-verification','15 3 * * 0',$job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name='rce_project_url') || '/functions/v1/scheduled-backup',
      headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',(select decrypted_secret from vault.decrypted_secrets where name='rce_cron_secret')),
      body := '{"action":"verify_latest","mode":"scheduled"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $job$);

  perform cron.schedule('rce-storage-maintenance','45 3 * * *',$job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name='rce_project_url') || '/functions/v1/scheduled-backup',
      headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',(select decrypted_secret from vault.decrypted_secrets where name='rce_cron_secret')),
      body := '{"action":"storage_maintenance"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $job$);
end $$;
