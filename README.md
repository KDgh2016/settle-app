# Settle — UK Settlement & Visa Absence Tracker

A private travel log for any UK visa route that leads to settlement. Each person who signs
up gets their own account and their own data — nobody can see anyone else's trips, enforced
at the database level (Postgres Row Level Security), not just by the app's code.

Settle applies the actual absence rule for the person's specific route — the hard 180-day
rolling limit (Skilled Worker, Global Talent, Innovator Founder, Ancestry, the 10-year family
route), the qualitative test on the 5-year partner route, or the EU Settlement Scheme's
6/12-or-30/60 pathways — rather than treating every visa the same way.

**Stack:** React + Tailwind CSS + React Router (frontend) · Supabase Postgres + Auth (backend) · Vercel (hosting)

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier is fine).
2. Once it's created, go to **SQL Editor** → New query.
3. Paste the entire contents of `supabase/schema.sql` and click **Run**.
   This creates the `profiles` and `trips` tables and locks them down so each user can only
   ever see their own rows.
4. Go to **Settings → API**. You'll need two values from here in a minute:
   - **Project URL**
   - **anon public** key
5. (Optional, for easier testing) Go to **Authentication → Providers → Email** and turn off
   "Confirm email" so test accounts don't need an email click to activate. Turn it back on
   before sharing the app with real users, or set up a custom SMTP sender under
   **Authentication → Settings**, otherwise Supabase's shared sender has a low daily limit
   and confirmation emails can land in spam.

## 2. Run it locally

```bash
npm install
cp .env.example .env
```

Open `.env` and paste in your Project URL and anon key from step 1.4:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then:

```bash
npm run dev
```

Visit the local URL it prints. The root `/` is a public landing page — click "Get started" to
sign up and try the dashboard at `/app`.

## 3. Deploy to Vercel

1. Push this project to a GitHub repo (Vercel deploys from Git).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import that repo.
3. Vercel auto-detects Vite — leave the build settings as default.
4. Before deploying, add the two environment variables from your `.env` under
   **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. You'll get a `https://your-app.vercel.app` URL.

That URL is now the one link you send to anyone you want using the app — they land on the
public homepage, sign up with their own email, and get their own private dashboard.

## 4. Optional next steps

- **Custom domain** — add one for free under Vercel's Project Settings → Domains.
- **Email sender** — set up a custom SMTP provider in Supabase (e.g. Resend, Postmark) so
  confirmation/reset emails reliably reach real users.
- **Add to Home Screen** — once deployed, opening the URL in mobile Safari/Chrome and using
  "Add to Home Screen" gives it an app-like icon with no browser chrome.

## Visa routes currently modelled

| Route | Default qualifying period | Absence rule |
|---|---|---|
| Partner / spouse (5-year route) | 5 years | Qualitative — no fixed day cap |
| Partner / parent (10-year route) | 10 years | 180-day rolling limit, with work/study/family exceptions |
| Skilled Worker, Health & Care, Scale-up | 5 years | 180-day rolling limit |
| Global Talent | 3 years | 180-day rolling limit |
| Innovator Founder | 3 years | 180-day rolling limit |
| UK Ancestry | 5 years | 180-day rolling limit |
| 10-year long residence | 10 years | 180-day rolling limit (post-Apr 2024 alignment) |
| EU Settlement Scheme | 5 years | "6/12" or "30/60" — whichever is met |
| Other / not sure | 5 years (editable) | Not modelled — general reference only |

Each user can also override their qualifying period in years, since real cases vary (e.g.
Global Talent can be 3 or 5 years depending on endorsement type).

## Project structure

```
src/
  lib/
    routes.js          Visa route definitions: rule type, default years, icon, summary
    supabase.js         Supabase client
    dateMath.js          All absence/rolling-window/compliance calculations
  context/
    AuthContext.jsx       Tracks the signed-in user
  components/
    ProtectedRoute.jsx    Redirects to /login if signed out
    Header.jsx              App header with route badge, settings/sign-out links
    GuillochePattern.jsx    Decorative passport-style engraved-line motif
    RouteIcon.jsx            Icon per visa route (lucide-react)
    SetupForm.jsx             Visa route + dates form (first run + Settings page)
    StatsOverview.jsx          The summary cards (countdown, totals, split, compliance)
    ComplianceCard.jsx          Renders the right compliance UI per rule type
    RenewalBanner.jsx          "Your leave expires soon" banner
    TripForm.jsx                 Add/edit a trip
    TripList.jsx                  The trip history list
    AbsenceChart.jsx               Monthly bar chart
    InfoPanel.jsx                   Explanation of how absences are assessed, per route
  pages/
    Landing.jsx        Public marketing page at "/"
    Login.jsx           Sign in / sign up / password reset
    Dashboard.jsx         Main app page, at "/app"
    Settings.jsx           Edit visa route and dates
supabase/
  schema.sql          Run once in Supabase's SQL editor (includes migration notes)
```

## A note on the actual immigration rules

This tool applies the published Home Office Appendix Continuous Residence rules and the
EU Settlement Scheme's Appendix EU rules as they stood at the time of writing, plus the
distinct rules for the 5-year partner route. Several routes carry exceptions (sponsor-approved
research absences, humanitarian work, compelling personal circumstances, work/study/family
absences on the 10-year family route, "important reason" absences under EUSS) that aren't
applied automatically here — they need to be evidenced in an actual application. This isn't
legal advice; check gov.uk or an immigration adviser for your specific case.
