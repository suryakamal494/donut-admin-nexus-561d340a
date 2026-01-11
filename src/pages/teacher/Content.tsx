import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Grid3X3, List, BookOpen, Filter, ChevronDown, ChevronUp, Plus, Upload, Sparkles, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard, ContentItem } from "@/components/content/ContentCard";
import { ContentPagination } from "@/components/content/ContentPagination";
import { ContentPreviewDialog } from "@/components/content/ContentPreviewDialog";
import { ContentCreationSheet, ContentCreationOnboardingTour, useContentCreationTour } from "@/components/teacher/content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { instituteContent, InstituteContentItem } from "@/data/instituteData";
import { currentTeacher } from "@/data/teacherData";
import { physicsChapters, cbseTopics } from "@/data/cbseMasterData";

// Get unique chapters for Physics (teacher's subject)
const getTeacherChapters = () => {
  return physicsChapters.filter(ch => 
    ch.subjectId === "1" && (ch.classId === "5" || ch.classId === "6" || ch.classId === "7")
  );
};

// Mock teacher-created content
const teacherCreatedContent: ContentItem[] = [
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

const Content = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [deleteContent, setDeleteContent] = useState<ContentItem | null>(null);
  const [localTeacherContent, setLocalTeacherContent] = useState<ContentItem[]>(teacherCreatedContent);
  
  // Onboarding tour
  const { showTour, completeTour, skipTour } = useContentCreationTour();

  const ITEMS_PER_PAGE = 15;

  // Combine institute content with teacher-created content for teacher's subjects (Physics)
  const allContent = useMemo(() => {
    const institutePhysicsContent = instituteContent.filter(item => 
      item.subjectId === "phy"
    ) as ContentItem[];
    
    // Combine global/institute content with teacher's own content
    return [...institutePhysicsContent, ...localTeacherContent];
  }, [localTeacherContent]);

  // Get available classes from content
  const availableClasses = useMemo(() => {
    const classes = [...new Set(allContent.map(c => c.className))];
    return classes.sort();
  }, [allContent]);

  // Get available chapters based on selected class
  const availableChapters = useMemo(() => {
    let content = allContent;
    if (selectedClass !== "all") {
      content = content.filter(c => c.className === selectedClass);
    }
    const chapters = [...new Set(content.map(c => c.chapter))];
    return chapters.sort();
  }, [allContent, selectedClass]);

  // Get available content types
  const availableTypes = useMemo(() => {
    return [...new Set(allContent.map(c => c.type))];
  }, [allContent]);

  // Filter content
  const filteredContent = useMemo(() => {
    let filtered = allContent;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.chapter.toLowerCase().includes(query) ||
        c.topic.toLowerCase().includes(query)
      );
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter(c => c.className === selectedClass);
    }

    if (selectedChapter !== "all") {
      filtered = filtered.filter(c => c.chapter === selectedChapter);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(c => c.type === selectedType);
    }

    if (selectedSource !== "all") {
      filtered = filtered.filter(c => c.source === selectedSource);
    }

    return filtered;
  }, [allContent, searchQuery, selectedClass, selectedChapter, selectedType, selectedSource]);

  // Paginate
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const paginatedContent = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContent.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContent, currentPage]);

  // Reset page when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handlePreview = (content: ContentItem) => {
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  const handleEdit = (content: ContentItem) => {
    // Only allow editing teacher-created content
    if (content.source === "teacher" && content.createdByTeacherId === currentTeacher.id) {
      navigate(`/teacher/content/edit/${content.id}`);
    }
  };

  const handleDeleteClick = (content: ContentItem) => {
    // Only allow deleting teacher-created content
    if (content.source === "teacher" && content.createdByTeacherId === currentTeacher.id) {
      setDeleteContent(content);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteContent) {
      setLocalTeacherContent(prev => prev.filter(c => c.id !== deleteContent.id));
      toast({
        title: "Content Deleted",
        description: `"${deleteContent.title}" has been removed from your library.`,
      });
      setDeleteContent(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClass("all");
    setSelectedChapter("all");
    setSelectedType("all");
    setSelectedSource("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedClass !== "all" || selectedChapter !== "all" || selectedType !== "all" || selectedSource !== "all";
  const activeFilterCount = [selectedClass !== "all", selectedChapter !== "all", selectedType !== "all", selectedSource !== "all"].filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-6">
      {/* Onboarding Tour */}
      {showTour && showCreateSheet && (
        <ContentCreationOnboardingTour onComplete={completeTour} onSkip={skipTour} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Library</h1>
            <p className="text-muted-foreground mt-1">
              Browse and use teaching materials for your classes
            </p>
          </div>
          
          {/* Create Content Button */}
          <Button 
            onClick={() => setShowCreateSheet(true)}
            className="gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Content
          </Button>
        </div>

        {/* Subject context badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
            <BookOpen className="w-3 h-3 mr-1" />
            Physics
          </Badge>
          <span className="text-sm text-muted-foreground">
            {filteredContent.length} items available
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search + Mobile Filter Toggle */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, chapter, or topic..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden h-10 min-w-[44px] shrink-0"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 text-[10px]">{activeFilterCount}</Badge>
                )}
                {showMobileFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </Button>

              {/* View toggle - always visible */}
              <div className="flex border rounded-md shrink-0">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Desktop Filter dropdowns - inline */}
            <div className="hidden lg:flex flex-wrap gap-2">
              <Select value={selectedClass} onValueChange={handleFilterChange(setSelectedClass)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {availableClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedChapter} onValueChange={handleFilterChange(setSelectedChapter)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  {availableChapters.map(ch => (
                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={handleFilterChange(setSelectedType)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {availableTypes.map(type => (
                    <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSource} onValueChange={handleFilterChange(setSelectedSource)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="institute">Institute</SelectItem>
                  <SelectItem value="teacher">My Content</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Collapsible Filters */}
            <Collapsible open={showMobileFilters} onOpenChange={setShowMobileFilters} className="lg:hidden">
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={selectedClass} onValueChange={handleFilterChange(setSelectedClass)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {availableClasses.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedChapter} onValueChange={handleFilterChange(setSelectedChapter)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chapters</SelectItem>
                      {availableChapters.map(ch => (
                        <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={handleFilterChange(setSelectedType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {availableTypes.map(type => (
                        <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSource} onValueChange={handleFilterChange(setSelectedSource)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="institute">Institute</SelectItem>
                      <SelectItem value="teacher">My Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="outline" className="gap-1">
                  Search: {searchQuery}
                </Badge>
              )}
              {selectedClass !== "all" && (
                <Badge variant="outline">{selectedClass}</Badge>
              )}
              {selectedChapter !== "all" && (
                <Badge variant="outline">{selectedChapter}</Badge>
              )}
              {selectedType !== "all" && (
                <Badge variant="outline">{selectedType.toUpperCase()}</Badge>
              )}
              {selectedSource !== "all" && (
                <Badge variant="outline">
                  {selectedSource === "global" ? "Global" : selectedSource === "teacher" ? "My Content" : "Institute"}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-6"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Grid/List */}
      {paginatedContent.length > 0 ? (
        <>
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }>
            {paginatedContent.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                mode="teacher"
                currentTeacherId={currentTeacher.id}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {/* Pagination */}
          <ContentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredContent.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No content found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try adjusting your filters or search query to find the content you're looking for.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <ContentPreviewDialog
        content={previewContent}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onEdit={() => {}}
      />

      {/* Create Content Sheet */}
      <ContentCreationSheet 
        open={showCreateSheet} 
        onOpenChange={setShowCreateSheet} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteContent} onOpenChange={(open) => !open && setDeleteContent(null)}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Content?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteContent?.title}"</strong>? 
              This action cannot be undone and the content will be permanently removed from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Content;
