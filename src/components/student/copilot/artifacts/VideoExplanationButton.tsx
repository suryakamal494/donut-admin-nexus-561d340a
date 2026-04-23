import { Play } from "lucide-react";

interface Props {
  duration?: string;
  onClick: () => void;
}

export function VideoExplanationButton({ duration, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[hsl(12,85%,62%)] to-[hsl(25,90%,58%)] text-white text-[9px] font-semibold hover:opacity-90 active:scale-95 transition-all"
    >
      <Play className="w-2.5 h-2.5 fill-current" />
      {duration || "Watch"}
    </button>
  );
}