-- 1. Extend student_copilot_threads with session-scope fields
ALTER TABLE public.student_copilot_threads
  ADD COLUMN IF NOT EXISTS tool TEXT,
  ADD COLUMN IF NOT EXISTS scope_key TEXT,
  ADD COLUMN IF NOT EXISTS scope_meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. Backfill `tool` from routine_key for existing threads
UPDATE public.student_copilot_threads
SET tool = CASE routine_key
  WHEN 's_doubt'     THEN 'doubt'
  WHEN 's_practice'  THEN 'practice'
  WHEN 's_roadmap'   THEN 'plan'
  WHEN 's_exam_prep' THEN 'exam'
  WHEN 's_progress'  THEN 'progress'
  ELSE 'doubt'
END
WHERE tool IS NULL;

-- 3. Backfill last_activity_at from last_message_at
UPDATE public.student_copilot_threads
SET last_activity_at = COALESCE(last_message_at, created_at)
WHERE last_activity_at = created_at AND last_message_at IS NOT NULL;

-- 4. Constrain status to known values
ALTER TABLE public.student_copilot_threads
  DROP CONSTRAINT IF EXISTS student_copilot_threads_status_check;
ALTER TABLE public.student_copilot_threads
  ADD CONSTRAINT student_copilot_threads_status_check
  CHECK (status IN ('active', 'recent', 'archived'));

-- 5. Router lookup index — the hot path for findActiveSession()
CREATE INDEX IF NOT EXISTS idx_threads_router_lookup
  ON public.student_copilot_threads (student_id, tool, scope_key, status);

-- 6. Secondary index for history grouping
CREATE INDEX IF NOT EXISTS idx_threads_status_activity
  ON public.student_copilot_threads (student_id, status, last_activity_at DESC);

-- 7. router_decisions table — traceability/debugging
CREATE TABLE IF NOT EXISTS public.router_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  message_preview TEXT,
  tool TEXT,
  scope_key TEXT,
  decision TEXT NOT NULL CHECK (decision IN ('matched', 'new')),
  thread_id UUID,
  confidence NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_router_decisions_student_time
  ON public.router_decisions (student_id, created_at DESC);

ALTER TABLE public.router_decisions ENABLE ROW LEVEL SECURITY;

-- Match the permissive pattern used by the rest of the copilot tables
CREATE POLICY "rd_public_select" ON public.router_decisions
  FOR SELECT USING (true);
CREATE POLICY "rd_public_insert" ON public.router_decisions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "rd_public_update" ON public.router_decisions
  FOR UPDATE USING (true);
CREATE POLICY "rd_public_delete" ON public.router_decisions
  FOR DELETE USING (true);
