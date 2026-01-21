import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, X, Plus, Award, Building2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamPattern } from "@/data/examPatternsData";
import { availableSubjects } from "@/hooks/usePatternBuilder";
import { useState } from "react";

interface BasicInfoStepProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  hasFixedSubjects: boolean;
  setHasFixedSubjects: (value: boolean) => void;
  subjects: string[];
  toggleSubject: (subjectId: string) => void;
  category: ExamPattern["category"];
  setCategory: (category: ExamPattern["category"]) => void;
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  canProceed: boolean;
  onNext: () => void;
  onCancel: () => void;
}

const categoryOptions: { value: ExamPattern["category"]; label: string; icon: React.ElementType; description: string }[] = [
  { value: "competitive", label: "Competitive", icon: Award, description: "JEE, NEET, etc." },
  { value: "board", label: "Board", icon: Building2, description: "CBSE, State Boards" },
  { value: "custom", label: "Custom", icon: LayoutGrid, description: "Institute specific" },
];

export function BasicInfoStep({
  name,
  setName,
  description,
  setDescription,
  hasFixedSubjects,
  setHasFixedSubjects,
  subjects,
  toggleSubject,
  category,
  setCategory,
  tags,
  addTag,
  removeTag,
  canProceed,
  onNext,
  onCancel,
}: BasicInfoStepProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Set up the pattern name, category, and subjects
        </p>
      </div>

      {/* Pattern Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Pattern Name *</Label>
        <Input
          id="name"
          placeholder="e.g., JEE Main 2025, Weekly Physics Test"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of this exam pattern..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <Label>Category</Label>
        <div className="grid grid-cols-3 gap-3">
          {categoryOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = category === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-200 text-left",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mb-2",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
                <p className={cn(
                  "font-medium text-sm",
                  isSelected && "text-primary"
                )}>
                  {option.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Subjects Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="fixed-subjects" className="text-base">Fixed Subjects</Label>
              <p className="text-sm text-muted-foreground">
                Specify subjects for this pattern, or leave generic
              </p>
            </div>
            <Switch
              id="fixed-subjects"
              checked={hasFixedSubjects}
              onCheckedChange={setHasFixedSubjects}
            />
          </div>

          {hasFixedSubjects && (
            <div className="mt-4 pt-4 border-t">
              <Label className="text-sm mb-3 block">Select Subjects *</Label>
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map((subject) => {
                  const isSelected = subjects.includes(subject.id);
                  return (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => toggleSubject(subject.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      {subject.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (Optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            maxLength={30}
          />
          <Button type="button" variant="outline" onClick={handleAddTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
