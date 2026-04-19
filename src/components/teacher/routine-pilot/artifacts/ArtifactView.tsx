import type { Artifact, Batch } from "../types";
import LessonPlanView from "./LessonPlanView";
import PptView from "./PptView";
import TestView from "./TestView";
import HomeworkView from "./HomeworkView";
import BandedHomeworkView from "./BandedHomeworkView";
import ScheduleView from "./ScheduleView";

interface Props {
  artifact: Artifact;
  batch?: Batch | null;
}

export default function ArtifactView({ artifact, batch }: Props) {
  switch (artifact.type) {
    case "lesson_plan":
      return <LessonPlanView content={artifact.content} />;
    case "ppt":
      return <PptView content={artifact.content} />;
    case "test":
      return (
        <TestView
          content={artifact.content}
          artifactId={artifact.id}
          artifactTitle={artifact.title}
          batchId={artifact.batch_id}
          batchSubject={batch?.subject}
        />
      );
    case "homework":
      return <HomeworkView content={artifact.content} />;
    case "banded_homework":
      return <BandedHomeworkView content={artifact.content} />;
    case "schedule":
      return <ScheduleView content={artifact.content} />;
    default:
      return <pre className="text-xs bg-muted p-3 rounded">{JSON.stringify(artifact.content, null, 2)}</pre>;
  }
}
