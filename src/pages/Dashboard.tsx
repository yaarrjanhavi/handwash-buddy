import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, TrendingUp, Clock, CheckCircle2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandwashLog } from "@/components/HandwashLog";
import { StatsCard } from "@/components/StatsCard";
import { useToast } from "@/hooks/use-toast";

interface HandwashSession {
  id: string;
  duration_seconds: number;
  completion_score: number;
  completed_at: string;
  gestures_completed: number;
}

interface DailyStats {
  total_washes: number;
  avg_score: number;
  avg_duration: number;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<HandwashSession[]>([]);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Load recent sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("handwash_sessions")
        .select("*")
        .order("completed_at", { ascending: false })
        .limit(10);

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // Load today's stats
      const { data: statsData, error: statsError } = await supabase
        .rpc("get_today_handwash_stats", { target_user_id: user.id });

      if (statsError) throw statsError;
      
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">HandWashMonitor</h1>
              <p className="text-sm text-muted-foreground mt-1">WHO-Standard Hand Hygiene Tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/watch">
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity">
                  Open Watch Simulator
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Today's Washes"
            value={stats?.total_washes || 0}
            icon={Activity}
            variant="primary"
          />
          <StatsCard
            title="Avg Score"
            value={`${stats?.avg_score || 0}%`}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Avg Duration"
            value={`${stats?.avg_duration || 0}s`}
            icon={Clock}
            variant="accent"
          />
          <StatsCard
            title="Compliance"
            value={stats?.total_washes >= 6 ? "100%" : `${Math.round((stats?.total_washes || 0) / 6 * 100)}%`}
            icon={TrendingUp}
            variant="default"
          />
        </div>

        {/* Recent Sessions */}
        <Card className="p-6 shadow-[var(--shadow-elevated)]">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Recent Hand-Wash Sessions</h2>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No hand-wash sessions recorded yet</p>
              <Link to="/watch">
                <Button variant="outline">Start Your First Session</Button>
              </Link>
            </div>
          ) : (
            <HandwashLog sessions={sessions} />
          )}
        </Card>
      </main>
    </div>
  );
}
