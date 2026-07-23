-- ============================================================================
-- Storage: profile pictures (avatars)
-- ============================================================================
-- Run this once in the Supabase SQL Editor (in addition to schema.sql). It
-- creates a public `avatars` bucket and Row Level Security policies so that:
--   • anyone can VIEW avatars (public read — needed to display them), and
--   • a signed-in user can only upload/replace/delete files inside their OWN
--     folder (`<user-id>/…`).
-- Safe to re-run.
-- ============================================================================

-- 1. Create the bucket (public so getPublicUrl() works for display).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2. Policies on storage.objects, scoped to the avatars bucket.
--    The first path segment (storage.foldername(name))[1] must equal the user id.

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
