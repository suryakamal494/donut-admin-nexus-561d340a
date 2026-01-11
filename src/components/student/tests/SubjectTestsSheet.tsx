// Subject Tests Sheet - Scalable test list with virtualization
// Opens when clicking a subject card, shows all tests with filters
// Enhanced with haptic feedback and swipe gestures for native mobile UX

import { memo, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Calculator, Atom, FlaskConical, Leaf, BookOpen, Code, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import CompactTestRow from "./CompactTestRow";
import TestStatusFilter from "./TestStatusFilter";
import type { StudentTest, TestStatus } from "@/data/student/tests";
import { getLiveTestsCount } from "@/data/student/tests";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  mathematics: Calculator,
  math: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  english: BookOpen,
  cs: Code,
};

// Color configurations
const colorConfig: Record<string, { gradient: string; shadow: string }> = {
  blue: { gradient: "from-blue-400 to-blue-600", shadow: "shadow-blue-400/30" },
  purple: { gradient: "from-violet-400 to-purple-600", shadow: "shadow-violet-400/30" },
  green: { gradient: "from-emerald-400 to-green-600", shadow: "shadow-emerald-400/30" },
  red: { gradient: "from-rose-400 to-red-500", shadow: "shadow-rose-400/30" },
  amber: { gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-400/30" },
  cyan: { gradient: "from-cyan-400 to-teal-500", shadow: "shadow-cyan-400/30" },
};

const subjectColorMap: Record<string, string> = {
  physics: "purple",
  chemistry: "green",
  mathematics: "blue",
  math: "blue",
  biology: "red",
  english: "amber",
  cs: "cyan",
};

// Filter order for swipe navigation
const filterOrder: (TestStatus | "all")[] = ["all", "live", "upcoming", "attempted", "missed"];

// Haptic feedback utility
const triggerHaptic = (duration: number = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(duration);
  }
};

interface SubjectTestsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  tests: StudentTest[];
}

type FilterStatus = TestStatus | "all";

const SubjectTestsSheet = memo(function SubjectTestsSheet({
  isOpen,
  onClose,
  subject,
  tests,
}: SubjectTestsSheetProps) {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const colorKey = subjectColorMap[subject.toLowerCase()] || "blue";
  const colors = colorConfig[colorKey];
  const Icon = iconMap[subject.toLowerCase()] || BookOpen;
  const displayName = subject.charAt(0).toUpperCase() + subject.slice(1);

  // Count by status
  const counts = useMemo(() => {
    const c: Record<FilterStatus, number> = {
      all: tests.length,
      live: 0,
      upcoming: 0,
      attempted: 0,
      missed: 0,
    };
    tests.forEach((t) => {
      c[t.status]++;
    });
    return c;
  }, [tests]);

  // Get available filters (filters with tests)
  const availableFilters = useMemo(() => {
    return filterOrder.filter((f) => f === "all" || counts[f] > 0);
  }, [counts]);

  // Filtered tests
  const filteredTests = useMemo(() => {
    if (filterStatus === "all") return tests;
    return tests.filter((t) => t.status === filterStatus);
  }, [tests, filterStatus]);

  // Sort: live first, then upcoming, then attempted, then missed
  const sortedTests = useMemo(() => {
    const order: Record<TestStatus, number> = {
      live: 0,
      upcoming: 1,
      attempted: 2,
      missed: 3,
    };
    return [...filteredTests].sort((a, b) => order[a.status] - order[b.status]);
  }, [filteredTests]);

  // Reset filter when sheet opens
  useEffect(() => {
    if (isOpen) {
      setFilterStatus("all");
      setSwipeDirection(null);
    }
  }, [isOpen]);

  // Virtualizer for test list
  const rowVirtualizer = useVirtualizer({
    count: sortedTests.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Each row is ~72px
    overscan: 5,
  });

  // Navigate to next/previous filter with haptic feedback
  const navigateFilter = useCallback((direction: "next" | "prev") => {
    const currentIndex = availableFilters.indexOf(filterStatus);
    let newIndex: number;

    if (direction === "next") {
      newIndex = currentIndex < availableFilters.length - 1 ? currentIndex + 1 : currentIndex;
      if (newIndex !== currentIndex) {
        setSwipeDirection("left");
        triggerHaptic(10);
      }
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
      if (newIndex !== currentIndex) {
        setSwipeDirection("right");
        triggerHaptic(10);
      }
    }

    if (newIndex !== currentIndex) {
      setFilterStatus(availableFilters[newIndex]);
    }
  }, [filterStatus, availableFilters]);

  // Handle swipe gestures
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 200;

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      if (info.offset.x > 0 || info.velocity.x > velocityThreshold) {
        // Swipe right - go to previous filter
        navigateFilter("prev");
      } else {
        // Swipe left - go to next filter
        navigateFilter("next");
      }
    }
  }, [navigateFilter]);

  // Handle filter change with haptic
  const handleFilterChange = useCallback((status: FilterStatus) => {
    const currentIndex = availableFilters.indexOf(filterStatus);
    const newIndex = availableFilters.indexOf(status);
    
    if (newIndex > currentIndex) {
      setSwipeDirection("left");
    } else if (newIndex < currentIndex) {
      setSwipeDirection("right");
    }
    
    triggerHaptic(5);
    setFilterStatus(status);
  }, [filterStatus, availableFilters]);

  const handleStartTest = useCallback((testId: string) => {
    triggerHaptic(15);
    navigate(`/student/tests/${testId}`);
    onClose();
  }, [navigate, onClose]);

  const handleViewTest = useCallback((testId: string) => {
    triggerHaptic(10);
    navigate(`/student/tests/${testId}`);
    onClose();
  }, [navigate, onClose]);

  const handleViewResults = useCallback((testId: string) => {
    triggerHaptic(10);
    navigate(`/student/tests/${testId}/results`);
    onClose();
  }, [navigate, onClose]);

  const liveCount = getLiveTestsCount(tests);
  const currentFilterIndex = availableFilters.indexOf(filterStatus);
  const canGoPrev = currentFilterIndex > 0;
  const canGoNext = currentFilterIndex < availableFilters.length - 1;

  // Animation variants for list content
  const listVariants = {
    enter: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      opacity: 0,
    }),
  };

  // Content to render in both Sheet and Drawer
  const sheetContent = (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
            colors.gradient,
            colors.shadow
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg text-foreground">{displayName} Tests</h2>
          <p className="text-xs text-muted-foreground">
            {tests.length} {tests.length === 1 ? "test" : "tests"}
            {liveCount > 0 && (
              <span className="text-rose-600 ml-1">• {liveCount} live now</span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Pills with swipe navigation hint */}
      <div className="relative mb-4">
        <TestStatusFilter
          selectedStatus={filterStatus}
          onStatusChange={handleFilterChange}
          counts={counts}
        />
        
        {/* Swipe navigation indicators */}
        <div className="flex justify-between mt-2 px-1">
          <button
            onClick={() => navigateFilter("prev")}
            disabled={!canGoPrev}
            className={cn(
              "flex items-center gap-0.5 text-[10px] transition-opacity",
              canGoPrev ? "text-muted-foreground hover:text-foreground" : "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <span className="text-[10px] text-muted-foreground/60">
            Swipe to filter
          </span>
          <button
            onClick={() => navigateFilter("next")}
            disabled={!canGoNext}
            className={cn(
              "flex items-center gap-0.5 text-[10px] transition-opacity",
              canGoNext ? "text-muted-foreground hover:text-foreground" : "opacity-0 pointer-events-none"
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Test List - Virtualized with swipe gestures */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="flex-1 touch-pan-y"
      >
        <div
          ref={parentRef}
          className="overflow-auto -mx-1 px-1"
          style={{ maxHeight: "calc(100vh - 320px)" }}
        >
          <AnimatePresence mode="wait" custom={swipeDirection}>
            <motion.div
              key={filterStatus}
              custom={swipeDirection}
              variants={listVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {sortedTests.length > 0 ? (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const test = sortedTests[virtualRow.index];
                    return (
                      <div
                        key={test.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          padding: "4px 0",
                        }}
                      >
                        <CompactTestRow
                          test={test}
                          onStart={handleStartTest}
                          onView={handleViewTest}
                          onResults={handleViewResults}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">No tests found</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Try selecting a different filter
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );

  // Use Drawer on mobile, Sheet on desktop
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{displayName} Tests</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{sheetContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>{displayName} Tests</SheetTitle>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
        {sheetContent}
      </SheetContent>
    </Sheet>
  );
});

export default SubjectTestsSheet;
