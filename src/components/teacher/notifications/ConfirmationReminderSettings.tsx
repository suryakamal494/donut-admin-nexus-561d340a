/**
 * Confirmation Reminder Settings Component
 * Allows teachers to configure reminders for pending teaching confirmations
 */

import { useState } from "react";
import { 
  Clock, 
  Bell, 
  BellRing,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ListChecks
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface ConfirmationReminderSettingsProps {
  className?: string;
  pendingCount?: number;
  onNavigateToConfirm?: () => void;
}

export const ConfirmationReminderSettings = ({ 
  className, 
  pendingCount = 0,
  onNavigateToConfirm 
}: ConfirmationReminderSettingsProps) => {
  // UI state only - no real functionality
  const [isEnabled, setIsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState<'end_of_day' | 'next_morning' | 'custom'>('end_of_day');
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-white to-amber-50/30 border-amber-100/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl",
              isEnabled 
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25" 
                : "bg-slate-100 text-slate-500"
            )}>
              {isEnabled ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-base">Confirmation Reminders</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Get reminded about unconfirmed teaching sessions
              </CardDescription>
            </div>
          </div>
          <Badge 
            className={cn(
              "border-0",
              isEnabled 
                ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700" 
                : "bg-slate-100 text-slate-600"
            )}
          >
            {isEnabled ? 'Active' : 'Off'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pending confirmations alert */}
        {pendingCount > 0 && (
          <div 
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-100/80 to-orange-100/60 border border-amber-200/50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onNavigateToConfirm}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-amber-900">{pendingCount} Pending Confirmations</p>
                <p className="text-xs text-amber-700/80">Tap to confirm now</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-600" />
          </div>
        )}

        {/* Main toggle */}
        <div className="flex items-center justify-between py-2 border-b border-amber-100/50">
          <Label htmlFor="reminder-toggle" className="flex items-center gap-2 cursor-pointer">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">Enable daily reminders</span>
          </Label>
          <Switch
            id="reminder-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500"
          />
        </div>

        {/* Reminder time options */}
        {isEnabled && (
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Remind me at
            </Label>
            <RadioGroup 
              value={reminderTime} 
              onValueChange={(v) => setReminderTime(v as typeof reminderTime)}
              className="space-y-2"
            >
              <div className={cn(
                "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                reminderTime === 'end_of_day' 
                  ? "border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm" 
                  : "border-transparent bg-muted/30 hover:bg-muted/50"
              )}>
                <RadioGroupItem value="end_of_day" id="end_of_day" className="border-amber-400 text-amber-600" />
                <div className="flex-1">
                  <Label htmlFor="end_of_day" className="text-sm font-medium cursor-pointer">End of school day</Label>
                  <p className="text-xs text-muted-foreground">5:00 PM - Before you leave</p>
                </div>
                {reminderTime === 'end_of_day' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              
              <div className={cn(
                "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                reminderTime === 'next_morning' 
                  ? "border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm" 
                  : "border-transparent bg-muted/30 hover:bg-muted/50"
              )}>
                <RadioGroupItem value="next_morning" id="next_morning" className="border-amber-400 text-amber-600" />
                <div className="flex-1">
                  <Label htmlFor="next_morning" className="text-sm font-medium cursor-pointer">Next morning</Label>
                  <p className="text-xs text-muted-foreground">7:30 AM - Start your day informed</p>
                </div>
                {reminderTime === 'next_morning' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              
              <div className={cn(
                "flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                reminderTime === 'custom' 
                  ? "border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm" 
                  : "border-transparent bg-muted/30 hover:bg-muted/50"
              )}>
                <RadioGroupItem value="custom" id="custom" className="border-amber-400 text-amber-600" />
                <div className="flex-1">
                  <Label htmlFor="custom" className="text-sm font-medium cursor-pointer">Both times</Label>
                  <p className="text-xs text-muted-foreground">5:00 PM and 7:30 AM next day</p>
                </div>
                {reminderTime === 'custom' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Push notification toggle */}
        {isEnabled && (
          <div className="flex items-center justify-between py-3 px-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                pushEnabled ? "bg-teal-100 text-teal-600" : "bg-muted text-muted-foreground"
              )}>
                {pushEnabled ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </div>
              <div>
                <Label htmlFor="push-reminder" className="text-sm font-medium cursor-pointer">
                  Push notifications
                </Label>
                <p className="text-xs text-muted-foreground">Receive on phone even when app is closed</p>
              </div>
            </div>
            <Switch
              id="push-reminder"
              checked={pushEnabled}
              onCheckedChange={setPushEnabled}
            />
          </div>
        )}

        {/* Info text */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100/50">
          <Calendar className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
          <p className="text-xs text-teal-800 leading-relaxed">
            <span className="font-medium">Pro tip:</span> Confirming classes regularly helps track syllabus progress accurately and generates better insights for academic planning.
          </p>
        </div>

        {/* Quick confirm button */}
        {pendingCount > 0 && (
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 border-0"
            onClick={onNavigateToConfirm}
          >
            <ListChecks className="w-4 h-4 mr-2" />
            Confirm {pendingCount} Pending Classes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};