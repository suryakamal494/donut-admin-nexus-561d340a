/**
 * Teacher Edit Content Page
 * Edit existing teacher-created content
 * Same form as CreateContent, pre-populated with existing data
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Video, FileText, FileCode, Link as LinkIcon, Save, Info, Pencil, Loader2 } from "lucide-react";
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
import { ContentItem } from "@/components/content/ContentCard";

const contentTypes = [
  { id: "video", label: "Video", icon: Video, accept: ".mp4,.webm,.mov", description: "MP4, WebM, MOV" },
  { id: "pdf", label: "Document", icon: FileText, accept: ".pdf,.ppt,.pptx,.doc,.docx", description: "PDF, PPT, DOC" },
  { id: "html", label: "HTML", icon: FileCode, accept: ".html,.htm", description: "HTML, HTM" },
  { id: "iframe", label: "URL", icon: LinkIcon, accept: "", description: "YouTube, etc." },
];

// Mock teacher-created content for lookup (same as in Content.tsx)
const mockTeacherContent: ContentItem[] = [
  {
    id: "teacher-content-1",
    title: "Newton's Laws Interactive Demo",
    type: "video",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-laws-motion",
    topic: "Newton's First Law",
    topicId: "topic-1",
    classId: "11",
    className: "Class 11",
    description: "My interactive demonstration video explaining Newton's First Law with real-world examples.",
    duration: 15,
    url: "https://example.com/video1.mp4",
    visibility: "private",
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    createdBy: currentTeacher.id,
    viewCount: 45,
    downloadCount: 12,
    source: "teacher",
    createdByTeacherId: currentTeacher.id,
  },
  {
    id: "teacher-content-2",
    title: "Thermodynamics Quick Notes",
    type: "pdf",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Thermodynamics",
    chapterId: "ch-thermo",
    topic: "Laws of Thermodynamics",
    topicId: "topic-2",
    classId: "11",
    className: "Class 11",
    description: "Concise notes on all laws of thermodynamics with solved examples.",
    size: "2.3 MB",
    url: "https://example.com/notes.pdf",
    visibility: "private",
    status: "published",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    createdBy: currentTeacher.id,
    viewCount: 78,
    downloadCount: 34,
    source: "teacher",
    createdByTeacherId: currentTeacher.id,
  },
  {
    id: "teacher-content-3",
    title: "Wave Motion Animation",
    type: "animation",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Waves",
    chapterId: "ch-waves",
    topic: "Types of Waves",
    topicId: "topic-3",
    classId: "11",
    className: "Class 11",
    description: "AI-generated presentation on wave motion and types of waves.",
    duration: 8,
    url: "https://example.com/animation.html",
    visibility: "private",
    status: "published",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
    createdBy: currentTeacher.id,
    viewCount: 23,
    downloadCount: 5,
    source: "teacher",
    createdByTeacherId: currentTeacher.id,
  },
];

const TeacherEditContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  // Load existing content
  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      const content = mockTeacherContent.find(c => c.id === id);
      
      if (!content || content.source !== "teacher" || content.createdByTeacherId !== currentTeacher.id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      // Pre-populate form with existing data
      setSelectedType(content.type === "animation" ? "video" : content.type);
      setTitle(content.title);
      setDescription(content.description || "");
      setExternalUrl(content.url || "");
      setSelectedClass(content.className);
      setSelectedChapter(content.chapterId);
      setSelectedTopic(content.topicId || "");
      
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

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
      title: "Content Updated! ✓", 
      description: "Your changes have been saved successfully." 
    });
    navigate("/teacher/content");
  };

  const selectedTypeData = contentTypes.find(t => t.id === selectedType);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This content doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => navigate("/teacher/content")}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="font-semibold text-lg truncate flex items-center gap-2">
              <Pencil className="w-4 h-4 text-primary" />
              Edit Content
            </h1>
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
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex gap-3">
          <Pencil className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            You're editing your content. Changes will be saved immediately when you click Save.
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
        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
          <p className="text-sm text-teal-700 dark:text-teal-300">
            <strong>Your Content:</strong> This content belongs to you and only you can edit or delete it.
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
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TeacherEditContent;
