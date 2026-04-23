import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  title?: string;
}

export function VideoPlayerModal({ open, onOpenChange, videoUrl, title }: Props) {
  const [error, setError] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden bg-black border-none rounded-2xl">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title bar */}
          {title && (
            <div className="absolute top-3 left-4 z-10 text-white/80 text-xs font-medium bg-black/40 px-3 py-1 rounded-full">
              {title}
            </div>
          )}

          {error ? (
            <div className="flex items-center justify-center h-[50vh] text-white/60 text-sm">
              Video could not be loaded. Please try again.
            </div>
          ) : (
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              className="w-full aspect-video"
              onError={() => setError(true)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}