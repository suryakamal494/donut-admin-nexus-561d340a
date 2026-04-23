import { Play } from "lucide-react";

interface Props {
  duration: string;
  onClick: () => void;
}

export function WrongAnswerVideoButton({ duration, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[hsl(12,85%,62%)] to-[hsl(25,90%,58%)] text-white text-[11px] font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
    >
      <Play className="w-3 h-3 fill-current" />
      Watch Explanation ({duration})
    </button>
  );
}