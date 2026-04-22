
-- Add audience column to rp_routines so we can distinguish teacher vs student routines
ALTER TABLE public.rp_routines ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'teacher';

-- =============================================
-- Student Copilot Threads
-- =============================================
CREATE TABLE public.student_copilot_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  routine_key text NOT NULL,
  title text NOT NULL DEFAULT 'New thread',
  subject text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_copilot_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_threads" ON public.student_copilot_threads FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_threads" ON public.student_copilot_threads FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_threads" ON public.student_copilot_threads FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_threads" ON public.student_copilot_threads FOR DELETE USING (true);

-- =============================================
-- Student Copilot Messages
-- =============================================
CREATE TABLE public.student_copilot_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.student_copilot_threads(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_copilot_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_messages" ON public.student_copilot_messages FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_messages" ON public.student_copilot_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_messages" ON public.student_copilot_messages FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_messages" ON public.student_copilot_messages FOR DELETE USING (true);

-- =============================================
-- Student Copilot Artifacts
-- =============================================
CREATE TABLE public.student_copilot_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  thread_id uuid REFERENCES public.student_copilot_threads(id) ON DELETE SET NULL,
  type text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'ai',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_copilot_artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_artifacts" ON public.student_copilot_artifacts FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_artifacts" ON public.student_copilot_artifacts FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_artifacts" ON public.student_copilot_artifacts FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_artifacts" ON public.student_copilot_artifacts FOR DELETE USING (true);

-- =============================================
-- Student Attempts (practice tracking)
-- =============================================
CREATE TABLE public.student_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  thread_id uuid REFERENCES public.student_copilot_threads(id) ON DELETE SET NULL,
  artifact_id uuid REFERENCES public.student_copilot_artifacts(id) ON DELETE SET NULL,
  subject text,
  topic text,
  question_type text NOT NULL DEFAULT 'short',
  question_text text,
  expected_answer text,
  given_answer text,
  correct boolean NOT NULL DEFAULT false,
  time_seconds integer,
  source text NOT NULL DEFAULT 'practice',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_attempts" ON public.student_attempts FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_attempts" ON public.student_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_attempts" ON public.student_attempts FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_attempts" ON public.student_attempts FOR DELETE USING (true);
CREATE INDEX idx_student_attempts_student_subject ON public.student_attempts(student_id, subject);

-- =============================================
-- Student Study Tasks
-- =============================================
CREATE TABLE public.student_study_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  artifact_id uuid NOT NULL REFERENCES public.student_copilot_artifacts(id) ON DELETE CASCADE,
  day_index integer NOT NULL,
  item_index integer NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(artifact_id, day_index, item_index)
);
ALTER TABLE public.student_study_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_tasks" ON public.student_study_tasks FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_tasks" ON public.student_study_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_tasks" ON public.student_study_tasks FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_tasks" ON public.student_study_tasks FOR DELETE USING (true);

-- =============================================
-- Student Exams (target tracking)
-- =============================================
CREATE TABLE public.student_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  name text NOT NULL,
  exam_date date NOT NULL,
  target_score integer,
  max_score integer,
  notes text,
  roadmap_artifact_id uuid REFERENCES public.student_copilot_artifacts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_exams" ON public.student_exams FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_exams" ON public.student_exams FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_exams" ON public.student_exams FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_exams" ON public.student_exams FOR DELETE USING (true);

-- =============================================
-- Student Notifications
-- =============================================
CREATE TABLE public.student_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  artifact_id uuid REFERENCES public.student_copilot_artifacts(id) ON DELETE SET NULL,
  exam_id uuid REFERENCES public.student_exams(id) ON DELETE SET NULL,
  subject text,
  priority integer NOT NULL DEFAULT 0,
  dismissed boolean NOT NULL DEFAULT false,
  acted_on boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc_public_select_notifs" ON public.student_notifications FOR SELECT USING (true);
CREATE POLICY "sc_public_insert_notifs" ON public.student_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "sc_public_update_notifs" ON public.student_notifications FOR UPDATE USING (true);
CREATE POLICY "sc_public_delete_notifs" ON public.student_notifications FOR DELETE USING (true);

-- =============================================
-- Mastery View
-- =============================================
CREATE OR REPLACE VIEW public.student_topic_mastery AS
SELECT
  student_id,
  subject,
  topic,
  count(*)::int AS attempts,
  round(100.0 * count(*) FILTER (WHERE correct) / GREATEST(count(*), 1))::int AS accuracy,
  max(created_at) AS last_attempt_at,
  CASE
    WHEN round(100.0 * count(*) FILTER (WHERE correct) / GREATEST(count(*), 1)) >= 80 THEN 'mastery_ready'
    WHEN round(100.0 * count(*) FILTER (WHERE correct) / GREATEST(count(*), 1)) >= 60 THEN 'stable'
    WHEN round(100.0 * count(*) FILTER (WHERE correct) / GREATEST(count(*), 1)) >= 40 THEN 'reinforcement'
    ELSE 'foundational_risk'
  END AS band
FROM public.student_attempts
WHERE subject IS NOT NULL AND topic IS NOT NULL
GROUP BY student_id, subject, topic;
