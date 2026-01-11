/**
 * Teacher AI Content Generator
 * 3-step wizard for AI-powered content creation
 * Mobile-first design, auto-scoped to teacher's subjects
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Info, 
  Lightbulb 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AIContentPreviewEditor, Slide } from "@/components/content/AIContentPreviewEditor";
import { currentTeacher } from "@/data/teacherData";
import { physicsChapters, getTopicsByChapter } from "@/data/cbseMasterData";

const stylePresets = [
  { id: "detailed", label: "Detailed", description: "Comprehensive with examples" },
  { id: "concise", label: "Concise", description: "Brief and to the point" },
];

const TeacherAIContentGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Classification - auto-scoped to teacher's subject
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Step 2: Prompt
  const [prompt, setPrompt] = useState("");
  const [stylePreset, setStylePreset] = useState("detailed");
  const [slideCount, setSlideCount] = useState([10]);

  // Step 3: Generated content
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [presentationTitle, setPresentationTitle] = useState("");

  const teacherSubject = currentTeacher.subjects[0]; // Physics

  // Get available chapters based on selected class
  const availableChapters = useMemo(() => {
    if (!selectedClass) return [];
    const classId = selectedClass === "Class 10" ? "5" : selectedClass === "Class 11" ? "6" : "7";
    return physicsChapters.filter(ch => 
      ch.subjectId === "1" && ch.classId === classId
    );
  }, [selectedClass]);

  // Get available topics based on chapter
  const availableTopics = useMemo(() => {
    if (!selectedChapter) return [];
    return getTopicsByChapter(selectedChapter);
  }, [selectedChapter]);

  // Reset handlers
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setSelectedTopic("");
  };

  // Validation
  const canProceedStep1 = selectedClass && selectedChapter;
  const canProceedStep2 = prompt.trim().length >= 20;

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));

    const chapterName = availableChapters.find(c => c.id === selectedChapter)?.name || selectedChapter;
    const topicName = availableTopics.find(t => t.id === selectedTopic)?.name || chapterName;

    const mockSlides: Slide[] = Array.from({ length: slideCount[0] }, (_, i) => ({
      id: `slide-${i + 1}`,
      title: i === 0 
        ? `Introduction to ${topicName}`
        : i === slideCount[0] - 1 
          ? "Summary & Key Takeaways"
          : `${topicName} - Part ${i}`,
      content: i === 0
        ? `Welcome to this presentation on ${topicName}. In this lesson, we will explore the fundamental concepts and their real-world applications.\n\n• Understanding the basics\n• Key principles and theories\n• Practical examples`
        : i === slideCount[0] - 1
          ? `Let's recap what we learned:\n\n• Core concepts of ${topicName}\n• Important formulas and relationships\n• Real-world applications\n\nRemember to practice with the exercises provided!`
          : `This section covers important aspects of ${topicName}.\n\n• Key point ${i}.1: Explanation of the concept\n• Key point ${i}.2: Supporting details\n• Key point ${i}.3: Examples and applications\n\nNote: Understanding this will help in grasping advanced topics.`,
    }));

    setGeneratedSlides(mockSlides);
    setPresentationTitle(`${topicName} - Complete Guide`);
    setIsGenerating(false);
    setCurrentStep(3);
  };

  const handleSaveToLibrary = () => {
    toast({
      title: "Content Saved! 🎉",
      description: `"${presentationTitle}" has been added to your Content Library.`,
    });
    navigate("/teacher/content");
  };

  const handleSlidesUpdate = (slides: Slide[]) => {
    setGeneratedSlides(slides);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-4">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
              currentStep >= step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={cn(
                "w-8 sm:w-12 h-1 mx-1",
                currentStep > step ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Step 1: Choose Topic</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Select the chapter for your presentation
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Tell us what topic to create content for</p>
          <p className="text-xs text-muted-foreground mt-1">
            This helps the AI create accurate, curriculum-aligned content.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 border border-border/50 space-y-4">
        {/* Subject - Locked */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">Subject</Label>
          <div className="h-11 px-3 rounded-md border bg-muted/50 flex items-center">
            <span className="text-foreground font-medium">{teacherSubject}</span>
            <Badge variant="secondary" className="ml-2 text-xs">Your subject</Badge>
          </div>
        </div>

        {/* Class */}
        <div className="space-y-2">
          <Label>Class *</Label>
          <Select value={selectedClass} onValueChange={handleClassChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {currentTeacher.assignedClasses.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter */}
        {selectedClass && (
          <div className="space-y-2">
            <Label>Chapter *</Label>
            <Select value={selectedChapter} onValueChange={handleChapterChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {availableChapters.map(ch => (
                  <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Topic */}
        {selectedChapter && availableTopics.length > 0 && (
          <div className="space-y-2">
            <Label>Topic <span className="text-muted-foreground">(optional)</span></Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select topic for more specific content" />
              </SelectTrigger>
              <SelectContent>
                {availableTopics.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button
        onClick={() => setCurrentStep(2)}
        disabled={!canProceedStep1}
        className="w-full h-12 gap-2"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Step 2: Describe Content</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Tell the AI what kind of presentation you need
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Describe what you want to create</p>
          <p className="text-xs text-muted-foreground mt-1">
            The more specific you are, the better the result!
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 border border-border/50 space-y-5">
        <div className="space-y-2">
          <Label>Your Prompt *</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a presentation explaining Newton's three laws of motion with real-world examples. Include diagrams for each law and end with practice problems."
            className="min-h-32 resize-none"
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimum 20 characters</span>
            <span>{prompt.length}/500</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Presentation Style</Label>
          <div className="grid grid-cols-2 gap-3">
            {stylePresets.map((style) => (
              <button
                key={style.id}
                onClick={() => setStylePreset(style.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  stylePreset === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <p className="font-medium text-sm">{style.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Number of Slides</Label>
            <span className="text-sm font-medium text-primary">{slideCount[0]} slides</span>
          </div>
          <Slider
            value={slideCount}
            onValueChange={setSlideCount}
            min={5}
            max={20}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 slides (brief)</span>
            <span>20 slides (comprehensive)</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(1)} 
          className="gap-2 h-12 sm:h-10"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!canProceedStep2 || isGenerating}
          className="gap-2 h-12 sm:h-10"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Presentation
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="p-4">
      <AIContentPreviewEditor
        slides={generatedSlides}
        onSlidesChange={handleSlidesUpdate}
        presentationTitle={presentationTitle}
        onTitleChange={setPresentationTitle}
        onSave={handleSaveToLibrary}
        onBack={() => setCurrentStep(2)}
        classification={{
          class: selectedClass,
          subject: teacherSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      {currentStep < 3 && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => currentStep === 1 ? navigate("/teacher/content") : setCurrentStep(1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-lg truncate flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Content Generator
              </h1>
              <Badge variant="secondary" className="mt-0.5 text-xs">
                {teacherSubject}
              </Badge>
            </div>
          </div>
          {renderStepIndicator()}
        </div>
      )}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};

export default TeacherAIContentGenerator;
