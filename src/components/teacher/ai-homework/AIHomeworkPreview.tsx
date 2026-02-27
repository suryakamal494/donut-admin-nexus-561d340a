import { useState } from "react";
import { Timer, Pencil, Trash2, Plus, Check, X, GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GeneratedHomework, getBatchDisplayName } from "./types";

interface AIHomeworkPreviewProps {
  generatedHomework: GeneratedHomework;
  onHomeworkChange: (homework: GeneratedHomework) => void;
  title: string;
  batchId: string;
  subject: string;
  dueDate: string;
  isMobile?: boolean;
}

export function AIHomeworkPreview({
  generatedHomework,
  onHomeworkChange,
  title,
  batchId,
  subject,
  dueDate,
  isMobile = false,
}: AIHomeworkPreviewProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editMarks, setEditMarks] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskMarks, setNewTaskMarks] = useState("");

  const startEdit = (task: { id: string; content: string; marks?: number }) => {
    setEditingTaskId(task.id);
    setEditContent(task.content);
    setEditMarks(task.marks?.toString() || "");
  };

  const saveEdit = () => {
    if (!editingTaskId || !editContent.trim()) return;
    const updatedTasks = generatedHomework.tasks.map((t) =>
      t.id === editingTaskId
        ? { ...t, content: editContent.trim(), marks: editMarks ? Number(editMarks) : t.marks }
        : t
    );
    const totalMarks = updatedTasks.reduce((sum, t) => sum + (t.marks || 0), 0);
    onHomeworkChange({ ...generatedHomework, tasks: updatedTasks, totalMarks: totalMarks || generatedHomework.totalMarks });
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditContent("");
    setEditMarks("");
  };

  const removeTask = (taskId: string) => {
    const updatedTasks = generatedHomework.tasks.filter((t) => t.id !== taskId);
    const totalMarks = updatedTasks.reduce((sum, t) => sum + (t.marks || 0), 0);
    onHomeworkChange({ ...generatedHomework, tasks: updatedTasks, totalMarks: totalMarks || undefined });
  };

  const addTask = () => {
    if (!newTaskContent.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      type: "custom",
      content: newTaskContent.trim(),
      marks: newTaskMarks ? Number(newTaskMarks) : undefined,
    };
    const updatedTasks = [...generatedHomework.tasks, newTask];
    const totalMarks = updatedTasks.reduce((sum, t) => sum + (t.marks || 0), 0);
    onHomeworkChange({ ...generatedHomework, tasks: updatedTasks, totalMarks: totalMarks || generatedHomework.totalMarks });
    setNewTaskContent("");
    setNewTaskMarks("");
    setIsAddingTask(false);
  };

  return (
    <ScrollArea className={cn("pr-2", isMobile ? "max-h-[60vh]" : "max-h-[55vh]")}>
      <div className="space-y-4 pb-4">
        {/* Generated Title & Description */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-1">
            {generatedHomework.title || title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {generatedHomework.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            {generatedHomework.estimatedTime && (
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {generatedHomework.estimatedTime} mins
              </span>
            )}
            {generatedHomework.totalMarks && (
              <span>Total: {generatedHomework.totalMarks} marks</span>
            )}
          </div>
        </div>

        {/* Instructions */}
        {generatedHomework.instructions?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Instructions</Label>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              {generatedHomework.instructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary font-medium">{idx + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Editable Tasks */}
        {generatedHomework.tasks?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tasks ({generatedHomework.tasks.length})</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-primary"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="w-3 h-3" />
                Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {generatedHomework.tasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className={cn(
                    "rounded-lg border transition-colors",
                    editingTaskId === task.id
                      ? "bg-primary/5 border-primary/30 p-3"
                      : "bg-muted/50 p-3 group"
                  )}
                >
                  {editingTaskId === task.id ? (
                    /* Editing mode */
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px] text-sm resize-none"
                        autoFocus
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Label className="text-xs text-muted-foreground">Marks:</Label>
                          <Input
                            type="number"
                            value={editMarks}
                            onChange={(e) => setEditMarks(e.target.value)}
                            className="h-7 w-16 text-xs"
                            min={0}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={cancelEdit}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" className="h-7 text-xs gap-1 px-2.5" onClick={saveEdit}>
                            <Check className="w-3 h-3" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Display mode */
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-muted-foreground mt-0.5 shrink-0 w-5">
                        Q{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{task.content}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="text-xs">
                            {task.type}
                          </Badge>
                          {task.marks && (
                            <Badge variant="outline" className="text-xs">
                              {task.marks}m
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => startEdit(task)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeTask(task.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Task Inline */}
              {isAddingTask && (
                <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 space-y-2">
                  <Textarea
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    placeholder="Enter task content..."
                    className="min-h-[60px] text-sm resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-xs text-muted-foreground">Marks:</Label>
                      <Input
                        type="number"
                        value={newTaskMarks}
                        onChange={(e) => setNewTaskMarks(e.target.value)}
                        className="h-7 w-16 text-xs"
                        placeholder="—"
                        min={0}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => { setIsAddingTask(false); setNewTaskContent(""); setNewTaskMarks(""); }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1 px-2.5"
                        onClick={addTask}
                        disabled={!newTaskContent.trim()}
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assignment Info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Assign to:</span>
            <Badge variant="outline">{getBatchDisplayName(batchId)}</Badge>
            <Badge variant="outline">{subject}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">Due: {dueDate}</span>
        </div>
      </div>
    </ScrollArea>
  );
}
