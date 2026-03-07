import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { SubjectBadge } from "@/components/subject";
import { teachers, availableSubjects, type Teacher } from "@/data/instituteData";
import { GraduationCap, ChevronLeft, Check, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AssignTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  batchName: string;
  subjects: string[];
}

type Step = "subject" | "teacher";

export const AssignTeacherDialog = ({
  open,
  onOpenChange,
  batchId,
  batchName,
  subjects,
}: AssignTeacherDialogProps) => {
  const [step, setStep] = useState<Step>("subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");

  useEffect(() => {
    if (open) {
      setStep("subject");
      setSelectedSubject("");
      setSelectedTeacher("");
    }
  }, [open]);

  const getSubjectName = (id: string) =>
    availableSubjects.find((s) => s.id === id)?.name || id;

  const filteredTeachers = teachers.filter(
    (t) => t.status === "active" && t.subjects.includes(selectedSubject)
  );

  const handleAssign = () => {
    const teacher = teachers.find((t) => t.id === selectedTeacher);
    if (!teacher) return;
    toast.success(
      `${teacher.name} assigned to ${getSubjectName(selectedSubject)} for ${batchName}`
    );
    onOpenChange(false);
  };

  const title =
    step === "subject"
      ? "Select Subject"
      : `Select Teacher — ${getSubjectName(selectedSubject)}`;

  const footer =
    step === "teacher" ? (
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setStep("subject");
            setSelectedTeacher("");
          }}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selectedTeacher}
          onClick={handleAssign}
        >
          <Check className="h-4 w-4 mr-1" />
          Assign
        </Button>
      </div>
    ) : undefined;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={
        step === "subject"
          ? `Choose a subject to assign a teacher for ${batchName}`
          : `${filteredTeachers.length} teacher(s) available`
      }
      footer={footer}
    >
      {step === "subject" && (
        <div className="space-y-2">
          {subjects.map((subjectId) => (
            <button
              key={subjectId}
              className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              onClick={() => {
                setSelectedSubject(subjectId);
                setStep("teacher");
              }}
            >
              <SubjectBadge subject={getSubjectName(subjectId)} />
              <Badge variant="outline" className="text-xs">
                {
                  teachers.filter(
                    (t) =>
                      t.status === "active" && t.subjects.includes(subjectId)
                  ).length
                }{" "}
                available
              </Badge>
            </button>
          ))}
        </div>
      )}

      {step === "teacher" && (
        <div className="space-y-2">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No teachers available for this subject
              </p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => {
              const isAlreadyAssigned = teacher.batches.some(
                (b) => b.batchId === batchId
              );
              return (
                <button
                  key={teacher.id}
                  disabled={isAlreadyAssigned}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-lg border transition-colors text-left",
                    selectedTeacher === teacher.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50",
                    isAlreadyAssigned && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => setSelectedTeacher(teacher.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {teacher.batches.length} batch
                      {teacher.batches.length !== 1 ? "es" : ""} assigned
                    </p>
                  </div>
                  {isAlreadyAssigned && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Already assigned
                    </Badge>
                  )}
                  {selectedTeacher === teacher.id && !isAlreadyAssigned && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </ResponsiveDialog>
  );
};
