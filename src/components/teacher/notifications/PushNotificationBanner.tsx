/**
 * Push Notification Permission Banner
 * Mobile-first banner prompting teachers to enable push notifications
 */

import { Bell, BellOff, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PushNotificationBannerProps {
  className?: string;
}

export const PushNotificationBanner = ({ className }: PushNotificationBannerProps) => {
  const { permission, isSubscribed, isLoading, isSupported, subscribe } = usePushNotifications();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if already subscribed, denied, unsupported, or dismissed
  if (!isSupported || isSubscribed || permission === 'denied' || isDismissed) {
    return null;
  }

  return (
    <Card className={cn(
      "relative overflow-hidden border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50",
      "p-4 md:p-5",
      className
    )}>
      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-teal-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-teal-600" />
      </button>

      <div className="flex items-start gap-3 md:gap-4">
        {/* Icon */}
        <div className="shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-semibold text-slate-900 text-sm md:text-base">
            Stay Updated
          </h3>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5 line-clamp-2">
            Get instant alerts for schedule changes, student submissions, and important announcements
          </p>

          {/* Action button */}
          <Button
            onClick={subscribe}
            disabled={isLoading}
            size="sm"
            className="mt-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-9 px-4"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enabling...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Enable Notifications
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-xl" />
    </Card>
  );
};
