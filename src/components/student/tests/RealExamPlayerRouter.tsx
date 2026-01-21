// Real Exam Player Router
// Routes to the appropriate real exam UI based on the UI ID

import { memo } from "react";
import { JEEMainPlayer, JEEAdvancedPlayer, NEETPlayer } from "./real-exam-players";

interface RealExamPlayerRouterProps {
  realExamUIId: string;
  testId: string;
}

export const RealExamPlayerRouter = memo(function RealExamPlayerRouter({
  realExamUIId,
  testId,
}: RealExamPlayerRouterProps) {
  switch (realExamUIId) {
    case "jee-main-nta":
      return <JEEMainPlayer testId={testId} />;
    case "jee-advanced-iit":
      return <JEEAdvancedPlayer testId={testId} />;
    case "neet-nta":
      return <NEETPlayer testId={testId} />;
    default:
      // Fallback - should not happen in production
      console.warn(`Unknown realExamUIId: ${realExamUIId}. Falling back to standard player.`);
      return null;
  }
});
