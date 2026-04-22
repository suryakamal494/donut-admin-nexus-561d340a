// Student Copilot — Chat Pane (center panel)
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Paperclip, Menu, PanelRight, Sparkles, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import MathMarkdown from "./MathMarkdown";
import { splitStoredContent } from "./chatHelpers";
import type { StudentThread, StudentMessage, StudentRoutine, StudentArtifact } from "./types";

interface Props {
  thread: StudentThread | null;
  routine: StudentRoutine | null;
  messages: StudentMessage[];
  streaming: boolean;
  streamedText: string;
  pendingArtifact: boolean;
  artifacts: StudentArtifact[];
  onSend: (text: string, images?: string[]) => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  quickStartChips?: string[];
}

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const StudentChatPane: React.FC<Props> = ({
  thread,
  routine,
  messages,
  streaming,
  streamedText,
  pendingArtifact,
  artifacts,
  onSend,
  onToggleLeft,
  onToggleRight,
  quickStartChips,
}) => {
  const [input, setInput] = useState("");
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages.length, streamedText]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed && attachedImages.length === 0) return;
    if (streaming) return;
    onSend(trimmed, attachedImages.length > 0 ? attachedImages : undefined);
    setInput("");
    setAttachedImages([]);
  }, [input, attachedImages, streaming, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      if (attachedImages.length >= MAX_IMAGES) break;
      if (file.size > MAX_IMAGE_SIZE) continue;
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImages((prev) =>
          prev.length < MAX_IMAGES ? [...prev, reader.result as string] : prev
        );
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    for (const file of files) {
      if (attachedImages.length >= MAX_IMAGES) break;
      if (file.size > MAX_IMAGE_SIZE) continue;
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImages((prev) =>
          prev.length < MAX_IMAGES ? [...prev, reader.result as string] : prev
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    for (const item of items) {
      if (item.type.startsWith("image/") && attachedImages.length < MAX_IMAGES) {
        const file = item.getAsFile();
        if (!file || file.size > MAX_IMAGE_SIZE) continue;
        const reader = new FileReader();
        reader.onload = () => {
          setAttachedImages((prev) =>
            prev.length < MAX_IMAGES ? [...prev, reader.result as string] : prev
          );
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // No thread selected — welcome screen
  if (!thread) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 px-3 border-b flex items-center justify-between bg-card/30 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onToggleLeft} className="h-8 px-2">
            <Menu className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleRight} className="h-8 px-2 hidden lg:inline-flex">
            <PanelRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome back! 👋</h2>
            <p className="text-sm text-muted-foreground">
              Start a new chat, practice, or plan your study roadmap.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="h-12 px-3 border-b flex items-center justify-between bg-card/30 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="sm" onClick={onToggleLeft} className="h-8 px-2 lg:hidden">
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5 min-w-0">
            {routine && (
              <span className="text-xs font-medium text-donut-coral bg-donut-coral/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                {routine.label}
              </span>
            )}
            <span className="text-sm font-medium truncate">{thread.title}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggleRight} className="h-8 px-2 hidden lg:inline-flex">
          <PanelRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Empty thread — quick start chips */}
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-10 h-10 text-donut-coral mb-3" />
            {routine && (
              <>
                <h3 className="text-lg font-semibold mb-1">{routine.label}</h3>
                {routine.description && (
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
                    {routine.description}
                  </p>
                )}
              </>
            )}
            {quickStartChips && quickStartChips.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {quickStartChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => onSend(chip)}
                    className="px-3 py-1.5 rounded-full border text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => {
          const { text, images } = splitStoredContent(msg.content);
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={cn(
                "flex",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-2.5",
                  isUser
                    ? "bg-gradient-to-br from-donut-coral to-donut-orange text-white rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}
              >
                {images.length > 0 && (
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Attached"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                {isUser ? (
                  <p className="text-sm whitespace-pre-wrap">{text}</p>
                ) : (
                  <MathMarkdown compact className={cn(!isUser && "text-foreground")}>
                    {text}
                  </MathMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {/* Streaming bubble */}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
              {streamedText ? (
                <MathMarkdown compact>{streamedText}</MathMarkdown>
              ) : (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-2 h-2 rounded-full bg-donut-coral animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-donut-coral animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-donut-coral animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pending artifact skeleton */}
        {pendingArtifact && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-donut-coral/30 bg-donut-coral/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-donut-coral">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating artifact…
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t bg-background p-3">
        {/* Image previews */}
        {attachedImages.length > 0 && (
          <div className="flex gap-2 mb-2">
            {attachedImages.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-14 h-14 object-cover rounded-lg" />
                <button
                  onClick={() => setAttachedImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0"
            onClick={() => fileRef.current?.click()}
            disabled={attachedImages.length >= MAX_IMAGES}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask a doubt, request practice…"
            className="min-h-[40px] max-h-[120px] resize-none text-sm rounded-xl"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && attachedImages.length === 0) || streaming}
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0 bg-gradient-to-r from-donut-coral to-donut-orange text-white hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudentChatPane);