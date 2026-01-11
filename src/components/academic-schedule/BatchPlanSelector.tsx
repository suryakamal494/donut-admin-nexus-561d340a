// Batch Plan Selector Component
// Dropdown for selecting a batch with smart grouping and status badges

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { batches as allBatches } from "@/data/instituteData";
import { cn } from "@/lib/utils";

interface BatchPlanSelectorProps {
  selectedBatchId: string | null;
  onBatchChange: (batchId: string) => void;
  planStatus?: Record<string, 'draft' | 'published' | 'none'>;
  disabled?: boolean;
}

export function BatchPlanSelector({
  selectedBatchId,
  onBatchChange,
  planStatus = {},
  disabled = false,
}: BatchPlanSelectorProps) {
  // Group batches by class
  const groupedBatches = useMemo(() => {
    const groups: Record<string, typeof allBatches> = {};
    
    allBatches.forEach(batch => {
      const className = batch.className || `Class ${batch.classId}`;
      if (!groups[className]) {
        groups[className] = [];
      }
      groups[className].push(batch);
    });
    
    // Sort by class number
    return Object.entries(groups).sort((a, b) => {
      const numA = parseInt(a[0].replace(/\D/g, '')) || 0;
      const numB = parseInt(b[0].replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, []);

  const selectedBatch = allBatches.find(b => b.id === selectedBatchId);

  const getStatusBadge = (batchId: string) => {
    const status = planStatus[batchId] || 'none';
    
    switch (status) {
      case 'published':
        return (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700">
            Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700">
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Select
      value={selectedBatchId || undefined}
      onValueChange={onBatchChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full sm:w-[280px] h-9">
        <SelectValue placeholder="Select a batch...">
          {selectedBatch && (
            <span className="flex items-center gap-2">
              <span>{selectedBatch.className} - {selectedBatch.name}</span>
              {getStatusBadge(selectedBatch.id)}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {groupedBatches.map(([className, batchList]) => (
          <SelectGroup key={className}>
            <SelectLabel className="text-xs text-muted-foreground font-semibold">
              {className}
            </SelectLabel>
            {batchList.map(batch => (
              <SelectItem 
                key={batch.id} 
                value={batch.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 w-full">
                  <span>{batch.name}</span>
                  <span className="text-muted-foreground text-xs">
                    ({batch.studentCount} students)
                  </span>
                  <div className="ml-auto">
                    {getStatusBadge(batch.id)}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
