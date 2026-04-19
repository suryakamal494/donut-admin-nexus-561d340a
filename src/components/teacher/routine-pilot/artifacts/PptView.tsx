import { Badge } from "@/components/ui/badge";
import { Mic } from "lucide-react";

export default function PptView({ content }: { content: any }) {
  const slides = content.slides ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{content.total_slides ?? slides.length} slides</Badge>
        {content.duration_minutes && <Badge variant="outline">{content.duration_minutes} min</Badge>}
      </div>
      {slides.map((slide: any, i: number) => (
        <div key={i} className="rounded-lg border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>
            <div className="text-sm font-semibold">{slide.title}</div>
          </div>
          <div className="p-4 space-y-3">
            <ul className="space-y-1.5 pl-5 list-disc text-sm marker:text-muted-foreground">
              {(slide.bullets ?? []).map((b: string, j: number) => <li key={j}>{b}</li>)}
            </ul>
            {slide.speaker_notes && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  <Mic className="w-3 h-3" /> Speaker notes
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">{slide.speaker_notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
