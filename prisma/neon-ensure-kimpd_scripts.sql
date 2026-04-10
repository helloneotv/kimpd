-- Vercel의 DATABASE_URL과 동일한 Neon 브랜치에서 실행하세요.
-- 테이블 존재 확인:
--   SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename = 'kimpd_scripts';

CREATE TABLE IF NOT EXISTS kimpd_scripts (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  video_id   TEXT NOT NULL,
  scenario   TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kimpd_scripts_created_at ON kimpd_scripts (created_at DESC);
