/**
 * Content Creation Bottom Sheet / Dialog
 * Mobile-first entry point for content creation
 * Shows two options: Upload from Device or Generate with AI
 */

import { Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface ContentCreationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const creationOptions = [
  {
    id: "upload",
    title: "Upload from Device",
    description: "Upload videos, documents, or paste URLs from YouTube, Google Slides, etc.",
    icon: Upload,
    route: "/teacher/content/create",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "ai",
    title: "Generate with AI",
    description: "Create presentations and slides automatically using AI assistance",
    icon: Sparkles,
    route: "/teacher/content/ai-generate",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];

export function ContentCreationSheet({ open, onOpenChange }: ContentCreationSheetProps) {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOptionClick = (route: string) => {
    onOpenChange(false);
    navigate(route);
  };

  const Content = () => (
    <div className="space-y-4 px-1">
      {creationOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => handleOptionClick(option.route)}
          data-tour={`create-${option.id}`}
          className={cn(
            "w-full flex items-start gap-4 p-4 rounded-xl border transition-all",
            "hover:shadow-md active:scale-[0.98]",
            option.bgColor,
            option.borderColor
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            option.bgColor
          )}>
            <option.icon className={cn("w-6 h-6", option.color)} />
          </div>
          <div className="text-left min-w-0">
            <h3 className="font-semibold text-foreground">{option.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );

  // Render as Dialog on desktop, Drawer on mobile
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Content</DialogTitle>
            <DialogDescription>
              Choose how you'd like to add new content to your library
            </DialogDescription>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Content</DrawerTitle>
          <DrawerDescription>
            Choose how you'd like to add new content
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <Content />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
