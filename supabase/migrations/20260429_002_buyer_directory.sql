-- searchable_text: cannot use GENERATED STORED because to_tsvector(regconfig, text) is
-- STABLE, not IMMUTABLE (PostgreSQL 42P17). Use a plain column + trigger instead.
ALTER TABLE public.buyers
  DROP COLUMN IF EXISTS searchable_text CASCADE;

ALTER TABLE public.buyers
  ADD COLUMN searchable_text tsvector;

CREATE OR REPLACE FUNCTION public.buyers_set_searchable_text()
RETURNS trigger AS $$
BEGIN
  NEW.searchable_text := to_tsvector(
    'english'::regconfig,
    coalesce(NEW.name, '') || ' ' ||
    coalesce(NEW.phone, '') || ' ' ||
    coalesce(NEW.email, '') || ' ' ||
    coalesce(array_to_string(NEW.preferred_suburbs, ' '), '') || ' ' ||
    coalesce(NEW.notes_summary, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS buyers_searchable_text_biu ON public.buyers;
CREATE TRIGGER buyers_searchable_text_biu
  BEFORE INSERT OR UPDATE OF name, phone, email, preferred_suburbs, notes_summary
  ON public.buyers
  FOR EACH ROW
  EXECUTE FUNCTION public.buyers_set_searchable_text();

UPDATE public.buyers SET
  searchable_text = to_tsvector(
    'english'::regconfig,
    coalesce(name, '') || ' ' ||
    coalesce(phone, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(array_to_string(preferred_suburbs, ' '), '') || ' ' ||
    coalesce(notes_summary, '')
  );

-- Add temperature sort order (1=hot, 2=warm, 3=cold, 4=null)
ALTER TABLE public.buyers
  ADD COLUMN IF NOT EXISTS temperature_sort SMALLINT
  GENERATED ALWAYS AS (
    CASE buyer_temperature
      WHEN 'hot'  THEN 1
      WHEN 'warm' THEN 2
      WHEN 'cold' THEN 3
      ELSE 4
    END
  ) STORED;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_buyers_searchable_text ON public.buyers USING GIN (searchable_text);
CREATE INDEX IF NOT EXISTS idx_buyers_preferred_suburbs ON public.buyers USING GIN (preferred_suburbs);
CREATE INDEX IF NOT EXISTS idx_buyers_temperature ON public.buyers (user_id, buyer_temperature);
CREATE INDEX IF NOT EXISTS idx_buyers_temperature_sort ON public.buyers (user_id, temperature_sort);
CREATE INDEX IF NOT EXISTS idx_buyers_lead_status ON public.buyers (user_id, lead_status);
CREATE INDEX IF NOT EXISTS idx_buyers_budget ON public.buyers (user_id, budget_min, budget_max);
CREATE INDEX IF NOT EXISTS idx_buyers_created_at ON public.buyers (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_buyers_updated_at ON public.buyers (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_buyers_last_contacted ON public.buyers (user_id, last_contacted_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_buyers_next_reminder ON public.buyers (user_id, next_reminder_at ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_buyers_property_type ON public.buyers (user_id, property_type);
CREATE INDEX IF NOT EXISTS idx_buyers_bedrooms ON public.buyers (user_id, bedrooms);

-- ============================================================
-- SEED DATA — 50 diverse buyers for development/testing
-- Runs only if public.profiles already has this id (buyers.user_id → profiles.id → auth.users).
-- After you have a test user, either replace the UUID below with auth.users.id, or create a user
-- whose id is 00000000-0000-0000-0000-000000000001 (local only), then re-run this block.
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001'::uuid)
     AND NOT EXISTS (SELECT 1 FROM public.buyers WHERE name = 'Sarah & Tom Jenkins') THEN

    INSERT INTO public.buyers (
      user_id, name, phone, email,
      preferred_suburbs, budget_min, budget_max,
      bedrooms, property_type, land_size_min,
      buyer_temperature, lead_status, buying_timeline,
      last_contacted_at, next_reminder_at,
      notes_summary, created_at, updated_at
    ) VALUES

    -- HOT BUYERS (15)
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Sarah & Tom Jenkins', '0412 345 678', 'sarah.jenkins@email.com',
      ARRAY['Surry Hills, NSW', 'Paddington, NSW', 'Darlinghurst, NSW'],
      1500000, 2000000, '3+', 'Terrace', NULL,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days',
      'Pre-approved. Want north-facing terrace. Kids start school Feb.',
      NOW() - INTERVAL '14 days', NOW() - INTERVAL '2 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Marcus Webb', '0423 456 789', 'marcus.webb@email.com',
      ARRAY['Toorak, VIC', 'South Yarra, VIC', 'Armadale, VIC'],
      2500000, 4000000, '4+', 'House', 600,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day',
      'Cash buyer. Downsizing from Hawthorn. Wants pool.',
      NOW() - INTERVAL '10 days', NOW() - INTERVAL '1 day'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Priya Sharma', '0434 567 890', 'priya.sharma@gmail.com',
      ARRAY['Wollert, VIC', 'Epping, VIC', 'South Morang, VIC'],
      650000, 780000, '4+', 'House', 400,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '3 days', NOW() + INTERVAL '2 days',
      'First home buyer, FHOG eligible. Needs 4 bed for parents.',
      NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'David & Lisa Chen', '0445 678 901', 'david.chen@outlook.com',
      ARRAY['Chatswood, NSW', 'Lane Cove, NSW', 'Willoughby, NSW'],
      1800000, 2500000, '4+', 'House', 500,
      'hot', 'Follow-up', 'Ready now',
      NOW() - INTERVAL '5 hours', NOW() + INTERVAL '7 days',
      'Finance pre-approved. Want good school catchment.',
      NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 hours'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Jason Kowalski', '0456 789 012', 'j.kowalski@email.com',
      ARRAY['Fitzroy, VIC', 'Collingwood, VIC', 'Northcote, VIC'],
      1100000, 1400000, '2+', 'Townhouse', NULL,
      'hot', 'Active', '1–3 months',
      NOW() - INTERVAL '1 day', NOW() + INTERVAL '4 days',
      'Investor. Wants high rental yield area. Cash purchase.',
      NOW() - INTERVAL '8 days', NOW() - INTERVAL '1 day'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Amelia & Raj Patel', '0467 890 123', 'amelia.patel@email.com',
      ARRAY['Brighton, VIC', 'Sandringham, VIC', 'Beaumaris, VIC'],
      1900000, 2800000, '4+', 'House', 700,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days',
      'Pre-approved $2.8M. Beach proximity a must. No strata.',
      NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Oliver Nguyen', '0478 901 234', 'oliver.nguyen@gmail.com',
      ARRAY['Newtown, NSW', 'Erskineville, NSW', 'St Peters, NSW'],
      900000, 1200000, '3+', 'House', NULL,
      'hot', 'Follow-up', '1–3 months',
      NOW() - INTERVAL '6 hours', NULL,
      'Selling current property. Settlement in 6 weeks. Motivated.',
      NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 hours'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Chloe & Ben Morrison', '0489 012 345', 'chloe.morrison@email.com',
      ARRAY['Hawthorn, VIC', 'Camberwell, VIC', 'Glen Iris, VIC'],
      1600000, 2200000, '3+', 'House', 500,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '4 hours', NOW() + INTERVAL '2 days',
      'Bank approval in hand. Want period home. No renovator.',
      NOW() - INTERVAL '9 days', NOW() - INTERVAL '4 hours'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Nick Papageorgiou', '0491 123 456', 'nick.p@email.com',
      ARRAY['Bondi, NSW', 'Coogee, NSW', 'Bronte, NSW'],
      1400000, 1900000, '2+', 'Apartment/Unit', NULL,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '1 day', NOW() + INTERVAL '3 days',
      'Ocean views mandatory. Pre-approved. Can move quickly.',
      NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Fiona & Jack Sullivan', '0402 234 567', 'fiona.sullivan@email.com',
      ARRAY['Ascot Vale, VIC', 'Moonee Ponds, VIC', 'Essendon, VIC'],
      1000000, 1350000, '3+', 'House', 400,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day',
      'Growing family. Second child on the way. Urgent.',
      NOW() - INTERVAL '11 days', NOW() - INTERVAL '2 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Tyler & Emma Scott', '0413 345 678', 'tyler.scott@gmail.com',
      ARRAY['Manly, NSW', 'Dee Why, NSW', 'Curl Curl, NSW'],
      1700000, 2400000, '4+', 'House', 600,
      'hot', 'Follow-up', 'Ready now',
      NOW() - INTERVAL '3 days', NOW() + INTERVAL '6 days',
      'Pre-approved $2.4M. Surf lifestyle important. Private inspection requested.',
      NOW() - INTERVAL '13 days', NOW() - INTERVAL '3 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Ananya Krishnan', '0424 456 789', 'ananya.k@email.com',
      ARRAY['Doncaster, VIC', 'Templestowe, VIC', 'Bulleen, VIC'],
      1200000, 1600000, '4+', 'House', 500,
      'hot', 'Active', '1–3 months',
      NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days',
      'Needs school zone for Westfield SC. Parents to move in.',
      NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Ryan & Kate O''Brien', '0435 567 890', 'ryan.obrien@email.com',
      ARRAY['Brunswick, VIC', 'Coburg, VIC', 'Thornbury, VIC'],
      850000, 1100000, '3+', 'House', NULL,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '5 hours', NOW() + INTERVAL '3 days',
      'Pre-approved. Renovator ok if structurally sound. Quick settlement preferred.',
      NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 hours'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'James Whitfield', '0446 678 901', 'j.whitfield@email.com',
      ARRAY['New Farm, QLD', 'Teneriffe, QLD', 'Newstead, QLD'],
      1300000, 1800000, '3+', 'Townhouse', NULL,
      'hot', 'Active', 'Ready now',
      NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 days',
      'Moving from Sydney. Cash buyer. Timeline flexible within 60 days.',
      NOW() - INTERVAL '9 days', NOW() - INTERVAL '2 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Mei & Liang Zhou', '0457 789 012', 'mei.zhou@gmail.com',
      ARRAY['Box Hill, VIC', 'Glen Waverley, VIC', 'Doncaster East, VIC'],
      1050000, 1400000, '4+', 'House', 400,
      'hot', 'Follow-up', 'Ready now',
      NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour',
      'Finance ready. Strong preference for Chinese school catchment.',
      NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'
    ),

    -- WARM BUYERS (20)
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Sophie Anderson', '0468 890 123', 'sophie.anderson@email.com',
      ARRAY['Footscray, VIC', 'Yarraville, VIC', 'Seddon, VIC'],
      750000, 950000, '2+', 'House', NULL,
      'warm', 'Active', '1–3 months',
      NOW() - INTERVAL '1 week', NOW() + INTERVAL '10 days',
      'First home buyer. Saving for deposit. Pre-approval in progress.',
      NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '1 week'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Michael & Tracey Burns', '0479 901 234', 'michael.burns@email.com',
      ARRAY['Indooroopilly, QLD', 'Fig Tree Pocket, QLD', 'Kenmore, QLD'],
      800000, 1100000, '4+', 'House', 600,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '5 days', NULL,
      'Selling interstate property first. Expect funds in 3 months.',
      NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '5 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Isabelle Fontaine', '0490 012 345', 'i.fontaine@email.com',
      ARRAY['St Kilda, VIC', 'Elwood, VIC', 'Port Melbourne, VIC'],
      1000000, 1350000, '2+', 'Apartment/Unit', NULL,
      'warm', 'Follow-up', '1–3 months',
      NOW() - INTERVAL '6 days', NOW() + INTERVAL '14 days',
      'Wants lock-up-and-leave. Travels frequently for work.',
      NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '6 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Grant & Helen Murray', '0401 123 456', 'grant.murray@email.com',
      ARRAY['Balwyn, VIC', 'Kew, VIC', 'Canterbury, VIC'],
      2200000, 3500000, '4+', 'House', 700,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '4 days', NOW() + INTERVAL '7 days',
      'Upsizing. Currently in Balwyn North. Period home preferred.',
      NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '4 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Daniel Tremblay', '0412 234 567', 'd.tremblay@email.com',
      ARRAY['Pyrmont, NSW', 'Ultimo, NSW', 'Glebe, NSW'],
      900000, 1200000, '2+', 'Apartment/Unit', NULL,
      'warm', 'New Lead', '3–6 months',
      NULL, NULL,
      'Relocating from Melbourne. Wants inner west lifestyle.',
      NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Courtney & Liam Walsh', '0423 345 678', 'courtney.walsh@email.com',
      ARRAY['Penrith, NSW', 'Werrington, NSW', 'Kingswood, NSW'],
      550000, 750000, '3+', 'House', 400,
      'warm', 'Active', '1–3 months',
      NOW() - INTERVAL '8 days', NOW() + INTERVAL '5 days',
      'First home buyers. Deposit saved. Need 4km to Penrith station.',
      NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '8 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Steven Park', '0434 456 789', 's.park@email.com',
      ARRAY['Docklands, VIC', 'Southbank, VIC', 'Melbourne CBD, VIC'],
      550000, 750000, '1+', 'Apartment/Unit', NULL,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '10 days', NULL,
      'Investment property. Wants new build for depreciation.',
      NOW() - INTERVAL '4 weeks', NOW() - INTERVAL '10 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Natalie & Chris Thompson', '0445 567 890', 'natalie.thompson@email.com',
      ARRAY['Pymble, NSW', 'Turramurra, NSW', 'Wahroonga, NSW'],
      1600000, 2200000, '4+', 'House', 800,
      'warm', 'Follow-up', '3–6 months',
      NOW() - INTERVAL '7 days', NOW() + INTERVAL '21 days',
      'Want acreage feel but close to city. UTS school zone a bonus.',
      NOW() - INTERVAL '5 weeks', NOW() - INTERVAL '7 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Hamish McGregor', '0456 678 901', 'hamish.mcgregor@email.com',
      ARRAY['Toowong, QLD', 'Auchenflower, QLD', 'St Lucia, QLD'],
      700000, 950000, '3+', 'Townhouse', NULL,
      'warm', 'Active', '1–3 months',
      NOW() - INTERVAL '3 days', NULL,
      'Starting UQ next year. Parent buying for son to live in.',
      NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '3 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Alexandra Reed', '0467 789 012', 'alex.reed@email.com',
      ARRAY['Balmain, NSW', 'Rozelle, NSW', 'Leichhardt, NSW'],
      1100000, 1500000, '2+', 'House', NULL,
      'warm', 'Active', '1–3 months',
      NOW() - INTERVAL '9 days', NOW() + INTERVAL '12 days',
      'Single buyer. Lawyer. Wants character home close to ferry.',
      NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '9 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Wei & Hong Liu', '0478 890 123', 'wei.liu@email.com',
      ARRAY['Strathfield, NSW', 'Burwood, NSW', 'Homebush, NSW'],
      1400000, 1900000, '4+', 'House', 500,
      'warm', 'Follow-up', '3–6 months',
      NOW() - INTERVAL '2 weeks', NULL,
      'Extended family. Needs granny flat potential. Chinese school zone.',
      NOW() - INTERVAL '7 weeks', NOW() - INTERVAL '2 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Patrick & Siobhan Kelly', '0489 901 234', 'patrick.kelly@email.com',
      ARRAY['Ringwood, VIC', 'Croydon, VIC', 'Warranwood, VIC'],
      800000, 1050000, '4+', 'House', 600,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days',
      'Want good state school zone. Building inspections done elsewhere.',
      NOW() - INTERVAL '4 weeks', NOW() - INTERVAL '5 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Lucinda Tran', '0490 012 345', 'lucinda.tran@gmail.com',
      ARRAY['Sunshine, VIC', 'St Albans, VIC', 'Albion, VIC'],
      500000, 680000, '3+', 'House', 300,
      'warm', 'New Lead', '3–6 months',
      NULL, NULL,
      'New referral from Marcus Webb. First inquiry last week.',
      NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Andrew & Kim Fraser', '0401 123 456', 'andrew.fraser@email.com',
      ARRAY['Varsity Lakes, QLD', 'Burleigh Heads, QLD', 'Robina, QLD'],
      700000, 1000000, '3+', 'House', 400,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '11 days', NULL,
      'Retiring to Gold Coast. Selling Sydney home first.',
      NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '11 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Deepak Mehta', '0412 345 678', 'deepak.mehta@email.com',
      ARRAY['Rouse Hill, NSW', 'Kellyville, NSW', 'Beaumont Hills, NSW'],
      1100000, 1500000, '4+', 'House', 500,
      'warm', 'Active', '1–3 months',
      NOW() - INTERVAL '4 days', NOW() + INTERVAL '8 days',
      'Pre-approval pending. School catchment critical.',
      NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '4 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Carmen & Diego Reyes', '0423 456 789', 'carmen.reyes@email.com',
      ARRAY['Springvale, VIC', 'Noble Park, VIC', 'Dandenong, VIC'],
      600000, 800000, '3+', 'House', 350,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '6 days', NULL,
      'Just arrived from Spain. Needs bilingual school nearby.',
      NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '6 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Matt & Jess Oconnor', '0434 567 890', 'matt.oconnor@email.com',
      ARRAY['Mount Waverley, VIC', 'Glen Waverley, VIC', 'Wheelers Hill, VIC'],
      950000, 1250000, '3+', 'House', 450,
      'warm', 'Follow-up', '3–6 months',
      NOW() - INTERVAL '8 days', NOW() + INTERVAL '15 days',
      'School zone for GWSC. Pre-approval done. Missed one auction.',
      NOW() - INTERVAL '5 weeks', NOW() - INTERVAL '8 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Yuki Tanaka', '0445 678 901', 'yuki.tanaka@email.com',
      ARRAY['Neutral Bay, NSW', 'Cremorne, NSW', 'Kirribilli, NSW'],
      1300000, 1800000, '2+', 'Apartment/Unit', NULL,
      'warm', 'Active', '1–3 months',
      NOW() - INTERVAL '5 days', NULL,
      'Japanese expat. Corporate relocation. Short settlement preferred.',
      NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '5 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Brendan Cassidy', '0456 789 012', 'brendan.cassidy@email.com',
      ARRAY['Geelong, VIC', 'Newtown, VIC', 'Highton, VIC'],
      500000, 700000, '3+', 'House', 400,
      'warm', 'Active', '3–6 months',
      NOW() - INTERVAL '12 days', NULL,
      'Sea change from Melbourne. Working from home permanently.',
      NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '12 days'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Alicia & Marc Dupont', '0467 890 123', 'alicia.dupont@email.com',
      ARRAY['Kelvin Grove, QLD', 'Red Hill, QLD', 'Ashgrove, QLD'],
      850000, 1150000, '3+', 'Townhouse', NULL,
      'warm', 'Follow-up', '3–6 months',
      NOW() - INTERVAL '9 days', NOW() + INTERVAL '18 days',
      'French expats. Settling in Brisbane long term.',
      NOW() - INTERVAL '4 weeks', NOW() - INTERVAL '9 days'
    ),

    -- COLD BUYERS (15)
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Robert & Susan Blackwell', '0478 901 234', 'robert.blackwell@email.com',
      ARRAY['Templestowe, VIC', 'Eltham, VIC', 'Research, VIC'],
      1400000, 2000000, '4+', 'House', 700,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '3 weeks', NULL,
      'Waiting on property market to stabilise. Not urgent.',
      NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Joanna Petrov', '0489 012 345', 'j.petrov@email.com',
      ARRAY['Richmond, VIC', 'Cremorne, VIC', 'Prahran, VIC'],
      800000, 1100000, '2+', 'Apartment/Unit', NULL,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '1 month', NULL,
      'Paused search. Possible interstate move for work.',
      NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 month'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Thomas & Mary O''Sullivan', '0490 123 456', 'thomas.osullivan@email.com',
      ARRAY['Caringbah, NSW', 'Miranda, NSW', 'Sutherland, NSW'],
      900000, 1300000, '4+', 'House', 500,
      'cold', 'On Hold', '12+ months',
      NOW() - INTERVAL '5 weeks', NULL,
      'Waiting for stamp duty changes. Will reconsider next year.',
      NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Kevin & Diana Lam', '0401 234 567', 'kevin.lam@email.com',
      ARRAY['Docklands, VIC', 'West Melbourne, VIC', 'North Melbourne, VIC'],
      480000, 650000, '2+', 'Apartment/Unit', NULL,
      'cold', 'Lost', '12+ months',
      NOW() - INTERVAL '6 weeks', NULL,
      'Bought elsewhere. Keep in database for referrals.',
      NOW() - INTERVAL '5 months', NOW() - INTERVAL '6 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Paula Ferreira', '0412 345 678', 'paula.ferreira@email.com',
      ARRAY['Parramatta, NSW', 'Harris Park, NSW', 'Westmead, NSW'],
      700000, 900000, '3+', 'Townhouse', NULL,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '3 weeks', NULL,
      'Saving more deposit. Finance denied previously.',
      NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Sam & Ellie Worthington', '0423 456 789', 'sam.worthington@email.com',
      ARRAY['Mornington, VIC', 'Mount Martha, VIC', 'Rosebud, VIC'],
      900000, 1300000, '3+', 'House', 700,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '4 weeks', NULL,
      'Lifestyle buyer. Not actively searching. Occasional interest.',
      NOW() - INTERVAL '4 months', NOW() - INTERVAL '4 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Nina Volkov', '0434 567 890', 'nina.volkov@email.com',
      ARRAY['St Lucia, QLD', 'Taringa, QLD', 'Indooroopilly, QLD'],
      600000, 800000, '2+', 'Apartment/Unit', NULL,
      'cold', 'On Hold', '12+ months',
      NOW() - INTERVAL '2 months', NULL,
      'PhD student. Will reconsider after graduation next year.',
      NOW() - INTERVAL '5 months', NOW() - INTERVAL '2 months'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Harold & Betty Sinclair', '0445 678 901', 'harold.sinclair@email.com',
      ARRAY['Mosman, NSW', 'Cremorne Point, NSW', 'Neutral Bay, NSW'],
      3000000, 5000000, '4+', 'House', NULL,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '6 weeks', NULL,
      'Estate sale proceeds. Timeline dependent on probate process.',
      NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Connor Fitzgerald', '0456 789 012', 'connor.fitz@email.com',
      ARRAY['Footscray, VIC', 'Braybrook, VIC', 'Maidstone, VIC'],
      580000, 750000, '2+', 'House', NULL,
      'cold', 'New Lead', '12+ months',
      NULL, NULL,
      'Came in via open home. Early stages, just looking.',
      NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Stephanie & Aaron Wright', '0467 890 123', 'stephanie.wright@email.com',
      ARRAY['Caulfield, VIC', 'Carnegie, VIC', 'Bentleigh, VIC'],
      1200000, 1700000, '3+', 'House', 400,
      'cold', 'On Hold', '12+ months',
      NOW() - INTERVAL '7 weeks', NULL,
      'Budget stretched. Reviewing finances. No decision soon.',
      NOW() - INTERVAL '7 months', NOW() - INTERVAL '7 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Ivan & Marta Sokolov', '0478 901 234', 'ivan.sokolov@email.com',
      ARRAY['Berwick, VIC', 'Beaconsfield, VIC', 'Officer, VIC'],
      650000, 850000, '4+', 'House', 500,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '5 weeks', NULL,
      'Land package fell through. Regrouping strategy.',
      NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Elise Girard', '0489 012 345', 'elise.girard@email.com',
      ARRAY['Bondi Junction, NSW', 'Randwick, NSW', 'Kensington, NSW'],
      1000000, 1400000, '2+', 'Apartment/Unit', NULL,
      'cold', 'Lost', '12+ months',
      NOW() - INTERVAL '8 weeks', NULL,
      'Purchased in Randwick. Keep for future investor referrals.',
      NOW() - INTERVAL '8 months', NOW() - INTERVAL '8 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Bruce & Wendy Hamilton', '0490 123 456', 'bruce.hamilton@email.com',
      ARRAY['Sunshine Coast, QLD', 'Noosa, QLD', 'Buderim, QLD'],
      1100000, 1800000, '3+', 'House', 600,
      'cold', 'On Hold', '12+ months',
      NOW() - INTERVAL '2 months', NULL,
      'Downsizing. Current home not listed yet. Long horizon.',
      NOW() - INTERVAL '9 months', NOW() - INTERVAL '2 months'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Angela Kim', '0401 234 567', 'angela.kim@email.com',
      ARRAY['Hurstville, NSW', 'Penshurst, NSW', 'Beverly Hills, NSW'],
      800000, 1100000, '3+', 'House', 350,
      'cold', 'On Hold', '6–12 months',
      NOW() - INTERVAL '4 weeks', NULL,
      'Rental lease until December. Will review budget then.',
      NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 weeks'
    ),
    (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Tony & Grace Moretti', '0412 345 679', 'tony.moretti@email.com',
      ARRAY['Carlton, VIC', 'Fitzroy North, VIC', 'Princes Hill, VIC'],
      1300000, 1800000, '3+', 'House', NULL,
      'cold', 'On Hold', '12+ months',
      NOW() - INTERVAL '3 months', NULL,
      'Inherited property situation. Legal complications. Not ready.',
      NOW() - INTERVAL '1 year', NOW() - INTERVAL '3 months'
    );

  END IF;
END $$;
