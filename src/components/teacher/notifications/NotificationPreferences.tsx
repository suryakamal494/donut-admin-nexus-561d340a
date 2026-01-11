/**
 * Notification Preferences Component
 * Allows teachers to configure which notification types they receive
 */

import { useState } from "react";
import { 
  Calendar, 
  GraduationCap, 
  MessageSquare, 
  Settings2, 
  Bell, 
  BellRing,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useNotificationPreferences, type NotificationPreference } from "@/hooks/useNotificationPreferences";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const categoryConfig = {
  schedule: {
    label: 'Schedule',
    icon: Calendar,
    color: 'text-blue-600 bg-blue-100',
  },
  academic: {
    label: 'Academic',
    icon: GraduationCap,
    color: 'text-emerald-600 bg-emerald-100',
  },
  communication: {
    label: 'Communication',
    icon: MessageSquare,
    color: 'text-purple-600 bg-purple-100',
  },
  system: {
    label: 'System',
    icon: Settings2,
    color: 'text-slate-600 bg-slate-100',
  },
};

interface PreferenceItemProps {
  preference: NotificationPreference;
  onToggleEnabled: (id: string) => void;
  onTogglePush: (id: string) => void;
  pushSupported: boolean;
}

const PreferenceItem = ({ 
  preference, 
  onToggleEnabled, 
  onTogglePush,
  pushSupported 
}: PreferenceItemProps) => {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <Label 
          htmlFor={`pref-${preference.id}`}
          className="text-sm font-medium cursor-pointer"
        >
          {preference.label}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {preference.description}
        </p>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        {/* Push notification toggle (only if in-app is enabled) */}
        {pushSupported && preference.enabled && (
          <button
            onClick={() => onTogglePush(preference.id)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              preference.pushEnabled 
                ? "bg-teal-100 text-teal-600" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            title={preference.pushEnabled ? "Push notifications on" : "Push notifications off"}
          >
            {preference.pushEnabled ? (
              <BellRing className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </button>
        )}
        
        {/* In-app toggle */}
        <Switch
          id={`pref-${preference.id}`}
          checked={preference.enabled}
          onCheckedChange={() => onToggleEnabled(preference.id)}
        />
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: NotificationPreference['category'];
  preferences: NotificationPreference[];
  isEnabled: boolean;
  onToggleEnabled: (id: string) => void;
  onTogglePush: (id: string) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  pushSupported: boolean;
}

const CategorySection = ({
  category,
  preferences,
  isEnabled,
  onToggleEnabled,
  onTogglePush,
  onEnableAll,
  onDisableAll,
  pushSupported,
}: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  const enabledCount = preferences.filter(p => p.enabled).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", config.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-left">
              <span className="font-medium text-sm">{config.label}</span>
              <Badge 
                variant="secondary" 
                className="ml-2 text-[10px] h-5 px-1.5"
              >
                {enabledCount}/{preferences.length}
              </Badge>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="mt-2 px-1">
          {/* Quick toggle all */}
          <div className="flex items-center justify-end gap-2 pb-2 border-b border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={isEnabled ? onDisableAll : onEnableAll}
            >
              {isEnabled ? 'Disable all' : 'Enable all'}
            </Button>
          </div>
          
          {/* Individual preferences */}
          {preferences.map(pref => (
            <PreferenceItem
              key={pref.id}
              preference={pref}
              onToggleEnabled={onToggleEnabled}
              onTogglePush={onTogglePush}
              pushSupported={pushSupported}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface NotificationPreferencesProps {
  className?: string;
}

export const NotificationPreferences = ({ className }: NotificationPreferencesProps) => {
  const {
    preferences,
    isLoading,
    toggleEnabled,
    togglePushEnabled,
    enableCategory,
    disableCategory,
    getByCategory,
    isCategoryEnabled,
    resetToDefaults,
  } = useNotificationPreferences();

  const { isSubscribed, isSupported } = usePushNotifications();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories: NotificationPreference['category'][] = ['schedule', 'academic', 'communication', 'system'];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Choose which notifications you want to receive
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={resetToDefaults}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Switch className="scale-75" checked disabled />
            <span>In-app</span>
          </div>
          {isSupported && isSubscribed && (
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-teal-100">
                <BellRing className="h-3 w-3 text-teal-600" />
              </div>
              <span>Push</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {categories.map(category => (
          <CategorySection
            key={category}
            category={category}
            preferences={getByCategory(category)}
            isEnabled={isCategoryEnabled(category)}
            onToggleEnabled={toggleEnabled}
            onTogglePush={togglePushEnabled}
            onEnableAll={() => enableCategory(category)}
            onDisableAll={() => disableCategory(category)}
            pushSupported={isSupported && isSubscribed}
          />
        ))}
      </CardContent>
    </Card>
  );
};
