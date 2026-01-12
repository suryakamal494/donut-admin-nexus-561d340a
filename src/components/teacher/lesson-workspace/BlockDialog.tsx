import { useState, useMemo, useCallback } from "react";
import { 
  Search, 
  Sparkles, 
  Upload, 
  FileText, 
  Loader2,
  Link as LinkIcon,
  Filter,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { blockTypeConfig, detectLinkType, type BlockType, type LessonPlanBlock, type LinkType } from "./types";
import { 
  mockLibraryContent, 
  contentTypeConfig, 
  linkTypeBadges,
  type LibraryContentItem 
} from "@/data/blockDialogContent";

interface BlockDialogProps {
  type: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
}

// Content item component
const ContentItem = ({ 
  item, 
  onSelect 
}: { 
  item: LibraryContentItem; 
  onSelect: () => void;
}) => {
  const typeConfig = contentTypeConfig[item.type];
  const TypeIcon = typeConfig.icon;
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-left",
        "hover:bg-primary/5 transition-colors",
        "border border-transparent hover:border-primary/20"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-md flex items-center justify-center shrink-0",
        typeConfig.color
      )}>
        <TypeIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
            {typeConfig.label}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.duration} min
          </span>
          {item.source === 'institute' && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              🏫 Institute
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
};

export const BlockDialog = ({ 
  type, 
  open, 
  onOpenChange, 
  onAddBlock,
  chapter,
  subject,
}: BlockDialogProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'library' | 'ai' | 'custom'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDuration, setCustomDuration] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Custom tab - input mode (upload or link)
  const [inputMode, setInputMode] = useState<'upload' | 'link'>('upload');
  const [linkUrl, setLinkUrl] = useState('');
  const [detectedLinkType, setDetectedLinkType] = useState<LinkType>('unknown');
  
  const config = blockTypeConfig[type];

  // Filter content with memoization
  const filteredContent = useMemo(() => {
    return mockLibraryContent.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedContentType === 'all' || item.type === selectedContentType;
      
      // Prioritize subject context if provided
      const matchesSubject = !subject || item.subject.toLowerCase() === subject.toLowerCase();
      
      return matchesSearch && matchesType && matchesSubject;
    });
  }, [searchQuery, selectedContentType, subject]);

  // Detect link type when URL changes
  const handleLinkChange = useCallback((url: string) => {
    setLinkUrl(url);
    setDetectedLinkType(detectLinkType(url));
  }, []);

  const handleLibrarySelect = useCallback((item: LibraryContentItem) => {
    onAddBlock({
      type,
      title: item.title,
      source: 'library',
      sourceId: item.id,
      sourceType: item.type,
      duration: item.duration,
    });
    onOpenChange(false);
  }, [type, onAddBlock, onOpenChange]);

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAddBlock({
      type,
      title: aiPrompt,
      content: `AI-generated content for: ${aiPrompt}`,
      source: 'ai',
      duration: 10,
      aiGenerated: true,
    });
    
    setIsGenerating(false);
    setAiPrompt('');
    onOpenChange(false);
  }, [aiPrompt, type, onAddBlock, onOpenChange]);

  const handleCustomAdd = useCallback(() => {
    if (inputMode === 'link') {
      if (!linkUrl.trim()) return;
      
      const title = customTitle.trim() || `${linkTypeBadges[detectedLinkType].label} Content`;
      
      onAddBlock({
        type,
        title,
        source: 'custom',
        duration: parseInt(customDuration) || 10,
        embedUrl: linkUrl,
        linkType: detectedLinkType,
        sourceType: detectedLinkType === 'youtube' || detectedLinkType === 'vimeo' ? 'video' : 'embed',
      });
    } else {
      if (!customTitle.trim()) return;
      
      onAddBlock({
        type,
        title: customTitle,
        source: 'custom',
        duration: parseInt(customDuration) || 10,
      });
    }
    
    setCustomTitle('');
    setCustomDuration('10');
    setLinkUrl('');
    setInputMode('upload');
    onOpenChange(false);
  }, [inputMode, linkUrl, customTitle, customDuration, detectedLinkType, type, onAddBlock, onOpenChange]);

  // Shared dialog content
  const dialogContent = (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col flex-1">
        <div className="px-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="library" className="text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Library
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-xs gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Custom
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Library Tab */}
        <TabsContent value="library" className="mt-0 flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Filters */}
          <div className="px-4 py-3 space-y-2 border-b shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            {/* Type filter */}
            <Select value={selectedContentType} onValueChange={setSelectedContentType}>
              <SelectTrigger className="h-8 text-xs">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all" className="text-xs">All Types</SelectItem>
                <SelectItem value="video" className="text-xs">Videos</SelectItem>
                <SelectItem value="presentation" className="text-xs">Presentations</SelectItem>
                <SelectItem value="document" className="text-xs">Documents</SelectItem>
                <SelectItem value="animation" className="text-xs">Animations</SelectItem>
                <SelectItem value="simulation" className="text-xs">Simulations</SelectItem>
              </SelectContent>
            </Select>
            
            {chapter && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Context:</span>
                <Badge variant="secondary" className="text-xs">
                  {subject} • {chapter}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Content List - with proper scroll container */}
          <ScrollArea className={cn("flex-1 min-h-0", isMobile ? "h-[50vh]" : "h-[280px]")}>
            <div className="p-2 space-y-1">
              {filteredContent.length > 0 ? (
                filteredContent.map((item) => (
                  <ContentItem
                    key={item.id}
                    item={item}
                    onSelect={() => handleLibrarySelect(item)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No content found</p>
                  <p className="text-xs">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* AI Tab */}
        <TabsContent value="ai" className="mt-0 p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Describe what you want to teach
            </label>
            <Textarea
              placeholder={`e.g., "Explain Newton's second law with real-world examples..."`}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />
          </div>
          
          {chapter && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Context:</span>
              <Badge variant="secondary" className="text-xs">
                {subject} • {chapter}
              </Badge>
            </div>
          )}
          
          <Button
            className="w-full gradient-button gap-2"
            onClick={handleAIGenerate}
            disabled={!aiPrompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </Button>
        </TabsContent>
        
        {/* Custom Tab */}
        <TabsContent value="custom" className="mt-0 p-4 space-y-4">
          {/* Input Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={inputMode === 'upload' ? 'default' : 'outline'}
              size="sm"
              className={cn("flex-1 h-9", inputMode === 'upload' && "gradient-button")}
              onClick={() => setInputMode('upload')}
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Upload File
            </Button>
            <Button
              variant={inputMode === 'link' ? 'default' : 'outline'}
              size="sm"
              className={cn("flex-1 h-9", inputMode === 'link' && "gradient-button")}
              onClick={() => setInputMode('link')}
            >
              <LinkIcon className="w-4 h-4 mr-1.5" />
              Add Link
            </Button>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Block Title {inputMode === 'link' && '(optional)'}
            </label>
            <Input
              placeholder="Enter title..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="h-10"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Duration (minutes)
            </label>
            <Input
              type="number"
              placeholder="10"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              className="h-10 w-28"
              min={1}
              max={60}
            />
          </div>
          
          {inputMode === 'upload' ? (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, PPT, DOC, MP4, Images
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Paste YouTube, Vimeo, or any URL..."
                  value={linkUrl}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              
              {linkUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Detected:</span>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", linkTypeBadges[detectedLinkType].className)}
                  >
                    {linkTypeBadges[detectedLinkType].label}
                  </Badge>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Supports: YouTube, Vimeo, Google Drive, Google Slides, or any iframe embed
              </p>
            </div>
          )}
          
          <Button
            className="w-full"
            onClick={handleCustomAdd}
            disabled={inputMode === 'upload' ? !customTitle.trim() : !linkUrl.trim()}
          >
            {inputMode === 'upload' ? (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Add Block
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 mr-2" />
                Add Link
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          <DrawerHeader className="pb-2 shrink-0">
            <DrawerTitle>Add {config.label} Block</DrawerTitle>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'library' 
                ? `${filteredContent.length} items available`
                : 'Choose a content source'}
            </p>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-hidden">
            {dialogContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 shrink-0">
          <DialogTitle className="text-lg">Add {config.label} Block</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {activeTab === 'library' 
              ? `${filteredContent.length} items available`
              : 'Choose a content source'}
          </p>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};
