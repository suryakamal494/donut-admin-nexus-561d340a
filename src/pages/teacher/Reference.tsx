import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, BookOpen, Lock, Maximize2, Minimize2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PageHeader } from "@/components/ui/page-header";
import { 
  physicsChapters, 
  cbseTopics, 
  CBSEChapter, 
  CBSETopic 
} from "@/data/cbseMasterData";
import { cn } from "@/lib/utils";

// Map class IDs to display names
const classIdToName: Record<string, string> = {
  "5": "Class 10",
  "6": "Class 11",
  "7": "Class 12",
};

// Group chapters by class
const getChaptersByClass = () => {
  const grouped: Record<string, CBSEChapter[]> = {};
  
  physicsChapters.forEach(chapter => {
    const className = classIdToName[chapter.classId];
    if (className && (className === "Class 10" || className === "Class 11" || className === "Class 12")) {
      if (!grouped[className]) {
        grouped[className] = [];
      }
      grouped[className].push(chapter);
    }
  });

  // Sort chapters within each class by order
  Object.keys(grouped).forEach(className => {
    grouped[className].sort((a, b) => a.order - b.order);
  });

  return grouped;
};

// Get topics for a chapter
const getTopicsForChapter = (chapterId: string): CBSETopic[] => {
  return cbseTopics
    .filter(topic => topic.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
};

const Reference = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("Class 11");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const chaptersByClass = useMemo(() => getChaptersByClass(), []);
  const availableClasses = Object.keys(chaptersByClass).sort();

  // Filter chapters based on search
  const filteredChapters = useMemo(() => {
    const chapters = chaptersByClass[selectedClass] || [];
    
    if (!searchQuery) return chapters;

    const query = searchQuery.toLowerCase();
    return chapters.filter(chapter => {
      // Check chapter name
      if (chapter.name.toLowerCase().includes(query)) return true;
      
      // Check topics
      const topics = getTopicsForChapter(chapter.id);
      return topics.some(topic => topic.name.toLowerCase().includes(query));
    });
  }, [chaptersByClass, selectedClass, searchQuery]);

  // Count total topics and hours for stats
  const { totalTopics, totalHours } = useMemo(() => {
    let topics = 0;
    let hours = 0;
    filteredChapters.forEach(ch => {
      topics += getTopicsForChapter(ch.id).length;
      hours += ch.allocatedHours || 0;
    });
    return { totalTopics: topics, totalHours: hours };
  }, [filteredChapters]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedChapters(new Set(filteredChapters.map(ch => ch.id)));
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <PageHeader
        title="Chapter Details"
        description="CBSE syllabus chapters and topics for your subject"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Chapter Details" },
        ]}
      />

      {/* Subject Badge & Stats - Compact inline */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 gap-1.5 px-3 py-1">
          <BookOpen className="w-3 h-3" />
          Physics
        </Badge>
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <Lock className="w-3 h-3" />
          Read-Only
        </Badge>
        <span className="text-sm text-muted-foreground">
          {filteredChapters.length} chapters • {totalTopics} topics • {totalHours} hrs
        </span>
      </div>

      {/* Class Tabs - Horizontal Scrollable */}
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 pb-1">
          {availableClasses.map(className => (
            <Button
              key={className}
              variant={selectedClass === className ? "default" : "outline"}
              size="sm"
              className={cn(
                "whitespace-nowrap h-9 px-4",
                selectedClass === className && "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0"
              )}
              onClick={() => { setSelectedClass(className); setExpandedChapters(new Set()); }}
            >
              {className}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Search + Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chapters and topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={expandAll} className="h-9">
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Expand</span>
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="h-9">
            <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Collapse</span>
          </Button>
        </div>
      </div>

      {/* Chapter List */}
      <Card className="card-premium overflow-hidden">
        {/* Card Header Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400" />
        
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-340px)] min-h-[400px]">
            <div className="divide-y divide-border/50">
              {filteredChapters.length > 0 ? (
                filteredChapters.map((chapter, index) => {
                  const topics = getTopicsForChapter(chapter.id);
                  const isExpanded = expandedChapters.has(chapter.id);

                  return (
                    <Collapsible
                      key={chapter.id}
                      open={isExpanded}
                      onOpenChange={() => toggleChapter(chapter.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left">
                          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground line-clamp-2">
                              {chapter.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-muted-foreground">
                                {topics.length} topics
                              </span>
                              {chapter.allocatedHours && (
                                <Badge variant="outline" className="text-xs gap-1 bg-amber-50 text-amber-700 border-amber-200 px-1.5 py-0">
                                  <Clock className="w-3 h-3" />
                                  {chapter.allocatedHours} hrs
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className={cn(
                            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors",
                            isExpanded ? "bg-teal-100 text-teal-600" : "bg-muted text-muted-foreground"
                          )}>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pb-4 px-4 pl-16 space-y-1.5">
                          {topics.length > 0 ? (
                            topics.map((topic, topicIndex) => (
                              <div
                                key={topic.id}
                                className="flex items-start gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-teal-50/50 to-cyan-50/50 border border-teal-100/50 text-sm"
                              >
                                <span className="text-teal-600 text-xs font-medium w-5 shrink-0 pt-0.5">
                                  {topicIndex + 1}.
                                </span>
                                <span className="text-foreground">{topic.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic py-2">
                              No topics available for this chapter
                            </p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-center">
                    No chapters found matching "{searchQuery}"
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-teal-600"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reference;