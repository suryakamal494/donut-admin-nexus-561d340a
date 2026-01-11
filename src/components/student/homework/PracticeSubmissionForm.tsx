// Practice Submission Form - File upload, text answer, or link submission

import { memo, useState, useCallback } from "react";
import { Upload, FileText, Link2, X, Camera, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type SubmissionMode = 'file' | 'text' | 'link';

interface PracticeSubmissionFormProps {
  onSubmit: (data: {
    mode: SubmissionMode;
    files?: File[];
    text?: string;
    link?: string;
  }) => void;
  isSubmitting?: boolean;
  className?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Haptic feedback helper
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

export const PracticeSubmissionForm = memo(function PracticeSubmissionForm({
  onSubmit,
  isSubmitting = false,
  className,
}: PracticeSubmissionFormProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<SubmissionMode>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');

  const handleModeChange = useCallback((newMode: SubmissionMode) => {
    triggerHaptic();
    setMode(newMode);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format`,
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
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    triggerHaptic();
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    triggerHaptic();
    
    if (mode === 'file' && files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file",
        variant: "destructive",
      });
      return;
    }
    
    if (mode === 'text' && text.trim().length < 10) {
      toast({
        title: "Answer too short",
        description: "Please write at least 10 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (mode === 'link' && !link.trim()) {
      toast({
        title: "No link provided",
        description: "Please paste a valid URL",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      mode,
      files: mode === 'file' ? files : undefined,
      text: mode === 'text' ? text : undefined,
      link: mode === 'link' ? link : undefined,
    });
  }, [mode, files, text, link, onSubmit, toast]);

  const modeButtons = [
    { id: 'file' as const, icon: Upload, label: 'Upload File' },
    { id: 'text' as const, icon: FileText, label: 'Write Answer' },
    { id: 'link' as const, icon: Link2, label: 'Paste Link' },
  ];

  const canSubmit = 
    (mode === 'file' && files.length > 0) ||
    (mode === 'text' && text.trim().length >= 10) ||
    (mode === 'link' && link.trim().length > 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Selector */}
      <div className="flex gap-2">
        {modeButtons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg border transition-all",
              "active:scale-[0.97]",
              mode === id
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* File Upload Mode */}
      {mode === 'file' && (
        <div className="space-y-3">
          {/* Upload Zone */}
          <label className={cn(
            "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
            "hover:bg-muted/30 hover:border-primary/50",
            files.length > 0 ? "border-primary/30 bg-primary/5" : "border-muted-foreground/30"
          )}>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="p-2 rounded-full bg-amber-500/10">
                <Camera className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Tap to upload or take photo</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                PDF, JPG, PNG, DOC (max 10MB)
              </p>
            </div>
          </label>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border"
                >
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Text Answer Mode */}
      {mode === 'text' && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write your answer here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px] resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimum 10 characters</span>
            <span className={cn(
              text.length >= 10 ? "text-emerald-600" : ""
            )}>
              {text.length} characters
            </span>
          </div>
        </div>
      )}

      {/* Link Mode */}
      {mode === 'link' && (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            Paste a link to your work (Google Docs, Drive, Canva, etc.)
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        className="w-full h-12 text-base font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Submit Homework
          </>
        )}
      </Button>
    </div>
  );
});

PracticeSubmissionForm.displayName = "PracticeSubmissionForm";
export default PracticeSubmissionForm;
