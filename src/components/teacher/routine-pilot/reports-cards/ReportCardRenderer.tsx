/**
 * Dispatcher — picks the right card for a given report_data event.
 */
import ReportSummaryCard, { type ReportSummaryData } from "./ReportSummaryCard";
import ExamResultCard, { type ExamResultData } from "./ExamResultCard";
import StudentListCard, { type StudentListData } from "./StudentListCard";
import ChapterHealthCard, { type ChapterHealthData } from "./ChapterHealthCard";
import RecentExamsCard, { type RecentExamsData } from "./RecentExamsCard";
import StudentProfileCard, { type StudentProfileData } from "./StudentProfileCard";
import StudentCompareCard, { type StudentCompareData } from "./StudentCompareCard";
import ChapterDeepDiveCard, { type ChapterDeepDiveData } from "./ChapterDeepDiveCard";
import TopicCard, { type TopicAnalysisData } from "./TopicCard";
import DifficultyMixCard, { type DifficultyMixData } from "./DifficultyMixCard";
import QuestionAnalysisCard, { type QuestionAnalysisData } from "./QuestionAnalysisCard";
import ExamCompareCard, { type ExamCompareData } from "./ExamCompareCard";
import TodaysFocusCard, { type TodaysFocusData } from "./TodaysFocusCard";
import ActionableInsightsCard, { type ActionableInsightsData } from "./ActionableInsightsCard";
import MultiSubjectRiskCard, { type MultiSubjectRiskData } from "./MultiSubjectRiskCard";

export type ReportDataEvent =
  | { kind: "batch_overview"; payload: ReportSummaryData }
  | { kind: "exam_analysis"; payload: ExamResultData }
  | { kind: "recent_exams"; payload: RecentExamsData }
  | { kind: "chapter_health"; payload: ChapterHealthData }
  | { kind: "at_risk_students"; payload: StudentListData }
  | { kind: "top_performers"; payload: StudentListData }
  | { kind: "student_profile"; payload: StudentProfileData }
  | { kind: "student_compare"; payload: StudentCompareData }
  | { kind: "chapter_deep_dive"; payload: ChapterDeepDiveData }
  | { kind: "topic_analysis"; payload: TopicAnalysisData }
  | { kind: "difficulty_mix"; payload: DifficultyMixData }
  | { kind: "question_analysis"; payload: QuestionAnalysisData }
  | { kind: "exam_compare"; payload: ExamCompareData }
  | { kind: "todays_focus"; payload: TodaysFocusData }
  | { kind: "actionable_insights"; payload: ActionableInsightsData }
  | { kind: "multi_subject_risk"; payload: MultiSubjectRiskData };

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
    case "student_profile":
      return <StudentProfileCard data={event.payload} />;
    case "student_compare":
      return <StudentCompareCard data={event.payload} />;
    case "chapter_deep_dive":
      return <ChapterDeepDiveCard data={event.payload} />;
    case "topic_analysis":
      return <TopicCard data={event.payload} />;
    case "difficulty_mix":
      return <DifficultyMixCard data={event.payload} />;
    case "question_analysis":
      return <QuestionAnalysisCard data={event.payload} />;
    case "exam_compare":
      return <ExamCompareCard data={event.payload} />;
    case "todays_focus":
      return <TodaysFocusCard data={event.payload} />;
    case "actionable_insights":
      return <ActionableInsightsCard data={event.payload} />;
    case "multi_subject_risk":
      return <MultiSubjectRiskCard data={event.payload} />;
    default:
      return null;
  }
}
