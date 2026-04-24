/**
 * Feature flags for the teacher portal.
 *
 * `hasCopilot` gates all premium AI surfaces on the Teacher Dashboard:
 *   - Smart Nudges row
 *   - Inline "Generate with AI ✨" buttons on ClassCard
 *   - Recent Copilot Artifacts sidebar card
 *   - Floating Copilot launcher (already independently mounted)
 *
 * For now this is a hardcoded constant for demo purposes. When tier
 * management is wired up (see mem://technical/tier-management-status),
 * replace this with a hook reading the teacher's tier from the backend.
 */
export const TEACHER_FEATURES = {
  hasCopilot: true,
} as const;

export function useTeacherFeatures() {
  // Stable reference, ready to swap for a real tier-based hook later.
  return TEACHER_FEATURES;
}