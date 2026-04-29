-- Add cancel_at to subscriptions (timestamp when subscription will actually cancel,
-- distinct from cancel_at_period_end boolean — used for immediate cancellations)
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS cancel_at TIMESTAMPTZ;
