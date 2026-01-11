import { memo } from "react";
import { Eye, Edit, MoreVertical, Download, Trash2, Lock, Building2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentThumbnail } from "./ContentThumbnail";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { getContentTypeLabel, ContentType } from "./ContentTypeIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubjectBadge } from "@/components/subject";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ContentCardMode = "superadmin" | "institute" | "teacher";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId: string;
  topic: string;
  topicId?: string;
  classId: string;
  className: string;
  description: string;
  duration?: number;
  size?: string;
  url: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  visibility: "public" | "private" | "restricted";
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  viewCount: number;
  downloadCount: number;
  source?: "global" | "institute" | "teacher";
  instituteId?: string;
  createdByTeacherId?: string;
}

interface ContentCardProps {
  content: ContentItem;
  mode?: ContentCardMode;
  currentTeacherId?: string; // For teacher mode - to check if content belongs to current teacher
  onPreview: (content: ContentItem) => void;
  onEdit?: (content: ContentItem) => void;
  onDelete?: (content: ContentItem) => void;
  onAssign?: (content: ContentItem) => void; // For teacher mode - to share content with batches
  className?: string;
}

export const ContentCard = memo(function ContentCard({ 
  content, 
  mode = "superadmin",
  currentTeacherId,
  onPreview, 
  onEdit, 
  onDelete,
  onAssign,
  className 
}: ContentCardProps) {
  const meta = content.duration 
    ? `${content.duration} min` 
    : content.size || getContentTypeLabel(content.type);

  // Mode-specific logic
  const isInstituteMode = mode === "institute";
  const isTeacherMode = mode === "teacher";
  
  // For teacher mode: only allow edit/delete for content created by current teacher
  const isTeacherOwned = isTeacherMode && content.source === "teacher" && content.createdByTeacherId === currentTeacherId;
  
  // For institute mode: only allow edit/delete for institute content (not global)
  const isGlobal = (isInstituteMode || isTeacherMode) && content.source === "global";
  const isInstitute = content.source === "institute";
  
  // Determine if edit/delete are allowed
  const canEdit = isTeacherMode 
    ? isTeacherOwned && onEdit 
    : isInstituteMode 
      ? !isGlobal && onEdit 
      : !!onEdit;
  const canDelete = isTeacherMode 
    ? isTeacherOwned && onDelete 
    : isInstituteMode 
      ? !isGlobal && onDelete 
      : !!onDelete;

  return (
    <div className={cn(
      "bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden hover-lift transition-all duration-300 relative group",
      className
    )}>
      {/* Thumbnail with source badge overlay for institute mode */}
      <div className="relative">
        <ContentThumbnail 
          type={content.type} 
          thumbnailUrl={content.thumbnailUrl}
          title={content.title}
        />
        
        {/* Source Badge - Institute Mode or Teacher Mode */}
        {(isInstituteMode || isTeacherMode) && (
          <div className="absolute top-2 right-2">
            <Badge 
              variant="outline" 
              className={cn(
                "gap-1 text-xs font-medium backdrop-blur-sm",
                isGlobal 
                  ? "bg-blue-500/90 text-white border-blue-400" 
                  : content.source === "teacher"
                    ? "bg-teal-500/90 text-white border-teal-400"
                    : "bg-amber-500/90 text-white border-amber-400"
              )}
            >
              {isGlobal ? <Lock className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
              {isGlobal ? "Global" : content.source === "teacher" ? "My Content" : "Institute"}
            </Badge>
          </div>
        )}
        
        {/* Lock overlay for global content on hover - Institute/Teacher Mode */}
        {(isInstituteMode || isTeacherMode) && isGlobal && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white/90 rounded-full p-3">
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">This content is from the global library and cannot be edited</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight">{content.title}</h3>
          <ContentStatusBadge status={content.status} />
        </div>
        
        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{content.description}</p>
        
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <SubjectBadge subject={content.subject} size="xs" />
          <span className="text-[10px] sm:text-xs text-muted-foreground">{content.className}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">•</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{meta}</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>{content.viewCount.toLocaleString()}</span>
          {content.downloadCount > 0 && (
            <>
              <span>•</span>
              <Download className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{content.downloadCount.toLocaleString()}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 pt-2 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs px-1.5 sm:px-2"
            onClick={() => onPreview(content)}
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1.5" />
            Preview
          </Button>
          
          {/* Assign button - Teacher mode only */}
          {isTeacherMode && onAssign && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 sm:h-8 text-[10px] sm:text-xs px-1.5 sm:px-2"
              onClick={() => onAssign(content)}
            >
              <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1.5" />
              Assign
            </Button>
          )}
          
          {canEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 sm:h-8 text-[10px] sm:text-xs px-1.5 sm:px-2"
              onClick={() => onEdit?.(content)}
            >
              <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1.5" />
              Edit
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={() => onPreview(content)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              {isTeacherMode && onAssign && (
                <DropdownMenuItem onClick={() => onAssign(content)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Assign to Batches
                </DropdownMenuItem>
              )}
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit?.(content)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.(content)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});
