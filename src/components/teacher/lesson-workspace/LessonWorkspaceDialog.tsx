/**
 * LessonWorkspaceDialog - Reusable responsive dialog for lesson workspace
 * Uses Drawer on mobile with swipe-to-dismiss, Dialog on desktop
 */
import * as React from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LessonWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Mobile ScrollArea height - default: "h-[50vh]" */
  mobileScrollHeight?: string;
  /** Desktop ScrollArea height - default: "h-[280px]" */
  desktopScrollHeight?: string;
  /** Enable swipe-to-dismiss on mobile - default: true */
  enableSwipeToClose?: boolean;
  /** Max width for desktop dialog - default: "max-w-md" */
  maxWidth?: string;
  /** Called when dialog is closed (after animation) */
  onClose?: () => void;
}

export function LessonWorkspaceDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  mobileScrollHeight = "h-[50vh]",
  desktopScrollHeight = "h-[280px]",
  enableSwipeToClose = true,
  maxWidth = "max-w-md",
  onClose,
}: LessonWorkspaceDialogProps) {
  const isMobile = useIsMobile();
  const controls = useAnimation();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && onClose) {
      onClose();
    }
    onOpenChange(isOpen);
  };

  // Haptic feedback helper (10ms vibration)
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!enableSwipeToClose) return;
    
    // Close if swiped down more than 100px or with high velocity
    if (info.offset.y > 100 || info.velocity.y > 500) {
      triggerHaptic();
      controls.start({ y: "100%" }).then(() => {
        handleOpenChange(false);
      });
    } else {
      // Snap back to original position
      controls.start({ y: 0 });
    }
  };

  // Mobile Drawer with swipe gesture
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className={cn("max-h-[85vh]", className)}>
          {enableSwipeToClose ? (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              animate={controls}
              className="flex flex-col"
            >
              <DrawerHeader className="pb-2">
                <DrawerTitle>{title}</DrawerTitle>
                {description && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </DrawerHeader>
              
              <ScrollArea className={cn("px-0", mobileScrollHeight)}>
                {children}
              </ScrollArea>
              
              {footer}
            </motion.div>
          ) : (
            <>
              <DrawerHeader className="pb-2">
                <DrawerTitle>{title}</DrawerTitle>
                {description && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </DrawerHeader>
              
              <ScrollArea className={cn("px-0", mobileScrollHeight)}>
                {children}
              </ScrollArea>
              
              {footer}
            </>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(maxWidth, "p-0", className)}>
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className={cn("px-0", desktopScrollHeight)}>
          {children}
        </ScrollArea>
        
        {footer}
      </DialogContent>
    </Dialog>
  );
}

// Export types for consumers
export type { LessonWorkspaceDialogProps };
