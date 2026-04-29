@AGENTS.md
This is BuyerPocket — a buyer list and reminder tool for independent Australian real estate agents.

Tech stack:
- Next.js 15 App Router, TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + RLS)
- Stripe Billing
- Firebase Cloud Messaging (push notifications only)
- Resend (email)
- Vercel hosting
- PostHog analytics

Hard rules:
1. Australian English in all UI copy (organise, colour, recognise, capitalise)
2. AUD currency, AU date format (Sat 3 May 2026), 12-hour time with am/pm
3. Use design tokens from tailwind.config — never hard-code hex values in components
4. All database tables must have RLS enabled with user_id = auth.uid() policies
5. Never write a query that doesn't filter by user_id
6. Never expose service role key to client; use it only in server actions/API routes
7. Use server actions for mutations, not API routes (except for webhooks and cron)
8. Forms: validate on server in addition to client
9. The eligibility check screen at signup is non-negotiable — do not skip or simplify
10. Copy comes from the copy document — never paraphrase or "improve" copy
11. Touch targets minimum 48px height
12. Body text minimum 14px
13. Stripe webhooks must verify signature
14. Never log full buyer data; log only IDs and operation type
15. Errors visible to users must be plain English, not technical

When uncertain, ask before assuming.
Reference documents (always check these before writing UI code):
- ./copy.md — exact text for every screen and component. Use copy verbatim, never paraphrase.
- ./design.md — design tokens, component specs, spacing, colors, typography.

When building any UI:
1. Read the relevant section of copy.md for text
2. Read design.md for visual decisions
3. Use the Stitch designs I attach for layout reference only

If text needed for a UI element isn't in copy.md, ask me before inventing it. Never write marketing-style copy or generic SaaS phrases.