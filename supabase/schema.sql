-- ============================================================
-- ProResume Builder — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

-- profiles: extends auth.users with display data
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT,
  full_name     TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- resumes: the core table
CREATE TABLE IF NOT EXISTS public.resumes (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title         TEXT        NOT NULL DEFAULT 'Untitled Resume',
  template      TEXT        NOT NULL DEFAULT 'modern'
                            CHECK (template IN ('modern','minimal','executive','creative','technical')),
  data          JSONB       NOT NULL DEFAULT '{}',
  is_public     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- resume_views: anonymous view tracking for public resumes
CREATE TABLE IF NOT EXISTS public.resume_views (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id     UUID        REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  viewed_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ip_hash       TEXT        -- hashed visitor IP for deduplication (optional)
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_resumes_user_id    ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON public.resumes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_views_resume_id    ON public.resume_views(resume_id);
CREATE INDEX IF NOT EXISTS idx_views_viewed_at    ON public.resume_views(viewed_at DESC);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_views ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Resumes: owner can do anything; anyone can view public resumes
CREATE POLICY "resumes_select_own"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "resumes_insert_own"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resumes_update_own"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "resumes_delete_own"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Views: anyone can insert (anonymous tracking); owner can read
CREATE POLICY "views_insert_anon"
  ON public.resume_views FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "views_select_owner"
  ON public.resume_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.resumes r
      WHERE r.id = resume_id AND r.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ─────────────────────────────────────────

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_resumes_updated_at ON public.resumes;
CREATE TRIGGER trg_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
