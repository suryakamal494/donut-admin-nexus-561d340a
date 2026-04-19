import type { Artifact, Batch } from "../types";
import LessonPlanView from "./LessonPlanView";
import PptView from "./PptView";
import TestView from "./TestView";
import HomeworkView from "./HomeworkView";
import BandedHomeworkView from "./BandedHomeworkView";
import ScheduleView from "./ScheduleView";
import ArtifactRefineComposer from "./ArtifactRefineComposer";

interface Props {
  artifact: Artifact;
  batch?: Batch | null;
  routineKey?: string;
}

export default function ArtifactView({ artifact, batch, routineKey }: Props) {
  const refineable =
    artifact.type === "test" ||
    artifact.type === "lesson_plan" ||
    artifact.type === "ppt" ||
    artifact.type === "banded_homework";

  const inner = (() => {
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
        return (
          <pre className="text-xs bg-muted p-3 rounded">
            {JSON.stringify(artifact.content, null, 2)}
          </pre>
        );
    }
  })();

  return (
    <div>
      {inner}
      {refineable && routineKey && (
        <ArtifactRefineComposer
          artifactId={artifact.id}
          artifactType={artifact.type as any}
          batchId={artifact.batch_id}
          threadId={(artifact as any).thread_id ?? null}
          routineKey={routineKey}
        />
      )}
    </div>
  );
}
