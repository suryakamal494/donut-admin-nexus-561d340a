import { Plus, GraduationCap, BookOpen, Layers, FileText, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickAddMenuProps {
  onAddClass?: () => void;
  onAddCurriculum?: () => void;
  onAddSubject?: () => void;
  onAddChapter?: () => void;
  onAddTopic?: () => void;
}

export const QuickAddMenu = ({
  onAddClass,
  onAddCurriculum,
  onAddSubject,
  onAddChapter,
  onAddTopic,
}: QuickAddMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gradient-button gap-2">
          <Plus className="w-4 h-4" />
          Quick Add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onAddClass} className="gap-2 cursor-pointer">
          <GraduationCap className="w-4 h-4" />
          Add Class
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCurriculum} className="gap-2 cursor-pointer">
          <FolderTree className="w-4 h-4" />
          Add Curriculum
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddSubject} className="gap-2 cursor-pointer">
          <BookOpen className="w-4 h-4" />
          Add Subject
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onAddChapter} className="gap-2 cursor-pointer">
          <Layers className="w-4 h-4" />
          Add Chapter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddTopic} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4" />
          Add Topic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
