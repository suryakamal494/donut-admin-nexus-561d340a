// Test Search Bar - Quick search across all tests
// Mobile-optimized with clear button and focus states

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TestSearchBar = memo(function TestSearchBar({
  value,
  onChange,
  placeholder = "Search tests...",
  className,
}: TestSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear
      if (e.key === "Escape" && value) {
        handleClear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, handleClear]);

  return (
    <div
      className={cn(
        "relative flex items-center",
        "bg-white/70 backdrop-blur-xl rounded-2xl border transition-all duration-200",
        isFocused
          ? "border-donut-orange/50 shadow-lg shadow-donut-orange/10"
          : "border-white/50 shadow-sm",
        className
      )}
    >
      {/* Search Icon */}
      <div className="absolute left-3 pointer-events-none">
        <Search
          className={cn(
            "w-4 h-4 transition-colors",
            isFocused ? "text-donut-orange" : "text-muted-foreground"
          )}
        />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-9 pr-9 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60",
          "focus:outline-none"
        )}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      )}

      {/* Keyboard Shortcut Hint (desktop only) */}
      {!value && !isFocused && (
        <div className="absolute right-3 hidden sm:flex items-center gap-0.5 pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] text-muted-foreground/60 bg-muted/30 rounded border border-muted/30">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
});

export default TestSearchBar;
