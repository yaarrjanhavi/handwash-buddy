import { format } from "date-fns";
import { CheckCircle2, Clock, Activity } from "lucide-react";

interface HandwashSession {
  id: string;
  duration_seconds: number;
  completion_score: number;
  completed_at: string;
  gestures_completed: number;
}

interface HandwashLogProps {
  sessions: HandwashSession[];
}

export function HandwashLog({ sessions }: HandwashLogProps) {
  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {format(new Date(session.completed_at), "MMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(session.completed_at), "h:mm a")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-right">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {session.gestures_completed}/6 gestures
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {session.duration_seconds}s
              </span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                session.completion_score >= 90
                  ? "bg-success/20 text-success"
                  : session.completion_score >= 70
                  ? "bg-warning/20 text-warning"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {session.completion_score}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
