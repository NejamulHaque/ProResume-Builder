-- ============================================================
-- ProResume Builder — Neon PostgreSQL Database Schema
-- Includes 10-Day Auto-Delete TTL & Expiry Management
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

-- 1. users / profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT        UNIQUE NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  role          TEXT        DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. resumes table with 10-day auto-delete TTL (expires_at)
CREATE TABLE IF NOT EXISTS public.resumes (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID        REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email    TEXT,
  title         TEXT        NOT NULL DEFAULT 'Untitled Resume',
  template      TEXT        NOT NULL DEFAULT 'modern'
                            CHECK (template IN ('modern','minimal','executive','creative','technical')),
  data          JSONB       NOT NULL DEFAULT '{}',
  is_public     BOOLEAN     NOT NULL DEFAULT FALSE,
  ats_score     INTEGER     DEFAULT 0,
  pdf_downloads INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 days') NOT NULL
);

-- 3. resume_views: tracking views for analytics
CREATE TABLE IF NOT EXISTS public.resume_views (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID        REFERENCES public.resumes(id) ON DELETE CASCADE,
  viewed_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ip_hash       TEXT,
  user_agent    TEXT
);

-- 4. audit_logs: tracking admin actions and 10-day cleanup runs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  action        TEXT        NOT NULL,
  details       JSONB       DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_resumes_user_id    ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_expires_at ON public.resumes(expires_at);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON public.resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON public.resumes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_views_resume_id    ON public.resume_views(resume_id);
CREATE INDEX IF NOT EXISTS idx_views_viewed_at    ON public.resume_views(viewed_at DESC);

-- ─────────────────────────────────────────
-- 10-DAY AUTO-DELETE CLEANUP FUNCTION
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.cleanup_expired_resumes()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.resumes
  WHERE expires_at <= NOW() OR created_at <= (NOW() - INTERVAL '10 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  IF deleted_count > 0 THEN
    INSERT INTO public.audit_logs (action, details)
    VALUES ('10_day_auto_cleanup', json_build_object('deleted_resumes', deleted_count, 'executed_at', NOW()));
  END IF;
  
  RETURN deleted_count;
END;
$$;

-- ─────────────────────────────────────────
-- AUTO-UPDATE TIMESTAMPS TRIGGER
-- ─────────────────────────────────────────

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
