import { useNavigate, useParams } from "react-router-dom";
import { Upload, Video, FileText, FileCode, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { availableClasses, availableSubjects, assignedTracks, instituteContent } from "@/data/instituteData";
import { getSubjectsForCourse, getChaptersForCourseBySubject } from "@/data/masterData";
import { getChaptersByClassAndSubject, getTopicsByChapter } from "@/data/cbseMasterData";
import { Checkbox } from "@/components/ui/checkbox";

const contentTypes = [
  { id: "video", label: "Video", icon: Video, accept: ".mp4,.webm,.mov", description: "MP4, WebM, MOV" },
  { id: "document", label: "Document", icon: FileText, accept: ".pdf,.ppt,.pptx,.doc,.docx", description: "PDF, PPT, DOC" },
  { id: "html", label: "HTML", icon: FileCode, accept: ".html,.htm", description: "HTML, HTM" },
  { id: "iframe", label: "External URL", icon: LinkIcon, accept: "", description: "YouTube, Vimeo, etc." },
];

const InstituteCreateContent = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isEditMode = !!contentId;
  const existingContent = useMemo(() => {
    if (!contentId) return null;
    return instituteContent.find(c => c.id === contentId && c.source === "institute");
  }, [contentId]);

  const [selectedType, setSelectedType] = useState("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  // Course-based selection state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Pre-populate form for edit mode
  useEffect(() => {
    if (existingContent) {
      setSelectedType(existingContent.type);
      setTitle(existingContent.title);
      setDescription(existingContent.description);
      setExternalUrl(existingContent.url || "");
      // Note: Would need to reverse-lookup course from content data
      // For now, we just set basic fields
    }
  }, [existingContent]);

  // Determine if selected course has classes
  const selectedTrack = assignedTracks.find(t => t.id === selectedCourse);
  const isCBSE = selectedTrack?.hasClasses ?? false;

  // Get available subjects based on course
  const availableSubjectsForCourse = useMemo(() => {
    if (!selectedCourse) return [];
    if (isCBSE) {
      return availableSubjects;
    } else {
      const courseSubjects = getSubjectsForCourse(selectedCourse);
      return courseSubjects.map(cs => ({ id: cs.id, name: cs.name }));
    }
  }, [selectedCourse, isCBSE]);

  // Get available chapters based on course/class/subject
  const availableChapters = useMemo(() => {
    if (!selectedSubject) return [];
    if (isCBSE && selectedClass) {
      return getChaptersByClassAndSubject(selectedClass, selectedSubject);
    } else if (!isCBSE) {
      return getChaptersForCourseBySubject(selectedCourse, selectedSubject);
    }
    return [];
  }, [selectedCourse, selectedClass, selectedSubject, isCBSE]);

  // Get available topics based on chapter
  const availableTopics = useMemo(() => {
    if (!selectedChapter) return [];
    return getTopicsByChapter(selectedChapter);
  }, [selectedChapter]);

  // Reset handlers
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setSelectedSubject("");
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedChapter("");
    setSelectedTopic("");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setSelectedTopic("");
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }
    toast({ 
      title: isEditMode ? "Content Updated!" : "Content Created!", 
      description: isEditMode ? "Your changes have been saved." : "Content has been added to your library." 
    });
    navigate("/institute/content");
  };

  const selectedTypeData = contentTypes.find(t => t.id === selectedType);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isEditMode ? "Edit Content" : "Create Content"}
        description={isEditMode ? "Update your content details" : "Add new learning content to your institute's library"}
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Content", href: "/institute/content" },
          { label: isEditMode ? "Edit" : "Create" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile: Classification first for logical flow */}
        <div className="order-1 lg:order-2 space-y-6">
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Classification</h3>
            <div className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-3">
                <Label>Select Course *</Label>
                <div className="grid grid-cols-1 gap-2">
                  {assignedTracks.map((track) => (
                    <label
                      key={track.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedCourse === track.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox
                        checked={selectedCourse === track.id}
                        onCheckedChange={() => handleCourseChange(track.id)}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{track.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {track.hasClasses ? "Curriculum-based" : "Competitive exam"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Class - Only for CBSE */}
              {selectedCourse && isCBSE && (
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {availableClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Subject */}
              {selectedCourse && (!isCBSE || selectedClass) && (
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {availableSubjectsForCourse.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Chapter */}
              {selectedSubject && (
                <div className="space-y-2">
                  <Label>Chapter *</Label>
                  <Select value={selectedChapter} onValueChange={handleChapterChange}>
                    <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                    <SelectContent>
                      {availableChapters.map(chapter => (
                        <SelectItem key={chapter.id} value={chapter.id}>{chapter.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Topic */}
              {selectedChapter && (
                <div className="space-y-2">
                  <Label>Topic *</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                    <SelectContent>
                      {availableTopics.map(topic => (
                        <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Difficulty */}
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Info about content ownership */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              <strong>Your Content:</strong> Content you create will be tagged as institute content and can be edited or deleted anytime.
            </p>
          </div>

          <Button 
            className="w-full gradient-button" 
            onClick={handleSubmit}
            disabled={!isEditMode && (!selectedCourse || !selectedSubject || !selectedChapter || (isCBSE && !selectedClass))}
          >
            {isEditMode ? "Save Changes" : "Save Content"}
          </Button>
        </div>

        {/* Content details */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          {/* Content Type Selection */}
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Content Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "p-3 sm:p-4 rounded-xl border flex flex-col items-center gap-1 sm:gap-2 transition-all",
                    selectedType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <type.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", selectedType === type.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">
              {selectedType === "iframe" ? "Enter URL" : "Upload File"}
            </h3>
            {selectedType === "iframe" ? (
              <div className="space-y-2">
                <Label>External URL</Label>
                <Input 
                  placeholder="https://www.youtube.com/embed/..." 
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Paste an embed URL from YouTube, Vimeo, Google Slides, or any other service
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-8 sm:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium text-base sm:text-lg">Drag & drop your file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                <Button variant="outline" className="mt-4">Select File</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: {selectedTypeData?.accept || "Any"}
                </p>
              </div>
            )}
          </div>

          {/* Content Details */}
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Content Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input 
                  placeholder="Enter content title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe what this content covers..." 
                  className="min-h-24" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Learning Objectives</Label>
                <Textarea 
                  placeholder="What will students learn from this content?" 
                  className="min-h-20" 
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteCreateContent;