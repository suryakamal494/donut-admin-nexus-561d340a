/**
 * Push Notification Settings Component
 * Allows teachers to manage their push notification preferences
 */

import { Bell, BellOff, BellRing, TestTube2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

interface PushNotificationSettingsProps {
  className?: string;
}

export const PushNotificationSettings = ({ className }: PushNotificationSettingsProps) => {
  const { 
    permission, 
    isSubscribed, 
    isLoading, 
    isSupported, 
    subscribe, 
    unsubscribe,
    sendTestNotification 
  } = usePushNotifications();

  const getStatusBadge = () => {
    if (!isSupported) {
      return <Badge variant="secondary" className="bg-slate-100 text-slate-600">Not Supported</Badge>;
    }
    if (permission === 'denied') {
      return <Badge variant="destructive">Blocked</Badge>;
    }
    if (isSubscribed) {
      return <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>;
    }
    return <Badge variant="secondary">Disabled</Badge>;
  };

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isSubscribed 
                ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white" 
                : "bg-slate-100 text-slate-500"
            )}>
              {isSubscribed ? <BellRing className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-base">Push Notifications</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Receive alerts even when the app is closed
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Unsupported browser warning */}
        {!isSupported && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              Push notifications are not supported in this browser. Try using Chrome, Firefox, or Edge.
            </p>
          </div>
        )}

        {/* Permission denied warning */}
        {permission === 'denied' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div className="text-xs text-red-800">
              <p className="font-medium">Notifications Blocked</p>
              <p className="mt-0.5">Please enable notifications in your browser settings to receive alerts.</p>
            </div>
          </div>
        )}

        {/* Main toggle */}
        {isSupported && permission !== 'denied' && (
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="push-toggle" className="flex items-center gap-2 cursor-pointer">
              <Bell className="h-4 w-4 text-slate-500" />
              <span className="text-sm">Enable push notifications</span>
            </Label>
            <Switch
              id="push-toggle"
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Test notification button */}
        {isSubscribed && (
          <Button
            variant="outline"
            size="sm"
            onClick={sendTestNotification}
            className="w-full"
          >
            <TestTube2 className="h-4 w-4 mr-2" />
            Send Test Notification
          </Button>
        )}

        {/* Info text */}
        <p className="text-xs text-slate-500 leading-relaxed">
          You'll receive notifications for schedule changes, student submissions, 
          assignment deadlines, and important announcements from your institute.
        </p>
      </CardContent>
    </Card>
  );
};
