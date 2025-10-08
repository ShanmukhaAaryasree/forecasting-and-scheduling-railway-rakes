import { MetricCard } from "@/components/metric-card";
import { RakeCard } from "@/components/rake-card";
import { TrainCard } from "@/components/train-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Package, TrendingDown, Clock, Cloud, Calendar, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Rake, Train as TrainType, WeatherCondition, Delay } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: rakes, isLoading: rakesLoading } = useQuery<Rake[]>({
    queryKey: ["/api/rakes"],
  });

  const { data: trains, isLoading: trainsLoading } = useQuery<TrainType[]>({
    queryKey: ["/api/trains"],
  });

  const { data: weather, isLoading: weatherLoading } = useQuery<WeatherCondition[]>({
    queryKey: ["/api/weather"],
  });

  const { data: delays, isLoading: delaysLoading } = useQuery<Delay[]>({
    queryKey: ["/api/delays/active"],
  });

  const { data: stats } = useQuery<{
    totalRakes: number;
    emptyRakes: number;
    onTimePercentage: number;
    activeDelays: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const activeTrain = trains?.filter(t => t.status !== "cancelled") || [];
  const emptyRakes = rakes?.filter(r => !r.isLoaded) || [];

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Real-time railway operations overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Rakes"
          value={stats?.totalRakes || 0}
          icon={Package}
          testId="metric-total-rakes"
        />
        <MetricCard
          title="Empty Movements"
          value={stats?.emptyRakes || 0}
          icon={TrendingDown}
          trend={{ value: -12.5, isPositive: true }}
          testId="metric-empty-rakes"
        />
        <MetricCard
          title="On-Time Performance"
          value={stats?.onTimePercentage || 0}
          icon={Clock}
          suffix="%"
          trend={{ value: 3.2, isPositive: true }}
          testId="metric-on-time"
        />
        <MetricCard
          title="Active Delays"
          value={stats?.activeDelays || 0}
          icon={AlertTriangle}
          testId="metric-active-delays"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-active-trains">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5 text-primary" />
                Active Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trainsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted/30 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : activeTrain.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {activeTrain.slice(0, 4).map((train) => (
                    <TrainCard key={train.id} train={train} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No active trains</p>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-recent-delays">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                Recent Delays
              </CardTitle>
            </CardHeader>
            <CardContent>
              {delaysLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted/30 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : delays && delays.length > 0 ? (
                <div className="space-y-3">
                  {delays.slice(0, 5).map((delay) => (
                    <div
                      key={delay.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                      data-testid={`delay-item-${delay.id}`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium font-mono">{delay.trainId}</p>
                        <p className="text-xs text-muted-foreground">{delay.reason}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            delay.impactLevel === "high"
                              ? "bg-status-critical/20 text-status-critical border-status-critical/30"
                              : "bg-status-warning/20 text-status-warning border-status-warning/30"
                          }
                        >
                          {delay.delayMinutes} min
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(delay.reportedAt), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent delays</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card data-testid="card-weather">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-status-weatherAlert" />
                Weather Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-muted/30 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : weather && weather.length > 0 ? (
                <div className="space-y-3">
                  {weather.slice(0, 3).map((w) => (
                    <div
                      key={w.id}
                      className="p-3 bg-muted/30 rounded-md space-y-2"
                      data-testid={`weather-item-${w.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{w.location}</p>
                        <Badge
                          variant="outline"
                          className={
                            w.severity === "high"
                              ? "bg-status-critical/20 text-status-critical border-status-critical/30"
                              : w.severity === "medium"
                              ? "bg-status-warning/20 text-status-warning border-status-warning/30"
                              : "bg-status-success/20 text-status-success border-status-success/30"
                          }
                        >
                          {w.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{w.condition}</p>
                      <p className="text-xs text-muted-foreground">{w.impactOnScheduling}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No weather alerts</p>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-empty-rakes">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-status-emptyRake" />
                Empty Rakes ({emptyRakes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rakesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted/30 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : emptyRakes.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {emptyRakes.map((rake) => (
                    <div
                      key={rake.id}
                      className="p-3 bg-muted/30 rounded-md"
                      data-testid={`empty-rake-${rake.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-mono font-semibold text-sm">{rake.rakeNumber}</p>
                        <Badge variant="outline" className="bg-status-emptyRake/20 text-status-emptyRake border-status-emptyRake/30">
                          Empty
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{rake.currentLocation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">All rakes assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
