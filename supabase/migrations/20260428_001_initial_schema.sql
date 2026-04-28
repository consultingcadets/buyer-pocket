-- ============================================================
-- BuyerPocket — Initial Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- UTILITY: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. profiles (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                        TEXT,
  mobile                      TEXT,
  agency_name                 TEXT,
  state                       TEXT,
  timezone                    TEXT,
  eligibility_type            TEXT NOT NULL DEFAULT 'unconfirmed'
                                CHECK (eligibility_type IN ('independent', 'agency_permitted', 'unconfirmed')),
  eligibility_acknowledged_at TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2. buyers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.buyers (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Contact
  name                        TEXT NOT NULL,
  phone                       TEXT,
  email                       TEXT,
  preferred_contact_method    TEXT,
  best_time_to_contact        TEXT,
  contact_consent             TEXT,
  -- Search criteria
  preferred_suburbs           TEXT[],
  nearby_suburbs_acceptable   TEXT,
  school_zone_required        TEXT,
  -- Budget & finance
  budget_min                  INTEGER,
  budget_max                  INTEGER,
  finance_status              TEXT,
  deposit_ready               TEXT,
  -- Property requirements
  property_type               TEXT,
  house_type                  TEXT,
  bedrooms                    TEXT,   -- '3+', 'Any', etc
  bathrooms                   TEXT,
  car_spaces                  TEXT,
  condition_preference        TEXT,
  land_size_min               INTEGER, -- m²
  land_size_max               INTEGER, -- m²
  building_size_min           INTEGER, -- squares
  block_preference            TEXT,
  must_haves                  TEXT[],
  other_must_haves            TEXT,
  deal_breakers               TEXT,
  -- Lead management
  buying_timeline             TEXT,
  buyer_temperature           TEXT CHECK (buyer_temperature IN ('hot', 'warm', 'cold')),
  buyer_type                  TEXT,
  lead_status                 TEXT,
  priority                    TEXT,
  lead_source                 TEXT,
  notes_summary               TEXT,
  last_contacted_at           TIMESTAMPTZ,
  next_reminder_at            TIMESTAMPTZ,
  -- Timestamps
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at                 TIMESTAMPTZ
);

CREATE INDEX idx_buyers_user_id          ON public.buyers(user_id);
CREATE INDEX idx_buyers_temperature      ON public.buyers(user_id, buyer_temperature);
CREATE INDEX idx_buyers_lead_status      ON public.buyers(user_id, lead_status);
CREATE INDEX idx_buyers_next_reminder    ON public.buyers(user_id, next_reminder_at) WHERE next_reminder_at IS NOT NULL;
CREATE INDEX idx_buyers_archived         ON public.buyers(user_id, archived_at);

CREATE TRIGGER buyers_updated_at
  BEFORE UPDATE ON public.buyers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 3. notes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id     UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  contact_type TEXT,
  note         TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id  ON public.notes(user_id);
CREATE INDEX idx_notes_buyer_id ON public.notes(buyer_id);

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 4. reminders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id       UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  reminder_type  TEXT,
  reminder_note  TEXT,
  reminder_at    TIMESTAMPTZ NOT NULL,
  timezone       TEXT,
  priority       TEXT,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'processing', 'sent', 'completed', 'snoozed', 'cancelled')),
  sent_at        TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  snoozed_until  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Primary index for cron job: pending reminders due to fire
CREATE INDEX idx_reminders_status_at      ON public.reminders(status, reminder_at);
CREATE INDEX idx_reminders_user_id        ON public.reminders(user_id);
CREATE INDEX idx_reminders_buyer_id       ON public.reminders(buyer_id);
CREATE INDEX idx_reminders_snoozed_until  ON public.reminders(snoozed_until) WHERE status = 'snoozed';

CREATE TRIGGER reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 5. notifications (in-app inbox)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES public.buyers(id) ON DELETE SET NULL,
  reminder_id UUID REFERENCES public.reminders(id) ON DELETE SET NULL,
  title       TEXT,
  message     TEXT,
  channel     TEXT,
  status      TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at     TIMESTAMPTZ,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id  ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread   ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_buyer_id ON public.notifications(buyer_id);

-- ============================================================
-- 6. push_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token        TEXT NOT NULL UNIQUE,
  device_type  TEXT,
  browser      TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_push_tokens_user_id   ON public.push_tokens(user_id);
CREATE INDEX idx_push_tokens_active    ON public.push_tokens(user_id, is_active) WHERE is_active = TRUE;

CREATE TRIGGER push_tokens_updated_at
  BEFORE UPDATE ON public.push_tokens
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- 7. subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  status                 TEXT,
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  trial_start            TIMESTAMPTZ,
  trial_end              TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: own row" ON public.profiles
  FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- buyers
CREATE POLICY "buyers: own rows" ON public.buyers
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- notes
CREATE POLICY "notes: own rows" ON public.notes
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- reminders
CREATE POLICY "reminders: own rows" ON public.reminders
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- notifications
CREATE POLICY "notifications: own rows" ON public.notifications
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- push_tokens
CREATE POLICY "push_tokens: own rows" ON public.push_tokens
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- subscriptions — users can only SELECT; writes via service role (Stripe webhook)
CREATE POLICY "subscriptions: read own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- GRANT service role bypass (already default, but explicit)
-- ============================================================
-- Service role bypasses RLS by default in Supabase.
-- No extra grants needed for the webhook handler.
