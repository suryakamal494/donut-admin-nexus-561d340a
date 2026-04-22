import { useState, useCallback, useRef } from "react";

interface UseSwipeTabsOptions<T extends string> {
  tabs: T[];
  initialTab: T;
  onTabChange?: (tab: T) => void;
}

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_MAX_Y = 80; // ignore if vertical swipe exceeds this

export function useSwipeTabs<T extends string>({
  tabs,
  initialTab,
  onTabChange,
}: UseSwipeTabsOptions<T>) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef(0);

  const goTo = useCallback(
    (tab: T) => {
      setActiveTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  const swipeHandlers: SwipeHandlers = {
    onTouchStart: (e) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      touchDelta.current = 0;
    },
    onTouchMove: (e) => {
      if (!touchStart.current) return;
      touchDelta.current = e.touches[0].clientX - touchStart.current.x;
    },
    onTouchEnd: () => {
      if (!touchStart.current) return;
      const deltaX = touchDelta.current;
      const idx = tabs.indexOf(activeTab);

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0 && idx < tabs.length - 1) {
          goTo(tabs[idx + 1]);
        } else if (deltaX > 0 && idx > 0) {
          goTo(tabs[idx - 1]);
        }
      }

      touchStart.current = null;
      touchDelta.current = 0;
    },
  };

  return { activeTab, setActiveTab: goTo, swipeHandlers };
}