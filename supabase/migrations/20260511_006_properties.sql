CREATE TABLE IF NOT EXISTS public.properties (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  street_address  TEXT NOT NULL,
  suburb          TEXT NOT NULL,
  state           TEXT NOT NULL,
  postcode        TEXT,
  price           INTEGER NOT NULL,
  property_type   TEXT,
  bedrooms        INTEGER,
  bathrooms       INTEGER,
  land_size       INTEGER,
  listing_url     TEXT,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'off_market')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own properties"
  ON public.properties FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_suburb ON public.properties(suburb, state);
