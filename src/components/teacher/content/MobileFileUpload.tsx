/**
 * Mobile-optimized File Upload Component
 * Large touch targets, native file picker, drag-and-drop on desktop
 */

import { useState, useRef, useCallback } from "react";
import { Upload, File, X, Image, Video, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MobileFileUploadProps {
  contentType: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  onUrlChange?: (url: string) => void;
  externalUrl?: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("image/")) return Image;
  return FileText;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function MobileFileUpload({
  contentType,
  accept,
  onFileSelect,
  onUrlChange,
  externalUrl = "",
}: MobileFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [url, setUrl] = useState(externalUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0] || null;
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onUrlChange?.(value);
  };

  // External URL input for iframe type
  if (contentType === "iframe") {
    return (
      <div className="space-y-3">
        <Label>External URL</Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Paste a URL from YouTube, Vimeo, Google Slides, or any embeddable content
        </p>
        {url && (
          <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-muted-foreground shrink-0" />
            <span className="text-sm truncate flex-1">{url}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => handleUrlChange("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // File upload area
  return (
    <div className="space-y-3">
      <Label>Upload File</Label>
      
      {selectedFile ? (
        // Selected file preview
        <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            {(() => {
              const FileIcon = getFileIcon(selectedFile.type);
              return <FileIcon className="w-6 h-6 text-primary" />;
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={handleRemoveFile}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        // Upload zone
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
            "min-h-[180px] flex flex-col items-center justify-center gap-3",
            "active:scale-[0.99]",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            isDragOver ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragOver ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isDragOver ? "Drop your file here" : "Tap to upload"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or drag and drop your file
            </p>
          </div>
          <p className="text-xs text-muted-foreground px-4">
            Supported: {accept || "Any file type"}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        // Allow camera capture on mobile
        capture={contentType === "video" ? "environment" : undefined}
      />
    </div>
  );
}
