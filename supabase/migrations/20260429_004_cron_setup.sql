-- ============================================================
-- Cron setup for BuyerPocket reminder processing
-- Run this in Supabase SQL editor AFTER deploying to Vercel
-- and setting CRON_SECRET in your environment.
-- ============================================================

-- Enable pg_net extension (needed for HTTP requests from pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule the reminder cron job (every 5 minutes)
-- Replace YOUR_VERCEL_URL and YOUR_CRON_SECRET before running.
SELECT cron.schedule(
  'process-reminders',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url        := 'https://YOUR_VERCEL_URL/api/cron/process-reminders',
    headers    := jsonb_build_object(
                    'Authorization', 'Bearer YOUR_CRON_SECRET',
                    'Content-Type',  'application/json'
                  ),
    body       := '{}'::jsonb,
    timeout_milliseconds := 25000
  ) AS request_id;
  $$
);

-- To verify the schedule was created:
-- SELECT * FROM cron.job;

-- To remove the schedule later:
-- SELECT cron.unschedule('process-reminders');

-- To view recent cron run logs:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
