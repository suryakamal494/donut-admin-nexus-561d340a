import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Users, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock batches
const mockBatches = [
  { id: "batch-1", name: "JEE 2025 Batch A", students: 45 },
  { id: "batch-2", name: "JEE 2025 Batch B", students: 42 },
  { id: "batch-3", name: "NEET 2025 Morning", students: 55 },
  { id: "batch-4", name: "Class 12 - Science A", students: 38 },
  { id: "batch-5", name: "Class 12 - Science B", students: 40 },
  { id: "batch-6", name: "Class 11 - Foundation", students: 48 },
];

interface BatchAssignStepProps {
  examName: string;
  setExamName: (name: string) => void;
  selectedBatches: string[];
  toggleBatch: (batchId: string) => void;
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  isProcessing: boolean;
  onCreate: () => void;
  onBack: () => void;
}

export function BatchAssignStep({
  examName,
  setExamName,
  selectedBatches,
  toggleBatch,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  isProcessing,
  onCreate,
  onBack,
}: BatchAssignStepProps) {
  const totalStudents = mockBatches
    .filter((b) => selectedBatches.includes(b.id))
    .reduce((sum, b) => sum + b.students, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl font-semibold">Assign & Schedule</h2>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">Optional</Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Assign to batches and schedule the exam, or save as draft
        </p>
      </div>

      {/* Exam Name */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="exam-name" className="text-sm">Exam Name</Label>
        <Input
          id="exam-name"
          placeholder="Enter exam name..."
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          maxLength={100}
          className="h-9 sm:h-10"
        />
      </div>

      {/* Batch Selection */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm">Select Batches</Label>
          {selectedBatches.length > 0 && (
            <Badge variant="outline" className="gap-1 text-[10px] sm:text-xs">
              <Users className="w-3 h-3" />
              {totalStudents} students
            </Badge>
          )}
        </div>

        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {mockBatches.map((batch) => {
            const isSelected = selectedBatches.includes(batch.id);
            
            return (
              <Card
                key={batch.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                )}
                onClick={() => toggleBatch(batch.id)}
              >
                <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
                  <Checkbox checked={isSelected} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{batch.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{batch.students} students</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Schedule (only if batches selected) */}
      {selectedBatches.length > 0 && (
        <Card>
          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <Label className="text-sm">Schedule Exam (Optional)</Label>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="schedule-date" className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Date
                </Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="h-9 sm:h-10"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="schedule-time" className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Time
                </Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="h-9 sm:h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between pt-3 sm:pt-4 border-t gap-2 sm:gap-3">
        <Button variant="outline" onClick={onBack} disabled={isProcessing} className="h-9 sm:h-10 text-xs sm:text-sm">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Back
        </Button>
        <div className="flex gap-2 flex-col sm:flex-row">
          {selectedBatches.length === 0 && (
            <Button variant="outline" onClick={onCreate} disabled={isProcessing} className="h-9 sm:h-10 text-xs sm:text-sm">
              Save as Draft
            </Button>
          )}
          <Button onClick={onCreate} disabled={isProcessing} className="h-9 sm:h-10 text-xs sm:text-sm">
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {selectedBatches.length > 0 ? "Create & Assign" : "Create Exam"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}