
-- ============ TABLES ============

CREATE TABLE public.rp_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.rp_routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  default_system_prompt TEXT,
  quick_start_chips TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.rp_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.rp_batches(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES public.rp_routines(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rp_threads_batch_routine ON public.rp_threads(batch_id, routine_id);

CREATE TABLE public.rp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.rp_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system','tool')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rp_messages_thread ON public.rp_messages(thread_id, created_at);

CREATE TABLE public.rp_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.rp_batches(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.rp_threads(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('lesson_plan','test','homework','banded_homework','ppt','report','schedule')),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rp_artifacts_batch ON public.rp_artifacts(batch_id, created_at DESC);
CREATE INDEX idx_rp_artifacts_thread ON public.rp_artifacts(thread_id);

-- ============ RLS ============

ALTER TABLE public.rp_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rp_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rp_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rp_artifacts ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['rp_batches','rp_routines','rp_threads','rp_messages','rp_artifacts']) LOOP
    EXECUTE format('CREATE POLICY "rp_public_select_%s" ON public.%I FOR SELECT USING (true)', t, t);
    EXECUTE format('CREATE POLICY "rp_public_insert_%s" ON public.%I FOR INSERT WITH CHECK (true)', t, t);
    EXECUTE format('CREATE POLICY "rp_public_update_%s" ON public.%I FOR UPDATE USING (true)', t, t);
    EXECUTE format('CREATE POLICY "rp_public_delete_%s" ON public.%I FOR DELETE USING (true)', t, t);
  END LOOP;
END $$;

-- ============ SEED: ROUTINES ============

INSERT INTO public.rp_routines (key, label, icon, description, default_system_prompt, quick_start_chips, is_active, sort_order) VALUES
('lesson_prep', 'Lesson Prep', 'BookOpen',
  'Plan lessons, create slide decks, suggest activities.',
  'You help teachers prepare lessons. Prefer create_lesson_plan. If the user asks for a slide deck, PPT, or slides, use create_ppt with 8-10 slides: Title, Objectives, Concept, Examples, Activity, Recap, Homework. Keep content age-appropriate to the batch grade.',
  ARRAY['Plan a 45-min lesson on ____','Create slide deck for ____','Suggest activities for ____'],
  true, 1),
('test_creation', 'Test Creation', 'FileText',
  'Build mixed-format tests with marks distribution.',
  'You help teachers create tests. Use create_test with a mix of MCQ + short + long answer questions adding up to the requested marks. Each question must include marks. Provide answers for MCQs.',
  ARRAY['Create a 20-mark test on ____','Generate 10 MCQs on ____','Add a long-answer question on ____'],
  true, 2),
('homework', 'Homework', 'PencilLine',
  'Differentiated banded homework with scheduling.',
  'You help teachers create differentiated homework. ALWAYS prefer create_banded_homework over create_homework. Produce 4 bands (mastery_ready, stable_progress, reinforcement, foundational_risk) with ~5 problems each, calibrated by difficulty. If the user says send/schedule at <time>, call schedule_homework instead.',
  ARRAY['Generate banded homework on ____','Send the homework at 6 PM today','Add 2 more problems for Foundational Risk band','Schedule for tomorrow 9 AM'],
  true, 3),
('syllabus_tracker', 'Syllabus Tracker', 'TrendingUp', 'Track chapter completion across batches.', NULL, ARRAY[]::TEXT[], false, 4),
('analysis', 'Analysis', 'BarChart3', 'Deep-dive into student performance.', NULL, ARRAY[]::TEXT[], false, 5),
('reports', 'Reports', 'ClipboardCheck', 'Auto-generated batch and student reports.', NULL, ARRAY[]::TEXT[], false, 6);

-- ============ SEED: BATCHES ============

INSERT INTO public.rp_batches (id, name, subject, grade, section) VALUES
('11111111-1111-1111-1111-111111111101', 'Class 9-A', 'Science', '9', 'A'),
('11111111-1111-1111-1111-111111111102', 'Class 10-A', 'Science', '10', 'A'),
('11111111-1111-1111-1111-111111111103', 'Class 10-B', 'Science', '10', 'B'),
('11111111-1111-1111-1111-111111111104', 'Class 11-B', 'Physics', '11', 'B');

-- ============ SEED: THREADS + MESSAGES + ARTIFACTS ============

DO $$
DECLARE
  b RECORD;
  r_lesson UUID;
  r_test UUID;
  r_hw UUID;
  thread_id UUID;
  topic_lesson TEXT;
  topic_test TEXT;
  topic_hw TEXT;
BEGIN
  SELECT id INTO r_lesson FROM public.rp_routines WHERE key='lesson_prep';
  SELECT id INTO r_test FROM public.rp_routines WHERE key='test_creation';
  SELECT id INTO r_hw FROM public.rp_routines WHERE key='homework';

  FOR b IN SELECT * FROM public.rp_batches LOOP
    -- pick topics
    IF b.grade = '11' THEN
      topic_lesson := 'Kinematics — Equations of Motion';
      topic_test := 'Kinematics';
      topic_hw := 'Projectile Motion';
    ELSIF b.grade = '10' THEN
      topic_lesson := 'Light — Reflection and Refraction';
      topic_test := 'Acids, Bases and Salts';
      topic_hw := 'Chemical Reactions';
    ELSE
      topic_lesson := 'The Fundamental Unit of Life — Cells';
      topic_test := 'Motion';
      topic_hw := 'Tissues';
    END IF;

    -- ===== LESSON PREP THREAD + PPT ARTIFACT =====
    INSERT INTO public.rp_threads (batch_id, routine_id, title)
    VALUES (b.id, r_lesson, 'Slide deck: ' || topic_lesson)
    RETURNING id INTO thread_id;

    INSERT INTO public.rp_messages (thread_id, role, content) VALUES
    (thread_id, 'user', 'Create a slide deck for ' || topic_lesson),
    (thread_id, 'assistant', 'Here is an 8-slide deck on ' || topic_lesson || '. Open it in the right pane to review.');

    INSERT INTO public.rp_artifacts (batch_id, thread_id, type, title, content) VALUES
    (b.id, thread_id, 'ppt', topic_lesson || ' — Slide Deck', jsonb_build_object(
      'topic', topic_lesson,
      'total_slides', 8,
      'duration_minutes', 45,
      'slides', jsonb_build_array(
        jsonb_build_object('title', topic_lesson, 'bullets', jsonb_build_array('Grade ' || b.grade || ' • ' || b.subject, 'Duration: 45 minutes', 'Teacher: Ms. Sharma'), 'speaker_notes', 'Welcome students. Set the agenda for the lesson.'),
        jsonb_build_object('title', 'Learning Objectives', 'bullets', jsonb_build_array('Define the core concept', 'Identify real-world examples', 'Apply formulas to numerical problems', 'Analyze a worked example'), 'speaker_notes', 'Read each objective aloud and ask one student to paraphrase.'),
        jsonb_build_object('title', 'Key Concept', 'bullets', jsonb_build_array('Definition and intuition', 'Why it matters', 'Common misconceptions'), 'speaker_notes', 'Use the board to draw the concept diagram. Take 6-7 minutes.'),
        jsonb_build_object('title', 'Worked Example 1', 'bullets', jsonb_build_array('Problem statement', 'Step-by-step solution', 'Answer with units'), 'speaker_notes', 'Walk through the solution slowly. Pause for questions.'),
        jsonb_build_object('title', 'Worked Example 2 (Harder)', 'bullets', jsonb_build_array('Multi-step problem', 'Identify what is given/asked', 'Solve with reasoning'), 'speaker_notes', 'Invite a student to attempt at the board.'),
        jsonb_build_object('title', 'Class Activity', 'bullets', jsonb_build_array('Pair work — 5 minutes', 'Each pair solves 2 problems', 'Share answers with the class'), 'speaker_notes', 'Move around the room and check progress.'),
        jsonb_build_object('title', 'Recap', 'bullets', jsonb_build_array('What we learned today', 'Key formulas', 'One question to think about'), 'speaker_notes', 'Cold-call 2 students to summarize.'),
        jsonb_build_object('title', 'Homework', 'bullets', jsonb_build_array('Solve textbook problems 1-8', 'Read next chapter intro', 'Banded practice will be sent on the app'), 'speaker_notes', 'Mention that personalized homework will arrive via the app.')
      )
    ));

    -- ===== TEST CREATION THREAD + TEST ARTIFACT =====
    INSERT INTO public.rp_threads (batch_id, routine_id, title)
    VALUES (b.id, r_test, '20-mark test: ' || topic_test)
    RETURNING id INTO thread_id;

    INSERT INTO public.rp_messages (thread_id, role, content) VALUES
    (thread_id, 'user', 'Create a 20-mark test on ' || topic_test),
    (thread_id, 'assistant', 'Generated a 20-mark test on ' || topic_test || ' with MCQs, short and long answer questions.');

    INSERT INTO public.rp_artifacts (batch_id, thread_id, type, title, content) VALUES
    (b.id, thread_id, 'test', topic_test || ' — Class Test', jsonb_build_object(
      'duration_minutes', 40,
      'total_marks', 20,
      'instructions', 'Answer all questions. Show your working for numerical problems.',
      'questions', jsonb_build_array(
        jsonb_build_object('type','mcq','prompt','Which of the following best defines ' || topic_test || '?','options', jsonb_build_array('Option A','Option B','Option C','Option D'),'answer','Option B','marks',1),
        jsonb_build_object('type','mcq','prompt','Identify the correct unit used in ' || topic_test || '.','options', jsonb_build_array('Option A','Option B','Option C','Option D'),'answer','Option A','marks',1),
        jsonb_build_object('type','mcq','prompt','Which statement is FALSE about ' || topic_test || '?','options', jsonb_build_array('Option A','Option B','Option C','Option D'),'answer','Option D','marks',1),
        jsonb_build_object('type','mcq','prompt','Choose the correct formula related to ' || topic_test || '.','options', jsonb_build_array('Option A','Option B','Option C','Option D'),'answer','Option C','marks',1),
        jsonb_build_object('type','short','prompt','State two real-world examples of ' || topic_test || '.','marks',2),
        jsonb_build_object('type','short','prompt','Differentiate between any two key terms covered in ' || topic_test || '.','marks',3),
        jsonb_build_object('type','short','prompt','Solve a basic numerical problem on ' || topic_test || '.','marks',3),
        jsonb_build_object('type','long','prompt','Explain ' || topic_test || ' in detail with diagrams and a worked example. Discuss applications.','marks',8)
      )
    ));

    -- ===== HOMEWORK THREAD + BANDED HOMEWORK ARTIFACT =====
    INSERT INTO public.rp_threads (batch_id, routine_id, title)
    VALUES (b.id, r_hw, 'Banded homework: ' || topic_hw)
    RETURNING id INTO thread_id;

    INSERT INTO public.rp_messages (thread_id, role, content) VALUES
    (thread_id, 'user', 'Generate banded homework on ' || topic_hw),
    (thread_id, 'assistant', 'Here is your differentiated homework with 4 bands. Each band is calibrated to the student group.');

    INSERT INTO public.rp_artifacts (batch_id, thread_id, type, title, content) VALUES
    (b.id, thread_id, 'banded_homework', topic_hw || ' — Banded Homework', jsonb_build_object(
      'topic', topic_hw,
      'due_date', (CURRENT_DATE + INTERVAL '2 days')::TEXT,
      'estimated_minutes_per_band', 30,
      'bands', jsonb_build_array(
        jsonb_build_object(
          'key','mastery_ready','label','Mastery Ready','student_count', 8,
          'instructions','Stretch problems. Apply concepts to unfamiliar contexts. No hints provided.',
          'estimated_minutes', 35,
          'problems', jsonb_build_array(
            jsonb_build_object('prompt','Design a real-world scenario using ' || topic_hw || ' and solve it analytically.'),
            jsonb_build_object('prompt','Compare two approaches to a multi-step ' || topic_hw || ' problem and justify the better one.'),
            jsonb_build_object('prompt','Derive a relationship and verify with sample values.'),
            jsonb_build_object('prompt','Solve a previous-year competitive question on ' || topic_hw || '.'),
            jsonb_build_object('prompt','Write a short critique of a common misconception in ' || topic_hw || '.')
          )
        ),
        jsonb_build_object(
          'key','stable_progress','label','Stable Progress','student_count', 14,
          'instructions','Standard practice. Solve all problems showing complete steps.',
          'estimated_minutes', 30,
          'problems', jsonb_build_array(
            jsonb_build_object('prompt','Solve textbook-style problem 1 on ' || topic_hw || '.'),
            jsonb_build_object('prompt','Solve textbook-style problem 2 on ' || topic_hw || '.'),
            jsonb_build_object('prompt','Apply the main formula to a 2-step word problem.'),
            jsonb_build_object('prompt','Identify given/asked and solve.'),
            jsonb_build_object('prompt','Verify your answer with a quick estimate.')
          )
        ),
        jsonb_build_object(
          'key','reinforcement','label','Reinforcement','student_count', 9,
          'instructions','Guided practice with hints. Use hints if stuck for more than 3 minutes.',
          'estimated_minutes', 30,
          'problems', jsonb_build_array(
            jsonb_build_object('prompt','Solve a basic 1-step problem on ' || topic_hw || '.','hint','Identify the formula first, then plug in values.'),
            jsonb_build_object('prompt','Convert units and solve.','hint','Convert to SI units before applying the formula.'),
            jsonb_build_object('prompt','Simple substitution problem.','hint','Write down what is given and what is asked.'),
            jsonb_build_object('prompt','Identify the correct concept among options.','hint','Eliminate clearly wrong options first.'),
            jsonb_build_object('prompt','Short reasoning question.','hint','Refer back to today''s example.')
          )
        ),
        jsonb_build_object(
          'key','foundational_risk','label','Foundational Risk','student_count', 4,
          'instructions','Scaffolded basics. Each problem includes a worked example to follow.',
          'estimated_minutes', 25,
          'problems', jsonb_build_array(
            jsonb_build_object('prompt','Define ' || topic_hw || ' in your own words (1 sentence).','hint','See worked example: definition + one example.'),
            jsonb_build_object('prompt','Match terms with definitions (3 pairs).','hint','Use the chapter glossary.'),
            jsonb_build_object('prompt','Fill-in-the-blank: 4 statements on ' || topic_hw || '.','hint','Re-read today''s slide 3.'),
            jsonb_build_object('prompt','Copy and complete the worked example shown in class.','hint','Follow each step exactly.'),
            jsonb_build_object('prompt','Draw and label one diagram related to ' || topic_hw || '.','hint','Use the textbook figure as reference.')
          )
        )
      )
    ));
  END LOOP;
END $$;

-- ===== Schedule artifact for 11-B only =====
INSERT INTO public.rp_artifacts (batch_id, thread_id, type, title, content)
SELECT
  '11111111-1111-1111-1111-111111111104',
  t.id,
  'schedule',
  'Scheduled: Projectile Motion homework',
  jsonb_build_object(
    'title','Projectile Motion — Banded Homework',
    'send_at', (CURRENT_DATE + INTERVAL '1 day' + TIME '18:00')::TEXT,
    'channel','WhatsApp + In-app',
    'bands', jsonb_build_array('mastery_ready','stable_progress','reinforcement','foundational_risk')
  )
FROM public.rp_threads t
JOIN public.rp_routines r ON r.id = t.routine_id
WHERE t.batch_id = '11111111-1111-1111-1111-111111111104'
  AND r.key = 'homework'
LIMIT 1;
