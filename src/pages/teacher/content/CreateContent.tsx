/**
 * Teacher Create Content Page
 * Manual upload flow - mobile-first design
 * Auto-scoped to teacher's subjects
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, FileText, FileCode, Link as LinkIcon, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MobileFileUpload } from "@/components/teacher/content/MobileFileUpload";
import { currentTeacher } from "@/data/teacherData";
import { physicsChapters, getTopicsByChapter } from "@/data/cbseMasterData";

const contentTypes = [
  { id: "video", label: "Video", icon: Video, accept: ".mp4,.webm,.mov", description: "MP4, WebM, MOV" },
  { id: "document", label: "Document", icon: FileText, accept: ".pdf,.ppt,.pptx,.doc,.docx", description: "PDF, PPT, DOC" },
  { id: "html", label: "HTML", icon: FileCode, accept: ".html,.htm", description: "HTML, HTM" },
  { id: "iframe", label: "URL", icon: LinkIcon, accept: "", description: "YouTube, etc." },
];

const TeacherCreateContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [selectedType, setSelectedType] = useState("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Classification state - auto-scoped to teacher's subject
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

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

  const canSubmit = title.trim() && selectedClass && selectedChapter;

  const handleSubmit = () => {
    if (!canSubmit) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill in title, class, and chapter", 
        variant: "destructive" 
      });
      return;
    }
    
    toast({ 
      title: "Content Created! 🎉", 
      description: "Your content has been added to the library." 
    });
    navigate("/teacher/content");
  };

  const selectedTypeData = contentTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header - Mobile optimized */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/teacher/content")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-lg truncate">Upload Content</h1>
            <Badge variant="secondary" className="mt-0.5 text-xs">
              {teacherSubject}
            </Badge>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="shrink-0 gap-2"
            size="sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      <div className="p-4 pb-24 space-y-6 max-w-2xl mx-auto">
        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Upload videos, documents, or paste external URLs. Your content will be available for use in lesson plans.
          </p>
        </div>

        {/* Classification Section - First on mobile */}
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm space-y-4">
          <h3 className="font-semibold text-base">Classification</h3>
          
          {/* Subject - Locked */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Subject</Label>
            <div className="h-11 px-3 rounded-md border bg-muted/50 flex items-center">
              <span className="text-foreground font-medium">{teacherSubject}</span>
              <span className="text-xs text-muted-foreground ml-2">(Your subject)</span>
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
                  <SelectValue placeholder="Select topic" />
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

        {/* Content Type Selection */}
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm space-y-4">
          <h3 className="font-semibold text-base">Content Type</h3>
          <div className="grid grid-cols-4 gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all min-h-[80px]",
                  selectedType === type.id 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <type.icon className={cn(
                  "w-5 h-5",
                  selectedType === type.id ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="text-xs font-medium text-center leading-tight">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
          <MobileFileUpload
            contentType={selectedType}
            accept={selectedTypeData?.accept || ""}
            onFileSelect={setSelectedFile}
            onUrlChange={setExternalUrl}
            externalUrl={externalUrl}
          />
        </div>

        {/* Content Details */}
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm space-y-4">
          <h3 className="font-semibold text-base">Content Details</h3>
          
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input 
              placeholder="Enter content title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea 
              placeholder="Describe what this content covers..." 
              className="min-h-24 resize-none" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Learning Objectives <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea 
              placeholder="What will students learn from this content?" 
              className="min-h-20 resize-none" 
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
            />
          </div>
        </div>

        {/* Info about content ownership */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            <strong>Your Content:</strong> Content you create will be tagged as your content and can be edited or deleted anytime from your library.
          </p>
        </div>
      </div>

      {/* Fixed bottom save button for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden">
        <Button 
          className="w-full h-12 gap-2 text-base" 
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <Save className="w-5 h-5" />
          Save Content
        </Button>
      </div>
    </div>
  );
};

export default TeacherCreateContent;
