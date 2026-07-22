# Supabase backend

This folder holds the database setup for the app's backend. There is no
generated code here — it's the SQL you run once in your Supabase project.

## One-time setup

1. **Run the schema.** Open your project → **SQL Editor** → **New query**,
   paste the entire contents of [`schema.sql`](./schema.sql), and click **Run**.
   This creates the `profiles`, `reviews`, `favorites`, and `watchlist` tables,
   turns on Row Level Security, and adds the signup trigger that auto-creates a
   profile for every new user. It's safe to re-run.

2. **Turn off email confirmation** (you chose "instant login"):
   **Authentication → Sign In / Providers → Email** → toggle **Confirm email**
   *off* → Save. New sign-ups are then logged in immediately.

3. **Check the client keys** in the project's `.env` (already filled in):
   - `SUPABASE_URL` — `https://lkksfyaaouzdkgsriuel.supabase.co`
   - `SUPABASE_ANON_KEY` — the **anon/public** key (safe to ship; RLS protects data)

   After editing `.env`, restart the Expo dev server so `app.config.ts` re-reads it.

## Security notes

- The mobile app only ever uses the **anon key**. Row Level Security (the
  policies in `schema.sql`) is what actually protects your data: a signed-in
  user can only touch their own rows, and everyone can read *public* reviews and
  profiles.
- **Never** put the `service_role` key in the app or in `.env` here — it bypasses
  RLS. It's only for server-side use (the SQL editor, edge functions, admin
  scripts you run yourself).

## What lives where

| Table       | Written from            | Read from                                  |
| ----------- | ----------------------- | ------------------------------------------ |
| `profiles`  | signup trigger, Settings | Profile screen, Activity feed             |
| `reviews`   | Add-log modal           | Profile (diary/reviews), Movie detail, Activity |
| `favorites` | Movie detail heart      | Profile (favorites), Movie detail          |
| `watchlist` | Movie detail bookmark   | Profile (watchlist), Movie detail          |
