import { useState, useMemo, useCallback } from "react";
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
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-9 w-full md:w-64 bg-background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] md:w-[400px] p-0 bg-popover z-50" 
        align="start"
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
                  <div className="flex flex-col">
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-xs text-muted-foreground">
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
