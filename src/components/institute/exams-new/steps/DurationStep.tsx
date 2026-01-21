import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { formatDuration } from "@/data/examPatternsData";

interface DurationStepProps {
  totalDuration: number;
  setTotalDuration: (duration: number) => void;
  hasSectionWiseTime: boolean;
  setHasSectionWiseTime: (value: boolean) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const durationPresets = [30, 45, 60, 90, 120, 180, 200];

export function DurationStep({
  totalDuration,
  setTotalDuration,
  hasSectionWiseTime,
  setHasSectionWiseTime,
  canProceed,
  onNext,
  onBack,
}: DurationStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Duration & Timing</h2>
        <p className="text-sm text-muted-foreground">
          Set the total exam duration and timing rules
        </p>
      </div>

      {/* Total Duration */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{formatDuration(totalDuration)}</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <Label>Adjust Duration (10 - 240 minutes)</Label>
            <Slider
              value={[totalDuration]}
              onValueChange={([value]) => setTotalDuration(value)}
              min={10}
              max={240}
              step={5}
              className="w-full"
            />
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Select</Label>
            <div className="flex flex-wrap gap-2">
              {durationPresets.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={totalDuration === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTotalDuration(preset)}
                  className="min-w-[70px] h-10 sm:h-9"
                >
                  {formatDuration(preset)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section-wise Time */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="section-time" className="text-base">Section-wise Time Limits</Label>
              <p className="text-sm text-muted-foreground">
                Allow individual time limits for each section
              </p>
            </div>
            <Switch
              id="section-time"
              checked={hasSectionWiseTime}
              onCheckedChange={setHasSectionWiseTime}
            />
          </div>

          {hasSectionWiseTime && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                You can set individual time limits for each section in the next step. 
                The sum of section times doesn't need to equal the total duration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <div className="p-4 rounded-lg bg-muted/50 border">
        <h4 className="font-medium text-sm mb-1">💡 Duration Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• JEE Main/Advanced typically uses 180 minutes (3 hours)</li>
          <li>• NEET uses 200 minutes (3 hours 20 minutes)</li>
          <li>• Quick weekly tests are usually 30-60 minutes</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t pb-20 sm:pb-0">
        <Button variant="outline" onClick={onBack} className="h-11 sm:h-10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="h-11 sm:h-10">
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
