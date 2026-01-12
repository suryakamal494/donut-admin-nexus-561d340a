import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { PendingConfirmation } from "@/types/academicSchedule";
import { SubjectProgressInfo } from "./types";

interface PendingConfirmationsSectionProps {
  pendingConfirmations: PendingConfirmation[];
  subjects: SubjectProgressInfo[];
}

export function PendingConfirmationsSection({
  pendingConfirmations,
  subjects,
}: PendingConfirmationsSectionProps) {
  const pendingGrouped = useMemo(() => {
    const critical = pendingConfirmations.filter(p => p.daysOverdue >= 3);
    const overdue = pendingConfirmations.filter(p => p.daysOverdue > 0 && p.daysOverdue < 3);
    const today = pendingConfirmations.filter(p => p.daysOverdue === 0);
    return { critical, overdue, today };
  }, [pendingConfirmations]);

  const totalLostDays = subjects.reduce((sum, s) => sum + s.lostDays, 0);

  return (
    <>
      {/* Pending Confirmations List */}
      {pendingConfirmations.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
              <Clock className="w-5 h-5" />
              Pending Confirmations ({pendingConfirmations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Critical */}
            {pendingGrouped.critical.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical ({pendingGrouped.critical.length})
                </h4>
                {pendingGrouped.critical.map((item) => (
                  <PendingConfirmationCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Overdue */}
            {pendingGrouped.overdue.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-amber-600">
                  Overdue ({pendingGrouped.overdue.length})
                </h4>
                {pendingGrouped.overdue.map((item) => (
                  <PendingConfirmationCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Today */}
            {pendingGrouped.today.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Due Today ({pendingGrouped.today.length})
                </h4>
                {pendingGrouped.today.map((item) => (
                  <PendingConfirmationCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Status Summary */}
      <Card className={cn(
        "border",
        pendingConfirmations.length === 0 ? "border-emerald-200 bg-emerald-50/30" : "border-muted"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {pendingConfirmations.length === 0 ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-700">Confirmations Complete</p>
                    <p className="text-xs text-muted-foreground">All teaching sessions are confirmed</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-700">{pendingConfirmations.length} Pending Confirmation{pendingConfirmations.length > 1 ? 's' : ''}</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingGrouped.critical.length > 0 && `${pendingGrouped.critical.length} critical • `}
                      Review and confirm teaching sessions
                    </p>
                  </div>
                </>
              )}
            </div>
            {subjects.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Lost Days</p>
                <p className="text-lg font-semibold">{totalLostDays}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function PendingConfirmationCard({ item }: { item: PendingConfirmation }) {
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short' 
  });
  
  return (
    <div className={cn(
      "p-3 rounded-lg border flex items-center justify-between gap-3",
      item.daysOverdue >= 3 ? "bg-red-50 border-red-200" :
      item.daysOverdue > 0 ? "bg-amber-50 border-amber-200" : "bg-muted/30"
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{item.subjectName}</p>
          <p className="text-xs text-muted-foreground">
            {item.teacherName} • {formattedDate}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        {item.daysOverdue > 0 && (
          <Badge variant="outline" className={cn(
            "text-xs",
            item.daysOverdue >= 3 ? "text-red-600 border-red-300" : "text-amber-600 border-amber-300"
          )}>
            {item.daysOverdue}d overdue
          </Badge>
        )}
        <Button size="sm" className="ml-2 h-7">
          Confirm
        </Button>
      </div>
    </div>
  );
}
