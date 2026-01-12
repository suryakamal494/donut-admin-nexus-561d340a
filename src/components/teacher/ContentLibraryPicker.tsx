import { useState, useMemo, useCallback } from "react";
import { 
  Search, 
  Check,
  ChevronLeft,
  ChevronRight,
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
import { 
  mockContentLibrary, 
  contentTypeConfig, 
  ITEMS_PER_PAGE,
  type ContentItem 
} from "@/data/contentLibraryData";

// Re-export ContentItem for external usage
export type { ContentItem };

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
  const [currentPage, setCurrentPage] = useState(1);

  // Filter content
  const filteredContent = useMemo(() => {
    return mockContentLibrary.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSubject = !subject || item.subject === subject;
      return matchesSearch && matchesType && matchesSubject;
    });
  }, [searchQuery, selectedType, subject]);

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredContent, currentPage]);

  // Reset page when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleTypeChange = useCallback((type: ContentItem['type'] | 'all') => {
    setSelectedType(type);
    setCurrentPage(1);
  }, []);

  const handleSelect = useCallback(() => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [selectedItem, onSelect]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const PickerContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search content..."
          className="pl-10 h-10"
        />
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => handleTypeChange('all')}
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
              onClick={() => handleTypeChange(type as ContentItem['type'])}
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
      <ScrollArea className={cn(isMobile ? "h-[40vh]" : "h-[35vh]")}>
        <div className="space-y-2 pr-2">
          {paginatedContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No content found
            </div>
          ) : (
            paginatedContent.map((item) => {
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages} ({filteredContent.length} items)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-2"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}

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
