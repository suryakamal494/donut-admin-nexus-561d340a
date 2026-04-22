CREATE OR REPLACE VIEW public.student_topic_mastery AS
SELECT
  student_id,
  subject,
  topic,
  COUNT(*)::integer AS attempts,
  ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*))::integer AS accuracy,
  MAX(created_at) AS last_attempt_at,
  CASE
    WHEN ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) >= 80 THEN 'mastery_ready'
    WHEN ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) >= 65 THEN 'stable'
    WHEN ROUND(100.0 * SUM(CASE WHEN correct THEN 1 ELSE 0 END) / COUNT(*)) >= 40 THEN 'reinforcement'
    ELSE 'foundational_risk'
  END AS band
FROM public.student_attempts
WHERE subject IS NOT NULL AND topic IS NOT NULL
GROUP BY student_id, subject, topic;