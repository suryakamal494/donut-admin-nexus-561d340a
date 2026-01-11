// Project Submission Form - Multi-file upload with description

import { memo, useState, useCallback } from "react";
import { Upload, FileText, X, Check, Loader2, File, Image, Video, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProjectSubmissionFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    files: File[];
  }) => void;
  isSubmitting?: boolean;
  className?: string;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB per file for projects

// Haptic feedback helper
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

// Get file icon based on type
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.includes('zip') || type.includes('rar')) return FileArchive;
  return FileText;
};

// Get file type badge
const getFileTypeBadge = (type: string): { label: string; color: string } => {
  if (type.includes('pdf')) return { label: 'PDF', color: 'bg-red-100 text-red-700' };
  if (type.includes('presentation') || type.includes('ppt')) return { label: 'PPT', color: 'bg-orange-100 text-orange-700' };
  if (type.includes('word') || type.includes('document')) return { label: 'DOC', color: 'bg-blue-100 text-blue-700' };
  if (type.startsWith('image/')) return { label: 'IMG', color: 'bg-purple-100 text-purple-700' };
  if (type.startsWith('video/')) return { label: 'VID', color: 'bg-pink-100 text-pink-700' };
  if (type.includes('zip') || type.includes('rar')) return { label: 'ZIP', color: 'bg-amber-100 text-amber-700' };
  return { label: 'FILE', color: 'bg-slate-100 text-slate-700' };
};

export const ProjectSubmissionForm = memo(function ProjectSubmissionForm({
  onSubmit,
  isSubmitting = false,
  className,
}: ProjectSubmissionFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: `Maximum ${MAX_FILES} files allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate files
    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 25MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      triggerHaptic();
      setFiles(prev => [...prev, ...validFiles]);
    }
  }, [files.length, toast]);

  const removeFile = useCallback((index: number) => {
    triggerHaptic();
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    triggerHaptic();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a project title",
        variant: "destructive",
      });
      return;
    }

    if (description.trim().length < 50) {
      toast({
        title: "Description too short",
        description: "Please write at least 50 characters describing your project",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one file",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ title, description, files });
  }, [title, description, files, onSubmit, toast]);

  const canSubmit = title.trim() && description.trim().length >= 50 && files.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Project Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Project Title</label>
        <Input
          placeholder="Enter your project title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="h-11"
        />
      </div>

      {/* Project Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Project Description</label>
        <Textarea
          placeholder="Describe your project, methodology, and key findings..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Minimum 50 characters</span>
          <span className={cn(
            description.length >= 50 ? "text-emerald-600" : ""
          )}>
            {description.length} / 50
          </span>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Project Files</label>
          <span className="text-xs text-muted-foreground">
            {files.length} / {MAX_FILES} files
          </span>
        </div>

        {/* Upload Zone */}
        {files.length < MAX_FILES && (
          <label className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
            "hover:bg-muted/30 hover:border-primary/50",
            "border-muted-foreground/30"
          )}>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <Upload className="w-6 h-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">Add project files</p>
              <p className="text-xs text-muted-foreground">
                PPT, PDF, DOC, Images, Videos (max 25MB each)
              </p>
            </div>
          </label>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, idx) => {
              const FileIcon = getFileIcon(file.type);
              const badge = getFileTypeBadge(file.type);
              
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-white rounded-lg border"
                >
                  <div className="p-1.5 rounded bg-muted/50">
                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    badge.color
                  )}>
                    {badge.label}
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        className="w-full h-12 text-base font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading Project...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Submit Project
          </>
        )}
      </Button>
    </div>
  );
});

ProjectSubmissionForm.displayName = "ProjectSubmissionForm";
export default ProjectSubmissionForm;
