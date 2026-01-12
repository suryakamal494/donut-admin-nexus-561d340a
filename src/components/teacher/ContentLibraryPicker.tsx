import { useState, useMemo } from "react";
import { 
  Search, 
  Video, 
  FileText, 
  Presentation, 
  Play,
  Image as ImageIcon,
  Check
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'ppt' | 'animation' | 'image';
  subject: string;
  chapter?: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
}

// Mock content library data
const mockContentLibrary: ContentItem[] = [
  {
    id: "content-1",
    title: "Newton's Laws of Motion - Video Lecture",
    type: "video",
    subject: "Physics",
    chapter: "Laws of Motion",
    description: "Comprehensive video explaining all three laws with animations",
    duration: "12 mins",
  },
  {
    id: "content-2",
    title: "NCERT Physics - Laws of Motion Chapter",
    type: "pdf",
    subject: "Physics",
    chapter: "Laws of Motion",
    description: "Complete chapter PDF from NCERT Class 11 Physics",
  },
  {
    id: "content-3",
    title: "Forces & Motion - PhET Simulation",
    type: "animation",
    subject: "Physics",
    chapter: "Laws of Motion",
    description: "Interactive simulation for exploring forces and motion",
  },
  {
    id: "content-4",
    title: "Electromagnetic Induction - Slides",
    type: "ppt",
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    description: "Complete presentation on EM Induction",
  },
  {
    id: "content-5",
    title: "Periodic Table - Interactive Chart",
    type: "image",
    subject: "Chemistry",
    chapter: "Periodic Classification",
    description: "High-resolution periodic table with electron configurations",
  },
  {
    id: "content-6",
    title: "Chemical Bonding - Video Lecture",
    type: "video",
    subject: "Chemistry",
    chapter: "Chemical Bonding",
    description: "Explains ionic, covalent, and metallic bonding",
    duration: "18 mins",
  },
  {
    id: "content-7",
    title: "Quadratic Equations - Practice Set",
    type: "pdf",
    subject: "Mathematics",
    chapter: "Quadratic Equations",
    description: "50 practice problems with solutions",
  },
  {
    id: "content-8",
    title: "Trigonometry - Concept Video",
    type: "video",
    subject: "Mathematics",
    chapter: "Trigonometry",
    description: "Introduction to trigonometric ratios and identities",
    duration: "15 mins",
  },
];

const contentTypeConfig: Record<ContentItem['type'], { icon: typeof Video; color: string; bgColor: string }> = {
  video: { icon: Video, color: "text-red-600", bgColor: "bg-red-50" },
  pdf: { icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
  ppt: { icon: Presentation, color: "text-orange-600", bgColor: "bg-orange-50" },
  animation: { icon: Play, color: "text-green-600", bgColor: "bg-green-50" },
  image: { icon: ImageIcon, color: "text-purple-600", bgColor: "bg-purple-50" },
};

interface ContentLibraryPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (content: ContentItem) => void;
  subject?: string;
}

export const ContentLibraryPicker = ({
  open,
  onOpenChange,
  onSelect,
  subject,
}: ContentLibraryPickerProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ContentItem['type'] | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const filteredContent = useMemo(() => {
    return mockContentLibrary.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSubject = !subject || item.subject === subject;
      return matchesSearch && matchesType && matchesSubject;
    });
  }, [searchQuery, selectedType, subject]);

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
      setSearchQuery("");
    }
  };

  const PickerContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search content..."
          className="pl-10 h-10"
        />
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setSelectedType('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors",
            selectedType === 'all'
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          All
        </button>
        {Object.entries(contentTypeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type as ContentItem['type'])}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors",
                selectedType === type
                  ? `${config.bgColor} ${config.color}`
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <Icon className="w-3 h-3" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Content List */}
      <ScrollArea className={cn(isMobile ? "h-[45vh]" : "h-[40vh]")}>
        <div className="space-y-2 pr-2">
          {filteredContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No content found
            </div>
          ) : (
            filteredContent.map((item) => {
              const typeConfig = contentTypeConfig[item.type];
              const Icon = typeConfig.icon;
              const isSelected = selectedItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    typeConfig.bgColor
                  )}>
                    <Icon className={cn("w-5 h-5", typeConfig.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-foreground line-clamp-1">
                        {item.title}
                      </h4>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-xs py-0">
                        {item.chapter}
                      </Badge>
                      {item.duration && (
                        <span className="text-xs text-muted-foreground">
                          {item.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-10"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSelect}
          disabled={!selectedItem}
          className="flex-1 h-10"
        >
          Select Content
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2 border-b">
            <DrawerTitle>Select from Content Library</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <PickerContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Select from Content Library</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-4">
          <PickerContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};
