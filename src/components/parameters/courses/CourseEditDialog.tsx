import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from "@/types/masterData";
import { toast } from "sonner";

interface CourseEditDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updatedCourse: Course) => void;
}

export const CourseEditDialog = ({ course, open, onOpenChange, onSave }: CourseEditDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseType, setCourseType] = useState<"competitive" | "board" | "foundation" | "olympiad">("competitive");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description || "");
      setCourseType(course.courseType);
      setStatus(course.status);
    }
  }, [course]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (course && onSave) {
      onSave({
        ...course,
        name: name.trim(),
        description: description.trim(),
        courseType,
        status,
      });
    }

    toast.success("Course updated successfully");
    onOpenChange(false);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="course-name">Course Name *</Label>
            <Input
              id="course-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter course name"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-desc">Description</Label>
            <Textarea
              id="course-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              className="min-h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={courseType} onValueChange={(v) => setCourseType(v as typeof courseType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="olympiad">Olympiad</SelectItem>
                  <SelectItem value="board">Board</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Course Code</Label>
            <p className="text-sm font-medium px-3 py-2 bg-muted/50 rounded-md">{course.code}</p>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gradient-button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
