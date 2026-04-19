import { Badge } from "@/components/ui/badge";

export default function HomeworkView({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs">
        <Badge variant="outline">Due in {content.due_in_days} days</Badge>
      </div>
      {content.instructions && <p className="text-sm text-muted-foreground">{content.instructions}</p>}
      <ol className="space-y-2 list-decimal pl-5">
        {(content.problems ?? []).map((p: any, i: number) => (
          <li key={i} className="text-sm">
            <div>{p.prompt}</div>
            {p.hint && <div className="text-xs text-muted-foreground italic mt-0.5">Hint: {p.hint}</div>}
          </li>
        ))}
      </ol>
    </div>
  );
}
