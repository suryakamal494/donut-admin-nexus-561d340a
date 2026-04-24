import { Sparkles, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  "AI-drafted lesson plans",
  "Auto-remediation worksheets",
  "Banded homework in one click",
];

export default function UnlockCopilotCard() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-violet-500/10 border-violet-200/60 shadow-lg shadow-violet-500/5">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 rounded-full blur-2xl" />
      <CardContent className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              Unlock AI Assistant
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Let Copilot do the heavy prep — you review and send.
            </p>
          </div>
        </div>

        <ul className="mt-3 space-y-1.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-xs text-foreground/80">
              <span className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-violet-700" />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <Button
          size="sm"
          className="mt-3 sm:mt-4 w-full h-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 shadow-md shadow-violet-500/25"
        >
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );
}