/**
 * Dispatcher — picks the right card for a given report_data event.
 */
import ReportSummaryCard, { type ReportSummaryData } from "./ReportSummaryCard";
import ExamResultCard, { type ExamResultData } from "./ExamResultCard";
import StudentListCard, { type StudentListData } from "./StudentListCard";
import ChapterHealthCard, { type ChapterHealthData } from "./ChapterHealthCard";
import RecentExamsCard, { type RecentExamsData } from "./RecentExamsCard";

export type ReportDataEvent =
  | { kind: "batch_overview"; payload: ReportSummaryData }
  | { kind: "exam_analysis"; payload: ExamResultData }
  | { kind: "recent_exams"; payload: RecentExamsData }
  | { kind: "chapter_health"; payload: ChapterHealthData }
  | { kind: "at_risk_students"; payload: StudentListData }
  | { kind: "top_performers"; payload: StudentListData };

export default function ReportCardRenderer({ event }: { event: ReportDataEvent }) {
  switch (event.kind) {
    case "batch_overview":
      return <ReportSummaryCard data={event.payload} />;
    case "exam_analysis":
      return <ExamResultCard data={event.payload} />;
    case "recent_exams":
      return <RecentExamsCard data={event.payload} />;
    case "chapter_health":
      return <ChapterHealthCard data={event.payload} />;
    case "at_risk_students":
    case "top_performers":
      return <StudentListCard data={event.payload} />;
    default:
      return null;
  }
}
