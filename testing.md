# BuyerPocket — QA Testing Checklist

Tick each item after testing. Re-test after any related code change.

---

## 1. Marketing Site

- [ ] `/` — Homepage loads, hero copy correct, CTA buttons work
- [ ] `/features` — All feature sections render, no broken images
- [ ] `/pricing` — Pricing tiers display correctly, CTA links to signup
- [ ] `/privacy` — Full privacy policy renders
- [ ] `/terms` — Full terms render
- [ ] `/contact` — Form submits, success state shows, email arrives in inbox
- [ ] All marketing pages pass mobile viewport (375px width)
- [ ] Nav links work on all marketing pages
- [ ] Footer links work

---

## 2. Authentication — Signup

- [ ] `/signup` — Form renders with name, email, password, mobile fields
- [ ] Email already in use shows plain English error
- [ ] Weak password rejected with message
- [ ] Valid signup redirects to `/signup/eligibility`
- [ ] Google OAuth signup works, redirects correctly
- [ ] `/signup/eligibility` — Three options: Independent, Agency, Not sure
- [ ] Selecting "Independent" proceeds to `/signup/profile`
- [ ] Selecting "Agency" or "Not sure" redirects to `/signup/contact` (ineligible path)
- [ ] `/signup/profile` — State, timezone, agency name fields work
- [ ] Profile saved, redirects to `/signup/notifications`
- [ ] `/signup/notifications` — Notification preference options render
- [ ] Completing notifications redirects to `/today`
- [ ] Cannot skip eligibility check screen
- [ ] Supabase: `profiles` row created after signup

---

## 3. Authentication — Login & Password

- [ ] `/login` — Email/password login works
- [ ] Wrong credentials shows plain English error
- [ ] Google OAuth login works
- [ ] Logged-in user hitting `/login` redirects to `/today`
- [ ] `/forgot-password` — Submitting email sends reset link
- [ ] Reset email arrives with working link
- [ ] `/reset-password` — New password accepted, redirected to login
- [ ] Invalid/expired reset token shows error
- [ ] Sign out from settings clears session, redirects to `/login`

---

## 4. Auth Callback & Routing

- [ ] `/auth/callback` handles Google OAuth redirect correctly
- [ ] `/auth/callback` handles email confirmation correctly
- [ ] Recovery token redirects to `/reset-password`
- [ ] Incomplete onboarding (no profile) redirected back to correct onboarding step
- [ ] Completed onboarding goes to `/today`

---

## 5. Today Dashboard (`/today`)

- [ ] Page loads for authenticated user
- [ ] Shows today's reminders (due today)
- [ ] Shows "hot" buyers (temperature = hot)
- [ ] Empty state shows when no reminders or hot buyers
- [ ] Tapping a reminder navigates to correct buyer profile
- [ ] Completing a reminder from dashboard updates status
- [ ] BottomNav visible on mobile, all 4 tabs navigate correctly

---

## 6. Buyer Directory (`/buyers`)

- [ ] List renders with buyer cards
- [ ] Search by name/suburb works (full-text)
- [ ] Temperature filter (hot/warm/cool) works
- [ ] Suburb filter works (overlap query)
- [ ] Budget range filter works
- [ ] Bedrooms filter (1+, 2+, 3+, 4+, 5+) works
- [ ] Property type filter works
- [ ] Buying timeline filter works
- [ ] Lead status filter works
- [ ] "Reminder due" filter (today/week/overdue/none) works
- [ ] "Last contacted" filter (week/month/month+/never) works
- [ ] Sort by: last updated, last contacted, next reminder, temperature, created
- [ ] Filter sheet opens and closes correctly
- [ ] Active filter count shown on filter button
- [ ] Pagination loads more buyers on scroll
- [ ] Empty state shows when no results
- [ ] CSV export (`/api/export/buyers`) downloads correct file with all buyer data

---

## 7. Add Buyer (`/add`)

- [ ] Form renders all fields
- [ ] Required fields validated before submit
- [ ] Optional fields skippable
- [ ] Budget range min/max validated (min ≤ max)
- [ ] Suburbs field accepts multiple values
- [ ] Must-haves field accepts multiple values
- [ ] Optional reminder can be added during creation
- [ ] Buyer created in Supabase with correct `user_id`
- [ ] Redirects to buyer profile after creation
- [ ] Duplicate detection (if any) works

---

## 8. Buyer Profile (`/buyers/[id]`)

- [ ] Profile loads with all fields populated
- [ ] Edit mode — all fields editable
- [ ] Save updates Supabase row
- [ ] Archive buyer removes from directory
- [ ] Notes tab — add note (call/email/sms/in_person types)
- [ ] Edit existing note works
- [ ] Delete note works
- [ ] Notes list ordered by date desc
- [ ] Reminders tab — add reminder with date/time
- [ ] Complete reminder updates status
- [ ] Snooze reminder — picks new date/time, status → snoozed
- [ ] Delete reminder works
- [ ] `last_contacted_at` updates after note added
- [ ] `next_reminder_at` updates after reminder added/completed
- [ ] Cannot view another user's buyer (RLS enforced — 404 or redirect)

---

## 9. Reminders (`/reminders`)

- [ ] Four tabs: Today, Upcoming, Overdue, Completed
- [ ] Today tab shows only reminders due today
- [ ] Upcoming tab shows future reminders
- [ ] Overdue tab shows past-due reminders
- [ ] Completed tab shows completed reminders
- [ ] Tab counts accurate
- [ ] Complete from reminders page updates status and moves to Completed tab
- [ ] Snooze from reminders page — modal opens, new time selected, status updates
- [ ] Empty state per tab

---

## 10. Settings (`/settings`)

- [ ] Profile tab — update name, mobile, timezone saves correctly
- [ ] Notifications tab — toggle preferences save
- [ ] Billing tab — shows current plan, trial days remaining, next billing date
- [ ] "Manage billing" opens Stripe portal
- [ ] Push devices listed (if FCM registered)
- [ ] Deactivate push device removes token
- [ ] "Request account deletion" works (email sent to support)
- [ ] Sign out clears session

---

## 11. Billing & Trial

- [ ] New signup automatically gets 7-day trial subscription in Supabase
- [ ] Trial warning banner shows at 4 days remaining
- [ ] Trial warning banner shows at 1 day remaining
- [ ] Trial ended modal appears when trial expired (no payment method)
- [ ] "Upgrade" triggers `/api/billing/checkout` → Stripe checkout session
- [ ] Stripe checkout completes, webhook fires, subscription updated in DB
- [ ] `/api/billing/checkout/success` attaches payment method and retries invoice
- [ ] Past due state: app shows read-only access message
- [ ] Cancelled state (within 30 days of period end): export-only access
- [ ] Expired state: no access, upgrade prompt shown
- [ ] `BillingGuard` blocks correct routes at each access level
- [ ] Stripe portal (`/api/billing/portal`) opens correctly
- [ ] Stripe webhook validates signature (reject tampered payload)
- [ ] Subscription sync: cancel in Stripe → status updated in DB within seconds

---

## 12. Push Notifications (FCM)

- [ ] Notification permission prompt appears on `/signup/notifications`
- [ ] Accepting permission registers FCM token saved to `push_tokens` table
- [ ] Declining skips gracefully (no error)
- [ ] Push token tied to correct `user_id`
- [ ] Reminder push notification arrives at correct time
- [ ] Notification tapping opens correct buyer profile
- [ ] Invalid token deactivated after failed send (not retried)
- [ ] Multiple devices: all registered devices receive push
- [ ] `firebase-messaging-sw.js` registered correctly in browser

---

## 13. Cron — Reminder Processor (`/api/cron/process-reminders`)

- [ ] Endpoint rejects requests without correct auth header
- [ ] Snoozed reminders reactivated when snooze time passed
- [ ] Pending reminders atomically claimed (status → processing)
- [ ] FCM push sent to all user devices
- [ ] Email fallback fires when user has no active push tokens
- [ ] `next_reminder_at` on buyer updated after send
- [ ] Reminder status → `sent` after successful delivery
- [ ] No duplicate sends (atomic claim prevents race condition)
- [ ] Processes max 100 reminders per run

---

## 14. Email (Resend)

- [ ] Contact form submission sends email to support inbox
- [ ] Password reset email arrives and link works
- [ ] Reminder email fallback (when no FCM token) arrives and links to correct buyer
- [ ] Emails render correctly on mobile
- [ ] Emails not in spam (SPF/DKIM configured)

---

## 15. PWA & Offline

- [ ] Service worker registers on page load (check DevTools → Application)
- [ ] Install banner appears on Android Chrome (mobile/tablet only, not desktop)
- [ ] Install banner does NOT appear on desktop/laptop (width > 1024px)
- [ ] Tapping "Install" on Android triggers OS install prompt
- [ ] Dismissing banner hides it for session, doesn't reappear on refresh
- [ ] iOS Safari: "Add to Home Screen" banner appears with Share icon instructions
- [ ] iOS banner does NOT appear on Chrome/Firefox on iOS
- [ ] iOS banner does NOT appear on desktop
- [ ] Installed app launches in standalone mode (no browser chrome)
- [ ] Offline: navigate to `/today` with no network → `/offline` page shown
- [ ] Offline page has working "Try again" button
- [ ] Static assets load from cache on repeat visits (fast load)
- [ ] App icon appears correctly on Android home screen
- [ ] App icon appears correctly on iOS home screen
- [ ] Maskable icon displays without white border on Android
- [ ] Splash screen shows on iOS launch

---

## 16. Search & Filtering (Edge Cases)

- [ ] Search with special characters doesn't break query
- [ ] Budget filter: min-only, max-only, both set
- [ ] Suburb filter with 3+ suburbs selected
- [ ] Combining 3+ filters simultaneously returns correct results
- [ ] Clearing all filters resets to full list
- [ ] Filter state preserved on browser back
- [ ] 0 results state handled gracefully

---

## 17. Security

- [ ] Unauthenticated request to `/today` redirects to `/login`
- [ ] Unauthenticated request to `/api/export/buyers` returns 401
- [ ] User A cannot access User B's buyer (`/buyers/[id]`)
- [ ] User A cannot see User B's buyers in directory
- [ ] Service role key never exposed in client bundle (check DevTools → Sources)
- [ ] Stripe webhook rejects payload without valid signature
- [ ] Cron endpoint rejects missing/wrong auth token
- [ ] All forms validate on server (not just client-side)
- [ ] No full buyer data in server logs — only IDs and operation type

---

## 18. Internationalisation & Formatting

- [ ] All dates display in AU format: Sat 3 May 2026
- [ ] All times display in 12-hour with am/pm: 2:30pm
- [ ] Currency displays as AUD (if shown)
- [ ] Australian English spelling throughout (organise, colour, recognise)
- [ ] Timezone-aware reminders (user's selected timezone)

---

## 19. Accessibility & UI

- [ ] All buttons/touch targets minimum 48px height
- [ ] Body text minimum 14px
- [ ] No hardcoded hex colours (all from design tokens)
- [ ] Error messages plain English, no technical jargon
- [ ] Form error states clear and visible
- [ ] Loading states shown during async operations
- [ ] No layout shift on page load (CLS)

---

## 20. Performance

- [ ] Lighthouse score ≥ 90 on `/` (Performance, Accessibility, SEO)
- [ ] Lighthouse score ≥ 90 on `/today`
- [ ] First Contentful Paint < 2s on 4G
- [ ] No console errors in production build
- [ ] `next build` completes without errors or warnings
- [ ] All static pages pre-rendered (check build output)

---

## 21. Analytics (PostHog)

- [ ] PageView events fire on route change
- [ ] User identified after login (PostHog person)
- [ ] No PII (full buyer data) sent to PostHog

---

## 22. Deployment Checklist (before each release)

- [ ] `next build` passes with 0 TypeScript errors
- [ ] All env vars set in Vercel (Supabase, Stripe, FCM, Resend, PostHog)
- [ ] Stripe webhook endpoint configured in Stripe dashboard
- [ ] Cron job scheduled (Vercel Cron or external) for `/api/cron/process-reminders`
- [ ] Supabase RLS enabled on all tables
- [ ] `robots.txt` correct
- [ ] `sitemap.xml` accessible
- [ ] HTTPS enforced (Vercel default)
- [ ] Service worker version bumped if SW logic changed (`buyerpocket-v1` → `v2`)
