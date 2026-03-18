import { useState, useMemo, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { flattenDocsNavigation } from "@/data/docsNavigation";

interface DocsSearchProps {
  className?: string;
}

export function DocsSearch({ className }: DocsSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const navigate = useNavigate();
  const allDocs = useMemo(() => flattenDocsNavigation(), []);

  const fuse = useMemo(
    () =>
      new Fuse(allDocs, {
        keys: ["title", "section"],
        threshold: 0.3,
        includeScore: true,
      }),
    [allDocs]
  );

  const results = useMemo(() => {
    if (!query.trim()) return allDocs.slice(0, 8);
    return fuse.search(query).map((r) => r.item).slice(0, 10);
  }, [query, fuse, allDocs]);

  const handleSelect = useCallback(
    (path: string) => {
      navigate(`/docs/${path}`);
      setOpen(false);
      setQuery("");
    },
    [navigate]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`relative flex items-center cursor-pointer ${className}`}
          onClick={() => setOpen(true)}
        >
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 pr-12 h-9 w-full text-sm bg-background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
          />
          <kbd className="absolute right-2 pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] md:w-[400px] p-0 bg-popover z-50"
        align="end"
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder="Search docs..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No documentation found.</CommandEmpty>
            <CommandGroup heading="Documentation">
              {results.map((doc) => (
                <CommandItem
                  key={doc.path}
                  value={doc.path}
                  onSelect={() => handleSelect(doc.path)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate">{doc.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {doc.section}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
